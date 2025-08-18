import json

with open("catalog.json") as f:
    catalog = json.load(f)

lines = ["# Mascot Integration Catalog\n"]
lines.append("Welcome to our partner integration documentation.\n")

for category in catalog["categories"]:
    lines.append(f"## {category['name']}")
    for fmt in category["formats"]:
        url = fmt["docUrl"]
        status = fmt.get("status", "")
        status_txt = f" _(status: {status})_" if status else ""
        lines.append(f"- [{fmt['name']}]({url}){status_txt}")
    lines.append("")  # spacing

with open("index.md", "w") as f:
    f.write("\n".join(lines))

