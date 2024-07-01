PlayerA = new gameObject({
    id: "PlayerA",
    groups: ["entity", "player"],
    imageSrc: imagePaths["human"],
    position: { x: 20, y: 20 },
    collider: new rectangularCollider({}, 8, 8)
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
        if (PlayerA.canSpawnFire) {
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
            if (gold < 10) {
                return
            }
            gold -= 10
            PlayerA.canSpawnTree = false
            summonSapling(Input.isMouseDown(Game.gameData.canvas).position)
            setTimeout(() => {
                PlayerA.canSpawnTree = true
            }, 500);
        }

        //Spawn web
        if (Input.isKeyDown("b") && PlayerA.canSpawnWeb) {
            if (gold < 0) {
                return
            }
            PlayerA.canSpawnWeb = false
            gold = gold - 0
            setTimeout(() => {
                PlayerA.canSpawnWeb = true
            }, 200);
            spawnWeb(Input.isMouseDown(Game.gameData.canvas).position)
        }

    }, {
    speed: 3,
    canSpawnTree: true,
    canSpawnFire: true,
    canSpawnWeb: true,
    renderMethod: () => {
        game.ctx.fillText("Player A", PlayerA.position.x - 8, PlayerA.position.y - 8)
    }
})