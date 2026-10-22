import React from 'react';
import './SourceToggle.css';

const SourceToggle = ({ source, onChange }) => {
  return (
    <div className="source-toggle">
      <button
        className={`source-btn ${source === 'domis' ? 'active' : ''}`}
        onClick={() => onChange('domis')}
      >
        📦 DOMIS
      </button>
      <button
        className={`source-btn ${source === 'pamis' ? 'active' : ''}`}
        onClick={() => onChange('pamis')}
      >
        📮 PAMIS
      </button>
      <button
        className={`source-btn ${source === 'general' ? 'active' : ''}`}
        onClick={() => onChange('general')}
      >
        📊 GENERAL
      </button>
    </div>
  );
};

export default SourceToggle;