import asyncio
from flask import Flask, request, jsonify, send_from_directory
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.client.session.aiohttp import AiohttpSession
from threading import Thread
from waitress import serve
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO)

# Конфигурация бота
BOT_TOKEN = '7097297999:AAFDjXRB2e05at2kvvnO6RVp--Zl6f5gLMM'  # Укажите ваш токен бота
WEB_APP_URL = 'https://lavrinson.github.io/telegram-web-app/'  # URL вашего веб-приложения

# Инициализация Flask
app = Flask(__name__)

# Инициализация бота
bot = Bot(token=BOT_TOKEN, session=AiohttpSession())

# Инициализация диспетчера
dp = Dispatcher()

# Flask route для отображения страницы WebApp
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')  # Отправляем index.html из корневой папки

# Flask route для обслуживания статических файлов
@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory('.', path)

# Flask route для обработки авторизации через Telegram
@app.route('/auth/telegram/callback', methods=['POST'])
def telegram_auth_callback():
    user_data = request.json
    user_id = user_data['id']

    username = user_data.get('username', 'No Name')
    avatar_url = user_data.get('photo_url', None)

    return jsonify({
        'coin_count': 1500,
        'energy_count': 2000,
        'max_energy': 2000,
        'recoveries_left': 20,
        'username': username,
        'avatar_url': avatar_url
    })

# Обработчик команды /start
@dp.message(Command(commands=['start']))
async def start_command(message: types.Message):
    user = message.from_user
    user_id = user.id
    username = user.username or user.first_name or "No Name"

    web_app = WebAppInfo(url=WEB_APP_URL)
    keyboard_markup = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="Open Web App", web_app=web_app)]
    ])

    await message.answer(f"Hello, {username}! Click the button below to open the Web App", reply_markup=keyboard_markup)

# Главная асинхронная функция запуска бота
async def main():
    try:
        await bot.delete_webhook(drop_pending_updates=True)
        logging.info("Starting bot polling...")
        await dp.start_polling(bot)
    finally:
        await bot.session.close()

# Запуск сервера Flask
def run_flask():
    logging.info("Starting Flask server...")
    serve(app, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    try:
        flask_thread = Thread(target=run_flask)
        flask_thread.start()
        asyncio.run(main())
    except KeyboardInterrupt:
        logging.info("Shutting down...")
    finally:
        logging.info("Cleanup and shutdown complete.")
