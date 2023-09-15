import { Location } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getInvitationerShipping, invokeBooksAPI, invokeDeleteBookAPI, normalShipping, sendSenderId } from 'src/app/books/store/actions/books.actions';
import { selectBooks } from 'src/app/books/store/selectors/books.selector';
import { BooksService } from 'src/app/services/books.service';
import { InvitationService } from 'src/app/services/invitation.service';
import { selectAppState } from 'src/app/shared/store/app.selector';
import { Appstate } from 'src/app/shared/store/appstate';

declare var window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnChanges {

  @Input() invitaionerPersonId: string = "";

  books$: Observable<any>

  userId:any
  bookId:any
  trackingUser : any;

  constructor(
    private location:Location,
    private bookService: BooksService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private appStore: Store<Appstate>) {
    this.books$ = this.store.pipe(select(selectBooks))
  }

  bookForm: any = {
    bookId: 0,
    author: '',
    name: '',
    cost: 0,
    UserId: ''
  };

  //books$ = this.store.pipe(select(selectBooks));

  tracking:any
  idToTrack:any

  deleteModal: any;
  idToDelete: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.invitaionerPersonId != '') {
      this.store.dispatch(
        getInvitationerShipping({
          UserId: this.invitaionerPersonId,
        })
      );
    }
    else {
      this.store.dispatch(invokeBooksAPI());
    }

  }
  ngOnInit(): void {
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteModal')
    );
    this.tracking = new window.bootstrap.Modal(document.getElementById('tracking'))

    this.store.dispatch(invokeBooksAPI());
    //this.openTrackingModal(this.userId,this.bookId);
  }

  // ngOnDestroy(): void {
  //   this.store.dispatch(invokeBooksAPI());
  // }

  openDeleteModal(id: number) {
    this.idToDelete = id;
    this.deleteModal.show();
  }

  openTrackingModal(userId: any, bookId: any) {
    this.idToTrack = bookId;
    this.tracking.show();
    this.bookService.getTracking(userId, bookId).subscribe({
      next: (data) => {
        //console.log(data);
        this.trackingUser = data;
      }
    })
  }

  delete() {
    this.store.dispatch(
      invokeDeleteBookAPI({
        bookId: this.idToDelete,}));
    let apiStatus$ = this.appStore.pipe(select(selectAppState));
    apiStatus$.subscribe((apState) => {
      if (apState.apiStatus == 'success') {
        this.deleteModal.hide();
        this.router.navigate(['home']);
      }
    });
  }

  addTable() {
    this.store.dispatch(sendSenderId({ UserId: this.invitaionerPersonId }));
  }

  deleteClick(bookId: any) {
    this.store.dispatch(invokeDeleteBookAPI({ bookId }));
  }

}
