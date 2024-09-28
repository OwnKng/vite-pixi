import { Sprite, Container, Text } from "pixi.js"
import { cardTextures } from "./loaders/assets"

const [cardTexture, cardHoveredTexture] = cardTextures

type CardProps = {
  title: string
}

type Card = {
  title: string
  container: Container
  setBuilding: () => void
  removeBuilding: () => void
}

export const createCityCard = ({ title }: CardProps): Card => {
  const sprite = Sprite.from(cardTexture.texture)

  const container = new Container()
  container.addChild(sprite)
  container.cursor = "pointer"
  container.eventMode = "static"

  container.on("mouseenter", () => {
    sprite.texture = cardHoveredTexture.texture
  })

  container.on("mouseleave", () => {
    sprite.texture = cardTexture.texture
  })

  let buildingLabel = new Text({
    text: "Building",
    style: {
      fontSize: 24,
      fill: 0xfffffe,
    },
  })

  const text = new Text({
    text: title,
    style: {
      fontSize: 48,
      fill: 0xfffffe,
    },
  })

  text.x = 2
  text.y = 52
  text.scale = 0.125

  buildingLabel.x = 2
  buildingLabel.y = 2
  buildingLabel.scale = 0.125

  container.addChild(text)

  const setBuilding = () => {
    container.addChild(buildingLabel)
  }

  const removeBuilding = () => {
    container.removeChild(buildingLabel)
  }

  return {
    title: title,
    container,
    setBuilding,
    removeBuilding,
  }
}
