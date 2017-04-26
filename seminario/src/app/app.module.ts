import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { Servidor } from '../service/servidor';
import { HomePage } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { MenuAluno } from '../pages/menu_aluno/menu_aluno';
import { MenuProfessor } from '../pages/menu_prof/menu_prof';

@NgModule({
  declarations: [
    MyApp,
    /* Insira as novas páginas aqui */
    HomePage,
    Login,
    MenuAluno,
    MenuProfessor
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    /* Insira as novas páginas aqui TAMBÉM! */
    HomePage,
    Login,
    MenuAluno,
    MenuProfessor
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Servidor,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
