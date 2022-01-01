import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { StackedAreaComponent } from './charts/stacked-area/stacked-area.component';



@NgModule({
  declarations: [BarChartComponent, PieChartComponent, StackedAreaComponent],
  imports: [
    CommonModule,
  ],
  exports:[BarChartComponent, PieChartComponent, StackedAreaComponent]
})
export class SharedModule { }
