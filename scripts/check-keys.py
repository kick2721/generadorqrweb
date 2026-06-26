with open("src/lib/i18n.ts", "r", encoding="utf-8") as f:
    content = f.read()

codes = ["ar", "de", "el", "en", "es", "fr", "hi", "id", "it", "ja", "ko", "nl", "pl", "pt", "ro", "ru", "sv", "th", "tr", "uk", "vi", "zh-CN", "zh-TW"]

for code in codes:
    idx = content.index(code + ": {")
    block = content[idx:idx+1500]
    has_zh = code in ["zh-CN", "zh-TW"]
    has_it = "dashboardSearch" in block
    print(f"{code}: {'OK' if has_it else 'MISSING'}")
