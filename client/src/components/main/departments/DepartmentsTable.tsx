'use client';
import { useState, useEffect } from 'react';
import { Building2, Plus, Users, UserCircle2, Trash2, AlertCircle, Pencil, Search, Layers } from 'lucide-react';
import { toast } from 'sonner';
import CreateDepartmentModal from '@/components/modals/departments/CreateDepartment';
import DeleteConfirmationModal from '@/components/modals/confirmation/DeleteConfirmationModal';
import { Department } from '@/types/prismaTypes';
import { getDepartments, deleteDepartment } from '@/api/departments';
import PreloaderModals from '@/components/pr/PreloaderModals';
import SearchFilterDepartments from './SearchFilterDepartments';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDepartments as fetchDepartmentsAction, deleteDepartmentAsync } from '@/store/features/departments/departmentsSlice';

export default function DepartmentsTable() {
  const dispatch = useAppDispatch();
  const { list: departments, loading: reduxLoading } = useAppSelector((state) => state.departments);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    console.log('Initial load - dispatching fetchDepartmentsAction');
    dispatch(fetchDepartmentsAction());
  }, [dispatch]);

  useEffect(() => {
    console.log('Redux loading state changed:', reduxLoading);
    if (!reduxLoading) {
      setLoading(false);
    }
  }, [reduxLoading]);

  useEffect(() => {
    console.log('Departments from Redux store:', departments);
    filterDepartments();
  }, [departments, searchQuery, statusFilter]);

  const filterDepartments = () => {
    console.log('Filtering departments. Current departments:', departments);
    let filtered = [...departments];
    
    if (searchQuery) {
      filtered = filtered.filter(dept => 
        dept.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.id?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(dept => dept.status === statusFilter);
    }

    console.log('Filtered departments:', filtered);
    setFilteredDepartments(filtered);
  };

  const handleDelete = async () => {
    if (!departmentToDelete) return;

    try {
      // First try the direct API call approach
      await deleteDepartment(departmentToDelete.id);
      
      // Then dispatch the Redux action to update the store
      dispatch(fetchDepartmentsAction());
      
      // Close the modal and clear the state
      setDeleteModalOpen(false);
      setDepartmentToDelete(null);
      
      // Show success toast
      toast.success(
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              Deleted Department
            </p>
            <p className="text-xs text-white/90 mt-0.5">
              {departmentToDelete.name} has been removed from the system
            </p>
          </div>
        </div>,
        {
          position: 'bottom-right',
          style: {
            background: '#f97316', // orange-500
            border: 'none',
            color: 'white'
          }
        }
      );
    } catch (error: any) {
      toast.error(
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              Failed to Delete Department
            </p>
            <p className="text-xs text-white/90 mt-0.5">
              {error?.message || 'An unexpected error occurred'}
            </p>
          </div>
        </div>,
        {
          position: 'bottom-right',
          style: {
            background: '#ef4444', // red-500
            border: 'none',
            color: 'white'
          }
        }
      );
    }
  };

  const handleEdit = (department: Department) => {
    setDepartmentToEdit(department);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    console.log('Modal success callback triggered');
    
    dispatch(fetchDepartmentsAction());
    
    setTimeout(() => {
      console.log('Delayed refresh - dispatching fetchDepartmentsAction again');
      dispatch(fetchDepartmentsAction());
    }, 500);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setDepartmentToEdit(null);
  };

  if (loading) {
    return <PreloaderModals onFinish={() => setLoading(false)} />;
  }

  if (departments.length === 0) {
    return (
      <div className="h-[1000px] w-full flex items-center justify-center">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900">No Departments Added</h3>
            <p className="text-sm text-gray-500 mt-1">Get started by adding your first department</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#0066B3] rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Department</span>
          </button>
        </div>

        {isModalOpen && (
          <CreateDepartmentModal 
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <SearchFilterDepartments 
        onSearch={setSearchQuery}
        onFilterStatus={setStatusFilter}
        showFilters={true}
        onAdd={() => setIsModalOpen(true)}
      />
      <div className="flex-1">
        <div className="bg-white h-full overflow-hidden">
          <div className="h-full overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-200">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-200">ID Code</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-200">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-200">Groups</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-200">Manager</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-200">Employees</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDepartments.map((dept) => {
                  if (!dept || !dept.id) {
                    console.error('Invalid department data:', dept);
                    return null;
                  }
                  
                  return (
                    <tr key={`dept-${dept.id}`} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-4 h-4 text-[#0066B3]" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{dept.name || 'Unnamed Department'}</div>
                            <div className="text-xs text-gray-500">{dept.id || 'No ID'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{dept.id || 'No ID'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{dept.description || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-gray-400" />
                          {dept.groups && dept.groups.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {dept.groups.map((group: string, index: number) => (
                                <span 
                                  key={`group-${dept.id}-${index}`} 
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700"
                                >
                                  {group}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <UserCircle2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {dept.manager ? `${dept.manager.firstName} ${dept.manager.lastName}` : '-'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{dept.employees?.length || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            className="p-1.5 text-gray-400 hover:text-[#0066B3] rounded-md hover:bg-blue-50 transition-colors"
                            onClick={() => handleEdit(dept)}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                            onClick={() => {
                              setDepartmentToDelete(dept);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CreateDepartmentModal 
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          departmentToEdit={departmentToEdit}
        />
      )}

      {deleteModalOpen && departmentToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Department"
          message={`Are you sure you want to delete ${departmentToDelete.name}? This action cannot be undone.`}
        />
      )}
    </div>
  );
} 