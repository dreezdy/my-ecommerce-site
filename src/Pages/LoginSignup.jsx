import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import './CSS/LoginSignup.css'
import { ShopContext, DEMO_MODE } from '../Context/ShopContext'


// The two glowing lines that appear under the button on hover
const BottomGradient = () => (
  <>
    <span className="auth-glow auth-glow-cyan" />
    <span className="auth-glow auth-glow-indigo" />
  </>
)

export const LoginSignup = () => {
  const { user, authLoading, login, signup } = useContext(ShopContext)

  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isSignup = mode === 'signup'

  const switchMode = () => {
    setMode(isSignup ? 'login' : 'signup')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (isSignup) {
      if (!firstName.trim() || !lastName.trim()) {
        setError('Please enter your first and last name')
        return
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters')
        return
      }
      if (!agree) {
        setError('Please agree to the terms to continue')
        return
      }
    }

    setSubmitting(true)
    try {
      if (isSignup) {
        // The backend stores one "name", so we join the two fields
        const fullName = `${firstName.trim()} ${lastName.trim()}`
        await signup(fullName, email, password)
      } else {
        await login(email, password)
      }
      // On success, `user` gets set and the redirect below takes over
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Demo version: there is no backend, so accounts can't work
  if (DEMO_MODE) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2 className="auth-title">Demo preview</h2>
          <p className="auth-subtitle">
            Accounts and saved carts aren't available in this demo version of
            Ashodi Scents. Feel free to browse the shop and try the cart!
          </p>
        </div>
      </div>
    )
  }

  // Still checking a saved login
  if (authLoading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p className="auth-subtitle">Loading...</p>
        </div>
      </div>
    )
  }

  // Already logged in: go to the home page
  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Welcome to Ashodi Scents</h2>
        <p className="auth-subtitle">
          {isSignup
            ? 'Create an account to start shopping our perfume collection.'
            : 'Log in to your account to continue.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="auth-row">
              <div className="auth-field">
                <label htmlFor="firstname" className="auth-label">First name</label>
                <input
                  id="firstname"
                  className="auth-input"
                  type="text"
                  placeholder="Chioma"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="lastname" className="auth-label">Last name</label>
                <input
                  id="lastname"
                  className="auth-input"
                  type="text"
                  placeholder="Eze"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="email" className="auth-label">Email Address</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">Password</label>
            <input
              id="password"
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              required
            />
            {isSignup && <span className="auth-hint">At least 8 characters</span>}
          </div>

          {isSignup && (
            <label className="auth-agree">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>By continuing, I agree to the terms of use & privacy policy</span>
            </label>
          )}

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button className="auth-button" type="submit" disabled={submitting}>
            {submitting ? 'Please wait...' : isSignup ? 'Sign up →' : 'Log in →'}
            <BottomGradient />
          </button>
        </form>

        <div className="auth-divider" />

        <p className="auth-switch">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <span onClick={switchMode}>{isSignup ? 'Login' : 'Sign up'}</span>
        </p>
      </div>
    </div>
  )
}