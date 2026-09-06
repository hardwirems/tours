var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../.npm/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../.npm/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// go/[[slug]].ts
var URL_MAP = {
  "viator/surf-lessons-in-tamarindo-costa-rica": "https://www.viator.com/tours/Tamarindo/Surf-Lessons-in-Tamarindo/d24763-8153P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/guachipelin-adventure-volcano-zipline-river-tubing-combo": "https://www.viator.com/tours/Tamarindo/Guachipelin-Adventure-Zipline-Horseback-River-Tubing-Combo/d24763-17279P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/diamante-eco-adventure-park-day-pass-with-lunch": "https://www.viator.com/tours/Playa-Hermosa/Adventure-Pass/d24946-32267P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/rio-celeste-hiking-sloth-sanctuary-llanos-de-cortes-waterfal": "https://www.viator.com/tours/Tamarindo/Rio-Celeste-and-Llanos-de-Cortes-Waterfall/d24763-17279P13?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/sunset-catamaran-snorkeling-tour-in-playa-flamingo": "https://www.viator.com/tours/Playa-Flamingo/Sailing-Sunset-Tour-in-Playa-Flamingo/d24471-8124P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/flamingo-guanacaste-all-inclusive-catamaran-snorkel-adventur": "https://www.viator.com/tours/Playa-Flamingo/All-Inclusive-Nauyaca-Waterfall-Adventure/d24471-57580P9?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/blue-dolphin-public-catamaran-tour-tamarindo": "https://www.viator.com/tours/Tamarindo/Blue-Dolphin-Sailing-Adventure/d24763-31513P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/sloth-wildlife-experience-coffee-chocolate-waterfall": "https://www.viator.com/tours/Liberia/Private-Sloth-Forest-Coffee-Chocolate-and-Waterfall-Tour/d22740-438577P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/atv-or-buggy-guided-tour-from-tamarindo-conchal-or-riu-hotel": "https://www.viator.com/tours/Tamarindo/Private-Tour-ATV-Adventure-with-Free-Snorkeling/d24763-144991P25?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/skip-the-line-diamante-eco-adventure-park-animal-sanctuary-d": "https://www.viator.com/tours/Playa-Hermosa/Diamante-Eco-Adventure-Park-Animal-Sanctuary-Discovery-Pass/d24946-32267P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/volcano-hike-waterfall-swim-hot-springs-combo-on-rincon-de-l": "https://www.viator.com/tours/Tamarindo/Hiking-Tour-of-Rincon-de-la-Vieja-Volcano-National-Park/d24763-17279P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/surf-lesson-in-tamarindo-stand-up-or-your-money-back": "https://www.viator.com/tours/Tamarindo/Surf-lessons-in-Tamarindo/d24763-331007P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/tamarindo-estuary-boat-safari": "https://www.viator.com/tours/Tamarindo/Tamarindo-Estuary-Boat-Safari/d24763-17279P30?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/tropical-rainforest-hanging-bridges-and-jungle-sloths-sanctu": "https://www.viator.com/tours/Liberia/TROPICAL-RAINFOREST-HANGING-BRIDGES-AND-JUNGLE-SLOTHS-SANCTUARY/d22740-63887P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/marlin-del-rey-catamaran-tamarindo-playas-del-coco": "https://www.viator.com/tours/Tamarindo/TAMARINDO/d24763-39790P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/la-leona-waterfall-adventure-hike-private-tour": "https://www.viator.com/tours/Guanacaste-and-Northwest/La-Leona-Waterfall-Adventure-Tour/d4137-308289P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/diamante-adventure-park-ocean-view-zip-line": "https://www.viator.com/tours/Playa-Hermosa/Aerial-Pass/d24946-32267P3?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/nicaragua-full-day-tour-from-costa-rica": "https://www.viator.com/tours/Tamarindo/Full-Day-Nicaragua-Tour/d24763-17279P6?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/explore-day-pass-adventure-relaxation-in-one-day": "https://www.viator.com/tours/Liberia/Explorer-Pass/d22740-382350P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/timarouba-catamaran-sunset-cruise-with-open-bar-lunch-snorke": "https://www.viator.com/tours/Tamarindo/Sailing-Catamaran-Tour/d24763-116726P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/atv-and-utv-beach-tour-from-tamarindo-flamingo-and-conchal-b": "https://www.viator.com/tours/Tamarindo/ATV-Beach-Adventure-Tour-in-Tamarindo/d24763-12671P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/two-tanks-scuba-diving-tour-at-catalina-islands-north-island": "https://www.viator.com/tours/Playa-Flamingo/Certified-without-equipment/d24471-31262P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/la-leona-waterfall-hike": "https://www.viator.com/tours/Guanacaste-and-Northwest/La-Leona-Waterfall-Hike/d4137-278999P6?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/palo-verde-boat-tours-ortega": "https://www.viator.com/tours/Guanacaste-and-Northwest/PALO-VERDE-BOAT-TOURS-ORTEGA-A-family-run-business/d4137-112389P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/best-surf-lessons-in-tamarindo-and-surf-funcional-surf-skate": "https://www.viator.com/tours/Tamarindo/No1-Surf-School-in-Tamarindo-Lessons-Surfskate-Surfers-apnea-Ginastica-Natural/d24763-316753P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/atv-beach-and-mountain-tour": "https://www.viator.com/tours/Playa-Flamingo/ATV-2-Hours-Beach-and-Mountain-Tour/d24471-107293P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/catamaran-snorkeling-sunset-sailing-tour": "https://www.viator.com/tours/Playa-Hermosa/Playas-del-Coco/d24946-39790P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/fundive-catalina-islands-2-dives-only-for-certified-divers": "https://www.viator.com/tours/Tamarindo/FunDive-Catalina-Islands/d24763-112293P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/guanacaste-zipline-safe-fun-for-kids-2-families": "https://www.viator.com/tours/Tamarindo/Skyline-Canopy-Tour/d24763-332292P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/jet-ski-guided-tour-in-playa-conchal": "https://www.viator.com/tours/Playa-Flamingo/JET-SKI-guided-tour/d24471-72547P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/catamaran-snorkel-sunset-cruise-from-tamarindo-or-playas-del": "https://www.viator.com/tours/Tamarindo/Marlin-del-Rey-Catamaran-Snorkel-Sunset-Cruise-from-Tamarindo/d24763-17279P28?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/rain-forest-canopy-tour-from-tamarindo-zipline-hanging-bridg": "https://www.viator.com/tours/Tamarindo/pinilla-canopy-tour/d24763-60079P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/palo-verde-boat-safari-coffee-culture-wildlife-flavor": "https://www.viator.com/tours/Guanacaste-and-Northwest/PALO-VERDE-NATIONAL-PARK-RIVER-SAFARI/d4137-63887P3?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/la-fortuna-atv-adventure-with-mud-mask-and-arenal-volcano-vi": "https://www.viator.com/tours/La-Fortuna/La-Fortuna-ATV-Adventure-with-Mud-Mask-and-Arenal-Volcano-Views/d821-20933P6?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/jungle-and-beach-horseback-riding-tour-2h-1-2": "https://www.viator.com/tours/Samara/Horseriding-Mountain-and-Beach-Tour/d24505-152473P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/flamingo-family-fun-catamaran-snorkel-comfortable-shaded-sea": "https://www.viator.com/tours/Playa-Flamingo/Full-Day-Chasing-Waterfalls-Off-the-Beaten-Path/d24471-57580P7?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/tamarindo-estuary-tour": "https://www.viator.com/tours/Tamarindo/Tamarindo-Estuary-Tours-by-Discover-Tamarindo-Travel-Agency/d24763-344882P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/zipline-monkey-jungle-family-canopy-tour-in-tamarindo": "https://www.viator.com/tours/Tamarindo/Monkey-Jungle-Zipline-in-Costa-Rica/d24763-57496P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/adventure-in-volcano-combo-tour-zip-line-waterfall-hot-sprin": "https://www.viator.com/tours/Liberia/Adventure-in-Volcano-Combo-Tour-Zip-Line-Waterfall-Hot-Springs-and-more/d22740-259166P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/guachipelin-zipline-river-tubing-horseback-ride-hot-springs-": "https://www.viator.com/tours/Playa-Hermosa/Rincon-de-la-Vieja-National-Park-One-Day-Adventure-Pass/d24946-15501P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/frogs-sloths-waterfall-coffee-and-chocolate-tour": "https://www.viator.com/tours/Playa-Flamingo/Palo-Verde-Combo-rum-tour-class-rum-cultural-tour-and-Philadelphia-town/d24471-246744P5?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/volcano-waterfall-and-hot-springs-private-tour": "https://www.viator.com/tours/Playa-Flamingo/Palo-Verde-River-Cruice/d24471-115542P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/1-5-hours-private-horseback-riding-tour-in-playa-conchal": "https://www.viator.com/tours/Playa-Flamingo/Horseback-riding-Tour/d24471-263594P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/surf-lessons-for-the-whole-family-in-playa-samara": "https://www.viator.com/tours/Samara/Surf-Lessons/d24505-5533548P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/nature-day-pass-thermals-cultural-tour-in-costa-rica": "https://www.viator.com/tours/Liberia/Nature-Pass/d22740-382350P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/playa-grande-surf-lessons-on-a-secluded-beach": "https://www.viator.com/tours/Playa-Flamingo/Playa-Grande-Surf-Lessons-on-a-Secluded-Beach/d24471-188392P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/try-scuba-diving-basic-diver": "https://www.viator.com/tours/Tamarindo/Discover-Scuba-Diving/d24763-112293P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/scuba-diving-for-non-certified-divers-at-catalina-islands-no": "https://www.viator.com/tours/Playa-Flamingo/Discover-Scuba-Diving/d24471-31262P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/snorkeling-at-catalina-islands-north-island-cr": "https://www.viator.com/tours/Playa-Flamingo/Certified-without-equipment/d24471-31262P3?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/rio-celeste-combo-river-tubing-blue-waterfall-exotic-wildlif": "https://www.viator.com/tours/Alajuela/Rain-Forest-Waterfall-Active-Volcanoes-Local-Style-Lunch-Tubing-Wild-Life/d50231-167483P5?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/small-group-sunset-sail-for-the-sophisticated-traveler": "https://www.viator.com/tours/Playa-Flamingo/Small-Group-Sunset-Sail-from-Flamingo-Marina/d24471-47502P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/sunday-funday-tamarindo-party-bus-beach-and-pool-crawl": "https://www.viator.com/tours/Tamarindo/Beach-and-Pool-Crawl-Sunday-Funday/d24763-118421P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/night-turtle-nesting-tour-from-tamarindo": "https://www.viator.com/tours/Tamarindo/Turtle-Nesting-Tour/d24763-17279P11?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/arenal-volcano-magic-of-nature": "https://www.viator.com/tours/Liberia/Arenal-Volcano-and-Hot-Springs-Day-Trip-from-Guanacaste/d22740-5766ARENAL?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/turtle-watching-night-tours-with-expert-naturalist": "https://www.viator.com/tours/Tamarindo/Turtle-watching-night-tours-with-Expert-Naturalist/d24763-344882P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/horseback-riding-to-conchal-beach-from-tamarindo-flamingo": "https://www.viator.com/tours/Playa-Flamingo/Horseback-Riding-in-Tamarindo/d24471-17279P31?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/whitewater-rafting-class-iii-and-iv": "https://www.viator.com/tours/Tamarindo/Whitewater-Rafting-Class-III-and-IV/d24763-17279P12?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/5-hour-guided-sunset-boat-tour-in-tamarindo-costa-rica": "https://www.viator.com/tours/Tamarindo/Sunset-Tour/d24763-368946P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/adventure-combo-tour-horses-tubing-zipline-hot-springs": "https://www.viator.com/tours/Liberia/ADRENALINE-ONE-DAY-COMBO-TOUR/d22740-63887P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0",
  "viator/zip-line-and-atv-adventure": "https://www.viator.com/tours/Playa-Flamingo/Zip-Line-ATV-Adventure/d24471-107293P5?mcid=42383&pid=P00318538&medium=api&api_version=2.0"
};
function resolveUrl(slug) {
  return URL_MAP[slug] ?? null;
}
__name(resolveUrl, "resolveUrl");
async function recordClick(slug, sourcePage, sessionId, userAgent, env2) {
  const supabaseUrl = env2.SUPABASE_URL;
  const key = env2.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !key) return;
  const response = await fetch(`${supabaseUrl}/rest/v1/clicks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({
      slug,
      source_page: sourcePage ?? null,
      session_id: sessionId ?? null,
      user_agent: userAgent ?? null,
      country: null,
      ip_hash: null,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase insert failed (${response.status}): ${text}`);
  }
}
__name(recordClick, "recordClick");
var onRequestGet = /* @__PURE__ */ __name(async (context2) => {
  const url = new URL(context2.request.url);
  const pathAfterGo = url.pathname.slice("/go/".length);
  const slug = pathAfterGo || "";
  if (!slug || !slug.includes("/")) {
    return new Response(
      JSON.stringify({ error: "Invalid slug. Use /go/program/tour-slug" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const redirectUrl = resolveUrl(slug);
  if (!redirectUrl) {
    return new Response(
      JSON.stringify({ error: `No mapping found for /go/${slug}` }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }
  const rawReferer = context2.request.headers.get("referer") ?? context2.request.headers.get("referrer") ?? "";
  const sourcePage = url.searchParams.get("source") ?? (rawReferer.startsWith(url.origin) ? new URL(rawReferer).pathname : null);
  const cookieHeader = context2.request.headers.get("cookie") ?? "";
  const sid = cookieHeader.split(";").map((c) => c.trim().split("=")).reduce(
    (found, parts) => found ?? (parts[0] === "__secure_guanacaste_sid" || parts[0] === "guanacaste_sid" ? parts.slice(1).join("=") : void 0),
    void 0
  );
  const sessionId = sid ?? null;
  const userAgent = context2.request.headers.get("user-agent") ?? null;
  try {
    await recordClick(slug, sourcePage, sessionId, userAgent, context2.env);
  } catch (err) {
    console.error("Click tracking failed:", err);
  }
  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectUrl,
      "Set-Cookie": `guanacaste_go=${slug}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax; HttpOnly; Secure;`
    }
  });
}, "onRequestGet");

// ../.wrangler/tmp/pages-9d4VXE/functionsRoutes-0.8928620838867092.mjs
var routes = [
  {
    routePath: "/go/:slug*",
    mountPath: "/go",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  }
];

// ../../.npm/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count3 = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count3--;
          if (count3 === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count3++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count3)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env2, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context2 = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env: env2,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context2);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error3) {
      if (isFailOpen) {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error3;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
