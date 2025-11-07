import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ConfirmDialog from './ConfirmDialog';
import DataTable from './DataTable';
import UserFormModal from './UserFormModal';
import { PlusCircle, Edit, Trash2, Users as UsersIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      // Filtrar el usuario actual de la lista
      const filteredUsers = response.data.filter(user => user.id !== currentUser?.id);
      setUsers(filteredUsers);
    } catch (err) {
      toast.error('Error al obtener usuarios.');
      console.error(err);
    }
  };

  const handleShowModal = (user = null) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSave = () => {
    fetchUsers();
  };

  const handleDeleteClick = useCallback((id) => {
    setUserToDelete(id);
    setShowConfirmDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!userToDelete) return;
    
    try {
      await api.delete(`/users/${userToDelete}`);
      toast.success('Usuario eliminado con éxito!');
      fetchUsers();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Error al eliminar el usuario.');
      }
    } finally {
      setShowConfirmDialog(false);
      setUserToDelete(null);
    }
  }, [userToDelete]);

  const handleCancelDelete = useCallback(() => {
    setShowConfirmDialog(false);
    setUserToDelete(null);
  }, []);

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => (
        <div className="flex items-center">
          <img
            className="h-8 w-8 rounded-full object-cover mr-3"
            src={`https://ui-avatars.com/api/?name=${row.original.name}&background=random`}
            alt={row.original.name}
          />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Correo Electrónico',
    },
    {
      accessorKey: 'roles',
      header: 'Rol',
      cell: ({ row }) => {
        const roles = row.original.roles || [];
        console.log('Usuario:', row.original.name, 'Roles:', roles);
        const isAdmin = roles.length > 0 && roles.some(role => role.name === 'admin');
        return (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            isAdmin 
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}>
            {isAdmin ? 'Administrador' : 'Empleado'}
          </span>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha de Registro',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString('es-ES'),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleShowModal(row.original)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
            title="Editar"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeleteClick(row.original.id)}
            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ], [handleDeleteClick]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <UsersIcon size={32} className="mr-3 text-primary-600 dark:text-primary-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestión de Usuarios</h1>
        </div>
        <button
          onClick={() => handleShowModal()}
          className="flex items-center px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200"
        >
          <PlusCircle size={20} className="mr-2" />
          Agregar Usuario
        </button>
      </div>

      <DataTable 
        data={users} 
        columns={columns} 
        searchPlaceholder="Buscar usuarios..."
      />

      <UserFormModal
        show={showModal}
        handleClose={handleCloseModal}
        user={selectedUser}
        onSave={handleSave}
      />

      <ConfirmDialog
        show={showConfirmDialog}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default Users;
