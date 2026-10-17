import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext, API_URL } from '../../Context/ShopContext'
import './Admin.css'

const formatPrice = (value) => `₦${Number(value).toLocaleString('en-NG')}`

export const AdminProducts = () => {
  const { all_product, loading, token, reloadProducts } = useContext(ShopContext)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Delete "${product.name}"? This cannot be undone.`)
    if (!confirmed) return

    setDeletingId(product.id)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch(`${API_URL}/api/products/${product.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.message || 'Could not delete the perfume')
      }
      await reloadProducts()
      setMessage({ type: 'success', text: `"${product.name}" was deleted.` })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage perfumes</h1>
        <Link to="/admin/product/new" className="admin-button">+ Add perfume</Link>
      </div>

      {message.text && (
        <p className={`admin-message admin-message-${message.type}`}>{message.text}</p>
      )}

      {loading ? (
        <p className="admin-empty">Loading perfumes...</p>
      ) : all_product.length === 0 ? (
        <p className="admin-empty">No perfumes yet. Click "Add perfume" to create the first one.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {all_product.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image} alt={product.name} className="admin-thumb" />
                  </td>
                  <td>{product.name}</td>
                  <td className="admin-capitalize">{product.category}</td>
                  <td>
                    {formatPrice(product.new_price)}
                    <span className="admin-old-price">{formatPrice(product.old_price)}</span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Link to={`/admin/product/${product.id}/edit`} className="admin-link-button">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="admin-delete"
                        disabled={deletingId === product.id}
                        onClick={() => handleDelete(product)}
                      >
                        {deletingId === product.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}