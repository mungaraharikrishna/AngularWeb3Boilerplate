import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ethers } from 'ethers';
import { Web3Service } from '../services/contract/web3.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authenticated: boolean = false;
  data: string[] = [];
  constructor(private web3: Web3Service, private router: Router) { }

  ngOnInit(): void {
  }

  Connect(type: string) {
    this.web3.connectWallet(type).then((response: any) => {
      this.data = response;
      if (this.data) {
        this.router.navigate(['/accountDetails', this.data[0]])
      }
    }).catch(err => {
      console.log(err)
    })
  }

}
