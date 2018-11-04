import json
import spacy

nlp = spacy.load('en_core_web_lg')

def get_proximity_to_weather(word):
    word = strip_hashtag(word)
    return nlp.vocab[word].similarity(nlp.vocab[u'weather'])

def strip_hashtag(hashtag):
    return hashtag.replace("#", "")

with open('../data/twitter/twitter_data.json') as file:
    map = {}
    j = json.loads(file.read())
    for state, trends in j.items():
        trends = trends[0]['trends']
        count = 0
        total = 0
        for word in trends:
            count += 1
            total += get_proximity_to_weather(strip_hashtag(word))
        total = total / count
        map[state] = round(total * 1000, 2)
    with open("./twitter_data_processed.json", "w+") as f:
        f.write(json.dumps(map))