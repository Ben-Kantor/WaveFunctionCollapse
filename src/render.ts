function render(){
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.beginPath()
    context.moveTo(...cartesianToGraphical([0, 0, -150]))
    context.lineTo(...cartesianToGraphical([-150, 0, -150]))
    context.moveTo(...cartesianToGraphical([0, 0, -150]))
    context.lineTo(...cartesianToGraphical([150, 0, -150]))
    context.moveTo(...cartesianToGraphical([0, 0, -150]))
    context.lineTo(...cartesianToGraphical([0, -150, -150]))
    context.moveTo(...cartesianToGraphical([0, 0, -150]))
    context.lineTo(...cartesianToGraphical([0, 150, -150]))
    context.lineWidth = 1
    context.strokeStyle = "white"
    context.stroke()
}