import { Inject, Injectable } from '@angular/core';
import { WEB3 } from '../../core/web3';
import { map, Subject } from 'rxjs';
import Web3 from 'web3';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { provider } from 'web3-core';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { HttpClient, HttpHandler, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  public accountsObservable = new Subject<string[]>();
  // web3Modal;
  web3js: any;
  provider: provider | undefined;
  accounts: string[] = [];
  balance: string | undefined;

  constructor(@Inject(WEB3) private web3: Web3, @Inject(HttpClient) private http: HttpClient) {
    // const providerOptions = {
    //   coinbasewallet: {
    //     package: CoinbaseWalletSDK, // Required
    //     options: {
    //       appName: "Web 3 Modal Demo", // Required
    //       infuraId: '0x0122D973d612B48658508bA3091C2565d4f6F5B5' // Required unless you provide a JSON RPC url; see `rpc` below
    //     }
    //   },
    //   walletconnect: {
    //     package: WalletConnectProvider, // required
    //     options: {
    //       infuraId: '0xd13c933350388c43ae94B9c3c54811d943258e12', // required change this with your own infura id
    //       description: 'Scan the qr code and sign in',
    //       qrcodeModalOptions: {
    //         mobileLinks: [
    //           'rainbow',
    //           'metamask',
    //           'argent',
    //           'trust',
    //           'imtoken',
    //           'pillar'
    //         ]
    //       }
    //     }
    //   },
    //   injected: {
    //     display: {
    //       logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
    //       name: 'metamask',
    //       description: "Connect with the provider in your Browser"
    //     },
    //     package: null
    //   },
    // };

    // this.web3Modal = new Web3Modal({
    //   cacheProvider: true,
    //   providerOptions, // required
    // });
    
  }

  connectWallet = async (type: string) => {
    if (type == 'Coinbase') {
      if (window.ethereum) {
        if (!window.web3.__isMetaMaskShim__) {
          let provider = window.ethereum;
          // edge case if MM and CBW are both installed
          if (window.ethereum.providers?.length) {
            window.ethereum.providers.forEach(async (p: any) => {
              if (p.isCoinbaseWallet) provider = p;
            });
          }
          let key = await provider.request({
            method: "eth_requestAccounts",
            params: [],
          });
          let val = await key;
          return new Promise((resove, reject) => {
            resove(val);
          })
        } else {
          return new Promise((resove, reject) => {
            reject({message: 'Please install coinbase extention'});
          })
        }
      } else {
        return new Promise((resove, reject) => {
          reject({message: 'Please install coinbase extention'});
        })
      }
    } else {
      if (window.ethereum) {
        let provider = window.ethereum;
        if (window.ethereum.providers?.length) {
          window.ethereum.providers.forEach(async (p: any) => {
            console.log(p.isMetaMask)
            if (p.isMetaMask) provider = p;
          });
        }
        if (window.ethereum.isMetaMask) {
          let key = await provider.request({
            method: "eth_requestAccounts",
            params: [],
          });
          let val = await key;
          return new Promise((resove, reject) => {
            resove(val);
          })
        } else {
          return new Promise((resove, reject) => {
            reject({message: 'Please install metamask extention'});
          })
        }
      } else {
        return new Promise((resove, reject) => {
          reject({message: 'Please install metamask extention'});
        })
      }
    }
  };

  async connectAccount(type: string) {
    // let providerType = type == 'Coinbase' ? "coinbasewallet" : "injected";
    // this.provider = await this.web3Modal.connectTo(providerType); // set provider
    // if (this.provider) {
    //   window.web3 = new Web3(this.provider);
    // } // create web3 instance
    // this.accounts = await window.web3.eth.getAccounts();
    // return this.accounts;
  }
  // Subscribe to accounts change

  async accountInfo(account: any[]) {
    const initialvalue = await this.web3js.eth.getBalance(account);
    this.balance = this.web3js.utils.fromWei(initialvalue, 'ether');
    return this.balance;
  }

  getAccountDetails(reqObj: any) {
    let params = new HttpParams();
    params = params.set('chain', 'ethereum');
    params = params.set('include', 'metadata');
    let header = new HttpHeaders();
    header = header.set('Authorization', '6c3a6075-e91b-4375-a381-f6a257baaaa9');
    return this.http.get(`https://api.nftport.xyz/v0/accounts/${reqObj.id}`, { headers: header, params: params }).pipe(map((res: any) => {
      return res;
    }))
  }

}

