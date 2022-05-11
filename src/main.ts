let canvas: HTMLCanvasElement
let context: CanvasRenderingContext2D
let translationObject: canvasTranslationObject
let logicalToGraphical: (logicalCoord: coord) => coord
const fps = 60
const rotOffs = -Math.PI/16
const init = () => {
    canvas = <HTMLCanvasElement> document.getElementById("disp0")
    if(!canvas) throw new Error("Canvas not found")
    context = <CanvasRenderingContext2D> canvas.getContext("2d")
    if(!context) throw new Error("Context not found")
    fix_dpi()
    translationObject = buildCanvasTranslator(canvas, [-150, -200, 150, 200], "fit")    
    logicalToGraphical = translationObject.convertCoord
    frameLoop()
    render()
}
document.body.onload = init

function frameLoop() {
    requestAnimationFrame(frameLoop)
}