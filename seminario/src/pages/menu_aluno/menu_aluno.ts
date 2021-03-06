import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ListarSeminarios } from '../listar_seminarios/listar_seminarios';
import { MeusSeminarios } from '../meus_seminarios/meus_seminarios';
import { CadastroUsuario } from '../cadastro_usuario/cadastro_usuario';
import { HomePage } from '../home/home';

import { BluetoothAluno } from '../bluetooth_aluno/bluetooth_aluno';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Servidor } from '../../service/servidor';
import { AlertController } from 'ionic-angular';


@Component({
   selector: 'page-menu-aluno',
   templateUrl: 'menu_aluno.html'
})
export class MenuAluno {

   private nusp: string;

   constructor(private nav: NavController, params: NavParams,
               private barcodeScanner: BarcodeScanner,
               private servidor: Servidor, private alert: AlertController) {
      this.nusp = params.get('nusp');
   }

   alterarCadastro() {
      this.nav.push(CadastroUsuario, {tipo: 'aluno', nusp: this.nusp});
   }

   listarSeminarios() {
      this.nav.push(ListarSeminarios, {nusp: this.nusp, tipo: 'aluno'});
   }

   seminariosQueAssisti() {
      this.nav.push(MeusSeminarios, {nusp: this.nusp});
   }

   desconectar() {
      this.nav.setRoot(HomePage, {});
   }

   confirmarPorBluetooth() {
      this.nav.push(BluetoothAluno, {nusp: this.nusp});
   }

   confirmarPorQR() {
      this.barcodeScanner.scan().then((barcodeData) => {
         this.enviarConfirmacao(barcodeData.text);
      }, (err) => {
         alert(err.message);
      });
   }

   enviarConfirmacao(idSeminario) {
      this.servidor.post('attendence/submit',
         {nusp: this.nusp, seminar_id: idSeminario},
         () => {
            this.alert.create({
               title: 'Confirmação de Presença',
               subTitle: 'Enviada com sucesso!',
               buttons: ['OK']
            }).present();
         },
         (erro, tipo) => {
            this.servidor.msgErroPadrao(erro, tipo);
         }
      );
   }

}
