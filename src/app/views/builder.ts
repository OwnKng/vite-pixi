import { createTileset, loadCityAssets } from "../loaders/assets"
import { Container, Sprite, Text, TextStyle } from "pixi.js"
import { ScrollBox } from "@pixi/ui"
import { Upgrade } from "../entities"
import { darkTextStyles, lightTextStyles } from "../layout/utils"

export const createUpgradeManager = async (
  onclick: (upgrade: Upgrade) => void
) => {
  const container = new Container()

  const upgradesScrollbox = new ScrollBox({
    width: 96,
    height: 94,
    elementsMargin: 2,
    vertPadding: 2,
    globalScroll: false,
  })

  upgradesScrollbox.position.y = 16

  const { upgradesTexture, itemsTextures } = await loadCityAssets()
  upgradesTexture.source.scaleMode = "nearest"

  const upgradesMenu = Sprite.from(upgradesTexture)

  container.addChild(upgradesMenu)
  container.addChild(upgradesScrollbox)

  const title = new Text({
    text: "Select upgrade",
    style: new TextStyle({ ...lightTextStyles }),
  })

  title.scale = 0.05
  title.x = 2
  title.y = 14 - title.height

  container.addChild(title)

  let selected: Upgrade

  const selectedContainer = new Container()
  selectedContainer.x = 96 + 8
  selectedContainer.y = 16
  container.addChild(selectedContainer)

  const [upgradeTexture, upgradeTextureSelected, upgradeTextureBuilding] =
    createTileset(itemsTextures, 96, 16)

  const createUpgrade = (upgrade: Upgrade) => {
    const c = new Container()

    const iconSprite = Sprite.from(upgrade.texture)
    iconSprite.x = 1

    const sprite = Sprite.from(upgradeTexture.texture)
    c.eventMode = "static"
    c.cursor = "pointer"

    c.on("pointerdown", async () => {
      selected = upgrade

      await updateSelectedContainer()
    })

    c.on("pointermove", () => {
      sprite.texture = upgradeTextureSelected.texture
    })

    c.on("pointerout", () => {
      sprite.texture = upgradeTexture.texture
    })

    const name = new Text({
      text: upgrade.name,
      style: new TextStyle({
        ...lightTextStyles,
        fontSize: 48,
      }),
    })

    name.x = 18
    name.y = 8
    name.anchor.set(0, 0.5)
    name.scale = 0.1

    c.addChild(sprite)
    c.addChild(name)
    c.addChild(iconSprite)

    return c
  }

  const addUpgrades = (upgrades: Upgrade[]) => {
    upgrades.forEach((upgrade) => {
      const upgradeContainer = createUpgrade(upgrade)
      upgradesScrollbox.addItem(upgradeContainer)
    })
  }

  const updateSelectedContainer = async () => {
    selectedContainer.removeChildren()

    if (selected) {
      const upgradeDetails = await createSelectedUpgrade(selected, onclick)

      selectedContainer.addChild(upgradeDetails)
    }
  }

  return {
    container,
    addUpgrades,
  }
}

const createSelectedUpgrade = async (
  upgrade: Upgrade,
  onClick: (upgrade: Upgrade) => void
) => {
  const container = new Container()

  const { buildButtonTexture } = await loadCityAssets()
  buildButtonTexture.source.scaleMode = "nearest"

  // Description
  const descriptionStyle = new TextStyle({
    ...lightTextStyles,
    fontSize: 48,
    wordWrap: true,
    wordWrapWidth: 80 * 10,
    align: "left",
  })

  const description = new Text({
    text: upgrade.description,
    style: descriptionStyle,
  })

  description.scale = 0.1

  container.addChild(description)

  const button = new Container()
  button.cursor = "pointer"
  button.eventMode = "static"
  button.on("pointerdown", () => onClick(upgrade))

  const buildButton = Sprite.from(buildButtonTexture)

  button.addChild(buildButton)

  button.y = 64

  const buttonText = new Text({
    text: "Add to pipeline",
    style: new TextStyle({
      ...darkTextStyles,
      fontSize: 48,
      textBaseline: "bottom",
      dropShadow: false,
    }),
  })

  buttonText.x = 4
  buttonText.y = 5
  buttonText.scale = 0.1
  button.addChild(buttonText)

  container.addChild(button)

  return container
}
