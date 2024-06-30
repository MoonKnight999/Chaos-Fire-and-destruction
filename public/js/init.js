const game = new Game({
    canvas: document.getElementById('mainScreen'),
    width: innerWidth,
    height: innerHeight
})

let level = 1

const imagePaths = {
    human: "assets/Human.png",
    fire: "assets/Fire.png",
    tree: "assets/Tree1.png",
    sapling: "assets/Sapling.png",
    Goblin: "assets/goblin.png",
}