function offsetRadially(point: coord, rotationOffset: number = 0) {
    const radianDir = Math.atan2(point[0], point[1])
    const radius = Math.sqrt(point[0] ** 2 + point[1] ** 2)
    const x = roundDigit(radius * Math.cos(radianDir + rotationOffset))
    const y = roundDigit(radius * Math.sin(radianDir + rotationOffset))
    return <coord>[x, y]
}
function cartesianToLogical(point: cartesianCoordinate): logicalCoordinate {
    const zOffset = point[2]
    const offsetPos = offsetRadially(<coord>[...point].splice(0, 2))
    return [offsetPos[0], offsetPos[1] + zOffset]
}
type radialCoord = [number, number]