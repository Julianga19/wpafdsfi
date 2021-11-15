import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-chart-typed-by-user',
  templateUrl: './chart-typed-by-user.component.html',
  styleUrls: ['./chart-typed-by-user.component.scss']
})
export class ChartTypedByUserComponent implements OnInit {

  isLogged;
  isLoading;
  data = [];
  barChartLabels = [];
  barChartData = [];
  barData = [];

  constructor(
    public router: Router,
    private server : ServerService,
  ) { }

  ngOnInit(): void {
    this.isLogged = sessionStorage.getItem('isLogged');
    this.server.graphicsByUser().then((response: any) => {                        
        this.data = response;
        for(const value of response){
          this.barChartLabels.push(value.username); 
          this.barData.push(value.saved);         
        }
    });
    this.barChartData.push({data: this.barData});
  }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };  
  public barChartType = 'bar';
  public barChartLegend = true;  

  main(){
    this.router.navigate(['main']);
  }
}
