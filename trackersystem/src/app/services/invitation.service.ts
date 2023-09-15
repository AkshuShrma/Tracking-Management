import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  
  private subjectName = new Subject<any>(); //need to create a subject

  constructor(private http: HttpClient) {}

  sendUpdate(message: string) { //the component that wants to update something, calls this fn
    this.subjectName.next({ text: message }); //next() will feed the value in Subject
}

getUpdate(): Observable<any> { //the receiver component calls this function 
    return this.subjectName.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
}

  getAll(): Observable<any> {
    return this.http.get<any>(`http://localhost:5053/minimalAPI/getAll`);
  }

  invite(username: any): Observable<any> {
    return this.http.get<any>(
      `http://localhost:5053/minimalAPI/invitation/${username}`
    );
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(
      'http://localhost:5053/minimalAPI/createinvitation',
      data
    );
  }

  status(reciverId: any, status: any): Observable<any> {
    return this.http.get<any>(
      `http://localhost:5053/minimalAPI/status/${reciverId}/${status}`
    );
  }

  action(reciverId: any, action: any): Observable<any> {
    return this.http.get<any>(
      `http://localhost:5053/minimalAPI/action/${reciverId}/${action}`
    );
  }

  InvitationComesFrom(): Observable<any> {
    return this.http.get(
      `http://localhost:5053/minimalAPI/invitationcomesfrom`
    );
  }
}
