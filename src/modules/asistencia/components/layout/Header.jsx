import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="ca-header">
      <div className="ca-header-left">
        <div className="ca-logo-box">
          <img src="/logo-ir.svg" alt="Inter" className="ca-logo-img" />
        </div>
      </div>

      <div className="ca-header-center">
        <h1 className="ca-brand-title">INTER RAPIDÍSIMO</h1>
        <p className="ca-brand-slogan">CONTROL DE ASISTENCIA</p>
      </div>

      <div className="ca-header-right"></div>
    </header>
  );
};

export default Header;
