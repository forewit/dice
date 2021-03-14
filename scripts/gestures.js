(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.Gestures = factory();
    }
}(this, function () {

    'use strict';

    // PREFERENCES
    const LONG_PRESS_DELAY = 500;
    const DOUBLE_TAP_DELAY = 100;
    const LONG_CLICK_DELAY = 500;
    const DOUBLE_CLICK_DELAY = 100;

    function noop() { };

    function copyTouch(newTouch) {
        return {
            identifier: newTouch.identifier,
            x: newTouch.clientX,
            y: newTouch.clientY
        }
    }

    class Gestures {
        constructor(element) {
            // STATE MANAGEMENT 
            this.elm = element;
            this.dragging = false;
            this.pinching = false;
            this.hypo = undefined;
            this.taps = 0;
            this.lastTouchEndTime = 0;
            this.touch = { identifier: undefined };
            this.mouseMoving = false;
            this.clicks = 0;
            this.mouseupTime = 0;
            this.mouse = {};
            this.callbacks = {};

            // clear all callbacks
            this.clear();

            // bind handlers
            this.blurHandler = this.blurHandle.bind(this);
            this.mousedownHandler = this.mousedownHandle.bind(this);
            this.mousemoveHandler = this.mousemoveHandle.bind(this);
            this.mouseupHandler = this.mouseupHandle.bind(this);
            this.contextmenuHandler = this.contextmenuHandle.bind(this);
            this.touchstartHandler = this.touchstartHandle.bind(this);
            this.touchmoveHandler = this.touchmoveHandle.bind(this);
            this.touchendHandler = this.touchendHandle.bind(this);
        }

        clear() {
            this.callbacks = {
                // mouse callbacks
                click: noop,
                doubleClick: noop,
                longClick: noop,
                rightClick: noop,
                wheel: noop,
                mouseDragStart: noop,
                mouseDragging: noop,
                mouseDragEnd: noop,
                // touch callbacks
                tap: noop,
                longPress: noop,
                doubleTap: noop,
                touchDragStart: noop,
                touchDragging: noop,
                touchDragEnd: noop,
                pinchStart: noop,
                pinching: noop,
                pinchEnd: noop,
                // window callbacks
                blur: noop,
            };
        }

        on(name, callback) {
            let words =  name.split(" ");

            for (let i = 0; i < words.length; i++)
                this.callbacks[words[i]] = callback
        }

        off(name) {
            let words = name.split(" ");
        
            for (let i = 0; i < words.length; i++)
                this.callbacks[words[i]] = noop
        }

        start() {
            var me = this;

            me.elm.addEventListener('touchstart', me.touchstartHandler, { passive: false });
            me.elm.addEventListener('mousedown', me.mousedownHandler, { passive: false });
            me.elm.addEventListener('wheel', me.wheelHandler, { passive: false });
            me.elm.addEventListener('contextmenu', me.contextmenuHandler, { passive: false });
            window.addEventListener('blur', me.blurHandler);
        }

        stop() {
            var me = this;

            me.elm.removeEventListener('touchstart', me.touchstartHandler);
            me.elm.removeEventListener('mousedown', me.mousedownHandler);
            me.elm.removeEventListener('wheel', me.wheelHandler);
            me.elm.removeEventListener('contextmenu', me.contextmenuHandler);
            window.removeEventListener('blur', me.blurHandler);
        }
    
        blurHandle(e) {
            var me = this;

            window.removeEventListener('mousemove', me.mousemoveHandler);
            window.removeEventListener('mouseup', me.mouseupHandler);
    
            me.mouseupTime = new Date();
    
            if (me.mouseMoving) {
                // MOUSE DRAG END DETECTION
                me.callbacks.mouseDragEnd(me.mouse);
            }
    
            me.callbacks.blur();
        }
    
        wheelHandle(e) {
            // avoid using this.mouse so that wheel events don't override mouse move events
            let point = { x: e.clientX, y: e.clientY };
    
            // WHEEL DETECTION
            this.callbacks.wheel(point, e.deltaY);
    
            e.preventDefault();
            e.stopPropagation();
        }
    
        contextmenuHandle(e) { e.preventDefault(); }
    
        mousedownHandle(e) {
            var me = this;

            me.mouseMoving = false;
    
            window.addEventListener('mousemove', me.mousemoveHandler, { passive: false });
            window.addEventListener('mouseup', me.mouseupHandler);
            me.mouse = { x: e.clientX, y: e.clientY };
    
            // LONGCLICK DETECTION
            window.setTimeout(function () {
                let now = new Date();
                if (now - me.mouseupTime >= LONG_CLICK_DELAY && !me.mouseMoving) {
                    window.removeEventListener('mousemove', me.mousemoveHandler);
                    window.removeEventListener('mouseup', me.mouseupHandler);
                    me.callbacks.longClick(me.mouse);
                }
            }, LONG_CLICK_DELAY)
    
            e.preventDefault();
            e.stopPropagation();
        }
    
        mousemoveHandle(e) {
            var me = this;

            // MOUSE DRAG START DETECTION
            if (!me.mouseMoving) me.callbacks.mouseDragStart(me.mouse);
    
            me.mouseMoving = true;
    
            me.mouse = { x: e.clientX, y: e.clientY };
    
            // MOUUSE DRAGGING DETECTION
            me.callbacks.mouseDragging(me.mouse);
        }
    
        mouseupHandle(e) {
            var me = this;

            window.removeEventListener('mousemove', me.mousemoveHandler);
            window.removeEventListener('mouseup', me.mouseupHandler);
    
            me.mouseupTime = new Date();
    
            if (!me.mouseMoving) {
                // RIGHT CLICK DETECTION
                if (e.which === 3 || e.button === 2) {
                    me.callbacks.rightClick(me.mouse);
                } else {
                    // CLICK DETECTION
                    if (me.clicks == 0) me.callbacks.click(me.mouse);
    
                    // DOUBLE CLICK DETECTION
                    me.clicks++;
                    window.setTimeout(function () {
                        if (me.clicks > 1) me.callbacks.doubleClick(me.mouse);
                        me.clicks = 0;
                    }, DOUBLE_CLICK_DELAY);
                }
            } else {
                // MOUSE DRAG END DETECTION
                me.callbacks.mouseDragEnd(me.mouse);
            }
        }
    
        touchstartHandle(e) {
            var me = this;

            e.preventDefault();
            e.stopPropagation();
    
            // check if two touches were started simultaneously
            if (e.targetTouches.length > 1) {
                if (e.targetTouches[0] == me.touch.identifier) return;
                else me.pinching = true;
            }
    
            window.addEventListener('touchmove', me.touchmoveHandler, { passive: false });
            window.addEventListener('touchend', me.touchendHandler);
            window.addEventListener('touchcancel', me.touchendHandler);
    
            // update primary touch location
            me.touch = copyTouch(e.targetTouches[0]);
    
            // LONGPRESS DETECTION
            window.setTimeout(function () {
                // cancel long press if in the middle of a gesture
                if (me.dragging || me.pinching) return;
    
                // verify the touch hasn't been released
                let now = new Date();
                if (now - me.lastTouchEndTime >= LONG_PRESS_DELAY) {
                    window.removeEventListener('touchmove', me.touchmoveHandler);
                    window.removeEventListener('touchend', me.touchendHandler);
                    window.removeEventListener('touchcancel', me.touchendHandler);
                    me.dragging = false;
                    me.pinching = false;
                    me.hypo = undefined;
    
                    me.callbacks.longPress(me.touch);
                }
            }, LONG_PRESS_DELAY);
        }
    
        touchmoveHandle(e) {
            var me = this;

            e.preventDefault();
            e.stopPropagation();
    
            if (me.dragging) {
                me.touch = copyTouch(e.targetTouches[0]);
                me.callbacks.touchDragging(me.touch);
                return;
    
            } else if (me.pinching || e.targetTouches.length > 1) {
                me.touch = copyTouch(e.targetTouches[0]);
                let touch2 = copyTouch(e.targetTouches[1]);
                let center = {
                    x: (me.touch.x + touch2.x) / 2,
                    y: (me.touch.y + touch2.y) / 2
                }
    
                let hypo1 = Math.hypot((me.touch.x - touch2.x), (me.touch.y - touch2.y));
                if (me.hypo === undefined) {
                    me.hypo = hypo1;
                    me.callbacks.pinchStart(me.center);
                }
    
                me.pinching = true;
                me.callbacks.pinching(center, hypo1 / me.hypo);
                me.hypo = hypo1;
                return;
            } else {
                me.dragging = true;
                me.callbacks.touchDragStart(me.touch);
                me.touch = copyTouch(e.targetTouches[0]);
                me.callbacks.touchDragging(me.touch);
            }
        }
    
        touchendHandle(e) {
            var me = this;

            if (me.dragging &&
                e.targetTouches.length > 0 &&
                e.targetTouches[0].identifier == me.touch.identifier) {
                return;
            }
    
            me.lastTouchEndTime = new Date();
            window.removeEventListener('touchmove', me.touchmoveHandler);
            window.removeEventListener('touchend', me.touchendHandler);
            window.removeEventListener('touchcancel', me.touchendHandler);
    
            if (me.dragging) {
                me.dragging = false;
                me.callbacks.touchDragEnd();
            } else if (me.pinching) {
                me.pinching = false;
                me.hypo = undefined;
                me.callbacks.pinchEnd()
            } else {
                // TAP DETECTION
                if (me.taps == 0) me.callbacks.tap(me.touch);
    
                // DOUBLE TAP DETECTION
                me.taps++;
                window.setTimeout(function () {
                    if (me.taps > 1) me.callbacks.doubleTap(me.touch);
                    me.taps = 0;
                }, DOUBLE_TAP_DELAY);
            }
        }
    }

    return Gestures;
}));