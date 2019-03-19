var downloader = {

  downloadFile: (file_url, file_name) => {

    var fileName = file_name,
      uriString = file_url;

    // open target file for download
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      fileSystem.root.getFile(fileName, { create: true }, function (targetFile) {

        var onSuccess, onError, onProgress; // plugin callbacks to track operation execution status and progress

        var downloader = new BackgroundTransfer.BackgroundDownloader();
        // Create a new download operation.
        var download = downloader.createDownload(uriString, targetFile);
        // Start the download and persist the promise to be able to cancel the download.
        app.downloadPromise = download.startAsync().then(onSuccess, onError, onProgress);
      });
    });


  }

};

export default downloader;
