import sqlite3

# Подключение к базе данных (если базы данных не существует, она будет создана)
conn = sqlite3.connect('game_data.db')
cursor = conn.cursor()

# Создание таблицы users
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        coin_count INTEGER NOT NULL,
        energy_count INTEGER NOT NULL,
        max_energy INTEGER NOT NULL,
        recoveries_left INTEGER NOT NULL
    );
''')

# Сохранение изменений и закрытие соединения
conn.commit()
conn.close()

print("База данных и таблица users успешно созданы.")
