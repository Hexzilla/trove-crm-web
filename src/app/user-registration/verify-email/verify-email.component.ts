import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountApiService } from 'src/app/services/account-api.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  apiResponse: any;

  constructor(
    private account: AccountApiService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
      route.queryParams.subscribe(params => {
        this.account.verifyEmail(params['token']).subscribe(
          (response) => {
            this.apiResponse = response;
          },
          (err) => {
            //console.log(err.error);
            if(err.error.code == 256){
              this.router.navigate(['login'], {queryParams: { verifyemail: 'false' } });
            } else if(err.error.code == 257){
              this.router.navigate(['login'], {queryParams: { verifyemail: 'verified' } });
            }
          }
        );
      });
    }

  ngOnInit() {
  }

}
