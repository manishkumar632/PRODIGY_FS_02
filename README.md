# Employee Management System

A full-stack MERN application for managing employees, company news, and internal communications.

## Features

- **Authentication & Authorization**

  - Secure login and signup system
  - Role-based access control (Admin and Employee roles)
  - Protected routes and API endpoints

- **Admin Features**

  - Complete employee management (CRUD operations)
  - Company news publication and management
  - Message management system to handle employee queries
  - Dashboard with overview statistics
  - Employee data visualization

- **Employee Features**
  - Personal dashboard access
  - Company news access
  - Direct messaging system to contact admin
  - Profile management

## Tech Stack

- **Frontend**

  - React.js with React Router for routing
  - Context API for state management
  - React Toastify for notifications
  - Responsive design for all devices

- **Backend**
  - Node.js and Express.js
  - MongoDB for database
  - JWT for authentication
  - RESTful API architecture

## Getting Started

1. Clone the repository

```bash
git clone <repository-url>
cd employee
```

2. Install dependencies

```bash
npm run install-all
```

3. Set up environment variables
   Create `.env` file in the root directory:

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Run the application

```bash
# Run both frontend and backend
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client
```

## Screenshots and Features

# Employee Management System Login Page

![Employee Management System](https://github.com/manishkumar632/prodigy/blob/main/employee_management_system/images/Screenshot1.png)

# Employee Management System Sign Up Page

![Employee Management System](https://github.com/manishkumar632/prodigy/blob/main/employee_management_system/images/Screenshot2.png)

# Employee Management System Home Page.

![Employee Management System](https://github.com/manishkumar632/prodigy/blob/main/employee_management_system/images/Screenshot3.png)

# Employee Management System Admin Dashboard

![Employee Management System](https://github.com/manishkumar632/prodigy/blob/main/employee_management_system/images/Screenshot4.png)

# Employee Management Page

Here Admin can perform CRUD operation on employee data.
<br /> <br />

![Employee Management System](https://github.com/manishkumar632/prodigy/blob/main/employee_management_system/images/Screenshot5.png)

# Add New Employee Page

![Employee Management System](https://github.com/manishkumar632/prodigy/blob/main/employee_management_system/images/Screenshot6.png)

# Company Related News Management Page

Here admin can create news related to company.
<br /> <br />

![Employee Management System](https://github.com/manishkumar632/prodigy/blob/main/employee_management_system/images/Screenshot7.png)

# Employee Message Management Page

Here admin can manage the employee query and help them.
<br /> <br />

![Employee Management System](https://github.com/manishkumar632/prodigy/blob/main/employee_management_system/images/Screenshot8.png)
