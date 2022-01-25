import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lotery } from '../models/lotery.model';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-loteries',
  templateUrl: './loteries.component.html',
  styleUrls: ['./loteries.component.scss']
})
export class LoteriesComponent implements OnInit {

  loteries : Lotery[] = [];  
  loterieCode: string;
  loterieSelected: Lotery = {};
  isLogged;
  isEditing;
  isSuccess;
  constructor(
    private server : ServerService,
    public router: Router,
  ) { }

  ngOnInit(): void {    
    this.isLogged = sessionStorage.getItem('isLogged');
    this.server.getEvents().then((response: Lotery[]) => {
      this.loteries = response;
    });
  }

  main(){
    this.router.navigate(['main']);
  }

  edit(){
    this.isEditing=true;
    this.loterieSelected = this.loteries.filter(x => x.code == this.loterieCode)[0];
  }

  change(){
    this.server.changeLoteryDay(this.loterieSelected.code, this.loterieSelected.dayOfWeek).then((response) => {
      this.isEditing = false;
      this.loterieSelected = {};
      this.loterieCode = undefined;
      this.success();
    });
  }

  success(){
    this.isSuccess = true;
    setTimeout(() => this.isSuccess = false, 3000);
  }
}
