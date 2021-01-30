import { Component, ElementRef, HostListener } from '@angular/core';
import { Prosumer, prosumerQueryById, ProsumerQueryData, setProsumerSellTimeoutMutation } from 'src/app/models/graphql/prosumer';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ConfirmDialogService } from 'src/app/services/dialog/confirm-dialog.service';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { ProsumerService } from 'src/app/services/user/prosumer.service';

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
		private prosumerService: ProsumerService,
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
		const inputFieldContainer = document.createElement('div');
		const info = document.createElement('p');
		info.textContent = 'Note: This action will terminate all active sessions related to the updated prosumer as soon as possible.';
		inputFieldContainer.appendChild(info);
		const dialogData = {
			title: `Delete prosumer ${this.id}`,
			message: '',
			cancelText: 'Cancel',
			confirmText: 'Confirm',
			extraField: inputFieldContainer
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
		this.prosumerService.delete(this.id).subscribe();
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
					this.alertService.error('Invalid input, prosumer block aborted', { autoClose: true });
				}
			}
		});
	}

	private blockProsumer(seconds: number) {
		this.graphqlService.mutate(setProsumerSellTimeoutMutation, { id: this.id, seconds }).subscribe(() => {
			this.data.isBlocked = true;
		});
	}

	public openUpdateProsumerEmailDialog() {
		const inputFieldContainer = document.createElement('div');
		const inputField = document.createElement('input');
		inputField.placeholder = 'New email';
		inputFieldContainer.appendChild(inputField);
		const info = document.createElement('p');
		info.textContent = 'Note: This action will terminate all active sessions related to the updated prosumer within 5 minutes.';
		inputFieldContainer.appendChild(info);
		const dialogData = {
			title: `Update email of prosumer ${this.id}`,
			message: '',
			cancelText: 'Cancel',
			confirmText: 'Confirm',
			extraField: inputFieldContainer
		};
		this.dialogService.open(dialogData);
		this.dialogService.confirmed().subscribe(confirmed => {
			if (confirmed) {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				const email = inputField.value;
				if (emailRegex.test(email)) {
					this.updateProsumerEmail(email);
				} else {
					this.alertService.error('Invalid input, update prosumer email aborted', { autoClose: true });
				}
			}
		});
	}

	private updateProsumerEmail(email: string) {
		this.prosumerService.updateEmail(this.id, email).subscribe();
	}

	public openUpdateProsumerPasswordDialog() {
		const inputFieldContainer = document.createElement('div');
		const inputField = document.createElement('input');
		inputField.placeholder = 'New password';
		inputField.setAttribute('type', 'password');
		inputFieldContainer.appendChild(inputField);
		const info = document.createElement('p');
		info.textContent = 'Note: This action will terminate all active sessions related to the updated prosumer within 5 minutes.';
		inputFieldContainer.appendChild(info);
		const dialogData = {
			title: `Update password of prosumer ${this.id}`,
			message: '',
			cancelText: 'Cancel',
			confirmText: 'Confirm',
			extraField: inputFieldContainer
		};
		this.dialogService.open(dialogData);
		this.dialogService.confirmed().subscribe(confirmed => {
			if (confirmed) {
				const password = inputField.value;
				if (password.length > 0) {
					this.updateProsumerPassword(password);
				} else {
					this.alertService.error('Invalid input, update prosumer password aborted', { autoClose: true });
				}
			}
		});
	}

	private updateProsumerPassword(password: string) {
		this.prosumerService.updatePassword(this.id, password).subscribe();
	}
}
