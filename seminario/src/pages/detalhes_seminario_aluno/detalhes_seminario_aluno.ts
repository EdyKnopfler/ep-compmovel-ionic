import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BluetoothAluno } from '../bluetooth_aluno/bluetooth_aluno';

@Component({
   selector: 'page-det-sem',
   templateUrl: 'detalhes_seminario_aluno.html'
})
export class DetalhesSeminarioAluno {

   private id: string;
   private nome: string;
   private nusp: string;

   constructor(params: NavParams, private nav: NavController) {
      this.id = params.get('id');
      this.nome = params.get('nome');
      this.nusp = params.get('nusp');
   }

   confirmarPorBluetooth() {
      this.nav.push(BluetoothAluno, {idSeminario: this.id, nusp: this.nusp});
   }

   confirmarPorQR() {

   }

}
