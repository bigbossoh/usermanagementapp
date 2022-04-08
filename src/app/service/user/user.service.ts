import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UserEntity } from 'src/app/model/UserEntity';
import { CustomHttpResponse } from 'src/app/model/custom-http-response';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host=environment.apiUrl;

  constructor( private http:HttpClient) { }

  public getUsers():Observable<UserEntity[] | HttpErrorResponse>{
    return this.http.get<UserEntity[]>(`${this.host}/ums/api/v1/user/list`);
  }
  public addUser(formData :FormData):Observable<UserEntity | HttpErrorResponse>{
    return this.http.post<UserEntity>(`${this.host}/ums/api/v1/user/add`,formData);
  }
  public updateUser(formData :FormData):Observable<UserEntity | HttpErrorResponse>{
    return this.http.post<UserEntity>(`${this.host}/ums/api/v1/user/update`,formData);
  }

  public resetPassword(email :string):Observable<CustomHttpResponse | HttpErrorResponse>{
    return this.http.get<CustomHttpResponse>(`${this.host}/ums/api/v1/user/reset-password/${email}`);
  }

  public updateProfileImage(formData :FormData):Observable<HttpEvent<UserEntity> | HttpErrorResponse>{
    return this.http.post<UserEntity>(`${this.host}/ums/api/v1/user/updateProfileImage`,formData,
    {
      reportProgress:true,
      observe:'events'
    });
  }

  public deleteUser(username :String):Observable<CustomHttpResponse| HttpErrorResponse>{
    return this.http.delete<CustomHttpResponse>(`${this.host}/ums/api/v1/user/${username}`);
  }

  public addUsersToLocalCache(users :UserEntity[]):void{
   localStorage.setItem('users',JSON.stringify(users));
  }

  public getUsersFromLocalCache():UserEntity[] {
      return JSON.parse(localStorage.getItem('user')!);
   }
  createUserFormDate(loggedInUsername:string,user:UserEntity, profileImage: File):FormData{
    const  formData = new FormData();
    formData.append('currentUsername',loggedInUsername);
    formData.append('familyName', user.familyName!);
    formData.append('remainingName', user.remainingName!);
    formData.append('username', user.username!);
    formData.append('email', user.email!);
    formData.append('role', user.role!);
    formData.append('isActive', JSON.stringify(user.active!));
    formData.append('isNonLocked', JSON.stringify(user.notLocked!));
    formData.append('profileImage',profileImage);
    return formData;
  }
}
