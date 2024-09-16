import { Assets, Texture, Rectangle } from "pixi.js"
import navigationSrc from "../../assets/navigation.png"
import menuSrc from "../../assets/menu.png"
import cardSrc from "../../assets/card.png"
import selectedSrc from "../../assets/selected.png"
import type { TextureSource } from "pixi.js"

Assets.init({
  manifest: {
    bundles: [
      {
        name: "playing",
        assets: [
          {
            alias: "navigation",
            src: navigationSrc,
          },
          {
            alias: "menu",
            src: menuSrc,
          },
        ],
      },
      {
        name: "cards",
        assets: [
          {
            alias: "cards",
            src: cardSrc,
          },
        ],
      },
      {
        name: "overlays",
        assets: [
          {
            alias: "selected",
            src: selectedSrc,
          },
        ],
      },
    ],
  },
})

export const loadPlayingAssets = async () => await Assets.loadBundle("playing")

export function createTileset(asset: TextureSource, w: number, h: number) {
  const rows = Math.floor(asset.height / h)
  const cols = Math.floor(asset.width / w)

  return new Array(rows * cols).fill(0).map((_, i) => {
    const x = (i % cols) * w
    const y = Math.floor(i / cols) * h

    const texture = new Texture({
      source: asset,
      frame: new Rectangle(x, y, w, h),
    })

    texture.source.scaleMode = "nearest"

    return { texture, id: i }
  })
}

const { cards } = await Assets.loadBundle("cards")
const cardTextures = createTileset(cards, 64, 80)

const { selected } = await Assets.loadBundle("overlays")
selected.source.scaleMode = "nearest"

export { cardTextures, selected }
