import json

path = r"C:\Users\Mi niña\Downloads\Claude\projects\qrwing\src\lib\i18n.ts"

# New translations
image_trial_new = [
    'imageTrialDesc: "رفع الصور إلى رمز الاستجابة السريعة - ميزة Pro",',
    'imageTrialDesc: "Bilder in QR hochladen — Pro-Funktion",',
    'imageTrialDesc: "Μεταφόρτωση εικόνων σε QR — Λειτουργία Pro",',
    'imageTrialDesc: "Upload images to QR — Pro feature",',
    'imageTrialDesc: "Subir imágenes al QR — función Pro",',
    'imageTrialDesc: "Télécharger des images en QR — fonction Pro",',
    'imageTrialDesc: "QR में छवियां अपलोड करें — Pro सुविधा",',
    'imageTrialDesc: "Unggah gambar ke QR — fitur Pro",',
    'imageTrialDesc: "Carica immagini in QR — funzionalità Pro",',
    'imageTrialDesc: "画像をQRにアップロード — Pro機能",',
    'imageTrialDesc: "QR에 이미지 업로드 — Pro 기능",',
    'imageTrialDesc: "Afbeeldingen uploaden naar QR — Pro-functie",',
    'imageTrialDesc: "Przesyłaj obrazy do QR — funkcja Pro",',
    'imageTrialDesc: "Enviar imagens para QR — recurso Pro",',
    'imageTrialDesc: "Încărcați imagini în QR — funcție Pro",',
    'imageTrialDesc: "Загрузка изображений в QR — функция Pro",',
    'imageTrialDesc: "Ladda upp bilder till QR — Pro-funktion",',
    'imageTrialDesc: "อัปโหลดรูปภาพไปยัง QR — ฟีเจอร์ Pro",',
    'imageTrialDesc: "QR\'a resim yükleyin — Pro özelliği",',
    'imageTrialDesc: "Завантаження зображень у QR — функція Pro",',
    'imageTrialDesc: "Tải hình ảnh lên QR — tính năng Pro",',
    'imageTrialDesc: "上传图片至二维码 — Pro 功能",',
    'imageTrialDesc: "上傳圖片至二維碼 — Pro 功能",',
]

logo_pro_only = [
    'logoProOnly: "الشعار - ميزة Pro",',
    'logoProOnly: "Logo — Pro-Funktion",',
    'logoProOnly: "Λογότυπο — Λειτουργία Pro",',
    'logoProOnly: "Logo — Pro feature",',
    'logoProOnly: "Logotipo — función Pro",',
    'logoProOnly: "Logo — fonction Pro",',
    'logoProOnly: "लोगो — Pro सुविधा",',
    'logoProOnly: "Logo — fitur Pro",',
    'logoProOnly: "Logo — funzionalità Pro",',
    'logoProOnly: "ロゴ — Pro機能",',
    'logoProOnly: "로고 — Pro 기능",',
    'logoProOnly: "Logo — Pro-functie",',
    'logoProOnly: "Logo — funkcja Pro",',
    'logoProOnly: "Logotipo — recurso Pro",',
    'logoProOnly: "Logo — funcție Pro",',
    'logoProOnly: "Логотип — функция Pro",',
    'logoProOnly: "Logotyp — Pro-funktion",',
    'logoProOnly: "โลโก้ — ฟีเจอร์ Pro",',
    'logoProOnly: "Logo — Pro özelliği",',
    'logoProOnly: "Логотип — функція Pro",',
    'logoProOnly: "Logo — tính năng Pro",',
    'logoProOnly: "Logo — Pro 功能",',
    'logoProOnly: "標誌 — Pro 功能",',
]

logo_help = [
    'logoHelp: "يظهر في وسط رمز الاستجابة السريعة. الخلفيات الشفافة تعمل بشكل أفضل.",',
    'logoHelp: "Erscheint in der Mitte Ihres QR. Transparente Hintergründe funktionieren am besten.",',
    'logoHelp: "Εμφανίζεται στο κέντρο του QR. Οι διάφανες φόντο λειτουργούν καλύτερα.",',
    'logoHelp: "Appears in the center of your QR. Transparent backgrounds work best.",',
    'logoHelp: "Aparece en el centro de tu QR. Los fondos transparentes funcionan mejor.",',
    'logoHelp: "Apparaît au centre de votre QR. Les fonds transparents fonctionnent mieux.",',
    'logoHelp: "आपके QR के केंद्र में दिखाई देता है। पारदर्शी पृष्ठभूमि सबसे अच्छा काम करती है।",',
    'logoHelp: "Muncul di tengah QR Anda. Latar belakang transparan bekerja paling baik.",',
    'logoHelp: "Appare al centro del tuo QR. Gli sfondi trasparenti funzionano meglio.",',
    'logoHelp: "QRの中央に表示されます。透明な背景が最適です。",',
    'logoHelp: "QR 중앙에 표시됩니다. 투명 배경이 가장 잘 작동합니다.",',
    'logoHelp: "Verschijnt in het midden van uw QR. Transparante achtergronden werken het beste.",',
    'logoHelp: "Pojawia się na środku QR. Przezroczyste tła działają najlepiej.",',
    'logoHelp: "Aparece no centro do seu QR. Fundos transparentes funcionam melhor.",',
    'logoHelp: "Apare în centrul QR-ului. Fundalurile transparente funcționează cel mai bine.",',
    'logoHelp: "Появляется в центре QR. Прозрачный фон работает лучше всего.",',
    'logoHelp: "Visas i mitten av din QR. Transparenta bakgrunder fungerar bäst.",',
    'logoHelp: "ปรากฏที่กึ่งกลาง QR ของคุณ พื้นหลังโปร่งใสใช้งานได้ดีที่สุด",',
    'logoHelp: "QR\'ınızın ortasında görünür. Şeffaf arka planlar en iyi şekilde çalışır.",',
    'logoHelp: "З\'являється в центрі QR. Прозорий фон працює найкраще.",',
    'logoHelp: "Xuất hiện ở trung tâm QR của bạn. Nền trong suốt hoạt động tốt nhất.",',
    'logoHelp: "出现在二维码中心。透明背景效果最佳。",',
    'logoHelp: "出現在二維碼中心。透明背景效果最佳。",',
]

with open(path, "rb") as f:
    raw = f.read()

# Normalize to LF
raw = raw.replace(b"\r\n", b"\n").replace(b"\r", b"")
text = raw.decode("utf-8")
lines = text.split("\n")
if lines and lines[-1] == "":
    lines.pop()

# Find imageTrialDesc line numbers
img_trial_indices = [i for i, l in enumerate(lines) if l.strip().startswith("imageTrialDesc:")]
print(f"Found {len(img_trial_indices)} imageTrialDesc entries")

# Process in reverse
for pos in sorted(img_trial_indices, reverse=True):
    line = lines[pos]
    indent = line[: len(line) - len(line.lstrip())]
    lang_idx = img_trial_indices.index(pos)
    lines[pos] = f"{indent}{image_trial_new[lang_idx]}"
    lines.insert(pos + 1, "")
    lines.insert(pos + 2, f"{indent}{logo_pro_only[lang_idx]}")
    lines.insert(pos + 3, "")
    lines.insert(pos + 4, f"{indent}{logo_help[lang_idx]}")

result = "\n".join(lines) + "\n"

with open(path, "w", encoding="utf-8") as f:
    f.write(result)

print(f"Updated {len(img_trial_indices)} keys")
