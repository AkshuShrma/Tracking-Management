import { createAction, props } from '@ngrx/store';

export enum BooksStatus {
  NORMAL_BOOK = 'initial book ',
  INVITATIONER_BOOK = 'invitaioner book',
  INVITATIONER_SENDER_ID = 'invitation sender Id',
}

export const normalShipping = createAction(
  BooksStatus.NORMAL_BOOK,
  props<{ newState: [] }>()
);
export const getInvitationerShipping = createAction(
  BooksStatus.INVITATIONER_BOOK,
  props<{ UserId: any }>()
);
export const sendSenderId = createAction(
  BooksStatus.INVITATIONER_SENDER_ID,
  props<{ UserId: any }>()
);

export const invokeBooksAPI = createAction(
  '[Books API] Invoke Books Fetch API'
);

export const booksFetchAPISuccess = createAction(
  '[Books API] Fetch API Success',
  props<{ allBooks: [] }>()
);

export const invokeSaveNewBookAPI = createAction(
  '[Books API] Inovke save new book api',
  props<{ newBook: any }>()
);

export const saveNewBookAPISucess = createAction(
  '[Books API] save new book api success',
  props<{ newBook: any }>()
);

export const invokeDeleteBookAPI = createAction(
  '[Books API] Inovke delete book api',
  props<{ bookId: number }>()
);

export const deleteBookAPISuccess = createAction(
  '[Books API] deleted book api success',
  props<{ bookId: number }>()
);

export const invokeUpdateBookAPI = createAction(
  '[Books API] Inovke update book api',
  props<{ updateBook: any }>()
);

export const updateBookAPISucess = createAction(
  '[Books API] update  book api success',
  props<{ updateBook: any }>()
);
