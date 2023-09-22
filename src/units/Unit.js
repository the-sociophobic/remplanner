class Unit {
  constructor(props) {
    this.props = props
  }

  init = (props) => {}
  setUnitLoaded = () => {
    this.props.unitLoaded?.()
  }
  animate = (frame) => {}
  dispose = (props) => {}
}


export default Unit
