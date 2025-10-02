import React from 'react'

const Footer = () => {
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
              Xotirangizni rivojlantirish uchun eng yaxshi o'yin platformasi
            </p>
          </div>

          <div className="footer-section">
            <h4>O'yinlar</h4>
            <ul className="footer-links">
              <li><a href="#memory-cards">🃏 Xotira Kartalari</a></li>
              <li><a href="#number-sequence">🔢 Raqam Ketma-ketligi</a></li>
              <li><a href="#color-sequence">🌈 Rang Ketma-ketligi</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Sahifalar</h4>
            <ul className="footer-links">
              <li><a href="#leaderboard">🏆 Reytinglar</a></li>
              <li><a href="#profile">👤 Profil</a></li>
              <li><a href="#settings">⚙️ Sozlamalar</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Ma'lumot</h4>
            <ul className="footer-links">
              <li><a href="#about">ℹ️ Loyiha haqida</a></li>
              <li><a href="#help">❓ Yordam</a></li>
              <li><a href="#privacy">🔒 Maxfiylik</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2024 Memory Trainer. Barcha huquqlar himoyalangan.</p>
            <p className="version-info">Versiya 1.0.0</p>
          </div>

          <div className="footer-stats">
            <span className="stat-text">3 O'yin</span>
            <span className="stat-divider">•</span>
            <span className="stat-text">Global Reyting</span>
            <span className="stat-divider">•</span>
            <span className="stat-text">Statistika</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer