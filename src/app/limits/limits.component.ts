import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from '../models/game.model';
import { ServerService } from '../server.service';
import { saveAs } from 'file-saver';
import { Lotery } from '../models/lotery.model';

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
  isLoading;
  loteries : Lotery[] = [];  
  loteriesStr: String = '';
  loterieCode;
  
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
    this.isLoading = true;
    this.passedList = [];
    this.loteriesStr = '';
    let limit;    
    limit = this.isThree ? 3 : this.isFour ? 4 : 0;
    if(!this.loterieCode) {
        for(const data of this.loteries) {
          if(this.loteryApplyForDay(data.dayOfWeek, data.dayOfWeekException)){
            const currentTime = new Date();          
            if(currentTime.getHours() < data.hourClose){
              this.loteriesStr = this.loteriesStr + "'" + data.code + "',";            
            }        
          }
        }
        this.loterieCode = this.loteriesStr.substr(0,this.loteriesStr.length-1);  
      } else {
        this.loterieCode = "'"+this.loterieCode+"'";
      }
            
      let today = new Date().toLocaleDateString('en-US', {
        month: '2-digit',day: '2-digit',year: 'numeric'})      
      var date = new Date(today);    
      var d = date.getDate();
      var m = date.getMonth() + 1; //Month from 0 to 11
      var y = date.getFullYear();
      var dateParam = y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);            
      this.server.getPassed(this.maxValue, this.date, limit, dateParam, this.loterieCode).then((response: any) => {                                
        for(const passed of response){
          if(passed.SUMA-passed.COVERED-this.maxValue > 0){        
            this.passedList.push(passed);
          }
        }
        this.isLoading = false;
        this.loterieCode = '';
        this.loteriesStr =''
      });    
  }

  cover(){
    this.isLoading = true;
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
    this.find();
    this.isLoading = false;    
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

  loteryApplyForDay(dayApply, dayException): any {
    const day = new Date().getDay();
    if (day == dayApply) {
      return true;
    } else if (-1 == dayApply && dayException == undefined) {
      return true;
    } else if (-1 == dayApply && dayException != day) {
      return true;
    } else if (-2 == dayApply && (day == 6 || day == 0)) {
      return true;
    } else return false;
  }
}

