import sqlite3
import asyncio
from flask import Flask, request, jsonify
from aiogram import Bot, Dispatcher, types
from aiogram.dispatcher.router import Router
from aiogram.filters import Command
from aiogram.utils.keyboard import InlineKeyboardBuilder
from threading import Thread

app = Flask(__name__)

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
            'recoveries_left': 20
        }
        save_user_data(user_id, **user_info)

    return jsonify(user_info)

# Инициализация бота
bot = Bot(token='7097297999:AAFDjXRB2e05at2kvvnO6RVp--Zl6f5gLMM')
dp = Dispatcher()
router = Router()

# Подключение к базе данных
def get_db_connection():
    conn = sqlite3.connect('game_data.db')
    return conn

# Функция для загрузки данных пользователя
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
        }
    else:
        return None

# Функция для сохранения данных пользователя
def save_user_data(user_id, coin_count, energy_count, max_energy, recoveries_left):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO users (user_id, coin_count, energy_count, max_energy, recoveries_left)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            coin_count=excluded.coin_count,
            energy_count=excluded.energy_count,
            max_energy=excluded.max_energy,
            recoveries_left=excluded.recoveries_left
    ''', (user_id, coin_count, energy_count, max_energy, recoveries_left))

    conn.commit()
    conn.close()

@router.message(Command('start'))
async def start_command(message: types.Message):
    user_id = message.from_user.id

    # Загружаем данные пользователя или создаем новые, если их нет
    user_info = load_user_data(user_id)
    if not user_info:
        user_info = {
            'coin_count': 1500,
            'energy_count': 2000,
            'max_energy': 2000,
            'recoveries_left': 20
        }
        save_user_data(user_id, **user_info)

    # Создание кнопки для открытия Web App
    web_app = types.WebAppInfo(url='https://lavrinson.github.io/telegram-web-app/')
    keyboard = InlineKeyboardBuilder()
    keyboard.button(text="Open Web App", web_app=web_app)
    keyboard_markup = keyboard.as_markup()

    await message.answer("Click the button below to open the Web App", reply_markup=keyboard_markup)

@router.message(Command('status'))
async def status_command(message: types.Message):
    user_id = message.from_user.id

    user_info = load_user_data(user_id)
    if user_info:
        await message.answer(f"Your status:\nCoins: {user_info['coin_count']}\nEnergy: {user_info['energy_count']} / {user_info['max_energy']}\nRecoveries left: {user_info['recoveries_left']}")
    else:
        await message.answer("No data found for your user.")

@router.message(Command('reset'))
async def reset_command(message: types.Message):
    user_id = message.from_user.id

    # Сброс данных пользователя
    user_info = {
        'coin_count': 1500,
        'energy_count': 2000,
        'max_energy': 2000,
        'recoveries_left': 20
    }
    save_user_data(user_id, **user_info)

    await message.answer("Your game progress has been reset.")

async def main():
    dp.include_router(router)
    await dp.start_polling(bot)

def run_flask():
    app.run(debug=True, use_reloader=False)

if __name__ == '__main__':
    # Запуск Flask в отдельном потоке
    flask_thread = Thread(target=run_flask)
    flask_thread.start()

    # Запуск aiogram бота
    asyncio.run(main())
