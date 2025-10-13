import React from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <span className="brand-icon">🧠</span>
              <span className="brand-text">Memory Trainer</span>
            </div>
            <p className="footer-description">
              {t('footer.description')}
            </p>
          </div>

          <div className="footer-section">
            <h4>{t('footer.gamesSection')}</h4>
            <ul className="footer-links">
              <li><a href="#memory-cards">🃏 {t('games.memoryCards')}</a></li>
              <li><a href="#number-sequence">🔢 {t('games.numberSequence')}</a></li>
              <li><a href="#color-sequence">🌈 {t('games.colorSequence')}</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t('footer.pagesSection')}</h4>
            <ul className="footer-links">
              <li><a href="#leaderboard">🏆 {t('nav.leaderboard')}</a></li>
              <li><a href="#profile">👤 {t('nav.profile')}</a></li>
              <li><a href="#settings">⚙️ {t('nav.settings')}</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t('footer.infoSection')}</h4>
            <ul className="footer-links">
              <li><a href="#about">ℹ️ {t('footer.about')}</a></li>
              <li><a href="#help">❓ {t('settings.help')}</a></li>
              <li><a href="#privacy">🔒 {t('settings.privacy')}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2024 Memory Trainer. {t('footer.rights')}</p>
            <p className="version-info">{t('footer.version')} 1.0.0</p>
          </div>

          <div className="footer-stats">
            <span className="stat-text">3 {t('footer.games')}</span>
            <span className="stat-divider">•</span>
            <span className="stat-text">{t('footer.globalRating')}</span>
            <span className="stat-divider">•</span>
            <span className="stat-text">{t('footer.statistics')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer