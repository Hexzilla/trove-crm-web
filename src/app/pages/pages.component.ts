import { Component, OnInit,Inject } from '@angular/core';
import * as echarts from 'echarts';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskDialog } from './detail/task-dialog/task-dialog';
import { AppointDialog } from './detail/appoint-dialog/appoint-dialog';
import { Router } from '@angular/router';
import { SnackBarService} from '../shared/snack-bar.service'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DashboardApiService } from '../services/dashboard-api.service';
import { DateService } from '../service/date.service';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { extractErrorMessagesFromErrorResponse } from '../services/extract-error-messages-from-error-response';
export class Task {
  constructor(public name: string,  public selected?: boolean) {
    if (selected === undefined) selected = false
  }
}
export class Appointment {
  constructor(public title: string, public icon: string , public color: string, public desc: string) {

  }
}
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 };
  currency='$'
  revenue={revenue_value:0,total_leads:0,total_values:0}
  tasks : Task[]=[]
  appointments: Appointment[] = []
  colorsourceChart = ['#7184b8']
  sourcexdata=[]
  sourceydata=[]
  monthydata=[]
  monthxdata=[]
  pipelinedata=[];
  sourceChart:echarts.EChartsOption = {}
  colormonthlyChart = ['#c6a887']
  monthlyChart: echarts.EChartsOption = {}

  colorpipelineChart = ['#595393', '#ffa33e', '#c6a887', '#7184b8']
  pipelineChart: echarts.EChartsOption = {}

  constructor(
    private modalService: NgbModal,
    private dashboardApiService: DashboardApiService,
    public dialog: MatDialog,
    private router: Router,
    private dateService: DateService,
    private sb: SnackBarService) { }
    triggerSnackBar(message:string, action:string) {
    this.sb.openSnackBarBottomCenter(message, action);
  }
  ngOnInit(): void {
      this.dashboardApiService
      .getDashboard()
      .subscribe((res: any) => {
        console.log('dashboard', res,res.data.revenue)
        this.currency=res.data.currency
        this.revenue=res.data.revenue
        this.appointments=res.data.appointment
        this.tasks=res.data.task
        this.sourcexdata=res.data.source.x_axis
        this.sourceydata=res.data.source.y_axis
        this.monthxdata=res.data.month.x_axis
        this.monthydata=res.data.month.y_axis
        this.pipelinedata=res.data.pipeline
        this.colorpipelineChart = res.data.pipeline.map(o => (o.color));
        this.setSourceOption();
        this.setMonthlyOption();
        this.setPipelineOption();
      })
  }

  openTaskDialog(isEdit: boolean) {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '405px',
      data : { isEdit: isEdit}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);

    })
  }

   openAppointDialog(isEdit: boolean) {
    const dialogRef = this.dialog.open(AppointDialog, {
      width: '740px',
      data : { isEdit: isEdit}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);

    })
   }
   setSourceOption(){
       this.sourceChart ={
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
            data: this.sourcexdata,
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
            barWidth: '60%',
            data: this.sourceydata
        }
    ],
    color: this.colorsourceChart,
  };
  }
  setMonthlyOption(){
    this.monthlyChart = {
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
            data: this.monthxdata,
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
            barWidth: '60%',
            data: this.monthydata
        }
    ],
    color: this.colormonthlyChart,
  };
    }
    setPipelineOption(){
        this.pipelineChart = {

    tooltip: {
      trigger: 'item'
    },
    legend: {
        bottom: 0,
        left: 'left',
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
            data: this.pipelinedata
        }
    ],
    color: this.colorpipelineChart,
  };}
    isReminder(reminderdate){
        return moment(reminderdate).isAfter(moment());
    }
    getAppointmentDate(appointmt){
        var appointmentdate=null;
        if(this.isReminder(appointmt.reminder_date_time)){
            appointmentdate=appointmt.reminder_date_time;
            appointmt.icon='notification';
        }else{
            appointmt.icon='calendar';
            appointmentdate=appointmt.start_date_time;
            if(moment(appointmentdate).isBefore(moment())){
                 appointmt.color='red';
            }
        }
        appointmt.appointmentdate= this.dateToFromNowdate(appointmentdate);
    }
    dateToFromNowdate( date ) {
        return moment( date ).calendar( null, {
            sameElse:'ddd,  D MMM, YYYY'
        });
    }
    onTaskSelected(event,task){
        var value =(event.checked)?0:1;
        var data={
            status:value,
            taskid:task.id
        }
        this.dashboardApiService
       .changeTaskStatus(data)
       .subscribe((res: any) => {
           if (res.success) {
             this.triggerSnackBar(res.message, 'Close')
           }
       },
      (errorResponse: HttpErrorResponse) => {
        task.selected=(event.checked)?false:true;
        const messages = extractErrorMessagesFromErrorResponse(errorResponse);
        this.triggerSnackBar(messages.toString(), 'Close');
      })

    }
}

