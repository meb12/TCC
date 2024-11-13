import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultasService } from '../../../../core/services/consultas.service';

@Component({
  selector: 'app-consulta-individual',
  templateUrl: './consulta-individual.component.html',
  styleUrls: ['./consulta-individual.component.css'],
})
export class ConsultaIndividualComponent implements OnInit {
  data;
  consultaId: string | null = null;

  files = [{ name: 'RaioX54' }, { name: 'ReMa55' }, { name: 'Receita1' }];

  constructor(private router: Router, private consultas: ConsultasService) {
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit() {
    const urlSegments = this.router.url.split('/');
    this.consultaId = urlSegments[4];
    this.getConsultas();
  }

  formatarValor(tipo: string, valor: string): string {
    switch (tipo) {
      // case 'data':
      //   const [date] = valor.split('T');
      //   const [ano, mes, dia] = date.split('-');
      //   return `${dia}/${mes}/${ano}`;

      // case 'telefone':
      //   return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

      // case 'cpf':
      //   return valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

      // case 'rg':
      //   return valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4');

      default:
        return valor;
    }
    return valor;
  }

  getConsultas() {
    this.consultas.getDataId(this.consultaId).subscribe({
      next: (response) => {
        this.data = response;
      },
      error: (error) => {
        console.error('Erro ao carregar consultas:', error);
      },
    });
  }
  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }
  voltar() {
    this.router.navigate(['/pacientes/listagem']);
  }
}
