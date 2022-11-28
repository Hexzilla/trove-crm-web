import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
@Component({
  selector: 'app-sourcechart',
  templateUrl: './sourcechart.component.html',
  styleUrls: ['./sourcechart.component.css']
})
export class SourcechartComponent implements OnInit {
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  filterCount: number = 0
  showFilter: boolean = false
  colorsourceChart = ['#7184b8']
  sourceChart: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
          type: 'shadow'
      }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: ['SMS', 'Website', 'News', 'Task'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: 'Source',
            type: 'bar',
            barWidth: '15%',
            data: [10, 52, 100, 200]
        }
    ],
    color: this.colorsourceChart,
  };
  constructor() { }

  ngOnInit(): void {

  }
  filterCountChangedHandler(e) {
    this.filterCount = e
  }

  clickFilter(){
    this.showFilter = true
  }

}
