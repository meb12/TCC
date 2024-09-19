import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-component',
  templateUrl: './input-component.component.html',
  styleUrls: ['./input-component.component.css'],
})
export class InputComponentComponent implements OnInit {
  hide = true;
  originalType: 'text' | 'password' | 'email' = 'text';
  @Input() label!: string;
  @Input() type: 'text' | 'password' | 'email' = 'text';
  @Input() showErrorsWhen: boolean = true;
  @Input() control!: AbstractControl;
  @Input() name!: string;
  @Input() placeholder: string = '';
  @Input() isRequired: boolean = true;

  ngOnInit(): void {
    this.originalType = this.type;
  }
  get formControl(): FormControl {
    return this.control as FormControl;
  }
  toggleHide(): void {
    this.hide = !this.hide;
    if (this.originalType === 'password') {
      this.type = this.hide ? 'password' : 'text';
    }
  }
}
