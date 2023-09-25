const colormap = require('colormap');

// Create a jet_r colormap
// 創造 jet colormap 並且反轉，採用 256 色，因為 matplotlib 文件上有寫道
const cmap = colormap({
    colormap: 'jet',
    nshades: 256,
    format: 'rgb',
    alpha: 1
}).reverse();

module.exports = cmap;