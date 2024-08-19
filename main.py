import sqlite3
import asyncio
from flask import Flask, request, jsonify
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.client.session.aiohttp import AiohttpSession
from threading import Thread
from waitress import serve

# Конфигурация бота
BOT_TOKEN = '7097297999:AAFDjXRB2e05at2kvvnO6RVp--Zl6f5gLMM'  # Ваш токен
WEB_APP_URL = 'https://lavrinson.github.io/telegram-web-app/'  # URL вашего веб-приложения

# Инициализация Flask
app = Flask(__name__)

# Инициализация бота
bot = Bot(token=BOT_TOKEN, session=AiohttpSession())

# Инициализация диспетчера
dp = Dispatcher()

# Подключение к базе данных SQLite
def get_db_connection():
    conn = sqlite3.connect('game_data.db')
    return conn

# Загрузка данных пользователя из базы данных
def load_user_data(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
    user_data = cursor.fetchone()
    conn.close()

    if user_data:
        return {
            'coin_count': user_data[1],
            'energy_count': user_data[2],
            'max_energy': user_data[3],
            'recoveries_left': user_data[4],
            'username': user_data[5],
            'avatar_url': user_data[6],
        }
    else:
        return None

# Сохранение данных пользователя в базе данных
def save_user_data(user_id, coin_count, energy_count, max_energy, recoveries_left, username, avatar_url):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO users (user_id, coin_count, energy_count, max_energy, recoveries_left, username, avatar_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            coin_count=excluded.coin_count,
            energy_count=excluded.energy_count,
            max_energy=excluded.max_energy,
            recoveries_left=excluded.recoveries_left,
            username=excluded.username,
            avatar_url=excluded.avatar_url
    ''', (user_id, coin_count, energy_count, max_energy, recoveries_left, username, avatar_url))
    conn.commit()
    conn.close()

# Flask route для обработки авторизации через Telegram
@app.route('/auth/telegram/callback', methods=['POST'])
def telegram_auth_callback():
    user_data = request.json
    user_id = user_data['id']

    username = user_data.get('username', 'No Name')
    avatar_url = user_data.get('photo_url', None)

    user_info = load_user_data(user_id)
    if not user_info:
        user_info = {
            'coin_count': 1500,
            'energy_count': 2000,
            'max_energy': 2000,
            'recoveries_left': 20,
            'username': username,
            'avatar_url': avatar_url
        }
        save_user_data(
            user_id,
            user_info['coin_count'],
            user_info['energy_count'],
            user_info['max_energy'],
            user_info['recoveries_left'],
            user_info['username'],
            user_info['avatar_url']
        )
    else:
        user_info['username'] = username
        user_info['avatar_url'] = avatar_url
        save_user_data(
            user_id,
            user_info['coin_count'],
            user_info['energy_count'],
            user_info['max_energy'],
            user_info['recoveries_left'],
            user_info['username'],
            user_info['avatar_url']
        )

    return jsonify(user_info)

# Обработчик команды /start
@dp.message(Command(commands=['start']))
async def start_command(message: types.Message):
    user = message.from_user
    user_id = user.id
    username = user.username or user.first_name or "No Name"

    # Получаем аватар пользователя
    photos = await bot.get_user_profile_photos(user_id)
    avatar_url = photos.photos[0][0].file_id if photos.total_count > 0 else None

    user_info = load_user_data(user_id)
    if not user_info:
        user_info = {
            'coin_count': 1500,
            'energy_count': 2000,
            'max_energy': 2000,
            'recoveries_left': 20,
            'username': username,
            'avatar_url': avatar_url
        }
        save_user_data(
            user_id,
            user_info['coin_count'],
            user_info['energy_count'],
            user_info['max_energy'],
            user_info['recoveries_left'],
            user_info['username'],
            user_info['avatar_url']
        )

    # Создание кнопки для открытия Web App
    web_app = WebAppInfo(url=WEB_APP_URL)
    keyboard_markup = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="Open Web App", web_app=web_app)]
    ])

    await message.answer(f"Hello, {username}! Click the button below to open the Web App", reply_markup=keyboard_markup)

# Главная асинхронная функция запуска бота
async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

# Запуск сервера Flask
def run_flask():
    serve(app, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    try:
        flask_thread = Thread(target=run_flask)
        flask_thread.start()

        asyncio.run(main())
    except KeyboardInterrupt:
        print("Shutting down...")
    finally:
        print("Cleanup and shutdown complete.")
