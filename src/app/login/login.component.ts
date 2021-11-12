import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user;
  pwd;

  constructor(
    private server : ServerService,
    public router: Router,
  ) { }

  ngOnInit(): void {
  }

  login(){
    this.server.login(this.user, this.pwd).then((response) => {      
      if(response){
        sessionStorage.setItem('isAdmin', response[0].isAdmin);
        sessionStorage.setItem('isLogged', 'true');
        this.router.navigate(['main']);
      }
    });
  }
}
