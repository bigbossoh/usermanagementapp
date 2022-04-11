import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
import { UserEntity } from 'src/app/model/UserEntity';
import { LoginComponent } from '../../login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public host=environment.apiUrl;
  private token: string |null | undefined ;
  private loggedInUsername: string |null | undefined ;
  private jwtHelper=new JwtHelperService();

  constructor( private http:HttpClient) { }

  public login(user:UserEntity):Observable<HttpResponse<UserEntity>>{
    return this.http.post<UserEntity>
    (`${this.host}/ums/api/v1/user/login`,user,{observe:'response'});
  }

  public register(user:UserEntity):Observable<UserEntity>{
    return this.http.post<UserEntity>
    (`${this.host}/ums/api/v1/user/register`,user);
  }

  public logOut():void{
       this.token=null;
    this.loggedInUsername=null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
    console.log("WE ARE REMOVE EVERY THING");

  }
  public saveToken(token:string):void{
    this.token=token;
    localStorage.setItem('token',token);
  }
  public addUserToLocalCache(user:UserEntity):void{
    localStorage.setItem('user',JSON.stringify(user));
  }
  public getUserFromLocalCache(): UserEntity{

    return JSON.parse(localStorage.getItem('user')!);
  }
  public loadToken():void{
    console.log("we are in loading token fonction");

   // this.token=JSON.parse( localStorage.getItem('token')!);
   this.token = localStorage.getItem('token');
    console.log("we are getting back the token", this.token);
  }
  public getToken():string{
    return this.token!;
  }
  public isUserLoggedIn(): boolean {
    console.log("we are authentification service ts");
    this.loadToken();
    console.log(this.token);

    if(this.token !=null && this.token !== ''){
      if(this.jwtHelper.decodeToken(this.token).sub != null || '' ){
        if(!this.jwtHelper.isTokenExpired(this.token)){
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          console.log("This.loggedInUsername "+this.loggedInUsername);

          return true;
        }
      }
      return false;
    }else{
      console.log("we are authentification service IN THE LOGOUT SECTION");
      this.logOut();
      return false;
    }

  }
}
