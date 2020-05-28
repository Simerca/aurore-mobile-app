import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaiementSuccessPage } from './paiement-success.page';

describe('PaiementSuccessPage', () => {
  let component: PaiementSuccessPage;
  let fixture: ComponentFixture<PaiementSuccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaiementSuccessPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaiementSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
