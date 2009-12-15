all: skycust.zip skycust.crx

skycust.zip: bg.html icon.png jquery.min.js jquery-ui.min.js LICENSE manifest.json README skycust.user.js gm_compatibility.js provider_cust.html
	apack skycust.zip aqFloater.js bg.html icon.png jquery.min.js jquery-ui.min.js LICENSE manifest.json README skycust.user.js

skycust.crx: bg.html icon.png jquery.min.js jquery-ui.min.js LICENSE manifest.json README skycust.user.js gm_compatibility.js provider_cust.html
	crxmake --pack-extension . --pack-extension-key skycust.pem --extension-output skycust.crx --ignore-file 'skycust\.pem|\.gitignore|DESIGN|Makefile|skycust\.zip|skycust\.crx' --ignore-dir .git -v