import { Sprite, Container, Text, Graphics } from "pixi.js"
import { selected } from "../loaders/assets"
import { addToPipeline, City } from "../entities"
import { constructions } from "../data/buildings"
import { createUpgrades } from "../layout/upgrades"
import gsap from "gsap"
import { dims } from "../consts"

export type CityView = {
  container: Container
  hide: () => Promise<void>
  show: () => Promise<void>
  title: Text
}

const createCityView = async (city: City): Promise<CityView> => {
  const cityViewContainer = new Container()
  cityViewContainer.x = 0
  cityViewContainer.y = 0
  cityViewContainer.visible = false

  const background = new Container()
  const backgroundFill = new Graphics()
    .rect(0, 0, dims.width, dims.height)
    .fill(0x000000)
  backgroundFill.alpha = 0.5
  background.addChild(backgroundFill)

  background.eventMode = "static"
  background.on("pointerdown", () => city.view.hide())

  cityViewContainer.addChild(background)

  const container = new Container()
  container.x = 16
  container.y = 32
  const sprite = Sprite.from(selected)
  container.addChild(sprite)

  cityViewContainer.addChild(container)

  container.eventMode = "static"

  // Title
  const title = new Text({
    text: city.name,
    style: { fontSize: 48, fill: 0xfffffe },
  })
  title.x = 2
  title.y = 2
  title.scale = 0.125

  container.addChild(title)

  //_ Pipeline
  const upgrades = await createUpgrades()

  //_ Upgrades
  const soliderButton = Sprite.from(upgrades.getUpgradeTexture("light"))
  soliderButton.position.x = 16
  soliderButton.position.y = 64

  soliderButton.eventMode = "static"

  soliderButton.on("pointerdown", () => {
    addToPipeline({
      city: city.name,
      ...constructions["City wall"],
      texture: upgrades.getUpgradeTexture("light"),
    })
  })

  container.addChild(soliderButton)

  async function hide() {
    await gsap.to(container, {
      alpha: 0,
      y: 64,
      duration: 0.125,
      ease: "power2.in",
    })

    cityViewContainer.visible = false
  }

  async function show() {
    cityViewContainer.visible = true

    await gsap.to(container, {
      alpha: 1,
      y: 32,
      duration: 0.125,
      ease: "power2.out",
    })
  }

  return {
    container: cityViewContainer,
    title,
    hide,
    show,
  }
}

export { createCityView }
