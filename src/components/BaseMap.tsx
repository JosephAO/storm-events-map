import { useRef } from "react";
import MapView from "@arcgis/core/views/MapView";
import ArcGISMap from "@arcgis/core/Map";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import axios from "axios";

type NOAAFeature = {
	geometry: {
		type: string;
		coordinates: [number, number];
	};
	properties: {
		OBJECTID: number;
		CZ_NAME: string;
		EVENT_TYPE: string;
		STATE: string;
		Year: number;
	};
};

function BaseMap() {
	const mapDiv = useRef(null);

	var thisMap = new ArcGISMap({
		basemap: "gray-vector"
	});

	const getData = async () => {
		const url =
			"https://services.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/NOAA_Storm_Events_Database_view/FeatureServer/0/query";

		const params = {
			f: "pgeojson",
			where: "state = 'NORTH CAROLINA' and EVENT_TYPE = 'Winter Storm' and Year = 2021",
			outfields: "objectid, state, EVENT_TYPE, Year, CZ_NAME"
		};

		await axios
			.get(url, { params })
			.then((res) => {
				if (res.data.features) {
					let graphics: Graphic[] = res.data.features.map((entry: NOAAFeature) => {
						const { coordinates } = entry.geometry;
						const { OBJECTID, CZ_NAME, EVENT_TYPE, STATE, Year } = entry.properties;

						return new Graphic({
							attributes: {
								OBJECTID,
								CZ_NAME,
								EVENT_TYPE,
								STATE,
								Year
							},
							geometry: new Point({
								x: coordinates[0],
								y: coordinates[1]
							})
						});
					});

					thisMap.layers.add(
						new FeatureLayer({
							source: graphics,
							objectIdField: "OBJECTID"
						})
					);
				} else {
					throw new Error("No Data Returned");
				}
			})
			.catch((err) => console.error(err));
	};

	const initMap = () => {
		if (mapDiv.current) {
			new MapView({
				container: mapDiv.current,
				map: thisMap,
				center: [-80.793457, 35.782169],
				zoom: 6
			});
		}
	};

	getData().then(() => initMap());

	return <div className="mapDiv" ref={mapDiv} />;
}

export default BaseMap;
