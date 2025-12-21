import json
import sqlite3

with open("../stores.json", "r", encoding="utf-8") as f:
    data = json.load(f)

conn = sqlite3.connect("stores.db")
cursor = conn.cursor()

cursor.execute("DELETE FROM stores")
cursor.execute("DELETE FROM sqlite_sequence WHERE name='stores'")

for category, stores in data.items():
    for store in stores:
        cursor.execute(
            "INSERT INTO stores (category, name, map) VALUES (?, ?, ?)",
            (category, store["name"], store.get("map"))
        )

conn.commit()
conn.close()

print("✅ stores.json 已成功匯入 stores.db")