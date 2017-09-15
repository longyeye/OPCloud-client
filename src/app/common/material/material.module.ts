import { NgModule } from '@angular/core';
import {
  MdButtonModule, MdDialogModule, MdIconModule, MdInputModule, MdMenuModule, MdProgressSpinnerModule, MdSidenavModule,
  MdSlideToggleModule, MdToolbarModule, MdTooltipModule
} from '@angular/material';

const MaterialModules = [
  MdToolbarModule,
  MdIconModule,
  MdSidenavModule,
  MdButtonModule,
  MdMenuModule,
  MdProgressSpinnerModule,
  MdDialogModule,
  MdSlideToggleModule,
  MdInputModule,
  MdTooltipModule
];

@NgModule({
  imports: MaterialModules,
  exports: MaterialModules,
  declarations: []
})
export class MaterialModule { }
