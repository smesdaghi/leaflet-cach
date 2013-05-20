mapUtils = function() {

var MAP, MAP_CONTROL, BASE_LAYERS = {};

var ATTRIBUTION = 'Map data &copy; '
  + '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
  + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
  + 'Imagery &copy; MapBox';

function tilePath(fileSystem, mapID) {
    var rootDir = fileSystem.root.fullPath;
    if (rootDir[rootDir.length-1] != '/') { rootDir += '/'; }
    return rootDir + 'tiles/' + mapID + '/{z}/{x}/{y}.png';
}

function reloadMap(options) {
    /*
     * Clear layers and reset based
     * on current mapIDs
     */
     
    //handle options
    var clear = options['clear'] || false;
    var fileSystem = options['fileSystem'] || null;
    var mapboxIDs = options['mapIDs'] || null;
    
    if (!fileSystem) { alert('Must specify fileSystem'); return; }

    if (!MAP) { //initialize map if first time
        MAP = L.map('map', {
            'minZoom': 3,
            'maxZoom': 17
        }).setView([38.255, -85.73], 15);
    }
    
    //clear out old MAP_CONTROL
    if (MAP_CONTROL) { 
        MAP.removeControl(MAP_CONTROL); 
        MAP_CONTROL=null; 
    }

    //clear out old layers
    for (mapID in BASE_LAYERS) {
        var lyr = BASE_LAYERS[mapID];
        lyr.redraw(); //clear tiles
        MAP.removeLayer(lyr);
    }
    BASE_LAYERS = {};
    
    if (clear) { return; } //job done if just clear
    
    if (mapboxIDs == null) { return; } //no ids
    
    //add a layer for each mapbox ID
    for (var i=0, l=mapboxIDs.length; i<l; i++) {
        var mapID = mapboxIDs[i];
        var lyr = L.tileLayer(
            tilePath(fileSystem, mapID), 
            {
	            attribution: ATTRIBUTION,
	            minZoom: 3,
	            maxZoom: 17
            }
        );
        BASE_LAYERS[mapID] = lyr;
        lyr.addTo(MAP); 
    }
    
    MAP_CONTROL = L.control.layers(BASE_LAYERS, {});
    MAP_CONTROL.addTo(MAP);
}

return {
    'reloadMap': reloadMap
};

}();
