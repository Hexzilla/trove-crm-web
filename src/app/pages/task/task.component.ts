import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskDialog } from '../detail/task-dialog/task-dialog';



export class Task {
  constructor(public name: string, public date: string, public time: string,
              public created: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  filterCount: number = 0
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  showFilter: boolean = false
  tasks: Task[] = [
    new Task("Packet Monster Sales opportunity.", "Mon, 11 Jan", "Today at 9:00", "Mon, 11 Jan"),
    new Task("UX design meeting at 17:30 hrs. sales pipeline design discussion.", "Thu, 20 Dec, 2020 ", "", "Wed, 19 Jan"),
    new Task("Landing page required for new CRM app", "", "", "Wed, 19 Jan"),
    new Task("Packet Monster Sales opportunity", "Mon, 11 Jan", "", "Wed, 19 Jan"),
    new Task("UX design meeting at 17:30 hrs. sales pipeline design discussion.", "", "", "Wed, 19 Jan"),
    new Task("Landing page required for new CRM app", "", "", "Wed, 19 Jan")
  ]
  completedTasks: Task[] = []

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {

  }

  clickCheckBox(task, i: number) {
    task.selected = !task.selected
    this.completedTasks = this.getCompletedTasks();
  }

  getCompletedTasks() {
    return this.tasks.reduce((acc, cur) => {
      if (cur.selected)
        acc.push(cur)
      return acc
    }, [])
  }
  clickCompleteCheck(task) {
    let found = this.tasks.find(e => e == task)
    found.selected = false
    this.completedTasks = this.getCompletedTasks();
  }

  clickAddTask(isEdit: boolean) {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '405px',
      autoFocus: false,
      data : { isEdit: isEdit}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);

    })
  }

  filterCountChangedHandler(e) {
    this.filterCount = e
  }

  clickFilter(){
    this.showFilter = true
  }

}
