let viewTheta = Math.PI / 10
let viewPhi = Math.PI / 4
function radOffset(point: coord, rotationOffset: number = viewPhi) {
    const radianDir = Math.atan2(point[0], point[1])
    const radius = Math.sqrt(point[0] ** 2 + point[1] ** 2)
    const x = roundDigit(radius * Math.sin(radianDir + rotationOffset))
    const y = roundDigit(radius * Math.cos(radianDir + rotationOffset))
    return <coord>[x, y]
}
function cartesianToLogical(point: cartesianCoordinate): logicalCoordinate {
    const zOffset = point[2]
    const offsetPos = radOffset(<coord>point.splice(0,2))
    return [offsetPos[0], offsetPos[1] * Math.sin(viewTheta) + zOffset * Math.cos(viewTheta)]
}
const cartesianToGraphical = (n: cartesianCoordinate)=>logicalToGraphical(cartesianToLogical(n))
type radialCoord = [number, number]
function sphericalToCartesian(coord: sphericalCoordinate){
    return <cartesianCoordinate> [
        coord.radius * Math.cos(coord.theta) * Math.cos(coord.phi),
        coord.radius * Math.sin(coord.theta) * Math.cos(coord.phi),
        coord.radius * Math.sin(coord.phi)
    ]
}
