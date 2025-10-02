import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'

const SettingsPage = ({ onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme, soundEnabled, toggleSound } = useTheme()
  const [settings, setSettings] = useState({
    vibration: true,
    animations: true,
    language: 'uz',
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
      title: '🎮 O\'yin Sozlamalari',
      settings: [
        {
          key: 'sound',
          label: 'Ovoz Effektlari',
          description: 'O\'yin jarayonida ovoz effektlarini yoqish',
          type: 'toggle',
          value: soundEnabled,
          onChange: toggleSound
        },
        {
          key: 'vibration',
          label: 'Tebranish',
          description: 'Mobil qurilmalarda tebranish effektlari',
          type: 'toggle'
        },
        {
          key: 'animations',
          label: 'Animatsiyalar',
          description: 'Karta va interfeys animatsiyalari',
          type: 'toggle'
        },
        {
          key: 'difficulty',
          label: 'Standart Daraja',
          description: 'O\'yinlar uchun standart qiyinlik darajasi',
          type: 'select',
          options: [
            { value: 'easy', label: 'Oson' },
            { value: 'medium', label: 'O\'rta' },
            { value: 'hard', label: 'Qiyin' }
          ]
        }
      ]
    },
    {
      title: '🎨 Interfeys Sozlamalari',
      settings: [
        {
          key: 'theme',
          label: 'Tungi Rejim',
          description: 'Interfeys qorong\'u rejimini yoqish',
          type: 'toggle',
          value: theme === 'dark',
          onChange: toggleTheme
        },
        {
          key: 'language',
          label: 'Til',
          description: 'Interfeys tili',
          type: 'select',
          options: [
            { value: 'uz', label: 'O\'zbekcha' },
            { value: 'en', label: 'English' },
            { value: 'ru', label: 'Русский' }
          ]
        }
      ]
    },
    {
      title: '💾 Ma\'lumotlar Sozlamalari',
      settings: [
        {
          key: 'autoSave',
          label: 'Avtomatik Saqlash',
          description: 'Natijalarni avtomatik serverga yuborish',
          type: 'toggle'
        },
        {
          key: 'notifications',
          label: 'Bildirishnomalar',
          description: 'Yangi yutuqlar va rekordlar haqida xabar',
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
        return (
          <select
            value={settings[setting.key]}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
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
      <div className="settings-header">
        <Button
          variant="outline"
          onClick={() => onNavigate('home')}
          icon="←"
        >
          Orqaga
        </Button>
        <h1>⚙️ Sozlamalar</h1>
        <p>O'yin tajribangizni sozlang</p>
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
            <h2>👤 Hisob Sozlamalari</h2>

            <div className="account-info">
              <div className="account-details">
                <h3>{user.name}</h3>
                {user.email && <p>{user.email}</p>}
                <p className="join-date">
                  Qo'shilgan: {new Date(user.createdAt).toLocaleDateString('uz-UZ')}
                </p>
              </div>
            </div>

            <div className="account-actions">
              <Button
                variant="outline"
                onClick={handleExportData}
                icon="📥"
              >
                Ma'lumotlarni Yuklab Olish
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowLogoutModal(true)}
                icon="🚪"
              >
                Chiqish
              </Button>

              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
                icon="🗑️"
              >
                Hisobni O'chirish
              </Button>
            </div>
          </div>
        )}

        <div className="settings-section">
          <h2>ℹ️ Ilovaa Haqida</h2>

          <div className="app-info">
            <div className="info-item">
              <span className="info-label">Versiya:</span>
              <span className="info-value">1.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">Yaratilgan:</span>
              <span className="info-value">2024</span>
            </div>
            <div className="info-item">
              <span className="info-label">Platformalar:</span>
              <span className="info-value">Web, Mobile</span>
            </div>
          </div>

          <div className="app-actions">
            <Button
              variant="outline"
              onClick={() => window.open('https://github.com', '_blank')}
              icon="💻"
            >
              GitHub
            </Button>

            <Button
              variant="outline"
              onClick={() => alert('Yordam sahifasi tez orada qo\'shiladi')}
              icon="❓"
            >
              Yordam
            </Button>

            <Button
              variant="outline"
              onClick={() => alert('Maxfiylik siyosati tez orada qo\'shiladi')}
              icon="🔒"
            >
              Maxfiylik
            </Button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Tizimdan chiqish"
        size="small"
      >
        <div className="modal-content">
          <p>Haqiqatan ham tizimdan chiqishni xohlaysizmi?</p>
          <p className="modal-hint">Keyinroq qaytadan kirishingiz mumkin.</p>

          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
            >
              Bekor qilish
            </Button>
            <Button
              variant="primary"
              onClick={handleLogout}
              icon="🚪"
            >
              Chiqish
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Hisobni o'chirish"
        size="small"
      >
        <div className="modal-content">
          <div className="warning-content">
            <div className="warning-icon">⚠️</div>
            <h3>Diqqat!</h3>
            <p>Bu amal qaytarib bo'lmaydi. Barcha ma'lumotlaringiz o'chiriladi:</p>
            <ul>
              <li>Barcha o'yin natijalaringiz</li>
              <li>Statistikangiz va yutuqlaringiz</li>
              <li>Shaxsiy ma'lumotlaringiz</li>
            </ul>
          </div>

          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Bekor qilish
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              icon="🗑️"
            >
              Ha, O'chirish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SettingsPage