import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConsultasService } from '../../../../core/services/consultas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionariosService } from '../../../../core/services/funcionarios.service';
import { ToastrService } from 'ngx-toastr';
import { MedicosService } from '../../../../core/services/medicos.service';
import { PacientesService } from '../../../../core/services/pacientes.service';
import { EspecialidadeService } from '../../../../core/services/especalidades.service';
import { RetornosService } from '../../../../core/services/retornos.service';

@Component({
  selector: 'app-modal-revisao-retorno',
  templateUrl: './modal-revisao-retorno.component.html',
  styleUrls: ['./modal-revisao-retorno.component.css'],
})
export class ModalRevisaoRetornoComponent implements OnInit {
  @Input() data;

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit(); // Emit the close event to the parent component
  }
  voltar() {
    this.step = 1;
  }
  onBackdropClick(event: MouseEvent) {
    // Check if the click was outside the modal element
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-container')) {
      this.closeModal();
    }
  }

  step = 1;

  form: any = {
    especialidades: '',
    especialidadeNome: '',
    medico: '',
    nomeMedico: '',
    date: '',
    horario: '',
    observacao: null,
  };

  medicosOptions = [];

  especialidadesData: any[] = [];
  filteredMedicos: any[] = [];
  private lastMedicoValue: any = null;
  private lastDateValue: string = '';
  unavailableTimes = {
    doctorId: 1,
    doctorName: 'Dr. João Silva',
    spcialty: [{ name: 'Cardiologista', id: 2, interval: '01:30' }],
    unavailableTimes: ['09:00', '15:00'],
  };
  horarioOptions = [];

  @Input() id = '';
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
        } else if (/^\d{8}$/.test(valor)) {
          // Formato sem separadores (ex.: 29112025)
          const dia = valor.slice(0, 2);
          const mes = valor.slice(2, 4);
          const ano = valor.slice(4, 8);
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
    private toastr: ToastrService,
    private especialidades: EspecialidadeService,
    private pacientes: PacientesService,
    private medicos: MedicosService,
    private route: ActivatedRoute,
    private retornos: RetornosService
  ) {}

  salvar() {
    this.step = 2;
  }
  enviar() {
    const dateValue = this.form.date.trim(); // Supondo formato "25112024"
    const horarioValue = this.form.horario.trim(); // Supondo formato "16:30"

    // Ajustar a data no formato "YYYY-MM-DDTHH:mm"
    const dia = dateValue.slice(0, 2);
    const mes = dateValue.slice(2, 4);
    const ano = dateValue.slice(4, 8);

    // Construindo o campo no formato esperado
    const adjustedDate = `${ano}-${mes}-${dia}T${horarioValue}`;

    const submitForm = {
      date: adjustedDate,
      observation: null,
      isActive: true,
      doctorId: this.form.medico,
      appointmentId: this.id,
    };

    this.retornos.postData(submitForm).subscribe({
      next: (response) => {
        this.toastr.success('Retorno agendado com sucesso!');
        this.closeModal();
      },
      error: (error) => {
        this.toastr.error('Erro ao cadastrar paciente. Tente novamente.');
      },
    });
  }
  getEspecialidades() {
    this.especialidades.getData().subscribe({
      next: (response) => {
        this.especialidadesData = response.map((response) => ({
          id: response.id,
          name: response.description,
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar especialidades:', error);
      },
    });
  }

  onMedicoChange(medicoValue: any) {
    // Evitar chamadas repetidas
    if (this.lastMedicoValue !== medicoValue) {
      this.lastMedicoValue = medicoValue;

      // Encontrar o nome do médico com base no ID selecionado
      const selectedMedico = this.medicosOptions.find(
        (medico) => medico.value === medicoValue
      );

      // Atualizar o form com o nome do médico, se encontrado
      if (selectedMedico) {
        this.form.nomeMedico = selectedMedico.name;
      } else {
        this.form.nomeMedico = ''; // Limpar o nome se não encontrar
      }

      this.getHorariosIndisponiveis();
    }
  }

  onDateChange(dateValue: string) {
    // Evitar chamadas repetidas
    if (this.lastDateValue !== dateValue && dateValue.length === 8) {
      this.lastDateValue = dateValue;
      this.getHorariosIndisponiveis();
    }
  }

  getHorariosIndisponiveis() {
    this.horarioOptions = [];
    this.form.horario = null;

    // Validar se a data é válida e se está no presente ou futuro
    if (this.form.date.length !== 8) {
      return; // Data incompleta ou inválida, não faz a requisição
    }

    const day = parseInt(this.form.date.substring(0, 2), 10);
    const month = parseInt(this.form.date.substring(2, 4), 10);
    const year = parseInt(this.form.date.substring(4, 8), 10);

    if (
      isNaN(day) ||
      isNaN(month) ||
      isNaN(year) ||
      day > 31 ||
      month > 12 ||
      day < 1 ||
      month < 1
    ) {
      return; // Data inválida, não faz a requisição
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorar horas para comparar apenas a data

    const selectedDate = new Date(year, month - 1, day);

    if (selectedDate < today) {
      return; // Data no passado, não faz a requisição
    }

    // Faz a requisição apenas se a data for hoje ou no futuro
    if (this.form.medico) {
      this.consultas
        .getHorarios(
          this.form.medico,
          this.formatarDataParaDateTime(this.form.date)
        )
        .subscribe({
          next: (response) => {
            this.unavailableTimes = {
              doctorId: response.doctorId,
              doctorName: response.doctorName,
              spcialty: [
                {
                  name: response.specialtyType.specialtyName,
                  id: response.specialtyType.id,
                  interval: response.specialtyType.interval,
                },
              ],
              unavailableTimes: response.unavailableTimes,
            };

            this.getHorariosDisponiveis();
          },
          error: (error) => {
            console.error('Erro ao carregar especialidades:', error);
          },
        });
    }
  }

  getHorariosDisponiveis() {
    const horariosFuncionamento = [];
    const inicio = 9; // 9h
    const fim = 18; // 18h
    const especialidade = this.unavailableTimes.spcialty[0];
    const intervalo =
      parseInt(especialidade.interval.split(':')[0]) * 60 +
      parseInt(especialidade.interval.split(':')[1]); // Intervalo em minutos
    let minutosTotais = inicio * 60; // Converter o horário de início em minutos

    // Obter a data atual e a hora atual (ajustada para o fuso horário local)
    const hoje = new Date();
    const dataHoje = `${hoje.getFullYear()}-${String(
      hoje.getMonth() + 1
    ).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
    const horaAtual = hoje.getHours() * 60 + hoje.getMinutes(); // Hora atual em minutos

    // Verificar se a data selecionada é o dia de hoje
    const dataSelecionada = this.formatarDataParaDateTime(this.form.date).split(
      ' '
    )[0];

    console.log(dataSelecionada, dataHoje);
    // Criar todos os horários disponíveis no intervalo de funcionamento
    while (minutosTotais < fim * 60) {
      const horas = Math.floor(minutosTotais / 60);
      const minutos = minutosTotais % 60;
      const horaFormatada = String(horas).padStart(2, '0');
      const minutoFormatado = String(minutos).padStart(2, '0');
      const horarioCompleto = `${horaFormatada}:${minutoFormatado}`;

      // Adicionar horário somente se for maior que o horário atual quando a data for hoje
      if (dataSelecionada !== dataHoje || minutosTotais >= horaAtual) {
        horariosFuncionamento.push(horarioCompleto);
      }

      minutosTotais += intervalo; // Avançar pelo intervalo definido
    }

    const unavailableTimes = this.unavailableTimes.unavailableTimes;

    // Filtrar horários disponíveis removendo os horários indisponíveis
    const horariosDisponiveis = horariosFuncionamento.filter((horario) => {
      const horarioMinuto =
        parseInt(horario.split(':')[0]) * 60 + parseInt(horario.split(':')[1]);

      // Remover horários passados para o dia de hoje
      if (dataSelecionada === dataHoje && horarioMinuto < horaAtual) {
        return false;
      }

      // Verificar se o horário está na lista de indisponíveis
      if (unavailableTimes.includes(horario)) {
        return false;
      }

      return true;
    });

    // Formatar horários disponíveis
    const horariosDisponiveisFormatados = horariosDisponiveis.map(
      (horario) => ({
        value: horario,
        name: horario,
      })
    );

    this.horarioOptions = horariosDisponiveisFormatados;
  }

  formatarDataParaDateTime(dataString: string): string {
    const dia = dataString.substring(0, 2).padStart(2, '0');
    const mes = dataString.substring(2, 4).padStart(2, '0');
    const ano = dataString.substring(4, 8);
    return `${ano}-${mes}-${dia}`;
  }
  getMedicos() {
    this.medicos.getData().subscribe({
      next: (response) => {
        // Mapeia a resposta da API para o formato esperado
        this.medicosOptions = response.map((medico: any) => ({
          value: medico.id, // O ID do médico será usado como "value"
          name: medico.name, // Título conforme o gênero
          especialidadeId: medico.doctorData.specialtyType.id, // ID da especialidade
          especialidade: medico.doctorData.specialtyType.description, // Nome da especialidade
          intervaloConsulta:
            medico.doctorData.specialtyType.intervalBetweenAppointments, // Intervalo entre consultas
          status: medico.isActive,
        }));

        this.filteredMedicos = this.medicosOptions.filter(
          (medico) =>
            medico.especialidadeId === this.form.especialidades &&
            medico.status === true
        );
      },
      error: (error) => {
        console.error('Erro ao carregar médicos:', error);
      },
    });
  }
  onEspecialidadeChange(especialidadeValue: number) {
    // Quando a especialidade muda, limpar os campos relacionados
    this.form.medico = '';
    this.form.date = '';
    this.form.horario = '';

    // Resetar as listas filtradas e as opções de horário disponíveis
    this.filteredMedicos = [];
    this.horarioOptions = [];

    // Filtrar os médicos baseados no especialidadeId selecionado
    this.filteredMedicos = this.medicosOptions.filter(
      (medico) =>
        medico.especialidadeId === especialidadeValue && medico.status === true
    );
  }
  formValido(): boolean {
    // Validar data
    if (this.form.date.length !== 8) {
      return false; // Data incompleta ou inválida
    }

    const day = parseInt(this.form.date.substring(0, 2), 10);
    const month = parseInt(this.form.date.substring(2, 4), 10);
    const year = parseInt(this.form.date.substring(4, 8), 10);

    if (
      isNaN(day) ||
      isNaN(month) ||
      isNaN(year) ||
      day > 31 ||
      month > 12 ||
      day < 1 ||
      month < 1
    ) {
      return false; // Data inválida
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorar horas para comparar apenas a data

    const selectedDate = new Date(year, month - 1, day);

    if (selectedDate < today) {
      return false; // Data no passado
    }

    // Validar se médico e horário estão selecionados
    if (
      this.form.medico === '' ||
      this.form.medico === null ||
      this.form.horario === '' ||
      this.form.horario === null
    ) {
      return false;
    }

    // Se todas as condições forem atendidas, o formulário é válido
    return true;
  }
  ngOnInit() {
    this.form.especialidades = this.data.doctorData.specialtyType.id;
    this.form.especialidadeNome =
      this.data.doctorData.specialtyType.specialtyName;
    this.getEspecialidades();
    this.getMedicos();
    this.onEspecialidadeChange(this.form.especialidades);
  }
}
