import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationType } from '../enum/natification-type.enum';
import { AuthenticationService } from '../service/authentication/authentication.service';
import { NotificationService } from '../service/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private authenticationService:AuthenticationService,
    private router:Router,
    private notificationService:NotificationService){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean  {
    return this.isUserLoggedIn();
  }
  private isUserLoggedIn():boolean{
    if(this.authenticationService.isUserLoggedIn()){
      return true;
    }
    this.router.navigate(['/login']);

    this.notificationService.notify(NotificationType.ERROR,"You need to login to acces this page");
    return false;
  }
}
