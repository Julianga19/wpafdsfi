import { Component, OnInit } from '@angular/core';
import { Option } from '../models/option.model';
import { Lotery } from '../models/lotery.model';
import { ServerService } from '../server.service';
import { Game } from '../models/game.model';
import { Router } from '@angular/router';


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
  forbiddenNumbers;
  total = 0;
  codes;
  isAllLoteries;
  priceLt;
  priceCuna;

  constructor(
    private server : ServerService,
    public router: Router,
  ) { }

  ngOnInit(): void {
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
    let combinedLst = [];    
    const a = this.number[0];
    const b = this.number[1];
    const c = this.number[2];
    const d = this.number[3];
    this.numbersAddedLst.push({number: a+b+d+c, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: a+c+b+d, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: a+c+d+b, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: a+d+b+c, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: a+d+c+b, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: b+a+c+d, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: b+a+d+c, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: b+c+a+d, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: b+c+d+a, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: b+d+a+c, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: b+d+c+a, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: c+a+b+d, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: c+a+d+b, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: c+b+a+d, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: c+b+d+a, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: c+d+a+b, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: c+d+b+a, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: d+a+b+c, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: d+a+c+b, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: d+b+a+c, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: d+b+c+a, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: d+c+a+b, price: 0, type: 'Combinado'});                  
    this.numbersAddedLst.push({number: d+c+b+a, price: 0, type: 'Combinado'});                  
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
    if(this.vendorCode){
      if(this.loteriesSelected.length != 0){
        if(this.numbersAddedLst.length != 0){
          if(this.total != 0){
            for(const number of this.numbersAddedLst){
              for(const lot of this.loteriesSelected){
                let game: Game = { loteryCode: lot.code, number: number.number, value: number.price, 
                  vendorCode: this.vendorCode, userName: 'ADMIN', type: number.type};
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

}
