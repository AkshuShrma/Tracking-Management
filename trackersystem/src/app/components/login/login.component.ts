import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { invokeSaveNewLoginAPI } from 'src/app/books/store/actions/login.actions';
import { Book } from 'src/app/models/book';
import { LoginService } from 'src/app/services/login.service';
import { setAPIStatus } from 'src/app/shared/store/app.action';
import { selectAppState } from 'src/app/shared/store/app.selector';
import { Appstate } from 'src/app/shared/store/appstate';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  apiStatus$:Observable<any>
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  currentUser: any;

  loginForm!: FormGroup;

  constructor(
    private store: Store,
    private appStore: Store<Appstate>,
    private fb: FormBuilder,
    private _login: LoginService,
    private route: Router
  ) {
    this.apiStatus$=new Observable;  
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  Login() {
    //console.log(this.loginForm.value)
    if (this.loginForm.valid) {
    this.store.dispatch(invokeSaveNewLoginAPI({newLogin:this.loginForm.value}));
    this.apiStatus$ = this.appStore.pipe(select(selectAppState));
    this.apiStatus$.subscribe((apState) => {
      if (apState.apiStatus == 'success') {
        alert(apState.apiResponseMessage)
         this.route.navigate(['home']);
      }
    });
  }else {
       this.loginForm.markAsDirty();
       this.Validate(this.loginForm);
       alert('Form is not valid');
    }
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  private Validate(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.Validate(control);
      }
    });
  }
}
