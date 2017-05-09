import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Servidor } from '../../service/servidor';
import { AlertController } from 'ionic-angular';
import { CadastrarSeminario } from '../cadastrar_seminario/cadastrar_seminario';
import { BluetoothProfessor } from '../bluetooth_prof/bluetooth_prof';
import { MostrarQRCode } from '../mostrar_qrcode/mostrar_qrcode'; // <-------- angular2-qrcode

@Component({
   selector: 'page-det-sem',
   templateUrl: 'detalhes_seminario_prof.html'
})
export class DetalhesSeminarioProf {

   private id: string;
   private nome: string;
   private alunos: Array<any>;
   private callback: () => void;
   private loading: any;

   constructor(private servidor: Servidor, params: NavParams,
               private alertCtrl: AlertController, private nav: NavController,
               public loadingCtrl: LoadingController) {
      this.id = params.get('id');
      this.nome = params.get('nome');
      this.callback = params.get('callback');

      this.loading = this.loadingCtrl.create({
         content: '<ion-spinner >Carregando</ion-spinner>'
      });

      this.listarAlunos();
   }

   mostrarQRCode() {
      this.nav.push(MostrarQRCode, {'seminar_id' : this.id});
   }

   listarAlunos() {
      this.loading.present();

      this.servidor.post('attendence/listStudents', {'seminar_id' : this.id},
         resp => {
            this.alunos = new Array();
            for (let i in resp.data) {
               let a:any = {};
               a.nusp = resp.data[i].student_nusp;
               this.servidor.get('student/get/' + a.nusp,
                  resp => {
                     a.nome = resp.data.name;
                     this.alunos.push(a);
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

   confirmarPresenca() {
      this.nav.push(BluetoothProfessor, {idSeminario: this.id,
         callback: () => {
            this.listarAlunos();
         }
      });
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
