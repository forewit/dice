import { gestures } from "./gestures.js";

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.app = {}));
}(this, (function (exports) {
    'use strict';

    let saved_dice = {
        boost: 0,
        setback: 0,
        ability: 0,
        difficulty: 0,
        proficiency: 0,
        challenge: 0,
        force: 0
    }
    
    for (const dice in saved_dice) {
        let elm, counter;
    
        try {
            elm = document.getElementById(dice);
            counter = elm.children[1];
        } catch (e) {
            console.log('Cannot find element with ID:', dice);
            continue
        }
    
        elm.addEventListener('contextmenu', (e) => {
            if (saved_dice[dice] > 0) {
                saved_dice[dice]--;
                counter.innerHTML = saved_dice[dice]
    
                if (saved_dice[dice] == 0) counter.classList.add('hidden');
            }
            e.preventDefault()
        })
    
        elm.addEventListener('click', (e) => {
            saved_dice[dice]++
            counter.innerHTML = saved_dice[dice]
            counter.classList.remove('hidden');
        })
    }
    
    let roll_saved_dice = function () {
        if (saved_dice.boost || saved_dice.setback || saved_dice.ability || saved_dice.difficulty ||
            saved_dice.proficiency || saved_dice.challenge || saved_dice.force) {
    
            let inputString = `${saved_dice.boost}d101 + ${saved_dice.setback}d102 + ${saved_dice.ability}d103 + ${saved_dice.difficulty}d104 + ${saved_dice.proficiency}d105 + ${saved_dice.challenge}d106 + ${saved_dice.force}d107`
            document.getElementById("dice-box").classList.remove("hidden")
            gg.roll_dice(inputString);
        }
    }
    
    let clear_saved_dice = function () {
        document.getElementById("dice-box").classList.add("hidden")
    }
    

    let elm = document.getElementById('ability');
    gestures.on('longClick', () => {
        console.log('long click')
    })
    gestures.on('click', () => {
        console.log('click')
    })
    gestures.start(elm)

    elm = document.getElementById('proficiency');
    gestures.start(elm)

    exports.clear_saved_dice = clear_saved_dice
    exports.roll_saved_dice = roll_saved_dice

    Object.defineProperty(exports, '__esModule', { value: true });
})));