import requests
import spacy

base_url = r"https://api.twitter.com/1.1/trends/"

statesMap = {
    "AL": "2347559",
    "AK": "2347560",
    "AZ": "2347561",
    "AR": "2347562",
    "CA": "2347563",
    "CO": "2347564",
    "CT": "2347565",
    "DE": "2347566",
    "FL": "2347568",
    "GA": "2347569",
    "HI": "2347570",
    "ID": "2347571",
    "IL": "2347572",
    "IN": "2347573",
    "IA": "2347574",
    "KS": "2347575",
    "KY": "2347576",
    "LA": "2347577",
    "ME": "2347578",
    "MD": "2347579",
    "MA": "2347580",
    "MI": "2347581",
    "MN": "2347582",
    "MS": "2347583",
    "MO": "2347584",
    "MT": "2347585",
    "NE": "2347586",
    "NV": "2347587",
    "NH": "2347588",
    "NJ": "2347589",
    "NM": "2347590",
    "NY": "2347591",
    "NC": "2347592",
    "ND": "2347593",
    "OH": "2347594",
    "OK": "2347595",
    "OR": "2347596",
    "PA": "2347597",
    "RI": "2347598",
    "SC": "2347599",
    "SD": "2347600",
    "TN": "2347601",
    "TX": "2347602",
    "UT": "2347603",
    "VT": "2347604",
    "VA": "2347605",
    "WA": "2347606",
    "WV": "2347607",
    "WI": "2347608",
    "WY": "2347609"
}

def get_top_hashtags_for_state(state):
    url = base_url + "place.json?id=" + statesMap[state]
    return requests.get(url, headers=headers).json()

def get_proximity_to_weather(word):
    word = strip_hashtag(word)
    nlp = spacy.load('en_core_web_lg')
    print(nlp.vocab[word].similarity(nlp.vocab[u'weather']))

def strip_hashtag(hashtag):
    return hashtag.replace("#", "")