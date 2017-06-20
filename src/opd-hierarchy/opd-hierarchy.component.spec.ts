import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OPDHierarchyComponent } from './opd-hierarchy.component';

describe('OPDHierarchyComponent', () => {
  let component: OPDHierarchyComponent;
  let fixture: ComponentFixture<OPDHierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OPDHierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OPDHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
