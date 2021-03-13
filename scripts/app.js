let saved_dice = {
    boost: 0,
    setback: 0,
    ability: 0,
    difficulty: 0,
    proficiency: 0,
    challenge: 0,
    force: 0
}

let roll_saved_dice = function () {
    let inputString = `${saved_dice.boost}d101 + ${saved_dice.setback}d102 + ${saved_dice.ability}d103 + ${saved_dice.difficulty}d104 + ${saved_dice.proficiency}d105 + ${saved_dice.challenge}d106 + ${saved_dice.force}d107`
    if (saved_dice.boost || saved_dice.setback || saved_dice.ability || saved_dice.difficulty || 
        saved_dice.proficiency || saved_dice.challenge || saved_dice.force ) {
        document.getElementById("dice-box").classList.remove("hidden")
        gg.roll_dice(inputString);
    }
}

let save_dice = function (type, count) {
    var c = document.getElementById(type).children;
    if (saved_dice[type] == count) {
        // clear saved dice
        saved_dice[type] = 0;
        for (var i = 0; i < c.length; i++) {
            c[i].classList.add('faded');
        }
    } else {
        // set saved dice
        saved_dice[type] = count
        for (var i = 0; i < c.length; i++) {
            if (i < count) {
                c[i].classList.remove('faded');
            } else {
                c[i].classList.add('faded');
            }
        }
    }
}

let clear_saved_dice = function() {   
   document.getElementById("dice-box").classList.add("hidden")
}