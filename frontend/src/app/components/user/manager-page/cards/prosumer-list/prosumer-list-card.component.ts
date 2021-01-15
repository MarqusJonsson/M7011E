import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Prosumer } from 'src/app/models/graphql/prosumer';
import { ProsumerListEntryComponent } from './prosumer-list-entry/prosumer-list-entry.component';

@Component({
	selector: 'app-prosumer-list-card',
	templateUrl: './prosumer-list-card.component.html',
	styleUrls: ['./prosumer-list-card.component.css', '../../../shared/cards/base-card.css']
})
export class ProsumerListCardComponent {
	@ViewChild('prosumerList', { read: ViewContainerRef }) entryContainer: ViewContainerRef;
	private previousProsumers: TitleProsumerRefPair[] = [];
	private entryComponentFactory: ComponentFactory<ProsumerListEntryComponent>;

	constructor(private componentFactoryResolver: ComponentFactoryResolver) {
		this.entryComponentFactory = this.componentFactoryResolver.resolveComponentFactory(ProsumerListEntryComponent);
	}

	public update = (fetchedProsumers: Prosumer[]) => {
		const newProsumers: TitleProsumerRefPair[] = [];
		// Add or reuse component for every prosumer to the list of prosumers
		fetchedProsumers.forEach((fetchedProsumer) => {
			const title = `Prosumer ${fetchedProsumer.id}`;
			let titleProsumerRefPair: TitleProsumerRefPair;
			const pairIndex = this.previousProsumers.findIndex((pair) => pair.title === pair.title);
			if (pairIndex !== -1) {
				// Get previous reference if already in list
				titleProsumerRefPair = this.previousProsumers.splice(pairIndex, 1)[0];
			} else {
				// Create new if not already in list
				titleProsumerRefPair = {
					title,
					prosumerRef: this.entryContainer.createComponent<ProsumerListEntryComponent>(this.entryComponentFactory)
				};
				titleProsumerRefPair.prosumerRef.location.nativeElement.classList.add('app');
				this.entryContainer.element.nativeElement.appendChild(titleProsumerRefPair.prosumerRef.location.nativeElement);
			}
			newProsumers.push(titleProsumerRefPair);
			// Update component
			titleProsumerRefPair.prosumerRef.instance.update(fetchedProsumer);
		});
		// Remove prosumers that were not updated
		this.previousProsumers.forEach((titleProsumerRefPair) => {
			titleProsumerRefPair.prosumerRef.destroy();
		});
		this.previousProsumers = newProsumers;
	}
}

interface TitleProsumerRefPair {
	title: string;
	prosumerRef: ComponentRef<ProsumerListEntryComponent>;
}
