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
module.exports = {
    buildData: (cfData) => {
        let bins = {}

        cfData.forEach((point, i) => {
            let bin = Math.floor(i / 25).toString();
            if (!bins[bin]) {
                bins[bin] = {
                    bin: parseInt(bin),
                    count: point.count,
                    binSize: 1
                }
            } else {
                bins[bin].count += point.count;
                bins[bin].binSize++;
            }
        })
        positiveBins = []
        Object.values(bins).forEach((bin) => {
            positiveBins.push(bin);
        });
        positiveBins = positiveBins.sort((a, b) => a.bin - b.bin);
        positiveBins.forEach((bin, i) => {
            bin.bin = i;
        })
        return (Object.values(positiveBins));
    }
}