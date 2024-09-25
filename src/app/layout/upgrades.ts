import { Sprite } from "pixi.js"
import { loadUpgradesAssets } from "../loaders/assets"

export const createUpgrades = async () => {
  const { light } = await loadUpgradesAssets()
  light.source.scaleMode = "nearest"

  const map = {
    light: light.source,
  }

  const getUpgradeSprite = (name: string) => Sprite.from(map[name])

  return {
    getUpgradeSprite,
  }
}
