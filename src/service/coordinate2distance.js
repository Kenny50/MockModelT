//座標轉距離
// 原版是 (x2 - x1)* (x2 - x1) + ...
// 因為原點座標是 0, 0
// 所以簡化成 x ** 2
//最後要開根號，用 ** 0.5 效率更好
/**
 * 
 * @param {x,y,z} input_data 
 * @returns {x,y,z,distance}
 */
function coordinate2distance(input_data){
    return input_data.map(item => {
        item['distance'] = (item.x**2 + item.y**2 + item.z**2) ** 0.5
        return item
    })
}

module.exports = coordinate2distance;