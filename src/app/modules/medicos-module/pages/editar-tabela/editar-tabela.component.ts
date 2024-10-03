import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-editar-tabela',
  templateUrl: './editar-tabela.component.html',
  styleUrls: ['./editar-tabela.component.css'],
})
export class EditarTabelaComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent; // Referência ao componente FullCalendar

  // Lista de médicos mockados
  doctors = [
    { id: 1, name: 'Dr. Carlos', checked: false },
    { id: 2, name: 'Dra. Maria', checked: false },
    { id: 3, name: 'Dr. João', checked: false },
  ];

  // Consultas mockadas
  appointments = [
    { title: 'Consulta 1', start: '2024-12-01', doctorId: 1 },
    { title: 'Consulta 2', start: '2024-12-02', doctorId: 2 },
    { title: 'Consulta 2', start: '2025-12-02', doctorId: 2 },
    { title: 'Consulta 3', start: '2024-12-03', doctorId: 3 },
    { title: 'Consulta 3', start: '2024-10-10', doctorId: 3 },
    { title: 'Consulta 3', start: '2024-03-10', doctorId: 3 },
  ];

  // Configurações do calendário
  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    locale: 'pt-br',
    headerToolbar: {
      left: 'prev,next today', // Botões de navegação
      center: 'title',
      right: '', // Isso só exibe o nome do mês, não é um seletor
    },
    buttonText: {
      today: 'Hoje', // Traduz o botão "today" para "Hoje"
    },
    events: this.appointments,
    editable: true,
    selectable: true,
  };

  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();

  // Filtrar consultas ao selecionar médicos
  filterAppointments() {
    const selectedDoctors = this.doctors
      .filter((doctor) => doctor.checked)
      .map((doctor) => doctor.id);

    this.calendarOptions.events = this.appointments.filter(
      (appointment) =>
        selectedDoctors.length === 0 ||
        selectedDoctors.includes(appointment.doctorId)
    );
  }

  // Navegar para o mês e ano selecionados
  updateCalendar() {
    const selectedDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    this.calendarComponent.getApi().gotoDate(selectedDate);
  }
  ngOnInit(): void {}
}
