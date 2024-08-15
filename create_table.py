import sqlite3

def create_users_table():
    try:
        conn = sqlite3.connect('game_data.db')
        conn.execute('''CREATE TABLE IF NOT EXISTS users (
                            user_id INTEGER PRIMARY KEY,
                            coin_count INTEGER NOT NULL,
                            energy_count INTEGER NOT NULL,
                            max_energy INTEGER NOT NULL,
                            recoveries_left INTEGER NOT NULL
                        );''')
        conn.commit()
        conn.close()
        print("Таблица users успешно создана.")
    except sqlite3.Error as e:
        print(f"Ошибка создания таблицы: {e}")

if __name__ == '__main__':
    create_users_table()
