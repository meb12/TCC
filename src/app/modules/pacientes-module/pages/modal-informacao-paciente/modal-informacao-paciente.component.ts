import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConsultasService } from '../../../../core/services/consultas.service';
import { Router } from '@angular/router';
import { FuncionariosService } from '../../../../core/services/funcionarios.service';

@Component({
  selector: 'app-modal-informacao-paciente',
  templateUrl: './modal-informacao-paciente.component.html',
  styleUrls: ['./modal-informacao-paciente.component.css'],
})
export class ModalInformacaoPacienteComponent implements OnInit {
  @Input() data;
  selectedStatus: string = 'Agendada';
  activeTab = 'informacoes';
  Status = [
    { value: 'Agendada', name: 'Agendada' },
    { value: 'Concluída', name: 'Concluída' },
    { value: 'Cancelada', name: 'Cancelada' },
  ];
  form = {
    status: '',
  };
  consultas = []; // Remove os dados mockados e inicializa como um array vazio

  consultasFiltradas: any[] = []; // Armazenar as consultas filtradas

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

      case 'hora':
        // Se o valor contiver uma data/hora no formato 'YYYY-MM-DDTHH:mm:ss'
        const [, hora] = valor.split('T'); // Pega a parte após 'T' (hora:minuto:segundo)
        const [horaFormatada, minutos] = hora.split(':'); // Pega a parte da hora e os minutos
        return `${horaFormatada}:${minutos}`; // Retorna a hora no formato HH:mm

      default:
        return '';
    }
  }

  getFoto() {
    this.foto.getDataId(this.data.id).subscribe({
      next: (response) => {
        this.data.photo = response.photo;
      },
      error: (error) => {
        console.error('Erro ao carregar especialidades:', error);
      },
    });
  }

  getConsultas() {
    this.consultas1.getDataPacienteId(this.data.id).subscribe({
      next: (response) => {
        this.consultas = response;
        this.filterConsultas();
      },
      error: (error) => {
        console.error('Erro ao carregar consultas:', error);
      },
    });
  }

  redirectToConsulta(id: number): void {
    this.router.navigate([`/pacientes/consulta/individual/${id}`]);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Concluída':
        return '#8CC738'; // Verde
      case 'Cancelada':
        return '#EE404C'; // Vermelho
      case 'Agendada':
        return '#398FE2'; // Azul
      default:
        return ''; // Sem cor
    }
  }

  constructor(
    private consultas1: ConsultasService,
    private router: Router,
    private foto: FuncionariosService
  ) {}

  ngOnInit() {
    this.getFoto();
    this.getConsultas(); // Corrige a chamada do método, adicionando os parênteses
  }

  filterConsultas() {
    if (this.form.status) {
      // Filtra as consultas com o status selecionado
      this.consultasFiltradas = this.consultas.filter(
        (consulta) => consulta.status === this.form.status
      );
    } else {
      // Se não houver filtro (status vazio), mostra todas as consultas
      this.consultasFiltradas = [...this.consultas];
    }

    // Ordena as consultas pela data do agendamento (appointmentDate)
    this.consultasFiltradas.sort((a, b) => {
      const dateA = new Date(a.appointmentDate).getTime(); // Converte para timestamp numérico
      const dateB = new Date(b.appointmentDate).getTime(); // Converte para timestamp numérico
      return dateA - dateB; // Ordena do mais antigo para o mais recente
    });
  }
}
