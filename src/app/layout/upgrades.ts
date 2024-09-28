import { loadUpgradesAssets } from "../loaders/assets"

export const createUpgrades = async () => {
  const { light } = await loadUpgradesAssets()
  light.source.scaleMode = "nearest"

  const map = {
    light: light.source,
  }

  const getUpgradeTexture = (name: string) => map[name]

  return {
    getUpgradeTexture,
  }
}
