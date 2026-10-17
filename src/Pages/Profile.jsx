import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import './CSS/Profile.css'

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

const ProfileContent = ({ user }) => {
  const { updateProfile, changePassword } = useContext(ShopContext)

  // Details form
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone || '')
  const [address, setAddress] = useState(user.address || '')
  const [city, setCity] = useState(user.city || '')
  const [stateName, setStateName] = useState(user.state || '')
  const [detailsMessage, setDetailsMessage] = useState({ type: '', text: '' })
  const [savingDetails, setSavingDetails] = useState(false)

  // Password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' })
  const [savingPassword, setSavingPassword] = useState(false)

  // Only enable "Save changes" when something is different
  const hasChanges =
    name.trim() !== user.name ||
    email.trim().toLowerCase() !== user.email ||
    phone.trim() !== (user.phone || '') ||
    address.trim() !== (user.address || '') ||
    city.trim() !== (user.city || '') ||
    stateName.trim() !== (user.state || '')

  const handleDetailsSubmit = async (e) => {
    e.preventDefault()
    setDetailsMessage({ type: '', text: '' })

    if (!name.trim()) {
      setDetailsMessage({ type: 'error', text: 'Please enter your name' })
      return
    }
    if (!isValidEmail(email.trim())) {
      setDetailsMessage({ type: 'error', text: 'Please enter a valid email address' })
      return
    }
    if (phone.trim() && !/^[0-9+()\-\s]{7,20}$/.test(phone.trim())) {
      setDetailsMessage({ type: 'error', text: 'Please enter a valid phone number' })
      return
    }

    setSavingDetails(true)
    try {
      await updateProfile({
        name,
        email,
        phone,
        address,
        city,
        state: stateName,
      })
      // Show the cleaned-up values in the form
      setName(name.trim())
      setEmail(email.trim().toLowerCase())
      setPhone(phone.trim())
      setAddress(address.trim())
      setCity(city.trim())
      setStateName(stateName.trim())
      setDetailsMessage({ type: 'success', text: 'Your profile has been updated.' })
    } catch (err) {
      setDetailsMessage({ type: 'error', text: err.message })
    } finally {
      setSavingDetails(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordMessage({ type: '', text: '' })

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Please fill in all three password fields' })
      return
    }
    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 8 characters' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'The new passwords do not match' })
      return
    }

    setSavingPassword(true)
    try {
      await changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordMessage({ type: 'success', text: 'Your password has been changed.' })
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.message })
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">{user.name.trim().charAt(0).toUpperCase()}</div>
        <div>
          <h1>
            {user.name}
            {user.role === 'admin' && <span className="profile-badge">Admin</span>}
          </h1>
          <p className="profile-meta">
            {user.email}
            {user.createdAt && ` · Member since ${formatDate(user.createdAt)}`}
          </p>
        </div>
      </div>

      {/* ----- Personal details ----- */}
      <form className="profile-card" onSubmit={handleDetailsSubmit}>
        <h2>Personal details</h2>
        <p className="profile-card-subtitle">Update your name, contact and delivery details.</p>

        <label className="profile-label" htmlFor="profile-name">Full name</label>
        <input
          id="profile-name"
          className="profile-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          autoComplete="name"
        />

        <div className="profile-row">
          <div>
            <label className="profile-label" htmlFor="profile-email">Email address</label>
            <input
              id="profile-email"
              className="profile-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="profile-label" htmlFor="profile-phone">Phone (optional)</label>
            <input
              id="profile-phone"
              className="profile-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={20}
              autoComplete="tel"
            />
          </div>
        </div>

        <label className="profile-label" htmlFor="profile-address">Delivery address (optional)</label>
        <input
          id="profile-address"
          className="profile-input"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          maxLength={200}
          autoComplete="street-address"
        />

        <div className="profile-row">
          <div>
            <label className="profile-label" htmlFor="profile-city">City</label>
            <input
              id="profile-city"
              className="profile-input"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              maxLength={80}
              autoComplete="address-level2"
            />
          </div>
          <div>
            <label className="profile-label" htmlFor="profile-state">State</label>
            <input
              id="profile-state"
              className="profile-input"
              type="text"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              maxLength={80}
              autoComplete="address-level1"
            />
          </div>
        </div>

        {detailsMessage.text && (
          <p className={`profile-message profile-message-${detailsMessage.type}`}>
            {detailsMessage.text}
          </p>
        )}

        <button
          type="submit"
          className="profile-button"
          disabled={savingDetails || !hasChanges}
        >
          {savingDetails ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      {/* ----- Change password ----- */}
      <form className="profile-card" onSubmit={handlePasswordSubmit}>
        <h2>Change password</h2>
        <p className="profile-card-subtitle">Use at least 8 characters.</p>

        <label className="profile-label" htmlFor="current-password">Current password</label>
        <input
          id="current-password"
          className="profile-input"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
        />

        <div className="profile-row">
          <div>
            <label className="profile-label" htmlFor="new-password">New password</label>
            <input
              id="new-password"
              className="profile-input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="profile-label" htmlFor="confirm-password">Confirm new password</label>
            <input
              id="confirm-password"
              className="profile-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>

        {passwordMessage.text && (
          <p className={`profile-message profile-message-${passwordMessage.type}`}>
            {passwordMessage.text}
          </p>
        )}

        <button type="submit" className="profile-button" disabled={savingPassword}>
          {savingPassword ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  )
}

export const Profile = () => {
  const { user, authLoading } = useContext(ShopContext)

  if (authLoading) {
    return <p className="profile-loading">Loading...</p>
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <ProfileContent key={user.id} user={user} />
}