import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducer } from './shared/store/app.reducer';
import { AddbooksComponent } from './components/addbooks/addbooks.component';
import { LoginEffect } from './books/store/effects/login.effect';
import { loginReducer } from './books/store/reducers/login.reducer';
import { EditbooksComponent } from './components/editbooks/editbooks.component';
import { InvitationComponent } from './components/invitation/invitation.component';
import { JwtinterceptorService } from './jwtinterceptor.service';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { InvitationersComponent } from './components/invitationers/invitationers.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AddbooksComponent,
    EditbooksComponent,
    InvitationComponent,
    ConfirmationComponent,
    InvitationersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    EffectsModule.forRoot({}),
    EffectsModule.forFeature(LoginEffect),
    StoreModule.forFeature('mylogins', loginReducer),
    StoreModule.forRoot({ appState: appReducer }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtinterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
