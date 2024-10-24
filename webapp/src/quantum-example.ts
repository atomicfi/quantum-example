import { Quantum } from '@atomicfi/quantum-js'

export async function initializeQuantum() {
  const { page } = await Quantum.launch()

  // Setup listener for iframe messages
  await page.addUserScript(_getIframeScript())
  await page.show()

  await page.goto(
    'https://iframetester.com/?url=https://www.youtube.com/embed/27PHT9K8izo?si=NhJ31C-K5aqRFSVM'
  )

  await new Promise((resolve) => setTimeout(resolve, 3000))

  // Click the share button
  await page.evaluate(() => {
    const frame = document.querySelector('#iframe-window') as HTMLIFrameElement
    frame.contentWindow?.postMessage(
      { type: 'click', selector: '[title="More"]' },
      '*'
    )
  })
}

const _getIframeScript = () => {
  const script = () => {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'click') {
        document.querySelector(event.data.selector)?.click()
      }
    })
  }

  return `(${script.toString()})()`
}
