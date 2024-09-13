import React, { useState } from 'react'
import './App.css'
import { initializeQuantum } from './quantum-example'

function App() {
  const [authenticated, setAuthenticated] = useState(false)

  async function launch() {
    await initializeQuantum({
      onAuthenticated: () => setAuthenticated(true)
    })
  }

  return (
    <div className="App" style={appStyle}>
      {!authenticated ? (
        <div className="Launch" style={launchStyle}>
          <header className="App-header">
            <p>Example using QuantumJS</p>
            <small>Use `test-good` for your username to authenticate.</small>
          </header>
          <button onClick={launch} style={buttonStyle}>
            Launch
          </button>
        </div>
      ) : (
        <div className="Authenticated" style={authenticatedStyle}>
          <p>You are authenticated!</p>
          <p>
            Please refer to the{' '}
            <a
              href="https://github.com/atomicfi/quantum-js"
              target="_blank"
              style={linkStyle}
            >
              QuantumJS
            </a>{' '}
            documentation for further usage.
          </p>
        </div>
      )}
    </div>
  )
}

const appStyle = {
  height: '100vh',
  background: 'linear-gradient(#111, #555)',
  color: 'white'
}

const launchStyle = {
  display: 'flex',
  flexDirection: 'column' as 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  textAlign: 'center' as 'center'
}

const buttonStyle = {
  backgroundColor: '#3f51b5',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '20px'
}

const authenticatedStyle = {
  padding: 20
}

const linkStyle = {
  color: '#ADD8E6'
}

export default App
