import React from 'react';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';

const MetasSemanaCard = ({ metas }) => {
  return (
    <Card title="Metas de la Semana">
      <div className="space-y-4">
        {metas?.map((meta, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span>{meta.nombre}</span>
              <span>{meta.actual}/{meta.meta}</span>
            </div>
            <ProgressBar progress={(meta.actual / meta.meta) * 100} />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MetasSemanaCard;