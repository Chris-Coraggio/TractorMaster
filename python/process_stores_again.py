import json

statesMap = {
"AL": "FIPS:01",
"AK": "FIPS:02",
"AZ": "FIPS:04",
"AR": "FIPS:05",
"CA": "FIPS:06",
"CO": "FIPS:08",
"CT": "FIPS:09",
"DE": "FIPS:10",
"FL": "FIPS:12",
"GA": "FIPS:13",
"HI": "FIPS:15",
"ID": "FIPS:16",
"IL": "FIPS:17",
"IN": "FIPS:18",
"IA": "FIPS:19",
"KS": "FIPS:20",
"KY": "FIPS:21",
"LA": "FIPS:22",
"ME": "FIPS:23",
"MD": "FIPS:24",
"MA": "FIPS:25",
"MI": "FIPS:26",
"MN": "FIPS:27",
"MS": "FIPS:28",
"MO": "FIPS:29",
"MT": "FIPS:30",
"NE": "FIPS:31",
"NV": "FIPS:32",
"NH": "FIPS:33",
"NJ": "FIPS:34",
"NM": "FIPS:35",
"NY": "FIPS:36",
"NC": "FIPS:37",
"ND": "FIPS:38",
"OH": "FIPS:39",
"OK": "FIPS:40",
"OR": "FIPS:41",
"PA": "FIPS:42",
"RI": "FIPS:44",
"SC": "FIPS:45",
"SD": "FIPS:46",
"TN": "FIPS:47",
"TX": "FIPS:48",
"UT": "FIPS:49",
"VT": "FIPS:50",
"VA": "FIPS:51",
"WA": "FIPS:53",
"WV": "FIPS:54",
"WI": "FIPS:55",
"WY": "FIPS:56"
}

with open('../server/data/final_store_data.json') as file:
    map = {}
    for state in statesMap.keys():
        map[state] = []
    j = json.loads(file.read())
    for item in j:
        state = item['state']
        lng = item['longitude']
        lat = item['latitude']
        nick = item['nickname']
        num = item['storenum']
        phone = item['phone']
        map[state].append({
            'longitude': lng,
            'latitude': lat,
            'nickname': nick,
            'phone': phone
        })
    with open("./stores.json", "w+") as f:
        f.write(json.dumps(map))