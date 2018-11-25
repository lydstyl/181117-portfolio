function getPagesNumber(items, pageIems) {
    let tmp = items / pageIems;
    tmp = tmp.toString().split('.');
    let pages = tmp[0];
    if (tmp[1] > 0) {
        pages ++;
    }
    return pages;
}

function getFilesForPage( itemsByPage, pageNumber ) {
    const path = require('path');
    const fs = require('fs');
    const dataFolder = path.dirname(require.main.filename) + '/src/data/';
    let files = fs.readdirSync( dataFolder );

    let index1 = (pageNumber - 1) * itemsByPage;
    let index2 = index1 + itemsByPage;

    files = files.slice(index1, index2);
    return files;
}

console.log( getFilesForPage( 9, 1 ) );