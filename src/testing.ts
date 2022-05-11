function sprialSphere() {
    let theta = 0
    let z = -1
    let horizontalRadius = 0
    let i = 0
    while (z < 1) {
        z += 0.01
        let phi = Math.asin(z)
        horizontalRadius = Math.cos(phi)
        let horizontalCircumfrence = Math.PI * horizontalRadius
        theta += Math.PI / 4 / (horizontalCircumfrence)
        theta %= Math.PI * 2
        sphereCoordinates.push({radius: 100, theta: theta, phi: phi})
    }
}
function setupPoints(){
    sphereCoordinates = []
    //sprialSphere()
    fibonacciSphere()
}
function fibonacciSphere(n: number = 1000) {
    const goldenRatio = (1 + 5**0.5)/2
    for(let i = 0; i < n; i++){
        const theta = 2 * Math.PI * i / goldenRatio
        const phi = Math.acos(1 - 2*(i+0.5)/n)
        sphereCoordinates.push({radius: 100, theta: phi, phi: theta})
    }
}