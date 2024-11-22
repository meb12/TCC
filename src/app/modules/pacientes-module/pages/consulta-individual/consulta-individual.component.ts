import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultasService } from '../../../../core/services/consultas.service';
import { FuncionariosService } from '../../../../core/services/funcionarios.service';
import { Observable } from 'rxjs';
import { DocumentosService } from '../../../../core/services/documentos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-consulta-individual',
  templateUrl: './consulta-individual.component.html',
  styleUrls: ['./consulta-individual.component.css'],
})
export class ConsultaIndividualComponent implements OnInit {
  data;
  consultaId: string | null = null;
  photo = '';
  isEditing: boolean = false; // Estado para alternar entre visualização e edição
  observationText: string = '';
  files = [];

  constructor(
    private router: Router,
    private consultas: ConsultasService,
    private foto: FuncionariosService,
    private documentos: DocumentosService,
    private toastr: ToastrService
  ) {
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit() {
    const urlSegments = this.router.url.split('/');
    this.consultaId = urlSegments[4];
    this.getConsultas();
  }

  formatarValor(tipo: string, valor: string): string {
    switch (tipo) {
      case 'data':
        const [date] = valor.split('T');
        const [ano, mes, dia] = date.split('-');
        return `${dia}/${mes}/${ano}`;

      case 'telefone':
        return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

      case 'hora':
        const [, time] = valor.split('T'); // Divide a string em data e hora
        const [hora, minuto, segundo] = time.split(':'); // Divide a hora em partes
        return `${hora}:${minuto}`; // Retorna apenas a hora e minuto

      case 'cpf':
        return valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

      case 'rg':
        return valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4');

      default:
        return valor;
    }
    return valor;
  }

  getConsultas() {
    this.consultas.getDataId(this.consultaId).subscribe({
      next: (response) => {
        this.data = response;
        this.getFoto();
      },
      error: (error) => {
        console.error('Erro ao carregar consultas:', error);
      },
    });
  }

  getFoto() {
    this.foto.getDataId(this.data.pacientData.id).subscribe({
      next: (response) => {
        this.photo = response.photo;
        console.log('this.photo', this.photo);
      },
      error: (error) => {
        console.error('Erro ao carregar especialidades:', error);
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

  handleFileUpload(event: Event, tipo: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      const examOrPrescription = tipo;

      // Chama o serviço para realizar o upload
      this.documentos
        .postFile(this.consultaId, examOrPrescription, file)
        .subscribe({
          next: (response) => {
            this.toastr.success('Arquivo cadastrado com sucesso');
            this.getConsultas();
          },
          error: (error) => {
            console.error('Erro ao enviar o arquivo:', error);
          },
        });
    }
  }

  deleteFile(file, tipo: string): void {
    const examOrPrescription = tipo;

    this.documentos.deleteData(file.id, examOrPrescription).subscribe({
      next: (response) => {
        this.toastr.success('Arquivo excluído com sucesso!');
        this.getConsultas();
      },
      error: (error) => {
        console.error('Erro ao enviar o arquivo:', error);
      },
    });
  }

  download(file): void {
    const examOrPrescription = 'exam';

    this.documentos.getData(file.id, examOrPrescription).subscribe({
      next: (response: Blob) => {
        // Força o tipo de conteúdo para PDF
        const contentType = 'application/pdf'; // Defina manualmente como PDF
        const blob = new Blob([response], { type: contentType });

        // Cria uma URL temporária para o arquivo
        const url = window.URL.createObjectURL(blob);

        // Abre o arquivo em uma nova aba
        const newTab = window.open(url, '_blank');
        if (!newTab) {
          console.error(
            'Não foi possível abrir uma nova aba. Verifique permissões.'
          );
        }

        // Opcional: revoga a URL após algum tempo/
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 10000); // 10 segundos
      },
      error: (err) => {
        console.error('Erro ao abrir o arquivo:', err);
      },
    });
  }

  editFile(file): void {
    file.isEditing = true;
    file.newName = file.fileName;
  }

  saveFile(file): void {
    if (file.newName.trim()) {
      file.fileName = file.newName.trim();
    }
    file.isEditing = false;
  }

  receita() {
    this.router.navigateByUrl(
      `pacientes/consulta/receita/${this.consultaId}?medicoId=${this.data.doctorData.id}`
    );
  }

  toggleEdit() {
    this.isEditing = true; // Ativa o modo de edição
  }

  saveObservation() {
    this.isEditing = false; // Salva e volta para o modo de visualização

    const submitForm = {
      id: this.consultaId,
      date: this.data.appointmentDate,
      observation: this.data.observation,
      isActive: this.data.isActive,
    };

    console.log('this', this.data.observation);

    // Verifica se a observação é nula ou vazia
    if (this.data.observation !== null && this.data.observation.trim() !== '') {
      this.consultas.putData(submitForm).subscribe({
        next: (response) => {
          this.toastr.success('Observações salvas com sucesso!');
          this.getConsultas();
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error.error);
          this.getConsultas();
        },
      });
    } else {
      this.toastr.error('Não é possível salvar uma observação vazia');
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Concluída':
        return '#8CC738'; // Verde
      case 'Finalizada':
        return '#EE404C'; // Vermelho
      case 'Agendada':
        return '#398FE2'; // Azul
      default:
        return ''; // Sem cor
    }
  }
}
