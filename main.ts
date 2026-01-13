/**
 * Note on Memory:
 * 
 * If you find the micro:bit starts acting glitchy or slow after adding 10-20 games, it is usually because of RAM (the let variables) rather than the code itself. Using functions (as I did above) helps keep the memory clean!
 * 
 * Would you like me to adjust the difficulty of the Tug of War game or change any of the colors used in the new modes?
 */
function runTugOfWar () {
    Strip_A.clear()
    Strip_A.setPixelColor(tugPos, neopixel.colors(NeoPixelColors.Blue))
    Strip_A.show()
    if (input.buttonIsPressed(Button.A)) {
        tugPos += -1
    }
    if (input.buttonIsPressed(Button.B)) {
        tugPos += 1
    }
    if (tugPos < 0) {
        celebrate(neopixel.colors(NeoPixelColors.Red))
    }
    if (tugPos > Strip_Length) {
        celebrate(neopixel.colors(NeoPixelColors.Green))
    }
}
// --- GAME 0: ORIGINAL RACE ---
function runOriginalRace () {
    if (A > Round * Strip_Length - 2 && Green_Won == 0) {
        Red_Won = 1
        celebrate(neopixel.colors(NeoPixelColors.Red))
    }
    if (B > Round * Strip_Length - 2 && Red_Won == 0) {
        Green_Won = 1
        celebrate(neopixel.colors(NeoPixelColors.Green))
    }
}
// --- SELECTION LOGIC ---
input.onButtonPressed(Button.A, function () {
    if (Selection_Active) {
        Game_Mode += 1
        if (Game_Mode > 5) {
            Game_Mode = 0
        }
        basic.showNumber(Game_Mode)
    } else {
        // Original Racing Game Logic for A
        if (Game_Mode == 0 && A <= Round * Strip_Length - 2) {
            A += 1
            updateRace()
        }
    }
})
// --- SHARED RESET/CELEBRATE ---
function celebrate (color: number) {
    for (let index = 0; index < 25; index++) {
        Strip_A.showColor(color)
        basic.pause(100)
        Strip_A.clear()
        Strip_A.show()
        basic.pause(100)
    }
    // Reset variables for race
    A = 0
    B = 0
    Red_Won = 0
    Green_Won = 0
    tugPos = 30
}
function updateRace () {
    Strip_A.clear()
    Strip_A.setPixelColor(A % Strip_Length, neopixel.colors(NeoPixelColors.Red))
    Strip_A.setPixelColor(B % Strip_Length, neopixel.colors(NeoPixelColors.Green))
    Strip_A.show()
}
// --- GAME 5: LIGHT SENSOR (Strip glows when dark) ---
function runNightLight () {
    light2 = input.lightLevel()
    // Inverse: darker = brighter
    bright = Math.map(light2, 0, 255, 255, 0)
    Strip_A.showColor(neopixel.colors(NeoPixelColors.Orange))
    Strip_A.setBrightness(bright)
    Strip_A.show()
}
input.onButtonPressed(Button.B, function () {
    if (!(Selection_Active) && Game_Mode == 0 && B <= Round * Strip_Length - 2) {
        B += 1
        updateRace()
    }
})
// --- GAME 4: LEVEL METER (Tilt to light up strip) ---
function runLevelMeter () {
    // -90 to 90
    roll = input.rotation(Rotation.Roll)
    mapped = Math.map(roll, -90, 90, 0, Strip_Length)
    Strip_A.clear()
    Strip_A.range(0, mapped).showColor(neopixel.colors(NeoPixelColors.Purple))
    Strip_A.show()
}
// --- GAME 3: REFLEX TEST (Wait for White, then click A) ---
function runReflexTest () {
    Strip_A.clear()
    Strip_A.show()
    basic.pause(randint(2000, 5000))
    Strip_A.showColor(neopixel.colors(NeoPixelColors.White))
    start = input.runningTime()
    while (!(input.buttonIsPressed(Button.A))) {
        basic.pause(1)
    }
    score = input.runningTime() - start
    // Lower is better!
    basic.showNumber(score)
    basic.pause(2000)
}
// --- GAME 1: RAINBOW CYCLE (Visual Show) ---
function runRainbowCycle () {
    Strip_A.showRainbow(1, 360)
    while (Game_Mode == 1) {
        Strip_A.rotate(1)
        Strip_A.show()
        basic.pause(50)
    }
}
let score = 0
let start = 0
let mapped = 0
let roll = 0
let bright = 0
let light2 = 0
let Game_Mode = 0
let B = 0
let Red_Won = 0
let Green_Won = 0
let A = 0
let tugPos = 0
let Strip_A: neopixel.Strip = null
let Round = 0
let Strip_Length = 0
let Selection_Active = false
Selection_Active = true
Strip_Length = 60
Round = 1
// --- STARTUP ---
Strip_A = neopixel.create(DigitalPin.P1, Strip_Length, NeoPixelMode.RGB)
basic.showNumber(0)
// --- GAME 2: TUG OF WAR (Mash A vs B to push the light) ---
tugPos = 30
// --- GAME MODES LOOP ---
basic.forever(function () {
    // Wait for selection to finish
    if (Selection_Active) {
        return
    }
    if (Game_Mode == 0) {
        runOriginalRace()
    } else if (Game_Mode == 1) {
        runRainbowCycle()
    } else if (Game_Mode == 2) {
        runTugOfWar()
    } else if (Game_Mode == 3) {
        runReflexTest()
    } else if (Game_Mode == 4) {
        runLevelMeter()
    } else if (Game_Mode == 5) {
        runNightLight()
    }
})
/**
 * Game #,Name,How to Play
 * 
 * 0,The Original Race,Clicking A/B races two dots around the strip.
 * 
 * 1,Rainbow Cycle,A beautiful rotating rainbow animation.
 * 
 * 2,Tug of War,Player A and B mash their buttons to push a blue light to the opponent's side.
 * 
 * 3,Reflex Test,The strip turns White at a random time. Click A as fast as you can to see your reaction time in milliseconds.
 * 
 * 4,Level Meter,Tilt the micro:bit left and right to fill the strip with purple light like a level.
 * 
 * 5,Smart Nightlight,The strip gets brighter as the room gets darker.
 */
// 5 Second Selection Window
control.inBackground(function () {
    basic.pause(5000)
    Selection_Active = false
    basic.clearScreen()
    // Checkmark to show game is starting
    basic.showIcon(IconNames.Yes)
    basic.pause(500)
    basic.clearScreen()
})
