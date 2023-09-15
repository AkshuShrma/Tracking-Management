import { createAction, props } from '@ngrx/store';

export const invokeSaveNewLoginAPI = createAction(
  '[Login API] Inovke login api',
  props<{ newLogin: any }>()
);

export const saveNewLoginAPISucess = createAction(
  '[Login API] login api success',
  props<{ newLogin: any; logout: boolean }>()
);

export const Logout = createAction(
  '[Logout] Logout success',
  props<{ data: { result: any; logout: boolean } }>()
);
