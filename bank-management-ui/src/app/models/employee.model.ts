export interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  dateOfBirth: string;
  department: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeRequest {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  dateOfBirth: string;
  department: string;
  address: string;
}
