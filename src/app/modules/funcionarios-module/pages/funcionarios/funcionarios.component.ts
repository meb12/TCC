import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EspecialidadeService } from '../../../../core/services/especalidades.service';
import { FuncionariosService } from '../../../../core/services/funcionarios.service';
import { ITableColumn } from '../../../../shared/components/tabela/tabela.models';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TiposUsuariosService } from '../../../../core/services/user-types.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css'],
})
export class FuncionariosComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchValue: string = ''; // Valor da busca
  selectedValue: number | string = 80; // Valor selecionado no dropdown

  // Defina o dataSource sem inicializar com tableData
  dataSource = new MatTableDataSource<any>();

  // Adicione essas propriedades para controlar a paginação
  currentPage = 0;
  pageSize = 5; // Número de itens por página
  paginatedData: any[] = []; // Dados da página atual

  selectedFilter: number | null = null;

  constructor(
    private router: Router,
    private funcionarioService: FuncionariosService,
    private tiposUsuarios: TiposUsuariosService
  ) {}

  showModalExclusao = false;
  tipo = '';
  itemsPerPage = 10;
  totalPages = 0;
  filteredData: any[] = [];

  // Inicialize tableData como um array vazio
  tableData: any[] = [];

  displayedColumns: string[] = [
    'name',
    'id',
    'userType.name',
    'isActive',
    'actions',
  ];

  item: {
    id: number;
    description: string;
    intervalBetweenAppointments: string;
    isActive: boolean;
    cellphone: string;
    cep: string;
    city: string;
    complement: string;
    cpf: string;
    dateOfBirth: string;
    doctorData: {
      crm: string;
      observation: string;
      specialtyType: {
        id: number;
        intervalBetweenAppointments: string;
        isActive: boolean;
        description: string;
      };
    };
    documentNumber: string;
    email: string;
    gender: string;
    login: string;
    name: string;
    neighborhood: string;
    pacientData: any;
    stateName: string | null;
    streetName: string;
    streetNumber: number;
    userType: {
      id: number;
      name: string;
      isActive: boolean;
    };
  };

  selectData = [
    { value: 60, name: 'Ativos' },
    { value: 70, name: 'Inativos' },
    { value: 80, name: 'Todos' },
  ];

  tableColumns: ITableColumn[] = [
    { header: 'Nome', key: 'name', type: 'text' },
    { header: 'Código', key: 'id', type: 'text' },
    { header: 'Cargo', key: 'userType.name', type: 'text' },
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
    this.getFuncionarios();
    this.getUserTypes();
  }
  ngAfterViewInit() {
    this.updatePaginatedData();
  }

  getFuncionarios() {
    this.funcionarioService.getData().subscribe({
      next: (response) => {
        // Recupera o usuário atual do localStorage
        const currentUser = JSON.parse(
          localStorage.getItem('userInfo') || '{}'
        );

        // Filtra a lista de funcionários para remover o usuário atual
        this.tableData = response.filter(
          (user: any) => user.id !== currentUser.id
        );

        this.filteredData = [...this.tableData]; // Inicializa `filteredData` com todos os itens
        this.paginator.length = this.filteredData.length; // Define o `length` inicial do paginator
        this.updatePaginatedData(); // Atualiza os dados paginados
      },
      error: (error) => {
        console.error('Erro ao carregar funcionários:', error);
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
      const matchesSearch =
        lowerSearchValue === '' || // Se não houver busca, considera todos
        name.includes(lowerSearchValue) ||
        id.includes(lowerSearchValue);

      // Critérios de seleção
      const matchesSelect =
        selectedValue === 80 || // "80" para "todos"
        (selectedValue === 60 && item.isActive === true) || // Ativos
        (selectedValue === 70 && item.isActive === false) || // Inativos
        (typeof selectedValue === 'number' &&
          item.userType?.id === selectedValue); // Por cargo

      return matchesSearch && matchesSelect;
    });

    // Atualiza o paginator e os dados paginados
    this.paginator.length = this.filteredData.length;
    this.currentPage = 0;
    this.paginator.pageIndex = this.currentPage;
    this.updatePaginatedData();
  }

  onSearchChange(searchValue: string) {
    this.searchValue = searchValue; // Atualiza o valor de busca
    this.applyFilters(); // Aplica os filtros combinados
  }

  onSelectChange(selectedValue: number | string) {
    this.selectedValue = selectedValue; // Atualiza o valor selecionado
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
    this.router.navigate([`/cadastro/funcionario/${item.id}`]);
  }

  deleteItem(item: any) {
    this.showModalExclusao = true;
    this.item = item;
    this.tipo = 'funcionario';
  }

  closeModal() {
    this.showModalExclusao = false;
    this.getFuncionarios();
  }
  getUserTypes() {
    this.tiposUsuarios.getUserTypes().subscribe({
      next: (response) => {
        // Filtra os tipos de usuário que são diferentes de "Médico" e "Paciente"
        const filteredTypes = response.filter(
          (userType) =>
            userType.name !== 'Médico' && userType.name !== 'Paciente'
        );

        // Adiciona os tipos filtrados ao selectData
        filteredTypes.forEach((type) => {
          this.selectData.push({ value: type.id, name: type.name });
          this.selectData.sort((a, b) => {
            if (a.value === 30) return 1;
            if (b.value === 30) return -1;
            return 0;
          });
        });
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de usuário:', error);
      },
    });
  }

  cadastrar() {
    this.router.navigate(['/cadastro/funcionario']);
  }

  exportToXlsx() {
    // Cria uma nova planilha
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Funcionários');

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

      // Adiciona o cargo ao Excel
      row['userType.name'] = row.userType?.name || ''; // Certifica que o cargo será exibido mesmo que esteja vazio

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
      saveAs(new Blob([buffer]), 'funcionarios_paginados.xlsx'); // Nome do arquivo gerado
    });
  }
}
