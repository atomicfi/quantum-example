import React, { useState } from 'react'
import './App.css'
import { initializeQuantum } from './quantum-example'
import confetti from 'canvas-confetti'

function App() {
  const [authenticated, setAuthenticated] = useState(false)

  async function launch() {
    await initializeQuantum({
      onAuthenticated: () => {
        setAuthenticated(true)
        confetti()
      }
    })
  }

  return (
    <div className="App" style={appStyle}>
      <div className="gradient-bg"></div>
      {!authenticated ? (
        <div className="Launch" style={launchStyle}>
          <header className="App-header">
            <p>Example using QuantumJS</p>
            <small>
              To simulate an authentication use <code>test-good</code> as your
              username.
            </small>
          </header>
          <button onClick={launch} style={buttonStyle}>
            Login to Netflix
          </button>
        </div>
      ) : (
        <div className="Authenticated" style={authenticatedStyle}>
          <header className="App-header">
            <p>You are authenticated!</p>
            <small>
              Please refer to the QuantumJS
              <br />
              documentation for further usage.
            </small>
          </header>
        </div>
      )}
    </div>
  )
}

const appStyle = {
  height: '100vh',
  color: 'white',
  position: 'relative' as 'relative',
  overflow: 'hidden'
}

const launchStyle = {
  display: 'flex',
  flexDirection: 'column' as 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  textAlign: 'center' as 'center',
  position: 'relative' as 'relative',
  zIndex: 1
}

const buttonStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '20px'
}

const authenticatedStyle = {
  display: 'flex',
  flexDirection: 'column' as 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  textAlign: 'center' as 'center',
  position: 'relative' as 'relative',
  zIndex: 1
}

export default App
