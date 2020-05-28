import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapboxPage } from './mapbox.page';

describe('MapboxPage', () => {
  let component: MapboxPage;
  let fixture: ComponentFixture<MapboxPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapboxPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapboxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
