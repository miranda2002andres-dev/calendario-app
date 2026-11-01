import React from 'react';
import Card from '../common/Card';

const ProyeccionSemanalCard = ({ proyeccion }) => {
  return (
    <Card title="Proyección Semanal">
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-500">{proyeccion?.totalProyectado}</div>
        <p className="text-sm text-gray-600 mt-2">{proyeccion?.descripcion}</p>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm">Tendencia: <span className="font-medium">{proyeccion?.tendencia}</span></p>
          <p className="text-sm">Diferencia: <span className="font-medium">{proyeccion?.diferencia}</span></p>
        </div>
      </div>
    </Card>
  );
};

export default ProyeccionSemanalCard;