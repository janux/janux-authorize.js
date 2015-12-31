# Janux Security

* Install by running:


	$ npm install && tsd install

	Note: if you don't have TypeScript Definition manager (TSD), please install by running:
		
		$ npm install tsd -g

* Compile project and place it in the build directory:


	$ gulp default


* Generate documentation in 'doc' directory:

	$ gulp doc

* Compile and run tests (also compiles the project files in their own directories)

    $ gulp test