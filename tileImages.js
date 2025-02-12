// Load images dynamically based on tile definitions
function loadTileImages() {
    for (let key in tileDefinitions) {
        if (tileDefinitions[key].image) {
            let image = new Image();
            image.src = tileDefinitions[key].image;
            tileDefinitions[key].imageObj = image;
        }
    }
}
