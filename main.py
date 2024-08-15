import sqlite3
import asyncio
from flask import Flask, request, jsonify
from aiogram import Bot, Dispatcher, types
from aiogram.dispatcher.router import Router
from aiogram.filters import Command
from aiogram.utils.keyboard import InlineKeyboardBuilder
from threading import Thread
from waitress import serve

app = Flask(__name__)

# Конфигурация бота
BOT_TOKEN = '7097297999:AAFDjXRB2e05at2kvvnO6RVp--Zl6f5gLMM'
WEB_APP_URL = 'https://lavrinson.github.io/telegram-web-app/'

# Инициализация бота
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()
router = Router()

# Подключение к базе данных SQLite
def get_db_connection():
    conn = sqlite3.connect('game_data.db')
    conn.execute('''CREATE TABLE IF NOT EXISTS users (
                        user_id INTEGER PRIMARY KEY,
                        coin_count INTEGER NOT NULL,
                        energy_count INTEGER NOT NULL,
                        max_energy INTEGER NOT NULL,
                        recoveries_left INTEGER NOT NULL,
                        username TEXT,
                        avatar_url TEXT
                    );''')
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

# Функция для получения URL аватарки пользователя
async def get_user_avatar(user: types.User):
    photos = await bot.get_user_profile_photos(user.id, limit=1)
    if photos.photos:
        file_id = photos.photos[0][-1].file_id
        file = await bot.get_file(file_id)
        return bot.get_file_url(file.file_path)
    return None

# Flask route для обработки авторизации через Telegram
@app.route('/auth/telegram/callback', methods=['POST'])
def telegram_auth_callback():
    user_data = request.json
    user_id = user_data['id']

    # Загрузка данных пользователя из базы данных
    user_info = load_user_data(user_id)
    if not user_info:
        user_info = {
            'coin_count': 1500,
            'energy_count': 2000,
            'max_energy': 2000,
            'recoveries_left': 20,
            'username': user_data.get('username', 'No Name'),
            'avatar_url': None
        }
        save_user_data(user_id, **user_info)

    return jsonify(user_info)

# Обработчик команды /start
@router.message(Command('start'))
async def start_command(message: types.Message):
    user = message.from_user
    user_id = user.id
    username = user.username or user.first_name or "No Name"
    avatar_url = await get_user_avatar(user)

    # Загружаем данные пользователя или создаем новые, если их нет
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
        save_user_data(user_id, **user_info)

    # Создание кнопки для открытия Web App
    web_app = types.WebAppInfo(url=WEB_APP_URL)
    keyboard = InlineKeyboardBuilder()
    keyboard.button(text="Open Web App", web_app=web_app)
    keyboard_markup = keyboard.as_markup()

    await message.answer(f"Hello, {username}! Click the button below to open the Web App", reply_markup=keyboard_markup)

# Обработчик команды /status
@router.message(Command('status'))
async def status_command(message: types.Message):
    user_id = message.from_user.id

    user_info = load_user_data(user_id)
    if user_info:
        text = (f"Your status:\n"
                f"Coins: {user_info['coin_count']}\n"
                f"Energy: {user_info['energy_count']} / {user_info['max_energy']}\n"
                f"Recoveries left: {user_info['recoveries_left']}\n"
                f"Username: {user_info['username']}")
        await message.answer(text)
        if user_info['avatar_url']:
            await message.answer_photo(user_info['avatar_url'])
    else:
        await message.answer("No data found for your user.")

# Обработчик команды /reset
@router.message(Command('reset'))
async def reset_command(message: types.Message):
    user_id = message.from_user.id

    # Сброс данных пользователя
    user_info = {
        'coin_count': 1500,
        'energy_count': 2000,
        'max_energy': 2000,
        'recoveries_left': 20,
        'username': message.from_user.username or message.from_user.first_name or "No Name",
        'avatar_url': await get_user_avatar(message.from_user)
    }
    save_user_data(user_id, **user_info)

    await message.answer("Your game progress has been reset.")

# Главная асинхронная функция запуска бота
async def main():
    dp.include_router(router)
    await dp.start_polling(bot)

# Запуск сервера Flask
def run_flask():
    serve(app, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    try:
        # Запуск Flask и aiogram бота в отдельных потоках
        flask_thread = Thread(target=run_flask)
        flask_thread.start()

        asyncio.run(main())
    except KeyboardInterrupt:
        print("Shutting down...")
    finally:
        print("Cleanup and shutdown complete.")
