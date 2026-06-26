import re

codes = ["ar", "de", "el", "en", "es", "fr", "hi", "id", "it", "ja", "ko", "nl", "pl", "pt", "ro", "ru", "sv", "th", "tr", "uk", "vi", "zh-CN", "zh-TW"]
vals = {
    "ar": "توزيع الساعات", "de": "Stundenverteilung", "el": "Κατανομή ωρών", "en": "Hour distribution",
    "es": "Distribución horaria", "fr": "Répartition horaire", "hi": "घंटे वितरण", "id": "Distribusi jam",
    "it": "Distribuzione oraria", "ja": "時間分布", "ko": "시간 분포", "nl": "Uurverdeling",
    "pl": "Rozkład godzin", "pt": "Distribuição horária", "ro": "Distribuția orară", "ru": "Распределение по часам",
    "sv": "Timfördelning", "th": "การกระจายชั่วโมง", "tr": "Saat dağılımı", "uk": "Розподіл за годинами",
    "vi": "Phân bố giờ", "zh-CN": "小时分布", "zh-TW": "小時分佈"
}

with open("src/lib/i18n.ts", "r", encoding="utf-8") as f:
    content = f.read()

for code in codes:
    insert = f'    analyticsHourDistribution: "{vals[code]}",'
    
    # Find block start
    block_start = content.find(f"  {code}: {{")
    if block_start < 0:
        print(f"Block not found: {code}")
        continue
    
    # Find next block start (any other language code)
    next_starts = []
    for c in codes:
        if c == code:
            continue
        idx = content.find(f"\n  {c}: {{", block_start + 5)
        if idx > 0:
            next_starts.append(idx)
    block_end = min(next_starts) if next_starts else len(content)
    
    block = content[block_start:block_end]
    
    # Find analyticsDaysAgo in this block
    day_key = "analyticsDaysAgo:"
    day_idx = block.find(day_key)
    if day_idx < 0:
        print(f"analyticsDaysAgo not found in {code}")
        continue
    
    # Find end of this line
    line_end = block.find("\n", day_idx)
    abs_end = block_start + line_end
    
    content = content[:abs_end] + "\n" + insert + content[abs_end:]

with open("src/lib/i18n.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
