import requests
import json

token = r"YfAmmhMqpMVWFLTTmvuzVagocXTWawRi"
base_url = r"https://www.ncdc.noaa.gov/cdo-web/api/v2/"
dataset_url = r"data?datasetid=GHCND&locationid="
date_url = r"&startdate="
date_url_2 = r"&enddate="
station_url = r"stations?locationid="

headers = {'token': token}

state = "FIPS:01"

stations_url = base_url + station_url + state + "&limit=1"

station_req = requests.get(stations_url, headers=headers)
print(station_req.json())
station_stuff = json.loads(station_req.json())
print(station_stuff["id"])

state = "FIPS:01"
date = "2017-01-01"

data_url = base_url + dataset_url + state + date_url + date + date_url_2 + date
print(data_url)

r = requests.get(url, headers=headers)
print(r.json())

statesMap = {
"Alabama": "FIPS:01",
"Alaska": "FIPS:02",
"Arizona": "FIPS:04",
"Arkansas": "FIPS:05",
"California": "FIPS:06",
"Colorado": "FIPS:08",
"Connecticut": "FIPS:09",
"Delaware": "FIPS:10",
"Florida": "FIPS:12",
"Georgia": "FIPS:13",
"Hawaii": "FIPS:15",
"Idaho": "FIPS:16",
"Illinois": "FIPS:17",
"Indiana": "FIPS:18",
"Iowa": "FIPS:19",
"Kansas": "FIPS:20",
"Kentucky": "FIPS:21",
"Louisiana": "FIPS:22",
"Maine": "FIPS:23",
"Maryland": "FIPS:24",
"Massachusetts": "FIPS:25",
"Michigan": "FIPS:26",
"Minnesota": "FIPS:27",
"Mississippi": "FIPS:28",
"Missouri": "FIPS:29",
"Montana": "FIPS:30",
"Nebraska": "FIPS:31",
"Nevada": "FIPS:32",
"New Hampshire": "FIPS:33",
"New Jersey": "FIPS:34",
"New Mexico": "FIPS:35",
"New York": "FIPS:36",
"North Carolina": "FIPS:37",
"North Dakota": "FIPS:38",
"Ohio": "FIPS:39",
"Oklahoma": "FIPS:40",
"Oregon": "FIPS:41",
"Pennsylvania": "FIPS:42",
"Rhode Island": "FIPS:44",
"South Carolina": "FIPS:45",
"South Dakota": "FIPS:46",
"Tennessee": "FIPS:47",
"Texas": "FIPS:48",
"Utah": "FIPS:49",
"Vermont": "FIPS:50",
"Virginia": "FIPS:51",
"Washington": "FIPS:53",
"West Virginia": "FIPS:54",
"Wisconsin": "FIPS:55",
"Wyoming": "FIPS:56"
}