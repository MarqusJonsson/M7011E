import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'prosumer-page-block',
  templateUrl: './page-block.component.html',
  styleUrls: ['./page-block.component.css']
})
export class PageBlockComponent implements OnInit {
  @ViewChild('title') title:ElementRef;
  @ViewChild('entry1') entry1:ElementRef;
  @ViewChild('entry2') entry2:ElementRef;  
  constructor(private hostElement: ElementRef) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.setBlockTitle()
    this.setEntry1();
    this.setEntry2();
 
  }

  public setBlockTitle() {
    if (this.hostElement.nativeElement.attributes.getNamedItem("blockName") != null)
      this.title.nativeElement.innerText = this.hostElement.nativeElement.attributes.getNamedItem("blockName").value;
    else
    this.title.nativeElement.innerText = "Undefined";
  }

  public setEntry1() {
    if (this.hostElement.nativeElement.attributes.getNamedItem("entry1Name") != null)
      this.entry1.nativeElement.innerText = this.hostElement.nativeElement.attributes.getNamedItem("entry1Name").value;
    else
      this.entry1.nativeElement.innerText = "Undefined:";
  }

  public setEntry2() {
    if (this.hostElement.nativeElement.attributes.getNamedItem("entry2Name") != null)
      this.entry2.nativeElement.innerText = this.hostElement.nativeElement.attributes.getNamedItem("entry2Name").value;
    else
      this.entry2.nativeElement.innerText = "Undefined:";
  }
}
