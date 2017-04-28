import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Servidor } from '../../service/servidor';
import { DetalhesSeminarioProf } from '../detalhes_seminario_prof/detalhes_seminario_prof';
import { DetalhesSeminarioAluno } from '../detalhes_seminario_aluno/detalhes_seminario_aluno';

@Component({
   selector: 'page-listar-sem',
   templateUrl: 'listar_seminarios.html'
})
export class ListarSeminarios {

   private nusp: string;
   private tipo: string;
   private mensagem: string;
   private seminarios: object;  // resposta json

   constructor(private nav: NavController, private servidor: Servidor,
               params: NavParams) {
      this.nusp = params.get('nusp');
      this.tipo = params.get('tipo');

      if (this.tipo == 'prof')
         this.mensagem = 'Para confirmações de presença e listagem de alunos, ' +
                         'selecione um seminário';
      else
         this.mensagem = 'Selecione um seminário para confirmar presença.';

      this.listar();
   }

   listar() {
      this.servidor.get('seminar',
         resp => {
            this.seminarios = resp.data;
         },
         erro => {
            alert('ERRO:\n' + erro);
         }
      );
   }

   seminarioClick(id: string, nome: string) {
      if (this.tipo == 'prof') {
         this.nav.push(DetalhesSeminarioProf, {id: id, nome: nome,
            callback: () => {
               this.listar();
            }
         });
      }
      else
         this.nav.push(DetalhesSeminarioAluno, {id: id, nome: nome, nusp: this.nusp});
   }

}
