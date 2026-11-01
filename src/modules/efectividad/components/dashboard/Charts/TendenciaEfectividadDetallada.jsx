import React from 'react';
import Card from '../common/Card';

const TendenciaEfectividadDetallada = ({ data }) => {
  return (
    <Card title="Tendencia de Efectividad Detallada">
      <div className="space-y-4">
        {data?.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>{item.dia}</span>
                <span>{item.porcentaje}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${item.porcentaje}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TendenciaEfectividadDetallada;