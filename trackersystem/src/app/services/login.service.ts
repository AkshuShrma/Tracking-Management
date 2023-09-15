import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
 
  constructor(private http:HttpClient) { }
  

  login(data:any):Observable<any>{
    return this.http.post<any>("http://localhost:5053/minimalAPI/login",data);
  }

  register(data:any):Observable<any>{
    return this.http.post<any>("http://localhost:5053/minimalAPI/register",data);
  }

  public get loggedIn(): boolean {  
    return (localStorage.getItem('currentUser') !== null);  
  } 
  
}
