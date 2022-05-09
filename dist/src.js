"use strict";
function drawTiles() {
}
const dpi = window.devicePixelRatio;
function fix_dpi() {
    let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    canvas.setAttribute('height', (style_height * dpi).toString());
    canvas.setAttribute('width', (style_width * dpi).toString());
}
let canvas;
let context;
let translationObject;
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
function buildCanvasTranslator(canvas, minViewArea, scaleType) {
    minViewArea ??= [-100, -100, 100, 100];
    const { 0: xMin, 1: yMin, 2: xMax, 3: yMax } = minViewArea, xRange = xMax - xMin, yRange = yMax - yMin, scaleFactor = scaleType == "fill" ?
        Math.max(canvas.width / xRange, canvas.height / yRange) :
        Math.min(canvas.width / xRange, canvas.height / yRange), invScaleFactor = 1 / scaleFactor, xOffset = -xMin * scaleFactor, yOffset = canvas.height + yMin * scaleFactor, xExcess = canvas.width - xRange * scaleFactor, yExcess = canvas.height - yRange * scaleFactor, transformMatrix = [
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
class superPosition {
    constructor() {
        this.possibleTiles = [0, 1];
    }
}
