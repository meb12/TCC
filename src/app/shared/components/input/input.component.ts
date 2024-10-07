import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

interface SelectOption {
  value: any;
  name: string;
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
  | 'textarea';

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
  @Input() maxLength: string | null = null;
  @Input() width: string = '';
  @Input() mask: string = '';
  @Input() requiredInput: boolean = false;
  @Input() selectData: SelectOption[] = [];
  @Input() ngModel: any;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  @Output() blurEvent: EventEmitter<void> = new EventEmitter();

  passwordType: string = 'password';
  eyeImage: string = 'assets/images/eye-off.svg';
  searchTerm: string | null = null;
  showOptions: boolean = false;
  filteredOptions: SelectOption[] = [];
  value: any = null;

  onChange: any = () => {};
  onTouched: any = () => {};
  private searchSubject = new Subject<string>();

  constructor(private route: ActivatedRoute) {}

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
    this.value = option.value;
    this.searchTerm = option.name;
    this.showOptions = false;
    this.onChange(this.value);
    this.ngModelChange.emit(this.value);
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
  }

  togglePassword() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.eyeImage =
      this.eyeImage === 'assets/images/eye-off.svg'
        ? 'assets/images/eye-on.svg'
        : 'assets/images/eye-off.svg';
  }

  onSelectChange(value: any) {
    this.value = value === '' ? null : value;
    this.ngModelChange.emit(this.value);
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

  onValueChange(value: any) {
    this.ngModelChange.emit(value);
    this.searchSubject.next(value);
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
