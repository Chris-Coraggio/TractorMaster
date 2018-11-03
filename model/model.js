let tf = require('@tensorflow/tfjs')
let requireDir = require('require-dir');
let data = requireDir(__dirname + '/../data/joeyCalc/catData');
let cfData = data['Cattle Feed'];

Date.prototype.isLeapYear = function () {
    var year = this.getFullYear();
    if ((year & 3) != 0) return false;
    return ((year % 100) != 0 || (year % 400) == 0);
};

Date.prototype.getDOY = function () {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = this.getMonth();
    var dn = this.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if (mn > 1 && this.isLeapYear()) dayOfYear++;
    return dayOfYear;
};


const maxTemp = Math.max.apply(Math, cfData.map(item => item.temp));
const maxPrec = Math.max.apply(Math, cfData.map(item => item.prec));
const maxCount = Math.max.apply(Math, cfData.map(item => item.count));

const trainingSet = cfData.splice(0, cfData.length-10)
const testSet = cfData;

// const trainingData = tf.tensor2d(trainingSet.map(item => [
//     item.temp / maxTemp, item.prec / maxPrec
// ]));
// const outputData = tf.tensor2d(trainingSet.map(item => [
//     item.count / maxCount
// ]));
// const testData = tf.tensor2d(testSet.map(item => [
//     item.temp / maxTemp, item.prec / maxPrec
// ]));

const trainingData = tf.tensor2d(trainingSet.map(item => [
    item.temp
]));
const outputData = tf.tensor2d(trainingSet.map(item => [
   item.count
]));
const testData = tf.tensor2d(testSet.map(item => [
    item.temp
]));

const model = tf.sequential()

model.add(tf.layers.dense({
    inputShape: 1,
    units: 4
}));
model.add(tf.layers.dense({
    inputShape: 4,
    units: 1
}));
model.add(tf.layers.dense({
    units: 1
}));
model.compile({
    loss: "meanSquaredError",
    optimizer: tf.train.adam(0.06),
});
model.fit(trainingData, outputData, {epochs: 100}).then((history) => {
    console.log(history);
    // console.log(testSet)
    // model.predict(testData).print()
})