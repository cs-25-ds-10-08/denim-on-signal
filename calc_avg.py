from pathlib import Path
import re

for path in Path("output/client-log").resolve().rglob("*"):
    numbers = [int(n) for n in re.findall(r"n = (\d+)\n", path.read_text())]
    print(sum(numbers) / len(numbers))
