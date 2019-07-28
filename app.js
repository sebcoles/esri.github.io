define([
    "dojo/_base/declare",
    "shared/services/esriService",
    "dojo/domReady!"
], function (declare, EsriService) {
    return declare(null, {
        map: null,
        view: null,

        constructor: function () {
            map = EsriService.createMap();
            view = EsriService.createMapView();
            EsriService.addToUi("demo1-button", "top-left");
            EsriService.addToUi("demo2-button", "top-left");
            EsriService.addToUi("demo3-button", "top-left");
            document.getElementById("demo1-button").onclick = this.goToDemo1;
            document.getElementById("demo2-button").onclick = this.goToDemo2;
            document.getElementById("demo3-button").onclick = this.goToDemo3;
        },

        goToDemo1: function () {
            window.location.href = "/examples/1/";
        },

        goToDemo2: function () {
            window.location.href = "/examples/2/";
        },

        goToDemo3: function () {
            window.location.href = "/examples/3/";
        }
    })
});