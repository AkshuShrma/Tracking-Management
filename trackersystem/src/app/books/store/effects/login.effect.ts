import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {  EMPTY, catchError, map,  switchMap } from 'rxjs';
import { Appstate } from 'src/app/shared/store/appstate';
import { setAPIStatus } from 'src/app/shared/store/app.action';
import { invokeSaveNewLoginAPI, saveNewLoginAPISucess } from '../actions/login.actions';
import { LoginService } from 'src/app/services/login.service';

@Injectable()
export class LoginEffect {
  constructor(
    private actions$: Actions,
    private _login:LoginService,
    private store: Store,
    private appStore: Store<Appstate>
  ) {}

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeSaveNewLoginAPI),
      switchMap((action) => {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
        return this._login.login(action.newLogin).pipe(
          map((data) => {
            const userName=data.userName
            const token=data.userAuthorize.token
            localStorage.setItem("currentUser",JSON.stringify(data.userAuthorize))
            this.appStore.dispatch(
              setAPIStatus({
                apiStatus: { apiResponseMessage: data.data, apiStatus: 'success' },
              })
            );
            return saveNewLoginAPISucess({ newLogin: action.newLogin,logout:false });
          }),
          catchError((error: any) =>{ 
            this.appStore.dispatch(
              setAPIStatus({
                apiStatus: {
                  apiResponseMessage: error.error.data,
                  apiStatus: 'failure',
                },
              }));
              return EMPTY;
          //  return of(LoginActions.LoginFailure(error))
          })
        );
      })
    );
  });
  
}
