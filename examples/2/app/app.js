define([
    "dojo/_base/declare",
    "shared/services/esriService",
    "shared/repos/floodRiskRepository",
    "shared/repos/propertiesRepository",
    "shared/repos/schoolsRepository",
    "dojo/promise/all",
    "dojo/domReady!"
], function (declare, EsriService, FloodRiskRepository, PropertiesRepository, SchoolsRepository, all) {
    return declare(null, {
        map: null,
        view: null,

        constructor: function () {       
            map = EsriService.createMap();
            view = EsriService.createMapView();
            let floodRiskRepository = new FloodRiskRepository();
            let propertiesRepository = new PropertiesRepository();
            let schoolsRepository = new SchoolsRepository();
            all({
                floods: floodRiskRepository.getFeatureLayer(),
                properties: propertiesRepository.getFeatureLayer(),  
                schools: schoolsRepository.getFeatureLayer()                   
            }).then(function (featureLayers) {
                EsriService.addFeatureLayer(featureLayers.floods);
                EsriService.addFeatureLayer(featureLayers.properties);
                EsriService.addFeatureLayer(featureLayers.schools);
                EsriService.addLegend();                               
                EsriService.addLayerList();   
                EsriService.addToUi("line-button", "top-left");
                EsriService.addToUi("save-button", "top-left");
                EsriService.createDraw();
                document.getElementById("line-button").onclick = EsriService.polygonEvent.bind(EsriService);
                document.getElementById("save-button").onclick = EsriService.movePolygonToFeature.bind(EsriService);
            });
        },

        
    })
});