var fs = require('fs-extra');
var tmp_dir = './src/_compiled/templates/_tmp'
var components_dir = './src/templates';
var components_compiled_dir = './src/_compiled/templates';
fs.removeSync(components_compiled_dir);

if (fs.existsSync(tmp_dir)){
    fs.removeSync(tmp_dir);
}
fs.mkdirSync(components_compiled_dir);
fs.mkdirSync(tmp_dir);

var dots = require('dot').process({
    path: components_dir,
    destination: tmp_dir
});

function readFiles(dirname, onFileContent, onError) {
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(function(filename) {
            if (filename.indexOf('.js') > -1 && filename.indexOf('_wp') == -1) {
                fs.readFile(dirname + '/' + filename, 'utf-8', function (err, content) {
                    if (err) {
                        onError(err);
                        return;
                    }
                    onFileContent(filename, content);
                });
            }
        });
    });
}



fs.readdirSync(tmp_dir).forEach(function(filename){

    var content = fs.readFileSync(tmp_dir + '/' + filename, 'utf-8');

    let classname = filename.replace('.js','');

    content = content.split("\n")[2];

    let js = '';
    if(content.indexOf('<script>') > -1) {
        js = content.split('<script>')[1].split('</script>')[0].replace(/\\'/g,"'");
        content = content.split('<script>')[0] + "'; return out;";
    }

    /*
     * imports an den kopf setellen
     */
    let imports = js.split(';');
    let head_imports = ['import t from \'../../app/trans\';'];


    if(imports) {
        imports.forEach((imp) => {
            imp = imp.trim();
            if( imp.trim().substring(0,7) == 'import ' ) {

                imp += ';';
                let searchrp = imp;

                imp = imp.replace('.jst','');
                imp = imp.replace('from \'../', 'from \'../../');

                head_imports.push(imp);
                js = js.replace(searchrp, '');
            }
        });
    }

    let script = '';

    //script += head_imports.join(";\n");

    script += 'export default (it) => {' + "\n";

    script += '    ' + content + "\n";

    script += '};' + "\n";

    fs.writeFileSync(components_compiled_dir + '/' + classname + '.js', script);
});

fs.removeSync(tmp_dir);
