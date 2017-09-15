import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { MainComponent } from './layout/main/main.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule
  ],
  declarations: [],
  exports: [
    MainComponent
  ]
})
export class CoreModule { }
