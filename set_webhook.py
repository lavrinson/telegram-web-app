import asyncio
from aiogram import Bot

TOKEN = '7097297999:AAFDjXRB2e05at2kvvnO6RVp--Zl6f5gLMM'  # Замените на ваш токен бота
WEBHOOK_URL = 'https://lavrinson.github.io/telegram-web-app/telegram/callback'  # Замените на ваш URL


async def set_webhook():
    bot = Bot(token=TOKEN)

    try:
        webhook = await bot.set_webhook(WEBHOOK_URL)
        print(f"Webhook set: {webhook}")
    finally:
        # Закрываем сессию вручную, чтобы избежать утечек ресурсов
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(set_webhook())
