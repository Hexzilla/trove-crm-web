import { Component, Input } from '@angular/core';
import * as echarts from 'echarts';
@Component({
  selector: 'app-echarts',
  templateUrl: './echarts.component.html',
  styleUrls: ['./echarts.component.css']
})
export class EchartsComponent {

  @Input() chartOption: echarts.EChartsOption;

  constructor() { }

}
