import React, { useEffect } from 'react'
import './App.css'
import { Quantum } from '@atomicfi/quantum-js'

function App() {
  useEffect(() => {
    initializeQuantum()
  }, [])

  async function initializeQuantum() {
    // Authenticate into a website
    const { page } = await Quantum.launch()
    const startURL = 'https://mocky.atomicfi.com'

    await page.show()

    await page.authenticate(startURL, async (page) => {
      const url = await page.url()
      return !!url?.includes('/profile')
    })

    await page.hide()
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Example QuantumJS application</p>
      </header>
    </div>
  )
}

export default App
