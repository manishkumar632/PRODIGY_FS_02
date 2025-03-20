import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getEmployees, deleteEmployee } from '../services/employeeService';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaFilter, FaTimes } from 'react-icons/fa';

const EmployeeListContainer = styled.div`
  margin-bottom: 2rem;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid var(--light-gray-color);
    border-radius: 4px;
    font-size: 0.875rem;
    
    &:focus {
      border-color: var(--primary-color);
      outline: none;
    }
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-color);
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 576px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const AddButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--secondary-color);
  }
  
  svg {
    margin-right: 0.5rem;
  }
  
  @media (max-width: 576px) {
    flex: 1;
    justify-content: center;
  }
`;

const FilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: var(--light-gray-color);
  color: var(--dark-color);
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  svg {
    margin-right: 0.5rem;
  }
  
  @media (max-width: 576px) {
    flex: 1;
    justify-content: center;
  }
`;

const FiltersContainer = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  
  .filter-group {
    display: flex;
    flex-direction: column;
    
    label {
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      color: var(--dark-color);
      font-weight: 500;
    }
    
    select, input {
      padding: 0.5rem;
      border: 1px solid var(--light-gray-color);
      border-radius: 4px;
      font-size: 0.875rem;
      
      &:focus {
        border-color: var(--primary-color);
        outline: none;
      }
    }
  }
  
  .filter-actions {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      
      &.apply {
        background-color: var(--primary-color);
        color: white;
      }
      
      &.reset {
        background-color: var(--light-gray-color);
        color: var(--dark-color);
      }
    }
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    
    .filter-actions {
      grid-column: 1 / -1;
      justify-content: flex-end;
    }
  }
`;

const ActiveFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FilterTag = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: rgba(67, 97, 238, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  
  button {
    background: none;
    border: none;
    color: var(--primary-color);
    cursor: pointer;
    margin-left: 0.25rem;
    padding: 0;
    display: flex;
    align-items: center;
  }
`;

const EmployeeTable = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow-x: auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--light-gray-color);
    }
    
    th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: var(--dark-color);
      white-space: nowrap;
      cursor: pointer;
      
      &:hover {
        background-color: #f0f0f0;
      }
      
      .sort-icon {
        margin-left: 0.25rem;
      }
    }
    
    tr:hover {
      background-color: rgba(67, 97, 238, 0.05);
    }
    
    .status {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      
      &.active {
        background-color: rgba(76, 201, 240, 0.1);
        color: var(--success-color);
      }
      
      &.inactive {
        background-color: rgba(231, 76, 60, 0.1);
        color: var(--danger-color);
      }
      
      &.on-leave {
        background-color: rgba(241, 196, 15, 0.1);
        color: #f39c12;
      }
    }
  }
  
  @media (max-width: 992px) {
    .mobile-hide {
      display: none;
    }
  }
  
  @media (max-width: 576px) {
    .responsive-table {
      display: flex;
      flex-direction: column;
      
      thead {
        display: none;
      }
      
      tbody {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }
      
      tr {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--light-gray-color);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
      }
      
      td {
        display: flex;
        padding: 0.5rem 0;
        border-bottom: none;
        
        &:before {
          content: attr(data-label);
          font-weight: 600;
          width: 40%;
          margin-right: 1rem;
        }
      }
      
      .action-cell {
        justify-content: flex-end;
        margin-top: 0.5rem;
        
        &:before {
          content: none;
        }
      }
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  
  button, a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.edit-btn {
      background-color: rgba(67, 97, 238, 0.1);
      color: var(--primary-color);
      
      &:hover {
        background-color: var(--primary-color);
        color: white;
      }
    }
    
    &.delete-btn {
      background-color: rgba(231, 76, 60, 0.1);
      color: var(--danger-color);
      
      &:hover {
        background-color: var(--danger-color);
        color: white;
      }
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: var(--dark-color);
  }
  
  p {
    color: var(--gray-color);
    margin-bottom: 1.5rem;
  }
`;

const ConfirmDialog = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  
  .dialog-content {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    padding: 1.5rem;
    
    h3 {
      margin-bottom: 1rem;
    }
    
    p {
      margin-bottom: 1.5rem;
      color: var(--gray-color);
    }
    
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      
      button {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        border: none;
        
        &.cancel {
          background-color: var(--light-gray-color);
          color: var(--dark-color);
        }
        
        &.confirm {
          background-color: var(--danger-color);
          color: white;
        }
      }
    }
  }
`;

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    position: '',
    status: '',
    minSalary: '',
    maxSalary: ''
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'firstName',
    direction: 'ascending'
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    employeeId: null,
    employeeName: ''
  });
  
  // Get unique departments and positions for filter dropdowns
  const departments = [...new Set(employees.map(emp => emp.department))].filter(Boolean);
  const positions = [...new Set(employees.map(emp => emp.position))].filter(Boolean);
  const statuses = ['Active', 'Inactive', 'On Leave'];
  
  useEffect(() => {
    fetchEmployees();
  }, []);
  
  useEffect(() => {
    applyFiltersAndSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, employees, filters, sortConfig]);
  
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployees();
      
      if (response.success) {
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch employees');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const applyFiltersAndSearch = () => {
    let result = [...employees];
    
    // Apply search
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        employee =>
          employee.firstName.toLowerCase().includes(searchLower) ||
          employee.lastName.toLowerCase().includes(searchLower) ||
          employee.email.toLowerCase().includes(searchLower) ||
          employee.position.toLowerCase().includes(searchLower) ||
          employee.department.toLowerCase().includes(searchLower) ||
          `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply filters
    if (filters.department) {
      result = result.filter(emp => emp.department === filters.department);
    }
    
    if (filters.position) {
      result = result.filter(emp => emp.position === filters.position);
    }
    
    if (filters.status) {
      result = result.filter(emp => emp.status === filters.status);
    }
    
    if (filters.minSalary) {
      result = result.filter(emp => emp.salary >= Number(filters.minSalary));
    }
    
    if (filters.maxSalary) {
      result = result.filter(emp => emp.salary <= Number(filters.maxSalary));
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredEmployees(result);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const applyFilters = () => {
    // Create active filter tags
    const newActiveFilters = [];
    
    if (filters.department) {
      newActiveFilters.push({
        id: 'department',
        label: `Department: ${filters.department}`
      });
    }
    
    if (filters.position) {
      newActiveFilters.push({
        id: 'position',
        label: `Position: ${filters.position}`
      });
    }
    
    if (filters.status) {
      newActiveFilters.push({
        id: 'status',
        label: `Status: ${filters.status}`
      });
    }
    
    if (filters.minSalary) {
      newActiveFilters.push({
        id: 'minSalary',
        label: `Min Salary: $${filters.minSalary}`
      });
    }
    
    if (filters.maxSalary) {
      newActiveFilters.push({
        id: 'maxSalary',
        label: `Max Salary: $${filters.maxSalary}`
      });
    }
    
    setActiveFilters(newActiveFilters);
    setShowFilters(false);
  };
  
  const resetFilters = () => {
    setFilters({
      department: '',
      position: '',
      status: '',
      minSalary: '',
      maxSalary: ''
    });
    setActiveFilters([]);
  };
  
  const removeFilter = (filterId) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: ''
    }));
    
    setActiveFilters(prev => prev.filter(filter => filter.id !== filterId));
  };
  
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };
  
  const handleDeleteClick = (id, name) => {
    console.log(`Preparing to delete employee with ID: ${id}, Name: ${name}`);
    
    // Enhanced ID validation
    if (!id || id === 'undefined') {
      console.error('Invalid employee ID:', id);
      toast.error('Cannot delete: Invalid employee ID');
      return;
    }
    
    // Find employee with more robust ID matching
    const employeeToDelete = employees.find(emp => 
      (emp._id && (emp._id === id || emp._id.toString() === id)) || 
      (emp.id && (emp.id === id || emp.id.toString() === id))
    );
    
    if (!employeeToDelete) {
      console.error('Employee not found with ID:', id);
      toast.error('Cannot delete: Employee not found');
      return;
    }
    
    // Use MongoDB _id if available, otherwise use regular id
    const deleteId = (employeeToDelete._id || employeeToDelete.id).toString();
    console.log('Using ID for deletion:', deleteId);
    
    setConfirmDialog({
      isOpen: true,
      employeeId: deleteId,
      employeeId: deleteId.toString(),
      employeeName: name
    });
  };
  
  const handleConfirmDelete = async () => {
    try {
      const { employeeId } = confirmDialog;
      
      if (!employeeId) {
        console.error('Cannot delete: Invalid employee ID');
        toast.error('Cannot delete: Invalid employee ID');
        setConfirmDialog({
          isOpen: false,
          employeeId: null,
          employeeName: ''
        });
        return;
      }
      
      console.log(`Confirming deletion of employee with ID: ${employeeId}`);
      
      // Find the employee to ensure we have the correct ID
      const employeeToDelete = employees.find(emp => 
        emp._id === employeeId || 
        emp.id === employeeId || 
        emp._id === employeeId.toString() || 
        emp.id === employeeId.toString()
      );
      
      if (!employeeToDelete) {
        toast.error('Cannot delete: Employee not found');
        setConfirmDialog({
          isOpen: false,
          employeeId: null,
          employeeName: ''
        });
        return;
      }
      
      // Use the correct ID for deletion
      const deleteId = (employeeToDelete._id || employeeToDelete.id).toString();
      const response = await deleteEmployee(deleteId);
      
      if (response && response.success) {
        // Remove from both states using both _id and id
        setEmployees(prevEmployees => 
          prevEmployees.filter(emp => 
            emp._id !== deleteId && 
            emp.id !== deleteId && 
            emp._id !== employeeId && 
            emp.id !== employeeId
          )
        );
        setFilteredEmployees(prevFiltered => 
          prevFiltered.filter(emp => 
            emp._id !== deleteId && 
            emp.id !== deleteId && 
            emp._id !== employeeId && 
            emp.id !== employeeId
          )
        );
        toast.success('Employee deleted successfully');
      } else {
        toast.error(response?.message || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete employee');
    } finally {
      setConfirmDialog({
        isOpen: false,
        employeeId: null,
        employeeName: ''
      });
    }
  };
  
  const handleCancelDelete = () => {
    setConfirmDialog({
      isOpen: false,
      employeeId: null,
      employeeName: ''
    });
  };
  
  return (
    <EmployeeListContainer>
      <ActionBar>
        <SearchContainer>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by name, email, position..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </SearchContainer>
        
        <ButtonsContainer>
          <FilterButton onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> {showFilters ? 'Hide Filters' : 'Filters'}
          </FilterButton>
          
          <AddButton to="/employees/add">
            <FaPlus /> Add Employee
          </AddButton>
        </ButtonsContainer>
      </ActionBar>
      
      {showFilters && (
        <FiltersContainer
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="filter-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="position">Position</label>
            <select
              id="position"
              name="position"
              value={filters.position}
              onChange={handleFilterChange}
            >
              <option value="">All Positions</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="minSalary">Min Salary</label>
            <input
              type="number"
              id="minSalary"
              name="minSalary"
              value={filters.minSalary}
              onChange={handleFilterChange}
              placeholder="Min"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="maxSalary">Max Salary</label>
            <input
              type="number"
              id="maxSalary"
              name="maxSalary"
              value={filters.maxSalary}
              onChange={handleFilterChange}
              placeholder="Max"
            />
          </div>
          
          <div className="filter-actions">
            <button className="reset" onClick={resetFilters}>
              Reset
            </button>
            <button className="apply" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        </FiltersContainer>
      )}
      
      {activeFilters.length > 0 && (
        <ActiveFiltersContainer>
          {activeFilters.map(filter => (
            <FilterTag key={filter.id}>
              {filter.label}
              <button onClick={() => removeFilter(filter.id)}>
                <FaTimes size={10} />
              </button>
            </FilterTag>
          ))}
        </ActiveFiltersContainer>
      )}
      
      <EmployeeTable>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Loading employees...
          </div>
        ) : filteredEmployees.length > 0 ? (
          <table className="responsive-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('firstName')}>
                  Name {getSortIcon('firstName')}
                </th>
                <th onClick={() => requestSort('position')}>
                  Position {getSortIcon('position')}
                </th>
                <th className="mobile-hide" onClick={() => requestSort('department')}>
                  Department {getSortIcon('department')}
                </th>
                <th className="mobile-hide" onClick={() => requestSort('email')}>
                  Email {getSortIcon('email')}
                </th>
                <th className="mobile-hide" onClick={() => requestSort('salary')}>
                  Salary {getSortIcon('salary')}
                </th>
                <th onClick={() => requestSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(employee => (
                <tr key={employee._id || employee.id}>
                  <td data-label="Name">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td data-label="Position">{employee.position}</td>
                  <td className="mobile-hide" data-label="Department">{employee.department}</td>
                  <td className="mobile-hide" data-label="Email">{employee.email}</td>
                  <td className="mobile-hide" data-label="Salary">${employee.salary.toLocaleString()}</td>
                  <td data-label="Status">
                    <span className={`status ${employee.status.toLowerCase().replace(' ', '-')}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="action-cell" data-label="Actions">
                    <ActionButtons>
                      <Link
                        to={`/employees/edit/${employee._id || employee.id}`}
                        className="edit-btn"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick(employee._id || employee.id, `${employee.firstName} ${employee.lastName}`)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </ActionButtons>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState>
            <h3>No employees found</h3>
            <p>
              {searchTerm || activeFilters.length > 0
                ? `No results found with the current filters. Try different search terms or filters.`
                : "You haven't added any employees yet."}
            </p>
            {!searchTerm && activeFilters.length === 0 && (
              <AddButton to="/employees/add">
                <FaPlus /> Add Your First Employee
              </AddButton>
            )}
          </EmptyState>
        )}
      </EmployeeTable>
      
      {confirmDialog.isOpen && (
        <ConfirmDialog
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="dialog-content"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete {confirmDialog.employeeName}? This action cannot be undone.
            </p>
            <div className="dialog-actions">
              <button className="cancel" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="confirm" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </motion.div>
        </ConfirmDialog>
      )}
    </EmployeeListContainer>
  );
};

export default EmployeeList; 