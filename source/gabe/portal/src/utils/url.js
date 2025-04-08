// 这些key会尝试从 localstorge 中获取
const localstorgeKey = ['device'];

/**
 * 获取 url query 值
 * 如果没有获取到,从 localstorage 里取值
 * @param {string} key queryKey
 */
export function getQueryString(key) {
	if (!key) return '';
	const queryObj = getQueryObject();

	let value = queryObj[key];
	const isLocalStorageKey = localstorgeKey.indexOf(key) > -1;
	// 并不是所有的 key 都能从 localstorgeKey 里取
	if (isLocalStorageKey) {
		if (!window.localStorage.getItem(key)) {
			window.localStorage.setItem(key, getRandomCode());
		}
		value = window.localStorage.getItem(key);
	}
	return value || '';
}

/**
 * 获得 Url query 对象
 * @param {object} defaultParameter 默认的 query 对象
 */
export function getQueryObject(defaultParameter = {}) {
	const queryString = window.location.href.split('?')[1]
		? window.location.href.split('?')[1]
		: '';
	if (queryString === '') return defaultParameter;
	const urlParameter = queryString.split('&').reduce((prev, cur) => {
		const kvArray = cur.split('=');
		try {
			const key = decodeURIComponent(kvArray[0]);
			const val = decodeURIComponent(kvArray[1]);
			prev[key] = val;
		} catch (err) {} // eslint-disable-line
		return prev;
	}, {});
	return Object.assign(defaultParameter, urlParameter);
}

export function getRandomCode() {
	return (
		Math.random().toString(36).slice(2, 7) +
		Math.random().toString(36).slice(2, 7)
	);
}

/**
 * 把对象转换为 url querystring 格式的字符串 eg: {a:1, b:2} => ?a=1&b=2
 * @param {object} obj 带转换对象
 * @param {string} symbol 前缀符号(默认为 ？)
 */
export function getUrlParamsByObject(obj, symbol = '?') {
	if (Object.prototype.toString.call(obj).slice(8, -1) !== 'Object') {
		return '';
	}
	let kvArray = [];
	for (let name in obj) {
		if (obj.hasOwnProperty(name)) {
			kvArray.push(name + '=' + encodeURIComponent(obj[name]));
		}
	}
	return symbol + kvArray.join('&');
}
