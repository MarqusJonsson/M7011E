import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'manager-main-block',
  templateUrl: './manager-main-block.component.html',
  styleUrls: ['./manager-main-block.component.css']
})
export class ManagerMainBlockComponent implements OnInit {
  @ViewChild('temperature') temperature:ElementRef;
  @ViewChild('windSpeed') windSpeed:ElementRef;
  @ViewChild('prosumerList') prosumerList:ElementRef;
  constructor() { }

  ngOnInit(): void {
	  
  }

  ngAfterViewInit() {
	this.createProsumerList([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])
  }
  
  public createProsumerList(prosumers): void {
	this.prosumerList.nativeElement.innerText = "";
	for (let i = 0; i < prosumers.length; i++) {
		let deleteImage = document.createElement('img');
		deleteImage.src = "/assets/x-mark.svg";
		deleteImage.alt = "Delete";
		let prosumerEmail = document.createElement('span');
		prosumerEmail.innerText = prosumers[i].email;
		let blockImage = document.createElement('img');
		blockImage.src = "/assets/stop.svg";
		blockImage.alt = "Block";
		let BlackoutImage = document.createElement('img');
		BlackoutImage.src = "/assets/light-bulb.svg"
		let item = document.createElement('li');
		item.className = "p-list";
		item.appendChild(deleteImage);
		item.appendChild(prosumerEmail);
		item.appendChild(blockImage);
		item.appendChild(BlackoutImage);
		this.prosumerList.nativeElement.appendChild(item);
	}
  }

  public setTemperature(value: number) {
	this.temperature.nativeElement.innerText = value + " C";
  }

  public setWindSpeed(value: number) {
	this.windSpeed.nativeElement.innerText = value + " m/s";
  }
}

