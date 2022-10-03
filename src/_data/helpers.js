const { DateTime } = require("luxon");

module.exports = {
  currentYear() {
    const today = new Date();
    return today.getFullYear();
  },
  jsDate( date ) {
    if ( ! date ) {
      return DateTime.now();
    }
    // try JS
    var the_date = DateTime.fromJSDate(date);
    // then try ISO
    if ( the_date.invalid ) {
      the_date = DateTime.fromISO(date);
    }
    // fallback to SQL
    if ( the_date.invalid ) {
      the_date = DateTime.fromSQL(date);
    }
    return the_date;
  }
}