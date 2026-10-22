import React from 'react';
import './Header.css';

const Header = ({ companyName, slogan, onMenuClick }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button className="menu-toggle" onClick={onMenuClick}>
            <span className="menu-line"></span>
            <span className="menu-line"></span>
            <span className="menu-line"></span>
          </button>
          <div className="company-brand">
            <span className="company-logo">📦</span>
            <div>
              <h1 className="company-name">{companyName}</h1>
              <p className="company-slogan">{slogan}</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="user-avatar">A</div>
        </div>
      </div>
    </header>
  );
};

export default Header;