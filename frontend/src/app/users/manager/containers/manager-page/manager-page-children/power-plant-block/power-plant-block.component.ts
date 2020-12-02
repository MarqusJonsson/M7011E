import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'power-plant-block',
  templateUrl: './power-plant-block.component.html',
  styleUrls: ['./power-plant-block.component.css']
})
export class PowerPlantBlockComponent implements OnInit {
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
