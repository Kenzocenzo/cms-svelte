
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction$1 = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
    	return (
    		!event.defaultPrevented &&
    		event.button === 0 &&
    		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    	);
    }

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction$1(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );
    const { navigate } = globalHistory;

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* node_modules\svelte-navigator\src\Router.svelte generated by Svelte v3.46.4 */

    const file$C = "node_modules\\svelte-navigator\\src\\Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$c(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$C, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$D(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$C, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$D($$self, $$props, $$invalidate) {
    	let $location;
    	let $activeRoute;
    	let $prevLocation;
    	let $routes;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, 'announcementText');
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(18, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, 'prevLocation');
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$D,
    			create_fragment$D,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$D.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Router$1 = Router;

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules\svelte-navigator\src\Route.svelte generated by Svelte v3.46.4 */
    const file$B = "node_modules\\svelte-navigator\\src\\Route.svelte";

    const get_default_slot_changes$1 = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 8
    });

    const get_default_slot_context$1 = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[3],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block$b(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block$7(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262168)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1$6(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[3] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$6, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$C(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[2] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$B, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$B, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$C($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $activeRoute;
    	let $location;
    	let $parentBase;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(15, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, 'parentBase');
    	component_subscribe($$self, parentBase, value => $$invalidate(16, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, 'params');
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('path' in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router: Router$1,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		isActive,
    		$activeRoute,
    		$location,
    		$parentBase,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ('ssrMatch' in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
    			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		isActive,
    		$location,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$activeRoute,
    		$parentBase,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$C, create_fragment$C, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$C.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Route$1 = Route;

    /* node_modules\svelte-navigator\src\Link.svelte generated by Svelte v3.46.4 */
    const file$A = "node_modules\\svelte-navigator\\src\\Link.svelte";

    function create_fragment$B(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[2], /*props*/ ctx[1]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$A, 63, 0, 1735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 4 && /*ariaCurrent*/ ctx[2],
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	let href;
    	let isPartiallyCurrent;
    	let isCurrent;
    	let ariaCurrent;
    	let props;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = null } = $$props;
    	usePreflightCheck(LINK_ID, $$props);
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(11, $location = value));
    	const dispatch = createEventDispatcher();
    	const resolve = useResolve();
    	const { navigate } = useHistory();

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = isCurrent || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		useLocation,
    		useResolve,
    		useHistory,
    		usePreflightCheck,
    		shouldNavigate,
    		isFunction: isFunction$1,
    		startsWith,
    		LINK_ID,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		dispatch,
    		resolve,
    		navigate,
    		onClick,
    		href,
    		isCurrent,
    		isPartiallyCurrent,
    		props,
    		ariaCurrent,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('to' in $$props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isCurrent' in $$props) $$invalidate(9, isCurrent = $$new_props.isCurrent);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(10, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $location*/ 2080) {
    			// We need to pass location here to force re-resolution of the link,
    			// when the pathname changes. Otherwise we could end up with stale path params,
    			// when for example an :id changes in the parent Routes path
    			$$invalidate(0, href = resolve(to, $location));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 2049) {
    			$$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 2049) {
    			$$invalidate(9, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 512) {
    			$$invalidate(2, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
    		}

    		$$invalidate(1, props = (() => {
    			if (isFunction$1(getProps)) {
    				const dynamicProps = getProps({
    					location: $location,
    					href,
    					isPartiallyCurrent,
    					isCurrent
    				});

    				return { ...$$restProps, ...dynamicProps };
    			}

    			return $$restProps;
    		})());
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		href,
    		props,
    		ariaCurrent,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		isCurrent,
    		isPartiallyCurrent,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$B.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[5] === undefined && !('to' in props)) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Link$1 = Link;

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createAction = getAnchor => (node, navigate$1 = navigate) => {
    	const handleClick = event => {
    		const anchor = getAnchor(event);
    		if (anchor && anchor.target === "" && shouldNavigate(event)) {
    			event.preventDefault();
    			const to = anchor.pathname + anchor.search + anchor.hash;
    			navigate$1(to, { replace: anchor.hasAttribute("replace") });
    		}
    	};
    	const unlisten = addListener(node, "click", handleClick);
    	return { destroy: unlisten };
    };

    // prettier-ignore
    /**
     * A link action that can be added to <a href=""> tags rather
     * than using the <Link> component.
     *
     * Example:
     * ```html
     * <a href="/post/{postId}" use:link>{post.title}</a>
     * ```
     */
    const link = /*#__PURE__*/createAction(event => event.currentTarget); // eslint-disable-line spaced-comment, max-len

    /* node_modules\svelte-carousel\src\components\Dot\Dot.svelte generated by Svelte v3.46.4 */

    const file$z = "node_modules\\svelte-carousel\\src\\components\\Dot\\Dot.svelte";

    function create_fragment$A(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "sc-carousel-dot__dot svelte-1uelw0b");
    			toggle_class(div, "sc-carousel-dot__dot_active", /*active*/ ctx[0]);
    			add_location(div, file$z, 7, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*active*/ 1) {
    				toggle_class(div, "sc-carousel-dot__dot_active", /*active*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dot', slots, []);
    	let { active = false } = $$props;
    	const writable_props = ['active'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dot> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    	};

    	$$self.$capture_state = () => ({ active });

    	$$self.$inject_state = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [active, click_handler];
    }

    class Dot extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, { active: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dot",
    			options,
    			id: create_fragment$A.name
    		});
    	}

    	get active() {
    		throw new Error("<Dot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Dot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-carousel\src\components\Dots\Dots.svelte generated by Svelte v3.46.4 */
    const file$y = "node_modules\\svelte-carousel\\src\\components\\Dots\\Dots.svelte";

    function get_each_context$k(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (23:2) {#each Array(pagesCount) as _, pageIndex (pageIndex)}
    function create_each_block$k(key_1, ctx) {
    	let div;
    	let dot;
    	let t;
    	let current;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*pageIndex*/ ctx[7]);
    	}

    	dot = new Dot({
    			props: {
    				active: /*currentPageIndex*/ ctx[1] === /*pageIndex*/ ctx[7]
    			},
    			$$inline: true
    		});

    	dot.$on("click", click_handler);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(dot.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "sc-carousel-dots__dot-container svelte-1oj5bge");
    			add_location(div, file$y, 23, 4, 515);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(dot, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const dot_changes = {};
    			if (dirty & /*currentPageIndex, pagesCount*/ 3) dot_changes.active = /*currentPageIndex*/ ctx[1] === /*pageIndex*/ ctx[7];
    			dot.$set(dot_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(dot);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$k.name,
    		type: "each",
    		source: "(23:2) {#each Array(pagesCount) as _, pageIndex (pageIndex)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$z(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = Array(/*pagesCount*/ ctx[0]);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*pageIndex*/ ctx[7];
    	validate_each_keys(ctx, each_value, get_each_context$k, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$k(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$k(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "sc-carousel-dots__container svelte-1oj5bge");
    			add_location(div, file$y, 21, 0, 411);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*currentPageIndex, Array, pagesCount, handleDotClick*/ 7) {
    				each_value = Array(/*pagesCount*/ ctx[0]);
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$k, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$k, null, get_each_context$k);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dots', slots, []);
    	const dispatch = createEventDispatcher();
    	let { pagesCount = 1 } = $$props;
    	let { currentPageIndex = 0 } = $$props;

    	function handleDotClick(pageIndex) {
    		dispatch('pageChange', pageIndex);
    	}

    	const writable_props = ['pagesCount', 'currentPageIndex'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dots> was created with unknown prop '${key}'`);
    	});

    	const click_handler = pageIndex => handleDotClick(pageIndex);

    	$$self.$$set = $$props => {
    		if ('pagesCount' in $$props) $$invalidate(0, pagesCount = $$props.pagesCount);
    		if ('currentPageIndex' in $$props) $$invalidate(1, currentPageIndex = $$props.currentPageIndex);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Dot,
    		dispatch,
    		pagesCount,
    		currentPageIndex,
    		handleDotClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('pagesCount' in $$props) $$invalidate(0, pagesCount = $$props.pagesCount);
    		if ('currentPageIndex' in $$props) $$invalidate(1, currentPageIndex = $$props.currentPageIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pagesCount, currentPageIndex, handleDotClick, click_handler];
    }

    class Dots extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, { pagesCount: 0, currentPageIndex: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dots",
    			options,
    			id: create_fragment$z.name
    		});
    	}

    	get pagesCount() {
    		throw new Error("<Dots>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pagesCount(value) {
    		throw new Error("<Dots>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentPageIndex() {
    		throw new Error("<Dots>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPageIndex(value) {
    		throw new Error("<Dots>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const PREV = 'prev';
    const NEXT = 'next';

    /* node_modules\svelte-carousel\src\components\Arrow\Arrow.svelte generated by Svelte v3.46.4 */
    const file$x = "node_modules\\svelte-carousel\\src\\components\\Arrow\\Arrow.svelte";

    function create_fragment$y(ctx) {
    	let div;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			attr_dev(i, "class", "sc-carousel-arrow__arrow svelte-9ztt4p");
    			toggle_class(i, "sc-carousel-arrow__arrow-next", /*direction*/ ctx[0] === NEXT);
    			toggle_class(i, "sc-carousel-arrow__arrow-prev", /*direction*/ ctx[0] === PREV);
    			add_location(i, file$x, 19, 2, 371);
    			attr_dev(div, "class", "sc-carousel-arrow__circle svelte-9ztt4p");
    			toggle_class(div, "sc-carousel-arrow__circle_disabled", /*disabled*/ ctx[1]);
    			add_location(div, file$x, 14, 0, 256);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*direction, NEXT*/ 1) {
    				toggle_class(i, "sc-carousel-arrow__arrow-next", /*direction*/ ctx[0] === NEXT);
    			}

    			if (dirty & /*direction, PREV*/ 1) {
    				toggle_class(i, "sc-carousel-arrow__arrow-prev", /*direction*/ ctx[0] === PREV);
    			}

    			if (dirty & /*disabled*/ 2) {
    				toggle_class(div, "sc-carousel-arrow__circle_disabled", /*disabled*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Arrow', slots, []);
    	let { direction = NEXT } = $$props;
    	let { disabled = false } = $$props;
    	const writable_props = ['direction', 'disabled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Arrow> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('direction' in $$props) $$invalidate(0, direction = $$props.direction);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
    	};

    	$$self.$capture_state = () => ({ NEXT, PREV, direction, disabled });

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) $$invalidate(0, direction = $$props.direction);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [direction, disabled, click_handler];
    }

    class Arrow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, { direction: 0, disabled: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Arrow",
    			options,
    			id: create_fragment$y.name
    		});
    	}

    	get direction() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-carousel\src\components\Progress\Progress.svelte generated by Svelte v3.46.4 */

    const file$w = "node_modules\\svelte-carousel\\src\\components\\Progress\\Progress.svelte";

    function create_fragment$x(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "sc-carousel-progress__indicator svelte-nuyenl");
    			set_style(div, "width", /*width*/ ctx[0] + "%");
    			add_location(div, file$w, 11, 0, 192);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*width*/ 1) {
    				set_style(div, "width", /*width*/ ctx[0] + "%");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const MAX_PERCENT = 100;

    function instance$x($$self, $$props, $$invalidate) {
    	let width;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Progress', slots, []);
    	let { value = 0 } = $$props;
    	const writable_props = ['value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Progress> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ MAX_PERCENT, value, width });

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 2) {
    			$$invalidate(0, width = Math.min(Math.max(value * MAX_PERCENT, 0), MAX_PERCENT));
    		}
    	};

    	return [width, value];
    }

    class Progress extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, { value: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Progress",
    			options,
    			id: create_fragment$x.name
    		});
    	}

    	get value() {
    		throw new Error("<Progress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Progress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // start event
    function addStartEventListener(source, cb) {
      source.addEventListener('mousedown', cb);
      source.addEventListener('touchstart', cb, { passive: true });
    }
    function removeStartEventListener(source, cb) {
      source.removeEventListener('mousedown', cb);
      source.removeEventListener('touchstart', cb);
    }

    // end event
    function addEndEventListener(source, cb) {
      source.addEventListener('mouseup', cb);
      source.addEventListener('touchend', cb);
    }
    function removeEndEventListener(source, cb) {
      source.removeEventListener('mouseup', cb);
      source.removeEventListener('touchend', cb);
    }

    // move event
    function addMoveEventListener(source, cb) {
      source.addEventListener('mousemove', cb);
      source.addEventListener('touchmove', cb);
    }
    function removeMoveEventListener(source, cb) {
      source.removeEventListener('mousemove', cb);
      source.removeEventListener('touchmove', cb);
    }

    function createDispatcher(source) {
      return function (event, data) {
        source.dispatchEvent(
          new CustomEvent(event, {
            detail: data,
          })
        );
      }
    }

    const TAP_DURATION_MS = 110;
    const TAP_MOVEMENT_PX = 9; // max movement during the tap, keep it small

    const SWIPE_MIN_DURATION_MS = 111;
    const SWIPE_MIN_DISTANCE_PX = 20;

    function getCoords(event) {
      if ('TouchEvent' in window && event instanceof TouchEvent) {
        const touch = event.touches[0];
        return {
          x: touch ? touch.clientX : 0,
          y: touch ? touch.clientY : 0,
        }
      }
      return {
        x: event.clientX,
        y: event.clientY,
      }
    }

    function swipeable(node, { thresholdProvider }) {
      const dispatch = createDispatcher(node);
      let x;
      let y;
      let moved = 0;
      let swipeStartedAt;
      let isTouching = false;

      function isValidSwipe() {
        const swipeDurationMs = Date.now() - swipeStartedAt;
        return swipeDurationMs >= SWIPE_MIN_DURATION_MS && Math.abs(moved) >= SWIPE_MIN_DISTANCE_PX
      }

      function handleDown(event) {
        swipeStartedAt = Date.now();
        moved = 0;
        isTouching = true;
        const coords = getCoords(event);
        x = coords.x;
        y = coords.y;
        dispatch('swipeStart', { x, y });
        addMoveEventListener(window, handleMove);
        addEndEventListener(window, handleUp);
      }

      function handleMove(event) {
        if (!isTouching) return
        const coords = getCoords(event);
        const dx = coords.x - x;
        const dy = coords.y - y;
        x = coords.x;
        y = coords.y;
        dispatch('swipeMove', { x, y, dx, dy });

        if (dx !== 0 && Math.sign(dx) !== Math.sign(moved)) {
          moved = 0;
        }
        moved += dx;
        if (Math.abs(moved) > thresholdProvider()) {
          dispatch('swipeThresholdReached', { direction: moved > 0 ? PREV : NEXT });
          removeEndEventListener(window, handleUp);
          removeMoveEventListener(window, handleMove);
        }
      }

      function handleUp(event) {
        event.preventDefault();
        removeEndEventListener(window, handleUp);
        removeMoveEventListener(window, handleMove);

        isTouching = false;

        if (!isValidSwipe()) {
          dispatch('swipeFailed');
          return
        }
        const coords = getCoords(event);
        dispatch('swipeEnd', { x: coords.x, y: coords.y });
      }

      addStartEventListener(node, handleDown);
      return {
        destroy() {
          removeStartEventListener(node, handleDown);
        },
      }
    }

    // in event
    function addHoverInEventListener(source, cb) {
      source.addEventListener('mouseenter', cb);
    }
    function removeHoverInEventListener(source, cb) {
      source.removeEventListener('mouseenter', cb);
    }

    // out event
    function addHoverOutEventListener(source, cb) {
      source.addEventListener('mouseleave', cb);
    }
    function removeHoverOutEventListener(source, cb) {
      source.removeEventListener('mouseleave', cb);
    }

    /**
     * hoverable events are for mouse events only
     */
    function hoverable(node) {
      const dispatch = createDispatcher(node);

      function handleHoverIn() {
        addHoverOutEventListener(node, handleHoverOut);
        dispatch('hovered', { value: true });
      }

      function handleHoverOut() {
        dispatch('hovered', { value: false });
        removeHoverOutEventListener(node, handleHoverOut);
      }

      addHoverInEventListener(node, handleHoverIn);
      
      return {
        destroy() {
          removeHoverInEventListener(node, handleHoverIn);
          removeHoverOutEventListener(node, handleHoverOut);
        },
      }
    }

    const getDistance = (p1, p2) => {
      const xDist = p2.x - p1.x;
      const yDist = p2.y - p1.y;

      return Math.sqrt((xDist * xDist) + (yDist * yDist));
    };

    function getValueInRange(min, value, max) {
      return Math.max(min, Math.min(value, max))
    }

    // tap start event
    function addFocusinEventListener(source, cb) {
      source.addEventListener('touchstart', cb, { passive: true });
    }
    function removeFocusinEventListener(source, cb) {
      source.removeEventListener('touchstart', cb);
    }

    // tap end event
    function addFocusoutEventListener(source, cb) {
      source.addEventListener('touchend', cb);
    }
    function removeFocusoutEventListener(source, cb) {
      source.removeEventListener('touchend', cb);
    }

    /**
     * tappable events are for touchable devices only
     */
    function tappable(node) {
      const dispatch = createDispatcher(node);

      let tapStartedAt = 0;
      let tapStartPos = { x: 0, y: 0 };

      function getIsValidTap({
        tapEndedAt,
        tapEndedPos
      }) {
        const tapTime = tapEndedAt - tapStartedAt;
        const tapDist = getDistance(tapStartPos, tapEndedPos);
        return (
          tapTime <= TAP_DURATION_MS &&
          tapDist <= TAP_MOVEMENT_PX
        )
      }

      function handleTapstart(event) {
        tapStartedAt = Date.now();

        const touch = event.touches[0];
        tapStartPos = { x: touch.clientX, y: touch.clientY };

        addFocusoutEventListener(node, handleTapend);
      }

      function handleTapend(event) {
        event.preventDefault();
        removeFocusoutEventListener(node, handleTapend);

        const touch = event.changedTouches[0];
        if (getIsValidTap({
          tapEndedAt: Date.now(),
          tapEndedPos: { x: touch.clientX, y: touch.clientY }
        })) {
          dispatch('tapped');
        }
      }

      addFocusinEventListener(node, handleTapstart);
      
      return {
        destroy() {
          removeFocusinEventListener(node, handleTapstart);
          removeFocusoutEventListener(node, handleTapend);
        },
      }
    }

    // getCurrentPageIndexByCurrentParticleIndex

    function _getCurrentPageIndexByCurrentParticleIndexInfinite({
      currentParticleIndex,
      particlesCount,
      clonesCountHead,
      clonesCountTotal,
      particlesToScroll,
    }) {
      if (currentParticleIndex === particlesCount - clonesCountHead) return 0
      if (currentParticleIndex === 0) return _getPagesCountByParticlesCountInfinite({
        particlesCountWithoutClones: particlesCount - clonesCountTotal,
        particlesToScroll,
      }) - 1
      return Math.floor((currentParticleIndex - clonesCountHead) / particlesToScroll)
    }

    function _getCurrentPageIndexByCurrentParticleIndexLimited({
      currentParticleIndex,
      particlesToScroll,
    }) {
      return Math.ceil(currentParticleIndex / particlesToScroll)
    }

    function getCurrentPageIndexByCurrentParticleIndex({
      currentParticleIndex,
      particlesCount,
      clonesCountHead,
      clonesCountTotal,
      infinite,
      particlesToScroll,
    }) {
      return infinite
        ? _getCurrentPageIndexByCurrentParticleIndexInfinite({
          currentParticleIndex,
          particlesCount,
          clonesCountHead,
          clonesCountTotal,
          particlesToScroll,
        })
        : _getCurrentPageIndexByCurrentParticleIndexLimited({
          currentParticleIndex,
          particlesToScroll,
        })
    }

    // getPagesCountByParticlesCount

    function _getPagesCountByParticlesCountInfinite({
      particlesCountWithoutClones,
      particlesToScroll,
    }) {
      return Math.ceil(particlesCountWithoutClones / particlesToScroll)
    }

    function _getPagesCountByParticlesCountLimited({
      particlesCountWithoutClones,
      particlesToScroll,
      particlesToShow,
    }) {
      const partialPageSize = getPartialPageSize({
        particlesCountWithoutClones,
        particlesToScroll,
        particlesToShow,
      });
      return Math.ceil(particlesCountWithoutClones / particlesToScroll) - partialPageSize
    }

    function getPagesCountByParticlesCount({
      infinite,
      particlesCountWithoutClones,
      particlesToScroll,
      particlesToShow,
    }) {
      return infinite
        ? _getPagesCountByParticlesCountInfinite({
          particlesCountWithoutClones,
          particlesToScroll,
        })
        : _getPagesCountByParticlesCountLimited({
          particlesCountWithoutClones,
          particlesToScroll,
          particlesToShow,
        })
    }

    // getParticleIndexByPageIndex

    function _getParticleIndexByPageIndexInfinite({
      pageIndex,
      clonesCountHead,
      clonesCountTail,
      particlesToScroll,
      particlesCount,
    }) {
      return getValueInRange(
        0,
        Math.min(clonesCountHead + pageIndex * particlesToScroll, particlesCount - clonesCountTail),
        particlesCount - 1
      )
    }

    function _getParticleIndexByPageIndexLimited({
      pageIndex,
      particlesToScroll,
      particlesCount,
      particlesToShow,
    }) {
      return getValueInRange(
        0,
        Math.min(pageIndex * particlesToScroll, particlesCount - particlesToShow),
        particlesCount - 1
      ) 
    }

    function getParticleIndexByPageIndex({
      infinite,
      pageIndex,
      clonesCountHead,
      clonesCountTail,
      particlesToScroll,
      particlesCount,
      particlesToShow,
    }) {
      return infinite
        ? _getParticleIndexByPageIndexInfinite({
          pageIndex,
          clonesCountHead,
          clonesCountTail,
          particlesToScroll,
          particlesCount,
        })
        : _getParticleIndexByPageIndexLimited({
          pageIndex,
          particlesToScroll,
          particlesCount,
          particlesToShow,
        })
    }

    function applyParticleSizes({
      particlesContainerChildren,
      particleWidth,
    }) {
      for (let particleIndex=0; particleIndex<particlesContainerChildren.length; particleIndex++) {
        particlesContainerChildren[particleIndex].style.minWidth = `${particleWidth}px`;
        particlesContainerChildren[particleIndex].style.maxWidth = `${particleWidth}px`;
      }
    }

    function getPartialPageSize({
      particlesToScroll,
      particlesToShow,
      particlesCountWithoutClones, 
    }) {
      const overlap = particlesToScroll - particlesToShow;
      let particlesCount = particlesToShow;

      while(true) {
        const diff = particlesCountWithoutClones - particlesCount - overlap;
        if (diff < particlesToShow) {
          return Math.max(diff, 0) // show: 2; scroll: 3, n: 5 => -1
        }
        particlesCount += particlesToShow + overlap;
      }
    }

    function createResizeObserver(onResize) {
      return new ResizeObserver(entries => {
        onResize({
          width: entries[0].contentRect.width,
        });
      });
    }

    function getClones({
      clonesCountHead,
      clonesCountTail,
      particlesContainerChildren,
    }) {
      // TODO: add fns to remove clones if needed
      const clonesToAppend = [];
      for (let i=0; i<clonesCountTail; i++) {
        clonesToAppend.push(particlesContainerChildren[i].cloneNode(true));
      }

      const clonesToPrepend = [];
      const len = particlesContainerChildren.length;
      for (let i=len-1; i>len-1-clonesCountHead; i--) {
        clonesToPrepend.push(particlesContainerChildren[i].cloneNode(true));
      }

      return {
        clonesToAppend,
        clonesToPrepend,
      }
    }

    function applyClones({
      particlesContainer,
      clonesToAppend,
      clonesToPrepend,
    }) {
      for (let i=0; i<clonesToAppend.length; i++) {
        particlesContainer.append(clonesToAppend[i]);
      }
      for (let i=0; i<clonesToPrepend.length; i++) {
        particlesContainer.prepend(clonesToPrepend[i]);
      }
    }

    function getClonesCount({
      infinite,
      particlesToShow,
      partialPageSize,
    }) {
      const clonesCount = infinite
        ? {
          // need to round with ceil as particlesToShow, particlesToShow can be floating (e.g. 1.5, 3.75)
          head: Math.ceil(partialPageSize || particlesToShow),
          tail: Math.ceil(particlesToShow),
        } : {
          head: 0,
          tail: 0,
        };

      return {
        ...clonesCount,
        total: clonesCount.head + clonesCount.tail,
      }
    }

    const get$1 = (object, fieldName, defaultValue) => {
      if (object && object.hasOwnProperty(fieldName)) {
        return object[fieldName]
      }
      if (defaultValue === undefined) {
        throw new Error(`Required arg "${fieldName}" was not provided`)
      }
      return defaultValue
    };

    const switcher = (description) => (key) => {
      description[key] && description[key]();
    };

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /**
     * lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */

    /** Used as the `TypeError` message for "Functions" methods. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /** Used as references for various `Number` constants. */
    var INFINITY = 1 / 0;

    /** `Object#toString` result references. */
    var funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        symbolTag = '[object Symbol]';

    /** Used to match property names within property paths. */
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        reIsPlainProp = /^\w*$/,
        reLeadingDot = /^\./,
        rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to match backslashes in property paths. */
    var reEscapeChar = /\\(\\)?/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    /**
     * Checks if `value` is a host object in IE < 9.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
     */
    function isHostObject(value) {
      // Many host objects are `Object` objects that can coerce to strings
      // despite having improperly defined `toString` methods.
      var result = false;
      if (value != null && typeof value.toString != 'function') {
        try {
          result = !!(value + '');
        } catch (e) {}
      }
      return result;
    }

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = root['__core-js_shared__'];

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto.toString;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Symbol$1 = root.Symbol,
        splice = arrayProto.splice;

    /* Built-in method references that are verified to be native. */
    var Map$1 = getNative(root, 'Map'),
        nativeCreate = getNative(Object, 'create');

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map$1 || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      return getMapData(this, key)['delete'](key);
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = isKey(path, object) ? [path] : castPath(path);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath(value) {
      return isArray(value) ? value : stringToPath(value);
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = memoize(function(string) {
      string = toString(string);

      var result = [];
      if (reLeadingDot.test(string)) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to process.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Assign cache to `_.memoize`.
    memoize.Cache = MapCache;

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 8-9 which returns 'object' for typed array and other constructors.
      var tag = isObject(value) ? objectToString.call(value) : '';
      return tag == funcTag || tag == genTag;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return !!value && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && objectToString.call(value) == symbolTag);
    }

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : baseToString(value);
    }

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is returned in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    var lodash_get = get;

    /**
     * lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */

    var lodash_clonedeep = createCommonjsModule(function (module, exports) {
    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        mapTag = '[object Map]',
        numberTag = '[object Number]',
        objectTag = '[object Object]',
        promiseTag = '[object Promise]',
        regexpTag = '[object RegExp]',
        setTag = '[object Set]',
        stringTag = '[object String]',
        symbolTag = '[object Symbol]',
        weakMapTag = '[object WeakMap]';

    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to match `RegExp` flags from their coerced string values. */
    var reFlags = /\w*$/;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /** Used to identify `toStringTag` values supported by `_.clone`. */
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] =
    cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
    cloneableTags[boolTag] = cloneableTags[dateTag] =
    cloneableTags[float32Tag] = cloneableTags[float64Tag] =
    cloneableTags[int8Tag] = cloneableTags[int16Tag] =
    cloneableTags[int32Tag] = cloneableTags[mapTag] =
    cloneableTags[numberTag] = cloneableTags[objectTag] =
    cloneableTags[regexpTag] = cloneableTags[setTag] =
    cloneableTags[stringTag] = cloneableTags[symbolTag] =
    cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
    cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] =
    cloneableTags[weakMapTag] = false;

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /**
     * Adds the key-value `pair` to `map`.
     *
     * @private
     * @param {Object} map The map to modify.
     * @param {Array} pair The key-value pair to add.
     * @returns {Object} Returns `map`.
     */
    function addMapEntry(map, pair) {
      // Don't return `map.set` because it's not chainable in IE 11.
      map.set(pair[0], pair[1]);
      return map;
    }

    /**
     * Adds `value` to `set`.
     *
     * @private
     * @param {Object} set The set to modify.
     * @param {*} value The value to add.
     * @returns {Object} Returns `set`.
     */
    function addSetEntry(set, value) {
      // Don't return `set.add` because it's not chainable in IE 11.
      set.add(value);
      return set;
    }

    /**
     * A specialized version of `_.forEach` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEach(array, iteratee) {
      var index = -1,
          length = array ? array.length : 0;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.reduce` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initAccum] Specify using the first element of `array` as
     *  the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1,
          length = array ? array.length : 0;

      if (initAccum && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */
    function baseTimes(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    /**
     * Checks if `value` is a host object in IE < 9.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
     */
    function isHostObject(value) {
      // Many host objects are `Object` objects that can coerce to strings
      // despite having improperly defined `toString` methods.
      var result = false;
      if (value != null && typeof value.toString != 'function') {
        try {
          result = !!(value + '');
        } catch (e) {}
      }
      return result;
    }

    /**
     * Converts `map` to its key-value pairs.
     *
     * @private
     * @param {Object} map The map to convert.
     * @returns {Array} Returns the key-value pairs.
     */
    function mapToArray(map) {
      var index = -1,
          result = Array(map.size);

      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }

    /**
     * Converts `set` to an array of its values.
     *
     * @private
     * @param {Object} set The set to convert.
     * @returns {Array} Returns the values.
     */
    function setToArray(set) {
      var index = -1,
          result = Array(set.size);

      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = root['__core-js_shared__'];

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto.toString;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? root.Buffer : undefined,
        Symbol = root.Symbol,
        Uint8Array = root.Uint8Array,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeKeys = overArg(Object.keys, Object);

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(root, 'DataView'),
        Map = getNative(root, 'Map'),
        Promise = getNative(root, 'Promise'),
        Set = getNative(root, 'Set'),
        WeakMap = getNative(root, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      return getMapData(this, key)['delete'](key);
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      this.__data__ = new ListCache(entries);
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      return this.__data__['delete'](key);
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var cache = this.__data__;
      if (cache instanceof ListCache) {
        var pairs = cache.__data__;
        if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          return this;
        }
        cache = this.__data__ = new MapCache(pairs);
      }
      cache.set(key, value);
      return this;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
      // Safari 9 makes `arguments.length` enumerable in strict mode.
      var result = (isArray(value) || isArguments(value))
        ? baseTimes(value.length, String)
        : [];

      var length = result.length,
          skipIndexes = !!length;

      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) &&
            !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
          (value === undefined && !(key in object))) {
        object[key] = value;
      }
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {boolean} [isFull] Specify a clone including symbols.
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
      var result;
      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          if (isHostObject(value)) {
            return object ? value : {};
          }
          result = initCloneObject(isFunc ? {} : value);
          if (!isDeep) {
            return copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, baseClone, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      if (!isArr) {
        var props = isFull ? getAllKeys(value) : keys(value);
      }
      arrayEach(props || value, function(subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
      });
      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    function baseCreate(proto) {
      return isObject(proto) ? objectCreate(proto) : {};
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * The base implementation of `getTag`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      return objectToString.call(value);
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var result = new buffer.constructor(buffer.length);
      buffer.copy(result);
      return result;
    }

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }

    /**
     * Creates a clone of `map`.
     *
     * @private
     * @param {Object} map The map to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned map.
     */
    function cloneMap(map, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
      return arrayReduce(array, addMapEntry, new map.constructor);
    }

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /**
     * Creates a clone of `set`.
     *
     * @private
     * @param {Object} set The set to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned set.
     */
    function cloneSet(set, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
      return arrayReduce(array, addSetEntry, new set.constructor);
    }

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object, customizer) {
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        assignValue(object, key, newValue === undefined ? source[key] : newValue);
      }
      return object;
    }

    /**
     * Copies own symbol properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * Creates an array of the own enumerable symbol properties of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11,
    // for data views in Edge < 14, and promises in Node.js.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (Map && getTag(new Map) != mapTag) ||
        (Promise && getTag(Promise.resolve()) != promiseTag) ||
        (Set && getTag(new Set) != setTag) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = objectToString.call(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : undefined;

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !isPrototype(object))
        ? baseCreate(getPrototype(object))
        : {};
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, cloneFunc, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case dataViewTag:
          return cloneDataView(object, isDeep);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return cloneMap(object, isDeep, cloneFunc);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return cloneSet(object, isDeep, cloneFunc);

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length &&
        (typeof value == 'number' || reIsUint.test(value)) &&
        (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to process.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, true, true);
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
      return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
        (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 8-9 which returns 'object' for typed array and other constructors.
      var tag = isObject(value) ? objectToString.call(value) : '';
      return tag == funcTag || tag == genTag;
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return !!value && typeof value == 'object';
    }

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    module.exports = cloneDeep;
    });

    /**
     * Lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright JS Foundation and other contributors <https://js.foundation/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */

    var lodash_isequal = createCommonjsModule(function (module, exports) {
    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG = 1,
        COMPARE_UNORDERED_FLAG = 2;

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        asyncTag = '[object AsyncFunction]',
        boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        mapTag = '[object Map]',
        numberTag = '[object Number]',
        nullTag = '[object Null]',
        objectTag = '[object Object]',
        promiseTag = '[object Promise]',
        proxyTag = '[object Proxy]',
        regexpTag = '[object RegExp]',
        setTag = '[object Set]',
        stringTag = '[object String]',
        symbolTag = '[object Symbol]',
        undefinedTag = '[object Undefined]',
        weakMapTag = '[object WeakMap]';

    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /** Used to identify `toStringTag` values of typed arrays. */
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
    typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
    typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
    typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
    typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
    typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
    typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
    typedArrayTags[errorTag] = typedArrayTags[funcTag] =
    typedArrayTags[mapTag] = typedArrayTags[numberTag] =
    typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
    typedArrayTags[setTag] = typedArrayTags[stringTag] =
    typedArrayTags[weakMapTag] = false;

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Detect free variable `process` from Node.js. */
    var freeProcess = moduleExports && freeGlobal.process;

    /** Used to access faster Node.js helpers. */
    var nodeUtil = (function() {
      try {
        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }());

    /* Node.js helper references. */
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

    /**
     * A specialized version of `_.filter` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.some` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function arraySome(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */
    function baseTimes(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }

    /**
     * Checks if a `cache` value for `key` exists.
     *
     * @private
     * @param {Object} cache The cache to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function cacheHas(cache, key) {
      return cache.has(key);
    }

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    /**
     * Converts `map` to its key-value pairs.
     *
     * @private
     * @param {Object} map The map to convert.
     * @returns {Array} Returns the key-value pairs.
     */
    function mapToArray(map) {
      var index = -1,
          result = Array(map.size);

      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }

    /**
     * Converts `set` to an array of its values.
     *
     * @private
     * @param {Object} set The set to convert.
     * @returns {Array} Returns the values.
     */
    function setToArray(set) {
      var index = -1,
          result = Array(set.size);

      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = root['__core-js_shared__'];

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? root.Buffer : undefined,
        Symbol = root.Symbol,
        Uint8Array = root.Uint8Array,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice,
        symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeKeys = overArg(Object.keys, Object);

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(root, 'DataView'),
        Map = getNative(root, 'Map'),
        Promise = getNative(root, 'Promise'),
        Set = getNative(root, 'Set'),
        WeakMap = getNative(root, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = objIsArr ? arrayTag : getTag(object),
          othTag = othIsArr ? arrayTag : getTag(other);

      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;

      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(array);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var index = -1,
          result = true,
          seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!arraySome(other, function(othValue, othIndex) {
                if (!cacheHas(seen, othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
        case numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq(+object, +other);

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          objProps = getAllKeys(object),
          objLength = objProps.length,
          othProps = getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];

      try {
        value[symToStringTag] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (Map && getTag(new Map) != mapTag) ||
        (Promise && getTag(Promise.resolve()) != promiseTag) ||
        (Set && getTag(new Set) != setTag) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length &&
        (typeof value == 'number' || reIsUint.test(value)) &&
        (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are compared by strict equality, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    module.exports = isEqual;
    });

    const depsAreEqual = (deps1, deps2) => {
      return lodash_isequal(deps1, deps2)
    };

    const getDepNames = (deps) => {
      return Object.keys(deps || {})
    };

    const getUpdatedDeps = (depNames, currentData) => {
      const updatedDeps = {};
      depNames.forEach((depName) => {
        updatedDeps[depName] = currentData[depName];
      });
      return updatedDeps
    };

    const createSubscription = () => {
      const subscribers = {};

      const memoDependency = (target, dep) => {
        const { watcherName, fn } = target;
        const { prop, value } = dep;

        if (!subscribers[watcherName]) {
          subscribers[watcherName] = {
            deps: {},
            fn,
          };
        }
        subscribers[watcherName].deps[prop] = value;
      };

      return {
        subscribers,
        subscribe(target, dep) {
          if (target) {
            memoDependency(target, dep);
          }
        },
        notify(data, prop) {
          Object.entries(subscribers).forEach(([watchName, { deps, fn }]) => {
            const depNames = getDepNames(deps);

            if (depNames.includes(prop)) {
              const updatedDeps = getUpdatedDeps(depNames, data);
              if (!depsAreEqual(deps, updatedDeps)) {
                subscribers[watchName].deps = updatedDeps;
                fn();
              }
            }
          });
        },
      }
    };

    const createTargetWatcher = () => {
      let target = null;

      return {
        targetWatcher(watcherName, fn) {
          target = {
            watcherName,
            fn,
          };
          target.fn();
          target = null;
        },
        getTarget() {
          return target
        },
      }
    };

    function simplyReactive(entities, options) {
      const data = lodash_get(entities, 'data', {});
      const watch = lodash_get(entities, 'watch', {});
      const methods = lodash_get(entities, 'methods', {});
      const onChange = lodash_get(options, 'onChange', () => {});

      const { subscribe, notify, subscribers } = createSubscription();
      const { targetWatcher, getTarget } = createTargetWatcher();

      let _data;
      const _methods = {};
      const getContext = () => ({
        data: _data,
        methods: _methods,
      });

      let callingMethod = false;
      const methodWithFlags = (fn) => (...args) => {
        callingMethod = true;
        const result = fn(...args);
        callingMethod = false;
        return result
      };

      // init methods before data, as methods may be used in data
      Object.entries(methods).forEach(([methodName, methodItem]) => {
        _methods[methodName] = methodWithFlags((...args) =>
          methodItem(getContext(), ...args)
        );
        Object.defineProperty(_methods[methodName], 'name', { value: methodName });
      });

      _data = new Proxy(lodash_clonedeep(data), {
        get(target, prop) {
          if (getTarget() && !callingMethod) {
            subscribe(getTarget(), { prop, value: target[prop] });
          }
          return Reflect.get(...arguments)
        },
        set(target, prop, value) {
          // if value is the same, do nothing
          if (target[prop] === value) {
            return true
          }

          Reflect.set(...arguments);

          if (!getTarget()) {
            onChange && onChange(prop, value);
            notify(_data, prop);
          }

          return true
        },
      });

      Object.entries(watch).forEach(([watchName, watchItem]) => {
        targetWatcher(watchName, () => {
          watchItem(getContext());
        });
      });

      const output = [_data, _methods];
      output._internal = {
        _getSubscribers() {
          return subscribers
        },
      };

      return output
    }

    function getIndexesOfParticlesWithoutClonesInPage({
      pageIndex,
      particlesToShow,
      particlesToScroll,
      particlesCount,
    }) {
      const overlap = pageIndex === 0 ? 0 : particlesToShow - particlesToScroll;
      const from = pageIndex * particlesToShow - pageIndex * overlap;
      const to = from + Math.max(particlesToShow, particlesToScroll) - 1;
      const indexes = [];
      for (let i=from; i<=Math.min(particlesCount - 1, to); i++) {
        indexes.push(i);
      }
      return indexes
    }

    function getAdjacentIndexes({
      infinite,
      pageIndex,
      pagesCount,
      particlesCount,
      particlesToShow,
      particlesToScroll,
    }) {
      const _pageIndex = getValueInRange(0, pageIndex, pagesCount - 1);

      let rangeStart = _pageIndex - 1;
      let rangeEnd = _pageIndex + 1;

      rangeStart = infinite
        ? rangeStart < 0 ? pagesCount - 1 : rangeStart
        : Math.max(0, rangeStart);

      rangeEnd = infinite
        ? rangeEnd > pagesCount - 1 ? 0 : rangeEnd
        : Math.min(pagesCount - 1, rangeEnd);

      const pageIndexes = [...new Set([
        rangeStart,
        _pageIndex,
        rangeEnd,

        // because of these values outputs for infinite/non-infinites are the same
        0, // needed to clone first page particles
        pagesCount - 1, // needed to clone last page particles
      ])].sort((a, b) => a - b);
      const particleIndexes = pageIndexes.flatMap(
        pageIndex => getIndexesOfParticlesWithoutClonesInPage({
          pageIndex,
          particlesToShow,
          particlesToScroll,
          particlesCount,
        })
      );
      return {
        pageIndexes,
        particleIndexes: [...new Set(particleIndexes)].sort((a, b) => a - b),
      }
    }

    const setIntervalImmediate = (fn, ms) => {
      fn();
      return setInterval(fn, ms);
    };

    const STEP_MS = 35;
    const MAX_VALUE = 1;

    class ProgressManager {
      constructor({ onProgressValueChange }) {
        this._onProgressValueChange = onProgressValueChange;

        this._autoplayDuration;
        this._onProgressValueChange;
      
        this._interval;
        this._paused = false;
      }

      setAutoplayDuration(autoplayDuration) {
        this._autoplayDuration = autoplayDuration;
      }

      start(onFinish) {
        return new Promise((resolve) => {
          this.reset();

          const stepMs = Math.min(STEP_MS, this._autoplayDuration);
          let progress = -stepMs;
      
          this._interval = setIntervalImmediate(async () => {
            if (this._paused) {
              return
            }
            progress += stepMs;
      
            const value = progress / this._autoplayDuration;
            this._onProgressValueChange(value);
      
            if (value > MAX_VALUE) {
              this.reset();
              await onFinish();
              resolve();
            }
          }, stepMs);
        })
      }

      pause() {
        this._paused = true;
      }

      resume() {
        this._paused = false;
      }

      reset() {
        clearInterval(this._interval);
        this._onProgressValueChange(MAX_VALUE);
      }
    }

    function createCarousel(onChange) {
      const progressManager = new ProgressManager({
        onProgressValueChange: (value) => {
          onChange('progressValue', 1 - value);
        },
      });

      const reactive = simplyReactive(
        {
          data: {
            particlesCountWithoutClones: 0,
            particlesToShow: 1, // normalized
            particlesToShowInit: 1, // initial value
            particlesToScroll: 1, // normalized
            particlesToScrollInit: 1, // initial value
            particlesCount: 1,
            currentParticleIndex: 1,
            infinite: false,
            autoplayDuration: 1000,
            clonesCountHead: 0,
            clonesCountTail: 0,
            clonesCountTotal: 0,
            partialPageSize: 1,
            currentPageIndex: 1,
            pagesCount: 1,
            pauseOnFocus: false,
            focused: false,
            autoplay: false,
            autoplayDirection: 'next',
            disabled: false, // disable page change while animation is in progress
            durationMsInit: 1000,
            durationMs: 1000,
            offset: 0,
            particleWidth: 0,
            loaded: [],
          },
          watch: {
            setLoaded({ data }) {
              data.loaded = getAdjacentIndexes({
                infinite: data.infinite,
                pageIndex: data.currentPageIndex,
                pagesCount: data.pagesCount,
                particlesCount: data.particlesCountWithoutClones,
                particlesToShow: data.particlesToShow,
                particlesToScroll: data.particlesToScroll,
              }).particleIndexes;
            },
            setCurrentPageIndex({ data }) {
              data.currentPageIndex = getCurrentPageIndexByCurrentParticleIndex({
                currentParticleIndex: data.currentParticleIndex,
                particlesCount: data.particlesCount,
                clonesCountHead: data.clonesCountHead,
                clonesCountTotal: data.clonesCountTotal,
                infinite: data.infinite,
                particlesToScroll: data.particlesToScroll,
              });
            },
            setPartialPageSize({ data }) {
              data.partialPageSize = getPartialPageSize({
                particlesToScroll: data.particlesToScroll,
                particlesToShow: data.particlesToShow,
                particlesCountWithoutClones: data.particlesCountWithoutClones,
              });
            },
            setClonesCount({ data }) {
              const { head, tail } = getClonesCount({
                infinite: data.infinite,
                particlesToShow: data.particlesToShow,
                partialPageSize: data.partialPageSize,
              });
              data.clonesCountHead = head;
              data.clonesCountTail = tail;
              data.clonesCountTotal = head + tail;
            },
            setProgressManagerAutoplayDuration({ data }) {
              progressManager.setAutoplayDuration(data.autoplayDuration);
            },
            toggleProgressManager({ data: { pauseOnFocus, focused } }) {
              // as focused is in if block, it will not be put to deps, read them in data: {}
              if (pauseOnFocus) {
                if (focused) {
                  progressManager.pause();
                } else {
                  progressManager.resume();
                }
              }
            },
            initDuration({ data }) {
              data.durationMs = data.durationMsInit;
            },
            applyAutoplay({ data, methods: { _applyAutoplayIfNeeded } }) {
              // prevent _applyAutoplayIfNeeded to be called with watcher
              // to prevent its data added to deps
              data.autoplay && _applyAutoplayIfNeeded(data.autoplay);
            },
            setPagesCount({ data }) {
              data.pagesCount = getPagesCountByParticlesCount({
                infinite: data.infinite,
                particlesCountWithoutClones: data.particlesCountWithoutClones,
                particlesToScroll: data.particlesToScroll,
                particlesToShow: data.particlesToShow,
              });
            },
            setParticlesToShow({ data }) {
              data.particlesToShow = getValueInRange(
                1,
                data.particlesToShowInit,
                data.particlesCountWithoutClones
              );
            },
            setParticlesToScroll({ data }) {
              data.particlesToScroll = getValueInRange(
                1,
                data.particlesToScrollInit,
                data.particlesCountWithoutClones
              );
            },
          },
          methods: {
            _prev({ data }) {
              data.currentParticleIndex = getParticleIndexByPageIndex({
                infinite: data.infinite,
                pageIndex: data.currentPageIndex - 1,
                clonesCountHead: data.clonesCountHead,
                clonesCountTail: data.clonesCountTail,
                particlesToScroll: data.particlesToScroll,
                particlesCount: data.particlesCount,
                particlesToShow: data.particlesToShow,
              });
            },
            _next({ data }) {
              data.currentParticleIndex = getParticleIndexByPageIndex({
                infinite: data.infinite,
                pageIndex: data.currentPageIndex + 1,
                clonesCountHead: data.clonesCountHead,
                clonesCountTail: data.clonesCountTail,
                particlesToScroll: data.particlesToScroll,
                particlesCount: data.particlesCount,
                particlesToShow: data.particlesToShow,
              });
            },
            _moveToParticle({ data }, particleIndex) {
              data.currentParticleIndex = getValueInRange(
                0,
                particleIndex,
                data.particlesCount - 1
              );
            },
            toggleFocused({ data }) {
              data.focused = !data.focused;
            },
            async _applyAutoplayIfNeeded({ data, methods }) {
              // prevent progress change if not infinite for first and last page
              if (
                !data.infinite &&
                ((data.autoplayDirection === NEXT &&
                  data.currentParticleIndex === data.particlesCount - 1) ||
                  (data.autoplayDirection === PREV &&
                    data.currentParticleIndex === 0))
              ) {
                progressManager.reset();
                return
              }

              if (data.autoplay) {
                const onFinish = () =>
                  switcher({
                    [NEXT]: async () => methods.showNextPage(),
                    [PREV]: async () => methods.showPrevPage(),
                  })(data.autoplayDirection);

                await progressManager.start(onFinish);
              }
            },
            // makes delayed jump to 1st or last element
            async _jumpIfNeeded({ data, methods }) {
              let jumped = false;
              if (data.infinite) {
                if (data.currentParticleIndex === 0) {
                  await methods.showParticle(
                    data.particlesCount - data.clonesCountTotal,
                    {
                      animated: false,
                    }
                  );
                  jumped = true;
                } else if (
                  data.currentParticleIndex ===
                  data.particlesCount - data.clonesCountTail
                ) {
                  await methods.showParticle(data.clonesCountHead, {
                    animated: false,
                  });
                  jumped = true;
                }
              }
              return jumped
            },
            async changePage({ data, methods }, updateStoreFn, options) {
              progressManager.reset();
              if (data.disabled) return
              data.disabled = true;

              updateStoreFn();
              await methods.offsetPage({ animated: get$1(options, 'animated', true) });
              data.disabled = false;

              const jumped = await methods._jumpIfNeeded();
              !jumped && methods._applyAutoplayIfNeeded(); // no need to wait it finishes
            },
            async showNextPage({ data, methods }, options) {
              if (data.disabled) return
              await methods.changePage(methods._next, options);
            },
            async showPrevPage({ data, methods }, options) {
              if (data.disabled) return
              await methods.changePage(methods._prev, options);
            },
            async showParticle({ methods }, particleIndex, options) {
              await methods.changePage(
                () => methods._moveToParticle(particleIndex),
                options
              );
            },
            _getParticleIndexByPageIndex({ data }, pageIndex) {
              return getParticleIndexByPageIndex({
                infinite: data.infinite,
                pageIndex,
                clonesCountHead: data.clonesCountHead,
                clonesCountTail: data.clonesCountTail,
                particlesToScroll: data.particlesToScroll,
                particlesCount: data.particlesCount,
                particlesToShow: data.particlesToShow,
              })
            },
            async showPage({ methods }, pageIndex, options) {
              const particleIndex = methods._getParticleIndexByPageIndex(pageIndex);
              await methods.showParticle(particleIndex, options);
            },
            offsetPage({ data }, options) {
              const animated = get$1(options, 'animated', true);
              return new Promise((resolve) => {
                // durationMs is an offset animation time
                data.durationMs = animated ? data.durationMsInit : 0;
                data.offset = -data.currentParticleIndex * data.particleWidth;
                setTimeout(() => {
                  resolve();
                }, data.durationMs);
              })
            },
          },
        },
        {
          onChange,
        }
      );
      const [data, methods] = reactive;

      return [{ data, progressManager }, methods, reactive._internal]
    }

    /* node_modules\svelte-carousel\src\components\Carousel\Carousel.svelte generated by Svelte v3.46.4 */

    const { Error: Error_1 } = globals;
    const file$v = "node_modules\\svelte-carousel\\src\\components\\Carousel\\Carousel.svelte";

    const get_dots_slot_changes = dirty => ({
    	currentPageIndex: dirty[0] & /*currentPageIndex*/ 64,
    	pagesCount: dirty[0] & /*pagesCount*/ 1024,
    	loaded: dirty[0] & /*loaded*/ 32
    });

    const get_dots_slot_context = ctx => ({
    	currentPageIndex: /*currentPageIndex*/ ctx[6],
    	pagesCount: /*pagesCount*/ ctx[10],
    	showPage: /*handlePageChange*/ ctx[15],
    	loaded: /*loaded*/ ctx[5]
    });

    const get_next_slot_changes = dirty => ({ loaded: dirty[0] & /*loaded*/ 32 });

    const get_next_slot_context = ctx => ({
    	showNextPage: /*methods*/ ctx[14].showNextPage,
    	loaded: /*loaded*/ ctx[5]
    });

    const get_default_slot_changes = dirty => ({ loaded: dirty[0] & /*loaded*/ 32 });
    const get_default_slot_context = ctx => ({ loaded: /*loaded*/ ctx[5] });
    const get_prev_slot_changes = dirty => ({ loaded: dirty[0] & /*loaded*/ 32 });

    const get_prev_slot_context = ctx => ({
    	showPrevPage: /*methods*/ ctx[14].showPrevPage,
    	loaded: /*loaded*/ ctx[5]
    });

    // (255:4) {#if arrows}
    function create_if_block_3$3(ctx) {
    	let current;
    	const prev_slot_template = /*#slots*/ ctx[37].prev;
    	const prev_slot = create_slot(prev_slot_template, ctx, /*$$scope*/ ctx[36], get_prev_slot_context);
    	const prev_slot_or_fallback = prev_slot || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (prev_slot_or_fallback) prev_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (prev_slot_or_fallback) {
    				prev_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (prev_slot) {
    				if (prev_slot.p && (!current || dirty[0] & /*loaded*/ 32 | dirty[1] & /*$$scope*/ 32)) {
    					update_slot_base(
    						prev_slot,
    						prev_slot_template,
    						ctx,
    						/*$$scope*/ ctx[36],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[36])
    						: get_slot_changes(prev_slot_template, /*$$scope*/ ctx[36], dirty, get_prev_slot_changes),
    						get_prev_slot_context
    					);
    				}
    			} else {
    				if (prev_slot_or_fallback && prev_slot_or_fallback.p && (!current || dirty[0] & /*infinite, currentPageIndex*/ 68)) {
    					prev_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prev_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prev_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (prev_slot_or_fallback) prev_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(255:4) {#if arrows}",
    		ctx
    	});

    	return block;
    }

    // (256:60)           
    function fallback_block_2(ctx) {
    	let div;
    	let arrow;
    	let current;

    	arrow = new Arrow({
    			props: {
    				direction: "prev",
    				disabled: !/*infinite*/ ctx[2] && /*currentPageIndex*/ ctx[6] === 0
    			},
    			$$inline: true
    		});

    	arrow.$on("click", /*showPrevPage*/ ctx[23]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(arrow.$$.fragment);
    			attr_dev(div, "class", "sc-carousel__arrow-container svelte-h7bw08");
    			add_location(div, file$v, 256, 8, 6291);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(arrow, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const arrow_changes = {};
    			if (dirty[0] & /*infinite, currentPageIndex*/ 68) arrow_changes.disabled = !/*infinite*/ ctx[2] && /*currentPageIndex*/ ctx[6] === 0;
    			arrow.$set(arrow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(arrow);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(256:60)           ",
    		ctx
    	});

    	return block;
    }

    // (293:6) {#if autoplayProgressVisible}
    function create_if_block_2$4(ctx) {
    	let div;
    	let progress;
    	let current;

    	progress = new Progress({
    			props: { value: /*progressValue*/ ctx[7] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(progress.$$.fragment);
    			attr_dev(div, "class", "sc-carousel-progress__container svelte-h7bw08");
    			add_location(div, file$v, 293, 8, 7421);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(progress, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const progress_changes = {};
    			if (dirty[0] & /*progressValue*/ 128) progress_changes.value = /*progressValue*/ ctx[7];
    			progress.$set(progress_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progress.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progress.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(progress);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(293:6) {#if autoplayProgressVisible}",
    		ctx
    	});

    	return block;
    }

    // (299:4) {#if arrows}
    function create_if_block_1$5(ctx) {
    	let current;
    	const next_slot_template = /*#slots*/ ctx[37].next;
    	const next_slot = create_slot(next_slot_template, ctx, /*$$scope*/ ctx[36], get_next_slot_context);
    	const next_slot_or_fallback = next_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (next_slot_or_fallback) next_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (next_slot_or_fallback) {
    				next_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (next_slot) {
    				if (next_slot.p && (!current || dirty[0] & /*loaded*/ 32 | dirty[1] & /*$$scope*/ 32)) {
    					update_slot_base(
    						next_slot,
    						next_slot_template,
    						ctx,
    						/*$$scope*/ ctx[36],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[36])
    						: get_slot_changes(next_slot_template, /*$$scope*/ ctx[36], dirty, get_next_slot_changes),
    						get_next_slot_context
    					);
    				}
    			} else {
    				if (next_slot_or_fallback && next_slot_or_fallback.p && (!current || dirty[0] & /*infinite, currentPageIndex, pagesCount*/ 1092)) {
    					next_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(next_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(next_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (next_slot_or_fallback) next_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(299:4) {#if arrows}",
    		ctx
    	});

    	return block;
    }

    // (300:60)           
    function fallback_block_1(ctx) {
    	let div;
    	let arrow;
    	let current;

    	arrow = new Arrow({
    			props: {
    				direction: "next",
    				disabled: !/*infinite*/ ctx[2] && /*currentPageIndex*/ ctx[6] === /*pagesCount*/ ctx[10] - 1
    			},
    			$$inline: true
    		});

    	arrow.$on("click", /*methods*/ ctx[14].showNextPage);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(arrow.$$.fragment);
    			attr_dev(div, "class", "sc-carousel__arrow-container svelte-h7bw08");
    			add_location(div, file$v, 300, 8, 7643);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(arrow, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const arrow_changes = {};
    			if (dirty[0] & /*infinite, currentPageIndex, pagesCount*/ 1092) arrow_changes.disabled = !/*infinite*/ ctx[2] && /*currentPageIndex*/ ctx[6] === /*pagesCount*/ ctx[10] - 1;
    			arrow.$set(arrow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(arrow);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(300:60)           ",
    		ctx
    	});

    	return block;
    }

    // (311:2) {#if dots}
    function create_if_block$a(ctx) {
    	let current;
    	const dots_slot_template = /*#slots*/ ctx[37].dots;
    	const dots_slot = create_slot(dots_slot_template, ctx, /*$$scope*/ ctx[36], get_dots_slot_context);
    	const dots_slot_or_fallback = dots_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (dots_slot_or_fallback) dots_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (dots_slot_or_fallback) {
    				dots_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dots_slot) {
    				if (dots_slot.p && (!current || dirty[0] & /*currentPageIndex, pagesCount, loaded*/ 1120 | dirty[1] & /*$$scope*/ 32)) {
    					update_slot_base(
    						dots_slot,
    						dots_slot_template,
    						ctx,
    						/*$$scope*/ ctx[36],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[36])
    						: get_slot_changes(dots_slot_template, /*$$scope*/ ctx[36], dirty, get_dots_slot_changes),
    						get_dots_slot_context
    					);
    				}
    			} else {
    				if (dots_slot_or_fallback && dots_slot_or_fallback.p && (!current || dirty[0] & /*pagesCount, currentPageIndex*/ 1088)) {
    					dots_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dots_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dots_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (dots_slot_or_fallback) dots_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(311:2) {#if dots}",
    		ctx
    	});

    	return block;
    }

    // (317:5)         
    function fallback_block(ctx) {
    	let dots_1;
    	let current;

    	dots_1 = new Dots({
    			props: {
    				pagesCount: /*pagesCount*/ ctx[10],
    				currentPageIndex: /*currentPageIndex*/ ctx[6]
    			},
    			$$inline: true
    		});

    	dots_1.$on("pageChange", /*pageChange_handler*/ ctx[41]);

    	const block = {
    		c: function create() {
    			create_component(dots_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dots_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dots_1_changes = {};
    			if (dirty[0] & /*pagesCount*/ 1024) dots_1_changes.pagesCount = /*pagesCount*/ ctx[10];
    			if (dirty[0] & /*currentPageIndex*/ 64) dots_1_changes.currentPageIndex = /*currentPageIndex*/ ctx[6];
    			dots_1.$set(dots_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dots_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dots_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dots_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(317:5)         ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let div3;
    	let div2;
    	let t0;
    	let div1;
    	let div0;
    	let swipeable_action;
    	let t1;
    	let t2;
    	let t3;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*arrows*/ ctx[1] && create_if_block_3$3(ctx);
    	const default_slot_template = /*#slots*/ ctx[37].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[36], get_default_slot_context);
    	let if_block1 = /*autoplayProgressVisible*/ ctx[3] && create_if_block_2$4(ctx);
    	let if_block2 = /*arrows*/ ctx[1] && create_if_block_1$5(ctx);
    	let if_block3 = /*dots*/ ctx[4] && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(div0, "class", "sc-carousel__pages-container svelte-h7bw08");
    			set_style(div0, "transform", "translateX(" + /*offset*/ ctx[8] + "px)");
    			set_style(div0, "transition-duration", /*durationMs*/ ctx[9] + "ms");
    			set_style(div0, "transition-timing-function", /*timingFunction*/ ctx[0]);
    			add_location(div0, file$v, 275, 6, 6748);
    			attr_dev(div1, "class", "sc-carousel__pages-window svelte-h7bw08");
    			add_location(div1, file$v, 265, 4, 6540);
    			attr_dev(div2, "class", "sc-carousel__content-container svelte-h7bw08");
    			add_location(div2, file$v, 253, 2, 6157);
    			attr_dev(div3, "class", "sc-carousel__carousel-container svelte-h7bw08");
    			add_location(div3, file$v, 252, 0, 6108);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[39](div0);
    			append_dev(div1, t1);
    			if (if_block1) if_block1.m(div1, null);
    			/*div1_binding*/ ctx[40](div1);
    			append_dev(div2, t2);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div3, t3);
    			if (if_block3) if_block3.m(div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(swipeable_action = swipeable.call(null, div0, {
    						thresholdProvider: /*swipeable_function*/ ctx[38]
    					})),
    					listen_dev(div0, "swipeStart", /*handleSwipeStart*/ ctx[16], false, false, false),
    					listen_dev(div0, "swipeMove", /*handleSwipeMove*/ ctx[18], false, false, false),
    					listen_dev(div0, "swipeEnd", /*handleSwipeEnd*/ ctx[19], false, false, false),
    					listen_dev(div0, "swipeFailed", /*handleSwipeFailed*/ ctx[20], false, false, false),
    					listen_dev(div0, "swipeThresholdReached", /*handleSwipeThresholdReached*/ ctx[17], false, false, false),
    					action_destroyer(hoverable.call(null, div1)),
    					listen_dev(div1, "hovered", /*handleHovered*/ ctx[21], false, false, false),
    					action_destroyer(tappable.call(null, div1)),
    					listen_dev(div1, "tapped", /*handleTapped*/ ctx[22], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*arrows*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*arrows*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div2, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*loaded*/ 32 | dirty[1] & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[36],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[36])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[36], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			if (!current || dirty[0] & /*offset*/ 256) {
    				set_style(div0, "transform", "translateX(" + /*offset*/ ctx[8] + "px)");
    			}

    			if (!current || dirty[0] & /*durationMs*/ 512) {
    				set_style(div0, "transition-duration", /*durationMs*/ ctx[9] + "ms");
    			}

    			if (!current || dirty[0] & /*timingFunction*/ 1) {
    				set_style(div0, "transition-timing-function", /*timingFunction*/ ctx[0]);
    			}

    			if (swipeable_action && is_function(swipeable_action.update) && dirty[0] & /*pageWindowWidth*/ 2048) swipeable_action.update.call(null, {
    				thresholdProvider: /*swipeable_function*/ ctx[38]
    			});

    			if (/*autoplayProgressVisible*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*autoplayProgressVisible*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2$4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*arrows*/ ctx[1]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*arrows*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1$5(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div2, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*dots*/ ctx[4]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*dots*/ 16) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block$a(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div3, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(default_slot, local);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(default_slot, local);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block0) if_block0.d();
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[39](null);
    			if (if_block1) if_block1.d();
    			/*div1_binding*/ ctx[40](null);
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Carousel', slots, ['prev','default','next','dots']);
    	let loaded = [];
    	let currentPageIndex;
    	let progressValue;
    	let offset = 0;
    	let durationMs = 0;
    	let pagesCount = 1;

    	const [{ data, progressManager }, methods, service] = createCarousel((key, value) => {
    		switcher({
    			'currentPageIndex': () => $$invalidate(6, currentPageIndex = value),
    			'progressValue': () => $$invalidate(7, progressValue = value),
    			'offset': () => $$invalidate(8, offset = value),
    			'durationMs': () => $$invalidate(9, durationMs = value),
    			'pagesCount': () => $$invalidate(10, pagesCount = value),
    			'loaded': () => $$invalidate(5, loaded = value)
    		})(key);
    	});

    	const dispatch = createEventDispatcher();
    	let { timingFunction = 'ease-in-out' } = $$props;
    	let { arrows = true } = $$props;
    	let { infinite = true } = $$props;
    	let { initialPageIndex = 0 } = $$props;
    	let { duration = 500 } = $$props;
    	let { autoplay = false } = $$props;
    	let { autoplayDuration = 3000 } = $$props;
    	let { autoplayDirection = NEXT } = $$props;
    	let { pauseOnFocus = false } = $$props;
    	let { autoplayProgressVisible = false } = $$props;
    	let { dots = true } = $$props;
    	let { swiping = true } = $$props;
    	let { particlesToShow = 1 } = $$props;
    	let { particlesToScroll = 1 } = $$props;

    	async function goTo(pageIndex, options) {
    		const animated = get$1(options, 'animated', true);

    		if (typeof pageIndex !== 'number') {
    			throw new Error('pageIndex should be a number');
    		}

    		await methods.showPage(pageIndex, { animated });
    	}

    	async function goToPrev(options) {
    		const animated = get$1(options, 'animated', true);
    		await methods.showPrevPage({ animated });
    	}

    	async function goToNext(options) {
    		const animated = get$1(options, 'animated', true);
    		await methods.showNextPage({ animated });
    	}

    	let pageWindowWidth = 0;
    	let pageWindowElement;
    	let particlesContainer;

    	const pageWindowElementResizeObserver = createResizeObserver(({ width }) => {
    		$$invalidate(11, pageWindowWidth = width);
    		data.particleWidth = pageWindowWidth / data.particlesToShow;

    		applyParticleSizes({
    			particlesContainerChildren: particlesContainer.children,
    			particleWidth: data.particleWidth
    		});

    		methods.offsetPage({ animated: false });
    	});

    	function addClones() {
    		const { clonesToAppend, clonesToPrepend } = getClones({
    			clonesCountHead: data.clonesCountHead,
    			clonesCountTail: data.clonesCountTail,
    			particlesContainerChildren: particlesContainer.children
    		});

    		applyClones({
    			particlesContainer,
    			clonesToAppend,
    			clonesToPrepend
    		});
    	}

    	onMount(() => {
    		(async () => {
    			await tick();

    			if (particlesContainer && pageWindowElement) {
    				data.particlesCountWithoutClones = particlesContainer.children.length;
    				await tick();
    				data.infinite && addClones();

    				// call after adding clones
    				data.particlesCount = particlesContainer.children.length;

    				methods.showPage(initialPageIndex, { animated: false });
    				pageWindowElementResizeObserver.observe(pageWindowElement);
    			}
    		})();
    	});

    	onDestroy(() => {
    		pageWindowElementResizeObserver.disconnect();
    		progressManager.reset();
    	});

    	async function handlePageChange(pageIndex) {
    		await methods.showPage(pageIndex, { animated: true });
    	}

    	// gestures
    	function handleSwipeStart() {
    		if (!swiping) return;
    		data.durationMs = 0;
    	}

    	async function handleSwipeThresholdReached(event) {
    		if (!swiping) return;

    		await switcher({
    			[NEXT]: methods.showNextPage,
    			[PREV]: methods.showPrevPage
    		})(event.detail.direction);
    	}

    	function handleSwipeMove(event) {
    		if (!swiping) return;
    		data.offset += event.detail.dx;
    	}

    	function handleSwipeEnd() {
    		if (!swiping) return;
    		methods.showParticle(data.currentParticleIndex);
    	}

    	async function handleSwipeFailed() {
    		if (!swiping) return;
    		await methods.offsetPage({ animated: true });
    	}

    	function handleHovered(event) {
    		data.focused = event.detail.value;
    	}

    	function handleTapped() {
    		methods.toggleFocused();
    	}

    	function showPrevPage() {
    		methods.showPrevPage();
    	}

    	const writable_props = [
    		'timingFunction',
    		'arrows',
    		'infinite',
    		'initialPageIndex',
    		'duration',
    		'autoplay',
    		'autoplayDuration',
    		'autoplayDirection',
    		'pauseOnFocus',
    		'autoplayProgressVisible',
    		'dots',
    		'swiping',
    		'particlesToShow',
    		'particlesToScroll'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Carousel> was created with unknown prop '${key}'`);
    	});

    	const swipeable_function = () => pageWindowWidth / 3;

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			particlesContainer = $$value;
    			$$invalidate(13, particlesContainer);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			pageWindowElement = $$value;
    			$$invalidate(12, pageWindowElement);
    		});
    	}

    	const pageChange_handler = event => handlePageChange(event.detail);

    	$$self.$$set = $$props => {
    		if ('timingFunction' in $$props) $$invalidate(0, timingFunction = $$props.timingFunction);
    		if ('arrows' in $$props) $$invalidate(1, arrows = $$props.arrows);
    		if ('infinite' in $$props) $$invalidate(2, infinite = $$props.infinite);
    		if ('initialPageIndex' in $$props) $$invalidate(24, initialPageIndex = $$props.initialPageIndex);
    		if ('duration' in $$props) $$invalidate(25, duration = $$props.duration);
    		if ('autoplay' in $$props) $$invalidate(26, autoplay = $$props.autoplay);
    		if ('autoplayDuration' in $$props) $$invalidate(27, autoplayDuration = $$props.autoplayDuration);
    		if ('autoplayDirection' in $$props) $$invalidate(28, autoplayDirection = $$props.autoplayDirection);
    		if ('pauseOnFocus' in $$props) $$invalidate(29, pauseOnFocus = $$props.pauseOnFocus);
    		if ('autoplayProgressVisible' in $$props) $$invalidate(3, autoplayProgressVisible = $$props.autoplayProgressVisible);
    		if ('dots' in $$props) $$invalidate(4, dots = $$props.dots);
    		if ('swiping' in $$props) $$invalidate(30, swiping = $$props.swiping);
    		if ('particlesToShow' in $$props) $$invalidate(31, particlesToShow = $$props.particlesToShow);
    		if ('particlesToScroll' in $$props) $$invalidate(32, particlesToScroll = $$props.particlesToScroll);
    		if ('$$scope' in $$props) $$invalidate(36, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		onMount,
    		tick,
    		createEventDispatcher,
    		Dots,
    		Arrow,
    		Progress,
    		NEXT,
    		PREV,
    		swipeable,
    		hoverable,
    		tappable,
    		applyParticleSizes,
    		createResizeObserver,
    		getClones,
    		applyClones,
    		get: get$1,
    		switcher,
    		createCarousel,
    		loaded,
    		currentPageIndex,
    		progressValue,
    		offset,
    		durationMs,
    		pagesCount,
    		data,
    		progressManager,
    		methods,
    		service,
    		dispatch,
    		timingFunction,
    		arrows,
    		infinite,
    		initialPageIndex,
    		duration,
    		autoplay,
    		autoplayDuration,
    		autoplayDirection,
    		pauseOnFocus,
    		autoplayProgressVisible,
    		dots,
    		swiping,
    		particlesToShow,
    		particlesToScroll,
    		goTo,
    		goToPrev,
    		goToNext,
    		pageWindowWidth,
    		pageWindowElement,
    		particlesContainer,
    		pageWindowElementResizeObserver,
    		addClones,
    		handlePageChange,
    		handleSwipeStart,
    		handleSwipeThresholdReached,
    		handleSwipeMove,
    		handleSwipeEnd,
    		handleSwipeFailed,
    		handleHovered,
    		handleTapped,
    		showPrevPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('loaded' in $$props) $$invalidate(5, loaded = $$props.loaded);
    		if ('currentPageIndex' in $$props) $$invalidate(6, currentPageIndex = $$props.currentPageIndex);
    		if ('progressValue' in $$props) $$invalidate(7, progressValue = $$props.progressValue);
    		if ('offset' in $$props) $$invalidate(8, offset = $$props.offset);
    		if ('durationMs' in $$props) $$invalidate(9, durationMs = $$props.durationMs);
    		if ('pagesCount' in $$props) $$invalidate(10, pagesCount = $$props.pagesCount);
    		if ('timingFunction' in $$props) $$invalidate(0, timingFunction = $$props.timingFunction);
    		if ('arrows' in $$props) $$invalidate(1, arrows = $$props.arrows);
    		if ('infinite' in $$props) $$invalidate(2, infinite = $$props.infinite);
    		if ('initialPageIndex' in $$props) $$invalidate(24, initialPageIndex = $$props.initialPageIndex);
    		if ('duration' in $$props) $$invalidate(25, duration = $$props.duration);
    		if ('autoplay' in $$props) $$invalidate(26, autoplay = $$props.autoplay);
    		if ('autoplayDuration' in $$props) $$invalidate(27, autoplayDuration = $$props.autoplayDuration);
    		if ('autoplayDirection' in $$props) $$invalidate(28, autoplayDirection = $$props.autoplayDirection);
    		if ('pauseOnFocus' in $$props) $$invalidate(29, pauseOnFocus = $$props.pauseOnFocus);
    		if ('autoplayProgressVisible' in $$props) $$invalidate(3, autoplayProgressVisible = $$props.autoplayProgressVisible);
    		if ('dots' in $$props) $$invalidate(4, dots = $$props.dots);
    		if ('swiping' in $$props) $$invalidate(30, swiping = $$props.swiping);
    		if ('particlesToShow' in $$props) $$invalidate(31, particlesToShow = $$props.particlesToShow);
    		if ('particlesToScroll' in $$props) $$invalidate(32, particlesToScroll = $$props.particlesToScroll);
    		if ('pageWindowWidth' in $$props) $$invalidate(11, pageWindowWidth = $$props.pageWindowWidth);
    		if ('pageWindowElement' in $$props) $$invalidate(12, pageWindowElement = $$props.pageWindowElement);
    		if ('particlesContainer' in $$props) $$invalidate(13, particlesContainer = $$props.particlesContainer);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*infinite*/ 4) {
    			{
    				data.infinite = infinite;
    			}
    		}

    		if ($$self.$$.dirty[0] & /*duration*/ 33554432) {
    			{
    				data.durationMsInit = duration;
    			}
    		}

    		if ($$self.$$.dirty[0] & /*autoplay*/ 67108864) {
    			{
    				data.autoplay = autoplay;
    			}
    		}

    		if ($$self.$$.dirty[0] & /*autoplayDuration*/ 134217728) {
    			{
    				data.autoplayDuration = autoplayDuration;
    			}
    		}

    		if ($$self.$$.dirty[0] & /*autoplayDirection*/ 268435456) {
    			{
    				data.autoplayDirection = autoplayDirection;
    			}
    		}

    		if ($$self.$$.dirty[0] & /*pauseOnFocus*/ 536870912) {
    			{
    				data.pauseOnFocus = pauseOnFocus;
    			}
    		}

    		if ($$self.$$.dirty[1] & /*particlesToShow*/ 1) {
    			{
    				data.particlesToShowInit = particlesToShow;
    			}
    		}

    		if ($$self.$$.dirty[1] & /*particlesToScroll*/ 2) {
    			{
    				data.particlesToScrollInit = particlesToScroll;
    			}
    		}
    	};

    	return [
    		timingFunction,
    		arrows,
    		infinite,
    		autoplayProgressVisible,
    		dots,
    		loaded,
    		currentPageIndex,
    		progressValue,
    		offset,
    		durationMs,
    		pagesCount,
    		pageWindowWidth,
    		pageWindowElement,
    		particlesContainer,
    		methods,
    		handlePageChange,
    		handleSwipeStart,
    		handleSwipeThresholdReached,
    		handleSwipeMove,
    		handleSwipeEnd,
    		handleSwipeFailed,
    		handleHovered,
    		handleTapped,
    		showPrevPage,
    		initialPageIndex,
    		duration,
    		autoplay,
    		autoplayDuration,
    		autoplayDirection,
    		pauseOnFocus,
    		swiping,
    		particlesToShow,
    		particlesToScroll,
    		goTo,
    		goToPrev,
    		goToNext,
    		$$scope,
    		slots,
    		swipeable_function,
    		div0_binding,
    		div1_binding,
    		pageChange_handler
    	];
    }

    class Carousel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$w,
    			create_fragment$w,
    			safe_not_equal,
    			{
    				timingFunction: 0,
    				arrows: 1,
    				infinite: 2,
    				initialPageIndex: 24,
    				duration: 25,
    				autoplay: 26,
    				autoplayDuration: 27,
    				autoplayDirection: 28,
    				pauseOnFocus: 29,
    				autoplayProgressVisible: 3,
    				dots: 4,
    				swiping: 30,
    				particlesToShow: 31,
    				particlesToScroll: 32,
    				goTo: 33,
    				goToPrev: 34,
    				goToNext: 35
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Carousel",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get timingFunction() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set timingFunction(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get arrows() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set arrows(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get infinite() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set infinite(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get initialPageIndex() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initialPageIndex(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoplay() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoplay(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoplayDuration() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoplayDuration(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoplayDirection() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoplayDirection(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pauseOnFocus() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pauseOnFocus(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoplayProgressVisible() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoplayProgressVisible(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dots() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dots(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get swiping() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set swiping(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get particlesToShow() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set particlesToShow(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get particlesToScroll() {
    		throw new Error_1("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set particlesToScroll(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get goTo() {
    		return this.$$.ctx[33];
    	}

    	set goTo(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get goToPrev() {
    		return this.$$.ctx[34];
    	}

    	set goToPrev(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get goToNext() {
    		return this.$$.ctx[35];
    	}

    	set goToNext(value) {
    		throw new Error_1("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\main_elements\slider.svelte generated by Svelte v3.46.4 */
    const file$u = "src\\subpages\\main_elements\\slider.svelte";

    function get_each_context$j(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (23:4) {#each settings.slider as slide}
    function create_each_block$j(ctx) {
    	let div;
    	let span;
    	let t0_value = /*slide*/ ctx[7].name + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			set_style(span, "color", /*settings*/ ctx[0].slider_font_color);
    			add_location(span, file$u, 25, 8, 906);
    			attr_dev(div, "class", "slide");
    			set_style(div, "background-image", "url(" + /*slide*/ ctx[7].src + ")");
    			add_location(div, file$u, 23, 8, 824);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*slide*/ ctx[7].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(span, "color", /*settings*/ ctx[0].slider_font_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div, "background-image", "url(" + /*slide*/ ctx[7].src + ")");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$j.name,
    		type: "each",
    		source: "(23:4) {#each settings.slider as slide}",
    		ctx
    	});

    	return block;
    }

    // (9:4) <Carousel      bind:this={carousel}      autoplay="true"      duration={settings.slide_duration}      let:showPrevPage      let:showNextPage    >
    function create_default_slot$4(ctx) {
    	let each_1_anchor;
    	let each_value = /*settings*/ ctx[0].slider;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$j(get_each_context$j(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1) {
    				each_value = /*settings*/ ctx[0].slider;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$j(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$j(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(9:4) <Carousel      bind:this={carousel}      autoplay=\\\"true\\\"      duration={settings.slide_duration}      let:showPrevPage      let:showNextPage    >",
    		ctx
    	});

    	return block;
    }

    // (16:2) 
    function create_prev_slot(ctx) {
    	let div1;
    	let div0;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			i = element("i");
    			attr_dev(i, "class", "sc-carousel-arrow__arrow svelte-9ztt4p sc-carousel-arrow__arrow-prev");
    			add_location(i, file$u, 16, 99, 441);
    			attr_dev(div0, "class", "sc-carousel-arrow__circle svelte-9ztt4p left");
    			add_location(div0, file$u, 16, 4, 346);
    			attr_dev(div1, "slot", "prev");
    			add_location(div1, file$u, 15, 2, 323);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, i);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler_1*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_prev_slot.name,
    		type: "slot",
    		source: "(16:2) ",
    		ctx
    	});

    	return block;
    }

    // (19:2) 
    function create_next_slot(ctx) {
    	let div1;
    	let div0;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			i = element("i");
    			attr_dev(i, "class", "sc-carousel-arrow__arrow svelte-9ztt4p sc-carousel-arrow__arrow-next");
    			add_location(i, file$u, 19, 100, 664);
    			attr_dev(div0, "class", "sc-carousel-arrow__circle svelte-9ztt4p right");
    			add_location(div0, file$u, 19, 4, 568);
    			attr_dev(div1, "slot", "next");
    			add_location(div1, file$u, 18, 2, 545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, i);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_next_slot.name,
    		type: "slot",
    		source: "(19:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let article;
    	let carousel_1;
    	let current;

    	let carousel_1_props = {
    		autoplay: "true",
    		duration: /*settings*/ ctx[0].slide_duration,
    		$$slots: {
    			next: [
    				create_next_slot,
    				({ showPrevPage, showNextPage }) => ({ 5: showPrevPage, 6: showNextPage }),
    				({ showPrevPage, showNextPage }) => (showPrevPage ? 32 : 0) | (showNextPage ? 64 : 0)
    			],
    			prev: [
    				create_prev_slot,
    				({ showPrevPage, showNextPage }) => ({ 5: showPrevPage, 6: showNextPage }),
    				({ showPrevPage, showNextPage }) => (showPrevPage ? 32 : 0) | (showNextPage ? 64 : 0)
    			],
    			default: [
    				create_default_slot$4,
    				({ showPrevPage, showNextPage }) => ({ 5: showPrevPage, 6: showNextPage }),
    				({ showPrevPage, showNextPage }) => (showPrevPage ? 32 : 0) | (showNextPage ? 64 : 0)
    			]
    		},
    		$$scope: { ctx }
    	};

    	carousel_1 = new Carousel({ props: carousel_1_props, $$inline: true });
    	/*carousel_1_binding*/ ctx[4](carousel_1);

    	const block = {
    		c: function create() {
    			article = element("article");
    			create_component(carousel_1.$$.fragment);
    			add_location(article, file$u, 7, 0, 159);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			mount_component(carousel_1, article, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const carousel_1_changes = {};
    			if (dirty & /*settings*/ 1) carousel_1_changes.duration = /*settings*/ ctx[0].slide_duration;

    			if (dirty & /*$$scope, carousel, settings*/ 1027) {
    				carousel_1_changes.$$scope = { dirty, ctx };
    			}

    			carousel_1.$set(carousel_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(carousel_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(carousel_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			/*carousel_1_binding*/ ctx[4](null);
    			destroy_component(carousel_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Slider', slots, []);
    	let { settings } = $$props;
    	let carousel; // for calling methods of the carousel instance
    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Slider> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		carousel.goToNext();
    	};

    	const click_handler_1 = () => {
    		carousel.goToPrev();
    	};

    	function carousel_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			carousel = $$value;
    			$$invalidate(1, carousel);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({ settings, Carousel, carousel });

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('carousel' in $$props) $$invalidate(1, carousel = $$props.carousel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [settings, carousel, click_handler, click_handler_1, carousel_1_binding];
    }

    class Slider$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$v.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console.warn("<Slider> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\main_elements\mini_article.svelte generated by Svelte v3.46.4 */
    const file$t = "src\\subpages\\main_elements\\mini_article.svelte";

    // (10:0) <Link to="{page + article.id}">
    function create_default_slot_1$2(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let h3;
    	let t1_value = /*article*/ ctx[1].title + "";
    	let t1;
    	let t2;
    	let p0;
    	let t3_value = /*article*/ ctx[1].intro + "";
    	let t3;
    	let t4;
    	let p1;
    	let t5;
    	let t6_value = /*article*/ ctx[1].category + "";
    	let t6;
    	let t7;
    	let p2;
    	let t8_value = /*article*/ ctx[1].date + "";
    	let t8;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			p0 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			p1 = element("p");
    			t5 = text("Kategoria: ");
    			t6 = text(t6_value);
    			t7 = space();
    			p2 = element("p");
    			t8 = text(t8_value);
    			attr_dev(div0, "class", "articleMini");
    			set_style(div0, "background-image", "url(" + /*article*/ ctx[1].img + ")");
    			add_location(div0, file$t, 11, 4, 295);
    			set_style(h3, "color", /*settings*/ ctx[0].article_miniature_header_color);
    			add_location(h3, file$t, 13, 8, 475);
    			set_style(p0, "color", /*settings*/ ctx[0].article_miniature_content_color);
    			add_location(p0, file$t, 14, 8, 565);
    			set_style(p1, "color", /*settings*/ ctx[0].article_miniature_content_color);
    			set_style(p1, "font-size", "11px");
    			add_location(p1, file$t, 15, 8, 654);
    			set_style(p2, "color", /*settings*/ ctx[0].article_miniature_content_color);
    			set_style(p2, "font-size", "11px");
    			add_location(p2, file$t, 16, 8, 774);
    			attr_dev(div1, "class", "articleDesc");
    			set_style(div1, "background-color", /*settings*/ ctx[0].article_miniature_bg_color);
    			add_location(div1, file$t, 12, 4, 377);
    			attr_dev(div2, "class", "article");
    			set_style(div2, "border-color", /*settings*/ ctx[0].article_miniature_border_color);
    			add_location(div2, file$t, 10, 0, 205);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h3);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(p0, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(p1, t5);
    			append_dev(p1, t6);
    			append_dev(div1, t7);
    			append_dev(div1, p2);
    			append_dev(p2, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*article*/ 2) {
    				set_style(div0, "background-image", "url(" + /*article*/ ctx[1].img + ")");
    			}

    			if (dirty & /*article*/ 2 && t1_value !== (t1_value = /*article*/ ctx[1].title + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(h3, "color", /*settings*/ ctx[0].article_miniature_header_color);
    			}

    			if (dirty & /*article*/ 2 && t3_value !== (t3_value = /*article*/ ctx[1].intro + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(p0, "color", /*settings*/ ctx[0].article_miniature_content_color);
    			}

    			if (dirty & /*article*/ 2 && t6_value !== (t6_value = /*article*/ ctx[1].category + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(p1, "color", /*settings*/ ctx[0].article_miniature_content_color);
    			}

    			if (dirty & /*article*/ 2 && t8_value !== (t8_value = /*article*/ ctx[1].date + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(p2, "color", /*settings*/ ctx[0].article_miniature_content_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div1, "background-color", /*settings*/ ctx[0].article_miniature_bg_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div2, "border-color", /*settings*/ ctx[0].article_miniature_border_color);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(10:0) <Link to=\\\"{page + article.id}\\\">",
    		ctx
    	});

    	return block;
    }

    // (9:9) <Router>
    function create_default_slot$3(ctx) {
    	let link;
    	let current;

    	link = new Link$1({
    			props: {
    				to: /*page*/ ctx[2] + /*article*/ ctx[1].id,
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*page, article*/ 6) link_changes.to = /*page*/ ctx[2] + /*article*/ ctx[1].id;

    			if (dirty & /*$$scope, settings, article*/ 11) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(9:9) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, page, article, settings*/ 15) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Mini_article', slots, []);
    	let { settings } = $$props;
    	let { article } = $$props;
    	let { page } = $$props;
    	const writable_props = ['settings', 'article', 'page'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Mini_article> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('article' in $$props) $$invalidate(1, article = $$props.article);
    		if ('page' in $$props) $$invalidate(2, page = $$props.page);
    	};

    	$$self.$capture_state = () => ({
    		Router: Router$1,
    		Route: Route$1,
    		Link: Link$1,
    		settings,
    		article,
    		page
    	});

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('article' in $$props) $$invalidate(1, article = $$props.article);
    		if ('page' in $$props) $$invalidate(2, page = $$props.page);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [settings, article, page];
    }

    class Mini_article extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, { settings: 0, article: 1, page: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mini_article",
    			options,
    			id: create_fragment$u.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console.warn("<Mini_article> was created without expected prop 'settings'");
    		}

    		if (/*article*/ ctx[1] === undefined && !('article' in props)) {
    			console.warn("<Mini_article> was created without expected prop 'article'");
    		}

    		if (/*page*/ ctx[2] === undefined && !('page' in props)) {
    			console.warn("<Mini_article> was created without expected prop 'page'");
    		}
    	}

    	get settings() {
    		throw new Error("<Mini_article>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Mini_article>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get article() {
    		throw new Error("<Mini_article>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set article(value) {
    		throw new Error("<Mini_article>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get page() {
    		throw new Error("<Mini_article>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<Mini_article>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\main_elements\articles_mini.svelte generated by Svelte v3.46.4 */
    const file$s = "src\\subpages\\main_elements\\articles_mini.svelte";

    function get_each_context$i(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (12:8) {#each Array(settings.articles_module_amount*1) as _,i}
    function create_each_block$i(ctx) {
    	let article;
    	let current;

    	article = new Mini_article({
    			props: {
    				settings: /*settings*/ ctx[0],
    				article: /*settings*/ ctx[0].articles.slice().reverse()[/*i*/ ctx[3]],
    				page: "articles/"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(article.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(article, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const article_changes = {};
    			if (dirty & /*settings*/ 1) article_changes.settings = /*settings*/ ctx[0];
    			if (dirty & /*settings*/ 1) article_changes.article = /*settings*/ ctx[0].articles.slice().reverse()[/*i*/ ctx[3]];
    			article.$set(article_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(article.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(article.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(article, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$i.name,
    		type: "each",
    		source: "(12:8) {#each Array(settings.articles_module_amount*1) as _,i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let article;
    	let current;
    	let each_value = Array(/*settings*/ ctx[0].articles_module_amount * 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$i(get_each_context$i(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			article = element("article");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(article, "class", "articles");
    			add_location(article, file$s, 10, 6, 239);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(article, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*settings*/ 1) {
    				each_value = Array(/*settings*/ ctx[0].articles_module_amount * 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$i(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$i(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(article, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Articles_mini', slots, []);
    	let { settings } = $$props;

    	settings.articles = settings.articles.sort((a, b) => {
    		return a.id - b.id;
    	});

    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Articles_mini> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({ Article: Mini_article, settings });

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [settings];
    }

    class Articles_mini extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Articles_mini",
    			options,
    			id: create_fragment$t.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console.warn("<Articles_mini> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Articles_mini>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Articles_mini>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\main_elements\Comments.svelte generated by Svelte v3.46.4 */

    const file$r = "src\\subpages\\main_elements\\Comments.svelte";

    function get_each_context$h(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (11:4) {#each Array(settings.comments_module_amount*1) as _,i}
    function create_each_block$h(ctx) {
    	let div;
    	let span;
    	let b;
    	let t0_value = /*settings*/ ctx[0].comments.slice().reverse()[/*i*/ ctx[3]].username + "";
    	let t0;
    	let t1;
    	let t2_value = /*settings*/ ctx[0].comment_writes + "";
    	let t2;
    	let t3;
    	let i_1;
    	let t4;
    	let t5_value = /*settings*/ ctx[0].comments.slice().reverse()[/*i*/ ctx[3]].content + "";
    	let t5;
    	let t6;
    	let t7;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			b = element("b");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			i_1 = element("i");
    			t4 = text("\"");
    			t5 = text(t5_value);
    			t6 = text("\"");
    			t7 = space();
    			add_location(b, file$r, 12, 18, 402);
    			add_location(span, file$r, 12, 12, 396);
    			add_location(i_1, file$r, 13, 12, 505);
    			attr_dev(div, "class", "comment_UwU");
    			set_style(div, "background-color", /*settings*/ ctx[0].comment_bg_color);
    			set_style(div, "color", /*settings*/ ctx[0].comment_font_color);
    			add_location(div, file$r, 11, 8, 268);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, b);
    			append_dev(b, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(div, t3);
    			append_dev(div, i_1);
    			append_dev(i_1, t4);
    			append_dev(i_1, t5);
    			append_dev(i_1, t6);
    			append_dev(div, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*settings*/ ctx[0].comments.slice().reverse()[/*i*/ ctx[3]].username + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*settings*/ 1 && t2_value !== (t2_value = /*settings*/ ctx[0].comment_writes + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*settings*/ 1 && t5_value !== (t5_value = /*settings*/ ctx[0].comments.slice().reverse()[/*i*/ ctx[3]].content + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(div, "background-color", /*settings*/ ctx[0].comment_bg_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div, "color", /*settings*/ ctx[0].comment_font_color);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$h.name,
    		type: "each",
    		source: "(11:4) {#each Array(settings.comments_module_amount*1) as _,i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let article;
    	let each_value = Array(/*settings*/ ctx[0].comments_module_amount * 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$h(get_each_context$h(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			article = element("article");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(article, "class", "articlesComments");
    			add_location(article, file$r, 9, 0, 163);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(article, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*settings*/ 1) {
    				each_value = Array(/*settings*/ ctx[0].comments_module_amount * 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$h(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$h(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(article, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Comments', slots, []);
    	let { settings } = $$props;

    	settings.comments = settings.comments.sort((a, b) => {
    		return a.id - b.id;
    	});

    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Comments> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({ settings });

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [settings];
    }

    class Comments$2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Comments",
    			options,
    			id: create_fragment$s.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console.warn("<Comments> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Comments>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Comments>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\main.svelte generated by Svelte v3.46.4 */
    const file$q = "src\\subpages\\main.svelte";

    function get_each_context$g(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (13:6) {#if elem == 1}
    function create_if_block_2$3(ctx) {
    	let slider;
    	let current;

    	slider = new Slider$1({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(slider.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(slider, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const slider_changes = {};
    			if (dirty & /*settings*/ 1) slider_changes.settings = /*settings*/ ctx[0];
    			slider.$set(slider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(slider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(slider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(slider, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(13:6) {#if elem == 1}",
    		ctx
    	});

    	return block;
    }

    // (16:6) {#if elem == 2}
    function create_if_block_1$4(ctx) {
    	let h2;
    	let t0_value = /*settings*/ ctx[0].articles_module_text + "";
    	let t0;
    	let t1;
    	let articles;
    	let current;

    	articles = new Articles_mini({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			create_component(articles.$$.fragment);
    			set_style(h2, "color", /*settings*/ ctx[0].headers_color);
    			set_style(h2, "font-size", /*settings*/ ctx[0].headers_size);
    			add_location(h2, file$q, 16, 8, 418);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(articles, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*settings*/ 1) && t0_value !== (t0_value = /*settings*/ ctx[0].articles_module_text + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*settings*/ 1) {
    				set_style(h2, "color", /*settings*/ ctx[0].headers_color);
    			}

    			if (!current || dirty & /*settings*/ 1) {
    				set_style(h2, "font-size", /*settings*/ ctx[0].headers_size);
    			}

    			const articles_changes = {};
    			if (dirty & /*settings*/ 1) articles_changes.settings = /*settings*/ ctx[0];
    			articles.$set(articles_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(articles.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(articles.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			destroy_component(articles, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(16:6) {#if elem == 2}",
    		ctx
    	});

    	return block;
    }

    // (20:6) {#if elem == 3}
    function create_if_block$9(ctx) {
    	let h2;
    	let t0_value = /*settings*/ ctx[0].comments_module_text + "";
    	let t0;
    	let t1;
    	let comments;
    	let current;

    	comments = new Comments$2({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			create_component(comments.$$.fragment);
    			set_style(h2, "color", /*settings*/ ctx[0].headers_color);
    			set_style(h2, "font-size", /*settings*/ ctx[0].headers_size);
    			add_location(h2, file$q, 20, 6, 618);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(comments, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*settings*/ 1) && t0_value !== (t0_value = /*settings*/ ctx[0].comments_module_text + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*settings*/ 1) {
    				set_style(h2, "color", /*settings*/ ctx[0].headers_color);
    			}

    			if (!current || dirty & /*settings*/ 1) {
    				set_style(h2, "font-size", /*settings*/ ctx[0].headers_size);
    			}

    			const comments_changes = {};
    			if (dirty & /*settings*/ 1) comments_changes.settings = /*settings*/ ctx[0];
    			comments.$set(comments_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(comments.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(comments.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			destroy_component(comments, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(20:6) {#if elem == 3}",
    		ctx
    	});

    	return block;
    }

    // (12:4) {#each settings.main_elements as elem}
    function create_each_block$g(ctx) {
    	let t0;
    	let t1;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*elem*/ ctx[1] == 1 && create_if_block_2$3(ctx);
    	let if_block1 = /*elem*/ ctx[1] == 2 && create_if_block_1$4(ctx);
    	let if_block2 = /*elem*/ ctx[1] == 3 && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*elem*/ ctx[1] == 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*settings*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*elem*/ ctx[1] == 2) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*settings*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*elem*/ ctx[1] == 3) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*settings*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$9(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$g.name,
    		type: "each",
    		source: "(12:4) {#each settings.main_elements as elem}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let article;
    	let current;
    	let each_value = /*settings*/ ctx[0].main_elements;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$g(get_each_context$g(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			article = element("article");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(article, "class", "main_page");
    			add_location(article, file$q, 9, 2, 231);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(article, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*settings*/ 1) {
    				each_value = /*settings*/ ctx[0].main_elements;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$g(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$g(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(article, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);
    	let { settings } = $$props;
    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({ Slider: Slider$1, Articles: Articles_mini, Comments: Comments$2, settings });

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [settings];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$r.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console.warn("<Main> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Main>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Main>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\articles.svelte generated by Svelte v3.46.4 */

    const { console: console_1$f } = globals;
    const file$p = "src\\subpages\\articles.svelte";

    function get_each_context$f(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (78:8) {#each articles as article}
    function create_each_block_1$2(ctx) {
    	let option;
    	let t_value = /*article*/ ctx[15].title + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*article*/ ctx[15].id;
    			option.value = option.__value;
    			add_location(option, file$p, 78, 8, 2153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*articles*/ 2 && t_value !== (t_value = /*article*/ ctx[15].title + "")) set_data_dev(t, t_value);

    			if (dirty & /*articles*/ 2 && option_value_value !== (option_value_value = /*article*/ ctx[15].id)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(78:8) {#each articles as article}",
    		ctx
    	});

    	return block;
    }

    // (104:4) {#each articles as article}
    function create_each_block$f(ctx) {
    	let article;
    	let current;

    	article = new Mini_article({
    			props: {
    				settings: /*settings*/ ctx[0],
    				article: /*article*/ ctx[15],
    				page: ""
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(article.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(article, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const article_changes = {};
    			if (dirty & /*settings*/ 1) article_changes.settings = /*settings*/ ctx[0];
    			if (dirty & /*articles*/ 2) article_changes.article = /*article*/ ctx[15];
    			article.$set(article_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(article.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(article.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(article, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$f.name,
    		type: "each",
    		source: "(104:4) {#each articles as article}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let article2;
    	let article0;
    	let div0;
    	let input;
    	let t0;
    	let datalist;
    	let t1;
    	let button;
    	let t3;
    	let div1;
    	let select0;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let t8;
    	let div2;
    	let select1;
    	let t9;
    	let article1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*articles*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = /*articles*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$f(get_each_context$f(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			article2 = element("article");
    			article0 = element("article");
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			datalist = element("datalist");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();
    			button = element("button");
    			button.textContent = "Szukaj";
    			t3 = space();
    			div1 = element("div");
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Najstarsze";
    			option1 = element("option");
    			option1.textContent = "Najnowsze";
    			option2 = element("option");
    			option2.textContent = "Kategoria";
    			option3 = element("option");
    			option3.textContent = "Alfabetycznie";
    			t8 = space();
    			div2 = element("div");
    			select1 = element("select");
    			t9 = space();
    			article1 = element("article");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "finder");
    			attr_dev(input, "list", "lista");
    			attr_dev(input, "placeholder", "Szukaj artykułu");
    			add_location(input, file$p, 75, 6, 1983);
    			attr_dev(datalist, "id", "lista");
    			add_location(datalist, file$p, 76, 6, 2085);
    			add_location(button, file$p, 82, 6, 2262);
    			add_location(div0, file$p, 74, 4, 1970);
    			option0.__value = "a";
    			option0.value = option0.__value;
    			add_location(option0, file$p, 89, 8, 2482);
    			option1.__value = "b";
    			option1.value = option1.__value;
    			add_location(option1, file$p, 90, 8, 2529);
    			option2.__value = "c";
    			option2.value = option2.__value;
    			add_location(option2, file$p, 91, 8, 2575);
    			option3.__value = "d";
    			option3.value = option3.__value;
    			add_location(option3, file$p, 92, 8, 2621);
    			attr_dev(select0, "id", "filter");
    			if (/*filter*/ ctx[3] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[9].call(select0));
    			add_location(select0, file$p, 85, 6, 2342);
    			add_location(div1, file$p, 84, 4, 2329);
    			attr_dev(select1, "id", "filters");
    			add_location(select1, file$p, 96, 6, 2709);
    			add_location(div2, file$p, 95, 4, 2696);
    			attr_dev(article0, "class", "searchers");
    			add_location(article0, file$p, 73, 2, 1937);
    			attr_dev(article1, "class", "articles art_sub");
    			add_location(article1, file$p, 102, 2, 2821);
    			add_location(article2, file$p, 72, 2, 1924);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article2, anchor);
    			append_dev(article2, article0);
    			append_dev(article0, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*finder*/ ctx[2]);
    			append_dev(div0, t0);
    			append_dev(div0, datalist);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(datalist, null);
    			}

    			append_dev(div0, t1);
    			append_dev(div0, button);
    			append_dev(article0, t3);
    			append_dev(article0, div1);
    			append_dev(div1, select0);
    			append_dev(select0, option0);
    			append_dev(select0, option1);
    			append_dev(select0, option2);
    			append_dev(select0, option3);
    			select_option(select0, /*filter*/ ctx[3]);
    			append_dev(article0, t8);
    			append_dev(article0, div2);
    			append_dev(div2, select1);
    			append_dev(article2, t9);
    			append_dev(article2, article1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(article1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[7]),
    					listen_dev(button, "click", /*click_handler*/ ctx[8], false, false, false),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[9]),
    					listen_dev(select0, "change", /*change_handler*/ ctx[10], false, false, false),
    					listen_dev(select1, "change", /*change_handler_1*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*finder*/ 4 && input.value !== /*finder*/ ctx[2]) {
    				set_input_value(input, /*finder*/ ctx[2]);
    			}

    			if (dirty & /*articles*/ 2) {
    				each_value_1 = /*articles*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(datalist, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*filter*/ 8) {
    				select_option(select0, /*filter*/ ctx[3]);
    			}

    			if (dirty & /*settings, articles*/ 3) {
    				each_value = /*articles*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$f(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$f(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(article1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article2);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Articles', slots, []);
    	let { settings } = $$props;
    	let articles = [];
    	let categories = ['all'];

    	fetch("http://127.0.0.1:5000/getArticles").then(data => data.json()).then(data => {
    		console.log(data);
    		$$invalidate(1, articles = data);

    		for (let article of data) {
    			if (!categories.includes(article.category)) {
    				categories.push(article.category);
    			}
    		}

    		categories.forEach(cat => {
    			document.getElementById("filters").innerHTML += `<option value="${cat}">${cat}</option>`;
    		});
    	});

    	let finder = "";
    	let filter = "a";
    	let category = "";

    	function find() {
    		if (finder * 1 <= articles.length) window.location.replace(`http://127.0.0.1:5000/articles/${finder}`);
    	}

    	function sorter(value) {
    		switch (value) {
    			case "a":
    				$$invalidate(1, articles = articles.sort((a, b) => {
    					return a.id - b.id;
    				}));
    				break;
    			case "b":
    				$$invalidate(1, articles = articles.sort((a, b) => {
    					return b.id - a.id;
    				}));
    				break;
    			case "c":
    				$$invalidate(1, articles = articles.sort((a, b) => {
    					if (a.category > b.category) return 1;
    					if (a.category < b.category) return -1;
    					return 0;
    				}));
    				break;
    			case "d":
    				$$invalidate(1, articles = articles.sort((a, b) => {
    					if (a.title > b.title) return 1;
    					if (a.title < b.title) return -1;
    					return 0;
    				}));
    				break;
    		}
    	}

    	function isCategorySame(article) {
    		return category == article.category;
    	}

    	function filtr() {
    		let select = document.getElementById('filters');
    		category = select.options[select.selectedIndex].value;
    		console.log(category);
    		if (category == 'all') $$invalidate(1, articles = settings.articles); else $$invalidate(1, articles = settings.articles.filter(isCategorySame));
    	}

    	sorter("a");
    	console.log(categories);
    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$f.warn(`<Articles> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		finder = this.value;
    		$$invalidate(2, finder);
    	}

    	const click_handler = () => {
    		find();
    	};

    	function select0_change_handler() {
    		filter = select_value(this);
    		$$invalidate(3, filter);
    	}

    	const change_handler = value => {
    		sorter(filter);
    		console.log(articles);
    	};

    	const change_handler_1 = () => {
    		filtr();
    	};

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({
    		Article: Mini_article,
    		settings,
    		articles,
    		categories,
    		finder,
    		filter,
    		category,
    		find,
    		sorter,
    		isCategorySame,
    		filtr
    	});

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('articles' in $$props) $$invalidate(1, articles = $$props.articles);
    		if ('categories' in $$props) categories = $$props.categories;
    		if ('finder' in $$props) $$invalidate(2, finder = $$props.finder);
    		if ('filter' in $$props) $$invalidate(3, filter = $$props.filter);
    		if ('category' in $$props) category = $$props.category;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settings,
    		articles,
    		finder,
    		filter,
    		find,
    		sorter,
    		filtr,
    		input_input_handler,
    		click_handler,
    		select0_change_handler,
    		change_handler,
    		change_handler_1
    	];
    }

    class Articles$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Articles",
    			options,
    			id: create_fragment$q.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console_1$f.warn("<Articles> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Articles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Articles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\gallery.svelte generated by Svelte v3.46.4 */

    const file$o = "src\\subpages\\gallery.svelte";

    function get_each_context$e(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (30:91) 
    function create_if_block_4$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*index*/ ctx[9] >= /*settings*/ ctx[0].gallery.length - /*settings*/ ctx[0].gallery_minis_amount && create_if_block_5$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*index*/ ctx[9] >= /*settings*/ ctx[0].gallery.length - /*settings*/ ctx[0].gallery_minis_amount) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(30:91) ",
    		ctx
    	});

    	return block;
    }

    // (24:66) 
    function create_if_block_2$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*index*/ ctx[9] < /*settings*/ ctx[0].gallery_minis_amount && create_if_block_3$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*index*/ ctx[9] < /*settings*/ ctx[0].gallery_minis_amount) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(24:66) ",
    		ctx
    	});

    	return block;
    }

    // (18:8) {#if i>=(Math.floor(settings.gallery_minis_amount/2)) && i<settings.gallery.length-(Math.floor(settings.gallery_minis_amount/2))}
    function create_if_block$8(ctx) {
    	let show_if = /*index*/ ctx[9] <= /*i*/ ctx[1] + Math.floor(/*settings*/ ctx[0].gallery_minis_amount / 2) && /*index*/ ctx[9] >= /*i*/ ctx[1] - Math.floor(/*settings*/ ctx[0].gallery_minis_amount / 2);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*i, settings*/ 3) show_if = /*index*/ ctx[9] <= /*i*/ ctx[1] + Math.floor(/*settings*/ ctx[0].gallery_minis_amount / 2) && /*index*/ ctx[9] >= /*i*/ ctx[1] - Math.floor(/*settings*/ ctx[0].gallery_minis_amount / 2);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(18:8) {#if i>=(Math.floor(settings.gallery_minis_amount/2)) && i<settings.gallery.length-(Math.floor(settings.gallery_minis_amount/2))}",
    		ctx
    	});

    	return block;
    }

    // (31:12) {#if index >= settings.gallery.length-settings.gallery_minis_amount}
    function create_if_block_5$2(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_title_value;
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[6](/*index*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = /*gallery*/ ctx[7].src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*gallery*/ ctx[7].title);
    			attr_dev(img, "title", img_title_value = /*gallery*/ ctx[7].title);
    			add_location(img, file$o, 32, 16, 1888);
    			toggle_class(div, "border", /*i*/ ctx[1] == /*index*/ ctx[9]);
    			add_location(div, file$o, 31, 12, 1841);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", click_handler_4, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*settings*/ 1 && !src_url_equal(img.src, img_src_value = /*gallery*/ ctx[7].src)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*settings*/ 1 && img_alt_value !== (img_alt_value = /*gallery*/ ctx[7].title)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*settings*/ 1 && img_title_value !== (img_title_value = /*gallery*/ ctx[7].title)) {
    				attr_dev(img, "title", img_title_value);
    			}

    			if (dirty & /*i*/ 2) {
    				toggle_class(div, "border", /*i*/ ctx[1] == /*index*/ ctx[9]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(31:12) {#if index >= settings.gallery.length-settings.gallery_minis_amount}",
    		ctx
    	});

    	return block;
    }

    // (25:12) {#if index < settings.gallery_minis_amount}
    function create_if_block_3$2(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_title_value;
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[5](/*index*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = /*gallery*/ ctx[7].src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*gallery*/ ctx[7].title);
    			attr_dev(img, "title", img_title_value = /*gallery*/ ctx[7].title);
    			add_location(img, file$o, 26, 16, 1515);
    			toggle_class(div, "border", /*i*/ ctx[1] == /*index*/ ctx[9]);
    			add_location(div, file$o, 25, 12, 1468);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", click_handler_3, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*settings*/ 1 && !src_url_equal(img.src, img_src_value = /*gallery*/ ctx[7].src)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*settings*/ 1 && img_alt_value !== (img_alt_value = /*gallery*/ ctx[7].title)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*settings*/ 1 && img_title_value !== (img_title_value = /*gallery*/ ctx[7].title)) {
    				attr_dev(img, "title", img_title_value);
    			}

    			if (dirty & /*i*/ 2) {
    				toggle_class(div, "border", /*i*/ ctx[1] == /*index*/ ctx[9]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(25:12) {#if index < settings.gallery_minis_amount}",
    		ctx
    	});

    	return block;
    }

    // (19:12) {#if index <= i+(Math.floor(settings.gallery_minis_amount/2)) && index >=i-(Math.floor(settings.gallery_minis_amount/2)) }
    function create_if_block_1$3(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_title_value;
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[4](/*index*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = /*gallery*/ ctx[7].src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*gallery*/ ctx[7].title);
    			attr_dev(img, "title", img_title_value = /*gallery*/ ctx[7].title);
    			add_location(img, file$o, 20, 20, 1188);
    			toggle_class(div, "border", /*i*/ ctx[1] == /*index*/ ctx[9]);
    			add_location(div, file$o, 19, 16, 1137);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*settings*/ 1 && !src_url_equal(img.src, img_src_value = /*gallery*/ ctx[7].src)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*settings*/ 1 && img_alt_value !== (img_alt_value = /*gallery*/ ctx[7].title)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*settings*/ 1 && img_title_value !== (img_title_value = /*gallery*/ ctx[7].title)) {
    				attr_dev(img, "title", img_title_value);
    			}

    			if (dirty & /*i*/ 2) {
    				toggle_class(div, "border", /*i*/ ctx[1] == /*index*/ ctx[9]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(19:12) {#if index <= i+(Math.floor(settings.gallery_minis_amount/2)) && index >=i-(Math.floor(settings.gallery_minis_amount/2)) }",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#each settings.gallery as gallery, index}
    function create_each_block$e(ctx) {
    	let show_if;
    	let show_if_1;
    	let show_if_2;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*i, settings*/ 3) show_if = null;
    		if (dirty & /*i, settings*/ 3) show_if_1 = null;
    		if (dirty & /*i, settings*/ 3) show_if_2 = null;
    		if (show_if == null) show_if = !!(/*i*/ ctx[1] >= Math.floor(/*settings*/ ctx[0].gallery_minis_amount / 2) && /*i*/ ctx[1] < /*settings*/ ctx[0].gallery.length - Math.floor(/*settings*/ ctx[0].gallery_minis_amount / 2));
    		if (show_if) return create_if_block$8;
    		if (show_if_1 == null) show_if_1 = !!(/*i*/ ctx[1] < Math.floor(/*settings*/ ctx[0].gallery_minis_amount / 2));
    		if (show_if_1) return create_if_block_2$2;
    		if (show_if_2 == null) show_if_2 = !!(/*i*/ ctx[1] >= /*settings*/ ctx[0].gallery.length - Math.floor(/*settings*/ ctx[0].gallery_minis_amount / 2));
    		if (show_if_2) return create_if_block_4$2;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$e.name,
    		type: "each",
    		source: "(17:4) {#each settings.gallery as gallery, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let article;
    	let div3;
    	let h2;
    	let t0_value = /*settings*/ ctx[0].gallery[/*i*/ ctx[1]].title + "";
    	let t0;
    	let t1;
    	let div2;
    	let div0;
    	let t2;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_title_value;
    	let t3;
    	let div1;
    	let t4;
    	let div4;
    	let mounted;
    	let dispose;
    	let each_value = /*settings*/ ctx[0].gallery;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$e(get_each_context$e(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			article = element("article");
    			div3 = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			div2 = element("div");
    			div0 = element("div");
    			t2 = space();
    			img = element("img");
    			t3 = space();
    			div1 = element("div");
    			t4 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(h2, "color", /*settings*/ ctx[0].gallery_title_color);
    			set_style(h2, "font-size", /*settings*/ ctx[0].gallery_title_size);
    			add_location(h2, file$o, 6, 8, 122);
    			attr_dev(div0, "class", "arrow arrow-left");
    			set_style(div0, "border-right-color", /*settings*/ ctx[0].gallery_arrow_color);
    			add_location(div0, file$o, 8, 12, 297);
    			if (!src_url_equal(img.src, img_src_value = /*settings*/ ctx[0].gallery[/*i*/ ctx[1]].src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*settings*/ ctx[0].gallery[/*i*/ ctx[1]].title);
    			attr_dev(img, "title", img_title_value = /*settings*/ ctx[0].gallery[/*i*/ ctx[1]].title);
    			add_location(img, file$o, 10, 16, 454);
    			attr_dev(div1, "class", "arrow arrow-right");
    			set_style(div1, "border-left-color", /*settings*/ ctx[0].gallery_arrow_color);
    			add_location(div1, file$o, 12, 12, 588);
    			attr_dev(div2, "class", "galleryContainer");
    			add_location(div2, file$o, 7, 8, 253);
    			attr_dev(div3, "class", "mainImg");
    			add_location(div3, file$o, 5, 4, 91);
    			attr_dev(div4, "class", "galleryImgs");
    			add_location(div4, file$o, 15, 4, 771);
    			attr_dev(article, "class", "gallery");
    			add_location(article, file$o, 4, 0, 60);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div3);
    			append_dev(div3, h2);
    			append_dev(h2, t0);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t2);
    			append_dev(div2, img);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(article, t4);
    			append_dev(article, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(div1, "click", /*click_handler_1*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*settings, i*/ 3 && t0_value !== (t0_value = /*settings*/ ctx[0].gallery[/*i*/ ctx[1]].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(h2, "color", /*settings*/ ctx[0].gallery_title_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(h2, "font-size", /*settings*/ ctx[0].gallery_title_size);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div0, "border-right-color", /*settings*/ ctx[0].gallery_arrow_color);
    			}

    			if (dirty & /*settings, i*/ 3 && !src_url_equal(img.src, img_src_value = /*settings*/ ctx[0].gallery[/*i*/ ctx[1]].src)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*settings, i*/ 3 && img_alt_value !== (img_alt_value = /*settings*/ ctx[0].gallery[/*i*/ ctx[1]].title)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*settings, i*/ 3 && img_title_value !== (img_title_value = /*settings*/ ctx[0].gallery[/*i*/ ctx[1]].title)) {
    				attr_dev(img, "title", img_title_value);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div1, "border-left-color", /*settings*/ ctx[0].gallery_arrow_color);
    			}

    			if (dirty & /*i, settings, Math*/ 3) {
    				each_value = /*settings*/ ctx[0].gallery;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$e(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$e(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div4, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Gallery', slots, []);
    	let { settings } = $$props;
    	let i = 0;
    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Gallery> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		if (i > 0) $$invalidate(1, i -= 1);
    	};

    	const click_handler_1 = () => {
    		if (i < settings.gallery.length - 1) $$invalidate(1, i += 1);
    	};

    	const click_handler_2 = index => {
    		$$invalidate(1, i = index);
    	};

    	const click_handler_3 = index => {
    		$$invalidate(1, i = index);
    	};

    	const click_handler_4 = index => {
    		$$invalidate(1, i = index);
    	};

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({ settings, i });

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('i' in $$props) $$invalidate(1, i = $$props.i);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settings,
    		i,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class Gallery$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gallery",
    			options,
    			id: create_fragment$p.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console.warn("<Gallery> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\comments.svelte generated by Svelte v3.46.4 */

    const { console: console_1$e } = globals;
    const file$n = "src\\subpages\\comments.svelte";

    function get_each_context$d(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (33:12) {:else}
    function create_else_block$6(ctx) {
    	let span;
    	let t0_value = /*settings*/ ctx[0].comments_loginfo_text + "";
    	let t0;
    	let t1;
    	let a;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			a = element("a");
    			t2 = text("Login");
    			add_location(span, file$n, 33, 12, 1521);
    			attr_dev(a, "href", "/login");
    			set_style(a, "color", /*settings*/ ctx[0].comments_section_adder_font_color);
    			add_location(a, file$n, 33, 58, 1567);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			insert_dev(target, a, anchor);
    			append_dev(a, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*settings*/ ctx[0].comments_loginfo_text + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(a, "color", /*settings*/ ctx[0].comments_section_adder_font_color);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(33:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:12) {#if sessionStorage.getItem('logged')=='true'}
    function create_if_block$7(ctx) {
    	let textarea;
    	let button;
    	let t_value = /*settings*/ ctx[0].comment_add_comment + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			button = element("button");
    			t = text(t_value);
    			add_location(textarea, file$n, 31, 12, 1238);
    			set_style(button, "color", /*settings*/ ctx[0].comments_section_adder_btn_font_color);
    			set_style(button, "background-color", /*settings*/ ctx[0].comments_section_adder_btn_bg_color);
    			add_location(button, file$n, 31, 54, 1280);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*text*/ ctx[1]);
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[3]),
    					listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 2) {
    				set_input_value(textarea, /*text*/ ctx[1]);
    			}

    			if (dirty & /*settings*/ 1 && t_value !== (t_value = /*settings*/ ctx[0].comment_add_comment + "")) set_data_dev(t, t_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(button, "color", /*settings*/ ctx[0].comments_section_adder_btn_font_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(button, "background-color", /*settings*/ ctx[0].comments_section_adder_btn_bg_color);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(31:12) {#if sessionStorage.getItem('logged')=='true'}",
    		ctx
    	});

    	return block;
    }

    // (39:12) {#each settings.comments.slice().reverse() as comment}
    function create_each_block$d(ctx) {
    	let div;
    	let span;
    	let b;
    	let t0_value = /*comment*/ ctx[5].username + "";
    	let t0;
    	let t1;
    	let t2_value = /*settings*/ ctx[0].comment_writes + "";
    	let t2;
    	let t3;
    	let i;
    	let t4;
    	let t5_value = /*comment*/ ctx[5].content + "";
    	let t5;
    	let t6;
    	let t7;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			b = element("b");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			i = element("i");
    			t4 = text("\"");
    			t5 = text(t5_value);
    			t6 = text("\"");
    			t7 = space();
    			add_location(b, file$n, 40, 26, 1941);
    			add_location(span, file$n, 40, 20, 1935);
    			add_location(i, file$n, 41, 20, 2021);
    			set_style(div, "background-color", /*settings*/ ctx[0].comment_bg_color);
    			set_style(div, "color", /*settings*/ ctx[0].comment_font_color);
    			add_location(div, file$n, 39, 16, 1819);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, b);
    			append_dev(b, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(div, t3);
    			append_dev(div, i);
    			append_dev(i, t4);
    			append_dev(i, t5);
    			append_dev(i, t6);
    			append_dev(div, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*comment*/ ctx[5].username + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*settings*/ 1 && t2_value !== (t2_value = /*settings*/ ctx[0].comment_writes + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*settings*/ 1 && t5_value !== (t5_value = /*comment*/ ctx[5].content + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(div, "background-color", /*settings*/ ctx[0].comment_bg_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div, "color", /*settings*/ ctx[0].comment_font_color);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$d.name,
    		type: "each",
    		source: "(39:12) {#each settings.comments.slice().reverse() as comment}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let article;
    	let div2;
    	let div0;
    	let t;
    	let div1;

    	function select_block_type(ctx, dirty) {
    		if (sessionStorage.getItem('logged') == 'true') return create_if_block$7;
    		return create_else_block$6;
    	}

    	let current_block_type = select_block_type();
    	let if_block = current_block_type(ctx);
    	let each_value = /*settings*/ ctx[0].comments.slice().reverse();
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$d(get_each_context$d(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			article = element("article");
    			div2 = element("div");
    			div0 = element("div");
    			if_block.c();
    			t = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "adder");
    			set_style(div0, "background-color", /*settings*/ ctx[0].comments_section_adder_bg_color);
    			set_style(div0, "color", /*settings*/ ctx[0].comments_section_adder_font_color);
    			add_location(div0, file$n, 29, 8, 1026);
    			attr_dev(div1, "class", "comments");
    			add_location(div1, file$n, 37, 8, 1711);
    			attr_dev(div2, "class", "container");
    			set_style(div2, "background-color", /*settings*/ ctx[0].comments_section_bg_color);
    			set_style(div2, "border-color", /*settings*/ ctx[0].comments_section_border_color);
    			add_location(div2, file$n, 28, 4, 877);
    			attr_dev(article, "class", "commentsSite");
    			add_location(article, file$n, 27, 0, 841);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div2);
    			append_dev(div2, div0);
    			if_block.m(div0, null);
    			append_dev(div2, t);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);

    			if (dirty & /*settings*/ 1) {
    				set_style(div0, "background-color", /*settings*/ ctx[0].comments_section_adder_bg_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div0, "color", /*settings*/ ctx[0].comments_section_adder_font_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				each_value = /*settings*/ ctx[0].comments.slice().reverse();
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$d(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$d(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div2, "background-color", /*settings*/ ctx[0].comments_section_bg_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div2, "border-color", /*settings*/ ctx[0].comments_section_border_color);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			if_block.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Comments', slots, []);
    	let { settings } = $$props;
    	let text = "";

    	function addComment() {
    		if (text != "") {
    			let comment = {
    				"id": settings.comments[settings.comments.length - 1].id + 1,
    				"username": sessionStorage.getItem('username'),
    				"content": text
    			};

    			//settings.comments.push(comment)
    			$$invalidate(1, text = "");

    			console.log(settings.comments);

    			fetch('http://127.0.0.1:5000/addComment', {
    				headers: { 'Content-Type': 'application/json' },
    				method: 'POST',
    				body: JSON.stringify({ comment })
    			}).then(data => data.json()).then(data => {
    				window.location.replace(`http://127.0.0.1:5000/comments`);
    			});
    		}
    	}

    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$e.warn(`<Comments> was created with unknown prop '${key}'`);
    	});

    	function textarea_input_handler() {
    		text = this.value;
    		$$invalidate(1, text);
    	}

    	const click_handler = () => {
    		addComment();
    	};

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({ settings, text, addComment });

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [settings, text, addComment, textarea_input_handler, click_handler];
    }

    class Comments$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Comments",
    			options,
    			id: create_fragment$o.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console_1$e.warn("<Comments> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Comments>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Comments>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\login.svelte generated by Svelte v3.46.4 */

    const { console: console_1$d } = globals;
    const file$m = "src\\subpages\\login.svelte";

    function create_fragment$n(ctx) {
    	let article;
    	let div3;
    	let h1;
    	let t0_value = /*settings*/ ctx[0].login_title + "";
    	let t0;
    	let t1;
    	let span;
    	let t2;
    	let t3;
    	let div2;
    	let div0;
    	let h20;
    	let t5;
    	let input0;
    	let t6;
    	let div1;
    	let h21;
    	let t8;
    	let input1;
    	let t9;
    	let button;
    	let t10_value = /*settings*/ ctx[0].login_button_text + "";
    	let t10;
    	let t11;
    	let a;
    	let t12_value = /*settings*/ ctx[0].login_register_text + "";
    	let t12;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			article = element("article");
    			div3 = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			t2 = text(/*wrong*/ ctx[3]);
    			t3 = space();
    			div2 = element("div");
    			div0 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Login";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			div1 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Password";
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			button = element("button");
    			t10 = text(t10_value);
    			t11 = space();
    			a = element("a");
    			t12 = text(t12_value);
    			add_location(h1, file$m, 48, 4, 1826);
    			attr_dev(span, "id", "wrong");
    			add_location(span, file$m, 49, 12, 1871);
    			add_location(h20, file$m, 52, 20, 1979);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "login");
    			attr_dev(input0, "id", "login");
    			add_location(input0, file$m, 53, 20, 2015);
    			add_location(div0, file$m, 51, 16, 1952);
    			add_location(h21, file$m, 56, 20, 2147);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "password");
    			attr_dev(input1, "id", "password");
    			add_location(input1, file$m, 57, 20, 2186);
    			add_location(div1, file$m, 55, 16, 2120);
    			set_style(button, "background-color", /*settings*/ ctx[0].login_button_bg_color);
    			set_style(button, "color", /*settings*/ ctx[0].login_button_font_color);
    			add_location(button, file$m, 60, 16, 2306);
    			attr_dev(div2, "class", "form");
    			add_location(div2, file$m, 50, 12, 1916);
    			attr_dev(a, "href", "/register");
    			set_style(a, "color", /*settings*/ ctx[0].login_register_font_color);
    			add_location(a, file$m, 62, 12, 2504);
    			attr_dev(div3, "class", "login");
    			set_style(div3, "background-color", /*settings*/ ctx[0].login_bg_color);
    			set_style(div3, "border-color", /*settings*/ ctx[0].login_border_color);
    			set_style(div3, "color", /*settings*/ ctx[0].login_font_color);
    			add_location(div3, file$m, 47, 4, 1673);
    			attr_dev(article, "class", "loginContainer");
    			add_location(article, file$m, 46, 0, 1635);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div3);
    			append_dev(div3, h1);
    			append_dev(h1, t0);
    			append_dev(div3, t1);
    			append_dev(div3, span);
    			append_dev(span, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h20);
    			append_dev(div0, t5);
    			append_dev(div0, input0);
    			set_input_value(input0, /*login*/ ctx[1]);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(div1, h21);
    			append_dev(div1, t8);
    			append_dev(div1, input1);
    			set_input_value(input1, /*password*/ ctx[2]);
    			append_dev(div2, t9);
    			append_dev(div2, button);
    			append_dev(button, t10);
    			append_dev(div3, t11);
    			append_dev(div3, a);
    			append_dev(a, t12);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(button, "click", /*logger*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*settings*/ ctx[0].login_title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*wrong*/ 8) set_data_dev(t2, /*wrong*/ ctx[3]);

    			if (dirty & /*login*/ 2 && input0.value !== /*login*/ ctx[1]) {
    				set_input_value(input0, /*login*/ ctx[1]);
    			}

    			if (dirty & /*password*/ 4 && input1.value !== /*password*/ ctx[2]) {
    				set_input_value(input1, /*password*/ ctx[2]);
    			}

    			if (dirty & /*settings*/ 1 && t10_value !== (t10_value = /*settings*/ ctx[0].login_button_text + "")) set_data_dev(t10, t10_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(button, "background-color", /*settings*/ ctx[0].login_button_bg_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(button, "color", /*settings*/ ctx[0].login_button_font_color);
    			}

    			if (dirty & /*settings*/ 1 && t12_value !== (t12_value = /*settings*/ ctx[0].login_register_text + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(a, "color", /*settings*/ ctx[0].login_register_font_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div3, "background-color", /*settings*/ ctx[0].login_bg_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div3, "border-color", /*settings*/ ctx[0].login_border_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div3, "color", /*settings*/ ctx[0].login_font_color);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let { settings } = $$props;
    	let login = "";
    	let password = "";
    	let wrong = "";

    	function logger() {
    		fetch('http://127.0.0.1:5000/login', {
    			headers: { 'Content-Type': 'application/json' },
    			method: 'POST',
    			body: JSON.stringify({ login, password })
    		}).then(data => data.json()).then(data => {
    			console.log(data);

    			switch (data.x) {
    				case 0:
    					$$invalidate(3, wrong = "Błędny login lub hasło");
    					break;
    				case 1:
    					sessionStorage.setItem('logged', 'true');
    					sessionStorage.setItem('admin', 'true');
    					sessionStorage.setItem('username', login);
    					sessionStorage.setItem('password', password);
    					sessionStorage.setItem('id', data.y);
    					window.location.replace(`http://127.0.0.1:5000/`);
    					break;
    				case 2:
    					sessionStorage.setItem('logged', 'true');
    					sessionStorage.setItem('admin', 'false');
    					sessionStorage.setItem('username', login);
    					sessionStorage.setItem('password', password);
    					sessionStorage.setItem('id', data.y);
    					window.location.replace(`http://127.0.0.1:5000/`);
    					break;
    			}
    		});
    	}

    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$d.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		login = this.value;
    		$$invalidate(1, login);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(2, password);
    	}

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({ settings, login, password, wrong, logger });

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('login' in $$props) $$invalidate(1, login = $$props.login);
    		if ('password' in $$props) $$invalidate(2, password = $$props.password);
    		if ('wrong' in $$props) $$invalidate(3, wrong = $$props.wrong);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settings,
    		login,
    		password,
    		wrong,
    		logger,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$n.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console_1$d.warn("<Login> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Login>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\register.svelte generated by Svelte v3.46.4 */

    const { console: console_1$c } = globals;
    const file$l = "src\\subpages\\register.svelte";

    function create_fragment$m(ctx) {
    	let article;
    	let div4;
    	let h1;
    	let t0_value = /*settings*/ ctx[0].register_title + "";
    	let t0;
    	let t1;
    	let span;
    	let t2;
    	let t3;
    	let div3;
    	let div0;
    	let h20;
    	let t5;
    	let input0;
    	let t6;
    	let div1;
    	let h21;
    	let t8;
    	let input1;
    	let t9;
    	let div2;
    	let h22;
    	let t11;
    	let input2;
    	let t12;
    	let button;
    	let t13_value = /*settings*/ ctx[0].register_button_text + "";
    	let t13;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			article = element("article");
    			div4 = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			t2 = text(/*wrong*/ ctx[4]);
    			t3 = space();
    			div3 = element("div");
    			div0 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Login";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			div1 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Password";
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			div2 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Repeat password";
    			t11 = space();
    			input2 = element("input");
    			t12 = space();
    			button = element("button");
    			t13 = text(t13_value);
    			add_location(h1, file$l, 39, 4, 1219);
    			attr_dev(span, "id", "wrong");
    			add_location(span, file$l, 40, 12, 1267);
    			add_location(h20, file$l, 43, 20, 1375);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "login");
    			attr_dev(input0, "id", "login");
    			add_location(input0, file$l, 44, 20, 1411);
    			add_location(div0, file$l, 42, 16, 1348);
    			add_location(h21, file$l, 47, 20, 1543);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "password");
    			attr_dev(input1, "id", "password");
    			add_location(input1, file$l, 48, 20, 1582);
    			add_location(div1, file$l, 46, 16, 1516);
    			add_location(h22, file$l, 51, 20, 1727);
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "name", "password-r");
    			attr_dev(input2, "id", "password-r");
    			add_location(input2, file$l, 52, 20, 1773);
    			add_location(div2, file$l, 50, 16, 1700);
    			attr_dev(button, "class", "reg");
    			set_style(button, "background-color", /*settings*/ ctx[0].login_button_bg_color);
    			set_style(button, "color", /*settings*/ ctx[0].login_button_font_color);
    			add_location(button, file$l, 55, 16, 1899);
    			attr_dev(div3, "class", "form");
    			add_location(div3, file$l, 41, 12, 1312);
    			attr_dev(div4, "class", "login");
    			set_style(div4, "background-color", /*settings*/ ctx[0].login_bg_color);
    			set_style(div4, "border-color", /*settings*/ ctx[0].login_border_color);
    			set_style(div4, "color", /*settings*/ ctx[0].login_font_color);
    			add_location(div4, file$l, 38, 4, 1066);
    			attr_dev(article, "class", "loginContainer");
    			add_location(article, file$l, 37, 0, 1028);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div4);
    			append_dev(div4, h1);
    			append_dev(h1, t0);
    			append_dev(div4, t1);
    			append_dev(div4, span);
    			append_dev(span, t2);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h20);
    			append_dev(div0, t5);
    			append_dev(div0, input0);
    			set_input_value(input0, /*login*/ ctx[1]);
    			append_dev(div3, t6);
    			append_dev(div3, div1);
    			append_dev(div1, h21);
    			append_dev(div1, t8);
    			append_dev(div1, input1);
    			set_input_value(input1, /*password*/ ctx[2]);
    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			append_dev(div2, h22);
    			append_dev(div2, t11);
    			append_dev(div2, input2);
    			set_input_value(input2, /*passwordr*/ ctx[3]);
    			append_dev(div3, t12);
    			append_dev(div3, button);
    			append_dev(button, t13);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[6]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[7]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[8]),
    					listen_dev(button, "click", /*register*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*settings*/ ctx[0].register_title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*wrong*/ 16) set_data_dev(t2, /*wrong*/ ctx[4]);

    			if (dirty & /*login*/ 2 && input0.value !== /*login*/ ctx[1]) {
    				set_input_value(input0, /*login*/ ctx[1]);
    			}

    			if (dirty & /*password*/ 4 && input1.value !== /*password*/ ctx[2]) {
    				set_input_value(input1, /*password*/ ctx[2]);
    			}

    			if (dirty & /*passwordr*/ 8 && input2.value !== /*passwordr*/ ctx[3]) {
    				set_input_value(input2, /*passwordr*/ ctx[3]);
    			}

    			if (dirty & /*settings*/ 1 && t13_value !== (t13_value = /*settings*/ ctx[0].register_button_text + "")) set_data_dev(t13, t13_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(button, "background-color", /*settings*/ ctx[0].login_button_bg_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(button, "color", /*settings*/ ctx[0].login_button_font_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div4, "background-color", /*settings*/ ctx[0].login_bg_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div4, "border-color", /*settings*/ ctx[0].login_border_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div4, "color", /*settings*/ ctx[0].login_font_color);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Register', slots, []);
    	let { settings } = $$props;
    	let login = "";
    	let password = "";
    	let passwordr = "";
    	let wrong = "";

    	function register() {
    		fetch('http://127.0.0.1:5000/register', {
    			headers: { 'Content-Type': 'application/json' },
    			method: 'POST',
    			body: JSON.stringify({ login, password, passwordr })
    		}).then(data => data.json()).then(data => {
    			console.log(data);

    			switch (data.x) {
    				case 0:
    					$$invalidate(4, wrong = "Hasła się różnią");
    					break;
    				case 1:
    					$$invalidate(4, wrong = "Taka nazwa użytkownika już istnieje");
    					break;
    				case 2:
    					window.location.replace(`http://127.0.0.1:5000/login`);
    					break;
    			}
    		});
    	}

    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$c.warn(`<Register> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		login = this.value;
    		$$invalidate(1, login);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(2, password);
    	}

    	function input2_input_handler() {
    		passwordr = this.value;
    		$$invalidate(3, passwordr);
    	}

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({
    		settings,
    		login,
    		password,
    		passwordr,
    		wrong,
    		register
    	});

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('login' in $$props) $$invalidate(1, login = $$props.login);
    		if ('password' in $$props) $$invalidate(2, password = $$props.password);
    		if ('passwordr' in $$props) $$invalidate(3, passwordr = $$props.passwordr);
    		if ('wrong' in $$props) $$invalidate(4, wrong = $$props.wrong);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settings,
    		login,
    		password,
    		passwordr,
    		wrong,
    		register,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class Register extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Register",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console_1$c.warn("<Register> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Register>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Register>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\profile.svelte generated by Svelte v3.46.4 */

    const file$k = "src\\subpages\\profile.svelte";

    function create_fragment$l(ctx) {
    	let article;
    	let div2;
    	let h1;
    	let t2;
    	let span0;
    	let t3;
    	let t4;
    	let div0;
    	let span1;
    	let t6;
    	let input0;
    	let t7;
    	let div1;
    	let span2;
    	let t9;
    	let input1;
    	let t10;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			article = element("article");
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = `Witaj ${sessionStorage.getItem('username')}`;
    			t2 = space();
    			span0 = element("span");
    			t3 = text(/*wrong*/ ctx[3]);
    			t4 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "Zmiana nicku";
    			t6 = space();
    			input0 = element("input");
    			t7 = space();
    			div1 = element("div");
    			span2 = element("span");
    			span2.textContent = "Zmiana hasła";
    			t9 = space();
    			input1 = element("input");
    			t10 = space();
    			button = element("button");
    			button.textContent = "Zapisz";
    			add_location(h1, file$k, 41, 8, 1339);
    			add_location(span0, file$k, 42, 8, 1400);
    			add_location(span1, file$k, 44, 12, 1449);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$k, 45, 12, 1488);
    			add_location(div0, file$k, 43, 8, 1430);
    			add_location(span2, file$k, 48, 12, 1570);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$k, 49, 12, 1609);
    			add_location(div1, file$k, 47, 8, 1551);
    			add_location(button, file$k, 51, 8, 1676);
    			attr_dev(div2, "class", "profile-menu");
    			set_style(div2, "background-color", /*settings*/ ctx[0].profile_bg_color);
    			set_style(div2, "border-color", /*settings*/ ctx[0].profile_border_color);
    			set_style(div2, "color", /*settings*/ ctx[0].profile_font_color);
    			add_location(div2, file$k, 40, 4, 1169);
    			attr_dev(article, "class", "loginContainer");
    			add_location(article, file$k, 39, 0, 1131);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div2);
    			append_dev(div2, h1);
    			append_dev(div2, t2);
    			append_dev(div2, span0);
    			append_dev(span0, t3);
    			append_dev(div2, t4);
    			append_dev(div2, div0);
    			append_dev(div0, span1);
    			append_dev(div0, t6);
    			append_dev(div0, input0);
    			set_input_value(input0, /*user*/ ctx[1]);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div1, span2);
    			append_dev(div1, t9);
    			append_dev(div1, input1);
    			set_input_value(input1, /*password*/ ctx[2]);
    			append_dev(div2, t10);
    			append_dev(div2, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(button, "click", /*click_handler*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*wrong*/ 8) set_data_dev(t3, /*wrong*/ ctx[3]);

    			if (dirty & /*user*/ 2 && input0.value !== /*user*/ ctx[1]) {
    				set_input_value(input0, /*user*/ ctx[1]);
    			}

    			if (dirty & /*password*/ 4 && input1.value !== /*password*/ ctx[2]) {
    				set_input_value(input1, /*password*/ ctx[2]);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div2, "background-color", /*settings*/ ctx[0].profile_bg_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div2, "border-color", /*settings*/ ctx[0].profile_border_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div2, "color", /*settings*/ ctx[0].profile_font_color);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Profile', slots, []);
    	let { settings } = $$props;
    	let user = sessionStorage.getItem('username');
    	let password = sessionStorage.getItem('password');
    	let wrong = "";

    	function changeUser(type) {
    		fetch('http://127.0.0.1:5000/changeUser', {
    			headers: { 'Content-Type': 'application/json' },
    			method: 'POST',
    			body: JSON.stringify({
    				'login': user,
    				password,
    				'id': sessionStorage.getItem('id')
    			})
    		}).then(data => data.json()).then(data => {
    			switch (data.x) {
    				case 1:
    					$$invalidate(3, wrong = "Taki nick już istnieje");
    					break;
    				case 2:
    					$$invalidate(3, wrong = "Poprawnie zaktualizowano dane");
    					sessionStorage.setItem('username', user);
    					sessionStorage.setItem('password', password);
    					break;
    			}
    		});
    	}

    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		user = this.value;
    		$$invalidate(1, user);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(2, password);
    	}

    	const click_handler = () => {
    		changeUser();
    	};

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({
    		settings,
    		user,
    		password,
    		wrong,
    		changeUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('user' in $$props) $$invalidate(1, user = $$props.user);
    		if ('password' in $$props) $$invalidate(2, password = $$props.password);
    		if ('wrong' in $$props) $$invalidate(3, wrong = $$props.wrong);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settings,
    		user,
    		password,
    		wrong,
    		changeUser,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler
    	];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console.warn("<Profile> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\admin_subpages\header.svelte generated by Svelte v3.46.4 */
    const file$j = "src\\subpages\\admin_subpages\\header.svelte";

    // (5:4) <Link to="/profile">
    function create_default_slot_9$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Profil");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(5:4) <Link to=\\\"/profile\\\">",
    		ctx
    	});

    	return block;
    }

    // (6:4) <Link to="/profile/settings">
    function create_default_slot_8$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Główne ustawienia");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(6:4) <Link to=\\\"/profile/settings\\\">",
    		ctx
    	});

    	return block;
    }

    // (7:4) <Link to="/profile/users">
    function create_default_slot_7$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Użytkownicy");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(7:4) <Link to=\\\"/profile/users\\\">",
    		ctx
    	});

    	return block;
    }

    // (8:4) <Link to="/profile/comments">
    function create_default_slot_6$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Komentarze");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(8:4) <Link to=\\\"/profile/comments\\\">",
    		ctx
    	});

    	return block;
    }

    // (9:4) <Link to="/profile/comms">
    function create_default_slot_5$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Komentarze pod artykułami");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(9:4) <Link to=\\\"/profile/comms\\\">",
    		ctx
    	});

    	return block;
    }

    // (10:4) <Link to="/profile/gallery">
    function create_default_slot_4$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Galeria");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(10:4) <Link to=\\\"/profile/gallery\\\">",
    		ctx
    	});

    	return block;
    }

    // (11:4) <Link to="/profile/articles">
    function create_default_slot_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Artykuły");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(11:4) <Link to=\\\"/profile/articles\\\">",
    		ctx
    	});

    	return block;
    }

    // (12:4) <Link to="/profile/slider">
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Slajder");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(12:4) <Link to=\\\"/profile/slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (13:4) <Link to="/profile/header">
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Menu");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(13:4) <Link to=\\\"/profile/header\\\">",
    		ctx
    	});

    	return block;
    }

    // (14:4) <Link to="/profile/footer">
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Stopka");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(14:4) <Link to=\\\"/profile/footer\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let div;
    	let link0;
    	let t0;
    	let link1;
    	let t1;
    	let link2;
    	let t2;
    	let link3;
    	let t3;
    	let link4;
    	let t4;
    	let link5;
    	let t5;
    	let link6;
    	let t6;
    	let link7;
    	let t7;
    	let link8;
    	let t8;
    	let link9;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/profile",
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/profile/settings",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "/profile/users",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link$1({
    			props: {
    				to: "/profile/comments",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link$1({
    			props: {
    				to: "/profile/comms",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link5 = new Link$1({
    			props: {
    				to: "/profile/gallery",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link6 = new Link$1({
    			props: {
    				to: "/profile/articles",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link7 = new Link$1({
    			props: {
    				to: "/profile/slider",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link8 = new Link$1({
    			props: {
    				to: "/profile/header",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link9 = new Link$1({
    			props: {
    				to: "/profile/footer",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			create_component(link1.$$.fragment);
    			t1 = space();
    			create_component(link2.$$.fragment);
    			t2 = space();
    			create_component(link3.$$.fragment);
    			t3 = space();
    			create_component(link4.$$.fragment);
    			t4 = space();
    			create_component(link5.$$.fragment);
    			t5 = space();
    			create_component(link6.$$.fragment);
    			t6 = space();
    			create_component(link7.$$.fragment);
    			t7 = space();
    			create_component(link8.$$.fragment);
    			t8 = space();
    			create_component(link9.$$.fragment);
    			attr_dev(div, "class", "adminHeader");
    			add_location(div, file$j, 3, 0, 82);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(link0, div, null);
    			append_dev(div, t0);
    			mount_component(link1, div, null);
    			append_dev(div, t1);
    			mount_component(link2, div, null);
    			append_dev(div, t2);
    			mount_component(link3, div, null);
    			append_dev(div, t3);
    			mount_component(link4, div, null);
    			append_dev(div, t4);
    			mount_component(link5, div, null);
    			append_dev(div, t5);
    			mount_component(link6, div, null);
    			append_dev(div, t6);
    			mount_component(link7, div, null);
    			append_dev(div, t7);
    			mount_component(link8, div, null);
    			append_dev(div, t8);
    			mount_component(link9, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const link4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link4_changes.$$scope = { dirty, ctx };
    			}

    			link4.$set(link4_changes);
    			const link5_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link5_changes.$$scope = { dirty, ctx };
    			}

    			link5.$set(link5_changes);
    			const link6_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link6_changes.$$scope = { dirty, ctx };
    			}

    			link6.$set(link6_changes);
    			const link7_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link7_changes.$$scope = { dirty, ctx };
    			}

    			link7.$set(link7_changes);
    			const link8_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link8_changes.$$scope = { dirty, ctx };
    			}

    			link8.$set(link8_changes);
    			const link9_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link9_changes.$$scope = { dirty, ctx };
    			}

    			link9.$set(link9_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			transition_in(link5.$$.fragment, local);
    			transition_in(link6.$$.fragment, local);
    			transition_in(link7.$$.fragment, local);
    			transition_in(link8.$$.fragment, local);
    			transition_in(link9.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			transition_out(link5.$$.fragment, local);
    			transition_out(link6.$$.fragment, local);
    			transition_out(link7.$$.fragment, local);
    			transition_out(link8.$$.fragment, local);
    			transition_out(link9.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			destroy_component(link4);
    			destroy_component(link5);
    			destroy_component(link6);
    			destroy_component(link7);
    			destroy_component(link8);
    			destroy_component(link9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Router: Router$1, Route: Route$1, Link: Link$1 });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\subpages\admin.svelte generated by Svelte v3.46.4 */
    const file$i = "src\\subpages\\admin.svelte";

    function create_fragment$j(ctx) {
    	let article;
    	let header;
    	let t;
    	let profile;
    	let current;
    	header = new Header({ $$inline: true });

    	profile = new Profile({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article = element("article");
    			create_component(header.$$.fragment);
    			t = space();
    			create_component(profile.$$.fragment);
    			add_location(article, file$i, 5, 0, 147);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			mount_component(header, article, null);
    			append_dev(article, t);
    			mount_component(profile, article, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const profile_changes = {};
    			if (dirty & /*settings*/ 1) profile_changes.settings = /*settings*/ ctx[0];
    			profile.$set(profile_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(profile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(profile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_component(header);
    			destroy_component(profile);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Admin', slots, []);
    	let { settings } = $$props;
    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Admin> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({ settings, Header, Profile });

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [settings];
    }

    class Admin extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Admin",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console.warn("<Admin> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Admin>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Admin>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\main_elements\big_article.svelte generated by Svelte v3.46.4 */

    const { console: console_1$b } = globals;
    const file$h = "src\\subpages\\main_elements\\big_article.svelte";

    function get_each_context$c(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (42:24) {:else}
    function create_else_block$5(ctx) {
    	let span;
    	let t0_value = /*settings*/ ctx[0].comments_loginfo_text + "";
    	let t0;
    	let t1;
    	let a;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			a = element("a");
    			t2 = text("Login");
    			add_location(span, file$h, 42, 24, 2126);
    			attr_dev(a, "href", "/login");
    			set_style(a, "color", /*settings*/ ctx[0].comments_section_adder_font_color);
    			add_location(a, file$h, 42, 70, 2172);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			insert_dev(target, a, anchor);
    			append_dev(a, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*settings*/ ctx[0].comments_loginfo_text + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(a, "color", /*settings*/ ctx[0].comments_section_adder_font_color);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(42:24) {:else}",
    		ctx
    	});

    	return block;
    }

    // (40:24) {#if sessionStorage.getItem('logged')=='true'}
    function create_if_block_1$2(ctx) {
    	let textarea;
    	let button;
    	let t_value = /*settings*/ ctx[0].comment_add_comment + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			button = element("button");
    			t = text(t_value);
    			add_location(textarea, file$h, 40, 24, 1819);
    			set_style(button, "color", /*settings*/ ctx[0].comments_section_adder_btn_font_color);
    			set_style(button, "background-color", /*settings*/ ctx[0].comments_section_adder_btn_bg_color);
    			add_location(button, file$h, 40, 66, 1861);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*text*/ ctx[2]);
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[4]),
    					listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 4) {
    				set_input_value(textarea, /*text*/ ctx[2]);
    			}

    			if (dirty & /*settings*/ 1 && t_value !== (t_value = /*settings*/ ctx[0].comment_add_comment + "")) set_data_dev(t, t_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(button, "color", /*settings*/ ctx[0].comments_section_adder_btn_font_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(button, "background-color", /*settings*/ ctx[0].comments_section_adder_btn_bg_color);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(40:24) {#if sessionStorage.getItem('logged')=='true'}",
    		ctx
    	});

    	return block;
    }

    // (49:24) {#if comment.art_id == article.id}
    function create_if_block$6(ctx) {
    	let div;
    	let span;
    	let b;
    	let t0_value = /*comment*/ ctx[6].username + "";
    	let t0;
    	let t1;
    	let t2_value = /*settings*/ ctx[0].comment_writes + "";
    	let t2;
    	let t3;
    	let i;
    	let t4;
    	let t5_value = /*comment*/ ctx[6].content + "";
    	let t5;
    	let t6;
    	let t7;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			b = element("b");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			i = element("i");
    			t4 = text("\"");
    			t5 = text(t5_value);
    			t6 = text("\"");
    			t7 = space();
    			add_location(b, file$h, 50, 38, 2687);
    			add_location(span, file$h, 50, 32, 2681);
    			add_location(i, file$h, 51, 32, 2779);
    			set_style(div, "background-color", /*settings*/ ctx[0].comment_bg_color);
    			set_style(div, "color", /*settings*/ ctx[0].comment_font_color);
    			add_location(div, file$h, 49, 28, 2553);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, b);
    			append_dev(b, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(div, t3);
    			append_dev(div, i);
    			append_dev(i, t4);
    			append_dev(i, t5);
    			append_dev(i, t6);
    			append_dev(div, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*comment*/ ctx[6].username + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*settings*/ 1 && t2_value !== (t2_value = /*settings*/ ctx[0].comment_writes + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*settings*/ 1 && t5_value !== (t5_value = /*comment*/ ctx[6].content + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(div, "background-color", /*settings*/ ctx[0].comment_bg_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div, "color", /*settings*/ ctx[0].comment_font_color);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(49:24) {#if comment.art_id == article.id}",
    		ctx
    	});

    	return block;
    }

    // (48:24) {#each settings.comms.slice().reverse() as comment}
    function create_each_block$c(ctx) {
    	let if_block_anchor;
    	let if_block = /*comment*/ ctx[6].art_id == /*article*/ ctx[1].id && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*comment*/ ctx[6].art_id == /*article*/ ctx[1].id) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$c.name,
    		type: "each",
    		source: "(48:24) {#each settings.comms.slice().reverse() as comment}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let article_1;
    	let div7;
    	let h2;
    	let t0_value = /*article*/ ctx[1].title + "";
    	let t0;
    	let t1;
    	let div0;
    	let span0;
    	let t2_value = /*article*/ ctx[1].category + "";
    	let t2;
    	let t3;
    	let t4;
    	let span1;
    	let t5_value = /*article*/ ctx[1].date + "";
    	let t5;
    	let t6;
    	let div1;
    	let t7_value = /*article*/ ctx[1].intro + "";
    	let t7;
    	let t8;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t9;
    	let div2;
    	let raw_value = /*article*/ ctx[1].content + "";
    	let t10;
    	let div6;
    	let div5;
    	let h1;
    	let t11_value = /*settings*/ ctx[0].article_comments_text + "";
    	let t11;
    	let t12;
    	let div3;
    	let t13;
    	let div4;

    	function select_block_type(ctx, dirty) {
    		if (sessionStorage.getItem('logged') == 'true') return create_if_block_1$2;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type();
    	let if_block = current_block_type(ctx);
    	let each_value = /*settings*/ ctx[0].comms.slice().reverse();
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			div7 = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			span0 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			t4 = text("| ");
    			span1 = element("span");
    			t5 = text(t5_value);
    			t6 = space();
    			div1 = element("div");
    			t7 = text(t7_value);
    			t8 = space();
    			img = element("img");
    			t9 = space();
    			div2 = element("div");
    			t10 = space();
    			div6 = element("div");
    			div5 = element("div");
    			h1 = element("h1");
    			t11 = text(t11_value);
    			t12 = space();
    			div3 = element("div");
    			if_block.c();
    			t13 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(h2, "font-size", /*settings*/ ctx[0].article_page_header_size);
    			add_location(h2, file$h, 30, 12, 982);
    			add_location(span0, file$h, 31, 17, 1079);
    			add_location(span1, file$h, 31, 51, 1113);
    			add_location(div0, file$h, 31, 12, 1074);
    			set_style(div1, "font-size", /*settings*/ ctx[0].article_page_intro_size);
    			add_location(div1, file$h, 32, 12, 1161);
    			if (!src_url_equal(img.src, img_src_value = /*article*/ ctx[1].img)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*article*/ ctx[1].title);
    			add_location(img, file$h, 33, 12, 1254);
    			attr_dev(div2, "class", "content");
    			set_style(div2, "font-size", /*settings*/ ctx[0].article_page_content_size);
    			add_location(div2, file$h, 34, 12, 1311);
    			add_location(h1, file$h, 37, 20, 1520);
    			attr_dev(div3, "class", "adder");
    			set_style(div3, "background-color", /*settings*/ ctx[0].comments_section_adder_bg_color);
    			set_style(div3, "color", /*settings*/ ctx[0].comments_section_adder_font_color);
    			add_location(div3, file$h, 38, 20, 1583);
    			attr_dev(div4, "class", "comments");
    			add_location(div4, file$h, 46, 20, 2364);
    			attr_dev(div5, "class", "container");
    			add_location(div5, file$h, 36, 16, 1474);
    			attr_dev(div6, "class", "commentsSite");
    			add_location(div6, file$h, 35, 12, 1430);
    			attr_dev(div7, "class", "bigArticle");
    			set_style(div7, "color", /*settings*/ ctx[0].article_page_font_color);
    			add_location(div7, file$h, 29, 8, 895);
    			attr_dev(article_1, "class", "bigArticleContainer");
    			add_location(article_1, file$h, 28, 0, 848);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			append_dev(article_1, div7);
    			append_dev(div7, h2);
    			append_dev(h2, t0);
    			append_dev(div7, t1);
    			append_dev(div7, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t2);
    			append_dev(span0, t3);
    			append_dev(div0, t4);
    			append_dev(div0, span1);
    			append_dev(span1, t5);
    			append_dev(div7, t6);
    			append_dev(div7, div1);
    			append_dev(div1, t7);
    			append_dev(div7, t8);
    			append_dev(div7, img);
    			append_dev(div7, t9);
    			append_dev(div7, div2);
    			div2.innerHTML = raw_value;
    			append_dev(div7, t10);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, h1);
    			append_dev(h1, t11);
    			append_dev(div5, t12);
    			append_dev(div5, div3);
    			if_block.m(div3, null);
    			append_dev(div5, t13);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*article*/ 2 && t0_value !== (t0_value = /*article*/ ctx[1].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(h2, "font-size", /*settings*/ ctx[0].article_page_header_size);
    			}

    			if (dirty & /*article*/ 2 && t2_value !== (t2_value = /*article*/ ctx[1].category + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*article*/ 2 && t5_value !== (t5_value = /*article*/ ctx[1].date + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*article*/ 2 && t7_value !== (t7_value = /*article*/ ctx[1].intro + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*settings*/ 1) {
    				set_style(div1, "font-size", /*settings*/ ctx[0].article_page_intro_size);
    			}

    			if (dirty & /*article*/ 2 && !src_url_equal(img.src, img_src_value = /*article*/ ctx[1].img)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*article*/ 2 && img_alt_value !== (img_alt_value = /*article*/ ctx[1].title)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*article*/ 2 && raw_value !== (raw_value = /*article*/ ctx[1].content + "")) div2.innerHTML = raw_value;
    			if (dirty & /*settings*/ 1) {
    				set_style(div2, "font-size", /*settings*/ ctx[0].article_page_content_size);
    			}

    			if (dirty & /*settings*/ 1 && t11_value !== (t11_value = /*settings*/ ctx[0].article_comments_text + "")) set_data_dev(t11, t11_value);
    			if_block.p(ctx, dirty);

    			if (dirty & /*settings*/ 1) {
    				set_style(div3, "background-color", /*settings*/ ctx[0].comments_section_adder_bg_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div3, "color", /*settings*/ ctx[0].comments_section_adder_font_color);
    			}

    			if (dirty & /*settings, article*/ 3) {
    				each_value = /*settings*/ ctx[0].comms.slice().reverse();
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$c(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$c(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div4, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(div7, "color", /*settings*/ ctx[0].article_page_font_color);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			if_block.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Big_article', slots, []);
    	let { settings } = $$props;
    	let { article } = $$props;
    	let text = "";

    	function addComment() {
    		if (text != "") {
    			let comment = {
    				"id": settings.comms[settings.comms.length - 1].id + 1,
    				"username": sessionStorage.getItem('username'),
    				"content": text,
    				"art_id": article.id
    			};

    			//settings.comments.push(comment)
    			$$invalidate(2, text = "");

    			console.log(settings.comments);

    			fetch('http://127.0.0.1:5000/addComm', {
    				headers: { 'Content-Type': 'application/json' },
    				method: 'POST',
    				body: JSON.stringify({ comment })
    			}).then(data => data.json()).then(data => {
    				window.location.reload(true);
    			});
    		}
    	}

    	const writable_props = ['settings', 'article'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$b.warn(`<Big_article> was created with unknown prop '${key}'`);
    	});

    	function textarea_input_handler() {
    		text = this.value;
    		$$invalidate(2, text);
    	}

    	const click_handler = () => {
    		addComment();
    	};

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('article' in $$props) $$invalidate(1, article = $$props.article);
    	};

    	$$self.$capture_state = () => ({ settings, article, text, addComment });

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('article' in $$props) $$invalidate(1, article = $$props.article);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [settings, article, text, addComment, textarea_input_handler, click_handler];
    }

    class Big_article extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { settings: 0, article: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Big_article",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console_1$b.warn("<Big_article> was created without expected prop 'settings'");
    		}

    		if (/*article*/ ctx[1] === undefined && !('article' in props)) {
    			console_1$b.warn("<Big_article> was created without expected prop 'article'");
    		}
    	}

    	get settings() {
    		throw new Error("<Big_article>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Big_article>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get article() {
    		throw new Error("<Big_article>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set article(value) {
    		throw new Error("<Big_article>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-burger-menu\src\BurgerButton.svelte generated by Svelte v3.46.4 */

    const file$g = "node_modules\\svelte-burger-menu\\src\\BurgerButton.svelte";

    function create_fragment$h(ctx) {
    	let button;
    	let svg;
    	let line0;
    	let line1;
    	let line2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			line2 = svg_element("line");
    			attr_dev(line0, "id", "top");
    			attr_dev(line0, "x1", "0");
    			attr_dev(line0, "y1", "9");
    			attr_dev(line0, "x2", "32");
    			attr_dev(line0, "y2", "9");
    			set_style(line0, "transition", "transform " + /*duration*/ ctx[1] + "s ease-in-out, opacity " + /*duration*/ ctx[1] + "s ease-in-out");
    			attr_dev(line0, "class", "svelte-hbdsxb");
    			add_location(line0, file$g, 50, 8, 970);
    			attr_dev(line1, "id", "mid");
    			attr_dev(line1, "x1", "0");
    			attr_dev(line1, "y1", "18.5");
    			attr_dev(line1, "x2", "32");
    			attr_dev(line1, "y2", "18.5");
    			set_style(line1, "transition", "transform " + /*duration*/ ctx[1] + "s ease-in-out, opacity " + /*duration*/ ctx[1] + "s ease-in-out");
    			attr_dev(line1, "class", "svelte-hbdsxb");
    			add_location(line1, file$g, 51, 2, 1104);
    			attr_dev(line2, "id", "bot");
    			attr_dev(line2, "x1", "0");
    			attr_dev(line2, "y1", "28");
    			attr_dev(line2, "x2", "32");
    			attr_dev(line2, "y2", "28");
    			set_style(line2, "transition", "transform " + /*duration*/ ctx[1] + "s ease-in-out, opacity " + /*duration*/ ctx[1] + "s ease-in-out");
    			attr_dev(line2, "class", "svelte-hbdsxb");
    			add_location(line2, file$g, 52, 2, 1238);
    			attr_dev(svg, "width", "32");
    			attr_dev(svg, "height", "32");
    			attr_dev(svg, "class", "svelte-hbdsxb");
    			add_location(svg, file$g, 49, 1, 937);
    			set_style(button, "transition", "color " + /*duration*/ ctx[1] + "s ease-in-out");

    			set_style(button, "color", /*open*/ ctx[0]
    			? /*menuColor*/ ctx[3]
    			: /*burgerColor*/ ctx[2]);

    			attr_dev(button, "class", "svelte-hbdsxb");
    			toggle_class(button, "open", /*open*/ ctx[0]);
    			add_location(button, file$g, 48, 0, 794);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, line0);
    			append_dev(svg, line1);
    			append_dev(svg, line2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*duration*/ 2) {
    				set_style(line0, "transition", "transform " + /*duration*/ ctx[1] + "s ease-in-out, opacity " + /*duration*/ ctx[1] + "s ease-in-out");
    			}

    			if (dirty & /*duration*/ 2) {
    				set_style(line1, "transition", "transform " + /*duration*/ ctx[1] + "s ease-in-out, opacity " + /*duration*/ ctx[1] + "s ease-in-out");
    			}

    			if (dirty & /*duration*/ 2) {
    				set_style(line2, "transition", "transform " + /*duration*/ ctx[1] + "s ease-in-out, opacity " + /*duration*/ ctx[1] + "s ease-in-out");
    			}

    			if (dirty & /*duration*/ 2) {
    				set_style(button, "transition", "color " + /*duration*/ ctx[1] + "s ease-in-out");
    			}

    			if (dirty & /*open, menuColor, burgerColor*/ 13) {
    				set_style(button, "color", /*open*/ ctx[0]
    				? /*menuColor*/ ctx[3]
    				: /*burgerColor*/ ctx[2]);
    			}

    			if (dirty & /*open*/ 1) {
    				toggle_class(button, "open", /*open*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BurgerButton', slots, []);
    	let { open } = $$props;
    	let { duration } = $$props;
    	let { burgerColor } = $$props;
    	let { menuColor } = $$props;
    	const writable_props = ['open', 'duration', 'burgerColor', 'menuColor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BurgerButton> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, open = !open);

    	$$self.$$set = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('duration' in $$props) $$invalidate(1, duration = $$props.duration);
    		if ('burgerColor' in $$props) $$invalidate(2, burgerColor = $$props.burgerColor);
    		if ('menuColor' in $$props) $$invalidate(3, menuColor = $$props.menuColor);
    	};

    	$$self.$capture_state = () => ({ open, duration, burgerColor, menuColor });

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('duration' in $$props) $$invalidate(1, duration = $$props.duration);
    		if ('burgerColor' in $$props) $$invalidate(2, burgerColor = $$props.burgerColor);
    		if ('menuColor' in $$props) $$invalidate(3, menuColor = $$props.menuColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, duration, burgerColor, menuColor, click_handler];
    }

    class BurgerButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			open: 0,
    			duration: 1,
    			burgerColor: 2,
    			menuColor: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BurgerButton",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*open*/ ctx[0] === undefined && !('open' in props)) {
    			console.warn("<BurgerButton> was created without expected prop 'open'");
    		}

    		if (/*duration*/ ctx[1] === undefined && !('duration' in props)) {
    			console.warn("<BurgerButton> was created without expected prop 'duration'");
    		}

    		if (/*burgerColor*/ ctx[2] === undefined && !('burgerColor' in props)) {
    			console.warn("<BurgerButton> was created without expected prop 'burgerColor'");
    		}

    		if (/*menuColor*/ ctx[3] === undefined && !('menuColor' in props)) {
    			console.warn("<BurgerButton> was created without expected prop 'menuColor'");
    		}
    	}

    	get open() {
    		throw new Error("<BurgerButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<BurgerButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<BurgerButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<BurgerButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get burgerColor() {
    		throw new Error("<BurgerButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set burgerColor(value) {
    		throw new Error("<BurgerButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuColor() {
    		throw new Error("<BurgerButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuColor(value) {
    		throw new Error("<BurgerButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-burger-menu\src\SideMenu.svelte generated by Svelte v3.46.4 */

    const file$f = "node_modules\\svelte-burger-menu\\src\\SideMenu.svelte";

    function create_fragment$g(ctx) {
    	let div1;
    	let div0;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "id", "menu");
    			set_style(div0, "padding", /*padding*/ ctx[3]);
    			set_style(div0, "padding-top", /*paddingTop*/ ctx[4]);
    			attr_dev(div0, "class", "svelte-1q8nmai");
    			add_location(div0, file$f, 27, 4, 570);
    			attr_dev(div1, "id", "container");
    			set_style(div1, "background-color", /*backgroundColor*/ ctx[5]);
    			set_style(div1, "color", /*menuColor*/ ctx[6]);
    			set_style(div1, "width", /*width*/ ctx[2]);
    			set_style(div1, "left", /*open*/ ctx[0] ? '0px' : '-' + /*width*/ ctx[2]);
    			set_style(div1, "transition", "left " + /*duration*/ ctx[1] + "s ease-in-out");
    			attr_dev(div1, "class", "svelte-1q8nmai");
    			add_location(div1, file$f, 26, 0, 385);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*padding*/ 8) {
    				set_style(div0, "padding", /*padding*/ ctx[3]);
    			}

    			if (!current || dirty & /*paddingTop*/ 16) {
    				set_style(div0, "padding-top", /*paddingTop*/ ctx[4]);
    			}

    			if (!current || dirty & /*backgroundColor*/ 32) {
    				set_style(div1, "background-color", /*backgroundColor*/ ctx[5]);
    			}

    			if (!current || dirty & /*menuColor*/ 64) {
    				set_style(div1, "color", /*menuColor*/ ctx[6]);
    			}

    			if (!current || dirty & /*width*/ 4) {
    				set_style(div1, "width", /*width*/ ctx[2]);
    			}

    			if (!current || dirty & /*open, width*/ 5) {
    				set_style(div1, "left", /*open*/ ctx[0] ? '0px' : '-' + /*width*/ ctx[2]);
    			}

    			if (!current || dirty & /*duration*/ 2) {
    				set_style(div1, "transition", "left " + /*duration*/ ctx[1] + "s ease-in-out");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SideMenu', slots, ['default']);
    	let { open } = $$props;
    	let { duration } = $$props;
    	let { width } = $$props;
    	let { padding } = $$props;
    	let { paddingTop } = $$props;
    	let { backgroundColor } = $$props;
    	let { menuColor } = $$props;

    	const writable_props = [
    		'open',
    		'duration',
    		'width',
    		'padding',
    		'paddingTop',
    		'backgroundColor',
    		'menuColor'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SideMenu> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('duration' in $$props) $$invalidate(1, duration = $$props.duration);
    		if ('width' in $$props) $$invalidate(2, width = $$props.width);
    		if ('padding' in $$props) $$invalidate(3, padding = $$props.padding);
    		if ('paddingTop' in $$props) $$invalidate(4, paddingTop = $$props.paddingTop);
    		if ('backgroundColor' in $$props) $$invalidate(5, backgroundColor = $$props.backgroundColor);
    		if ('menuColor' in $$props) $$invalidate(6, menuColor = $$props.menuColor);
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		open,
    		duration,
    		width,
    		padding,
    		paddingTop,
    		backgroundColor,
    		menuColor
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('duration' in $$props) $$invalidate(1, duration = $$props.duration);
    		if ('width' in $$props) $$invalidate(2, width = $$props.width);
    		if ('padding' in $$props) $$invalidate(3, padding = $$props.padding);
    		if ('paddingTop' in $$props) $$invalidate(4, paddingTop = $$props.paddingTop);
    		if ('backgroundColor' in $$props) $$invalidate(5, backgroundColor = $$props.backgroundColor);
    		if ('menuColor' in $$props) $$invalidate(6, menuColor = $$props.menuColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		open,
    		duration,
    		width,
    		padding,
    		paddingTop,
    		backgroundColor,
    		menuColor,
    		$$scope,
    		slots
    	];
    }

    class SideMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			open: 0,
    			duration: 1,
    			width: 2,
    			padding: 3,
    			paddingTop: 4,
    			backgroundColor: 5,
    			menuColor: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideMenu",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*open*/ ctx[0] === undefined && !('open' in props)) {
    			console.warn("<SideMenu> was created without expected prop 'open'");
    		}

    		if (/*duration*/ ctx[1] === undefined && !('duration' in props)) {
    			console.warn("<SideMenu> was created without expected prop 'duration'");
    		}

    		if (/*width*/ ctx[2] === undefined && !('width' in props)) {
    			console.warn("<SideMenu> was created without expected prop 'width'");
    		}

    		if (/*padding*/ ctx[3] === undefined && !('padding' in props)) {
    			console.warn("<SideMenu> was created without expected prop 'padding'");
    		}

    		if (/*paddingTop*/ ctx[4] === undefined && !('paddingTop' in props)) {
    			console.warn("<SideMenu> was created without expected prop 'paddingTop'");
    		}

    		if (/*backgroundColor*/ ctx[5] === undefined && !('backgroundColor' in props)) {
    			console.warn("<SideMenu> was created without expected prop 'backgroundColor'");
    		}

    		if (/*menuColor*/ ctx[6] === undefined && !('menuColor' in props)) {
    			console.warn("<SideMenu> was created without expected prop 'menuColor'");
    		}
    	}

    	get open() {
    		throw new Error("<SideMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<SideMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<SideMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<SideMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<SideMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<SideMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<SideMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<SideMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paddingTop() {
    		throw new Error("<SideMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paddingTop(value) {
    		throw new Error("<SideMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backgroundColor() {
    		throw new Error("<SideMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backgroundColor(value) {
    		throw new Error("<SideMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuColor() {
    		throw new Error("<SideMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuColor(value) {
    		throw new Error("<SideMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-burger-menu\src\BurgerMenu.svelte generated by Svelte v3.46.4 */

    // (33:0) <SideMenu {...menuProps} bind:open={open}>
    function create_default_slot$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(33:0) <SideMenu {...menuProps} bind:open={open}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let burgerbutton;
    	let updating_open;
    	let t;
    	let sidemenu;
    	let updating_open_1;
    	let current;
    	const burgerbutton_spread_levels = [/*burgerProps*/ ctx[1]];

    	function burgerbutton_open_binding(value) {
    		/*burgerbutton_open_binding*/ ctx[11](value);
    	}

    	let burgerbutton_props = {};

    	for (let i = 0; i < burgerbutton_spread_levels.length; i += 1) {
    		burgerbutton_props = assign(burgerbutton_props, burgerbutton_spread_levels[i]);
    	}

    	if (/*open*/ ctx[0] !== void 0) {
    		burgerbutton_props.open = /*open*/ ctx[0];
    	}

    	burgerbutton = new BurgerButton({
    			props: burgerbutton_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(burgerbutton, 'open', burgerbutton_open_binding));
    	const sidemenu_spread_levels = [/*menuProps*/ ctx[2]];

    	function sidemenu_open_binding(value) {
    		/*sidemenu_open_binding*/ ctx[12](value);
    	}

    	let sidemenu_props = {
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < sidemenu_spread_levels.length; i += 1) {
    		sidemenu_props = assign(sidemenu_props, sidemenu_spread_levels[i]);
    	}

    	if (/*open*/ ctx[0] !== void 0) {
    		sidemenu_props.open = /*open*/ ctx[0];
    	}

    	sidemenu = new SideMenu({ props: sidemenu_props, $$inline: true });
    	binding_callbacks.push(() => bind(sidemenu, 'open', sidemenu_open_binding));

    	const block = {
    		c: function create() {
    			create_component(burgerbutton.$$.fragment);
    			t = space();
    			create_component(sidemenu.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(burgerbutton, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(sidemenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const burgerbutton_changes = (dirty & /*burgerProps*/ 2)
    			? get_spread_update(burgerbutton_spread_levels, [get_spread_object(/*burgerProps*/ ctx[1])])
    			: {};

    			if (!updating_open && dirty & /*open*/ 1) {
    				updating_open = true;
    				burgerbutton_changes.open = /*open*/ ctx[0];
    				add_flush_callback(() => updating_open = false);
    			}

    			burgerbutton.$set(burgerbutton_changes);

    			const sidemenu_changes = (dirty & /*menuProps*/ 4)
    			? get_spread_update(sidemenu_spread_levels, [get_spread_object(/*menuProps*/ ctx[2])])
    			: {};

    			if (dirty & /*$$scope*/ 8192) {
    				sidemenu_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_open_1 && dirty & /*open*/ 1) {
    				updating_open_1 = true;
    				sidemenu_changes.open = /*open*/ ctx[0];
    				add_flush_callback(() => updating_open_1 = false);
    			}

    			sidemenu.$set(sidemenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(burgerbutton.$$.fragment, local);
    			transition_in(sidemenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(burgerbutton.$$.fragment, local);
    			transition_out(sidemenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(burgerbutton, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(sidemenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BurgerMenu', slots, ['default']);
    	let open = false;
    	let { duration = 0.4 } = $$props;
    	let { width = '300px' } = $$props;
    	let { padding = '25px' } = $$props;
    	let { paddingTop = '50px' } = $$props;
    	let { backgroundColor = 'rgb(1, 0, 74)' } = $$props;
    	let { burgerColor = 'rgb(18.4, 18.4, 18.4)' } = $$props;
    	let { menuColor = 'rgb(180, 180, 180)' } = $$props;
    	let burgerProps = { duration, burgerColor, menuColor };

    	let menuProps = {
    		duration,
    		width,
    		padding,
    		paddingTop,
    		backgroundColor,
    		menuColor
    	};

    	const writable_props = [
    		'duration',
    		'width',
    		'padding',
    		'paddingTop',
    		'backgroundColor',
    		'burgerColor',
    		'menuColor'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BurgerMenu> was created with unknown prop '${key}'`);
    	});

    	function burgerbutton_open_binding(value) {
    		open = value;
    		$$invalidate(0, open);
    	}

    	function sidemenu_open_binding(value) {
    		open = value;
    		$$invalidate(0, open);
    	}

    	$$self.$$set = $$props => {
    		if ('duration' in $$props) $$invalidate(3, duration = $$props.duration);
    		if ('width' in $$props) $$invalidate(4, width = $$props.width);
    		if ('padding' in $$props) $$invalidate(5, padding = $$props.padding);
    		if ('paddingTop' in $$props) $$invalidate(6, paddingTop = $$props.paddingTop);
    		if ('backgroundColor' in $$props) $$invalidate(7, backgroundColor = $$props.backgroundColor);
    		if ('burgerColor' in $$props) $$invalidate(8, burgerColor = $$props.burgerColor);
    		if ('menuColor' in $$props) $$invalidate(9, menuColor = $$props.menuColor);
    		if ('$$scope' in $$props) $$invalidate(13, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		BurgerButton,
    		SideMenu,
    		open,
    		duration,
    		width,
    		padding,
    		paddingTop,
    		backgroundColor,
    		burgerColor,
    		menuColor,
    		burgerProps,
    		menuProps
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('duration' in $$props) $$invalidate(3, duration = $$props.duration);
    		if ('width' in $$props) $$invalidate(4, width = $$props.width);
    		if ('padding' in $$props) $$invalidate(5, padding = $$props.padding);
    		if ('paddingTop' in $$props) $$invalidate(6, paddingTop = $$props.paddingTop);
    		if ('backgroundColor' in $$props) $$invalidate(7, backgroundColor = $$props.backgroundColor);
    		if ('burgerColor' in $$props) $$invalidate(8, burgerColor = $$props.burgerColor);
    		if ('menuColor' in $$props) $$invalidate(9, menuColor = $$props.menuColor);
    		if ('burgerProps' in $$props) $$invalidate(1, burgerProps = $$props.burgerProps);
    		if ('menuProps' in $$props) $$invalidate(2, menuProps = $$props.menuProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		open,
    		burgerProps,
    		menuProps,
    		duration,
    		width,
    		padding,
    		paddingTop,
    		backgroundColor,
    		burgerColor,
    		menuColor,
    		slots,
    		burgerbutton_open_binding,
    		sidemenu_open_binding,
    		$$scope
    	];
    }

    class BurgerMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			duration: 3,
    			width: 4,
    			padding: 5,
    			paddingTop: 6,
    			backgroundColor: 7,
    			burgerColor: 8,
    			menuColor: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BurgerMenu",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get duration() {
    		throw new Error("<BurgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<BurgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<BurgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<BurgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<BurgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<BurgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paddingTop() {
    		throw new Error("<BurgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paddingTop(value) {
    		throw new Error("<BurgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backgroundColor() {
    		throw new Error("<BurgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backgroundColor(value) {
    		throw new Error("<BurgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get burgerColor() {
    		throw new Error("<BurgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set burgerColor(value) {
    		throw new Error("<BurgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuColor() {
    		throw new Error("<BurgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuColor(value) {
    		throw new Error("<BurgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\admin_subpages\articles.svelte generated by Svelte v3.46.4 */

    const { console: console_1$a } = globals;
    const file$e = "src\\subpages\\admin_subpages\\articles.svelte";

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (93:12) {#each settings.articles as article}
    function create_each_block$b(ctx) {
    	let tr0;
    	let td0;
    	let t0_value = /*article*/ ctx[2].id + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*article*/ ctx[2].title + "";
    	let t2;
    	let t3;
    	let td2;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t4;
    	let td3;
    	let button0;
    	let t6;
    	let td4;
    	let button1;
    	let t8;
    	let tr1;
    	let td5;
    	let t9_value = /*article*/ ctx[2].intro + "";
    	let t9;
    	let t10;
    	let td6;
    	let t11_value = /*article*/ ctx[2].content + "";
    	let t11;
    	let t12;
    	let tr2;
    	let td7;
    	let t13_value = /*article*/ ctx[2].category + "";
    	let t13;
    	let t14;
    	let td8;
    	let t15_value = /*article*/ ctx[2].date + "";
    	let t15;
    	let t16;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*article*/ ctx[2]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[8](/*article*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			tr0 = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			img = element("img");
    			t4 = space();
    			td3 = element("td");
    			button0 = element("button");
    			button0.textContent = "Edytuj";
    			t6 = space();
    			td4 = element("td");
    			button1 = element("button");
    			button1.textContent = "Usuń";
    			t8 = space();
    			tr1 = element("tr");
    			td5 = element("td");
    			t9 = text(t9_value);
    			t10 = space();
    			td6 = element("td");
    			t11 = text(t11_value);
    			t12 = space();
    			tr2 = element("tr");
    			td7 = element("td");
    			t13 = text(t13_value);
    			t14 = space();
    			td8 = element("td");
    			t15 = text(t15_value);
    			t16 = space();
    			attr_dev(td0, "rowspan", "3");
    			add_location(td0, file$e, 94, 20, 2908);
    			add_location(td1, file$e, 95, 20, 2963);
    			if (!src_url_equal(img.src, img_src_value = /*article*/ ctx[2].img)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*article*/ ctx[2].title);
    			attr_dev(img, "width", 150);
    			add_location(img, file$e, 96, 24, 3013);
    			add_location(td2, file$e, 96, 20, 3009);
    			attr_dev(button0, "class", "edit");
    			add_location(button0, file$e, 97, 36, 3117);
    			attr_dev(td3, "rowspan", "3");
    			add_location(td3, file$e, 97, 20, 3101);
    			attr_dev(button1, "class", "edit");
    			add_location(button1, file$e, 98, 36, 3330);
    			attr_dev(td4, "rowspan", "3");
    			add_location(td4, file$e, 98, 20, 3314);
    			add_location(tr0, file$e, 93, 16, 2882);
    			add_location(td5, file$e, 101, 20, 3474);
    			add_location(td6, file$e, 102, 20, 3520);
    			add_location(tr1, file$e, 100, 16, 3448);
    			add_location(td7, file$e, 105, 20, 3613);
    			add_location(td8, file$e, 106, 20, 3662);
    			add_location(tr2, file$e, 104, 16, 3587);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr0, anchor);
    			append_dev(tr0, td0);
    			append_dev(td0, t0);
    			append_dev(tr0, t1);
    			append_dev(tr0, td1);
    			append_dev(td1, t2);
    			append_dev(tr0, t3);
    			append_dev(tr0, td2);
    			append_dev(td2, img);
    			append_dev(tr0, t4);
    			append_dev(tr0, td3);
    			append_dev(td3, button0);
    			append_dev(tr0, t6);
    			append_dev(tr0, td4);
    			append_dev(td4, button1);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, tr1, anchor);
    			append_dev(tr1, td5);
    			append_dev(td5, t9);
    			append_dev(tr1, t10);
    			append_dev(tr1, td6);
    			append_dev(td6, t11);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, tr2, anchor);
    			append_dev(tr2, td7);
    			append_dev(td7, t13);
    			append_dev(tr2, t14);
    			append_dev(tr2, td8);
    			append_dev(td8, t15);
    			append_dev(tr2, t16);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*article*/ ctx[2].id + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*settings*/ 1 && t2_value !== (t2_value = /*article*/ ctx[2].title + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*settings*/ 1 && !src_url_equal(img.src, img_src_value = /*article*/ ctx[2].img)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*settings*/ 1 && img_alt_value !== (img_alt_value = /*article*/ ctx[2].title)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*settings*/ 1 && t9_value !== (t9_value = /*article*/ ctx[2].intro + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*settings*/ 1 && t11_value !== (t11_value = /*article*/ ctx[2].content + "")) set_data_dev(t11, t11_value);
    			if (dirty & /*settings*/ 1 && t13_value !== (t13_value = /*article*/ ctx[2].category + "")) set_data_dev(t13, t13_value);
    			if (dirty & /*settings*/ 1 && t15_value !== (t15_value = /*article*/ ctx[2].date + "")) set_data_dev(t15, t15_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr0);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(tr1);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(tr2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$b.name,
    		type: "each",
    		source: "(93:12) {#each settings.articles as article}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let header;
    	let t0;
    	let article_1;
    	let table;
    	let t1;
    	let div;
    	let t2;
    	let input0;
    	let t3;
    	let input1;
    	let t4;
    	let input2;
    	let t5;
    	let input3;
    	let t6;
    	let input4;
    	let t7;
    	let textarea;
    	let textarea_value_value;
    	let t8;
    	let button0;
    	let t10;
    	let dialog_1;
    	let t11;
    	let button1;
    	let t13;
    	let button2;
    	let current;
    	let mounted;
    	let dispose;
    	header = new Header({ $$inline: true });
    	let each_value = /*settings*/ ctx[0].articles;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			article_1 = element("article");
    			table = element("table");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div = element("div");
    			t2 = text("title");
    			input0 = element("input");
    			t3 = text("\r\n            src");
    			input1 = element("input");
    			t4 = text("\r\n            intro");
    			input2 = element("input");
    			t5 = text("\r\n            date");
    			input3 = element("input");
    			t6 = text("\r\n            category");
    			input4 = element("input");
    			t7 = text("\r\n            content");
    			textarea = element("textarea");
    			t8 = space();
    			button0 = element("button");
    			button0.textContent = "Save";
    			t10 = space();
    			dialog_1 = element("dialog");
    			t11 = text("Czy na pewno usunąć?\r\n            ");
    			button1 = element("button");
    			button1.textContent = "Tak";
    			t13 = space();
    			button2 = element("button");
    			button2.textContent = "Nie";
    			add_location(table, file$e, 91, 8, 2807);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$e, 111, 17, 3809);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$e, 112, 15, 3874);
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$e, 113, 17, 3939);
    			attr_dev(input3, "type", "date");
    			add_location(input3, file$e, 114, 16, 4005);
    			attr_dev(input4, "type", "text");
    			add_location(input4, file$e, 115, 20, 4075);
    			attr_dev(textarea, "rows", "10");
    			attr_dev(textarea, "id", "content");
    			textarea.value = textarea_value_value = /*article*/ ctx[2].content;
    			add_location(textarea, file$e, 116, 19, 4147);
    			add_location(button0, file$e, 117, 12, 4222);
    			attr_dev(div, "class", "articlesSettingsBox");
    			add_location(div, file$e, 110, 8, 3757);
    			add_location(button1, file$e, 121, 12, 4370);
    			add_location(button2, file$e, 122, 12, 4438);
    			add_location(dialog_1, file$e, 119, 8, 4293);
    			attr_dev(article_1, "class", "settingsBox");
    			add_location(article_1, file$e, 90, 4, 2768);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, article_1, anchor);
    			append_dev(article_1, table);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			append_dev(article_1, t1);
    			append_dev(article_1, div);
    			append_dev(div, t2);
    			append_dev(div, input0);
    			set_input_value(input0, /*article*/ ctx[2].title);
    			append_dev(div, t3);
    			append_dev(div, input1);
    			set_input_value(input1, /*article*/ ctx[2].img);
    			append_dev(div, t4);
    			append_dev(div, input2);
    			set_input_value(input2, /*article*/ ctx[2].intro);
    			append_dev(div, t5);
    			append_dev(div, input3);
    			set_input_value(input3, /*article*/ ctx[2].date);
    			append_dev(div, t6);
    			append_dev(div, input4);
    			set_input_value(input4, /*article*/ ctx[2].category);
    			append_dev(div, t7);
    			append_dev(div, textarea);
    			append_dev(div, t8);
    			append_dev(div, button0);
    			append_dev(article_1, t10);
    			append_dev(article_1, dialog_1);
    			append_dev(dialog_1, t11);
    			append_dev(dialog_1, button1);
    			append_dev(dialog_1, t13);
    			append_dev(dialog_1, button2);
    			/*dialog_1_binding*/ ctx[17](dialog_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[11]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[12]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[13]),
    					listen_dev(button0, "click", /*click_handler_2*/ ctx[14], false, false, false),
    					listen_dev(button1, "click", /*click_handler_3*/ ctx[15], false, false, false),
    					listen_dev(button2, "click", /*click_handler_4*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*settings, remove, edit_prepare*/ 25) {
    				each_value = /*settings*/ ctx[0].articles;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*article*/ 4 && input0.value !== /*article*/ ctx[2].title) {
    				set_input_value(input0, /*article*/ ctx[2].title);
    			}

    			if (dirty & /*article*/ 4 && input1.value !== /*article*/ ctx[2].img) {
    				set_input_value(input1, /*article*/ ctx[2].img);
    			}

    			if (dirty & /*article*/ 4 && input2.value !== /*article*/ ctx[2].intro) {
    				set_input_value(input2, /*article*/ ctx[2].intro);
    			}

    			if (dirty & /*article*/ 4) {
    				set_input_value(input3, /*article*/ ctx[2].date);
    			}

    			if (dirty & /*article*/ 4 && input4.value !== /*article*/ ctx[2].category) {
    				set_input_value(input4, /*article*/ ctx[2].category);
    			}

    			if (!current || dirty & /*article*/ 4 && textarea_value_value !== (textarea_value_value = /*article*/ ctx[2].content)) {
    				prop_dev(textarea, "value", textarea_value_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(article_1);
    			destroy_each(each_blocks, detaching);
    			/*dialog_1_binding*/ ctx[17](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Articles', slots, []);
    	let { settings } = $$props;
    	let edit = false;

    	let article = {
    		"title": "",
    		"img": "",
    		"intro": "",
    		"content": "",
    		"date": "",
    		"category": "",
    		"content": ""
    	};

    	let editing = -1;
    	let desintegrator = -1;
    	let wrong = "";
    	let dialog;

    	function edit_prepare(x, y, z, a, b, c, d) {
    		editing = x;
    		edit = true;
    		$$invalidate(2, article.title = y, article);
    		$$invalidate(2, article.img = z, article);
    		$$invalidate(2, article.intro = a, article);
    		$$invalidate(2, article.content = b, article);
    		console.log(c);
    		$$invalidate(2, article.date = c, article);
    		$$invalidate(2, article.category = d, article);
    	}

    	function remove(x) {
    		desintegrator = x;
    		dialog.showModal();
    	}

    	function desintegrate() {
    		fetch("http://127.0.0.1:5000/deleteArticle", {
    			headers: { 'Content-Type': 'application/json' },
    			method: 'POST',
    			body: JSON.stringify({ 'id': desintegrator.toString() })
    		}).then(() => {
    			dialog.close();
    			window.location.reload(true);
    		});
    	}

    	function save() {
    		if (edit) {
    			fetch('http://127.0.0.1:5000/changeArticle', {
    				headers: { 'Content-Type': 'application/json' },
    				method: 'POST',
    				body: JSON.stringify({
    					'id': editing.toString(),
    					'title': article.title,
    					'img': article.img,
    					'intro': article.intro,
    					'content': document.getElementById('content').value,
    					'date': article.date,
    					'category': article.category
    				})
    			}).then(data => data.json()).then(data => {
    				window.location.reload(true);
    			});
    		} else {
    			fetch('http://127.0.0.1:5000/addArticle', {
    				headers: { 'Content-Type': 'application/json' },
    				method: 'POST',
    				body: JSON.stringify({
    					'id': settings.articles[settings.articles.length - 1].id + 1,
    					'title': article.title,
    					'img': article.img,
    					'intro': article.intro,
    					'content': document.getElementById('content').value,
    					'date': article.date,
    					'category': article.category
    				})
    			}).then(data => data.json()).then(data => {
    				console.log(data);
    				window.location.reload(true);
    			});
    		}

    		editing = false;

    		$$invalidate(2, article = {
    			"title": "",
    			"img": "",
    			"intro": "",
    			"content": "",
    			"date": "",
    			"category": "",
    			"content": ""
    		});
    	}

    	console.log(settings.articles);
    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$a.warn(`<Articles> was created with unknown prop '${key}'`);
    	});

    	const click_handler = article => {
    		edit_prepare(article.id, article.title, article.img, article.intro, article.content, article.date, article.category);
    	};

    	const click_handler_1 = article => {
    		remove(article.id);
    	};

    	function input0_input_handler() {
    		article.title = this.value;
    		$$invalidate(2, article);
    	}

    	function input1_input_handler() {
    		article.img = this.value;
    		$$invalidate(2, article);
    	}

    	function input2_input_handler() {
    		article.intro = this.value;
    		$$invalidate(2, article);
    	}

    	function input3_input_handler() {
    		article.date = this.value;
    		$$invalidate(2, article);
    	}

    	function input4_input_handler() {
    		article.category = this.value;
    		$$invalidate(2, article);
    	}

    	const click_handler_2 = () => save();

    	const click_handler_3 = () => {
    		desintegrate();
    	};

    	const click_handler_4 = () => {
    		dialog.close();
    	};

    	function dialog_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			dialog = $$value;
    			$$invalidate(1, dialog);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		settings,
    		edit,
    		article,
    		editing,
    		desintegrator,
    		wrong,
    		dialog,
    		edit_prepare,
    		remove,
    		desintegrate,
    		save
    	});

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('edit' in $$props) edit = $$props.edit;
    		if ('article' in $$props) $$invalidate(2, article = $$props.article);
    		if ('editing' in $$props) editing = $$props.editing;
    		if ('desintegrator' in $$props) desintegrator = $$props.desintegrator;
    		if ('wrong' in $$props) wrong = $$props.wrong;
    		if ('dialog' in $$props) $$invalidate(1, dialog = $$props.dialog);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settings,
    		dialog,
    		article,
    		edit_prepare,
    		remove,
    		desintegrate,
    		save,
    		click_handler,
    		click_handler_1,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		dialog_1_binding
    	];
    }

    class Articles extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Articles",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console_1$a.warn("<Articles> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Articles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Articles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\admin_subpages\comments.svelte generated by Svelte v3.46.4 */
    const file$d = "src\\subpages\\admin_subpages\\comments.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (27:12) {#each settings.comments as comment}
    function create_each_block$a(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*comment*/ ctx[9].id + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*comment*/ ctx[9].username + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*comment*/ ctx[9].content + "";
    	let t4;
    	let t5;
    	let td3;
    	let button;
    	let t7;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*comment*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			button = element("button");
    			button.textContent = "Usuń";
    			t7 = space();
    			add_location(td0, file$d, 28, 20, 837);
    			add_location(td1, file$d, 29, 20, 880);
    			add_location(td2, file$d, 30, 20, 929);
    			attr_dev(button, "class", "edit");
    			add_location(button, file$d, 32, 24, 999);
    			add_location(td3, file$d, 32, 20, 995);
    			add_location(tr, file$d, 27, 16, 811);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, button);
    			append_dev(tr, t7);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*comment*/ ctx[9].id + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*settings*/ 1 && t2_value !== (t2_value = /*comment*/ ctx[9].username + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*settings*/ 1 && t4_value !== (t4_value = /*comment*/ ctx[9].content + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(27:12) {#each settings.comments as comment}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let header;
    	let t0;
    	let article;
    	let table;
    	let tr;
    	let th0;
    	let th1;
    	let th2;
    	let th3;
    	let t5;
    	let t6;
    	let dialog_1;
    	let t7;
    	let button0;
    	let t9;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;
    	header = new Header({ $$inline: true });
    	let each_value = /*settings*/ ctx[0].comments;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			article = element("article");
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Id";
    			th1 = element("th");
    			th1.textContent = "Nick";
    			th2 = element("th");
    			th2.textContent = "Treść";
    			th3 = element("th");
    			th3.textContent = "Usuwanie";
    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			dialog_1 = element("dialog");
    			t7 = text("Czy na pewno usunąć?\r\n            ");
    			button0 = element("button");
    			button0.textContent = "Tak";
    			t9 = space();
    			button1 = element("button");
    			button1.textContent = "Nie";
    			add_location(th0, file$d, 25, 16, 683);
    			add_location(th1, file$d, 25, 27, 694);
    			add_location(th2, file$d, 25, 40, 707);
    			add_location(th3, file$d, 25, 54, 721);
    			add_location(tr, file$d, 25, 12, 679);
    			add_location(table, file$d, 24, 8, 658);
    			add_location(button0, file$d, 39, 12, 1235);
    			add_location(button1, file$d, 40, 12, 1303);
    			add_location(dialog_1, file$d, 37, 8, 1158);
    			attr_dev(article, "class", "settingsBox");
    			add_location(article, file$d, 23, 4, 619);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, article, anchor);
    			append_dev(article, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, th1);
    			append_dev(tr, th2);
    			append_dev(tr, th3);
    			append_dev(table, t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			append_dev(article, t6);
    			append_dev(article, dialog_1);
    			append_dev(dialog_1, t7);
    			append_dev(dialog_1, button0);
    			append_dev(dialog_1, t9);
    			append_dev(dialog_1, button1);
    			/*dialog_1_binding*/ ctx[7](dialog_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*remove, settings*/ 5) {
    				each_value = /*settings*/ ctx[0].comments;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    			/*dialog_1_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Comments', slots, []);
    	let { settings } = $$props;
    	let dialog;
    	let desintegrator;

    	function remove(x) {
    		desintegrator = x;
    		dialog.showModal();
    	}

    	function desintegrate() {
    		fetch("http://127.0.0.1:5000/deleteComment", {
    			headers: { 'Content-Type': 'application/json' },
    			method: 'POST',
    			body: JSON.stringify({ 'id': desintegrator.toString() })
    		}).then(() => {
    			dialog.close();
    			window.location.reload(true);
    		});
    	}

    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Comments> was created with unknown prop '${key}'`);
    	});

    	const click_handler = comment => {
    		remove(comment.id);
    	};

    	const click_handler_1 = () => {
    		desintegrate();
    	};

    	const click_handler_2 = () => {
    		dialog.close();
    	};

    	function dialog_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			dialog = $$value;
    			$$invalidate(1, dialog);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		settings,
    		dialog,
    		desintegrator,
    		remove,
    		desintegrate
    	});

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('dialog' in $$props) $$invalidate(1, dialog = $$props.dialog);
    		if ('desintegrator' in $$props) desintegrator = $$props.desintegrator;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settings,
    		dialog,
    		remove,
    		desintegrate,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		dialog_1_binding
    	];
    }

    class Comments extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Comments",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console.warn("<Comments> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Comments>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Comments>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\admin_subpages\comms.svelte generated by Svelte v3.46.4 */
    const file$c = "src\\subpages\\admin_subpages\\comms.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (27:12) {#each settings.comms as comment}
    function create_each_block$9(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*comment*/ ctx[9].id + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*comment*/ ctx[9].username + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*comment*/ ctx[9].content + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*comment*/ ctx[9].art_id + "";
    	let t6;
    	let t7;
    	let td4;
    	let button;
    	let t9;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*comment*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			button = element("button");
    			button.textContent = "Usuń";
    			t9 = space();
    			add_location(td0, file$c, 28, 20, 851);
    			add_location(td1, file$c, 29, 20, 894);
    			add_location(td2, file$c, 30, 20, 943);
    			add_location(td3, file$c, 31, 20, 991);
    			attr_dev(button, "class", "edit");
    			add_location(button, file$c, 33, 24, 1060);
    			add_location(td4, file$c, 33, 20, 1056);
    			add_location(tr, file$c, 27, 16, 825);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, button);
    			append_dev(tr, t9);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*comment*/ ctx[9].id + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*settings*/ 1 && t2_value !== (t2_value = /*comment*/ ctx[9].username + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*settings*/ 1 && t4_value !== (t4_value = /*comment*/ ctx[9].content + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*settings*/ 1 && t6_value !== (t6_value = /*comment*/ ctx[9].art_id + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(27:12) {#each settings.comms as comment}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let header;
    	let t0;
    	let article;
    	let table;
    	let tr;
    	let th0;
    	let th1;
    	let th2;
    	let th3;
    	let th4;
    	let t6;
    	let t7;
    	let dialog_1;
    	let t8;
    	let button0;
    	let t10;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;
    	header = new Header({ $$inline: true });
    	let each_value = /*settings*/ ctx[0].comms;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			article = element("article");
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Id";
    			th1 = element("th");
    			th1.textContent = "Nick";
    			th2 = element("th");
    			th2.textContent = "Treść";
    			th3 = element("th");
    			th3.textContent = "Id artykułu";
    			th4 = element("th");
    			th4.textContent = "Usuwanie";
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			dialog_1 = element("dialog");
    			t8 = text("Czy na pewno usunąć?\r\n            ");
    			button0 = element("button");
    			button0.textContent = "Tak";
    			t10 = space();
    			button1 = element("button");
    			button1.textContent = "Nie";
    			add_location(th0, file$c, 25, 16, 680);
    			add_location(th1, file$c, 25, 27, 691);
    			add_location(th2, file$c, 25, 40, 704);
    			add_location(th3, file$c, 25, 54, 718);
    			add_location(th4, file$c, 25, 74, 738);
    			add_location(tr, file$c, 25, 12, 676);
    			add_location(table, file$c, 24, 8, 655);
    			add_location(button0, file$c, 40, 12, 1296);
    			add_location(button1, file$c, 41, 12, 1364);
    			add_location(dialog_1, file$c, 38, 8, 1219);
    			attr_dev(article, "class", "settingsBox");
    			add_location(article, file$c, 23, 4, 616);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, article, anchor);
    			append_dev(article, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, th1);
    			append_dev(tr, th2);
    			append_dev(tr, th3);
    			append_dev(tr, th4);
    			append_dev(table, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			append_dev(article, t7);
    			append_dev(article, dialog_1);
    			append_dev(dialog_1, t8);
    			append_dev(dialog_1, button0);
    			append_dev(dialog_1, t10);
    			append_dev(dialog_1, button1);
    			/*dialog_1_binding*/ ctx[7](dialog_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*remove, settings*/ 5) {
    				each_value = /*settings*/ ctx[0].comms;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    			/*dialog_1_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Comms', slots, []);
    	let { settings } = $$props;
    	let dialog;
    	let desintegrator;

    	function remove(x) {
    		desintegrator = x;
    		dialog.showModal();
    	}

    	function desintegrate() {
    		fetch("http://127.0.0.1:5000/deleteComm", {
    			headers: { 'Content-Type': 'application/json' },
    			method: 'POST',
    			body: JSON.stringify({ 'id': desintegrator.toString() })
    		}).then(() => {
    			dialog.close();
    			window.location.reload(true);
    		});
    	}

    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Comms> was created with unknown prop '${key}'`);
    	});

    	const click_handler = comment => {
    		remove(comment.id);
    	};

    	const click_handler_1 = () => {
    		desintegrate();
    	};

    	const click_handler_2 = () => {
    		dialog.close();
    	};

    	function dialog_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			dialog = $$value;
    			$$invalidate(1, dialog);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		settings,
    		dialog,
    		desintegrator,
    		remove,
    		desintegrate
    	});

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('dialog' in $$props) $$invalidate(1, dialog = $$props.dialog);
    		if ('desintegrator' in $$props) desintegrator = $$props.desintegrator;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settings,
    		dialog,
    		remove,
    		desintegrate,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		dialog_1_binding
    	];
    }

    class Comms extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Comms",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console.warn("<Comms> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Comms>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Comms>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\admin_subpages\footer_pieces\main_footers.svelte generated by Svelte v3.46.4 */

    const { console: console_1$9 } = globals;
    const file$b = "src\\subpages\\admin_subpages\\footer_pieces\\main_footers.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (44:24) {:else }
    function create_else_block$4(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	function change_handler_2(...args) {
    		return /*change_handler_2*/ ctx[3](/*footer*/ ctx[4], ...args);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$b, 44, 24, 1637);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", change_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(44:24) {:else }",
    		ctx
    	});

    	return block;
    }

    // (42:24) {#if footer.show == 1}
    function create_if_block$5(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	function change_handler_1(...args) {
    		return /*change_handler_1*/ ctx[2](/*footer*/ ctx[4], ...args);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			input.checked = true;
    			add_location(input, file$b, 42, 24, 1460);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", change_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(42:24) {#if footer.show == 1}",
    		ctx
    	});

    	return block;
    }

    // (36:12) {#each settings.footer.main_footers as footer}
    function create_each_block$8(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*footer*/ ctx[4].id + "";
    	let t0;
    	let t1;
    	let td1;
    	let input;
    	let input_value_value;
    	let t2;
    	let td2;
    	let t3_value = /*footer*/ ctx[4].href + "";
    	let t3;
    	let t4;
    	let td3;
    	let t5;
    	let mounted;
    	let dispose;

    	function change_handler(...args) {
    		return /*change_handler*/ ctx[1](/*footer*/ ctx[4], ...args);
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*footer*/ ctx[4].show == 1) return create_if_block$5;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			input = element("input");
    			t2 = space();
    			td2 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td3 = element("td");
    			if_block.c();
    			t5 = space();
    			add_location(td0, file$b, 37, 20, 1136);
    			attr_dev(input, "type", "text");
    			input.value = input_value_value = /*footer*/ ctx[4].name;
    			add_location(input, file$b, 38, 24, 1182);
    			add_location(td1, file$b, 38, 20, 1178);
    			add_location(td2, file$b, 39, 20, 1338);
    			add_location(td3, file$b, 40, 20, 1382);
    			add_location(tr, file$b, 36, 16, 1110);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, input);
    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			if_block.m(td3, null);
    			append_dev(tr, t5);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", change_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*footer*/ ctx[4].id + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*settings*/ 1 && input_value_value !== (input_value_value = /*footer*/ ctx[4].name) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty & /*settings*/ 1 && t3_value !== (t3_value = /*footer*/ ctx[4].href + "")) set_data_dev(t3, t3_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(td3, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(36:12) {#each settings.footer.main_footers as footer}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let article;
    	let table;
    	let tr;
    	let th0;
    	let th1;
    	let th2;
    	let th3;
    	let t4;
    	let each_value = /*settings*/ ctx[0].footer.main_footers;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			article = element("article");
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Id";
    			th1 = element("th");
    			th1.textContent = "Nazwa";
    			th2 = element("th");
    			th2.textContent = "Link";
    			th3 = element("th");
    			th3.textContent = "Wyświetlaj";
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$b, 34, 16, 970);
    			add_location(th1, file$b, 34, 27, 981);
    			add_location(th2, file$b, 34, 41, 995);
    			add_location(th3, file$b, 34, 54, 1008);
    			add_location(tr, file$b, 34, 12, 966);
    			add_location(table, file$b, 33, 8, 945);
    			attr_dev(article, "class", "settingsBox");
    			add_location(article, file$b, 32, 4, 906);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, th1);
    			append_dev(tr, th2);
    			append_dev(tr, th3);
    			append_dev(table, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*console, changeShowFooter, settings, changeFooter*/ 1) {
    				each_value = /*settings*/ ctx[0].footer.main_footers;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function changeFooter$1(id, value) {
    	fetch('http://127.0.0.1:5000/changeMainFooter', {
    		headers: { 'Content-Type': 'application/json' },
    		method: 'POST',
    		body: JSON.stringify({ id, 'name': value })
    	}).then(window.location.reload(true));
    }

    function changeShowFooter$1(id, value) {
    	console.log(value);
    	let i = 0;
    	if (value == "on") i = 1;

    	fetch('http://127.0.0.1:5000/showMainFooter', {
    		headers: { 'Content-Type': 'application/json' },
    		method: 'POST',
    		body: JSON.stringify({ id, 'show': i })
    	}).then(window.location.reload(true));
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main_footers', slots, []);
    	let { settings } = $$props;
    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$9.warn(`<Main_footers> was created with unknown prop '${key}'`);
    	});

    	const change_handler = (footer, e) => {
    		console.log(e.target.value);
    		changeFooter$1(footer.id, e.target.value);
    	};

    	const change_handler_1 = (footer, e) => {
    		console.log(e.target.value);
    		changeShowFooter$1(footer.id, e.target);
    	};

    	const change_handler_2 = (footer, e) => {
    		console.log(e.target.value);
    		changeShowFooter$1(footer.id, e.target.value);
    	};

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({ settings, changeFooter: changeFooter$1, changeShowFooter: changeShowFooter$1 });

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [settings, change_handler, change_handler_1, change_handler_2];
    }

    class Main_footers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main_footers",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console_1$9.warn("<Main_footers> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Main_footers>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Main_footers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\admin_subpages\footer_pieces\social_media.svelte generated by Svelte v3.46.4 */

    const { console: console_1$8 } = globals;
    const file$a = "src\\subpages\\admin_subpages\\footer_pieces\\social_media.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (44:24) {:else }
    function create_else_block$3(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	function change_handler_2(...args) {
    		return /*change_handler_2*/ ctx[3](/*footer*/ ctx[4], ...args);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$a, 44, 24, 1649);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", change_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(44:24) {:else }",
    		ctx
    	});

    	return block;
    }

    // (42:24) {#if footer.show == 1}
    function create_if_block$4(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	function change_handler_1(...args) {
    		return /*change_handler_1*/ ctx[2](/*footer*/ ctx[4], ...args);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			input.checked = true;
    			add_location(input, file$a, 42, 24, 1472);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", change_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(42:24) {#if footer.show == 1}",
    		ctx
    	});

    	return block;
    }

    // (36:12) {#each settings.footer.social_media_footers as footer}
    function create_each_block$7(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*footer*/ ctx[4].id + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*footer*/ ctx[4].name + "";
    	let t2;
    	let t3;
    	let td2;
    	let input;
    	let input_value_value;
    	let t4;
    	let td3;
    	let t5;
    	let mounted;
    	let dispose;

    	function change_handler(...args) {
    		return /*change_handler*/ ctx[1](/*footer*/ ctx[4], ...args);
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*footer*/ ctx[4].show == 1) return create_if_block$4;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			input = element("input");
    			t4 = space();
    			td3 = element("td");
    			if_block.c();
    			t5 = space();
    			add_location(td0, file$a, 37, 20, 1148);
    			add_location(td1, file$a, 38, 20, 1190);
    			attr_dev(input, "type", "text");
    			input.value = input_value_value = /*footer*/ ctx[4].href;
    			add_location(input, file$a, 39, 24, 1238);
    			add_location(td2, file$a, 39, 20, 1234);
    			add_location(td3, file$a, 40, 20, 1394);
    			add_location(tr, file$a, 36, 16, 1122);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, input);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			if_block.m(td3, null);
    			append_dev(tr, t5);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", change_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*footer*/ ctx[4].id + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*settings*/ 1 && t2_value !== (t2_value = /*footer*/ ctx[4].name + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*settings*/ 1 && input_value_value !== (input_value_value = /*footer*/ ctx[4].href) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(td3, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(36:12) {#each settings.footer.social_media_footers as footer}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let article;
    	let table;
    	let tr;
    	let th0;
    	let th1;
    	let th2;
    	let th3;
    	let t4;
    	let each_value = /*settings*/ ctx[0].footer.social_media_footers;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			article = element("article");
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Id";
    			th1 = element("th");
    			th1.textContent = "Nazwa";
    			th2 = element("th");
    			th2.textContent = "Link";
    			th3 = element("th");
    			th3.textContent = "Wyświetlaj";
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$a, 34, 16, 974);
    			add_location(th1, file$a, 34, 27, 985);
    			add_location(th2, file$a, 34, 41, 999);
    			add_location(th3, file$a, 34, 54, 1012);
    			add_location(tr, file$a, 34, 12, 970);
    			add_location(table, file$a, 33, 8, 949);
    			attr_dev(article, "class", "settingsBox");
    			add_location(article, file$a, 32, 4, 910);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, th1);
    			append_dev(tr, th2);
    			append_dev(tr, th3);
    			append_dev(table, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*console, changeShowFooter, settings, changeFooter*/ 1) {
    				each_value = /*settings*/ ctx[0].footer.social_media_footers;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function changeFooter(id, value) {
    	fetch('http://127.0.0.1:5000/changeSocialFooter', {
    		headers: { 'Content-Type': 'application/json' },
    		method: 'POST',
    		body: JSON.stringify({ id, 'href': value })
    	}).then(window.location.reload(true));
    }

    function changeShowFooter(id, value) {
    	console.log(value);
    	let i = 0;
    	if (value == "on") i = 1;

    	fetch('http://127.0.0.1:5000/showSocialFooter', {
    		headers: { 'Content-Type': 'application/json' },
    		method: 'POST',
    		body: JSON.stringify({ id, 'show': i })
    	}).then(window.location.reload(true));
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Social_media', slots, []);
    	let { settings } = $$props;
    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<Social_media> was created with unknown prop '${key}'`);
    	});

    	const change_handler = (footer, e) => {
    		console.log(e.target.value);
    		changeFooter(footer.id, e.target.value);
    	};

    	const change_handler_1 = (footer, e) => {
    		console.log(e.target.value);
    		changeShowFooter(footer.id, e.target);
    	};

    	const change_handler_2 = (footer, e) => {
    		console.log(e.target.value);
    		changeShowFooter(footer.id, e.target.value);
    	};

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({ settings, changeFooter, changeShowFooter });

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [settings, change_handler, change_handler_1, change_handler_2];
    }

    class Social_media extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Social_media",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console_1$8.warn("<Social_media> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Social_media>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Social_media>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\admin_subpages\footer_pieces\rest.svelte generated by Svelte v3.46.4 */

    const { console: console_1$7 } = globals;
    const file$9 = "src\\subpages\\admin_subpages\\footer_pieces\\rest.svelte";

    function create_fragment$9(ctx) {
    	let article;
    	let t0;
    	let textarea0;
    	let textarea0_value_value;
    	let t1;
    	let textarea1;
    	let textarea1_value_value;
    	let t2;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			article = element("article");
    			t0 = text("Contact:\r\n        ");
    			textarea0 = element("textarea");
    			t1 = text("\r\n        Copyright:\r\n        ");
    			textarea1 = element("textarea");
    			t2 = space();
    			button = element("button");
    			button.textContent = "Zapisz";
    			attr_dev(textarea0, "cols", "30");
    			attr_dev(textarea0, "rows", "10");
    			set_style(textarea0, "max-width", "90%");
    			textarea0.value = textarea0_value_value = /*settings*/ ctx[0].footer.contact_footer.trim();
    			add_location(textarea0, file$9, 21, 8, 592);
    			attr_dev(textarea1, "cols", "30");
    			attr_dev(textarea1, "rows", "10");
    			set_style(textarea1, "max-width", "90%");
    			textarea1.value = textarea1_value_value = /*settings*/ ctx[0].footer.copyright;
    			add_location(textarea1, file$9, 23, 8, 746);
    			add_location(button, file$9, 24, 8, 870);
    			attr_dev(article, "class", "settingsBox");
    			add_location(article, file$9, 19, 4, 535);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, t0);
    			append_dev(article, textarea0);
    			/*textarea0_binding*/ ctx[4](textarea0);
    			append_dev(article, t1);
    			append_dev(article, textarea1);
    			/*textarea1_binding*/ ctx[5](textarea1);
    			append_dev(article, t2);
    			append_dev(article, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*settings*/ 1 && textarea0_value_value !== (textarea0_value_value = /*settings*/ ctx[0].footer.contact_footer.trim())) {
    				prop_dev(textarea0, "value", textarea0_value_value);
    			}

    			if (dirty & /*settings*/ 1 && textarea1_value_value !== (textarea1_value_value = /*settings*/ ctx[0].footer.copyright)) {
    				prop_dev(textarea1, "value", textarea1_value_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			/*textarea0_binding*/ ctx[4](null);
    			/*textarea1_binding*/ ctx[5](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Rest', slots, []);
    	let { settings } = $$props;
    	let contact;
    	let copyright;

    	function save() {
    		console.log(contact.value);
    		console.log(copyright.value);

    		let x = {
    			contact_footer: contact.value,
    			copyright: copyright.value
    		};

    		fetch('http://127.0.0.1:5000/changeFooter', {
    			headers: { 'Content-Type': 'application/json' },
    			method: 'POST',
    			body: JSON.stringify(x)
    		}).then(window.location.reload(true));
    	}

    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<Rest> was created with unknown prop '${key}'`);
    	});

    	function textarea0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			contact = $$value;
    			$$invalidate(1, contact);
    		});
    	}

    	function textarea1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			copyright = $$value;
    			$$invalidate(2, copyright);
    		});
    	}

    	const click_handler = () => save();

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({ settings, contact, copyright, save });

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('contact' in $$props) $$invalidate(1, contact = $$props.contact);
    		if ('copyright' in $$props) $$invalidate(2, copyright = $$props.copyright);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settings,
    		contact,
    		copyright,
    		save,
    		textarea0_binding,
    		textarea1_binding,
    		click_handler
    	];
    }

    class Rest extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Rest",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console_1$7.warn("<Rest> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Rest>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Rest>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\admin_subpages\footer.svelte generated by Svelte v3.46.4 */
    const file$8 = "src\\subpages\\admin_subpages\\footer.svelte";

    function create_fragment$8(ctx) {
    	let header;
    	let t0;
    	let article;
    	let main;
    	let t1;
    	let social;
    	let t2;
    	let rest;
    	let current;
    	header = new Header({ $$inline: true });

    	main = new Main_footers({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	social = new Social_media({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	rest = new Rest({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			article = element("article");
    			create_component(main.$$.fragment);
    			t1 = space();
    			create_component(social.$$.fragment);
    			t2 = space();
    			create_component(rest.$$.fragment);
    			attr_dev(article, "class", "settingsBox");
    			add_location(article, file$8, 9, 4, 284);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, article, anchor);
    			mount_component(main, article, null);
    			append_dev(article, t1);
    			mount_component(social, article, null);
    			append_dev(article, t2);
    			mount_component(rest, article, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const main_changes = {};
    			if (dirty & /*settings*/ 1) main_changes.settings = /*settings*/ ctx[0];
    			main.$set(main_changes);
    			const social_changes = {};
    			if (dirty & /*settings*/ 1) social_changes.settings = /*settings*/ ctx[0];
    			social.$set(social_changes);
    			const rest_changes = {};
    			if (dirty & /*settings*/ 1) rest_changes.settings = /*settings*/ ctx[0];
    			rest.$set(rest_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(main.$$.fragment, local);
    			transition_in(social.$$.fragment, local);
    			transition_in(rest.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(main.$$.fragment, local);
    			transition_out(social.$$.fragment, local);
    			transition_out(rest.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(article);
    			destroy_component(main);
    			destroy_component(social);
    			destroy_component(rest);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	let { settings } = $$props;
    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({ Header, Main: Main_footers, Social: Social_media, Rest, settings });

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [settings];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console.warn("<Footer> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\admin_subpages\header_pieces\main_headers.svelte generated by Svelte v3.46.4 */

    const { console: console_1$6 } = globals;
    const file$7 = "src\\subpages\\admin_subpages\\header_pieces\\main_headers.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (44:24) {:else }
    function create_else_block$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	function change_handler_2(...args) {
    		return /*change_handler_2*/ ctx[3](/*header*/ ctx[4], ...args);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$7, 44, 24, 1638);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", change_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(44:24) {:else }",
    		ctx
    	});

    	return block;
    }

    // (42:24) {#if header.show == 1}
    function create_if_block$3(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	function change_handler_1(...args) {
    		return /*change_handler_1*/ ctx[2](/*header*/ ctx[4], ...args);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			input.checked = true;
    			add_location(input, file$7, 42, 24, 1461);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", change_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(42:24) {#if header.show == 1}",
    		ctx
    	});

    	return block;
    }

    // (36:12) {#each settings.headers.main_headers as header}
    function create_each_block$6(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*header*/ ctx[4].id + "";
    	let t0;
    	let t1;
    	let td1;
    	let input;
    	let input_value_value;
    	let t2;
    	let td2;
    	let t3_value = /*header*/ ctx[4].href + "";
    	let t3;
    	let t4;
    	let td3;
    	let t5;
    	let mounted;
    	let dispose;

    	function change_handler(...args) {
    		return /*change_handler*/ ctx[1](/*header*/ ctx[4], ...args);
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*header*/ ctx[4].show == 1) return create_if_block$3;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			input = element("input");
    			t2 = space();
    			td2 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td3 = element("td");
    			if_block.c();
    			t5 = space();
    			add_location(td0, file$7, 37, 20, 1137);
    			attr_dev(input, "type", "text");
    			input.value = input_value_value = /*header*/ ctx[4].name;
    			add_location(input, file$7, 38, 24, 1183);
    			add_location(td1, file$7, 38, 20, 1179);
    			add_location(td2, file$7, 39, 20, 1339);
    			add_location(td3, file$7, 40, 20, 1383);
    			add_location(tr, file$7, 36, 16, 1111);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, input);
    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			if_block.m(td3, null);
    			append_dev(tr, t5);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", change_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*header*/ ctx[4].id + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*settings*/ 1 && input_value_value !== (input_value_value = /*header*/ ctx[4].name) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty & /*settings*/ 1 && t3_value !== (t3_value = /*header*/ ctx[4].href + "")) set_data_dev(t3, t3_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(td3, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(36:12) {#each settings.headers.main_headers as header}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let article;
    	let table;
    	let tr;
    	let th0;
    	let th1;
    	let th2;
    	let th3;
    	let t4;
    	let each_value = /*settings*/ ctx[0].headers.main_headers;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			article = element("article");
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Id";
    			th1 = element("th");
    			th1.textContent = "Nazwa";
    			th2 = element("th");
    			th2.textContent = "Link";
    			th3 = element("th");
    			th3.textContent = "Wyświetlaj";
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$7, 34, 16, 970);
    			add_location(th1, file$7, 34, 27, 981);
    			add_location(th2, file$7, 34, 41, 995);
    			add_location(th3, file$7, 34, 54, 1008);
    			add_location(tr, file$7, 34, 12, 966);
    			add_location(table, file$7, 33, 8, 945);
    			attr_dev(article, "class", "settingsBox");
    			add_location(article, file$7, 32, 4, 906);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, th1);
    			append_dev(tr, th2);
    			append_dev(tr, th3);
    			append_dev(table, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*console, changeShowheader, settings, changeheader*/ 1) {
    				each_value = /*settings*/ ctx[0].headers.main_headers;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function changeheader(id, value) {
    	fetch('http://127.0.0.1:5000/changeMainHeader', {
    		headers: { 'Content-Type': 'application/json' },
    		method: 'POST',
    		body: JSON.stringify({ id, 'name': value })
    	}).then(window.location.reload(true));
    }

    function changeShowheader(id, value) {
    	console.log(value);
    	let i = 0;
    	if (value == "on") i = 1;

    	fetch('http://127.0.0.1:5000/showMainHeader', {
    		headers: { 'Content-Type': 'application/json' },
    		method: 'POST',
    		body: JSON.stringify({ id, 'show': i })
    	}).then(window.location.reload(true));
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main_headers', slots, []);
    	let { settings } = $$props;
    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<Main_headers> was created with unknown prop '${key}'`);
    	});

    	const change_handler = (header, e) => {
    		console.log(e.target.value);
    		changeheader(header.id, e.target.value);
    	};

    	const change_handler_1 = (header, e) => {
    		console.log(e.target.value);
    		changeShowheader(header.id, e.target);
    	};

    	const change_handler_2 = (header, e) => {
    		console.log(e.target.value);
    		changeShowheader(header.id, e.target.value);
    	};

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({ settings, changeheader, changeShowheader });

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [settings, change_handler, change_handler_1, change_handler_2];
    }

    class Main_headers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main_headers",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console_1$6.warn("<Main_headers> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Main_headers>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Main_headers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\admin_subpages\header_pieces\additional_headers.svelte generated by Svelte v3.46.4 */

    const { console: console_1$5 } = globals;
    const file$6 = "src\\subpages\\admin_subpages\\header_pieces\\additional_headers.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (79:12) {#each settings.headers.additional_headers as header}
    function create_each_block$5(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*header*/ ctx[2].id + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*header*/ ctx[2].name + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*header*/ ctx[2].href + "";
    	let t4;
    	let t5;
    	let td3;
    	let button0;
    	let t7;
    	let td4;
    	let button1;
    	let t9;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*header*/ ctx[2]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[8](/*header*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			button0 = element("button");
    			button0.textContent = "Edytuj";
    			t7 = space();
    			td4 = element("td");
    			button1 = element("button");
    			button1.textContent = "Usuń";
    			t9 = space();
    			add_location(td0, file$6, 80, 20, 2318);
    			add_location(td1, file$6, 81, 20, 2360);
    			add_location(td2, file$6, 82, 20, 2404);
    			attr_dev(button0, "class", "edit");
    			add_location(button0, file$6, 83, 24, 2452);
    			add_location(td3, file$6, 83, 20, 2448);
    			attr_dev(button1, "class", "edit");
    			add_location(button1, file$6, 84, 24, 2586);
    			add_location(td4, file$6, 84, 20, 2582);
    			add_location(tr, file$6, 79, 16, 2292);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, button0);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, button1);
    			append_dev(tr, t9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*header*/ ctx[2].id + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*settings*/ 1 && t2_value !== (t2_value = /*header*/ ctx[2].name + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*settings*/ 1 && t4_value !== (t4_value = /*header*/ ctx[2].href + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(79:12) {#each settings.headers.additional_headers as header}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let article;
    	let table;
    	let tr;
    	let th0;
    	let th1;
    	let th2;
    	let th3;
    	let th4;
    	let t5;
    	let t6;
    	let div;
    	let t7;
    	let input0;
    	let t8;
    	let input1;
    	let t9;
    	let button0;
    	let t11;
    	let dialog_1;
    	let t12;
    	let button1;
    	let t14;
    	let button2;
    	let mounted;
    	let dispose;
    	let each_value = /*settings*/ ctx[0].headers.additional_headers;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			article = element("article");
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Id";
    			th1 = element("th");
    			th1.textContent = "Tytuł";
    			th2 = element("th");
    			th2.textContent = "Link";
    			th3 = element("th");
    			th3.textContent = "Edycja";
    			th4 = element("th");
    			th4.textContent = "Usuwanie";
    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			div = element("div");
    			t7 = text("name");
    			input0 = element("input");
    			t8 = text("\r\n            href");
    			input1 = element("input");
    			t9 = space();
    			button0 = element("button");
    			button0.textContent = "Save";
    			t11 = space();
    			dialog_1 = element("dialog");
    			t12 = text("Czy na pewno usunąć?\r\n            ");
    			button1 = element("button");
    			button1.textContent = "Tak";
    			t14 = space();
    			button2 = element("button");
    			button2.textContent = "Nie";
    			add_location(th0, file$6, 77, 16, 2132);
    			add_location(th1, file$6, 77, 27, 2143);
    			add_location(th2, file$6, 77, 41, 2157);
    			add_location(th3, file$6, 77, 54, 2170);
    			add_location(th4, file$6, 77, 69, 2185);
    			add_location(tr, file$6, 77, 12, 2128);
    			add_location(table, file$6, 76, 8, 2107);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$6, 89, 16, 2757);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$6, 90, 16, 2821);
    			add_location(button0, file$6, 91, 12, 2881);
    			add_location(div, file$6, 88, 8, 2734);
    			add_location(button1, file$6, 95, 12, 3029);
    			add_location(button2, file$6, 96, 12, 3097);
    			add_location(dialog_1, file$6, 93, 8, 2952);
    			attr_dev(article, "class", "settingsBox");
    			add_location(article, file$6, 75, 4, 2068);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, th1);
    			append_dev(tr, th2);
    			append_dev(tr, th3);
    			append_dev(tr, th4);
    			append_dev(table, t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			append_dev(article, t6);
    			append_dev(article, div);
    			append_dev(div, t7);
    			append_dev(div, input0);
    			set_input_value(input0, /*header*/ ctx[2].name);
    			append_dev(div, t8);
    			append_dev(div, input1);
    			set_input_value(input1, /*header*/ ctx[2].href);
    			append_dev(div, t9);
    			append_dev(div, button0);
    			append_dev(article, t11);
    			append_dev(article, dialog_1);
    			append_dev(dialog_1, t12);
    			append_dev(dialog_1, button1);
    			append_dev(dialog_1, t14);
    			append_dev(dialog_1, button2);
    			/*dialog_1_binding*/ ctx[14](dialog_1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(button0, "click", /*click_handler_2*/ ctx[11], false, false, false),
    					listen_dev(button1, "click", /*click_handler_3*/ ctx[12], false, false, false),
    					listen_dev(button2, "click", /*click_handler_4*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*remove, settings, edit_prepare*/ 25) {
    				each_value = /*settings*/ ctx[0].headers.additional_headers;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*header*/ 4 && input0.value !== /*header*/ ctx[2].name) {
    				set_input_value(input0, /*header*/ ctx[2].name);
    			}

    			if (dirty & /*header*/ 4 && input1.value !== /*header*/ ctx[2].href) {
    				set_input_value(input1, /*header*/ ctx[2].href);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    			/*dialog_1_binding*/ ctx[14](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Additional_headers', slots, []);
    	let { settings } = $$props;
    	let edit = false;
    	let header = { "name": "", "href": "" };
    	let editing = -1;
    	let desintegrator = -1;
    	let dialog;

    	function edit_prepare(x, y, z) {
    		editing = x;
    		edit = true;
    		$$invalidate(2, header.name = y, header);
    		$$invalidate(2, header.href = z, header);
    	}

    	function remove(x) {
    		desintegrator = x;
    		dialog.showModal();
    	}

    	function desintegrate() {
    		fetch("http://127.0.0.1:5000/deleteHeader", {
    			headers: { 'Content-Type': 'application/json' },
    			method: 'POST',
    			body: JSON.stringify({ 'id': desintegrator.toString() })
    		}).then(() => {
    			dialog.close();
    			window.location.reload(true);
    		});
    	}

    	function save() {
    		if (edit) {
    			fetch('http://127.0.0.1:5000/changeHeader', {
    				headers: { 'Content-Type': 'application/json' },
    				method: 'POST',
    				body: JSON.stringify({
    					'id': editing.toString(),
    					'name': header.name,
    					'href': header.href
    				})
    			}).then(data => data.json()).then(data => {
    				window.location.reload(true);
    			});
    		} else {
    			console.log(header);

    			fetch('http://127.0.0.1:5000/addHeader', {
    				headers: { 'Content-Type': 'application/json' },
    				method: 'POST',
    				body: JSON.stringify({
    					'id': settings.headers.additional_headers[settings.headers.additional_headers.length - 1].id + 1,
    					'name': header.name,
    					'href': header.href
    				})
    			}).then(data => data.json()).then(data => {
    				console.log(data);
    				window.location.reload(true);
    			});
    		}

    		editing = false;
    		$$invalidate(2, header = { "name": "", "href": "" });
    	}

    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<Additional_headers> was created with unknown prop '${key}'`);
    	});

    	const click_handler = header => {
    		edit_prepare(header.id, header.name, header.href);
    	};

    	const click_handler_1 = header => {
    		remove(header.id);
    	};

    	function input0_input_handler() {
    		header.name = this.value;
    		$$invalidate(2, header);
    	}

    	function input1_input_handler() {
    		header.href = this.value;
    		$$invalidate(2, header);
    	}

    	const click_handler_2 = () => save();

    	const click_handler_3 = () => {
    		desintegrate();
    	};

    	const click_handler_4 = () => {
    		dialog.close();
    	};

    	function dialog_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			dialog = $$value;
    			$$invalidate(1, dialog);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({
    		settings,
    		edit,
    		header,
    		editing,
    		desintegrator,
    		dialog,
    		edit_prepare,
    		remove,
    		desintegrate,
    		save
    	});

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('edit' in $$props) edit = $$props.edit;
    		if ('header' in $$props) $$invalidate(2, header = $$props.header);
    		if ('editing' in $$props) editing = $$props.editing;
    		if ('desintegrator' in $$props) desintegrator = $$props.desintegrator;
    		if ('dialog' in $$props) $$invalidate(1, dialog = $$props.dialog);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settings,
    		dialog,
    		header,
    		edit_prepare,
    		remove,
    		desintegrate,
    		save,
    		click_handler,
    		click_handler_1,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		dialog_1_binding
    	];
    }

    class Additional_headers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Additional_headers",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console_1$5.warn("<Additional_headers> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Additional_headers>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Additional_headers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\admin_subpages\menu.svelte generated by Svelte v3.46.4 */
    const file$5 = "src\\subpages\\admin_subpages\\menu.svelte";

    function create_fragment$5(ctx) {
    	let header;
    	let t0;
    	let article;
    	let main;
    	let t1;
    	let other;
    	let current;
    	header = new Header({ $$inline: true });

    	main = new Main_headers({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	other = new Additional_headers({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			article = element("article");
    			create_component(main.$$.fragment);
    			t1 = space();
    			create_component(other.$$.fragment);
    			attr_dev(article, "class", "settingsBox");
    			add_location(article, file$5, 8, 4, 237);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, article, anchor);
    			mount_component(main, article, null);
    			append_dev(article, t1);
    			mount_component(other, article, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const main_changes = {};
    			if (dirty & /*settings*/ 1) main_changes.settings = /*settings*/ ctx[0];
    			main.$set(main_changes);
    			const other_changes = {};
    			if (dirty & /*settings*/ 1) other_changes.settings = /*settings*/ ctx[0];
    			other.$set(other_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(main.$$.fragment, local);
    			transition_in(other.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(main.$$.fragment, local);
    			transition_out(other.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(article);
    			destroy_component(main);
    			destroy_component(other);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	let { settings } = $$props;
    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({ Header, Main: Main_headers, Other: Additional_headers, settings });

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [settings];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console.warn("<Menu> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\admin_subpages\settings.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1, console: console_1$4 } = globals;
    const file$4 = "src\\subpages\\admin_subpages\\settings.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i][0];
    	child_ctx[19] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    // (78:12) {#each mainSettings as set}
    function create_each_block_1$1(ctx) {
    	let option;
    	let t_value = /*set*/ ctx[22].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*set*/ ctx[22].id;
    			option.value = option.__value;
    			add_location(option, file$4, 78, 16, 2379);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*mainSettings*/ 2 && t_value !== (t_value = /*set*/ ctx[22].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*mainSettings*/ 2 && option_value_value !== (option_value_value = /*set*/ ctx[22].id)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(78:12) {#each mainSettings as set}",
    		ctx
    	});

    	return block;
    }

    // (99:12) {:else}
    function create_else_block$1(ctx) {
    	let tr;
    	let td0;
    	let t_value = /*setting*/ ctx[18] + "";
    	let t;
    	let td1;
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	function input_handler_6(...args) {
    		return /*input_handler_6*/ ctx[15](/*value*/ ctx[19], /*setting*/ ctx[18], ...args);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t = text(t_value);
    			td1 = element("td");
    			input = element("input");
    			add_location(td0, file$4, 99, 16, 4459);
    			attr_dev(input, "type", "text");
    			input.value = input_value_value = /*value*/ ctx[19];
    			add_location(input, file$4, 99, 38, 4481);
    			add_location(td1, file$4, 99, 34, 4477);
    			add_location(tr, file$4, 99, 12, 4455);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t);
    			append_dev(tr, td1);
    			append_dev(td1, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_handler_6, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*mainSettings, select*/ 6 && t_value !== (t_value = /*setting*/ ctx[18] + "")) set_data_dev(t, t_value);

    			if (dirty & /*mainSettings, select*/ 6 && input_value_value !== (input_value_value = /*value*/ ctx[19]) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(99:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (97:46) 
    function create_if_block_6$1(ctx) {
    	let tr;
    	let td0;
    	let t_value = /*setting*/ ctx[18] + "";
    	let t;
    	let td1;
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	function input_handler_5(...args) {
    		return /*input_handler_5*/ ctx[14](/*value*/ ctx[19], /*setting*/ ctx[18], ...args);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t = text(t_value);
    			td1 = element("td");
    			input = element("input");
    			add_location(td0, file$4, 97, 16, 4225);
    			attr_dev(input, "type", "number");
    			input.value = input_value_value = /*value*/ ctx[19];
    			attr_dev(input, "min", "0");
    			attr_dev(input, "max", "1");
    			add_location(input, file$4, 97, 38, 4247);
    			add_location(td1, file$4, 97, 34, 4243);
    			add_location(tr, file$4, 97, 12, 4221);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t);
    			append_dev(tr, td1);
    			append_dev(td1, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_handler_5, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*mainSettings, select*/ 6 && t_value !== (t_value = /*setting*/ ctx[18] + "")) set_data_dev(t, t_value);

    			if (dirty & /*mainSettings, select*/ 6 && input_value_value !== (input_value_value = /*value*/ ctx[19]) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(97:46) ",
    		ctx
    	});

    	return block;
    }

    // (95:79) 
    function create_if_block_5$1(ctx) {
    	let tr;
    	let td0;
    	let t_value = /*setting*/ ctx[18] + "";
    	let t;
    	let td1;
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	function input_handler_4(...args) {
    		return /*input_handler_4*/ ctx[13](/*value*/ ctx[19], /*setting*/ ctx[18], ...args);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t = text(t_value);
    			td1 = element("td");
    			input = element("input");
    			add_location(td0, file$4, 95, 16, 3972);
    			attr_dev(input, "type", "number");
    			input.value = input_value_value = /*value*/ ctx[19];
    			attr_dev(input, "min", "0");
    			add_location(input, file$4, 95, 38, 3994);
    			add_location(td1, file$4, 95, 34, 3990);
    			add_location(tr, file$4, 95, 12, 3968);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t);
    			append_dev(tr, td1);
    			append_dev(td1, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_handler_4, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*mainSettings, select*/ 6 && t_value !== (t_value = /*setting*/ ctx[18] + "")) set_data_dev(t, t_value);

    			if (dirty & /*mainSettings, select*/ 6 && input_value_value !== (input_value_value = /*value*/ ctx[19]) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(95:79) ",
    		ctx
    	});

    	return block;
    }

    // (93:56) 
    function create_if_block_4$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*setting*/ ctx[18] + "";
    	let t0;
    	let td1;
    	let input;
    	let input_value_value;
    	let input_max_value;
    	let t1_value = /*value*/ ctx[19] + "";
    	let t1;
    	let mounted;
    	let dispose;

    	function input_handler_3(...args) {
    		return /*input_handler_3*/ ctx[12](/*value*/ ctx[19], /*setting*/ ctx[18], ...args);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			td1 = element("td");
    			input = element("input");
    			t1 = text(t1_value);
    			add_location(td0, file$4, 93, 16, 3646);
    			attr_dev(input, "type", "range");
    			input.value = input_value_value = /*value*/ ctx[19];
    			attr_dev(input, "min", "1");
    			attr_dev(input, "max", input_max_value = /*settings*/ ctx[0].comments.length);
    			add_location(input, file$4, 93, 38, 3668);
    			add_location(td1, file$4, 93, 34, 3664);
    			add_location(tr, file$4, 93, 12, 3642);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, td1);
    			append_dev(td1, input);
    			append_dev(td1, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_handler_3, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*mainSettings, select*/ 6 && t0_value !== (t0_value = /*setting*/ ctx[18] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*mainSettings, select*/ 6 && input_value_value !== (input_value_value = /*value*/ ctx[19])) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty & /*settings*/ 1 && input_max_value !== (input_max_value = /*settings*/ ctx[0].comments.length)) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty & /*mainSettings, select*/ 6 && t1_value !== (t1_value = /*value*/ ctx[19] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(93:56) ",
    		ctx
    	});

    	return block;
    }

    // (91:54) 
    function create_if_block_3$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*setting*/ ctx[18] + "";
    	let t0;
    	let td1;
    	let input;
    	let input_value_value;
    	let input_max_value;
    	let t1_value = /*value*/ ctx[19] + "";
    	let t1;
    	let mounted;
    	let dispose;

    	function input_handler_2(...args) {
    		return /*input_handler_2*/ ctx[11](/*value*/ ctx[19], /*setting*/ ctx[18], ...args);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			td1 = element("td");
    			input = element("input");
    			t1 = text(t1_value);
    			add_location(td0, file$4, 91, 16, 3335);
    			attr_dev(input, "type", "range");
    			input.value = input_value_value = /*value*/ ctx[19];
    			attr_dev(input, "min", "1");
    			attr_dev(input, "step", "2");
    			attr_dev(input, "max", input_max_value = /*settings*/ ctx[0].gallery.length);
    			add_location(input, file$4, 91, 38, 3357);
    			add_location(td1, file$4, 91, 34, 3353);
    			add_location(tr, file$4, 91, 12, 3331);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, td1);
    			append_dev(td1, input);
    			append_dev(td1, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*mainSettings, select*/ 6 && t0_value !== (t0_value = /*setting*/ ctx[18] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*mainSettings, select*/ 6 && input_value_value !== (input_value_value = /*value*/ ctx[19])) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty & /*settings*/ 1 && input_max_value !== (input_max_value = /*settings*/ ctx[0].gallery.length)) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty & /*mainSettings, select*/ 6 && t1_value !== (t1_value = /*value*/ ctx[19] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(91:54) ",
    		ctx
    	});

    	return block;
    }

    // (89:56) 
    function create_if_block_2$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*setting*/ ctx[18] + "";
    	let t0;
    	let td1;
    	let input;
    	let input_value_value;
    	let input_max_value;
    	let t1_value = /*value*/ ctx[19] + "";
    	let t1;
    	let mounted;
    	let dispose;

    	function input_handler_1(...args) {
    		return /*input_handler_1*/ ctx[10](/*value*/ ctx[19], /*setting*/ ctx[18], ...args);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			td1 = element("td");
    			input = element("input");
    			t1 = text(t1_value);
    			add_location(td0, file$4, 89, 16, 3034);
    			attr_dev(input, "type", "range");
    			input.value = input_value_value = /*value*/ ctx[19];
    			attr_dev(input, "min", "1");
    			attr_dev(input, "max", input_max_value = /*settings*/ ctx[0].articles.length);
    			add_location(input, file$4, 89, 38, 3056);
    			add_location(td1, file$4, 89, 34, 3052);
    			add_location(tr, file$4, 89, 12, 3030);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, td1);
    			append_dev(td1, input);
    			append_dev(td1, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*mainSettings, select*/ 6 && t0_value !== (t0_value = /*setting*/ ctx[18] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*mainSettings, select*/ 6 && input_value_value !== (input_value_value = /*value*/ ctx[19])) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty & /*settings*/ 1 && input_max_value !== (input_max_value = /*settings*/ ctx[0].articles.length)) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty & /*mainSettings, select*/ 6 && t1_value !== (t1_value = /*value*/ ctx[19] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(89:56) ",
    		ctx
    	});

    	return block;
    }

    // (87:36) 
    function create_if_block_1$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*setting*/ ctx[18] + "";
    	let t0;
    	let td1;
    	let t1_value = /*value*/ ctx[19] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			td1 = element("td");
    			t1 = text(t1_value);
    			add_location(td0, file$4, 87, 16, 2919);
    			add_location(td1, file$4, 87, 34, 2937);
    			add_location(tr, file$4, 87, 12, 2915);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, td1);
    			append_dev(td1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*mainSettings, select*/ 6 && t0_value !== (t0_value = /*setting*/ ctx[18] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*mainSettings, select*/ 6 && t1_value !== (t1_value = /*value*/ ctx[19] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(87:36) ",
    		ctx
    	});

    	return block;
    }

    // (85:12) {#if setting.includes("color")}
    function create_if_block$2(ctx) {
    	let tr;
    	let td0;
    	let t_value = /*setting*/ ctx[18] + "";
    	let t;
    	let td1;
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	function input_handler(...args) {
    		return /*input_handler*/ ctx[9](/*value*/ ctx[19], /*setting*/ ctx[18], ...args);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t = text(t_value);
    			td1 = element("td");
    			input = element("input");
    			add_location(td0, file$4, 85, 16, 2685);
    			attr_dev(input, "type", "color");
    			input.value = input_value_value = /*value*/ ctx[19];
    			add_location(input, file$4, 85, 38, 2707);
    			add_location(td1, file$4, 85, 34, 2703);
    			add_location(tr, file$4, 85, 12, 2681);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t);
    			append_dev(tr, td1);
    			append_dev(td1, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*mainSettings, select*/ 6 && t_value !== (t_value = /*setting*/ ctx[18] + "")) set_data_dev(t, t_value);

    			if (dirty & /*mainSettings, select*/ 6 && input_value_value !== (input_value_value = /*value*/ ctx[19])) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(85:12) {#if setting.includes(\\\"color\\\")}",
    		ctx
    	});

    	return block;
    }

    // (84:12) {#each Object.entries(mainSettings[select]) as [setting, value]}
    function create_each_block$4(ctx) {
    	let show_if;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*mainSettings, select*/ 6) show_if = null;
    		if (show_if == null) show_if = !!/*setting*/ ctx[18].includes("color");
    		if (show_if) return create_if_block$2;
    		if (/*setting*/ ctx[18] == 'id') return create_if_block_1$1;
    		if (/*setting*/ ctx[18] == "articles_module_amount") return create_if_block_2$1;
    		if (/*setting*/ ctx[18] == "gallery_minis_amount") return create_if_block_3$1;
    		if (/*setting*/ ctx[18] == "comments_module_amount") return create_if_block_4$1;
    		if (/*setting*/ ctx[18] == "burger_menu_show" || /*setting*/ ctx[18] == "slide_duration") return create_if_block_5$1;
    		if (/*setting*/ ctx[18] == "menu_version") return create_if_block_6$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(84:12) {#each Object.entries(mainSettings[select]) as [setting, value]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let header;
    	let t0;
    	let article;
    	let select_1;
    	let t1;
    	let table;
    	let tr;
    	let th0;
    	let th1;
    	let t4;
    	let t5;
    	let button0;
    	let t7;
    	let input;
    	let t8;
    	let button1;
    	let t10;
    	let button2;
    	let current;
    	let mounted;
    	let dispose;
    	header = new Header({ $$inline: true });
    	let each_value_1 = /*mainSettings*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = Object.entries(/*mainSettings*/ ctx[1][/*select*/ ctx[2]]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			article = element("article");
    			select_1 = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Nazwa parametru";
    			th1 = element("th");
    			th1.textContent = "Parametr";
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			button0 = element("button");
    			button0.textContent = "Zapisz";
    			t7 = space();
    			input = element("input");
    			t8 = space();
    			button1 = element("button");
    			button1.textContent = "Import";
    			t10 = space();
    			button2 = element("button");
    			button2.textContent = "Eksport";
    			if (/*select*/ ctx[2] === void 0) add_render_callback(() => /*select_1_change_handler*/ ctx[7].call(select_1));
    			add_location(select_1, file$4, 73, 8, 2200);
    			add_location(th0, file$4, 82, 16, 2498);
    			add_location(th1, file$4, 82, 40, 2522);
    			add_location(tr, file$4, 82, 12, 2494);
    			add_location(table, file$4, 81, 8, 2473);
    			add_location(button0, file$4, 104, 8, 4718);
    			attr_dev(input, "id", "file");
    			attr_dev(input, "type", "file");
    			add_location(input, file$4, 105, 8, 4785);
    			add_location(button1, file$4, 106, 8, 4824);
    			add_location(button2, file$4, 107, 8, 4886);
    			attr_dev(article, "class", "settingsBox");
    			add_location(article, file$4, 72, 4, 2161);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, article, anchor);
    			append_dev(article, select_1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select_1, null);
    			}

    			select_option(select_1, /*select*/ ctx[2]);
    			append_dev(article, t1);
    			append_dev(article, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, th1);
    			append_dev(table, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			append_dev(article, t5);
    			append_dev(article, button0);
    			append_dev(article, t7);
    			append_dev(article, input);
    			append_dev(article, t8);
    			append_dev(article, button1);
    			append_dev(article, t10);
    			append_dev(article, button2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select_1, "change", /*select_1_change_handler*/ ctx[7]),
    					listen_dev(select_1, "change", /*change_handler*/ ctx[8], false, false, false),
    					listen_dev(button0, "click", /*click_handler*/ ctx[16], false, false, false),
    					listen_dev(button1, "click", /*importJsonFile*/ ctx[6], false, false, false),
    					listen_dev(button2, "click", /*click_handler_1*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*mainSettings*/ 2) {
    				each_value_1 = /*mainSettings*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select_1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*select, mainSettings*/ 6) {
    				select_option(select_1, /*select*/ ctx[2]);
    			}

    			if (dirty & /*Object, mainSettings, select, console, settings*/ 7) {
    				each_value = Object.entries(/*mainSettings*/ ctx[1][/*select*/ ctx[2]]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Settings', slots, []);
    	let { settings } = $$props;

    	let mainSettings = [
    		{ "set": "s", "id": "boob" },
    		{ "set": "s", "id": "boob" },
    		{ "set": "s", "id": "boob" },
    		{ "set": "s", "id": "boob" },
    		{ "set": "s", "id": "boob" }
    	];

    	let select = settings.setter;

    	fetch("http://127.0.0.1:5000/getAllSettings").then(data => data.json()).then(data => {
    		console.log(data);
    		$$invalidate(1, mainSettings = data.settings);
    		$$invalidate(2, select = data.select);
    	});

    	function saveSettings() {
    		fetch('http://127.0.0.1:5000/saveSettings', {
    			headers: { 'Content-Type': 'application/json' },
    			method: 'POST',
    			body: JSON.stringify({ 'setting': JSON.stringify(mainSettings) })
    		}).then(window.location.reload(true));
    	}

    	function changeSelect() {
    		$$invalidate(0, settings.setter = select, settings);

    		fetch('http://127.0.0.1:5000/changeSelect', {
    			method: 'POST',
    			body: JSON.stringify({ select }),
    			headers: { 'Content-Type': 'application/json' }
    		}).then(window.location.reload(true));
    	}

    	function exportToJsonFile() {
    		let dataStr = JSON.stringify(mainSettings[select]);
    		let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    		let exportFileDefaultName = 'settings.json';
    		let linkElement = document.createElement('a');
    		linkElement.setAttribute('href', dataUri);
    		linkElement.setAttribute('download', exportFileDefaultName);
    		linkElement.click();
    	}

    	function importJsonFile(e) {
    		let files = document.getElementById('file').files;
    		let f = files[0];
    		let reader = new FileReader();

    		reader.onload = () => {
    			console.log(reader);
    			let json = JSON.parse(reader.result);
    			mainSettings.push(json);
    			$$invalidate(1, mainSettings[mainSettings.length - 1].id = mainSettings.length - 1, mainSettings);
    			saveSettings();
    		};

    		reader.readAsText(f);
    	}

    	const writable_props = ['settings'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	function select_1_change_handler() {
    		select = select_value(this);
    		$$invalidate(2, select);
    		$$invalidate(1, mainSettings);
    	}

    	const change_handler = () => {
    		console.log(select);
    		changeSelect();
    	};

    	const input_handler = (value, setting, e) => {
    		console.log(value);
    		console.log(e.target.value);
    		$$invalidate(1, mainSettings[select][setting] = e.target.value, mainSettings);
    	};

    	const input_handler_1 = (value, setting, e) => {
    		console.log(value);
    		console.log(e.target.value);
    		$$invalidate(1, mainSettings[select][setting] = e.target.value, mainSettings);
    	};

    	const input_handler_2 = (value, setting, e) => {
    		console.log(value);
    		console.log(e.target.value);
    		$$invalidate(1, mainSettings[select][setting] = e.target.value, mainSettings);
    	};

    	const input_handler_3 = (value, setting, e) => {
    		console.log(value);
    		console.log(e.target.value);
    		$$invalidate(1, mainSettings[select][setting] = e.target.value, mainSettings);
    	};

    	const input_handler_4 = (value, setting, e) => {
    		console.log(value);
    		console.log(e.target.value);
    		$$invalidate(1, mainSettings[select][setting] = e.target.value, mainSettings);
    	};

    	const input_handler_5 = (value, setting, e) => {
    		console.log(value);
    		console.log(e.target.value);
    		$$invalidate(1, mainSettings[select][setting] = e.target.value, mainSettings);
    	};

    	const input_handler_6 = (value, setting, e) => {
    		console.log(value);
    		console.log(e.target.value);
    		$$invalidate(1, mainSettings[select][setting] = e.target.value, mainSettings);
    	};

    	const click_handler = () => {
    		saveSettings();
    	};

    	const click_handler_1 = () => {
    		exportToJsonFile();
    	};

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		onMount,
    		settings,
    		mainSettings,
    		select,
    		saveSettings,
    		changeSelect,
    		exportToJsonFile,
    		importJsonFile
    	});

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('mainSettings' in $$props) $$invalidate(1, mainSettings = $$props.mainSettings);
    		if ('select' in $$props) $$invalidate(2, select = $$props.select);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settings,
    		mainSettings,
    		select,
    		saveSettings,
    		changeSelect,
    		exportToJsonFile,
    		importJsonFile,
    		select_1_change_handler,
    		change_handler,
    		input_handler,
    		input_handler_1,
    		input_handler_2,
    		input_handler_3,
    		input_handler_4,
    		input_handler_5,
    		input_handler_6,
    		click_handler,
    		click_handler_1
    	];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console_1$4.warn("<Settings> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Settings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Settings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\admin_subpages\slider.svelte generated by Svelte v3.46.4 */

    const { console: console_1$3 } = globals;
    const file$3 = "src\\subpages\\admin_subpages\\slider.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (83:12) {#each settings.slider as slide}
    function create_each_block$3(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*slide*/ ctx[2].id + "";
    	let t0;
    	let t1;
    	let td1;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t2;
    	let td2;
    	let t3_value = /*slide*/ ctx[2].name + "";
    	let t3;
    	let t4;
    	let td3;
    	let button0;
    	let t6;
    	let td4;
    	let button1;
    	let t8;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*slide*/ ctx[2]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[8](/*slide*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			img = element("img");
    			t2 = space();
    			td2 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td3 = element("td");
    			button0 = element("button");
    			button0.textContent = "Edytuj";
    			t6 = space();
    			td4 = element("td");
    			button1 = element("button");
    			button1.textContent = "Usuń";
    			t8 = space();
    			add_location(td0, file$3, 84, 20, 2309);
    			if (!src_url_equal(img.src, img_src_value = /*slide*/ ctx[2].src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*slide*/ ctx[2].name);
    			attr_dev(img, "width", 150);
    			add_location(img, file$3, 85, 24, 2354);
    			add_location(td1, file$3, 85, 20, 2350);
    			add_location(td2, file$3, 86, 20, 2437);
    			attr_dev(button0, "class", "edit");
    			add_location(button0, file$3, 87, 24, 2484);
    			add_location(td3, file$3, 87, 20, 2480);
    			attr_dev(button1, "class", "edit");
    			add_location(button1, file$3, 88, 24, 2614);
    			add_location(td4, file$3, 88, 20, 2610);
    			add_location(tr, file$3, 83, 16, 2283);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, img);
    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(td3, button0);
    			append_dev(tr, t6);
    			append_dev(tr, td4);
    			append_dev(td4, button1);
    			append_dev(tr, t8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*slide*/ ctx[2].id + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*settings*/ 1 && !src_url_equal(img.src, img_src_value = /*slide*/ ctx[2].src)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*settings*/ 1 && img_alt_value !== (img_alt_value = /*slide*/ ctx[2].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*settings*/ 1 && t3_value !== (t3_value = /*slide*/ ctx[2].name + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(83:12) {#each settings.slider as slide}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let header;
    	let t0;
    	let article;
    	let table;
    	let tr;
    	let th0;
    	let th1;
    	let th2;
    	let th3;
    	let th4;
    	let t6;
    	let t7;
    	let div;
    	let t8;
    	let input0;
    	let t9;
    	let input1;
    	let t10;
    	let button0;
    	let t12;
    	let dialog_1;
    	let t13;
    	let button1;
    	let t15;
    	let button2;
    	let current;
    	let mounted;
    	let dispose;
    	header = new Header({ $$inline: true });
    	let each_value = /*settings*/ ctx[0].slider;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			article = element("article");
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Id";
    			th1 = element("th");
    			th1.textContent = "Zdjęcie";
    			th2 = element("th");
    			th2.textContent = "Tytuł";
    			th3 = element("th");
    			th3.textContent = "Edycja";
    			th4 = element("th");
    			th4.textContent = "Usuwanie";
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			div = element("div");
    			t8 = text("src");
    			input0 = element("input");
    			t9 = text("\r\n            title");
    			input1 = element("input");
    			t10 = space();
    			button0 = element("button");
    			button0.textContent = "Save";
    			t12 = space();
    			dialog_1 = element("dialog");
    			t13 = text("Czy na pewno usunąć?\r\n            ");
    			button1 = element("button");
    			button1.textContent = "Tak";
    			t15 = space();
    			button2 = element("button");
    			button2.textContent = "Nie";
    			add_location(th0, file$3, 81, 16, 2141);
    			add_location(th1, file$3, 81, 27, 2152);
    			add_location(th2, file$3, 81, 43, 2168);
    			add_location(th3, file$3, 81, 57, 2182);
    			add_location(th4, file$3, 81, 72, 2197);
    			add_location(tr, file$3, 81, 12, 2137);
    			add_location(table, file$3, 80, 8, 2116);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$3, 93, 15, 2783);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$3, 94, 17, 2846);
    			add_location(button0, file$3, 95, 12, 2905);
    			add_location(div, file$3, 92, 8, 2761);
    			add_location(button1, file$3, 99, 12, 3053);
    			add_location(button2, file$3, 100, 12, 3121);
    			add_location(dialog_1, file$3, 97, 8, 2976);
    			attr_dev(article, "class", "settingsBox");
    			add_location(article, file$3, 79, 4, 2077);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, article, anchor);
    			append_dev(article, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, th1);
    			append_dev(tr, th2);
    			append_dev(tr, th3);
    			append_dev(tr, th4);
    			append_dev(table, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			append_dev(article, t7);
    			append_dev(article, div);
    			append_dev(div, t8);
    			append_dev(div, input0);
    			set_input_value(input0, /*slide*/ ctx[2].src);
    			append_dev(div, t9);
    			append_dev(div, input1);
    			set_input_value(input1, /*slide*/ ctx[2].name);
    			append_dev(div, t10);
    			append_dev(div, button0);
    			append_dev(article, t12);
    			append_dev(article, dialog_1);
    			append_dev(dialog_1, t13);
    			append_dev(dialog_1, button1);
    			append_dev(dialog_1, t15);
    			append_dev(dialog_1, button2);
    			/*dialog_1_binding*/ ctx[14](dialog_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(button0, "click", /*click_handler_2*/ ctx[11], false, false, false),
    					listen_dev(button1, "click", /*click_handler_3*/ ctx[12], false, false, false),
    					listen_dev(button2, "click", /*click_handler_4*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*remove, settings, edit_prepare*/ 25) {
    				each_value = /*settings*/ ctx[0].slider;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*slide*/ 4 && input0.value !== /*slide*/ ctx[2].src) {
    				set_input_value(input0, /*slide*/ ctx[2].src);
    			}

    			if (dirty & /*slide*/ 4 && input1.value !== /*slide*/ ctx[2].name) {
    				set_input_value(input1, /*slide*/ ctx[2].name);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    			/*dialog_1_binding*/ ctx[14](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Slider', slots, []);
    	let { settings } = $$props;
    	let edit = false;
    	let slide = { "src": "", "name": "" };
    	let editing = -1;
    	let desintegrator = -1;
    	let wrong = "";
    	let dialog;

    	function edit_prepare(x, y, z) {
    		editing = x;
    		edit = true;
    		$$invalidate(2, slide.src = y, slide);
    		$$invalidate(2, slide.name = z, slide);
    	}

    	function remove(x) {
    		desintegrator = x;
    		dialog.showModal();
    	}

    	function desintegrate() {
    		fetch("http://127.0.0.1:5000/deleteSlide", {
    			headers: { 'Content-Type': 'application/json' },
    			method: 'POST',
    			body: JSON.stringify({ 'id': desintegrator.toString() })
    		}).then(() => {
    			dialog.close();
    			window.location.reload(true);
    		});
    	}

    	function save() {
    		if (edit) {
    			fetch('http://127.0.0.1:5000/changeSlide', {
    				headers: { 'Content-Type': 'application/json' },
    				method: 'POST',
    				body: JSON.stringify({
    					'id': editing.toString(),
    					'src': slide.src,
    					'name': slide.name
    				})
    			}).then(data => data.json()).then(data => {
    				window.location.reload(true);
    			});
    		} else {
    			fetch('http://127.0.0.1:5000/addSlide', {
    				headers: { 'Content-Type': 'application/json' },
    				method: 'POST',
    				body: JSON.stringify({
    					'id': settings.slider[settings.slider.length - 1].id + 1,
    					'src': slide.src,
    					'name': slide.name
    				})
    			}).then(data => data.json()).then(data => {
    				console.log(data);
    				window.location.reload(true);
    			});
    		}

    		editing = false;
    		$$invalidate(2, slide = { "src": "", "name": "" });
    	}

    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Slider> was created with unknown prop '${key}'`);
    	});

    	const click_handler = slide => {
    		edit_prepare(slide.id, slide.src, slide.name);
    	};

    	const click_handler_1 = slide => {
    		remove(slide.id);
    	};

    	function input0_input_handler() {
    		slide.src = this.value;
    		$$invalidate(2, slide);
    	}

    	function input1_input_handler() {
    		slide.name = this.value;
    		$$invalidate(2, slide);
    	}

    	const click_handler_2 = () => save();

    	const click_handler_3 = () => {
    		desintegrate();
    	};

    	const click_handler_4 = () => {
    		dialog.close();
    	};

    	function dialog_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			dialog = $$value;
    			$$invalidate(1, dialog);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		settings,
    		edit,
    		slide,
    		editing,
    		desintegrator,
    		wrong,
    		dialog,
    		edit_prepare,
    		remove,
    		desintegrate,
    		save
    	});

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('edit' in $$props) edit = $$props.edit;
    		if ('slide' in $$props) $$invalidate(2, slide = $$props.slide);
    		if ('editing' in $$props) editing = $$props.editing;
    		if ('desintegrator' in $$props) desintegrator = $$props.desintegrator;
    		if ('wrong' in $$props) wrong = $$props.wrong;
    		if ('dialog' in $$props) $$invalidate(1, dialog = $$props.dialog);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settings,
    		dialog,
    		slide,
    		edit_prepare,
    		remove,
    		desintegrate,
    		save,
    		click_handler,
    		click_handler_1,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		dialog_1_binding
    	];
    }

    class Slider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console_1$3.warn("<Slider> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\subpages\admin_subpages\users.svelte generated by Svelte v3.46.4 */

    const { console: console_1$2 } = globals;
    const file$2 = "src\\subpages\\admin_subpages\\users.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (109:24) {#if user.isAdmin!=1}
    function create_if_block$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[9](/*user*/ ctx[3]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Usuń";
    			attr_dev(button, "class", "edit");
    			add_location(button, file$2, 108, 45, 3281);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(109:24) {#if user.isAdmin!=1}",
    		ctx
    	});

    	return block;
    }

    // (103:12) {#each users as user}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*user*/ ctx[3].login + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*user*/ ctx[3].password + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*user*/ ctx[3].isAdmin + "";
    	let t4;
    	let t5;
    	let td3;
    	let button;
    	let t7;
    	let td4;
    	let t8;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[8](/*user*/ ctx[3]);
    	}

    	let if_block = /*user*/ ctx[3].isAdmin != 1 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			button = element("button");
    			button.textContent = "Edytuj";
    			t7 = space();
    			td4 = element("td");
    			if (if_block) if_block.c();
    			t8 = space();
    			add_location(td0, file$2, 104, 20, 2986);
    			add_location(td1, file$2, 105, 20, 3029);
    			add_location(td2, file$2, 106, 20, 3075);
    			attr_dev(button, "class", "edit");
    			add_location(button, file$2, 107, 24, 3124);
    			add_location(td3, file$2, 107, 20, 3120);
    			add_location(td4, file$2, 108, 20, 3256);
    			add_location(tr, file$2, 103, 16, 2960);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, button);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			if (if_block) if_block.m(td4, null);
    			append_dev(tr, t8);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*users*/ 1 && t0_value !== (t0_value = /*user*/ ctx[3].login + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*users*/ 1 && t2_value !== (t2_value = /*user*/ ctx[3].password + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*users*/ 1 && t4_value !== (t4_value = /*user*/ ctx[3].isAdmin + "")) set_data_dev(t4, t4_value);

    			if (/*user*/ ctx[3].isAdmin != 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(td4, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(103:12) {#each users as user}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let header;
    	let t0;
    	let article;
    	let table;
    	let tr;
    	let th0;
    	let th1;
    	let th2;
    	let th3;
    	let th4;
    	let t6;
    	let t7;
    	let div;
    	let t8;
    	let input0;
    	let t9;
    	let input1;
    	let t10;
    	let button0;
    	let t12;
    	let span;
    	let t13;
    	let t14;
    	let dialog_1;
    	let t15;
    	let button1;
    	let t17;
    	let button2;
    	let current;
    	let mounted;
    	let dispose;
    	header = new Header({ $$inline: true });
    	let each_value = /*users*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			article = element("article");
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Login";
    			th1 = element("th");
    			th1.textContent = "Password";
    			th2 = element("th");
    			th2.textContent = "isAdmin";
    			th3 = element("th");
    			th3.textContent = "Edycja";
    			th4 = element("th");
    			th4.textContent = "Usuwanie";
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			div = element("div");
    			t8 = text("Login");
    			input0 = element("input");
    			t9 = text("\r\n            Password");
    			input1 = element("input");
    			t10 = space();
    			button0 = element("button");
    			button0.textContent = "Save";
    			t12 = space();
    			span = element("span");
    			t13 = text(/*wrong*/ ctx[1]);
    			t14 = space();
    			dialog_1 = element("dialog");
    			t15 = text("Czy na pewno usunąć?\r\n            ");
    			button1 = element("button");
    			button1.textContent = "Tak";
    			t17 = space();
    			button2 = element("button");
    			button2.textContent = "Nie";
    			add_location(th0, file$2, 101, 16, 2823);
    			add_location(th1, file$2, 101, 30, 2837);
    			add_location(th2, file$2, 101, 47, 2854);
    			add_location(th3, file$2, 101, 63, 2870);
    			add_location(th4, file$2, 101, 78, 2885);
    			add_location(tr, file$2, 101, 12, 2819);
    			add_location(table, file$2, 100, 8, 2798);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$2, 113, 17, 3459);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$2, 114, 20, 3526);
    			add_location(button0, file$2, 115, 12, 3588);
    			add_location(span, file$2, 116, 12, 3647);
    			add_location(div, file$2, 112, 8, 3435);
    			add_location(button1, file$2, 120, 12, 3770);
    			add_location(button2, file$2, 121, 12, 3838);
    			add_location(dialog_1, file$2, 118, 8, 3693);
    			attr_dev(article, "class", "settingsBox");
    			add_location(article, file$2, 99, 4, 2759);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, article, anchor);
    			append_dev(article, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, th1);
    			append_dev(tr, th2);
    			append_dev(tr, th3);
    			append_dev(tr, th4);
    			append_dev(table, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			append_dev(article, t7);
    			append_dev(article, div);
    			append_dev(div, t8);
    			append_dev(div, input0);
    			set_input_value(input0, /*user*/ ctx[3].login);
    			append_dev(div, t9);
    			append_dev(div, input1);
    			set_input_value(input1, /*user*/ ctx[3].password);
    			append_dev(div, t10);
    			append_dev(div, button0);
    			append_dev(div, t12);
    			append_dev(div, span);
    			append_dev(span, t13);
    			append_dev(article, t14);
    			append_dev(article, dialog_1);
    			append_dev(dialog_1, t15);
    			append_dev(dialog_1, button1);
    			append_dev(dialog_1, t17);
    			append_dev(dialog_1, button2);
    			/*dialog_1_binding*/ ctx[15](dialog_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(button0, "click", /*click_handler_2*/ ctx[12], false, false, false),
    					listen_dev(button1, "click", /*click_handler_3*/ ctx[13], false, false, false),
    					listen_dev(button2, "click", /*click_handler_4*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*remove, users, edit_prepare*/ 49) {
    				each_value = /*users*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*user*/ 8 && input0.value !== /*user*/ ctx[3].login) {
    				set_input_value(input0, /*user*/ ctx[3].login);
    			}

    			if (dirty & /*user*/ 8 && input1.value !== /*user*/ ctx[3].password) {
    				set_input_value(input1, /*user*/ ctx[3].password);
    			}

    			if (!current || dirty & /*wrong*/ 2) set_data_dev(t13, /*wrong*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    			/*dialog_1_binding*/ ctx[15](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Users', slots, []);
    	let users = [];

    	fetch("http://127.0.0.1:5000/getUsers").then(data => data.json()).then(data => {
    		console.log(data);
    		$$invalidate(0, users = data);
    		console.log(users);
    	});

    	let edit = false;
    	let user = { "login": "", "password": "" };
    	let editing = -1;
    	let desintegrator = -1;
    	let wrong = "";
    	let dialog;

    	function edit_prepare(x, y, z) {
    		editing = x;
    		edit = true;
    		$$invalidate(3, user.login = y, user);
    		$$invalidate(3, user.password = z, user);
    	}

    	function remove(x) {
    		desintegrator = x;
    		dialog.showModal();
    	}

    	function desintegrate() {
    		fetch("http://127.0.0.1:5000/deleteUser", {
    			headers: { 'Content-Type': 'application/json' },
    			method: 'POST',
    			body: JSON.stringify({ 'id': desintegrator.toString() })
    		}).then(() => {
    			dialog.close();
    			window.location.reload(true);
    		});
    	}

    	function save() {
    		if (edit) {
    			fetch('http://127.0.0.1:5000/changeUser', {
    				headers: { 'Content-Type': 'application/json' },
    				method: 'POST',
    				body: JSON.stringify({
    					'login': user.login,
    					'password': user.password,
    					'id': editing.toString()
    				})
    			}).then(data => data.json()).then(data => {
    				switch (data.x) {
    					case 1:
    						$$invalidate(1, wrong = "Taki nick już istnieje");
    						break;
    					case 2:
    						$$invalidate(1, wrong = "");
    						window.location.reload(true);
    						break;
    				}
    			});
    		} else {
    			fetch('http://127.0.0.1:5000/register', {
    				headers: { 'Content-Type': 'application/json' },
    				method: 'POST',
    				body: JSON.stringify({
    					'login': user.login,
    					'password': user.password,
    					'passwordr': user.password
    				})
    			}).then(data => data.json()).then(data => {
    				console.log(data);

    				switch (data.x) {
    					case 1:
    						$$invalidate(1, wrong = "Taka nazwa użytkownika już istnieje");
    						break;
    					case 2:
    						$$invalidate(1, wrong = "");
    						window.location.reload(true);
    						break;
    				}
    			});
    		}

    		editing = false;
    		$$invalidate(3, user = { "login": "", "password": "" });
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Users> was created with unknown prop '${key}'`);
    	});

    	const click_handler = user => {
    		edit_prepare(user.rowid, user.login, user.password);
    	};

    	const click_handler_1 = user => {
    		remove(user.rowid);
    	};

    	function input0_input_handler() {
    		user.login = this.value;
    		$$invalidate(3, user);
    	}

    	function input1_input_handler() {
    		user.password = this.value;
    		$$invalidate(3, user);
    	}

    	const click_handler_2 = () => save();

    	const click_handler_3 = () => {
    		desintegrate();
    	};

    	const click_handler_4 = () => {
    		dialog.close();
    	};

    	function dialog_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			dialog = $$value;
    			$$invalidate(2, dialog);
    		});
    	}

    	$$self.$capture_state = () => ({
    		Header,
    		users,
    		edit,
    		user,
    		editing,
    		desintegrator,
    		wrong,
    		dialog,
    		edit_prepare,
    		remove,
    		desintegrate,
    		save
    	});

    	$$self.$inject_state = $$props => {
    		if ('users' in $$props) $$invalidate(0, users = $$props.users);
    		if ('edit' in $$props) edit = $$props.edit;
    		if ('user' in $$props) $$invalidate(3, user = $$props.user);
    		if ('editing' in $$props) editing = $$props.editing;
    		if ('desintegrator' in $$props) desintegrator = $$props.desintegrator;
    		if ('wrong' in $$props) $$invalidate(1, wrong = $$props.wrong);
    		if ('dialog' in $$props) $$invalidate(2, dialog = $$props.dialog);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		users,
    		wrong,
    		dialog,
    		user,
    		edit_prepare,
    		remove,
    		desintegrate,
    		save,
    		click_handler,
    		click_handler_1,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		dialog_1_binding
    	];
    }

    class Users extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Users",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\subpages\admin_subpages\gallery.svelte generated by Svelte v3.46.4 */

    const { console: console_1$1 } = globals;
    const file$1 = "src\\subpages\\admin_subpages\\gallery.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (81:12) {#each settings.gallery as gallery}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*gallery*/ ctx[2].id + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*gallery*/ ctx[2].title + "";
    	let t2;
    	let t3;
    	let td2;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t4;
    	let td3;
    	let button0;
    	let t6;
    	let td4;
    	let button1;
    	let t8;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*gallery*/ ctx[2]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[8](/*gallery*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			img = element("img");
    			t4 = space();
    			td3 = element("td");
    			button0 = element("button");
    			button0.textContent = "Edytuj";
    			t6 = space();
    			td4 = element("td");
    			button1 = element("button");
    			button1.textContent = "Usuń";
    			t8 = space();
    			add_location(td0, file$1, 82, 20, 2319);
    			add_location(td1, file$1, 83, 20, 2362);
    			if (!src_url_equal(img.src, img_src_value = /*gallery*/ ctx[2].src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*gallery*/ ctx[2].title);
    			attr_dev(img, "width", 150);
    			add_location(img, file$1, 84, 24, 2412);
    			add_location(td2, file$1, 84, 20, 2408);
    			attr_dev(button0, "class", "edit");
    			add_location(button0, file$1, 85, 24, 2504);
    			add_location(td3, file$1, 85, 20, 2500);
    			attr_dev(button1, "class", "edit");
    			add_location(button1, file$1, 86, 24, 2641);
    			add_location(td4, file$1, 86, 20, 2637);
    			add_location(tr, file$1, 81, 16, 2293);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, img);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(td3, button0);
    			append_dev(tr, t6);
    			append_dev(tr, td4);
    			append_dev(td4, button1);
    			append_dev(tr, t8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*settings*/ 1 && t0_value !== (t0_value = /*gallery*/ ctx[2].id + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*settings*/ 1 && t2_value !== (t2_value = /*gallery*/ ctx[2].title + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*settings*/ 1 && !src_url_equal(img.src, img_src_value = /*gallery*/ ctx[2].src)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*settings*/ 1 && img_alt_value !== (img_alt_value = /*gallery*/ ctx[2].title)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(81:12) {#each settings.gallery as gallery}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let header;
    	let t0;
    	let article;
    	let table;
    	let tr;
    	let th0;
    	let th1;
    	let th2;
    	let th3;
    	let th4;
    	let t6;
    	let t7;
    	let div;
    	let t8;
    	let input0;
    	let t9;
    	let input1;
    	let t10;
    	let button0;
    	let t12;
    	let dialog_1;
    	let t13;
    	let button1;
    	let t15;
    	let button2;
    	let current;
    	let mounted;
    	let dispose;
    	header = new Header({ $$inline: true });
    	let each_value = /*settings*/ ctx[0].gallery;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			article = element("article");
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Id";
    			th1 = element("th");
    			th1.textContent = "Tytuł";
    			th2 = element("th");
    			th2.textContent = "Zdjęcie";
    			th3 = element("th");
    			th3.textContent = "Edycja";
    			th4 = element("th");
    			th4.textContent = "Usuwanie";
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			div = element("div");
    			t8 = text("title");
    			input0 = element("input");
    			t9 = text("\r\n            src");
    			input1 = element("input");
    			t10 = space();
    			button0 = element("button");
    			button0.textContent = "Save";
    			t12 = space();
    			dialog_1 = element("dialog");
    			t13 = text("Czy na pewno usunąć?\r\n            ");
    			button1 = element("button");
    			button1.textContent = "Tak";
    			t15 = space();
    			button2 = element("button");
    			button2.textContent = "Nie";
    			add_location(th0, file$1, 79, 16, 2148);
    			add_location(th1, file$1, 79, 27, 2159);
    			add_location(th2, file$1, 79, 41, 2173);
    			add_location(th3, file$1, 79, 57, 2189);
    			add_location(th4, file$1, 79, 72, 2204);
    			add_location(tr, file$1, 79, 12, 2144);
    			add_location(table, file$1, 78, 8, 2123);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$1, 91, 17, 2814);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$1, 92, 15, 2879);
    			add_location(button0, file$1, 93, 12, 2939);
    			add_location(div, file$1, 90, 8, 2790);
    			add_location(button1, file$1, 97, 12, 3087);
    			add_location(button2, file$1, 98, 12, 3155);
    			add_location(dialog_1, file$1, 95, 8, 3010);
    			attr_dev(article, "class", "settingsBox");
    			add_location(article, file$1, 77, 4, 2084);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, article, anchor);
    			append_dev(article, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, th1);
    			append_dev(tr, th2);
    			append_dev(tr, th3);
    			append_dev(tr, th4);
    			append_dev(table, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			append_dev(article, t7);
    			append_dev(article, div);
    			append_dev(div, t8);
    			append_dev(div, input0);
    			set_input_value(input0, /*gallery*/ ctx[2].title);
    			append_dev(div, t9);
    			append_dev(div, input1);
    			set_input_value(input1, /*gallery*/ ctx[2].src);
    			append_dev(div, t10);
    			append_dev(div, button0);
    			append_dev(article, t12);
    			append_dev(article, dialog_1);
    			append_dev(dialog_1, t13);
    			append_dev(dialog_1, button1);
    			append_dev(dialog_1, t15);
    			append_dev(dialog_1, button2);
    			/*dialog_1_binding*/ ctx[14](dialog_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(button0, "click", /*click_handler_2*/ ctx[11], false, false, false),
    					listen_dev(button1, "click", /*click_handler_3*/ ctx[12], false, false, false),
    					listen_dev(button2, "click", /*click_handler_4*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*remove, settings, edit_prepare*/ 25) {
    				each_value = /*settings*/ ctx[0].gallery;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*gallery*/ 4 && input0.value !== /*gallery*/ ctx[2].title) {
    				set_input_value(input0, /*gallery*/ ctx[2].title);
    			}

    			if (dirty & /*gallery*/ 4 && input1.value !== /*gallery*/ ctx[2].src) {
    				set_input_value(input1, /*gallery*/ ctx[2].src);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    			/*dialog_1_binding*/ ctx[14](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Gallery', slots, []);
    	let { settings } = $$props;
    	let edit = false;
    	let gallery = { "title": "", "src": "" };
    	let editing = -1;
    	let desintegrator = -1;
    	let wrong = "";
    	let dialog;

    	function edit_prepare(x, y, z) {
    		editing = x;
    		edit = true;
    		$$invalidate(2, gallery.title = y, gallery);
    		$$invalidate(2, gallery.src = z, gallery);
    	}

    	function remove(x) {
    		desintegrator = x;
    		dialog.showModal();
    	}

    	function desintegrate() {
    		fetch("http://127.0.0.1:5000/deleteGallery", {
    			headers: { 'Content-Type': 'application/json' },
    			method: 'POST',
    			body: JSON.stringify({ 'id': desintegrator.toString() })
    		}).then(() => {
    			dialog.close();
    			window.location.reload(true);
    		});
    	}

    	function save() {
    		if (edit) {
    			fetch('http://127.0.0.1:5000/changeGallery', {
    				headers: { 'Content-Type': 'application/json' },
    				method: 'POST',
    				body: JSON.stringify({
    					'id': editing.toString(),
    					'title': gallery.title,
    					'src': gallery.src
    				})
    			}).then(data => data.json()).then(data => {
    				window.location.reload(true);
    			});
    		} else {
    			fetch('http://127.0.0.1:5000/addGallery', {
    				headers: { 'Content-Type': 'application/json' },
    				method: 'POST',
    				body: JSON.stringify({
    					'id': settings.gallery[settings.gallery.length - 1].id + 1,
    					'title': gallery.title,
    					'src': gallery.src
    				})
    			}).then(data => data.json()).then(data => {
    				console.log(data);
    				window.location.reload(true);
    			});
    		}

    		editing = false;
    		$$invalidate(2, gallery = { "title": "", "src": "" });
    	}

    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Gallery> was created with unknown prop '${key}'`);
    	});

    	const click_handler = gallery => {
    		edit_prepare(gallery.id, gallery.title, gallery.src);
    	};

    	const click_handler_1 = gallery => {
    		remove(gallery.id);
    	};

    	function input0_input_handler() {
    		gallery.title = this.value;
    		$$invalidate(2, gallery);
    	}

    	function input1_input_handler() {
    		gallery.src = this.value;
    		$$invalidate(2, gallery);
    	}

    	const click_handler_2 = () => save();

    	const click_handler_3 = () => {
    		desintegrate();
    	};

    	const click_handler_4 = () => {
    		dialog.close();
    	};

    	function dialog_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			dialog = $$value;
    			$$invalidate(1, dialog);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		settings,
    		edit,
    		gallery,
    		editing,
    		desintegrator,
    		wrong,
    		dialog,
    		edit_prepare,
    		remove,
    		desintegrate,
    		save
    	});

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('edit' in $$props) edit = $$props.edit;
    		if ('gallery' in $$props) $$invalidate(2, gallery = $$props.gallery);
    		if ('editing' in $$props) editing = $$props.editing;
    		if ('desintegrator' in $$props) desintegrator = $$props.desintegrator;
    		if ('wrong' in $$props) wrong = $$props.wrong;
    		if ('dialog' in $$props) $$invalidate(1, dialog = $$props.dialog);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settings,
    		dialog,
    		gallery,
    		edit_prepare,
    		remove,
    		desintegrate,
    		save,
    		click_handler,
    		click_handler_1,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		dialog_1_binding
    	];
    }

    class Gallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gallery",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console_1$1.warn("<Gallery> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */

    const { console: console_1, window: window_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (86:3) {:else}
    function create_else_block_2(ctx) {
    	let header;
    	let burgermenu;
    	let current;

    	burgermenu = new BurgerMenu({
    			props: {
    				backgroundColor: /*settings*/ ctx[0].burger_menu_color,
    				burgerColor: /*settings*/ ctx[0].menu_font_color,
    				$$slots: { default: [create_default_slot_23] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			header = element("header");
    			create_component(burgermenu.$$.fragment);
    			set_style(header, "background-color", /*settings*/ ctx[0].menu_color);
    			attr_dev(header, "class", "burger-menu");
    			toggle_class(header, "static-header", /*settings*/ ctx[0].menu_version == 1);
    			add_location(header, file, 86, 3, 4568);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			mount_component(burgermenu, header, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const burgermenu_changes = {};
    			if (dirty & /*settings*/ 1) burgermenu_changes.backgroundColor = /*settings*/ ctx[0].burger_menu_color;
    			if (dirty & /*settings*/ 1) burgermenu_changes.burgerColor = /*settings*/ ctx[0].menu_font_color;

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				burgermenu_changes.$$scope = { dirty, ctx };
    			}

    			burgermenu.$set(burgermenu_changes);

    			if (!current || dirty & /*settings*/ 1) {
    				set_style(header, "background-color", /*settings*/ ctx[0].menu_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				toggle_class(header, "static-header", /*settings*/ ctx[0].menu_version == 1);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(burgermenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(burgermenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(burgermenu);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(86:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (62:3) {#if innerWidth >settings.burger_menu_show}
    function create_if_block_5(ctx) {
    	let header;
    	let nav0;
    	let t0;
    	let t1;
    	let nav1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let each_value_4 = /*settings*/ ctx[0].headers.main_headers;
    	validate_each_argument(each_value_4);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_1[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value_3 = /*settings*/ ctx[0].headers.additional_headers;
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const if_block_creators = [create_if_block_6, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (sessionStorage.getItem('logged') == 'true') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1();
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			header = element("header");
    			nav0 = element("nav");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			nav1 = element("nav");
    			if_block.c();
    			attr_dev(nav0, "class", "menu");
    			add_location(nav0, file, 63, 4, 2954);
    			attr_dev(nav1, "class", "profile");
    			add_location(nav1, file, 74, 3, 3475);
    			set_style(header, "background-color", /*settings*/ ctx[0].menu_color);
    			attr_dev(header, "class", "main-menu");
    			toggle_class(header, "static-header", /*settings*/ ctx[0].menu_version == 1);
    			add_location(header, file, 62, 3, 2826);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, nav0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(nav0, null);
    			}

    			append_dev(nav0, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(nav0, null);
    			}

    			append_dev(header, t1);
    			append_dev(header, nav1);
    			if_blocks[current_block_type_index].m(nav1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1) {
    				each_value_4 = /*settings*/ ctx[0].headers.main_headers;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_4(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(nav0, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value_4.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*settings*/ 1) {
    				each_value_3 = /*settings*/ ctx[0].headers.additional_headers;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(nav0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if_block.p(ctx, dirty);

    			if (!current || dirty & /*settings*/ 1) {
    				set_style(header, "background-color", /*settings*/ ctx[0].menu_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				toggle_class(header, "static-header", /*settings*/ ctx[0].menu_version == 1);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_4.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(62:3) {#if innerWidth >settings.burger_menu_show}",
    		ctx
    	});

    	return block;
    }

    // (91:7) {#if header.show == 1}
    function create_if_block_9(ctx) {
    	let link_1;
    	let current;

    	link_1 = new Link$1({
    			props: {
    				to: /*header*/ ctx[15].href,
    				class: "menuBar",
    				style: "color:" + /*settings*/ ctx[0].burger_menu_font_color + ";font-size:" + /*settings*/ ctx[0].burger_menu_font_size,
    				$$slots: { default: [create_default_slot_27] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_1_changes = {};
    			if (dirty & /*settings*/ 1) link_1_changes.to = /*header*/ ctx[15].href;
    			if (dirty & /*settings*/ 1) link_1_changes.style = "color:" + /*settings*/ ctx[0].burger_menu_font_color + ";font-size:" + /*settings*/ ctx[0].burger_menu_font_size;

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				link_1_changes.$$scope = { dirty, ctx };
    			}

    			link_1.$set(link_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(91:7) {#if header.show == 1}",
    		ctx
    	});

    	return block;
    }

    // (92:8) <Link to="{header.href}" class="menuBar" style="color:{settings.burger_menu_font_color};font-size:{settings.burger_menu_font_size}">
    function create_default_slot_27(ctx) {
    	let t_value = /*header*/ ctx[15].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t_value !== (t_value = /*header*/ ctx[15].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_27.name,
    		type: "slot",
    		source: "(92:8) <Link to=\\\"{header.href}\\\" class=\\\"menuBar\\\" style=\\\"color:{settings.burger_menu_font_color};font-size:{settings.burger_menu_font_size}\\\">",
    		ctx
    	});

    	return block;
    }

    // (90:6) {#each settings.headers.main_headers as header}
    function create_each_block_6(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*header*/ ctx[15].show == 1 && create_if_block_9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*header*/ ctx[15].show == 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*settings*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_9(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(90:6) {#each settings.headers.main_headers as header}",
    		ctx
    	});

    	return block;
    }

    // (95:6) {#each settings.headers.additional_headers as header}
    function create_each_block_5(ctx) {
    	let a;
    	let t_value = /*header*/ ctx[15].name + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*header*/ ctx[15].href);
    			attr_dev(a, "class", "menuBar");
    			set_style(a, "color", /*settings*/ ctx[0].burger_menu_font_color);
    			set_style(a, "font-size", /*settings*/ ctx[0].burger_menu_font_size);
    			add_location(a, file, 95, 7, 5193);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t_value !== (t_value = /*header*/ ctx[15].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*settings*/ 1 && a_href_value !== (a_href_value = /*header*/ ctx[15].href)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(a, "color", /*settings*/ ctx[0].burger_menu_font_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(a, "font-size", /*settings*/ ctx[0].burger_menu_font_size);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(95:6) {#each settings.headers.additional_headers as header}",
    		ctx
    	});

    	return block;
    }

    // (101:6) {:else}
    function create_else_block_3(ctx) {
    	let link0;
    	let t;
    	let link1;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "login",
    				class: "menuBar",
    				style: "color:" + /*settings*/ ctx[0].burger_menu_font_color + ";font-size:" + /*settings*/ ctx[0].burger_menu_font_size,
    				$$slots: { default: [create_default_slot_26] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "register",
    				class: "menuBar",
    				style: "color:" + /*settings*/ ctx[0].burger_menu_font_color + ";font-size:" + /*settings*/ ctx[0].burger_menu_font_size,
    				$$slots: { default: [create_default_slot_25] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link0.$$.fragment);
    			t = space();
    			create_component(link1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(link1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};
    			if (dirty & /*settings*/ 1) link0_changes.style = "color:" + /*settings*/ ctx[0].burger_menu_font_color + ";font-size:" + /*settings*/ ctx[0].burger_menu_font_size;

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};
    			if (dirty & /*settings*/ 1) link1_changes.style = "color:" + /*settings*/ ctx[0].burger_menu_font_color + ";font-size:" + /*settings*/ ctx[0].burger_menu_font_size;

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(link1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(101:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (98:6) {#if sessionStorage.getItem('logged')=='true'}
    function create_if_block_8(ctx) {
    	let link_1;
    	let t0;
    	let span;
    	let t1_value = /*settings*/ ctx[0].logout_txt + "";
    	let t1;
    	let current;
    	let mounted;
    	let dispose;

    	link_1 = new Link$1({
    			props: {
    				to: "profile",
    				class: "menuBar",
    				style: "color:" + /*settings*/ ctx[0].burger_menu_font_color + ";font-size:" + /*settings*/ ctx[0].burger_menu_font_size,
    				$$slots: { default: [create_default_slot_24] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link_1.$$.fragment);
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			attr_dev(span, "class", "menuBar");
    			set_style(span, "color", /*settings*/ ctx[0].burger_menu_font_color);
    			set_style(span, "font-size", /*settings*/ ctx[0].burger_menu_font_size);
    			add_location(span, file, 99, 7, 5583);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link_1, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span, anchor);
    			append_dev(span, t1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler_1*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const link_1_changes = {};
    			if (dirty & /*settings*/ 1) link_1_changes.style = "color:" + /*settings*/ ctx[0].burger_menu_font_color + ";font-size:" + /*settings*/ ctx[0].burger_menu_font_size;

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				link_1_changes.$$scope = { dirty, ctx };
    			}

    			link_1.$set(link_1_changes);
    			if ((!current || dirty & /*settings*/ 1) && t1_value !== (t1_value = /*settings*/ ctx[0].logout_txt + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*settings*/ 1) {
    				set_style(span, "color", /*settings*/ ctx[0].burger_menu_font_color);
    			}

    			if (!current || dirty & /*settings*/ 1) {
    				set_style(span, "font-size", /*settings*/ ctx[0].burger_menu_font_size);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link_1, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(98:6) {#if sessionStorage.getItem('logged')=='true'}",
    		ctx
    	});

    	return block;
    }

    // (102:7) <Link to="login" class="menuBar" style="color:{settings.burger_menu_font_color};font-size:{settings.burger_menu_font_size}">
    function create_default_slot_26(ctx) {
    	let t_value = /*settings*/ ctx[0].login_txt + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t_value !== (t_value = /*settings*/ ctx[0].login_txt + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26.name,
    		type: "slot",
    		source: "(102:7) <Link to=\\\"login\\\" class=\\\"menuBar\\\" style=\\\"color:{settings.burger_menu_font_color};font-size:{settings.burger_menu_font_size}\\\">",
    		ctx
    	});

    	return block;
    }

    // (103:7) <Link to="register" class="menuBar" style="color:{settings.burger_menu_font_color};font-size:{settings.burger_menu_font_size}">
    function create_default_slot_25(ctx) {
    	let t_value = /*settings*/ ctx[0].register_txt + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t_value !== (t_value = /*settings*/ ctx[0].register_txt + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25.name,
    		type: "slot",
    		source: "(103:7) <Link to=\\\"register\\\" class=\\\"menuBar\\\" style=\\\"color:{settings.burger_menu_font_color};font-size:{settings.burger_menu_font_size}\\\">",
    		ctx
    	});

    	return block;
    }

    // (99:7) <Link to="profile" class="menuBar" style="color:{settings.burger_menu_font_color};font-size:{settings.burger_menu_font_size}">
    function create_default_slot_24(ctx) {
    	let t_value = /*settings*/ ctx[0].profile_txt + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t_value !== (t_value = /*settings*/ ctx[0].profile_txt + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24.name,
    		type: "slot",
    		source: "(99:7) <Link to=\\\"profile\\\" class=\\\"menuBar\\\" style=\\\"color:{settings.burger_menu_font_color};font-size:{settings.burger_menu_font_size}\\\">",
    		ctx
    	});

    	return block;
    }

    // (88:4) <BurgerMenu backgroundColor={settings.burger_menu_color} burgerColor={settings.menu_font_color}>
    function create_default_slot_23(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_6 = /*settings*/ ctx[0].headers.main_headers;
    	validate_each_argument(each_value_6);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		each_blocks_1[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value_5 = /*settings*/ ctx[0].headers.additional_headers;
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	const if_block_creators = [create_if_block_8, create_else_block_3];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (sessionStorage.getItem('logged') == 'true') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2();
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			if_block.c();
    			attr_dev(div, "class", "burger");
    			add_location(div, file, 88, 5, 4800);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div, null);
    			}

    			append_dev(div, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t1);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "load", /*color*/ ctx[2](), { once: true }, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1) {
    				each_value_6 = /*settings*/ ctx[0].headers.main_headers;
    				validate_each_argument(each_value_6);
    				let i;

    				for (i = 0; i < each_value_6.length; i += 1) {
    					const child_ctx = get_each_context_6(ctx, each_value_6, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_6(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value_6.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*settings*/ 1) {
    				each_value_5 = /*settings*/ ctx[0].headers.additional_headers;
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_5.length;
    			}

    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_6.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23.name,
    		type: "slot",
    		source: "(88:4) <BurgerMenu backgroundColor={settings.burger_menu_color} burgerColor={settings.menu_font_color}>",
    		ctx
    	});

    	return block;
    }

    // (66:6) {#if header.show ==1}
    function create_if_block_7(ctx) {
    	let link_1;
    	let current;

    	link_1 = new Link$1({
    			props: {
    				to: /*header*/ ctx[15].href,
    				class: "menuBar",
    				style: "color:" + /*settings*/ ctx[0].menu_font_color + ";font-size:" + /*settings*/ ctx[0].menu_font_size,
    				$$slots: { default: [create_default_slot_22] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_1_changes = {};
    			if (dirty & /*settings*/ 1) link_1_changes.to = /*header*/ ctx[15].href;
    			if (dirty & /*settings*/ 1) link_1_changes.style = "color:" + /*settings*/ ctx[0].menu_font_color + ";font-size:" + /*settings*/ ctx[0].menu_font_size;

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				link_1_changes.$$scope = { dirty, ctx };
    			}

    			link_1.$set(link_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(66:6) {#if header.show ==1}",
    		ctx
    	});

    	return block;
    }

    // (67:7) <Link to="{header.href}" class="menuBar" style="color:{settings.menu_font_color};font-size:{settings.menu_font_size}">
    function create_default_slot_22(ctx) {
    	let t_value = /*header*/ ctx[15].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t_value !== (t_value = /*header*/ ctx[15].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(67:7) <Link to=\\\"{header.href}\\\" class=\\\"menuBar\\\" style=\\\"color:{settings.menu_font_color};font-size:{settings.menu_font_size}\\\">",
    		ctx
    	});

    	return block;
    }

    // (65:5) {#each settings.headers.main_headers as header}
    function create_each_block_4(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*header*/ ctx[15].show == 1 && create_if_block_7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*header*/ ctx[15].show == 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*settings*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(65:5) {#each settings.headers.main_headers as header}",
    		ctx
    	});

    	return block;
    }

    // (70:5) {#each settings.headers.additional_headers as header}
    function create_each_block_3(ctx) {
    	let a;
    	let t_value = /*header*/ ctx[15].name + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*header*/ ctx[15].href);
    			attr_dev(a, "class", "menuBar");
    			set_style(a, "color", /*settings*/ ctx[0].menu_font_color);
    			set_style(a, "font-size", /*settings*/ ctx[0].menu_font_size);
    			add_location(a, file, 70, 6, 3305);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t_value !== (t_value = /*header*/ ctx[15].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*settings*/ 1 && a_href_value !== (a_href_value = /*header*/ ctx[15].href)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(a, "color", /*settings*/ ctx[0].menu_font_color);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(a, "font-size", /*settings*/ ctx[0].menu_font_size);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(70:5) {#each settings.headers.additional_headers as header}",
    		ctx
    	});

    	return block;
    }

    // (79:3) {:else}
    function create_else_block_1(ctx) {
    	let link0;
    	let t;
    	let link1;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "login",
    				class: "logger",
    				style: "color:" + /*settings*/ ctx[0].loggers_font_color + ";background-color:" + /*settings*/ ctx[0].loggers_bg_color + ";border:" + /*settings*/ ctx[0].loggers_border_width + " solid " + /*settings*/ ctx[0].loggers_border_color,
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "register",
    				class: "logger",
    				style: "color:" + /*settings*/ ctx[0].loggers_font_color + ";background-color:" + /*settings*/ ctx[0].loggers_bg_color + ";border:" + /*settings*/ ctx[0].loggers_border_width + " solid " + /*settings*/ ctx[0].loggers_border_color,
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link0.$$.fragment);
    			t = space();
    			create_component(link1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(link1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};
    			if (dirty & /*settings*/ 1) link0_changes.style = "color:" + /*settings*/ ctx[0].loggers_font_color + ";background-color:" + /*settings*/ ctx[0].loggers_bg_color + ";border:" + /*settings*/ ctx[0].loggers_border_width + " solid " + /*settings*/ ctx[0].loggers_border_color;

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};
    			if (dirty & /*settings*/ 1) link1_changes.style = "color:" + /*settings*/ ctx[0].loggers_font_color + ";background-color:" + /*settings*/ ctx[0].loggers_bg_color + ";border:" + /*settings*/ ctx[0].loggers_border_width + " solid " + /*settings*/ ctx[0].loggers_border_color;

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(link1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(79:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (76:3) {#if sessionStorage.getItem('logged')=='true'}
    function create_if_block_6(ctx) {
    	let link_1;
    	let t0;
    	let span;
    	let t1_value = /*settings*/ ctx[0].logout_txt + "";
    	let t1;
    	let current;
    	let mounted;
    	let dispose;

    	link_1 = new Link$1({
    			props: {
    				to: "profile",
    				class: "logger",
    				style: "color:" + /*settings*/ ctx[0].loggers_font_color + ";background-color:" + /*settings*/ ctx[0].loggers_bg_color + ";border:" + /*settings*/ ctx[0].loggers_border_width + " solid " + /*settings*/ ctx[0].loggers_border_color,
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link_1.$$.fragment);
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			attr_dev(span, "class", "logger");
    			set_style(span, "color", /*settings*/ ctx[0].loggers_font_color);
    			set_style(span, "background-color", /*settings*/ ctx[0].loggers_bg_color);
    			set_style(span, "border", /*settings*/ ctx[0].loggers_border_width + " solid " + /*settings*/ ctx[0].loggers_border_color);
    			add_location(span, file, 77, 4, 3788);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link_1, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span, anchor);
    			append_dev(span, t1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const link_1_changes = {};
    			if (dirty & /*settings*/ 1) link_1_changes.style = "color:" + /*settings*/ ctx[0].loggers_font_color + ";background-color:" + /*settings*/ ctx[0].loggers_bg_color + ";border:" + /*settings*/ ctx[0].loggers_border_width + " solid " + /*settings*/ ctx[0].loggers_border_color;

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				link_1_changes.$$scope = { dirty, ctx };
    			}

    			link_1.$set(link_1_changes);
    			if ((!current || dirty & /*settings*/ 1) && t1_value !== (t1_value = /*settings*/ ctx[0].logout_txt + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*settings*/ 1) {
    				set_style(span, "color", /*settings*/ ctx[0].loggers_font_color);
    			}

    			if (!current || dirty & /*settings*/ 1) {
    				set_style(span, "background-color", /*settings*/ ctx[0].loggers_bg_color);
    			}

    			if (!current || dirty & /*settings*/ 1) {
    				set_style(span, "border", /*settings*/ ctx[0].loggers_border_width + " solid " + /*settings*/ ctx[0].loggers_border_color);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link_1, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(76:3) {#if sessionStorage.getItem('logged')=='true'}",
    		ctx
    	});

    	return block;
    }

    // (80:4) <Link to="login" class="logger" style="color:{settings.loggers_font_color};background-color:{settings.loggers_bg_color};border:{settings.loggers_border_width} solid {settings.loggers_border_color}">
    function create_default_slot_21(ctx) {
    	let t_value = /*settings*/ ctx[0].login_txt + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t_value !== (t_value = /*settings*/ ctx[0].login_txt + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(80:4) <Link to=\\\"login\\\" class=\\\"logger\\\" style=\\\"color:{settings.loggers_font_color};background-color:{settings.loggers_bg_color};border:{settings.loggers_border_width} solid {settings.loggers_border_color}\\\">",
    		ctx
    	});

    	return block;
    }

    // (81:4) <Link to="register" class="logger" style="color:{settings.loggers_font_color};background-color:{settings.loggers_bg_color};border:{settings.loggers_border_width} solid {settings.loggers_border_color}">
    function create_default_slot_20(ctx) {
    	let t_value = /*settings*/ ctx[0].register_txt + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t_value !== (t_value = /*settings*/ ctx[0].register_txt + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(81:4) <Link to=\\\"register\\\" class=\\\"logger\\\" style=\\\"color:{settings.loggers_font_color};background-color:{settings.loggers_bg_color};border:{settings.loggers_border_width} solid {settings.loggers_border_color}\\\">",
    		ctx
    	});

    	return block;
    }

    // (77:4) <Link to="profile" class="logger" style="color:{settings.loggers_font_color};background-color:{settings.loggers_bg_color};border:{settings.loggers_border_width} solid {settings.loggers_border_color}">
    function create_default_slot_19(ctx) {
    	let t_value = /*settings*/ ctx[0].profile_txt + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t_value !== (t_value = /*settings*/ ctx[0].profile_txt + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(77:4) <Link to=\\\"profile\\\" class=\\\"logger\\\" style=\\\"color:{settings.loggers_font_color};background-color:{settings.loggers_bg_color};border:{settings.loggers_border_width} solid {settings.loggers_border_color}\\\">",
    		ctx
    	});

    	return block;
    }

    // (109:2) <Route path="/">
    function create_default_slot_18(ctx) {
    	let main;
    	let current;

    	main = new Main({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(main.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(main, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const main_changes = {};
    			if (dirty & /*settings*/ 1) main_changes.settings = /*settings*/ ctx[0];
    			main.$set(main_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(main, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(109:2) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (110:2) <Route path="articles">
    function create_default_slot_17(ctx) {
    	let articles;
    	let current;

    	articles = new Articles$1({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(articles.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(articles, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const articles_changes = {};
    			if (dirty & /*settings*/ 1) articles_changes.settings = /*settings*/ ctx[0];
    			articles.$set(articles_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(articles.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(articles.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(articles, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(110:2) <Route path=\\\"articles\\\">",
    		ctx
    	});

    	return block;
    }

    // (111:2) <Route path="gallery">
    function create_default_slot_16(ctx) {
    	let gallery;
    	let current;

    	gallery = new Gallery$1({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(gallery.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(gallery, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const gallery_changes = {};
    			if (dirty & /*settings*/ 1) gallery_changes.settings = /*settings*/ ctx[0];
    			gallery.$set(gallery_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gallery.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gallery.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(gallery, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(111:2) <Route path=\\\"gallery\\\">",
    		ctx
    	});

    	return block;
    }

    // (112:2) <Route path="comments">
    function create_default_slot_15(ctx) {
    	let comments;
    	let current;

    	comments = new Comments$1({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(comments.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(comments, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const comments_changes = {};
    			if (dirty & /*settings*/ 1) comments_changes.settings = /*settings*/ ctx[0];
    			comments.$set(comments_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(comments.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(comments.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(comments, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(112:2) <Route path=\\\"comments\\\">",
    		ctx
    	});

    	return block;
    }

    // (113:2) <Route path="login">
    function create_default_slot_14(ctx) {
    	let login;
    	let current;

    	login = new Login({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const login_changes = {};
    			if (dirty & /*settings*/ 1) login_changes.settings = /*settings*/ ctx[0];
    			login.$set(login_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(113:2) <Route path=\\\"login\\\">",
    		ctx
    	});

    	return block;
    }

    // (114:2) <Route path="register">
    function create_default_slot_13(ctx) {
    	let register;
    	let current;

    	register = new Register({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(register.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(register, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const register_changes = {};
    			if (dirty & /*settings*/ 1) register_changes.settings = /*settings*/ ctx[0];
    			register.$set(register_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(register.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(register.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(register, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(114:2) <Route path=\\\"register\\\">",
    		ctx
    	});

    	return block;
    }

    // (115:2) {#if sessionStorage.getItem('logged')=='true'}
    function create_if_block_2(ctx) {
    	let route;
    	let t;
    	let show_if = sessionStorage.getItem('admin') == 'true';
    	let if_block_anchor;
    	let current;

    	route = new Route$1({
    			props: {
    				path: "profile",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = show_if && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route_changes = {};

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				route_changes.$$scope = { dirty, ctx };
    			}

    			route.$set(route_changes);
    			if (show_if) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(115:2) {#if sessionStorage.getItem('logged')=='true'}",
    		ctx
    	});

    	return block;
    }

    // (119:4) {:else}
    function create_else_block(ctx) {
    	let profile;
    	let current;

    	profile = new Profile({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(profile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(profile, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const profile_changes = {};
    			if (dirty & /*settings*/ 1) profile_changes.settings = /*settings*/ ctx[0];
    			profile.$set(profile_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(profile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(profile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(profile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(119:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (117:4) {#if sessionStorage.getItem('admin')=='true'}
    function create_if_block_4(ctx) {
    	let admin;
    	let current;

    	admin = new Admin({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(admin.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(admin, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const admin_changes = {};
    			if (dirty & /*settings*/ 1) admin_changes.settings = /*settings*/ ctx[0];
    			admin.$set(admin_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(admin.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(admin.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(admin, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(117:4) {#if sessionStorage.getItem('admin')=='true'}",
    		ctx
    	});

    	return block;
    }

    // (116:3) <Route path="profile">
    function create_default_slot_12(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_4, create_else_block];
    	const if_blocks = [];

    	function select_block_type_3(ctx, dirty) {
    		if (sessionStorage.getItem('admin') == 'true') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_3();
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(116:3) <Route path=\\\"profile\\\">",
    		ctx
    	});

    	return block;
    }

    // (123:3) {#if sessionStorage.getItem('admin')=='true'}
    function create_if_block_3(ctx) {
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let route3;
    	let t3;
    	let route4;
    	let t4;
    	let route5;
    	let t5;
    	let route6;
    	let t6;
    	let route7;
    	let t7;
    	let route8;
    	let current;

    	route0 = new Route$1({
    			props: {
    				path: "profile/settings",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: "profile/users",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: "profile/comments",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: {
    				path: "profile/comms",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route$1({
    			props: {
    				path: "profile/gallery",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route5 = new Route$1({
    			props: {
    				path: "profile/articles",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route6 = new Route$1({
    			props: {
    				path: "profile/slider",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route7 = new Route$1({
    			props: {
    				path: "profile/header",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route8 = new Route$1({
    			props: {
    				path: "profile/footer",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(route3.$$.fragment);
    			t3 = space();
    			create_component(route4.$$.fragment);
    			t4 = space();
    			create_component(route5.$$.fragment);
    			t5 = space();
    			create_component(route6.$$.fragment);
    			t6 = space();
    			create_component(route7.$$.fragment);
    			t7 = space();
    			create_component(route8.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(route1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(route2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(route3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(route4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(route5, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(route6, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(route7, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(route8, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 16777216) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    			const route5_changes = {};

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				route5_changes.$$scope = { dirty, ctx };
    			}

    			route5.$set(route5_changes);
    			const route6_changes = {};

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				route6_changes.$$scope = { dirty, ctx };
    			}

    			route6.$set(route6_changes);
    			const route7_changes = {};

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				route7_changes.$$scope = { dirty, ctx };
    			}

    			route7.$set(route7_changes);
    			const route8_changes = {};

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				route8_changes.$$scope = { dirty, ctx };
    			}

    			route8.$set(route8_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(route5.$$.fragment, local);
    			transition_in(route6.$$.fragment, local);
    			transition_in(route7.$$.fragment, local);
    			transition_in(route8.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(route5.$$.fragment, local);
    			transition_out(route6.$$.fragment, local);
    			transition_out(route7.$$.fragment, local);
    			transition_out(route8.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(route1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(route2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(route3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(route4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(route5, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(route6, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(route7, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(route8, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(123:3) {#if sessionStorage.getItem('admin')=='true'}",
    		ctx
    	});

    	return block;
    }

    // (125:3) <Route path="profile/settings">
    function create_default_slot_11(ctx) {
    	let admin_settings;
    	let current;

    	admin_settings = new Settings({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(admin_settings.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(admin_settings, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const admin_settings_changes = {};
    			if (dirty & /*settings*/ 1) admin_settings_changes.settings = /*settings*/ ctx[0];
    			admin_settings.$set(admin_settings_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(admin_settings.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(admin_settings.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(admin_settings, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(125:3) <Route path=\\\"profile/settings\\\">",
    		ctx
    	});

    	return block;
    }

    // (126:3) <Route path="profile/users">
    function create_default_slot_10(ctx) {
    	let admin_users;
    	let current;
    	admin_users = new Users({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(admin_users.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(admin_users, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(admin_users.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(admin_users.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(admin_users, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(126:3) <Route path=\\\"profile/users\\\">",
    		ctx
    	});

    	return block;
    }

    // (127:3) <Route path="profile/comments">
    function create_default_slot_9(ctx) {
    	let admin_comments;
    	let current;

    	admin_comments = new Comments({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(admin_comments.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(admin_comments, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const admin_comments_changes = {};
    			if (dirty & /*settings*/ 1) admin_comments_changes.settings = /*settings*/ ctx[0];
    			admin_comments.$set(admin_comments_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(admin_comments.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(admin_comments.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(admin_comments, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(127:3) <Route path=\\\"profile/comments\\\">",
    		ctx
    	});

    	return block;
    }

    // (128:3) <Route path="profile/comms">
    function create_default_slot_8(ctx) {
    	let admin_comms;
    	let current;

    	admin_comms = new Comms({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(admin_comms.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(admin_comms, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const admin_comms_changes = {};
    			if (dirty & /*settings*/ 1) admin_comms_changes.settings = /*settings*/ ctx[0];
    			admin_comms.$set(admin_comms_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(admin_comms.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(admin_comms.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(admin_comms, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(128:3) <Route path=\\\"profile/comms\\\">",
    		ctx
    	});

    	return block;
    }

    // (129:3) <Route path="profile/gallery">
    function create_default_slot_7(ctx) {
    	let admin_gallery;
    	let current;

    	admin_gallery = new Gallery({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(admin_gallery.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(admin_gallery, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const admin_gallery_changes = {};
    			if (dirty & /*settings*/ 1) admin_gallery_changes.settings = /*settings*/ ctx[0];
    			admin_gallery.$set(admin_gallery_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(admin_gallery.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(admin_gallery.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(admin_gallery, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(129:3) <Route path=\\\"profile/gallery\\\">",
    		ctx
    	});

    	return block;
    }

    // (130:3) <Route path="profile/articles">
    function create_default_slot_6(ctx) {
    	let admin_articles;
    	let current;

    	admin_articles = new Articles({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(admin_articles.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(admin_articles, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const admin_articles_changes = {};
    			if (dirty & /*settings*/ 1) admin_articles_changes.settings = /*settings*/ ctx[0];
    			admin_articles.$set(admin_articles_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(admin_articles.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(admin_articles.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(admin_articles, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(130:3) <Route path=\\\"profile/articles\\\">",
    		ctx
    	});

    	return block;
    }

    // (131:3) <Route path="profile/slider">
    function create_default_slot_5(ctx) {
    	let admin_slider;
    	let current;

    	admin_slider = new Slider({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(admin_slider.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(admin_slider, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const admin_slider_changes = {};
    			if (dirty & /*settings*/ 1) admin_slider_changes.settings = /*settings*/ ctx[0];
    			admin_slider.$set(admin_slider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(admin_slider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(admin_slider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(admin_slider, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(131:3) <Route path=\\\"profile/slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (132:3) <Route path="profile/header">
    function create_default_slot_4(ctx) {
    	let admin_menu;
    	let current;

    	admin_menu = new Menu({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(admin_menu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(admin_menu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const admin_menu_changes = {};
    			if (dirty & /*settings*/ 1) admin_menu_changes.settings = /*settings*/ ctx[0];
    			admin_menu.$set(admin_menu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(admin_menu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(admin_menu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(admin_menu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(132:3) <Route path=\\\"profile/header\\\">",
    		ctx
    	});

    	return block;
    }

    // (133:3) <Route path="profile/footer">
    function create_default_slot_3(ctx) {
    	let admin_footer;
    	let current;

    	admin_footer = new Footer({
    			props: { settings: /*settings*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(admin_footer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(admin_footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const admin_footer_changes = {};
    			if (dirty & /*settings*/ 1) admin_footer_changes.settings = /*settings*/ ctx[0];
    			admin_footer.$set(admin_footer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(admin_footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(admin_footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(admin_footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(133:3) <Route path=\\\"profile/footer\\\">",
    		ctx
    	});

    	return block;
    }

    // (137:2) <Route path="{'articles/'+article.id.toString()}">
    function create_default_slot_2(ctx) {
    	let bigarticle;
    	let current;

    	bigarticle = new Big_article({
    			props: {
    				settings: /*settings*/ ctx[0],
    				article: /*article*/ ctx[12]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(bigarticle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bigarticle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const bigarticle_changes = {};
    			if (dirty & /*settings*/ 1) bigarticle_changes.settings = /*settings*/ ctx[0];
    			if (dirty & /*settings*/ 1) bigarticle_changes.article = /*article*/ ctx[12];
    			bigarticle.$set(bigarticle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bigarticle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bigarticle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bigarticle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(137:2) <Route path=\\\"{'articles/'+article.id.toString()}\\\">",
    		ctx
    	});

    	return block;
    }

    // (136:2) {#each settings.articles as article}
    function create_each_block_2(ctx) {
    	let route;
    	let current;

    	route = new Route$1({
    			props: {
    				path: 'articles/' + /*article*/ ctx[12].id.toString(),
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route_changes = {};
    			if (dirty & /*settings*/ 1) route_changes.path = 'articles/' + /*article*/ ctx[12].id.toString();

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				route_changes.$$scope = { dirty, ctx };
    			}

    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(136:2) {#each settings.articles as article}",
    		ctx
    	});

    	return block;
    }

    // (143:6) {#if link.show == 1}
    function create_if_block_1(ctx) {
    	let link_1;
    	let current;

    	link_1 = new Link$1({
    			props: {
    				to: /*link*/ ctx[7].href,
    				style: "color:" + /*settings*/ ctx[0].footer_font_color,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_1_changes = {};
    			if (dirty & /*settings*/ 1) link_1_changes.to = /*link*/ ctx[7].href;
    			if (dirty & /*settings*/ 1) link_1_changes.style = "color:" + /*settings*/ ctx[0].footer_font_color;

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				link_1_changes.$$scope = { dirty, ctx };
    			}

    			link_1.$set(link_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(143:6) {#if link.show == 1}",
    		ctx
    	});

    	return block;
    }

    // (144:7) <Link to="{link.href}" style="color:{settings.footer_font_color}">
    function create_default_slot_1(ctx) {
    	let t_value = /*link*/ ctx[7].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t_value !== (t_value = /*link*/ ctx[7].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(144:7) <Link to=\\\"{link.href}\\\" style=\\\"color:{settings.footer_font_color}\\\">",
    		ctx
    	});

    	return block;
    }

    // (142:5) {#each settings.footer.main_footers as link}
    function create_each_block_1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*link*/ ctx[7].show == 1 && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*link*/ ctx[7].show == 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*settings*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(142:5) {#each settings.footer.main_footers as link}",
    		ctx
    	});

    	return block;
    }

    // (150:6) {#if link.show == 1}
    function create_if_block(ctx) {
    	let a;
    	let i;
    	let i_class_value;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			i = element("i");
    			attr_dev(i, "class", i_class_value = "fa-brands fa-" + /*link*/ ctx[7].name);
    			add_location(i, file, 150, 72, 8242);
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[7].href);
    			set_style(a, "color", /*settings*/ ctx[0].footer_font_color);
    			add_location(a, file, 150, 7, 8177);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, i);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && i_class_value !== (i_class_value = "fa-brands fa-" + /*link*/ ctx[7].name)) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (dirty & /*settings*/ 1 && a_href_value !== (a_href_value = /*link*/ ctx[7].href)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*settings*/ 1) {
    				set_style(a, "color", /*settings*/ ctx[0].footer_font_color);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(150:6) {#if link.show == 1}",
    		ctx
    	});

    	return block;
    }

    // (149:5) {#each settings.footer.social_media_footers as link}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*link*/ ctx[7].show == 1 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*link*/ ctx[7].show == 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(149:5) {#each settings.footer.social_media_footers as link}",
    		ctx
    	});

    	return block;
    }

    // (59:2) <Router>
    function create_default_slot(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block0;
    	let t0;
    	let route0;
    	let t1;
    	let route1;
    	let t2;
    	let route2;
    	let t3;
    	let route3;
    	let t4;
    	let route4;
    	let t5;
    	let route5;
    	let t6;
    	let show_if = sessionStorage.getItem('logged') == 'true';
    	let t7;
    	let t8;
    	let footer;
    	let div2;
    	let div0;
    	let t9;
    	let div1;
    	let t10;
    	let div3;
    	let t11_value = /*settings*/ ctx[0].footer.contact_footer + "";
    	let t11;
    	let t12;
    	let div4;
    	let t13_value = /*settings*/ ctx[0].footer.copyright + "";
    	let t13;
    	let current;
    	const if_block_creators = [create_if_block_5, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*innerWidth*/ ctx[1] > /*settings*/ ctx[0].burger_menu_show) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	route0 = new Route$1({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: "articles",
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: "gallery",
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: {
    				path: "comments",
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route$1({
    			props: {
    				path: "login",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route5 = new Route$1({
    			props: {
    				path: "register",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = show_if && create_if_block_2(ctx);
    	let each_value_2 = /*settings*/ ctx[0].articles;
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks_2[i], 1, 1, () => {
    		each_blocks_2[i] = null;
    	});

    	let each_value_1 = /*settings*/ ctx[0].footer.main_footers;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out_1 = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*settings*/ ctx[0].footer.social_media_footers;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block0.c();
    			t0 = space();
    			create_component(route0.$$.fragment);
    			t1 = space();
    			create_component(route1.$$.fragment);
    			t2 = space();
    			create_component(route2.$$.fragment);
    			t3 = space();
    			create_component(route3.$$.fragment);
    			t4 = space();
    			create_component(route4.$$.fragment);
    			t5 = space();
    			create_component(route5.$$.fragment);
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t8 = space();
    			footer = element("footer");
    			div2 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t9 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t10 = space();
    			div3 = element("div");
    			t11 = text(t11_value);
    			t12 = space();
    			div4 = element("div");
    			t13 = text(t13_value);
    			add_location(div0, file, 140, 4, 7853);
    			add_location(div1, file, 147, 4, 8076);
    			attr_dev(div2, "class", "links");
    			add_location(div2, file, 139, 3, 7828);
    			attr_dev(div3, "class", "contact");
    			add_location(div3, file, 155, 3, 8342);
    			attr_dev(div4, "class", "copyright");
    			add_location(div4, file, 158, 3, 8417);
    			set_style(footer, "background-color", /*settings*/ ctx[0].footer_bg_color);
    			set_style(footer, "color", /*settings*/ ctx[0].footer_font_color);
    			add_location(footer, file, 138, 2, 7727);
    			set_style(main, "font-family", /*settings*/ ctx[0].main_font);
    			set_style(main, "background-color", /*settings*/ ctx[0].bg_color);
    			toggle_class(main, "fun-class-name-owo", /*settings*/ ctx[0].menu_version == 1 && /*innerWidth*/ ctx[1] > /*settings*/ ctx[0].burger_menu_show);
    			toggle_class(main, "fun-class-name-uwu", /*settings*/ ctx[0].menu_version == 1 && /*innerWidth*/ ctx[1] < /*settings*/ ctx[0].burger_menu_show);
    			add_location(main, file, 59, 2, 2496);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			append_dev(main, t0);
    			mount_component(route0, main, null);
    			append_dev(main, t1);
    			mount_component(route1, main, null);
    			append_dev(main, t2);
    			mount_component(route2, main, null);
    			append_dev(main, t3);
    			mount_component(route3, main, null);
    			append_dev(main, t4);
    			mount_component(route4, main, null);
    			append_dev(main, t5);
    			mount_component(route5, main, null);
    			append_dev(main, t6);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t7);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(main, null);
    			}

    			append_dev(main, t8);
    			append_dev(main, footer);
    			append_dev(footer, div2);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div2, t9);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(footer, t10);
    			append_dev(footer, div3);
    			append_dev(div3, t11);
    			append_dev(footer, t12);
    			append_dev(footer, div4);
    			append_dev(div4, t13);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(main, t0);
    			}

    			const route0_changes = {};

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    			const route5_changes = {};

    			if (dirty & /*$$scope, settings*/ 16777217) {
    				route5_changes.$$scope = { dirty, ctx };
    			}

    			route5.$set(route5_changes);
    			if (show_if) if_block1.p(ctx, dirty);

    			if (dirty & /*settings*/ 1) {
    				each_value_2 = /*settings*/ ctx[0].articles;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    						transition_in(each_blocks_2[i], 1);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						transition_in(each_blocks_2[i], 1);
    						each_blocks_2[i].m(main, t8);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_2.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*settings*/ 1) {
    				each_value_1 = /*settings*/ ctx[0].footer.main_footers;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*settings*/ 1) {
    				each_value = /*settings*/ ctx[0].footer.social_media_footers;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if ((!current || dirty & /*settings*/ 1) && t11_value !== (t11_value = /*settings*/ ctx[0].footer.contact_footer + "")) set_data_dev(t11, t11_value);
    			if ((!current || dirty & /*settings*/ 1) && t13_value !== (t13_value = /*settings*/ ctx[0].footer.copyright + "")) set_data_dev(t13, t13_value);

    			if (!current || dirty & /*settings*/ 1) {
    				set_style(footer, "background-color", /*settings*/ ctx[0].footer_bg_color);
    			}

    			if (!current || dirty & /*settings*/ 1) {
    				set_style(footer, "color", /*settings*/ ctx[0].footer_font_color);
    			}

    			if (!current || dirty & /*settings*/ 1) {
    				set_style(main, "font-family", /*settings*/ ctx[0].main_font);
    			}

    			if (!current || dirty & /*settings*/ 1) {
    				set_style(main, "background-color", /*settings*/ ctx[0].bg_color);
    			}

    			if (dirty & /*settings, innerWidth*/ 3) {
    				toggle_class(main, "fun-class-name-owo", /*settings*/ ctx[0].menu_version == 1 && /*innerWidth*/ ctx[1] > /*settings*/ ctx[0].burger_menu_show);
    			}

    			if (dirty & /*settings, innerWidth*/ 3) {
    				toggle_class(main, "fun-class-name-uwu", /*settings*/ ctx[0].menu_version == 1 && /*innerWidth*/ ctx[1] < /*settings*/ ctx[0].burger_menu_show);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(route5.$$.fragment, local);
    			transition_in(if_block1);

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(route5.$$.fragment, local);
    			transition_out(if_block1);
    			each_blocks_2 = each_blocks_2.filter(Boolean);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				transition_out(each_blocks_2[i]);
    			}

    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    			destroy_component(route5);
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(59:2) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[3]);

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "resize", /*onwindowresize*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, settings, innerWidth*/ 16777219) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function sleep(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
    }

    function logout() {
    	sessionStorage.setItem('logged', 'false');
    	sessionStorage.setItem('admin', 'false');
    	window.location.replace(`http://127.0.0.1:5000/`);
    }

    function instance($$self, $$props, $$invalidate) {
    	let innerWidth;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let settings = {
    		"setter": 0,
    		"allSettings": [],
    		"slider": [],
    		"comments": [],
    		"comms": [],
    		"burger_menu_show": 10000,
    		"headers": {
    			"main_headers": [],
    			"additional_headers": []
    		},
    		"footer": {
    			"main_footers": [],
    			"social_media_footers": [],
    			"contact_footer": "",
    			"copyright": ""
    		},
    		"main_elements": [],
    		"articles": [],
    		"gallery": [{ "src": "", "title": "" }]
    	};

    	async function getSettings() {
    		fetch("http://127.0.0.1:5000/getSettings").then(data => data.json()).then(data => {
    			console.log(data);
    			$$invalidate(0, settings = data);
    		});
    	}

    	getSettings();

    	async function color() {
    		await sleep(200);
    		let x = document.querySelector("#container");
    		let y = document.querySelector(".svelte-hbdsxb");
    		x.style.backgroundColor = settings.burger_menu_color;
    		y.style.color = settings.burger_menu_font_color;
    		console.log(x);
    		console.log("sex");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(1, innerWidth = window_1.innerWidth);
    	}

    	const click_handler = () => {
    		logout();
    	};

    	const click_handler_1 = () => {
    		logout();
    	};

    	$$self.$capture_state = () => ({
    		Router: Router$1,
    		Route: Route$1,
    		Link: Link$1,
    		link,
    		Main,
    		Articles: Articles$1,
    		Gallery: Gallery$1,
    		Comments: Comments$1,
    		Login,
    		Register,
    		Profile,
    		Admin,
    		BigArticle: Big_article,
    		BurgerMenu,
    		Admin_articles: Articles,
    		Admin_comments: Comments,
    		Admin_comms: Comms,
    		Admin_footer: Footer,
    		Admin_menu: Menu,
    		Admin_settings: Settings,
    		Admin_slider: Slider,
    		Admin_users: Users,
    		Admin_gallery: Gallery,
    		settings,
    		getSettings,
    		sleep,
    		color,
    		logout,
    		innerWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('innerWidth' in $$props) $$invalidate(1, innerWidth = $$props.innerWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(1, innerWidth = 0);
    	return [settings, innerWidth, color, onwindowresize, click_handler, click_handler_1];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
