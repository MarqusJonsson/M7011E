import { Component, ElementRef, Input } from '@angular/core';
import * as Plotly from 'plotly.js';

@Component({
	selector: 'app-data-graph',
	templateUrl: './graph.component.html',
	styleUrls: ['./graph.component.css']
})
export class GraphComponent {
	private data: Partial<Plotly.PlotData>[];
	private layout: Partial<Plotly.Layout>;
	@Input() graphId: string;

	constructor(private hostElement: ElementRef<HTMLElement>) {}

	public createPlot(hexColor: string, variables: { name?: string, lineColor: string }[]) {
		this.data = [];
		variables.forEach((variable) => {
			this.data.push({
				name: variable.name || '',
				x: [] as Plotly.Datum[] | Plotly.Datum[][] | Plotly.TypedArray,
				y: [] as Plotly.Datum[] | Plotly.Datum[][] | Plotly.TypedArray,
				type: 'scatter',
				mode: 'lines',
				line: {
					color: variable.lineColor,
					shape: 'linear',
					width: 3
				}
			});
		});
		this.layout = this.createLayout(hexColor);
		Plotly.newPlot(this.graphId, this.data, this.layout);
	}

	public appendToPlot(x: any[][], y: any[][]) {
		const indices = [...Array(x.length).keys()];
		const graphDiv = this.hostElement.nativeElement.children[0] as any;
		Plotly.extendTraces(this.graphId, { x, y }, indices);
		// Remove every second data sample if trace contains more than 2500 points to prevent eventual performance issues
		if (graphDiv.data !== undefined) {
			for (const trace of graphDiv.data) {
				if (trace.x.length > 250) {
					trace.x = trace.x.filter((_: any, index: number) => index % 2 === 0);
					trace.y = trace.y.filter((_: any, index: number) => index % 2 === 0);
				}
			}
		}
	}

	private createLayout(hexColor: string): Partial<Plotly.Layout> {
		return {
			paper_bgcolor: '#00000000',
			plot_bgcolor: '#00000000',
			height: 270,
			legend: {
				x: 1,
				y: 0,
				xanchor: 'right',
				bgcolor: `${hexColor}6f`
			},
			font: {
				family: 'sans-serif',
				size: 12,
				color: hexColor
			},
			margin: {
				l: 10,
				r: 10,
				b: 40,
				t: 20
			},
			grid: {
				rows: 1,
				columns: 1,
				pattern: 'independent'
			},
			xaxis : {
				tickangle: 0,
				showticklabels: true,
				showgrid: true,
				gridcolor: `${hexColor}6f`,
				zerolinecolor: `${hexColor}6f`
			},
			yaxis : {
				showticklabels: true,
				ticksuffix: ' %',
				tickformat: `.3f`,
				range: [0, 100],
				position: 1,
				showgrid: true,
				gridcolor: `${hexColor}6f`,
				zerolinecolor: `${hexColor}6f`
			}
		};
	}
}
