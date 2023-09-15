import { Location } from '@angular/common';
import { compileNgModule } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { invokeUpdateBookAPI } from 'src/app/books/store/actions/books.actions';
import { selectBookById } from 'src/app/books/store/selectors/books.selector';
import { setAPIStatus } from 'src/app/shared/store/app.action';
import { selectAppState } from 'src/app/shared/store/app.selector';
import { Appstate } from 'src/app/shared/store/appstate';

@Component({
  selector: 'app-editbooks',
  templateUrl: './editbooks.component.html',
  styleUrls: ['./editbooks.component.scss'],
})
export class EditbooksComponent implements OnInit {

  id:any
  constructor(
    private locationService:Location,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private appStore: Store<Appstate>
  ) {}

  bookForm: any = {
    bookId: 0,
    author: '',
    name: '',
    cost: 0,
    UserId:''
  };

  // this.id = this.router.snapshot.paramMap.get('id');
  // this.id = Number.parseInt(this.id.toString().replace(':',''));
  // console.log(this.id);
  // let fetchData$ =  this.store.pipe(select(selectShippingById(this.id)));
  // fetchData$.subscribe((data) => {
  //   if (data) {
  //     this.shipppingUpdatePost = {...data[0]};
  //     console.log(this.shipppingUpdatePost);
  //   } 
  // });

  ngOnInit(): void {
    debugger
    let fetchData$ = this.route.paramMap.pipe(
      switchMap((params) => {
        var bookId = Number(params.get('bookId'));
        return this.store.pipe(select(selectBookById(bookId)));
      })
    );
    fetchData$.subscribe((data) => {
      debugger
      if (data) {
        this.bookForm = { ...data };
      } else {
      //  this.router.navigate(['/']);
      }
    });
  }

  ssssss() {
    debugger
    this.store.dispatch(
      invokeUpdateBookAPI({ updateBook: { ...this.bookForm } })
    );
    let apiStatus$ = this.appStore.pipe(select(selectAppState));
    apiStatus$.subscribe((apState) => {
      if (apState.apiStatus == 'success') {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
        this.locationService.back();
        //this.router.navigate(['home']);
      }
    });
  }

  cancel(){
    this.locationService.back();
  }
}
