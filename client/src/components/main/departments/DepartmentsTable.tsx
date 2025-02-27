'use client';
import { useState, useEffect } from 'react';
import { Building2, Plus, Users, UserCircle2, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import CreateDepartmentModal from '@/components/modals/departments/CreateDepartment';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import { Department } from '@/types/prismaTypes';
import { getDepartments, deleteDepartment } from '@/api/departments';
import PreloaderModals from '@/components/pr/PreloaderModals';

export default function DepartmentsTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!departmentToDelete) return;

    try {
      await deleteDepartment(departmentToDelete.id);
      await fetchDepartments();
      toast.success('Department deleted successfully');
    } catch (error: any) {
      // Show a nice error toast with the backend error message
      toast.error(
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Failed to delete department</p>
            <p className="text-sm text-red-600 mt-0.5">
              {error?.message || 'An unexpected error occurred'}
            </p>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return <PreloaderModals onFinish={() => setLoading(false)} />;
  }

  if (departments.length === 0) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
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
        </div>

        <CreateDepartmentModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchDepartments}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Departments</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066B3] text-white rounded-lg hover:bg-[#0066B3]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Department</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Description</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Manager</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Employees</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-[#0066B3]" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-900">{dept.name}</span>
                        {!dept.manager && (
                          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>No manager assigned</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {dept.description || 'No description'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="w-4 h-4 text-gray-400" />
                      {dept.manager ? (
                        <span className="text-sm text-gray-500">{dept.manager.firstName} {dept.manager.lastName}</span>
                      ) : (
                        <button 
                          onClick={() => setIsModalOpen(true)} 
                          className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                        >
                          Assign Manager
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{dept.employees?.length || 0} employees</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                      dept.status === 'ACTIVE' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-gray-50 text-gray-700'
                    }`}>
                      {dept.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-[#0066B3] hover:text-[#0066B3]/80 text-sm font-medium">
                        Edit
                      </button>
                      <button 
                        onClick={() => {
                          setDepartmentToDelete(dept);
                          setDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateDepartmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDepartments}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDepartmentToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Department"
        message="Are you sure you want to delete the department"
        itemName={departmentToDelete?.name}
      />
    </div>
  );
} 