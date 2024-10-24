import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef,
  OnChanges,
  SimpleChanges,
  HostListener,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CrmService } from '../../../core/services/crm.service';

interface SelectOption {
  id?: any;
  value: any;
  name: string;
  intervalo?: number;
}

type InputTypes =
  | 'text'
  | 'password'
  | 'email'
  | 'money'
  | 'date'
  | 'date-hour'
  | 'number'
  | 'select'
  | 'search'
  | 'search-select'
  | 'textarea'
  | 'readonly'
  | 'time'
  | 'crm';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() type: InputTypes = 'text';
  @Input() label: string = '';
  @Input() labelColor: string = '';
  @Input() placeholder: string = '';
  @Input() readOnly: boolean = false;
  @Input() typeSearch: 'string' | 'number' = 'string';
  @Input() disabled: boolean = false;
  mostrar: boolean = false;
  @Input() maxLength: string | null = null;
  @Input() width: string = '';
  @Input() mask: string = '';
  @Input() requiredInput: boolean = false;
  @Input() selectData: SelectOption[] = [];
  @Input() ngModel: any;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  @Output() blurEvent: EventEmitter<void> = new EventEmitter();
  valueTouched: boolean = false;
  isFocused: boolean = false;
  @Input() optionsList = [];
  @Output() searchChange = new EventEmitter<string>();
  @Output() selectChange = new EventEmitter<string>();
  selectedOption: string = '';
  passwordType: string = 'password';
  eyeImage: string = 'assets/images/eye-off.svg';
  searchTerm: string | null = null;
  showOptions: boolean = false;
  filteredOptions: SelectOption[] = [];
  value: any = null;
  pesquisar = '';
  @Input() isCpf: boolean = false;
  cpfValido: boolean = true;
  @Input() isRg: boolean = false;
  rgValido: boolean = true;
  @Input() isEmail: boolean = false;
  emailValido: boolean = true;

  // Armazena o valor e o rótulo da opção selecionada

  @Input() selectedLabel: string = '';

  // Controla a visibilidade do dropdown
  isDropdownVisible: boolean = false;
  onChange: any = () => {};
  onTouched: any = () => {};
  private searchSubject = new Subject<string>();
  private crmSubject = new Subject<string>();
  constructor(private route: ActivatedRoute, private eRef: ElementRef) {}

  ngOnInit(): void {
    if (this.maxLength === '') {
      this.maxLength = null;
    }
    this.filteredOptions = [...this.selectData];

    if (
      this.ngModel === undefined ||
      this.ngModel === null ||
      this.ngModel === 0
    ) {
      this.value = null;
      this.ngModelChange.emit(this.value);
    } else {
      this.setValue(this.ngModel);
    }

    this.searchSubject
      .pipe(debounceTime(100), distinctUntilChanged())
      .subscribe((value) => this.onChangeValuesInit(value));

    this.route.queryParams.subscribe((params) => {
      const queryValue = params['value'];
      if (queryValue) {
        const selectedOption = this.selectData.find(
          (option) => option.value === queryValue
        );
        if (selectedOption) {
          this.selectOption(selectedOption);
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectData']) {
      this.filteredOptions = [...this.selectData];
      this.setValue(this.value);
    }
  }

  checkValidity() {
    if (this.searchTerm == '') {
      this.valueTouched = true;
    }
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  filterOptions(searchTerm: string) {
    if (searchTerm) {
      this.filteredOptions = this.selectData.filter((option) =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.filteredOptions = [...this.selectData];
    }
  }

  selectOption(option: SelectOption) {
    this.value = option.value || option.id;
    this.searchTerm = option.name;
    this.showOptions = false;
    this.onChange(this.value);
    this.ngModelChange.emit(this.value);
    this.selectedOption = option.value;
    this.selectedLabel = option.name;
    this.isDropdownVisible = false;
    this.selectChange.emit(this.value);
    this.mostrar = true;
  }

  hideOptions() {
    setTimeout(() => {
      this.showOptions = false;
    }, 200);
  }

  removeValue() {
    this.value = null;
    this.searchTerm = '';
    this.showOptions = false;
    this.onChange(null);
    this.ngModelChange.emit(null);

    this.valueTouched,
      this.requiredInput,
      this.value !== null &&
        this.value !== undefined &&
        this.value !== 0 &&
        this.value !== '';
  }

  togglePassword() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.eyeImage =
      this.eyeImage === 'assets/images/eye-off.svg'
        ? 'assets/images/eye-on.svg'
        : 'assets/images/eye-off.svg';
  }

  isValueValid(): boolean {
    return (
      this.value !== null &&
      this.value !== undefined &&
      this.value !== 0 &&
      this.value !== ''
    );
  }

  onSelectChange(value: any) {
    this.value = value === '' ? null : value;
    this.ngModelChange.emit(this.value);
    this.selectChange.emit(this.value);
  }

  writeValue(value: any): void {
    this.value = value;
    this.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.readOnly = isDisabled;
  }
  onSearchChange(value: string) {
    this.searchChange.emit(value); // Emite o valor para o componente pai
  }
  onValueChange(value: any) {
    this.ngModelChange.emit(value);
    this.searchSubject.next(value);
    if (this.isCpf) {
      this.cpfValido = this.validarCPF(value);
    } else if (this.isRg) {
      this.rgValido = this.validarRG(value);
    } else if (this.isEmail) {
      this.emailValido = this.validarEmail(value);
    }
  }

  onChangeValuesInit(value: string) {
    this.value = value;
    this.onChange(this.value);
    this.onTouched();
    this.ngModelChange.emit(this.value);
  }

  onDateValueChange(value: string | any, type: string) {
    if (value && value.length === 8 && type === 'date') {
      const day = value.substring(0, 2);
      const month = value.substring(2, 4);
      const year = value.substring(4, 8);
      const dateString = `${year}-${month}-${day}`;
      this.onChange(dateString);
      this.onTouched();
      this.ngModelChange.emit(dateString);
    }

    if (value && value.length === 12 && type === 'date-hour') {
      const hour = value.substring(0, 2);
      const minutes = value.substring(2, 4);
      const day = value.substring(4, 6);
      const month = value.substring(6, 8);
      const year = value.substring(8, 12);
      const dateString = `${year}-${month}-${day}T${hour}:${minutes}`;
      this.onChange(dateString);
      this.onTouched();
      this.ngModelChange.emit(dateString);
    }
  }

  onBlur() {
    this.blurEvent.emit();
    this.onTouched();
  }

  validarCPF(cpf: string): boolean {
    console.log(cpf);
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
  }

  validarRG(rg: string): boolean {
    // Remove caracteres não numéricos ou letras (para casos com dígitos verificadores)
    rg = rg.replace(/[^\w]/g, '');

    // Verifica se o RG tem entre 7 e 10 caracteres
    if (rg.length < 7 || rg.length > 10) {
      return false;
    }

    // Valida se o RG contém apenas números ou letras permitidas
    return /^[0-9A-Za-z]+$/.test(rg);
  }

  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(regex.test(email));
    return regex.test(email);
  }

  private setValue(value: any): void {
    if (value !== null && value !== undefined && value !== 0) {
      const selectedOption = this.selectData.find(
        (option) => option.value === value
      );
      if (selectedOption) {
        this.searchTerm = selectedOption.name;
      } else {
        this.searchTerm = value;
      }
    } else {
      this.searchTerm = null;
      this.value = null;
    }
    this.filteredOptions = [...this.selectData];
  }

  preventTyping(event: KeyboardEvent): void {
    const allowedKeys = [
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Backspace',
      'Delete',
    ];

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  openCalendar(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.showPicker();
  }
}
