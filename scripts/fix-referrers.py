import re

# From the grep output:
old_referrers = {
    "ar": "المصادر", "de": "Verweise", "el": "Παραπομπές", "en": "Referrers",
    "es": "Fuentes", "fr": "Référents", "hi": "रेफ़रल", "id": "Pengarah",
    "it": "Referenti", "ja": "参照元", "ko": "유입처", "nl": "Verwijzers",
    "pl": "Źródła", "pt": "Referências", "ro": "Referințe", "ru": "Источники",
    "sv": "Hänvisningar", "th": "แหล่งอ้างอิง", "tr": "Yönlendirenler",
    "uk": "Джерела", "vi": "Người giới thiệu", "zh-CN": "来源", "zh-TW": "來源"
}
activity_vals = {
    "ar": "النشاط", "de": "Aktivität", "el": "Δραστηριότητα", "en": "Activity",
    "es": "Actividad", "fr": "Activité", "hi": "गतिविधि", "id": "Aktivitas",
    "it": "Attività", "ja": "アクティビティ", "ko": "활동", "nl": "Activiteit",
    "pl": "Aktywność", "pt": "Atividade", "ro": "Activitate", "ru": "Активность",
    "sv": "Aktivitet", "th": "กิจกรรม", "tr": "Etkinlik", "uk": "Активність",
    "vi": "Hoạt động", "zh-CN": "活动", "zh-TW": "活動"
}

with open("src/lib/i18n.ts", "r", encoding="utf-8") as f:
    content = f.read()

for code in old_referrers:
    old = f'analyticsReferrers: "{old_referrers[code]}"'
    new = f'analyticsActivity: "{activity_vals[code]}"'
    content = content.replace(old, new)

with open("src/lib/i18n.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Done!")
