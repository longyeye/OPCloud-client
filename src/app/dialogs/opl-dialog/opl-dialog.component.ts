import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  selector: 'opcloud-opl-dialog',
  template: `
    <p [innerHTML]="link.attributes.opl">

    </p>
  `,
  styleUrls: ['./opl-dialog.component.css']
})
export class OplDialogComponent implements OnInit {

  public link;

  constructor(
    @Inject(MD_DIALOG_DATA) private data: any,
    public dialogRef: MdDialogRef<OplDialogComponent>) {
    this.link = data.link;
  }

  ngOnInit() {
  }

}
