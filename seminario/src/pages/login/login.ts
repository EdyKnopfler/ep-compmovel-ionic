import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Servidor } from '../../service/servidor';
import { MenuAluno } from '../menu_aluno/menu_aluno';
import { MenuProfessor } from '../menu_prof/menu_prof';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

  private tipo: string;
  private nusp: string;
  private senha: string;

  constructor(public nav: NavController, public navParams: NavParams,
              public servidor: Servidor) {
    this.tipo = navParams.get('tipo');
    alert('recebi o tipo' + this.tipo)
  }

  confirmar() {
    let url, menu;

    if (this.tipo == 'prof') {
      url = 'login/teacher';
      menu = MenuProfessor;
    }
    else {
      url = 'login/student';
      menu = MenuAluno;
    }

    this.servidor.post(url, {'nusp': this.nusp, 'pass': this.senha},
      () => {
        this.nav.push(menu, {nusp: this.nusp});
      },
      erro => {
        alert('NUSP ou senha incorretos.');
      }
    );
  }

  cadastreSe() {

  }

}
