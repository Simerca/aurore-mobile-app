import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DelivmanPage } from './delivman.page';

describe('DelivmanPage', () => {
  let component: DelivmanPage;
  let fixture: ComponentFixture<DelivmanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelivmanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DelivmanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
