const descendingSort = function (tab) {
    tab.sort( (a, b) => {
        if (a < b) return false;
        return true
    })
    return tab
}

module.exports = descendingSort