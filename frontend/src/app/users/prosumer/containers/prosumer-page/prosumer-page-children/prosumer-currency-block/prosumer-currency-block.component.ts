import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'prosumer-currency-block',
  templateUrl: './prosumer-currency-block.component.html',
  styleUrls: ['./prosumer-currency-block.component.css']
})
export class ProsumerCurrencyBlockComponent implements OnInit {
  @ViewChild('currency') currency:ElementRef;
  @ViewChild('marketPrice') marketPrice:ElementRef;


  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

  }

  public setCurrency(value: number) {
    this.currency.nativeElement.innerText = value;
  }

  public setMarketPrice(value: number) {
    this.marketPrice.nativeElement.innerText = value;
  }

}
