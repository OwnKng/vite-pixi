import { Sprite, Container, Graphics } from "pixi.js"
import gsap from "gsap"

export const createGrid = ({
  width = 320,
  height = 96,
  gap = 8,
  scrollOffset = 0,
}: {
  width: number
  height: number
  gap?: number
  scrollOffset?: number
}) => {
  const container = new Container()

  const itemsContainer = new Container()
  itemsContainer.x = scrollOffset

  const mask = new Graphics()
    .roundRect(0, 0, width - scrollOffset * 2, height, 4)
    .fill(0xffffff)

  itemsContainer.addChild(mask)
  itemsContainer.mask = mask

  let index = 0
  let xOffset = scrollOffset
  let items: any[] = []

  // Left trigger
  const leftTrigger = new Graphics().rect(4, 0, 16, 16).fill(0xffffff)
  leftTrigger.eventMode = "static"

  const moveForward = () => {
    if (index === items.length - 1) return

    index++
    scrollTo(index)
  }

  const moveBackward = () => {
    if (index === 0) return

    index--
    scrollTo(index)
  }

  const scrollTo = (index: number) => {
    xOffset =
      items.slice(0, index).reduce((acc, item) => acc + item.width + gap, 0) *
      -1

    gsap.to(itemsContainer, {
      x: xOffset + scrollOffset,
    })

    gsap.to(mask, {
      x: xOffset * -1,
    })
  }

  leftTrigger.on("click", () => moveBackward())
  container.addChild(leftTrigger)

  // Right trigger
  const rightTrigger = new Graphics()
    .rect(320 - 16 - 4, 0, 16, 16)
    .fill(0xffffff)

  rightTrigger.eventMode = "static"
  rightTrigger.on("click", () => moveForward())

  container.addChild(rightTrigger)
  container.addChild(itemsContainer)

  const addItem = (item: Container | Sprite) => {
    const x = items.reduce((acc, item) => acc + item.width + gap, 0)
    items.push(item)

    item.x = x
    item.y = 16

    itemsContainer.addChild(item)
  }

  return {
    container,
    addItem,
  }
}
