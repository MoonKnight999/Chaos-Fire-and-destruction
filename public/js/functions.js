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

        //Spread
        if (!fire.isInSpreadingPhase) {
            fire.isInSpreadingPhase = true
            setTimeout(() => {
                summonFire()
            }, 2 / level * 80000);
        }

        //Extinguish
        if ((fire.collider.isCollidingWithObjectFromGroup('player') && Input.isKeyDown(" ")) || fire.collider.isCollidingWithObjectFromGroup('helper')) {
            fire.destroy()
            level += 2
        }
    }, {
        isInOriginalSize: true,
        isInTimeout: false,
        isInSpreadingPhase: false
    })
}

function summonTree(position = { x: Math.floor(Math.random() * Game.gameData.canvas.width - 30), y: Math.floor(Math.random() * Game.gameData.canvas.height - 30) }) {
    let tree = new gameObject({
        id: "tree",
        groups: ['tree', 'entity'],
        imageSrc: imagePaths['tree'],
        position: position,
        collider: new rectangularCollider(position, 16, 16)
    }, () => {
        if (tree.collider.isCollidingWithObjectFromGroup('fire') && !tree.isBurnt) {
            tree.isBurnt = true
            setTimeout(() => {
                summonFire({ x: tree.position.x + 16, y: tree.position.y + 16 })
                summonFire()
                summonFire()
                tree.destroy()
            }, 3000);
        }
    }, {
        isBurnt: false
    })
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
        summonTree(sapling.position)
        sapling.destroy()
    }, Math.floor(Math.random() * 30000 + 10000)); //Max: 40s || Min: 10s
}

function summonHelper(position = { x: Math.floor(Math.random() * Game.gameData.canvas.width - 30), y: Math.floor(Math.random() * Game.gameData.canvas.height - 30) }) {
    let helper = new gameObject({
        id: "helper",
        groups: ['helper', 'entity'],
        imageSrc: imagePaths['Goblin'],
        position: position,
        collider: new rectangularCollider(position, 16, 16)
    }, () => {

        // if (!helper.isLifeTimoutStarted) {
        //     helper.isLifeTimoutStarted = true
        //     setTimeout(() => {
        //         helper.destroy()
        //     }, 10000);
        // }


        let fires = gameObject.getObjectsFromGroup('fire')
        if (fires.length && !helper.target) {
            helper.target = fires[Math.floor(Math.random()*fires.length)]
            console.log('New target: ', helper.target);
        }

        
        if (gameObject.getObjectsFromGroup('fire').includes(helper.target)) {
            helper.moveTowards(helper.target.position, 2, true, 0)
        }
        else{
            helper.target = null
        }


    }, {
        isMovingTowardsFire: false,
        isLifeTimoutStarted: false,
        target: null
    })
}