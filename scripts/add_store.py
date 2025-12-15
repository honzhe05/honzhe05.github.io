import json

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
        exit()

    name = input("請輸入店家名稱：").strip()
    url = input("請輸入 Google Maps 網址：").strip()

    stores[cat].append({
        "name": name,
        "map": url
    })

    with open(FILE, "w", encoding="utf-8") as f:
        json.dump(stores, f, ensure_ascii=False, indent=2)

    print(f"✅ 已新增 {name} 到 {cat}")