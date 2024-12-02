import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConsultasService } from '../../../../core/services/consultas.service';
import { Router } from '@angular/router';
import { FuncionariosService } from '../../../../core/services/funcionarios.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-revisao-consulta',
  templateUrl: './modal-revisao-consulta.component.html',
  styleUrls: ['./modal-revisao-consulta.component.css'],
})
export class ModalRevisaoConsultaComponent implements OnInit {
  @Input() data;

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

  formatarValor(tipo: string, valor: string, valor2?: string): string {
    switch (tipo) {
      case 'data':
        if (valor.includes('T')) {
          const [date] = valor.split('T');
          const [ano, mes, dia] = date.split('-').map((str) => str.trim()); // Remove espaços extras
          return `${dia}/${mes}/${ano}`;
        } else if (valor.includes('-')) {
          const [ano, mes, dia] = valor.split('-').map((str) => str.trim()); // Remove espaços extras
          return `${dia}/${mes}/${ano}`;
        } else {
          console.error('Formato de data inválido:', valor);
          return '';
        }

      case 'telefone':
        return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

      case 'cpf':
        return valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

      case 'rg':
        return valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4');

      case 'DataHora':
        return valor;
      default:
        return '';
    }
  }

  redirectToConsulta(id: number): void {
    this.router.navigate([`/pacientes/consulta/individual/${id}`]);
  }

  constructor(
    private consultas: ConsultasService,
    private router: Router,
    private foto: FuncionariosService,
    private toastr: ToastrService
  ) {}

  salvar() {
    const submitForm = {
      date: `${this.data.date.trim()}T${this.data.horario.trim()}`,
      observation: null,
      isActive: true,
      doctorId: this.data.doctorId,
      pacientId: this.data.idPaciente,
    };

    this.consultas.postData(submitForm).subscribe({
      next: (response) => {
        this.toastr.success('Consulta agendada com sucesso!');
        this.router.navigateByUrl('/pacientes/listagem');
      },
      error: (error) => {
        this.toastr.error('Erro ao cadastrar paciente. Tente novamente.');
      },
    });
  }
  ngOnInit() {
    console.log(this.data);
  }
}
