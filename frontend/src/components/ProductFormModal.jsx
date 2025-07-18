import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Save, PlusCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ProductFormModal = ({ show, handleClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    existencias: '',
    categoria_id: '',
    proveedor_id: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchProviders();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        existencias: product.existencias || '',
        categoria_id: product.categoria_id || '',
        proveedor_id: product.proveedor_id || '',
      });
      setExistingImages(product.imagenes || []);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        existencias: '',
        categoria_id: '',
        proveedor_id: '',
      });
      setExistingImages([]);
    }
    setSelectedFiles([]); // Clear selected files on product change
  }, [product]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      toast.error('Error al obtener categorías.');
      console.error('Error al obtener categorías:', err);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await api.get('/providers');
      setProviders(response.data);
    } catch (err) {
      toast.error('Error al obtener proveedores.');
      console.error('Error al obtener proveedores:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagenes') {
      setSelectedFiles(Array.from(files));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    selectedFiles.forEach((file) => {
      data.append('imagenes[]', file);
    });

    try {
      if (product) {
        data.append('_method', 'PUT'); // Laravel expects _method for PUT requests with FormData
        await api.post(`/products/${product.id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Producto actualizado con éxito!');
      } else {
        await api.post('/products', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Producto agregado con éxito!');
      }
      onSave();
      handleClose();
    } catch (err) {
      console.error('Error al guardar el producto:', err);
      toast.error('Error al guardar el producto. Verifique los datos.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{product ? 'Editar Producto' : 'Agregar Nuevo Producto'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Nombre del producto" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} placeholder="Descripción del producto" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required placeholder="0.00" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Existencias</Form.Label>
            <Form.Control type="number" name="existencias" value={formData.existencias} onChange={handleChange} required placeholder="Cantidad en stock" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Imágenes</Form.Label>
            <Form.Control type="file" name="imagenes" multiple onChange={handleChange} />
            {existingImages.length > 0 && (
              <div className="mt-2">
                <h6>Imágenes actuales:</h6>
                {existingImages.map((img) => (
                  <img key={img.id} src={`http://localhost:8000/storage/${img.ruta}`} alt="Producto" style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '5px' }} />
                ))}
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select name="categoria_id" value={formData.categoria_id} onChange={handleChange} required>
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Proveedor</Form.Label>
            <Form.Select name="proveedor_id" value={formData.proveedor_id} onChange={handleChange} required>
              <option value="">Selecciona un proveedor</option>
              {providers.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">
            {product ? <><Save size={18} className="me-2" /> Actualizar</> : <><PlusCircle size={18} className="me-2" /> Agregar</>}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductFormModal;