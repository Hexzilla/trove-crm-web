import { Component, OnInit, EventEmitter, Output } from '@angular/core';

export class Task {
  constructor(public name: string, public selected?: boolean) {
    if (selected === undefined) selected = false
  }
}

export class File {
  constructor(public name: string, public type: string, public description: string) {
  }
}

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit {

  @Output() addTaskClicked = new EventEmitter()
  @Output() addAppointClicked = new EventEmitter()

  tasks: Task[] = [
    new Task("Packet Monster Sales opportunity"),
    new Task("Ux design meeting at 17:30hrs."),
    new Task("Landing page required for new CRM app")
  ]

  files: File[] = [
    new File("Sales guide to file.docx", "word", "57.35KB, 2021/01/16  14:05"),
    new File("Weekly sales reort(Jan 1-7).xls", "excel", "5 Bytes, 2021/01/16  14:05"),
    new File("FIle export-status.pdf", "pdf", "3.9 MB, 2021/01/16  14:05"),
    new File("Sales guide to file1.docx", "word", "57.35KB, 2021/02/1  14:05")
  ]

  constructor() { }

  ngOnInit(): void {
  }

  addAppoint() {
    console.log('add appoint')
    this.addAppointClicked.emit()
  }

  addTask() {
    console.log('add task')
    this.addTaskClicked.emit()
  }
}
