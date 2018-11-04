module.exports = {
    polynomial: (a,b,c,d,e,x, scale) => {
        // console.log(a,b,c,d,e,x,scale);
        return scale*(a*Math.pow(x, 4) + b*Math.pow(x, 3) + c *Math.pow(x, 2) + d*x + e)
    },
    exponential: (a, x, scale) => {
        return scale * (1/(a*x));
    }
}