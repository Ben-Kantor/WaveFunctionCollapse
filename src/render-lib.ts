function radOffset(point: coord, rotationOffset: number = 0) {
    const radianDir = Math.atan2(point[0], point[1])
    const radius = Math.sqrt(point[0] ** 2 + point[1] ** 2)
    const x = roundDigit(radius * Math.sin(radianDir + rotationOffset))
    const y = roundDigit(radius * Math.cos(radianDir + rotationOffset))
    return <coord>[x, y]
}
function cartesianToLogical(point: cartesianCoordinate): logicalCoordinate {
    const zOffset = point[2]
    const offsetPos = radOffset(<coord>point.splice(0,2), rotOffs)
    return [offsetPos[0], offsetPos[1] / 2 + zOffset / 2]
}
const cartesianToGraphical = (n: cartesianCoordinate)=>logicalToGraphical(cartesianToLogical(n))
type radialCoord = [number, number]
function sphericalToCartesian(coord: sphericalCoordinate){
    return [
        roundDigit(coord.r * Math.cos(coord.φ) * Math.sin(coord.θ)),
        roundDigit(coord.r * Math.sin(coord.φ) * Math.sin(coord.θ)),
        roundDigit(coord.r * Math.cos(coord.φ))
    ]
}