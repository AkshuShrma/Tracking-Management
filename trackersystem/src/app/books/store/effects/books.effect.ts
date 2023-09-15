import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { BooksService } from 'src/app/services/books.service';
import {
  booksFetchAPISuccess,
  deleteBookAPISuccess,
  getInvitationerShipping,
  invokeBooksAPI,
  invokeDeleteBookAPI,
  invokeSaveNewBookAPI,
  invokeUpdateBookAPI,
  saveNewBookAPISucess,
  updateBookAPISucess,
} from '../actions/books.actions';
import {
  EMPTY,
  exhaustMap,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { selectBooks } from '../selectors/books.selector';
import { Appstate } from 'src/app/shared/store/appstate';
import { setAPIStatus } from 'src/app/shared/store/app.action';
import * as shippingAction from '../actions/books.actions';

@Injectable()
export class BooksEffect {
  constructor(
    private actions$: Actions,
    private booksService: BooksService,
    private store: Store,
    private appStore: Store<Appstate>
  ) {}

  loadAllBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(invokeBooksAPI),
      withLatestFrom(this.store.pipe(select(selectBooks))),
      exhaustMap(([, bookformStore]) => {
        if (bookformStore.length > 0) {
          return EMPTY;
        }
        return this.booksService
          .get()
          .pipe(map((data) => booksFetchAPISuccess({ allBooks: data })));
      })
    )
  );

  getInvitaionerShipping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getInvitationerShipping),
      switchMap((actions) => {
        return this.booksService
          .getInvitationerShipping(actions.UserId)
          .pipe(
            map((datas) =>
              booksFetchAPISuccess({ allBooks: datas })
            )
          );
      })
    )
  );

  saveNewBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeSaveNewBookAPI),
      switchMap((action) => {
        return this.booksService.create(action.newBook).pipe(
          map((data) => {
            this.appStore.dispatch(
              setAPIStatus({
                apiStatus: {
                  apiResponseMessage: data.message,
                  apiStatus: 'success',
                },
              })
            );
            return saveNewBookAPISucess({ newBook: data.data });
          })
        );
      })
    );
  });

  updateBookAPI$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeUpdateBookAPI),
      switchMap((action) => {
        return this.booksService.update(action.updateBook).pipe(
          map((data) => {
            this.appStore.dispatch(
              setAPIStatus({
                apiStatus: {
                  apiResponseMessage: data.message,
                  apiStatus: 'success',
                },
              })
            );
            return updateBookAPISucess({ updateBook: data.data });
          })
        );
      })
    );
  });

  deleteBooksAPI$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeDeleteBookAPI),
      switchMap((actions) => {
        return this.booksService.delete(actions.bookId).pipe(
          map((data) => {
            this.appStore.dispatch(
              setAPIStatus({
                apiStatus: { apiResponseMessage: data, apiStatus: 'success' },
              })
            );
            return deleteBookAPISuccess({ bookId: actions.bookId });
          })
        );
      })
    );
  });
}
