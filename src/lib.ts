function randomNormal(mean: number = 0, stdDev: number = 1, min: number = -Infinity, max: number = Infinity): number {
    let u1 = Math.random();
    let u2 = Math.random();
    let randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) *
        Math.cos(2.0 * Math.PI * u2);
    let randNormal = mean + stdDev * randStdNormal;
    return Math.max(min, Math.min(max, randNormal));
}
const arrSum = (...inp: number[][]) => inp.reduce((acc, term) => term.map((val, i) => val + acc[i]))
const arrProduct = (...inp: number[][]) => inp.reduce((acc, term) => term.map((val, i) => val * acc[i]))
function roundDigit(num: number, digits = 4) {
    return Math.round(num * (10 ** digits)) / 10 ** digits
}
const matrixProduct = (...matricies: number[][][]) => matricies.reduce((acc,mat)=>acc.map((row, i) => row.map((val, j) => val * mat[i][j])))
const matrixSum = (...matricies: number[][][]) => matricies.reduce((acc,mat)=>acc.map((row, i) => row.map((val, j) => val + mat[i][j])))
const matrixVectorProduct = (matrix: number[][], vector: number[]) => matrix.map((row, i) => row.map((val, j) => val * vector[j]))
function stDev(arr: number[]) {
    const mean = arr.reduce((acc, val) => acc + val) / arr.length
    const variance = arr.reduce((acc, val) => acc + (val - mean) ** 2) / arr.length
    return Math.sqrt(variance)
}