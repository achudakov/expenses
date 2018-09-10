let fs = require('fs');
let fileDataObject;

let getFileDataToObject = function(fileName) {
    return new Promise((resolve, reject) =>
        fs.readFile(fileName, 'utf8', (err, contents) => {
            if (err) {
                reject(err);
            }
            try {
                resolve(JSON.parse(contents).raw);
            } catch (e) {
                reject(e)
            }
        })
    );
};

let getCategories = function(dataObject) {
    let categories = [],
        dataByCategories = {};

    if (!!dataObject) {
        dataObject.forEach(object => {
            let category = object && object.category;
            if (object && category && !dataByCategories[category]) {
                dataByCategories[category] = [];
                dataByCategories[category].push(object);
                categories.push(category);
            } else if (category && object) {
                dataByCategories[category].push(object);
            }
        });
    }
    return Promise.resolve(Object.assign({categories :categories}, dataByCategories));
};

let saveToFile = function(data, fileName) {
    fs.open(fileName, 'a', (err, fd) => {
        if (err) {
            throw err;
        }
        fs.appendFile(fd, JSON.stringify(data), 'utf8', (err) => {
            fs.close(fd, (err) => {
                if (err) throw err;
            });
            if (err) throw err;
        });
    });
};

getFileDataToObject('data.json')
    .then(getCategories)
    .then(data => saveToFile(data, 'routes.json'));