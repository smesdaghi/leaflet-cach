fileUtils = function() {

var PROGRESSBAR_HTML = '<div class="progress progress-striped active">'
    + '<div class="bar" style="width: 0%;"></div>'
    + '</div>';

function rmDir(fileSystem, dirName, callback) {
    fileSystem.root.getDirectory(dirName, {create: true},
        function(dir) { //success
           dir.removeRecursively(
                function() { callback(); }, 
                function(){ alert("Error deleting!"); }
            );
        }, 
        function() { alert("Error deleting directory"); } //fail
    );
}

function bulkDownload(urls, targetDir, progressModal, callback) {
  /*
   * Bulk download of urls to the targetDir (relative path from root) 
   */
  window.requestFileSystem(
    LocalFileSystem.PERSISTENT, 0, 
    function(fileSystem) { //success
        var rootDir = fileSystem.root.fullPath;
        if (rootDir[rootDir.length-1] != '/') { rootDir += '/'; }
        var dirPath = rootDir + targetDir;
        
        //show progress modal
        progressModal.modal('show');
        //add progress bar
        progressModal.find('.modal-body').append(PROGRESSBAR_HTML);
        var progressBar = progressModal.find(".bar");
	   console.log('urls: ', urls);
	   alert('about to download file');
        downloadFile(urls, 0, dirPath, progressModal, progressBar, callback);
    },
    function() { alert("Failure!"); } //filesystem failure
  );    
}

function downloadFile(urls, index, dirPath, progressModal, progressBar, callback) {
    /*
     * Helper function for bulkDownload 
     */
    
    if (index >= urls.length) { //callback if done
        //clear and hide modal
        progressModal.find('.modal-body').html("");
        progressModal.modal('hide');
        
        callback(); 
        return; 
    } 
    
    //update modal progress
    progressBar.css('width', (index * 100.0 / urls.length) + '%');
    
    var url = urls[index];
    
    console.log('urls[index]', url);
    
    //NOTE: THIS IS SUPER HARD-CODED
    //all urls start with: http://api.tiles.mapbox.com/v3/ - length 31
    var tail = url.slice(31); //something like ex.map-1234saf/15/8580/12610.png
    
    var fn = dirPath + '/' + tail;
    console.log("fn", fn);
  
    var fileTransfer = new FileTransfer();
    fileTransfer.download(url, fn,
        function(theFile) { 
    	console.log('cached: ', index);
            downloadFile(urls, index+1, dirPath, progressModal, progressBar, callback);
        },
        function(error) {
			console.log("error", error);
			console.log("url", url);
			console.log("fn", fn);
			console.log("index", index);
			alert("yo. download error code: " + error.code + "url: " + url);
		}
    );    
}

return {
    'rmDir': rmDir,
    'bulkDownload': bulkDownload
};

}();
