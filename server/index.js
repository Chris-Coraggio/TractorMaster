var express = require("express")
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
const port = 3000;

app.get('/', (req, res) => {
	// Display a test message
	res.send('Hello World!')
})

app.get('/map', (req, res) => {
    res.sendFile(__dirname + "\\index.html")
})

app.get('/data', (req, res) => {
    console.log("Hit the route")
    res.sendFile("data/StoreLocator.json", {root: __dirname})
})

// fix dependency on files
app.get("/*.*", (req, res, next) => {
    res.sendFile(`${req.params[0]}.${req.params[1]}`, {root: __dirname});
});

app.listen(process.env.PORT || port, () => {
	var thePort = (process.env.PORT == undefined ? port : process.env.PORT)
	console.log('GetTogether is listening on port ' + thePort + "!");
});