function flipShapeGeometry( shapeGeometry ) {
  const result = shapeGeometry.clone()

  const { index } = result
  const { array: indexArray } = index

  for (let i = 0; i < indexArray.length; i += 3)
    [indexArray[i + 1], indexArray[i + 2]] = [indexArray[i + 2], indexArray[i + 1]]

  return result
}


export default flipShapeGeometry
