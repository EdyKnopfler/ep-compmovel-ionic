import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Servidor } from '../../service/servidor';
import { AlertController } from 'ionic-angular';
import { CadastrarSeminario } from '../cadastrar_seminario/cadastrar_seminario';

@Component({
   selector: 'page-det-sem',
   templateUrl: 'detalhes_seminario.html'
})
export class DetalhesSeminario {

   private id: string;
   private nome: string;
   private alunos: object;  // resposta json
   private callback: () => void;

   constructor(private servidor: Servidor, params: NavParams,
               private alertCtrl: AlertController, private nav: NavController) {
      this.id = params.get('id');
      this.nome = params.get('nome');
      this.callback = params.get('callback');
      this.listarAlunos();
   }

   listarAlunos() {
      this.servidor.post('attendence/listStudents', {'seminar_id' : this.id},
         resp => {
            // TODO Estou fazendo uma suposição sobre o formato dos dados na view :P
            this.alunos = resp.data;
         },
         erro => {
            alert('ERRO:\n' + erro);
         }
      );
   }

   confirmarPresenca() {
      // TODO aqui chamará a tela de bluetooth :)
   }

   alterar() {
      this.nav.push(CadastrarSeminario, {id: this.id, nome: this.nome,
         callback: novoNome => {
            this.nome = novoNome;
         }
      });
   }

   excluir() {
      this.alertCtrl.create({
         title: 'Excluir Seminário',
         message: 'Confirma a exclusão?',
         buttons: [
            {
               text: 'Sim',
               handler: () => {
                  this.efetuarExclusao();

               }
            },
            {
               text: 'Não',
               handler: () => {}
            }
         ]
      }).present();
   }

   efetuarExclusao() {
      this.servidor.post('seminar/delete', {'id' : this.id},
         resp => {
            this.nav.pop();
         },
         erro => {
            alert('ERRO:\n' + erro);
         }
      );
   }

   ionViewWillUnload() {
      if (this.callback)
         this.callback();
   }

}
