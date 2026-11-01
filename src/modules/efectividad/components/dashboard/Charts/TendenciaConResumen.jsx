import React from 'react';
import TendenciaMiniCard from './TendenciaMiniCard';
import ResumenMensualCard from './ResumenMensualCard';
import './TendenciaConResumen.css';

const TendenciaConResumen = ({ source, datos, mes, año }) => {
  const getConfig = () => {
    if (source === 'domis') {
      return {
        tituloTendencia: '📦 TENDENCIA DOMIS',
        tituloResumen: '📦 RESUMEN MENSUAL - DOMIS',
        colorClass: 'domis'
      };
    }
    if (source === 'pamis') {
      return {
        tituloTendencia: '📮 TENDENCIA PAMIS',
        tituloResumen: '📮 RESUMEN MENSUAL - PAMIS',
        colorClass: 'pamis'
      };
    }
    return {
      tituloTendencia: '📊 TENDENCIA GENERAL',
      tituloResumen: '📊 RESUMEN MENSUAL - GENERAL',
      colorClass: 'general'
    };
  };

  const config = getConfig();

  return (
    <div className="tendencia-con-resumen">
      <TendenciaMiniCard 
        datos={datos}
        source={source}
        title={config.tituloTendencia}
      />
      <ResumenMensualCard 
        source={source}
        mes={mes}
        año={año}
        titulo={config.tituloResumen}
        colorClass={config.colorClass}
      />
    </div>
  );
};

export default TendenciaConResumen;