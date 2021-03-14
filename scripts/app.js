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
    let elm, counter, gesture;

    try {
        elm = document.getElementById(dice);
        counter = elm.children[1];
    } catch (e) {
        console.log('Cannot find element with ID:', dice);
        continue
    }

    gesture = new Gestures(elm)
    gesture.on('click tap', ()=>{
        // increment counter and add to saved_dice
        saved_dice[dice]++
        counter.innerHTML = saved_dice[dice]
        counter.classList.remove('hidden');
    })
    gesture.on('rightClick', ()=>{
        // decrement counter and remove from saved_dice
        if (saved_dice[dice] > 0) {
            saved_dice[dice]--;
            counter.innerHTML = saved_dice[dice]

            if (saved_dice[dice] == 0) counter.classList.add('hidden');
        }
    })
    gesture.on('longClick longPress', ()=>{
        // clear ounter and reset saved_dice
        saved_dice[dice] = 0;
        counter.classList.add('hidden');
    })
    gesture.start();
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
