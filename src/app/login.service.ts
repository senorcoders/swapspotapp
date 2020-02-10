import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { StorageproviderService } from './storageprovider.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements CanActivate {

  constructor(private router: Router, private storageProvider: StorageproviderService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    this.storageProvider.get('login').then(res => {
      console.log("login", res);
      if ( res == null) {
        console.log("Es null", res);
        this.router.navigate(['/']);
      }else{
        this.router.navigate(['tabs']);

      }
    })
    
    return true;
  }
}
