import React from 'react';
import Card from '../common/Card';

const ProyectoDomiCard = ({ data }) => {
  return (
    <Card title="Proyecto Domi">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm">Total Proyectado</span>
          <span className="font-bold">${data?.totalProyectado}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Entregados</span>
          <span className="font-bold text-green-500">{data?.entregados}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Pendientes</span>
          <span className="font-bold text-yellow-500">{data?.pendientes}</span>
        </div>
      </div>
    </Card>
  );
};

export default ProyectoDomiCard;