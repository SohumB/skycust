all: skycust.zip skycust.crx

skycust.zip: bg.js icon.png jquery.min.js jquery-ui.min.js LICENSE manifest.json README skycust.user.js gm_compatibility.js provider_cust.html provider_cust.js icon16.png icon19.png icon48.png
	apack skycust.zip bg.js icon.png jquery.min.js jquery-ui.min.js LICENSE manifest.json README skycust.user.js gm_compatibility.js provider_cust.html provider_cust.js icon16.png icon19.png icon48.png

skycust.crx: bg.js icon.png jquery.min.js jquery-ui.min.js LICENSE manifest.json README skycust.user.js gm_compatibility.js provider_cust.html provider_cust.js icon16.png icon19.png icon48.png
	crxmake --pack-extension . --pack-extension-key skycust.pem --extension-output skycust.crx --ignore-file 'skycust\.pem|\.gitignore|DESIGN|Makefile|skycust\.zip|skycust\.crx' --ignore-dir .git -v
