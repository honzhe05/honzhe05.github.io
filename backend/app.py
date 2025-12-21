from flask import Flask, jsonify
from flask import request
from dotenv import load_dotenv
import hashlib
import sqlite3
from flask_cors import CORS
import json
import os


app = Flask(__name__)
CORS(app)


load_dotenv()
admin_password = os.getenv("ADMIN_PASSWORD")


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()
    

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
 
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
    """)
  
    cur.execute(
        "INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)",
        ("admin",
            hash_password(admin_password)
        )
    )
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
    

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username=? AND password=?", (username, hash_password(password)))
    user = cur.fetchone()
    conn.close()

    if user:
        return jsonify({"success": True})
    return jsonify({"success": False}), 401


@app.route("/api/add_store", methods=["POST"])
def add_store():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username=? AND password=?", (username, hash_password(password)))
    user = cur.fetchone()
    if not user:
        conn.close()
        return jsonify({"success": False, "message": "Unauthorized"}), 403

    category = data.get("category")
    name = data.get("name")
    map_url = data.get("map")
    cur.execute("INSERT INTO stores (category, name, map) VALUES (?, ?, ?)", (category, name, map_url))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Store added"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)