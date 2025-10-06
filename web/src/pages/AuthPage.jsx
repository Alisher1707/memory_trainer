import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const AuthPage = ({ mode = 'login', onNavigate }) => {
  const { t } = useLanguage()
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
          setError(t('auth.passwordMismatch'))
          setLoading(false)
          return
        }

        if (formData.password.length < 6) {
          setError(t('auth.passwordTooShort'))
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
      setError(t('auth.errorOccurred'))
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
              ← {t('auth.backToHome')}
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
                  {t('auth.login')}
                </button>
                <button
                  className={`auth-tab ${currentMode === 'signup' ? 'active' : ''}`}
                  onClick={() => switchMode('signup')}
                >
                  {t('auth.signup')}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-header">
                  <h2>
                    {currentMode === 'login' ? t('auth.loginTitle') : t('auth.signupTitle')}
                  </h2>
                  <p>
                    {currentMode === 'login' ? t('auth.loginSubtitle') : t('auth.signupSubtitle')}
                  </p>
                </div>

                {currentMode === 'signup' && (
                  <Input
                    type="text"
                    placeholder={t('auth.yourName')}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    label={t('auth.name')}
                  />
                )}

                <Input
                  type="email"
                  placeholder={t('auth.yourEmail')}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  label={t('auth.email')}
                />

                <Input
                  type="password"
                  placeholder={currentMode === 'signup' ? t('auth.minChars') : t('auth.yourPassword')}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  label={t('auth.password')}
                />

                {currentMode === 'signup' && (
                  <Input
                    type="password"
                    placeholder={t('auth.repeatPassword')}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    label={t('auth.confirmPasswordLabel')}
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
                    ? (currentMode === 'login' ? t('auth.loggingIn') : t('auth.signingUp'))
                    : (currentMode === 'login' ? t('auth.login') : t('auth.signup'))
                  }
                </Button>
              </form>

              <div className="auth-divider">
                <span>{t('auth.orContinueWith')}</span>
              </div>

              <Button
                variant="outline"
                size="large"
                onClick={handleGuestLogin}
                className="guest-btn"
              >
                {t('auth.guestLogin')}
              </Button>

              <div className="auth-footer">
                <p>
                  {currentMode === 'login' ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}
                  {' '}
                  <button
                    type="button"
                    onClick={() => switchMode(currentMode === 'login' ? 'signup' : 'login')}
                    className="auth-switch-btn"
                  >
                    {currentMode === 'login' ? t('auth.signup') : t('auth.login')}
                  </button>
                </p>
              </div>
            </div>

            <div className="auth-benefits">
              <h3>{t('auth.whyRegister')}</h3>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-content">
                    <h4>{t('auth.benefit1Title')}</h4>
                    <p>{t('auth.benefit1Desc')}</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-content">
                    <h4>{t('auth.benefit2Title')}</h4>
                    <p>{t('auth.benefit2Desc')}</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-content">
                    <h4>{t('auth.benefit3Title')}</h4>
                    <p>{t('auth.benefit3Desc')}</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-content">
                    <h4>{t('auth.benefit4Title')}</h4>
                    <p>{t('auth.benefit4Desc')}</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-content">
                    <h4>{t('auth.benefit5Title')}</h4>
                    <p>{t('auth.benefit5Desc')}</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-content">
                    <h4>{t('auth.benefit6Title')}</h4>
                    <p>{t('auth.benefit6Desc')}</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-content">
                    <h4>{t('auth.benefit7Title')}</h4>
                    <p>{t('auth.benefit7Desc')}</p>
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