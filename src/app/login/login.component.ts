import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication/authentication.service';
import { NotificationService } from '../service/notification/notification.service';
import { UserEntity } from '../model/UserEntity';
import { Subscription } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NotificationType } from '../enum/natification-type.enum';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HeaderType } from '../enum/header-type.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  public showLoading?:boolean;
  private subscriptions:Subscription[]=[];

  constructor(
    private router:Router,
    private authenticationService:AuthenticationService,
    private notificationService:NotificationService) { }



  ngOnInit(): void {
    console.log("WE ARE IN NGON INIT");

    if(this.authenticationService.isUserLoggedIn()){
      console.log("we are login component ts in the logged user");

      this.router.navigateByUrl('/user/management');
    }else{
      console.log("we are login component ts in the not logged user");
      this.router.navigateByUrl('/login');
    }


  }

  public onLogin(user:UserEntity):void{
    this.showLoading=true;
    console.log(user);
    this.subscriptions.push(

      this.authenticationService.login(user).subscribe(


      //  (response :HttpResponse<UserEntity> | HttpErrorResponse)=>{
          (response :any)=>{
            console.log("we are here");
          const token=response.headers.get(HeaderType.JWT_TOKEN);
          this.authenticationService.saveToken(token!);
          console.log(response);
          this.authenticationService.addUserToLocalCache(response.body);
          this.router.navigateByUrl('/user/management');
          this.showLoading=false;
        },
        (errohttp:HttpErrorResponse)=>{
          console.log(errohttp);
          this.sendErrorNotification(NotificationType.ERROR,errohttp.error.messages);
          this.showLoading=false;
        }
      )
    );

  }
  private sendErrorNotification(notificationType:NotificationType,message:string){
    if(message){
      this.notificationService.notify(notificationType,message);
    }else{
      this.notificationService.notify(notificationType,'An error occured. Please try again.');
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=> sub.unsubscribe());

  }

}
