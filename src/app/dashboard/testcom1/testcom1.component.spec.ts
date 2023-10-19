import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Testcom1Component } from './testcom1.component';

describe('Testcom1Component', () => {
  let component: Testcom1Component;
  let fixture: ComponentFixture<Testcom1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Testcom1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Testcom1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
