import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-sales-by-vendor',
  templateUrl: './sales-by-vendor.component.html',
  styleUrls: ['./sales-by-vendor.component.scss']
})
export class SalesByVendorComponent implements OnInit {

  isLogged;
  data;
  sum = 0; 
  constructor(
    public router: Router,
    private server : ServerService,
  ) { }

  ngOnInit(): void {
    this.isLogged = sessionStorage.getItem('isLogged');
    this.server.salesByVendor().then((response: any) => {                        
        this.data = response;
        for(const value of response){
          this.sum = this.sum + value.sale
        }
    });
  }

  main(){
    this.router.navigate(['main']);
  }
}
