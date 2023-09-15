import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { AddbooksComponent } from '../components/addbooks/addbooks.component';
import { EditbooksComponent } from '../components/editbooks/editbooks.component';
import { InvitationComponent } from '../components/invitation/invitation.component';
import { ConfirmationComponent } from '../components/confirmation/confirmation.component';
import { InvitationersComponent } from '../components/invitationers/invitationers.component';
import { AuthGuardService } from '../components/auth-guard.service';

const routes: Routes = [
  {
    path:'invitationers',
    component:InvitationersComponent,canActivate:[AuthGuardService]
  },
  {
    path:'confirmation/:reciverId/:status',
    component:ConfirmationComponent,
  },
  {
    path: 'invitation',
    component: InvitationComponent,canActivate:[AuthGuardService]
  },
  {
    path: '',
    component: HomeComponent,canActivate:[AuthGuardService]
  },
  {
    path: 'edit/:bookId',
    component: EditbooksComponent,
  },
  {
    path: 'add',
    component: AddbooksComponent,
  },
  {
    path: 'home',
    component: HomeComponent,canActivate:[AuthGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule { }
