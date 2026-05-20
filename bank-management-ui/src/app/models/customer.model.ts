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
  contact: string;
  address: string;
  gender: string;
  maritalStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRequest {
  snnId: string;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  dateOfBirth?: string;
  bankAccountNo?: string;
  aadharNo?: string;
  panNo?: string;
  contact?: string;
  address?: string;
  gender?: string;
  maritalStatus?: string;
}
