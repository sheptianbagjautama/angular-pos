import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  private userSubcription:Subscription;

  constructor(private loginService:LoginService) { }

  ngOnInit(): void {
    this.userSubcription = this.loginService.user.subscribe(user => {
      this.isAuthenticated = user ? true : false;
    });
  }

  onLogout(){
    this.loginService.logout();
  }

}
