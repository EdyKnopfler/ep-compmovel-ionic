import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Servidor } from '../../service/servidor';

@Component({
   selector: 'page-meus-sem',
   templateUrl: 'meus_seminarios.html'
})
export class MeusSeminarios {

   private nusp: string;
   private seminarios: Array<any>;
   private loading: any;
   private items: Array<any>;

   constructor(private nav: NavController, private servidor: Servidor,
               params: NavParams, public loadingCtrl: LoadingController) {
      this.nusp = params.get('nusp');

      this.loading = this.loadingCtrl.create({
         content: `
         <ion-spinner >Carregando</ion-spinner>`
      });

      this.listar();
   }

   listar() {
      this.loading.present();

      this.servidor.post('attendence/listSeminars', {'nusp' : this.nusp},
         resp => {
            this.seminarios = new Array();
            this.items = new Array();
            for (let i in resp.data) {
               this.servidor.get('seminar/get/' + resp.data[i].seminar_id,
                  resp => {
                     this.seminarios.push(resp.data.name);
                     this.items.push(resp.data.name);
                  },
                  erro => {}
               );
            }
            this.loading.dismiss();
         },
         erro => {
            this.loading.dismiss();
            alert('ERRO:\n' + erro);
         }
      );
   }

   initializeItems() {
      this.items = this.seminarios.map( (item) => { return item; });
   }

   getItems(ev: any) {
      // Reset items back to all of the items
      this.initializeItems();

      // set val to the value of the searchbar
      let val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
         this.items = this.items.filter((item) => {
            return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
         })
      }
   }
}
