from flask import Flask, jsonify
import sqlite3
import os

app = Flask(__name__)

def get_db():
    conn = sqlite3.connect("stores.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/api/stores")
def get_stores():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT category, name, map FROM stores")
    rows = cur.fetchall()
    conn.close()

    data = []
    for row in rows:
        data.append({
            "category": row["category"],
            "name": row["name"],
            "map": row["map"]
        })

    return jsonify(data)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)