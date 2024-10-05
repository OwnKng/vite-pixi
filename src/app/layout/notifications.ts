import { createWindow } from "./window"
import type { WindowUi } from "./window"
import { Container } from "pixi.js"
import gsap from "gsap"

const createNotificationCard = () => {
  let w: WindowUi

  async function init() {
    const w = await createWindow({
      title: "Notifications",
      size: "small",
      close: () => hide(),
    })
  }

  async function hide() {
    await gsap.to(w.windowContainer, {
      alpha: 0,
      y: 64,
      duration: 0.125,
      ease: "power2.in",
    })

    w.container.visible = false
  }

  async function show() {
    w.container.visible = true

    await gsap.to(w.windowContainer, {
      alpha: 1,
      y: 32,
      duration: 0.125,
      ease: "power2.out",
    })
  }

  const addToWorld = (parent: Container) => {
    parent.addChild(w.container)
  }

  return {
    init,
    hide,
    show,
    addToWorld,
  }
}
