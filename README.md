# React.js

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). All default scripts are available.

# My Solution

This app uses a functional component to load a basic [ArcGIS](https://developers.arcgis.com/documentation/) UI marking the location of Winter Storms in North Carolina for 2021.

A new [Map](https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html) is initialized as a variable. The component then uses the [axios](https://www.npmjs.com/package/axios) library to query the given [API of NOAA events](https://services.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/NOAA_Storm_Events_Database_view/FeatureServer/0/query). The containing method returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

Axios Query Parameters:

> STATE = 'NORTH CAROLINA'  
> EVENT_TYPE = 'Winter Storm'  
> Year = 2021

The HTTP response data is mapped to an array of [Graphics](https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html), and a [FeatureLayer](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html) is created from that array. Then that FeatureLayer is added to the existing Map.

The query method is called standalone, and when the Promise resolve it initializes the [MapView](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html) which display the UI.

# Coding Process

### **TypeScript**

This was my first time using TypeScript in a React.js project. It took some time and tutorials to get acquainted to strongly typing the code, as well as using the imported classes in order to prevent errors.

### **ArcGIS**

I was unfamiliar with processing geolocation data, so I looked in the namespace for the query form. This led me to ultimately use the [@arcgis/core](https://www.npmjs.com/package/@arcgis/core) library, with the [ArcGIS for JavaScript documentation](https://developers.arcgis.com/javascript/latest/) as a reference to answer most questions. It took time to understand the relationship between the map, view, and layers, as well as their proper TypeScript syntax.

One place I was stuck on for a while was: how to query the NOAA URL with the proper parameters. I was attempting to use the URL that results from a search as the server-side source for a FeatureLayer.

example:

```js
const layer = new FeatureLayer({
	url: "https://services.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/NOAA_Storm_Events_Database_view/FeatureServer/0/query?where=STATE+%3D+%27NORTH+CAROLINA%27+AND+YEAR+%3D+2021+and+EVENT_TYPE+%3D+%27Winter+Storm%27"
});
```

But this constantly resulted in a FeatureLayer containing every existing data point in the NOAA database, regardless of parameters. I attempted a few different URL and Layer type variations without success.

I was under the impression that the FeatureLayer, or some other Layer type, was able to query a given URL on it's own, or parse the query params but I couldn't get this to work... This is elaborated on in the following Retrospective.

I reached out to Ryan at Esquire who provided the hint that the base URL could be used with a simple GET request. This is when I understood that the Graphics would be client-side, and I added axios to the project to retrieve and build the data in memory.

From there I used the Intellisense hints and the previously mentioned documentation to properly cast the variables and Objects from the response. I was then able to build the FeatureLayer from the returned data.

### **Retrospective**

Upon re-reading the documentation and some reflection, I can see a few areas of improvement.

_Unfamiliar Framework:_  
An initial worry that repeatedly made me feel I was off-track was the appearance of so many type errors. When using FeatureLayer, I was not expecting to need more ArcGIS class types within the class initializations and methods. This made me think twice whenever I wasn't able to follow code examples using simple objects. I may have abandoned some solutions early, trying to find a 'better approach' or a more exact example.

_Knowing Where to Look:_  
My initial search for ArcGIS documentation led me to examples using plain JS in "\<script/>" tags and mentioned [AMD modules](https://dojotoolkit.org/documentation/tutorials/1.10/modules/index.html). I wasted some effort trying to guess at how to translate this to import the various classes, but later found most pages for the class types had import snippets and a few even TypeScript warnings about auto-casting.

_Missed Solution:_  
A combination of the above led me to overlook an answer that would have saved time and energy. It appears [Query](https://developers.arcgis.com/javascript/latest/api-reference/esri-rest-support-Query.html) performs the very function that I was originally looking for. It sends the WHERE and OUTFIELD params that I used in the axios get request, and expects the Feature collection that I extracted from the response.data object. This removes the need to manually map the GET request results, and likely improves performance.

_Wishlist Feature:_  
I included the county name in the GEOJSON data, with a plan to display this as a label on each point on the map. Since it's taken enough time to create the existing code already, this wasn't added.
