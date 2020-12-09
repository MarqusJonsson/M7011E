import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'manager-market-block',
  templateUrl: './manager-market.component.html',
  styleUrls: ['./manager-market.component.css']
})
export class ManagerMarketComponent implements OnInit {
  @ViewChild('marketDemand') marketDemand:ElementRef;
  @ViewChild('suggestPrice') suggestPrice:ElementRef; 
  @ViewChild('electricityPrice') electricityPrice:ElementRef;
  @ViewChild('currency') currency:ElementRef; 
 

  constructor(private hostElement: ElementRef) { }
  ngOnInit(): void {

  }

  ngAfterViewInit() {

  }

  public setmarkDemand(value: string) {
    this.marketDemand.nativeElement.innerText = value;
  }

  public setsuggestPrice(value: string) {
    this.suggestPrice.nativeElement.innerText = value;
  }

  public setElectricityPrice(value: string) {
    this.electricityPrice.nativeElement.innerText = value;
  }

  public setCurrency(value: string) {
    this.currency.nativeElement.innerText = value;
  }


}
