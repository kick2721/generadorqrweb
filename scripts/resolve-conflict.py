import re
path = r"C:\Users\Mi niña\Downloads\Claude\projects\qrwing\src\components\QRForm.tsv"
path = r"C:\Users\Mi niña\Downloads\Claude\projects\qrwing\src\components\QRForm.tsx"
with open(path, "rb") as f:
    data = f.read()
text = data.decode("utf-8")
# Remove all conflict markers, keep HEAD side
text = re.sub(r'<<<<<<< HEAD\n(.*?)\n=======\n.*?\n>>>>>>> [^\n]+\n', r'\1\n', text, flags=re.DOTALL)
with open(path, "w", encoding="utf-8") as f:
    f.write(text)
print("Resolved")
