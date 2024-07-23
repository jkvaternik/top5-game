(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const http = __webpack_require__(0);

const headerEnd = '\r\n\r\n';

const BODY = Symbol();
const HEADERS = Symbol();

function getString(data) {
  if (Buffer.isBuffer(data)) {
    return data.toString('utf8');
  } else if (typeof data === 'string') {
    return data;
  } else {
    throw new Error(`response.write() of unexpected type: ${typeof data}`);
  }
}

function addData(stream, data) {
  if (Buffer.isBuffer(data) || typeof data === 'string' || data instanceof Uint8Array) {
    stream[BODY].push(Buffer.from(data));
  } else {
    throw new Error(`response.write() of unexpected type: ${typeof data}`);
  }
}

module.exports = class ServerlessResponse extends http.ServerResponse {

  static from(res) {
    const response = new ServerlessResponse(res);

    response.statusCode = res.statusCode
    response[HEADERS] = res.headers;
    response[BODY] = [Buffer.from(res.body)];
    response.end();

    return response;
  }

  static body(res) {
    return Buffer.concat(res[BODY]);
  }

  static headers(res) {
    const headers = typeof res.getHeaders === 'function'
      ? res.getHeaders()
      : res._headers;

    return Object.assign(headers, res[HEADERS]);
  }

  get headers() {
    return this[HEADERS];
  }

  setHeader(key, value) {
    if (this._wroteHeader) {
      this[HEADERS][key] = value;
    } else {
      super.setHeader(key, value);
    }
  }

  writeHead(statusCode, reason, obj) {
    const headers = typeof reason === 'string'
      ? obj
      : reason

    for (const name in headers) {
      this.setHeader(name, headers[name])

      if (!this._wroteHeader) {
        // we only need to initiate super.headers once
        // writeHead will add the other headers itself
        break
      }
    }

    super.writeHead(statusCode, reason, obj);
  }

  constructor({ method }) {
    super({ method });

    this[BODY] = [];
    this[HEADERS] = {};

    this.useChunkedEncodingByDefault = false;
    this.chunkedEncoding = false;
    this._header = '';

    this.assignSocket({
      _writableState: {},
      writable: true,
      on: Function.prototype,
      removeListener: Function.prototype,
      destroy: Function.prototype,
      cork: Function.prototype,
      uncork: Function.prototype,
      write: (data, encoding, cb) => {
        if (typeof encoding === 'function') {
          cb = encoding;
          encoding = null;
        }

        if (this._header === '' || this._wroteHeader) {
          addData(this, data);
        } else {
          const string = getString(data);
          const index = string.indexOf(headerEnd);

          if (index !== -1) {
            const remainder = string.slice(index + headerEnd.length);

            if (remainder) {
              addData(this, remainder);
            }

            this._wroteHeader = true;
          }
        }

        if (typeof cb === 'function') {
          cb();
        }
      },
    });

    this.once('finish', () => {
      this.emit('close')
    });
  }

};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const http = __webpack_require__(0);

module.exports = class ServerlessRequest extends http.IncomingMessage {
  constructor({ method, url, headers, body, remoteAddress }) {
    super({
      encrypted: true,
      readable: false,
      remoteAddress,
      address: () => ({ port: 443 }),
      end: Function.prototype,
      destroy: Function.prototype
    });

    if (typeof headers['content-length'] === 'undefined') {
      headers['content-length'] = Buffer.byteLength(body);
    }

    Object.assign(this, {
      ip: remoteAddress,
      complete: true,
      httpVersion: '1.1',
      httpVersionMajor: '1',
      httpVersionMinor: '1',
      method,
      headers,
      body,
      url,
    });

    this._read = () => {
      this.push(body);
      this.push(null);
    };
  }

}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const server = __webpack_require__(6);
exports.handler = server.handler;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const express = __webpack_require__(2);
const serverless = __webpack_require__(7);
const puzzleRouter = __webpack_require__(24);
const app = express();
app.use('/api', puzzleRouter);

// For local development
if (false) {}

// For Netlify
module.exports.handler = serverless(app);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const finish = __webpack_require__(8);
const getFramework = __webpack_require__(9);
const getProvider = __webpack_require__(10);

const defaultOptions = {
  requestId: 'x-request-id'
};

module.exports = function (app, opts) {
  const options = Object.assign({}, defaultOptions, opts);

  const framework = getFramework(app);
  const provider = getProvider(options);

  return provider(async (request, ...context) => {
    await finish(request, options.request, ...context);
    const response = await framework(request);
    await finish(response, options.response, ...context);
    return response;
  });
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = async function finish(item, transform, ...details) {
  await new Promise((resolve, reject) => {
    if (item.finished || item.complete) {
      resolve();
      return;
    }

    let finished = false;

    function done(err) {
      if (finished) {
        return;
      }

      finished = true;

      item.removeListener('error', done);
      item.removeListener('end', done);
      item.removeListener('finish', done);

      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }

    item.once('error', done);
    item.once('end', done);
    item.once('finish', done);
  });

  if (typeof transform === 'function') {
    await transform(item, ...details);
  } else if (typeof transform === 'object' && transform !== null) {
    Object.assign(item, transform);
  }

  return item;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const http = __webpack_require__(0)
const Response = __webpack_require__(1);

function common(cb) {
  return request => {
    const response = new Response(request);

    cb(request, response);

    return response;
  };
}

module.exports = function getFramework(app) {
  if (app instanceof http.Server) {
    return request => {
      const response = new Response(request);
      app.emit('request', request, response)
      return response
    }
  }

  if (typeof app.callback === 'function') {
    return common(app.callback());
  }

  if (typeof app.handle === 'function') {
    return common((request, response) => {
      app.handle(request, response);
    });
  }

  if (typeof app.handler === 'function') {
    return common((request, response) => {
      app.handler(request, response);
    });
  }

  if (typeof app._onRequest === 'function') {
    return common((request, response) => {
      app._onRequest(request, response);
    });
  }

  if (typeof app === 'function') {
    return common(app);
  }

  if (app.router && typeof app.router.route == 'function') {
    return common((req, res) => {
      const { url, method, headers, body } = req;
      app.router.route({ url, method, headers, body }, res);
    });
  }

  if (app._core && typeof app._core._dispatch === 'function') {
    return common(app._core._dispatch({
      app
    }));
  }

  if (typeof app.inject === 'function') {
    return async request => {
      const { method, url, headers, body } = request;

      const res = await app.inject({ method, url, headers, payload: body })

      return Response.from(res);
    };
  }

  if (typeof app.main === 'function') {
    return common(app.main);
  }

  throw new Error('Unsupported framework');
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const aws = __webpack_require__(11);
const azure = __webpack_require__(17);

const providers = {
  aws,
  azure
};

module.exports = function getProvider(options) {
  const { provider = 'aws' } = options;

  if (provider in providers) {
    return providers[provider](options);
  }

  throw new Error(`Unsupported provider ${provider}`);
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const cleanUpEvent = __webpack_require__(12);

const createRequest = __webpack_require__(13);
const formatResponse = __webpack_require__(14);

module.exports = options => {
  return getResponse => async (event_, context = {}) => {
    const event = cleanUpEvent(event_, options);

    const request = createRequest(event, context, options);
    const response = await getResponse(request, event, context);

    return formatResponse(event, response, options);
  };
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function removeBasePath(path = '/', basePath) {
  if (basePath) {
    const basePathIndex = path.indexOf(basePath);

    if (basePathIndex > -1) {
      return path.substr(basePathIndex + basePath.length) || '/';
    }
  }

  return path;
}

function isString(value)
{
  return (typeof value === 'string' || value instanceof String);
}

// ELBs will pass spaces as + symbols, and decodeURIComponent doesn't decode + symbols. So we need to convert them into something it can convert
function specialDecodeURIComponent(value)
{
  if(!isString(value))
  {
    return value;
  }

  let decoded;
  try {
    decoded = decodeURIComponent(value.replace(/[+]/g, "%20"));
  } catch (err) {
    decoded = value.replace(/[+]/g, "%20");
  }

  return decoded;
}

function recursiveURLDecode(value) {

  if (isString(value)) {
    return specialDecodeURIComponent(value);
  } else if (Array.isArray(value)) {

    const decodedArray = [];

    for (let index in value) {
      decodedArray.push(recursiveURLDecode(value[index]));
    }

    return decodedArray;

  } else if (value instanceof Object) {

    const decodedObject = {};

    for (let key of Object.keys(value)) {
      decodedObject[specialDecodeURIComponent(key)] = recursiveURLDecode(value[key]);
    }

    return decodedObject;
  }

  return value;
}

module.exports = function cleanupEvent(evt, options) {
  const event = evt || {};

  event.requestContext = event.requestContext || {};
  event.body = event.body || '';
  event.headers = event.headers || {};

  // Events coming from AWS Elastic Load Balancers do not automatically urldecode query parameters (unlike API Gateway). So we need to check for that and automatically decode them
  // to normalize the request between the two.
  if ('elb' in event.requestContext) {

    if (event.multiValueQueryStringParameters) {
      event.multiValueQueryStringParameters = recursiveURLDecode(event.multiValueQueryStringParameters);
    }

    if (event.queryStringParameters) {
      event.queryStringParameters = recursiveURLDecode(event.queryStringParameters);
    }

  }

  if (event.version === '2.0') {
    event.requestContext.authorizer = event.requestContext.authorizer || {};
    event.requestContext.http.method = event.requestContext.http.method || 'GET';
    event.rawPath = removeBasePath(event.requestPath || event.rawPath, options.basePath);
  } else {
    event.requestContext.identity = event.requestContext.identity || {};
    event.httpMethod = event.httpMethod || 'GET';
    event.path = removeBasePath(event.requestPath || event.path, options.basePath);
  }

  return event;
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const URL = __webpack_require__(3);

const Request = __webpack_require__(4);

function requestMethod(event) {
  if (event.version === '2.0') {
    return event.requestContext.http.method;
  }
  return event.httpMethod;
}

function requestRemoteAddress(event) {
  if (event.version === '2.0') {
    return event.requestContext.http.sourceIp;
  }
  return event.requestContext.identity.sourceIp;
}

function requestHeaders(event) {
  const initialHeader =
    event.version === '2.0' && Array.isArray(event.cookies)
      ? { cookie: event.cookies.join('; ') }
      : {};

  if (event.multiValueHeaders) {
    Object.keys(event.multiValueHeaders).reduce((headers, key) => {
      headers[key.toLowerCase()] = event.multiValueHeaders[key].join(', ');
      return headers;
    }, initialHeader);
  }

  return Object.keys(event.headers).reduce((headers, key) => {
    headers[key.toLowerCase()] = event.headers[key];
    return headers;
  }, initialHeader);
}

function requestBody(event) {
  const type = typeof event.body;

  if (Buffer.isBuffer(event.body)) {
    return event.body;
  } else if (type === 'string') {
    return Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8');
  } else if (type === 'object') {
    return Buffer.from(JSON.stringify(event.body));
  }

  throw new Error(`Unexpected event.body type: ${typeof event.body}`);
}

function requestUrl(event) {
  if (event.version === '2.0') {
    return URL.format({
      pathname: event.rawPath,
      search: event.rawQueryString,
    });
  }
  // Normalize all query params into a single query string.
  const query = event.multiValueQueryStringParameters || {};
  if (event.queryStringParameters) {
    Object.keys(event.queryStringParameters).forEach((key) => {
      if (Array.isArray(query[key])) {
        if (!query[key].includes(event.queryStringParameters[key])) {
          query[key].push(event.queryStringParameters[key]);
        }
      } else {
        query[key] = [event.queryStringParameters[key]];
      }
    });
  }
  return URL.format({
    pathname: event.path,
    query: query,
  });
}

module.exports = (event, context, options) => {
  const method = requestMethod(event);
  const remoteAddress = requestRemoteAddress(event);
  const headers = requestHeaders(event);
  const body = requestBody(event);
  const url = requestUrl(event);

  if (typeof options.requestId === 'string' && options.requestId.length > 0) {
    const header = options.requestId.toLowerCase();
    const requestId = headers[header] || event.requestContext.requestId;
    if (requestId) {
      headers[header] = requestId;
    }
  }

  const req = new Request({
    method,
    headers,
    body,
    remoteAddress,
    url,
  });

  req.requestContext = event.requestContext;
  req.apiGateway = {
    event,
    context,
  };

  return req;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const isBinary = __webpack_require__(15);
const Response = __webpack_require__(1);
const sanitizeHeaders = __webpack_require__(16);

module.exports = (event, response, options) => {
  const { statusCode } = response;
  const {headers, multiValueHeaders } = sanitizeHeaders(Response.headers(response));

  let cookies = [];

  if (multiValueHeaders['set-cookie']) {
    cookies = multiValueHeaders['set-cookie'];
  }

  const isBase64Encoded = isBinary(headers, options);
  const encoding = isBase64Encoded ? 'base64' : 'utf8';
  let body = Response.body(response).toString(encoding);

  if (headers['transfer-encoding'] === 'chunked' || response.chunkedEncoding) {
    const raw = Response.body(response).toString().split('\r\n');
    const parsed = [];
    for (let i = 0; i < raw.length; i +=2) {
      const size = parseInt(raw[i], 16);
      const value = raw[i + 1];
      if (value) {
        parsed.push(value.substring(0, size));
      }
    }
    body = parsed.join('')
  }

  let formattedResponse = { statusCode, headers, isBase64Encoded, body };

  if (event.version === '2.0' && cookies.length) {
    formattedResponse['cookies'] = cookies;
  }

  if ((!event.version || event.version === '1.0') && Object.keys(multiValueHeaders).length) {
    formattedResponse['multiValueHeaders'] = multiValueHeaders;
  }

  return formattedResponse;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const BINARY_ENCODINGS = ['gzip', 'deflate', 'br'];
const BINARY_CONTENT_TYPES = (process.env.BINARY_CONTENT_TYPES || '').split(',');

function isBinaryEncoding(headers) {
  const contentEncoding = headers['content-encoding'];

  if (typeof contentEncoding === 'string') {
    return contentEncoding.split(',').some(value =>
      BINARY_ENCODINGS.some(binaryEncoding => value.indexOf(binaryEncoding) !== -1)
    );
  }
}

function isBinaryContent(headers, options) {
  const contentTypes = [].concat(options.binary
    ? options.binary
    : BINARY_CONTENT_TYPES
  ).map(candidate =>
    new RegExp(`^${candidate.replace(/\*/g, '.*')}$`)
  );

  const contentType = (headers['content-type'] || '').split(';')[0];
  return !!contentType && contentTypes.some(candidate => candidate.test(contentType));
}

module.exports = function isBinary(headers, options) {
  if (options.binary === false) {
    return false;
  }

  if (options.binary === true) {
    return true
  }

  if (typeof options.binary === 'function') {
    return options.binary(headers);
  }

  return isBinaryEncoding(headers) || isBinaryContent(headers, options);
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function sanitizeHeaders(headers) {
  return Object.keys(headers).reduce((memo, key) => {
      const value = headers[key];

    if (Array.isArray(value)) {
      memo.multiValueHeaders[key] = value;
      if (key.toLowerCase() !== 'set-cookie') {
        memo.headers[key] = value.join(", ");
      }
      } else {
        memo.headers[key] = value == null ? '' : value.toString();
      }

      return memo;
  }, {
      headers: {},
      multiValueHeaders: {}
    });
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const cleanupRequest = __webpack_require__(18);
const createRequest = __webpack_require__(19);
const formatResponse = __webpack_require__(20);

module.exports = options => {
    return getResponse => async (context, req) => {
        const event = cleanupRequest(req, options);
        const request = createRequest(event, options);
        const response = await getResponse(request, context, event);
        context.log(response);
        return formatResponse(response, options);
    }
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function getUrl({ requestPath, url }) {
    if (requestPath) {
        return requestPath;
    }

    return typeof url === 'string' ? url : '/';
}

function getRequestContext(request) {
    const requestContext = {};
    requestContext.identity = {};
    const forwardedIp = request.headers['x-forwarded-for'];
    const clientIp = request.headers['client-ip'];
    const ip = forwardedIp ? forwardedIp : (clientIp ? clientIp : '');
    if (ip) {
        requestContext.identity.sourceIp = ip.split(':')[0];
    }
    return requestContext;
}

module.exports = function cleanupRequest(req, options) {
    const request = req || {};

    request.requestContext = getRequestContext(req);
    request.method = request.method || 'GET';
    request.url = getUrl(request);
    request.body = request.body || '';
    request.headers = request.headers || {};

    if (options.basePath) {
        const basePathIndex = request.url.indexOf(options.basePath);

        if (basePathIndex > -1) {
            request.url = request.url.substr(basePathIndex + options.basePath.length);
        }
    }

    return request;
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const url = __webpack_require__(3);

const Request = __webpack_require__(4);

function requestHeaders(request) {
    return Object.keys(request.headers).reduce((headers, key) => {
        headers[key.toLowerCase()] = request.headers[key];
        return headers;
    }, {});
}

function requestBody(request) {
    const type = typeof request.rawBody;

    if (Buffer.isBuffer(request.rawBody)) {
        return request.rawBody;
    } else if (type === 'string') {
        return Buffer.from(request.rawBody, 'utf8');
    } else if (type === 'object') {
        return Buffer.from(JSON.stringify(request.rawBody));
    }

    throw new Error(`Unexpected request.body type: ${typeof request.rawBody}`);
}

module.exports = (request) => {
    const method = request.method;
    const query = request.query;
    const headers = requestHeaders(request);
    const body = requestBody(request);

    const req = new Request({
        method,
        headers,
        body,
        url: url.format({
            pathname: request.url,
            query
        })
    });
    req.requestContext = request.requestContext;
    return req;
}


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const isBinary = __webpack_require__(21);
const Response = __webpack_require__(1);
const sanitizeHeaders = __webpack_require__(22);

module.exports = (response, options) => {
    const { statusCode } = response;
    const headers = sanitizeHeaders(Response.headers(response));

    if (headers['transfer-encoding'] === 'chunked' || response.chunkedEncoding) {
        throw new Error('chunked encoding not supported');
    }

    const isBase64Encoded = isBinary(headers, options);
    const encoding = isBase64Encoded ? 'base64' : 'utf8';
    const body = Response.body(response).toString(encoding);

    return { status: statusCode, headers, isBase64Encoded, body };
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const BINARY_ENCODINGS = ['gzip', 'deflate', 'br'];
const BINARY_CONTENT_TYPES = (process.env.BINARY_CONTENT_TYPES || '').split(',');

function isBinaryEncoding(headers) {
  const contentEncoding = headers['content-encoding'];

  if (typeof contentEncoding === 'string') {
    return contentEncoding.split(',').some(value =>
      BINARY_ENCODINGS.some(binaryEncoding => value.indexOf(binaryEncoding) !== -1)
    );
  }
}

function isBinaryContent(headers, options) {
  const contentTypes = [].concat(options.binary
    ? options.binary
    : BINARY_CONTENT_TYPES
  ).map(candidate =>
    new RegExp(`^${candidate.replace(/\*/g, '.*')}$`)
  );

  const contentType = (headers['content-type'] || '').split(';')[0];
  return !!contentType && contentTypes.some(candidate => candidate.test(contentType));
}

module.exports = function isBinary(headers, options) {
  if (options.binary === false) {
    return false;
  }

  if (options.binary === true) {
    return true
  }

  if (typeof options.binary === 'function') {
    return options.binary(headers);
  }

  return isBinaryEncoding(headers) || isBinaryContent(headers, options);
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const setCookieVariations = __webpack_require__(23).variations;

module.exports = function sanitizeHeaders(headers) {
  return Object.keys(headers).reduce((memo, key) => {
      const value = headers[key];

      if (Array.isArray(value)) {
        if (key.toLowerCase() === 'set-cookie') {
          value.forEach((cookie, i) => {
            memo[setCookieVariations[i]] = cookie;
          });
        } else {
          memo[key] = value.join(', ');
        }
      } else {
        memo[key] = value == null ? '' : value.toString();
      }

      return memo;
    }, {});
};


/***/ }),
/* 23 */
/***/ (function(module) {

module.exports = JSON.parse("{\"variations\":[\"set-cookie\",\"Set-cookie\",\"sEt-cookie\",\"SEt-cookie\",\"seT-cookie\",\"SeT-cookie\",\"sET-cookie\",\"SET-cookie\",\"set-Cookie\",\"Set-Cookie\",\"sEt-Cookie\",\"SEt-Cookie\",\"seT-Cookie\",\"SeT-Cookie\",\"sET-Cookie\",\"SET-Cookie\",\"set-cOokie\",\"Set-cOokie\",\"sEt-cOokie\",\"SEt-cOokie\",\"seT-cOokie\",\"SeT-cOokie\",\"sET-cOokie\",\"SET-cOokie\",\"set-COokie\",\"Set-COokie\",\"sEt-COokie\",\"SEt-COokie\",\"seT-COokie\",\"SeT-COokie\",\"sET-COokie\",\"SET-COokie\",\"set-coOkie\",\"Set-coOkie\",\"sEt-coOkie\",\"SEt-coOkie\",\"seT-coOkie\",\"SeT-coOkie\",\"sET-coOkie\",\"SET-coOkie\",\"set-CoOkie\",\"Set-CoOkie\",\"sEt-CoOkie\",\"SEt-CoOkie\",\"seT-CoOkie\",\"SeT-CoOkie\",\"sET-CoOkie\",\"SET-CoOkie\",\"set-cOOkie\",\"Set-cOOkie\",\"sEt-cOOkie\",\"SEt-cOOkie\",\"seT-cOOkie\",\"SeT-cOOkie\",\"sET-cOOkie\",\"SET-cOOkie\",\"set-COOkie\",\"Set-COOkie\",\"sEt-COOkie\",\"SEt-COOkie\",\"seT-COOkie\",\"SeT-COOkie\",\"sET-COOkie\",\"SET-COOkie\",\"set-cooKie\",\"Set-cooKie\",\"sEt-cooKie\",\"SEt-cooKie\",\"seT-cooKie\",\"SeT-cooKie\",\"sET-cooKie\",\"SET-cooKie\",\"set-CooKie\",\"Set-CooKie\",\"sEt-CooKie\",\"SEt-CooKie\",\"seT-CooKie\",\"SeT-CooKie\",\"sET-CooKie\",\"SET-CooKie\",\"set-cOoKie\",\"Set-cOoKie\",\"sEt-cOoKie\",\"SEt-cOoKie\",\"seT-cOoKie\",\"SeT-cOoKie\",\"sET-cOoKie\",\"SET-cOoKie\",\"set-COoKie\",\"Set-COoKie\",\"sEt-COoKie\",\"SEt-COoKie\",\"seT-COoKie\",\"SeT-COoKie\",\"sET-COoKie\",\"SET-COoKie\",\"set-coOKie\",\"Set-coOKie\",\"sEt-coOKie\",\"SEt-coOKie\",\"seT-coOKie\",\"SeT-coOKie\",\"sET-coOKie\",\"SET-coOKie\",\"set-CoOKie\",\"Set-CoOKie\",\"sEt-CoOKie\",\"SEt-CoOKie\",\"seT-CoOKie\",\"SeT-CoOKie\",\"sET-CoOKie\",\"SET-CoOKie\",\"set-cOOKie\",\"Set-cOOKie\",\"sEt-cOOKie\",\"SEt-cOOKie\",\"seT-cOOKie\",\"SeT-cOOKie\",\"sET-cOOKie\",\"SET-cOOKie\",\"set-COOKie\",\"Set-COOKie\",\"sEt-COOKie\",\"SEt-COOKie\",\"seT-COOKie\",\"SeT-COOKie\",\"sET-COOKie\",\"SET-COOKie\",\"set-cookIe\",\"Set-cookIe\",\"sEt-cookIe\",\"SEt-cookIe\",\"seT-cookIe\",\"SeT-cookIe\",\"sET-cookIe\",\"SET-cookIe\",\"set-CookIe\",\"Set-CookIe\",\"sEt-CookIe\",\"SEt-CookIe\",\"seT-CookIe\",\"SeT-CookIe\",\"sET-CookIe\",\"SET-CookIe\",\"set-cOokIe\",\"Set-cOokIe\",\"sEt-cOokIe\",\"SEt-cOokIe\",\"seT-cOokIe\",\"SeT-cOokIe\",\"sET-cOokIe\",\"SET-cOokIe\",\"set-COokIe\",\"Set-COokIe\",\"sEt-COokIe\",\"SEt-COokIe\",\"seT-COokIe\",\"SeT-COokIe\",\"sET-COokIe\",\"SET-COokIe\",\"set-coOkIe\",\"Set-coOkIe\",\"sEt-coOkIe\",\"SEt-coOkIe\",\"seT-coOkIe\",\"SeT-coOkIe\",\"sET-coOkIe\",\"SET-coOkIe\",\"set-CoOkIe\",\"Set-CoOkIe\",\"sEt-CoOkIe\",\"SEt-CoOkIe\",\"seT-CoOkIe\",\"SeT-CoOkIe\",\"sET-CoOkIe\",\"SET-CoOkIe\",\"set-cOOkIe\",\"Set-cOOkIe\",\"sEt-cOOkIe\",\"SEt-cOOkIe\",\"seT-cOOkIe\",\"SeT-cOOkIe\",\"sET-cOOkIe\",\"SET-cOOkIe\",\"set-COOkIe\",\"Set-COOkIe\",\"sEt-COOkIe\",\"SEt-COOkIe\",\"seT-COOkIe\",\"SeT-COOkIe\",\"sET-COOkIe\",\"SET-COOkIe\",\"set-cooKIe\",\"Set-cooKIe\",\"sEt-cooKIe\",\"SEt-cooKIe\",\"seT-cooKIe\",\"SeT-cooKIe\",\"sET-cooKIe\",\"SET-cooKIe\",\"set-CooKIe\",\"Set-CooKIe\",\"sEt-CooKIe\",\"SEt-CooKIe\",\"seT-CooKIe\",\"SeT-CooKIe\",\"sET-CooKIe\",\"SET-CooKIe\",\"set-cOoKIe\",\"Set-cOoKIe\",\"sEt-cOoKIe\",\"SEt-cOoKIe\",\"seT-cOoKIe\",\"SeT-cOoKIe\",\"sET-cOoKIe\",\"SET-cOoKIe\",\"set-COoKIe\",\"Set-COoKIe\",\"sEt-COoKIe\",\"SEt-COoKIe\",\"seT-COoKIe\",\"SeT-COoKIe\",\"sET-COoKIe\",\"SET-COoKIe\",\"set-coOKIe\",\"Set-coOKIe\",\"sEt-coOKIe\",\"SEt-coOKIe\",\"seT-coOKIe\",\"SeT-coOKIe\",\"sET-coOKIe\",\"SET-coOKIe\",\"set-CoOKIe\",\"Set-CoOKIe\",\"sEt-CoOKIe\",\"SEt-CoOKIe\",\"seT-CoOKIe\",\"SeT-CoOKIe\",\"sET-CoOKIe\",\"SET-CoOKIe\",\"set-cOOKIe\",\"Set-cOOKIe\",\"sEt-cOOKIe\",\"SEt-cOOKIe\",\"seT-cOOKIe\",\"SeT-cOOKIe\",\"sET-cOOKIe\",\"SET-cOOKIe\",\"set-COOKIe\",\"Set-COOKIe\",\"sEt-COOKIe\",\"SEt-COOKIe\",\"seT-COOKIe\",\"SeT-COOKIe\",\"sET-COOKIe\",\"SET-COOKIe\",\"set-cookiE\",\"Set-cookiE\",\"sEt-cookiE\",\"SEt-cookiE\",\"seT-cookiE\",\"SeT-cookiE\",\"sET-cookiE\",\"SET-cookiE\",\"set-CookiE\",\"Set-CookiE\",\"sEt-CookiE\",\"SEt-CookiE\",\"seT-CookiE\",\"SeT-CookiE\",\"sET-CookiE\",\"SET-CookiE\",\"set-cOokiE\",\"Set-cOokiE\",\"sEt-cOokiE\",\"SEt-cOokiE\",\"seT-cOokiE\",\"SeT-cOokiE\",\"sET-cOokiE\",\"SET-cOokiE\",\"set-COokiE\",\"Set-COokiE\",\"sEt-COokiE\",\"SEt-COokiE\",\"seT-COokiE\",\"SeT-COokiE\",\"sET-COokiE\",\"SET-COokiE\",\"set-coOkiE\",\"Set-coOkiE\",\"sEt-coOkiE\",\"SEt-coOkiE\",\"seT-coOkiE\",\"SeT-coOkiE\",\"sET-coOkiE\",\"SET-coOkiE\",\"set-CoOkiE\",\"Set-CoOkiE\",\"sEt-CoOkiE\",\"SEt-CoOkiE\",\"seT-CoOkiE\",\"SeT-CoOkiE\",\"sET-CoOkiE\",\"SET-CoOkiE\",\"set-cOOkiE\",\"Set-cOOkiE\",\"sEt-cOOkiE\",\"SEt-cOOkiE\",\"seT-cOOkiE\",\"SeT-cOOkiE\",\"sET-cOOkiE\",\"SET-cOOkiE\",\"set-COOkiE\",\"Set-COOkiE\",\"sEt-COOkiE\",\"SEt-COOkiE\",\"seT-COOkiE\",\"SeT-COOkiE\",\"sET-COOkiE\",\"SET-COOkiE\",\"set-cooKiE\",\"Set-cooKiE\",\"sEt-cooKiE\",\"SEt-cooKiE\",\"seT-cooKiE\",\"SeT-cooKiE\",\"sET-cooKiE\",\"SET-cooKiE\",\"set-CooKiE\",\"Set-CooKiE\",\"sEt-CooKiE\",\"SEt-CooKiE\",\"seT-CooKiE\",\"SeT-CooKiE\",\"sET-CooKiE\",\"SET-CooKiE\",\"set-cOoKiE\",\"Set-cOoKiE\",\"sEt-cOoKiE\",\"SEt-cOoKiE\",\"seT-cOoKiE\",\"SeT-cOoKiE\",\"sET-cOoKiE\",\"SET-cOoKiE\",\"set-COoKiE\",\"Set-COoKiE\",\"sEt-COoKiE\",\"SEt-COoKiE\",\"seT-COoKiE\",\"SeT-COoKiE\",\"sET-COoKiE\",\"SET-COoKiE\",\"set-coOKiE\",\"Set-coOKiE\",\"sEt-coOKiE\",\"SEt-coOKiE\",\"seT-coOKiE\",\"SeT-coOKiE\",\"sET-coOKiE\",\"SET-coOKiE\",\"set-CoOKiE\",\"Set-CoOKiE\",\"sEt-CoOKiE\",\"SEt-CoOKiE\",\"seT-CoOKiE\",\"SeT-CoOKiE\",\"sET-CoOKiE\",\"SET-CoOKiE\",\"set-cOOKiE\",\"Set-cOOKiE\",\"sEt-cOOKiE\",\"SEt-cOOKiE\",\"seT-cOOKiE\",\"SeT-cOOKiE\",\"sET-cOOKiE\",\"SET-cOOKiE\",\"set-COOKiE\",\"Set-COOKiE\",\"sEt-COOKiE\",\"SEt-COOKiE\",\"seT-COOKiE\",\"SeT-COOKiE\",\"sET-COOKiE\",\"SET-COOKiE\",\"set-cookIE\",\"Set-cookIE\",\"sEt-cookIE\",\"SEt-cookIE\",\"seT-cookIE\",\"SeT-cookIE\",\"sET-cookIE\",\"SET-cookIE\",\"set-CookIE\",\"Set-CookIE\",\"sEt-CookIE\",\"SEt-CookIE\",\"seT-CookIE\",\"SeT-CookIE\",\"sET-CookIE\",\"SET-CookIE\",\"set-cOokIE\",\"Set-cOokIE\",\"sEt-cOokIE\",\"SEt-cOokIE\",\"seT-cOokIE\",\"SeT-cOokIE\",\"sET-cOokIE\",\"SET-cOokIE\",\"set-COokIE\",\"Set-COokIE\",\"sEt-COokIE\",\"SEt-COokIE\",\"seT-COokIE\",\"SeT-COokIE\",\"sET-COokIE\",\"SET-COokIE\",\"set-coOkIE\",\"Set-coOkIE\",\"sEt-coOkIE\",\"SEt-coOkIE\",\"seT-coOkIE\",\"SeT-coOkIE\",\"sET-coOkIE\",\"SET-coOkIE\",\"set-CoOkIE\",\"Set-CoOkIE\",\"sEt-CoOkIE\",\"SEt-CoOkIE\",\"seT-CoOkIE\",\"SeT-CoOkIE\",\"sET-CoOkIE\",\"SET-CoOkIE\",\"set-cOOkIE\",\"Set-cOOkIE\",\"sEt-cOOkIE\",\"SEt-cOOkIE\",\"seT-cOOkIE\",\"SeT-cOOkIE\",\"sET-cOOkIE\",\"SET-cOOkIE\",\"set-COOkIE\",\"Set-COOkIE\",\"sEt-COOkIE\",\"SEt-COOkIE\",\"seT-COOkIE\",\"SeT-COOkIE\",\"sET-COOkIE\",\"SET-COOkIE\",\"set-cooKIE\",\"Set-cooKIE\",\"sEt-cooKIE\",\"SEt-cooKIE\",\"seT-cooKIE\",\"SeT-cooKIE\",\"sET-cooKIE\",\"SET-cooKIE\",\"set-CooKIE\",\"Set-CooKIE\",\"sEt-CooKIE\",\"SEt-CooKIE\",\"seT-CooKIE\",\"SeT-CooKIE\",\"sET-CooKIE\",\"SET-CooKIE\",\"set-cOoKIE\",\"Set-cOoKIE\",\"sEt-cOoKIE\",\"SEt-cOoKIE\",\"seT-cOoKIE\",\"SeT-cOoKIE\",\"sET-cOoKIE\",\"SET-cOoKIE\",\"set-COoKIE\",\"Set-COoKIE\",\"sEt-COoKIE\",\"SEt-COoKIE\",\"seT-COoKIE\",\"SeT-COoKIE\",\"sET-COoKIE\",\"SET-COoKIE\",\"set-coOKIE\",\"Set-coOKIE\",\"sEt-coOKIE\",\"SEt-coOKIE\",\"seT-coOKIE\",\"SeT-coOKIE\",\"sET-coOKIE\",\"SET-coOKIE\",\"set-CoOKIE\",\"Set-CoOKIE\",\"sEt-CoOKIE\",\"SEt-CoOKIE\",\"seT-CoOKIE\",\"SeT-CoOKIE\",\"sET-CoOKIE\",\"SET-CoOKIE\",\"set-cOOKIE\",\"Set-cOOKIE\",\"sEt-cOOKIE\",\"SEt-cOOKIE\",\"seT-cOOKIE\",\"SeT-cOOKIE\",\"sET-cOOKIE\",\"SET-cOOKIE\",\"set-COOKIE\",\"Set-COOKIE\",\"sEt-COOKIE\",\"SEt-COOKIE\",\"seT-COOKIE\",\"SeT-COOKIE\",\"sET-COOKIE\",\"SET-COOKIE\"]}");

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const express = __webpack_require__(2);
const puzzles = __webpack_require__(25);
const options = __webpack_require__(26);
const router = express.Router();
router.get('/puzzle', (req, res) => {
  const {
    date
  } = req.query;
  if (!date) {
    return res.status(400).json({
      error: 'Date parameter is required'
    });
  }
  const puzzle = puzzles[date];
  if (!puzzle) {
    return res.status(404).json({
      error: 'No puzzle found for the given date'
    });
  }
  const optionsList = options[puzzle.optionsKey];
  if (!optionsList) {
    return res.status(500).json({
      error: 'Options not found for the puzzle'
    });
  }
  const fullPuzzle = _objectSpread(_objectSpread({}, puzzle), {}, {
    options: optionsList
  });
  res.json(fullPuzzle);
});

// Route to return all puzzles
router.get('/puzzles', (req, res) => {
  const allPuzzles = Object.entries(puzzles).map(([date, puzzle]) => {
    const optionsList = options[puzzle.optionsKey];
    return _objectSpread(_objectSpread({
      date
    }, puzzle), {}, {
      options: [] // TODO: remove this line when types are updated to make options optional in this case
    });
  });
  res.json(allPuzzles);
});
module.exports = router;

/***/ }),
/* 25 */
/***/ (function(module, exports) {

const puzzles = {
  "2024-02-25": {
    "num": 1,
    "category": "Largest countries by area",
    "answers": [{
      "text": ["Russia"],
      "stat": "6.602 million mi²"
    }, {
      "text": ["Canada"],
      "stat": "3.855 million mi²"
    }, {
      "text": ["China"],
      "stat": "3.747 million mi²"
    }, {
      "text": ["United States of America"],
      "stat": "3.618 million mi²"
    }, {
      "text": ["Brazil"],
      "stat": "3.288 million mi²"
    }],
    "optionsKey": "countries",
    "url": "https://www.worldometers.info/geography/largest-countries-in-the-world/"
  },
  "2024-02-26": {
    "num": 2,
    "category": "Most populous cities in the world",
    "answers": [{
      "text": ["Tokyo"],
      "stat": "37,115,035 people"
    }, {
      "text": ["Delhi"],
      "stat": "33,807,403 people"
    }, {
      "text": ["Shanghai"],
      "stat": "29,867,918 people"
    }, {
      "text": ["Dhaka"],
      "stat": "23,935,652 people"
    }, {
      "text": ["Sao Paulo"],
      "stat": "22,806,704 people"
    }],
    "optionsKey": "cities",
    "url": "https://worldpopulationreview.com/world-cities"
  },
  "2024-02-27": {
    "num": 3,
    "category": "Most mentioned Harry Potter characters in the books",
    "answers": [{
      "text": ["Harry Potter"],
      "stat": "18,956"
    }, {
      "text": ["Hermione Granger"],
      "stat": "6,464"
    }, {
      "text": ["Ron Weasley"],
      "stat": "5,486"
    }, {
      "text": ["Albus Dumbledore"],
      "stat": "2,421"
    }, {
      "text": ["Rubeus Hagrid"],
      "stat": "2,024"
    }],
    "optionsKey": "harry_potter_characters",
    "url": "https://aminoapps.com/c/harry-potter/page/blog/20-most-mentioned-characters/ZJTB_ugJEZM1ZgPWlRrrEDDRX5qX4m"
  },
  "2024-02-28": {
    "num": 4,
    "category": "Highest grossing films of all time",
    "answers": [{
      "text": ["Avatar"],
      "stat": "$2,923,706,026"
    }, {
      "text": ["Avengers: Endgame"],
      "stat": "$2,797,501,328"
    }, {
      "text": ["Avatar: The Way of Water"],
      "stat": "$2,320,250,281"
    }, {
      "text": ["Titanic"],
      "stat": "$2,257,844,554"
    }, {
      "text": ["Star Wars: Episode VII - The Force Awakens"],
      "stat": "$2,068,223,624"
    }],
    "optionsKey": "grossing_movies",
    "url": "https://en.wikipedia.org/wiki/List_of_highest-grossing_films"
  },
  "2024-02-29": {
    "num": 5,
    "category": "Largest countries by population",
    "answers": [{
      "text": ["India"],
      "stat": "1,428,627,663"
    }, {
      "text": ["China"],
      "stat": "1,425,671,352"
    }, {
      "text": ["United States of America"],
      "stat": "339,996,563"
    }, {
      "text": ["Indonesia"],
      "stat": "277,534,122"
    }, {
      "text": ["Pakistan"],
      "stat": "240,485,658"
    }],
    "optionsKey": "countries",
    "url": "https://www.worldometers.info/world-population/population-by-country/"
  },
  "2024-03-01": {
    "num": 6,
    "category": "Most spoken languages by total language speakers",
    "answers": [{
      "text": ["English"],
      "stat": "1.456 billion people"
    }, {
      "text": ["Mandarin Chinese"],
      "stat": "1.138 billion people"
    }, {
      "text": ["Hindi"],
      "stat": "610 million people"
    }, {
      "text": ["Spanish"],
      "stat": "559 million"
    }, {
      "text": ["French"],
      "stat": "310 million"
    }],
    "optionsKey": "languages",
    "url": "https://en.wikipedia.org/wiki/List_of_languages_by_total_number_of_speakers#Ethnologue_(2023)"
  },
  "2024-03-02": {
    "num": 7,
    "category": "Best selling video games of all time",
    "answers": [{
      "text": ["Minecraft"],
      "stat": "300,000,000 sales"
    }, {
      "text": ["Grand Theft Auto V"],
      "stat": "200,000,000 sales"
    }, {
      "text": ["Tetris"],
      "stat": "100,000,000"
    }, {
      "text": ["Wii Sports"],
      "stat": "82,900,000"
    }, {
      "text": ["PUBG: Battlegrounds"],
      "stat": "75,000,000"
    }],
    "optionsKey": "video_games",
    "url": "https://en.wikipedia.org/wiki/List_of_best-selling_video_games"
  },
  "2024-03-03": {
    "num": 8,
    "category": "Most popular social networks by monthly active users",
    "answers": [{
      "text": ["Facebook"],
      "stat": "3.070 billion MAUs"
    }, {
      "text": ["YouTube"],
      "stat": "2.504 billion MAUs"
    }, {
      "text": ["WhatsApp", "Instagram"],
      "stat": "2 billion MAUs"
    }, {
      "text": ["TikTok"],
      "stat": "1.582 billions MAUs"
    }, {
      "text": ["WeChat"],
      "stat": "1.343 billion MAUs"
    }],
    "optionsKey": "social_networks",
    "url": "https://en.wikipedia.org/wiki/List_of_social_platforms_with_at_least_100_million_active_users"
  },
  "2024-03-04": {
    "num": 9,
    "category": "Countries with most pizza consumed per capita",
    "answers": [{
      "text": ["Norway"],
      "stat": "11.40 kg/person"
    }, {
      "text": ["Canada"],
      "stat": "8.90 kg/person"
    }, {
      "text": ["Australia"],
      "stat": "8.60 kg/person"
    }, {
      "text": ["Italy"],
      "stat": "7.60 kg/person"
    }, {
      "text": ["Switzerland"],
      "stat": "7.50 kg/person"
    }],
    "optionsKey": "countries",
    "url": "https://worldpopulationreview.com/country-rankings/pizza-consumption-by-country"
  },
  "2024-03-05": {
    "num": 10,
    "category": "Most streamed musical artists of all time",
    "answers": [{
      "text": ["Taylor Swift"],
      "stat": "81.740 billion streams"
    }, {
      "text": ["Drake"],
      "stat": "75.948 billion streams"
    }, {
      "text": ["Bad Bunny"],
      "stat": "72.155 billion streams"
    }, {
      "text": ["The Weeknd"],
      "stat": "57.405 billion streams"
    }, {
      "text": ["Ed Sheeran"],
      "stat": "48.262 billion streams"
    }],
    "optionsKey": "musical_artists",
    "url": "https://chartmasters.org/most-streamed-artists-ever-on-spotify/"
  },
  "2024-03-06": {
    "num": 11,
    "category": "Most followed Instagram accounts",
    "answers": [{
      "text": ["Instagram"],
      "stat": "672 million followers"
    }, {
      "text": ["Cristiano Ronaldo"],
      "stat": "629 million followers"
    }, {
      "text": ["Lionel Messi"],
      "stat": "502 million followers"
    }, {
      "text": ["Selena Gomez"],
      "stat": "428 million followers"
    }, {
      "text": ["Kylie Jenner"],
      "stat": "399 million followers"
    }],
    "optionsKey": "celebrities",
    "url": "https://en.wikipedia.org/wiki/List_of_most-followed_Instagram_accounts"
  },
  "2024-03-07": {
    "num": 12,
    "category": "Tallest buildings in the world",
    "answers": [{
      "text": ["Burj Khalifa"],
      "stat": "828.0 m"
    }, {
      "text": ["Merdeka 118"],
      "stat": "678.9 m"
    }, {
      "text": ["Shanghai Tower"],
      "stat": "632.0 m"
    }, {
      "text": ["Abraj Al-Bait Clock Tower"],
      "stat": "601.0 m"
    }, {
      "text": ["Ping An International Finance Centre"],
      "stat": "599.1 m"
    }],
    "optionsKey": "buildings",
    "url": "https://en.wikipedia.org/wiki/List_of_tallest_buildings"
  },
  "2024-03-08": {
    "num": 13,
    "category": "Most visited art museums in the world",
    "answers": [{
      "text": ["Louvre Museum"],
      "stat": "8,860,000 people"
    }, {
      "text": ["Vatican Museums"],
      "stat": "6,764,858 people"
    }, {
      "text": ["British Museum"],
      "stat": "5,820,860 people"
    }, {
      "text": ["Metropolitan Museum of Art"],
      "stat": "5,364,000 people"
    }, {
      "text": ["Tate Modern"],
      "stat": "4,742,038 people"
    }],
    "optionsKey": "art_museums",
    "url": "https://en.wikipedia.org/wiki/List_of_most-visited_art_museums"
  },
  "2024-03-09": {
    "num": 14,
    "category": "Most common words in the English language",
    "answers": [{
      "text": ["the"],
      "stat": null
    }, {
      "text": ["be"],
      "stat": null
    }, {
      "text": ["to"],
      "stat": null
    }, {
      "text": ["of"],
      "stat": null
    }, {
      "text": ["and"],
      "stat": null
    }],
    "optionsKey": "words",
    "url": "https://web.archive.org/web/20111226085859/http://oxforddictionaries.com/words/the-oec-facts-about-the-language"
  },
  "2024-03-10": {
    "num": 15,
    "category": "Countries with the most McDonald's restaurants",
    "answers": [{
      "text": ["United States of America"],
      "stat": "13,682 outlets"
    }, {
      "text": ["China"],
      "stat": "4,978 outlets"
    }, {
      "text": ["Japan"],
      "stat": "2,900 outlets"
    }, {
      "text": ["France"],
      "stat": "1,500 outlets"
    }, {
      "text": ["Germany"],
      "stat": "1,422 outlets"
    }],
    "optionsKey": "countries",
    "url": "https://en.wikipedia.org/wiki/List_of_countries_with_McDonald%27s_restaurants#Countries_and_territories_with_at_least_one_McDonald's_outlet"
  },
  "2024-03-11": {
    "num": 16,
    "category": "Most valuable companies by market capitalization",
    "answers": [{
      "text": ["Microsoft"],
      "stat": "$3.197 T"
    }, {
      "text": ["Apple"],
      "stat": "$2.913 T"
    }, {
      "text": ["NVIDIA"],
      "stat": "$2.618 T"
    }, {
      "text": ["Alphabet (Google)"],
      "stat": "$2.170 T"
    }, {
      "text": ["Saudi Aramco"],
      "stat": "$1.937 T"
    }],
    "optionsKey": "companies",
    "url": "https://companiesmarketcap.com/"
  },
  "2024-03-12": {
    "num": 17,
    "category": "Longest running scripted American TV shows by number of seasons",
    "answers": [{
      "text": ["The Simpsons"],
      "stat": "768 episodes"
    }, {
      "text": ["Law & Order: Special Victims Unit"],
      "stat": "551 episodes"
    }, {
      "text": ["Law & Order"],
      "stat": "501 episodes"
    }, {
      "text": ["Family Guy"],
      "stat": "424 episodes"
    }, {
      "text": ["NCIS"],
      "stat": "467 episodes"
    }],
    "optionsKey": "tv_shows",
    "url": "https://en.wikipedia.org/wiki/List_of_longest-running_scripted_U.S._primetime_television_series"
  },
  "2024-03-13": {
    "num": 18,
    "category": "Countries with most Nobel prize winners",
    "answers": [{
      "text": ["United States of America"],
      "stat": "411 winners"
    }, {
      "text": ["United Kingdom"],
      "stat": "137 winners"
    }, {
      "text": ["Germany"],
      "stat": "115 winners"
    }, {
      "text": ["France"],
      "stat": "75 winners"
    }, {
      "text": ["Sweden"],
      "stat": "34 winners"
    }],
    "optionsKey": "countries",
    "url": "https://en.wikipedia.org/wiki/List_of_Nobel_laureates_by_country"
  },
  "2024-03-14": {
    "num": 19,
    "category": "Most valuable clothing & apparel brands in the world",
    "answers": [{
      "text": ["Nike"],
      "stat": "$31,307M"
    }, {
      "text": ["Louis Vuitton"],
      "stat": "$26,290M"
    }, {
      "text": ["Chanel"],
      "stat": "$19,386M"
    }, {
      "text": ["Gucci"],
      "stat": "$17,839M"
    }, {
      "text": ["Adidas"],
      "stat": "$15,660M"
    }],
    "optionsKey": "fashion_brands",
    "url": "https://brandirectory.com/rankings/apparel/table"
  },
  "2024-03-15": {
    "num": 20,
    "category": "Countries with the most beer consumed per capita",
    "answers": [{
      "text": ["Czech Republic"],
      "stat": "140 L"
    }, {
      "text": ["Austria"],
      "stat": "107.8 L"
    }, {
      "text": ["Romania"],
      "stat": "100.3 L"
    }, {
      "text": ["Germany"],
      "stat": "99 L"
    }, {
      "text": ["Poland"],
      "stat": "97.7 L"
    }],
    "optionsKey": "countries",
    "url": "https://www.datapandas.org/ranking/beer-consumption-by-country"
  },
  "2024-03-16": {
    "num": 21,
    "category": "Oldest US National Parks",
    "answers": [{
      "text": ["Yellowstone"],
      "stat": "March 1, 1872"
    }, {
      "text": ["Sequoia"],
      "stat": "September 25, 1890"
    }, {
      "text": ["Yosemite"],
      "stat": "October 1, 1890"
    }, {
      "text": ["Mount Rainier"],
      "stat": "March 2, 1899"
    }, {
      "text": ["Crater Lake"],
      "stat": "May 22, 1902"
    }],
    "optionsKey": "national_parks",
    "url": "https://en.wikipedia.org/wiki/List_of_national_parks_of_the_United_States"
  },
  "2024-03-17": {
    "num": 22,
    "category": "Best selling car brands in the world",
    "answers": [{
      "text": ["Toyota"],
      "stat": "1.3 million vehicles"
    }, {
      "text": ["Volkswagen"],
      "stat": "735,284 vehicles"
    }, {
      "text": ["Honda"],
      "stat": "587,974 vehicles"
    }, {
      "text": ["Ford"],
      "stat": "578,957 vehicles"
    }, {
      "text": ["Hyundai"],
      "stat": "534,548 vehicles"
    }],
    "optionsKey": "car_brands",
    "url": "https://www.focus2move.com/world-cars-brand-ranking/#:~:text=On%20top%2C%20as%20happening%20uninterruptedly,million%20cars%20(%2B7.0%25)."
  },
  "2024-03-18": {
    "num": 23,
    "category": "Most visited countries by number of arrivals",
    "answers": [{
      "text": ["France"],
      "stat": "89.4 million people"
    }, {
      "text": ["Spain"],
      "stat": "83.7 million people"
    }, {
      "text": ["United States of America"],
      "stat": "79.3 million people"
    }, {
      "text": ["China"],
      "stat": "65.7 million people"
    }, {
      "text": ["Italy"],
      "stat": "64.5 million people"
    }],
    "optionsKey": "countries",
    "url": "https://www.datapandas.org/ranking/most-visited-countries#map"
  },
  "2024-03-19": {
    "num": 24,
    "category": "Most abundant elements in the Earth's crust",
    "answers": [{
      "text": ["Oxygen"],
      "stat": "461,000 ppm"
    }, {
      "text": ["Silicon"],
      "stat": "282,000 ppm"
    }, {
      "text": ["Aluminium"],
      "stat": "82,300 ppm"
    }, {
      "text": ["Iron"],
      "stat": "56,300 ppm"
    }, {
      "text": ["Calcium"],
      "stat": "41,500 ppm"
    }],
    "optionsKey": "elements",
    "url": "https://en.wikipedia.org/wiki/Abundance_of_elements_in_Earth%27s_crust"
  },
  "2024-03-20": {
    "num": 25,
    "category": "Countries with the most wine production",
    "answers": [{
      "text": ["Italy"],
      "stat": "4.8 million tons"
    }, {
      "text": ["Spain"],
      "stat": "4.6 million tons"
    }, {
      "text": ["France"],
      "stat": "4.3 million tons"
    }, {
      "text": ["United States of America"],
      "stat": "3.3 million tons"
    }, {
      "text": ["China"],
      "stat": "1.7 million tons"
    }],
    "optionsKey": "countries",
    "url": "https://www.datapandas.org/ranking/wine-production-by-country"
  },
  "2024-03-21": {
    "num": 26,
    "category": "States with the most cows",
    "answers": [{
      "text": ["Texas"],
      "stat": "4.12 million cows"
    }, {
      "text": ["Oklahoma"],
      "stat": "1.92 million cows"
    }, {
      "text": ["Missouri"],
      "stat": "1.84 million cows"
    }, {
      "text": ["Nebraska"],
      "stat": "1.64 million cows"
    }, {
      "text": ["South Dakota"],
      "stat": "1.50 million cows"
    }],
    "optionsKey": "us_states",
    "url": "https://app.usda-reports.penguinlabs.net/?crop=cattle_cows_beef&statistic=inventory_head&yearet=&year=2024cattle-texas-had-the-most-cattle-in-the-united-states-in-2023-followed-by-nebraska-and-kansas#"
  },
  "2024-03-22": {
    "num": 27,
    "category": "Best selling cereals in the US by boxes sold",
    "answers": [{
      "text": ["Cheerios"],
      "stat": "139.1 million boxes"
    }, {
      "text": ["Frosted Flakes"],
      "stat": "132.3 million boxes"
    }, {
      "text": ["Honey Nut Cheerios"],
      "stat": "129.3 million boxes"
    }, {
      "text": ["Honey Bunches of Oats"],
      "stat": "111.3 million boxes"
    }, {
      "text": ["Cinnamon Toast Crunch"],
      "stat": "105.2 million boxes"
    }],
    "optionsKey": "cereals",
    "url": "https://dailyinfographic.com/most-popular-cereals-in-america"
  },
  "2024-03-23": {
    "num": 28,
    "category": "Highest grossing Broadway musicals of all time",
    "answers": [{
      "text": ["The Lion King"],
      "stat": "$1,957,380,113"
    }, {
      "text": ["Wicked"],
      "stat": "$1,616,910,066"
    }, {
      "text": ["The Phantom of the Opera"],
      "stat": "$1,364,632,622"
    }, {
      "text": ["Hamilton"],
      "stat": "$931,943,538"
    }, {
      "text": ["The Book of Mormon"],
      "stat": "$790,759,154"
    }],
    "optionsKey": "broadway_musicals",
    "url": "https://en.wikipedia.org/wiki/List_of_highest-grossing_musical_theatre_productions"
  },
  "2024-03-24": {
    "num": 29,
    "category": "Most scooped Ben and Jerry's ice cream flavors",
    "answers": [{
      "text": ["Half Baked"],
      "stat": null
    }, {
      "text": ["Cherry Garcia"],
      "stat": null
    }, {
      "text": ["Chocolate Chip Cookie Dough"],
      "stat": null
    }, {
      "text": ["Strawberry Cheesecake"],
      "stat": null
    }, {
      "text": ["Chocolate Fudge Brownie"],
      "stat": null
    }],
    "optionsKey": "ice_cream_flavors",
    "url": "https://www.benjerry.com/whats-new/2023/12/top-flavors-2023"
  },
  "2024-03-25": {
    "num": 30,
    "category": "Countries with most renewable energy as a share of total energy generation",
    "answers": [{
      "text": ["Iceland"],
      "stat": "86.87% generated"
    }, {
      "text": ["Norway"],
      "stat": "71.56% generated"
    }, {
      "text": ["Sweden"],
      "stat": "50.92% generated"
    }, {
      "text": ["Brazil"],
      "stat": "46.22% generated"
    }, {
      "text": ["New Zealand"],
      "stat": "40.22% generated"
    }],
    "optionsKey": "countries",
    "url": "https://wisevoter.com/country-rankings/renewable-energy-by-country/#countries-with-the-most-renewable-energy"
  },
  "2024-03-26": {
    "num": 31,
    "category": "Most visited theme parks in the world by annual attendance",
    "answers": [{
      "text": ["Magic Kingdom (Walt Disney World)"],
      "stat": "17,133,000 people"
    }, {
      "text": ["Disneyland Park (Anaheim)"],
      "stat": "16,881,000 people"
    }, {
      "text": ["Universal Studios Japan"],
      "stat": "12,350,000 people"
    }, {
      "text": ["Tokyo Disneyland"],
      "stat": "12,000,000 people"
    }, {
      "text": ["Universal Studios Islands of Adventure (Orlando)"],
      "stat": "11,025,000 people"
    }],
    "optionsKey": "theme_parks",
    "url": "https://en.wikipedia.org/wiki/Amusement_park_rankings"
  },
  "2024-03-27": {
    "num": 32,
    "category": "Global fruit production by weight",
    "answers": [{
      "text": ["Bananas"],
      "stat": "135.11 million metric tons"
    }, {
      "text": ["Watermelons"],
      "stat": "99.96 million metric tons"
    }, {
      "text": ["Apples"],
      "stat": "95.84 million metric tons"
    }, {
      "text": ["Oranges"],
      "stat": "76.41 million metric tons"
    }, {
      "text": ["Grapes"],
      "stat": "74.94 million metric tons"
    }],
    "optionsKey": "fruits",
    "url": "https://www.statista.com/statistics/264001/worldwide-production-of-fruit-by-variety/"
  },
  "2024-03-28": {
    "num": 33,
    "category": "Most popular dog breeds in the US",
    "answers": [{
      "text": ["French Bulldog"],
      "stat": null
    }, {
      "text": ["Labrador Retriever"],
      "stat": null
    }, {
      "text": ["Golden Retriever"],
      "stat": null
    }, {
      "text": ["German Shepherd"],
      "stat": null
    }, {
      "text": ["Poodle"],
      "stat": null
    }],
    "optionsKey": "dog_breeds",
    "url": "https://www.akc.org/expert-advice/news/most-popular-dog-breeds-2023/"
  },
  "2024-03-29": {
    "num": 34,
    "category": "Most visited cities in the world by arrivals in 2023",
    "answers": [{
      "text": ["Istanbul"],
      "stat": "20,200,000 arrivals"
    }, {
      "text": ["London"],
      "stat": "18,800,000 arrivals"
    }, {
      "text": ["Dubai"],
      "stat": "16,800,000 arrivals"
    }, {
      "text": ["Antalya"],
      "stat": "16,500,000 arrivals"
    }, {
      "text": ["Paris"],
      "stat": "15,500,000 arrivals"
    }],
    "optionsKey": "cities",
    "url": "https://en.wikipedia.org/wiki/List_of_cities_by_international_visitors"
  },
  "2024-03-30": {
    "num": 35,
    "category": "Most popular fast food chains in the US by sales",
    "answers": [{
      "text": ["McDonald's"],
      "stat": "48.734 billion sales"
    }, {
      "text": ["Starbucks"],
      "stat": "28.100 billion sales"
    }, {
      "text": ["Chick-fil-A"],
      "stat": "18.814 billion sales"
    }, {
      "text": ["Taco Bell"],
      "stat": "13.850 billion sales"
    }, {
      "text": ["Wendy's"],
      "stat": "11.694 billion sales"
    }],
    "optionsKey": "fast_food_chains",
    "url": "https://www.qsrmagazine.com/operations/fast-food/the-2023-qsr-50-fast-foods-leading-annual-report/"
  },
  "2024-03-31": {
    "num": 36,
    "category": "Largest historical empires by land area",
    "answers": [{
      "text": ["British Empire"],
      "stat": "13.71 million mi²"
    }, {
      "text": ["Mongol Empire"],
      "stat": "9.27 million mi²"
    }, {
      "text": ["Russian Empire"],
      "stat": "8.80 million mi²"
    }, {
      "text": ["Qing dynasty"],
      "stat": "5.68 million mi²"
    }, {
      "text": ["Spanish Empire"],
      "stat": "4.44 million mi²"
    }],
    "optionsKey": "empires",
    "url": "https://en.wikipedia.org/wiki/List_of_largest_empires"
  },
  "2024-04-01": {
    "num": 37,
    "category": "Biggest Oceans",
    "answers": [{
      "text": ["The 1997 song 'Ocean Man' by Ween"],
      "stat": null
    }, {
      "text": ["Frank Ocean"],
      "stat": null
    }, {
      "text": ["Ocean's 11"],
      "stat": null
    }, {
      "text": ["Ocean Sрray Cranberry Juice"],
      "stat": null
    }, {
      "text": ["Pacific Ocean"],
      "stat": null
    }],
    "optionsKey": "oceans_april_fools",
    "url": "https://www.youtube.com/watch?v=tkzY_VwNIek"
  },
  "2024-04-02": {
    "num": 38,
    "category": "Major League Baseball franchises with most World Series appearances",
    "answers": [{
      "text": ["New York Yankees"],
      "stat": "40 appearances"
    }, {
      "text": ["Los Angeles Dodgers"],
      "stat": "21 appearances"
    }, {
      "text": ["San Francisco Giants"],
      "stat": "20 appearances"
    }, {
      "text": ["St. Louis Cardinals"],
      "stat": "19 appearances"
    }, {
      "text": ["Oakland Athletics"],
      "stat": "14 appearances"
    }],
    "optionsKey": "mlb_teams",
    "url": "https://en.wikipedia.org/wiki/List_of_World_Series_champions"
  },
  "2024-04-03": {
    "num": 39,
    "category": "Countries with most avocados produced",
    "answers": [{
      "text": ["Mexico"],
      "stat": "2,592,581"
    }, {
      "text": ["Colombia"],
      "stat": "1,090,664"
    }, {
      "text": ["Peru"],
      "stat": "866,457"
    }, {
      "text": ["Dominican Republic"],
      "stat": "737,021"
    }, {
      "text": ["Kenya"],
      "stat": "458,439"
    }],
    "optionsKey": "countries",
    "url": "https://en.wikipedia.org/wiki/List_of_countries_by_avocado_production"
  },
  "2024-04-04": {
    "num": 40,
    "category": "US states with the largest coastlines",
    "answers": [{
      "text": ["Alaska"],
      "stat": "33,904 miles"
    }, {
      "text": ["Florida"],
      "stat": "8,436 miles"
    }, {
      "text": ["Louisiana"],
      "stat": "7,721 miles"
    }, {
      "text": ["Maine"],
      "stat": "3,478 miles"
    }, {
      "text": ["California"],
      "stat": "3,427 miles"
    }],
    "optionsKey": "us_states",
    "url": "https://worldpopulationreview.com/state-rankings/coastline-length-by-state"
  },
  "2024-04-05": {
    "num": 41,
    "category": "NBA all-time leading scorers",
    "answers": [{
      "text": ["LeBron James"],
      "stat": "40,474 points"
    }, {
      "text": ["Kareem Abdul-Jabbar"],
      "stat": "38,387 points"
    }, {
      "text": ["Karl Malone"],
      "stat": "36,928 points"
    }, {
      "text": ["Kobe Bryant"],
      "stat": "33,643 points"
    }, {
      "text": ["Michael Jordan"],
      "stat": "32,292 points"
    }],
    "optionsKey": "nba_players",
    "url": "https://www.basketball-reference.com/leaders/pts_career.html"
  },
  "2024-04-06": {
    "num": 42,
    "category": "Countries with most nominations for 'Best International Feature Film' at the Academy Awards",
    "answers": [{
      "text": ["France"],
      "stat": "41 nominations"
    }, {
      "text": ["Italy"],
      "stat": "33 nominations"
    }, {
      "text": ["Spain"],
      "stat": "21 nominations"
    }, {
      "text": ["Japan"],
      "stat": "18 nominations"
    }, {
      "text": ["Sweden"],
      "stat": "16 nominations"
    }],
    "optionsKey": "countries",
    "url": "https://en.wikipedia.org/wiki/List_of_countries_by_number_of_Academy_Awards_for_Best_International_Feature_Film"
  },
  "2024-04-07": {
    "num": 43,
    "category": "Longest running US game shows by number of years on the air",
    "answers": [{
      "text": ["The Price Is Right"],
      "stat": "60 years"
    }, {
      "text": ["Jeopardy!"],
      "stat": "54 years"
    }, {
      "text": ["Wheel Of Fortune"],
      "stat": "48 years"
    }, {
      "text": ["Family Feud"],
      "stat": "38 years"
    }, {
      "text": ["Let's Make A Deal"],
      "stat": "37 years"
    }],
    "optionsKey": "game_shows",
    "url": "https://screenrant.com/game-shows-longest-runing-television/"
  },
  "2024-04-08": {
    "num": 44,
    "category": "Most abundant elements in the Milky Way Galaxy",
    "answers": [{
      "text": ["Hydrogen"],
      "stat": "739,000 ppm"
    }, {
      "text": ["Helium"],
      "stat": "240,000 ppm"
    }, {
      "text": ["Oxygen"],
      "stat": "10,400 ppm"
    }, {
      "text": ["Carbon"],
      "stat": "4,600 ppm"
    }, {
      "text": ["Neon"],
      "stat": "1,340 ppm"
    }],
    "optionsKey": "elements",
    "url": "https://en.wikipedia.org/wiki/Abundance_of_the_chemical_elements#Universe"
  },
  "2024-04-09": {
    "num": 45,
    "category": "Countries with the highest coffee production",
    "answers": [{
      "text": ["Brazil"],
      "stat": "2.595 million metric tons"
    }, {
      "text": ["Vietnam"],
      "stat": "1.650 million metric tons"
    }, {
      "text": ["Colombia"],
      "stat": "0.810 million metric tons"
    }, {
      "text": ["Indonesia"],
      "stat": "0.660 million metric tons"
    }, {
      "text": ["Ethiopia"],
      "stat": "0.384 million metric tons"
    }],
    "optionsKey": "countries",
    "url": "https://www.worldatlas.com/articles/top-coffee-producing-countries.html#Top%20Coffee%20Producing%20Countries"
  },
  "2024-04-10": {
    "num": 46,
    "category": "US companies with most employees",
    "answers": [{
      "text": ["Walmart"],
      "stat": "2,100,000 employees"
    }, {
      "text": ["Amazon.com"],
      "stat": "1,525,000 employees"
    }, {
      "text": ["FedEx"],
      "stat": "529,000 employees"
    }, {
      "text": ["United Parcel Service (UPS)"],
      "stat": "500,000 employes"
    }, {
      "text": ["The Home Depot"],
      "stat": "463,100 employees"
    }],
    "optionsKey": "us_companies",
    "url": "https://stockanalysis.com/list/most-employees/"
  },
  "2024-04-11": {
    "num": 47,
    "category": "Best selling board games of all time",
    "answers": [{
      "text": ["Chess"],
      "stat": null
    }, {
      "text": ["Checkers"],
      "stat": null
    }, {
      "text": ["Monopoly"],
      "stat": null
    }, {
      "text": ["Scrabble"],
      "stat": null
    }, {
      "text": ["Clue"],
      "stat": null
    }],
    "optionsKey": "board_games",
    "url": "https://moneyinc.com/highest-selling-board-games-of-all-time/"
  },
  "2024-04-12": {
    "num": 48,
    "category": "Most popular dog names in the US",
    "answers": [{
      "text": ["Bella"],
      "stat": null
    }, {
      "text": ["Luna"],
      "stat": null
    }, {
      "text": ["Max"],
      "stat": null
    }, {
      "text": ["Daisy"],
      "stat": null
    }, {
      "text": ["Charlie"],
      "stat": null
    }],
    "optionsKey": "dog_names",
    "url": "https://www.usnews.com/insurance/pet-insurance/most-popular-dog-names-study"
  },
  "2024-04-13": {
    "num": 49,
    "category": "Largest celestial bodies in the Solar System by radius",
    "answers": [{
      "text": ["Sun"],
      "stat": "695,508 km"
    }, {
      "text": ["Jupiter"],
      "stat": "69,911 km"
    }, {
      "text": ["Saturn"],
      "stat": "58,232 km"
    }, {
      "text": ["Uranus"],
      "stat": "25,362 km"
    }, {
      "text": ["Neptune"],
      "stat": "24,622 km"
    }],
    "optionsKey": "celestial_bodies",
    "url": "https://en.wikipedia.org/wiki/List_of_Solar_System_objects_by_size"
  },
  "2024-04-14": {
    "num": 50,
    "category": "Best selling Wii videogames of all time",
    "answers": [{
      "text": ["Wii Sports"],
      "stat": "82.90 million"
    }, {
      "text": ["Mario Kart Wii"],
      "stat": "37.38 million"
    }, {
      "text": ["Wii Sports Resort"],
      "stat": "33.14 million"
    }, {
      "text": ["New Super Mario Bros. Wii"],
      "stat": "30.22 million"
    }, {
      "text": ["Wii Play"],
      "stat": "28.02 million"
    }],
    "optionsKey": "wii_games",
    "url": "https://en.wikipedia.org/wiki/List_of_best-selling_Wii_video_games"
  },
  "2024-04-15": {
    "num": 51,
    "category": "Countries with the most Olympic Medals",
    "answers": [{
      "text": ["United States of America"],
      "stat": "2,985"
    }, {
      "text": ["Germany"],
      "stat": "1,350"
    }, {
      "text": ["United Kingdom"],
      "stat": "965"
    }, {
      "text": ["France"],
      "stat": "910"
    }, {
      "text": ["Italy"],
      "stat": "773"
    }],
    "optionsKey": "countries",
    "url": "https://worldpopulationreview.com/country-rankings/olympic-medals-by-country"
  },
  "2024-04-16": {
    "num": 52,
    "category": "James Bond movies ranked by Rotten Tomatoes 'Tomatometer' score (critics)",
    "answers": [{
      "text": ["Goldfinger (1964)"],
      "stat": "99%"
    }, {
      "text": ["From Russia with Love (1963)"],
      "stat": "97%"
    }, {
      "text": ["Dr. No (1962)"],
      "stat": "95%"
    }, {
      "text": ["Casino Royale (2006)"],
      "stat": "94%"
    }, {
      "text": ["Skyfall (2012)"],
      "stat": "92%"
    }],
    "optionsKey": "bond_movies",
    "url": "https://editorial.rottentomatoes.com/guide/james-bond-movies/"
  },
  "2024-04-17": {
    "num": 53,
    "category": "Highest grossing concert tours (adjusted for inflation)",
    "answers": [{
      "text": ["Taylor Swift (The Eras Tour)"],
      "stat": "$1,039,263,762"
    }, {
      "text": ["U2 (U2 360° Tour)"],
      "stat": "$997,437,284"
    }, {
      "text": ["Elton John (Farewell Yellow Brick Road)"],
      "stat": "$939,100,000"
    }, {
      "text": ["Ed Sheeran (÷ Tour)"],
      "stat": "$925,014,604"
    }, {
      "text": ["The Rolling Stones (A Bigger Bang Tour)"],
      "stat": "$820,315,772"
    }],
    "optionsKey": "concert_tours",
    "url": "https://en.wikipedia.org/wiki/List_of_highest-grossing_concert_tours"
  },
  "2024-04-18": {
    "num": 54,
    "category": "Countries that export the most vodka by dollars sold (2022)",
    "answers": [{
      "text": ["Sweden"],
      "stat": "$471.98 million"
    }, {
      "text": ["France"],
      "stat": "$454.39 million"
    }, {
      "text": ["Poland"],
      "stat": "$190.08 million"
    }, {
      "text": ["United States of America"],
      "stat": "$138.96 million"
    }, {
      "text": ["Netherlands"],
      "stat": "$137.71 million"
    }],
    "optionsKey": "countries",
    "url": "https://www.insidermonkey.com/blog/5-countries-that-export-the-most-vodka-1235806/"
  },
  "2024-04-19": {
    "num": 55,
    "category": "Actresses with the most Academy Award nominations",
    "answers": [{
      "text": ["Meryl Streep"],
      "stat": "21 nominations"
    }, {
      "text": ["Katharine Hepburn"],
      "stat": "12 nominations"
    }, {
      "text": ["Bette Davis"],
      "stat": "10 nominations"
    }, {
      "text": ["Cate Blanchett", "Geraldine Page", "Judi Dench", "Glenn Close"],
      "stat": "8 nominations"
    }, {
      "text": ["Ingrid Bergman", "Jane Fonda", "Greer Garson", "Kate Winslet"],
      "stat": "7 nominations"
    }],
    "optionsKey": "actresses",
    "url": "https://en.m.wikipedia.org/wiki/List_of_actors_with_three_or_more_Academy_Award_nominations_in_acting_categories"
  },
  "2024-04-20": {
    "num": 56,
    "category": "Best selling video game consoles of all time by units sold",
    "answers": [{
      "text": ["PlayStation 2"],
      "stat": "155 million"
    }, {
      "text": ["Nintendo DS"],
      "stat": "154.02 million"
    }, {
      "text": ["Nintendo Switch"],
      "stat": "139.36 million"
    }, {
      "text": ["Game Boy & Game Boy Color"],
      "stat": "118.69 million"
    }, {
      "text": ["PlayStation 4"],
      "stat": "117.2 million"
    }],
    "optionsKey": "game_consoles",
    "url": "https://en.wikipedia.org/wiki/List_of_best-selling_game_consoles"
  },
  "2024-04-21": {
    "num": 57,
    "category": "NBA teams with the most championship titles",
    "answers": [{
      "text": ["Boston Celtics", "Los Angeles Lakers"],
      "stat": "17 titles"
    }, {
      "text": ["Golden State Warriors"],
      "stat": "7 titles"
    }, {
      "text": ["Chicago Bulls"],
      "stat": "6 titles"
    }, {
      "text": ["San Antonio Spurs"],
      "stat": "5 titles"
    }, {
      "text": ["Philadelphia 76ers", "Detroit Pistons", "Miami Heat"],
      "stat": "3 titles"
    }],
    "optionsKey": "nba_teams",
    "url": "https://en.wikipedia.org/wiki/List_of_NBA_champions#Results_by_team"
  },
  "2024-04-22": {
    "num": 58,
    "category": "Most populous cities in the United States",
    "answers": [{
      "text": ["New York City"],
      "stat": "8,335,897"
    }, {
      "text": ["Los Angeles"],
      "stat": "3,822,238"
    }, {
      "text": ["Chicago"],
      "stat": "2,665,039"
    }, {
      "text": ["Houston"],
      "stat": "2,302,878"
    }, {
      "text": ["Phoenix"],
      "stat": "1,644,409"
    }],
    "optionsKey": "us_cities",
    "url": "https://worldpopulationreview.com/us-cities"
  },
  "2024-04-23": {
    "num": 59,
    "category": "Countries with the highest elevation point",
    "answers": [{
      "text": ["Nepal", "China"],
      "stat": "8849 meters"
    }, {
      "text": ["Pakistan"],
      "stat": "8611 meters"
    }, {
      "text": ["India"],
      "stat": "8586 meters"
    }, {
      "text": ["Bhutan"],
      "stat": "7570 meters"
    }, {
      "text": ["Tajikistan"],
      "stat": "7495 meters"
    }],
    "optionsKey": "countries",
    "url": "https://en.wikipedia.org/wiki/List_of_elevation_extremes_by_country#Table"
  },
  "2024-04-24": {
    "num": 60,
    "category": "States with the most McDonald's restaurants",
    "answers": [{
      "text": ["California"],
      "stat": "1,221"
    }, {
      "text": ["Texas"],
      "stat": "1,165"
    }, {
      "text": ["Florida"],
      "stat": "870"
    }, {
      "text": ["Illinois"],
      "stat": "641"
    }, {
      "text": ["Ohio"],
      "stat": "611"
    }],
    "optionsKey": "us_states",
    "url": "https://www.scrapehero.com/location-reports/McDonalds-USA/"
  },
  "2024-04-25": {
    "num": 61,
    "category": "Best selling energy drink brands in the US (2023)",
    "answers": [{
      "text": ["Red Bull"],
      "stat": "$7.39 billion"
    }, {
      "text": ["Monster"],
      "stat": "$5.46 billion"
    }, {
      "text": ["Celsius"],
      "stat": "$1.02 billion"
    }, {
      "text": ["Bang"],
      "stat": "$846 million"
    }, {
      "text": ["Rockstar"],
      "stat": "$739 million"
    }],
    "optionsKey": "energy_drinks",
    "url": "https://www.caffeineinformer.com/the-15-top-energy-drink-brands"
  },
  "2024-04-26": {
    "num": 62,
    "category": "NFL teams with the most Super Bowl wins",
    "answers": [{
      "text": ["Pittsburgh Steelers", "New England Patriots"],
      "stat": "6 wins"
    }, {
      "text": ["San Francisco 49ers", "Dallas Cowboys"],
      "stat": "5 wins"
    }, {
      "text": ["Green Bay Packers", "New York Giants", "Kansas City Chiefs"],
      "stat": "4 wins"
    }, {
      "text": ["Washington Commanders", "Denver Broncos", "Las Vegas Raiders"],
      "stat": "3 wins"
    }, {
      "text": ["Indianapolis Colts", "Los Angeles Rams", "Baltimore Ravens", "Miami Dolphins", "Tampa Bay Buccaneers"],
      "stat": "2 wins"
    }],
    "optionsKey": "nfl_teams",
    "url": "https://www.statista.com/statistics/266516/number-of-super-bowl-wins-by-nfl-team/"
  },
  "2024-04-27": {
    "num": 63,
    "category": "Pixar movies ranked by Rotten Tomatoes 'Tomatometer' score (critics)",
    "answers": [{
      "text": ["Toy Story", "Toy Story 2"],
      "stat": "100%"
    }, {
      "text": ["Finding Nemo"],
      "stat": "99%"
    }, {
      "text": ["Inside Out", "Toy Story 3", "Up"],
      "stat": "98%"
    }, {
      "text": ["Toy Story 4", "Coco", "The Incredibles"],
      "stat": "97%"
    }, {
      "text": ["Ratatouille", "Monsters, Inc."],
      "stat": "96%"
    }],
    "optionsKey": "pixar_movies",
    "url": "https://editorial.rottentomatoes.com/guide/all-pixar-movies-ranked/"
  },
  "2024-04-28": {
    "num": 64,
    "category": "Countries with highest GDP (PPP)",
    "answers": [{
      "text": ["China"],
      "stat": "35,291,015 million International$"
    }, {
      "text": ["United States of America"],
      "stat": "28,781,083 million International$"
    }, {
      "text": ["India"],
      "stat": "14,594,460 million International$"
    }, {
      "text": ["Japan"],
      "stat": "6,720,962 million International$"
    }, {
      "text": ["Germany"],
      "stat": "5,686,531 million International$"
    }],
    "optionsKey": "countries",
    "url": "https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(PPP)"
  },
  "2024-04-29": {
    "num": 65,
    "category": "Most common passwords in 2023",
    "answers": [{
      "text": ["123456"],
      "stat": "4,524,867 users"
    }, {
      "text": ["admin"],
      "stat": "4,008,850 users"
    }, {
      "text": ["12345678"],
      "stat": "1,371,152 users"
    }, {
      "text": ["123456789"],
      "stat": "1,213,047 users"
    }, {
      "text": ["1234"],
      "stat": "969,811 users"
    }],
    "optionsKey": "passwords",
    "url": "https://nordpass.com/most-common-passwords-list/"
  },
  "2024-04-30": {
    "num": 66,
    "category": "Highest grossing media franchises",
    "answers": [{
      "text": ["Pokemon"],
      "stat": "$88 billion"
    }, {
      "text": ["Mickey Mouse & Friends"],
      "stat": "$52.2 billion"
    }, {
      "text": ["Winnie the Pooh"],
      "stat": "$48.5 billion"
    }, {
      "text": ["Star Wars"],
      "stat": "$46.7 billion"
    }, {
      "text": ["Disney Princess"],
      "stat": "$45.4 billion"
    }],
    "optionsKey": "media_franchises",
    "url": "https://en.wikipedia.org/wiki/List_of_highest-grossing_media_franchises"
  },
  "2024-05-01": {
    "num": 67,
    "category": "Countries with the most Michelin-starred restaurants",
    "answers": [{
      "text": ["France"],
      "stat": "625"
    }, {
      "text": ["Japan"],
      "stat": "414"
    }, {
      "text": ["Italy"],
      "stat": "380"
    }, {
      "text": ["Germany"],
      "stat": "328"
    }, {
      "text": ["Spain"],
      "stat": "248"
    }],
    "optionsKey": "countries",
    "url": "https://www.statista.com/statistics/1400971/countries-most-michelin-starred-restaurants-worldwide/"
  },
  "2024-05-02": {
    "num": 68,
    "category": "Cities with the longest metro systems (in total miles)",
    "answers": [{
      "text": ["Beijing"],
      "stat": "507 miles"
    }, {
      "text": ["Shanghai"],
      "stat": "495 miles"
    }, {
      "text": ["Guangzhou"],
      "stat": "403 miles"
    }, {
      "text": ["Seoul"],
      "stat": "350 miles"
    }, {
      "text": ["Chengdu"],
      "stat": "349 miles"
    }],
    "optionsKey": "cities",
    "url": "https://en.wikipedia.org/wiki/List_of_metro_systems"
  },
  "2024-05-03": {
    "num": 69,
    "category": "New York City boroughs ranked by population",
    "answers": [{
      "text": ["Brooklyn"],
      "stat": "2,736,074"
    }, {
      "text": ["Queens"],
      "stat": "2,405,464"
    }, {
      "text": ["Manhattan"],
      "stat": "1,694,251"
    }, {
      "text": ["The Bronx"],
      "stat": "1,472,654"
    }, {
      "text": ["Staten Island"],
      "stat": "495,747"
    }],
    "optionsKey": "nyc_boroughs",
    "url": "https://en.wikipedia.org/wiki/Boroughs_of_New_York_City"
  },
  "2024-05-04": {
    "num": 70,
    "category": "Lord of the Rings characters ranked by mentions in the LOTR trilogy (excluding appendices)",
    "answers": [{
      "text": ["Frodo Baggins"],
      "stat": "1983"
    }, {
      "text": ["Gandalf"],
      "stat": "1168"
    }, {
      "text": ["Aragorn"],
      "stat": "952"
    }, {
      "text": ["Peregrin Took (Perry)"],
      "stat": "734"
    }, {
      "text": ["Samwise Gamgee"],
      "stat": "714"
    }],
    "optionsKey": "lotr_characters",
    "url": "https://www.vox.com/2014/12/17/7393641/hobbit-charts-lotr-tolkien"
  },
  "2024-05-05": {
    "num": 71,
    "category": "States admitted to the United States most recently",
    "answers": [{
      "text": ["Hawaii"],
      "stat": "August 21, 1959"
    }, {
      "text": ["Alaska"],
      "stat": "January 3, 1959"
    }, {
      "text": ["Arizona"],
      "stat": "February 14, 1912"
    }, {
      "text": ["New Mexico"],
      "stat": "January 6, 1912"
    }, {
      "text": ["Oklahoma"],
      "stat": "November 16, 1907"
    }],
    "optionsKey": "us_states",
    "url": "https://en.wikipedia.org/wiki/List_of_U.S._states_by_date_of_admission_to_the_Union"
  },
  "2024-05-06": {
    "num": 72,
    "category": "Countries with the most UNESCO World Heritage Sites",
    "answers": [{
      "text": ["Italy"],
      "stat": "59 sites"
    }, {
      "text": ["China"],
      "stat": "57 sites"
    }, {
      "text": ["France", "Germany"],
      "stat": "52 sites"
    }, {
      "text": ["Spain"],
      "stat": "50 sites"
    }, {
      "text": ["India"],
      "stat": "42 sites"
    }],
    "optionsKey": "countries",
    "url": "https://en.wikipedia.org/wiki/World_Heritage_Sites_by_country"
  },
  "2024-05-07": {
    "num": 73,
    "category": "Rappers with the most Grammy Awards",
    "answers": [{
      "text": ["Jay-Z", "Kanye West"],
      "stat": "24"
    }, {
      "text": ["Kendrick Lamar"],
      "stat": "17"
    }, {
      "text": ["Eminem"],
      "stat": "15"
    }, {
      "text": ["Pharrell Williams"],
      "stat": "13"
    }, {
      "text": ["André 3000"],
      "stat": "9"
    }],
    "optionsKey": "rappers",
    "url": "https://en.wikipedia.org/wiki/Grammy_Award_milestones"
  },
  "2024-05-08": {
    "num": 74,
    "category": "States that have produced the most NHL hockey players",
    "answers": [{
      "text": ["Minnesota"],
      "stat": "290"
    }, {
      "text": ["Massachusetts"],
      "stat": "210"
    }, {
      "text": ["Michigan"],
      "stat": "189"
    }, {
      "text": ["New York"],
      "stat": "134"
    }, {
      "text": ["Illinois"],
      "stat": "74"
    }],
    "optionsKey": "us_states",
    "url": "https://usblog.betway.com/the-states-producing-the-most-athletes-betway-insider-usa/"
  },
  "2024-05-09": {
    "num": 75,
    "category": "Largest grocery stores by market share",
    "answers": [{
      "text": ["Walmart"],
      "stat": "25.2%"
    }, {
      "text": ["Costco"],
      "stat": "7.1%"
    }, {
      "text": ["Kroger"],
      "stat": "5.6%"
    }, {
      "text": ["Sam's Club"],
      "stat": "4.7%"
    }, {
      "text": ["Publix"],
      "stat": "4.4%"
    }],
    "optionsKey": "grocery_stores",
    "url": "https://www.axios.com/2023/04/20/most-popular-grocery-stores"
  },
  "2024-05-10": {
    "num": 76,
    "category": "Countries with the longest coastlines",
    "answers": [{
      "text": ["Canada"],
      "stat": "202,080 kilometers"
    }, {
      "text": ["Norway"],
      "stat": "83,281 kilometers"
    }, {
      "text": ["Indonesia"],
      "stat": "54,716 kilometers"
    }, {
      "text": ["Greenland"],
      "stat": "44,087 kilometers"
    }, {
      "text": ["Russia"],
      "stat": "37,653 kilometers"
    }],
    "optionsKey": "countries",
    "url": "https://en.wikipedia.org/wiki/List_of_countries_by_length_of_coastline"
  },
  "2024-05-11": {
    "num": 77,
    "category": "Star Wars movies ranked by Rotten Tomatoes 'Tomatometer' score (critics)",
    "answers": [{
      "text": ["Star Wars: Episode V - The Empire Strikes Back (1980)"],
      "stat": "95%"
    }, {
      "text": ["Star Wars: Episode IV - A New Hope (1977)", "Star Wars: The Force Awakens (2015)"],
      "stat": "93%"
    }, {
      "text": ["Star Wars: The Last Jedi (2017)"],
      "stat": "91%"
    }, {
      "text": ["Rogue One: A Star Wars Story (2016)"],
      "stat": "84%"
    }, {
      "text": ["Star Wars: Episode VI - Return of the Jedi (1983)"],
      "stat": "83%"
    }],
    "optionsKey": "star_wars_movies",
    "url": "https://editorial.rottentomatoes.com/guide/all-star-wars-movies-ranked/"
  },
  "2024-05-12": {
    "num": 78,
    "category": "Longest Academy Award Best Picture winning films of all time (runtime)",
    "answers": [{
      "text": ["Gone with the Wind (1939)"],
      "stat": "238 minutes"
    }, {
      "text": ["Lawrence of Arabia (1962)"],
      "stat": "228 minutes"
    }, {
      "text": ["Ben-Hur (1959)"],
      "stat": "222 minutes"
    }, {
      "text": ["The Godfather Part II (1974)"],
      "stat": "202 minutes"
    }, {
      "text": ["The Lord of the Rings: The Return of the King (2003)"],
      "stat": "201 minutes"
    }],
    "optionsKey": "best_picture_winners",
    "url": "https://collider.com/longest-best-picture-winners-of-all-time/"
  },
  "2024-05-13": {
    "num": 79,
    "category": "Countries with the most Formula 1 Grand Prix wins",
    "answers": [{
      "text": ["United Kingdom"],
      "stat": "309 wins"
    }, {
      "text": ["Germany"],
      "stat": "179 wins"
    }, {
      "text": ["Brazil"],
      "stat": "101 wins"
    }, {
      "text": ["France"],
      "stat": "81 wins"
    }, {
      "text": ["Netherlands"],
      "stat": "58 wins"
    }],
    "optionsKey": "countries",
    "url": "https://en.wikipedia.org/wiki/List_of_Formula_One_Grand_Prix_wins_by_country"
  },
  "2024-05-14": {
    "num": 80,
    "category": "Best selling artists of all time by total certified units",
    "answers": [{
      "text": ["The Beatles"],
      "stat": "294 million"
    }, {
      "text": ["Michael Jackson"],
      "stat": "289.3 million"
    }, {
      "text": ["Elvis Presley"],
      "stat": "234.3 million"
    }, {
      "text": ["Elton John"],
      "stat": "213.1 million"
    }, {
      "text": ["Queen"],
      "stat": "186.8 million"
    }],
    "optionsKey": "musical_artists",
    "url": "https://en.wikipedia.org/wiki/List_of_best-selling_music_artists#Artists_by_reputed_sales"
  },
  "2024-05-15": {
    "num": 81,
    "category": "Book series by copies sold",
    "answers": [{
      "text": ["Harry Potter"],
      "stat": "600 million"
    }, {
      "text": ["Goosebumps"],
      "stat": "400 million"
    }, {
      "text": ["Perry Mason"],
      "stat": "300 million"
    }, {
      "text": ["Diary of a Wimpy Kid"],
      "stat": "275 million"
    }, {
      "text": ["Berenstain Bears"],
      "stat": "260 million"
    }],
    "optionsKey": "book_series",
    "url": "https://en.wikipedia.org/wiki/List_of_best-selling_books#List_of_best-selling_book_series"
  },
  "2024-05-16": {
    "num": 82,
    "category": "Oldest U.S. presidents at time of inauguration",
    "answers": [{
      "text": ["Joe Biden"],
      "stat": "78 years, 61 days"
    }, {
      "text": ["Donald Trump"],
      "stat": "70 years, 220 days"
    }, {
      "text": ["Ronald Reagan"],
      "stat": "69 years, 349 days"
    }, {
      "text": ["William Henry Harrison"],
      "stat": "68 years, 23 days"
    }, {
      "text": ["James Buchanan"],
      "stat": "65 years, 315 days"
    }],
    "optionsKey": "us_presidents",
    "url": "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States_by_age"
  },
  "2024-05-17": {
    "num": 83,
    "category": "Football clubs with the most UEFA Champions League titles",
    "answers": [{
      "text": ["Real Madrid"],
      "stat": "14 titles"
    }, {
      "text": ["AC Milan"],
      "stat": "7 titles"
    }, {
      "text": ["Liverpool", "Bayern Munich"],
      "stat": "6 titles"
    }, {
      "text": ["Barcelona"],
      "stat": "5 titles"
    }, {
      "text": ["Ajax"],
      "stat": "4 titles"
    }],
    "optionsKey": "football_clubs",
    "url": "https://en.wikipedia.org/wiki/European_Cup_and_UEFA_Champions_League_records_and_statistics"
  },
  "2024-05-18": {
    "num": 84,
    "category": "TV shows with most Emmy award wins of all time",
    "answers": [{
      "text": ["Saturday Night Live"],
      "stat": "84 wins"
    }, {
      "text": ["Game of Thrones"],
      "stat": "59 wins"
    }, {
      "text": ["Frasier", "The Simpsons"],
      "stat": "37 wins"
    }, {
      "text": ["RuPaul's Drag Race", "The Mary Tyler Moore Show"],
      "stat": "29 wins"
    }, {
      "text": ["Last Week Tonight With John Oliver", "Cheers"],
      "stat": "28 wins"
    }],
    "optionsKey": "emmy_tv_shows",
    "url": "https://www.statista.com/statistics/726527/emmys-most-wins-all-time/"
  },
  "2024-05-19": {
    "num": 85,
    "category": "Countries with the most billionaires",
    "answers": [{
      "text": ["United States of America"],
      "stat": "813"
    }, {
      "text": ["China"],
      "stat": "406"
    }, {
      "text": ["India"],
      "stat": "200"
    }, {
      "text": ["Germany"],
      "stat": "132"
    }, {
      "text": ["Russia"],
      "stat": "120"
    }],
    "optionsKey": "countries",
    "url": "https://www.forbes.com/sites/devinseanmartin/2024/04/02/the-countries-with-the-most-billionaires-2024/"
  },
  "2024-05-20": {
    "num": 86,
    "category": "Most common Pokémon types (excl. combined types)",
    "answers": [{
      "text": ["Water"],
      "stat": "159 species"
    }, {
      "text": ["Normal"],
      "stat": "133 species"
    }, {
      "text": ["Grass"],
      "stat": "130 species"
    }, {
      "text": ["Flying"],
      "stat": "112 species"
    }, {
      "text": ["Psychic"],
      "stat": "109 species"
    }],
    "optionsKey": "pokemon_types",
    "url": "https://www.cbr.com/every-pokemon-type-ranked-by-total-number-of-pokemon/"
  },
  "2024-05-21": {
    "num": 87,
    "category": "Universities with the largest football stadiums (by capacity)",
    "answers": [{
      "text": ["Michigan Stadium (University of Michigan)"],
      "stat": "107,601"
    }, {
      "text": ["Beaver Stadium (Penn State University)"],
      "stat": "106,572"
    }, {
      "text": ["Ohio Stadium (Ohio State University)"],
      "stat": "102,780"
    }, {
      "text": ["Kyle Field (Texas A&M University)"],
      "stat": "102,733"
    }, {
      "text": ["Tiger Stadium (Louisiana State University)"],
      "stat": "102,321"
    }],
    "optionsKey": "university_stadiums",
    "url": "https://www.collegetransitions.com/blog/largest-college-football-stadiums/"
  },
  "2024-05-22": {
    "num": 88,
    "category": "Countries with the most Grand Slam tennis titles",
    "answers": [{
      "text": ["United States of America"],
      "stat": "351 titles"
    }, {
      "text": ["Australia"],
      "stat": "166 titles"
    }, {
      "text": ["United Kingdom"],
      "stat": "98 titles"
    }, {
      "text": ["Spain"],
      "stat": "42 titles"
    }, {
      "text": ["Germany"],
      "stat": "40 titles"
    }],
    "optionsKey": "countries",
    "url": "https://en.wikipedia.org/wiki/List_of_Grand_Slam_singles_champions_by_country#Total_Grand_Slam_titles_by_country"
  },
  "2024-05-23": {
    "num": 89,
    "category": "Largest states by area",
    "answers": [{
      "text": ["Alaska"],
      "stat": "665,384 square miles"
    }, {
      "text": ["Texas"],
      "stat": "268,596 square miles"
    }, {
      "text": ["California"],
      "stat": "163,695 square miles"
    }, {
      "text": ["Montana"],
      "stat": "147,040 square miles"
    }, {
      "text": ["New Mexico"],
      "stat": "121,590 square miles"
    }],
    "optionsKey": "us_states",
    "url": "https://en.wikipedia.org/wiki/List_of_U.S._states_and_territories_by_area"
  },
  "2024-05-24": {
    "num": 90,
    "category": "Largest Swiss watch brands by market share",
    "answers": [{
      "text": ["Rolex"],
      "stat": "30%"
    }, {
      "text": ["Cartier"],
      "stat": "8%"
    }, {
      "text": ["Omega"],
      "stat": "7%"
    }, {
      "text": ["Patek Philippe"],
      "stat": "6%"
    }, {
      "text": ["Audemars Piguet"],
      "stat": "5%"
    }],
    "optionsKey": "swiss_watch_brands",
    "url": "https://monochrome-watches.com/industry-news-top-50-swiss-watch-companies-of-2023-according-to-morgan-stanley-rolex-breaking-the-chf-10-billion-barrier/"
  },
  "2024-05-25": {
    "num": 91,
    "category": "Countries with the most wild tigers",
    "answers": [{
      "text": ["India"],
      "stat": "2,967"
    }, {
      "text": ["Russia"],
      "stat": "433"
    }, {
      "text": ["Indonesia"],
      "stat": "371"
    }, {
      "text": ["Nepal"],
      "stat": "355"
    }, {
      "text": ["Thailand"],
      "stat": "148-149"
    }],
    "optionsKey": "countries",
    "url": "https://www.worldatlas.com/conservation/countries-with-the-greatest-number-of-wild-tigers.html"
  },
  "2024-05-26": {
    "num": 92,
    "category": "Largest burger chains in the US by locations",
    "answers": [{
      "text": ["McDonald's"],
      "stat": "13,846 locations"
    }, {
      "text": ["Burger King"],
      "stat": "7,346 locations"
    }, {
      "text": ["Wendy's"],
      "stat": "5,852 locations"
    }, {
      "text": ["Sonic Drive-In"],
      "stat": "3,526 locations"
    }, {
      "text": ["Jack In The Box"],
      "stat": "2,243 locations"
    }],
    "optionsKey": "burger_chains",
    "url": "https://www.restaurantbusinessonline.com/financing/largest-burger-chains-us"
  },
  "2024-05-27": {
    "num": 93,
    "category": "Harry Potter movies ranked by Rotten Tomatoes 'Tomatometer' score (critics)",
    "answers": [{
      "text": ["Harry Potter and the Deathly Hallows – Part 2"],
      "stat": "96%"
    }, {
      "text": ["Harry Potter and the Prisoner of Azkaban"],
      "stat": "90%"
    }, {
      "text": ["Harry Potter and the Goblet of Fire"],
      "stat": "88%"
    }, {
      "text": ["Harry Potter and the Half-Blood Prince"],
      "stat": "84%"
    }, {
      "text": ["Harry Potter and the Chamber of Secrets"],
      "stat": "82%"
    }],
    "optionsKey": "harry_potter_movies",
    "url": "https://editorial.rottentomatoes.com/guide/all-harry-potter-movies-ranked-by-tomatometer/"
  },
  "2024-05-28": {
    "num": 94,
    "category": "US states with the most national parks",
    "answers": [{
      "text": ["California"],
      "stat": "9 parks"
    }, {
      "text": ["Alaska"],
      "stat": "8 parks"
    }, {
      "text": ["Utah"],
      "stat": "5 parks"
    }, {
      "text": ["Colorado"],
      "stat": "4 parks"
    }, {
      "text": ["Arizona", "Florida", "Washington"],
      "stat": "3 parks"
    }],
    "optionsKey": "us_states",
    "url": "https://www.nps.gov/aboutus/national-park-system.htm"
  },
  "2024-05-29": {
    "num": 95,
    "category": "Longest-running Broadway shows",
    "answers": [{
      "text": ["The Phantom of the Opera"],
      "stat": "13,981 performances"
    }, {
      "text": ["Chicago (Revival)"],
      "stat": "10,801 performances"
    }, {
      "text": ["The Lion King"],
      "stat": "10,421 performances"
    }, {
      "text": ["Wicked"],
      "stat": "7,960 performances"
    }, {
      "text": ["Cats"],
      "stat": "7,485 performances"
    }],
    "optionsKey": "broadway_musicals",
    "url": "https://en.wikipedia.org/wiki/List_of_the_longest-running_Broadway_shows"
  },
  "2024-05-30": {
    "num": 96,
    "category": "Richest movie directors by estimated net worth",
    "answers": [{
      "text": ["George Lucas", "Steven Spielberg"],
      "stat": "$8 billion"
    }, {
      "text": ["Peter Jackson"],
      "stat": "$1.5 billion"
    }, {
      "text": ["Tyler Perry"],
      "stat": "$850 million"
    }, {
      "text": ["James Cameron"],
      "stat": "$800 million"
    }, {
      "text": ["Michael Bay"],
      "stat": "$450 million"
    }],
    "optionsKey": "directors",
    "url": "https://www.celebritynetworth.com/list/top-50-directors/"
  },
  "2024-05-31": {
    "num": 97,
    "category": "Countries with highest cocoa bean production",
    "answers": [{
      "text": ["Côte d'Ivoire"],
      "stat": "2,230,000 metric tons"
    }, {
      "text": ["Ghana"],
      "stat": "1,108,663 metric tons"
    }, {
      "text": ["Indonesia"],
      "stat": "667,296 metric tons"
    }, {
      "text": ["Ecuador"],
      "stat": "337,149 metric tons"
    }, {
      "text": ["Cameroon"],
      "stat": "300,000 metric tons"
    }],
    "optionsKey": "countries",
    "url": "https://worldpopulationreview.com/country-rankings/cocoa-producing-countries"
  },
  "2024-06-01": {
    "num": 98,
    "category": "Nations with the most Fifa World Cup titles",
    "answers": [{
      "text": ["Brazil"],
      "stat": "5 titles"
    }, {
      "text": ["Germany", "Italy"],
      "stat": "4 titles"
    }, {
      "text": ["Argentina"],
      "stat": "3 titles"
    }, {
      "text": ["Uruguay", "France"],
      "stat": "2 titles"
    }, {
      "text": ["England", "Spain"],
      "stat": "1 title"
    }],
    "optionsKey": "nations",
    "url": "https://www.statista.com/statistics/266464/number-of-world-cup-titles-won-by-country-since-1930/"
  },
  "2024-06-02": {
    "num": 99,
    "category": "Most valuable NBA teams",
    "answers": [{
      "text": ["Golden State Warriors"],
      "stat": "$7.7 billion"
    }, {
      "text": ["New York Knicks"],
      "stat": "$6.6 billion"
    }, {
      "text": ["Los Angeles Lakers"],
      "stat": "$6.4 billion"
    }, {
      "text": ["Boston Celtics"],
      "stat": "$4.7 billion"
    }, {
      "text": ["Los Angeles Clippers"],
      "stat": "$4.65 billion"
    }],
    "optionsKey": "nba_teams",
    "url": "https://en.wikipedia.org/wiki/Forbes_list_of_the_most_valuable_NBA_clubs"
  },
  "2024-06-03": {
    "num": 100,
    "category": "Longest rivers in the world",
    "answers": [{
      "text": ["Nile River"],
      "stat": "4,130 miles"
    }, {
      "text": ["Amazon River"],
      "stat": "3,976 miles"
    }, {
      "text": ["Yangtze River"],
      "stat": "3,917 miles"
    }, {
      "text": ["Mississippi–Missouri River"],
      "stat": "3,902 miles"
    }, {
      "text": ["Yenisey River"],
      "stat": "3,445 miles"
    }],
    "optionsKey": "rivers",
    "url": "https://en.wikipedia.org/wiki/List_of_river_systems_by_length"
  },
  "2024-06-04": {
    "num": 101,
    "category": "States with highest percentage of Marijuana users (have used in past year)",
    "answers": [{
      "text": ["Vermont"],
      "stat": "34.4%"
    }, {
      "text": ["Oregon"],
      "stat": "32.8%"
    }, {
      "text": ["Alaska"],
      "stat": "32.5%"
    }, {
      "text": ["Washington"],
      "stat": "30.7%"
    }, {
      "text": ["Massachusetts"],
      "stat": "29.7%"
    }],
    "optionsKey": "us_states",
    "url": "https://www.statista.com/statistics/723822/cannabis-use-within-one-year-us-adults/"
  },
  "2024-06-05": {
    "num": 102,
    "category": "Most popular smart phone apps (by downloads in 2023)",
    "answers": [{
      "text": ["Instagram"],
      "stat": "696 million"
    }, {
      "text": ["TikTok"],
      "stat": "654 million"
    }, {
      "text": ["Facebook"],
      "stat": "553 million"
    }, {
      "text": ["WhatsApp"],
      "stat": "475 million"
    }, {
      "text": ["CapCut"],
      "stat": "389 million"
    }],
    "optionsKey": "smartphone_apps",
    "url": "https://www.businessofapps.com/data/most-popular-apps/"
  },
  "2024-06-06": {
    "num": 103,
    "category": "US states with the highest cost of living",
    "answers": [{
      "text": ["Hawaii"],
      "stat": "180.3"
    }, {
      "text": ["Massachusetts"],
      "stat": "146.5"
    }, {
      "text": ["California"],
      "stat": "138.5"
    }, {
      "text": ["New York"],
      "stat": "125.9"
    }, {
      "text": ["Alaska"],
      "stat": "125.2"
    }],
    "optionsKey": "us_states",
    "url": "https://meric.mo.gov/data/cost-living-data-series"
  },
  "2024-06-07": {
    "num": 104,
    "category": "Largest bones in the human body (by average length)",
    "answers": [{
      "text": ["Femur"],
      "stat": "19.9 inches"
    }, {
      "text": ["Tibia"],
      "stat": "16.9 inches"
    }, {
      "text": ["Fibula"],
      "stat": "15.9 inches"
    }, {
      "text": ["Humerus"],
      "stat": "14.4 inches"
    }, {
      "text": ["Ulna"],
      "stat": "11.1 inches"
    }],
    "optionsKey": "bones",
    "url": "https://www.orthobullets.com/anatomy/10001/bones-of-the-human-body"
  },
  "2024-06-08": {
    "num": 105,
    "category": "Video streaming services with the most subscribers",
    "answers": [{
      "text": ["Netflix"],
      "stat": "247.2 million"
    }, {
      "text": ["Amazon Prime Video"],
      "stat": "200 million"
    }, {
      "text": ["Disney+"],
      "stat": "150.2 million"
    }, {
      "text": ["Max"],
      "stat": "95.1 million"
    }, {
      "text": ["Paramount+"],
      "stat": "63.4 million"
    }],
    "optionsKey": "streaming_services",
    "url": "https://www.forbes.com/home-improvement/internet/streaming-stats/#"
  },
  "2024-06-09": {
    "num": 106,
    "category": "NHL teams with the most Stanley Cup wins",
    "answers": [{
      "text": ["Montreal Canadiens"],
      "stat": "24 wins"
    }, {
      "text": ["Toronto Maple Leafs"],
      "stat": "13 wins"
    }, {
      "text": ["Detroit Red Wings"],
      "stat": "11 wins"
    }, {
      "text": ["Boston Bruins", "Chicago Blackhawks"],
      "stat": "6 wins"
    }, {
      "text": ["Edmonton Oilers", "Pittsburgh Penguins"],
      "stat": "5 wins"
    }],
    "optionsKey": "nhl_teams",
    "url": "https://en.wikipedia.org/wiki/List_of_Stanley_Cup_champions#Stanley_Cup_Finals_era_(since_1915)"
  },
  "2024-06-10": {
    "num": 107,
    "category": "Countries with the most islands",
    "answers": [{
      "text": ["Sweden"],
      "stat": "267,570 islands"
    }, {
      "text": ["Norway"],
      "stat": "239,057 islands"
    }, {
      "text": ["Finland"],
      "stat": "179,947 islands"
    }, {
      "text": ["Canada"],
      "stat": "52,455 islands"
    }, {
      "text": ["United States of America"],
      "stat": "18,617 islands"
    }],
    "optionsKey": "countries",
    "url": "https://www.statista.com/chart/15364/the-estimated-number-of-islands-by-country/"
  },
  "2024-06-11": {
    "num": 108,
    "category": "Most visited national parks in the United States (2023)",
    "answers": [{
      "text": ["Great Smoky Mountains"],
      "stat": "13.3 million visitors"
    }, {
      "text": ["Grand Canyon"],
      "stat": "4.7 million visitors"
    }, {
      "text": ["Zion"],
      "stat": "4.6 million visitors"
    }, {
      "text": ["Yellowstone"],
      "stat": "4.5 million visitors"
    }, {
      "text": ["Rocky Mountain"],
      "stat": "4.1 million visitors"
    }],
    "optionsKey": "national_parks",
    "url": "https://irma.nps.gov/Stats/SSRSReports/National%20Reports/Annual%20Park%20Ranking%20Report%20(1979%20-%20Last%20Calendar%20Year)"
  },
  "2024-06-12": {
    "num": 109,
    "category": "Marvel Cinematic Universe movies ranked by Rotten Tomatoes 'Tomatometer' score (critics)",
    "answers": [{
      "text": ["Black Panther"],
      "stat": "96%"
    }, {
      "text": ["Avengers: Endgame", "Iron Man"],
      "stat": "94%"
    }, {
      "text": ["Thor: Ragnarok", "Spider-Man: No Way Home"],
      "stat": "93%"
    }, {
      "text": ["Spider-Man: Homecoming", "Guardians of the Galaxy"],
      "stat": "92%"
    }, {
      "text": ["Shang-Chi and the Legend of the Ten Rings", "The Avengers", "Spider-Man: Far From Home"],
      "stat": "91%"
    }],
    "optionsKey": "marvel_movies",
    "url": "https://editorial.rottentomatoes.com/guide/all-marvel-cinematic-universe-movies-ranked/"
  },
  "2024-06-13": {
    "num": 110,
    "category": "Largest retail companies by market capitalization",
    "answers": [{
      "text": ["Amazon"],
      "stat": "$1.948 trillion"
    }, {
      "text": ["Walmart"],
      "stat": "$535.4 billion"
    }, {
      "text": ["Costco"],
      "stat": "$376.67 billion"
    }, {
      "text": ["Home Depot"],
      "stat": "$343 billion"
    }, {
      "text": ["Alibaba"],
      "stat": "$192.11 billion"
    }],
    "optionsKey": "retail_companies",
    "url": "https://companiesmarketcap.com/retail/largest-retail-companies-by-market-cap/"
  },
  "2024-06-14": {
    "num": 111,
    "category": "NBA players with the most MVPs",
    "answers": [{
      "text": ["Kareem Abdul-Jabbar"],
      "stat": "6"
    }, {
      "text": ["Michael Jordan", "Bill Russell"],
      "stat": "5"
    }, {
      "text": ["Wilt Chamberlain", "LeBron James"],
      "stat": "4"
    }, {
      "text": ["Magic Johnson", "Larry Bird", "Moses Malone", "Nikola Jokić"],
      "stat": "3"
    }, {
      "text": ["Giannis Antetokounmpo", "Stephen Curry", "Tim Duncan", "Karl Malone", "Steve Nash", "Bob Pettit"],
      "stat": "2"
    }],
    "optionsKey": "nba_players",
    "url": "https://en.wikipedia.org/wiki/NBA_Most_Valuable_Player_Award#Multiple-time_winners"
  },
  "2024-06-15": {
    "num": 112,
    "category": "Most popular google searches of 2023",
    "answers": [{
      "text": ["you"],
      "stat": "Query score of 100"
    }, {
      "text": ["weather"],
      "stat": "Query score of 61"
    }, {
      "text": ["google"],
      "stat": "Query score of 51"
    }, {
      "text": ["amazon", "youtube"],
      "stat": "Query score of 37"
    }, {
      "text": ["news"],
      "stat": "Query score of 31"
    }],
    "optionsKey": "2023_google_searches",
    "url": "https://www.techopedia.com/top-google-searches-2023"
  },
  "2024-06-16": {
    "num": 113,
    "category": "Countries with fastest broadband internet speed (Speedtest Global Index, 4/2024)",
    "answers": [{
      "text": ["Singapore"],
      "stat": "284 Mbps"
    }, {
      "text": ["Hong Kong"],
      "stat": "271 Mbps"
    }, {
      "text": ["Chile"],
      "stat": "270 Mbps"
    }, {
      "text": ["United Arab Emirates"],
      "stat": "266 Mbps"
    }, {
      "text": ["Iceland"],
      "stat": "253 Mbps"
    }],
    "optionsKey": "countries",
    "url": "https://www.speedtest.net/global-index"
  },
  "2024-06-17": {
    "num": 114,
    "category": "Wealthiest generations in the United States (by avg net worth)",
    "answers": [{
      "text": ["Baby Boomers (born 1946-1964)"],
      "stat": "$795,900"
    }, {
      "text": ["Silent Generation (born 1928-1945)"],
      "stat": "$734,400"
    }, {
      "text": ["Generation X (born 1965-1980)"],
      "stat": "$541,200"
    }, {
      "text": ["Millennials (born 1981-1996)"],
      "stat": "$237,800"
    }, {
      "text": ["Generation Z (born 1997-2012)"],
      "stat": "$85,300"
    }],
    "optionsKey": "generations",
    "url": "https://www.usatoday.com/money/blueprint/investing/average-net-worth-by-age/"
  },
  "2024-06-18": {
    "num": 115,
    "category": "SNL hosts with most appearances",
    "answers": [{
      "text": ["Alec Baldwin"],
      "stat": "17 times"
    }, {
      "text": ["Steve Martin"],
      "stat": "16 times"
    }, {
      "text": ["John Goodman"],
      "stat": "13 times"
    }, {
      "text": ["Buck Henry", "Tom Hanks"],
      "stat": "10 times"
    }, {
      "text": ["Chevy Chase"],
      "stat": "8 times"
    }],
    "optionsKey": "snl_hosts",
    "url": "https://en.wikipedia.org/wiki/List_of_Saturday_Night_Live_guests"
  },
  "2024-06-19": {
    "num": 116,
    "category": "Most popular classical composers (by monthly Spotify listeners)",
    "answers": [{
      "text": ["Johann Sebastian Bach"],
      "stat": "7,673,876"
    }, {
      "text": ["Ludwig van Beethoven"],
      "stat": "7,315,072"
    }, {
      "text": ["Wolfgang Amadeus Mozart"],
      "stat": "6,707,799"
    }, {
      "text": ["Frédéric Chopin"],
      "stat": "6,411,865"
    }, {
      "text": ["Antonio Vivaldi"],
      "stat": "5,811,351"
    }],
    "optionsKey": "classical_composers",
    "url": "https://www.spotifycharts.com/"
  },
  "2024-06-20": {
    "num": 117,
    "category": "Animal phylums with the most described species",
    "answers": [{
      "text": ["Arthropoda"],
      "stat": "1,257,000 species"
    }, {
      "text": ["Mollusca"],
      "stat": "85,000 species"
    }, {
      "text": ["Chordata"],
      "stat": "70,000 species"
    }, {
      "text": ["Platyhelminthes"],
      "stat": "29,500 species"
    }, {
      "text": ["Nematoda"],
      "stat": "25,000 species"
    }],
    "optionsKey": "animal_phylums",
    "url": "https://en.wikipedia.org/wiki/Animal#Numbers_and_habitats_of_major_phyla"
  },
  "2024-06-21": {
    "num": 118,
    "category": "Most watched Netflix TV titles",
    "answers": [{
      "text": ["Squid Game: Season 1"],
      "stat": "265.2 million views"
    }, {
      "text": ["Wednesday: Season 1"],
      "stat": "252.1 million views"
    }, {
      "text": ["Stranger Things 4"],
      "stat": "140.7 million views"
    }, {
      "text": ["DAHMER: Monster: The Jeffrey Dahmer Story"],
      "stat": "115.6 million views"
    }, {
      "text": ["Bridgerton: Season 1"],
      "stat": "113.3 million views"
    }],
    "optionsKey": "netflix_tv_titles",
    "url": "https://www.netflix.com/tudum/top10/most-popular/tv"
  },
  "2024-06-22": {
    "num": 119,
    "category": "Countries by olive oil production (2023-2024)",
    "answers": [{
      "text": ["Spain"],
      "stat": "766,400 tonnes"
    }, {
      "text": ["Italy"],
      "stat": "288,900 tonnes"
    }, {
      "text": ["Turkey"],
      "stat": "210,000 tonnes"
    }, {
      "text": ["Tunisia"],
      "stat": "200,000 tonnes"
    }, {
      "text": ["Greece"],
      "stat": "195,000 tonnes"
    }],
    "optionsKey": "countries",
    "url": "https://www.oliveoiltimes.com/olive-oil-production"
  },
  "2024-06-23": {
    "num": 120,
    "category": "Oldest currencies still in use",
    "answers": [{
      "text": ["British pound sterling"],
      "stat": "800 CE"
    }, {
      "text": ["Russian ruble"],
      "stat": "1200 CE"
    }, {
      "text": ["Serbian dinar"],
      "stat": "1214 CE"
    }, {
      "text": ["United States dollar"],
      "stat": "1792 CE"
    }, {
      "text": ["Haitian gourde"],
      "stat": "1813 CE"
    }],
    "optionsKey": "currencies",
    "url": "https://www.oldest.org/culture/oldest-currencies-still-used-around-the-world/"
  },
  "2024-06-24": {
    "num": 121,
    "category": "Highest grossing Dreamworks movies",
    "answers": [{
      "text": ["Shrek 2"],
      "stat": "$441,426,807"
    }, {
      "text": ["Shrek the Third"],
      "stat": "$322,719,944"
    }, {
      "text": ["Shrek"],
      "stat": "$267,851,831"
    }, {
      "text": ["Shrek Forever After"],
      "stat": "$238,736,787"
    }, {
      "text": ["How to Train Your Dragon"],
      "stat": "$217,581,231"
    }],
    "optionsKey": "dreamworks_movies",
    "url": "https://www.boxofficemojo.com/brand/bn3614636546/?sort=grossToDate&ref_=bo_bn__resort#table"
  },
  "2024-06-25": {
    "num": 122,
    "category": "Most streamed songs on Spotify",
    "answers": [{
      "text": ["Blinding Lights - The Weeknd"],
      "stat": "4.299 billion streams"
    }, {
      "text": ["Shape Of You - Ed Sheeran"],
      "stat": "3.919 billion streams"
    }, {
      "text": ["Someone You Loved - Lewis Capaldi"],
      "stat": "3.443 billion streams"
    }, {
      "text": ["Sunflower - Post Malone feat. Swae Lee"],
      "stat": "3.374 billion streams"
    }, {
      "text": ["As It Was - Harry Styles"],
      "stat": "3.331 billion streams"
    }],
    "optionsKey": "spotify_songs",
    "url": "https://en.wikipedia.org/wiki/List_of_Spotify_streaming_records#Most-streamed_songs"
  },
  "2024-06-26": {
    "num": 123,
    "category": "Countries with the most airports",
    "answers": [{
      "text": ["United States of America"],
      "stat": "13,513 airports"
    }, {
      "text": ["Brazil"],
      "stat": "4,093 airports"
    }, {
      "text": ["Mexico"],
      "stat": "1,714 airports"
    }, {
      "text": ["Canada"],
      "stat": "1,467 airports"
    }, {
      "text": ["Russia"],
      "stat": "1,218 airports"
    }],
    "optionsKey": "countries",
    "url": "https://www.worldatlas.com/articles/countries-with-the-highest-number-of-airports-in-the-world.html"
  },
  "2024-06-27": {
    "num": 124,
    "category": "Celebrities who have hosted the Oscars the most times",
    "answers": [{
      "text": ["Bob Hope"],
      "stat": "19 times"
    }, {
      "text": ["Billy Crystal"],
      "stat": "9 times"
    }, {
      "text": ["Johnny Carson"],
      "stat": "5 times"
    }, {
      "text": ["Jack Lemmon", "Whoopi Goldberg", "Jimmy Kimmel"],
      "stat": "4 times"
    }, {
      "text": ["Steve Martin", "Jerry Lewis", "David Niven", "Conrad Nagel"],
      "stat": "3 times"
    }],
    "optionsKey": "oscar_hosts",
    "url": "https://en.wikipedia.org/wiki/List_of_Academy_Awards_ceremonies"
  },
  "2024-06-28": {
    "num": 125,
    "category": "Most valuable football/soccer clubs in the world",
    "answers": [{
      "text": ["Real Madrid"],
      "stat": "$6.6 billion"
    }, {
      "text": ["Manchester United"],
      "stat": "$6.55 billion"
    }, {
      "text": ["Barcelona"],
      "stat": "$5.6 billion"
    }, {
      "text": ["Liverpool"],
      "stat": "$5.37 billion"
    }, {
      "text": ["Manchester City"],
      "stat": "$5.1 billion"
    }],
    "optionsKey": "football_clubs",
    "url": "https://www.forbes.com/lists/soccer-valuations/"
  },
  "2024-06-29": {
    "num": 126,
    "category": "Oldest universities in the United States",
    "answers": [{
      "text": ["Harvard University"],
      "stat": "c. 1636"
    }, {
      "text": ["College of William & Mary"],
      "stat": "c. 1693"
    }, {
      "text": ["St. John's College"],
      "stat": "c. 1696"
    }, {
      "text": ["Yale University"],
      "stat": "c. 1701"
    }, {
      "text": ["University of Pennsylvania"],
      "stat": "c. 1740"
    }],
    "optionsKey": "oldest_us_universities",
    "url": "https://www.topuniversities.com/blog/10-oldest-universities-us"
  },
  "2024-06-30": {
    "num": 127,
    "category": "Countries with the most nuclear weapons",
    "answers": [{
      "text": ["Russia"],
      "stat": "~5,580 warheads"
    }, {
      "text": ["United States of America"],
      "stat": "~5,044 warheads"
    }, {
      "text": ["China"],
      "stat": "~500 warheads"
    }, {
      "text": ["France"],
      "stat": "~290 warheads"
    }, {
      "text": ["United Kingdom"],
      "stat": "~225 warheads"
    }],
    "optionsKey": "countries",
    "url": "https://en.wikipedia.org/wiki/List_of_states_with_nuclear_weapons"
  },
  "2024-07-01": {
    "num": 128,
    "category": "NBA players with the most assists",
    "answers": [{
      "text": ["John Stockton"],
      "stat": "15,806 assists"
    }, {
      "text": ["Jason Kidd"],
      "stat": "12,091 assists"
    }, {
      "text": ["Chris Paul"],
      "stat": "11,894 assists"
    }, {
      "text": ["LeBron James"],
      "stat": "11,009 assists"
    }, {
      "text": ["Steve Nash"],
      "stat": "10,335 assists"
    }],
    "optionsKey": "nba_players",
    "url": "https://www.statista.com/statistics/811517/all-time-nba-leaders-total-number-of-rebounds/"
  },
  "2024-07-02": {
    "num": 129,
    "category": "Most streamed Taylor Swift songs on Spotify (not including features)",
    "answers": [{
      "text": ["Cruel Summer"],
      "stat": "2,239,434,380 streams"
    }, {
      "text": ["Blank Space"],
      "stat": "1,842,399,387 streams"
    }, {
      "text": ["Anti-Hero"],
      "stat": "1,579,623,198 streams"
    }, {
      "text": ["Lover"],
      "stat": "1,432,093,541 streams"
    }, {
      "text": ["Shake It Off"],
      "stat": "1,420,996,197 streams"
    }],
    "optionsKey": "taylor_swift_songs",
    "url": "https://kworb.net/spotify/artist/06HL4z0CvFAxyc27GXpf02_songs.html"
  },
  "2024-07-03": {
    "num": 130,
    "category": "Countries with the most Facebook users",
    "answers": [{
      "text": ["India"],
      "stat": "378.5 million users"
    }, {
      "text": ["United States of America"],
      "stat": "193.8 million users"
    }, {
      "text": ["Indonesia"],
      "stat": "119.05 million users"
    }, {
      "text": ["Brazil"],
      "stat": "112.5 million users"
    }, {
      "text": ["Mexico"],
      "stat": "92.7 million users"
    }],
    "optionsKey": "countries",
    "url": "https://www.statista.com/statistics/268136/top-15-countries-based-on-number-of-facebook-users/"
  },
  "2024-07-04": {
    "num": 131,
    "category": "Best selling Pokémon games by units sold",
    "answers": [{
      "text": ["Pokémon Red", "Pokémon Blue", "Pokémon Green"],
      "stat": "31.38 million units"
    }, {
      "text": ["Pokémon Sword", "Pokémon Shield"],
      "stat": "26.27 million units"
    }, {
      "text": ["Pokémon Violet", "Pokémon Scarlett"],
      "stat": "24.92 million units"
    }, {
      "text": ["Pokémon Gold", "Pokémon Silver"],
      "stat": "23.1 million units"
    }, {
      "text": ["Pokémon Diamond", "Pokémon Pearl"],
      "stat": "17.67 million units"
    }],
    "optionsKey": "pokemon_games",
    "url": "https://www.statista.com/statistics/1072224/pokemon-unit-sales-worldwide/"
  },
  "2024-07-05": {
    "num": 132,
    "category": "Most traffic-delayed cities in the world by hours lost in traffic",
    "answers": [{
      "text": ["New York City"],
      "stat": "101 hours"
    }, {
      "text": ["London"],
      "stat": "99 hours"
    }, {
      "text": ["Paris"],
      "stat": "97 hours"
    }, {
      "text": ["Chicago", "Mexico City"],
      "stat": "96 hours"
    }, {
      "text": ["Istanbul"],
      "stat": "91 hours"
    }],
    "optionsKey": "cities",
    "url": "https://inrix.com/scorecard/"
  },
  "2024-07-06": {
    "num": 133,
    "category": "Countries with the most different species of birds",
    "answers": [{
      "text": ["Colombia"],
      "stat": "1,863 species"
    }, {
      "text": ["Peru"],
      "stat": "1,861 species"
    }, {
      "text": ["Brazil"],
      "stat": "1,816 species"
    }, {
      "text": ["Indonesia"],
      "stat": "1,723 species"
    }, {
      "text": ["Ecuador"],
      "stat": "1,629 species"
    }],
    "optionsKey": "countries",
    "url": "https://en.wikipedia.org/wiki/Megadiverse_countries"
  },
  "2024-07-07": {
    "num": 134,
    "category": "Countries with the most skyscrapers (+150m/492ft tall)",
    "answers": [{
      "text": ["China"],
      "stat": "3,152 skyscrapers"
    }, {
      "text": ["United States of America"],
      "stat": "890 skyscrapers"
    }, {
      "text": ["United Arab Emirates"],
      "stat": "335 skyscrapers"
    }, {
      "text": ["Malaysia"],
      "stat": "295 skyscrapers"
    }, {
      "text": ["Japan"],
      "stat": "280 skyscrapers"
    }],
    "optionsKey": "countries",
    "url": "https://en.wikipedia.org/wiki/List_of_countries_with_the_most_skyscrapers"
  },
  "2024-07-08": {
    "num": 135,
    "category": "Countries with highest motor vehicle production",
    "answers": [{
      "text": ["China"],
      "stat": "30.1 million vehicles"
    }, {
      "text": ["United States of America"],
      "stat": "10.6 million vehicles"
    }, {
      "text": ["Japan"],
      "stat": "8.9 million vehicles"
    }, {
      "text": ["India"],
      "stat": "5.8 million vehicles"
    }, {
      "text": ["South Korea"],
      "stat": "4.2 million vehicles"
    }],
    "optionsKey": "countries",
    "url": "https://worldpopulationreview.com/country-rankings/car-production-by-country"
  },
  "2024-07-09": {
    "num": 136,
    "category": "Most spoken first langauges in the world",
    "answers": [{
      "text": ["Mandarin Chinese"],
      "stat": "12.3%"
    }, {
      "text": ["Spanish"],
      "stat": "6%"
    }, {
      "text": ["English", "Arabic"],
      "stat": "5.1%"
    }, {
      "text": ["Hindi"],
      "stat": "3.3%"
    }, {
      "text": ["Bengali"],
      "stat": "3%"
    }],
    "optionsKey": "languages",
    "url": "https://www.cia.gov/the-world-factbook/countries/world/#people-and-society"
  },
  "2024-07-10": {
    "num": 137,
    "category": "Most read US newspapers by average weekday print circulation",
    "answers": [{
      "text": ["The Wall Street Journal"],
      "stat": "609,650 papers"
    }, {
      "text": ["The New York Times"],
      "stat": "296,330 papers"
    }, {
      "text": ["The Washington Post", "New York Post"],
      "stat": "135,980 papers"
    }, {
      "text": ["USA Today"],
      "stat": "132,640 papers"
    }, {
      "text": ["Los Angeles Times"],
      "stat": "118,760 papers"
    }],
    "optionsKey": "us_newspapers",
    "url": "https://en.wikipedia.org/wiki/List_of_newspapers_in_the_United_States#Top_10_newspapers_by_subscribers_and_print_circulation"
  },
  "2024-07-11": {
    "num": 138,
    "category": "Countries with most CO₂ emissions",
    "answers": [{
      "text": ["China"],
      "stat": "11,396 million metric tons"
    }, {
      "text": ["United States of America"],
      "stat": "5,057 million metric tons"
    }, {
      "text": ["India"],
      "stat": "2,829 million metric tons"
    }, {
      "text": ["Russia"],
      "stat": "1,652 million metric tons"
    }, {
      "text": ["Japan"],
      "stat": "1,053 million metric tons"
    }],
    "optionsKey": "countries",
    "url": "https://ourworldindata.org/grapher/annual-co2-emissions-per-country?tab=table"
  },
  "2024-07-12": {
    "num": 139,
    "category": "Longest running animated TV franchises by episodes (excluding anime)",
    "answers": [{
      "text": ["Looney Tunes"],
      "stat": "1,626 episodes"
    }, {
      "text": ["Transformers"],
      "stat": "1,199 episodes"
    }, {
      "text": ["Mickey Mouse & Friends"],
      "stat": "1,137 episodes"
    }, {
      "text": ["The Simpsons"],
      "stat": "768 episodes"
    }, {
      "text": ["Yogi Bear & Friends"],
      "stat": "761 episodes"
    }],
    "optionsKey": "animated_franchises",
    "url": "https://en.wikipedia.org/wiki/List_of_animated_television_series_by_episode_count#Longest-running_animated_television_franchises"
  },
  "2024-07-13": {
    "num": 140,
    "category": "Countries with the highest rice production",
    "answers": [{
      "text": ["China"],
      "stat": "208,494,800 tonnes"
    }, {
      "text": ["India"],
      "stat": "196,245,700 tonnes"
    }, {
      "text": ["Bangladesh"],
      "stat": "57,189,193 tonnes"
    }, {
      "text": ["Indonesia"],
      "stat": "54,748,977 tonnes"
    }, {
      "text": ["Vietnam"],
      "stat": "42,672,339 tonnes"
    }],
    "optionsKey": "countries",
    "url": "https://en.wikipedia.org/wiki/List_of_countries_by_rice_production"
  },
  "2024-07-14": {
    "num": 141,
    "category": "Planets with the most moons in the Solar System",
    "answers": [{
      "text": ["Saturn"],
      "stat": "146 moons"
    }, {
      "text": ["Jupiter"],
      "stat": "95 moons"
    }, {
      "text": ["Uranus"],
      "stat": "28 moons"
    }, {
      "text": ["Neptune"],
      "stat": "16 moons"
    }, {
      "text": ["Pluto"],
      "stat": "5 moons"
    }],
    "optionsKey": "planets",
    "url": "https://science.nasa.gov/solar-system/moons/"
  },
  "2024-07-15": {
    "num": 142,
    "category": "Most common periodic elements in the human body by mass",
    "answers": [{
      "text": ["Oxygen"],
      "stat": "65%"
    }, {
      "text": ["Carbon"],
      "stat": "18.5%"
    }, {
      "text": ["Hydrogen"],
      "stat": "9.5%"
    }, {
      "text": ["Nitrogen"],
      "stat": "2.6%"
    }, {
      "text": ["Calcium"],
      "stat": "1.3%"
    }],
    "optionsKey": "elements",
    "url": "https://en.wikipedia.org/wiki/Composition_of_the_human_body#Elements"
  },
  "2024-07-16": {
    "num": 143,
    "category": "Countries with the most universities",
    "answers": [{
      "text": ["India"],
      "stat": "5,349 universities"
    }, {
      "text": ["Indonesia"],
      "stat": "3,277 universities"
    }, {
      "text": ["United States of America"],
      "stat": "3,180 universities"
    }, {
      "text": ["China"],
      "stat": "2,495 universities"
    }, {
      "text": ["Brazil"],
      "stat": "1,264 universities"
    }],
    "optionsKey": "countries",
    "url": "https://www.statista.com/statistics/918403/number-of-universities-worldwide-by-country/"
  },
  "2024-07-17": {
    "num": 144,
    "category": "Countries with the most lakes",
    "answers": [{
      "text": ["Canada"],
      "stat": "879,800"
    }, {
      "text": ["Russia"],
      "stat": "201,200"
    }, {
      "text": ["United States of America"],
      "stat": "102,500"
    }, {
      "text": ["China"],
      "stat": "23,800"
    }, {
      "text": ["Sweden"],
      "stat": "22,600"
    }],
    "optionsKey": "countries",
    "url": "https://www.worldatlas.com/articles/which-country-has-the-most-lakes-in-the-world.html"
  },
  "2024-07-18": {
    "num": 145,
    "category": "Most followed accounts on Twitter",
    "answers": [{
      "text": ["Elon Musk"],
      "stat": "189 million followers"
    }, {
      "text": ["Barack Obama"],
      "stat": "131 million followers"
    }, {
      "text": ["Cristiano Ronaldo"],
      "stat": "112 million followers"
    }, {
      "text": ["Justin Bieber"],
      "stat": "110 million followers"
    }, {
      "text": ["Rihanna"],
      "stat": "108 million followers"
    }],
    "optionsKey": "twitter_followers",
    "url": "https://en.wikipedia.org/wiki/List_of_most-followed_Twitter_accounts"
  },
  "2024-07-19": {
    "num": 146,
    "category": "Best selling films on VHS in the US (by copies sold)",
    "answers": [{
      "text": ["The Lion King"],
      "stat": "32,000,000 copies"
    }, {
      "text": ["Aladdin"],
      "stat": "30,000,000 copies"
    }, {
      "text": ["Snow White and the Seven Dwarfs"],
      "stat": "28,000,000 copies"
    }, {
      "text": ["Titanic"],
      "stat": "25,000,000 copies"
    }, {
      "text": ["Jurassic Park"],
      "stat": "24,000,000 copies"
    }],
    "optionsKey": "vhs_best_sellers",
    "url": "https://en.wikipedia.org/wiki/List_of_best-selling_films_in_the_United_States"
  },
  "2024-07-20": {
    "num": 147,
    "category": "Cities with the most 150m/492ft+ buildings",
    "answers": [{
      "text": ["Hong Kong"],
      "stat": "558 buildings"
    }, {
      "text": ["Shenzhen"],
      "stat": "411 buildings"
    }, {
      "text": ["New York City"],
      "stat": "316 buildings"
    }, {
      "text": ["Dubai"],
      "stat": "263 buildings"
    }, {
      "text": ["Guangzhou"],
      "stat": "191 buildings"
    }],
    "optionsKey": "cities",
    "url": "https://en.wikipedia.org/wiki/List_of_cities_with_the_most_skyscrapers#List_of_cities_by_number_of_completed_skyscrapers_taller_than_150_m_(492_ft)"
  },
  "2024-07-21": {
    "num": 148,
    "category": "Tennis players with the most Grand Slam singles titles",
    "answers": [{
      "text": ["Margaret Court", "Novak Djokovic"],
      "stat": "24 titles"
    }, {
      "text": ["Serena Williams"],
      "stat": "23 titles"
    }, {
      "text": ["Rafael Nadal", "Steffi Graf"],
      "stat": "22 titles"
    }, {
      "text": ["Roger Federer"],
      "stat": "20 titles"
    }, {
      "text": ["Helen Wills Moody"],
      "stat": "19 titles"
    }],
    "optionsKey": "tennis_players",
    "url": "https://www.espn.com/tennis/story/_/id/39364315/who-won-most-grand-slams-tennis-history"
  },
  "2024-07-22": {
    "num": 149,
    "category": "Largest footwear companies by market cap",
    "answers": [{
      "text": ["Nike"],
      "stat": "$109.73 billion"
    }, {
      "text": ["Adidas"],
      "stat": "$44.14 billion"
    }, {
      "text": ["Deckers Brands"],
      "stat": "$22.16 billion"
    }, {
      "text": ["On Holding"],
      "stat": "$12.79 billion"
    }, {
      "text": ["ASICS Corporation"],
      "stat": "$12.22 billion"
    }],
    "optionsKey": "footwear_companies",
    "url": "https://companiesmarketcap.com/footwear/largest-companies-by-market-cap/"
  },
  "2024-07-23": {
    "num": 150,
    "category": "Highest grossing Marvel movies",
    "answers": [{
      "text": ["Avengers: Endgame"],
      "stat": "$2.798 billion"
    }, {
      "text": ["Avengers: Infinity War"],
      "stat": "$2.048 billion"
    }, {
      "text": ["Spider-Man: No Way Home"],
      "stat": "$1.921 billion"
    }, {
      "text": ["The Avengers"],
      "stat": "$1.519 billion"
    }, {
      "text": ["Avengers: Age of Ultron"],
      "stat": "$1.403 billion"
    }],
    "optionsKey": "marvel_movies",
    "url": "https://www.imdb.com/list/ls040671689/"
  }
};
module.exports = puzzles;

/***/ }),
/* 26 */
/***/ (function(module, exports) {

const options = {
  "countries": ["Afghanistan", "Åland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia (Plurinational State of)", "Bonaire, Sint Eustatius and Saba", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "United States Minor Outlying Islands", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cabo Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo (Democratic Republic of the)", "Cook Islands", "Costa Rica", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Côte d'Ivoire", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia (the former Yugoslav Republic of)", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia (Federated States of)", "Moldova (Republic of)", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "North Korea", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestine, State of", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Republic of Kosovo", "Réunion", "Romania", "Russia", "Rwanda", "Saint Barthélemy", "Saint Helena, Ascension and Tristan da Cunha", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin (French part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela (Bolivarian Republic of)", "Vietnam", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"],
  "cities": ["Tokyo", "Delhi", "Shanghai", "Dhaka", "Sao Paulo", "Cairo", "Mexico City", "Beijing", "Mumbai", "Osaka", "Chongqing", "Karachi", "Kinshasa", "Lagos", "Istanbul", "Buenos Aires", "Kolkata", "Manila", "Guangzhou", "Tianjin", "Lahore", "Bangalore", "Rio de Janeiro", "Shenzhen", "Moscow", "Chennai", "Bogota", "Jakarta", "Lima", "Paris", "Bangkok", "Hyderabad", "Seoul", "Nanjing", "Chengdu", "London", "Luanda", "Tehran", "Ho Chi Minh City", "Nagoya", "Xi-an Shaanxi", "Ahmedabad", "Wuhan", "Kuala Lumpur", "Hangzhou", "Suzhou", "Surat", "Dar es Salaam", "New York City", "Baghdad", "Shenyang", "Riyadh", "Hong Kong", "Foshan", "Dongguan", "Pune", "Santiago", "Haerbin", "Madrid", "Khartoum", "Toronto", "Johannesburg", "Belo Horizonte", "Dalian", "Singapore", "Qingdao", "Zhengzhou", "Ji-nan Shandong", "Abidjan", "Barcelona", "Yangon", "Addis Ababa", "Alexandria", "Saint Petersburg", "Nairobi", "Chittagong", "Guadalajara", "Fukuoka", "Ankara", "Hanoi", "Melbourne", "Monterrey", "Sydney", "Changsha", "Urumqi", "Cape Town", "Jiddah", "Brasilia", "Kunming", "Changchun", "Kabul", "Hefei", "Yaounde", "Ningbo", "Shantou", "New Taipei", "Tel Aviv", "Kano", "Shijiazhuang", "Montreal", "Rome", "Jaipur", "Recife", "Nanning", "Fortaleza", "Kozhikode", "Porto Alegre", "Taiyuan Shanxi", "Douala", "Ekurhuleni", "Malappuram", "Medellin", "Changzhou", "Kampala", "Antananarivo", "Lucknow", "Abuja", "Nanchang", "Wenzhou", "Xiamen", "Ibadan", "Fuzhou Fujian", "Salvador", "Casablanca", "Tangshan Hebei", "Kumasi", "Curitiba", "Bekasi", "Faisalabad", "Los Angeles", "Guiyang", "Port Harcourt", "Thrissur", "Santo Domingo", "Berlin", "Asuncion", "Dakar", "Kochi", "Wuxi", "Busan", "Campinas", "Mashhad", "Sanaa", "Puebla", "Indore", "Lanzhou", "Ouagadougou", "Kuwait City", "Lusaka", "Kanpur", "Durban", "Guayaquil", "Pyongyang", "Milan", "Guatemala City", "Athens", "Depok", "Izmir", "Nagpur", "Surabaya", "Handan", "Coimbatore", "Huaian", "Port-au-Prince", "Zhongshan", "Dubai", "Bamako", "Mbuji-Mayi", "Kiev", "Lisbon", "Weifang", "Caracas", "Thiruvananthapuram", "Algiers", "Shizuoka", "Lubumbashi", "Cali", "Goiania", "Pretoria", "Shaoxing", "Incheon", "Yantai", "Zibo", "Huizhou", "Manchester", "Taipei", "Mogadishu", "Brazzaville", "Accra", "Bandung", "Damascus", "Birmingham", "Vancouver", "Toluca de Lerdo", "Luoyang", "Sapporo", "Tashkent", "Patna", "Bhopal", "Chicago", "Tangerang", "Nantong", "Brisbane", "Tunis", "Peshawar", "Medan", "Gujranwala", "Baku", "Hohhot", "San Juan", "Belem", "Rawalpindi", "Agra", "Manaus", "Kannur", "Beirut", "Maracaibo", "Liuzhou", "Visakhapatnam", "Baotou", "Vadodara", "Barranquilla", "Phnom Penh", "Sendai", "Taoyuan", "Xuzhou", "Houston", "Aleppo", "Tijuana", "Esfahan", "Nashik", "Vijayawada", "Amman", "Putian", "Multan", "Grande Vitoria", "Wuhu Anhui", "Mecca", "Kollam", "Naples", "Daegu", "Conakry", "Yangzhou", "Havana", "Taizhou Zhejiang", "Baoding", "Perth", "Brussels", "Linyi Shandong", "Bursa", "Rajkot", "Minsk", "Hiroshima", "Haikou", "Daqing", "Lome", "Lianyungang", "Yancheng Jiangsu", "Panama City", "Almaty", "Semarang", "Hyderabad", "Valencia", "Davao City", "Vienna", "Rabat", "Ludhiana", "Quito", "Benin City", "La Paz", "Baixada Santista", "West Yorkshire", "Can Tho", "Zhuhai", "Leon de los Aldamas", "Quanzhou", "Matola", "Datong", "Sharjah", "Madurai", "Raipur", "Adana", "Santa Cruz", "Palembang", "Mosul", "Cixi", "Meerut", "Gaziantep", "La Laguna", "Batam", "Turin", "Warsaw", "Jiangmen", "Varanasi", "Hamburg", "Montevideo", "Budapest", "Lyon", "Xiangyang", "Bucharest", "Yichang", "Yinchuan", "Shiraz", "Kananga", "Srinagar", "Monrovia", "Tiruppur", "Jamshedpur", "Suqian", "Aurangabad", "Qinhuangdao", "Stockholm", "Anshan", "Glasgow", "Xining", "Makassar", "Hengyang", "Novosibirsk", "Ulaanbaatar", "Onitsha", "Jilin", "Anyang", "Auckland", "Phoenix", "Tabriz", "Muscat", "Calgary", "Qiqihaer", "N-Djamena", "Marseille", "Cordoba", "Jodhpur", "Kathmandu", "Rosario", "Tegucigalpa", "Ciudad Juarez", "Harare", "Karaj", "Medina", "Jining Shandong", "Abu Dhabi", "Munich", "Ranchi", "Daejon", "Zhangjiakou", "Edmonton", "Mandalay", "Gaoxiong", "Kota", "Natal", "Nouakchott", "Jabalpur", "Huainan", "Grande Sao Luis", "Asansol", "Yekaterinburg", "Gwangju", "Yiwu", "Philadelphia", "Chaozhou", "San Antonio", "Gwalior", "Ganzhou", "Homs", "Niamey", "Mombasa", "Allahabad", "Basra", "Kisangani", "San Jose", "Amritsar", "Taizhou Jiangsu", "Chon Buri", "Jiaxing", "Weihai", "Hai Phong", "Ottawa", "Zurich", "Taian Shandong", "Queretaro", "Joao Pessoa", "Kaifeng", "Cochabamba", "Konya", "Liuyang", "Liuan", "Rizhao", "Kharkiv", "Dhanbad", "Nanchong", "Dongying", "Belgrade", "Zunyi", "Zhanjiang", "Bucaramanga", "San Diego", "Uyo", "Copenhagen", "Shiyan", "Taizhong", "Bareilly", "Pointe-Noire", "Adelaide", "Suweon", "Mwanza", "Mianyang Sichuan", "Samut Prakan", "Maceio", "Qom", "Antalya", "Joinville", "Tengzhou", "Yingkou", "Ad-Dammam", "Suzhou", "Tanger", "Freetown", "Helsinki", "Aligarh", "Moradabad", "Pekan Baru", "Maoming", "Lilongwe", "Porto", "Prague", "Astana", "Jieyang", "Fushun Liaoning", "Dallas", "Mysore", "Abomey-Calavi", "Ruian", "Fes", "Port Elizabeth", "Florianopolis", "Ahvaz", "Bukavu", "Nnewi", "Kazan", "Jinhua", "San Luis Potosi", "Baoji", "Durg-Bhilainagar", "Bhubaneswar", "Kigali", "Sofia", "Pingdingshan Henan", "Dublin", "Puning", "Chifeng", "Zhuzhou", "Bujumbura", "Zhenjiang Jiangsu", "Liupanshui", "Barquisimeto", "Islamabad", "Huaibei", "Tasikmalaya", "Maracay", "Bogor", "Da Nang", "Nizhniy Novgorod", "Nanyang Henan", "Xiangtan Hunan", "Pizhou", "Tiruchirappalli", "Chelyabinsk", "Mendoza", "Luohe", "Xiongan", "Chandigarh", "Merida", "Jinzhou", "Benxi", "Binzhou", "Aba", "Chiang Mai", "Bazhong", "Quetta", "Kaduna", "Guilin", "Saharanpur", "Hubli-Dharwad", "Yueqing", "Guwahati", "Mexicali", "Salem", "Maputo", "Tripoli", "Haifa", "Bandar Lampung", "Bobo-Dioulasso", "Amsterdam", "Shimkent", "Omsk", "Aguascalientes", "Hargeysa", "Krasnoyarsk", "Xinxiang", "Siliguri", "Wenling", "Samara", "Zaozhuang", "Cologne", "Yongin", "Ufa", "Fuyang", "Ikorodu", "Bien Hoa", "Jalandhar", "Panjin", "Ma'anshan", "Cuernavaca", "Rostov-on-Don", "Chihuahua", "Fuzhou Jiangxi", "Tshikapa", "Shangrao", "Samarinda", "Bishkek", "Zhaoqing", "San Salvador", "Yichun Jiangxi", "Chenzhou", "Sekondi Takoradi", "Leshan", "Aden", "Goyang", "Diyarbakir", "Asmara", "Dezhou", "Jingzhou Hubei", "Managua", "Johor Bahru", "Kermanshah", "Nyala", "Oslo", "Kirkuk", "Yerevan", "Cartagena", "Changshu", "Huzhou", "Xuchang", "Solapur", "Lille", "Mersin", "Tbilisi", "Perm", "Voronezh", "Denpasar", "Toulouse", "Blantyre-Limbe", "Aracaju", "Marrakech", "Qujing", "Yueyang", "Ilorin", "Tampico", "Antwerp", "Teresina", "Guiping", "Warangal", "Changwon", "Padang", "Saltillo", "Xintai", "Cancun", "Cebu City", "San Miguel de Tucuman", "Hamah", "Acapulco de Juarez", "Warri", "Kayseri", "Chengde", "Owerri", "Rotterdam", "Pingxiang Jiangxi", "Zhucheng", "Songkhla", "Valparaiso", "Dehradun", "Nonthaburi", "Leiyang", "Dushanbe", "Nampula", "Misratah", "Krasnodar", "Laiwu", "Bordeaux", "Jixi Heilongjiang", "San Pedro Sula", "Odesa", "Jiujiang", "Lubango", "Morelia", "Jos", "Jacksonville", "Sylhet", "Agadir", "Fort Worth", "Volgograd", "Mudanjiang", "Guigang", "Najaf", "Bangui", "Austin", "Rajshahi", "Hengshui", "Jerusalem", "Zhangzhou", "Xinyu", "Linfen", "Tianmen", "Ciudad Guayana", "Zamboanga City", "Yangjiang", "Taiz", "Cucuta", "Arequipa", "Liling", "Antipolo", "Veracruz", "Reynosa", "Khulna", "Deyang", "Pathum Thani", "Bengbu", "Jiangyin", "Southampton", "Villahermosa", "Baishan", "Nice", "Oran", "San Jose", "West Rand", "Cabinda", "Umuahia", "Bogra", "Bahawalpur", "Seongnam", "Guntur", "Dnipro", "Campo Grande", "Malang", "Londrina", "Dandong", "Changzhi", "Hermosillo", "Charlotte", "Bhiwandi", "La Plata", "Liverpool", "Ashgabat", "Concepcion", "Puducherry", "Changde", "Bergamo", "Firozabad", "Columbus", "Erbil", "Tyumen", "Trujillo", "Liaoyang", "Shangqiu", "Ulsan", "Tuxtla Gutierrez", "Kuerle", "Soshanguve", "Xingtai", "Culiacan", "Quzhou", "Cherthala", "Huangshi", "Fuxin", "Lokoja", "Hufuf-Mubarraz", "Libreville", "Yongzhou", "Xinghua", "Donetsk", "Yibin", "Indianapolis", "Enugu", "Tainan", "Xinyang", "Ipoh", "Luzhou", "Banghazi", "Maiduguri", "Yangquan", "Huaihua", "Xiaogan", "Tianshui", "Bunia", "Bozhou", "Kottayam", "Zhuji", "Kunshan", "Quebec City", "Palermo", "Winnipeg", "Orumiyeh", "Eskisehir", "Benguela", "Jincheng", "Valencia", "Heze", "Saratov", "Nellore", "Huludao", "Zanzibar", "Barcelona-Puerto La Cruz", "Bikaner", "Haicheng", "Gebze", "Taixing", "Liaocheng", "Zhumadian", "Newcastle upon Tyne", "Langfang", "Bucheon", "Sulaimaniya", "Xalapa", "Malanje", "Anqiu", "Sorocaba", "Gaomi", "Dasmarinas", "Cagayan de Oro City", "Hanchuan", "Meishan", "Bologna", "Ar-Rayyan", "Thessaloniki", "Muzaffarnagar", "Kayamkulam", "Nottingham", "Nakhon Ratchasima", "Danyang", "Ibb", "Amravati", "Jiaozuo", "Vereeniging", "San Francisco", "Gorakhpur", "Gaza", "Frankfurt", "Anqing", "Niigata", "Oshogbo", "Linhai", "Shaoguan", "Erduosi-Ordoss", "Merca", "Bur Sa'id", "Kitwe", "Yan'an", "Cuttack", "Hamilton", "Zaria", "Banjarmasin", "Seattle", "Dengzhou", "Belgaum", "Malegaon", "Goma", "Zigong", "Qingyuan", "Yuncheng", "Shaoyang", "Yanji", "Tirupati", "Maturin", "Yuxi", "Akure", "Tongliao", "Sialkot", "Tongling", "Krakow", "Ansan", "Wuzhou", "Dazhou", "Suining Sichuan", "Mangalore", "Jiamusi", "Al-Hudaydah", "Sargodha", "Nay Pyi Taw", "Tamale", "Sao Jose dos Campos", "Bacoor", "Dongtai", "Zhangjiagang", "Nanded Waghala", "Xianyang Shaanxi", "Amara", "Zarqa", "Bhavnagar", "Sheffield", "Huambo", "Ribeirao Preto", "Panzhihua"],
  "grossing_movies": ["Aladdin", "Alice in Wonderland", "Aquaman", "Avatar", "Avatar: The Way of Water", "Avengers: Age of Ultron", "Avengers: Endgame", "Avengers: Infinity War", "Barbie", "Batman v Superman: Dawn of Justice", "Beauty and the Beast", "Black Panther", "Black Panther: Wakanda Forever", "Bohemian Rhapsody", "Captain America: Civil War", "Captain Marvel", "Coco", "Despicable Me 2", "Despicable Me 3", "Doctor Strange in the Multiverse of Madness", "Fantastic Beasts and Where to Find Them", "Fast & Furious 7", "Finding Dory", "Finding Nemo", "Frozen II", "Frozen", "Guardians of the Galaxy Vol. 2", "Guardians of the Galaxy Vol. 3", "Harry Potter and the Chamber of Secrets", "Harry Potter and the Deathly Hallows - Part 1", "Harry Potter and the Deathly Hallows - Part 2", "Harry Potter and the Goblet of Fire", "Harry Potter and the Half-Blood Prince", "Harry Potter and the Order of the Phoenix", "Harry Potter and the Prisoner of Azkaban", "Harry Potter and the Sorcerer's Stone", "Ice Age: Continental Drift", "Ice Age: Dawn of the Dinosaurs", "Inception", "Incredibles 2", "Independence Day", "Inside Out", "Iron Man 3", "Joker", "Jumanji: The Next Level", "Jumanji: Welcome to the Jungle", "Jurassic Park", "Jurassic World Dominion", "Jurassic World", "Jurassic World: Fallen Kingdom", "Minions", "Minions: The Rise of Gru", "Oppenheimer", "Pirates of the Caribbean: At World's End", "Pirates of the Caribbean: Dead Man's Chest", "Pirates of the Caribbean: Dead Men Tell No Tales", "Pirates of the Caribbean: On Stranger Tides", "Rogue One", "Shrek 2", "Shrek the Third", "Skyfall", "Spectre", "Spider-Man 3", "Spider-Man", "Spider-Man: Far from Home", "Spider-Man: Homecoming", "Spider-Man: No Way Home", "Star Wars: Episode I - The Phantom Menace", "Star Wars: Episode III - Revenge of the Sith", "Star Wars: Episode IX - The Rise of Skywalker", "Star Wars: Episode VII - The Force Awakens", "Star Wars: Episode VIII - The Last Jedi", "The Avengers", "The Dark Knight Rises", "The Dark Knight", "The Fate of the Furious", "The Hobbit: An Unexpected Journey", "The Hobbit: The Battle of the Five Armies", "The Hobbit: The Desolation of Smaug", "The Hunger Games: Catching Fire", "The Jungle Book", "The Lion King", "The Lion King", "The Lord of the Rings: The Fellowship of the Ring", "The Lord of the Rings: The Return of the King", "The Lord of the Rings: The Two Towers", "The Secret Life of Pets", "The Super Mario Bros. Movie", "The Twilight Saga: Breaking Dawn - Part 2", "Thor: Ragnarok", "Titanic", "Top Gun: Maverick", "Toy Story 3", "Toy Story 4", "Transformers: Age of Extinction", "Transformers: Dark of the Moon", "Transformers: Revenge of the Fallen", "Venom", "Wonder Woman", "Zootopia"],
  "languages": ["Amharic", "Arabic", "Azerbaijani", "Bengali", "Bhojpuri", "Burmese", "Cebuano", "Dutch", "English", "French", "Fula", "German", "Gujarati", "Hakka", "Hindi", "Igbo", "Indonesian", "Italian", "Japanese", "Javanese", "Kannada", "Korean", "Kurdish", "Maithili", "Malayalam", "Mandarin Chinese", "Marathi", "Oriya", "Oromo", "Polish", "Portuguese", "Punjabi", "Romanian", "Russian", "Sindhi", "Spanish", "Swahili", "Tagalog", "Tamil", "Tamil", "Telugu", "Thai", "Turkish", "Ukrainian", "Urdu", "Uzbek", "Vietnamese", "Wu Chinese", "Yoruba", "Yue Chinese (Cantonese)"],
  "harry_potter_characters": ["Alastor \"Mad-Eye\" Moody", "Alberforth Dumbledore", "Albus Dumbledore", "Alice Longbottom", "Aragog", "Argus Filch", "Arthur Weasley", "Bartemius \"Barty\" Crouch Jr.", "Bartemius \"Barty\" Crouch Sr.", "Bellatrix Lestrange", "Bill Weasley", "Cedric Diggory", "Charlie Weasley", "Cho Chang", "Cornelius Fudge", "Dobby", "Dolores Janes Umbridge", "Draco Malfoy", "Dudley Dursley", "Fleur Delacour", "Fluffy", "Frank Longbottom", "Fred Weasley", "George Weasley", "Ginny Weasley", "Goyle Sr.", "Grawp", "Gregory Goyle", "Harry Potter", "Hedwig", "Hermione Granger", "Igor Karkaroff", "James Potter", "Lavender Brown", "Lily Potter", "Lord Voldemort", "Lucius Malfoy", "Luna Lovegood", "Mary Riddle", "Minerva McGonagall", "Moaning Myrtle", "Molly Weasley", "Narcissa Malfoy", "Neville Longbottom", "Nicolas Flamel", "Nymphadora Tonks", "Olympe Maxime", "Percy Weasley", "Peter Pettigrew", "Petunia Dursley", "Quirinus Quirrell", "Regulus Arcturus Black", "Remus Lupin", "Rita Skeeter", "Ron Weasley", "Rubeus Hagrid", "Seamus Finnigan", "Severus Snape", "Sirius Black", "Tom Riddle Sr.", "Vernon Dursley", "Viktor Krum", "Vincent Crabbe Sr.", "Vincent Crabbe", "Xenophilius Lovegood"],
  "video_games": ["Animal Crossing: New Horizons", "Call of Duty: Advanced Warfare", "Call of Duty: Black Ops II", "Call of Duty: Black Ops III", "Call of Duty: Black Ops", "Call of Duty: Ghosts", "Call of Duty: Modern Warfare 2", "Call of Duty: Modern Warfare 3", "Call of Duty: WWII", "Diablo III", "Duck Hunt", "Final Fantasy IV", "Final Fantasy IX", "Final Fantasy VI", "Final Fantasy VII", "Final Fantasy VIII", "Final Fantasy X/X-2 HD Remaster", "Final Fantasy XII", "Final Fantasy XIII", "Final Fantasy XIV", "Final Fantasy XV", "Final Fantasy XV", "Final Fantasy XV", "Final Fantasy XV", "Final Fantasy XV", "Final Fantasy XV", "Final Fantasy XV", "Final Fantasy XV", "Final Fantasy XV", "Final Fantasy XV", "Final Fantasy XV", "Final Fantasy XV", "Gran Turismo 3: A-Spec", "Gran Turismo 4", "Gran Turismo 5", "Gran Turismo 6", "Grand Theft Auto III", "Grand Theft Auto IV", "Grand Theft Auto V", "Grand Theft Auto: Chinatown Wars", "Grand Theft Auto: Liberty City Stories", "Grand Theft Auto: San Andreas", "Grand Theft Auto: VICE CITY", "Grand Theft Auto: Vice City", "Mario Kart 64", "Mario Kart 7", "Mario Kart 8/Deluxe", "Mario Kart DS", "Mario Kart Wii", "Mario Kart: Double Dash!!", "Mario Party 8", "Minecraft", "New Super Mario Bros. U", "New Super Mario Bros. Wii", "New Super Mario Bros.", "PUBG: Battlegrounds", "Pokémon Black 2/White 2", "Pokémon Black/White", "Pokémon Diamond/Pearl", "Pokémon FireRed/LeafGreen", "Pokémon Gold/Silver/Crystal", "Pokémon HeartGold/SoulSilver", "Pokémon Let's Go", "Pokémon Omega Ruby/Alpha Sapphire", "Pokémon Platinum", "Pokémon Red/Green/Blue/Yellow", "Pokémon Ruby/Sapphire/Emerald", "Pokémon Sun/Moon", "Pokémon Sword/Shield", "Pokémon X/Y", "Red Dead Redemption 2", "Red Dead Redemption", "Super Mario 3D World", "Super Mario 64", "Super Mario All-Stars", "Super Mario Bros. 2", "Super Mario Bros. 3", "Super Mario Bros.", "Super Mario Bros.: The Lost Levels", "Super Mario Galaxy 2", "Super Mario Galaxy", "Super Mario Land 2: 6 Golden Coins", "Super Mario Land", "Super Mario Odyssey", "Super Mario RPG: Legend of the Seven Stars", "Super Mario World", "Tetris", "The Elder Scrolls V: Skyrim", "The Legend of Zelda: A Link to the Past", "The Legend of Zelda: Breath of the Wild", "The Legend of Zelda: Link's Awakening", "The Legend of Zelda: Majora's Mask", "The Legend of Zelda: Ocarina of Time", "The Legend of Zelda: The Wind Waker", "The Legend of Zelda: Twilight Princess", "The Witcher 3: Wild Hunt", "Wii Fit and Wii Fit Plus", "Wii Play", "Wii Sports Resort", "Wii Sports"],
  "smartphone_apps": ["Alipay", "Amazon", "Amazon Kindle", "Amazon Music", "Amazon Prime Video", "Among Us", "Candy Crush Saga", "CapCut", "Discord", "DoorDash", "Facebook", "Facebook Messenger", "Gmail", "Google", "Google Chrome", "Google Drive", "Google Maps", "Google Meet", "Google Photos", "Grubhub", "Instacart", "Instagram", "LinkedIn", "Lyft", "Monopoly GO", "Netflix", "Pinterest", "Postmates", "Roblox", "Shein", "Snapchat", "Spotify", "Subway Surfers", "Telegram", "Temu", "Threads", "TikTok", "Uber", "Uber Eats", "WeChat", "WhatsApp", "WhatsApp Business", "X (Twitter)", "YouTube", "Zoom"],
  "social_networks": ["Discord", "Douyin", "Facebook", "Instagram", "JOSH", "Kuaishou", "Likee", "Line", "LinkedIn", "Messenger", "Picsart", "Pinterest", "QQ", "Quora", "Qzone", "Reddit", "Skype", "Snapchat", "Teams", "Telegram", "Threads", "Tieba", "TikTok", "Tumblr", "Twitch", "VK", "Vevo", "Viber", "WeChat", "Weibo", "WhatsApp", "X (Twitter)", "Xiaohongshu", "YouTube", "imo"],
  "musical_artists": ["Drake", "Taylor Swift", "Bad Bunny", "The Weeknd", "Ed Sheeran", "BTS", "Post Malone", "Ariana Grande", "Justin Bieber", "Kanye West", "Eminem", "Juice WRLD", "Travis Scott", "Billie Eilish", "XXXTENTACION", "Kendrick Lamar", "Rihanna", "Coldplay", "J Balvin", "Dua Lipa", "Imagine Dragons", "Khalid", "Bruno Mars", "Maroon 5", "David Guetta", "Future", "J. Cole", "Shawn Mendes", "Lana Del Rey", "Beyoncé", "One Direction", "Calvin Harris", "Sam Smith", "Lil Uzi Vert", "Nicki Minaj", "Ozuna", "Arijit Singh", "Queen", "Harry Styles", "Doja Cat", "Chris Brown", "Lady Gaga", "Metro Boomin", "21 Savage", "SZA", "Adele", "Pritam", "The Beatles", "Linkin Park", "Halsey", "The Chainsmokers", "Daddy Yankee", "Arctic Monkeys", "Marshmello", "Lil Baby", "Selena Gomez", "Morgan Wallen", "KAROL G", "Sia", "Olivia Rodrigo", "Katy Perry", "Miley Cyrus", "Anuel AA", "$uicideboy$", "Shakira", "Tyler, The Creator", "Red Hot Chili Peppers", "Rauw Alejandro", "Mac Miller", "Twenty One Pilots", "Peso Pluma", "Avicii", "BLACKPINK", "Camila Cabello", "YoungBoy Never Broke Again", "OneRepublic", "Michael Jackson", "Frank Ocean", "Maluma", "Kygo", "Pop Smoke", "Young Thug", "DaBaby", "Luke Combs", "Jason Derulo", "Elton John", "Charlie Puth", "Cardi B", "Lil Wayne", "Pitbull", "A Boogie Wit da Hoodie", "Metallica", "Demi Lovato", "Trippie Redd", "Gunna", "Farruko", "NF", "Alan Walker", "Ellie Goulding", "DJ Snake", "Led Zeppelin", "Pink Floyd", "Mariah Carey", "AC/DC", "The Rolling Stones", "Whitney Houston", "Elvis Presley"],
  "celebrities": ["Instagram", "Cristiano Ronaldo", "Lionel Messi", "Selena Gomez", "Kylie Jenner", "Dwayne Johnson", "Ariana Grande", "Kim Kardashian", "Beyoncé", "Khloé Kardashian", "Nike", "Kendall Jenner", "Justin Bieber", "National Geographic", "Taylor Swift", "Virat Kohli", "Jennifer Lopez", "Nicki Minaj", "Kourtney Kardashian", "Neymar", "Miley Cyrus", "Katy Perry", "Zendaya", "Kevin Hart", "Cardi B", "LeBron James", "Demi Lovato", "Real Madrid CF", "Rihanna", "Drake", "Chris Brown", "Ellen DeGeneres", "FC Barcelona", "UEFA Champions League", "Kylian Mbappé", "Billie Eilish", "Gal Gadot", "Vin Diesel", "Lisa", "NASA", "Priyanka Chopra", "Shakira", "Dua Lipa", "Shraddha Kapoor", "Narendra Modi", "David Beckham", "NBA", "Snoop Dogg", "Jennie", "Alia Bhatt"],
  "art_museums": ["Louvre Museum", "Vatican Museums", "British Museum", "Tate Modern", "National Museum of Korea", "Musée d'Orsay", "Museo del Prado", "National Gallery of Art", "Metropolitan Museum of Art", "Musée National d'Art Moderne", "State Hermitage Museum", "National Gallery", "State Russian Museum", "Victoria and Albert Museum", "Somerset House", "Uffizi Gallery", "Museum of Modern Art", "M+", "National Museum of Scotland", "Tretyakov Gallery", "Wawel Castle", "Rijksmuseum", "Royal Castle, Warsaw", "NGV International (National Gallery of Victoria)", "Tokyo Metropolitan Art Museum", "Humboldt Forum", "Acropolis Museum", "Galleria dell'Accademia", "The National Art Center, Tokyo", "Louis Vuitton Foundation", "Tokyo National Museum", "National Museum in Kraków", "Centro Cultural Banco do Brasil", "Van Gogh Museum", "Kunst­historisches Museum", "Palacio de Cristal del Retiro (Museo Reina Sofía)", "Guggenheim Museum Bilbao", "Scottish National Gallery", "National Gallery Singapore", "Museo Reina Sofía", "Museum of European and Mediterranean Civilisations (MUCEM)", "Pushkin State Museum of Fine Arts", "Gyeongju National Museum", "Doge's Palace", "National Museum of African-American History and Culture (Smithsonian Institution)", "Petit Palais", "Thyssen-Bornemisza Museum", "Tel Aviv Museum of Art", "Art Institute of Chicago", "Art Gallery of New South Wales", "Musée de l'Orangerie", "Musée du quai Branly", "Getty Center", "Kelvingrove Art Gallery and Museum", "Donald W. Reynolds Center", "Tate Britain", "Museum of Fine Arts, Houston", "Musée des Arts Decoratifs", "Museo Egizio", "Upper Belvedere", "Los Angeles County Museum of Art", "Museum of New Zealand Te Papa Tongarewa", "Moscow Kremlin Museums", "Munch Museum", "Whitney Museum", "De Young Museum", "Royal Ontario Museum", "Museu Picasso"],
  "buildings": ["Burj Khalifa", "Merdeka 118", "Shanghai Tower", "Abraj Al-Bait Clock Tower", "Ping An International Finance Centre", "Lotte World Tower", "One World Trade Center", "Guangzhou CTF Finance Centre", "Tianjin CTF Finance Centre", "China Zun", "Taipei 101", "Shanghai World Financial Center", "International Commerce Centre", "Wuhan Greenland Center", "Central Park Tower", "Lakhta Center", "Landmark 81", "International Land-Sea Center", "The Exchange 106", "Changsha IFS Tower T1", "Petronas Tower 1", "Petronas Tower 2", "Zifeng Tower", "Suzhou IFS", "Wuhan Center", "Willis Tower", "KK100", "Guangzhou International Finance Center", "111 West 57th Street", "One Vanderbilt", "Nanjing Financial City Phase II Plot C Tower 1", "432 Park Avenue", "Marina 101", "Trump International Hotel and Tower", "JPMorgan Chase World Headquarters", "Minying International Trade Center T2", "Jin Mao Tower", "Princess Tower", "Al Hamra Tower", "Two International Finance Centre", "Haeundae LCT The Sharp Landmark Tower", "Ningbo Central Plaza", "Guangxi China Resources Tower", "Guiyang International Financial Center T1", "Iconic Tower", "China Resources Tower", "23 Marina", "CITIC Plaza", "Citymark Centre", "Shum Yip Upperhills Tower 1", "30 Hudson Yards", "Public Investment Fund Tower", "Shun Hing Square", "Eton Place Dalian Tower 1", "Autograph Tower", "Logan Century Center 1", "Burj Mohammed bin Rashid", "Empire State Building", "Elite Residence", "Riverview Plaza", "Dabaihui Plaza", "Guangdong Business Center", "Central Plaza", "Federation Tower (East Tower)", "Dalian International Trade Center", "Address Boulevard", "Haitian Center Tower 2", "Golden Eagle Tiandi Tower A", "Bank of China Tower", "Bank of America Tower", "Ciel Tower", "St. Regis Chicago", "Almas Tower", "Jinan Ping An Finance Center Tower 1", "Huiyun Center", "Hanking Center", "Greenland Group Suzhou Center", "Gevora Hotel", "Galaxy World Tower 1", "Galaxy World Tower 2", "Il Primo Tower", "JW Marriott Marquis Dubai Tower 1", "JW Marriott Marquis Dubai Tower 2", "Emirates Office Tower", "Raffles City Chongqing T3N", "Raffles City Chongqing T4N", "OKO – South Tower", "The Marina Torch", "Central Bank of the Republic of Turkey", "Forum 66 Tower 1", "The Pinnacle", "Xi'an Glory International Financial Center", "Spring City 66", "85 Sky Tower", "Aon Center", "The Center", "Neva Tower 2", "875 North Michigan Avenue", "Shimao Global Financial Center", "Four Seasons Place Kuala Lumpur", "ADNOC Headquarters", "One Shenzhen Bay Tower 7"],
  "words": ["the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"],
  "companies": ["Microsoft", "Apple", "NVIDIA", "Saudi Aramco", "Amazon", "Alphabet (Google)", "Meta Platforms (Facebook)", "Berkshire Hathaway", "Eli Lilly", "TSMC", "Broadcom", "Tesla", "Visa", "Novo Nordisk", "JPMorgan Chase", "Walmart", "LVMH", "UnitedHealth", "Mastercard", "Exxon Mobil", "ASML", "Johnson & Johnson", "Home Depot", "Procter & Gamble", "Samsung", "Costco", "Toyota", "AMD", "Tencent", "AbbVie", "Merck", "Oracle", "Kweichow Moutai", "Salesforce", "Bank of America", "Chevron", "Nestlé", "Hermès", "Netflix", "Coca-Cola", "L'Oréal", "ICBC", "Adobe", "Reliance Industries", "International Holding Company", "Accenture", "Thermo Fisher Scientific", "Pepsico", "Linde", "SAP", "PetroChina", "Roche", "McDonald", "Novartis", "Walt Disney", "Abbott Laboratories", "Agricultural Bank of China", "Shell", "Wells Fargo", "AstraZeneca", "Cisco", "T-Mobile US", "China Mobile", "Danaher", "Intel", "QUALCOMM", "Alibaba", "Intuit", "IBM", "Tata Consultancy Services", "Applied Materials", "General Electric", "Verizon", "Bank of China", "Comcast", "Caterpillar", "Uber", "Pinduoduo", "Dior", "American Express", "China Construction Bank", "Texas Instruments", "Union Pacific", "Siemens", "ServiceNow", "TotalEnergies", "Nike", "HSBC", "Amgen", "Pfizer", "Morgan Stanley", "BHP Group", "Philip Morris", "HDFC Bank", "Royal Bank Of Canada", "Lowe's Companies", "Arm Holdings", "Inditex", "Intuitive Surgical", "Airbus"],
  "us_companies": ["3M Company", "ABM Industries Incorporated", "AT&T", "Abbott Laboratories", "Albertsons Companies", "Alphabet", "Amazon.com", "American Airlines Group", "Amphenol", "Apple Inc", "Aramark", "AutoZone", "Bank of America", "Barrett Business Services", "Berkshire Hathaway", "Best Buy Co.", "Bloomin' Brands", "CBRE Group", "CVS Health", "Carnival & plc", "Caterpillar", "Charter Communications", "Chipotle Mexican Grill", "Cisco Systems", "Citigroup", "Cognizant Technology Solutions", "Comcast", "Concentrix", "Costco Wholesale", "Cracker Barrel Old Country Store", "DXC Technology Company", "Darden Restaurants", "Deere & Company", "Dell Technologies", "Delta Air Lines", "Dollar General", "Dollar Tree", "Elevance Health", "FedEx", "Ford Motor Company", "GE Aerospace", "GXO Logistics", "General Dynamics", "General Motors Company", "HCA Healthcare", "Hilton Worldwide Holdings", "Honeywell International", "IQVIA Holdings", "Intel", "International Business Machines", "JPMorgan Chase & Co.", "Jabil", "Johnson & Johnson", "Jones Lang LaSalle Incorporated", "Kohl's", "Kyndryl Holdings", "Lear", "Lockheed Martin", "Lowe's Companies", "Macy's", "Marriott International", "Marsh & McLennan Companies", "McDonald's", "Microsoft", "Mondelez International", "Morgan Stanley", "NIKE", "Northrop Grumman", "O'Reilly Automotive", "Oracle", "PepsiCo", "Pfizer", "Philip Morris International", "RTX Corp", "Ross Stores", "Royal Caribbean Cruises Ltd.", "Schlumberger Limited", "Starbucks", "Target", "Tenet Healthcare", "Tesla", "Texas Roadhouse", "The Boeing Company", "The Coca-Cola Company", "The Gap", "The Home Depot", "The Kroger Co.", "The Procter & Gamble Company", "The TJX Companies", "The Walt Disney Company", "Thermo Fisher Scientific", "Tyson Foods", "United Airlines Holdings", "United Parcel Service (UPS)", "UnitedHealth Group Incorporated", "Universal Health Services", "Verizon Communications", "Walgreens Boots Alliance", "Walmart", "Wells Fargo & Company"],
  "tv_shows": ["24", "7th Heaven", "Alice", "All in the Family", "American Dad!", "Beverly Hills, 90210", "Bewitched", "Blue Bloods", "Bob's Burgers", "Bonanza", "Bones", "CSI: Crime Scene Investigation", "CSI: Miami", "CSI: NY", "Cheers", "Chicago Fire", "Chicago Med", "Chicago P.D.", "Coach", "Criminal Minds", "Dallas", "Dragnet", "Dynasty", "ER", "Everybody Loves Raymond", "Falcon Crest", "Family Guy", "Family Matters", "Frasier", "Friends", "Grey's Anatomy", "Gunsmoke", "Happy Days", "Hawaii Five-0", "Hawaii Five-O", "Home Improvement", "How I Met Your Mother", "Ironside", "JAG", "King of the Hill", "Knots Landing", "Lassie", "Last Man Standing", "Law & Order", "Law & Order: Criminal Intent", "Law & Order: Special Victims Unit", "Little House on the Prairie", "MASH", "Mama", "Mannix", "Married... with Children", "Matlock", "Modern Family", "Murder, She Wrote", "Murphy Brown", "My Three Sons", "NCIS", "NCIS: Los Angeles", "NYPD Blue", "Night Court", "One Day at a Time", "One Tree Hill", "Perry Mason", "Rawhide", "Roseanne", "Scrubs", "Seinfeld", "Smallville", "Supernatural", "That '70s Show", "The Adventures of Ozzie and Harriet", "The Andy Griffith Show", "The Beverly Hillbillies", "The Big Bang Theory", "The Blacklist", "The Cosby Show", "The Danny Thomas Show", "The Donna Reed Show", "The Drew Carey Show", "The F.B.I.", "The Facts of Life", "The Flash", "The George Burns and Gracie Allen Show", "The Goldbergs", "The Jack Benny Program", "The Jeffersons", "The King of Queens", "The Love Boat", "The Middle", "The Office", "The Simpsons", "The Virginian", "The Waltons", "The X-Files", "Touched by an Angel", "Two and a Half Men", "Wagon Train", "Walker, Texas Ranger", "Who's the Boss?", "Will & Grace"],
  "fashion_brands": ["Adidas", "Armani", "Burberry", "Calvin Klein", "Cartiex", "Chanel", "Chao Tai Fook", "Coach", "Dior", "Gucci", "H&M", "Hermès", "Levi's", "Louis Vuitton", "Lululemon", "New Balance", "Nike", "Old Navy", "Omega", "Prada", "Puma", "Ralph Lauren", "Ray Ban", "Rolex", "Tag Heuer", "The North Face", "Tiffany & Co", "Under Armour", "Uniqlo", "Versace", "Victoria's Secret", "Zara"],
  "car_brands": ["Acura", "Audi", "BMW", "Chevrolet", "Ford", "Honda", "Hyundai", "Jeep", "Kia", "Lexus", "Mazda", "Mercedes-Benz", "Mitsubishi", "Nissan", "Porsche", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"],
  "national_parks": ["Yellowstone", "Sequoia", "Yosemite", "Mount Rainier", "Crater Lake", "Wind Cave", "Mesa Verde", "Glacier", "Rocky Mountain", "Hawaiʻi Volcanoes", "Lassen Volcanic", "Denali", "Acadia", "Grand Canyon", "Zion", "Hot Springs", "Bryce Canyon", "Grand Teton", "Carlsbad Caverns", "Everglades", "Great Smoky Mountains", "Shenandoah", "Olympic", "Kings Canyon", "Isle Royale", "Mammoth Cave", "Big Bend", "Virgin Islands", "Haleakalā", "Petrified Forest", "Canyonlands", "North Cascades", "Redwood", "Arches", "Capitol Reef", "Guadalupe Mountains", "Voyageurs", "Badlands", "Theodore Roosevelt", "Channel Islands", "Biscayne", "Gates of the Arctic", "Glacier Bay", "Katmai", "Kenai Fjords", "Kobuk Valley", "Lake Clark", "Wrangell–St. Elias", "Great Basin", "American Samoa", "Dry Tortugas", "Saguaro", "Death Valley", "Joshua Tree", "Black Canyon of the Gunnison", "Cuyahoga Valley", "Congaree", "Great Sand Dunes", "Pinnacles", "Gateway Arch", "Indiana Dunes", "White Sands", "New River Gorge"],
  "elements": ["Hydrogen", "Helium", "Lithium", "Beryllium", "Boron", "Carbon", "Nitrogen", "Oxygen", "Fluorine", "Neon", "Sodium", "Magnesium", "Aluminium", "Silicon", "Phosphorus", "Sulfur", "Chlorine", "Argon", "Potassium", "Calcium", "Scandium", "Titanium", "Vanadium", "Chromium", "Manganese", "Iron", "Cobalt", "Nickel", "Copper", "Zinc", "Gallium", "Germanium", "Arsenic", "Selenium", "Bromine", "Krypton", "Rubidium", "Strontium", "Yttrium", "Zirconium", "Niobium", "Molybdenum", "Technetium", "Ruthenium", "Rhodium", "Palladium", "Silver", "Cadmium", "Indium", "Tin", "Antimony", "Tellurium", "Iodine", "Xenon", "Cesium", "Barium", "Lanthanum", "Cerium", "Praseodymium", "Neodymium", "Promethium", "Samarium", "Europium", "Gadolinium", "Terbium", "Dysprosium", "Holmium", "Erbium", "Thulium", "Ytterbium", "Lutetium", "Hafnium", "Tantalum", "Wolfram", "Rhenium", "Osmium", "Iridium", "Platinum", "Gold", "Mercury", "Thallium", "Lead", "Bismuth", "Polonium", "Astatine", "Radon", "Francium", "Radium", "Actinium", "Thorium", "Protactinium", "Uranium", "Neptunium", "Plutonium", "Americium", "Curium", "Berkelium", "Californium", "Einsteinium", "Fermium", "Mendelevium", "Nobelium", "Lawrencium", "Rutherfordium", "Dubnium", "Seaborgium", "Bohrium", "Hassium", "Meitnerium", "Darmstadtium ", "Roentgenium ", "Copernicium ", "Nihonium", "Flerovium", "Moscovium", "Livermorium", "Tennessine", "Oganesson"],
  "us_states": ["Alabama", "Alaska", "Arkansas", "Arizona", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Iowa", "Idaho", "Illinois", "Indiana", "Kansas", "Kentucky", "Louisiana", "Massachusetts", "Maryland", "Maine", "Michigan", "Minnesota", "Missouri", "Mississippi", "Montana", "North Carolina", "North Dakota", "Nebraska", "New Hampshire", "New Jersey", "New Mexico", "Nevada", "New York", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Virginia", "Vermont", "Washington", "Wisconsin", "West Virginia", "Wyoming"],
  "cereals": ["Apple Jacks", "Cap'n Crunch", "Cheerios", "Cinnamon Toast Crunch", "Cocoa Pebbles", "Cocoa Puffs", "Cookie Crisp", "Corn Flakes", "Corn Pops", "Count Chocula", "Froot Loops", "Frosted Flakes", "Frosted Mini-Wheats", "Fruity Pebbles", "Golden Grahams", "Honey Bunches of Oats", "Honey Nut Cheerios", "Kix", "Life", "Lucky Charms", "Raisin Bran", "Reese's Puffs", "Rice Krispies", "Special K", "Special K Red Berries", "Trix", "Wheaties"],
  "broadway_musicals": ["Aladdin", "Annie", "Avenue Q", "Beautiful: The Carole King Musical", "Beauty and the Beast", "Cats", "Chicago (Revival)", "Dear Evan Hansen", "Hairspray", "Hamilton", "Jersey Boys", "Kinky Boots", "Les Misérables", "Mamma Mia!", "Mary Poppins", "Matilda the Musical", "Miss Saigon", "Moulin Rouge! The Musical", "Rent", "Spider-Man: Turn Off the Dark", "The Book of Mormon", "The Lion King", "The Music Man", "The Phantom of the Opera", "The Producers", "Waitress", "West Side Story", "Wicked"],
  "ice_cream_flavors": ["Caramel Chocolate Cheesecake", "Chillin' the Roast", "Chocolate Shake It", "Gimme S'more", "Glampfire Trail Mix", "One Sweet World", "Pecan Sticky Buns", "Americone Dream", "Banana Split", "Blondie Ambition", "Boom Chocolatta Cookie Core", "Bourbon Pecan Pie", "Brewed to Matter", "Brownie Batter Core", "Cheesecake Brownie", "Cherry Garcia", "Chocolate Chip Cookie Dough", "Chocolate Fudge Brownie", "Chocolate Therapy", "Chubby Hubby", "Chunky Monkey", "Cinnamon Buns", "Coconuts for Caramel Core", "Coffee Toffee Bar Crunch", "Coffee, Coffee BuzzBuzzBuzz!", "Cookies & Cream Cheesecake Core", "Everything But The...", "Half Baked", "Karamel Sutra Core", "Keep Caramel & Cookie On", "Milk & Cookies", "Mint Chocolate Cookie", "New York Super Fudge Chunk", "Oat of This Swirled", "Peanut Buttah Cookie Core", "Peanut Butter Cup", "Peanut Butter Fudge Core", "Peanut Butter World", "Phish Food", "Pistachio Pistachio", "Pumpkin Cheesecake", "Red Velvet Cake", "S'mores", "Salted Caramel Almond", "Salted Caramel Core", "Spectacular Speculoos Cookie Core", "Strawberry Cheesecake", "The Tonight Dough", "Triple Caramel Chunk", "Truffle Kerfuffle", "Urban Bourbon", "Vanilla", "Vanilla Caramel Fudge", "Vanilla Toffee Bar Crunch"],
  "theme_parks": ["Busch Gardens Tampa Bay", "Busch Gardens Williamsburg", "Canada's Wonderland", "Cedar Point", "Chimelong Ocean Kingdom", "Disney California Adventure Park", "Disney's Animal Kingdom at Walt Disney World", "Disneyland Paris - Disneyland Park", "Disneyland Paris - Walt Disney Studios Park", "Disneyland Park (Anaheim)", "EPCOT at Walt Disney World", "Everland Yongin Farmland", "Happy Valley Beijing", "Hong Kong Disneyland", "Knott's Berry Farm", "Lotte World", "Magic Kingdom (Walt Disney World)", "OCT East", "Sanya Romance Park", "SeaWorld Orlando", "SeaWorld San Diego", "Shanghai Disney Resort", "Six Flags Great America", "Six Flags Magic Mountain", "Song Dynasty Town", "Tokyo DisneySea", "Tokyo Disneyland", "Universal Studios Florida", "Universal Studios Hollywood", "Universal Studios Islands of Adventure (Orlando)", "Universal Studios Japan", "Walt Disney World - Disney's Hollywood Studios"],
  "fruits": ["Apples", "Apricots", "Avocados", "Bananas", "Blackberries", "Blueberries", "Cantaloupes", "Cherries", "Cranberries", "Dates", "Figs", "Grapes", "Grapefruit", "Guava", "Honeydew Melon", "Kiwi", "Lemons", "Limes", "Mangoes", "Nectarines", "Oranges", "Papaya", "Peaches", "Pears", "Pineapples", "Plums", "Plantains", "Pomegranates", "Raspberries", "Strawberries", "Tangerines", "Watermelons"],
  "dog_breeds": ["Airedale Terrier", "Akita", "Alaskan Malamute", "American Staffordshire Terrier", "Anatolian Shepherd Dog", "Australian Cattle Dog", "Australian Shepherd", "Basenji", "Basset Hound", "Beagle", "Belgian Malinois", "Bernese Mountain Dog", "Bichon Frise", "Biewer Terrier", "Bloodhound", "Border Collie", "Border Terrier", "Boston Terrier", "Bouviers des Flandres", "Boxer", "Boykin Spaniel", "Brittany", "Brussels Griffon", "Bull Terrier", "Bulldog", "Bullmastiff", "Cairn Terrier", "Cane Corso", "Cardigan Welsh Corgi", "Cavalier King Charles Spaniel", "Chesapeake Bay Retriever", "Chihuahua", "Chinese Crested", "Chinese Shar-Pei", "Chow Chow", "Cocker Spaniel", "Collie", "Coton de Tulear", "Dachshund", "Dalmatian", "Doberman Pinscher", "Dogo Argentino", "Dogues de Bordeaux", "English Cocker Spaniel", "English Setter", "English Springer Spaniel", "Flat-Coated Retriever", "French Bulldog", "German Shepherd", "German Shorthaired Pointer", "German Wirehaired Pointer", "Giant Schnauzer", "Golden Retriever", "Great Dane", "Great Pyrenees", "Greater Swiss Mountain Dog", "Havanese", "Irish Setter", "Irish Wolfhound", "Italian Greyhound", "Keeshond", "Labrador Retriever", "Lagotto Romagnolo", "Leonberger", "Lhasa Apso", "Maltese", "Mastiff", "Miniature American Shepherd", "Miniature Pinscher", "Miniature Schnauzer", "Newfoundland", "Nova Scotia Duck Tolling Retriever", "Old English Sheepdog", "Papillion", "Pekingese", "Pembroke Welsh Corgi", "Pomeranian", "Poodle", "Portuguese Water Dog", "Pug", "Rat Terrier", "Rhodesian Ridgeback", "Rottweiler", "Russell Terrier", "Saint Bernard", "Samoyed", "Scottish Terrier", "Shetland Sheepdog", "Shiba Inu", "Shih Tzu", "Siberian Husky", "Soft Coated Wheaten Terrier", "Staffordshire Bull Terrier", "Standard Schnauzer", "Vizsla", "Weimaraner", "West Highland White Terrier", "Whippet", "Wirehaired Pointing Griffon", "Yorkshire Terrier"],
  "empires": ["Abbasid Caliphate", "Achaemenid Empire", "Akkadian Empire", "Almohad Caliphate", "Almoravid dynasty", "Ancient Carthage", "Ashanti Empire", "Austro-Hungarian Empire", "Avar Khaganate", "Ayyubid dynasty", "Aztec Empire", "Belgian colonial empire", "Bornu Empire", "British Empire", "Bulgarian Empire", "Buyid dynasty", "Byzantine Empire", "Caliphate of Córdoba", "Cao Wei", "Chagatai Khanate", "Chu", "Danish Empire", "Delhi Sultanate", "Dutch Empire", "Dzungar Khanate", "Eastern Han dynasty", "Eastern Jin dynasty", "Eastern Maurya Kingdom", "Eastern Turkic Khaganate", "Eastern Wu", "Eastern Zhou", "Elamite Empire", "Emirate of Córdoba", "Empire of Brazil", "Empire of Japan", "Fatimid Caliphate", "First Babylonian Empire", "First French colonial empire", "First French Empire", "First Mexican Empire", "First Portuguese Empire", "First Turkic Khaganate", "Former Qin", "Former Zhao", "Francia", "German colonial empire", "Ghaznavid Empire", "Ghurid dynasty", "Golden Horde Khanate", "Great Seljuq Empire", "Greco-Bactrian Kingdom", "Gupta Empire", "Gurjara-Pratihara dynasty", "Hephthalite Empire", "Holy Roman Empire", "Hunnic Empire", "Huns", "Hyksos", "Ilkhanate", "Inca Empire", "Indo-Greek Kingdom", "Indo-Scythian Kingdom", "Indus Valley civilisation", "Italian Empire", "Jin dynasty (1115-1234)", "Khazar Khanate", "Khmer Empire", "Khwarazmian Empire", "Kievan Rus'", "Kingdom of Aksum", "Kingdom of France (Middle Ages)", "Kosala", "Kushan Empire", "Lagash", "Larsa", "Later Zhao", "Latin Empire", "Liang dynasty", "Liao dynasty", "Liu Song dynasty", "Lydia", "Macedonian Empire", "Magadha", "Mali Empire", "Mamluk Sultanate", "Maratha Confederacy", "Maurya Empire", "Median Empire", "Middle Assyrian Empire", "Middle Hittite Kingdom", "Middle Kingdom of Egypt", "Ming dynasty", "Mitanni", "Mongol Empire", "Mughal Empire", "Nazi Germany", "Neo-Assyrian Empire", "Neo-Babylonian Empire", "Neo-Sumerian Empire", "New Hittite Kingdom", "New Kingdom of Egypt", "Northern Qi", "Northern Song dynasty", "Northern Wei", "Northern Xiongnu", "Northern Yuan dynasty", "Northern Zhou", "Old Assyrian Empire", "Old Hittite Empire", "Old Kingdom of Egypt", "Ottoman Empire", "Oyo Empire", "Parthian Empire", "Phrygia", "Polish-Lithuanian Commonwealth", "Ptolemaic Kingdom", "Pushyabhuti dynasty", "Qajar Empire", "Qara Khitai", "Qin dynasty", "Qing dynasty", "Rashidun Caliphate", "Roman Empire", "Rouran Khaganate", "Rozvi Empire", "Russian Empire", "Safavid empire", "Samanid Empire", "Sasanian Empire", "Satavahana dynasty", "Scythia", "Second Dynasty of Isin", "Second French colonial empire", "Second Portuguese Empire", "Seleucid Empire", "Shang dynasty", "Shu Han", "Sikh Empire", "Sokoto Caliphate", "Songhai Empire", "Southern Song dynasty", "Spanish Empire", "Srivijaya", "Sui dynasty", "Sumer", "Swedish Empire", "Tahirid dynasty", "Tang dynasty", "Tarascan empire", "Third Portuguese Empire", "Tibetan Empire", "Timurid Empire", "Twenty-fifth Dynasty of Egypt", "Twenty-sixth Dynasty of Egypt", "Umayyad Caliphate", "Urartu", "Uyghur Khaganate", "Visigothic Kingdom", "Western Han dynasty", "Western Jin dynasty", "Western Roman Empire", "Western Satraps", "Western Turkic Khaganate", "Western Xia", "Western Xiongnu", "Xia dynasty", "Xianbei state", "Xin dynasty", "Xiongnu Empire", "Yuan dynasty", "Zhou dynasty", "Zulu Empire"],
  "fast_food_chains": ["McDonald's", "Starbucks", "Chick-fil-A", "Taco Bell", "Wendy's", "Dunkin'", "Subway", "Burger King", "Domino's", "Chipotle", "Panera bread", "Pizza hut", "Sonic drive-in", "Panda express", "Kfc", "Popeyes louisiana kitchen", "Dairy queen", "Arby's", "Jack in the box", "Papa johns", "Little caesars", "Whataburger", "Raising cane's", "Culver's", "Jersey mike's", "Wingstop", "Zaxby's", "Jimmy john's", "Five guys", "Hardee's", "Bojangles", "Carl's jr.", "Dutch bros", "Firehouse subs", "In-n-out burger", "Tropical smoothie café", "El pollo loco", "Crumbl cookies", "Qdoba", "Shake shack", "Krispy kreme", "Marco's pizza", "Del taco", "Mcalister's deli", "Checkers/rally's", "Freddy's frozen custard & steakburgers", "Church's chicken", "Papa murphy's", "Moe's", "Baskin-robbins"],
  "oceans_april_fools": ["Arctic Ocean", "Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Southern Ocean", "Big Ocean", "Tiny Ocean", "Lake Michigan", "Ocean's 11", "Frank Ocean", "Ocean Sрray Cranberry Juice", "Irish Crooner Frank O'Shin", "The 1997 song 'Ocean Man' by Ween"],
  "mlb_teams": ["Arizona Diamondbacks", "Atlanta Braves", "Baltimore Orioles", "Boston Red Sox", "Chicago White Sox", "Chicago Cubs", "Cincinnati Reds", "Cleveland Guardians", "Colorado Rockies", "Detroit Tigers", "Houston Astros", "Kansas City Royals", "Los Angeles Angels", "Los Angeles Dodgers", "Miami Marlins", "Milwaukee Brewers", "Minnesota Twins", "New York Yankees", "New York Mets", "Oakland Athletics", "Philadelphia Phillies", "Pittsburgh Pirates", "San Diego Padres", "San Francisco Giants", "Seattle Mariners", "St. Louis Cardinals", "Tampa Bay Rays", "Texas Rangers", "Toronto Blue Jays", "Washington Nationals"],
  "nba_players": ["LeBron James", "Kareem Abdul-Jabbar", "Karl Malone", "Kobe Bryant", "Michael Jordan", "Dirk Nowitzki", "Wilt Chamberlain", "Julius Erving", "Moses Malone", "Kevin Durant", "Shaquille O'Neal", "Bill Russell", "Carmelo Anthony", "Dan Issel", "Elvin Hayes", "Hakeem Olajuwon", "Oscar Robertson", "Dominique Wilkins", "George Gervin", "Tim Duncan", "Paul Pierce", "John Havlicek", "Kevin Garnett", "James Harden", "Vince Carter", "Alex English", "Rick Barry", "Reggie Miller", "Jerry West", "Russell Westbrook", "Artis Gilmore", "Patrick Ewing", "Ray Allen", "Allen Iverson", "Charles Barkley", "Stephen Curry", "DeMar DeRozan", "Robert Parish", "Adrian Dantley", "Dwyane Wade", "Elgin Baylor", "Chris Paul", "Clyde Drexler", "Gary Payton", "Larry Bird", "Hal Greer", "Damian Lillard", "Walt Bellamy", "Pau Gasol", "Bob Pettit", "David Robinson", "LaMarcus Aldridge", "Mitch Richmond", "Joe Johnson", "Tom Chambers", "Antawn Jamison", "John Stockton", "Bernard King", "Clifford Robinson", "Walter Davis", "Dwight Howard", "Tony Parker", "Terry Cummings", "Jamal Crawford", "Bob Lanier", "Eddie Johnson", "Gail Goodrich", "Reggie Theus", "Dale Ellis", "Scottie Pippen", "Jason Terry", "Chet Walker", "Isiah Thomas", "Bob McAdoo", "Zach Randolph", "Mark Aguirre", "Magic Johnson", "Nikola Jokić", "Giannis Antetokounmpo", "Steve Nash", "Jason Kidd"],
  "game_shows": ["Are You Smarter Than A 5th Grader?", "Cash Cab", "Deal Or No Deal", "Double Dare", "Family Feud", "Jeopardy!", "Let's Make A Deal", "Love Connection", "Match Game", "Press Your Luck", "Pyramid", "Supermarket Sweep", "The Chase", "The Dating Game", "The Gong Show", "The Hollywood Squares", "The Newlywed Game", "The Price Is Right", "The Weakest Link", "To Tell The Truth", "What's my line?", "Wheel Of Fortune", "Who Wants To Be A Millionaire?", "Whose Line Is It Anyway?"],
  "board_games": ["Chess", "Checkers", "Monopoly", "Scrabble", "Clue", "Risk", "Candy Land", "Life", "Battleship", "Chutes and Ladders", "Connect Four", "Operation", "Sorry!", "Trivial Pursuit", "Yahtzee", "Pictionary", "Taboo", "Balderdash", "Cranium", "Apples to Apples", "Settlers of Catan", "Ticket to Ride", "Dominion", "Carcassonne", "Pandemic", "Rummikub", "Othello", "Stratego", "Mastermind", "Mancala"],
  "dog_names": ["Bailey", "Bear", "Bella", "Buddy", "Buster", "Charlie", "Coco", "Cooper", "Daisy", "Duke", "Ginger", "Harley", "Lola", "Lucky", "Lucy", "Luna", "Maggie", "Max", "Milo", "Molly", "Oscar", "Rocky", "Rosie", "Ruby", "Rusty", "Sadie", "Sam", "Shadow", "Sophie", "Stella", "Toby", "Vinny", "Zoe"],
  "celestial_bodies": ["Sun", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"],
  "planets": ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"],
  "wii_games": ["Wii Sports", "Mario Kart Wii", "Wii Sports Resort", "New Super Mario Bros. Wii", "Wii Play", "Wii Fit", "Wii Fit Plus", "Super Smash Bros. Brawl", "Super Mario Galaxy", "Just Dance 3", "Wii Party", "Mario Party 8", "The Legend of Zelda: Twilight Princess", "Super Mario Galaxy 2", "Mario & Sonic at the Olympic Games", "Donkey Kong Country Returns", "Mario & Sonic at the Olympic Winter Games", "Link's Crossbow Training", "Lego Star Wars: The Complete Saga", "Just Dance 2", "Animal Crossing: City Folk", "Just Dance", "Super Paper Mario", "The Legend of Zelda: Skyward Sword", "Big Brain Academy: Wii Degree", "Mario Party 9", "Wii Music", "Mario Strikers Charged", "Mario & Sonic at the London 2012 Olympic Games", "WarioWare: Smooth Moves", "Mario Super Sluggers", "Super Mario All-Stars: 25th Anniversary Edition", "Sonic Colors", "Guitar Hero III: Legends of Rock", "Michael Jackson: The Experience", "Resident Evil 4: Wii Edition", "Deca Sports", "Epic Mickey", "Game Party", "Mario Sports Mix", "Pokémon Battle Revolution", "Kirby's Return to Dream Land", "Monster Hunter Tri", "Kirby's Epic Yarn", "EA Sports Active", "New Play Control! Mario Power Tennis", "Carnival Games", "Metroid Prime 3: Corruption", "Guitar Hero World Tour", "Resident Evil: The Umbrella Chronicles", "Wii Play: Motion", "PokéPark Wii: Pikachu's Adventure", "Rayman Raving Rabbids", "We Ski", "Big Beach Sports", "Punch-Out!!", "Wario Land: Shake It!", "Active Life: Outdoor Challenge", "Call of Duty: World at War", "Red Steel", "Rock Band", "Zumba Fitness", "Super Mario Bros. 3", "Game Party 2"],
  "bond_movies": ["A View to a Kill (1985)", "Casino Royale (1967)", "Casino Royale (2006)", "Diamonds Are Forever (1971)", "Die Another Day (2002)", "Dr. No (1962)", "For Your Eyes Only (1981)", "From Russia with Love (1963)", "GoldenEye (1995)", "Goldfinger (1964)", "Licence to Kill (1989)", "Live and Let Die (1973)", "Moonraker (1979)", "Never Say Never Again (1983)", "No Time to Die (2021)", "Octopussy (1983)", "On Her Majesty's Secret Service (1969)", "Quantum of Solace (2008)", "Skyfall (2012)", "Spectre (2015)", "The Living Daylights (1987)", "The Man with the Golden Gun (1974)", "The Spy Who Loved Me (1977)", "The World Is Not Enough (1999)", "Thunderball (1965)", "Tomorrow Never Dies (1997)", "You Only Live Twice (1967)"],
  "concert_tours": ["AC/DC (Black Ice World Tour)", "Beyoncé (Renaissance World Tour)", "Bruce Springsteen & The E Street Band (2023 Tour)", "Coldplay (A Head Full of Dreams Tour)", "Coldplay (Music of the Spheres World Tour)", "Ed Sheeran (+–=÷× Tour)", "Ed Sheeran (÷ Tour)", "Elton John (Farewell Yellow Brick Road)", "Guns N' Roses (Not in This Lifetime... Tour)", "Harry Styles (Love On Tour)", "Madonna (Sticky & Sweet Tour)", "Metallica (WorldWired Tour)", "Pink (Beautiful Trauma World Tour)", "Roger Waters (The Wall Live)", "Taylor Swift (The Eras Tour)", "The Rolling Stones (A Bigger Bang Tour)", "The Rolling Stones (No Filter Tour)", "U2 (The Joshua Tree Tours 2017 & 2019)", "U2 (U2 360° Tour)", "U2 (Vertigo Tour)"],
  "actresses": ["Anne Hathaway", "Audrey Hepburn", "Bette Davis", "Cate Blanchett", "Catherine Zeta-Jones", "Charlize Theron", "Dianne Wiest", "Dorothy Malone", "Elizabeth Taylor", "Emma Stone", "Emma Thompson", "Frances McDormand", "Geraldine Page", "Glenda Jackson", "Glenn Close", "Greer Garson", "Gwyneth Paltrow", "Halle Berry", "Helen Hayes", "Helen Mirren", "Hilary Swank", "Holly Hunter", "Ingrid Bergman", "Jane Fonda", "Jennifer Hudson", "Jennifer Lawrence", "Jessica Lange", "Jodie Foster", "Judi Dench", "Julia Roberts", "Julianne Moore", "Kate Winslet", "Katharine Hepburn", "Luise Rainer", "Maggie Gyllenhaal", "Maggie Smith", "Marlee Matlin", "Melissa Leo", "Meryl Streep", "Mo'Nique", "Natalie Portman", "Nicole Kidman", "Octavia Spencer", "Olivia de Havilland", "Reese Witherspoon", "Renée Zellweger", "Sally Field", "Sandra Bullock", "Shelley Winters", "Sissy Spacek", "Vivien Leigh", "Whoopi Goldberg", "Winona Ryder"],
  "game_consoles": ["PlayStation 2", "Nintendo DS", "Nintendo Switch", "Game Boy & Game Boy Color", "PlayStation 4", "PlayStation", "Wii", "PlayStation 3", "Xbox 360", "Game Boy Advance", "PlayStation Portable", "Nintendo 3DS", "Family Computer/Nintendo Entertainment System", "Xbox One", "PlayStation 5 ", "Super Famicom/Super Nintendo Entertainment System", "Nintendo 64", "Mega Drive/Sega Genesis", "Atari 2600", "Xbox", "GameCube", "Xbox Series X/S ", "Quest 2 ", "Wii U", "PlayStation Vita", "Master System", "V.Smile & V.Motion", "Game Gear", "PC Engine/TurboGrafx-16", "Sega Saturn", "Dreamcast", "Master System (Brazilian variants)", "Dendy (famiclone)", "Super NES Classic Edition", "Advanced Pico Beena", "NES Classic Edition", "WonderSwan & WonderSwan Color", "Sega Pico", "Color TV-Game", "Intellivision", "Mega Drive (Brazilian variants)", "N-Gage", "ColecoVision", "3DO Interactive Multiplayer", "Neo Geo Pocket & Neo Geo Pocket Color", "Magnavox Odyssey²", "Sega SG-1000", "Oculus Go", "Atari 7800", "Atari Lynx", "Philips CD-i", "Telstar", "Atari 5200", "Pegasus (famiclone)"],
  "nba_teams": ["Boston Celtics", "Brooklyn Nets", "New York Knicks", "Philadelphia 76ers", "Toronto Raptors", "Golden State Warriors", "Los Angeles Clippers", "Los Angeles Lakers", "Phoenix Suns", "Sacramento Kings", "Chicago Bulls", "Cleveland Cavaliers", "Detroit Pistons", "Indiana Pacers", "Milwaukee Bucks", "Dallas Mavericks", "Houston Rockets", "Memphis Grizzlies", "New Orleans Hornets", "San Antonio Spurs", "Atlanta Hawks", "Charlotte Bobcats", "Miami Heat", "Orlando Magic", "Washington Wizards", "Denver Nuggets", "Minnesota Timberwolves", "Oklahoma City Thunder", "Portland Trail Blazers", "Utah Jazz"],
  "us_cities": ["New York City", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "Austin", "Jacksonville", "San Jose", "Fort Worth", "Columbus", "Charlotte", "Indianapolis", "San Francisco", "Seattle", "Denver", "Oklahoma City", "Nashville", "El Paso", "Washington", "Las Vegas", "Boston", "Portland", "Louisville", "Memphis", "Detroit", "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Mesa", "Kansas City", "Atlanta", "Colorado Springs", "Omaha", "Raleigh", "Virginia Beach", "Long Beach", "Miami", "Oakland", "Minneapolis", "Tulsa", "Bakersfield", "Tampa", "Wichita", "Arlington", "Aurora", "New Orleans", "Cleveland", "Anaheim", "Honolulu", "Henderson", "Stockton", "Riverside", "Lexington", "Corpus Christi", "Orlando", "Irvine", "Cincinnati", "Santa Ana", "Newark", "Saint Paul", "Pittsburgh", "Greensboro", "Lincoln", "Durham", "Plano", "Anchorage", "Jersey City", "St. Louis"],
  "energy_drinks": ["Adrenaline Shock", "Alani Nu", "Bang", "C4", "Celsius", "Fuel", "Full Throttle", "Ghost", "Monster", "Mtn Dew", "NOS", "Prime", "Red Bull", "Redline", "Reign", "Rockstar", "Up Time", "V8", "Venom", "Zoa"],
  "nfl_teams": ["Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills", "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns", "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers", "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs", "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins", "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants", "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers", "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"],
  "pixar_movies": ["Toy Story", "A Bug's Life", "Toy Story 2", "Monsters, Inc.", "Finding Nemo", "The Incredibles", "Cars", "Ratatouille", "WALL-E", "Up", "Toy Story 3", "Cars 2", "Brave", "Monsters University", "Inside Out", "The Good Dinosaur", "Finding Dory", "Cars 3", "Coco", "Incredibles 2", "Toy Story 4", "Onward", "Soul", "Luca", "Turning Red", "Lightyear", "Elemental"],
  "passwords": ["123456", "admin", "12345678", "123456789", "1234", "12345", "password", "123", "Aa123456", "1234567890", "1234567", "123123", "111111", "Password", "12345678910", "000000", "admin123", "1111", "P@ssw0rd", "root", "654321", "qwerty", "Pass@123", "112233", "102030", "ubnt", "abc123", "Aa@123456", "abcd1234", "1q2w3e4r", "123321", "qwertyuiop", "87654321", "987654321", "Eliska81", "123123123", "11223344", "0987654321", "demo", "12341234", "qwerty123", "Admin@123", "1q2w3e4r5t", "11111111", "pass", "Demo@123", "azerty", "admintelecom", "Admin", "123meklozed", "666666", "0123456789", "121212", "1234qwer", "admin@123", "1qaz2wsx", "123456789a", "Aa112233", "asdfghjkl", "Password1", "888888", "admin1", "test", "Aa123456@", "asd123", "qwer1234", "123qwe", "202020", "asdf1234", "Abcd@1234", "12344321", "aa123456", "1122334455", "Abcd1234", "guest", "88888888", "Admin123", "secret", "1122", "admin1234", "administrator", "Password@123", "q1w2e3r4", "10203040", "a123456", "12345678a", "555555", "zxcvbnm", "welcome", "Abcd@123", "Welcome@123", "minecraft", "101010", "Pass@1234", "123654", "123456a", "India@123", "Ar123455", "159357", "qwe123", "54321", "password1", "1029384756", "1234567891", "vodafone", "jimjim30", "Cindylee1", "1111111111", "azertyuiop", "999999", "adminHW", "10203", "gvt12345", "12121212", "12345678901", "222222", "7777777", "12345678900", "Kumar@123", "147258", "qwerty12345", "asdasd", "abc12345", "bismillah", "Heslo1234", "1111111", "a123456789", "iloveyou", "Passw0rd", "aaaaaa", "Flores123", "12qwaszx", "Welcome1", "password123", "123mudar", "123456aA@", "123qweasd", "868689849", "1234554321", "motorola", "q1w2e3r4t5", "1234512345", "undefined", "1q2w3e", "a1b2c3d4", "admin123456", "2402301978", "Qwerty123", "1qazxsw2", "test123", "Adam2312", "Password123", "1234567899", "Aa195043", "Test@123", "111111111", "admin12345", "zaq12wsx", "adminadmin", "ADMIN", "1234abcd", "Menara", "qwerty1234", "123abc", "theworldinyourhand", "123456a@", "Aa102030", "987654", "Mm123456", "p@ssw0rd", "Abc@1234", "131313", "1a2b3c4d", "123654789", "changeme", "12345679", "student", "senha123", "1234567a", "user1234", "abc123456", "master", "12345qwert", "1234561", "adminisp", "azerty123", "pakistan", "aaaaaaaa", "a1234567", "P@55w0rd", "P@$$w0rd", "qwerty123456", "55555", "lol12345", "Aa123456789", "999999999", "786786", "asdasd123", "test1234", "samsung"],
  "media_franchises": ["Aladdin", "Angry Birds", "Anpanman", "Astro Boy", "Avatar", "Avengers", "Barbie", "Batman", "Beauty and the Beast", "Ben 10", "Beyblade", "Black Panther", "Blue's Clues", "Bob the Builder", "Bourne", "Bratz", "Cabbage Patch Kids", "Call of Duty", "Candy Crush", "Captain America", "Care Bears", "Cars", "DC Extended Universe (DCEU)", "Demon Slayer: Kimetsu no Yaiba", "Despicable Me (Minions)", "Disney Princess", "Dora the Explorer", "Dragon Ball", "Dungeon Fighter Online (DFO)", "E.T. the Extra-Terrestrial", "Fast & Furious", "Fate (Fate/stay night)", "Finding Nemo", "Fortnite", "Friends", "Frozen", "G.I. Joe", "Genshin Impact", "Ghostbusters", "Godzilla (Gojira)", "Gran Turismo", "Grand Theft Auto (GTA)", "Guardians of the Galaxy", "Guitar Hero", "Gundam", "Halo", "Hamtaro", "Hello Kitty", "Ice Age", "Indiana Jones", "Iron Man", "James Bond", "Jumanji", "Jurassic Park", "Kumamon", "Kung Fu Panda", "Lego", "Looney Tunes", "Madagascar", "Madden NFL", "Mamma Mia", "Mario", "Marvel Cinematic Universe (MCU)", "Men in Black", "Mickey Mouse & Friends", "Middle-earth (The Lord of the Rings)", "Minecraft", "Mission: Impossible", "Monster Strike", "MonsterVerse", "Mortal Kombat", "My Little Pony", "NBA Jam", "Neon Genesis Evangelion", "Pac-Man", "PAW Patrol", "Peanuts", "Pirates of the Caribbean", "Planet of the Apes", "Pokemon", "Resident Evil (Biohazard)", "Rilakkuma", "Sailor Moon", "Scooby-Doo", "Seinfeld", "Sesame Street (The Muppets)", "Shrek", "Skylanders", "Sonic the Hedgehog", "Space Invaders", "Spider-Man", "SpongeBob SquarePants", "Star Trek", "Star Wars", "Strawberry Shortcake", "Street Fighter", "Super Sentai / Power Rangers", "Superman", "Teenage Mutant Ninja Turtles", "Terminator", "The Big Bang Theory", "The Chronicles of Narnia", "The Conjuring Universe", "The Elder Scrolls", "The Hunger Games", "The Incredibles", "The Lion King", "The Little Mermaid", "The Phantom of the Opera", "The Powerpuff Girls", "The Simpsons", "The Sims", "The Smurfs", "Thomas & Friends", "Thor", "Titanic", "Toy Story", "Transformers", "Twilight", "Ultra Series (Ultraman)", "Warcraft", "Winnie the Pooh", "Winx Club", "Wizarding World (Harry Potter)", "X-Men", "Yo-kai Watch", "Yu-Gi-Oh!"],
  "nyc_boroughs": ["The Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"],
  "lotr_characters": ["Aragorn", "Arwen", "Bilbo Baggins", "Boromir", "Elrond", "Frodo Baggins", "Galadriel", "Gandalf", "Gimli", "Gollum", "Legolas", "Meriadoc Brandybuck (Merry)", "Peregrin Took (Perry)", "Samwise Gamgee", "Saruman", "Sauron", "Theoden"],
  "rappers": ["2Pac", "50 Cent", "A Tribe Called Quest", "Anderson .Paak", "André 3000", "Busta Rhymes", "Childish Gambino", "Common", "Dr. Dre", "Drake", "Eminem", "Ice Cube", "J. Cole", "Jay-Z", "Kanye West", "Kendrick Lamar", "LL Cool J", "Lauryn Hill", "Lil Wayne", "Ludacris", "M.I.A.", "Missy Elliott", "Mobb Deep", "N.W.A", "Nas", "Nicki Minaj", "Notorious B.I.G", "Outkast", "Pharrell Williams", "Public Enemy", "Run-D.M.C.", "Snoop Dogg", "T.I.", "The Roots", "Tyler, the Creator", "Wu-Tang Clan"],
  "grocery_stores": ["Acme Markets", "Albertsons", "Aldi", "BJ's Wholesale Club", "Bashas'", "Big Y", "Brookshire's", "Costco", "Cub Foods", "Dillons", "Fareway", "Festival Foods", "Food Lion", "Fred Meyer", "Giant Eagle", "Giant Food", "H-E-B", "Harris Teeter", "Harveys Supermarket", "Hy-Vee", "Ingles", "Jewel-Osco", "King Kullen", "Kroger", "Lowes Foods", "Lucky", "Market Basket", "Meijer", "Piggly Wiggly", "Price Chopper", "Publix", "QFC", "Ralphs", "Safeway", "Sam's Club", "Save Mart Supermarkets", "Shaw's", "ShopRite", "Smart & Final", "Sprouts Farmers Market", "Stater Bros.", "Stop & Shop", "Super 1 Foods", "Superior Grocers", "Target", "Trader Joe's", "Vons", "Walmart", "Wegmans", "Whole Foods Market", "WinCo Foods", "Winn-Dixie"],
  "star_wars_movies": ["Star Wars: Episode IV - A New Hope (1977)", "Star Wars: Episode V - The Empire Strikes Back (1980)", "Star Wars: Episode VI - Return of the Jedi (1983)", "Star Wars: Episode I - The Phantom Menace (1999)", "Star Wars: Episode II - Attack of the Clones (2002)", "Star Wars: Episode III - Revenge of the Sith (2005)", "Star Wars: The Clone Wars (2008)", "Star Wars: The Force Awakens (2015)", "Rogue One: A Star Wars Story (2016)", "Star Wars: The Last Jedi (2017)", "Solo: A Star Wars Story (2018)", "Star Wars: The Rise of Skywalker (2019)"],
  "best_picture_winners": ["Nomadland (2020)", "Parasite (2019)", "Green Book (2018)", "The Shape of Water (2017)", "Moonlight (2016)", "Spotlight (2015)", "Birdman or (The Unexpected Virtue of Ignorance) (2014)", "12 Years a Slave (2013)", "Argo (2012)", "The Artist (2011)", "The King's Speech (2010)", "The Hurt Locker (2008)", "Slumdog Millionaire (2008)", "No Country for Old Men (2007)", "The Departed (2006)", "Crash (2004)", "Million Dollar Baby (2004)", "The Lord of the Rings: The Return of the King (2003)", "Chicago (2002)", "A Beautiful Mind (2001)", "Gladiator (2000)", "American Beauty (1999)", "Shakespeare in Love (1998)", "Titanic (1997)", "The English Patient (1996)", "Braveheart (1995)", "Forrest Gump (1994)", "Schindler's List (1993)", "Unforgiven (1992)", "The Silence of the Lambs (1991)", "Dances with Wolves (1990)", "Driving Miss Daisy (1989)", "Rain Man (1988)", "The Last Emperor (1987)", "Platoon (1986)", "Out of Africa (1985)", "Amadeus (1984)", "Terms of Endearment (1983)", "Gandhi (1982)", "Chariots of Fire (1981)", "Ordinary People (1980)", "Kramer vs. Kramer (1979)", "The Deer Hunter (1978)", "Annie Hall (1977)", "Rocky (1976)", "One Flew Over the Cuckoo's Nest (1975)", "The Godfather Part II (1974)", "The Sting (1973)", "The Godfather (1972)", "The French Connection (1971)", "Patton (1970)", "Midnight Cowboy (1969)", "Oliver! (1968)", "In the Heat of the Night (1967)", "A Man for All Seasons (1966)", "The Sound of Music (1965)", "My Fair Lady (1964)", "Tom Jones (1963)", "Lawrence of Arabia (1962)", "West Side Story (1961)", "The Apartment (1960)", "Ben-Hur (1959)", "Gigi (1958)", "The Bridge on the River Kwai (1957)", "Around the World in 80 Days (1956)", "Marty (1955)", "On the Waterfront (1954)", "From Here to Eternity (1953)", "The Greatest Show on Earth (1952)", "An American in Paris (1951)", "All About Eve (1950)", "All the King's Men (1949)", "Hamlet (1948)", "Gentleman's Agreement (1947)", "The Best Years of Our Lives (1946)", "The Lost Weekend (1945)", "Going My Way (1944)", "Casablanca (1942)", "Mrs. Miniver (1942)", "How Green Was My Valley (1941)", "Rebecca (1940)", "Gone with the Wind (1939)", "You Can't Take It with You (1938)", "The Life of Emile Zola (1937)", "The Great Ziegfeld (1936)", "Mutiny on the Bounty (1935)", "It Happened One Night (1934)", "Cavalcade (1933)", "Grand Hotel (1932)", "Cimarron (1931)", "All Quiet on the Western Front (1930)", "The Broadway Melody (1929)", "Wings (1927)"],
  "book_series": ["A Series of Unfortunate Events", "A Song of Ice and Fire", "Alex Cross", "All Creatures Great and Small", "American Girl", "Anpanman (アンパンマン)", "Berenstain Bears", "Captain Underpants", "Chicken Soup for the Soul", "Choose Your Own Adventure", "Clifford the Big Red Dog", "Diary of a Wimpy Kid", "Dirk Pitt", "Discworld", "Fear Street", "Fifty Shades", "Frank Merriwell", "Geronimo Stilton", "Goosebumps", "Harry Potter", "Jack Reacher", "James Bond", "Left Behind", "Little Critter", "Little House on the Prairie", "Magic Tree House series", "Martine", "Men Are from Mars, Women Are from Venus", "Millennium", "Mr. Men", "Nancy Drew", "Nijntje (Miffy)", "Noddy", "OSS 117", "Percy Jackson & the Olympians", "Perry Mason", "Peter Rabbit", "Pippi Långstrump (Pippi Longstocking)", "Robert Langdon", "SAS", "San-Antonio", "Star Wars", "Sweet Valley High", "Tarzan", "The Baby-sitters Club", "The Bobbsey Twins", "The Chronicles of Narnia", "The Hardy Boys", "The Hunger Games", "The Magic School Bus", "The Railway Series", "The Vampire Chronicles", "The Wheel of Time", "Twilight", "Where's Wally?", "Winnie-the-Pooh", "宮本武蔵 (Musashi)"],
  "us_presidents": ["Abraham Lincoln", "Andrew Jackson", "Andrew Johnson", "Barack Obama", "Benjamin Harrison", "Bill Clinton", "Calvin Coolidge", "Chester A. Arthur", "Donald Trump", "Dwight D. Eisenhower", "Franklin D. Roosevelt", "Franklin Pierce", "George H. W. Bush", "George W. Bush", "George Washington", "Gerald Ford", "Grover Cleveland", "Grover Cleveland", "Harry S. Truman", "Herbert Hoover", "James A. Garfield", "James Buchanan", "James K. Polk", "James Madison", "James Monroe", "Jimmy Carter", "Joe Biden", "John Adams", "John F. Kennedy", "John Quincy Adams", "John Tyler", "Lyndon B. Johnson", "Martin Van Buren", "Millard Fillmore", "Richard Nixon", "Ronald Reagan", "Rutherford B. Hayes", "Theodore Roosevelt", "Thomas Jefferson", "Ulysses S. Grant", "Warren G. Harding", "William Henry Harrison", "William Howard Taft", "William McKinley", "Woodrow Wilson", "Zachary Taylor"],
  "football_clubs": ["AC Milan", "Ajax", "Arsenal", "Aston Villa", "Atlético Madrid", "Barcelona", "Bayer Leverkusen", "Bayern Munich", "Benfica", "Borussia Dortmund", "Borussia Mönchengladbach", "Celtic", "Chelsea", "Club Brugge", "Eintracht Frankfurt", "Feyenoord", "Fiorentina", "Hamburger SV", "Inter Milan", "Juventus", "Leeds United", "Liverpool", "Malmö FF", "Manchester City", "Manchester United", "Marseille", "Monaco", "Nottingham Forest", "PSV Eindhoven", "Panathinaikos", "Paris Saint-Germain", "Partizan", "Porto", "Real Madrid", "Red Star Belgrade", "Reims", "Roma", "Saint-Étienne", "Sampdoria", "Steaua București", "Tottenham Hotspur", "Valencia"],
  "emmy_tv_shows": ["24", "All in the Family", "American Masters", "Boardwalk Empire", "Cheers", "Dancing with the Stars", "ER", "Frasier", "Game of Thrones", "Hill Street Blues", "Last Week Tonight With John Oliver", "Modern Family", "Murphy Brown", "NYPD Blue", "RuPaul's Drag Race", "Saturday Night Live", "Star Trek", "Succession", "Taxi", "The Carol Burnett Show", "The Crown", "The Marvelous Mrs. Maisel", "The Mary Tyler Moore Show", "The Simpsons", "The Sopranos", "The West Wing", "Veep", "Will & Grace"],
  "pokemon_types": ["Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting", "Fire", "Flying", "Ghost", "Grass", "Ground", "Ice", "Normal", "Poison", "Psychic", "Rock", "Steel", "Water"],
  "university_stadiums": ["Autzen Stadium (University of Oregon)", "Beaver Stadium (Penn State University)", "Ben Hill Griffin Stadium (University of Florida)", "Bryant–Denny Stadium (University of Alabama)", "Camp Randall Stadium (University of Wisconsin–Madison)", "Clemson Memorial Stadium (Clemson University)", "Cotton Bowl (University of Texas at Dallas)", "Darrell K Royal–Texas Memorial Stadium (University of Texas at Austin)", "Doak Campbell Stadium (Florida State University)", "Donald W. Reynolds Razorback Stadium (University of Arkansas)", "Gaylord Family Oklahoma Memorial Stadium (University of Oklahoma)", "Husky Stadium (University of Washington)", "Jordan–Hare Stadium (Auburn University)", "Kinnick Stadium (University of Iowa)", "Kyle Field (Texas A&M University)", "Lincoln Financial Field (Temple University)", "Los Angeles Memorial Coliseum (University of Southern California)", "Memorial Stadium (University of Nebraska–Lincoln)", "Michigan Stadium (University of Michigan)", "Neyland Stadium (University of Tennessee)", "Notre Dame Stadium (University of Notre Dame)", "Ohio Stadium (Ohio State University)", "Rose Bowl (University of California, Los Angeles)", "Spartan Stadium (Michigan State University)", "Tiger Stadium (Louisiana State University)", "Williams-Brice Stadium (University of South Carolina)"],
  "swiss_watch_brands": ["Audemars Piguet", "Baume & Mercier", "Blancpain", "Breguet", "Breitling", "Bvlgari", "Cartier", "Chanel", "Chopard", "Corum", "Franck Muller", "Girard-Perregaux", "Hamilton", "Hublot", "Hermes", "IWC Schaffhausen", "Jaeger-LeCoultre", "Lange & Söhne", "Longines", "Omega", "Oris", "Patek Philippe", "Piaget", "Rolex", "Richard Mille", "Swatch", "TAG Heuer", "Tissot", "Tudor", "Ulysse Nardin", "Vacheron Constantin", "Zenith"],
  "burger_chains": ["A&W Restaurants", "Arby's", "Burger King", "Carl's Jr.", "Checkers Drive-In Restaurants", "Culver's", "Dairy Queen", "Five Guys", "Fuddruckers", "Hardee's", "In-N-Out Burger", "Jack In The Box", "Krystal Co.", "McDonald's", "Shake Shack", "Sonic Drive-In", "Steak 'n Shake", "Tasty Burger", "Wendy's", "Whataburger", "White Castle"],
  "harry_potter_movies": ["Harry Potter and the Philosopher's Stone", "Harry Potter and the Chamber of Secrets", "Harry Potter and the Prisoner of Azkaban", "Harry Potter and the Goblet of Fire", "Harry Potter and the Order of the Phoenix", "Harry Potter and the Half-Blood Prince", "Harry Potter and the Deathly Hallows – Part 1", "Harry Potter and the Deathly Hallows – Part 2", "Fantastic Beasts and Where to Find Them", "Fantastic Beasts: The Crimes of Grindelwald", "Fantastic Beasts: The Secrets of Dumbledore"],
  "directors": ["Alfred Hitchcock", "Barry Levinson", "Barry Sonnenfeld", "Brett Ratner", "Bryan Singer", "Chris Columbus", "Christopher Nolan", "Coen Brothers", "David Fincher", "Dude Perfect", "Francis Ford Coppola", "Frank Darabont", "Frank Marshall", "George Lucas", "Gore Verbinski", "Guy Ritchie", "Harold Ramis", "Irwin Winkler", "Ivan Reitman", "J.J. Abrams", "James Cameron", "Jay Roach", "Jim Henson", "Joel Coen", "John Hughes", "John Landis", "John Lasseter", "Jon Turteltaub", "Joss Whedon", "Judd Apatow", "Luc Besson", "Martin Scorsese", "Mel Gibson", "Michael Bay", "Michael Mann", "Mike Nichols", "Peter Jackson", "Quentin Tarantino", "Rian Johnson", "Ridley Scott", "Rob Reiner", "Roland Emmerich", "Ron Howard", "Steven Spielberg", "The Wachowskis", "Tim Burton", "Todd Phillips", "Tony Scott", "Tyler Perry", "Woody Allen"],
  "nations": ["San Marino", "Gibraltar", "British Virgin Islands", "Zimbabwe", "Central African Republic", "Libya", "Niger", "Faroe Islands", "Comoros", "Sudan", "Antigua and Barbuda", "Solomon Islands", "Latvia", "Philippines", "Malaysia", "Kuwait", "Turkmenistan", "Rwanda", "Burundi", "Nicaragua", "Ethiopia", "Suriname", "Lithuania", "St Kitts and Nevis", "Tanzania", "Malawi", "Togo", "Azerbaijan", "India", "Lebanon", "Mauritania", "Trinidad and Tobago", "Aotearoa New Zealand", "Kazakhstan", "Kenya", "Congo", "Guatemala", "Madagascar", "Eswatini", "Kosovo", "Estonia", "Guinea-Bissau", "Thailand", "Namibia", "Korea DPR", "Angola", "Mozambique", "Cyprus", "The Gambia", "Sierra Leone", "Tajikistan", "Botswana", "Liberia", "Hong Kong, China", "Cambodia", "Belize", "St Vincent and the Grenadines", "Montserrat", "Mauritius", "Chad", "Macau", "Mongolia", "Dominica", "Bhutan", "Nepal", "São Tomé and Príncipe", "Cook Islands", "Bangladesh", "Brunei Darussalam", "Djibouti", "Timor-Leste", "Cayman Islands", "Seychelles", "Eritrea", "Somalia", "Bahamas", "Laos", "Belarus", "Grenada", "Cuba", "Indonesia", "Lesotho", "Dominican Republic", "Chinese Taipei", "Andorra", "Maldives", "Yemen", "Afghanistan", "Singapore", "Papua New Guinea", "Bermuda", "Myanmar", "Tahiti", "Puerto Rico", "Moldova", "Vanuatu", "Barbados", "South Sudan", "Guyana", "Fiji", "St Lucia", "Malta", "New Caledonia", "Kyrgyz Republic", "Palestine", "Vietnam", "Peru", "IR Iran", "Sweden", "Ukraine", "Serbia", "Poland", "Australia", "Korea Republic", "Austria", "Scotland", "Japan", "Tunisia", "Algeria", "Egypt", "Wales", "Hungary", "Czechia", "Russia", "Nigeria", "Ecuador", "Türkiye", "Cameroon", "Chile", "Canada", "Denmark", "Colombia", "Aruba", "Sri Lanka", "Guam", "Turks and Caicos Islands", "Pakistan", "Liechtenstein", "Argentina", "France", "Brazil", "England", "Senegal", "Belgium", "Netherlands", "Italy", "Portugal", "Spain", "USA", "Mexico", "Switzerland", "Morocco", "Germany", "Uruguay", "Croatia", "Anguilla", "Norway", "Costa Rica", "Oman", "Uzbekistan", "El Salvador", "Israel", "Bulgaria", "Georgia", "Honduras", "China PR", "Guinea", "Jordan", "United Arab Emirates", "Bolivia", "Gabon", "Bahrain", "Haiti", "Curaçao", "Luxembourg", "Armenia", "Equatorial Guinea", "Uganda", "Benin", "Syria", "Zambia", "Panama", "Montenegro", "Congo DR", "Slovakia", "Romania", "Paraguay", "Greece", "Mali", "Côte d'Ivoire", "Republic of Ireland", "Saudi Arabia", "Finland", "Burkina Faso", "Iraq", "Venezuela", "Qatar", "Ghana", "Slovenia", "Bosnia and Herzegovina", "South Africa", "Northern Ireland", "Albania", "Cabo Verde", "Iceland", "North Macedonia", "Jamaica", "US Virgin Islands"],
  "rivers": ["Nile River", "Amazon River", "Yangtze River", "Mississippi–Missouri River", "Yenisey River", "Huang He River", "Ob–Irtysh River", "Río de la Plata–Paraná–Rio Grande River", "Zaïre River", "Heilong Jiang River", "Lena River", "Lancang Jiang River", "Mackenzie–Slave–Peace–Finlay River", "Niger River", "Brahmaputra–Yarlung Tsangpo River", "Murray–Darling–Culgoa–Balonne–Condamine River", "Tocantins–Araguaia River", "Volga River", "Shatt al-Arab–Euphrates–Murat River", "Madeira–Mamoré–Grande–Caine–Rocha River", "Purús River", "Yukon River", "Indus–Sênggê Zangbo River", "São Francisco River", "Syr Darya–Naryn River", "Nu Jiang River", "Great Lakes River", "Rio Grande River", "Lower Tunguska River", "Colorado–Green River"],
  "bones": ["Clavicle", "Scapula", "Humerus", "Radius", "Ulna", "Carpals", "Metacarpals", "Phalanges", "Femur", "Patella", "Tibia", "Fibula", "Tarsals", "Metatarsals", "Phalanges", "Sternum", "Ribs", "Vertebrae", "Pelvis", "Sacrum", "Coccyx"],
  "streaming_services": ["Amazon Prime Video", "Apple TV+", "Disney+", "Max", "Hulu", "Netflix", "Paramount+", "Peacock", "YouTube TV", "Starz", "Showtime", "ESPN+", "Discovery+", "Sling TV", "FUBO", "Crackle"],
  "nhl_teams": ["Anaheim Ducks", "Arizona Coyotes", "Boston Bruins", "Buffalo Sabres", "Calgary Flames", "Carolina Hurricanes", "Chicago Blackhawks", "Colorado Avalanche", "Columbus Blue Jackets", "Dallas Stars", "Detroit Red Wings", "Edmonton Oilers", "Florida Panthers", "Los Angeles Kings", "Minnesota Wild", "Montreal Canadiens", "Nashville Predators", "New Jersey Devils", "New York Islanders", "New York Rangers", "Ottawa Senators", "Philadelphia Flyers", "Pittsburgh Penguins", "San Jose Sharks", "Seattle Kraken", "St. Louis Blues", "Tampa Bay Lightning", "Toronto Maple Leafs", "Vancouver Canucks", "Vegas Golden Knights", "Washington Capitals", "Winnipeg Jets"],
  "marvel_movies": ["Iron Man", "The Incredible Hulk", "Iron Man 2", "Thor", "Captain America: The First Avenger", "The Avengers", "Iron Man 3", "Thor: The Dark World", "Captain America: The Winter Soldier", "Guardians of the Galaxy", "Avengers: Age of Ultron", "Ant-Man", "Captain America: Civil War", "Doctor Strange", "Guardians of the Galaxy Vol. 2", "Spider-Man: Homecoming", "Thor: Ragnarok", "Black Panther", "Avengers: Infinity War", "Ant-Man and the Wasp", "Captain Marvel", "Avengers: Endgame", "Spider-Man: Far From Home", "Black Widow", "Shang-Chi and the Legend of the Ten Rings", "Eternals", "Spider-Man: No Way Home", "Doctor Strange in the Multiverse of Madness", "Thor: Love and Thunder", "Black Panther: Wakanda Forever", "Ant-Man and the Wasp: Quantumania", "Guardians of the Galaxy Vol. 3", "The Marvels"],
  "retail_companies": ["Amazon", "Walmart", "Costco", "Home Depot", "Alibaba", "Inditex", "Lowe's Companies", "TJX Companies", "Fast Retailing", "CVS Health", "Target", "Walmex", "Alimentation Couche-Tard", "Wesfarmers", "Ross Stores", "AutoZone", "Jingdong Mall", "Coupang", "lululemon athletica", "DMart", "Kroger", "Loblaw Companies", "7-Eleven", "CDW Corporation", "Tractor Supply", "H&amp;M", "Ahold Delhaize", "Tesco", "Dollar General", "Deckers Brands"],
  "2023_google_searches": ["amazon", "apple", "calculator", "costco", "facebook", "flights", "gmail", "google", "home depot", "instagram", "nba", "netflix", "news", "nfl", "people", "reddit", "target", "translate", "twitter", "walmart", "weather", "wordle", "yahoo", "you", "youtube"],
  "generations": ["Baby Boomers (born 1946-1964)", "Generation X (born 1965-1980)", "Generation Z (born 1997-2012)", "Millennials (born 1981-1996)", "Silent Generation (born 1928-1945)"],
  "snl_hosts": ["Alec Baldwin", "Ben Affleck", "Bill Murray", "Buck Henry", "Candice Bergen", "Chevy Chase", "Christopher Walken", "Danny DeVito", "Drew Barrymore", "Dwayne Johnson", "Elliott Gould", "Emma Stone", "John Goodman", "John Mulaney", "Jonah Hill", "Justin Timberlake", "Kristen Wiig", "Melissa McCarthy", "Paul Rudd", "Paul Simon", "Scarlett Johansson", "Steve Martin", "Tina Fey", "Tom Hanks", "Will Ferrell", "Woody Harrelson"],
  "oscar_hosts": ["Billy Crystal", "Bob Hope", "Chevy Chase", "Chris Rock", "Conrad Nagel", "David Niven", "Donald O'Connor", "Douglas Fairbanks", "Ellen DeGeneres", "Frank Capra", "Fredric March", "George Jessel", "Hugh Jackman", "Jack Benny", "Jack Lemmon", "Jerry Lewis", "Jimmy Kimmel", "Johnny Carson", "Jon Stewart", "Lawrence Grant", "Lionel Barrymore", "Mort Sahl", "Neil Patrick Harris", "Richard Pryor", "Seth MacFarlane", "Steve Martin", "W.C. Fields", "Whoopi Goldberg", "Will Rogers", "William C. DeMille"],
  "classical_composers": ["Antonio Vivaldi", "Benjamin Britten", "Béla Bartók", "Camille Saint-Saëns", "Carl Maria von Weber", "Carl Philipp Emanuel Bach", "Charles Ives", "Claude Debussy", "Dmitri Shostakovich", "Edvard Grieg", "Edward Elgar", "Felix Mendelssohn", "Franz Liszt", "Franz Schubert", "Frédéric Chopin", "George Frideric Handel", "Giacomo Puccini", "Gioachino Rossini", "Gustav Mahler", "Hector Berlioz", "Igor Stravinsky", "Johann Sebastian Bach", "Johannes Brahms", "Joseph Haydn", "Ludwig van Beethoven", "Modest Mussorgsky", "Niccolò Paganini", "Pyotr Ilyich Tchaikovsky", "Richard Strauss", "Robert Schumann", "Sergei Rachmaninoff", "Wolfgang Amadeus Mozart"],
  "animal_phylums": ["Annelida", "Arthropoda", "Brachiopoda", "Chordata", "Cnidaria", "Echinodermata", "Mollusca", "Nematoda", "Platyhelminthes", "Porifera", "Rotifera"],
  "netflix_tv_titles": ["All of Us Are Dead: Season 1", "Baby Reindeer: Limited Series", "Berlin: Season 1", "Bridgerton: Season 1", "Bridgerton: Season 2", "DAHMER: Monster: The Jeffrey Dahmer Story", "Dear Child: Limited Series", "Fool Me Once: Limited Series", "Lupin: Part 1", "Lupin: Part 2", "Money Heist: Part 3", "Money Heist: Part 4", "Money Heist: Part 5", "Squid Game: Season 1", "Stranger Things 3", "Stranger Things 4", "The Night Agent: Season 1", "The Queen's Gambit: Limited Series", "Wednesday: Season 1", "Who Killed Sara?: Season 1"],
  "currencies": ["United States dollar", "Euro", "Japanese yen", "British pound sterling", "Australian dollar", "Canadian dollar", "Swiss franc", "Chinese yuan", "Swedish krona", "New Zealand dollar", "Mexican peso", "Singapore dollar", "Norwegian krone", "South Korean won", "Turkish lira", "Russian ruble", "Indian rupee", "Brazilian real", "Serbian dinar", "Haitian gourde", "Macanese Pataca", "Dominican peso"],
  "dreamworks_movies": ["Shrek", "Shrek 2", "Shrek the Third", "Shrek Forever After", "Madagascar", "Madagascar: Escape 2 Africa", "Madagascar 3: Europe's Most Wanted", "Kung Fu Panda", "Kung Fu Panda 2", "Kung Fu Panda 3", "How to Train Your Dragon", "How to Train Your Dragon 2", "How to Train Your Dragon: The Hidden World", "Trolls", "The Boss Baby", "Bee Movie", "Mr. Peabody & Sherman", "Megamind", "Puss in Boots", "Over the Hedge", "Shark Tale", "Home", "Puss in Boots: The Last Wish", "The Croods", "Monsters vs. Aliens"],
  "spotify_songs": ["Blinding Lights - The Weeknd", "Shape Of You - Ed Sheeran", "Someone You Loved - Lewis Capaldi", "Sunflower - Post Malone feat. Swae Lee", "As It Was - Harry Styles", "Starboy - The Weeknd feat. Daft Punk", "One Dance - Drake feat. WizKid & Kyla", "Stay - The Kid LAROI & Justin Bieber", "Dance Monkey - Tones And I", "Believer - Imagine Dragons", "Heat Waves - Glass Animals", "Perfect - Ed Sheeran", "Rockstar - Post Malone feat. 21 Savage", "Sweater Weather - The Neighbourhood", "Closer - The Chainsmokers feat. Halsey", "Say You Won't Let Go - James Arthur", "Lovely - Billie Eilish & Khalid", "Watermelon Sugar - Harry Styles", "Señorita - Shawn Mendes & Camila Cabello", "Don't Start Now - Dua Lipa"],
  "oldest_us_universities": ["Allegheny College", "Antioch College", "Amherst College", "Auburn University", "Bates College", "Bowdoin College", "Brown University", "Bucknell University", "Colby College", "College of Charleston", "College of William & Mary", "Columbia University", "Dartmouth College", "DePauw University", "Dickinson College", "Franklin & Marshall College", "Georgetown University", "Hamilton College", "Hampden-Sydney College", "Harvard University", "Hobart and William Smith Colleges", "Knox College", "Lafayette College", "Middlebury College", "Moravian College", "Mount Holyoke College", "Oberlin College", "Ohio University", "Princeton University", "Rutgers University", "St. John's College", "St. Mary's Seminary and University", "Trinity College", "Union College", "University of Alabama", "University of Cincinnati", "University of Delaware", "University of Georgia", "University of Michigan", "University of Missouri", "University of North Carolina at Chapel Hill", "University of Notre Dame", "University of Pennsylvania", "University of Pittsburgh", "University of South Carolina", "University of Tennessee", "University of Vermont", "University of Virginia", "Wake Forest University", "Washington and Lee University", "Wesleyan University", "Williams College", "Yale University"],
  "taylor_swift_songs": ["Cruel Summer", "Blank Space", "Anti-Hero", "Lover", "Shake It Off", "cardigan", "Style", "Look What You Made Me Do", "Don’t Blame Me", "august", "Delicate", "Wildest Dreams", "You Need To Calm Down", "Love Story", "ME! (feat. Brendon Urie of Panic! At The Disco)", "willow", "All Too Well (10 Minute Version) (Taylor's Version) (From The Vault)", "I Knew You Were Trouble.", "Enchanted", "Karma"],
  "pokemon_games": ["Pokémon Red", "Pokémon Blue", "Pokémon Green", "Pokémon Gold", "Pokémon Silver", "Pokémon Crystal", "Pokémon Ruby", "Pokémon Sapphire", "Pokémon FireRed", "Pokémon LeafGreen", "Pokémon Emerald", "Pokémon Diamond", "Pokémon Pearl", "Pokémon Platinum", "Pokémon HeartGold", "Pokémon SoulSilver", "Pokémon Black", "Pokémon White", "Pokémon Black 2", "Pokémon White 2", "Pokémon X", "Pokémon Y", "Pokémon Omega Ruby", "Pokémon Alpha Sapphire", "Pokémon Sun", "Pokémon Moon", "Pokémon Ultra Sun", "Pokémon Ultra Moon", "Pokémon Sword", "Pokémon Shield", "Pokémon Scarlett", "Pokémon Violet", "Pokémon Legends: Arceus"],
  "us_newspapers": ["Chicago Tribune", "Los Angeles Times", "New York Post", "Newsday", "Star Tribune", "The Arizona Republic", "The Atlanta Journal-Constitution", "The Baltimore Sun", "The Boston Globe", "The Cleveland Plain Dealer", "The Dallas Morning News", "The Denver Post", "The Detroit News", "The Houston Chronicle", "The Indianapolis Star", "The Kansas City Star", "The Miami Herald", "The Minneapolis Star Tribune", "The New York Times", "The Oregonian", "The Orlando Sentinel", "The Philadelphia Inquirer", "The Pittsburgh Post-Gazette", "The Sacramento Bee", "The San Diego Union-Tribune", "The San Francisco Chronicle", "The Seattle Times", "The St. Louis Post-Dispatch", "The Star-Ledger", "The Tampa Bay Times", "The Wall Street Journal", "The Washington Post", "USA Today"],
  "animated_franchises": ["Looney Tunes", "Mickey Mouse & Friends", "My Little Pony", "Transformers", "The Simpsons", "SpongeBob SquarePants", "Teenage Mutant Ninja Turtles", "Scooby-Doo", "Yogi Bear & Friends", "The Flintstones", "The Jetsons", "Tom and Jerry", "Spider-Man", "Ben 10", "Teen Titans", "Family Guy", "Thomas & Friends"],
  "twitter_followers": ["Akshay Kumar", "Amitabh Bachchan", "BBC Breaking News", "BBC World News", "BTS", "BTS", "Barack Obama", "Bill Gates", "Britney Spears", "Bruno Mars", "CNN", "CNN Breaking News", "Cristiano Ronaldo", "Demi Lovato", "Donald Trump", "ESPN", "Ellen DeGeneres", "Elon Musk", "FC Barcelona", "Jennifer Lopez", "Jimmy Fallon", "Justin Bieber", "Justin Timberlake", "Katy Perry", "Kim Kardashian", "Kylie Jenner", "Lady Gaga", "LeBron James", "Miley Cyrus", "NASA", "NBA", "Narendra Modi", "Neymar", "Niall Horan", "Oprah Winfrey", "PMO India", "Premier League", "Real Madrid CF", "Rihanna", "Salman Khan", "Selena Gomez", "Shah Rukh Khan", "Shakira", "SportsCenter", "Taylor Swift", "The New York Times", "UEFA Champions League", "Virat Kohli", "X", "YouTube"],
  "vhs_best_sellers": ["Aladdin", "Aladdin and the King of Thieves", "Babe", "Bambi", "Batman", "Beauty and the Beast", "Cinderella", "E.T. the Extra-Terrestrial", "Fantasia", "Forrest Gump", "Home Alone", "How the Grinch Stole Christmas", "Independence Day", "Jurassic Park", "Mrs. Doubtfire", "One Hundred and One Dalmatians", "Pinocchio", "Pocahontas", "Shrek", "Snow White and the Seven Dwarfs", "Tarzan", "The Lion King", "The Lion King II: Simba's Pride", "The Little Mermaid", "The Return of Jafar", "Titanic", "Toy Story", "Toy Story 2"],
  "tennis_players": ["Andre Agassi", "Andy Murray", "Andy Roddick", "Arthur Ashe", "Billie Jean King", "Björn Borg", "Boris Becker", "Chris Evert", "Gabriela Sabatini", "Helen Wills Moody", "Ivan Lendl", "Jimmy Connors", "John McEnroe", "Justine Henin", "Ken Rosewall", "Kim Clijsters", "Lindsay Davenport", "Margaret Court", "Maria Sharapova", "Martina Hingis", "Martina Navratilova", "Monica Seles", "Novak Djokovic", "Pete Sampras", "Rafael Nadal", "Rod Laver", "Roger Federer", "Roy Emerson", "Serena Williams", "Steffi Graf", "Venus Williams"],
  "footwear_companies": ["Nike", "Adidas", "Deckers Brands", "On Holding", "ASICS Corporation", "Birkenstock", "Skechers", "Crocs", "PUMA", "VF Corporation", "Li Ning Company", "ABC-Mart", "Metro Brands", "Boot Barn Holdings", "Under Armour", "Relaxo Footwear", "Foot Locker", "Bata India", "Fila", "TOD’S", "Salvatore Ferragamo"]
};
module.exports = options;

/***/ })
/******/ ])));