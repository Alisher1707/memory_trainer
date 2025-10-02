import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const Login = ({ onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, loginAsGuest } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(email, password)

    if (result.success) {
      onClose()
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  const handleGuestLogin = () => {
    loginAsGuest()
    onClose()
  }

  return (
    <div className="auth-modal">
      <div className="auth-modal-content">
        <div className="auth-header">
          <h2>🔑 Kirish</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>📧 Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="emailingiz@example.com"
            />
          </div>

          <div className="form-group">
            <label>🔒 Parol:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Parolingiz"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Kirmoqda...' : '🚀 Kirish'}
          </button>
        </form>

        <div className="auth-divider">
          <span>yoki</span>
        </div>

        <button onClick={handleGuestLogin} className="guest-button">
          👤 Mehmon Sifatida Kirish
        </button>

        <div className="auth-footer">
          <p>
            Hisobingiz yo'qmi?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="link-button"
            >
              Ro'yxatdan o'tish
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login