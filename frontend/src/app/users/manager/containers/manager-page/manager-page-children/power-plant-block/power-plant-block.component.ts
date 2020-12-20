import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphqlService } from 'src/app/api/services/graphql.service';
import { displayValuePrecision } from 'src/app/users/shared/pageConstants';
import { Ws_to_kWh } from 'src/app/utils/electricity';

@Component({
  selector: 'power-plant-block',
  templateUrl: './power-plant-block.component.html',
  styleUrls: ['./power-plant-block.component.css']
})
export class PowerPlantBlockComponent implements OnInit {
  @ViewChild('production') production:ElementRef;
  @ViewChild('consumption') consumption:ElementRef;
  @ViewChild('netProduction') netProduction:ElementRef;
  @ViewChild('battery') battery:ElementRef;
  @ViewChild('batteryCapacity') batteryCapacity:ElementRef;
  @ViewChild('status') status:ElementRef;

  constructor(private hostElement: ElementRef, private graphqlService: GraphqlService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.graphqlService.addSubscriberCallback(this.onUpdate);

  }

  public setProduction(value: number) {
    this.production.nativeElement.innerText =  Ws_to_kWh(value).toFixed(displayValuePrecision) + " kW";
  }

  public setConsumption(value: number) {
    this.consumption.nativeElement.innerText =  Ws_to_kWh(value).toFixed(displayValuePrecision) + " kW";
  }

  public setNetProduction() {
    let production = parseFloat(this.production.nativeElement.innerText);
    let consumption = parseFloat(this.consumption.nativeElement.innerText);
    let netProduction = production - consumption;
    this.netProduction.nativeElement.innerText = netProduction.toFixed(displayValuePrecision) + " kW";
  }

  public setBattery(value: number) {
    this.battery.nativeElement.innerText =  Ws_to_kWh(value).toFixed(displayValuePrecision) + "/";
  }

  public setBatteryCapacity(value: number) {
    this.batteryCapacity.nativeElement.innerText =  Ws_to_kWh(value).toFixed(displayValuePrecision) + " kWh";
  }

  public setStatus(value: boolean) {
    if(value == false)
    this.status.nativeElement.innerText = "Online";
    else
    this.status.nativeElement.innerText = "Blackout"; 
  }

  public onUpdate = (data: any) => {
    this.setBattery(data.manager.powerPlant.battery.buffer);
    this.setBatteryCapacity(data.manager.powerPlant.battery.capacity);
    this.setProduction(data.manager.powerPlant.electricityProduction);
    this.setConsumption(data.manager.powerPlant.electricityConsumption)
    this.setNetProduction();
    this.setStatus(data.manager.powerPlant.hasBlackout);
  }

}
