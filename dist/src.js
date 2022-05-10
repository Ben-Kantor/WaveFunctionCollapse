"use strict";
const dpi = window.devicePixelRatio;
function fix_dpi() {
    let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    canvas.setAttribute('height', (style_height * dpi).toString());
    canvas.setAttribute('width', (style_width * dpi).toString());
}
function randomNormal(mean = 0, stdDev = 1, min = -Infinity, max = Infinity) {
    let u1 = Math.random();
    let u2 = Math.random();
    let randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) *
        Math.cos(2.0 * Math.PI * u2);
    let randNormal = mean + stdDev * randStdNormal;
    return Math.max(min, Math.min(max, randNormal));
}
const arrSum = (...inp) => inp.reduce((acc, term) => term.map((val, i) => val + acc[i]));
const arrProduct = (...inp) => inp.reduce((acc, term) => term.map((val, i) => val * acc[i]));
function roundDigit(num, digits = 4) {
    return Math.round(num * (10 ** digits)) / 10 ** digits;
}
function buildCanvasTranslator(canvas, minViewArea, scaleType) {
    minViewArea ??= [-100, -100, 100, 100];
    const { 0: xMin, 1: yMin, 2: xMax, 3: yMax } = minViewArea, xRange = xMax - xMin, yRange = yMax - yMin, scaleFactor = scaleType == "fill" ?
        Math.max(canvas.width / xRange, canvas.height / yRange) :
        Math.min(canvas.width / xRange, canvas.height / yRange), xOffset = -xMin * scaleFactor, yOffset = canvas.height + yMin * scaleFactor, xExcess = canvas.width - xRange * scaleFactor, yExcess = canvas.height - yRange * scaleFactor, transformMatrix = [
        [scaleFactor, 0, xOffset + xExcess / 2],
        [0, -scaleFactor, yOffset - yExcess / 2]
    ], inverseMatrix = [
        [1 / scaleFactor, 0, -(xOffset + xExcess / 2) / (scaleFactor)],
        [0, -1 / scaleFactor, (yOffset - yExcess / 2) / (scaleFactor)]
    ], multiplyMatrixVector = (m, v) => {
        return [
            (m[0][0] * v[0]) + (m[0][1] * v[1]) + (m[0][2] * v[2]),
            (m[1][0] * v[0]) + (m[1][1] * v[1]) + (m[1][2] * v[2])
        ];
    }, convertCoord = (logicalCoord) => {
        const inpVector = [...logicalCoord, 1];
        const outVector = multiplyMatrixVector(transformMatrix, inpVector);
        return outVector;
    }, invertCoord = (pixelCoord) => {
        const inpVector = [...pixelCoord, 1];
        const outVector = multiplyMatrixVector(inverseMatrix, inpVector);
        return outVector;
    };
    return {
        scaleFactor,
        convertCoord,
        invertCoord
    };
}
let canvas;
let context;
let translationObject;
const size = [0, 0, 400, 400];
const fps = 60;
const init = () => {
    canvas = document.getElementById("disp0");
    if (!canvas)
        throw new Error("Canvas not found");
    context = canvas.getContext("2d");
    if (!context)
        throw new Error("Context not found");
    translationObject = buildCanvasTranslator(canvas, [-100, -100, 100, 100], "fit");
    fix_dpi();
    frameLoop();
};
document.body.onload = init;
function frameLoop() {
    requestAnimationFrame(frameLoop);
}
function offsetRadially(point, rotationOffset = 0) {
    const radianDir = Math.atan2(point[0], point[1]);
    const radius = Math.sqrt(point[0] ** 2 + point[1] ** 2);
    const x = roundDigit(radius * Math.cos(radianDir + rotationOffset));
    const y = roundDigit(radius * Math.sin(radianDir + rotationOffset));
    return [x, y];
}
function cartesianToLogical(point) {
    const zOffset = point[2];
    const offsetPos = offsetRadially([...point].splice(0, 2));
    return [offsetPos[0], offsetPos[1] + zOffset];
}
