import { Container, Text } from "pixi.js"

const createAnnouncement = () => {
  const notifications = []

  const container = new Container()
  container.visible = false

  const text = new Text({
    text: "",
    style: {
      fill: 0xffffff,
      fontSize: 24,
    },
  })
  text.scale = 0.5

  container.addChild(text)

  const addNotification = (notification: string) => {
    notifications.push(notification)
    text.text = notification
    show()
  }

  const show = () => {
    container.visible = true

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
