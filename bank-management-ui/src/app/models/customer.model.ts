export interface Customer {
  id: number;
  snnId: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  dateOfBirth: string;
  bankAccountNo: string;
  aadharNo: string;
  panNo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRequest {
  snnId: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  dateOfBirth: string;
  bankAccountNo: string;
  aadharNo: string;
  panNo: string;
}
