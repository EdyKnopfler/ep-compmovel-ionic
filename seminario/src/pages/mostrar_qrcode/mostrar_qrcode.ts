import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {QRCodeComponent} from 'angular2-qrcode';
import {Platform} from 'ionic-angular';

@Component({
  selector: 'page-mostrar-qrcode',
  templateUrl: 'mostrar_qrcode.html'
})
export class MostrarQRCode {
   private urlImage: string;
   private Width: number;
   
   constructor(public params: NavParams, public platform: Platform,
               public navCtrl: NavController)
   {   
      platform.ready().then((readySource) => {
         this.Width = platform.width();
      });
      this.urlImage = params.get('seminar_id');
   }
}
