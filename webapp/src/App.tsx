import React, { useState } from 'react'
import './App.css'
import { initializeQuantum } from './quantum-example'
import { AuthStatus } from '@atomicfi/quantum-js'
import confetti from 'canvas-confetti'

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [status, setStatus] = useState('')

  async function launch() {
    await initializeQuantum({
      onAuthenticated: (status) => {
        if (status === AuthStatus.Authenticated) {
          setAuthenticated(true)
          confetti()
        } else {
          setStatus(status)
        }
      }
    })
  }

  return (
    <div className="App" style={appStyle}>
      <div className="gradient-bg"></div>
      {status && !authenticated ? (
        <div className="Launch" style={launchStyle}>
          <header className="App-header">
            <p>Authentication Status: {status}</p>
            <small>Please try again</small>
          </header>
          <button onClick={launch} style={buttonStyle}>
            Retry Login
          </button>
        </div>
      ) : !authenticated ? (
        <div className="Launch" style={launchStyle}>
          <header className="App-header">
            <p>Example using QuantumJS</p>
            <small>
              To simulate an authentication you can use <code>test-good</code>{' '}
              as your username.
            </small>
          </header>
          <button onClick={launch} style={buttonStyle}>
            Login to Varo
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
  paddingLeft: '50px',
  paddingRight: '50px',
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
