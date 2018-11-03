import csv
import json

csvfile = open('data.csv', 'r')
jsonfile = open('learningdata.json', 'w')
fieldnames = ("DATE","CATEGORY ","STATE","COUNT")
reader = csv.DictReader( csvfile, fieldnames)
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write('\n')