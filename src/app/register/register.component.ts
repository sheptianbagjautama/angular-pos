import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmedValidator } from '../shared/confirmed.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm:FormGroup = new FormGroup({});
  error:string = null;
  message:string = null;
  isLoading = false;


  constructor(private loginService:LoginService,
              private formBuilder:FormBuilder) {
          
        this.registerForm = formBuilder.group({
          name:['', [Validators.required]],
          email:['', [Validators.required, Validators.email]],
          password:['',[Validators.required]],
          password_confirmation:['',[Validators.required]]
        }, {
          validators:ConfirmedValidator('password', 'password_confirmation')
        });
  }

  // Tracking form ketika user input setiap detiknya akan mengembalikan control form yang dapat digunakan untuk validasi
  get f(){
    return this.registerForm.controls;
  }

  ngOnInit(): void {
  }

  onSubmitRegister(){
    this.isLoading = true;
    console.log(this.registerForm.value);
    const name = this.registerForm.value.name;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const password_confirmation = this.registerForm.value.password_confirmation;
    this.loginService.register(
      name,email,password,password_confirmation
    )
    .subscribe(responseData => {
      console.log(responseData);
      this.message = "Successfuly registered!";
      this.isLoading = false;
    }, 
    errorData => {
      this.error = errorData;
      this.isLoading = false;
    })
  }

}
