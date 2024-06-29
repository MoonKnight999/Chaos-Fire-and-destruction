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