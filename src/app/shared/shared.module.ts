import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../common/material/material.module';
import { ResizableDirective } from './resizable.directive';
import { AvatarComponent } from './avatar/avatar.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    ResizableDirective,
    AvatarComponent
  ],
  declarations: [
    ResizableDirective,
    AvatarComponent
  ]
})
export class SharedModule { }
