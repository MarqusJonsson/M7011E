import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'sub-block',
  templateUrl: './sub-block.component.html',
  styleUrls: ['./sub-block.component.css']
})
export class SubBlockComponent implements OnInit {
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
