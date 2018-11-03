import requests
import json
import noaaFunctions as noaa

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

class DataPoint():
    def __init__(self, date, state, value):
        self.state = state
        self.date = date
        self.value = value

temps = []
prcps = []

token = "YfAmmhMqpMVWFLTTmvuzVagocXTWawRi"
base_url = "https://www.ncdc.noaa.gov/cdo-web/api/v2/"
dataset_url = r"data?datasetid=GHCND&locationid="
date_url = r"&startdate="
date_url_2 = r"&enddate="
station_url = r"stations?locationid="

temperatureFile = open("../data/tdata.json", "w")
precFile = open("../data/pdata.json", "w")

temperatureFile.write("[")
precFile.write("[")

headers = {'token': token}

count = 0

for state, fips in statesMap.iteritems():
    offset = 1
    r = noaa.getStation(fips, offset)["results"][0]
    while r["datacoverage"] < 0.95:
        offset += 1
        r = noaa.getStation(fips, offset)["results"][0]
    station = r["id"]
    for data in noaa.getWeather(station)["results"]:
        if data["datatype"] == "TMAX":
            json.dump(DataPoint(data["date"][:10], state, data["value"]).__dict__, temperatureFile)
            temperatureFile.write(",\n")
        elif data["datatype"] == "PRCP":
            json.dump(DataPoint(data["date"][:10], state, data["value"]).__dict__, precFile)
            precFile.write(",\n")
    count += 1
    print "[" + ("="*count) + " "*(50-count) + "]", str(count/.5) + "%"

temperatureFile.write("]")
precFile.write("]")

temperatureFile.close()
precFile.close()