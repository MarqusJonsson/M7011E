import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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
  constructor(private hostElement: ElementRef) { }

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

  public setBattery(value: number) {
    this.battery.nativeElement.innerText = value + "/";
  }

  public setBatteryCapacity(value: number) {
    this.batteryCapacity.nativeElement.innerText = value + " kwh";
  }

}
