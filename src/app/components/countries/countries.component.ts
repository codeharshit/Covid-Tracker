import { DataServiceService } from 'src/app/services/data-service.service';
import { Component, OnInit } from '@angular/core';
// import { copyFileSync } from 'fs';
import { GlobalDataSummary } from 'src/app/models/global-data';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  data: GlobalDataSummary[];
  totalConfirmed = 0;
  totalActive = 0;
  totalRecovered = 0;
  totalDeaths = 0;

  countries: string[] = []; //This would be used in selecting countries in dropdown list

  constructor(private service: DataServiceService) { } //Injects the service from DataService

  ngOnInit() {
    this.service.getGlobalData().subscribe(result=> { //Not using next() here probably because we don't need to print anything to console
        this.data = result;       //Probably copying whole result to data, so as to not modify the original result
        this.data.forEach(cs => {
          this.countries.push(cs.country)  //Traversing the whole rows of array and pushing country column in country array
        })
      })
    }

    updateValues(country: string) {
      this.data.forEach(cs=>{
        if(cs.country == country) {
          this.totalConfirmed = cs.confirmed;
          this.totalActive = cs.active;
          this.totalDeaths = cs.deaths;
          this.totalRecovered = cs.recovered;
        }
      })
    }

  }