import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
@Component({
  selector: 'app-pipelinechart',
  templateUrl: './pipelinechart.component.html',
  styleUrls: ['./pipelinechart.component.css']
})
export class PipelinechartComponent implements OnInit {

  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  filterCount: number = 0
  showFilter: boolean = false
  colorpipelineChart = ['#ffa33e', '#c6a887', '#7184b8', '#595393']
  pipelineChart: echarts.EChartsOption = {

    tooltip: {
      trigger: 'item'
    },
    legend: {
        bottom: 0,
        left: 'center',
        show: true
    },
    series: [
        {
            name: 'Pipeline',
            type: 'pie',
            radius: ['50%', '80%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '13',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                {value: 1048, name: 'Pipeline 1'},
                {value: 735, name: 'Pipeline 2'},
                {value: 580, name: 'Pipeline 3'},
                {value: 484, name: 'Pipeline 4'}
            ]
        }
    ],
    color: this.colorpipelineChart,
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
