import { queries, removeFromPipeline } from "../entities"
import gsap from "gsap"

export const updatePipelineUi = () => {
  let offset = 0

  for (const pipeline of queries.pipeline) {
    if (!pipeline.needsUpdate) continue
    const { ui, upgrades } = pipeline

    ui.container.removeChildren()

    upgrades.forEach((upgrade) => {
      const sprite = upgrade.sprite
      sprite.eventMode = "static"

      gsap.to(sprite, {
        x: offset,
        duration: 0.25,
      })
      offset += sprite.width

      sprite.on("click", () => {
        removeFromPipeline(upgrade)
      })

      ui.container.addChild(sprite)
    })

    pipeline.needsUpdate = false
  }
}
