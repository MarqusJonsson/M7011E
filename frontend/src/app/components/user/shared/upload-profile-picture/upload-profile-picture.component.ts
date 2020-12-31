import { Component, OnInit } from '@angular/core';
import { UploadProfilePictureService } from 'src/app/services/picture/upload-profile-picture.service';
import { HttpEventType } from '@angular/common/http';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
	selector: 'app-upload-profile-picture',
	templateUrl: './upload-profile-picture.component.html',
	styleUrls: ['./upload-profile-picture.component.css']
})
export class UploadProfilePictureComponent implements OnInit {
	currentFile: File;
	progress = 0;
	uploading = false;
	url = '';
	
	constructor(private uploadPictureService: UploadProfilePictureService, private alertService: AlertService) {}

	ngOnInit(): void {
	}

	onSelectFile(event) {
		if (event.target.files && event.target.files[0]) {
			if (event.target.files[0].type.match(UploadProfilePictureService.ALLOWED_MIME_TYPES_REGEX) === null) {
				this.alertService.error('Invalid file type', { autoClose: true });
				this.currentFile = undefined;
			} else {
				this.currentFile = event.target.files[0];
				var reader = new FileReader();
				reader.readAsDataURL(event.target.files[0]); // Read file as data url
				reader.onload = (event) => { // Called once readAsDataURL is completed
					this.url = event.target.result as string;
				}
			}
		}
	}

	upload(): void {
		this.progress = 0;
		this.uploading = true;
		this.uploadPictureService.upload(this.currentFile).subscribe(
			event => {
				if (event.type === HttpEventType.UploadProgress) {
					this.progress = Math.round(100 * event.loaded / event.total);
				} else if (event.type === HttpEventType.Response) {
					this.alertService.success('Successfully uploaded picture', { autoClose: true });
					setTimeout(() => {
						this.uploading = false;
					}, 500);
				}
			},
			error => {
				this.alertService.error(error.message, { autoClose: true });
				this.progress = 0;
				this.currentFile = undefined;
				this.uploading = false;
			});
	}
}
