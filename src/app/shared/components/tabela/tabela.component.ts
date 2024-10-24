import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ITableColumn } from './tabela.models';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css'],
})
export class TabelaComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: ITableColumn[] = [];
  selectedRowIndex: number | null = null;
  selectedDropdownIndex: number | null = null;
  @Input() condition: boolean = false;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  onSelectChange(value: any, item: any) {
    const body = {
      value: value,
      item: item,
    };
    this.ngModelChange.emit(body);
  }

  selectRow(index: number, event: MouseEvent): void {
    if (
      event.target instanceof HTMLElement &&
      event.target.closest('.btn-icon')
    ) {
      // Se o alvo do clique for o botão das três bolinhas, não selecione a linha
      return;
    }
    // Fechar dropdown se outra linha for selecionada
    if (this.selectedRowIndex !== index) {
      this.selectedDropdownIndex = null;
    }
    this.selectedRowIndex = this.selectedRowIndex === index ? null : index;
  }

  toggleDropdown(index: number, event: MouseEvent): void {
    event.stopPropagation(); // Previne a propagação do clique para a linha da tabela

    // Ao clicar nas três bolinhas, também deve selecionar a linha
    this.selectedRowIndex = index;

    // Abrir ou fechar o dropdown
    this.selectedDropdownIndex =
      this.selectedDropdownIndex === index ? null : index;
  }

  isDropdownOpen(index: number): boolean {
    return this.selectedDropdownIndex === index;
  }

  getNestedValue(item: any, key: string): any {
    return key.split('.').reduce((obj, property) => obj && obj[property], item);
  }

  executeButtonAction(button: any, item: any, event: MouseEvent): void {
    event.stopPropagation(); // Previne o clique de fechar o dropdown antes de executar a ação
    button.action(item);
    this.selectedDropdownIndex = null; // Fecha o dropdown após a ação ser executada
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.selectedDropdownIndex = null;
  }

  constructor() {}

  ngOnInit() {}
}
