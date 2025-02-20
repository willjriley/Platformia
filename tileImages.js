// Load images dynamically based on tile definitions
function loadTileImages() {
    for (let key in tiles) {
        if (tiles[key].image) {
            let image = new Image();
            image.src = tiles[key].image;
            tiles[key].imageObj = image;
        }
    }
}
