import re

old_feat6 = {
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

new_feat6 = {
    "ar": "إحصائيات مفصلة: الخط الزمني والدول والأجهزة والنشاط",
    "de": "Detaillierte Statistiken: Zeitverlauf, Länder, Geräte und Aktivität",
    "el": "Λεπτομερή στατιστικά: Χρονολόγιο, χώρες, συσκευές και δραστηριότητα",
    "en": "Detailed stats: timeline, countries, devices, and activity",
    "es": "Estadísticas detalladas: timeline, países, dispositivos y actividad",
    "fr": "Statistiques détaillées : chronologie, pays, appareils et activité",
    "hi": "विस्तृत आँकड़े: समयरेखा, देश, उपकरण और गतिविधि",
    "id": "Statistik terperinci: garis waktu, negara, perangkat, dan aktivitas",
    "it": "Statistiche dettagliate: cronologia, paesi, dispositivi e attività",
    "ja": "詳細な統計: タイムライン、国、デバイス、アクティビティ",
    "ko": "상세 통계: 타임라인, 국가, 기기 및 활동",
    "nl": "Gedetailleerde statistieken: tijdlijn, landen, apparaten en activiteit",
    "pl": "Szczegółowe statystyki: oś czasu, kraje, urządzenia i aktywność",
    "pt": "Estatísticas detalhadas: linha do tempo, países, dispositivos e atividade",
    "ro": "Statistici detaliate: cronologie, țări, dispozitive și activitate",
    "ru": "Детальная статистика: хронология, страны, устройства и активность",
    "sv": "Detaljerad statistik: tidslinje, länder, enheter och aktivitet",
    "th": "สถิติโดยละเอียด: ไทม์ไลน์ ประเทศ อุปกรณ์ และกิจกรรม",
    "tr": "Detaylı istatistikler: zaman çizelgesi, ülkeler, cihazlar ve etkinlik",
    "uk": "Детальна статистика: хронологія, країни, пристрої та активність",
    "vi": "Thống kê chi tiết: dòng thời gian, quốc gia, thiết bị và hoạt động",
    "zh-CN": "详细统计：时间线、国家、设备和活动",
    "zh-TW": "詳細統計：時間線、國家、裝置和活動"
}

old_feat7 = {
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

# Update featPro6
for code in old_feat6:
    old = f'featPro6: "{old_feat6[code]}"'
    new = f'featPro6: "{new_feat6[code]}"'
    content = content.replace(old, new)

# Remove featPro7 lines
for code in old_feat7:
    old = f'\n    featPro7: "{old_feat7[code]}",'
    content = content.replace(old, "")

with open("src/lib/i18n.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
