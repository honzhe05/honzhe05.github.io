import json
import urllib.parse

FILE = "../stores.json"

with open(FILE, "r", encoding="utf-8") as f:
    stores = json.load(f)

while True:
    print("可用分類：")
    for key in stores.keys():
        print("-", key)

    cat = input("請輸入分類：").strip()

    if cat not in stores:
        print("❌ 沒有這個分類")
        break

    name = input("請輸入店家名稱：").strip()

    map_url = "https://maps.google.com/?q=" + urllib.parse.quote(name)

    stores[cat].append({
        "name": name,
        "map": map_url
    })

    with open(FILE, "w", encoding="utf-8") as f:
        json.dump(stores, f, ensure_ascii=False, indent=2)

    print(f"✅ 已新增 {name} 到 {cat}")