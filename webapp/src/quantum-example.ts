import { Quantum } from '@atomicfi/quantum-js'

export async function initializeQuantum({
  onAuthenticated
}: {
  onAuthenticated: () => void
}) {
  const { page } = await Quantum.launch()
  const startURL = 'https://mocky.atomicfi.com'

  await page.show()

  await page.authenticate(startURL, async (page) => {
    const url = await page.url()
    return !!url?.includes('/profile')
  })

  onAuthenticated()

  await page.hide()
}
