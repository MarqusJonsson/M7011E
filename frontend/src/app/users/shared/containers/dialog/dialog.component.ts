import { Optional } from '@angular/core';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: [`./dialog.component.css`]
})
export class DialogComponent implements OnInit {
	constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: {
		cancelText: string,
		confirmText: string,
		message: string,
		title: string
}, @Optional()private dialogRef: MatDialogRef<DialogComponent>){}

	ngOnInit(): void {
	}

	public cancel() {
		this.close(false);
	}
	public close(value) {
		this.dialogRef.close(value);
	}
	public confirm() {
		this.close(true);
	}
	@HostListener("keydown.esc") 
	public onEsc() {
		this.close(false);
	}

	@HostListener("keydown.enter")
	public onEnter() {
		this.confirm();
	} 


}
