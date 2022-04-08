import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
import { UserEntity } from 'src/app/model/UserEntity';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private host=environment.apiUrl;
  private token: string |null | undefined ;
  private loggedInUsername: string |null | undefined ;
  private jwtHelper=new JwtHelperService();

  constructor( private http:HttpClient) { }

  public login(user:UserEntity):Observable<HttpResponse<any>| HttpErrorResponse>{
    return this.http.post<HttpResponse<any> | HttpErrorResponse>
    (`${this.host}/ums/api/v1/user/login`,user,{observe:'response'});
  }
  public register(user:UserEntity):Observable<UserEntity| HttpErrorResponse>{
    return this.http.post<UserEntity | HttpErrorResponse>
    (`${this.host}/ums/api/v1/user/register`,user);
  }
  public logOut():void{
    this.token=null;
    this.loggedInUsername=null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
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
    this.token=JSON.parse(localStorage.getItem('token')!);
  }
  public getToken():string{
    return this.token!;
  }
  public isLoggedIn(): boolean {
    this.loadToken();
    if(this.token !=null && this.token !== ''){
      if(this.jwtHelper.decodeToken(this.token).sub != null || '' ){
        if(!this.jwtHelper.isTokenExpired(this.token)){
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
      return false;
    }else{
      this.logOut();
      return false;
    }

  }
}
