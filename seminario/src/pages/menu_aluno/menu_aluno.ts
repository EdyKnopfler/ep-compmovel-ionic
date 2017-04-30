import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ListarSeminarios } from '../listar_seminarios/listar_seminarios';
import { MeusSeminarios } from '../meus_seminarios/meus_seminarios';

@Component({
   selector: 'page-menu-aluno',
   templateUrl: 'menu_aluno.html'
})
export class MenuAluno {

   private nusp: string;

   constructor(private nav: NavController, params: NavParams) {
      this.nusp = params.get('nusp');
   }

   listarSeminarios() {
      this.nav.push(ListarSeminarios, {nusp: this.nusp, tipo: 'aluno'});
   }

   seminariosQueAssisti() {
      this.nav.push(MeusSeminarios, {nusp: this.nusp});
   }

}
