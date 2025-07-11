'use client';

import { useState } from 'react';
import { z } from 'zod';

// Zod schemas
const TicketPrioritySchema = z.enum(['high', 'medium', 'low']);
const TicketSourceSchema = z.enum(['web', 'email', 'phone', 'chat']);
const TicketImageSchema = z.object({
  url: z.string(),
  filename: z.string(),
});

const CreatePublicTicketInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description is too long'),
  priority: TicketPrioritySchema.default('medium'),
  company_name: z.string().min(1, 'Company name is required').max(255, 'Company name is too long'),
  service_tag_names: z.array(z.string().min(1, 'Service tag cannot be empty').max(50, 'Service tag is too long')).min(1, 'At least one service tag is required'),
  contact_name: z.string().min(1, 'Contact name is required').max(100, 'Contact name is too long'),
  contact_email: z.string().email('Please enter a valid email address'),
  contact_phone: z.string().min(1, 'Phone number is required').max(20, 'Phone number is too long'),
  source: TicketSourceSchema.default('web'),
  photo_url: z.string().url('Please enter a valid URL').optional(),
  images: z.array(TicketImageSchema).optional().default([]),
});

// Type inference
type CreatePublicTicketInput = z.infer<typeof CreatePublicTicketInputSchema>;

// Type for our form state that extends the API input type
type FormState = Partial<CreatePublicTicketInput> & {
  serviceTagInput?: string;
};

export default function Home() {
  const [formData, setFormData] = useState<FormState>({
    contact_name: '',
    company_name: '',
    contact_email: '',
    contact_phone: '',
    priority: 'medium',
    title: '',
    description: '',
    service_tag_names: [],
    source: 'web',
    images: [],
    serviceTagInput: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is modified
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Convert all files to base64
      const base64Promises = files.map(file => convertToBase64(file));
      const base64Results = await Promise.all(base64Promises);

      // Add the new images to the form data
      const newImages = files.map((file, index) => ({
        url: base64Results[index],
        filename: file.name
      }));

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }));
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al procesar las imágenes'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});
    setSubmitStatus({ type: null, message: '' });

    try {
      // Validate form data
      const validatedData = CreatePublicTicketInputSchema.parse({
        ...formData,
        service_tag_names: formData.service_tag_names || []
      });

      // Make the API call with base64 images
      const response = await fetch('https://jadmin-nu.vercel.app/api/public-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...validatedData,
          images: validatedData.images?.map(img => ({
            url: img.url,
            filename: img.filename
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al crear el ticket' }));
        throw new Error(errorData.message || 'Error al crear el ticket');
      }

      // Success
      setSubmitStatus({
        type: 'success',
        message: '¡Ticket creado exitosamente! Nos pondremos en contacto pronto.'
      });

      // Reset form
      setFormData({
        contact_name: '',
        company_name: '',
        contact_email: '',
        contact_phone: '',
        priority: 'medium',
        title: '',
        description: '',
        service_tag_names: [],
        source: 'web',
        images: [],
        serviceTagInput: ''
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach(err => {
          if (err.path.length > 0) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setFormErrors(errors);
        setSubmitStatus({
          type: 'error',
          message: 'Por favor, corrija los errores en el formulario.'
        });
      } else {
        console.error('Error submitting form:', error);
        setSubmitStatus({
          type: 'error',
          message: error instanceof Error ? error.message : 'Error al crear el ticket'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeServiceTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      service_tag_names: prev.service_tag_names?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const generateRandomData = () => {
    const companies = [
      'TechCorp Solutions',
      'Innovate Systems',
      'Digital Dynamics',
      'Future Technologies',
      'Smart Solutions Inc.'
    ];

    const problems = [
      'El sistema no responde cuando intento acceder al módulo de reportes.',
      'Necesito actualizar la configuración de seguridad del servidor.',
      'Los usuarios reportan lentitud en el dashboard principal.',
      'Requiero asistencia con la integración de nuevos módulos.',
      'El proceso de backup automático no está funcionando correctamente.'
    ];

    const serviceTags = [
      'SRV001',
      'APP002',
      'NET003',
      'SEC004',
      'DB005'
    ];

    const randomItem = <T extends unknown>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randomPhone = () => `+51 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)}`;
    const randomName = () => {
      const names = ['Juan', 'Carlos', 'María', 'Ana', 'Pedro'];
      const lastNames = ['García', 'López', 'Martínez', 'Rodriguez', 'Torres'];
      return `${randomItem(names)} ${randomItem(lastNames)}`;
    };

    setFormData({
      contact_name: randomName(),
      company_name: randomItem(companies),
      contact_email: `test${Math.floor(Math.random() * 1000)}@example.com`,
      contact_phone: randomPhone(),
      priority: randomItem(['high', 'medium', 'low']),
      title: `Solicitud de soporte: ${randomItem(['Configuración', 'Actualización', 'Mantenimiento', 'Instalación'])}`,
      description: randomItem(problems),
      service_tag_names: [randomItem(serviceTags)],
      source: 'web',
      images: [],
      serviceTagInput: ''
    });
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
            {process.env.NODE_ENV === 'development' && (
              <button
                type="button"
                onClick={generateRandomData}
                className="mb-6 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Generar datos de prueba
              </button>
            )}

            {submitStatus.type && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-red-50 text-red-800'
                }`}
              >
                <div className="flex items-center">
                  {submitStatus.type === 'success' ? (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  <p>{submitStatus.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                  {formErrors.contact_name && <p className="text-red-500 text-xs mt-1">{formErrors.contact_name}</p>}
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la empresa
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                  {formErrors.company_name && <p className="text-red-500 text-xs mt-1">{formErrors.company_name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                  {formErrors.contact_email && <p className="text-red-500 text-xs mt-1">{formErrors.contact_email}</p>}
                </div>

                {/* After the email field and before the priority field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                  {formErrors.contact_phone && <p className="text-red-500 text-xs mt-1">{formErrors.contact_phone}</p>}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    name="priority"
                    value={formData.priority || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  >
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja</option>
                  </select>
                  {formErrors.priority && <p className="text-red-500 text-xs mt-1">{formErrors.priority}</p>}
                </div>
              </div>

              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del ticket
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  placeholder="Ingrese un título descriptivo"
                  required
                />
                {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
              </div>

              {/* Service Tags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identificadores (Service Tag)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    name="serviceTagInput"
                    value={formData.serviceTagInput || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceTagInput: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    placeholder="Agregar identificador"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newTag = formData.serviceTagInput?.trim();
                      if (newTag && !formData.service_tag_names?.includes(newTag)) {
                        setFormData(prev => ({
                          ...prev,
                          service_tag_names: [...(prev.service_tag_names || []), newTag],
                          serviceTagInput: '' // Clear the input after adding
                        }));
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.service_tag_names?.map((tag) => (
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
                {formErrors.service_tag_names && <p className="text-red-500 text-xs mt-1">{formErrors.service_tag_names}</p>}
              </div>

              {/* Problem Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripcion del problema
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  placeholder="Describa su problema en detalle..."
                  required
                />
                {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
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
                    accept="image/*"
                    multiple
                    disabled={isSubmitting}
                  />
                  <label 
                    htmlFor="file-upload" 
                    className={`cursor-pointer ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <div className="flex flex-col items-center">
                        <svg className="animate-spin h-8 w-8 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm text-gray-500">Subiendo archivos...</p>
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="mt-4">
                          {formData.images && formData.images.length > 0 ? (
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                {formData.images.length} {formData.images.length === 1 ? 'archivo subido' : 'archivos subidos'}
                              </p>
                              <ul className="list-disc list-inside text-sm text-gray-500">
                                {formData.images.map(img => (
                                  <li key={img.url} className="flex items-center justify-center gap-2">
                                    <span className="truncate max-w-xs">{img.filename}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setFormData(prev => ({
                                          ...prev,
                                          images: prev.images?.filter(i => i.url !== img.url) || []
                                        }));
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      ×
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <>
                              <p className="text-gray-600">
                                Arrastra archivos aquí o haz clic para seleccionar
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Solo imágenes (PNG, JPG)
                              </p>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar ticket
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
