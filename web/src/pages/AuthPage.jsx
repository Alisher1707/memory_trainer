import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const AuthPage = ({ mode = 'login', onNavigate }) => {
  const [currentMode, setCurrentMode] = useState(mode)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, signup, loginAsGuest } = useAuth()

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (currentMode === 'login') {
        const result = await login(formData.email, formData.password)
        if (result.success) {
          onNavigate('profile')
        } else {
          setError(result.error)
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Parollar bir xil emas')
          setLoading(false)
          return
        }

        if (formData.password.length < 6) {
          setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak')
          setLoading(false)
          return
        }

        const result = await signup(formData.email, formData.password, formData.name)
        if (result.success) {
          onNavigate('profile')
        } else {
          setError(result.error)
        }
      }
    } catch (err) {
      setError('Xatolik yuz berdi. Qaytadan urinib ko\'ring.')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = () => {
    loginAsGuest()
    onNavigate('home')
  }

  const switchMode = (newMode) => {
    setCurrentMode(newMode)
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    setError('')
  }

  return (
    <div className="page-container">
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <Button
              variant="ghost"
              onClick={() => onNavigate('home')}
            >
              ← Bosh sahifa
            </Button>

            <div className="auth-brand">
              <h1>Memory Trainer</h1>
            </div>
          </div>

          <div className="auth-content">
            <div className="auth-form-container">
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${currentMode === 'login' ? 'active' : ''}`}
                  onClick={() => switchMode('login')}
                >
                  Kirish
                </button>
                <button
                  className={`auth-tab ${currentMode === 'signup' ? 'active' : ''}`}
                  onClick={() => switchMode('signup')}
                >
                  Ro'yxatdan O'tish
                </button>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-header">
                  <h2>
                    {currentMode === 'login' ? 'Tizimga Kirish' : 'Ro\'yxatdan O\'tish'}
                  </h2>
                  <p>
                    {currentMode === 'login'
                      ? 'Hisobingizga kiring va o\'yinni davom ettiring'
                      : 'Yangi hisob yarating va xotirangizni rivojlantiring'
                    }
                  </p>
                </div>

                {currentMode === 'signup' && (
                  <Input
                    type="text"
                    placeholder="Ismingiz"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    label="Ism"
                  />
                )}

                <Input
                  type="email"
                  placeholder="emailingiz@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  label="Email"
                />

                <Input
                  type="password"
                  placeholder={currentMode === 'signup' ? 'Kamida 6 ta belgi' : 'Parolingiz'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  label="Parol"
                />

                {currentMode === 'signup' && (
                  <Input
                    type="password"
                    placeholder="Parolni qayta kiriting"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    label="Parolni Tasdiqlang"
                  />
                )}

                {error && (
                  <div className="error-message">
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  loading={loading}
                  className="auth-submit-btn"
                >
                  {loading
                    ? (currentMode === 'login' ? 'Kirmoqda...' : 'Ro\'yxatdan o\'tmoqda...')
                    : (currentMode === 'login' ? 'Kirish' : 'Ro\'yxatdan O\'tish')
                  }
                </Button>
              </form>

              <div className="auth-divider">
                <span>yoki</span>
              </div>

              <Button
                variant="outline"
                size="large"
                onClick={handleGuestLogin}
                className="guest-btn"
              >
                Mehmon Sifatida Kirish
              </Button>

              <div className="auth-footer">
                <p>
                  {currentMode === 'login'
                    ? "Hisobingiz yo'qmi? "
                    : "Hisobingiz bormi? "
                  }
                  <button
                    type="button"
                    onClick={() => switchMode(currentMode === 'login' ? 'signup' : 'login')}
                    className="auth-switch-btn"
                  >
                    {currentMode === 'login' ? "Ro'yxatdan o'tish" : "Kirish"}
                  </button>
                </p>
              </div>
            </div>

            <div className="auth-benefits">
              <h3>Nima uchun ro'yxatdan o'tish kerak?</h3>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-content">
                    <h4>Progress Saqlanadi</h4>
                    <p>Barcha natijalaringiz va statistikangiz avtomatik saqlanadi</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-content">
                    <h4>Global Reytinglar</h4>
                    <p>Dunyodagi o'yinchilar bilan raqobatlashing va reytingda ko'tariling</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-content">
                    <h4>Batafsil Statistika</h4>
                    <p>O'sishingizni kuzatib boring, grafiklar va tahlillar ko'ring</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-content">
                    <h4>Yutuqlar va Mukofotlar</h4>
                    <p>Maxsus yutuqlarni qo'lga kiriting va rekordlar o'rnating</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-content">
                    <h4>Shaxsiy Profil</h4>
                    <p>O'z profilingizni yarating va boshqa o'yinchilar bilan bo'lishing</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-content">
                    <h4>Qurilmalar Orasida Sinxronizatsiya</h4>
                    <p>Har qanday qurilmadan o'z hisobingizga kiring va davom eting</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-content">
                    <h4>Kun Sayin Yangi O'yinlar</h4>
                    <p>Har kuni yangi qiziqarli vazifalar va musobaqalarda ishtirok eting</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage