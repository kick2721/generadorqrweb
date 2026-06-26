# Add analytics tab i18n keys

keys = {
    "analyticsTimeline": {
        "ar": "الخط الزمني", "de": "Zeitverlauf", "el": "Χρονολόγιο", "en": "Timeline",
        "es": "Línea de tiempo", "fr": "Chronologie", "hi": "समयरेखा", "id": "Garis waktu",
        "it": "Cronologia", "ja": "タイムライン", "ko": "타임라인", "nl": "Tijdlijn",
        "pl": "Oś czasu", "pt": "Linha do tempo", "ro": "Cronologie", "ru": "Хронология",
        "sv": "Tidslinje", "th": "ไทม์ไลน์", "tr": "Zaman çizelgesi", "uk": "Хронологія",
        "vi": "Dòng thời gian", "zh-CN": "时间线", "zh-TW": "時間線"
    },
    "analyticsCountries": {
        "ar": "الدول", "de": "Länder", "el": "Χώρες", "en": "Countries",
        "es": "Países", "fr": "Pays", "hi": "देश", "id": "Negara",
        "it": "Paesi", "ja": "国", "ko": "국가", "nl": "Landen",
        "pl": "Kraje", "pt": "Países", "ro": "Țări", "ru": "Страны",
        "sv": "Länder", "th": "ประเทศ", "tr": "Ülkeler", "uk": "Країни",
        "vi": "Quốc gia", "zh-CN": "国家", "zh-TW": "國家"
    },
    "analyticsDevices": {
        "ar": "الأجهزة", "de": "Geräte", "el": "Συσκευές", "en": "Devices",
        "es": "Dispositivos", "fr": "Appareils", "hi": "डिवाइस", "id": "Perangkat",
        "it": "Dispositivi", "ja": "デバイス", "ko": "기기", "nl": "Apparaten",
        "pl": "Urządzenia", "pt": "Dispositivos", "ro": "Dispozitive", "ru": "Устройства",
        "sv": "Enheter", "th": "อุปกรณ์", "tr": "Cihazlar", "uk": "Пристрої",
        "vi": "Thiết bị", "zh-CN": "设备", "zh-TW": "設備"
    },
    "analyticsReferrers": {
        "ar": "المصادر", "de": "Verweise", "el": "Παραπομπές", "en": "Referrers",
        "es": "Referentes", "fr": "Référents", "hi": "रेफ़रल", "id": "Pengarah",
        "it": "Referenti", "ja": "参照元", "ko": "유입처", "nl": "Verwijzers",
        "pl": "Źródła", "pt": "Referências", "ro": "Referințe", "ru": "Источники",
        "sv": "Hänvisningar", "th": "แหล่งอ้างอิง", "tr": "Yönlendirenler", "uk": "Джерела",
        "vi": "Người giới thiệu", "zh-CN": "来源", "zh-TW": "來源"
    },
    "analyticsNoData": {
        "ar": "لا توجد بيانات بعد", "de": "Noch keine Daten", "el": "Δεν υπάρχουν ακόμη δεδομένα", "en": "No data yet",
        "es": "Sin datos aún", "fr": "Pas encore de données", "hi": "अभी तक कोई डेटा नहीं", "id": "Belum ada data",
        "it": "Ancora nessun dato", "ja": "まだデータがありません", "ko": "아직 데이터 없음", "nl": "Nog geen gegevens",
        "pl": "Brak danych", "pt": "Ainda sem dados", "ro": "Încă fără date", "ru": "Пока нет данных",
        "sv": "Inga data än", "th": "ยังไม่มีข้อมูล", "tr": "Henüz veri yok", "uk": "Ще немає даних",
        "vi": "Chưa có dữ liệu", "zh-CN": "暂无数据", "zh-TW": "暫無數據"
    },
}

new_key_names = ["analyticsTimeline", "analyticsCountries", "analyticsDevices", "analyticsReferrers", "analyticsNoData"]

with open("src/lib/i18n.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find which line to insert after. We'll use analyticsNoData as the anchor,
# inserting ALL new keys before the first analyticsNoData that we find
# Actually, let's insert after the last existing key. We'll look for a known
# anchor key that exists in every block. Let's use "save" which should be universal.

new_lines = []
inserted_count = 0
in_block = False
current_code = None

# Map: find for each block where to insert - after the last key before the block ends
# We insert after `dashboardFilterAll` (our previously added key)
anchor = "dashboardFilterAll"

for i, line in enumerate(lines):
    stripped = line.rstrip("\n")
    new_lines.append(line)
    
    # Track which language block we're in
    for code in list(keys["analyticsTimeline"].keys()):
        pattern_noquote = f"  {code}: {{"
        pattern_quote = f'  "{code}": {{'
        if line.startswith(pattern_noquote) or line.startswith(pattern_quote):
            current_code = code
            break
    
    # When we hit the anchor line, insert the new keys for the current code
    if anchor in stripped and '"' in stripped and current_code:
        inserted_count += 1
        for kn in new_key_names:
            val = keys[kn][current_code]
            new_lines.append(f"    {kn}: \"{val}\",\n")

print(f"Inserted keys in {inserted_count} language blocks")

with open("src/lib/i18n.ts", "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Done")
