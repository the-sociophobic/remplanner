import * as THREE from 'three'

import { shapeExample } from '../../utils/examples'
import createProfiledContourGeometry from './createProfiledContourGeometry'


class SkirtingCreator {
  constructor(skirtingHeight = 10) {
    this.skirtingNum = 0
    this.skirtingHeight = skirtingHeight
  }

  create = async function( roomId, wallId, contour, is_clockwise ) {
    if (!is_clockwise)
      contour.reverse()

    const contourClosed = contour.length > 2
    const skirtingGeometry = await createProfiledContourGeometry(
      shapeExample, contour,
      contourClosed, false
    )

    skirtingGeometry.rotateX(Math.PI * 0.5)
    skirtingGeometry.translate(0, this.skirtingHeight, 0)

    const skirting = new THREE.Mesh(
      skirtingGeometry,
      new THREE.MeshStandardMaterial({ side: THREE.FrontSide })
    )

    skirting.name = "skirting|" + roomId + "|" + wallId + "|" + this.skirtingNum

    this.skirtingNum++

    return skirting
  }
}


export default SkirtingCreator
