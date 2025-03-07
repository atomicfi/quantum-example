import { Quantum, QuantumPage, AuthStatus } from '@atomicfi/quantum-js'

export async function initializeQuantum({
  onAuthenticated
}: {
  onAuthenticated: (status: string) => void
}) {
  const startURL = 'https://bank.varomoney.com/login'

  const { page } = await Quantum.launch()

  await page.addUserScript(_demoCredentialsScript)
  await page.on('dispatch', _dispatchListener({ page, onAuthenticated }))
  await page.show()

  const status = await page.authenticate(
    startURL,
    async (page) => {
      const url = await page.url()
      return !!url?.includes('/accounts')
    },
    { timeout: 300000 }
  )

  onAuthenticated(status)
  await page.hide()
}

function _dispatchListener({
  page,
  onAuthenticated
}: {
  page: QuantumPage
  onAuthenticated: (status: string) => void
}) {
  return (event: any) => {
    switch (event.detail.data?.type) {
      case 'demo-auth':
        onAuthenticated(AuthStatus.Authenticated)
        return page.hide()
    }
  }
}

const _demoCredentialsScript = `
  window.demoInterval = setInterval(() => {
    const demoCredentialsWereUsed = Array.from(document.querySelectorAll('input')).some(input =>
        input.value?.toLowerCase()?.includes('test-good')
    )
    
    if (demoCredentialsWereUsed) {
      clearInterval(window.demoInterval)
      MuppetPage.dispatch({ type: 'demo-auth' })
    }
  }, 2000)
`
