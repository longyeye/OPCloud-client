import { AfterContentInit, Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

enum Resizable {
  horizontal,
  vertical,
  both
}

interface Size {
  readonly height: number;
  readonly width: number;
}

@Directive({
  selector: '[opcResizable]'
})
export class ResizableDirective implements AfterContentInit {

  @Input('opcResizable') resizeable: Resizable;
  @Output('opcResize') resizeChange: EventEmitter<Size> = new EventEmitter();
  size: Size;

  @HostListener('mouseup', ['$event'])
  onMouseUp($event) {
    const newSize = this.getSize();

    if (newSize.width !== this.size.width || newSize.height !== this.size.height) {
      this.size = newSize;
      this.resizeChange.emit(this.size);
    }
  }

  constructor(private el: ElementRef) {
  }

  ngAfterContentInit(): void {
    this.el.nativeElement.style.resize = this.resizeable;
    this.size = this.getSize();
  }

  getSize() {
    return {
      height: this.el.nativeElement.offsetHeight,
      width: this.el.nativeElement.offsetWidth
    };
  }

}
