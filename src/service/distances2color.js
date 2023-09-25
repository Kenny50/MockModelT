const cmap = require('./cmap');

/**
 * @param Array({x,y,x,distance}) positions 
 * @param {*} max_dist 
 * @returns {x,y,z,distance,color}
 */
function distance2color(positions, max_dist = 15.0) {
    // Normalize distances to the range 0-1
    // Map normalized distances to RGB colors
    const colors = positions.map(position => {
        const index = Math.floor(position.distance * (cmap.length) / max_dist)
        position['color'] = cmap[index];
        return position;
    });

    return colors;
}

/**
 * python version
 * def distance2color(distances, max_dist = 15.0):
    """
    INPUT:
        disances: NDArray with shape(n,)
    """
    cmap = plt.cm.jet_r
    i = np.array(distances) / max_dist
    i = cmap(i)[:, 0 : 3]*255
    return i
 */
module.exports = distance2color;