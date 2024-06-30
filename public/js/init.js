let level = 1

const imagePaths = {
    human: "assets/Human.png",
    fire: "assets/Fire.png",
    tree: "assets/Tree1.png",
    sapling: "assets/Sapling.png",
    Goblin: "assets/goblin.png",
    web: "assets/Web.png"
}

const goldCounterElement = document.getElementById('goldCount')
const scoreCounterElement = document.getElementById('scoreCount')
const helpersCounterElement = document.getElementById('helpersCount')
const treesCounterElement = document.getElementById('treesCount')

let score = 0
let gold = 100
let helpers = 0
let trees = 0

function main() {
    //Update counters
    goldCounterElement.innerText = gold
    scoreCounterElement.innerText = score
    helpersCounterElement.innerText = helpers
    treesCounterElement.innerText = trees

    //Update positions of out of canvas elements
    Game.allObjects['gameObject'].forEach(object =>{
        if (object.position.x < 0) {
            object.position.x = 16
        }
        if (object.position.y < 0) {
            object.position.y = 16
        }
        if (object.position.x > Game.gameData.canvas.width) {
            object.position.x = Game.gameData.canvas.width - 16
        }
        if (object.position.y > Game.gameData.canvas.height) {
            object.position.y = Game.gameData.canvas.height-16
        }
    })

    Game.update()
}

const game = new Game({
    canvas: document.getElementById('mainScreen'),
    width: innerWidth,
    height: innerHeight,
    updateCallBackFunction: main
})

game.ctx.fillStyle = "#cfc6b8" //Fill style: white

//Start