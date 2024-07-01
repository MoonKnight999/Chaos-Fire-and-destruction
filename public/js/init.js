let level = 1
let PlayerA
const imagePaths = {
    human: "assets/Human.png",
    fire: "assets/Fire.png",
    tree: "assets/Tree1.png",
    sapling: "assets/Sapling.png",
    Goblin: "assets/goblin.png",
    web: "assets/Web.png"
}

const goldCounterElement = document.getElementById('goldCount')
const destroyedTreesCounterElement = document.getElementById('treesDestroyedCount')
const helpersCounterElement = document.getElementById('helpersCount')
const treesCounterElement = document.getElementById('treesCount')

let score = 0
let gold = 100
let helpers = 0
let trees = 0
let destroyedTrees = 0

function main() {
    //Update counters
    goldCounterElement.innerText = gold
    destroyedTreesCounterElement.innerText = destroyedTrees
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

    //Win conditions
    if (Game.allObjects['gameObject'].includes(PlayerA)) {
        if (PlayerA.collider.isCollidingWithObjectFromGroup('helper')) {
            setTimeout(() => {
                alert("Nature WON! : Druid caught the monster")
                location.reload()
            }, 100);
            Game.isPaused = true
        }
        if (PlayerA.collider.isCollidingWithObjectFromGroup('web')) {
            setTimeout(() => {
                alert("Nature WON! : Web caught the monster")
                location.reload()
            }, 100);
            Game.isPaused = true
        }
        if (trees >= 25) {
            setTimeout(() => {
                alert("Nature WON! : 25 trees")
                location.reload()
            }, 100);
            Game.isPaused = true
        }
        if (trees <= 0) {
            setTimeout(() => {
                alert("Monster WON! : 0 trees")
                location.reload()
            }, 100);
            Game.isPaused = true
        }
        if (destroyedTrees >= 50) {
            setTimeout(() => {
                alert("Monster WON! : 50 trees destroyed")
                location.reload()
            }, 100);
            Game.isPaused = true
        }
    }
    

    Game.update()
}

const game = new Game({
    canvas: document.getElementById('mainScreen'),
    width: innerWidth,
    height: innerHeight,
    updateCallBackFunction: main
})

game.ctx.fillStyle = "#cfc6b8" //Fill style: white