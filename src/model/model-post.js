const fs = require('fs');
const path = require('path');
const descendingSort = require('../helper/descending-sort.js')

function initFirstPost() {
    const folder = path.join(__dirname, '../data')
    let json = {
        "id": "initFirstPost",
        "postCreationDate": "2018-12-08T12:38:41.755Z",
        "name": "initFirstPost",
        "description": "my description",
        "imgsrc": "https://lydstyl.github.io/CV_WEB_DEV/portfolio/img/html.jpg"
     }
    json = JSON.stringify(json, '', 3);
    fs.writeFileSync( path.join(folder, 'initFirstPost.json'), json, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
    json = JSON.stringify(["initFirstPost"], '', 3);
    fs.writeFileSync(path.join(folder, 'positions.json'), json, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
}
function getPagesNumber(items, pageIems) {
    let tmp = items / pageIems;
    tmp = tmp.toString().split('.');
    let pages = tmp[0];
    if (tmp[1] > 0) {
        pages ++;
    }
    return pages;
}

function getFiles() {
    const dataFolder = path.join( path.dirname(require.main.filename), 'data');
    return fs.readdirSync( dataFolder );
}

function getFilesForPage( itemsByPage, pageNumber ) {
    let tmp = getFiles()
    let files = []
    tmp.forEach(file => {
        if (file != 'positions.json') {
            files.push(file)
        }
    });
    files = descendingSort(files)
    const pageNb = getPagesNumber(files.length, 9);

    let index1 = (pageNumber - 1) * itemsByPage;
    let index2 = index1 + itemsByPage;
    files = files.slice(index1, index2);

    let filesAndPageNb = {
        files: files,
        pageNb: pageNb
    }
    return filesAndPageNb
}

function getPosts(req) {
    let PageNum = 1;
    if (req.params.nb) {
        PageNum = req.params.nb;
    }
    let filesAndPageNb = getFilesForPage( 9, PageNum )
    let files = filesAndPageNb.files
    let posts = [];
    for (let i in files) {
        let file = files[i];
        file = fs.readFileSync( path.dirname(require.main.filename) + '/data/' + file, 'utf8' ); // todo join
        posts.push( JSON.parse(file) )
    }

    // return posts;
    let postsAndPageNb = {
        posts: posts,
        pageNb: filesAndPageNb.pageNb
    }
    return postsAndPageNb
}

module.exports = {
    getPosts: getPosts,
    getFiles: getFiles,
    initFirstPost: initFirstPost
}