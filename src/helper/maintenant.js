function Maintenant(date) {
    this.year = this.twoIntYear(date.getFullYear())
    this.month = this.twoInt( date.getMonth() + 1 )
    this.day = this.twoInt( date.getDate() )
    this.hours = this.twoInt( date.getHours() )
    this.minutes = this.twoInt( date.getMinutes() )
    // this.name = this.year + this.month + this.day + this.hours + this.minutes
    this.name = this.year + this.month
}
Maintenant.prototype.twoInt = (int) => {
    int = int.toString()
    if (int.length < 2) {
        int = '0' + int
    }
    return int
}
Maintenant.prototype.twoIntYear = (year) => {
    return year.toString().substring(2,4)
}

module.exports = Maintenant;