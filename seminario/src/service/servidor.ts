import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

const SERVIDOR = 'http://207.38.82.139:8001/';

@Injectable()
export class Servidor {

   private postHeader: Headers;
   private callbackCache;

   constructor(private http: Http, private storage: Storage) {
      this.postHeader = new Headers();
      this.postHeader.append(
            'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
   }

   get(url: string, cbSucesso: (resp) => any, cbErro: (e) => any) {
      this.http.get(SERVIDOR + url).map(res => res.json())
         .subscribe(
            resp => {
               if (resp.success)
                  cbSucesso(resp);
               else
                  cbErro(resp.message);
            },
            erro => {
               cbErro(erro);
            }
         );
   }

   post(url: string, params: { [campo: string]: string },
        cbSucesso: (resp) => any, cbErro: (e) => any, fazerCache: boolean = true) {
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
        cbSucesso: (resp) => any, cbErro: (e) => any, fazerCache: boolean = true) {
      this.http
         .post(SERVIDOR + url, params, {headers: this.postHeader})
         .map(res => res.json())
         .subscribe(
            resp => {
               if (resp.success)
                  cbSucesso(resp);
               else
                  cbErro(resp.message);
            },
            erro => {
               if (fazerCache) this.salvarNoCache(url, params);
               cbErro(erro);
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
      this.get('teacher',
         () => {
            // Temos internet!
            this.enviarPostsNoCache();
            this.callbackCache();
         },
         erro => {}  // sem net ainda...
      );
   }

   private enviarPostsNoCache() {
      this.storage.forEach((url, params) => {
         alert('antes: ' + params);
         let paramsSemHora = params.substring(0, url.indexOf("&__hora"));
         alert('postando: ' + paramsSemHora);
         this.postParams(url, paramsSemHora,
            () => {
               this.storage.remove(params);
            },
            erro => {},
            false,
         );
      });
   }

}
