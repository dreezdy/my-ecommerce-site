import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ShopContext, API_URL } from '../../Context/ShopContext'
import './Admin.css'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_IMAGE_SIZE = 3 * 1024 * 1024 // 3 MB

// The form itself. `product` is empty when adding a new perfume.
const ProductForm = ({ product }) => {
  const isEdit = Boolean(product)
  const { token, reloadProducts } = useContext(ShopContext)
  const navigate = useNavigate()

  const [name, setName] = useState(product ? product.name : '')
  const [category, setCategory] = useState(product ? product.category : 'men')
  const [newPrice, setNewPrice] = useState(product ? String(product.new_price) : '')
  const [oldPrice, setOldPrice] = useState(product ? String(product.old_price) : '')
  const [imageFile, setImageFile] = useState(null)
  const [localPreview, setLocalPreview] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Free the temporary preview link when it changes or the page closes
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please choose a PNG, JPG or WebP image')
      e.target.value = ''
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image must be 3 MB or smaller')
      e.target.value = ''
      return
    }

    setError('')
    setImageFile(file)
    setLocalPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter a name')
      return
    }
    if (newPrice === '' || oldPrice === '' || Number(newPrice) < 0 || Number(oldPrice) < 0) {
      setError('Please enter both prices (0 or more)')
      return
    }
    if (!isEdit && !imageFile) {
      setError('Please choose an image')
      return
    }

    // A form with a file is sent as FormData, not JSON
    const formData = new FormData()
    formData.append('name', name.trim())
    formData.append('category', category)
    formData.append('new_price', newPrice)
    formData.append('old_price', oldPrice)
    if (imageFile) {
      formData.append('image', imageFile)
    }

    setSubmitting(true)
    try {
      const url = isEdit
        ? `${API_URL}/api/products/${product.id}`
        : `${API_URL}/api/products`

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        // Don't set Content-Type here. The browser sets it correctly for files.
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      await reloadProducts()
      navigate('/admin')
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'Cannot reach the server. Is the backend running?'
          : err.message
      )
      setSubmitting(false)
    }
  }

  const previewSrc = localPreview || (product ? product.image : '')

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>{isEdit ? 'Edit perfume' : 'Add perfume'}</h1>
        <Link to="/admin" className="admin-link-button">← Back</Link>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label className="admin-label" htmlFor="name">Name</label>
        <input
          id="name"
          className="admin-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
        />

        <label className="admin-label" htmlFor="category">Category</label>
        <select
          id="category"
          className="admin-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
        </select>

        <div className="admin-row">
          <div>
            <label className="admin-label" htmlFor="new_price">Price (₦)</label>
            <input
              id="new_price"
              className="admin-input"
              type="number"
              min="0"
              step="any"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="old_price">Old price (₦)</label>
            <input
              id="old_price"
              className="admin-input"
              type="number"
              min="0"
              step="any"
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
            />
          </div>
        </div>
        <p className="admin-hint">The old price is the crossed-out price shown next to the real price.</p>

        <label className="admin-label" htmlFor="image">Image</label>
        {previewSrc && <img src={previewSrc} alt="Preview" className="admin-preview" />}
        <input
          id="image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
        />
        <p className="admin-hint">
          PNG, JPG or WebP, up to 3 MB.
          {isEdit && ' Leave empty to keep the current image.'}
        </p>

        {error && <p className="admin-message admin-message-error">{error}</p>}

        <button type="submit" className="admin-button admin-submit" disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Save changes' : 'Add perfume'}
        </button>
      </form>
    </div>
  )
}

// Decides whether we are adding a new perfume or editing an existing one
export const AdminProductForm = () => {
  const { productId } = useParams()
  const { all_product, loading } = useContext(ShopContext)

  // /admin/product/new has no id, so this is the "add" form
  if (!productId) {
    return <ProductForm />
  }

  if (loading) {
    return <p className="admin-empty">Loading...</p>
  }

  const product = all_product.find((p) => p.id === Number(productId))
  if (!product) {
    return (
      <div className="admin-page">
        <p className="admin-empty">Perfume not found.</p>
        <p style={{ textAlign: 'center' }}>
          <Link to="/admin" className="admin-link-button">← Back</Link>
        </p>
      </div>
    )
  }

  return <ProductForm key={product.id} product={product} />
}