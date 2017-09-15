import { ViewContainerRef } from '@angular/core';
import { isNull, isUndefined } from 'util';

const PADDING = 24;

/**
 * Makes an Angular Material dialog movable by dragging!
 *
 * usage:
 *
 * 1. bind host to methods:
 * @Component({
 *   ...
 *    host: {
 *   '(mousedown)': 'down()',
 *   '(mouseup)': 'up()',
 *   '(mousemove)': 'move($event)'
 *   }
 * }
 *
 * 2. extend the component with this class:
 * export class SomeComponent extends MovableDialogComponent { ...
 *
 * 3. inject ViewContainerRef and MdDialogRef and pass them to super():
 * constructor(
 *   viewContainerRef: ViewContainerRef, // from '@angular/core'
 *   dialogRef: MdDialogRef<SomeComponent> // from from '@angular/material'
 *   ...) {
 *   super(viewContainerRef, dialogRef);
 * }
 *
 * If the MdDialog padding is not 24px, pass the padding as a third argument in super().
 *
 * TODO: fix quick movement
 */
export class MovableDialogComponent {
  private dragging: boolean;
  private position: { top: number; left: number };
  private padding: number;

  constructor(
    public viewContainer: ViewContainerRef,
    public dialogRef,
    padding?: number) {
    this.padding = (isNull(padding) || isUndefined(padding)) ? PADDING : padding;
  }

  down() {
    this.dragging = true;
    this.position = {
      top: this.viewContainer.element.nativeElement.offsetTop - this.padding,
      left: this.viewContainer.element.nativeElement.offsetLeft - this.padding
    };
  }

  up() {
    this.dragging = false;
  }

  move(e) {
    if (!this.dragging) {
      return;
    }

    this.position = {
      top: this.position.top + e.movementY,
      left: this.position.left + e.movementX
    };
    this.dialogRef.updatePosition({
      top: this.position.top + 'px',
      left: this.position.left + 'px',
    });
  }

}
