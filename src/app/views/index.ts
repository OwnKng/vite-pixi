import { Sprite, Container, Text } from "pixi.js"
import { selected } from "../loaders/assets"
import { addToPipeline, City } from "../entities"
import gsap from "gsap"
import { constructions } from "../data/buildings"

type View = {
  container: Container
  show: (city: City) => void
  hide: () => void
}

const createCityView = (): View => {
  const container = new Container()
  container.x = 16
  container.y = 32
  container.alpha = 0

  const sprite = Sprite.from(selected)
  container.addChild(sprite)
  container.visible = false
  container.eventMode = "static"

  // Title
  const title = new Text({
    text: "City",
    style: { fontSize: 48, fill: 0xfffffe },
  })
  title.x = 2
  title.y = 2
  title.scale = 0.125

  container.addChild(title)

  // Pipeline

  // Buildings

  async function hide() {
    await gsap.to(container, {
      alpha: 0,
      y: 64,
      duration: 0.125,
      ease: "power2.in",
    })
    container.visible = false
  }

  async function show(city: City) {
    title.text = city.name
    container.visible = true

    await gsap.to(container, {
      alpha: 1,
      y: 32,
      duration: 0.125,
      ease: "power2.out",
    })
  }

  container.on("click", () => {
    addToPipeline({
      city: "London",
      ...constructions["City wall"],
    })
  })

  return {
    container,
    hide,
    show,
  }
}

export { createCityView }
