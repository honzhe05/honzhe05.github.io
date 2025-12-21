import json
from datetime import datetime
import subprocess

FILE = "../config/version_info.json"

with open(FILE, "r", encoding="utf-8") as f:
    data = json.load(f)
    version = data.get("version", 0) + 1

now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
data = {
    "last_update": now,
    "version": version
}

with open(FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("JSON modification complete")

try:
    subprocess.run(["git", "add", "-A"])
    subprocess.run(["git", "commit", "-m", f"Auto update time: {now}"], check=True)
    subprocess.run(["git", "push"], check=True)

    print("Successfully pushed to Github")
except subprocess.CalledProcessError as e:
    print("Fail to push files")
    print("Error output: ", e)