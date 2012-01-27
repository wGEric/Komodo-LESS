# About

Implements [LESS](http://lesscss.org/) into [Komodo](http://www.activestate.com/komodo-ide).

# Install

http://docs.activestate.com/komodo/6.1/tutorial/tourlet_extensions.html#tourlet_install_extension_top

# Use

Goto to Tools -> LESS and select an option.

* _Compile Saved File into CSS_ takes a .less file and creates a .css file with the same name in the same directory as the .less file.
* _Compile and Compress Saved File into CSS_ takes a .less file and creates a .css file with the same name in the same directory as the .less file and compresses it.
* _Compile Current Buffer into CSS_ takes the contents of the current buffer and turns it into CSS.
* _Compile and Compress Current Buffer into CSS_ takes the contents of the current buffer and turns it into CSS and compresses it.
* _Compile Selection into CSS_ takes the current selection and turns it into CSS.
* _Compile and Compress Selection into CSS_ takes the current selection and turns it into CSS and compress it.

# Macro

You can [create a macro](http://docs.activestate.com/komodo/6.1/macros.html#macros_top) that will automatically turn a .less file into CSS when you save. Use the following code and have it trigger _After file save_:

    if (extensions.less) {
        extensions.less.compileFile();
    }

The following macro will compile and compress the CSS when you save a file:

    if (extensions.less) {
        extensions.less.compileCompressFile();
    }
