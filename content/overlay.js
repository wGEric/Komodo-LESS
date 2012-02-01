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
if (typeof(extensions.less) === 'undefined') extensions.less = { version : '1.2.0' };

(function() {
	var self = this,
		parser = new(less.Parser);

	var prefs = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefService).getBranch("extensions.less.");

	this.compileFile = function(showWarning, compress) {
		showWarning = showWarning || false;
		compress = compress || false;

		var d = ko.views.manager.currentView.document || ko.views.manager.currentView.koDoc,
			file = d.file,
			path = (file) ? file.URI : null;

		if (!file) {
			self._log('Please save the file first', konsole.S_ERROR);
			return;
		}

		if (file.ext == '.less') {
			self._log('Compiling LESS file', konsole.S_DEBUG);

			parser.parse(d.buffer, function(err, tree) {
				var output = tree.toCSS({'compress': compress}),
					newFilename = path.replace('.less', '.css');

				self._saveFile(newFilename, output);
				self._log('File saved', konsole.S_OK);
			});
		} else {
			if (showWarning) {
				self._log('Not a LESS file', konsole.S_ERROR);
			}
		}
	};

	this.compileCompressFile = function(showWarning) {
		this.compileFile(showWarning, true);
	};

	this.compileBuffer = function(compress) {
		compress = compress || false;

		var d = ko.views.manager.currentView.document || ko.views.manager.currentView.koDoc;

		parser.parse(d.buffer, function(err, tree) {
			d.buffer = tree.toCSS({'compress': compress});
		});
	};

	this.compileCompressBuffer = function() {
		this.compileBuffer(true);
	}

	this.compileSelection = function(compress) {
		compress = compress || false;

		var view = ko.views.manager.currentView,
			scimoz = view.scintilla.scimoz;
			text = scimoz.selText;

		parser.parse(text, function(err, tree) {
			var css = tree.toCSS({'compress': compress});

			scimoz.targetStart = scimoz.currentPos;
			scimoz.targetEnd = scimoz.anchor;
			scimoz.replaceTarget(css.length, css);
		});
	};

	this.compileCompressSelection = function() {
		this.compileSelection(true);
	}

	this._saveFile = function(filepath, filecontent) {
		self._log('Saving file to ' + filepath, konsole.S_DEBUG);

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
		if (style == konsole.S_ERROR || prefs.getBoolPref('showMessages')) {
			konsole.popup();
			konsole.writeln('[LESS] ' + message, style);
		}
	};

}).apply(extensions.less);
