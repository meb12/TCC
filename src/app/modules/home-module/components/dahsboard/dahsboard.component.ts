import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dahsboard.component.html',
  styleUrls: ['./dahsboard.component.css'],
})
export class DahsboardComponent implements OnInit {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() descriptionValue: string = '';
  @Input() description2: string = '';
  @Input() description2Value: string = '';
  @Input() totalValue: string = '';
  @Input() totalText: string = 'Total';

  constructor() {}

  ngOnInit() {}
}
