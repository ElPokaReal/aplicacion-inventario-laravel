import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Button, Modal, Form } from 'react-bootstrap';
import { PlusCircle, Edit, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      toast.error('Error al obtener categorías.');
      console.error(err);
    }
  };

  const handleShowModal = (category = null) => {
    setSelectedCategory(category);
    setCategoryName(category ? category.nombre : '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setCategoryName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await api.put(`/categories/${selectedCategory.id}`, { nombre: categoryName });
        toast.success('Categoría actualizada con éxito!');
      } else {
        await api.post('/categories', { nombre: categoryName });
        toast.success('Categoría agregada con éxito!');
      }
      fetchCategories();
      handleCloseModal();
    } catch (err) {
      console.error('Error al guardar la categoría:', err);
      toast.error('Error al guardar la categoría. Verifique los datos.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      toast.success('Categoría eliminada con éxito!');
    } catch (err) {
      toast.error('Error al eliminar la categoría.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Categorías</h2>

      <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>
        <PlusCircle className="me-2" size={18} /> Agregar Nueva Categoría
      </Button>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.nombre}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleShowModal(category)}><Edit size={16} /></button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(category.id)}><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCategory ? 'Editar Categoría' : 'Agregar Nueva Categoría'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required placeholder="Nombre de la categoría" />
            </Form.Group>
            <Button variant="primary" type="submit">
              {selectedCategory ? <><Save size={18} className="me-2" /> Actualizar</> : <><PlusCircle size={18} className="me-2" /> Agregar</>}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Categories;