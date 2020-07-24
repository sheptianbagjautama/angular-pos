import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user.model';

export interface LoginResponseData {
    access_token:string;
    token_type:string;
    expires_in:number;
}

export interface RegisterResponseData{
    message:string,
    user:{
        name:string,
        email:string,
        updated_at:string,
        created_at:string,
        id:number
    }
}

@Injectable({providedIn:'root'})
export class LoginService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer:any;

    constructor(private http:HttpClient, private router:Router){}

    login(email:string, password:string) {
        return this.http
        .post<LoginResponseData>(
            'http://localhost:8000/api/auth/login',
            {
                email:email,
                password:password
            }
        )
        // pipe ->  Menggabung beberapa combinasi dari function
        .pipe(
            //Menangkap error
            catchError(this.handleError),
            tap(responseData => {
                // Mengirim response yang didapat dari request ke method
                this.handleLogin(
                    responseData.access_token,
                    responseData.token_type,
                    +responseData.expires_in
                );
            })
        );
    }

    register(name:string, email:string, password:string, password_confirmation:string){
        return this.http
        .post<RegisterResponseData>(
            'http://localhost:8000/api/auth/register',
            {
                name:name,
                email:email,
                password:password,
                password_confirmation:password_confirmation
            }
        )
        .pipe(
            catchError(this.handleError)
        );
    }


    private handleLogin(
        access_token:string,
        token_type:string,
        expires_in:number
    ) {
        const expirationDate = new Date(
            new Date().getTime() + +expires_in * 1000
        );

        // console.log(new Date());
        // console.log(new Date().getTime());
        // console.log(expires_in);
        // console.log(expires_in * 1000);
        // console.log('hasil');
        // console.log(expirationDate);
        // console.groupEnd();

        const user = new User(access_token, token_type, expirationDate);
        this.user.next(user);
        this.autoLogout(expires_in * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    autoLogin(){
        const userData:{
            _accessToken:string,
            tokenType:string,
            _tokenExpirationDate:string

        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData._accessToken,
            userData.tokenType,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.accessToken) {
            this.user.next(loadedUser);
            const expirationDuration = 
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    autoLogout(expirationDuration:number){
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        },expirationDuration);
    }

    logout(){
        // set data user menjadi null
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage);
        }

        if (errorResponse.status === 401) {
            errorMessage = 'Email and password not correct.';
        }
        return throwError(errorMessage);
    }


}