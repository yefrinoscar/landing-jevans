'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    priority: 'Alta',
    serviceTag: '',
    problemDescription: '',
    attachments: null as File | null
  });

  const [serviceTags, setServiceTags] = useState(['ATX29HXS', 'UMN622R', 'TLD690YW']);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      attachments: file
    }));
  };

  const addServiceTag = () => {
    if (formData.serviceTag.trim() && !serviceTags.includes(formData.serviceTag.trim())) {
      setServiceTags(prev => [...prev, formData.serviceTag.trim()]);
      setFormData(prev => ({ ...prev, serviceTag: '' }));
    }
  };

  const removeServiceTag = (tagToRemove: string) => {
    setServiceTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData, 'Service Tags:', serviceTags);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                J
              </div>
              <span className="ml-2 text-xl font-semibold text-blue-600">Evans</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Inicio</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Nosotros</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Servicio</a>
              <a href="#" className="text-blue-600 font-medium">Soporte</a>
            </nav>
            
            {/* Contact Button */}
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Contactanos
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Creacion del ticket de soporte
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Estamos listos para ayudarte a alcanzar sus objetivos tecnologicos. Contactenos y descubra como 
            podemos impulsar su negocio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-6">
                Informacion de contacto
              </h3>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26c.98.52 2.16.52 3.14 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">contactos@underta.com</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefono</p>
                    <p className="text-gray-900">+51 923 345 567</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Direccion</p>
                    <p className="text-gray-900">
                      Calle Boulevard 152, Of. 904,<br />
                      Monterrico, Surco - Lima, Peru
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-blue-600 mb-4">
                  Horario de atencion
                </h4>
                <p className="text-sm text-gray-500 mb-2">
                  Nuestro equipo esta disponible para atenderle en el siguiente horario:
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Lunes - Viernes:</span>
                    <span className="text-gray-900 font-medium">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Sabado:</span>
                    <span className="text-gray-900 font-medium">10:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Domingo:</span>
                    <span className="text-red-600 font-medium">Cerrado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la empresa
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>

              {/* Service Tags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identificadores (Service Tag)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    name="serviceTag"
                    value={formData.serviceTag}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Agregar identificador"
                  />
                  <button
                    type="button"
                    onClick={addServiceTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {serviceTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeServiceTag(tag)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Problem Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripcion del problema
                </label>
                <textarea
                  name="problemDescription"
                  value={formData.problemDescription}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describa su problema en detalle..."
                  required
                />
              </div>

              {/* File Upload */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivos Adjuntos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="mt-4">
                      <p className="text-gray-600">
                        {formData.attachments ? formData.attachments.name : 'Arrastra archivos aquí o haz clic para seleccionar'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PNG, JPG, PDF, DOC, TXT hasta 10MB
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Enviar ticket
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
