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
    console.log(dice)
    let elm = document.getElementById(dice);
    let counter = elm.children[0];

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
    let inputString = `${saved_dice.boost}d101 + ${saved_dice.setback}d102 + ${saved_dice.ability}d103 + ${saved_dice.difficulty}d104 + ${saved_dice.proficiency}d105 + ${saved_dice.challenge}d106 + ${saved_dice.force}d107`
    if (saved_dice.boost || saved_dice.setback || saved_dice.ability || saved_dice.difficulty ||
        saved_dice.proficiency || saved_dice.challenge || saved_dice.force) {
        document.getElementById("dice-box").classList.remove("hidden")
        gg.roll_dice(inputString);
    }
}

let clear_saved_dice = function () {
    document.getElementById("dice-box").classList.add("hidden")
}