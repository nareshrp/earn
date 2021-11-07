import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppnotificationlistComponent } from './appnotificationlist.component';

describe('AppnotificationlistComponent', () => {
  let component: AppnotificationlistComponent;
  let fixture: ComponentFixture<AppnotificationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppnotificationlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppnotificationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
