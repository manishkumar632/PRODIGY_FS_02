import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { getEmployees } from '../services/employeeService';
import { useAuth } from '../context/AuthContext';
import { FaNewspaper, FaUsers, FaBuilding, FaDollarSign } from 'react-icons/fa';

const DashboardContainer = styled.div`
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  
  .stat-title {
    color: var(--gray-color);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--dark-color);
  }
  
  .stat-description {
    font-size: 0.875rem;
    color: var(--gray-color);
    margin-top: auto;
  }
`;

const RecentEmployeesCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    h2 {
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--light-gray-color);
    }
    
    th {
      font-weight: 600;
      color: var(--gray-color);
      font-size: 0.875rem;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    .employee-name {
      font-weight: 500;
    }
    
    .employee-position {
      color: var(--gray-color);
      font-size: 0.875rem;
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
  
  @media (max-width: 768px) {
    .mobile-hide {
      display: none;
    }
  }
`;

const AdminActionsCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 1.5rem;
  
  .card-header {
    margin-bottom: 1rem;
    
    h2 {
      font-size: 1.25rem;
      font-weight: 600;
    }
  }
  
  .admin-actions {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
`;

const ActionButton = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  .icon {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  
  .label {
    font-weight: 500;
    color: var(--dark-color);
  }
  
  &:hover {
    background-color: var(--primary-color);
    transform: translateY(-5px);
    
    .icon, .label {
      color: white;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--gray-color);
  }
`;

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeDepartments: 0,
    averageSalary: 0
  });
  
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin' || currentUser?.isAdmin === true;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching employees for dashboard...');
        const response = await getEmployees();
        
        if (response.success && Array.isArray(response.data)) {
          console.log('Employees fetched successfully:', response.data.length);
          setEmployees(response.data);
          
          // Calculate stats
          const totalEmployees = response.data.length;
          
          // Get unique departments
          const departments = new Set(response.data.map(emp => emp.department).filter(Boolean));
          
          // Calculate average salary
          const totalSalary = response.data.reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0);
          const avgSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;
          
          setStats({
            totalEmployees,
            activeDepartments: departments.size,
            averageSalary: avgSalary
          });
        } else {
          console.error('Invalid employee data format:', response);
          setEmployees([]);
          setError('Failed to load employee data. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setEmployees([]);
        setError('An error occurred while loading the dashboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Ensure employees is always an array before trying to sort/slice
  const recentEmployees = Array.isArray(employees) 
    ? [...employees]
        .sort((a, b) => new Date(b.hireDate || 0) - new Date(a.hireDate || 0))
        .slice(0, 5)
    : [];
  
  return (
    <DashboardContainer>
      <StatsGrid>
        <StatCard
          whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="stat-title">
            <FaUsers /> Total Employees
          </div>
          <div className="stat-value">{stats.totalEmployees}</div>
          <div className="stat-description">
            All employees currently in the system
          </div>
        </StatCard>
        
        <StatCard
          whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="stat-title">
            <FaBuilding /> Departments
          </div>
          <div className="stat-value">{stats.activeDepartments}</div>
          <div className="stat-description">
            Active departments in the company
          </div>
        </StatCard>
        
        <StatCard
          whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="stat-title">
            <FaDollarSign /> Average Salary
          </div>
          <div className="stat-value">${stats.averageSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div className="stat-description">
            Average annual salary of employees
          </div>
        </StatCard>
      </StatsGrid>
      
      {isAdmin && (
        <AdminActionsCard>
          <div className="card-header">
            <h2>Admin Actions</h2>
          </div>
          <div className="admin-actions">
            <ActionButton to="/employees/add">
              <FaUsers className="icon" />
              <span className="label">Add Employee</span>
            </ActionButton>
            <ActionButton to="/news-management">
              <FaNewspaper className="icon" />
              <span className="label">Manage News</span>
            </ActionButton>
          </div>
        </AdminActionsCard>
      )}
      
      <RecentEmployeesCard>
        <div className="card-header">
          <h2>Recent Employees</h2>
          <Link to="/employees">View All</Link>
        </div>
        
        {loading ? (
          <p>Loading employee data...</p>
        ) : error ? (
          <EmptyState>
            <h3>Error Loading Data</h3>
            <p>{error}</p>
          </EmptyState>
        ) : recentEmployees.length === 0 ? (
          <EmptyState>
            <h3>No Employees Found</h3>
            <p>There are no employees in the system yet.</p>
          </EmptyState>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th className="mobile-hide">Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEmployees.map(employee => (
                <tr key={employee.id || employee._id}>
                  <td>
                    <div className="employee-name">
                      {employee.firstName} {employee.lastName}
                    </div>
                    <div className="employee-position mobile-hide">
                      {employee.email}
                    </div>
                  </td>
                  <td>{employee.position}</td>
                  <td className="mobile-hide">{employee.department}</td>
                  <td>
                    <span className={`status ${(employee.status || 'Active').toLowerCase().replace(' ', '-')}`}>
                      {employee.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </RecentEmployeesCard>
    </DashboardContainer>
  );
};

export default Dashboard; 