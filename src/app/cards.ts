import { Sprite, Container, Text } from "pixi.js"
import { cardTextures } from "./loaders/assets"
import { ScrollBox } from "@pixi/ui"

const [cardTexture, cardHoveredTexture] = cardTextures

export const createScrollingCards = () => {
  let items: Card[] = []

  const scrollBox = new ScrollBox({
    width: 220,
    height: 116,
    globalScroll: true,
    elementsMargin: 8,
  })

  const reorder = (fn: (a: Card, b: Card) => number) => {}

  const removeItem = (title: string) => {
    const item = items.find((item) => item.title === title)

    if (!item) return

    const index = items.indexOf(item)

    scrollBox.removeItem(index)
    items = items.filter((item) => item.title !== title)
  }

  const addItem = (title: string, onClick: () => void) => {
    const card = createCard({ title, onClick })
    scrollBox.addItem(card.container)

    items.push(card)
  }

  return {
    scrollBox,
    addItem,
    removeItem,
    reorder,
  }
}

type CardProps = {
  title: string
  onClick: () => void
}

type Card = {
  title: string
  container: Container
}

const createCard = ({ title, onClick }: CardProps): Card => {
  const sprite = Sprite.from(cardTexture.texture)

  const container = new Container()
  container.addChild(sprite)
  container.cursor = "pointer"

  container.on("mouseenter", () => {
    sprite.texture = cardHoveredTexture.texture
  })

  container.on("mouseleave", () => {
    sprite.texture = cardTexture.texture
  })

  container.on("click", onClick)

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

  container.addChild(text)

  return {
    title: title,
    container,
  }
}
