import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Servidor } from '../../service/servidor';

@Component({
   selector: 'page-meus-sem',
   templateUrl: 'meus_seminarios.html'
})
export class MeusSeminarios {

   private seminarios: Array<any>;

   constructor(params: NavParams, private servidor: Servidor) {
      let nusp = params.get('nusp');
      this.listarSeminarios(nusp);
   }

   listarSeminarios(nusp) {
      this.servidor.post('attendence/listSeminars', {'nusp' : nusp},
         resp => {
            this.seminarios = new Array();
            for (let i in resp.data) {
               this.servidor.get('seminar/get/' + resp.data[i].seminar_id,
                  resp => {
                     this.seminarios.push(resp.data.name);
                  },
                  erro => {}
               );
            }
         },
         erro => {
            alert('ERRO:\n' + erro);
         }
      );
   }

}
