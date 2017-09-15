import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../../shared/shared.module';
import { OplContainerComponent } from './opl-container/opl-container.component';
import { UserStatusComponent } from './header/user-status/user-status.component';
import { RouterModule } from '@angular/router';
import { SignInComponent } from './header/sign-in/sign-in.component';
import { FormsModule } from '@angular/forms';
import { RappidModule } from '../../rappid-components/rappid.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    RappidModule
  ],
  declarations: [
    MainComponent,
    HeaderComponent,
    OplContainerComponent,
    UserStatusComponent,
    SignInComponent
  ],
  exports: [
    MainComponent
  ],
  entryComponents: [
    SignInComponent
  ]
})
export class LayoutModule { }
