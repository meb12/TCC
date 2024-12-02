import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultasService } from '../../../../core/services/consultas.service';
import { FuncionariosService } from '../../../../core/services/funcionarios.service';
import { Observable } from 'rxjs';
import { DocumentosService } from '../../../../core/services/documentos.service';
import { ToastrService } from 'ngx-toastr';
import { RetornosService } from '../../../../core/services/retornos.service';

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
  isPacienteModalOpen = false;
  isReagendamentoOpen = false;
  tipoConsulta: string | null = null;
  permissoes: any;
  permissoes1: any;

  isButtonEnabled: boolean = false;
  isButtonCancelado: boolean = false;
  showModalExclusao: boolean = false;
  tipo = '';
  idPaciente = 0;
  item: any;

  constructor(
    private router: Router,
    private consultas: ConsultasService,
    private foto: FuncionariosService,
    private documentos: DocumentosService,
    private toastr: ToastrService,
    private retorno: RetornosService
  ) {
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit() {
    const urlSegments = this.router.url.split('/');
    this.consultaId = urlSegments[4];
    this.tipoConsulta = urlSegments[2];
    const permissoesString = localStorage.getItem('userInfo');
    if (permissoesString) {
      this.permissoes1 = JSON.parse(permissoesString);
      this.permissoes = this.permissoes1.userType.permissions;
    } else {
      console.log('Nenhuma permissão encontrada no localStorage.');
    }
    if (this.tipoConsulta == 'consulta') {
      this.getConsultas();
    } else {
      this.getRetorno();
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
        this.idPaciente = response.pacientData.id;
        this.checkButtonState();
        this.checkButtonCancel();
        this.getFoto();
      },
      error: (error) => {
        console.error('Erro ao carregar consultas:', error);
      },
    });
  }
  getRetorno() {
    this.retorno.getDataId(this.consultaId).subscribe({
      next: (response) => {
        // Combina os dados da API com os dados mockados
        this.data = {
          ...response, // Inclui todos os dados da resposta original
          pacientData: {
            id: 136,
            name: 'paciente certo duda',
            email: 'awi@gmail.com',
            cellphone: '11111111111',
            dateOfBirth: '2003-02-12T00:00:00',
            cpf: '82706585021',
            documentNumber: '438425546',
            isActive: true,
            gender: 'Feminino',
            allergies: [
              {
                id: 5,
                allergy: '1',
              },
            ],
          },
        };
        this.getFoto(); // Chama o método getFoto
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
    if (this.tipoConsulta == 'consulta') {
      this.router.navigate(['/pacientes/listagem']);
    } else {
      this.router.navigate([
        `/pacientes/consulta/individual/${this.consultaId}`,
      ]);
    }
  }

  handleFileUpload(event: Event, tipo: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      const file = input.files[0];
      const examOrPrescription = tipo;

      // Limpa o valor do input imediatamente para permitir reenvio do mesmo arquivo
      input.value = '';

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
        // Mapeia extensões para tipos MIME
        const mimeTypeMap: { [key: string]: string } = {
          pdf: 'application/pdf',
          txt: 'text/plain',
          csv: 'text/csv',
          png: 'image/png',
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          zip: 'application/zip',
        };

        // Obtém a extensão do arquivo e o tipo MIME correspondente
        const extension = file.fileExtension.replace('.', '').toLowerCase();

        console.log('extanesao', extension);
        const mimeType = mimeTypeMap[extension]; // Padrão genérico
        console.log(mimeType);

        // Cria um Blob para os dados do arquivo com o tipo MIME apropriado
        const blob = new Blob([response], { type: mimeType });

        // Cria uma URL temporária para o arquivo
        const url = window.URL.createObjectURL(blob);

        // Abre o arquivo em uma nova aba
        const newTab = window.open(url, '_blank');
        if (!newTab) {
          console.error(
            'Não foi possível abrir uma nova aba. Verifique permissões do navegador.'
          );
        }

        // Revoga a URL temporária após algum tempo
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

    // Verifica se a observação é nula ou vazia
    if (this.data.observation !== null && this.data.observation.trim() !== '') {
      if (this.tipoConsulta == 'consulta') {
        this.consultas.putData(submitForm).subscribe({
          next: (response) => {
            this.toastr.success('Observações salvas com sucesso!');
            this.getConsultas();
          },
          error: (error) => {
            this.toastr.error(error.error);
            this.getConsultas();
          },
        });
      } else {
        this.retorno.putData(submitForm).subscribe({
          next: (response) => {
            this.toastr.success('Observações salvas com sucesso!');
            this.getConsultas();
          },
          error: (error) => {
            this.toastr.error(error.error);
            this.getRetorno();
          },
        });
      }
    } else {
      this.toastr.error('Não é possível salvar uma observação vazia');
    }
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

  adicionarNovoRetorno() {
    // Aqui você pode abrir um modal ou redirecionar para uma página de cadastro de retorno.
    this.isPacienteModalOpen = true;
  }

  reagendar() {
    // Aqui você pode abrir um modal ou redirecionar para uma página de cadastro de retorno.
    this.isReagendamentoOpen = true;
  }

  closePacienteModal() {
    this.isPacienteModalOpen = false;
    this.getConsultas();
  }

  closeReagendamentoModal() {
    this.isReagendamentoOpen = false;
    this.getConsultas();
  }

  abrirRetorno(id: number) {
    this.router.navigate([`/pacientes/retorno/individual/${id}`]);
  }

  // Função para calcular a diferença de dias e habilitar/desabilitar o botão
  checkButtonState(): void {
    const appointmentDate = new Date(this.data.appointmentDate); // Data do agendamento
    const currentDate = new Date(); // Data atual

    // Calcula a diferença entre as datas, considerando horas, minutos e segundos
    const diffInTime = appointmentDate.getTime() - currentDate.getTime();

    // Converte a diferença de milissegundos para horas
    const diffInHours = diffInTime / (1000 * 3600); // 1000ms * 3600s

    console.log();
    // Se a diferença for maior ou igual a 24 horas, habilita o botão
    if (diffInHours >= 24) {
      this.isButtonEnabled = true;
    } else {
      this.isButtonEnabled = false;
    }
  }

  checkButtonCancel() {
    if (
      this.data.observation == '' ||
      (this.data.observation == null && this.data.status == 'Agendado') ||
      this.data.status == 'Concluído'
    ) {
      return false;
    }

    return true;
  }

  closeModal() {
    this.showModalExclusao = false;
    this.getConsultas();
  }

  cancelarConsulta() {
    this.showModalExclusao = true;
    this.tipo = 'consulta';
    this.item = {
      id: this.consultaId,
      date: this.data.appointmentDate,
      observation: this.data.observation,
      isActive: false,
      paciente: this.data.pacientData.name,
      dataConsulta: this.formatarValor('data', this.data.appointmentDate),
      sexo: this.data.pacientData.gender,
    };
  }

  canEditObs(): boolean {
    // Verifica se a consulta foi realizada nos últimos 24h a partir de data.appointmentDate
    const now = new Date();
    const appointmentDate = new Date(this.data.appointmentDate); // data.appointmentDate é a data da consulta
    const timeDifference = now.getTime() - appointmentDate.getTime();
    const timeDifferenceInHours = timeDifference / (1000 * 3600);

    // Obtém o objeto userInfo do localStorage e extrai o ID do médico logado
    const userInfo = localStorage.getItem('userInfo');
    const loggedDoctorId = userInfo ? JSON.parse(userInfo).id : null;

    // Verifica se o médico logado é o responsável pela consulta
    const isResponsibleDoctor = this.data.doctorData.id === loggedDoctorId;

    // A observação pode ser editada apenas se o tempo for inferior a 24h após a data da consulta e o médico for o responsável
    return (
      timeDifferenceInHours <= 24 &&
      isResponsibleDoctor &&
      this.permissoes['canEditObsAppointment']
    );
  }
}
