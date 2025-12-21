from flask import Flask, jsonify
import sqlite3
from flask_cors import CORS
import json
import os


app = Flask(__name__)
CORS(app)


def init_db():
    conn = sqlite3.connect("stores.db")
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS stores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT,
        name TEXT,
        map TEXT
    )
    """)
    conn.commit()
    conn.close()
    
    
def import_json_if_empty():
    conn = sqlite3.connect("stores.db")
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM stores")
    count = cur.fetchone()[0]

    if count > 0:
        conn.close()
        return

    with open("stores.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    for category, stores in data.items():
        for store in stores:
            cur.execute(
                "INSERT INTO stores (category, name, map) VALUES (?, ?, ?)",
                (category, store["name"], store.get("map"))
            )

    conn.commit()
    conn.close()
    print("✅ stores.json imported into DB")


def get_db():
    conn = sqlite3.connect("stores.db")
    conn.row_factory = sqlite3.Row
    return conn


init_db()
import_json_if_empty()
@app.route("/api/stores")
def get_stores():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT category, name, map FROM stores")
    rows = cur.fetchall()
    conn.close()

    grouped = {}
    for row in rows:
        cat = row["category"]
        grouped.setdefault(cat, []).append({
            "name": row["name"],
            "map": row["map"]
        })

    return jsonify(grouped)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)