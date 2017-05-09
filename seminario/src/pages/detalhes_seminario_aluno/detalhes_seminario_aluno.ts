import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BluetoothAluno } from '../bluetooth_aluno/bluetooth_aluno';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Servidor } from '../../service/servidor';
import { AlertController } from 'ionic-angular';

@Component({
   selector: 'page-det-sem',
   templateUrl: 'detalhes_seminario_aluno.html'
})
export class DetalhesSeminarioAluno {

   private id: string;
   private nome: string;
   private nusp: string;

   constructor(private barcodeScanner: BarcodeScanner,
               params: NavParams, private nav: NavController,
               private servidor: Servidor, private alert: AlertController) {
      this.id = params.get('id');
      this.nome = params.get('nome');
      this.nusp = params.get('nusp');
   }

   confirmarPorBluetooth() {
      this.nav.push(BluetoothAluno, {idSeminario: this.id, nusp: this.nusp});
   }

   confirmarPorQR() {
      this.barcodeScanner.scan().then((barcodeData) => {
         alert("Text: " + barcodeData.text + "\n" + "Format: " + barcodeData.format);
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
