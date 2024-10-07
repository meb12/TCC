import { Component, OnInit } from '@angular/core';
import { ITableColumn } from '../../../../shared/components/tabela/tabela.models';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css'],
})
export class MedicosComponent implements OnInit {
  tableData = [
    {
      nome: 'João Silva',
      cod: '123',
      cpf: '123.456.789-00',
      telefone: '(11) 91234-5678',
    },
    {
      nome: 'Maria Souza',
      cod: '456',
      cpf: '987.654.321-00',
      telefone: '(21) 98765-4321',
    },
    {
      nome: 'Carlos Oliveira',
      cod: '789',
      cpf: '111.222.333-44',
      telefone: '(31) 99876-5432',
    },
  ];

  tableColumns: ITableColumn[] = [
    { header: 'Nome', key: 'nome', type: 'text' },
    { header: 'Código', key: 'cod', type: 'text' },
    { header: 'CPF', key: 'cpf', type: 'text' },
    { header: 'Telefone', key: 'telefone', type: 'text' },
    {
      header: 'Ações',
      key: 'actions',
      type: 'buttons',
      buttons: [
        {
          label: 'Editar',
          action: (item) => this.editItem(item),
          condition: (item) => true, // Condição sempre verdadeira
        },
      ],
    },
  ];

  editItem(item: any) {
    console.log('Editando item', item);
  }

  deleteItem(item: any) {
    console.log('Excluindo item', item);
  }

  ngOnInit() {}
}
