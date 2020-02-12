import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchParkingPage } from './search-parking.page';

describe('SearchParkingPage', () => {
  let component: SearchParkingPage;
  let fixture: ComponentFixture<SearchParkingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchParkingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchParkingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
