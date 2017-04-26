import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

const SERVIDOR = 'http://207.38.82.139:8001/';

@Injectable()
export class Servidor {

  private postHeader: Headers;

  constructor(private http: Http) {
    this.postHeader = new Headers();
    this.postHeader.append(
        'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  }

  post(url: string, params: { [campo: string]: string },
       cbSucesso: (resp) => any, cbErro: (e) => any) {
    let parametros = '';

    for (let campo in params)
      parametros += '&' + campo + '=' + params[campo];

    parametros = parametros.substring(1);  // tirar o 1o. "&"

    this.http
        .post(SERVIDOR + url, parametros, this.postHeader)
        .map(res => res.json())
        .subscribe(
          resp => {
            if (resp.success == 'true')
              cbSucesso(resp);
            else
              cbSucesso(resp);
              // TODO Por hora ignorando o success :P
              // cbErro(resp.message);
          },
          erro => {
            cbErro(erro);
          }
        );
  }

}
