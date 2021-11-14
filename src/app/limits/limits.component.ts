import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from '../models/game.model';
import { ServerService } from '../server.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-limits',
  templateUrl: './limits.component.html',
  styleUrls: ['./limits.component.scss']
})
export class LimitsComponent implements OnInit {

  maxValue;
  date;
  passedList =[];
  isThree;
  isFour;
  isLogged;
  constructor(
    public router: Router,
    private server : ServerService,
  ) { }

  ngOnInit(): void {
    this.isLogged = sessionStorage.getItem('isLogged');
  }

  find(){
    this.passedList = [];
    let limit;    
    limit = this.isThree ? 3 : this.isFour ? 4 : 0
    this.server.getPassed(this.maxValue, this.date, limit, new Date()).then((response: any) => {                  
      for(const passed of response){
        if(passed.SUMA-passed.COVERED-this.maxValue > 0){        
          this.passedList.push(passed);
        }
      }
    });
  }

  cover(){
    let data = '';
    for(const number of this.passedList){
      const valuePending: any = (+number.SUMA - +number.COVERED - +this.maxValue).toString();
      let game: Game = { loteryCode: number.lotery_code, number: number.NUMBER, value: valuePending, 
        vendorCode: '', userName: 'ADMIN',  type: '', today: new Date()};
        if(valuePending > 0){
          data = data + number.NUMBER + " por " + number.NAME + " de " + valuePending + " \r\n";
          this.server.addCovered(game)
        }
    }
    const blob = 
        new Blob([
                 data], 
                 {type: "text/plain;charset=utf-8"});
    saveAs(blob, "cubiertos.txt");
  }

  three(){
    this.isThree = !this.isThree;
  }

  four(){
    this.isFour = !this.isFour;
  }

  main(){
    this.router.navigate(['main']);
  }
}

