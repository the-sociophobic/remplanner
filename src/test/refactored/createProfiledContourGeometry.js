import {
  ShapeGeometry,
  Vector2,
  Matrix4,
  BufferGeometry,
  BufferAttribute
} from 'three'

import flipShapeGeometry from './flipShapeGeometry'


function createProfiledContourGeometry(
  profileShape, contour,
  _contourClosed, _openEnded
) {
  const contourClosed = _contourClosed !== undefined ? _contourClosed : true
  const openEnded = contourClosed ?
    false
    :
    _openEnded !== undefined ? _openEnded : false
  const addEnds = openEnded ? 0 : 2

  const profileGeometry = new ShapeGeometry(profileShape)
  profileGeometry.rotateX(Math.PI * 0.5)

  const profilePos = profileGeometry.attributes.position
  const profilePoints = new Float32Array(profilePos.count * (contour.length + addEnds) * 3)
  const endProfiles = []

  for (let i = 0; i < contour.length; i++) {
    const v1 = new Vector2().subVectors(contour[(i - 1 + contour.length) % contour.length], contour[i])
    const v2 = new Vector2().subVectors(contour[(i + 1)                  % contour.length], contour[i])
    const angle = v2.angle() - v1.angle()
    let hA = angle * 0.5
    let tempAngle = v2.angle() + Math.PI * 0.5

    if (!contourClosed) {
      if (i === contour.length - 1 || i === 0)
        hA = Math.PI * 0.5
      if (i === contour.length - 1)
        tempAngle = v1.angle() - Math.PI * 0.5
    }

    const shift = Math.tan(hA - Math.PI * 0.5)
    const shiftMatrix = new Matrix4().set(
      1, 0, 0, 0,
      -shift, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    )

    const rotationMatrix = new Matrix4().set(
      Math.cos(tempAngle), -Math.sin(tempAngle), 0, 0,
      Math.sin(tempAngle),  Math.cos(tempAngle), 0, 0,
      0,                    0, 1, 0,
      0,                    0, 0, 1
    )

    const translationMatrix = new Matrix4().set(
      1, 0, 0, contour[i].x,
      0, 1, 0, contour[i].y,
      0, 0, 1, 0,
      0, 0, 0, 1,
    )

    const cloneProfile = profilePos.clone()

    cloneProfile.applyMatrix4(shiftMatrix)
    cloneProfile.applyMatrix4(rotationMatrix)
    cloneProfile.applyMatrix4(translationMatrix)

    profilePoints.set(cloneProfile.array, cloneProfile.count * i * 3)
    if (!openEnded && (i === 0 || i === contour.length - 1)) {
      endProfiles.push(cloneProfile)
    }
  }

  endProfiles.forEach((endProfile, index) =>
    profilePoints.set(endProfile.array, endProfile.count * (contour.length + index) * 3)
  )




  const fullProfileGeometry = new BufferGeometry()
  fullProfileGeometry.setAttribute('position', new BufferAttribute(profilePoints, 3))
  const fullProfileGeometryIndex = []
  const lastCorner = contourClosed ? contour.length : contour.length - 1

  for (let i = 0; i < lastCorner; i++) {
    for (let j = 0; j < profilePos.count; j++) {
      const currCorner = i
      const nextCorner = (i + 1) % contour.length
      const currPoint = j
      const nextPoint = (j + 1) % profilePos.count

      const a = nextPoint + profilePos.count * currCorner
      const b = currPoint + profilePos.count * currCorner
      const c = currPoint + profilePos.count * nextCorner
      const d = nextPoint + profilePos.count * nextCorner

      fullProfileGeometryIndex.push(a, b, d)
      fullProfileGeometryIndex.push(b, c, d)
    }
  }

  if (!openEnded) {
    const flipProfileGeometry = flipShapeGeometry(profileGeometry)

    flipProfileGeometry.index.array
      .forEach(i =>
        fullProfileGeometryIndex.push(i + profilePos.count * contour.length))
    profileGeometry.index.array
      .forEach(i =>
        fullProfileGeometryIndex.push(i + profilePos.count * (contour.length + 1)))
  }

  fullProfileGeometry.setIndex(fullProfileGeometryIndex)
  fullProfileGeometry.computeVertexNormals()

  return fullProfileGeometry
}


export default createProfiledContourGeometry
