import json
import os

# قائمة الـ 13 طبقة
files = [
    "data/water/rivers.json",
    "data/water/water-bodies.json", 
    "data/water/ponds.json",
    "data/land/dunes.json",
    "data/land/land-use.json",
    "data/climate/precipitation.json",
    "data/climate/temperature.json",
    "data/climate/drought.json",
    "data/vegetation/vegetation.json",
    "data/vegetation/palm.json",
    "data/pollution/pollution.json",
    "data/settlements/settlements.json"
]

print("=== اختبار منظومة جنوب العراق - هيثم حاتم ===\n")

ok = 0
fail = 0

for path in files:
    if not os.path.exists(path):
        print(f"❌ مفقود: {path}")
        fail += 1
        continue
    
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✅ {path} - شغال - {len(str(data))} حرف")
        ok += 1
    except Exception as e:
        print(f"❌ {path} - خطأ JSON: {e}")
        fail += 1

print(f"\n=== النتيجة: {ok}/12 ملف شغال ===")

if fail == 0:
    print("🎉 كلشي تمام! المنظومة جاهزة 100%")
else:
    print(f"⚠️ عندك {fail} ملفات تحتاج تصليح")