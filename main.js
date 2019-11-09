"use strict";

function dice_initialize() {

    var container = $t.id('dice-box');
    container.style.width = window.innerWidth + 'px';
    container.style.height = window.innerHeight - 3 + 'px';

    $t.dice.use_true_random = false;
    $t.dice.scale = 100;
    //$t.dice.use_shadows = false;
    //$t.dice.dice_color = '#808080';
    //$t.dice.label_color = '#202020';
    //$t.dice.ambient_light_color = 0xff0000;
    //$t.dice.spot_light_color = 0xefdfd5;

    var box = new $t.dice.dice_box(container, { w: window.innerWidth, h: window.innerHeight });
    //box.animate_selector = false;

    $t.bind(window, 'resize', function () {
        container.style.width = window.innerWidth + 'px';
        container.style.height = window.innerHeight - 3 + 'px';
        box.reinit(container, { w: window.innerWidth, h: window.innerHeight });
    });

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

    //throw options
    box.bind_throw($t.id('d4'), function () {
        return $t.dice.parse_notation('d4');
    }, before_roll, after_roll);
    $t.bind($t.id('d4'), ['mouseup', 'touchend'], function (ev) {
        ev.stopPropagation(); box.rolling = false;
    });

    box.bind_throw($t.id('d6'), function () {
        return $t.dice.parse_notation('d6');
    }, before_roll, after_roll);
    $t.bind($t.id('d6'), ['mouseup', 'touchend'], function (ev) {
        ev.stopPropagation(); box.rolling = false;
    });

    box.bind_throw($t.id('d8'), function () {
        return $t.dice.parse_notation('d8');
    }, before_roll, after_roll);
    $t.bind($t.id('d8'), ['mouseup', 'touchend'], function (ev) {
        ev.stopPropagation(); box.rolling = false;
    });

    box.bind_throw($t.id('d10'), function () {
        return $t.dice.parse_notation('d10');
    }, before_roll, after_roll);
    $t.bind($t.id('d10'), ['mouseup', 'touchend'], function (ev) {
        ev.stopPropagation(); box.rolling = false;
    });

    box.bind_throw($t.id('d12'), function () {
        return $t.dice.parse_notation('d12');
    }, before_roll, after_roll);
    $t.bind($t.id('d12'), ['mouseup', 'touchend'], function (ev) {
        ev.stopPropagation(); box.rolling = false;
    });

    box.bind_throw($t.id('d20'), function () {
        return $t.dice.parse_notation('d20');
    }, before_roll, after_roll);
    $t.bind($t.id('d20'), ['mouseup', 'touchend'], function (ev) {
        ev.stopPropagation(); box.rolling = false;
    });

    box.bind_throw($t.id('d100'), function () {
        return $t.dice.parse_notation('d100');
    }, before_roll, after_roll);
    $t.bind($t.id('d100'), ['mouseup', 'touchend'], function (ev) {
        ev.stopPropagation(); box.rolling = false;
    });

    $t.bind($t.id('set'), ['keyup'], function (ev) {
        if (ev.keyCode == 13) {
            ev.stopPropagation(); box.rolling = false;
            box.start_throw(function () {
                return $t.dice.parse_notation($t.id('set').value);
            }, before_roll, after_roll);
        }
    });

    
    box.draw_selector();
    //box.bind_mouse(container, notation_getter, before_roll, after_roll);
}
