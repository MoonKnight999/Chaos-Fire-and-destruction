const PlayerA = new gameObject({
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
            if (gold < 50) {
                return
            }
            gold -= 50
            PlayerA.canSpawnTree = false
            summonSapling(Input.isMouseDown(Game.gameData.canvas).position)
            setTimeout(() => {
                PlayerA.canSpawnTree = true
            }, 500);
        }

        //Spawn web
        if (Input.isKeyDown("b")) {
            spawnWeb(Input.isMouseDown(Game.gameData.canvas).position)
        }

        //Win conditions
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
    }, {
    speed: 5,
    canSpawnTree: true,
    canSpawnFire: true,
    renderMethod: () => {
        game.ctx.fillText("Player A", PlayerA.position.x - 8, PlayerA.position.y - 8)
    }
})