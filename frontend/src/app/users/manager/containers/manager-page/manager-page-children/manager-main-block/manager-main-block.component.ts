import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphqlService } from 'src/app/api/services/graphql.service';
import { displayValuePrecision } from 'src/app/users/shared/pageConstants';
import { Ws_to_kWh } from 'src/app/utils/electricity';
@Component({
  selector: 'manager-main-block',
  templateUrl: './manager-main-block.component.html',
  styleUrls: ['./manager-main-block.component.css']
})
export class ManagerMainBlockComponent implements OnInit {
  @ViewChild('temperature') temperature:ElementRef;
  @ViewChild('windSpeed') windSpeed:ElementRef;
  @ViewChild('prosumerList') prosumerList:ElementRef;
  @ViewChild('prosumerInfoContainer') prosumerInfoContainer:ElementRef;
  @ViewChild('prosumerInfoHeader') prosumerInfoHeader:ElementRef;
  @ViewChild('prosumerInfoBattery') prosumerInfoBattery:ElementRef;
  @ViewChild('prosumerInfoCapacity') prosumerInfoCapacity:ElementRef;
  @ViewChild('prosumerInfoProduction') prosumerInfoProduction:ElementRef;
  @ViewChild('prosumerInfoConsumption') prosumerInfoConsumption:ElementRef;
	constructor(private graphqlService: GraphqlService) {

	}

	ngOnInit(): void {
	}

	ngAfterViewInit() {
		this.prosumerInfoHeader.nativeElement.innerText = "TODO";
		this.createProsumerList([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])
		this.prosumerInfoBattery.nativeElement.innerText = "TODO kwh";
		this.graphqlService.addSubscriberCallBack(this.onUpdate);
		this.prosumerInfoContainer.nativeElement.onclick = () => {this.hideElement(this.prosumerInfoContainer.nativeElement.id);};

	}

	public createProsumerList(prosumers): void {
	this.prosumerList.nativeElement.innerText = "";
	for (let i = 0; i < prosumers.length; i++) {
		let deleteImage = document.createElement('img');
		deleteImage.src = "/assets/x-mark.svg";
		deleteImage.alt = "Delete";
		let prosumerEmail = document.createElement('button');
		prosumerEmail.innerText = prosumers[i].email;
		prosumerEmail.onclick = () => {
			this.setProsumerInfoHeader(prosumerEmail.innerText);
			this.setProsumerInfoBattery(parseInt(prosumerEmail.innerText));
			this.setProsumerInfoCapacity(parseInt(prosumerEmail.innerText));
			this.setProsumerInfoProduction(parseInt(prosumerEmail.innerText));
			this.setProsumerInfoConsumption(parseInt(prosumerEmail.innerText));
			this.showElement(this.prosumerInfoContainer.nativeElement.id);
		}
		let blockImage = document.createElement('img');
		blockImage.src = "/assets/stop.svg";
		blockImage.alt = "Block";
		let blackoutImage = document.createElement('img');
		blackoutImage.src = "/assets/light-bulb.svg"
		let onlineStatusImage = document.createElement('img');
		onlineStatusImage.src = "/assets/sound-wave.svg";
		let item = document.createElement('li');
		item.className = "p-list";
		item.appendChild(blackoutImage);
		item.appendChild(prosumerEmail);
		item.appendChild(blockImage);
		item.appendChild(onlineStatusImage);
		item.appendChild(deleteImage);
		this.prosumerList.nativeElement.appendChild(item);
		}
	}

	public setProsumerInfoHeader(value: string) {
		this.prosumerInfoHeader.nativeElement.innerText = value;
	}

	public setProsumerInfoBattery(value: number) {
		this.prosumerInfoBattery.nativeElement.innerText =  Ws_to_kWh(value).toFixed(displayValuePrecision) + " kWh";
	}	

	public setProsumerInfoCapacity(value: number) {
		this.prosumerInfoCapacity.nativeElement.innerText =  Ws_to_kWh(value).toFixed(displayValuePrecision) + " kWh";
	}

	public setProsumerInfoProduction(value: number) {
		this.prosumerInfoProduction.nativeElement.innerText = Ws_to_kWh(value).toFixed(displayValuePrecision) + " kWh";
	}

	public setProsumerInfoConsumption(value: number) {
		this.prosumerInfoConsumption.nativeElement.innerText =  Ws_to_kWh(value).toFixed(displayValuePrecision) + " kWh";
	}

	public setTemperature(value: number) {
		this.temperature.nativeElement.innerText = value.toFixed(displayValuePrecision) + " C";
	}

	public setWindSpeed(value: number) {
		this.windSpeed.nativeElement.innerText = value.toFixed(displayValuePrecision) + " m/s";
	}

	public hideElement(elementId: string) {
		let element = document.getElementById(elementId);
		element.style.display = "none";
	}

	public showElement(elementId: string) {
		let element = document.getElementById(elementId);
		element.style.display = "inline-block";
	}

	public onUpdate = (data: any) => {
		this.setTemperature(data.manager.powerPlant.geoData.temperature);
		this.setWindSpeed(data.manager.powerPlant.geoData.windSpeed);

	}

}

