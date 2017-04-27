import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ListarSeminarios } from '../listar_seminarios/listar_seminarios';
import { CadastrarSeminario } from '../cadastrar_seminario/cadastrar_seminario';

@Component({
   selector: 'page-menu-prof',
   templateUrl: 'menu_prof.html'
})
export class MenuProfessor {

   private nusp: string;

   constructor(public nav: NavController, params: NavParams) {
      this.nusp = params.get('nusp');
   }

   cadastrarSeminario() {
      this.nav.push(CadastrarSeminario);
   }

   listarSeminarios() {
      this.nav.push(ListarSeminarios, {nusp: this.nusp, tipo: 'prof'});
   }

}
