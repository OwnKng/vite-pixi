import { Sprite, Container, Text, Graphics } from "pixi.js"
import { cardTextures } from "./loaders/assets"
import { ScrollBox } from "@pixi/ui"

const [cardTexture, cardHoveredTexture] = cardTextures

const dims = {
  width: 320,
  height: 80,
  margins: 4,
}

export const createScrollingCards = (x: number, y: number) => {
  let items: Card[] = []

  let index = 0

  const scrollBox = new ScrollBox({
    width: 320,
    height: 80,
    globalScroll: false,
    elementsMargin: dims.margins,
    horPadding: dims.margins,
    type: "horizontal",
  })

  scrollBox.position.set(0, 16)

  const container = new Container()
  container.position.set(x, y)
  container.addChild(scrollBox)

  // Left trigger
  const leftTrigger = new Graphics()
    .rect(dims.margins, 0, 16, 16)
    .fill(0xffffff)

  leftTrigger.eventMode = "static"

  leftTrigger.on("click", () => {
    index = Math.max(0, index - 1)
    updateScroll()
  })

  container.addChild(leftTrigger)

  // Right trigger
  const rightTrigger = new Graphics()
    .rect(320 - 16 - 4, 0, 16, 16)
    .fill(0xffffff)

  rightTrigger.eventMode = "static"

  rightTrigger.on("click", () => {
    index = Math.min(items.length - 1, index + 1)
    updateScroll()
  })

  container.addChild(rightTrigger)

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

  const updateScroll = () => scrollBox.scrollTo(index)

  return {
    container,
    scrollBox,
    addItem,
    removeItem,
    reorder,
    scrollTo,
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
