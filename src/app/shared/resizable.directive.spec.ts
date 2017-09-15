import { ResizableDirective } from './resizable.directive';
import { ElementRef } from '@angular/core';

describe('ResizableDirective', () => {
  it('should create an instance', () => {
    const directive = new ResizableDirective(new ElementRef('<div></div>'));
    expect(directive).toBeTruthy();
  });
});
