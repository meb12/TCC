import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EspecialidadeService } from '../../../../core/services/especalidades.service';
import { ToastrService } from 'ngx-toastr';
import { MedicosService } from '../../../../core/services/medicos.service';

@Component({
  selector: 'app-exclusao-modal-especialidade',
  templateUrl: './exclusao-modal-especialidade.component.html',
  styleUrls: ['./exclusao-modal-especialidade.component.css'],
})
export class ExclusaoModalEspecialidadeComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>(); // Evento para fechar o modal
  @Input() tipo = '';
  @Input()
  item: {
    id: number;
    specialtyName: string;
    intervalBetweenAppointments: string;
    isActive: boolean;
    cellphone: string;
    cep: string;
    city: string;
    complement: string;
    cpf: string;
    dateOfBirth: string; // ou Date se preferir usar um objeto de data
    doctorData: {
      crm: string;
      observation: string;
      specialtyType: {
        id: number;
        intervalBetweenAppointments: string;
        isActive: boolean;
        specialtyName: string;
      };
    };
    documentNumber: string;
    email: string;
    gender: string;
    login: string;
    name: string;
    neighborhood: string;
    pacientData: any; // Defina o tipo se houver uma estrutura específica para paciente
    stateName: string | null;
    streetName: string;
    streetNumber: number;
    userType: {
      id: number;
      name: string;
      isActive: boolean;
    };
  };
  constructor(
    private especialidades: EspecialidadeService,
    private toastr: ToastrService,
    private medicos: MedicosService
  ) {}
  form: any = {
    description: '',
    intervalBetweenAppointments: '',
    isActive: true,
  };

  formNovo = {};

  ngOnInit() {
    console.log(this.item);
  }

  salvar() {
    if (this.tipo === 'especialidade') {
      const formNovo = {
        id: this.item.id,
        description: this.item.specialtyName,
        intervalBetweenAppointments: this.item.intervalBetweenAppointments,
        isActive: false,
      };
      this.especialidades.putData(formNovo).subscribe({
        next: (response) => {
          this.toastr.success('Especialidade desativada com sucesso!');
          this.closeModal.emit();
        },
        error: (error) => {
          this.toastr.error('Erro, tente novamente!');
        },
      });
    } else {
      console.log('médicos', this.item);
      const formNovo = {
        id: this.item.id,
        cpf: this.item.cpf,
        documentNumber: this.item.documentNumber,
        name: this.item.name,
        dateOfBirth: this.item.dateOfBirth,
        email: this.item.email,
        cellphone: this.item.cellphone,
        userTypeId: this.item.userType.id,
        streetName: this.item.streetName,
        streetNumber: this.item.streetNumber,
        complement: this.item.complement,
        neighborhood: this.item.neighborhood,
        state: this.item.stateName,
        cep: this.item.cep,
        city: this.item.city,
        gender: this.item.gender,
        isActive: false,
        doctorData: {
          crm: this.item.doctorData.crm,
          specialtyTypeId: this.item.doctorData.specialtyType.id,
          observation: this.item.doctorData.observation,
        },
      };

      this.medicos.putData(formNovo).subscribe({
        next: (response) => {
          this.toastr.success('Médico desativado com sucesso!');
          this.closeModal.emit();
        },
        error: (error) => {
          this.toastr.error('Erro, tente novamente!');
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
