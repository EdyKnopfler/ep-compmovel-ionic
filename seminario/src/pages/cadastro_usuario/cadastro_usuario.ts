import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Servidor } from '../../service/servidor';
import { AlertController } from 'ionic-angular';

@Component({
   selector: 'page-cad-usuario',
   templateUrl: 'cadastro_usuario.html',
})
export class CadastroUsuario {

   private tipo: string;
   private nome: string;
   private nusp: string;
   private senha: string;
   private alteracao: boolean;

   constructor(params: NavParams, private nav: NavController,
              private servidor: Servidor, private alertCtrl: AlertController) {
      this.tipo = params.get('tipo');
      if (this.nusp = params.get('nusp')) {
         this.alteracao = true;
         this.trazerDados();
      }
      else
         this.alteracao = false;
   }

   trazerDados() {
      var url;

      if (this.tipo == 'prof')
         url = 'teacher/get/' + this.nusp;
      else
         url = 'student/get/' + this.nusp;

      this.servidor.get(url,
         resp => {
            this.nome = resp.data.name;
         },
         erro => {}
      );
   }

   confirmar() {
      var url;

      if (this.tipo == 'prof')
         url = 'teacher/';
      else
         url = 'student/';

      if (this.alteracao)
         url += 'edit';
      else
         url += 'add';

      this.servidor.post(url, {'name': this.nome, 'nusp': this.nusp, 'pass': this.senha},
         () => {
            this.alertCtrl.create({
               title: 'Cadastro de Usuário',
               subTitle: 'Operação realizada com sucesso!',
               buttons: ['OK']
            }).present();
            this.nav.pop();
         },
         erro => {
            this.alertCtrl.create({
               title: 'Falha no envio',
               subTitle: 'Os dados foram guardados para envio quando o app for reinicializado.',
               buttons: ['OK']
            }).present();
         }
      );
   }

}
