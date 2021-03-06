import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { Servidor } from '../service/servidor';
import { HomePage } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { MenuAluno } from '../pages/menu_aluno/menu_aluno';
import { MenuProfessor } from '../pages/menu_prof/menu_prof';
import { BluetoothAluno } from '../pages/bluetooth_aluno/bluetooth_aluno';
import { BluetoothProfessor } from '../pages/bluetooth_prof/bluetooth_prof';
import { ListarSeminarios } from '../pages/listar_seminarios/listar_seminarios';
import { CadastrarSeminario } from '../pages/cadastrar_seminario/cadastrar_seminario';
import { DetalhesSeminarioProf } from '../pages/detalhes_seminario_prof/detalhes_seminario_prof';
import { MeusSeminarios } from '../pages/meus_seminarios/meus_seminarios';
import { CadastroUsuario } from '../pages/cadastro_usuario/cadastro_usuario';
import { QRCodeModule } from 'angular2-qrcode'; 
import { MostrarQRCode } from '../pages/mostrar_qrcode/mostrar_qrcode'; 
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@NgModule({
   declarations: [
      MyApp,
      /* Insira as novas páginas aqui */
      HomePage,
      Login,
      MenuAluno,
      MenuProfessor,
      BluetoothAluno,
      BluetoothProfessor,
      ListarSeminarios,
      DetalhesSeminarioProf,
      MostrarQRCode, 
      CadastrarSeminario,
      MeusSeminarios,
      CadastroUsuario
   ],
   imports: [
      BrowserModule,
      QRCodeModule, 
      HttpModule,
      IonicModule.forRoot(MyApp),
      IonicStorageModule.forRoot()
   ],
   bootstrap: [IonicApp],
   entryComponents: [
      MyApp,
      /* Insira as novas páginas aqui TAMBÉM! */
      HomePage,
      Login,
      MenuAluno,
      MenuProfessor,
      BluetoothAluno,
      BluetoothProfessor,
      ListarSeminarios,
      DetalhesSeminarioProf,
      MostrarQRCode, 
      CadastrarSeminario,
      MeusSeminarios,
      CadastroUsuario
   ],
   providers: [
      BarcodeScanner,
      StatusBar,
      SplashScreen,
      Servidor,
      {provide: ErrorHandler, useClass: IonicErrorHandler}
   ]
})
export class AppModule {}
