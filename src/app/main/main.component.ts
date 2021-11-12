import { Component, OnInit } from '@angular/core';
import { Option } from '../models/option.model';
import { Lotery } from '../models/lotery.model';
import { ServerService } from '../server.service';
import { Game } from '../models/game.model';
import { Router } from '@angular/router';
import { interval } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {

  errorMsg;
  numbersAddedLst = [];
  loteries : Lotery[] = [];
  loteriesSelected : Lotery[] = [];
  options : Option [];
  number;
  price;
  vendorCode;
  isLastThree;
  isCuna;
  isCombined;
  forbiddenNumbers;
  total = 0;
  codes;
  isAllLoteries;
  priceLt;
  priceCuna;
  isAdmin; 
  isLogged;
  priceCombined3=0;
  priceCombined4=0;

  constructor(
    private server : ServerService,
    public router: Router,
  ) { }

  ngOnInit(): void {    
    this.isAdmin = sessionStorage.getItem('isAdmin');
    if(this.isAdmin){
      this.verify();
    }
    this.isLogged = sessionStorage.getItem('isLogged');
    this.server.getVendors().then((response) => {      
      this.codes = response
    });
    this.server.getEvents().then((response: Lotery[]) => {
      for(const data of response) {
        if(this.loteryApplyForDay(data.dayOfWeek, data.dayOfWeekException)){
          this.loteries.push(data);
        }
      }    
    });
    this.server.getForbidden().then((response) => {      
      this.forbiddenNumbers = response
    });
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
  
  onEnter(){
    if(this.number.length > 2) {
      if(!this.isAForbiddenNumber(this.number)){      
        this.numbersAddedLst.push({number: this.number, price: 0, type: 'Directo'});                  
      } else {
        alert('Número Prohibido');
      }
      this.clearData();
    } else {
      alert('Debe ingresar un número de 3 o 4 cifras');
    }
  }

  isAForbiddenNumber(number): any{
    for(const forbidden of this.forbiddenNumbers){
      if(forbidden.number == number){
        return true;
      }
    }
    return false;
  }

  clearData(){
    this.number = undefined;    
  }

  clearAllData(){
    this.number = undefined;   
    this.total = undefined;
    this.price = undefined;
    this.unMarkLoteries();
    this.numbersAddedLst = [];     
    this.isAllLoteries = false;
    this.isLastThree = false;
    this.isCuna = false;
    
  }

  onEnterLTPrice(){
    this.total=0;
    for(let lotery of this.loteriesSelected){
      for(let numbers of this.numbersAddedLst){
        if(numbers.isLt && numbers.price == 0){
          numbers.price = this.priceLt;
        }
        this.total += +numbers.price;
      }
    }
    this.priceLt = undefined;
  }
  
  onEnterCunaPrice(){
    this.total=0;
    for(let lotery of this.loteriesSelected){
      for(let numbers of this.numbersAddedLst){
        if(numbers.isCuna && numbers.price == 0){
          numbers.price = this.priceCuna;
        }
        this.total += +numbers.price;
      }
    }
    this.priceCuna = undefined;
  }

  onEnterCombined3Price(){
    this.total=0;
    for(let lotery of this.loteriesSelected){
      for(let numbers of this.numbersAddedLst){        
        if(numbers.type != 'Combinado'){       
          this.total += +numbers.price;
        }
      }
      this.total += +this.priceCombined3 + +this.priceCombined4;
    }    
    this.combined3();
  }

  onEnterCombined4Price(){
    this.total=0;
    for(let lotery of this.loteriesSelected){
      for(let numbers of this.numbersAddedLst){ 
        if(numbers.type != 'Combinado'){       
          this.total += +numbers.price;
        }
      }
      this.total += +this.priceCombined4 + +this.priceCombined3;;
    }    
    this.combined4();
  }

  onEnterPrice(){
    this.total = 0;
    for(let lotery of this.loteriesSelected){
      for(let numbers of this.numbersAddedLst){
        if(!numbers.price){
          numbers.price = this.price;
        }
        this.total += +numbers.price;
      }
    }
    this.price = undefined;
  }

  
  lastThree(){
    this.isLastThree = !this.isLastThree;
    if(this.isLastThree){
      for(let numbers of this.numbersAddedLst){              
        if(numbers.number.length > 3){          
          this.numbersAddedLst.push({number: numbers.number.substr(1,numbers.number.length), price: 0, isLt: true, type: 'Tres últimas'});
        }
     }    
    } else {
      for (let i = this.numbersAddedLst.length - 1; i >= 0; i--) {      
        if(this.numbersAddedLst[i].isLt){                              
          this.total = this.total - this.numbersAddedLst[i].price;
          this.numbersAddedLst.splice(i,1); 
        }                                      
      }  
    }      
  }

  combined(){
    this.isCombined = !this.isCombined;    
    if(!this.isCombined){
      this.total = this.total - this.priceCombined3 - this.priceCombined4;
    }
  }

  combined3(){    
    for(let numbers of this.numbersAddedLst){
      if(numbers.type == 'Directo'){
        const a = numbers.number[0];
        const b = numbers.number[1];
        const c = numbers.number[2];
        this.numbersAddedLst.push({number: a+c+b, price: this.priceCombined3, type: 'Combinado', isCombined3: true});                  
        this.numbersAddedLst.push({number: b+a+c, price: this.priceCombined3, type: 'Combinado', isCombined3: true});                  
        this.numbersAddedLst.push({number: b+c+a, price: this.priceCombined3, type: 'Combinado', isCombined3: true});                  
        this.numbersAddedLst.push({number: c+a+b, price: this.priceCombined3, type: 'Combinado', isCombined3: true});                  
        this.numbersAddedLst.push({number: c+b+a, price: this.priceCombined3, type: 'Combinado', isCombined3: true});                  
      }
    }
  }

  combined4(){    
    for(let numbers of this.numbersAddedLst){
      if(numbers.type == 'Directo'){
      const a = numbers.number[0];
      const b = numbers.number[1];
      const c = numbers.number[2];
      const d = numbers.number[3];
      this.numbersAddedLst.push({number: a+b+d+c, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: a+c+b+d, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: a+c+d+b, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: a+d+b+c, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: a+d+c+b, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: b+a+c+d, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: b+a+d+c, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: b+c+a+d, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: b+c+d+a, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: b+d+a+c, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: b+d+c+a, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: c+a+b+d, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: c+a+d+b, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: c+b+a+d, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: c+b+d+a, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: c+d+a+b, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: c+d+b+a, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: d+a+b+c, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: d+a+c+b, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: d+b+a+c, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: d+b+c+a, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: d+c+a+b, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                  
      this.numbersAddedLst.push({number: d+c+b+a, price: this.priceCombined4, type: 'Combinado', isCombined4: true});                      
      }
    }
  }

  cuna(){
    this.isCuna = !this.isCuna;
    if(this.isCuna){
      for(let numbers of this.numbersAddedLst){                                    
        if(numbers.number.length > 2){
          const cuna = numbers.number.substr(numbers.number.length-2,numbers.number.length);
          const cunaModel = {number: cuna , price: 0, isCuna: true, type: 'Cuña'};
          const index = this.numbersAddedLst.indexOf(cunaModel);
          if (index === -1) {
            this.numbersAddedLst.push(cunaModel);        
          }
        }
     }    
    } else {
      for (let i = this.numbersAddedLst.length - 1; i >= 0; i--) {      
        if(this.numbersAddedLst[i].isCuna){                              
          this.numbersAddedLst.splice(i,1); 
        }                                      
      }  
    }    
  }

  selected(loterie){
    const index = this.loteriesSelected.indexOf(loterie);
    if (index === -1) {
      this.loteriesSelected.push(loterie);
    } else {
      this.loteriesSelected.splice(index, 1);
    }    
  }

  all(){
    this.isAllLoteries = !this.isAllLoteries;
    if(this.isAllLoteries){
      this.loteriesSelected = [];
      for (const loterie of this.loteries){
          loterie.checked = true;
          this.loteriesSelected.push(loterie);                      
      }        
    } else {
      this.unMarkLoteries();
    }
  }

  unMarkLoteries(){
    for (const loterie of this.loteriesSelected){
      loterie.checked = false;        
    }        
    this.loteriesSelected = [];
  }

  save(){
    const user = sessionStorage.getItem('user');
    if(user){
      if(this.vendorCode){
        if(this.loteriesSelected.length != 0){
          if(this.numbersAddedLst.length != 0){
            if(this.total != 0){
              for(const number of this.numbersAddedLst){
                for(const lot of this.loteriesSelected){
                  let game: Game = { loteryCode: lot.code, number: number.number, value: number.price, 
                    vendorCode: this.vendorCode, userName: user, type: number.type, today: new Date()};
                  this.server.createEvent(game);
                }
              }
              this.clearAllData();
            } else {
              alert('El total apostado debe ser mayor a 0');    
            }
          } else {
            alert('Debe ingresar al menos un número');  
          }
        } else {
          alert('Debe seleccionar al menos una lotería');  
        }
      } else {
        alert('Debe seleccionar un codigo');
      } 
    }else {
      alert('Se perdió la sesion, por favor ingrese de nuevo');
    }
  }

  delete(number){
    const index = this.numbersAddedLst.indexOf(number);
    this.total = this.total - this.numbersAddedLst[index].price * this.loteriesSelected.length;
    this.numbersAddedLst.splice(index, 1);
  }

  forbidden(){
    this.router.navigate(['forbidden']);
  }

  winners(){
    this.router.navigate(['winner']);
  }

  limits(){
    this.router.navigate(['limits']);
  }

  verify(){
    interval(300000).subscribe(x => {      
      var date = new Date();
      var d = date.getDate();
      var m = date.getMonth() + 1; //Month from 0 to 11
      var y = date.getFullYear();
      var dateParam = y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);    
      this.server.getPassed('5000', dateParam, 4, new Date()).then((response : any) => {                  
        if (response.length > 0) {     
          if(this.verifyPending(response, '5000')){
            alert('Hay números por cubrir. Por favor verifique');
          }
        } else {
          this.server.getPassed('20000', dateParam, 3, new Date()).then((response: any) => {                  
            if (response.length > 0) {            
              if(this.verifyPending(response, '20000')){
                alert('Hay números por cubrir. Por favor verifique');
              }
            }
          });
        }
      });      
    });
  }

  verifyPending(result, maxValue){
    for(const pending of result){
      if(pending.SUMA-pending.COVERED-maxValue > 0){
        return true;
      }
    }    
    return false;
  }
}
