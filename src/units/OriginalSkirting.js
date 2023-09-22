import Unit from './Unit'
import { addSkirting } from '../test/original'
import { contourExample } from '../utils/examples'


class OriginalSkirting extends Unit {
  async init() {
    super.init()

    this.skirting = await addSkirting('1', '1', contourExample, true)

    this.skirting.position.set(-15, 0, 0)

    this.props.scene.add(this.skirting)
    this.setUnitLoaded()
  }
}


export default OriginalSkirting
