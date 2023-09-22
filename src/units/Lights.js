import { Vector3, PointLight } from 'three'

import Unit from './Unit'


const numberOfLights = 20
const arenaRadius = 45
const lightColors = [
  '#00c797',
  '#e400da',
  '#28348d',
  '#00fd00',
  '#d60002'
]

const lightPos = () =>
  new Vector3(
    (Math.random() - .5) * 2 * arenaRadius * .99,
    (Math.random() - .5) * 2 * arenaRadius * .99,
    -(Math.random() - .26) * arenaRadius * .99
  )

class Lights extends Unit {
  init = async () => {

  this.lights = Array.from(
    { length: numberOfLights },
    (light, index) => {
      const tmp = new PointLight(
        lightColors[index % lightColors.length],
        25,
        35
      )
      tmp.position.copy(lightPos())
      this.props.scene.add(tmp)

      return tmp
    }
  )

    this.setUnitLoaded()
  }
}


export default Lights
