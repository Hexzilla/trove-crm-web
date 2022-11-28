import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  status = "active"
  selectedDisplay = "all"
  
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToList() {
    this.router.navigate(['/pages/contact']);
  }

}
