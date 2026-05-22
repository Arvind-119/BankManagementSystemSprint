import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankAccount, AccountRequest, DepositWithdraw, Transfer } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:8083/api/v1/accounts';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.apiUrl);
  }

  getById(id: number): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.apiUrl}/${id}`);
  }

  getByAccountNo(accountNo: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.apiUrl}/${accountNo}`);
  }

  create(account: AccountRequest): Observable<BankAccount> {
    return this.http.post<BankAccount>(this.apiUrl, account);
  }

  update(id: number, account: AccountRequest): Observable<BankAccount> {
    return this.http.put<BankAccount>(`${this.apiUrl}/${id}`, account);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deposit(accountNo: string, data: DepositWithdraw): Observable<BankAccount> {
    return this.http.put<BankAccount>(`${this.apiUrl}/${accountNo}/deposit`, data);
  }

  withdraw(accountNo: string, data: DepositWithdraw): Observable<BankAccount> {
    return this.http.put<BankAccount>(`${this.apiUrl}/${accountNo}/withdraw`, data);
  }

  transfer(data: Transfer): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/transfer`, data);
  }

  getBalance(accountNo: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${accountNo}/balance`);
  }

  getByCustomer(customerId: number): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(`${this.apiUrl}/customer/${customerId}`);
  }
}
