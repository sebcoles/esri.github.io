define([
    "dojo/_base/declare",
    "esri/geometry/Point",
    "esri/layers/FeatureLayer",
    "dojox/uuid/generateRandomUuid",
    "dojo/request"
], function (declare, Point, FeatureLayer, Uuid, request) {
    return declare(null, {
        jsonFile: "../../data/schools.json",
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
                title: "Schools",
                source: graphics,
                fields: [{
                    name: "ObjectID",
                    alias: "ObjectID",
                    type: "oid"
                }, {
                    name: "Name",
                    alias: "Name",
                    type: "string"
                },{
                    name: "Ofsted",
                    alias: "Ofsted",
                    type: "string"
                }],
                objectIdField: "ObjectID",
                renderer: {
                    type: "simple",
                    symbol: {
                        type: "simple-marker",
                        style: "circle",
                        size: 20,
                        color: [226, 119, 40],
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
                    title: "{Name}",
                    content: "<p>{Ofsted}</p>"
                },
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
                        Name: feature.Name,
                        Ofsted: feature.Ofsted
                    }
                }
            }.bind(this));
        },
    });
});
