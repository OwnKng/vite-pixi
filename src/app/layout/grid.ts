import { Sprite, Container, Graphics } from "pixi.js"
import gsap from "gsap"
import { createTileset, loadCoreAssets } from "../loaders/assets"
import { createButton } from "./button"

export const createGrid = async ({
  width = 304,
  height = 80,
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
    .roundRect(0, 0, width - scrollOffset * 2, height, 2)
    .fill(0xffffff)

  itemsContainer.addChild(mask)
  itemsContainer.mask = mask

  container.addChild(
    new Graphics().roundRect(0, 0, width, height, 2).fill(0x000000)
  )

  let index = 0
  let xOffset = scrollOffset
  let items: any[] = []

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

  //_ Button UIs
  const { arrowsTexture } = await loadCoreAssets()
  arrowsTexture.source.scaleMode = "nearest"

  const [right, rightSelected, left, leftSelected] = createTileset(
    arrowsTexture,
    16,
    16
  )

  const leftTrigger = createButton({
    buttonText: "",
    texture: left.texture,
    hoverTexture: leftSelected.texture,
    onclick: moveBackward,
  })

  leftTrigger.x = 0
  leftTrigger.y = height * 0.5 - leftTrigger.height * 0.5

  const rightTrigger = createButton({
    buttonText: "",
    texture: right.texture,
    hoverTexture: rightSelected.texture,
    onclick: moveForward,
  })

  rightTrigger.x = width - rightTrigger.width
  rightTrigger.y = height * 0.5 - rightTrigger.height * 0.5

  container.addChild(itemsContainer)
  container.addChild(rightTrigger)
  container.addChild(leftTrigger)

  const addItem = (item: Container | Sprite) => {
    const x = items.reduce((acc, item) => acc + item.width + gap, 0)
    items.push(item)

    item.x = x + gap * 0.5

    itemsContainer.addChild(item)
  }

  return {
    container,
    addItem,
    resetView: () => {
      index = 0
      scrollTo(index)
    },
  }
}
