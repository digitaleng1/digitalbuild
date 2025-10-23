
import { Row, Col, Card } from 'react-bootstrap';
import {
	WorldVectorMap,
	RussiaVectorMap,
	SpainVectorMap,
	CanadaVectorMap,
	UsaVectorMap,
	ItalyVectorMap,
	IraqVectorMap,
} from '@/components/VectorMap';

import 'jsvectormap/dist/css/jsvectormap.min.css'
import WorldMapWithLine from '@/components/VectorMap/WorldMapWithLine';


const AllVectorMaps = () => {
	// vector map config
	const worldMapOptions = {
		map: 'world',
		zoomOnScroll: false,
		zoomButtons: true,
		markersSelectable: true,
		markers: [
			{ name: "Greenland", coords: [72, -42] },
			{ name: "Canada", coords: [56.1304, -106.3468] },
			{ name: "Brazil", coords: [-14.2350, -51.9253] },
			{ name: "Egypt", coords: [26.8206, 30.8025] },
			{ name: "Russia", coords: [61, 105] },
			{ name: "China", coords: [35.8617, 104.1954] },
			{ name: "United States", coords: [37.0902, -95.7129] },
			{ name: "Norway", coords: [60.472024, 8.468946] },
			{ name: "Ukraine", coords: [48.379433, 31.16558] },
		],
		markerStyle: {
			initial: { fill: "#3e60d5" },
			selected: { fill: "#3e60d56e" }
		},
		regionStyle: {
			initial: {
				stroke: "#9ca3af",
				strokeWidth: 0.25,
				fill: '#aab9d14d',
				fillOpacity: 1,
			},
		},
		labels: {
			markers: {
				render: (marker:any) => marker.name
			}
		}
	};

	const worldMapWithLineOptions = {
		map: "world_merc",
		zoomOnScroll: false,
		zoomButtons: false,
		markers: [{
			name: "Greenland",
			coords: [72, -42]
		},
			{
				name: "Canada",
				coords: [56.1304, -106.3468]
			},
			{
				name: "Brazil",
				coords: [-14.2350, -51.9253]
			},
			{
				name: "Egypt",
				coords: [26.8206, 30.8025]
			},
			{
				name: "Russia",
				coords: [61, 105]
			},
			{
				name: "China",
				coords: [35.8617, 104.1954]
			},
			{
				name: "United States",
				coords: [37.0902, -95.7129]
			},
			{
				name: "Norway",
				coords: [60.472024, 8.468946]
			},
			{
				name: "Ukraine",
				coords: [48.379433, 31.16558]
			},
		],
		lines: [{
			from: "Canada",
			to: "Egypt"
		},
			{
				from: "Russia",
				to: "Egypt"
			},
			{
				from: "Greenland",
				to: "Egypt"
			},
			{
				from: "Brazil",
				to: "Egypt"
			},
			{
				from: "United States",
				to: "Egypt"
			},
			{
				from: "China",
				to: "Egypt"
			},
			{
				from: "Norway",
				to: "Egypt"
			},
			{
				from: "Ukraine",
				to: "Egypt"
			},
		],
		regionStyle: {
			initial: {
				stroke: "#9ca3af",
				strokeWidth: 0.25,
				fill: '#aab9d14d',
				fillOpacity: 1,
			},
		},
		markerStyle: {
			initial: { fill: "#9ca3af" },
			selected: { fill: "#9ca3af" }
		},
		lineStyle: {
			animation: true,
			strokeDasharray: "6 3 6",
		},
	}
	return (
		<>
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">World Vector Map</h4>
							<WorldVectorMap height="360px" width="100%" options={worldMapOptions} />
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Markers Line Vector Map</h4>
							<WorldMapWithLine height="360px" width="100%" options={worldMapWithLineOptions} />
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Russia Vector Map</h4>
							<RussiaVectorMap
								height="300px"
								width="100%"
								options={{
									zoomOnScroll: false,
									regionStyle: {
										initial: {
											fill: '#727cf5',
										},
									},
								}}
							/>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Spain Vector Map</h4>
							<SpainVectorMap
								height="300px"
								width="100%"
								options={{
									zoomOnScroll: false,
									backgroundColor: 'transparent',
									regionStyle: {
										initial: {
											fill: '#6c757d',
										},
									},
								}}
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Canada Vector Map</h4>
							<CanadaVectorMap
								height="300px"
								width="100%"
								options={{
									zoomOnScroll: false,
									backgroundColor: 'transparent',
									regionStyle: {
										initial: {
											fill: '#0acf97',
										},
									},
								}}
							/>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">USA Vector Map</h4>
							<UsaVectorMap
								height="300px"
								width="100%"
								options={{
									zoomOnScroll: false,
									backgroundColor: 'transparent',
									regionStyle: {
										initial: {
											fill: '#39afd1',
										},
									},
								}}
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Italy Vector Map</h4>
							<ItalyVectorMap
								height="300px"
								width="100%"
								options={{
									zoomOnScroll: false,
									backgroundColor: 'transparent',
									regionStyle: {
										initial: {
											fill: '#fa5c7c',
										},
									},
								}}
							/>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Iraq Vector Map</h4>
							<IraqVectorMap
								height="300px"
								width="100%"
								options={{
									zoomOnScroll: false,
									backgroundColor: 'transparent',
									regionStyle: {
										initial: {
											fill: '#ffbc00',
										},
									},
								}}
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllVectorMaps;
