import Unit from './Unit'
import SkirtingCreator from '../test/refactored'
import { contourExample } from '../utils/examples'


class RefactoredSkirting extends Unit {
  async init() {
    super.init()

    this.skirtingCreator = new SkirtingCreator(10)

    this.skirting1 = await this.skirtingCreator.create('1', '1', contourExample, false)
    this.skirting2 = await this.skirtingCreator.create('1', '1', contourExample.slice(0, 2), false)

    this.skirting1.position.set(15, 0, 0)
    this.skirting2.position.set(15, 0, -30)

    this.props.scene.add(this.skirting1)
    this.props.scene.add(this.skirting2)

    this.setUnitLoaded()
  }
}


export default RefactoredSkirting
