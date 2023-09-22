function flipShapeGeometry( shapeGeometry ) {
  const result = shapeGeometry.clone()
  
  const { position } = result.attributes
  const {
    count: vertexCount,
    array: positionArray
  } = position

  for (let i = 0; i < vertexCount; i++)
    positionArray[i * 3] *= -1
  position.needsUpdate = true


  const { index } = result
  const { array: indexArray } = index

  for (let i = 0; i < indexArray.length; i += 3)
    [indexArray[i + 2], indexArray[i + 3]] = [indexArray[i + 3], indexArray[i + 2]]
  index.needsUpdate = true

  result.computeVertexNormals()

  return result
}


export default flipShapeGeometry
