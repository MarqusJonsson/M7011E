import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/alert/services/alert.service';
import { deleteProsumerMutation, setProsumerSellTimeoutMutation } from 'src/app/api/models/mutations/prosumerMutations';
import { prosumerQueryById } from 'src/app/api/models/prosumerContent';
import { GraphqlService } from 'src/app/api/services/graphql.service';
import { GraphComponent } from 'src/app/users/shared/containers/graph/graph.component';
import { displayValuePrecision } from 'src/app/users/shared/pageConstants';
import { ConfirmDialogService } from 'src/app/users/shared/services/confirm-dialog.service';
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
	@ViewChild('prosumerInfoCurrency') prosumerInfoCurrency:ElementRef;
	@ViewChild('prosumerInfoHeader') prosumerInfoHeader:ElementRef;
	@ViewChild('prosumerInfoBattery') prosumerInfoBattery:ElementRef;
	@ViewChild('prosumerInfoCapacity') prosumerInfoCapacity:ElementRef;
	@ViewChild('prosumerInfoProduction') prosumerInfoProduction:ElementRef;
	@ViewChild('prosumerInfoConsumption') prosumerInfoConsumption:ElementRef;
	@ViewChild('prosumerInfoIsBlocked') prosumerInfoIsBlocked:ElementRef;
	@ViewChild('prosumerInfoCloseSymbol') prosumerInfoCloseSymbol:ElementRef;
	@ViewChild('prosumerInfoHasBlackout') prosumerInfoHasBlackout: ElementRef;
	@ViewChild(GraphComponent) graph: GraphComponent;
	private selectedProsumerId = null;
	private svgWidth = "24";
	private svgHeight = "24";
	private svgViewBox = "0 0 24 24";
	constructor(private graphqlService: GraphqlService, private dialogService: ConfirmDialogService, private alertService: AlertService) {}

	ngOnInit(): void {}

	ngAfterViewInit() {
		this.graph.createPlot(
			[
				{ x: [], y: [], type: 'scatter', mode: 'lines', marker: {color: 'red'}, name: 'Consumption' },
				{ x: [], y: [], type: 'scatter', mode: 'lines', marker: {color: 'green'}, name: 'Production' }
			],
			{ autosize: true }
		);
		this.graphqlService.addSubscriberCallback(this.onUpdate);
		this.hideElement(this.prosumerInfoContainer.nativeElement.id);
		this.prosumerInfoCloseSymbol.nativeElement.onclick = () => {this.hideElement(this.prosumerInfoContainer.nativeElement.id);};
	}

	public createProsumerList(prosumers): void {
		if (this.selectedProsumerId != null) {
			this.graphqlService.query(prosumerQueryById, {id:this.selectedProsumerId}).subscribe((data: any) => {
				const prosumer = data.prosumer;
				this.setAllProsumerInfo(prosumer, "Prosumer " + this.selectedProsumerId);				
			});
		}

		for (let i = 0; i < prosumers.length; i++) {
			if (this.prosumerList.nativeElement.children.length === 0) {
				this.createProsumerInfoEntry(prosumers[i].id, prosumers[i].house.hasBlackout);
			}
			else {
				let matchFound: boolean = false;
				for (let j = 0; j < this.prosumerList.nativeElement.children.length; j++) {
					if("Prosumer " + prosumers[i].id === this.prosumerList.nativeElement.children[j].textContent) {
						matchFound = true;
						let blackOutSvg = this.prosumerList.nativeElement.children[j].getElementsByClassName("online-status")[0];
						if (prosumers[i].house.hasBlackout) {
							if ( blackOutSvg !== undefined) {
								blackOutSvg.classList.remove("online-status");
							}
						}
						else {
							if (blackOutSvg === undefined) {
									this.prosumerList.nativeElement.children[j].children[0].classList.add("online-status");
							}
						}
					}

				}
				if ( matchFound === false) {
					this.createProsumerInfoEntry(prosumers[i].id,  prosumers[i].house.hasBlackout);
				}

			}
		}
	}

	public setProsumerInfoHeader(value: string) {
		this.prosumerInfoHeader.nativeElement.innerText = value;
	}

	public setProsumerInfoCurrency(value: number) {
		this.prosumerInfoCurrency.nativeElement.innerText =  value.toFixed(displayValuePrecision) + " ";
	}

	public setProsumerInfoBattery(value: number) {
		this.prosumerInfoBattery.nativeElement.innerText =  Ws_to_kWh(value).toFixed(displayValuePrecision) + " kWh";
	}	

	public setProsumerInfoCapacity(value: number) {
		this.prosumerInfoCapacity.nativeElement.innerText =  Ws_to_kWh(value).toFixed(displayValuePrecision) + " kWh";
	}

	public setProsumerInfoProduction(value: number) {
		this.prosumerInfoProduction.nativeElement.innerText = value.toFixed(displayValuePrecision) + " J";
	}

	public setProsumerInfoConsumption(value: number) {
		this.prosumerInfoConsumption.nativeElement.innerText =  value.toFixed(displayValuePrecision) + " J";
	}

	public setProsumerInfoIsBlocked(value: boolean) {
		this.prosumerInfoIsBlocked.nativeElement.innerText = value;
	}

	public setProsumerInfoHasBlackout(value: boolean) {
		this.prosumerInfoHasBlackout.nativeElement.innerText = value
	}

	public setAllProsumerInfo(prosumer: any, prosumerName: any) {
		this.setProsumerInfoHeader(prosumerName);
		this.setProsumerInfoCurrency(prosumer.currency);
		this.setProsumerInfoBattery(prosumer.house.battery.buffer);
		this.setProsumerInfoCapacity(prosumer.house.battery.capacity);
		this.setProsumerInfoProduction(prosumer.house.electricityProduction);
		this.setProsumerInfoConsumption(prosumer.house.electricityConsumption);
		this.setProsumerInfoIsBlocked(prosumer.isBlocked);
		this.setProsumerInfoHasBlackout(prosumer.house.hasBlackout);
	}

	public createProsumerInfoItem(prosumerId, prosumerButton, blackoutStatus): HTMLLIElement {
		const deleteSvg = this.createProsumerListDeleteSVG(prosumerId);
		const blockImage = this.createProsumerListblockIMG(prosumerId);
		const blackoutSvg = this.createProsumerListBlackoutSVG(blackoutStatus);
		const onlineStatusSvg = this.createProsumerListLoginStatusSVG();
		const item = document.createElement('li');
		item.className = "p-list";
		item.id = "prosumer-info-item_" + prosumerId;
		// deleteSvg needs to be appended first because of how online status css class gets added in createProsumerList
		item.appendChild(blackoutSvg);
		item.appendChild(prosumerButton);;
		item.appendChild(blockImage);
		item.appendChild(onlineStatusSvg);
		item.appendChild(deleteSvg);
		return item;

	}

	public createProsumerInfoEntry(prosumerId, blackoutStatus) {
		const prosumerName = document.createElement('button');
		prosumerName.innerText = `Prosumer ${prosumerId}`;
		prosumerName.onclick = () => {
			this.selectedProsumerId = prosumerId;
			this.graphqlService.query(prosumerQueryById, {id: prosumerId}).subscribe((data: any) => {
				const prosumer = data.prosumer;
				this.setAllProsumerInfo(prosumer, prosumerName.innerText);
				this.showElement(this.prosumerInfoContainer.nativeElement.id);
				blackoutStatus = prosumer.house.hasBlackout;
			});
		}
		const item = this.createProsumerInfoItem(prosumerId, prosumerName, blackoutStatus);
		this.prosumerList.nativeElement.appendChild(item);
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
		const powerPlant = data.manager.powerPlant;
		this.setTemperature(powerPlant.geoData.temperature);
		this.setWindSpeed(powerPlant.geoData.windSpeed);
		this.createProsumerList(data.manager.prosumers);
		const time = new Date();
		this.graph.appendToPlot(
			[[time], [time]],
			[[powerPlant.electricityConsumption], [powerPlant.electricityProduction]]
		);
	}

	public createProsumerListBlackoutSVG(blackoutStatus): SVGSVGElement{
		const blackoutSvg = document.createElementNS('http://www.w3.org/2000/svg', "svg");
		blackoutSvg.setAttribute("width", this.svgWidth);
		blackoutSvg.setAttribute("height", this.svgHeight);
		blackoutSvg.setAttribute("viewBox", this.svgViewBox);
		blackoutSvg.classList.add("prosumer-list-blackout-status");
		if(!blackoutStatus) blackoutSvg.classList.add("online-status");
		const blackoutShape = document.createElementNS('http://www.w3.org/2000/svg', "path");
		blackoutShape.setAttribute("d","M19 6.734c0 4.164-3.75 6.98-3.75 10.266h-6.5c0-3.286-3.75-6.103-3.75-10.266 0-4.343 3.498-6.734 6.996-6.734 3.502 0 7.004 2.394 7.004 6.734zm-4.5 11.266h-5c-.276 0-.5.224-.5.5s.224.5.5.5h5c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm0 2h-5c-.276 0-.5.224-.5.5s.224.5.5.5h5c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm.25 2h-5.5l1.451 1.659c.19.216.465.341.753.341h1.093c.288 0 .562-.125.752-.341l1.451-1.659z");		
		blackoutSvg.appendChild(blackoutShape);
		return blackoutSvg;

	}

	public createProsumerListLoginStatusSVG(): SVGSVGElement{
		const loginStatusSvg = document.createElementNS('http://www.w3.org/2000/svg', "svg");
		loginStatusSvg.setAttribute("width", this.svgWidth);
		loginStatusSvg.setAttribute("height", this.svgHeight);
		loginStatusSvg.setAttribute("viewBox", this.svgViewBox);
		loginStatusSvg.setAttribute('fill-rule', 'evenodd');
		loginStatusSvg.setAttribute('clip-rule', "evenodd");
		const loginStatusShape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		loginStatusShape.setAttribute('d', "M3.732 13h1.504s2.32-8.403 2.799-10.263c.156-.605.646-.738.965-.737.319.001.826.224.947.74.581 2.466 3.11 13.908 3.11 13.908s1.597-6.441 1.943-7.891c.101-.425.536-.757 1-.757.464 0 .865.343 1 .707.312.841 1.675 4.287 1.677 4.293h1.591c.346-.598.992-1 1.732-1 1.104 0 2 .896 2 2s-.896 2-2 2c-.741 0-1.388-.404-1.734-1.003-.939-.001-1.856 0-2.266.003-.503.004-.774-.289-.928-.629l-.852-2.128s-1.828 7.367-2.25 8.999c-.153.595-.646.762-.97.758-.324-.004-.847-.198-.976-.783-.549-2.487-2.081-9.369-3.123-14.053 0 0-1.555 5.764-1.936 7.099-.13.454-.431.731-.965.737h-2.268c-.346.598-.992 1-1.732 1-1.104 0-2-.896-2-2s.896-2 2-2c.74 0 1.386.402 1.732 1z");
		loginStatusSvg.appendChild(loginStatusShape)
		return loginStatusSvg;
	}

	public createProsumerListDeleteSVG(prosumerId): SVGSVGElement {
		const deleteSvg =  document.createElementNS('http://www.w3.org/2000/svg', "svg");
		deleteSvg.onclick = () => {
			const dialogData = {
				title: `Delete prosumer ${prosumerId}`,
				message: '',
				cancelText: 'Cancel',
				confirmText: 'Confirm',
			  };
			  this.dialogService.open(dialogData);
			  this.dialogService.confirmed().subscribe(confirmed => {
				if (confirmed) {
					this.graphqlService.mutate(deleteProsumerMutation, {id: prosumerId}).subscribe( () => {
						let item  = document.getElementById("prosumer-info-item_" + prosumerId);
						if (item !== null) {
							this.prosumerList.nativeElement.removeChild(item);
							if (this.selectedProsumerId === prosumerId) {
								this.selectedProsumerId = null;
								this.hideElement(this.prosumerInfoContainer.nativeElement.id);

							}
						}
					});
				}	
			 });
		}
		deleteSvg.setAttribute("width", this.svgWidth);
		deleteSvg.setAttribute("height", this.svgHeight);
		deleteSvg.setAttribute("viewBox", this.svgViewBox);
		const deleteShape = document.createElementNS('http://www.w3.org/2000/svg', "path");
		deleteShape.setAttribute("d", "M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z");
		deleteSvg.appendChild(deleteShape);
		return deleteSvg;
	}

	createProsumerListblockIMG(prosumerId: any): HTMLImageElement {
		const blockImage = document.createElement('img');
		blockImage.src = "/assets/stop.svg";
		blockImage.onclick = () => {this.blockProsumer(prosumerId)};
		blockImage.alt = "Block";
		return blockImage;
	}

	public blockProsumer(prosumerId: number) {
		const inputFieldContainer = document.createElement("div");
		let inputField = document.createElement("input");
		inputField.placeholder = "Block duration in seconds";
		inputFieldContainer.appendChild(inputField);
		const dialogData = {
			title: `Block prosumer ${prosumerId}`,
			message: '',
			cancelText: 'Cancel',
			confirmText: 'Confirm',
			extraField: inputFieldContainer
		  };
		  this.dialogService.open(dialogData);
		  this.dialogService.confirmed().subscribe(confirmed => {
			if (confirmed) {
				const input = parseFloat(inputField.value);
				if(!isNaN(input))
					this.graphqlService.mutate(setProsumerSellTimeoutMutation, { id: prosumerId, seconds: input}).subscribe();
				else {
					this.alertService.error("Invalid input, prosumer block aborted", {autoClose: true});
				}
			}
		 });
	}
}
