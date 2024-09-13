import { Quantum, QuantumPage } from '@atomicfi/quantum-js'

export async function initializeQuantum({
  onAuthenticated
}: {
  onAuthenticated: () => void
}) {
  const startURL = 'https://www.netflix.com/login'

  const { page } = await Quantum.launch()

  await page.addUserScript(_demoCredentialsScript)
  await page.on('dispatch', _dispatchListener({ page, onAuthenticated }))

  await page.show()

  await page.authenticate(startURL, async (page) => {
    const url = await page.url()
    return !!url?.includes('/browse')
  })

  onAuthenticated()

  await page.hide()
}

function _dispatchListener({
  page,
  onAuthenticated
}: {
  page: QuantumPage
  onAuthenticated: () => void
}) {
  return (event: any) => {
    switch (event.detail.data?.type) {
      case 'demo-auth':
        onAuthenticated()
        return page.hide()
    }
  }
}

const _demoCredentialsScript = `
  window.demoInterval = setInterval(() => {
    const demoCredentialsWereUsed = Array.from(document.querySelectorAll('input')).some(input =>
        input.value?.toLowerCase()?.includes('test-good') || input.value?.toLowerCase()?.includes('test-feels-so-good')
    )
    
    if (demoCredentialsWereUsed) {
      clearInterval(window.demoInterval)
      MuppetPage.dispatch({ type: 'demo-auth' })
    }
  }, 2000)
`
