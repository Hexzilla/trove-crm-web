import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
@Component({
  selector: 'app-monthlychart',
  templateUrl: './monthlychart.component.html',
  styleUrls: ['./monthlychart.component.css']
})
export class MonthlychartComponent implements OnInit {

  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  filterCount: number = 0
  showFilter: boolean = false
  colormonthlyChart = ['#c6a887']
  monthlyChart: echarts.EChartsOption = {
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
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
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
            name: 'Monthly',
            type: 'bar',
            barWidth: '15%',
            data: [10, 52, 200, 170, 250]
        }
    ],
    color: this.colormonthlyChart,
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
