import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private router:Router) { }
  //check for if logged in
 
  public userStatus: string;
  public userStatusChanges: BehaviorSubject<string> = new BehaviorSubject<string>(this.userStatus);

  setUserStatus(userStatus: any): void {
    this.userStatus = userStatus;
    this.userStatusChanges.next(userStatus);
  }

  //login
  public login(email:string, password:string){
    let that:any = this;

    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
  
    let user = {
      email: email,
      password: password
    }

    //send a post request to the 
    this.httpClient.post(`${environment.api_endpoint}/users/login`, JSON.stringify(user), {headers: headers}).subscribe(res => {
        this.saveToken(res["token"]);
        this.router.navigate(["/"]);
    });
  }

  public logout(){
    //just remove the access token and redirect
    console.log("user logged out successfully");
    localStorage.removeItem('access_token');
    this.setUserStatus(null);
    this.router.navigate(["/login"]);
  }

  //signup
  public signup(email:string, password:string){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
  
    let user = {
      email: email,
      password: password
    }

    //send a post request to the 
    this.httpClient.post(`${environment.api_endpoint}/users`, JSON.stringify(user), {headers: headers}).subscribe(res => {
      this.saveToken(res["token"]);
      this.router.navigate(["/"]);
    });
  }

  public getStatusOnRefresh(){
    if(localStorage.getItem("access_token")){
      this.setUserStatus(localStorage.getItem("access_token"))
      //console.log(this.userStatus)
    }
  }

  private saveToken(token:string){
    //set the token to localStorage
    localStorage.setItem("access_token", token);
    this.setUserStatus(token);
    console.log('token', token);
  }

}
