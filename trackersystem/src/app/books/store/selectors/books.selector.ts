import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectBooks = createFeatureSelector<any>('mybooks');

export const selectBookById = (bookId: number) =>
  createSelector(selectBooks, (books: any) => {
    var bookbyId = books.filter((data:any) => data.bookId == bookId);
    if (bookbyId.length == 0) {
      return null;
    }
    return bookbyId[0];
  });

  export const senderId = createFeatureSelector<any>('senderInvitaionerId');