let canvas: HTMLCanvasElement
let context: CanvasRenderingContext2D
let translationObject: canvasTranslationObject
let logicalToGraphical: (logicalCoord: coord) => coord
const fps = 60
const rotOffs = -Math.PI/16
let sphereCoordinates: sphericalCoordinate[] = []
const initTime = Date.now()
const init = () => {
    canvas = <HTMLCanvasElement> document.getElementById("disp0")
    if(!canvas) throw new Error("Canvas not found")
    context = <CanvasRenderingContext2D> canvas.getContext("2d")
    if(!context) throw new Error("Context not found")
    fix_dpi()
    translationObject = buildCanvasTranslator(canvas, [-150, -200, 150, 200], "fit")    
    logicalToGraphical = translationObject.convertCoord
    frameLoop()
    setupPoints()
    render()
}
document.body.onload = init

function frameLoop() {
    requestAnimationFrame(frameLoop)
    moveCamera()
    render()
    if(cameraSpinning)
        viewPhi = (Date.now() - initTime) * Math.PI / 500 / /* seconds per rotation */ 5
}