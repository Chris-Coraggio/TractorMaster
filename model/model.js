let tf = require('@tensorflow/tfjs');
let requireDir = require('require-dir');
let data = requireDir(__dirname + '/../data/joeyCalc/catData');
let temperature = require('./temperature.js');
let date = require('./date.js');
let precipitation = require('./precipitation.js');
let eval = require('./eval.js');
let model = require('../data/models.json');

// let t = 278;
// let b = Math.floor(t/20);
// let v = eval.polynomial(...model['Chainsaws'].coefsTemp, b / model['Chainsaws'].tempBinMax, model['Chainsaws'].tempCountMax)
// console.log(v/model['Chainsaws'].tempBinSizes[b]);
// t = 258
// b = Math.floor(t / 25);
// v = eval.polynomial(...model['Chainsaws'].coefsDate, b / model['Chainsaws'].dateBinMax, model['Chainsaws'].dateCountMax)
// console.log(v / model['Chainsaws'].dateBinSizes[b]); t = 0
// b = Math.floor(t / 15) + 1;
// v = eval.exponential(...model['Chainsaws'].coefsPrec, b / model['Chainsaws'].precBinMax, model['Chainsaws'].precCountMax)
// console.log(v / model['Chainsaws'].precBinSizes[b]);
// return;

let models = {};
Object.entries(data).forEach((obj) => {
    let cKey = obj[0];
    let cData = obj[1];

    models[cKey] = {};

    tempBins = temperature.buildData(cData);
    const trainingTempData = tempBins.map(item => item.bin / tempBins.length);
    let tempCountMax = Math.max(...tempBins.map(item => item.count));
    const outputTempData = tempBins.map(item => item.count/tempCountMax);
    
    dateBins = date.buildData(cData);
    const trainingDateData = dateBins.map(item => item.bin / dateBins.length);
    let dateCountMax = Math.max(...dateBins.map(item => item.count));
    const outputDateData = dateBins.map(item => item.count / dateCountMax);
    
    precBins = precipitation.buildData(cData);
    const trainingPrecData = precBins.map(item => item.bin / precBins.length);
    let precCountMax = Math.max(...precBins.map(item => item.count));
    const outputPrecData = precBins.map(item => item.count / precCountMax);

    
    let a = tf.variable(tf.scalar(Math.random()));
    let b = tf.variable(tf.scalar(Math.random()));
    let c = tf.variable(tf.scalar(Math.random()));
    let d = tf.variable(tf.scalar(Math.random()));
    let e = tf.variable(tf.scalar(Math.random()));
    train(trainingTempData, outputTempData, 200)
    models[cKey].coefsTemp = [a.dataSync()[0], b.dataSync()[0], c.dataSync()[0], d.dataSync()[0], e.dataSync()[0]]
    models[cKey].tempCountMax = tempCountMax;
    models[cKey].tempBinMax = tempBins.length;
    models[cKey].tempBinSizes = tempBins.map(i => i.binSize)
    dispose(a, b, c, d, e);
    a = tf.variable(tf.scalar(Math.random()));
    b = tf.variable(tf.scalar(Math.random()));
    c = tf.variable(tf.scalar(Math.random()));
    d = tf.variable(tf.scalar(Math.random()));
    e = tf.variable(tf.scalar(Math.random()));
    train(trainingDateData, outputDateData, 200)
    models[cKey].coefsDate = [a.dataSync()[0], b.dataSync()[0], c.dataSync()[0], d.dataSync()[0], e.dataSync()[0]]
    models[cKey].dateCountMax = dateCountMax;
    models[cKey].dateBinMax = dateBins.length;
    models[cKey].dateBinSizes = dateBins.map(i => i.binSize)
    dispose(a, b, c, d, e);
    a = tf.variable(tf.scalar(Math.random()));
    b = tf.variable(tf.scalar(Math.random()));
    c = tf.variable(tf.scalar(Math.random()));
    d = tf.variable(tf.scalar(Math.random()));
    e = tf.variable(tf.scalar(Math.random()));
    train(trainingPrecData, outputPrecData, 200, true);
    models[cKey].coefsPrec = [a.dataSync()[0]]
    models[cKey].precCountMax = precCountMax;
    models[cKey].precBinMax = precBins.length;
    models[cKey].precBinSizes = precBins.map(i => i.binSize)
    dispose(a, b, c, d, e);

    function loss(pred, labels) {
        const msl = pred.sub(labels).square().mean();
        return msl;
    }
    function predict(x) {
        const xs = tf.tensor1d(x);
        const ys = xs.pow(tf.scalar(4)).mul(a)
        .add(xs.pow(tf.scalar(3)).mul(b))
        .add(xs.square().mul(c))
        .add(xs.mul(d))
        .add(e);
        return ys;
    }
    
    function expPredict(x) {
        const xs = tf.tensor1d(x);
        const ys = tf.scalar(1).div(xs.mul(a));
        return ys;
    }

    function train(xs, y, numIterations, prec = false) {
        const learningRate = 0.5;
        const optimizer = tf.train.sgd(learningRate);
        for (let iter = 0; iter < numIterations; iter++) {
            tf.tidy(() => {
                if (xs.length > 0) {
                    const ys = tf.tensor1d(y);
                    optimizer.minimize(() => loss(prec ? expPredict(xs) : predict(xs), ys))
                }
            })
        }
    }

    function dispose(a, b, c, d, e) {
        a.dispose();
        b.dispose();
        c.dispose();
        d.dispose();
        e.dispose();
    }
    // return;
})
console.log(JSON.stringify(models));