import json
from datetime import datetime

now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

data = {
    "last_update": now
}

with open("update_time.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ JSON 已更新")
