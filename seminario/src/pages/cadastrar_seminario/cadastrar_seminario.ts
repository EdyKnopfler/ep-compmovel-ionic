import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Servidor } from '../../service/servidor';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-cad-seminario',
  templateUrl: 'cadastrar_seminario.html',
})
export class CadastrarSeminario {

   private id: string;
   private nome: string;
   private callback: (novoNome: string) => void;

   constructor(private nav: NavController, params: NavParams,
               private servidor: Servidor, private alert: AlertController) {
      // id é opcional, não vem se estiver cadastrando novo seminário
      this.id = params.get('id');
      this.nome = params.get('nome');
      this.callback = params.get('callback');
   }

   confirmar() {
      let url, campos;

      if (this.id) {
         url = 'seminar/edit';
         campos = {id: this.id, name: this.nome}
      }
      else {
         url = 'seminar/add';
         campos = {name: this.nome};
      }

      this.servidor.post(url, campos,
         (resp) => {
            this.alert.create({
              title: 'Cadastrar Seminário',
              subTitle: 'Operação efetuada com sucesso.',
              buttons: ['OK']
            }).present();

            this.nav.pop();

            if (this.callback)
               this.callback(this.nome);
         },
         erro => {
            alert('ERRO:\n' + erro);
         }
      );
   }

}
