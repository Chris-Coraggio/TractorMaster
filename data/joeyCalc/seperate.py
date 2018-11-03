import json

learning_data = json.load(open("learning_data.json", 'r'))

s = set()
files = {}

for row in learning_data:
    cat = row['category']
    if cat not in s:
        files[cat] = open("catData/" + cat + ".json", 'w')
        s.add(cat)
        files[cat].write('[')
    json.dump(row, files[cat])
    files[cat].write(',\n')
for f in files:
    files[f].write(']')