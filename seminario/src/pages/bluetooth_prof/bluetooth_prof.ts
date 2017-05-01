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
   private socket;
   private erro;
   private escutando: boolean;
   private idServidor: number;

	constructor(private nav: NavController, private params: NavParams,
               private plat: Platform) {
      this.idSeminario = params.get('idSeminario');
      this.bt = (<any>window).networking.bluetooth;
      this.socket = (<any>window).chrome.bluetoothSocket;
      this.erro = (<any>window).chrome.runtime;
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
      this.socket.create(info => {
         this.idServidor = info.socketId;
         this.socket.listenUsingRfcomm(this.idServidor, UUID,
            () => {
               if (this.erro.lastError) {
                  alert('ERRO:\n' + this.erro.lastError.message)
                  return;
               }

               this.escutando = true;
               this.socket.onAccept.addListener(() => {
                  // Estou seguindo a documentação... isso não faz com que adicionemos
                  // o cara várias vezes?
                  this.socket.onReceive.addListener(this.recebimento);
                  this.socket.setPaused(false);
               });
            }
         );
      });
   }

   private recebimento = (receb) => {
      // TODO: dando erro: não chegava o NUSP :P
      let msg = '';
      for (let i in receb)
         msg += i + ' => ' + receb[i] + '\n';
      alert(msg)
      let nusp = stringLida(receb.data);
      alert('Recebi: ' + nusp);

      // TODO: temos que bater no server!
   }

   ionViewWillUnload() {
      if (this.escutando) {
         this.socket.onReceive.removeListener(this.recebimento);
         this.socket.disconnect(this.idServidor);
      }
   }

}

function stringLida(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}
