import { Container } from "pixi.js"
import { createWindow } from "../layout/window"
import { createScrollingTextContainer } from "../layout/scrollingText"

type MissionUiProps = {
  name: string
  description: string
  reward: number
  close: () => void
}

export const createMissionCard = async ({
  name,
  description,
  reward,
  close,
}: MissionUiProps) => {
  const w = await createWindow({
    title: name,
    close: () => hanldeClose(),
    size: "small",
  })

  const hanldeClose = () => {
    close()
    w.container.removeFromParent()
    w.container.destroy()
  }

  const textBox = createScrollingTextContainer({
    text: description,
    width: w.contentArea.width,
    height: w.contentArea.height,
  })

  textBox.addToParent(w.contentArea)

  return {
    addToWorld: (parent: Container) => parent.addChild(w.container),
  }
}
