import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Servidor } from '../../service/servidor';
import { MenuAluno } from '../menu_aluno/menu_aluno';
import { MenuProfessor } from '../menu_prof/menu_prof';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

  private tipo: string;
  private nusp: string;
  private senha: string;

  constructor(private nav: NavController, private navParams: NavParams,
              private servidor: Servidor, private alertCtrl: AlertController) {
    this.tipo = navParams.get('tipo');
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
         this.nav.pop();
         this.nav.push(menu, {nusp: this.nusp});
      },
      erro => {
        this.alertCtrl.create({
          title: 'Login',
          subTitle: 'NUSP ou senha incorretos.',
          buttons: ['OK']
        }).present();
      }
    );
  }

  cadastreSe() {

  }

}
