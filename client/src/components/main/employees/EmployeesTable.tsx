'use client';
import { useState, useEffect } from 'react';
import { Users, Plus, Building2, Mail, Phone, Trash2, AlertCircle, Search, Pencil, Layers } from 'lucide-react';
import { toast } from 'sonner';
import CreateEmployeeModal from '@/components/modals/employees/CreateEmployee';
import DeleteConfirmationModal from '@/components/modals/confirmation/DeleteConfirmationModal';
import PreloaderModals from '../../pr/PreloaderModals';
import { getEmployees, deleteEmployee } from '@/api/employees';
import { Employee } from '@/types/prismaTypes';
import SearchFilterEmployees from './SearchFilterEmployees';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchEmployees as fetchEmployeesAction, deleteEmployeeAsync } from '@/store/features/employees/employeesSlice';

interface DeleteEmployeeResponse {
  message: string;
  wasManager?: boolean;
  departmentName?: string;
}

interface EmployeesTableProps {
  searchQuery: string;
  statusFilter: string;
}

export default function EmployeesTable() {
  const dispatch = useAppDispatch();
  const { list: employees, loading: reduxLoading } = useAppSelector((state) => state.employees);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Initial load of employees
  useEffect(() => {
    console.log('Initial load - dispatching fetchEmployeesAction');
    dispatch(fetchEmployeesAction());
  }, [dispatch]);

  // Update loading state based on Redux loading state
  useEffect(() => {
    console.log('Redux loading state changed:', reduxLoading);
    if (!reduxLoading) {
      setLoading(false);
    }
  }, [reduxLoading]);

  // Update filtered employees when employees, search, or filter changes
  useEffect(() => {
    console.log('Employees from Redux store:', employees);
    filterEmployees();
  }, [employees, searchQuery, statusFilter]);

  const filterEmployees = () => {
    console.log('Filtering employees. Current employees:', employees);
    let filtered = [...employees];
    
    if (searchQuery) {
      filtered = filtered.filter(emp => 
        emp.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(emp => emp.status === statusFilter);
    }

    console.log('Filtered employees:', filtered);
    setFilteredEmployees(filtered);
  };

  const handleDelete = async () => {
    if (!employeeToDelete) return;

    try {
      // First try the direct API call approach
      await deleteEmployee(employeeToDelete.id);
      
      // Then dispatch the Redux action to update the store
      dispatch(fetchEmployeesAction());
      
      // Close the modal and clear the state
      setDeleteModalOpen(false);
      setEmployeeToDelete(null);
      
      // Show success toast
      toast.success(
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              Deleted Employee
            </p>
            <p className="text-xs text-white/90 mt-0.5">
              {employeeToDelete.firstName} {employeeToDelete.lastName} has been removed from the system
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
              Failed to Delete Employee
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

  const handleEdit = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    console.log('Modal success callback triggered');
    
    // Force a refresh of employees from the API
    dispatch(fetchEmployeesAction());
    
    // Add a delayed refresh to ensure we get the latest data
    setTimeout(() => {
      console.log('Delayed refresh - dispatching fetchEmployeesAction again');
      dispatch(fetchEmployeesAction());
    }, 500);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEmployeeToEdit(null);
  };

  if (loading) {
    return <PreloaderModals onFinish={() => setLoading(false)} />;
  }

  if (employees.length === 0) {
    return (
      <div className="flex-1 flex flex-col h-[1000px]">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h3 className="text-base font-medium  text-gray-900">No Employees Added</h3>
              <p className="text-sm text-gray-500 mt-1">Get started by adding your first employee</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#0066B3] rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Employee</span>
            </button>
          </div>
        </div>

        <CreateEmployeeModal 
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <SearchFilterEmployees 
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-200">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-200">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-200">Group / Team</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-200">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-200">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-200">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee) => {
                  // Add a check to ensure the employee has required fields
                  if (!employee || !employee.id) {
                    console.error('Invalid employee data:', employee);
                    return null;
                  }
                  
                  return (
                    <tr key={`emp-${employee.id}`} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 text-[#0066B3]" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {employee.firstName || 'Unnamed'} {employee.lastName || ''}
                            </div>
                            <div className="text-xs text-gray-500">{employee.employeeId || 'No ID'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{employee.department?.name || 'No Department'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-gray-400" />
                          {employee.group ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                              {employee.group}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(employee.email || employee.phone) ? (
                          <div className="space-y-1">
                            {employee.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{employee.email}</span>
                              </div>
                            )}
                            {employee.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{employee.phone}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No contact info</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{employee.role || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          employee.status === 'ACTIVE' 
                            ? 'bg-green-50 text-green-700' 
                            : employee.status === 'ON_LEAVE'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-gray-50 text-gray-700'
                        }`}>
                          {employee.status || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            className="p-1.5 text-gray-400 hover:text-[#0066B3] rounded-md hover:bg-blue-50 transition-colors"
                            onClick={() => handleEdit(employee)}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setEmployeeToDelete(employee);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
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

      <CreateEmployeeModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        employeeToEdit={employeeToEdit}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={employeeToDelete ? `Are you sure you want to delete ${employeeToDelete.firstName} ${employeeToDelete.lastName}?` : 'Are you sure you want to delete this employee?'}
      />
    </div>
  );
}