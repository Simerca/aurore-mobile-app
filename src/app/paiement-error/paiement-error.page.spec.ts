import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaiementErrorPage } from './paiement-error.page';

describe('PaiementErrorPage', () => {
  let component: PaiementErrorPage;
  let fixture: ComponentFixture<PaiementErrorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaiementErrorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaiementErrorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
