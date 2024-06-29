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
    
},{
    speed: 3
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
    
},{
    speed: 3
})