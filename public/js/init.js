let level = 1

const imagePaths = {
    human: "assets/Human.png",
    fire: "assets/Fire.png",
    tree: "assets/Tree1.png",
    sapling: "assets/Sapling.png",
    Goblin: "assets/goblin.png",
}

const goldCounterElement = document.getElementById('goldCount')
const scoreCounterElement = document.getElementById('scoreCount')
const livesCounterElement = document.getElementById('livesCount')

let score = 0
let gold = 0
let lives = 0

function main() {
    goldCounterElement.innerText = gold
    scoreCounterElement.innerText = score
    livesCounterElement.innerText = lives
    Game.update()
}

const game = new Game({
    canvas: document.getElementById('mainScreen'),
    width: innerWidth,
    height: innerHeight,
    updateCallBackFunction: main
})