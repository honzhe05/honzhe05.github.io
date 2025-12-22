from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor
import hashlib
import os

app = Flask(__name__)
CORS(app)

# 本地開發用（Render 會忽略 .env，改用 Environment）
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not set")
if not ADMIN_PASSWORD:
    raise ValueError("ADMIN_PASSWORD not set")

# ---------- utils ----------

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def get_db():
    return psycopg2.connect(
        DATABASE_URL,
        cursor_factory=RealDictCursor
    )

# ---------- init db ----------

def init_db():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        category TEXT NOT NULL,
        name TEXT NOT NULL,
        map TEXT
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    """)

    cur.execute("""
    INSERT INTO users (username, password)
    VALUES (%s, %s)
    ON CONFLICT (username) DO NOTHING
    """, ("admin", hash_password(ADMIN_PASSWORD)))

    conn.commit()
    conn.close()
    
def import_json_if_empty():
    conn = get_db()
    cur = conn.cursor()
    
    with open("stores.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    for category, stores in data.items():
        for store in stores:
            cur.execute(
                "INSERT INTO stores (category, name, map) VALUES (%s, %s, %s)",
                (category, store["name"], store.get("map"))
            )

    conn.commit()
    conn.close()
    print("✅ stores.json imported into PostgreSQL")

init_db()
import_json_if_empty()

# ---------- routes ----------

@app.route("/api/stores")
def get_stores():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT category, name, map FROM stores")
    rows = cur.fetchall()
    conn.close()

    grouped = {}
    for row in rows:
        grouped.setdefault(row["category"], []).append({
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
    cur.execute(
        "SELECT id FROM users WHERE username=%s AND password=%s",
        (username, hash_password(password))
    )
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

    # 驗證使用者
    cur.execute(
        "SELECT id FROM users WHERE username=%s AND password=%s",
        (username, hash_password(password))
    )
    user = cur.fetchone()

    if not user:
        conn.close()
        return jsonify({"success": False, "message": "Unauthorized"}), 403

    cur.execute(
        "INSERT INTO stores (category, name, map) VALUES (%s, %s, %s)",
        (data.get("category"), data.get("name"), data.get("map"))
    )

    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Store added"})

# ---------- main ----------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)