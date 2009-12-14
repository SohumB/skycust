skycust.crx: manifest.json bg.html skycust.user.js
	crxmake --pack-extension . --pack-extension-key skycust.pem --extension-output skycust.crx --ignore-file skycust.pem --ignore-file .gitignore --ignore-dir .git -v
