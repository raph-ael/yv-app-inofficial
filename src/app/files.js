import app from './app';

var files = {
  getItems: (callback) => {
    files.listDir('', (entries) => {

      var out = [];

      entries.forEach((entry) => {
        if(entry.name !== undefined && entry.name.substring(0,5) == 'item-') {
          out.push(parseInt(entry.name.split('-')[1]));
        }
      });

      callback(out);
    });
  },

  getFolder: (path) => {

  },

  listDir: (path, callback, error_callback) => {

    window.resolveLocalFileSystemURL(app.directory_data + path,
      (fileSystem) => {
        var reader = fileSystem.createReader();
        reader.readEntries(
          (entries) => {
            callback(entries);
          },
          (err) => {
            error_callback(err);
          }
        );
      }, (err) => {
        error_callback(err);
      }
    );
  }
};

export default files;
