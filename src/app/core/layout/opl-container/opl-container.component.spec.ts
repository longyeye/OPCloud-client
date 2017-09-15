import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OplContainerComponent } from './opl-container.component';

describe('OplContainerComponent', () => {
  let component: OplContainerComponent;
  let fixture: ComponentFixture<OplContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OplContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OplContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
