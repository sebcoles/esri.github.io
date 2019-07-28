define([
    "dojo/_base/declare",
    "esri/Map",
    "esri/views/MapView",
    "esri/geometry/Point",
    "esri/widgets/Legend",
    "esri/widgets/LayerList",
    "esri/widgets/BasemapGallery",
    "esri/views/draw/Draw",
    "esri/Graphic",
    "esri/layers/FeatureLayer",
    "esri/geometry/geometryEngine"
], function (declare, Map, MapView, Point, Legend, LayerList, 
    BasemapGallery, Draw, Graphic, FeatureLayer, geometryEngine) {
    var EsriService = declare(null, {

        map: null,
        view: null,
        draw: null,
        legend: null,
        properties: null,
        featureLayers: [],
        basemapGallery: null,

        createMap: function (options = { basemap: "topo" }) {
            if (this.map == null)
                this.map = new Map(options);

            return this.map;
        },

        createMapView: function (options = {
            container: "viewDiv",
            center: [-3.10, 51.019987],
            zoom: 15
        }) {
            options.map = this.map;

            if (this.view == null)
                this.view = new MapView(options);

            return this.view;
        },

        createDraw: function(){
            this.draw = new Draw({
                view: this.view
            });
        },

        addToUi: function(div, location){
            this.view.ui.add(div, location);
        },

        addFeatureLayer: function (layer) {
            this.map.add(layer);
            this.addLegend();
        },

        addLegend: function (location = "bottom-right") {
            if (this.legend != null)
                this.view.ui.remove(this.legend, location);

            layerInfo = [];
            this.map.allLayers.forEach(function (item) {
                layerInfo.push({
                    layer: item,
                    title: item.title
                })
            })

            this.legend = new Legend({
                view: this.view,
                layerInfos: layerInfo
            });

            this.view.ui.add(this.legend, location);
        },

        addLayerList: function (position = "top-right") {
            if (this.view == null)
                throw 'View must be created first.'

            layerList = new LayerList({ view: this.view });
            this.view.ui.add(layerList, { position: position });
        },

        addBasemapGallery: function (position = "top-right") {
            if (this.view == null)
                throw 'View must be created first.'

            if (this.basemapGallery == null)
                this.basemapGallery = new BasemapGallery({
                    view: this.view
                });

            myService.view.ui.remove(this.basemapGallery);
            myService.view.ui.add(this.basemapGallery, { position: position });
        },

        getFeatureLayers: function () {
            return this.map.allLayers;
        },

        getFeatureLayer: function (title) {
            return this.map.allLayers.find(function (layer) {
                return layer.title === title;
            });;
        },
        
        removeFeature: function(featureName){
            let resultsFeature = this.getFeatureLayer(featureName);
            if(resultsFeature != null)
                this.map.remove(resultsFeature);
        },
        
        polygonEvent: function(){
            this.view.graphics.removeAll();
            const action = this.draw.create("polyline");
            this.view.focus();      
            action.on(
              [
                "vertex-add",
                "vertex-remove",
                "cursor-update",
                "redo",
                "undo",
                "draw-complete"
              ],
              this.updateVertices.bind(this)
            );
        },

        updateVertices: function (event) {
            if (event.vertices.length > 1) {
                const result = this.createGraphic(event);

                if (result.selfIntersects) {
                    event.preventDefault();
                }
            }
        },

        createGraphic: function (event) {
            const vertices = event.vertices;
            this.view.graphics.removeAll();

            const graphic = new Graphic({
                geometry: {
                    type: "polyline",
                    paths: vertices,
                    spatialReference: view.spatialReference
                },
                symbol: {
                    type: "simple-line",
                    color: [4, 90, 141],
                    width: 4,
                    cap: "round",
                    join: "round"
                }
            });

            const intersectingSegment = this.getIntersectingSegment(graphic.geometry);

            if (intersectingSegment)
                this.view.graphics.addMany([graphic, intersectingSegment]);
            else
                this.view.graphics.add(graphic);

            return {
                selfIntersects: intersectingSegment
            };
        },

        isSelfIntersecting: function (polyline) {
            if (polyline.paths[0].length < 3) {
                return false;
            }
            const line = polyline.clone();
            const lastSegment = this.getLastSegment(polyline);
            line.removePoint(0, line.paths[0].length - 1);
            return geometryEngine.crosses(lastSegment, line);
        },

        getIntersectingSegment: function (polyline) {
            if (this.isSelfIntersecting(polyline)) {
                return new Graphic({
                    geometry: this.getLastSegment(polyline),
                    symbol: {
                        type: "simple-line",
                        style: "short-dot",
                        width: 3.5,
                        color: "yellow"
                    }
                });
            }
            return null;
        },

        getLastSegment: function (polyline) {
            const line = polyline.clone();
            const lastXYPoint = line.removePoint(0, line.paths[0].length - 1);
            const existingLineFinalPoint = line.getPoint(
                0,
                line.paths[0].length - 1
            );

            return {
                type: "polyline",
                spatialReference: this.view.spatialReference,
                hasZ: false,
                paths: [
                    [
                        [existingLineFinalPoint.x, existingLineFinalPoint.y],
                        [lastXYPoint.x, lastXYPoint.y]
                    ]
                ]
            };
        },

        movePolygonToFeature: function(){
            this.removeFeature("Search");
            let featureLayer = new FeatureLayer({
                title: "Search",
                source: this.view.graphics.items,
                objectIdField: "ObjectID",
                renderer: {
                    type: "simple",
                    symbol: {
                        type: "simple-line",
                        color: [1, 141, 90, 0.8],  // orange, opacity 80%
                        width: 4
                      }
                },
                spatialReference: {
                    wkid: 4326
                },
                geometryType: "polyline",
                popupTemplate: {
                    title: "{Name}",
                },
                visible: true
            });

            this.addFeatureLayer(featureLayer);
            this.view.graphics.removeAll();
        },

        searchProperties: function(){
            this.removeFeature("Results");
            let searchFeature = this.getFeatureLayer("Search");
            var query = this.properties.createQuery();
            query.geometry = searchFeature.fullExtent;       
            query.outFields = ['*']; 
            this.properties.queryFeatures(query)
                .then(this.displayResults.bind(this));    
        },   
    
        displayResults: function(response) {
            let featureLayer = new FeatureLayer({
                title: "Results",
                source: response.features.map(function (feature) {
                    return {
                        geometry: new Point({
                            x: feature.geometry.longitude,
                            y: feature.geometry.latitude
                        }),
                        attributes: {
                            ObjectID: feature.attributes.ObjectID,
                            NoBedrooms: feature.attributes.NoBedrooms,
                            PropertyType: feature.attributes.PropertyType,
                            Price: feature.attributes.Price
                        }
                }}),
                fields: [{
                    name: "ObjectID",
                    alias: "ObjectID",
                    type: "oid"
                }, {
                    name: "PropertyType",
                    alias: "PropertyType",
                    type: "string"
                }, {
                    name: "NoBedrooms",
                    alias: "NoBedrooms",
                    type: "integer"
                }, {
                    name: "Price",
                    alias: "Price",
                    type: "double"
                }],
                objectIdField: "ObjectID",
                renderer: {
                    type: "simple",
                    symbol: {
                        type: "simple-marker",
                        style: "square",
                        size: 20,
                        color: [106, 119, 240],
                        outline: {
                            width: 1,
                            color: "#FF0055",
                            style: "solid"
                        }
                    }
                },
                spatialReference: {
                    wkid: 4326
                },
                geometryType: "point",
                popupTemplate: {
                    title: "{Price}",
                    content: "<p>{PropertyType} - {NoBedrooms} bedrooms</p>"
                },
                visible: true
            });

            this.addFeatureLayer(featureLayer);
        }
    });

    var myService = new EsriService()
    return myService;
});
