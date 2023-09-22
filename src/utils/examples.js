import * as THREE from 'three'

const mlt = 1.0
const shapeExample = new THREE.Shape()
      shapeExample.moveTo(0, 0)
      shapeExample.lineTo(0, 12)
      shapeExample.lineTo(1.1 * mlt, 12)
      shapeExample.lineTo(1.1 * mlt, 3)
      shapeExample.lineTo(1.01 * mlt, 3)

const contourExample = [
  new THREE.Vector2(10, 10),
  new THREE.Vector2(10, -5),
  new THREE.Vector2(5, -5),
  new THREE.Vector2(5, -10),
  new THREE.Vector2(-10, -10),
  new THREE.Vector2(-10, 10),
]


export {
  shapeExample,
  contourExample
}