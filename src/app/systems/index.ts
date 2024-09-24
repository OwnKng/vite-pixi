import { queries } from "../entities"

export const updatePipelineUi = () => {
  let offset = 0

  for (const pipeline of queries.pipeline) {
    if (!pipeline.needsUpdate) continue
    const { ui, construction } = pipeline

    ui.container.removeChildren()

    construction.forEach((construction) => {
      const sprite = construction.sprite
      sprite.x = offset
      offset += sprite.width

      ui.container.addChild(sprite)
    })

    pipeline.needsUpdate = false
  }
}
