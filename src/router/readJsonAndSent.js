const fs = require('fs');
const path = require('path');

function readJsonAndSent(folderPath, amount, routeHost) {

    var count = 1
    setInterval(() => {
        if (count > amount) {
            count = 1
        } else {
            const filePath = path.join(folderPath, `${count}.json`);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    return;
                }
                routeHost.boradcasting(data);
            });
            count++
        }
    }, 100)
}

module.exports = readJsonAndSent;