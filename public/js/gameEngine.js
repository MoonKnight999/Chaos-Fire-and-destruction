
class Game {
    static gameData;
    static allObjects = {};
    static isPaused = false;
    static previousAllObjectsData;

    constructor(config = {
        canvas: document.getElementById("main-screen"),
        width: 600,
        height: 400,
        updateCallBackFunction: false
    }) {
        //Setting properties
        this.canvas = config.canvas
        this.ctx = config.canvas.getContext("2d");

        //Initializing canvas
        this.canvas.width = config.width
        this.canvas.height = config.height

        //Setting update methods
        this.updateMethod = config.updateCallBackFunction || Game.update
        Input.initialize()
        console.log("Game Initialized: ", this);

        //Setting game data
        Game.gameData = this

        //Start
        this.updateMethod()
    }

    static update(updateEachObject = true) {
        //If paused return
        if (Game.isPaused) { return }

        //Updating and rendering each object
        if (updateEachObject) { Game.callUpdateMethodOfEveryObject() }

        Game.previousAllObjectsData = Game.allObjects
        requestAnimationFrame(Game.gameData.updateMethod)

    }

    static callUpdateMethodOfEveryObject() {
        //Clear canvas
        Game.gameData.ctx.clearRect(0, 0, Game.gameData.canvas.width, Game.gameData.canvas.height)

        //Loop for each class
        for (const Class in Game.allObjects) {
            if (Object.hasOwnProperty.call(Game.allObjects, Class)) {
                const allObjectsOfCurrentClass = Game.allObjects[Class];

                allObjectsOfCurrentClass.forEach(object => {
                    //Call update method of each object in Class
                    if (object.hasOwnProperty("updateMethod")) {
                        try {
                            object.updateMethod()
                        } catch (error) {
                            if (!error) {
                                return
                            }
                            console.warn(error, { object });
                            object.updateMethod = () => { }
                        }
                    }

                    //Call render method of each object (if available)
                    if (object.hasOwnProperty("renderMethod") && object.renderMethod) {
                        object.renderMethod()
                    }

                    //Draw each object img (if available)
                    if (object.type == 'gameObject' && object.hasOwnProperty("image") && object.hasOwnProperty("position")) {
                        try {
                            Game.gameData.ctx.drawImage(object.image, object.position.x, object.position.y, object.image.height, object.image.width)
                        } catch (error) {
                            // console.warn(error, object);
                        }
                    }
                    else if(object.type == 'gameObject'){
                        console.warn(`Cant render`, object);
                    }

                });

            }
        }
    }

    static pause() {
        Game.isPaused = true
    }

    static play() {
        Game.isPaused = false
    }



}
class gameObject {
    constructor(entity = {
        id: "unnamedEntity",
        groups: [""],
        imageSrc: new Image(),
        position: { x: 0, y: 0 },
        collider: new rectangularCollider(),
    }, updateMethod = () => { }, ...properties) {
        // Setting properties
        this.id = entity.id || "unnamed";
        this.groups = entity.groups || ["ungrouped"];
        this.image = new Image();
        this.image.src = entity.imageSrc;
        this.collider = entity.collider || new rectangularCollider();
        this.position = entity.position || { x: 0, y: 0 };
        this.updateMethod = updateMethod || Function();

        this.type = "gameObject";

        // Additional Properties
        properties.forEach(property => {
            for (const key in property) {
                this[key] = property[key];
            }
        });

        // Append it to Game.allObjects
        if (!Game.allObjects.hasOwnProperty("gameObject")) {
            Game.allObjects["gameObject"] = [];
        }
        Game.allObjects["gameObject"].push(this);

        //Emit
    }

    destroy(destroyMethod = () => { }) {
        // Call destroyMethod
        destroyMethod();

        // Reset the update method
        this.updateMethod = () => { };

        // Emit removeEntity to server
        // socket.broadcast.emit("removeEntity", this);

        // Remove this and collider from the allObjects list
        Game.allObjects["gameObject"] = Game.allObjects["gameObject"].filter(object => object != this);
        Game.allObjects["rectangularCollider"] = Game.allObjects["rectangularCollider"].filter(object => object != this.collider);
    }

    static getObjectsFromGroup(groupName = "") {
        return Game.allObjects["gameObject"].filter(object => object.groups.includes(groupName));
    }

    moveTowards(targetPosition, speed = 1, movementInAxisOnly = true, reachedDistance=20) {
        //Return if reached
        if (this.distanceTo(targetPosition) <= reachedDistance) {
            return
        }

        // Determine direction to move
        let deltaX = targetPosition.x - this.position.x;
        let deltaY = targetPosition.y - this.position.y;

        // Snap to target position if within speed range
        if (Math.abs(deltaX) <= speed) {
            this.position.x = targetPosition.x;
            this.collider.position.x = targetPosition.x;
            deltaX = 0;  // No need to move in X if already snapped
        }

        if (Math.abs(deltaY) <= speed) {
            this.position.y = targetPosition.y;
            this.collider.position.y = targetPosition.y;
            deltaY = 0;  // No need to move in Y if already snapped
        }

        // Normalize movement vectors
        let moveX = Math.sign(deltaX) * Math.min(Math.abs(deltaX), speed);
        let moveY = Math.sign(deltaY) * Math.min(Math.abs(deltaY), speed);

        // Create temporary collider for X-axis movement
        let tempColliderX = new rectangularCollider(
            { x: this.collider.position.x + moveX, y: this.collider.position.y },
            this.collider.width,
            this.collider.height
        );

        // Check X-axis movement
        if (deltaX !== 0 && tempColliderX.isCollidingWithObjectFromGroup('entity')) {
            this.position.x += moveX;
            this.collider.position.x += moveX;
        }

        //Destroy temporary X-axis collider
        tempColliderX.destroy()

        // If movementInAxisOnly is true, return after moving in the X-axis and distance in x requires further movement
        if (movementInAxisOnly && Math.abs(deltaX) !== 0) {
            return;
        }

        // Create temporary collider for Y-axis movement
        let tempColliderY = new rectangularCollider(
            { x: this.collider.position.x, y: this.collider.position.y + moveY },
            this.collider.width,
            this.collider.height
        );

        // Check Y-axis movement
        if (deltaY !== 0 && tempColliderX.isCollidingWithObjectFromGroup('entity')) {
            this.position.y += moveY;
            this.collider.position.y += moveY;
        }

        //Destroy temporary Y-axis collider
        tempColliderY.destroy()

        // while (this.collider.checkCollision()) {
        //     this.position.y -= speed

        //     if (this.position.y < 0) { //Outside canvas
        //         speed *= -1
        //         this.position.y = targetPosition.y + speed
        //     }
        // }
    }

    findNearestObjectInGroup(groupName, maxDistance = 50, minDistance = 8, returnAllObjectsInRange = false) {
       //Find the objects in range
        let objectsInRange = gameObject.getObjectsFromGroup(groupName).filter(object => this.distanceTo(object.position) <= maxDistance && this.distanceTo(object.position) >= minDistance)
        if (!objectsInRange.toString()) { //Return if no objects in range
            return false
        }

        //Find the nearest object
        let nearestObject = {entity: "", distance: 0}
        objectsInRange.forEach((object, index) => {
            if (this.distanceTo(object) < nearestObject.distance || index == 0) { 
                nearestObject.entity = object
                nearestObject.distance = this.distanceTo(object.position)
            }
        });

        //Return result accordingly
        if (returnAllObjectsInRange) {
            return objectsInRange
        }
        else{
            return nearestObject.entity
        }
    }

    // Distance calculation function
    distanceTo(gameObjectPos = {x: 0, y:0}, returnObject = false) {
        let deltaX = gameObjectPos.x - this.position.x;
        let deltaY = gameObjectPos.y - this.position.y;
        if (returnObject) {
            return { x: deltaX, y: deltaY };
        } else {
            return Math.round(Math.sqrt(deltaX * deltaX + deltaY * deltaY));
        }
    }

    checkCollision() {
        // Check collision with other colliders in the game
        for (let collider of rectangularCollider.allRectangularColliders) {
            if (this.collider.isCollidingWith(collider)) {
                return true;
            }
        }
        return false;
    }


    
}


class rectangularCollider {
    static allRectangularColliders = [];
    constructor(position = { x: 0, y: 0 }, width = 16, height = 16, visible=false, updateMethod = () => { }) {
        // Setting properties
        this.position = position;
        this.width = width;
        this.height = height;
        this.updateMethod = updateMethod;

        if (visible) {
            this.renderMethod = () =>{
                
                Game.gameData.ctx.strokeRect(this.position.x, this.position.y, this.width, this.height)
            }
        }

        this.type = "rectangularCollider";


        // Append it to allObjects
        if (!Game.allObjects.hasOwnProperty("rectangularCollider")) {
            Game.allObjects["rectangularCollider"] = [];
        }
        Game.allObjects["rectangularCollider"].push(this);
        rectangularCollider.allRectangularColliders.push(this);
    }

    destroy(){
        Game.allObjects["rectangularCollider"] = Game.allObjects["rectangularCollider"].filter(collider => collider != this)
        rectangularCollider.allRectangularColliders = rectangularCollider.allRectangularColliders.filter(collider => collider != this)
    }

    isCollidingWith(collider) {
        if (collider == this) {
            return false;
        }

        // Setting up properties to compare
        let self = {
            x: this.position.x,
            y: this.position.y,
            ex: this.position.x + this.width,
            ey: this.position.y + this.height
        };
        let other = {
            x: collider.position.x,
            y: collider.position.y,
            ex: collider.position.x + collider.width,
            ey: collider.position.y + collider.height
        };

        // Check for collision
        return self.x < other.ex && self.ex > other.x && self.y < other.ey && self.ey > other.y;
    }

    isCollidingWithObjectFromGroup(group = "") {
        let collidingEntity = gameObject.getObjectsFromGroup(group).find(entity => this.isCollidingWith(entity.collider));
        return collidingEntity || false;
    }

    checkCollision(){
        // Check collision with other colliders in the game
        for (let collider of rectangularCollider.allRectangularColliders) {
            if (this.isCollidingWith(collider)) {
                return true;
            }
        }
        return false;
    }
}




class Input {
    static keysPressed = {};
    static keysHeld = {};
    static mousePressed = false;
    static mouseX = 0;
    static mouseY = 0;
    static keyPressTimestamps = {};

    static initialize() {
        // Event listeners to track key states
        window.addEventListener('keydown', (event) => this.keyDownHandler(event));
        window.addEventListener('keyup', (event) => this.keyUpHandler(event));
        window.addEventListener('mousedown', (event) => this.mouseDownHandler(event));
        window.addEventListener('mouseup', (event) => this.mouseUpHandler(event));
        window.addEventListener('mousemove', (event) => this.mouseMoveHandler(event));

        // Start the update loop
        this.update();
    }

    static keyDownHandler(event) {
        const key = event.key.toLowerCase();
        this.keysPressed[key.toLowerCase()] = true;
        this.keysHeld[key.toLowerCase()] = true;
        this.keyPressTimestamps[key.toLowerCase()] = Date.now();
    }

    static keyUpHandler(event) {
        const key = event.key.toLowerCase();
        this.keysPressed[key.toLowerCase()] = false;
        this.keysHeld[key.toLowerCase()] = false;
    }

    static mouseDownHandler(event) {
        this.mousePressed = true;
    }

    static mouseUpHandler(event) {
        this.mousePressed = false;
    }

    static mouseMoveHandler(event) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    static isKeyDown(key = '') {
        // Returns true if the key is currently pressed
        return !!this.keysHeld[key.toLowerCase()];
    }

    static isKeyPressed(key = '') {
        // Returns true if the key was just pressed and within 1 second
        const isPressed = !!this.keysPressed[key.toLowerCase()];
        if (isPressed) {
            setTimeout(() => {
                if (Date.now() - this.keyPressTimestamps[key.toLowerCase()] >= 1000) {
                    this.keysPressed[key.toLowerCase()] = false;
                }
            }, 1000);
        }
        return isPressed;
    }

    static isMouseDown(element = null) {
        // Returns true if the mouse is currently pressed
        return {
            pressed: this.mousePressed,
            position: this.getMousePosition(element)
        };
    }

    static getMousePosition(element = null) {
        if (element) {
            const rect = element.getBoundingClientRect();
            return {
                x: this.mouseX - rect.left,
                y: this.mouseY - rect.top
            };
        } else {
            return {
                x: this.mouseX,
                y: this.mouseY
            };
        }
    }

    static update() {
        // Clear keysPressed state
        this.keysPressed = {};

        // Request the next animation frame to keep the update loop going
        requestAnimationFrame(() => this.update());
    }
}

