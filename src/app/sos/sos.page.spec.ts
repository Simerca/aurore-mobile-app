import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SosPage } from './sos.page';

describe('SosPage', () => {
  let component: SosPage;
  let fixture: ComponentFixture<SosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
