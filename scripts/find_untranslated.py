import re, os
lang_js = open('js/utils/language.js', 'r', encoding='utf8').read()
keys = {re.sub(r'\s+', ' ', m.group(1)).strip() for m in re.finditer(r"'([^']+)'\s*:\s*'[^']*'", lang_js)}
all = []
for fname in os.listdir('.'):
    if not fname.endswith('.html'):
        continue
    txt = open(fname, 'r', encoding='utf8').read()
    txt = re.sub(r'(?s)<script.*?</script>', ' ', txt)
    txt = re.sub(r'(?s)<style.*?</style>', ' ', txt)
    txt = re.sub(r'<[^>]+>', ' ', txt)
    lines = [re.sub(r'\s+', ' ', l).strip() for l in txt.splitlines()]
    for l in lines:
        if not l or len(l) < 2:
            continue
        if l.isdigit():
            continue
        if re.match(r'^[\d\W]+$', l):
            continue
        if len(l) > 80:
            continue
        if l in keys:
            continue
        all.append((fname, l))
print('Total suggestions', len(all))
for f, l in all:
    print(f, repr(l))
