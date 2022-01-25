import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  userLst;
  newUser;
  newPassword;
  newIsAdmin;
  newIsSupervisor;
  isLogged;

  constructor(
    public router: Router,
    private server : ServerService,
  ) { }

  ngOnInit(): void {
    this.isLogged = sessionStorage.getItem('isLogged');
    this.server.getUsers().then((response) => {
      this.userLst = response;    
    });
  }

  main(){
    this.router.navigate(['main']);
  }

  save(){
    this.server.addUser(this.newUser, this.newPassword, this.newIsAdmin, this.newIsSupervisor).then((response) => {
      this.server.getUsers().then((response) => {
        this.userLst = response;    
      });
      this.newUser = undefined;
      this.newPassword = undefined;
      this.newIsAdmin = false;
      this.newIsSupervisor = false;
    });
  }

  delete(value){    
    this.server.deleteUser(value.username).then((response) => {
      this.server.getUsers().then((response) => {
        this.userLst = response;    
      });
    });
  }
}
