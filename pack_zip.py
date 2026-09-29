import os
import zipfile

# Some files in the runtime have epoch-0 timestamps, which ZIP forbids.
# Override mtime for every entry.
def _safe_zipinfo(arcname):
    zi = zipfile.ZipInfo(arcname, date_time=(2026, 1, 1, 0, 0, 0))
    zi.compress_type = zipfile.ZIP_DEFLATED
    zi.external_attr = 0o644 << 16
    return zi

ROOT = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(ROOT, "public")

# Два имени одного архива: /soogy.zip и /kodovaya-baza.zip
OUT_NAMES = ["soogy.zip", "kodovaya-baza.zip"]

SKIP_DIRS = {"node_modules", ".git", "dist", ".convex", ".sst", ".vercel", "mini-site"}
SKIP_FILES = {
    "bun.lock",
    "package-lock.json",
}
SKIP_PREFIXES = (".env",)  # никогда не пакуем секреты

def collect_full_files():
    """Все файлы проекта для папки soogy-full/."""
    out = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in sorted(filenames):
            if fn in SKIP_FILES or fn.startswith(SKIP_PREFIXES) or fn.endswith(".zip"):
                continue
            full = os.path.join(dirpath, fn)
            out.append((full, os.path.relpath(full, ROOT)))
    return out

def collect_mini_files():
    """Три файла мини-версии для папки mini-site/."""
    out = []
    mini = os.path.join(ROOT, "mini-site")
    for fn in sorted(os.listdir(mini)):
        full = os.path.join(mini, fn)
        if os.path.isfile(full):
            out.append((full, os.path.join("mini-site", fn)))
    return out

FULL = collect_full_files()
MINI = collect_mini_files()

for name in OUT_NAMES:
    out_path = os.path.join(PUBLIC, name)
    count = 0
    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as z:
        for full, arc in FULL:
            with open(full, "rb") as f:
                z.writestr(_safe_zipinfo("soogy-full/" + arc), f.read())
            count += 1
        for full, arc in MINI:
            with open(full, "rb") as f:
                z.writestr(_safe_zipinfo(arc), f.read())
            count += 1
    print(f"{name}: entries={count}, size KB={round(os.path.getsize(out_path) / 1024, 1)}")

print("soogy-full files:", len(FULL), "| mini-site files:", len(MINI))
