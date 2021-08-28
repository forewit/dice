// INITIALIZE DICE*************************************
var container = document.getElementById('dice-box');
container.style.width = document.body.clientWidth + 'px';
container.style.height = document.body.clientHeight + 'px';

//$t.dice.scale = 50;
//$t.dice.use_shadows = false;
//$t.dice.dice_color = '#808080';
//$t.dice.label_color = '#202020';
//$t.dice.ambient_light_color = 0xff0000;
//$t.dice.spot_light_color = 0xefdfd5;

var box = new $t.dice.dice_box(container, { w: document.body.clientWidth / 2, h: document.body.clientHeight / 2 });
//box.animate_selector = false;

function resize() {
    var w = document.body.clientWidth
    var h = document.body.clientHeight;

    container.style.width = w + 'px';
    container.style.height = h + 'px';
    box.reinit(container, { w: w / 2, h: h / 2 });
}

$t.bind(window, ['resize', 'orientationchange'], resize);

// available dice types
let saved_dice = {
    d101: 0, // swffg boost
    d102: 0, // swffg setback
    d103: 0, // swffg ability
    d104: 0, // swffg difficulty
    d105: 0, // swffg proficiency
    d106: 0, // swffg challenge
    d107: 0, // swffg force
    d4: 0,
    d6: 0,
    d8: 0,
    d10: 0,
    d100: 0,
    d12: 0,
    d20: 0
}

// enable roll button
let roll_button = document.getElementById('roll-btn');
let rollGestures = new Gestures(roll_button)
rollGestures.on('click tap', () => { roll_saved_dice(); clear_saved_dice(); })
rollGestures.start();

// enable clear box
let clear_box = document.getElementById('clear-box');
let clearGestures = new Gestures(clear_box)
clearGestures.on('click tap', () => { reset_visibility() })
clearGestures.start();

// enable dice buttons
for (const dice in saved_dice) {
    let elm, counter, gesture;

    try {
        elm = document.getElementById(dice);
        counter = elm.children[1];
    } catch (e) {
        //console.log('Cannot find element with ID:', dice);
        continue
    }

    gesture = new Gestures(elm)
    gesture.on('click tap', () => {
        // increment counter and add to saved_dice
        saved_dice[dice]++
        counter.innerHTML = saved_dice[dice]
        counter.classList.remove('disabled');
        roll_button.classList.remove('disabled');
    })
    gesture.on('rightClick', () => {
        // decrement counter and remove from saved_dice
        if (saved_dice[dice] > 0) {
            saved_dice[dice]--;
            counter.innerHTML = saved_dice[dice]

            if (saved_dice[dice] == 0) counter.classList.add('disabled');
        }

        if (Object.values(saved_dice).every(item => item === 0))
            roll_button.classList.add('disabled');
    })
    gesture.on('longClick longPress', () => {
        // clear ounter and reset saved_dice
        saved_dice[dice] = 0;
        counter.classList.add('disabled');

        if (Object.values(saved_dice).every(item => item === 0))
            roll_button.classList.add('disabled');
    })
    gesture.start();
}
// FINISHED INITIALIZING DICE****************************

function parse_results(results) {
    let numeric_total = 0,
        numeric_result = "",
        swffg_result = "";

    let swffg_counts = {
        s: 0, // success
        a: 0, // advantage
        x: 0, // triumph
        f: 0, // failure
        t: 0, // threat
        y: 0, // dispair
        Z: 0, // light side
        z: 0 // dark side
    }

    // loop through each result
    for (let i = 0; i < results.length; i++) {
        let res = results[i];
        if (typeof res == 'string') {
            for (let j = 0; j < res.length; j++) {
                swffg_counts[res[j]]++;
                if (res[j] == 'x') swffg_counts.s++ // add extra success on triumph
                if (res[j] == 'y') swffg_counts.f++ // add extra failure on dispair
            }
        } else {
            numeric_total += res;
            numeric_result += (numeric_result.length > 0) ? ' + ' + res : res;
        }
    }

    // Add total to numeric result
    if (numeric_total > 0 && isNaN(numeric_result)) numeric_result += ' = ' + numeric_total;

    // Cancel opposite swffg symbols
    if (swffg_counts.x > 0)
        swffg_result += ' ' + 'x'.repeat(swffg_counts.x)

    if (swffg_counts.y > 0)
        swffg_result += ' ' + 'y'.repeat(swffg_counts.y)

    if (swffg_counts.s - swffg_counts.f > 0)
        swffg_result += ' ' + 's'.repeat(swffg_counts.s - swffg_counts.f);

    if (swffg_counts.f - swffg_counts.s > 0)
        swffg_result += ' ' + 'f'.repeat(swffg_counts.f - swffg_counts.s)

    if (swffg_counts.a - swffg_counts.t > 0)
        swffg_result += ' ' + 'a'.repeat(swffg_counts.a - swffg_counts.t);

    if (swffg_counts.t - swffg_counts.a > 0)
        swffg_result += ' ' + 't'.repeat(swffg_counts.t - swffg_counts.a)

    if (swffg_counts.Z > 0)
        swffg_result += ' ' + 'Z'.repeat(swffg_counts.Z)

    if (swffg_counts.z > 0)
        swffg_result += ' ' + 'z'.repeat(swffg_counts.z)

    return [swffg_result, numeric_result];
}

function before_roll(vectors, notation, callback) {

    // do here rpc call or whatever to get your own result of throw.
    // then callback with array of your result, example:
    // callback([2, 2, 2, 2]); // for 4d6 where all dice values are 2.
    callback(notation.result);
}

function after_roll(notation, result) {
    let parsed = parse_results(result);
    let results_elm = document.getElementById('results');

    results_elm.classList.remove('disabled');
    results_elm.children[0].innerHTML = parsed[0];
    results_elm.children[1].innerHTML = parsed[1];
}

let roll_dice = function (inputString) {
    document.getElementById("dice-bar").classList.add("disabled")
    document.getElementById('results').classList.add('disabled');

    box.rolling = false;
    box.start_throw(function () {
        return $t.dice.parse_notation(inputString);
    }, before_roll, after_roll);
}

let clear_dice = function () {
    box.clear()
}

let roll_saved_dice = function () {
    let inputString = "";

    for (const dice in saved_dice) {
        if (dice == "d100") {
            inputString += '+ ' + saved_dice[dice] + 'd100 + ' + saved_dice[dice] + 'd10';
        } else {
            inputString += '+ ' + saved_dice[dice] + dice;
        }
    }


    //let inputString = `${saved_dice.boost}d101 + ${saved_dice.setback}d102 + ${saved_dice.ability}d103 + ${saved_dice.difficulty}d104 + ${saved_dice.proficiency}d105 + ${saved_dice.challenge}d106 + ${saved_dice.force}d107`
    document.getElementById("dice-box").classList.remove("hidden")
    roll_dice(inputString);
}

let clear_saved_dice = function () {
    for (const dice in saved_dice) {
        try {
            elm = document.getElementById(dice);
            counter = elm.children[1];
        } catch (e) {
            //console.log('Cannot find element with ID:', dice);
            continue
        }
        saved_dice[dice] = 0;
        counter.classList.add('disabled');
        roll_button.classList.add('disabled');
    }
}

let reset_visibility = function () {
    clear_dice()
    document.getElementById("dice-bar").classList.remove("disabled")
}