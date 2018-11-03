import requests

token = "tHCCKVwArUEFKLQfTXDshSpAXEwvIxsX"
base_url = "https://www.ncdc.noaa.gov/cdo-web/api/v2/"

start = "2017-01-01"
end = "2018-01-01"

headers = {'token': token}

def getStation(fips, offset):
    url = base_url + "stations?datatypeid=TMAX&datatypeid=PRCP&datasetid=GHCND&startdate=" + start + "&enddate=" + end + "&locationid=" + fips + "&limit=1&offset=" + str(offset)
    return requests.get(url, headers=headers).json()

def getWeather(station):
    url = base_url + "data?startdate=" + start + "&enddate=" + end + "&datasetid=GHCND&stationid=" + station + "&limit=1000&datatypeid=TMAX&datatypeid=PRCP"
    return requests.get(url, headers=headers).json()