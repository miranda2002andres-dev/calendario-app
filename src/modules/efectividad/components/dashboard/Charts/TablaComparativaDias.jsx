import React from 'react';
import Card from '../common/Card';

const TablaComparativaDias = ({ dias }) => {
  return (
    <Card title="Comparativa por Días">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Día</th>
              <th className="p-2 text-center">Efectivos</th>
              <th className="p-2 text-center">No Efectivos</th>
              <th className="p-2 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {dias?.map((dia, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{dia.nombre}</td>
                <td className="p-2 text-center text-green-500">{dia.efectivos}</td>
                <td className="p-2 text-center text-red-500">{dia.noEfectivos}</td>
                <td className="p-2 text-center font-medium">{dia.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TablaComparativaDias;