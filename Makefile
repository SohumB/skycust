all: skycust.zip skycust.crx

skycust.zip: bg.html icon.png jquery.min.js jquery-ui.min.js LICENSE manifest.json README skycust.user.js gm_compatibility.js provider_cust.html icon16.png icon19.png icon48.png
	apack skycust.zip bg.html icon.png jquery.min.js jquery-ui.min.js LICENSE manifest.json README skycust.user.js gm_compatibility.js provider_cust.html icon16.png icon19.png icon48.png

skycust.crx: bg.html icon.png jquery.min.js jquery-ui.min.js LICENSE manifest.json README skycust.user.js gm_compatibility.js provider_cust.html icon16.png icon19.png icon48.png
	crxmake --pack-extension . --pack-extension-key skycust.pem --extension-output skycust.crx --ignore-file 'skycust\.pem|\.gitignore|DESIGN|Makefile|skycust\.zip|skycust\.crx' --ignore-dir .git -v