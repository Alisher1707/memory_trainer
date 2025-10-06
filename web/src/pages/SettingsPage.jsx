import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'

const SettingsPage = ({ onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme, soundEnabled, toggleSound } = useTheme()
  const { language, changeLanguage, t } = useLanguage()
  const [settings, setSettings] = useState({
    vibration: true,
    animations: true,
    difficulty: 'easy',
    autoSave: true,
    notifications: true
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('memoryTrainerSettings')
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }))
    }
  }

  const saveSettings = (newSettings) => {
    setSettings(newSettings)
    localStorage.setItem('memoryTrainerSettings', JSON.stringify(newSettings))
  }

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    saveSettings(newSettings)
  }

  const handleExportData = () => {
    if (!user) return

    const exportData = {
      user: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      stats: user.stats,
      settings: settings,
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `memory-trainer-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDeleteAccount = () => {
    // In a real app, this would call an API
    localStorage.removeItem('memoryTrainerUser')
    localStorage.removeItem('memoryTrainerGuest')
    localStorage.removeItem('memoryTrainerSettings')
    logout()
    onNavigate('home')
  }

  const handleLogout = () => {
    logout()
    onNavigate('home')
  }

  const settingSections = [
    {
      title: `🎮 ${t('settings.gameSettings')}`,
      settings: [
        {
          key: 'sound',
          label: t('settings.soundEffects'),
          description: t('settings.soundEffectsDesc'),
          type: 'toggle',
          value: soundEnabled,
          onChange: toggleSound
        },
        {
          key: 'vibration',
          label: t('settings.vibration'),
          description: t('settings.vibrationDesc'),
          type: 'toggle'
        },
        {
          key: 'animations',
          label: t('settings.animations'),
          description: t('settings.animationsDesc'),
          type: 'toggle'
        },
        {
          key: 'difficulty',
          label: t('settings.defaultDifficulty'),
          description: t('settings.defaultDifficultyDesc'),
          type: 'select',
          options: [
            { value: 'easy', label: t('games.easy') },
            { value: 'medium', label: t('games.medium') },
            { value: 'hard', label: t('games.hard') }
          ]
        }
      ]
    },
    {
      title: `🎨 ${t('settings.interfaceSettings')}`,
      settings: [
        {
          key: 'theme',
          label: t('settings.darkMode'),
          description: t('settings.darkModeDesc'),
          type: 'toggle',
          value: theme === 'dark',
          onChange: toggleTheme
        },
        {
          key: 'language',
          label: t('settings.language'),
          description: t('settings.languageDesc'),
          type: 'select',
          value: language,
          onChange: (e) => changeLanguage(e.target.value),
          options: [
            { value: 'uz', label: 'O\'zbekcha' },
            { value: 'en', label: 'English' },
            { value: 'ru', label: 'Русский' }
          ]
        }
      ]
    },
    {
      title: `💾 ${t('settings.dataSettings')}`,
      settings: [
        {
          key: 'autoSave',
          label: t('settings.autoSave'),
          description: t('settings.autoSaveDesc'),
          type: 'toggle'
        },
        {
          key: 'notifications',
          label: t('settings.notifications'),
          description: t('settings.notificationsDesc'),
          type: 'toggle'
        }
      ]
    }
  ]

  const renderSetting = (setting) => {
    switch (setting.type) {
      case 'toggle':
        const isChecked = setting.value !== undefined ? setting.value : settings[setting.key]
        const handleChange = setting.onChange || ((e) => handleSettingChange(setting.key, e.target.checked))

        return (
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleChange}
            />
            <span className="toggle-slider"></span>
          </label>
        )

      case 'select':
        const selectValue = setting.value !== undefined ? setting.value : settings[setting.key]
        const selectOnChange = setting.onChange || ((e) => handleSettingChange(setting.key, e.target.value))

        return (
          <select
            value={selectValue}
            onChange={selectOnChange}
            className="setting-select"
          >
            {setting.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      default:
        return null
    }
  }

  return (
    <div className="page-container settings-page">
      <div className="page-header">
        <h1>⚙️ {t('settings.title')}</h1>
        <Button
          variant="ghost"
          size="small"
          onClick={() => onNavigate('home')}
          icon="←"
        >
          {t('settings.back')}
        </Button>
      </div>

      <div className="settings-sections">
        {settingSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="settings-section">
            <div className="settings-section-header">
              <h2>{section.title}</h2>
            </div>

            <div className="settings-items">
              {section.settings.map((setting) => (
                <div key={setting.key} className="settings-item">
                  <div className="settings-item-info">
                    <div className="settings-item-label">{setting.label}</div>
                    <div className="settings-item-description">{setting.description}</div>
                  </div>
                  <div className="settings-item-control">
                    {renderSetting(setting)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {isAuthenticated && (
          <div className="settings-section">
            <h2>👤 {t('settings.accountSettings')}</h2>

            <div className="account-info">
              <div className="account-details">
                <h3>{user.name}</h3>
                {user.email && <p>{user.email}</p>}
                <p className="join-date">
                  {t('settings.joinedDate')}: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="account-actions">
              <Button
                variant="outline"
                size="small"
                onClick={handleExportData}
                icon="📥"
              >
                {t('settings.exportData')}
              </Button>

              <Button
                variant="outline"
                size="small"
                onClick={() => setShowLogoutModal(true)}
                icon="🚪"
              >
                {t('modal.logout')}
              </Button>

              <Button
                variant="danger"
                size="small"
                onClick={() => setShowDeleteModal(true)}
                icon="🗑️"
              >
                {t('settings.deleteAccount')}
              </Button>
            </div>
          </div>
        )}

        <div className="settings-section">
          <h2>ℹ️ {t('settings.appInfo')}</h2>

          <div className="app-info">
            <div className="info-item">
              <span className="info-label">{t('settings.version')}:</span>
              <span className="info-value">1.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">{t('settings.created')}:</span>
              <span className="info-value">2024</span>
            </div>
            <div className="info-item">
              <span className="info-label">{t('settings.platforms')}:</span>
              <span className="info-value">Web, Mobile</span>
            </div>
          </div>

          <div className="app-actions">
            <Button
              variant="outline"
              size="small"
              onClick={() => window.open('https://github.com', '_blank')}
              icon="💻"
            >
              {t('settings.github')}
            </Button>

            <Button
              variant="outline"
              size="small"
              onClick={() => alert(t('settings.helpComingSoon'))}
              icon="❓"
            >
              {t('settings.help')}
            </Button>

            <Button
              variant="outline"
              size="small"
              onClick={() => alert(t('settings.privacyComingSoon'))}
              icon="🔒"
            >
              {t('settings.privacy')}
            </Button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title={t('modal.logout')}
        size="small"
      >
        <div className="modal-content">
          <p>{t('modal.logoutConfirm')}</p>
          <p className="modal-hint">{t('modal.logoutHint')}</p>

          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
            >
              {t('modal.cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={handleLogout}
              icon="🚪"
            >
              {t('modal.logout')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('modal.deleteAccountTitle')}
        size="small"
      >
        <div className="modal-content">
          <div className="warning-content">
            <div className="warning-icon">⚠️</div>
            <h3>{t('modal.deleteAccountWarning')}</h3>
            <p>{t('modal.deleteAccountMessage')}</p>
            <ul>
              <li>{t('modal.deleteAccountItems.0')}</li>
              <li>{t('modal.deleteAccountItems.1')}</li>
              <li>{t('modal.deleteAccountItems.2')}</li>
            </ul>
          </div>

          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              {t('modal.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              icon="🗑️"
            >
              {t('modal.yesDelete')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SettingsPage