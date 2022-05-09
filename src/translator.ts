function buildCanvasTranslator(
    canvas: HTMLCanvasElement,
    minViewArea?: [number, number, number, number] ,
    scaleType?: "fit" | "fill"
) {
    minViewArea ??= [-100, -100, 100, 100]
    const
        { 0: xMin, 1: yMin, 2: xMax, 3: yMax } = minViewArea,
        xRange = xMax - xMin,
        yRange = yMax - yMin,
        scaleFactor =
            scaleType == "fill" ?
                Math.max(canvas.width / xRange, canvas.height / yRange) :
                Math.min(canvas.width / xRange, canvas.height / yRange),
        invScaleFactor = 1 / scaleFactor,
        xOffset = - xMin * scaleFactor,
        yOffset = canvas.height + yMin * scaleFactor,
        xExcess = canvas.width - xRange * scaleFactor,
        yExcess = canvas.height - yRange * scaleFactor,
        transformMatrix: [vec3, vec3] = [
            [scaleFactor, 0          , xOffset + xExcess / 2],
            [0          , -scaleFactor, yOffset - yExcess / 2]
        ],
        inverseMatrix: [vec3, vec3] = [
            [1 / scaleFactor, 0               , -(xOffset + xExcess / 2) / (scaleFactor)],
            [0              , -1 / scaleFactor, (yOffset - yExcess / 2) / (scaleFactor) ]
        ],
        multiplyMatrixVector = (m: [vec3, vec3], v: vec3) => {
            return [
                (m[0][0] * v[0]) + (m[0][1] * v[1]) + (m[0][2] * v[2]),
                (m[1][0] * v[0]) + (m[1][1] * v[1]) + (m[1][2] * v[2])
            ]
        },
        convertCoord = (logicalCoord: coord) => {
            const inpVector: vec3 = [...logicalCoord, 1]
            const outVector = multiplyMatrixVector(transformMatrix, inpVector)
            return <coord> outVector
        },
        invertCoord = (pixelCoord: coord) => {
            const inpVector: vec3 = <vec3> [...pixelCoord, 1]
            const outVector = multiplyMatrixVector(inverseMatrix, inpVector)
            return <coord> outVector
        }
    return {
        scaleFactor,
        convertCoord,
        invertCoord
    }
}
type vec3 = [number, number, number]
type vec2 = [number, number]
type matrix = [vec3, vec3, vec3]
type coord = [number, number]
interface canvasTranslationObject {
    scaleFactor: number
    convertCoord: (logicalCoord: coord) => coord
    invertCoord: (pixelCoord: coord) => coord
}