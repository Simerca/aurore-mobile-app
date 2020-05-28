import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PasswordLostPage } from './password-lost.page';

describe('PasswordLostPage', () => {
  let component: PasswordLostPage;
  let fixture: ComponentFixture<PasswordLostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordLostPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordLostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
