import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { normalShipping } from 'src/app/books/store/actions/books.actions';
import { InvitationService } from 'src/app/services/invitation.service';


@Component({
  selector: 'app-invitationers',
  templateUrl: './invitationers.component.html',
  styleUrls: ['./invitationers.component.scss'],
})
export class InvitationersComponent implements OnInit {

  showTable:boolean=false;
  invitations: any;
  invitationsId:string="";
  constructor(private invite: InvitationService,private store:Store) {  }

  ngOnInit(): void {
    this.DisplayUsers();
  }

  DisplayUsers() {
    this.invite.InvitationComesFrom().subscribe({
      next: (data) => {
        // console.log(data,"check")
        this.invitations = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ngOnDestroy(): void {
  //   this.store.dispatch(normalShipping({newState:[]}));
  // }

  showTableClick(invitationId:any){
   this.showTable=false;
   if(this.invitationsId==invitationId){
    this.showTable=true;
    return;
   }
   setTimeout(()=>{
    this.invitationsId=invitationId;
    this.showTable=false;
   },50)
  }
}
