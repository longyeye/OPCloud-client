import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthActionTypes, UserService } from '../../../../services/user.service';

@Component({
  selector: 'opc-sign-in',
  templateUrl: 'sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  user = {
    displayName: '',
    email: '',
    password: '',
    repeatPassword: ''
  };
  signUp = false;
  authError: string = null;

  constructor(
    public dialogRef: MdDialogRef<SignInComponent>,
    iconRegistry: MdIconRegistry,
    sanitizer: DomSanitizer,
    private userService: UserService) {
    iconRegistry.addSvgIcon(
      'google',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/auth/google.svg'));
  }

  ngOnInit() {
  }

  signInWithGoogle() {
    this.authError = null;
    return this.userService.authAction(AuthActionTypes.login, { provider: 'google' })
      .then((res) => this.dialogRef.close())
      .catch((err) => {
        // ignore auth errors with auth providers
        return this.dialogRef.close();
      });
  }

  signInWithPassword() {
    this.authError = null;
    return this.userService.authAction(
      this.signUp ? AuthActionTypes.signup : AuthActionTypes.login,
      { user: this.user })
      .then((res) => this.dialogRef.close())
      .catch(err => this.authError = err.message);
  }
}
