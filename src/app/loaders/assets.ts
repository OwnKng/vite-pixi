import { Assets, Texture, Rectangle } from "pixi.js"
import cardSrc from "../../assets/card.png"
import builderSrc from "../../assets/city/builder.png"
import itemsSrc from "../../assets/city/items.png"
import pipelineSrc from "../../assets/pipeline.png"
import lightSrc from "../../assets/light.png"
import buildButtonSrc from "../../assets/city/buildButton.png"
import type { TextureSource } from "pixi.js"
import pixelifySans from "../../assets/fonts/pixelify-sans.woff2"
import closeButtonSrc from "../../assets/ui/closeButton.png"
import windowLargeSrc from "../../assets/ui/windowLarge.png"
import arrowsSrc from "../../assets/ui/arrows.png"
import windowSmallSrc from "../../assets/ui/windowSmall.png"
import buttonsSmallSrc from "../../assets/ui/buttons-small.png"
import scorecardTextureSrc from "../../assets/ui/scorecard.png"
import playerDetailsTextureSrc from "../../assets/ui/character-details.png"
import characterSrc from "../../assets/characters/character.png"
import textInputSrc from "../../assets/ui/textinput.png"

Assets.init({
  manifest: {
    bundles: [
      {
        name: "core",
        assets: [
          {
            alias: "buttonTexture",
            src: buildButtonSrc,
          },
          {
            alias: "closeButtonTexture",
            src: closeButtonSrc,
          },
          {
            alias: "windowLarge",
            src: windowLargeSrc,
          },
          {
            alias: "windowSmall",
            src: windowSmallSrc,
          },
          {
            alias: "arrowsTexture",
            src: arrowsSrc,
          },
          {
            alias: "buttonsSmall",
            src: buttonsSmallSrc,
          },
          {
            alias: "scorecardTexture",
            src: scorecardTextureSrc,
          },
          {
            alias: "playerDetailsTexture",
            src: playerDetailsTextureSrc,
          },
          {
            alias: "cardTextures",
            src: cardSrc,
          },
          {
            alias: "textInputTexture",
            src: textInputSrc,
          },
        ],
      },
      {
        name: "characters",
        assets: [
          {
            alias: "characterTexture",
            src: characterSrc,
          },
        ],
      },
      {
        name: "city",
        assets: [
          {
            alias: "upgradesTexture",
            src: builderSrc,
          },
          {
            alias: "itemsTextures",
            src: itemsSrc,
          },
          {
            alias: "buildButtonTexture",
            src: buildButtonSrc,
          },
        ],
      },
      {
        name: "pipeline",
        assets: [
          {
            alias: "pipelineBackground",
            src: pipelineSrc,
          },
        ],
      },
      {
        name: "upgrades",
        assets: [
          {
            alias: "light",
            src: lightSrc,
          },
        ],
      },
    ],
  },
})

export const loadCoreAssets = async () => await Assets.loadBundle("core")

export const loadPlayingAssets = async () => await Assets.loadBundle("playing")

export const loadCityAssets = async () => await Assets.loadBundle("city")

export const loadCharacterAssets = async () =>
  await Assets.loadBundle("characters")

export const loadPipelineAssets = async () =>
  await Assets.loadBundle("pipeline")

export const loadUpgradesAssets = async () =>
  await Assets.loadBundle("upgrades")

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

export async function loadFonts() {
  await Assets.load(pixelifySans)
}
