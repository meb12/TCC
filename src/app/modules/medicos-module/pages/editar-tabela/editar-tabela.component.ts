import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

@Component({
  selector: 'app-editar-tabela',
  templateUrl: './editar-tabela.component.html',
  styleUrls: ['./editar-tabela.component.css'],
})
export class EditarTabelaComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent; // Referência ao FullCalendar
  @ViewChild('dateSelector') dateSelector!: ElementRef; // Referência aos selects de mês e ano

  // Lista de médicos mockados
  doctors = [
    { id: 1, name: 'Dr. Médico 1', checked: false },
    { id: 2, name: 'Dr. Médico 2', checked: false },
    { id: 3, name: 'Dr. Médico 3', checked: false },
    { id: 4, name: 'Dr. Médico 4', checked: false },
    { id: 5, name: 'Dr. Médico 5', checked: false },
    { id: 6, name: 'Dr. Médico 6', checked: false },
    { id: 7, name: 'Dr. Médico 7', checked: false },
    { id: 8, name: 'Dr. Médico 8', checked: false },
    { id: 9, name: 'Dr. Médico 9', checked: false },
    { id: 10, name: 'Dr. Médico 10', checked: false },
    { id: 11, name: 'Dr. Médico 11', checked: false },
    { id: 12, name: 'Dr. Médico 12', checked: false },
    { id: 13, name: 'Dr. Médico 13', checked: false },
    { id: 14, name: 'Dr. Médico 14', checked: false },
    { id: 15, name: 'Dr. Médico 15', checked: false },
    { id: 16, name: 'Dr. Médico 16', checked: false },
    { id: 17, name: 'Dr. Médico 17', checked: false },
    { id: 18, name: 'Dr. Médico 18', checked: false },
    { id: 19, name: 'Dr. Médico 19', checked: false },
  ];

  // Consultas mockadas
  appointments = [
    {
      title: 'Consulta 1',
      date: '2024-12-01',
      doctor: { id: 1, name: 'Doctor 1', specialty: 'Cardiology' },
      patient: { id: 201, name: 'Patient 1' },
    },
    {
      title: 'Consulta 1',
      date: '2024-12-01',
      doctor: { id: 2, name: 'Doctor 1', specialty: 'Cardiology' },
      patient: { id: 201, name: 'Patient 1' },
    },
    {
      title: 'Consulta 2',
      date: '2024-12-02',
      doctor: { id: 2, name: 'Doctor 2', specialty: 'Dermatology' },
      patient: { id: 202, name: 'Patient 2' },
    },
    // Mais apontamentos...
  ];

  // Configurações do calendário
  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    locales: allLocales,
    locale: 'pt-br',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '',
    },
    dayMaxEventRows: false, // Impede a exibição automática de eventos
    events: this.consolidateEvents(this.appointments),
    eventContent: (arg) => this.customEventContent(arg),
    editable: true,
    selectable: true,
    dateClick: this.handleDateClick.bind(this),
    moreLinkText: 'mais',
    aspectRatio: 1.35,
    showNonCurrentDates: false,
    fixedWeekCount: false,
  };

  customEventContent(arg) {
    // Cria o HTML para o card do evento
    const element = document.createElement('div');
    element.innerHTML = `
      <div class="custom-event">
        <img src="${arg.event._def.extendedProps.icon}" ">
        <span>${arg.event._def.extendedProps.count}</span>
      </div>
    `;
    return { domNodes: [element] };
  }

  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();

  months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  selectedDate: any;
  displayedAppointments: any;

  handleDateClick(arg) {
    this.selectedDate = arg.dateStr; // Armazena a data selecionada

    // Captura os IDs dos médicos selecionados com base nos checkboxes
    const selectedDoctors = this.doctors
      .filter((doctor) => doctor.checked)
      .map((doctor) => doctor.id);

    // Filtra as consultas para mostrar apenas aquelas que ocorrem na data selecionada
    // e que são de médicos selecionados
    this.displayedAppointments = this.appointments.filter(
      (appointment) =>
        appointment.date.includes(this.selectedDate) &&
        (selectedDoctors.length === 0 ||
          selectedDoctors.includes(appointment.doctor.id))
    );
  }

  // Opções para o select de mês
  monthOptions = this.months.map((month, index) => ({
    label: month,
    value: index + 1,
  }));
  ngAfterViewInit() {
    // Insere os selects de mês e ano no lado direito do FullCalendar
    const calendarToolbarRight = document.querySelector(
      '.fc-toolbar.fc-header-toolbar .fc-toolbar-chunk:last-child'
    );
    if (calendarToolbarRight && this.dateSelector) {
      calendarToolbarRight.appendChild(this.dateSelector.nativeElement); // Adiciona os selects no lado direito
    }
  }

  // Atualiza o calendário quando o mês ou ano é alterado
  onMonthYearChange() {
    const selectedDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    this.displayedAppointments = [];
    this.selectedDate = '';
    this.calendarComponent.getApi().gotoDate(selectedDate);
  }

  // Opções para o select de ano
  yearOptions = [2023, 2024, 2025].map((year) => ({
    label: year,
    value: year,
  }));

  filterAppointments() {
    const selectedDoctorIds = this.doctors
      .filter((doctor) => doctor.checked)
      .map((doctor) => doctor.id);

    const filteredAppointments = this.appointments.filter(
      (appointment) =>
        selectedDoctorIds.length === 0 ||
        selectedDoctorIds.includes(appointment.doctor.id)
    );

    const consolidatedEvents = this.consolidateEvents(filteredAppointments);
    this.calendarOptions.events = consolidatedEvents;
    if (this.calendarComponent) {
      this.calendarComponent.getApi().refetchEvents();
    }
    this.displayedAppointments = this.appointments.filter(
      (appointment) =>
        appointment.date.includes(this.selectedDate) &&
        (selectedDoctorIds.length === 0 ||
          selectedDoctorIds.includes(appointment.doctor.id))
    );
  }

  consolidateEvents(appointments) {
    const eventsByDay = {};
    appointments.forEach((appointment) => {
      const date = appointment.date;
      if (!eventsByDay[date]) {
        eventsByDay[date] = {
          start: date,
          count: 0,
          title: 'Consultas',
          icon: 'assets/img/icone-medicos.svg',
          details: [],
        };
      }
      eventsByDay[date].count++;
      eventsByDay[date].details.push({
        doctorName: appointment.doctor.name,
        doctorSpecialty: appointment.doctor.specialty,
        patientName: appointment.patient.name,
      });
    });

    return Object.values(eventsByDay);
  }

  // Navegar para o mês e ano selecionados
  updateCalendar() {
    const selectedDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    this.calendarComponent.getApi().gotoDate(selectedDate);
  }
  ngOnInit(): void {}
}
