import "./style.css"
import createApplication from "./app/index.ts"
import { dims } from "./app/consts.ts"

const container = document.querySelector<HTMLDivElement>("#app")!
container.className = "w-screen h-screen flex justify-center items-center"

const gamewindow = document.getElementById("gamewindow")!

const desiredAspectRatio = 16 / 9 // Example aspect ratio (16:9)

function resizeGameWindow() {
  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight

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
