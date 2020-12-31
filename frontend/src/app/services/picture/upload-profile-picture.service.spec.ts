import { TestBed } from '@angular/core/testing';
import { UploadProfilePictureService } from './upload-profile-picture.service';

describe('UploadProfilePictureService', () => {
	let service: UploadProfilePictureService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(UploadProfilePictureService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
