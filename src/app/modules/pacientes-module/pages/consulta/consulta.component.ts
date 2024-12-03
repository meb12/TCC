import { Component, Input, OnInit } from '@angular/core';
import { EspecialidadeService } from '../../../../core/services/especalidades.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicosService } from '../../../../core/services/medicos.service';
import { PacientesService } from '../../../../core/services/pacientes.service';
import { ConsultasService } from '../../../../core/services/consultas.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css'],
})
export class ConsultaComponent implements OnInit {
  data;
  isPacienteModalOpen = false;
  id: number;
  private lastDateValue: string = '';
  form: any = {
    especialidades: '',
    medico: '',
    date: '',
    horario: '',
    observacao: null,
  };

  formSubmit: any;

  medicosOptions = [];

  filteredMedicos: any[] = [];

  unavailableTimes = {
    doctorId: 1,
    doctorName: 'Dr. João Silva',
    spcialty: [{ name: 'Cardiologista', id: 2, interval: '01:30' }],
    unavailableTimes: ['09:00', '15:00'],
  };
  especialidadesData: any[] = [];

  horarioOptions = [];
  private lastMedicoValue: any = null;

  onEspecialidadeChange(especialidadeValue: number) {
    // Quando a especialidade muda, limpar os campos relacionados
    this.form.medico = '';
    this.form.date = '';
    this.form.horario = '';
    this.lastMedicoValue = '';
    this.lastDateValue = '';

    // Resetar as listas filtradas e as opções de horário disponíveis
    this.filteredMedicos = [];
    this.horarioOptions = [];

    // Filtrar os médicos baseados no especialidadeId selecionado
    this.filteredMedicos = this.medicosOptions.filter(
      (medico) =>
        medico.especialidadeId === especialidadeValue && medico.status === true
    );
  }

  onMedicoChange(medicoValue: any) {
    // Evitar chamadas repetidas
    if (this.lastMedicoValue !== medicoValue) {
      this.lastMedicoValue = medicoValue;
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
      this.consulta
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
            console.error('Erro ao carregar horários', error);
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
  getPaciente() {
    this.pacientes.getDataId(this.id).subscribe({
      next: (response) => {
        this.data = response;
      },
      error: (error) => {
        console.error('Erro ao carregar especialidades:', error);
      },
    });
  }
  // gerarHorarioOptions(intervalo: number) {
  //   const horarioInicial = 9 * 60; // 09:00 em minutos
  //   const horarioFinal = 18 * 60; // 18:00 em minutos
  //   const horariosDisponiveis = [];

  //   for (
  //     let minutos = horarioInicial;
  //     minutos < horarioFinal;
  //     minutos += intervalo
  //   ) {
  //     const horas = Math.floor(minutos / 60);
  //     const min = minutos % 60;
  //     const horario = `${String(horas).padStart(2, '0')}:${String(min).padStart(
  //       2,
  //       '0'
  //     )}`;

  //     // Adiciona apenas os horários que não estão indisponíveis
  //     if (!this.horariosIndisponiveis.includes(horario)) {
  //       horariosDisponiveis.push({ value: horario, name: horario });
  //     }
  //   }

  //   this.horarioOptions = horariosDisponiveis;
  // }

  voltar() {
    this.router.navigate(['/pacientes/listagem']);
  }
  constructor(
    private especialidades: EspecialidadeService,
    private pacientes: PacientesService,
    private router: Router,
    private medicos: MedicosService,
    private route: ActivatedRoute,
    private consulta: ConsultasService
  ) {}

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
      },
      error: (error) => {
        console.error('Erro ao carregar médicos:', error);
      },
    });
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
  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.getEspecialidades();
    this.getMedicos();
    this.getPaciente();
  }
  formatarDataParaDateTime(dataString: string): string {
    const dia = dataString.substring(0, 2).padStart(2, '0');
    const mes = dataString.substring(2, 4).padStart(2, '0');
    const ano = dataString.substring(4, 8);
    return `${ano}-${mes}-${dia}`;
  }

  confirmar() {
    this.isPacienteModalOpen = true;
    this.formSubmit = {
      date: this.formatarDataParaDateTime(this.form.date),
      observation: null,
      isActive: true,
      doctorId: this.form.medico,
      medicoDescricao: this.getMedicoDescricao(this.form.medico),
      EspecialidadeDescricao: this.getEspecialidadeDescricao(
        this.form.especialidades
      ),
      pacientId: this.data,
      horario: this.form.horario,
      idPaciente: this.id,
    };
  }
  getMedicoDescricao(id: any) {
    if (!this.medicosOptions) {
      console.error('A lista de médicos ainda não foi carregada.');
      return undefined;
    }

    // Encontra o médico pelo ID
    const medico = this.medicosOptions.find((m: any) => m.value === id);

    // Retorna o nome do médico ou "undefined" se não encontrado
    return medico ? medico.name : undefined;
  }
  getEspecialidadeDescricao(id: any) {
    if (!this.especialidadesData) {
      console.error('A lista de especialidades ainda não foi carregada.');
      return undefined;
    }

    // Encontra a especialidade pelo ID
    const especialidade = this.especialidadesData.find((e: any) => e.id === id);

    // Retorna o nome da especialidade ou "undefined" se não encontrada
    return especialidade ? especialidade.name : undefined;
  }
  closePacienteModal() {
    this.isPacienteModalOpen = false;
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
}
