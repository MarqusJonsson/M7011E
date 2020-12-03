import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'ratio-block',
  templateUrl: './ratio-block.component.html',
  styleUrls: ['./ratio-block.component.css']
})
export class RatioBlockComponent implements OnInit {
  @ViewChild('title') title:ElementRef; 
  constructor(private hostElement: ElementRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if(this.hostElement.nativeElement.attributes.getNamedItem("blockName") != null)
      this.setBlockTitle(this.hostElement.nativeElement.attributes.getNamedItem("blockName").value);
    else
    this.setBlockTitle("Undefined");
 
  }

  public setBlockTitle(newValue: string) {
    this.title.nativeElement.innerText = newValue;
  }

}
