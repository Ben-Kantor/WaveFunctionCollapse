function randomNormal(mean: number = 0, stdDev: number = 1, min: number = -Infinity, max: number = Infinity): number {
    let u1 = Math.random();
    let u2 = Math.random();
    let randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) *
        Math.cos(2.0 * Math.PI * u2);
    let randNormal = mean + stdDev * randStdNormal;
    return Math.max(min, Math.min(max, randNormal));
}
const arrSum = (...inp: number[][]) => inp.reduce((acc, term) => term.map((val, i) => val + acc[i]))
const arrProduct =  (...inp: number[][]) => inp.reduce((acc, term) => term.map((val, i) => val * acc[i]))
function roundDigit(num: number, digits = 4){
    return Math.round(num * (10 ** digits)) / 10 ** digits
}