import ThreeScene from './ThreeScene'
import OriginalSkirting from './units/OriginalSkirting'
import RefactoredSkirting from './units/RefactoredSkirting'
import Lights from './units/Lights'


const App = () => {
  const root = document.createElement('div')

  root.id = 'root'

  const three = new ThreeScene(root, {
    original: {
      unit: OriginalSkirting
    },
    refactored: {
      unit: RefactoredSkirting
    },
    lights: {
      unit: Lights
    },
  })

  return root
}


export default App
