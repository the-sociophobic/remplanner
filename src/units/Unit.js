class Unit {
  constructor(props) {
    this.props = props
  }

  async init() {
    this.initStartTime = this.props.clock.getElapsedTime()
  }
  setUnitLoaded = () => {
    this.props.unitLoaded?.(
      Math.round((this.props.clock.getElapsedTime() - this.initStartTime) * 1000000) / 1000
    )
  }
  animate = (frame) => {}
  dispose = (props) => {}
}


export default Unit
