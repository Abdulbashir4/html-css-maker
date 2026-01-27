const hooks = {};

export function on(event, fn) {
  hooks[event] ??= [];
  hooks[event].push(fn);
}

export function trigger(event, ...args) {
  (hooks[event] || []).forEach(fn => fn(...args));
}
