import React from 'react';
import Card from '../../components/common/Card';

const IndicadoresSemanales = ({ indicadores }) => {
  return (
    <Card title="Indicadores Semanales">
      <div className="grid grid-cols-2 gap-4">
        {indicadores?.map((ind, index) => (
          <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-500">{ind.valor}</div>
            <div className="text-sm text-gray-600">{ind.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default IndicadoresSemanales;
