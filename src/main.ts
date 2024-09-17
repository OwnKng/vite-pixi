import "./style.css"
import createApplication from "./app/index.ts"
import { dims } from "./app/consts.ts"

const container = document.querySelector<HTMLDivElement>("#app")!

const gamewindow = document.getElementById("gamewindow")!

const desiredAspectRatio = dims.width / dims.height

function resizeGameWindow() {
  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight - 32

  const containerAspectRatio = containerWidth / containerHeight

  if (containerAspectRatio > desiredAspectRatio) {
    // Container is wider than the desired aspect ratio
    gamewindow.style.width = `${containerHeight * desiredAspectRatio}px`
    gamewindow.style.height = `${containerHeight}px`
  } else {
    // Container is taller than the desired aspect ratio
    gamewindow.style.width = `${containerWidth}px`
    gamewindow.style.height = `${containerWidth / desiredAspectRatio}px`
  }
}

async function main() {
  const pixi = createApplication()

  const { app, setPlay } = pixi

  await app.init({
    resizeTo: gamewindow,
    backgroundColor: 0x10141f,
  })

  gamewindow.appendChild(app.canvas)
  await setPlay()
}

resizeGameWindow()
window.addEventListener("resize", resizeGameWindow)

main()
