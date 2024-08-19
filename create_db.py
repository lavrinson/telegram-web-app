import sqlite3

def create_db():
    conn = sqlite3.connect('game_data.db')
    return conn

def create_table(conn):
    conn.execute('''CREATE TABLE IF NOT EXISTS users (
                        user_id INTEGER PRIMARY KEY,
                        coin_count INTEGER NOT NULL,
                        energy_count INTEGER NOT NULL,
                        max_energy INTEGER NOT NULL,
                        recoveries_left INTEGER NOT NULL,
                        username TEXT,
                        avatar_url TEXT
                    );''')
    conn.commit()

if __name__ == "__main__":
    conn = create_db()
    create_table(conn)
    conn.close()
