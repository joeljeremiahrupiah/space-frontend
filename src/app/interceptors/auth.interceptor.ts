import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';


const TOKEN_HEADER_KEY = 'Authorization';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const authToken = authService.getToken();

  let authReq = req;
  if (authToken != null && !req.url.includes('/api/auth/')) {
    authReq = req.clone({
      headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + authToken)
    });
  } else {
  }
  return next(authReq);

};
