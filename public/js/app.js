const PlayerA = new gameObject({
    id: "PlayerA",
    groups: ["entity", "player"],
    imageSrc: imagePaths["human"],
    position: { x: 10, y: 10 },
    collider: new rectangularCollider({}, 16, 16)
},
    () => {// Player A update method
        //Collider
        PlayerA.collider.position = PlayerA.position

        //Movement
        if (Input.isKeyDown('ArrowUp') || Input.isKeyDown('w')) {
            PlayerA.position.y -= PlayerA.speed
        }
        else if (Input.isKeyDown('ArrowDown') || Input.isKeyDown('s')) {
            PlayerA.position.y += PlayerA.speed
        }
        else if (Input.isKeyDown('ArrowLeft') || Input.isKeyDown('a')) {
            PlayerA.position.x -= PlayerA.speed
        }
        else if (Input.isKeyDown('ArrowRight') || Input.isKeyDown('d')) {
            PlayerA.position.x += PlayerA.speed
        }

        //Spawn Fire
        if (Input.isKeyDown('f') && PlayerA.canSpawnFire) {
            PlayerA.canSpawnFire = false

            //Summon fire line
            for (let i = 1; i < 5; i++) {
                summonFire({ x: (PlayerA.position.x - (i*16)), y: PlayerA.position.y })
                summonFire({ x: (PlayerA.position.x + (i*16)), y: PlayerA.position.y })
                summonFire({ x: (PlayerA.position.x), y: PlayerA.position.y + (i*16) })
                summonFire({ x: (PlayerA.position.x), y: PlayerA.position.y - (i*16) })
             }

            setTimeout(() => {
                PlayerA.canSpawnFire = true
            }, 500);
        }

        //Spawn Trees
        if (Input.isMouseDown(Game.gameData.canvas).pressed && PlayerA.canSpawnTree) {
            PlayerA.canSpawnTree = false
            summonSapling(Input.isMouseDown(Game.gameData.canvas).position)
            setTimeout(() => {
                PlayerA.canSpawnTree = true
            }, 500);
        }
    }, {
    speed: 3,
    canSpawnTree: true,
    canSpawnFire: true,
    renderMethod: () => {
        game.ctx.fillText("Player A", PlayerA.position.x - 8, PlayerA.position.y - 8)
    }
})