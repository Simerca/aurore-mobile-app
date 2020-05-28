import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MangopayPage } from './mangopay.page';

describe('MangopayPage', () => {
  let component: MangopayPage;
  let fixture: ComponentFixture<MangopayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MangopayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MangopayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
