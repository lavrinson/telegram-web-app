import asyncio
from aiogram import Bot

# Ваш токен бота
BOT_TOKEN = '7097297999:AAFDjXRB2e05at2kvvnO6RVp--Zl6f5gLMM'

async def remove_webhook():
    bot = Bot(token=BOT_TOKEN)
    await bot.delete_webhook(drop_pending_updates=True)
    print("Webhook успешно удален.")
    await bot.session.close()

if __name__ == '__main__':
    asyncio.run(remove_webhook())
