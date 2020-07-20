import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoLoginComponent } from './logo-login.component';

describe('LogoLoginComponent', () => {
  let component: LogoLoginComponent;
  let fixture: ComponentFixture<LogoLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
