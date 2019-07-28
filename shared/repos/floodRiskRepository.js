define([
    "dojo/_base/declare",
    "esri/geometry/Polygon",
    "esri/layers/FeatureLayer",
    "dojox/uuid/generateRandomUuid",
    "dojo/request"
], function (declare, Polygon, FeatureLayer, Uuid, request) {
    return declare(null, {
        jsonFile: "../../data/flood.json",
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
                title: "Flood Risk",
                source: graphics,
                fields: [{
                    name: "ObjectID",
                    alias: "ObjectID",
                    type: "oid"
                }, {
                    name: "name",
                    alias: "name",
                    type: "string"
                }],
                objectIdField: "ObjectID",
                renderer: {
                    type: "simple",
                    symbol: {
                        type: "simple-fill",
                        color: [227, 139, 79, 0.8],  // orange, opacity 80%
                        outline: {
                          color: [255, 255, 255],
                          width: 1
                        }
                      }
                },
                spatialReference: {
                    wkid: 4326
                },
                geometryType: "polygon",
                popupTemplate: {
                    title: "{Name}",
                },
                visible: true
            });
        },

        buildGraphic: function (data) {
            return data.map(function (feature) {
                return {
                    geometry: new Polygon({
                        rings: feature.Shape,
                        spatialReference: { wkid: 4326 }
                    }),

                    attributes: {
                        ObjectID: this.rng(),
                        name: feature.Title
                    }
                }
            }.bind(this));
        },
    });
});
