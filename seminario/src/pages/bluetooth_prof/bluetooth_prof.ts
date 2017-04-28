import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { UUID } from '../../service/btooth_uuid';

@Component({
  selector: 'page-btooth-prof',
  templateUrl: 'bluetooth_prof.html'
})
export class BluetoothProfessor {

   private idSeminario: string;
   private bt;
   private escutando: boolean;
   private idServidor: number;

	constructor(private nav: NavController, private params: NavParams,
               private plat: Platform) {
      this.idSeminario = params.get('idSeminario');
      this.bt = (<any>window).networking.bluetooth;
      this.escutando = false;
   }

   ionViewDidLoad() {
      this.plat.ready().then(() => {
         this.habilitarBluetooth();
		});
   }

   habilitarBluetooth() {
      this.bt.requestEnable(
         () => {
            this.habilitarVisibilidade();
         },
         () => {
            // Usuário recusou ligar o Bluetooth
            this.nav.pop();
         }
      );
   }

   habilitarVisibilidade() {
      this.bt.requestDiscoverable(
         () => {
            this.iniciarEscuta();
         },
         () => {
            // Usuário recusou ficar visível
            this.nav.pop();
         }
      );
   }

   iniciarEscuta() {
      this.bt.listenUsingRfcomm(
         UUID,
         idServidor => {
            this.escutando = true;
            this.idServidor = idServidor;
            this.bt.onReceive.addListener(this.recebimento);
         },
         erro => {
            alert("ERRO:\n" + erro);
         }
      );
   }

   recebimento(receb) {
      // TODO: dando erro: não chegava o NUSP :P
      let nusp = stringLida(receb.data);
      // TODO: temos que bater no server!
   }

   ionViewWillUnload() {
      if (this.escutando) {
         this.bt.close(this.idServidor);
         this.bt.onReceive.removeListener(this.recebimento);
      }
   }

}

function stringLida(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}
