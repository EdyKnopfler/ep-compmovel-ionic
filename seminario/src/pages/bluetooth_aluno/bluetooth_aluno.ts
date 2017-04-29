import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ViewController, AlertController }
      from 'ionic-angular';
import { UUID } from '../../service/btooth_uuid';

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
               private params: NavParams, private viewCtrl: ViewController,
               private alertCtrl: AlertController) {
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
         alert('iniciei descoberta')
         setTimeout(this.pararDescoberta, 10000);
      });
   }

   private dispositivoDescoberto = (disp) => {
      alert('descobri ' + disp.name)
      this.dispositivos.push({nome: disp.name, mac: disp.address});
   }

   selecaoDispositivo(endereco) {
      this.pararDescoberta();
      this.bt.connect(endereco, UUID,
         socketId => {
            alert('conectei a ' + endereco)
            this.enviarNuspParaProfessor(socketId);
         },
         erro => {
            this.alertCtrl.create({
              title: 'Erro',
              subTitle: 'Não foi possível conectar ao dispositivo. ' +
                        'Verifique se o dispositivo selecionado é o do ' +
                        'professor e se ele autorizou o pareamento.',
              buttons: ['OK']
            }).present();
         }
      );
   }

   enviarNuspParaProfessor(socketId) {
      var buf = criarArrayBuffer(this.nusp);
      this.bt.send(socketId, buf,
         () => {
            //this.bt.close(socketId);
            alert('enviei ' + this.nusp)
            this.alertCtrl.create({
              title: 'Confirmação de Presença',
              subTitle: 'Enviada com sucesso!',
              buttons: ['OK']
            }).present();
            this.nav.pop();
         },
         erro => {
            alert('ERRO: ' + erro);
         }
      );
   }

   private pararDescoberta = () => {
      alert('parei a descoberta')
      this.bt.stopDiscovery();
      this.bt.onDeviceAdded.removeListener(this.dispositivoDescoberto);
      this.descobrindo = false;
   }

   ionViewWillLeave() {
      if (this.descobrindo) this.pararDescoberta();
   }

}

function criarArrayBuffer(str) {
  var buf = new ArrayBuffer(str.length);
  var view = new Uint16Array(buf);

  for (var i = 0, tam = str.length; i < tam; i++)
    view[i] = str.charCodeAt(i);

  return buf;
}
