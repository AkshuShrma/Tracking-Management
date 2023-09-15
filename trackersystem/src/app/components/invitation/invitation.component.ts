import { Component, OnInit } from '@angular/core';
import { Observable, Subject, debounceTime, map, switchMap } from 'rxjs';
import { Invitation } from 'src/app/models/invitation';
import { InvitationService } from 'src/app/services/invitation.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
})
export class InvitationComponent implements OnInit {
  invites: any;
  displayNameIsNot: boolean = true;
  displayName: Invitation;
  displayInvitation: any;
  results$: Observable<any>;
  subject = new Subject();

  constructor(private invite: InvitationService) {
    this.results$ = new Observable();
    this.displayInvitation = {
      display: 'none',
    };
    this.displayName = new Invitation();
  }

  ngOnInit(): void {
    this.DisplayUsers();
    this.results$ = this.subject.pipe(
      debounceTime(2000),
      switchMap((searchText) =>
        this.invite
          .invite(searchText)
          .pipe(
            map((response) =>
              response.length == 0
                ? [{ name: 'no one in db with this name or id' }]
                : response
            )
          )
      )
    );
    this.results$.subscribe({
      next: (data) => {
        console.log(data);
      },
    });
  }

  search(event: any) {
    if (!this.displayNameIsNot) {
      this.displayNameIsNot = true;
    }
    const searchText = event.target.value;
    if (searchText.length == 0) {
      this.displayNameIsNot = false;
      return;
    }
    // emits the `searchText` into the stream. This will cause the operators in its pipe function (defined in the ngOnInit method) to be run. `debounceTime` runs and then `map`. If the time interval of 1 sec in debounceTime hasn’t elapsed, map will not be called, thereby saving the server from being called.
    this.subject.next(searchText);
  }

  mouseover(event: any, userId: any) {
    if (event.target.value == 'no one in db with this name or id') {
      return;
    }
    this.displayName.Id = userId;
    this.displayName.Name = event.target.value;
    this.displayNameIsNot = false;
  }

  showInvitation() {
    if (this.displayInvitation.display == 'none') {
      this.displayInvitation = {
        display: 'block',
      };
    } else {
      this.displayInvitation = {
        display: 'none',
      };
    }
  }

  sendeInvitation() {
    let invitationUser = this.displayName;
    this.invite.create(invitationUser).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateAction(reciverId: any, action: any) {
   // debugger
    //console.log(reciverId,"recId");
    this.invite.action(reciverId, action).subscribe({
      next: (data) => {
        console.log(data);
        this.DisplayUsers();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  DisplayUsers() {
    this.invite.getAll().subscribe({
      next: (data) => {
        //console.log(data);
        this.invites = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
