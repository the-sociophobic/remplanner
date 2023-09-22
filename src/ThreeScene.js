import {
  Scene,
  Clock,
  WebGLRenderer,
  PerspectiveCamera,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


const maxFrameNumber = Number.MAX_VALUE


class ThreeScene {
  constructor(root, units) {
    this.props = { units: units || {} }
    this.scene = {
      renderer: undefined,
      camera: undefined,
      controls: undefined,
      scene: new Scene(),

      clock: new Clock(),
      frameNumber: 0,

      units: {},
      numberOfLoadedUnits: 0,
      sceneLoaded: false
    }

    this.init(root)
  }

  init = (root) => {
    const W = root.clientWidth
    const H = root.clientHeight
    console.log(root.clientWidth)

    //ADD RENDERER
    this.scene.renderer = new WebGLRenderer({ antialias: true, alpha: true })
    this.scene.renderer.setClearColor(0x000000, 0)
    this.scene.renderer.setSize(W, H)
    this.scene.renderer.setPixelRatio(window.devicePixelRatio)

    root.appendChild(this.scene.renderer.domElement)

    //ADD CAMERA
    this.scene.camera = new PerspectiveCamera(
      50,
      W / H,
      0.1,
      1000
    )
    this.scene.controls = new OrbitControls(this.scene.camera, this.scene.renderer.domElement)
    this.scene.controls.enabled = true
    this.scene.camera.position.set(0, 30, 30)
    this.scene.controls.target.set(0, 0, 0)
    this.scene.controls.update()

    this.initUnits()

    if (!this.frameId)
      this.frameId = requestAnimationFrame(this.animate.bind(this))

    new ResizeObserver(this.resize).observe(root)
  }

  dispose = () => {
    this.disposeUnits()
    cancelAnimationFrame(this.frameId)
  }

  resize = (e) => {
    if (!e[0].contentRect || !this.scene.renderer || !this.scene.camera)
      return

    const { width: W, height: H } = e[0].contentRect

    this.scene.camera.aspect = W / H
    this.scene.camera.updateProjectionMatrix()

    this.scene.renderer.setSize(W, H)
    this.scene.renderer.setPixelRatio(window.devicePixelRatio)
  }

  animate = (timestamp) => {
    this.scene.frameNumber = (this.scene.frameNumber + 1) % maxFrameNumber

    const {
      units,
      renderer,
    } = this.scene

    Object.keys(units)
      .forEach(unitName =>
        units[unitName].animate({
          ...this.scene,
          input: this.scene.units.Controls,
          maxFrameNumber: maxFrameNumber,
        }))

    renderer.render(this.scene.scene, this.scene.camera)

    this.frameId = requestAnimationFrame(this.animate.bind(this))
  }


  initUnits = () => {
    const props = {
      ...this.scene,
      maxFrameNumber: maxFrameNumber,
    }

    Object.keys(this.props.units)
      .forEach(unitName => {
        const unit = this.props.units[unitName]

        if (unit?.unit)
          this.scene.units[unitName] = new unit.unit({
            ...props,
            ...unit.args,
            unitLoaded: () => this.unitLoaded(unitName),
          })
        this.scene.units[unitName].init?.()
      })
  }

  unitLoaded = (name) => {
    this.scene.numberOfLoadedUnits++
    console.log(`${name} loaded`)

    if (this.scene.numberOfLoadedUnits >= Object.keys(this.scene.units).length)
      this.scene.sceneLoaded = true
  }

  startUnits = () =>
    Object.keys(this.scene.units)
      .forEach(unitName => {
        const unit = this.scene.units[unitName]

        unit?.start?.()
      })

  start = () =>
    this.startUnits()

  disposeUnits = () => {
    const {
      scene,
      units,
    } = this.scene

    Object.keys(units)
      .forEach(unitName => units[unitName].dispose())

    //REDO THIS SHIT: units should unregister themselves
    while (scene.children.length > 0)
      scene.remove(scene.children[0])
  }
}


export default ThreeScene
