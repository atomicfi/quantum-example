import { Quantum, QuantumPage, AuthStatus, Request } from '@atomicfi/quantum-js'

export async function initializeQuantum({
  onAuthenticated
}: {
  onAuthenticated: () => void
}) {
  const startURL = 'https://bank.varomoney.com/login'

  const { page } = await Quantum.launch()
  await page.show()

  const status = await page.authenticate(
    startURL,
    async (page) => {
      const url = await page.url()
      return !!url?.includes('/accounts')
    },
    { timeout: 5000000 }
  )

  if (status === AuthStatus.Authenticated) {
    onAuthenticated()
    await page.hide()
  }

  await _aggregateAccounts(page)
}

async function _aggregateAccounts(page: QuantumPage) {
  // Have access to hidden browser
  // Your bank aggregation will begin
  const aggregation = {
    identity: {} as any,
    accounts: [] as any[]
  }

  await page.goto('https://bank.varomoney.com/accounts')
  await _sleep(2000)

  await page.waitForRequest((request: Request) =>
    request.url.includes('/GetUser')
  )

  const userRequest = _getRequest(page, (request) =>
    request.url.includes('/GetUser')
  )

  const {
    email,
    phone,
    accounts,
    customerInfo: { dateOfBirth, name, address }
  } = userRequest.response?.data.data.user

  // Aggregate identity data
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
    // Fetch account data
    console.log('Fetching account', account.id)

    await page.goto(`https://bank.varomoney.com/accounts/${account.id}`)
    await page.waitForRequest(
      (request: Request) =>
        request.url.includes('/GetAccountR2') &&
        request.data.variables.id === account.id
    )

    const accountRequest = _getRequest(page, (request) =>
      request.url.includes('/GetAccountR2')
    )

    console.log('Received account data', accountRequest)

    // Fetch account number
    await page.click('[aria-label="manage account"]')

    await page.waitForRequest(
      (request: Request) =>
        request.url.includes('/GetAccountNumber') &&
        request.data.variables.id === account.id
    )

    const accountNumberDataRequest = _getRequest(page, (request) =>
      request.url.includes('/GetAccountNumber')
    )

    console.log('Received account number data', accountNumberDataRequest)

    await page.waitForRequest(
      (request: Request) =>
        request.url.includes('/SmartLedgerComponents') &&
        request.data.variables.accountId === account.id
    )

    // Fetch transactional data
    const transactionalDataRequest = _getRequest(
      page,
      (request) =>
        request.url.includes('/SmartLedgerComponents') &&
        request.data.variables.accountId === account.id
    )

    console.log('Received transactional data', transactionalDataRequest)

    const { product, name, routingNumber, totalBalance, availableBalance } =
      accountRequest.response?.data.data.accountR2

    // Aggregate account data
    aggregation.accounts.push({
      type: product.toLowerCase(),
      title: name,
      accountNumber:
        accountNumberDataRequest.response?.data?.data.accountR2
          .fullAccountNumber,
      routingNumber,
      availableBalance: availableBalance.amount,
      totalBalance: totalBalance.amount,
      transactions:
        transactionalDataRequest.response?.data?.data.smartLedgerComponents.children[0]?.children.map(
          (transaction: any) => ({
            description: transaction.primaryText.copy,
            amount: transaction.primaryDetail.copy,
            date: transaction.secondaryText.copy
          })
        )
    })
  }

  console.log('Aggregated accounts')
  console.log(JSON.stringify(aggregation, null, 2))
}

function _getRequest(
  page: QuantumPage,
  matcher: (request: Request) => boolean
) {
  return page.getRequests().reverse().filter(matcher)[0]
}

async function _sleep(time: number) {
  await new Promise((resolve) => setTimeout(resolve, time))
}

// Chase login: https://www.chase.com/personal/offers/secureshopping
