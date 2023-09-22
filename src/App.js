import ThreeScene from './ThreeScene'
import OriginalSkirting from './units/OriginalSkirting'
import RefactoredSkirting from './units/RefactoredSkirting'


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
  })

  return root
}


export default App
