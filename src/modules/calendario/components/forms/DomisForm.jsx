import React, { useState } from 'react';
import Button from '../common/Button';

const DomisForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    direccion: '',
    ciudad: '',
    telefono: '',
    valor: ''
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
        <label className="block text-sm font-medium mb-1">Dirección</label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Ciudad</label>
        <input
          type="text"
          name="ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Teléfono</label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Valor</label>
        <input
          type="number"
          name="valor"
          value={formData.valor}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <Button type="submit">Guardar Domi</Button>
    </form>
  );
};

export default DomisForm;