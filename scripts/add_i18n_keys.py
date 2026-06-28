import sys, os

sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

with open('src/lib/i18n.ts', 'r', encoding='utf-8') as f:
    content = f.read()
lines = content.split('\n')

# Language code order matching i18n.ts: ar, de, el, en, es, fr, hi, id, it, ja, ko, nl, pl, pt, ro, ru, sv, th, tr, uk, vi, zh-CN, zh-TW
langs = ['ar', 'de', 'el', 'en', 'es', 'fr', 'hi', 'id', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ro', 'ru', 'sv', 'th', 'tr', 'uk', 'vi', 'zh-CN', 'zh-TW']

# QR type labels translations (4 new types after qrTypeTelegram)
qrLabels = {}
# QR type descriptions translations (4 new types after typeTelegramDesc)
qrDescs = {}

# --- Arabic ---
qrLabels['ar'] = [f'    qrTypeBusinessCard: "بطاقة رقمية",',
                       f'    qrTypeGoogleReview: "مراجعة Google",',
                       f'    qrTypePassword: "كلمة المرور",',
                       f'    qrTypeMultiLink: "روابط متعددة",']
qrDescs['ar'] = [f'    "typeBusiness-cardDesc": "ملف رقمي يُحفظ في الهاتف",',
                      f'    "typeGoogle-reviewDesc": "يفتح مراجعة Google",',
                      f'    typePasswordDesc: "يعرض محتوى محمي بكلمة مرور",',
                      f'    "typeMulti-linkDesc": "روابط متعددة تتغير حسب اليوم/الوقت",']

# --- German ---
qrLabels['de'] = [f'    qrTypeBusinessCard: "Digitale Visitenkarte",',
                       f'    qrTypeGoogleReview: "Google-Bewertung",',
                       f'    qrTypePassword: "Passwort",',
                       f'    qrTypeMultiLink: "Multi-Link",']
qrDescs['de'] = [f'    typeBusiness-cardDesc: "Digitales Profil wird im Telefon gespeichert",',
                      f'    typeGoogle-reviewDesc: "Öffnet eine Google-Bewertung",',
                      f'    typePasswordDesc: "Zeigt passwortgeschützten Inhalt",',
                      f'    typeMulti-linkDesc: "Mehrere Links je nach Tag/Zeit",']

# --- Greek ---
qrLabels['el'] = [f'    qrTypeBusinessCard: "Ψηφιακή κάρτα",',
                       f'    qrTypeGoogleReview: "Κριτική Google",',
                       f'    qrTypePassword: "Κωδικός πρόσβασης",',
                       f'    qrTypeMultiLink: "Πολλαπλοί σύνδεσμοι",']
qrDescs['el'] = [f'    typeBusiness-cardDesc: "Ψηφιακό προφίλ που αποθηκεύεται στο τηλέφωνο",',
                      f'    typeGoogle-reviewDesc: "Ανοίγει μια κριτική Google",',
                      f'    typePasswordDesc: "Εμφανίζει περιεχόμενο που προστατεύεται",',
                      f'    typeMulti-linkDesc: "Πολλαπλοί σύνδεσμοι ανάλογα με την ημέρα/ώρα",']

# --- English ---
qrLabels['en'] = [f'    qrTypeBusinessCard: "Digital Card",',
                       f'    qrTypeGoogleReview: "Google Review",',
                       f'    qrTypePassword: "Password",',
                       f'    qrTypeMultiLink: "Multi Link",']
qrDescs['en'] = [f'    typeBusiness-cardDesc: "Digital profile saved to your phone",',
                      f'    typeGoogle-reviewDesc: "Opens a Google review page",',
                      f'    typePasswordDesc: "Shows password-protected content",',
                      f'    typeMulti-linkDesc: "Multiple links that change by day/time",']

# --- Spanish ---
qrLabels['es'] = [f'    qrTypeBusinessCard: "Tarjeta Digital",',
                       f'    qrTypeGoogleReview: "Reseña Google",',
                       f'    qrTypePassword: "Contraseña",',
                       f'    qrTypeMultiLink: "Multi Enlace",']
qrDescs['es'] = [f'    typeBusiness-cardDesc: "Perfil digital que se guarda en el teléfono",',
                      f'    typeGoogle-reviewDesc: "Abre una reseña de Google",',
                      f'    typePasswordDesc: "Muestra contenido protegido con contraseña",',
                      f'    typeMulti-linkDesc: "Múltiples enlaces que cambian según día/horario",']

# --- French ---
qrLabels['fr'] = [f'    qrTypeBusinessCard: "Carte numérique",',
                       f'    qrTypeGoogleReview: "Avis Google",',
                       f'    qrTypePassword: "Mot de passe",',
                       f'    qrTypeMultiLink: "Multi lien",']
qrDescs['fr'] = [f'    typeBusiness-cardDesc: "Profil numérique enregistré dans le téléphone",',
                      f'    typeGoogle-reviewDesc: "Ouvre un avis Google",',
                      f'    typePasswordDesc: "Affiche du contenu protégé par mot de passe",',
                      f'    typeMulti-linkDesc: "Plusieurs liens selon le jour/heure",']

# --- Hindi ---
qrLabels['hi'] = [f'    qrTypeBusinessCard: "डिजिटल कार्ड",',
                       f'    qrTypeGoogleReview: "Google समीक्षा",',
                       f'    qrTypePassword: "पासवर्ड",',
                       f'    qrTypeMultiLink: "मल्टी लिंक",']
qrDescs['hi'] = [f'    typeBusiness-cardDesc: "डिजिटल प्रोफ़ाइल फ़ोन में सहेजी गई",',
                      f'    typeGoogle-reviewDesc: "Google समीक्षा खोलता है",',
                      f'    typePasswordDesc: "पासवर्ड-सुरक्षित सामग्री दिखाता है",',
                      f'    typeMulti-linkDesc: "दिन/समय के अनुसार बदलने वाले कई लिंक",']

# --- Indonesian ---
qrLabels['id'] = [f'    qrTypeBusinessCard: "Kartu Digital",',
                       f'    qrTypeGoogleReview: "Ulasan Google",',
                       f'    qrTypePassword: "Kata Sandi",',
                       f'    qrTypeMultiLink: "Multi Tautan",']
qrDescs['id'] = [f'    typeBusiness-cardDesc: "Profil digital disimpan di ponsel",',
                      f'    typeGoogle-reviewDesc: "Membuka ulasan Google",',
                      f'    typePasswordDesc: "Menampilkan konten yang dilindungi kata sandi",',
                      f'    typeMulti-linkDesc: "Beberapa tautan yang berubah sesuai hari/waktu",']

# --- Italian ---
qrLabels['it'] = [f'    qrTypeBusinessCard: "Biglietto da visita digitale",',
                       f'    qrTypeGoogleReview: "Recensione Google",',
                       f'    qrTypePassword: "Password",',
                       f'    qrTypeMultiLink: "Multi link",']
qrDescs['it'] = [f'    typeBusiness-cardDesc: "Profilo digitale salvato sul telefono",',
                      f'    typeGoogle-reviewDesc: "Apre una recensione Google",',
                      f'    typePasswordDesc: "Mostra contenuto protetto da password",',
                      f'    typeMulti-linkDesc: "Più link che cambiano per giorno/ora",']

# --- Japanese ---
qrLabels['ja'] = [f'    qrTypeBusinessCard: "デジタル名刺",',
                       f'    qrTypeGoogleReview: "Googleレビュー",',
                       f'    qrTypePassword: "パスワード",',
                       f'    qrTypeMultiLink: "マルチリンク",']
qrDescs['ja'] = [f'    typeBusiness-cardDesc: "電話に保存されるデジタルプロフィール",',
                      f'    typeGoogle-reviewDesc: "Googleレビューページを開く",',
                      f'    typePasswordDesc: "パスワードで保護されたコンテンツを表示",',
                      f'    typeMulti-linkDesc: "日時によって変わる複数のリンク",']

# --- Korean ---
qrLabels['ko'] = [f'    qrTypeBusinessCard: "디지털 명함",',
                       f'    qrTypeGoogleReview: "Google 리뷰",',
                       f'    qrTypePassword: "비밀번호",',
                       f'    qrTypeMultiLink: "멀티 링크",']
qrDescs['ko'] = [f'    typeBusiness-cardDesc: "휴대폰에 저장되는 디지털 프로필",',
                      f'    typeGoogle-reviewDesc: "Google 리뷰 페이지 열기",',
                      f'    typePasswordDesc: "비밀번호로 보호된 콘텐츠 표시",',
                      f'    typeMulti-linkDesc: "날짜/시간에 따라 변경되는 여러 링크",']

# --- Dutch ---
qrLabels['nl'] = [f'    qrTypeBusinessCard: "Digitale kaart",',
                       f'    qrTypeGoogleReview: "Google-beoordeling",',
                       f'    qrTypePassword: "Wachtwoord",',
                       f'    qrTypeMultiLink: "Multi-link",']
qrDescs['nl'] = [f'    typeBusiness-cardDesc: "Digitaal profiel opgeslagen op je telefoon",',
                      f'    typeGoogle-reviewDesc: "Opent een Google-beoordeling",',
                      f'    typePasswordDesc: "Toont met wachtwoord beveiligde inhoud",',
                      f'    typeMulti-linkDesc: "Meerdere links die veranderen per dag/tijd",']

# --- Polish ---
qrLabels['pl'] = [f'    qrTypeBusinessCard: "Wizytówka cyfrowa",',
                       f'    qrTypeGoogleReview: "Recenzja Google",',
                       f'    qrTypePassword: "Hasło",',
                       f'    qrTypeMultiLink: "Multi link",']
qrDescs['pl'] = [f'    typeBusiness-cardDesc: "Cyfrowy profil zapisany w telefonie",',
                      f'    typeGoogle-reviewDesc: "Otwiera recenzję Google",',
                      f'    typePasswordDesc: "Pokazuje treści chronione hasłem",',
                      f'    typeMulti-linkDesc: "Wiele linków zmieniających się w zależności od dnia/godziny",']

# --- Portuguese ---
qrLabels['pt'] = [f'    qrTypeBusinessCard: "Cartão digital",',
                       f'    qrTypeGoogleReview: "Avaliação Google",',
                       f'    qrTypePassword: "Senha",',
                       f'    qrTypeMultiLink: "Multi link",']
qrDescs['pt'] = [f'    typeBusiness-cardDesc: "Perfil digital salvo no telefone",',
                      f'    typeGoogle-reviewDesc: "Abre uma avaliação do Google",',
                      f'    typePasswordDesc: "Mostra conteúdo protegido por senha",',
                      f'    typeMulti-linkDesc: "Vários links que mudam conforme dia/horário",']

# --- Romanian ---
qrLabels['ro'] = [f'    qrTypeBusinessCard: "Carte de vizită digitală",',
                       f'    qrTypeGoogleReview: "Recenzie Google",',
                       f'    qrTypePassword: "Parolă",',
                       f'    qrTypeMultiLink: "Multi link",']
qrDescs['ro'] = [f'    typeBusiness-cardDesc: "Profil digital salvat în telefon",',
                      f'    typeGoogle-reviewDesc: "Deschide o recenzie Google",',
                      f'    typePasswordDesc: "Afișează conținut protejat prin parolă",',
                      f'    typeMulti-linkDesc: "Mai multe linkuri care se schimbă în funcție de zi/oră",']

# --- Russian ---
qrLabels['ru'] = [f'    qrTypeBusinessCard: "Цифровая визитка",',
                       f'    qrTypeGoogleReview: "Отзыв Google",',
                       f'    qrTypePassword: "Пароль",',
                       f'    qrTypeMultiLink: "Мульти-ссылка",']
qrDescs['ru'] = [f'    typeBusiness-cardDesc: "Цифровой профиль сохраняется в телефон",',
                      f'    typeGoogle-reviewDesc: "Открывает страницу отзыва Google",',
                      f'    typePasswordDesc: "Показывает контент, защищенный паролем",',
                      f'    typeMulti-linkDesc: "Несколько ссылок, меняющихся по дню/времени",']

# --- Swedish ---
qrLabels['sv'] = [f'    qrTypeBusinessCard: "Digitalt kort",',
                       f'    qrTypeGoogleReview: "Google-recension",',
                       f'    qrTypePassword: "Lösenord",',
                       f'    qrTypeMultiLink: "Multi-länk",']
qrDescs['sv'] = [f'    typeBusiness-cardDesc: "Digital profil sparas i telefonen",',
                      f'    typeGoogle-reviewDesc: "Öppnar en Google-recension",',
                      f'    typePasswordDesc: "Visar lösenordsskyddat innehåll",',
                      f'    typeMulti-linkDesc: "Flera länkar som ändras efter dag/tid",']

# --- Thai ---
qrLabels['th'] = [f'    qrTypeBusinessCard: "นามบัตรดิจิทัล",',
                       f'    qrTypeGoogleReview: "รีวิว Google",',
                       f'    qrTypePassword: "รหัสผ่าน",',
                       f'    qrTypeMultiLink: "หลายลิงก์",']
qrDescs['th'] = [f'    typeBusiness-cardDesc: "โปรไฟล์ดิจิทัลที่บันทึกในโทรศัพท์",',
                      f'    typeGoogle-reviewDesc: "เปิดหน้ารีวิว Google",',
                      f'    typePasswordDesc: "แสดงเนื้อหาที่ป้องกันด้วยรหัสผ่าน",',
                      f'    typeMulti-linkDesc: "หลายลิงก์ที่เปลี่ยนแปลงตามวัน/เวลา",']

# --- Turkish ---
qrLabels['tr'] = [f'    qrTypeBusinessCard: "Dijital Kart",',
                       f'    qrTypeGoogleReview: "Google Yorumu",',
                       f'    qrTypePassword: "Şifre",',
                       f'    qrTypeMultiLink: "Çoklu Bağlantı",']
qrDescs['tr'] = [f'    typeBusiness-cardDesc: "Telefona kaydedilen dijital profil",',
                      f'    typeGoogle-reviewDesc: "Bir Google yorumu açar",',
                      f'    typePasswordDesc: "Şifre korumalı içeriği gösterir",',
                      f'    typeMulti-linkDesc: "Güne/saate göre değişen birden çok bağlantı",']

# --- Ukrainian ---
qrLabels['uk'] = [f'    qrTypeBusinessCard: "Цифрова візитка",',
                       f'    qrTypeGoogleReview: "Відгук Google",',
                       f'    qrTypePassword: "Пароль",',
                       f'    qrTypeMultiLink: "Мульти-посилання",']
qrDescs['uk'] = [f'    typeBusiness-cardDesc: "Цифровий профіль зберігається в телефон",',
                      f'    typeGoogle-reviewDesc: "Відкриває сторінку відгуку Google",',
                      f'    typePasswordDesc: "Показує захищений паролем вміст",',
                      f'    typeMulti-linkDesc: "Кілька посилань, що змінюються залежно від дня/часу",']

# --- Vietnamese ---
qrLabels['vi'] = [f'    qrTypeBusinessCard: "Thẻ kỹ thuật số",',
                       f'    qrTypeGoogleReview: "Đánh giá Google",',
                       f'    qrTypePassword: "Mật khẩu",',
                       f'    qrTypeMultiLink: "Nhiều liên kết",']
qrDescs['vi'] = [f'    typeBusiness-cardDesc: "Hồ sơ kỹ thuật số được lưu trong điện thoại",',
                      f'    typeGoogle-reviewDesc: "Mở trang đánh giá Google",',
                      f'    typePasswordDesc: "Hiển thị nội dung được bảo vệ bằng mật khẩu",',
                      f'    typeMulti-linkDesc: "Nhiều liên kết thay đổi theo ngày/giờ",']

# --- zh-CN ---
qrLabels['zh-CN'] = [f'    qrTypeBusinessCard: "电子名片",',
                          f'    qrTypeGoogleReview: "Google评价",',
                          f'    qrTypePassword: "密码",',
                          f'    qrTypeMultiLink: "多链接",']
qrDescs['zh-CN'] = [f'    typeBusiness-cardDesc: "保存在手机中的数字档案",',
                         f'    typeGoogle-reviewDesc: "打开Google评价页面",',
                         f'    typePasswordDesc: "显示受密码保护的内容",',
                         f'    typeMulti-linkDesc: "根据日期/时间变化的多个链接",']

# --- zh-TW ---
qrLabels['zh-TW'] = [f'    qrTypeBusinessCard: "電子名片",',
                          f'    qrTypeGoogleReview: "Google評價",',
                          f'    qrTypePassword: "密碼",',
                          f'    qrTypeMultiLink: "多連結",']
qrDescs['zh-TW'] = [f'    typeBusiness-cardDesc: "保存在手機中的數位檔案",',
                         f'    typeGoogle-reviewDesc: "打開Google評價頁面",',
                         f'    typePasswordDesc: "顯示受密碼保護的內容",',
                         f'    typeMulti-linkDesc: "根據日期/時間變化的多個連結",']

# Find all qrTypeTelegram line indices and typeTelegramDesc line indices
qrTypeLines = []
typeDescLines = []
for idx, line in enumerate(lines):
    stripped = line.strip()
    if stripped.startswith('qrTypeTelegram:'):
        qrTypeLines.append(idx)
    elif stripped.startswith('typeTelegramDesc:'):
        typeDescLines.append(idx)

print(f"Found {len(qrTypeLines)} qrTypeTelegram lines and {len(typeDescLines)} typeTelegramDesc lines")

# Now insert - we need to go backwards to preserve line numbers
# Build list of (line_idx, text_to_insert) for each insertion
insertions = []
for lang_idx, lang in enumerate(langs):
    if lang_idx < len(qrTypeLines):
        line_idx = qrTypeLines[lang_idx]
        insert_lines = qrLabels[lang]
        insertions.append((line_idx + 1, insert_lines))  # Insert AFTER the line
    if lang_idx < len(typeDescLines):
        line_idx = typeDescLines[lang_idx]
        insert_lines = qrDescs[lang]
        insertions.append((line_idx + 1, insert_lines))

# Sort by line index descending so we insert from bottom up
insertions.sort(key=lambda x: x[0], reverse=True)

for line_idx, new_lines in insertions:
    for new_line in reversed(new_lines):
        # Quote keys with hyphens in desc keys
        fixed_line = new_line
        for k in ['typeBusiness-cardDesc', 'typeGoogle-reviewDesc', 'typeMulti-linkDesc']:
            if k + ':' in fixed_line and not fixed_line.strip().startswith('"'):
                fixed_line = fixed_line.replace(f'    {k}:', f'    "{k}":')
        lines.insert(line_idx, fixed_line)
    print(f"Inserted at line {line_idx}: {len(new_lines)} lines")

result = '\n'.join(lines)
with open('src/lib/i18n.ts', 'w', encoding='utf-8') as f:
    f.write(result)

print("Done! Updated i18n.ts")
