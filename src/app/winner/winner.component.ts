import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lotery } from '../models/lotery.model';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.scss']
})
export class WinnerComponent implements OnInit {

  numberWinner;
  date;
  winnerList = [];
  loteries : Lotery[] = [];
  loteryCode;
  isLogged;

  constructor(
    public router: Router,
    private server : ServerService,
  ) { }

  ngOnInit(): void {
    this.isLogged = sessionStorage.getItem('isLogged');
    this.server.getEvents().then((response: Lotery[]) => {
      for(const data of response) {        
          this.loteries.push(data);        
      }    
    });
  }

  find(){  
    this.winnerList = [];  
    this.server.getWinners(this.numberWinner, this.date, this.loteryCode).then((response: any) => {      
      for(const data of response) {        
        if(data.number.length == 4){
          if(data.type == 'Derecho' || data.type == 'Directo' ){
            data.prize = data.value * 4500;
          } else {
            data.prize = data.value * 200;
          }
        if(data.number.length == 3){
          if(data.type == 'Derecho' || data.type == 'Directo' ){
            data.prize = data.value * 560;
          } else {
            data.prize = data.value * 116;
          }
        }
        if(data.number.length == 2){
          data.prize = data.value * 50;
        }
        this.winnerList.push(data);
      }
    }
    });
  }

  main(){
    this.router.navigate(['main']);
  }

  change(e){
    let name = e.target.value;
    let list = this.loteries.filter(x => x.name === name)[0];
    this.loteryCode = list.code;
  }  

}
