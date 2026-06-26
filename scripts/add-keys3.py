keys = {
    "analyticsBrowser": {
        "ar": "المتصفح", "de": "Browser", "el": "Πρόγραμμα περιήγησης", "en": "Browser",
        "es": "Navegador", "fr": "Navigateur", "hi": "ब्राउज़र", "id": "Peramban",
        "it": "Browser", "ja": "ブラウザ", "ko": "브라우저", "nl": "Browser",
        "pl": "Przeglądarka", "pt": "Navegador", "ro": "Browser", "ru": "Браузер",
        "sv": "Webbläsare", "th": "เบราว์เซอร์", "tr": "Tarayıcı", "uk": "Браузер",
        "vi": "Trình duyệt", "zh-CN": "浏览器", "zh-TW": "瀏覽器"
    },
    "analyticsOS": {
        "ar": "نظام التشغيل", "de": "Betriebssystem", "el": "Λειτουργικό σύστημα", "en": "OS",
        "es": "Sistema operativo", "fr": "Système d'exploitation", "hi": "ऑपरेटिंग सिस्टम", "id": "Sistem operasi",
        "it": "Sistema operativo", "ja": "OS", "ko": "운영체제", "nl": "Besturingssysteem",
        "pl": "System operacyjny", "pt": "Sistema operacional", "ro": "Sistem de operare", "ru": "ОС",
        "sv": "Operativsystem", "th": "ระบบปฏิบัติการ", "tr": "İşletim sistemi", "uk": "ОС",
        "vi": "Hệ điều hành", "zh-CN": "操作系统", "zh-TW": "作業系統"
    },
    "analyticsDevice": {
        "ar": "الجهاز", "de": "Gerät", "el": "Συσκευή", "en": "Device",
        "es": "Dispositivo", "fr": "Appareil", "hi": "डिवाइस", "id": "Perangkat",
        "it": "Dispositivo", "ja": "デバイス", "ko": "기기", "nl": "Apparaat",
        "pl": "Urządzenie", "pt": "Dispositivo", "ro": "Dispozitiv", "ru": "Устройство",
        "sv": "Enhet", "th": "อุปกรณ์", "tr": "Cihaz", "uk": "Пристрій",
        "vi": "Thiết bị", "zh-CN": "设备", "zh-TW": "設備"
    },
}

new_key_names = ["analyticsBrowser", "analyticsOS", "analyticsDevice"]
anchor = "analyticsNoData"

with open("src/lib/i18n.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
inserted_count = 0
current_code = None

for line in lines:
    stripped = line.rstrip("\n")
    new_lines.append(line)

    for code in list(keys["analyticsBrowser"].keys()):
        pattern_noquote = f"  {code}: {{"
        pattern_quote = f'  "{code}": {{'
        if line.startswith(pattern_noquote) or line.startswith(pattern_quote):
            current_code = code
            break

    if anchor in stripped and '"' in stripped and current_code:
        inserted_count += 1
        for kn in new_key_names:
            val = keys[kn][current_code]
            new_lines.append(f"    {kn}: \"{val}\",\n")

print(f"Inserted keys in {inserted_count} blocks")
with open("src/lib/i18n.ts", "w", encoding="utf-8") as f:
    f.writelines(new_lines)
print("Done")
