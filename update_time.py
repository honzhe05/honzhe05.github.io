import json
from datetime import datetime
import subprocess

# 1️⃣ 先更新 JSON
now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
data = {
    "last_update": now
}

with open("update_time.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ JSON 已更新")

try:
    subprocess.run(["git", "add", "."], check=True)
    subprocess.run(["git", "commit", "-m", f"Auto update time: {now}"], check=True)
    subprocess.run(["git", "push"], check=True)

    print("Successfully pushed to Github")
except subprocess.CalledProcessError as e:
    print("Fail to push files")
    print("Error output: ", e)