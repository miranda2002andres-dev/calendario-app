import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, activeView, onViewChange }) => {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', view: 'dashboard' },
    { icon: '📊', label: 'Datos Generales', view: 'general' },
    { icon: '📦', label: 'Domis', view: 'domis' },
    { icon: '📮', label: 'Pamis', view: 'pamis' },
    { icon: '📅', label: 'Dashboard Mensual', view: 'mensual' },
    { icon: '📆', label: 'Dashboard Anual', view: 'anual' },
    { icon: '⚠️', label: 'Fallas', view: 'fallas' },
    { icon: '📊', label: 'Análisis de Fallas', view: 'analisis-fallas' },
    { icon: '📈', label: 'Reportes', view: 'reportes' },
    { icon: '📞', label: 'Telemercadeo', view: 'tele' },
  ];

  const handleClick = (view) => {
    onViewChange(view);
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img 
            src="/logo-ir.svg" 
            alt="Inter Rapidísimo" 
            className="sidebar-logo-img"
          />
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <button
              key={index}
              data-view={item.view}
              className={`nav-item ${activeView === item.view ? 'active' : ''}`}
              onClick={() => handleClick(item.view)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;