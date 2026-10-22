import React, { useState } from 'react';
import Button from '../common/Button';

const TeleForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    numero: '',
    operador: '',
    resultado: '',
    observaciones: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Número</label>
        <input
          type="tel"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Operador</label>
        <select
          name="operador"
          value={formData.operador}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Seleccionar...</option>
          <option value="claro">Claro</option>
          <option value="movistar">Movistar</option>
          <option value="tigo">Tigo</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Resultado</label>
        <select
          name="resultado"
          value={formData.resultado}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Seleccionar...</option>
          <option value="efectivo">Efectivo</option>
          <option value="no_efectivo">No Efectivo</option>
          <option value="callback">Callback</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Observaciones</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="2"
        ></textarea>
      </div>
      <Button type="submit">Guardar Gestión</Button>
    </form>
  );
};

export default TeleForm;