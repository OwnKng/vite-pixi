import { Sprite } from "pixi.js"
import { loadCharacterAssets } from "../loaders/assets"

export const createCharacterSprites = async () => {
  const { characterTexture } = await loadCharacterAssets()
  characterTexture.source.scaleMode = "nearest"
  const characterSprite = Sprite.from(characterTexture.source)
  characterSprite.anchor.set(0.5)

  return {
    character: characterSprite,
  }
}
