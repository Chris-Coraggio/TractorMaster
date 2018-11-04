module.exports = {
    buildData: (cfData) => {
        let bins = {}

        cfData.forEach((point) => {
            let bin = Math.floor(point.prec / 15).toString();
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
            bin.bin = i+1;
        })
        return (Object.values(positiveBins));
    }
}