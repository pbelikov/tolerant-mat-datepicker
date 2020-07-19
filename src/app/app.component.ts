import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tolerant-datepicker';

  date = '22/22/2020';
  maxDate = new Date(2020, 0, 1);

  ngOnInit(): void {
    // setTimeout(() => this.date = new Date('01/01/2019'), 2000);
  }
  // date = '22/22/2020';



  changed(event: any) {
    console.log(event);
    console.log(typeof event === 'string' ? 'it is wrong' : 'goood');
  }
}
