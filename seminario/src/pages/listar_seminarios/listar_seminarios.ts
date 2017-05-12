import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Servidor } from '../../service/servidor';
import { DetalhesSeminarioProf } from '../detalhes_seminario_prof/detalhes_seminario_prof';

@Component({
   selector: 'page-listar-sem',
   templateUrl: 'listar_seminarios.html'
})
export class ListarSeminarios {

   private nusp: string;
   private tipo: string;
   private seminarios: any;  // resposta json
   private loading: any;
   private items: any;

   constructor(private nav: NavController, private servidor: Servidor,
               params: NavParams, public loadingCtrl: LoadingController) {
      this.nusp = params.get('nusp');
      this.tipo = params.get('tipo');

      this.loading = this.loadingCtrl.create({
         content: `
         <ion-spinner >Carregando</ion-spinner>`
      });

      this.listar();
   }

   listar() {
      this.loading.present();

      this.servidor.get('seminar',
         resp => {
            this.seminarios = resp.data;
            this.initializeItems();
            this.loading.dismiss();
         },
         erro => {
            this.loading.dismiss();
            alert('ERRO:\n' + erro);
         }
      );
   }

   seminarioClick(id: string, nome: string) {
      if (this.tipo == 'prof') {
         this.nav.push(DetalhesSeminarioProf, {id: id, nome: nome,
            callback: () => {
               this.listar();
            }
         });
      }
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
            return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
         })
      }
   }
}
