path = r"C:\Users\Mi niña\Downloads\Claude\projects\qrwing\src\lib\i18n.ts"

with open(path, "rb") as f:
    raw = f.read()

lines = raw.split(b"\r\n")
if lines and lines[-1] == b"":
    lines = lines[:-1]

text_lines = [l.decode("utf-8") for l in lines]

new_lines = []
skip_until = -1

for i, line in enumerate(text_lines):
    if i < skip_until:
        continue
    stripped = line.strip()
    
    # If we find logoProOnly, check if there's a duplicate right after
    if stripped.startswith("logoProOnly:"):
        # Look ahead: if the next non-blank is also logoProOnly, skip this block
        j = i + 1
        while j < len(text_lines) and text_lines[j].strip() == "":
            j += 1
        if j < len(text_lines) and text_lines[j].strip().startswith("logoProOnly:"):
            # Skip this block entirely (it's the first of a duplicate)
            k = j + 1
            while k < len(text_lines) and text_lines[k].strip() == "":
                k += 1
            if k < len(text_lines) and text_lines[k].strip().startswith("logoHelp:"):
                skip_until = k + 1  # skip the logoHelp too
                continue
            else:
                skip_until = j
                continue
    
    new_lines.append(line)

# Re-encode
encoded = ("\r\n".join(new_lines) + "\r\n").encode("utf-8")

with open(path, "wb") as f:
    f.write(encoded)

print(f"Reduced from {len(text_lines)} to {len(new_lines)} lines")
