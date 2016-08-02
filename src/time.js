"use strict";

function dateToUnixTime(d) {
    if (d == null) return null;
    return d.getTime()/1000;
}

function unixTimeToDate(t) {
    if (t == null) return null;
    return new Date(t*1000);
}

function getUnixTime() {
    return dateToUnixTime(new Date());
}
