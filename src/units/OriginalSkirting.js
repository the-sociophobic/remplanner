import Unit from './Unit'
import { addSkirting } from '../test/original'
import { contourExample } from '../utils/examples'


class OriginalSkirting extends Unit {
  async init() {
    super.init()

    this.skirting1 = await addSkirting('1', '1', contourExample, false, false)
    this.skirting2 = await addSkirting('1', '1', contourExample, false, true)

    this.skirting1.position.set(-15, 0, 0)
    this.skirting2.position.set(-15, 0, -30)

    this.props.scene.add(this.skirting1)
    this.props.scene.add(this.skirting2)

    this.setUnitLoaded()
  }
}


export default OriginalSkirting
