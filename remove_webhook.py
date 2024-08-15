import asyncio
from aiogram import Bot

TOKEN = '7097297999:AAFDjXRB2e05at2kvvnO6RVp--Zl6f5gLMM'  # Замените на ваш токен бота


async def remove_webhook():
    bot = Bot(token=TOKEN)

    try:
        await bot.delete_webhook()
        print("Webhook removed")
    finally:
        # Закрываем сессию вручную, чтобы избежать утечек ресурсов
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(remove_webhook())
