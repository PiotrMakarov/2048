function zipSum(arr1, arr2) {
	return _.zipWith(arr1, arr2, _.add);
}

function getRootCssVar(name) {
	return getComputedStyle(document.documentElement).getPropertyValue('--' + name);
}

function setRootCssVar(name, value) {
	document.documentElement.style.setProperty('--' + name, value);
}
