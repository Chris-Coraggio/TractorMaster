let models = require("../data/models.json");
let temps = require("../data/tdata.json");
let precs = require("../data/pdata.json");

const TEMP_BIN_CUTOFF = 20;
const DATE_BIN_CUTOFF = 25;
const PREC_BIN_CUTOFF = 15;

data = {};

temps.forEach((row) => {
    if(!data[row.state]){
        data[row.state] = {}
    }
    data[row.state][row.date] = {
        temp: row.temperature
    }
});
precs.forEach((row) => {
    try{
        data[row.state][row.date].prec = row.precipitation;
    } catch(err){}
})

module.exports = {
    polynomial: (a,b,c,d,e,x, scale) => {
        // console.log(a,b,c,d,e,x,scale);
        return scale*(a*Math.pow(x, 4) + b*Math.pow(x, 3) + c *Math.pow(x, 2) + d*x + e)
    },
    exponential: (a, x, scale) => {
        return scale * (1/(a*x));
    },
    getDOY: (date) => {
        var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        var mn = date.getMonth();
        var dn = date.getDate();
        var dayOfYear = dayCount[mn] + dn;
        return dayOfYear;
    },
    predictCount: (date, state, category) => {
        date = date.split('-').join('/');
        console.log(date,state,category);
        let temp = data[state][date].temp;
        let prec = data[state][date].prec;
        
        out = 0;
        
        //Temperature
        let bin = Math.floor(temp/TEMP_BIN_CUTOFF);
        let x = bin/models[category].tempBinMax;
        let scale = models[category].tempCountMax;
        let args = models[category].coefsTemp;
        let tempC = module.exports.polynomial(args[0], args[1], args[2], args[3], args[4], x, scale);
        tempC /= models[category].tempBinSizes[bin]
        let d = module.exports.getDOY(new Date(date))
        bin = Math.floor( d  / DATE_BIN_CUTOFF);
        x = bin / models[category].dateBinMax;
        scale = models[category].dateCountMax
        args = models[category].coefsDate
        let dateC = module.exports.polynomial(args[0], args[1], args[2], args[3], args[4], x, scale);
        dateC /= models[category].dateBinSizes[bin]
        bin = Math.floor(prec / PREC_BIN_CUTOFF) + 1;
        x = bin / models[category].precBinMax;
        scale = models[category].precCountMax
        args = models[category].coefsPrec
        let dataP = module.exports.exponential(args[0], x, scale);
        dataP/= models[category].precBinSizes[bin];

        return Math.abs(tempC) + Math.abs(dateC) + Math.abs(dataP)/3;
    }
}