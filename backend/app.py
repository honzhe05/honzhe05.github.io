from flask import Flask, jsonify
import sqlite3
from flask_cors import CORS


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


def get_db():
    conn = sqlite3.connect("stores.db")
    conn.row_factory = sqlite3.Row
    return conn


init_db()
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