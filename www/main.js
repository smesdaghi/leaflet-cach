var FILESYSTEM;

function getMapIDs() {
    /*
     * Return a list of mapIDs or null 
     */
    var mapboxIDs = (localStorage["MAPBOX_IDS"] || "").split(",");
    if (mapboxIDs[0] == "") { return null; } //no ids
    else { return mapboxIDs; }
}

function createMapOptions(clear) {
    return {
        'clear': clear,
        'fileSystem': FILESYSTEM,
        'mapIDs': getMapIDs()
    };
}

$(document).ready(function() {
    //Some bookkeeping code for mapbox id
    $("#mapbox_id")
    .val(localStorage["MAPBOX_IDS"])
    .off("change")
    .on("change", function() { localStorage["MAPBOX_IDS"] = $(this).val(); });

    //Real page setup on phonegap initialization
    $(document).off("deviceready").on("deviceready", function() {
    
        window.requestFileSystem(
            LocalFileSystem.PERSISTENT, 0, 
            function(fs) { //success
                FILESYSTEM = fs; //set global - sloppy, I know
                mapUtils.reloadMap(createMapOptions(false));
            },
            function() { alert("Failure accessing filesystem!"); } //filesystem failure
        );
        
        $("#clear").off("click").on("click", function() {
            fileUtils.rmDir(
                FILESYSTEM,
                'tiles',
                function(){ 
                    mapUtils.reloadMap(createMapOptions(true)); 
                    alert("Tiles cleared successfully"); 
                }
            );
        });

        $("#download").off("click").on("click", function() {
            var mapboxIDs = getMapIDs();
            if (mapboxIDs == null) { alert("Enter a MapBox Map ID"); return; } //no ids
            fileUtils.bulkDownload(
								   tileUtils.pyramid(mapboxIDs, 38.255, -85.73, {radius: 10}), //tile urls
               'tiles',
               $("#progress_modal"),
               function() { 
                   alert("Download successful!"); 
                   mapUtils.reloadMap(createMapOptions(false)); 
               }
            );
        });
    }); 
});
