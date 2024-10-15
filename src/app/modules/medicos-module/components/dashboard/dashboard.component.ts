import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
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
