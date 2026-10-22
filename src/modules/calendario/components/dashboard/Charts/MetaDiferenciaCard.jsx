import React from 'react';
import './MetaDiferenciaCard.css';

const MetaDiferenciaCard = ({ domisData, pamisData, showPamis = true }) => {
  const diffDomis = parseInt(domisData?.diferencia) || 0;
  const diffPamis = parseInt(pamisData?.diferencia) || 0;

  return (
    <div className="meta-diferencia-card">
      <div className={`meta-diferencia-grid ${showPamis ? 'two-columns' : 'one-column'}`}>
        {/* DOMIS */}
        <div className="meta-column">
          <div className="meta-column-title domis">📦 DOMIS</div>
          <div className="meta-items-row">
            <div className="meta-item">
              <div className="meta-label">🎯 META</div>
              <div className="meta-value">{domisData?.meta || 0}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">📊 DIFERENCIA</div>
              <div className={`meta-value ${diffDomis >= 0 ? 'positive' : 'negative'}`}>
                {diffDomis >= 0 ? `+${diffDomis}` : diffDomis}
              </div>
            </div>
            <div className="meta-item">
              <div className="meta-label">👥 ASISTENCIA</div>
              <div className="meta-value">{domisData?.domiAsistencia || 0}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">🛰️ SATÉLITES</div>
              <div className="meta-value">{domisData?.satelites || 0}</div>
            </div>
          </div>
        </div>

        {/* PAMIS */}
        {showPamis && (
          <div className="meta-column">
            <div className="meta-column-title pamis">📮 PAMIS</div>
            <div className="meta-items-row">
              <div className="meta-item">
                <div className="meta-label">🎯 META</div>
                <div className="meta-value">{pamisData?.meta || 0}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">📊 DIFERENCIA</div>
                <div className={`meta-value ${diffPamis >= 0 ? 'positive' : 'negative'}`}>
                  {diffPamis >= 0 ? `+${diffPamis}` : diffPamis}
                </div>
              </div>
              <div className="meta-item">
                <div className="meta-label">👥 PAMIS ASISTENCIA</div>
                <div className="meta-value">{pamisData?.domiAsistencia || 0}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetaDiferenciaCard;