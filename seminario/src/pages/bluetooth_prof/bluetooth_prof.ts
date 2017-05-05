import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { UUID } from '../../service/btooth_uuid';
import { Servidor } from '../../service/servidor';

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
               private plat: Platform, private servidor: Servidor) {
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
      // Esquisito mas é assim que veio do plugin!
      let nusp = receb.socketId.data;

      this.servidor.post('attendence/submit',
         {nusp: nusp, seminar_id: this.idSeminario},
         () => {
            // TODO: callback para a tela de detalhes do seminário atualizar a lista de alunos!
            alert('sucésso');
            this.nav.pop();
         },
         erro => {
            alert("ERRO:\n" + erro);
         }
      )
   }

   ionViewWillUnload() {
      if (this.escutando) {
         alert('parando')
         this.bt.close(this.idServidor);
         this.bt.onReceive.removeListener(this.recebimento);
      }
   }

}
