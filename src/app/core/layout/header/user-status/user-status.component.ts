import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MdDialog } from '@angular/material';
import { SignInComponent } from '../sign-in/sign-in.component';
import { AuthActionTypes, UserService } from '../../../../services/user.service';

@Component({
  selector: 'opc-user-status',
  template: `
    <div class="user-info">

      <md-spinner *ngIf="pending$ | async; else notPending"
                  color="accent"
                  class="header-spinner"></md-spinner>

      <ng-template #notPending>

        <div *ngIf="user$ | async; else signInButton"
             class="signed-in-user-container"
             [mdMenuTriggerFor]="menuPerson">

          <button md-button class="usernamelink">
            <opc-avatar [photoUrl]="(user$ | async)?.photoURL"
                        [color]="(user$ | async)?.avatarColor"></opc-avatar>
            <div class="username">{{ (user$ | async)?.displayName }}</div>
          </button>

          <md-menu #menuPerson="mdMenu" xPosition="before">
            <button md-menu-item (click)="signOut($event)">
              <md-icon>exit_to_app</md-icon>
              <span>Sign Out</span>
            </button>
          </md-menu>

        </div>

        <ng-template #signInButton>
          <a md-button (click)="signIn()">
            <md-icon>account_circle</md-icon>
            <span>Sign in</span>
          </a>
        </ng-template>
      </ng-template>
    </div>
  `,
  styleUrls: ['./user-status.component.scss']
})
export class UserStatusComponent implements OnInit {
  pending$;
  user$;

  constructor(
    private userService: UserService,
    public dialog: MdDialog,
    private viewContainer: ViewContainerRef) {
  }

  ngOnInit() {
    this.pending$ = this.userService.authPending$;
    this.user$ = this.userService.user$;
  }

  signOut() {
    this.userService.authAction(AuthActionTypes.logout);
  }

  signIn() {
    this.dialog.open(SignInComponent, {
      viewContainerRef: this.viewContainer,
    });
  }
}
