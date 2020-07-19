import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { LoginService } from "./login.service";
import { Observable } from "rxjs";
import { take, map } from "rxjs/operators";

@Injectable({providedIn:'root'})
export class LoginGuard implements CanActivate {
    constructor(private loginService:LoginService,
                private router:Router) {}

    canActivate(
        route:ActivatedRouteSnapshot,
        router:RouterStateSnapshot
    ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        return this.loginService.user.pipe(
            take(1),
            map((user) => {
                const isAuth = user ? true : false;
                if (isAuth) {
                    return true;
                }
                return this.router.createUrlTree(['/login']);
            })
        );
    }
}