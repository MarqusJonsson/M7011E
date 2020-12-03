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
    this.setCurrency();
    this.setMarketPrice();
  }

  private setCurrency() {
    this.currency.nativeElement.innerText = "Currency: " + this.getCurrencyDB();
  }

  private setMarketPrice() {
    this.marketPrice.nativeElement.innerText = "Market price: " + this.getMarketPriceDB();
  }

  private getCurrencyDB(): string {
    return "000";
  }

  private getMarketPriceDB(): string {
    return "000";
  }

}
