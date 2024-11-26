import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ITableColumn } from '../../../../shared/components/tabela/tabela.models';
import { Router } from '@angular/router';
import { PacientesService } from '../../../../core/services/pacientes.service';
import { PageEvent } from '@angular/material/paginator';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css'],
})
export class PacientesComponent implements OnInit {
  constructor(
    private router: Router,
    private pacientesService: PacientesService
  ) {}

  showModalExclusao = false;
  item: any;
  tipo = '';
  data = '';

  selectData = [
    { value: 60, name: 'Ativos' },
    { value: 70, name: 'Inativos' },
    { value: 80, name: 'Todos' },
  ];

  tableData: any[] = []; // Dados completos da tabela
  filteredData: any[] = []; // Dados filtrados para exibição
  paginatedData: any[] = []; // Dados da página atual

  pageSize = 5; // Número de itens por página
  currentPage = 0; // Página atual do paginator

  searchValue: string = ''; // Valor da busca
  selectedValue: number | string = 80; // Valor do filtro selecionado (80 para "Todos")
  paginator: any = { length: 0, pageIndex: 0 }; // Paginador simulado para integração

  tableColumns: ITableColumn[] = [
    { header: 'Nome', key: 'name', type: 'text' },
    { header: 'Código', key: 'id', type: 'text' },
    { header: 'CPF', key: 'cpf', type: 'text' },
    { header: 'Telefone', key: 'cellphone', type: 'text' },
    { header: 'Status', key: 'isActive', type: 'text' },
    {
      header: 'Ações',
      key: 'actions',
      type: 'buttons',
      buttons: [
        {
          label: 'Informações',
          action: (item) => this.infosItem(item),
          condition: () => true,
          img: 'assets/img/icon-consulta.svg',
        },
        {
          label: 'Nova consulta',
          action: (item) => this.novaConsulta(item),
          condition: (item) => item.isActive === true,
          img: 'assets/img/icon-consulta.svg',
        },
        {
          label: 'Editar',
          action: (item) => this.editItem(item),
          condition: () => true,
          img: 'assets/img/editar.svg',
        },
        {
          label: 'Excluir',
          action: (item) => this.deleteItem(item),
          condition: (item) => item.isActive === true,
          img: 'assets/img/excluir.svg',
        },
      ],
    },
  ];

  ngOnInit(): void {
    this.fetchPacientes(); // Carrega os dados dos pacientes
  }

  fetchPacientes() {
    this.pacientesService.getData().subscribe({
      next: (response) => {
        // Mapeia a resposta para incluir o CPF e telefone formatados
        this.tableData = response.map((item: any) => ({
          ...item,
          cpf: this.formatCpf(item.cpf),
          cellphone: this.formatPhone(item.cellphone),
        }));
        this.filteredData = [...this.tableData]; // Inicializa `filteredData` com todos os dados
        this.updatePaginatedData(); // Atualiza os dados paginados
      },
      error: (error) => {
        console.error('Erro ao carregar pacientes:', error);
      },
    });
  }

  applyFilters() {
    const lowerSearchValue = this.searchValue?.toLowerCase().trim() || '';
    const selectedValue = this.selectedValue;

    this.filteredData = this.tableData.filter((item) => {
      // Critérios de busca
      const name = item.name?.toLowerCase() || '';
      const id = item.id?.toString() || '';
      const cpf = item.cpf?.toLowerCase() || '';
      const phone = item.cellphone?.toLowerCase() || '';
      const matchesSearch =
        lowerSearchValue === '' || // Se não houver busca, considera tudo
        name.includes(lowerSearchValue) ||
        id.includes(lowerSearchValue) ||
        cpf.includes(lowerSearchValue) ||
        phone.includes(lowerSearchValue);

      // Critérios de seleção
      const matchesSelect =
        selectedValue === 80 || // "80" para "todos"
        (selectedValue === 60 && item.isActive === true) || // Ativos
        (selectedValue === 70 && item.isActive === false); // Inativos

      return matchesSearch && matchesSelect;
    });

    // Atualiza a paginação
    this.paginator.length = this.filteredData.length;
    this.currentPage = 0;
    this.paginator.pageIndex = this.currentPage;
    this.updatePaginatedData();
  }

  onSearchChange(searchValue: string) {
    this.searchValue = searchValue; // Armazena o valor da busca
    this.applyFilters(); // Aplica os filtros combinados
  }

  onSelectChange(selectedValue: number | string) {
    this.selectedValue = selectedValue; // Armazena o valor selecionado
    this.applyFilters(); // Aplica os filtros combinados
  }
  updatePaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  // Funções de ações
  isPacienteModalOpen = false;

  closePacienteModal() {
    this.isPacienteModalOpen = false;
  }

  closeModal() {
    this.showModalExclusao = false;
    this.fetchPacientes();
  }

  infosItem(item: any) {
    this.isPacienteModalOpen = true;
    this.data = item;
  }

  editItem(item: any) {
    this.router.navigate([`/cadastro/paciente/${item.id}`]);
  }

  novaConsulta(item: any) {
    this.router.navigate([`/pacientes/consulta`, item.id]);
  }

  deleteItem(item: any) {
    this.showModalExclusao = true;
    this.item = item;
    this.tipo = 'pacientes';
  }

  cadastrar() {
    this.router.navigate(['/cadastro/paciente']);
  }

  formatCpf(cpf: string): string {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatPhone(phone: string): string {
    if (!phone) return '';
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  exportToXlsx() {
    // Cria uma nova planilha
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Pacientes');

    // Remove a coluna "Ações" e define as colunas com largura e título
    const filteredColumns = this.tableColumns.filter(
      (column) => column.key !== 'actions' // Exclui a coluna "Ações"
    );

    worksheet.columns = filteredColumns.map((column) => ({
      header: column.header,
      key: column.key,
      width: 20, // Define uma largura padrão
    }));

    // Adiciona os dados da página atual ao Excel
    this.paginatedData.forEach((data) => {
      const row = { ...data };

      // Substitui os valores de "isActive" (Status) por "Ativo" ou "Inativo"
      if (row.isActive !== undefined) {
        row.isActive = row.isActive ? 'Ativo' : 'Inativo'; // "true" -> "Ativo", "false" -> "Inativo"
      }

      worksheet.addRow(row); // Adiciona a linha formatada à planilha
    });

    // Estiliza o cabeçalho da planilha
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '029af7' }, // Fundo azul claro
      };
      cell.font = { bold: true }; // Define o texto em negrito
      cell.alignment = { horizontal: 'center', vertical: 'middle' }; // Centraliza o texto
    });

    // Estiliza as células de dados
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell, colNumber) => {
          // Centraliza o conteúdo de todas as células
          cell.alignment = { horizontal: 'center', vertical: 'middle' };

          // Adiciona cor personalizada à coluna "Status"
          if (filteredColumns[colNumber - 1]?.key === 'isActive') {
            cell.font = {
              bold: true, // Texto em negrito
              color: {
                argb: cell.value === 'Ativo' ? 'FF008000' : 'FFFF0000', // Verde para "Ativo", Vermelho para "Inativo"
              },
            };
          }
        });
      }
    });

    // Gera o arquivo Excel e faz o download
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), 'pacientes_paginados.xlsx'); // Nome do arquivo gerado
    });
  }
}
