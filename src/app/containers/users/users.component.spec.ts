import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { discardPeriodicTasks } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UsersComponent } from './users.component';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { timer } from 'rxjs/observable/timer';
import { mapTo } from 'rxjs/operators';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('UsersComponent', () => {
  const fakeUser: User = {id: 1, name: 'Stevens'};
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ UsersComponent, UserListComponent ],
      // schemas: [NO_ERRORS_SCHEMA],
      providers: [
        UserService,
        {
          provide: HttpClient,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of users', (done) => {
    const spy = spyOn(userService, 'getUsers')
      .and
      .returnValue(timer(1000).pipe(mapTo([fakeUser])));

    component.ngOnInit();
    component.users$.subscribe(users => {

      console.log(users);
      expect(spy).toHaveBeenCalled();
      expect(users).toEqual([fakeUser]);
      done();

    });

  });

  it('should have a list of users', fakeAsync(() => {

    const spy = spyOn(userService, 'getUsers')
      .and
      .returnValue(timer(1000).pipe(mapTo([fakeUser])));

    component.ngOnInit();

    component.users$.subscribe(users => {
      console.log(users);
      expect(spy).toHaveBeenCalled();
      expect(users).toEqual([fakeUser]);
    });
    tick(1000);

    discardPeriodicTasks();

  }));

  fit('should have a list of users', async(() => {

    const spy = spyOn(userService, 'getUsers')
      .and
      .returnValue(timer(1000).pipe(mapTo([fakeUser])));

    component.ngOnInit();
    fixture.detectChanges();

    // Pre-requisito de la prueba
    component.users$.subscribe(users => {
      console.log('Usuarios: ', users);
      expect(users).toEqual([fakeUser]);
    });

    // Prueba real
    fixture.whenStable().then(() => {
      // Aquí se completan las promesas/observables pendientes
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('.user-button'));
      // Aun no está renderizadoel boton!

      // Renderizarlo
      const el = buttons[0].nativeElement;
      console.log(el);

      expect(el.textContent).toEqual('Stevens');
    });

  }));

});
