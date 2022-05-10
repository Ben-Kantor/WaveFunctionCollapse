let canvas: HTMLCanvasElement
let context: CanvasRenderingContext2D
let translationObject: canvasTranslationObject
const size = [0, 0, 400, 400]
const fps = 60
const init = () => {
    canvas = <HTMLCanvasElement> document.getElementById("disp0")
    if(!canvas) throw new Error("Canvas not found")
    context = <CanvasRenderingContext2D> canvas.getContext("2d")
    if(!context) throw new Error("Context not found")
    translationObject = buildCanvasTranslator(canvas, [-100, -100, 100, 100], "fit")
    fix_dpi()
    frameLoop()
}
document.body.onload = init

function frameLoop() {
    requestAnimationFrame(frameLoop)
}