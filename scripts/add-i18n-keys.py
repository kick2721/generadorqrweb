import re

keys = {
    "dashboardSearch": {
        "ar": "بحث...", "de": "Suchen...", "el": "Αναζήτηση...", "en": "Search...",
        "es": "Buscar...", "fr": "Rechercher...", "hi": "खोज...", "id": "Cari...",
        "it": "Cerca...", "ja": "検索...", "ko": "검색...", "nl": "Zoeken...",
        "pl": "Szukaj...", "pt": "Buscar...", "ro": "Căutare...", "ru": "Поиск...",
        "sv": "Sök...", "th": "ค้นหา...", "tr": "Ara...", "uk": "Пошук...",
        "vi": "Tìm kiếm...", "zh-CN": "搜索...", "zh-TW": "搜尋..."
    },
    "dashboardSortNewest": {
        "ar": "الأحدث", "de": "Neueste", "el": "Νεότερα", "en": "Newest",
        "es": "Más nuevo", "fr": "Plus récent", "hi": "नवीनतम", "id": "Terbaru",
        "it": "Più recente", "ja": "最新", "ko": "최신", "nl": "Nieuwste",
        "pl": "Najnowsze", "pt": "Mais novo", "ro": "Cele mai noi", "ru": "Новые",
        "sv": "Nyast", "th": "ล่าสุด", "tr": "En yeni", "uk": "Найновіші",
        "vi": "Mới nhất", "zh-CN": "最新", "zh-TW": "最新"
    },
    "dashboardSortOldest": {
        "ar": "الأقدم", "de": "Älteste", "el": "Παλαιότερα", "en": "Oldest",
        "es": "Más viejo", "fr": "Plus ancien", "hi": "पुराने", "id": "Terlama",
        "it": "Più vecchio", "ja": "最古", "ko": "오래된", "nl": "Oudste",
        "pl": "Najstarsze", "pt": "Mais antigo", "ro": "Cele mai vechi", "ru": "Старые",
        "sv": "Äldst", "th": "เก่าที่สุด", "tr": "En eski", "uk": "Найстаріші",
        "vi": "Cũ nhất", "zh-CN": "最旧", "zh-TW": "最舊"
    },
    "dashboardSortMostScans": {
        "ar": "الأكثر مسحاً", "de": "Meistgescannt", "el": "Περισσότερες σαρώσεις", "en": "Most scanned",
        "es": "Más escaneados", "fr": "Plus scannés", "hi": "सबसे अधिक स्कैन", "id": "Terbanyak dipindai",
        "it": "Più scansionati", "ja": "最多スキャン", "ko": "스캔 많음", "nl": "Meest gescand",
        "pl": "Najczęściej skanowane", "pt": "Mais escaneados", "ro": "Cele mai scanate", "ru": "Больше сканов",
        "sv": "Mest skannade", "th": "สแกนมากที่สุด", "tr": "En çok taranan", "uk": "Найбільше сканувань",
        "vi": "Quét nhiều nhất", "zh-CN": "扫描最多", "zh-TW": "掃描最多"
    },
    "dashboardSortAZ": {
        "ar": "أ-ي", "de": "A-Z", "el": "Α-Ω", "en": "A-Z",
        "es": "A-Z", "fr": "A-Z", "hi": "अ-ज्ञ", "id": "A-Z",
        "it": "A-Z", "ja": "あ-ん", "ko": "ㄱ-ㅎ", "nl": "A-Z",
        "pl": "A-Z", "pt": "A-Z", "ro": "A-Z", "ru": "А-Я",
        "sv": "A-Ö", "th": "ก-ฮ", "tr": "A-Z", "uk": "А-Я",
        "vi": "A-Z", "zh-CN": "A-Z", "zh-TW": "A-Z"
    },
    "dashboardFilterAll": {
        "ar": "الكل", "de": "Alle", "el": "Όλα", "en": "All",
        "es": "Todos", "fr": "Tous", "hi": "सभी", "id": "Semua",
        "it": "Tutti", "ja": "すべて", "ko": "모두", "nl": "Alles",
        "pl": "Wszystkie", "pt": "Todos", "ro": "Toate", "ru": "Все",
        "sv": "Alla", "th": "ทั้งหมด", "tr": "Tümü", "uk": "Усі",
        "vi": "Tất cả", "zh-CN": "全部", "zh-TW": "全部"
    },
}

codes = ["ar", "de", "el", "en", "es", "fr", "hi", "id", "it", "ja", "ko", "nl", "pl", "pt", "ro", "ru", "sv", "th", "tr", "uk", "vi", "zh-CN", "zh-TW"]
new_key_names = ["dashboardSearch", "dashboardSortNewest", "dashboardSortOldest", "dashboardSortMostScans", "dashboardSortAZ", "dashboardFilterAll"]

with open("src/lib/i18n.ts", "r", encoding="utf-8") as f:
    content = f.read()

for code in codes:
    def replacer(m):
        # Insert new keys after dashboardDelete
        block = m.group(1)
        lines = block.split("\n")
        new_entries = []
        for k in new_key_names:
            new_entries.append(f"    {k}: \"{keys[k][code]}\",")
        insert = "\n" + "\n".join(new_entries)
        return lines[0] + insert
    # Match first line of a language block that contains dashboardDelete
    pattern = rf"({re.escape(code)}: \{{[\s\S]*?dashboardDelete: \"[^\"]+\",)"
    content = re.sub(pattern, replacer, content, count=1)

with open("src/lib/i18n.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
