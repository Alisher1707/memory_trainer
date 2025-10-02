import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const Signup = ({ onClose, onSwitchToLogin }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signup } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Parollar bir xil emas')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak')
      setLoading(false)
      return
    }

    const result = await signup(email, password, name)

    if (result.success) {
      onClose()
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="auth-modal">
      <div className="auth-modal-content">
        <div className="auth-header">
          <h2>📝 Ro'yxatdan O'tish</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>👤 Ism:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ismingiz"
            />
          </div>

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
              placeholder="Parolingiz (kamida 6 ta belgi)"
            />
          </div>

          <div className="form-group">
            <label>🔒 Parolni Tasdiqlang:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Parolni qayta kiriting"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Ro\'yxatdan o\'tmoqda...' : '🚀 Ro\'yxatdan O\'tish'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Hisobingiz bormi?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="link-button"
            >
              Kirish
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup