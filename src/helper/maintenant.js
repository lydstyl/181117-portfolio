function Maintenant(date) {
    this.year = date.getFullYear()
    this.month = this.twoInt( date.getMonth() + 1 )
    this.day = this.twoInt( date.getDate() )
    this.hours = this.twoInt( date.getHours() )
    this.minutes = this.twoInt( date.getMinutes() )
    this.name = this.year + this.month + this.day + this.hours + this.minutes
}
Maintenant.prototype.twoInt = (int) => {
    int = int.toString()
    if (int.length < 2) {
        int = '0' + int
    }
    return int
}

module.exports = Maintenant;