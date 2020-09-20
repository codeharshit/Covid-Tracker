import { GlobalDataSummary } from './../../models/global-data';
import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0; //this is the total no of cases combined from all the countries
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[] ;
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart'
  }
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart'
  }

  initChart() {
    let datatable = [];
    datatable.push(["Country", "Cases"]);
    this.globalData.forEach(cs=> {
      if(cs.confirmed > 100000) { //This is used to show only countries with more than x no of cases
        datatable.push([
          cs.country, cs.confirmed
        ])
     }
    })
    console.log(datatable.values);
    
    this.pieChart = {         //This is part is given in https://www.devrandom.it/software/ng2-google-charts/additional-documentation/usage.html
      chartType: 'PieChart',
      dataTable: datatable,
      options: {
        height: 500
      },
    };
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: datatable,
      options: {
        'height': 500
      },
    };
  }
  
  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {

    this.dataService.getGlobalData().subscribe( { //Every component that requires data from the web server needs to subscribe to the service
      next : (result) => {                          //Multiple components can subsribe to a single service (here, countries and home component are subscribed to data-service)
      console.log(result);      //This part I did not understand.
        this.globalData = result; //The "next()" is used to send messages to all the components that are subscribed to it.

        result.forEach(cs => {
          if (!Number.isNaN(cs.confirmed)) { //This condition is checked as the last row in json text does not contain numbers
            this.totalActive += cs.active  //This combines the active cases from all the countries
            this.totalConfirmed += cs.confirmed
            this.totalDeaths += cs.deaths
            this.totalRecovered += cs.recovered
          }
        })

        this.initChart();

      }
    })
  }

}
