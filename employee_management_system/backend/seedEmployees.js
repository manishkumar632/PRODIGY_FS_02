const mongoose = require('mongoose');
const Employee = require('./models/Employee');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected for seeding employees...'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const sampleEmployees = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    position: 'Software Developer',
    department: 'Engineering',
    hireDate: new Date('2020-01-15'),
    salary: 85000,
    status: 'Active'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    position: 'Project Manager',
    department: 'Product',
    hireDate: new Date('2019-05-10'),
    salary: 95000,
    status: 'Active'
  },
  {
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@example.com',
    phone: '555-456-7890',
    position: 'UI/UX Designer',
    department: 'Design',
    hireDate: new Date('2021-03-22'),
    salary: 78000,
    status: 'Active'
  },
  {
    firstName: 'Emily',
    lastName: 'Williams',
    email: 'emily.williams@example.com',
    phone: '555-789-0123',
    position: 'HR Specialist',
    department: 'Human Resources',
    hireDate: new Date('2018-11-05'),
    salary: 72000,
    status: 'Active'
  },
  {
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@example.com',
    phone: '555-234-5678',
    position: 'Marketing Specialist',
    department: 'Marketing',
    hireDate: new Date('2022-01-10'),
    salary: 68000,
    status: 'Active'
  }
];

const seedEmployees = async () => {
  try {
    // Check if employees already exist
    const count = await Employee.countDocuments();
    
    if (count > 0) {
      console.log(`${count} employees already exist in the database`);
      return process.exit(0);
    }
    
    // Insert sample employees
    await Employee.insertMany(sampleEmployees);
    
    console.log(`${sampleEmployees.length} employees added successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding employees:', error);
    process.exit(1);
  }
};

seedEmployees(); 