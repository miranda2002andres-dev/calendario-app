import React from 'react';
import Card from '../common/Card';

const ResumenSemanalCard = ({ resumen }) => {
  return (
    <Card title="Resumen Semanal">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-green-50 rounded-lg text-center">
          <div className="text-xl font-bold text-green-500">{resumen?.efectivos}</div>
          <div className="text-xs text-gray-600">Efectivos</div>
        </div>
        <div className="p-3 bg-red-50 rounded-lg text-center">
          <div className="text-xl font-bold text-red-500">{resumen?.noEfectivos}</div>
          <div className="text-xs text-gray-600">No Efectivos</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg text-center">
          <div className="text-xl font-bold text-blue-500">{resumen?.total}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg text-center">
          <div className="text-xl font-bold text-yellow-500">{resumen?.efectividad}%</div>
          <div className="text-xs text-gray-600">Efectividad</div>
        </div>
      </div>
    </Card>
  );
};

export default ResumenSemanalCard;