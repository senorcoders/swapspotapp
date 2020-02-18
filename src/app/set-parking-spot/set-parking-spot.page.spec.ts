import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SetParkingSpotPage } from './set-parking-spot.page';

describe('SetParkingSpotPage', () => {
  let component: SetParkingSpotPage;
  let fixture: ComponentFixture<SetParkingSpotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetParkingSpotPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SetParkingSpotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
