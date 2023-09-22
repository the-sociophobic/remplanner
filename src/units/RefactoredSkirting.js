import Unit from './Unit'
import SkirtingCreator from '../test/refactored'
import { contourExample } from '../utils/examples'


class RefactoredSkirting extends Unit {
  async init() {
    super.init()

    this.skirtingCreator = new SkirtingCreator(10)
    this.skirting = await this.skirtingCreator.create('1', '1', contourExample, true)

    this.skirting.position.set(15, 0, 0)

    this.props.scene.add(this.skirting)
    this.setUnitLoaded()
  }
}


export default RefactoredSkirting
