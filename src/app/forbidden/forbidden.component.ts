import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent implements OnInit {

  forbiddenLst;
  newNumber;
  isLogged;

  constructor(
    public router: Router,
    private server : ServerService,
  ) { }

  ngOnInit(): void {
    this.isLogged = sessionStorage.getItem('isLogged');
    this.server.getForbidden().then((response) => {
      this.forbiddenLst = response;    
    });
  }

  main(){
    this.router.navigate(['main']);
  }

  save(){
    this.server.addForbidden(this.newNumber).then((response) => {
      this.server.getForbidden().then((response) => {
        this.forbiddenLst = response;    
      });
      this.newNumber = undefined;
    });
  }

  delete(number){    
    this.server.deleteForbidden(number.number).then((response) => {
      this.server.getForbidden().then((response) => {
        this.forbiddenLst = response;    
      });
    });
  }
}
