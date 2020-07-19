import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error:string = null;
  isLoading = false;

  constructor(private loginService:LoginService,
              private router:Router) { }

  ngOnInit(): void {
  }

  onSubmit(form:NgForm){
    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;

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

}
