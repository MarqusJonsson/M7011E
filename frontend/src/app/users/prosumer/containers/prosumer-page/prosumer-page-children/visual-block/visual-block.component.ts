import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'prosumer-page-visual-block',
  templateUrl: './visual-block.component.html',
  styleUrls: ['./visual-block.component.css']
})
export class VisualBlockComponent implements OnInit {
  @ViewChild('production') production:ElementRef;
  @ViewChild('consumption') consumption:ElementRef;
  @ViewChild('netProduction') netProduction:ElementRef;
  @ViewChild('temperature') temperature:ElementRef;
  @ViewChild('windSpeed') windSpeed:ElementRef;
  @ViewChild('battery') battery:ElementRef;
  @ViewChild('batteryCapacity') batteryCapacity:ElementRef;




  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

  }

  public setProduction(value: number) {
    this.production.nativeElement.innerText = value;
  }

  public setConsumption(value: number) {
    this.consumption.nativeElement.innerText = value;
  }

  public setNetProduction() {
    let production = parseInt(this.production.nativeElement.innerText);
    let consumption = parseInt(this.consumption.nativeElement.innerText);
    let netProduction = production - consumption;
    this.netProduction.nativeElement.innerText = netProduction;
  }

  public setTemperature(value: number) {
    this.temperature.nativeElement.innerText = value + " C";
  }

  public setWindSpeed(value: number) {
    this.windSpeed.nativeElement.innerText = value + " m/s";
  }

  public setBattery(value: number) {
    this.battery.nativeElement.innerText = value + "/";
  }

  public setBatteryCapacity(value: number) {
    this.batteryCapacity.nativeElement.innerText = value + " kwh";
  }

}
