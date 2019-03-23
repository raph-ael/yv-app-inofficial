import api from './api';
import files from './files';
import helper from './helper';
import app from './app';

class Downloader {

  constructor(url, options) {

    var self = this;

    this.url = url;
    this.options = Object.assign({
      filename: url.split('/').slice(-1)[0],
      success: () => {},
      error: () => {},
      progress: () => {}
    }, options);
  }

  static getAllVideos(callback) {

    if(Downloader.downloads_allvideos !== undefined && Downloader.downloads_allvideos.length > 0) {
      callback(Downloader.downloads_allvideos);
    }
    else {
      files.getItems((fileitems) => {

        if(fileitems.length == 0) {
          callback([]);
        }

        var downloads = [];

        fileitems.forEach((fileitem) => {
          api.getItem(fileitem, {
            success: (item) => {
              downloads.push(item);
              if(downloads.length == fileitems.length) {
                Downloader.downloads_allvideos = downloads;
                callback(downloads);
              }
            }
          });
        });
      });
    }
  }

  getStatus(callback) {

    let self = this;

    if(Downloader.active_downloads !== undefined && Downloader.active_downloads[self.options.filename] !== undefined) {
      callback(2);
    }
    else {
      self.fileInfo((meta, file) => {
        if(meta.size > 0) {
          callback(1, file);
        }
        else {
          callback(false);
        }
      });
    }
  }

  fileInfo(success_callback, error_callback) {

    this.getFile((targetFile) => {

      console.log(targetFile);

      targetFile.file(function (meta) {
        console.log('meta');
        console.log(meta);
        success_callback(meta, targetFile);
      });
    });

  }

  start() {
    var self = this;

    Downloader.downloads_allvideos = [];

    self.getFile((targetFile) => {
      if(!Downloader.active_downloads) {
        Downloader.active_downloads = {};
      }
      Downloader.active_downloads[self.options.filename] = true;
      var dl = new BackgroundTransfer.BackgroundDownloader();
      var download = dl.createDownload(self.url, targetFile, self.title);
      self.downloadPromise = download.startAsync().then((ret) => {
        delete Downloader.active_downloads[self.options.filename];
        self.options.success(ret);
      }, (ret) => {
        delete Downloader.active_downloads[self.options.filename];
        self.options.error(ret);
      }, self.options.progress);
    });

  }

  getFile(callback) {

    var self = this;

    this.getFolder((folder) => {
      folder.getFile(self.options.filename, { create: true }, function (targetFile) {
        callback(targetFile);
      });
    });
  }

  getFolder(callback) {
    var self = this;
    window.resolveLocalFileSystemURL(app.directory_data, function(dirEntry) {

      if(self.options.folder !== undefined) {
        dirEntry.getDirectory(self.options.folder, { create: true }, (subDirEntry) => {

          callback(subDirEntry);

        }, (error) => {
          console.log(error);
        });
      }
      else {
        callback(dirEntry);
      }

    }, (error) => {
      console.log(error);
    });
  }

  delete(callback, error_callback) {

    Downloader.downloads_allvideos = [];

    let self = this;

    if(callback === undefined) {
      callback = () => {};
    }

    if(error_callback === undefined) {
      error_callback = () => {};
    }

    this.getFolder((folder) => {
      folder.getFile(self.options.filename, {create:false}, function(fileEntry) {
        fileEntry.remove(function(){
          callback(true);
        },function(error){
          error_callback();
        },function(){
          callback(false);
        });
      });
    });
  }
}

export default Downloader;
