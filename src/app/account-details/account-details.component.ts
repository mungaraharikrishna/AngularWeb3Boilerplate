import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ethers } from 'ethers';
import { Web3Service } from '../services/contract/web3.service';

const isCoinbaseWallet = window.ethereum?.providers?.find((p: any) => (p.isCoinbaseWallet))
const isMetaMask = window.ethereum?.providers?.find((p: any) => (p.isMetaMask))
@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  NFTsList: any[] = []
  constructor(private activatedRoute: ActivatedRoute, private web3: Web3Service, private routre: Router) {
    // if (!isMetaMask?.selectedAddress && !isCoinbaseWallet?.selectedAddress) {
    //   this.routre.navigate(['/home'])
    // }
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(param => {
      let sendObj = {
        // id: '0x02d53ac91ef54bCA4F557aE776579799D6fB4DA3',
        // id: '0xe1a3af7daB1e4616D780052de84a4E7FcE1f0880',
        id: param.get('id'),
      }
      this.web3.getAccountDetails(sendObj).subscribe(res => {
        console.log(res);
        if (res && res.response == 'OK') {
          this.NFTsList = res.nfts;
        }
      }, err => {

      })
    })
  }


  logout() {
    if (isCoinbaseWallet && isCoinbaseWallet.selectedAddress) {
      isCoinbaseWallet.close();
      this.routre.navigate(['/home'])
    } 
    if (isMetaMask && isMetaMask.selectedAddress) {
      isMetaMask._handleStreamDisconnect();
      this.routre.navigate(['/home'])
    }
  }

}
