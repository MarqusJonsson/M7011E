import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'ratio-block',
  templateUrl: './ratio-block.component.html',
  styleUrls: ['./ratio-block.component.css']
})
export class RatioBlockComponent implements OnInit {
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
