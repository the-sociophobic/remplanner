import {
  Mesh,
  MeshStandardMaterial,
  FrontSide
} from 'three'

import { shapeExample } from '../../utils/examples'
import createProfiledContourGeometry from './createProfiledContourGeometry'


class SkirtingCreator {
  constructor(skirtingHeight = 10) {
    this.skirtingNum = 0
    this.skirtingHeight = skirtingHeight
  }

  /*
    (roomId: string, wallId: string, _contour: THREE.Vector2[], is_clockwise: boolean)
    => Promise<THREE.Mesh>
  */
  create = async function( roomId, wallId, _contour, is_clockwise ) {
    const contour = _contour.slice()
    
    if (!is_clockwise)
      contour.reverse()

    const contourClosed = contour.length > 2
    const skirtingGeometry = await createProfiledContourGeometry(
      shapeExample, contour,
      contourClosed, false
    )

    skirtingGeometry.translate(0, this.skirtingHeight, 0)

    const skirting = new Mesh(
      skirtingGeometry,
      new MeshStandardMaterial({ side: FrontSide })
    )

    skirting.name = "skirting|" + roomId + "|" + wallId + "|" + this.skirtingNum

    this.skirtingNum++

    return skirting
  }
}


export default SkirtingCreator
