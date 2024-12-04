import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { MedicosService } from '../../../core/services/medicos.service';
import { DocumentosService } from '../../../core/services/documentos.service';
import { ToastrService } from 'ngx-toastr';
import { PacientesService } from '../../../core/services/pacientes.service';

@Component({
  selector: 'app-receituario-medico',
  templateUrl: './receituario-medico.component.html',
  styleUrls: ['./receituario-medico.component.css'],
})
export class ReceituarioMedicoComponent implements OnInit {
  prescription: string = ''; // Conteúdo da prescrição
  currentDate: string = ''; // Data atual
  idConsulta: string | null = null;
  medicoId: string | null = null;
  pacientId: string | null = null;
  name: string = '';
  especialidade: string = '';
  sexo: string = '';
  borderVisible: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private medicos: MedicosService,
    private pacientes: PacientesService,
    private router: Router,
    private documentos: DocumentosService,
    private toastr: ToastrService
  ) {
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
    this.borderVisible = false;
    const opt = {
      margin: 0, // Sem margens adicionais para o PDF
      filename: 'receita-medica.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 }, // Aumenta a resolução do PDF
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().from(element).set(opt).save();
  }

  getMedicos() {
    this.medicos.getDataId(this.medicoId).subscribe({
      next: (response) => {
        this.name = response.name;
        this.especialidade = response.doctorData.specialtyType.description;
        this.sexo = response.gender;
      },
      error: (error) => {
        console.error('Erro ao carregar médicos:', error);
      },
    });
  }
  getPaciente() {
    this.pacientes.getDataId(this.pacientId).subscribe({
      next: (response) => {
        console.log(response);

        // Verificar se o paciente tem alergias
        if (
          response.pacientData &&
          response.pacientData.allergies &&
          response.pacientData.allergies.length > 0
        ) {
          // Extrair o nome das alergias
          const allergies = response.pacientData.allergies
            .map((a) => a.allergy)
            .join(', ');

          // Exibir o Toastr com as alergias do paciente
          this.toastr.warning(
            `Paciente com alergia a ${allergies}. Cuidado ao prescrever a receita.`
          );
        }
      },
      error: (error) => {
        console.error('Erro ao carregar paciente:', error);
      },
    });
  }

  generateAndUploadPDF(tipo: string): void {
    this.borderVisible = false;
    const element = document.getElementById('pdf-content');
    const opt = {
      margin: 0,
      filename: 'receita-medica.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf()
      .from(element)
      .set(opt)
      .outputPdf('blob') // Gera o PDF como Blob
      .then((pdfBlob) => {
        const file = new File([pdfBlob], 'receita-medica.pdf', {
          type: 'application/pdf',
        });

        this.handleFileUpload(file, tipo);
      });
  }

  handleFileUpload(file: File, tipo: string): void {
    if (this.idConsulta) {
      // Chama o serviço para realizar o upload
      this.documentos.postFile(this.idConsulta, tipo, file).subscribe({
        next: (response) => {
          this.toastr.success('Receita cadastrada com sucesso!');

          // Cria uma URL de objeto para o arquivo gerado
          const fileURL = URL.createObjectURL(file);

          // Abre o arquivo gerado em uma nova aba com o nome "receita_medica"
          window.open(fileURL, 'receita_medica'); // 'receita_medica' é o nome da aba

          // Após abrir a nova aba, redireciona o usuário
          this.router.navigateByUrl(
            `/pacientes/consulta/individual/${this.idConsulta}`
          );
        },
        error: (error) => {
          this.toastr.error('Erro ao enviar a receita');
        },
      });
    } else {
      this.toastr.error('ID da consulta não encontrado');
    }
  }

  voltar() {
    this.router.navigateByUrl(
      `/pacientes/consulta/individual/${this.idConsulta}`
    );
  }
  ngOnInit() {
    this.idConsulta = this.route.snapshot.paramMap.get('id');

    // Extrair o medicoId dos parâmetros da query string
    this.medicoId = this.route.snapshot.queryParamMap.get('medicoId');

    this.pacientId = this.route.snapshot.queryParamMap.get('pacienteId');

    this.getMedicos();
    this.getPaciente();
  }
}
