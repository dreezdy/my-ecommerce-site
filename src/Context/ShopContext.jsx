import React, { useState, useEffect } from 'react'

export const ShopContext = React.createContext(null)

export const API_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`

// When true, the site uses the built-in perfume list instead of the backend.
// Used to show the frontend on its own (set REACT_APP_DEMO_MODE=true).
export const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true'

const TOKEN_KEY = 'ashodi_token'

const MAX_QUANTITY = 99 // same limit the backend uses

// NEW (cart): sends the cart to the backend (only items with quantity above 0)
const saveCartToServer = (authToken, cart, keepalive = false) => {
    const cleaned = {}
    for (const id in cart) {
        if (cart[id] > 0) {
            cleaned[id] = cart[id]
        }
    }
    return fetch(`${API_URL}/api/cart`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ cart: cleaned }),
        keepalive
    }).catch((err) => console.error('Could not save cart:', err))
}

const ShopContextProvider = (props) => {

    const [all_product, setAllProduct] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [user, setUser] = useState(null)
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
    const [authLoading, setAuthLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))

    // NEW (cart): true once the saved cart has been loaded from the server
    const [cartLoaded, setCartLoaded] = useState(false)

    // Get the perfumes (from the backend, or from the built-in list in demo mode)
    useEffect(() => {
        if (DEMO_MODE) {
            import('../Components/Assets/all_product')
                .then((module) => {
                    setAllProduct(module.default)
                })
                .catch((err) => {
                    console.error('Could not load demo products:', err)
                    setError('Could not load products.')
                })
                .finally(() => {
                    setLoading(false)
                })
            return
        }

        fetch(`${API_URL}/api/products`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Server responded with status ' + response.status)
                }
                return response.json()
            })
            .then((data) => {
                setAllProduct(data)
            })
            .catch((err) => {
                console.error('Could not load products:', err)
                setError('Could not load products. Is the backend running?')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    // If a saved token exists, ask the backend who it belongs to
    useEffect(() => {
        const savedToken = localStorage.getItem(TOKEN_KEY)
        if (!savedToken) {
            setAuthLoading(false)
            return
        }

        fetch(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${savedToken}` }
        })
            .then(async (response) => {
                if (response.status === 401) {
                    localStorage.removeItem(TOKEN_KEY)
                    setToken(null)
                    return
                }
                if (!response.ok) {
                    throw new Error('Server responded with status ' + response.status)
                }
                const data = await response.json()
                setUser(data.user)
            })
            .catch((err) => console.error('Could not check login:', err))
            .finally(() => setAuthLoading(false))
    }, [])

    // NEW (cart): when someone is logged in, load their saved cart and
    // merge it with anything they added as a guest
    useEffect(() => {
        if (!user || !token) return

        let cancelled = false

        fetch(`${API_URL}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Server responded with status ' + response.status)
                }
                return response.json()
            })
            .then((data) => {
                if (cancelled) return
                const serverCart = data.cart || {}

                setCartItems((guestCart) => {
                    const merged = { ...serverCart }
                    for (const id in guestCart) {
                        if (guestCart[id] > 0) {
                            merged[id] = (merged[id] || 0) + guestCart[id]
                        }
                    }
                    return merged
                })
                setCartLoaded(true)
            })
            .catch((err) => console.error('Could not load cart:', err))

        return () => {
            cancelled = true
        }
    }, [user, token])

    // NEW (cart): save the cart shortly after it changes
    useEffect(() => {
        if (!token || !cartLoaded) return

        const timer = setTimeout(() => {
            saveCartToServer(token, cartItems)
        }, 400)

        return () => clearTimeout(timer)
    }, [cartItems, token, cartLoaded])

    // Fetch the perfumes again (used after adding, editing or deleting one)
    const reloadProducts = async () => {
        const response = await fetch(`${API_URL}/api/products`)
        if (!response.ok) {
            throw new Error('Could not refresh the perfumes')
        }
        setAllProduct(await response.json())
    }

    // Sends a logged-in PUT request and returns the answer
    const sendAuthorized = async (path, body) => {
        let response
        try {
            response = await fetch(`${API_URL}${path}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            })
        } catch (err) {
            throw new Error('Cannot reach the server. Is the backend running?')
        }

        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong')
        }
        return data
    }

    const updateProfile = async (fields) => {
        const data = await sendAuthorized('/api/auth/me', fields)
        setUser(data.user)
    }

    const changePassword = (currentPassword, newPassword) =>
        sendAuthorized('/api/auth/me/password', { currentPassword, newPassword })

    const saveSession = (data) => {
        localStorage.setItem(TOKEN_KEY, data.token)
        setToken(data.token)
        setUser(data.user)
    }

    const authRequest = async (path, body) => {
        let response
        try {
            response = await fetch(`${API_URL}/api/auth/${path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
        } catch (err) {
            throw new Error('Cannot reach the server. Is the backend running?')
        }

        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong')
        }
        saveSession(data)
    }

    const signup = (name, email, password) => authRequest('signup', { name, email, password })
    const login = (email, password) => authRequest('login', { email, password })

    const logout = () => {
        // NEW (cart): save the latest cart right now, then clear it from the screen
        if (token && cartLoaded) {
            saveCartToServer(token, cartItems, true)
        }
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
        setCartItems({})
        setCartLoaded(false)
    }

    const addToCart = (itemId, amount = 1) => {
    setCartItems((prev) => ({
        ...prev,
        [itemId]: Math.min((prev[itemId] || 0) + amount, MAX_QUANTITY)
    }))
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: Math.max((prev[itemId] || 0) - 1, 0) }))
    }

    const deleteFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: 0 }))
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = all_product.find((product) => product.id === Number(item))
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item]
                }
            }
        }
        return totalAmount
    }

    const getTotalCartItems = () => {
        let totalItem = 0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item]
            }
        }
        return totalItem
    }

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        deleteFromCart,
        loading,
        error,
        user,
        token,
        authLoading,
        signup,
        login,
        logout,
        reloadProducts,
        updateProfile,
        changePassword
    }

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider