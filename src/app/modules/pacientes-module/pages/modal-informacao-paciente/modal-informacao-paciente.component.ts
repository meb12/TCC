import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConsultasService } from '../../../../core/services/consultas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-informacao-paciente',
  templateUrl: './modal-informacao-paciente.component.html',
  styleUrls: ['./modal-informacao-paciente.component.css'],
})
export class ModalInformacaoPacienteComponent implements OnInit {
  @Input() data;

  activeTab = 'informacoes';

  consultas = []; // Remove os dados mockados e inicializa como um array vazio

  activateTab(tab: string) {
    this.activeTab = tab;
  }

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit(); // Emit the close event to the parent component
  }
  onBackdropClick(event: MouseEvent) {
    // Check if the click was outside the modal element
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-container')) {
      this.closeModal();
    }
  }

  formatarValor(tipo: string, valor: string): string {
    switch (tipo) {
      case 'data':
        const [date] = valor.split('T');
        const [ano, mes, dia] = date.split('-');
        return `${dia}/${mes}/${ano}`;

      case 'telefone':
        return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

      case 'cpf':
        return valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

      case 'rg':
        return valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4');

      default:
        return '';
    }
  }

  getConsultas() {
    this.consultas1.getDataPacienteId(this.data.id).subscribe({
      next: (response) => {
        this.consultas = response; // Popula a lista de consultas com os dados da resposta
        console.log('Consultas carregadas:', this.consultas);
      },
      error: (error) => {
        console.error('Erro ao carregar consultas:', error);
      },
    });
  }

  redirectToConsulta(id: number): void {
    this.router.navigate([`/pacientes/consulta/individual/${id}`]);
  }

  constructor(private consultas1: ConsultasService, private router: Router) {}

  ngOnInit() {
    console.log('infos', this.data);
    this.getConsultas(); // Corrige a chamada do método, adicionando os parênteses
  }
}
