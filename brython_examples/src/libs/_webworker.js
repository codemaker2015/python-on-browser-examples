// Web Worker implementation

var $module = (function($B){

var _b_ = $B.builtins

if($B.debug > 2){
    var brython_scripts = [
        'brython_builtins',
        'version_info',
        'python_tokenizer',
        'py_ast',
        'py2js',
        'loaders',
        'py_object',
        'py_type',
        'py_utils',
        'py_sort',
        'py_builtin_functions',
        'py_exceptions',
        'py_range_slice',
        'py_bytes',
        'py_set',
        'js_objects',
        'stdlib_paths',
        'py_import',
        'unicode_data',
        'py_string',
        'py_int',
        'py_long_int',
        'py_float',
        'py_complex',
        'py_dict',
        'py_list',
        'py_generator',
        'py_dom',
        'py_pattern_matching',
        'builtin_modules',
        'async',
        'ast_to_js',
        'symtable',
        'brython_stdlib']

}else{
    var brython_scripts = ['brython', 'brython_stdlib']
}
var wclass = $B.make_class("Worker",
    function(worker){
        var res = worker
        res.send = res.postMessage
        return res
    }
)
wclass.__mro__ = [$B.JSObj, _b_.object]

$B.set_func_names(wclass, "browser.worker")

var _Worker = $B.make_class("Worker", function(id, onmessage, onerror){
    var $ = $B.args("__init__", 3, {id: null, onmessage: null, onerror: null},
            ['id', 'onmessage', 'onerror'], arguments,
            {onmessage: _b_.None, onerror: _b_.None}, null, null),
        id = $.id,
        src = $B.webworkers[id]
        if(src === undefined){
            throw _b_.KeyError.$factory(id)
        }
        var script_id = "worker" + $B.UUID(),
            js = __BRYTHON__.imported.javascript.py2js(src,
                script_id),
            header = 'var $locals_' + script_id +' = {}\n';
        brython_scripts.forEach(function(script){
            var url = $B.brython_path + script + ".js?" +
                (new Date()).getTime()
            header += 'importScripts("' + url + '")\n'
        })
        // restore brython_path
        header += '__BRYTHON__.brython_path = "' + $B.brython_path +
            '"\n'
        // restore path for imports (cf. issue #1305)
        header += '__BRYTHON__.path = "' + $B.path +'".split(",")\n'
        // Call brython() to initialize internal Brython values
        header += `brython($B.debug)\n`
        js = header + js
        js = `try{${js}}catch(err){$B.handle_error(err)}`
        var blob = new Blob([js], {type: "application/js"}),
            url = URL.createObjectURL(blob),
            w = new Worker(url),
            res = wclass.$factory(w)
        return res
})

return {
    Worker: _Worker
}

})(__BRYTHON__)
