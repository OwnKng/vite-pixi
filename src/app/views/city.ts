import { Sprite, Container, Text, TextStyle } from "pixi.js"
import { addToPipeline, City } from "../entities"
import { createUpgrades } from "../layout/upgrades"
import gsap from "gsap"
import { backgroundRect, lightTextStyles } from "./utils"
import { loadCityAssets } from "../loaders/assets"
import { createUpgradeManager } from "./builder"
import { upgrades } from "../consts"

export type CityView = {
  container: Container
  hide: () => Promise<void>
  show: () => Promise<void>
  title: Text
}

const createCityView = async (city: City): Promise<CityView> => {
  const container = new Container()
  container.x = 0
  container.y = 0
  container.visible = false

  const background = new Container()
  background.addChild(backgroundRect.clone())
  background.alpha = 0.5

  background.eventMode = "static"
  background.on("pointerdown", () => city.view.hide())

  const cityViewContainer = new Container()
  cityViewContainer.x = 16
  cityViewContainer.y = 32

  const { selectedTexture, upgradesTexture } = await loadCityAssets()
  selectedTexture.source.scaleMode = "nearest"
  upgradesTexture.source.scaleMode = "nearest"

  const sprite = Sprite.from(selectedTexture)
  cityViewContainer.addChild(sprite)
  cityViewContainer.eventMode = "static"

  container.addChild(background)
  container.addChild(cityViewContainer)

  // Title
  const title = new Text({
    text: city.name,
    style: new TextStyle({
      ...lightTextStyles,
      fontSize: 48,
    }),
  })

  title.anchor.set(0, 0.5)
  title.x = 4
  title.y = 8
  title.scale = 0.125

  cityViewContainer.addChild(title)

  //_ Upgrades
  const upgradeTextures = await createUpgrades()

  const builder = await createUpgradeManager((upgrade) =>
    addToPipeline(upgrade)
  )

  builder.container.x = 96
  builder.container.y = 16
  cityViewContainer.addChild(builder.container)

  const startingUpgrades = upgrades.map((u) => ({
    ...u,
    city: city.name,
    texture: upgradeTextures.getUpgradeTexture(u.texture),
  }))

  builder.addUpgrades(startingUpgrades)

  async function hide() {
    await gsap.to(cityViewContainer, {
      alpha: 0,
      y: 64,
      duration: 0.125,
      ease: "power2.in",
    })

    container.visible = false
  }

  async function show() {
    container.visible = true

    await gsap.to(cityViewContainer, {
      alpha: 1,
      y: 32,
      duration: 0.125,
      ease: "power2.out",
    })
  }

  return {
    container,
    title,
    hide,
    show,
  }
}

export { createCityView }
