import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="cc-header">
      <div className="cc-header-left">
        <div className="cc-logo-box">
          <img src="/logo-ir.svg" alt="Inter" className="cc-logo-img" />
        </div>
      </div>

      <div className="cc-header-center">
        <h1 className="cc-brand-title">INTER RAPIDÍSIMO</h1>
        <p className="cc-brand-slogan">TE LA PONEMOS RE FÁCIL</p>
      </div>

      <div className="cc-header-right"></div>
    </header>
  );
};

export default Header;