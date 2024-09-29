import { Container, Text, TextStyle } from "pixi.js"
import { lightTextStyles } from "./utils"
import { dims } from "../consts"
import { Graphics } from "pixi.js"
import gsap from "gsap"

const createAnnouncement = () => {
  const notifications = []

  const container = new Container()
  container.visible = false

  const backgroupContainer = new Container()

  backgroupContainer.addChild(
    new Graphics()
      .rect(0, dims.height * 0.25, dims.width, dims.height * 0.5)
      .fill(0x000000)
  )
  backgroupContainer.alpha = 0.5
  container.addChild(backgroupContainer)

  const text = new Text({
    text: "",
    style: new TextStyle(lightTextStyles),
  })

  text.scale = 0.25

  container.addChild(text)

  const addNotification = (notification: string) => {
    notifications.push(notification)
    text.text = notification
    text.x = dims.width * 0.5 - text.width / 2

    show()
  }

  const show = async () => {
    container.visible = true

    const targetY = dims.height * 0.5 - text.height / 2
    text.y = targetY + 32

    await gsap.to(text, {
      y: targetY,
      duration: 0.25,
      ease: "power2.out",
    })

    setTimeout(() => {
      hide()
    }, 2000)
  }

  const hide = () => {
    container.visible = false
  }

  const addToWorld = (parent: Container) => parent.addChild(container)

  return {
    addNotification,
    addToWorld,
  }
}

export const announcements = createAnnouncement()
