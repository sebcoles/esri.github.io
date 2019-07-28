define([
    "dojo/_base/declare",
    "esri/geometry/Point",
    "esri/layers/FeatureLayer",
    "dojox/uuid/generateRandomUuid",
    "dojo/request"
], function (declare, Point, FeatureLayer, Uuid, request) {
    return declare(null, {
        jsonFile: "../../data/properties.json",
        httpRequest: null,
        rng: null,

        constructor: function(){
            this.httpRequest = request;
            this.rng = Uuid;
        },

        getFeatureLayer: function(){
            return this.getData()
                .then(this.buildFeatureLayer.bind(this));
        },

        getData: function(){
            return this.httpRequest.get(this.jsonFile,{ handleAs :"json"});
        },

        buildFeatureLayer: function(data){
            let graphics = this.buildGraphic(data)
            return new FeatureLayer({
                title: "Properties",
                source: graphics,
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
                outFields: ["*"],
                visible: true
            });
        },

        buildGraphic: function (data) {
            return data.map(function (feature) {
                return {
                    geometry: new Point({
                        x: feature.Longitude,
                        y: feature.Latitude
                    }),

                    attributes: {
                        ObjectID: this.rng(),
                        NoBedrooms: feature.NoBedrooms,
                        PropertyType: feature.PropertyType,
                        Price: feature.Price
                    }
                }
            }.bind(this));
        },
    });
});
