import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinSettingsComponent } from './coin-settings.component';

describe('CoinSettingsComponent', () => {
  let component: CoinSettingsComponent;
  let fixture: ComponentFixture<CoinSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
