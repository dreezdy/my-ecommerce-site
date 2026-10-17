import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'

// Wrap an admin page with this. Visitors who aren't admins are sent away.
// (The backend also checks, so this is for convenience, not for security.)
export const AdminRoute = ({ children }) => {
  const { user, authLoading } = useContext(ShopContext)

  if (authLoading) {
    return <p className="admin-empty">Loading...</p>
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}