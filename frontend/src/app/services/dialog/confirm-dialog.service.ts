import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
@Injectable({
	providedIn: 'root'
})
export class ConfirmDialogService {

	constructor(private dialog: MatDialog) { }
	dialogRef: MatDialogRef<DialogComponent>;
	public open(options) {
		this.dialogRef = this.dialog.open(DialogComponent, {
			data: {
				title: options.title,
				message: options.message,
				cancelText: options.cancelText,
				confirmText: options.confirmText,
				extraField : options.extraField
			}
		});
	}

	public confirmed(): Observable<any> {
		return this.dialogRef.afterClosed().pipe(
			take(1),
			map(res => {
				return res;
			}
		));
	}
}
