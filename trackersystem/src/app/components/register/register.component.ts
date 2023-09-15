import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  currentUser: any;
 

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _login: LoginService,
    private route: Router
  ) {}

  ngOnInit(): void {
   
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  Register() {
    if (this.registerForm.valid) {
      this._login.login(this.registerForm.value).subscribe({
        next: (result) => {
          alert(result.data);
          this.currentUser = result;
          localStorage.setItem('currentUser', JSON.stringify(result));
          this.route.navigate(['login']);
          this.registerForm.reset();
          //this._login.logoutUser = false;
        },
        error: (err) => {
          alert(err?.error.data);
        },
      });
    } else {
      this.registerForm.markAsDirty();
      this.Validate(this.registerForm);
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
