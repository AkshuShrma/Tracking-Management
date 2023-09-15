import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor(private http: HttpClient) {}

  getTracking(userId:any,bookId:any){
    return this.http.get<any>(`http://localhost:5053/minimalAPI/getspecificdata/${userId}/${bookId}`)
  }

  getInvitationerShipping(invitaionerId:any){
    return this.http.get<any>(`http://localhost:5053/minimalAPI/getinvitationersdata/${invitaionerId}`)
  }

  get() {
    return this.http.get<any>(`http://localhost:5053/minimalAPI/Books`);
  }

  create(payload: any) {
    debugger
    return this.http.post<any>(
      'http://localhost:5053/minimalAPI/newBooks',
      payload
    );
  }

  update(payload: any) {
    return this.http.put<any>(
      `http://localhost:5053/minimalAPI/updateBooks`,
      payload
    );
  }

  delete(bookId: number) {
    return this.http.delete(
      `http://localhost:5053/minimalAPI/deleteBooks/${bookId}`
    );
  }
}
