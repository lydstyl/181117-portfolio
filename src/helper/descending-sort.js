const descendingSort = function (tab) {
    tab.sort( (a, b) => {
        if (a < b) return true;
        return false
    })
    return tab
}

module.exports = descendingSort