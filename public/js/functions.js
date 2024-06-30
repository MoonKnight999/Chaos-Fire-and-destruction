function cameraShake(entities = gameObject.getObjectsFromGroup('entity'), intensity = 5, duration = 500) {
    let elapsedTime = 0;
    const shakeInterval = 16; // Roughly 60 times per second

    const shake = setInterval(() => {
        if (elapsedTime >= duration) {
            clearInterval(shake);
            return;
        }

        const offsetX = (Math.random() - 0.5) * intensity * 2;

        entities.forEach(entity => {
            entity.position.x += offsetX;
        });

        // Return entities to their original positions
        setTimeout(() => {
            entities.forEach(entity => {
                entity.position.x -= offsetX;
            });
        }, shakeInterval);

        elapsedTime += shakeInterval;
    }, shakeInterval);
}


function summonFire(position = { x: Math.floor(Math.random() * Game.gameData.canvas.width - 30), y: Math.floor(Math.random() * Game.gameData.canvas.height - 30) }) {
    let fire = new gameObject({
        id: "fire",
        groups: ['fire'],
        imageSrc: imagePaths['fire'],
        position: position,
        collider: new rectangularCollider(position, 16, 16)
    }, () => {

        //Animation
        if (!fire.isInTimeout) {
            fire.isInTimeout = true

            if (fire.isInOriginalSize) {
                setTimeout(() => {
                    fire.image.width = 8
                    fire.position.y += 8
                    fire.isInOriginalSize = false
                    fire.isInTimeout = false
                }, 500);
            }
            else {
                setTimeout(() => {
                    fire.image.width = 16
                    fire.position.y -= 8
                    fire.isInOriginalSize = true
                    fire.isInTimeout = false
                }, 500);
            }
        }


        //Extinguish
        if ((fire.collider.isCollidingWithObjectFromGroup('player') && Input.isKeyDown(" ")) || fire.collider.isCollidingWithObjectFromGroup('helper')) {
            fire.destroy()
            level += 2
            score += 5
            gold += 5
        }
    }, {
        isInOriginalSize: true,
        isInTimeout: false,
        isInSpreadingPhase: false
    })

    //Auto death
    setTimeout(() => {
        fire.destroy()
    }, 5000); //10s
}

function summonTree(position = { x: Math.floor(Math.random() * Game.gameData.canvas.width - 30), y: Math.floor(Math.random() * Game.gameData.canvas.height - 30) }) {
    trees++
    let tree = new gameObject({
        id: "tree",
        groups: ['tree', 'entity'],
        imageSrc: imagePaths['tree'],
        position: position,
        collider: new rectangularCollider(position, 32, 32)
    }, () => {
        if (tree.collider.isCollidingWithObjectFromGroup('fire') && !tree.isBurnt) {
            tree.isBurnt = true
            summonFire({ x: tree.position.x + 16, y: tree.position.y + 16 })
            summonFire()
            summonFire()
            trees--
            tree.destroy()

        }
    }, {
        isBurnt: false
    })
    summonHelper({ x: tree.position.x, y: tree.position.y + 32 }, tree)

}

function summonSapling(position = { x: Math.floor(Math.random() * Game.gameData.canvas.width - 30), y: Math.floor(Math.random() * Game.gameData.canvas.height - 30) }) {
    let sapling = new gameObject({
        id: "sapling",
        groups: ['sapling', 'entity'],
        imageSrc: imagePaths['sapling'],
        position: position,
        collider: new rectangularCollider(position, 16, 16)
    })
    setTimeout(() => {
        summonTree({ x: sapling.position.x, y: sapling.position.y })
        console.log("Sapling: Summoned Tree");
        sapling.destroy()
    }, Math.floor(Math.random() * 1000 + 5000)); //Max: 5s || Min: 1s
}

function summonHelper(position = { x: 0, y: 0 }, parentTree) {
    helpers++
    let helper = new gameObject({
        id: "helper",
        groups: ['helper', 'entity'],
        imageSrc: imagePaths['Goblin'],
        position: position,
        collider: new rectangularCollider(position, 16, 16)
    }, () => {

        if (!gameObject.getObjectsFromGroup('tree').includes(helper.parentTree)) {
            helpers--
            helper.destroy()
        }


        let fires = gameObject.getObjectsFromGroup('fire')
        if (fires.length && !helper.target) {
            helper.target = fires[Math.floor(Math.random() * fires.length)]
        }


        if (gameObject.getObjectsFromGroup('fire').includes(helper.target)) {
            helper.moveTowards(helper.target.position, 2, true, 0)
        }
        else {
            helper.target = null
        }


    }, {
        isMovingTowardsFire: false,
        isLifeTimoutStarted: false,
        target: null,
        "parentTree": parentTree
    })
}

function spawnWeb(position) {
    if (gold < 300) {
        return
    }
    gold = gold - 300
    let web = new gameObject({
        id: "web",
        groups: ['web', 'entity'],
        imageSrc: imagePaths['web'],
        position: position,
        collider: new rectangularCollider(position, 16, 16)
    },()=>{
        if (web.collider.isCollidingWithObjectFromGroup('player') && !web.isWebUsed) {
            web.isWebUsed = true
            PlayerA.position = web.position
            PlayerA.speed = 0
            setTimeout(() => {
                PlayerA.speed = 5
                web.destroy()
            }, 1000); //Holds for 1 sec
        }
    },{
        isWebUsed: false
    })
}