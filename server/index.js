let express = require("express");
const app = express();
const bodyParser = require("body-parser");

let eval = require('../model/eval.js');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.get('/map', (req, res) => {
    res.sendFile(__dirname + "\\index.html")
})

app.get('/data', (req, res) => {
    console.log("Hit the route")
    res.sendFile("data/StoreLocator.json", {root: __dirname})
})

app.get('/stores/:state', (req, res) => {
    res.sendFile("data/stores.json", {root: __dirname})
})

app.post('/count', (req, res) => {
    let date = req.body.date;
    let state = req.body.state;
    let category = req.body.category;
    console.log(date,state,category);
    if(!date || !state || !category){
        res.status(401)
    }
    res.status(200).end(JSON.stringify({prediction: eval.predictCount(date,state,category)}));
})

// fix dependency on files
app.get("/*.*", (req, res, next) => {
    res.sendFile(`${req.params[0]}.${req.params[1]}`, {root: __dirname});
});

app.listen(process.env.PORT || port, () => {
	var thePort = (process.env.PORT == undefined ? port : process.env.PORT)
	console.log('Server is listening on port ' + thePort + "!");
});

let states = {
    "Alabama": {"latitude": 2.7794, "longitude": 86.8287},
    "Alaska": {"latitude": 4.0685, "longitude": 152.2782},
    "Arizona": {"latitude": 4.2744, "longitude": 111.6602},
    "Arkansas": {"latitude": 4.8938, "longitude": 92.4426},
    "California": {"latitude": 37.1841, "longitude": 119.4696},
    "Colorado": {"latitude": 8.9972, "longitude": 105.5478},
    "Connecticut": {"latitude": 1.6219, "longitude": 72.7273},
    "Delaware": {"latitude": 8.9896, "longitude": 75.5050},
    "Florida": {"latitude": 8.6305, "longitude": 82.4497},
    "Georgia": {"latitude": 2.6415, "longitude": 83.4426},
    "Hawaii": {"latitude": 0.2927, "longitude": 156.3737},
    "Idaho": {"latitude": 4.3509, "longitude": 114.6130},
    "Illinois": {"latitude": 0.0417, "longitude": 89.1965},
    "Indiana": {"latitude": 9.8942, "longitude": 86.2816},
    "Iowa": {"latitude": 42.0751, "longitude": 93.4960},
    "Kansas": {"latitude": 8.4937, "longitude": 98.3804},
    "Kentucky": {"latitude": 7.5347, "longitude": 85.3021},
    "Louisiana": {"latitude": 1.0689, "longitude": 91.9968},
    "Maine": {"latitude": 5.3695, "longitude": 69.2428},
    "Maryland": {"latitude": 9.0550, "longitude": 76.7909},
    "Massachusetts": {"latitude": 42.2596, "longitude": 71.8083},
    "Michigan": {"latitude": 4.3467, "longitude": 85.4102},
    "Minnesota": {"latitude": 46.2807, "longitude": 94.3053},
    "Mississippi": {"latitude": 2.7364, "longitude": 89.6678},
    "Missouri": {"latitude": 38.3566, "longitude": 92.4580},
    "Montana": {"latitude": 7.0527, "longitude": 109.6333},
    "Nebraska": {"latitude": 1.5378, "longitude": 99.7951},
    "Nevada": {"latitude": 39.3289, "longitude": 116.6312},
    "New Hampshire": {"latitude": 3.6805, "longitude": 71.5811},
    "New Jersey": {"latitude": 0.1907, "longitude": 74.6728},
    "New Mexico": {"latitude": 4.4071, "longitude": 106.1126},
    "New York": {"latitude": 2.9538, "longitude": 75.5268},
    "North Carolina": {"latitude": 5.5557, "longitude": 79.3877},
    "North Dakota": {"latitude": 7.4501, "longitude": 100.4659},
    "Ohio": {"latitude": 0.2862, "longitude": 82.7937},
    "Oklahoma": {"latitude": 5.5889, "longitude": 97.4943},
    "Oregon": {"latitude": 3.9336, "longitude": 120.5583},
    "Pennsylvania": {"latitude": 0.8781, "longitude": 77.7996},
    "Rhode Island": {"latitude": 1.6762, "longitude": 71.5562},
    "South Carolina": {"latitude": 3.9169, "longitude": 80.8964},
    "South Dakota": {"latitude": 4.4443, "longitude": 100.2263},
    "Tennessee": {"latitude": 5.8580, "longitude": 86.3505},
    "Texas": {"latitude": 1.4757, "longitude": 99.3312},
    "Utah": {"latitude": 9.3055, "longitude": 111.6703},
    "Vermont": {"latitude": 4.0687, "longitude": 72.6658},
    "Virginia": {"latitude": 7.5215, "longitude": 78.8537},
    "Washington": {"latitude": 47.3826, "longitude": 120.4472},
    "West Virginia": {"latitude": 8.6409, "longitude": 80.6227},
    "Wisconsin": {"latitude": 4.6243, "longitude": 89.9941},
    "Wyoming": {"latitude": 2.9957, "longitude": 107.5512}
}