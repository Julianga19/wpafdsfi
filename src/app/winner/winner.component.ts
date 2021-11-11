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
  winnerList;
  loteries : Lotery[] = [];
  loteryCode;

  constructor(
    public router: Router,
    private server : ServerService,
  ) { }

  ngOnInit(): void {
    this.server.getEvents().then((response: Lotery[]) => {
      for(const data of response) {        
          this.loteries.push(data);        
      }    
    });
  }

  find(){    
    this.server.getWinners(this.numberWinner, this.date, this.loteryCode).then((response) => {      
      this.winnerList = response
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
