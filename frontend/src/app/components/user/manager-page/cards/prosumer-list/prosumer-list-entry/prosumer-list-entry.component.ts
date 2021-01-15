import { Component, ElementRef, HostListener } from '@angular/core';
import { Prosumer, prosumerQueryById, ProsumerQueryData, setProsumerSellTimeoutMutation } from 'src/app/models/graphql/prosumer';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ConfirmDialogService } from 'src/app/services/dialog/confirm-dialog.service';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { DeleteProsumerService } from 'src/app/services/user/delete-prosumer.service';

@Component({
	selector: 'app-prosumer-list-entry',
	templateUrl: './prosumer-list-entry.component.html',
	styleUrls: ['./prosumer-list-entry.component.css']
})

export class ProsumerListEntryComponent {
	public id: number;
	public data = {
		title: '',
		isOnline: false,
		hasBlackout: false,
		isBlocked: false,
		view: false
	};
	public viewedProsumer: Prosumer;
	private subscriberCallbackId: number;

	constructor(
		private graphqlService: GraphqlService,
		private dialogService: ConfirmDialogService,
		private alertService: AlertService,
		private deleteProsumerService: DeleteProsumerService,
		private hostElement: ElementRef
	) {}

	public update = (prosumer: Prosumer) => {
		this.id = prosumer.id;
		this.data.title = `Prosumer ${prosumer.id}`;
		this.data.isOnline = prosumer.isOnline;
		this.data.hasBlackout = prosumer.house.hasBlackout;
		this.data.isBlocked = prosumer.isBlocked;
	}

	public toggleProsumerViewOverlay(value = !this.data.view) {
		this.data.view = !this.data.view;
		if (this.data.view) {
			// This is first query is a bad hack to get the data viewed after one fetch instead of two
			// Could be done instantly instead but this hack was used due to time constraint
			this.graphqlService.query(prosumerQueryById, { id: this.id }).subscribe((data: ProsumerQueryData) => {
				this.viewedProsumer = data.prosumer;
			});
			// Query the prosumer data, this query should be mereged with the main query
			// user to query the manager data, but this is not done due to time constraints
			// it is instead added as a seperate query called every time the main query finishes a query
			this.subscriberCallbackId = this.graphqlService.addSubscriberCallback(() => {
				this.graphqlService.query(prosumerQueryById, { id: this.id }).subscribe((data: ProsumerQueryData) => {
					this.viewedProsumer = data.prosumer;
				});
			});
		} else {
			this.graphqlService.removeSubscriberCallback(this.subscriberCallbackId);
			this.subscriberCallbackId = undefined;
			this.viewedProsumer = undefined;
		}
	}

	@HostListener('keydown.esc')
	public onEsc() {
		if (this.data.view) {
			this.toggleProsumerViewOverlay(false);
		}
	}

	public openDeleteProsumerDialog() {
		const dialogData = {
			title: `Delete prosumer ${this.id}`,
			message: '',
			cancelText: 'Cancel',
			confirmText: 'Confirm',
		};
		this.dialogService.open(dialogData);
		this.dialogService.confirmed().subscribe(confirmed => {
			if (confirmed) {
				this.deleteProsumer();
			}
		});
	}

	private deleteProsumer() {
		this.hostElement.nativeElement.classList.add('hidden');
		this.deleteProsumerService.deleteProsumer(this.id).subscribe();
	}

	public openBlockProsumerDialog() {
		const inputFieldContainer = document.createElement('div');
		const inputField = document.createElement('input');
		inputField.placeholder = 'Block duration in seconds';
		inputFieldContainer.appendChild(inputField);
		const dialogData = {
			title: `Block prosumer ${this.id}`,
			message: '',
			cancelText: 'Cancel',
			confirmText: 'Confirm',
			extraField: inputFieldContainer
		};
		this.dialogService.open(dialogData);
		this.dialogService.confirmed().subscribe(confirmed => {
			if (confirmed) {
				const input = parseFloat(inputField.value);
				if (!isNaN(input) && input > 0) {
					this.blockProsumer(input);
				} else {
					this.alertService.error('Invalid input, prosumer block aborted', {autoClose: true});
				}
			}
		});
	}

	private blockProsumer(seconds: number) {
		this.graphqlService.mutate(setProsumerSellTimeoutMutation, { id: this.id, seconds }).subscribe(() => {
			this.data.isBlocked = true;
		});
	}
}
