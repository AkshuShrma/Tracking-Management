import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { invokeSaveNewBookAPI, sendSenderId } from 'src/app/books/store/actions/books.actions';
import { setAPIStatus } from 'src/app/shared/store/app.action';
import { selectAppState } from 'src/app/shared/store/app.selector';
import { Appstate } from 'src/app/shared/store/appstate';
import { Location } from '@angular/common';
import { Book } from 'src/app/models/book';
import { senderId } from 'src/app/books/store/selectors/books.selector';
import { applicationSenderId } from 'src/app/books/store/reducers/books.reducer';

@Component({
  selector: 'app-addbooks',
  templateUrl: './addbooks.component.html',
  styleUrls: ['./addbooks.component.scss'],
})
export class AddbooksComponent implements OnInit {
  
  // ngOnDestroy(): void {
  //   this.store.dispatch(sendSenderId({ UserId: '' }));
  // }

  bookForm: any = {
    bookId: 0,
    author: '',
    name: '',
    cost: 0,
    UserId: '',
  };

  constructor(
    private store: Store,
    private appStore: Store<Appstate>,
    private router: Router,
    private locationService: Location
  ) {}

  ngOnInit(): void {}

  addTable() {
    this.store.pipe(select(senderId)).subscribe({
      next: (data) => {
        this.bookForm.UserId = data;
      },
    });
    this.store.dispatch(invokeSaveNewBookAPI({ newBook: this.bookForm }));
    let apiStatus$ = this.appStore.pipe(select(selectAppState));
    apiStatus$.subscribe((apState) => {
      if (apState.apiStatus == 'success') {
        // this.router.navigate(['home']);
        this.locationService.back();
      }
    });
  }

  cancel(){
    this.locationService.back();
  }

}
