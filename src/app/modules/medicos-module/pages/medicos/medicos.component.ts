import { Component, OnInit, ViewChild } from '@angular/core';
import { ITableColumn } from '../../../../shared/components/tabela/tabela.models';
import { EspecialidadeService } from '../../../../core/services/especalidades.service';
import { ToastrService } from 'ngx-toastr';
import { MedicosService } from '../../../../core/services/medicos.service';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css'],
})
export class MedicosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchValue: string = ''; // Armazena o valor da busca
  selectedValue: number | string = 80; // Valor padrão como "Todos"

  constructor(
    private especialidades: EspecialidadeService,
    private toastr: ToastrService,
    private medicos: MedicosService,
    private router: Router
  ) {}

  showModalExclusao = false;
  tipo = '';
  item: any;
  selectData = [
    { value: 60, name: 'Ativos' },
    { value: 70, name: 'Inativos' },
    { value: 80, name: 'Todos' },
  ];
  especialidadesData = [];

  tableData: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  currentPage = 0;
  pageSize = 5;

  tableColumns: ITableColumn[] = [
    { header: 'Nome', key: 'name', type: 'text' },
    { header: 'Código', key: 'id', type: 'text' },
    { header: 'CRM', key: 'doctorData.crm', type: 'text' },
    {
      header: 'Especialidade',
      key: 'doctorData.specialtyType.description',
      type: 'text',
    },
    { header: 'Status', key: 'isActive', type: 'text' },
    {
      header: 'Ações',
      key: 'actions',
      type: 'buttons',
      buttons: [
        {
          label: 'Editar',
          action: (item) => this.editItem(item),
          condition: (item) => true,
          img: 'assets/img/editar.svg',
        },
        {
          label: 'Desativar',
          action: (item) => this.deleteItem(item),
          condition: (item) => item.isActive !== false,
          img: 'assets/img/excluir.svg',
        },
      ],
    },
  ];

  ngOnInit() {
    this.getMedicos();
    this.getEspecialidades();
  }

  getEspecialidades() {
    this.especialidades.getData().subscribe({
      next: (response) => {
        const especialidadesOptions = response.map((response) => ({
          value: `especialidade_${response.id}`, // Prefixo para diferenciar especialidades
          name: response.description,
          isEspecialidade: true, // Adiciona uma flag para identificar especialidades
        }));

        // Adiciona as especialidades ao dropdown
        this.selectData = [
          { value: 60, name: 'Ativos' },
          { value: 70, name: 'Inativos' },
          { value: 80, name: 'Todos' },
          ...especialidadesOptions, // Adiciona as especialidades
        ];
      },
      error: (error) => {
        console.error('Erro ao carregar especialidades:', error);
      },
    });
  }

  // getMedicos() {
  //   this.medicos.getData().subscribe({
  //     next: (response) => {
  //       this.tableData = response;
  //       this.filteredData = [...this.tableData];
  //       this.updatePaginatedData();
  //     },
  //     error: (error) => {
  //       console.error('Erro ao carregar médicos:', error);
  //     },
  //   });
  // }
  getMedicos() {
    this.medicos.getData().subscribe({
      next: (response) => {
        // Recupera o usuário atual do localStorage
        const currentUser = JSON.parse(
          localStorage.getItem('userInfo') || '{}'
        );

        // Filtra a lista de médicos para remover o médico atual
        let filteredMedicos = response.filter(
          (medico: any) => medico.id !== currentUser.id
        );

        // Ordena a lista de médicos em ordem alfabética pelo nome
        filteredMedicos.sort((a: any, b: any) => a.name.localeCompare(b.name));

        this.tableData = filteredMedicos;
        this.filteredData = [...this.tableData]; // Inicializa `filteredData` com todos os itens
        this.updatePaginatedData(); // Atualiza os dados paginados
      },
      error: (error) => {
        console.error('Erro ao carregar médicos:', error);
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
      const crm = item.doctorData?.crm?.toLowerCase() || '';
      const description =
        item.doctorData?.specialtyType?.description?.toLowerCase() || '';
      const matchesSearch =
        lowerSearchValue === '' || // Se não houver busca, considera tudo
        name.includes(lowerSearchValue) ||
        id.includes(lowerSearchValue) ||
        crm.includes(lowerSearchValue) ||
        description.includes(lowerSearchValue);

      // Critérios de seleção
      const matchesSelect =
        selectedValue === 80 || // "80" para "todos"
        (selectedValue === 60 && item.isActive === true) || // Ativos
        (selectedValue === 70 && item.isActive === false) || // Inativos
        (typeof selectedValue === 'string' && // Especialidades
          selectedValue.startsWith('especialidade_') &&
          item.doctorData?.specialtyType?.id ===
            parseInt(selectedValue.replace('especialidade_', ''), 10));

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

  editItem(item: any) {
    this.router.navigate([`/cadastro/medico/${item.id}`]);
  }

  deleteItem(item: any) {
    this.showModalExclusao = true;
    this.item = item;
    this.tipo = 'medicos';
  }

  closeModal() {
    this.showModalExclusao = false;
    this.getMedicos();
  }

  cadastrar() {
    this.router.navigate(['/cadastro/medico']);
  }

  exportToXlsx() {
    // Cria uma nova planilha
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Médicos');

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

      // Corrige caminhos aninhados para CRM e Especialidade
      row['doctorData.crm'] = row.doctorData?.crm || '';
      row['doctorData.specialtyType.description'] =
        row.doctorData?.specialtyType?.description || '';

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
      saveAs(new Blob([buffer]), 'medicos_paginados.xlsx'); // Nome do arquivo gerado
    });
  }
}
