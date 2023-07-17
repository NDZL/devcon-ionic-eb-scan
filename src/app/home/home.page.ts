import { Component, inject } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { MessageComponent } from '../message/message.component';
import {  NgZone } from "@angular/core";
import { DataService, Message } from '../services/data.service';


declare var EB: any;


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  public txtIn="---";
  public barcode_data="0123456789ABCDEF";
  public barcode_symb = "DATAWEDGE";
  public _debug_intent_Received="";
  

  constructor(private zone: NgZone) {
        // log to /sdcard/Android/data/com.zebra.enterprisebrowser/Log.txt
        EB.Log.info('NDZL Ionic test call', 'EB HomePage'); 
        
        EB.Intent.startListening((info: any) => {
          var dwreading =Object.values(info.data)[3]  +" - "+ Object.values(info.data)[2] ;
          console.log('intent '+dwreading+' received from dwBarcodeReading');
          if(this.barcode_data != ""+Object.values(info.data)[3]) {
            this.barcode_data  = ""+Object.values(info.data)[3];
            this.barcode_symb = ""+Object.values(info.data)[2];
            this.printDWreading(dwreading);  
            console.log('intent '+dwreading+' received from dwBarcodeReading');  
          }      
        });

  }

  ionicViewDidEnter(){  

  }

  btnClicked(){
    this.triggerBarcodeScanner()

  }

  async printDWreading(s: string){
    
    this.zone.run(() => {
     this.txtIn = s;  //write to UI
    });
    
  }
  
  async triggerBarcodeScanner(){
          var extra= {'com.symbol.datawedge.api.SOFT_SCAN_TRIGGER' : 'START_SCANNING'};
          var params = {
                          intentType: EB.Intent.BROADCAST,
                        action: 'com.symbol.datawedge.api.ACTION',
                        data: extra
                      };
          EB.Intent.send(params);


  }

/*   refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  } */


  private _last_bcd = "";
  private  msgarr: Message[] = [];
  getMessages(): Message[] {
   //return this.data.getMessages();

   if(this._last_bcd != this.barcode_data){
    this._last_bcd = this.barcode_data;
     var msg : Message={
      fromName: 'Nik DZL',
      subject: 'New event: Zebra DevCon 2023',
      date: '9:32 AM',
      id: 0,
      read: false
    };
    msg.fromName=this.barcode_data;  
    msg.subject=this.barcode_symb;  

    //this.msgarr.splice(0);
        console.log('msgarr '+this.msgarr.length);
    this.msgarr.reverse().push(msg);
    return this.msgarr.reverse();
  }else{
      return this.msgarr;
    } 
 }
}
