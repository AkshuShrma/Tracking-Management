import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtinterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //console.log("Intercept method called from JWTInterceptor..");  
    // add authorization header with jwt token if available  
    let currentUser = { token: '' };
    var getCurrentUser = localStorage.getItem('currentUser');

    if (getCurrentUser != null) {
      currentUser.token = JSON.parse(getCurrentUser).token;
      //console.log(currentUser.token)        
    }
    request = request.clone({
      setHeaders: {
        Authorization: "Bearer " + currentUser.token,
      }
    });
    return next.handle(request);
  }
}
