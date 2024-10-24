import { Component, OnInit } from '@angular/core';
import { ITableColumn } from '../../../shared/components/tabela/tabela.models';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css'],
})
export class FuncionariosComponent implements OnInit {
  selectData = [
    {
      value: 1,
      name: 'Ativos',
    },
    {
      value: 2,
      name: 'Inativos',
    },
    {
      value: 3,
      name: 'Todos',
    },
  ];
  tableData = [
    {
      nome: 'João Silva',
      cod: '123',
      cpf: '123.456.789-00',
      telefone: '(11) 91234-5678',
      status: 'Ativo',
    },
    {
      nome: 'Maria Souza',
      cod: '456',
      cpf: '987.654.321-00',
      telefone: '(21) 98765-4321',
      status: 'Ativo',
    },
    {
      nome: 'Carlos Oliveira',
      cod: '789',
      cpf: '111.222.333-44',
      telefone: '(31) 99876-5432',
      status: 'Inativo',
    },
  ];

  filteredData = this.tableData;

  tableColumns: ITableColumn[] = [
    { header: 'Nome', key: 'nome', type: 'text' },
    { header: 'Código', key: 'cod', type: 'text' },
    { header: 'CPF', key: 'cpf', type: 'text' },
    { header: 'Telefone', key: 'telefone', type: 'text' },
    { header: 'Status', key: 'status', type: 'text' },
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
          label: 'Excluir',
          action: (item) => this.deleteItem(item),
          condition: (item) => true,
          img: 'assets/img/excluir.svg',
        },
      ],
    },
  ];

  onSearchChange(searchValue: any) {
    this.filteredData = this.tableData.filter(
      (item) =>
        item.nome.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.cod.includes(searchValue)
    );
  }

  onSelectChange(selectedValue: any) {
    switch (selectedValue) {
      case 1: // Ativos
        this.filteredData = this.tableData.filter(
          (item) => item.status === 'Ativo'
        );
        break;
      case 2: // Inativos
        this.filteredData = this.tableData.filter(
          (item) => item.status === 'Inativo'
        );
        break;
      case 3: // Todos
        this.filteredData = this.tableData;
        break;
      default:
        this.filteredData = this.tableData;
    }
  }

  editItem(item: any) {}

  deleteItem(item: any) {}

  ngOnInit(): void {}
}
