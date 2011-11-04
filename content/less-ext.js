// tools for common Komodo extension chores
xtk.load('chrome://less/content/toolkit.js');
// Komodo console in Output Window
xtk.load('chrome://less/content/konsole.js');

// less
xtk.load('chrome://less/content/less.min.js');

/**
 * Namespaces
 */
if (typeof(extensions) === 'undefined') extensions = {};
if (typeof(extensions.less) === 'undefined') extensions.less = { version : '1.0.0' };

(function() {
	var self = this,
		parser = new(less.Parser);
	
	this.compileFile = function(showWarning) {
		showWarning = showWarning || false;
		
		var d = ko.views.manager.currentView.document || ko.views.manager.currentView.koDoc,
			file = d.file,
			path = (file) ? file.path : null;
		
		if (!file) {
			konsole.popup();
			self._log('Please save the file first', konsole.S_ERROR);
			return;
		}

		if (file.ext == '.less') {
			konsole.popup();
			self._log('Compiling LESS file', konsole.S_DEBUG);
		
			parser.parse(d.buffer, function(err, tree) {
				var output = tree.toCSS(),
					newFilename = path.replace('.less', '.css');
			
				self._saveFile(newFilename, output);
				self._log('File saved as: ' + newFilename, konsole.S_OK);
			});
		} else {
			if (showWarning) {
				konsole.popup();
				self._log('Not a LESS file', konsole.S_ERROR);
			}
		}
	};
	
	this.compileBuffer = function() {
		var d = ko.views.manager.currentView.document || ko.views.manager.currentView.koDoc;
		
		parser.parse(d.buffer, function(err, tree) {
			d.buffer = tree.toCSS();
		});
	};
	
	this.compileSelection = function() {
		var view = ko.views.manager.currentView,
			scimoz = view.scintilla.scimoz;
			text = scimoz.selText;
			
		parser.parse(text, function(err, tree) {
			var css = tree.toCSS();
			
			scimoz.targetStart = scimoz.currentPos;
			scimoz.targetEnd = scimoz.anchor;
			scimoz.replaceTarget(css.length, css);
		});
	};
	
	this._saveFile = function(filepath, filecontent) {
		self._log('Saving file', konsole.S_DEBUG);
		
		var file = Components
			.classes["@activestate.com/koFileEx;1"]
			.createInstance(Components.interfaces.koIFileEx);
		file.path = filepath;
		
		file.open('w');
		
		file.puts(filecontent);
		file.close();
		
		return;
	};
	
	this._log = function(message, style) {
		konsole.writeln('[LESS] ' + message, style);
	};
	
}).apply(extensions.less);