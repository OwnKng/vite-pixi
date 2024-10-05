import { createWindow } from "./window"
import gsap from "gsap"

export const createMissionsUi = async () => {
  const w = await createWindow({
    title: "Missions",
    size: "small",
    close: () => hide(),
  })

  w.container.visible = false

  async function show() {
    w.container.visible = true

    await gsap.to(w.windowContainer, {
      alpha: 1,
      y: 32,
      duration: 0.125,
      ease: "power2.out",
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

  return {
    container: w.container,
    show,
  }
}
