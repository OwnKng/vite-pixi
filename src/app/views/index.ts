import { Sprite, Container, Text } from "pixi.js"
import { selected } from "../loaders/assets"
import { addToPipeline, City } from "../entities"
import gsap from "gsap"
import { constructions } from "../data/buildings"
import { createUpgrades } from "../layout/upgrades"

type SelectedCityView = {
  container: Container
  show: () => void
  hide: () => void
  setSelectedCity: (city: City) => void
}

const createCityView = async (): Promise<SelectedCityView> => {
  let selectedCity: City

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
  const upgrades = await createUpgrades()

  async function hide() {
    await gsap.to(container, {
      alpha: 0,
      y: 64,
      duration: 0.125,
      ease: "power2.in",
    })
    container.visible = false
  }

  async function show() {
    container.visible = true

    await gsap.to(container, {
      alpha: 1,
      y: 32,
      duration: 0.125,
      ease: "power2.out",
    })
  }

  const setSelectedCity = (city: City) => {
    selectedCity = city
    update()
  }

  const update = () => {
    title.text = selectedCity.name
  }

  container.on("click", () => {
    addToPipeline({
      city: selectedCity.name,
      ...constructions["City wall"],
      texture: upgrades.getUpgradeTexture("light"),
    })

    hide()
  })

  return {
    container,
    hide,
    show,
    setSelectedCity,
  }
}

export { createCityView }
