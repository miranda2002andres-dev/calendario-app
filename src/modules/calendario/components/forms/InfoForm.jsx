import React, { useState } from 'react';
import Button from '../common/Button';

const InfoForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    cliente: '',
    documento: '',
    email: '',
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
        <label className="block text-sm font-medium mb-1">Cliente</label>
        <input
          type="text"
          name="cliente"
          value={formData.cliente}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Documento</label>
        <input
          type="text"
          name="documento"
          value={formData.documento}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Observaciones</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
        ></textarea>
      </div>
      <Button type="submit">Guardar Información</Button>
    </form>
  );
};

export default InfoForm;