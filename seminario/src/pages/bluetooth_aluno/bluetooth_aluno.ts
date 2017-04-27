import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-btooth-aluno',
  templateUrl: 'bluetooth_aluno.html'
})
export class BluetoothAluno {

	private bt;

	constructor(public nav: NavController, private platform: Platform) {
		this.bt = (<any>window).networking.bluetooth;
	}

	ligar() {
		this.platform.ready().then(() => {
			this.bt.requestEnable(
				() => {

				},
				(e) => {
					alert('recusou :P ' + e);
				}
			);
		});
   }

}
