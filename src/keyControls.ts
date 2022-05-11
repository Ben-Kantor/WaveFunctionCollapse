//store an array of currently pressed keys
let cameraSpinning = true
let keys: {[key: string]: boolean} = {};
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
})
document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
})
function moveCamera() {
    if(keys["ArrowLeft"]) {
        viewPhi -= Math.PI / fps
        cameraSpinning = false
    }
    if(keys["ArrowRight"]) {
        viewPhi += Math.PI / fps
        cameraSpinning = false
    }
    if(keys["ArrowUp"]) {
        viewTheta += Math.PI / fps
        cameraSpinning = false
    }
    if(keys["ArrowDown"]) {
        viewTheta -= Math.PI / fps
        cameraSpinning = false
    }
}