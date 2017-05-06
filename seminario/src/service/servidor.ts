import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

const SERVIDOR = 'http://207.38.82.139:8001/';

@Injectable()
export class Servidor {

   public static ERRO_CONEXAO = 1;
   public static ERRO_DADO_INVALIDO = 2;

   private postHeader: Headers;
   private callbackCache;

   constructor(private http: Http, private storage: Storage,
               private alert: AlertController) {
      this.postHeader = new Headers();
      this.postHeader.append(
            'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
   }

   get(url: string, cbSucesso: (resp) => any, cbErro: (erro, tipo) => any) {
      this.http.get(SERVIDOR + url).map(res => res.json())
         .subscribe(
            resp => {
               if (resp.success)
                  cbSucesso(resp);
               else
                  cbErro(resp.message, Servidor.ERRO_DADO_INVALIDO);
            },
            erro => {
               cbErro(erro, Servidor.ERRO_CONEXAO);
            }
         );
   }

   post(url: string, params: { [campo: string]: string },
        cbSucesso: (resp) => any, cbErro: (erro, tipo) => any,
        fazerCache: boolean = true) {
      let parametros = '';

      for (let campo in params)
         parametros += '&' + campo + '=' + encodeURIComponent(params[campo]);

      parametros = parametros.substring(1);  // tirar o 1o. "&"
      this.postParams(url, parametros, cbSucesso, cbErro, fazerCache);
   }

   verificarCache(callback) {
      this.callbackCache = callback;
      this.storage.length().then(num => {
         if (num > 0) this.testaInternet();
      });
   }

   private postParams(url: string, params: string,
        cbSucesso: (resp) => any, cbErro: (erro, tipo) => any,
        fazerCache: boolean = true) {
      this.http
         .post(SERVIDOR + url, params, {headers: this.postHeader})
         .map(res => res.json())
         .subscribe(
            resp => {
               if (resp.success)
                  cbSucesso(resp);
               else
                  cbErro(resp.message, Servidor.ERRO_DADO_INVALIDO);
            },
            erro => {
               if (fazerCache) this.salvarNoCache(url, params);
               cbErro(erro, Servidor.ERRO_CONEXAO);
            }
         );
   }

   private salvarNoCache(url: string, parametros: string) {
      this.storage.ready().then(() => {
         // Não sobrescrever requisições iguais
         parametros += "&__hora=" + Date.now();
         this.storage.set(parametros, url);
      });
   }

   private testaInternet() {
      this.get('teacher/get/0',
         () => {
            // Temos internet!
            this.enviarPostsNoCache();
            this.callbackCache();
         },
         (erro, tipo) => {
            if (tipo == Servidor.ERRO_DADO_INVALIDO) {
               this.enviarPostsNoCache();
               this.callbackCache();
            }
            // caso contrário, ainda sem net ...
         }
      );
   }

   private enviarPostsNoCache() {
      this.storage.forEach((url, params) => {
         let paramsSemHora = params.substring(0, params.indexOf("&__hora"));
         this.postParams(url, paramsSemHora,
            () => {
               this.storage.remove(params);
            },
            (erro, tipo) => {
               if (tipo == Servidor.ERRO_DADO_INVALIDO) {
                  this.storage.remove(params);
                  this.msgErroPadrao('O dado foi rejeitado pelo servidor:\n' +
                     erro, Servidor.ERRO_DADO_INVALIDO);
               }
            },
            false,
         );
      });
   }

   msgErroPadrao(erro, tipo) {
      var msg;

      if (tipo == Servidor.ERRO_DADO_INVALIDO)
         msg = erro;
      else
         msg = 'Os dados foram guardados para envio quando o app for reinicializado.';

      this.alert.create({
         title: 'Falha no envio',
         subTitle: msg,
         buttons: ['OK']
      }).present();
   }

}
