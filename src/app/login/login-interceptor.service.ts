import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams, HttpHeaders} from '@angular/common/http';
import { LoginService } from './login.service';
import { take, exhaustMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';


@Injectable()
export class LoginInterceptorService implements HttpInterceptor {
    constructor(private loginService:LoginService){}

    intercept(req:HttpRequest<any>, next:HttpHandler){
        return this.loginService.user.pipe(
            take(1),
            exhaustMap(user => {
                if (!user) {
                    return next.handle(req);
                }
                
                const modifiedReq = req.clone({
                    headers:new HttpHeaders().set('Authorization', `Bearer ${user.accessToken}`)
                });
                return next.handle(modifiedReq);
            })
        )
    }
}