(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.gg = {}));
}(this, (function (exports) {
    'use strict';

    // INITIALIZE DICE*************************************
    var container = $t.id('dice-box');
    container.style.width = window.innerWidth + 'px';
    container.style.height = window.innerHeight + 'px';

    $t.dice.scale = 100;
    //$t.dice.use_shadows = false;
    //$t.dice.dice_color = '#808080';
    //$t.dice.label_color = '#202020';
    //$t.dice.ambient_light_color = 0xff0000;
    //$t.dice.spot_light_color = 0xefdfd5;

    var box = new $t.dice.dice_box(container, { w: window.innerWidth, h: window.innerHeight });
    //box.animate_selector = false;

    function resize() {
        var w = document.body.clientWidth;
        var h = document.body.clientHeight;

        container.style.width = w + 'px';
        container.style.height = h + 'px';
        box.reinit(container, { w: w, h: h });
    }

    $t.bind(window, ['resize', 'orientationchange'], resize);

    function before_roll(vectors, notation, callback) {

        // do here rpc call or whatever to get your own result of throw.
        // then callback with array of your result, example:
        // callback([2, 2, 2, 2]); // for 4d6 where all dice values are 2.
        callback(notation.result);
    }

    function after_roll(notation, result) {
        var res = result.join(' ');
        if (notation.constant) {
            if (notation.constant > 0) res += ' +' + notation.constant;
            else res += ' -' + Math.abs(notation.constant);
        }
        if (result.length > 1) res += ' = ' +
            (result.reduce(function (s, a) { return s + a; }) + notation.constant);
        console.log(res);
    }

    // DEFINE EXPORTS**************************************
    let roll_dice = function (inputString) {
        box.rolling = false;
        box.start_throw(function () {
            return $t.dice.parse_notation(inputString);
        }, before_roll, after_roll);
    }

    let clear_dice = function () {
        box.clear()
    }

    exports.clear_dice = clear_dice
    exports.roll_dice = roll_dice

    Object.defineProperty(exports, '__esModule', { value: true });
})));