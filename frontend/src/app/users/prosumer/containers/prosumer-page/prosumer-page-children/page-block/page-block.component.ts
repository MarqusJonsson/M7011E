import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'prosumer-page-block',
  templateUrl: './page-block.component.html',
  styleUrls: ['./page-block.component.css']
})
export class PageBlockComponent implements OnInit {
  @ViewChild('header') header:ElementRef; 
  constructor(private hostElement: ElementRef) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    if(this.hostElement.nativeElement.attributes.getNamedItem("blockName") != null)
      this.setHeaderValue(this.hostElement.nativeElement.attributes.getNamedItem("blockName").value);
    else
    this.setHeaderValue("Undefined");
 
  }

  public setHeaderValue(newValue: string) {
    this.header.nativeElement.innerText = newValue;
  }
}
