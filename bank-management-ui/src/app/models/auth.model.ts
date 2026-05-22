export interface LoginRequest {
  loginId: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  id: number;
  loginId: string;
  name: string;
  role: string;
  linkedCustomerId: number;
  message: string;
  success: boolean;
  token: string;
}

export interface RegisterRequest {
  ssnId: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  password: string;
  address: string;
  aadharNo?: string;
  panNo?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  customerId: number;
  customerName: string;
  email: string;
  ssnId: string;
  accountNo: string;
}

export interface SessionUser {
  id: number;
  loginId: string;
  name: string;
  role: string;
  linkedCustomerId: number;
  token: string;
}
