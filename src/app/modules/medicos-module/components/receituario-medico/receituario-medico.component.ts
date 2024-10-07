import { Component, OnInit } from '@angular/core';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-receituario-medico',
  templateUrl: './receituario-medico.component.html',
  styleUrls: ['./receituario-medico.component.css'],
})
export class ReceituarioMedicoComponent implements OnInit {
  prescription: string = ''; // Conteúdo da prescrição
  currentDate: string = ''; // Data atual

  constructor() {
    // Define a data atual no formato: Santos, XX de MMMM de YYYY
    const today = new Date();
    const day = today.getDate();
    const monthNames = [
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
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();
    this.currentDate = `Santos, ${day} de ${month} de ${year}.`;
  }

  generatePDF() {
    const element = document.getElementById('pdf-content');

    const opt = {
      margin: 0, // Sem margens adicionais para o PDF
      filename: 'receita-medica.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 }, // Aumenta a resolução do PDF
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().from(element).set(opt).save();
  }
  ngOnInit() {}
}
