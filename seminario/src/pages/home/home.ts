import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Servidor } from '../../service/servidor';
import { Login } from '../login/login';

@Component({
   selector: 'page-home',
   templateUrl: 'home.html'
})
export class HomePage {

   constructor(servidor: Servidor, private nav: NavController,
               private alert: AlertController) {
      servidor.verificarCache(() => {
         this.alert.create({
           title: 'Cache',
           subTitle: 'Dados guardados localmente foram enviados com sucesso.',
           buttons: ['OK']
         }).present();
      });
   }

   login(tipo: string) {
      this.nav.push(Login, {tipo});
   }

}
