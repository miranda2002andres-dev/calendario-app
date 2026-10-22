import React from 'react';
import './KPICards.css';

const KPICards = ({ domisData, pamisData, showPamis = true }) => {
  return (
    <div className="kpi-container">
      {/* Tabla unificada DOMIS + PAMIS */}
      <div className="kpi-table">
        <div className="kpi-table-header">
          <div className="kpi-table-col-header"></div>
          <div className="kpi-table-col-header domis">📦 DOMIS</div>
          {showPamis && <div className="kpi-table-col-header pamis">📮 PAMIS</div>}
        </div>

        {/* Fila: Entregas */}
        <div className="kpi-table-row">
          <div className="kpi-table-label">
            <span className="label-icon">📦</span>
            <span className="label-text">Entregas</span>
          </div>
          <div className="kpi-table-value domis">{domisData?.domis || 0}</div>
          {showPamis && (
            <div className="kpi-table-value pamis">{pamisData?.domis || 0}</div>
          )}
        </div>

        {/* Fila: Meta */}
        <div className="kpi-table-row">
          <div className="kpi-table-label">
            <span className="label-icon">🎯</span>
            <span className="label-text">Meta</span>
          </div>
          <div className="kpi-table-value domis">{domisData?.meta || 0}</div>
          {showPamis && (
            <div className="kpi-table-value pamis">{pamisData?.meta || 0}</div>
          )}
        </div>

        {/* Fila: Asignación del día */}
        <div className="kpi-table-row highlight">
          <div className="kpi-table-label">
            <span className="label-icon">🎯</span>
            <span className="label-text">Asignación del día</span>
          </div>
          <div className="kpi-table-value domis">{domisData?.asignacionDia || 0}</div>
          {showPamis && (
            <div className="kpi-table-value pamis">{pamisData?.asignacionDia || 0}</div>
          )}
        </div>

        {/* Fila: Diferencia */}
        <div className="kpi-table-row">
          <div className="kpi-table-label">
            <span className="label-icon">📊</span>
            <span className="label-text">Diferencia</span>
          </div>
          <div className={`kpi-table-value domis ${parseInt(domisData?.diferencia) >= 0 ? 'positive' : 'negative'}`}>
            {parseInt(domisData?.diferencia) >= 0
              ? `+${domisData?.diferencia || 0}`
              : domisData?.diferencia || 0}
          </div>
          {showPamis && (
            <div className={`kpi-table-value pamis ${parseInt(pamisData?.diferencia) >= 0 ? 'positive' : 'negative'}`}>
              {parseInt(pamisData?.diferencia) >= 0
                ? `+${pamisData?.diferencia || 0}`
                : pamisData?.diferencia || 0}
            </div>
          )}
        </div>

        {/* Fila: Asistencia */}
        <div className="kpi-table-row">
          <div className="kpi-table-label">
            <span className="label-icon">👥</span>
            <span className="label-text">Asistencia</span>
          </div>
          <div className="kpi-table-value domis">{domisData?.domiAsistencia || 0}</div>
          {showPamis && (
            <div className="kpi-table-value pamis">{pamisData?.domiAsistencia || 0}</div>
          )}
        </div>

        {/* Fila: Satélites (solo DOMIS) */}
        <div className="kpi-table-row">
          <div className="kpi-table-label">
            <span className="label-icon">🛰️</span>
            <span className="label-text">Satélites</span>
          </div>
          <div className="kpi-table-value domis">{domisData?.satelites || 0}</div>
          {showPamis && (
            <div className="kpi-table-value pamis-empty">—</div>
          )}
        </div>

        {/* Fila: Telemercadeo (solo DOMIS) */}
        <div className="kpi-table-row">
          <div className="kpi-table-label">
            <span className="label-icon">📞</span>
            <span className="label-text">Telemercadeo</span>
          </div>
          <div className="kpi-table-value domis">+{domisData?.telemercadeo || 0}</div>
          {showPamis && (
            <div className="kpi-table-value pamis-empty">—</div>
          )}
        </div>

        {/* Fila: Info Adicional (solo DOMIS) */}
        <div className="kpi-table-row">
          <div className="kpi-table-label">
            <span className="label-icon">ℹ️</span>
            <span className="label-text">Info Adicional</span>
          </div>
          <div className="kpi-table-value domis">{domisData?.infoAdicional || 0}</div>
          {showPamis && (
            <div className="kpi-table-value pamis-empty">—</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPICards;