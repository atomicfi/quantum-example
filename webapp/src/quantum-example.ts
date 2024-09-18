import { Quantum, QuantumPage, AuthStatus } from '@atomicfi/quantum-js'

export async function initializeQuantum({
  onAuthenticated
}: {
  onAuthenticated: () => void
}) {
  const startURL = 'https://bank.varomoney.com/login'

  const { page } = await Quantum.launch()

  await page.addUserScript(_demoCredentialsScript)
  await page.on('dispatch', _dispatchListener({ page, onAuthenticated }))
  await page.show()

  const status = await page.authenticate(startURL, async (page) => {
    const url = await page.url()
    return !!url?.includes('/accounts')
  })

  if (status === AuthStatus.Authenticated) {
    onAuthenticated()
    await page.hide()

    // Have access to hidden browser
    // Your bank aggregation will begin
    const aggregation = {
      identity: {} as any,
      accounts: [] as any[]
    }

    await page.waitForRequest((url) => url.includes('/GetUser'))
    const userRequest = _getRequestByUrl(page, '/GetUser')
    console.log('Got user')

    const {
      email,
      phone,
      accounts,
      customerInfo: { dateOfBirth, name, address }
    } = userRequest?.request?.response?.data.data.user

    aggregation.identity.firstName = name.first
    aggregation.identity.lastName = name.last
    aggregation.identity.dateOfBirth = dateOfBirth
    aggregation.identity.email = email.address
    aggregation.identity.phone = phone
    aggregation.identity.address = address.addressLine1
    aggregation.identity.address2 = address.addressLine2
    aggregation.identity.city = address.city
    aggregation.identity.state = address.state
    aggregation.identity.postalCode = address.zip

    for (const account of accounts) {
      await page.goto(`https://bank.varomoney.com/accounts/${account.id}`)
      await _sleep(2000)

      const accountNumberRequest = _getRequestByUrl(page, '/GetAccountR2')

      await page.evaluate(() =>
        // @ts-ignore
        document.querySelector('[aria-label="manage account"]')?.click()
      )

      await _sleep(2000)

      const accountNumberDataRequest = _getRequestByUrl(
        page,
        '/GetAccountNumber'
      )

      const transactionalDataRequest = _getRequestByUrl(
        page,
        '/SmartLedgerComponents'
      )

      console.log('Transaction:', transactionalDataRequest)

      const { product, name, routingNumber, totalBalance, availableBalance } =
        accountNumberRequest.request?.response?.data.data.accountR2

      aggregation.accounts.push({
        type: product.toLowerCase(),
        title: name,
        accountNumber:
          accountNumberDataRequest?.request?.response?.data?.data.accountR2
            .fullAccountNumber,
        routingNumber,
        availableBalance: availableBalance.amount,
        totalBalance: totalBalance.amount,
        transactions:
          transactionalDataRequest?.request?.response?.data?.data.smartLedgerComponents.children[0]?.children.map(
            (transaction: any) => ({
              description: transaction.primaryText.copy,
              amount: transaction.primaryDetail.copy,
              date: transaction.secondaryText.copy
            })
          )
      })
    }

    console.log(JSON.stringify(aggregation, null, 2))
  }
}

function _getRequestByUrl(page: QuantumPage, urlMatch: string) {
  return page
    .getRequests()
    .reverse()
    .filter((request) => request?.request?.url.includes(urlMatch))[0]
}

async function _sleep(time: number) {
  await new Promise((resolve) => setTimeout(resolve, time))
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
        input.value?.toLowerCase()?.includes('test-good')
    )
    
    if (demoCredentialsWereUsed) {
      clearInterval(window.demoInterval)
      MuppetPage.dispatch({ type: 'demo-auth' })
    }
  }, 2000)
`
