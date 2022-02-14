import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';
import { AdminService } from '../../services/admin.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit, AfterViewInit {
  role: any;
  userId: any;
usersList:any=[];
userData:any=[];
  constructor( private _adminService: AdminService,) { }

  ngOnInit() {
    this.userId = localStorage.getItem("userId");
    // this.getUserList();
  }

  ngAfterViewInit() {
    this.initChart();
  }
  initChart() {
    am4core.unuseAllThemes();
    am4core.useTheme(am4themes_animated);

    // Create chart instance
  // Create chart instance
let chart = am4core.create("piechartdiv", am4charts.PieChart);



this._adminService.getUserDataCountryWise(this.userId).pipe(finalize(() => {

})).subscribe((res: any) => {

  if (res.statusCode === 200) {
    // this.usersList = res.data;
    console.log("country usersList", this.usersList);

    let result = res.data.map((person:any) => ({ country: person._id, litres: person.totalUser }));
    chart.data =result;
    console.log("result this.usersList", this.usersList);
  }
})


// console.log("SampleData0", this.usersList);
// chart.data = this.usersList;

// Add and configure Series

// Add and configure Series
let pieSeries = chart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "litres";
pieSeries.dataFields.category = "country";
pieSeries.slices.template.stroke = am4core.color("#fff");
pieSeries.slices.template.strokeOpacity = 1;

// This creates initial animation
pieSeries.hiddenState.properties.opacity = 1;
pieSeries.hiddenState.properties.endAngle = -90;
pieSeries.hiddenState.properties.startAngle = -90;

chart.hiddenState.properties.radius = am4core.percent(0);
  }




}
