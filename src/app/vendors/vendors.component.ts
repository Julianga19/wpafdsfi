import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {

  vendorLst;
  newVendor;
  isLogged;

  constructor(
    public router: Router,
    private server : ServerService,
  ) { }

  ngOnInit(): void {
    this.isLogged = sessionStorage.getItem('isLogged');
    this.server.getVendors().then((response) => {
      this.vendorLst = response;    
    });
  }

  main(){
    this.router.navigate(['main']);
  }

  save(){
    this.server.addVendor(this.newVendor).then((response) => {
      this.server.getVendors().then((response) => {
        this.vendorLst = response;    
      });
      this.newVendor = undefined;
    });
  }

  delete(value){    
    this.server.deleteVendor(value.code).then((response) => {
      this.server.getVendors().then((response) => {
        this.vendorLst = response;    
      });
    });
  }
}