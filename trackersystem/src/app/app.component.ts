import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectLogins } from './books/store/selectors/login.selector';
import {
  Logout,
  saveNewLoginAPISucess,
} from './books/store/actions/login.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  logginUser:any
  CurrentUser:any
  
  constructor(private store: Store,private router:Router) {}
  login$ = this.store.pipe(select(selectLogins));
  ngOnInit(): void {
    this.login$.subscribe((data) => {
      if (data.data == null) {
        let localData = localStorage.getItem('currentUser');
        if (localData != null) {
          this.store.dispatch( 
            saveNewLoginAPISucess({
              newLogin: JSON.parse(localData),
              logout: false,
            })
          );
        }
      }
    });
    this.CurrentUser = localStorage.getItem('currentUser');
    if(this.CurrentUser){
     this.logginUser= JSON.parse(this.CurrentUser)
    }
  }
  
  LogoutClick() {
    // here we will clear the local storage..
    localStorage.clear();
    this.store.dispatch(Logout({ data: { result: null, logout: true } }));
    this.router.navigate(['login']);

  }
}
