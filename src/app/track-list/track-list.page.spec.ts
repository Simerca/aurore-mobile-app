import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrackListPage } from './track-list.page';

describe('TrackListPage', () => {
  let component: TrackListPage;
  let fixture: ComponentFixture<TrackListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrackListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
