import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';

import * as firebase from 'firebase/app';
import 'rxjs/add/operator/map';

const availableProviders = environment.firebaseAuthProviders;

const authProviders = {
  google: firebase.auth.GoogleAuthProvider
};

export enum AuthActionTypes {
  login,
  logout,
  signup
}

export interface AuthActionPayload {
  provider?: string;
  user?: {
    email: string,
    password: string
  };
}

@Injectable()
export class UserService {
  authPending$ = new BehaviorSubject(true);
  authError$ = new BehaviorSubject(null);

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((user) => {
      // this deals with successful authAction, no need to set pending to false again.
      this.authPending$.next(false);
    });
  }

  get authState$() {
    return this.afAuth.authState;
  }

  get user$() {
    return this.authState$.map(authState => {
      // TODO: get user details from DB
      return authState ? (authState.providerData ? authState.providerData[0] : authState) : null;
    });
  }

  authAction(type: AuthActionTypes, payload?: AuthActionPayload) {
    this.authPending$.next(true);
    this.authError$.next(null);
    return this.chooseAuthAction(type, payload)
      .catch(err => {
        console.error(err);
        this.authPending$.next(false);
        this.authError$.next(err);
        throw (err);
      });
  }

  private chooseAuthAction(type: AuthActionTypes, payload?: AuthActionPayload) {
    switch (type) {
      case AuthActionTypes.login: {
        return payload.provider ? this.signInWithProvider(payload.provider) : this.signInWithPassword(payload.user);
      }
      case AuthActionTypes.signup: {
        return this.signUp(payload.user);
      }
      case AuthActionTypes.logout: {
        return this.signOut();
      }
    }
  }

  private signInWithProvider(provider) {
    if (!availableProviders.includes(provider)) {
      throw (new Error(`Auth provider is not supported: ${provider}`));
    }
    return this.afAuth.auth.signInWithPopup(new authProviders[provider]());
  }

  private signInWithPassword(user) {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  private signUp(user) {
    this.authPending$.next(true);
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  private signOut() {
    return this.afAuth.auth.signOut();
  }
}
