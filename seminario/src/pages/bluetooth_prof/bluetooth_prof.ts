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
            alert('habilitado')
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
            alert('visivel')
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
            alert('escutando')
            this.escutando = true;
            this.idServidor = idServidor;
            this.bt.onReceive.addListener(this.recebimento);
         },
         erro => {
            alert("ERRO:\n" + erro);
         }
      );
   }

   private recebimento = (receb) => {
      // TODO: dando erro: não chegava o NUSP :P
      let msg = '';
      for (let i in receb)
         msg += i + ' => ' + receb[i] + '\n';
      alert(msg)
      let nusp = stringLida(receb.data);
      //alert('Recebi: ' + nusp);

      // TODO: temos que bater no server!
   }

   ionViewWillUnload() {
      if (this.escutando) {
         alert('parando')
         this.bt.close(this.idServidor);
         this.bt.onReceive.removeListener(this.recebimento);
      }
   }

}

function stringLida(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}
