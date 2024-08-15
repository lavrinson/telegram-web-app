from aiogram import Bot, Dispatcher, types
from aiogram.utils import executor

bot = Bot(token='YOUR_BOT_TOKEN_HERE')
dp = Dispatcher(bot)

@dp.message_handler(commands=['start'])
async def start_command(message: types.Message):
    # Создание кнопки для открытия Web App
    web_app = types.WebAppInfo(url='https://your-username.github.io/telegram-web-app/')  # URL вашего веб-приложения
    keyboard = types.InlineKeyboardMarkup()
    web_app_button = types.InlineKeyboardButton(text="Open Web App", web_app=web_app)
    keyboard.add(web_app_button)

    await message.answer("Click the button below to open the Web App", reply_markup=keyboard)

if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)



