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
const helpersCounterElement = document.getElementById('helpersCount')
const treesCounterElement = document.getElementById('treesCount')

let score = 0
let gold = 0
let helpers = 0
let trees = 0

function main() {
    goldCounterElement.innerText = gold
    scoreCounterElement.innerText = score
    helpersCounterElement.innerText = helpers
    treesCounterElement.innerText = trees
    Game.update()
}

const game = new Game({
    canvas: document.getElementById('mainScreen'),
    width: innerWidth,
    height: innerHeight,
    updateCallBackFunction: main
})

game.ctx.fillStyle = "#cfc6b8" //Fill style: white