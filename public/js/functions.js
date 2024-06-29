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


function summonFire(position={x: Math.floor(Math.random()*Game.gameData.canvas.width-30), y: Math.floor(Math.random()*Game.gameData.canvas.height-30)}) {
    let fire = new gameObject({
        id: "fire",
        groups: ['fire', 'entity'],
        imageSrc: imagePaths['fire'],
        position: position,
        collider: new rectangularCollider(position, 16, 16)
    }, ()=>{

        //Timeout methods
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
            else{
                setTimeout(() => {
                    fire.image.width = 16
                    fire.position.y -= 8
                    fire.isInOriginalSize = true
                    fire.isInTimeout = false
                }, 500);
            }
        }
    },{
        isInOriginalSize: true,
        isInTimeout: false
    })
}

function summonTree(position={x: Math.floor(Math.random()*Game.gameData.canvas.width-30), y: Math.floor(Math.random()*Game.gameData.canvas.height-30)}) {
    let tree = new gameObject({
        id: "tree",
        groups: ['tree', 'entity'],
        imageSrc: imagePaths['tree'],
        position: position,
        collider: new rectangularCollider(position, 16, 16)
    })
}