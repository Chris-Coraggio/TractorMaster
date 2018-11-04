#!/usr/bin/env python

#-----------------------------------------------------------------------
# twitter-trends
#  - lists the current global trending topics
#-----------------------------------------------------------------------

from twitter import *

# Variables that contains the user credentials to access Twitter API 
ACCESS_TOKEN = '2826611838-NqvSMkg4ujVPLWerFdxCH4PBjUXqPTs5l1nr0SD'
ACCESS_SECRET = 'QquERKrkmOrdmbsMQz3L31uy23ntlQ1I7qUQRcr6bKshf'
CONSUMER_KEY = 'sMgnSJwaz9s493FmiMdG5MFGK'
CONSUMER_SECRET = 'ikeiMUlpTn0Tc35aF53GLoBVciL6lu5JMcsaixO0JXw29Ya5Ou'

import sys
sys.path.append(".")
import config

#-----------------------------------------------------------------------
# create twitter API object
#-----------------------------------------------------------------------
twitter = Twitter(auth = OAuth(ACCESS_TOKEN,
                  ACCESS_SECRET,
                  CONSUMER_KEY,
                  CONSUMER_SECRET))

statesMap = {
    # "AL": "2364559",
    # "AZ": "2471390",
    "AR": "2440351",
    # "CA": "2486340",
    # "CO": "2391279",
    "CT": "2498846",
    "DE": "2347566",
    # "FL": "2503713",
    # "GA": "2357024",
    "ID": "2366355",
    "IL": "2357467",
    # "IN": "2427032",
    "IA": "2376926",
    "KS": "2464639",
    # "KY": "2442327",
    # "LA": "2359991",
    "ME": "2357379",
    # "MD": "2358820",
    # "MA": "2367105",
    "MI": "2412843",
    # "MN": "2452078",
    # "MS": "2428184",
    "MO": "2364254",
    "MT": "2364254",
    # "NE": "2465512",
    # "NV": "2436704",
    "NH": "2444674",
    "NJ": "2429187",
    # "NM": "2352824",
    "NY": "2482949",
    # "NC": "2478307",
    "ND": "2364681",
    # "OH": "2381475",
    # "OK": "2464592",
    # "OR": "2475687",
    # "PA": "2418046",
    # "RI": "2477058",
    "SC": "2383552",
    "SD": "2494126",
    # "TN": "2457170",
    # "TX": "2388929",
    # "UT": "2487610",
    "VT": "2347604",
    # "VA": "2480894",
    # "WA": "2490383",
    "WV": "2378317",
    "WI": "2443945",
    "WY": "2379552"
}

results = {}
for key, value in statesMap.items():
    try:
        results[key] = twitter.trends.place(_id = value)
        print(results[key])
    except Exception as e:
        print(e)

with open("twitter_results.json", "w+") as f:
    f.write(str(results))
