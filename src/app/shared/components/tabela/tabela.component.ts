import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITableColumn } from './tabela.models';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css'],
})
export class TabelaComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: ITableColumn[] = [];

  @Input() condition: boolean = false;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  selectedRowIndex: number | null = null;

  onSelectChange(value: any, item: any) {
    const body = {
      value: value,
      item: item,
    };
    this.ngModelChange.emit(body);
  }

  selectRow(index: number) {
    if (this.selectedRowIndex === index) {
      this.selectedRowIndex = null;
    } else {
      this.selectedRowIndex = index;
    }
  }

  toggleDropdown(index: number): void {
    this.selectedRowIndex = this.selectedRowIndex === index ? null : index;
  }

  isDropdownOpen(index: number): boolean {
    return this.selectedRowIndex === index;
  }

  constructor() {}

  ngOnInit() {}
}
