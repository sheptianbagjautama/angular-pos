import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService, LoginResponseData } from './login.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error:string = null;
  isLoading = false;
  ButtonMessage = 'Login';
  ButtonSwitchMessage = 'Sign Up';
  isLoginMode = true;

  constructor(private loginService:LoginService,
              private router:Router) { }

  ngOnInit(): void {
  }

  onSubmitLogin(form:NgForm){
    if (!form.valid) {
      return;
    }
    this.error = null;
    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;
    if (!this.isLoginMode) {
      const name = form.value.name;
    }

    this.loginService.login(email, password)
      .subscribe(responseData => {
        console.log(responseData)
        this.router.navigate(['/product']);
        this.isLoading = false;
      }, 
      errorData => {
        console.log(errorData)
        this.error = errorData;
        this.isLoading = false;
      })
  }

  onSubmitRegister(form:NgForm){

  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
    if (this.isLoginMode) {
      this.ButtonMessage = 'Login';
      this.ButtonSwitchMessage = "Sign Up";
    } else {
      this.ButtonMessage = 'Sign Up';
      this.ButtonSwitchMessage = "Login";
    }
  }

}
