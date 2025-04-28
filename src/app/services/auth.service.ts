import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

interface LoginRequest {
  username?: string;
  password?: string;
}

interface RegisterRequest {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

const API_URL = 'http://localhost:8081/api/auth';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    return !!window.sessionStorage.getItem(TOKEN_KEY);
  }

  getCurrentUser(): JwtResponse | null {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      try {
        return JSON.parse(user) as JwtResponse;
      } catch (e) {
        this.logout();
        return null;
      }
    }
    return null;
  }

  register(userInfo: RegisterRequest): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text' as 'json'
    };
    return this.http.post(API_URL + '/register', userInfo, httpOptions).pipe(
      tap(response => {
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  login(credentials: LoginRequest): Observable<JwtResponse> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<JwtResponse>(API_URL + '/login', credentials, httpOptions)
      .pipe(
        tap(response => {
          this.saveToken(response.token);
          this.saveUser(response);
          this.loggedIn.next(true);
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(USER_KEY);
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }


  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: JwtResponse): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

}
