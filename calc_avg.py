from pathlib import Path
import re
from datetime import datetime

for path in Path("output/client-log").resolve().rglob("*"):
    numbers = [int(n) for n in re.findall(r"n = (\d+)\n", path.read_text())]
    foo = [
        datetime.strptime(t, "%Y-%m-%dT%H:%M:%S.%f")
        for t in re.findall(r"BURST\n.* (?:(.*?)Z)", path.read_text())
    ]
    bar = []
    last = 0
    avg = 0
    total = 0
    for number in numbers:
        baz = (foo[last + number - 1] - foo[last]).total_seconds()
        avg += baz
        total += 1
        if baz <= 0.2 and number >= 3:
            bar.append(baz)
        last += number

    if len(numbers):
        print(f"total bursts         = {len(numbers)}")
        print(f"bursts within dt     = {len(bar)}")
        print(f"max burst time in dt = {max(bar)}")
        print(f"min burst time in dt = {min(bar)}")
        print(f"avg burst time in dt = {sum(bar) / len(bar)}")
        print(f"avg burst time       = {avg / total}")
        print(f"avg burst len        = {sum(numbers) / len(numbers)}")
        print("\n")
