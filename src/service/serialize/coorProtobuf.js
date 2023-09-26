const protobuf = require('protobufjs');
const fs = require('fs');

// Load the .proto file
const protoFilePath = `${__dirname}/data.proto`; // Replace with the actual path
const protoDefinition = fs.readFileSync(protoFilePath, 'utf-8');

// Parse the .proto file and build a Root instance
const root = protobuf.parse(protoDefinition).root;

// Obtain the DataPoint and DataWrapper message types
const DataPoint = root.lookupType('DataPoint');
const DataWrapper = root.lookupType('DataWrapper');

function encodeDataPoints(jsonDataObject) {
    // Extract the data array and time from the JSON object
    const jsonDataArray = jsonDataObject.data;
    const timestamp = jsonDataObject.time;

    // Convert JSON data points to Protocol Buffers format
    const dataPoints = jsonDataArray.map(jsonData => {
        const dataPoint = {
            x: jsonData.x,
            y: jsonData.y,
            z: jsonData.z,
            distance: jsonData.distance,
            color: { value: jsonData.color }, // Use the Color message
        };
        return DataPoint.create(dataPoint);
    });

    // Create the DataWrapper instance
    const dataWrapper = {
        data: dataPoints,
        time: timestamp,
    };

    // Serialize the DataWrapper to bytes
    return DataWrapper.encode(dataWrapper).finish();
}
module.exports = {
    encodeDataPoints,
    DataWrapper
}; 