import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

@Component({
  selector: 'page-btooth-aluno',
  templateUrl: 'bluetooth_aluno.html'
})
export class BluetoothAluno {

   private idSeminario: string;
   private nusp: string;
	private bt;
   private descobrindo: boolean;
   private dispositivos: Array<object>;
   private

	constructor(private nav: NavController, private plat: Platform,
               private params: NavParams) {
      this.idSeminario = params.get('idSeminario');
      this.nusp = params.get('nusp');
		this.bt = (<any>window).networking.bluetooth;
      this.descobrindo = false;
      this.dispositivos = new Array<object>();
	}

	ionViewDidLoad() {
		this.plat.ready().then(() => {
			this.bt.requestEnable(
				() => {
               this.iniciarDescoberta();
				},
				(e) => {
               // Usuário recusou ligar o bluetooth
               this.nav.pop();
				}
			);
		});
   }

   iniciarDescoberta() {
      this.descobrindo = true;
      this.bt.onDeviceAdded.addListener(this.dispositivoDescoberto);
      this.bt.startDiscovery(() => {
         setTimeout(this.pararDescoberta, 30000);
      });
   }

   private dispositivoDescoberto = (disp) => {
      this.dispositivos.push({nome: disp.name, mac: disp.address});
   }

   confirmar(endereco) {

   }

   private pararDescoberta = () => {
      this.bt.stopDiscovery();
      this.bt.onDeviceAdded.removeListener(this.dispositivoDescoberto);
      this.descobrindo = false;
   }

   ionViewWillLeave() {
      if (this.descobrindo) this.pararDescoberta();
   }

}

function criarArrayBuffer(str) {
  var buf = new ArrayBuffer(str.length * 2);
  var view = new Uint16Array(buf);

  for (var i = 0, tam = str.length; i < tam; i++)
    view[i] = str.charCodeAt(i);

  return buf;
}
