import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EspecialidadeService } from '../../../../core/services/especalidades.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-nova-especialidade',
  templateUrl: './especialidades-modal.component.html',
  styleUrls: ['./especialidades-modal.component.css'],
})
export class EspecialidadesModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>(); // Evento para fechar o modal
  @Input() tipo = '';
  @Input()
  item: {
    id: number;
    description: string;
    intervalBetweenAppointments: string;
    isActive: boolean;
  };
  constructor(
    private especialidades: EspecialidadeService,
    private toastr: ToastrService
  ) {}
  form: any = {
    description: '',
    intervalBetweenAppointments: '',
    isActive: true,
  };

  formNovo = {};

  ngOnInit() {
    if (this.tipo == 'editar') {
      this.form = {
        description: this.item.description,
        intervalBetweenAppointments: this.item.intervalBetweenAppointments,
        isActive: this.item.isActive,
      };
    }
  }

  salvar() {
    if (this.tipo == 'cadastrar') {
      this.especialidades.postData(this.form).subscribe({
        next: (response) => {
          this.toastr.success('Especialidade cadastrada com sucesso!');
          this.closeModal.emit();
        },
        error: (error) => {
          this.toastr.success(error);
        },
      });
    }
    if (this.tipo == 'editar') {
      const formNovo = {
        id: this.item.id,
        description: this.form.description,
        intervalBetweenAppointments: this.form.intervalBetweenAppointments,
        isActive: this.form.isActive,
      };
      this.especialidades.putData(formNovo).subscribe({
        next: (response) => {
          this.toastr.success('Especialidade cadastrada com sucesso!');
          this.closeModal.emit();
        },
        error: (error) => {
          this.toastr.success(error);
        },
      });
    }
  }

  formValido() {
    if (
      this.form.description == '' ||
      this.form.intervalBetweenAppointments == ''
    )
      return true;
    return false;
  }

  voltar() {
    // Lógica para voltar

    this.closeModal.emit(); // Fecha o modal ao clicar em "Voltar"
  }

  closeOnClickOutside(event: MouseEvent) {
    // Fecha o modal se o usuário clicar fora do conteúdo do modal
    this.closeModal.emit();
  }
}
