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
