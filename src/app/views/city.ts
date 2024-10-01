import { Container } from "pixi.js"
import { addToPipeline, City } from "../entities"
import { createUpgrades } from "../layout/upgrades"
import gsap from "gsap"
import { loadCityAssets } from "../loaders/assets"
import { createUpgradeManager } from "./builder"
import { upgrades } from "../consts"
import { createWindow } from "../layout/window"

export type CityView = {
  container: Container
  hide: () => Promise<void>
  show: () => Promise<void>
}

const createCityView = async (city: City): Promise<CityView> => {
  const w = await createWindow({ title: city.name, close: hide, size: "large" })
  w.container.visible = false

  const { upgradesTexture } = await loadCityAssets()
  upgradesTexture.source.scaleMode = "nearest"

  //_ Upgrades
  const upgradeTextures = await createUpgrades()

  const builder = await createUpgradeManager((upgrade) =>
    addToPipeline(upgrade)
  )

  builder.container.x = 96

  w.contentArea.addChild(builder.container)

  const startingUpgrades = upgrades.map((u) => ({
    ...u,
    city: city.name,
    texture: upgradeTextures.getUpgradeTexture(u.texture),
  }))

  builder.addUpgrades(startingUpgrades)

  async function hide() {
    await gsap.to(w.windowContainer, {
      alpha: 0,
      y: 64,
      duration: 0.125,
      ease: "power2.in",
    })

    w.container.visible = false
  }

  async function show() {
    w.container.visible = true

    await gsap.to(w.windowContainer, {
      alpha: 1,
      y: 32,
      duration: 0.125,
      ease: "power2.out",
    })
  }

  return {
    container: w.container,
    hide,
    show,
  }
}

export { createCityView }
