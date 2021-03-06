"use strict";
const dpi = window.devicePixelRatio;
function fix_dpi() {
    let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    canvas.setAttribute('height', (style_height * dpi).toString());
    canvas.setAttribute('width', (style_width * dpi).toString());
}
//store an array of currently pressed keys
let cameraSpinning = true;
let keys = {};
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});
function moveCamera() {
    if (keys["ArrowLeft"]) {
        viewPhi -= Math.PI / fps;
        cameraSpinning = false;
    }
    if (keys["ArrowRight"]) {
        viewPhi += Math.PI / fps;
        cameraSpinning = false;
    }
    if (keys["ArrowUp"]) {
        viewTheta += Math.PI / fps;
        cameraSpinning = false;
    }
    if (keys["ArrowDown"]) {
        viewTheta -= Math.PI / fps;
        cameraSpinning = false;
    }
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
const matrixProduct = (...matricies) => matricies.reduce((acc, mat) => acc.map((row, i) => row.map((val, j) => val * mat[i][j])));
const matrixSum = (...matricies) => matricies.reduce((acc, mat) => acc.map((row, i) => row.map((val, j) => val + mat[i][j])));
const matrixVectorProduct = (matrix, vector) => matrix.map((row, i) => row.map((val, j) => val * vector[j]));
function stDev(arr) {
    const mean = arr.reduce((acc, val) => acc + val) / arr.length;
    const variance = arr.reduce((acc, val) => acc + (val - mean) ** 2) / arr.length;
    return Math.sqrt(variance);
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
let logicalToGraphical;
const fps = 60;
const rotOffs = -Math.PI / 16;
let sphereCoordinates = [];
const initTime = Date.now();
const init = () => {
    canvas = document.getElementById("disp0");
    if (!canvas)
        throw new Error("Canvas not found");
    context = canvas.getContext("2d");
    if (!context)
        throw new Error("Context not found");
    fix_dpi();
    translationObject = buildCanvasTranslator(canvas, [-150, -200, 150, 200], "fit");
    logicalToGraphical = translationObject.convertCoord;
    frameLoop();
    setupPoints();
    render();
};
document.body.onload = init;
function frameLoop() {
    requestAnimationFrame(frameLoop);
    moveCamera();
    render();
    if (cameraSpinning)
        viewPhi = (Date.now() - initTime) * Math.PI / 500 / /* seconds per rotation */ 5;
}
let viewTheta = Math.PI / 10;
let viewPhi = Math.PI / 4;
function radOffset(point, rotationOffset = viewPhi) {
    const radianDir = Math.atan2(point[0], point[1]);
    const radius = Math.sqrt(point[0] ** 2 + point[1] ** 2);
    const x = roundDigit(radius * Math.sin(radianDir + rotationOffset));
    const y = roundDigit(radius * Math.cos(radianDir + rotationOffset));
    return [x, y];
}
function cartesianToLogical(point) {
    const zOffset = point[2];
    const offsetPos = radOffset(point.splice(0, 2));
    return [offsetPos[0], offsetPos[1] * Math.sin(viewTheta) + zOffset * Math.cos(viewTheta)];
}
const cartesianToGraphical = (n) => logicalToGraphical(cartesianToLogical(n));
function sphericalToCartesian(coord) {
    return [
        coord.radius * Math.cos(coord.theta) * Math.cos(coord.phi),
        coord.radius * Math.sin(coord.theta) * Math.cos(coord.phi),
        coord.radius * Math.sin(coord.phi)
    ];
}
function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(...cartesianToGraphical([0, 0, -150]));
    context.lineTo(...cartesianToGraphical([-150, 0, -150]));
    context.moveTo(...cartesianToGraphical([0, 0, -150]));
    context.lineTo(...cartesianToGraphical([150, 0, -150]));
    context.moveTo(...cartesianToGraphical([0, 0, -150]));
    context.lineTo(...cartesianToGraphical([0, -150, -150]));
    context.moveTo(...cartesianToGraphical([0, 0, -150]));
    context.lineTo(...cartesianToGraphical([0, 150, -150]));
    context.lineWidth = 1;
    context.strokeStyle = "white";
    context.stroke();
    context.beginPath();
    sphereCoordinates.forEach(coord => {
        const cartesianCoordinate = sphericalToCartesian(coord);
        const logicalCoordinate = cartesianToLogical(cartesianCoordinate);
        const graphicalCoordinate = logicalToGraphical(logicalCoordinate);
        //context.moveTo(...graphicalCoordinate)
        context.arc(graphicalCoordinate[0], graphicalCoordinate[1], 2, 0, Math.PI * 2);
    });
    context.stroke();
}
function sprialSphere() {
    let theta = 0;
    let phi = -Math.PI / 2;
    let horizontalRadius = 0;
    let i = 0;
    while (phi < 1) {
        phi += Math.PI / 8;
        horizontalRadius = Math.cos(phi);
        let horizontalCircumfrence = Math.PI * horizontalRadius;
        theta += Math.PI / 4 / (horizontalCircumfrence);
        theta %= Math.PI * 2;
        sphereCoordinates.push({ radius: 100, theta: theta, phi: phi });
    }
}
function setupPoints() {
    sphereCoordinates = [];
    sprialSphere();
    //fibonacciSphere()
}
function fibonacciSphere(n = 1000) {
    const goldenRatio = (1 + 5 ** 0.5) / 2;
    for (let i = 0; i < n; i++) {
        const theta = 2 * Math.PI * i / goldenRatio;
        const phi = Math.acos(1 - 2 * (i + 0.5) / n);
        sphereCoordinates.push({ radius: 100, theta: phi, phi: theta });
    }
}
