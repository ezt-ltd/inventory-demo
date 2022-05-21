function injectScriptSheet(name, url) {
	return new Promise((resolve, reject) => {
		if (name === null || name === undefined) return resolve();
		const head = document.head || document.getElementsByTagName("head")[0];
		const id = "".concat(name.toUpperCase(), "_SCRIPT");
		if (document.getElementById(id)) return resolve();
		const script = document.createElement("script");
		script.id = id;
		script.type = "text/javascript";
		script.src = url;
		script.onload = resolve;
		script.onerror = reject;
		head.appendChild(script);
	});
}

async function injectDebugger() {
	await injectScriptSheet(
		"ERUDA_DEBUGGER",
		"https://cdn.jsdelivr.net/npm/eruda"
	);
	window.eruda && window.eruda.init();
}

const isES6 = () => {
	let isES6 = false;
	try {
		const k = new Map();
		isES6 = true;
		console.log("ES6 supported!!", k);
	} catch(err) {
		console.log("ES6 not supported :(")
	}
	return isES6;
}

export {
	injectDebugger,
	isES6
}