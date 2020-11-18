import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { config } from './../../config';
import { Tokens } from './../models/tokens';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError } from 'rxjs';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  public login(email: string, password: string) {
    return this.http.post<any>(config.URL_LOGIN, { email, password })
      .pipe(tap(res => this.setSession(res)));
  }

  public logout() {
    return this.http.post(config.URL_LOGOUT, { "refreshToken": AuthService.getRefreshToken() })
      .pipe(tap(() => this.removeSession()));
  }

  public refreshToken() {
    return this.http.post(config.URL_REFRESH_TOKEN, { 'refreshToken': AuthService.getRefreshToken() });
  }

  private setSession(tokens: Tokens) {
    this.setAccessToken(tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN, tokens.refreshToken);
  }

  private removeSession() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }

  public setAccessToken(value: string) {
    localStorage.setItem(ACCESS_TOKEN, value);
  }

  public static getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  public static getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  public getEmail(): string {
    const payload = this.jwtHelper.decodeToken(AuthService.getRefreshToken());
    if (payload) {
      return payload.user.email;
    }
    return "UNKNOWN";
  }

  public getRole(): string {
    const payload = this.jwtHelper.decodeToken(AuthService.getRefreshToken());
    if (payload) {
      return payload.user.role.name;
    }
    return "UNKNOWN";
  }

  public authCheck(): boolean {
    const accessExpired: boolean = this.jwtHelper.isTokenExpired(AuthService.getAccessToken());
    const refreshExpired: boolean = this.jwtHelper.isTokenExpired(AuthService.getRefreshToken());
    if (refreshExpired && accessExpired) {
      return false;
    }
    return true;
  }
}
