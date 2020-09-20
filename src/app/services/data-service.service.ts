import { GlobalDataSummary } from './../models/global-data';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';

@Injectable({                 //Injectable is always provided because a service might have 
                              //a dependency on another service
  providedIn: 'root'
})
export class DataServiceService {

  private baseUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/';
  private globalDataUrl = '';
  private extension = '.csv';
  month;
  date;
  year;

  getDate(date: number) {
    if(date < 10) {
      return '0'+date;
    }
    return date;
  }

  constructor(private http: HttpClient) {
    let now = new Date();
    this.month = now.getMonth() + 1;
    this.year = now.getFullYear();
    this.date = now.getDate();

    console.log(
      {
        date: this.date,
        month: this.month,
        year: this.year
      });

      this.globalDataUrl = `${this.baseUrl}${this.getDate(this.month)}-${this.getDate(this.date)}-${this.year}${this.extension}`;
      console.log(this.globalDataUrl);
      
   }

  getGlobalData() {
    return this.http.get(this.globalDataUrl, {responseType : 'text'}).pipe(      //This part I did not understand.
      //responseType because, the response was in csv and we need JSON format
      map(result=>{   
                                            //what does pipe and map methods do?
        let data: GlobalDataSummary[] = []; //This creates a new array named 'data' of type GlobalDataSummary which is present in global-data.ts interface
        let raw = {} //This array will contain the final combined value of all the cases having the same country name
        let rows = result.split('\n'); //This splits the json text into String array
        // console.log(rows);
                                //"result" is the total text i.e 189 rows.
        rows.splice(0, 1); //Deletes the 0th row, as it contains invalid values (header)

        rows.forEach(row=> {
          let cols = row.split(/,(?=\S)/); // look www.regexr.com, Used to filter expression

          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10]
          }
          let temp: GlobalDataSummary = raw[cs.country];
          if(temp) {
            temp.active += cs.active;
            temp.confirmed += cs.confirmed;
            temp.deaths += cs.deaths;
            temp.recovered += cs.recovered;

            raw[cs.country] = temp;
          }
          else {
            raw[cs.country] = cs;
          }
          
          // console.log(cols);
          // data.push({       //This means, we are pushing only 4 elements (which we need) in data array
          //   country: cols[3],
          //   confirmed: +cols[7],  //The '+' sign is used as the actual type of 'confirmed' in json text             deaths: +cols[8],
          //   recovered: +cols[9],  //is string, but we have declared in interface as a number, so by using
          //   active: +cols[10]     // '+' sign, it changes to number
          // })
        })

        // console.log(raw);          
        return <GlobalDataSummary[]>Object.values(raw); //Object.values return values of array instead of key-value pair  
      }),
      catchError((error: HttpErrorResponse)=>{
        if(error.status == 404) {
          this.date = this.date-1;
          this.globalDataUrl = `${this.baseUrl}${this.getDate(this.month)}-${this.getDate(this.date)}-${this.year}${this.extension}`;
          console.log(this.globalDataUrl);
          return this.getGlobalData();
        }
      })
    )
  }
}