import { Component, ComponentFactoryResolver, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as Plotly from 'plotly.js'

@Component({
	selector: 'data-graph',
	templateUrl: './graph.component.html',
	styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
	public id: string;
	public data: Plotly.Data[] = [ { x: [], y: [], type: 'scatter', mode: 'lines', marker: {color: 'red'} } ];
	public layout: Partial<Plotly.Layout> = { autosize: true, title: 'A Fancy Plot' };

	constructor(private hostElement: ElementRef) {
		this.id = hostElement.nativeElement.id + "-content";
	}

	ngOnInit(): void {}

	ngAfterViewInit() {
	}
	
	public createPlot(data: Plotly.Data[], layout?: Partial<Plotly.Layout>, config?: Partial<Plotly.Config>) {
		Plotly.newPlot(this.id, data, layout, config);
	}

	public appendToPlot(x: any[][], y: any[][]) {
		const indices = [...Array(x.length).keys()];
		Plotly.extendTraces(
			this.id,
			{
				x: x,
				y: y
			},
			indices
		);
	}
}
