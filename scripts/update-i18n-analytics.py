import re

codes = ["ar", "de", "el", "en", "es", "fr", "hi", "id", "it", "ja", "ko", "nl", "pl", "pt", "ro", "ru", "sv", "th", "tr", "uk", "vi", "zh-CN", "zh-TW"]

new_keys = {
    "analyticsActivity": {
        "ar": "النشاط", "de": "Aktivität", "el": "Δραστηριότητα", "en": "Activity",
        "es": "Actividad", "fr": "Activité", "hi": "गतिविधि", "id": "Aktivitas",
        "it": "Attività", "ja": "アクティビティ", "ko": "활동", "nl": "Activiteit",
        "pl": "Aktywność", "pt": "Atividade", "ro": "Activitate", "ru": "Активность",
        "sv": "Aktivitet", "th": "กิจกรรม", "tr": "Etkinlik", "uk": "Активність",
        "vi": "Hoạt động", "zh-CN": "活动", "zh-TW": "活動"
    },
    "analyticsPeakHour": {
        "ar": "ساعة الذروة", "de": "Spitzenzeit", "el": "Ώρα αιχμής", "en": "Peak hour",
        "es": "Hora pico", "fr": "Heure de pointe", "hi": "पीक आवर", "id": "Jam sibuk",
        "it": "Ora di punta", "ja": "ピーク時間", "ko": "피크 시간", "nl": "Piekuur",
        "pl": "Godzina szczytu", "pt": "Horário de pico", "ro": "Ora de vârf", "ru": "Пиковый час",
        "sv": "Rusningstid", "th": "ช่วงเวลาสูงสุด", "tr": "Yoğun saat", "uk": "Пікова година",
        "vi": "Giờ cao điểm", "zh-CN": "高峰时段", "zh-TW": "高峰時段"
    },
    "analyticsBestDay": {
        "ar": "أفضل يوم", "de": "Bester Tag", "el": "Καλύτερη μέρα", "en": "Best day",
        "es": "Mejor día", "fr": "Meilleur jour", "hi": "सबसे अच्छा दिन", "id": "Hari terbaik",
        "it": "Miglior giorno", "ja": "最高の日", "ko": "최고의 날", "nl": "Beste dag",
        "pl": "Najlepszy dzień", "pt": "Melhor dia", "ro": "Cea mai bună zi", "ru": "Лучший день",
        "sv": "Bästa dagen", "th": "วันที่ดีที่สุด", "tr": "En iyi gün", "uk": "Найкращий день",
        "vi": "Ngày tốt nhất", "zh-CN": "最佳日", "zh-TW": "最佳日"
    },
    "analyticsAvgDaily": {
        "ar": "المتوسط اليومي", "de": "Tagesdurchschnitt", "el": "Ημερήσιος μέσος όρος", "en": "Daily average",
        "es": "Promedio diario", "fr": "Moyenne quotidienne", "hi": "दैनिक औसत", "id": "Rata-rata harian",
        "it": "Media giornaliera", "ja": "1日平均", "ko": "일일 평균", "nl": "Daggemiddelde",
        "pl": "Średnia dzienna", "pt": "Média diária", "ro": "Media zilnică", "ru": "Среднее в день",
        "sv": "Dagligt genomsnitt", "th": "ค่าเฉลี่ยรายวัน", "tr": "Günlük ortalama", "uk": "Середнє на день",
        "vi": "Trung bình mỗi ngày", "zh-CN": "日均", "zh-TW": "日均"
    },
    "analyticsLastScan": {
        "ar": "آخر مسح", "de": "Letzter Scan", "el": "Τελευταία σάρωση", "en": "Last scan",
        "es": "Último escaneo", "fr": "Dernier scan", "hi": "अंतिम स्कैन", "id": "Pemindaian terakhir",
        "it": "Ultima scansione", "ja": "最後のスキャン", "ko": "마지막 스캔", "nl": "Laatste scan",
        "pl": "Ostatnie skanowanie", "pt": "Último escaneamento", "ro": "Ultima scanare", "ru": "Последний скан",
        "sv": "Senaste skanningen", "th": "สแกนล่าสุด", "tr": "Son tarama", "uk": "Останнє сканування",
        "vi": "Lần quét cuối", "zh-CN": "最近扫描", "zh-TW": "最近掃描"
    },
    "analyticsHoursAgo": {
        "ar": "منذ {n} ساعة", "de": "vor {n} Std.", "el": "πριν {n} ώ.", "en": "{n}h ago",
        "es": "hace {n}h", "fr": "il y a {n}h", "hi": "{n} घं. पहले", "id": "{n} jam lalu",
        "it": "{n}h fa", "ja": "{n}時間前", "ko": "{n}시간 전", "nl": "{n}u geleden",
        "pl": "{n}h temu", "pt": "{n}h atrás", "ro": "acum {n} ore", "ru": "{n} ч. назад",
        "sv": "för {n} tim.", "th": "{n} ชม.ที่แล้ว", "tr": "{n} sa. önce", "uk": "{n} год. тому",
        "vi": "{n} giờ trước", "zh-CN": "{n}小时前", "zh-TW": "{n}小時前"
    },
    "analyticsDaysAgo": {
        "ar": "منذ {n} يوم", "de": "vor {n} Tg.", "el": "πριν {n} ημ.", "en": "{n}d ago",
        "es": "hace {n}d", "fr": "il y a {n}j", "hi": "{n} दिन पहले", "id": "{n} hari lalu",
        "it": "{n}g fa", "ja": "{n}日前", "ko": "{n}일 전", "nl": "{n} dgn geleden",
        "pl": "{n}d temu", "pt": "{n}d atrás", "ro": "acum {n} zile", "ru": "{n} д. назад",
        "sv": "för {n} dagar", "th": "{n} วันก่อน", "tr": "{n} gün önce", "uk": "{n} д. тому",
        "vi": "{n} ngày trước", "zh-CN": "{n}天前", "zh-TW": "{n}天前"
    },
}

featPro6 = {
    "ar": "تحليل البلدان والأجهزة وأوقات الذروة",
    "de": "Analyse von Ländern, Geräten und Spitzenzeiten",
    "el": "Ανάλυση χωρών, συσκευών και ωρών αιχμής",
    "en": "Analyze countries, devices, and peak hours",
    "es": "Analiza países, dispositivos y horarios pico",
    "fr": "Analyse des pays, appareils et heures de pointe",
    "hi": "देशों, उपकरणों और पीक आवर का विश्लेषण",
    "id": "Analisis negara, perangkat, dan jam sibuk",
    "it": "Analizza paesi, dispositivi e ore di punta",
    "ja": "国、デバイス、ピーク時間の分析",
    "ko": "국가, 기기, 피크 시간 분석",
    "nl": "Analyseer landen, apparaten en piekuren",
    "pl": "Analizuj kraje, urządzenia i godziny szczytu",
    "pt": "Analise países, dispositivos e horários de pico",
    "ro": "Analizați țări, dispozitive și ore de vârf",
    "ru": "Анализ стран, устройств и пикового времени",
    "sv": "Analysera länder, enheter och rusningstider",
    "th": "วิเคราะห์ประเทศ อุปกรณ์ และช่วงเวลาสูงสุด",
    "tr": "Ülkeleri, cihazları ve yoğun saatleri analiz edin",
    "uk": "Аналіз країн, пристроїв та пікового часу",
    "vi": "Phân tích quốc gia, thiết bị và giờ cao điểm",
    "zh-CN": "分析国家、设备和高峰时段",
    "zh-TW": "分析國家、裝置和高峰時段"
}

featPro7 = {
    "ar": "تصدير بيانات المسح إلى CSV",
    "de": "Scan-Daten als CSV exportieren",
    "el": "Εξαγωγή δεδομένων σάρωσης σε CSV",
    "en": "Export scan data to CSV",
    "es": "Exporta datos de escaneo a CSV",
    "fr": "Exporter les données de scan en CSV",
    "hi": "स्कैन डेटा CSV में एक्सपोर्ट करें",
    "id": "Ekspor data pemindaian ke CSV",
    "it": "Esporta dati di scansione in CSV",
    "ja": "スキャンデータをCSVにエクスポート",
    "ko": "스캔 데이터를 CSV로 내보내기",
    "nl": "Scan gegevens exporteren naar CSV",
    "pl": "Eksportuj dane skanowania do CSV",
    "pt": "Exportar dados de escaneamento para CSV",
    "ro": "Exportați datele de scanare în CSV",
    "ru": "Экспорт данных сканирования в CSV",
    "sv": "Exportera skanningsdata till CSV",
    "th": "ส่งออกข้อมูลการสแกนเป็น CSV",
    "tr": "Tarama verilerini CSV'ye aktarın",
    "uk": "Експорт даних сканування у CSV",
    "vi": "Xuất dữ liệu quét ra CSV",
    "zh-CN": "导出扫描数据为CSV",
    "zh-TW": "匯出掃描資料為CSV"
}

with open("src/lib/i18n.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Helper: build a regex to find the analyticsDevice line in a given language block
# We look for lines like: "    analyticsDevice: \"<translation>\"," inside the block for that language code
def find_and_insert_after(content, code, target_key, insert_dict, insert_keys):
    """Find `target_key: "..."` inside the block for `code` and insert new keys after it."""
    # Match the language block: `code: { ... }`
    # First find the target key line inside the block
    pattern = rf"({re.escape(code)}: \{{[\s\S]*?)(    {re.escape(target_key)}: \"[^\"]+\",)(\n[\s]*?)(\w+)"
    
    def replacer(m):
        before_block = m.group(1)
        target_line = m.group(2)
        after_newline = m.group(3)
        next_key = m.group(4)
        
        insert_lines = []
        for k in insert_keys:
            insert_lines.append(f"    {k}: \"{insert_dict[k][code]}\",")
        
        return before_block + target_line + "\n" + "\n".join(insert_lines) + after_newline + next_key
    
    return re.sub(pattern, replacer, content, count=1)

# 1. Rename analyticsReferrers → analyticsActivity
for code in codes:
    old_val = new_keys["analyticsActivity"][code]
    content = content.replace(
        f'analyticsReferrers: "{old_val}"',
        f'analyticsActivity: "{old_val}"'
    )

# 2. Insert 6 new keys after analyticsDevice in each block
insert_analytics_keys = ["analyticsPeakHour", "analyticsBestDay", "analyticsAvgDaily", "analyticsLastScan", "analyticsHoursAgo", "analyticsDaysAgo"]
for code in codes:
    content = find_and_insert_after(content, code, "analyticsDevice", new_keys, insert_analytics_keys)

# 3. Insert featPro6 and featPro7 after featPro5 in each block
insert_feat_keys = ["featPro6", "featPro7"]
feat_dict = {"featPro6": featPro6, "featPro7": featPro7}
for code in codes:
    content = find_and_insert_after(content, code, "featPro5", feat_dict, insert_feat_keys)

with open("src/lib/i18n.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Done!")
