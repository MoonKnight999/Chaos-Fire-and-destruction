const PlayerA = new gameObject({
    id: "PlayerA",
    groups: ["entity", "player"],
    imageSrc: imagePaths["human"],
    position: {x: 10, y: 10},
    collider: new rectangularCollider({}, 16, 16)
}, 
()=>{// Player A update method
    //Collider
    PlayerA.collider.position = PlayerA.position

    //Movement
    if (Input.isKeyDown('w')) {
        PlayerA.position.y -= PlayerA.speed
    }
    else if (Input.isKeyDown('s')) {
        PlayerA.position.y += PlayerA.speed
    }
    else if (Input.isKeyDown('a')) {
        PlayerA.position.x -= PlayerA.speed
    }
    else if (Input.isKeyDown('d')) {
        PlayerA.position.x += PlayerA.speed
    }

    //Spawn Trees
    if (Input.isKeyDown('t') && PlayerA.canSpawnTree) {
        PlayerA.canSpawnTree = false
        summonSapling({x: PlayerA.position.x, y: PlayerA.position.y + 16})
        setTimeout(() => {
            PlayerA.canSpawnTree = true
        }, 1000);
    }
    
},{
    speed: 3,
    canSpawnTree: true,
    renderMethod: () =>{
        game.ctx.fillText("Player A", PlayerA.position.x-8, PlayerA.position.y - 8)
    }
})

const PlayerB = new gameObject({
    id: "PlayerB",
    groups: ["entity", "player"],
    imageSrc: imagePaths["human"],
    position: {x: 10, y: 10},
    collider: new rectangularCollider({}, 16, 16)
}, 
()=>{// Player B update method
    //Collider
    PlayerB.collider.position = PlayerB.position

    //Movement
    if (Input.isKeyDown('ArrowUp')) {
        PlayerB.position.y -= PlayerB.speed
    }
    else if (Input.isKeyDown('ArrowDown')) {
        PlayerB.position.y += PlayerB.speed
    }
    else if (Input.isKeyDown('ArrowLeft')) {
        PlayerB.position.x -= PlayerB.speed
    }
    else if (Input.isKeyDown('ArrowRight')) {
        PlayerB.position.x += PlayerB.speed
    }

    //Spawn Trees
    if (Input.isMouseDown(Game.gameData.canvas).pressed && PlayerB.canSpawnTree) {
        PlayerB.canSpawnTree = false
        summonSapling(Input.isMouseDown(Game.gameData.canvas).position)
        setTimeout(() => {
            PlayerB.canSpawnTree = true
        }, 1000);
    }
    
},{
    speed: 3,
    canSpawnTree: true,
    renderMethod: () =>{
        game.ctx.fillText("Player B", PlayerB.position.x-8, PlayerB.position.y - 8)
    }
})