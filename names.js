'use strict';

// Return a Silly Name
function sillyname() {
    // Basic Random
    function rnd(n) { return Math.floor(Math.random()*n) }

    // First Name
    return ["аноним","аноним","аноним","аноним","пользователь",
    "аноним","аноним","пользователь","пользователь","аноним","пользователь","пользователь",
    "аноним","клиент","клиент","пользователь","пользователь","пользователь","пользователь",
    "клиент","клиент","клиент","клиент",
    "клиент","клиент","клиент"][rnd(25)] +

    // Last Name
    ["Waffer","Lilly","Bubblegum","Sand","Fuzzy","Kitty",
    "Puppy","Snuggles","SpacePrincess","Stinky","Lulu",
    "Lala","Sparkle","Glitter",
    "Silver","Golden","Rainbow","Cloud",
    "Rain","Stormy","Wink","Sugar",
    "Twinkle","Star","Halo","Angel"][rnd(25)];
}
