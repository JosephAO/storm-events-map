import React, { useRef, useEffect } from "react";
import MapView from "@arcgis/core/views/MapView";
import ArcGISMap from "@arcgis/core/Map";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import TopFeaturesQuery from "@arcgis/core/rest/support/TopFeaturesQuery";
type Props = {};

function BaseMap({}: Props) {
	const mapDiv = useRef(null);

	useEffect(() => {
		if (mapDiv.current) {
			const stormData = new FeatureLayer({
				url: "https://services.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/NOAA_Storm_Events_Database_view/FeatureServer/0/query",
				outFields: ["NAME"]
			});

			const agMap = new ArcGISMap({
				basemap: "gray-vector"
				// layers: [stormData]
			});

			const view = new MapView({
				container: mapDiv.current,
				map: agMap,
				center: [-80.793457, 35.782169],
				zoom: 5
			});
		}
	}, []);
	return <div className="mapDiv" ref={mapDiv} />;
}

export default BaseMap;
