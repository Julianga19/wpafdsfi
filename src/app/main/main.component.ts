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
  lastest: Game[] = [];
  number;
  price;
  vendorCode;
  isLastThree;
  isFirstThree;
  isCuna;
  isCombined;
  forbiddenNumbers;
  total = 0;
  codes;
  isAllLoteries;
  priceLt;
  priceFt;
  priceCuna;
  isAdmin; 
  isSupervisor;
  isLogged;
  priceCombined3=0;
  priceCombined4=0;
  userLogged;
  isSuccess;
  isLoading = false;

  constructor(
    private server : ServerService,
    public router: Router,
  ) { }

  ngOnInit(): void {    
    this.userLogged = sessionStorage.getItem('user');
    this.isAdmin = sessionStorage.getItem('isAdmin') == "0" ? false : true; 
    this.isSupervisor = sessionStorage.getItem('isSupervisor') == "0" ? false : true; 
    if(this.isAdmin){
      // this.verify();
    }
    this.isLogged = sessionStorage.getItem('isLogged');
    this.server.getVendors().then((response) => {      
      this.codes = response
    });
    this.server.getEvents().then((response: Lotery[]) => {
      for(const data of response) {
        if(this.loteryApplyForDay(data.dayOfWeek, data.dayOfWeekException)){
          const currentTime = new Date();          
          if(currentTime.getHours() < data.hourClose){
            this.loteries.push(data);          
          } else if (currentTime.getHours() == data.hourClose){
            if(currentTime.getMinutes() < data.minuteClose){
              this.loteries.push(data);          
            }   
          }        
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
        this.numbersAddedLst.push({number: this.number, price: 0, type: 'Derecho'});                  
      } else {
        alert('N??mero Prohibido');
      }
      this.clearData();
    } else {
      alert('Debe ingresar un n??mero de 3 o 4 cifras');
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
    this.isFirstThree = false;
    this.isCuna = false;
    this.isCombined = false;
    this.priceCombined3 = 0;
    this.priceCombined4=0;
    
  }

  onEnterLTPrice(){
    this.total=0;
    for(let numbers of this.numbersAddedLst){
      if(this.loteriesSelected.length > 0){
        for(let lotery of this.loteriesSelected){      
          if(numbers.isLt && numbers.price == 0){
            numbers.price = this.priceLt;
          }
          this.total += +numbers.price;
        }
      }else {
        if(numbers.isLt){
          numbers.price = this.priceLt;
        }
        this.total += +numbers.price;
      }
    }
    this.priceLt = undefined;
  }

  onEnterFTPrice(){
    this.total=0;
    for(let numbers of this.numbersAddedLst){
      if(this.loteriesSelected.length > 0){
        for(let lotery of this.loteriesSelected){      
          if(numbers.isFt && numbers.price == 0){
            numbers.price = this.priceFt;
          }
          this.total += +numbers.price;
        }
      }else {
        if(numbers.isFt){
          numbers.price = this.priceFt;
        }
        this.total += +numbers.price;
      }
    }
    this.priceFt = undefined;
  }
  
  onEnterCunaPrice(){
    this.total=0;
    for(let numbers of this.numbersAddedLst){
      if(this.loteriesSelected.length > 0 ){
        for(let lotery of this.loteriesSelected){      
          if(numbers.type != 'Combinado'){       
            if(numbers.isCuna && numbers.price == 0){
              numbers.price = this.priceCuna;
            }        
            this.total += +numbers.price;
          }
        }
      } else {
        if(numbers.isCuna){
          numbers.price = this.priceCuna;
        }        
        this.total += +numbers.price;
      }
    }
    this.priceCuna = undefined;
  }

  onEnterCombined3Price(){
    this.total=0;
    for(let numbers of this.numbersAddedLst){        
      if(this.loteriesSelected.length> 0){
        for(let lotery of this.loteriesSelected){      
          if(numbers.type != 'Combinado'){       
            if((numbers.number.length ==4 && lotery.code != 'CASHTHREEDIA' && lotery.code != 'CASHTHREENOCHE') || numbers.number.length == 3 || numbers.number.length == 2){
              this.total += +numbers.price;
            }
          }
          if(lotery.code != 'CASHTHREEDIA' && lotery.code != 'CASHTHREENOCHE'){
            this.total += +this.priceCombined4 + +this.priceCombined3;;
          } else {
            this.total += +this.priceCombined3;;          
          }
        }
      } else {
        if(numbers.type != 'Combinado')
          this.total = this.total + +numbers.price;      
      }      
    }  
    this.total += +this.priceCombined4 + +this.priceCombined3;
    this.combined3();
  }

  onEnterCombined4Price(){
    this.total=0;    
      for(let numbers of this.numbersAddedLst){ 
        if(this.loteriesSelected.length>0){
          for(let lotery of this.loteriesSelected){
            if(numbers.type != 'Combinado'){       
              if((numbers.number.length ==4 && lotery.code != 'CASHTHREEDIA' && lotery.code != 'CASHTHREENOCHE') || numbers.number.length == 3 || numbers.number.length == 2){
                this.total += +numbers.price;
              }
            }
            if(lotery.code != 'CASHTHREEDIA' && lotery.code != 'CASHTHREENOCHE'){
              this.total += +this.priceCombined4 + +this.priceCombined3;;
            } else {
              this.total += +this.priceCombined3;;    
            }
          }
        } else {
          if(numbers.type != 'Combinado')
            this.total =  this.total + +numbers.price;                
        }               
    }    
    this.total += +this.priceCombined4 + +this.priceCombined3;
    this.combined4();
  }

  onEnterPrice(){
    this.total = 0;
    for(let numbers of this.numbersAddedLst){
      if(this.loteriesSelected.length > 0){
        for(let lotery of this.loteriesSelected){      
          if((numbers.number.length ==4 && lotery.code != 'CASHTHREEDIA' && lotery.code != 'CASHTHREENOCHE') || (numbers.number.length == 3 && numbers.type == 'Derecho')){            
            if(!numbers.price){
              numbers.price = this.price;            
            }
            this.total += +numbers.price;
          }        
        }
       } else {
        if(numbers.type == 'Derecho'){            
          numbers.price = this.price;            
          this.total += +this.price;
        }
      }
    }
    this.price = undefined;
  }

  
  lastThree(){
    this.isLastThree = !this.isLastThree;
    if(this.isLastThree){
      for(let numbers of this.numbersAddedLst){              
        if(numbers.number.length > 3){          
          this.numbersAddedLst.push({number: numbers.number.substr(1,numbers.number.length), price: 0, isLt: true, type: 'Tres ??ltimas'});
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

  firstThree(){
    this.isFirstThree = !this.isFirstThree;
    if(this.isFirstThree){
      for(let numbers of this.numbersAddedLst){              
        if(numbers.number.length > 3){          
          this.numbersAddedLst.push({number: numbers.number.substr(0,numbers.number.length-1), price: 0, isFt: true, type: 'Tres primeras'});
        }
     }    
    } else {
      for (let i = this.numbersAddedLst.length - 1; i >= 0; i--) {      
        if(this.numbersAddedLst[i].isFt){                              
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
      let a = '0';
      let b = '0';
      let c = '0';
      if(numbers.type == 'Derecho' && numbers.number.length == 3){
        a = numbers.number[0];
        b = numbers.number[1];
        c = numbers.number[2];
        this.numbersAddedLst.push({number: a+c+b, price: this.priceCombined3, type: 'Combinado', isCombined3: true});                  
        this.numbersAddedLst.push({number: b+a+c, price: this.priceCombined3, type: 'Combinado', isCombined3: true});                  
        this.numbersAddedLst.push({number: b+c+a, price: this.priceCombined3, type: 'Combinado', isCombined3: true});                  
        this.numbersAddedLst.push({number: c+a+b, price: this.priceCombined3, type: 'Combinado', isCombined3: true});                  
        this.numbersAddedLst.push({number: c+b+a, price: this.priceCombined3, type: 'Combinado', isCombined3: true});                        
      }
      if(numbers.type == 'Derecho' && numbers.number.length == 4){
        a = numbers.number[1];
        b = numbers.number[2];
        c = numbers.number[3];
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
      if(numbers.type == 'Derecho'){
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
        if(numbers.type == 'Derecho' && numbers.number.length > 2){
          const cuna = numbers.number.substr(numbers.number.length-2,numbers.number.length);
          const cunaModel = {number: cuna , price: 0, isCuna: true, type: 'Cu??a'};
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
    this.sumValues();
  }

  sumValues(){
    this.total = 0;
    for(const lot of this.loteriesSelected){
      for(const number of this.numbersAddedLst){      
        if(number.type != 'Combinado'){
          if((number.number.length ==4 && lot.code != 'CASHTHREEDIA' && lot.code != 'CASHTHREENOCHE') || number.number.length == 3 || number.number.length == 2){
            this.total = this.total + +number.price;
          }
        }                 
      }
      if(lot.code != 'CASHTHREEDIA' && lot.code != 'CASHTHREENOCHE'){
        this.total += +this.priceCombined4 + +this.priceCombined3;;
      } else {
        this.total += +this.priceCombined3;;
      }        
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
    for (const loterie of this.loteries){      
      loterie.checked = false;                          
      const ele = document.getElementById(loterie.code) as HTMLInputElement;
      ele.checked = false;
    }                
    this.loteriesSelected = [];
  }

  save(){
    this.isLoading = true;
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
                this.enqueueGame(number);
              }
              this.success();
              this.clearAllData();
            } else {
              alert('El total apostado debe ser mayor a 0');    
            }
          } else {
            alert('Debe ingresar al menos un n??mero');  
          }
        } else {
          alert('Debe seleccionar al menos una loter??a');  
        }
      } else {
        alert('Debe seleccionar un codigo');
      } 
    }else {
      alert('Se perdi?? la sesion, por favor ingrese de nuevo');
    }
    this.isLoading = false;
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

  success(){
    this.isSuccess = true;
    setTimeout(() => this.isSuccess = false, 3000);
  }
  verify(){
    interval(300000).subscribe(x => {      
      var date = new Date();
      var d = date.getDate();
      var m = date.getMonth() + 1; //Month from 0 to 11
      var y = date.getFullYear();
      var dateParam = y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);    
      this.server.getPassed('5000', dateParam, 4, new Date(), this.loteries).then((response : any) => {                  
        if (response.length > 0) {     
          if(this.verifyPending(response, '5000')){
            alert('Hay n??meros por cubrir. Por favor verifique');
          }
        } else {
          this.server.getPassed('20000', dateParam, 3, new Date(), this.loteries).then((response: any) => {                  
            if (response.length > 0) {            
              if(this.verifyPending(response, '20000')){
                alert('Hay n??meros por cubrir. Por favor verifique');
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

  graphics(){
    this.router.navigate(['graphics']);
  }

  users(){
    this.router.navigate(['users']);
  }

  vendors(){
    this.router.navigate(['vendors']);
  }

  loteriesBtn(){
    this.router.navigate(['loteries']);
  }

  sales(){
    this.router.navigate(['sales']);
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['login']);  
  }

  enqueueGame(number){
    if(this.lastest.length > 10){
      this.lastest.pop();
      this.lastest.unshift(number);
    } else {
      this.lastest.unshift(number);
    }   
  }
}
