/*
getAttribute(id, key) -> attribute 'key's value x
setAttribute(id, key, x)
getModifyTime(id, key) -> time
removeItem(id)
addItem() -> id
getItems() -> all valid ids
getAttributes(key)
setAttributes(key, v)

Dependencies:
jQuery
*/

"use strict";

// Server communication
// private:
window.cache = {}
window.basedir = 'data/'
function saveJson(name, data) {
    cache[name] = data; // Update cache immediately
    var dataToSend = JSON.stringify(data);
    
    console.log("saving '%s'", name);
    $.post(basedir+name, dataToSend).fail(function() {
    alert("Server not reached - stop entering data, close this page immediately! Start the server, then reload the page.");
    location.href = "TODO error";
    });
    console.log("save '%s': %s", name, dataToSend);
}

// private:
function saveJsonNocache(name, data) {
    var dataToSend = JSON.stringify(data);
    
    console.log("saving '%s'", name);
    $.post(basedir+name, dataToSend).fail(function() {
    alert("Server not reached - stop entering data, close this page immediately! Start the server, then reload the page.");
    location.href = "TODO error";
    });
    console.log("save '%s': %s", name, dataToSend);
}

// private:
function loadJson(name) {
    // in Cache?
    if (isDefined(cache[name]))
        return cache[name];
    
    // Download
    console.log("loading '%s'", name);
    var data;
    $.ajaxSetup({async:false});
    $.get(basedir+name, function(d) {data = d;});
    $.ajaxSetup({async:true});
    
    var pd = {};
    try {
        pd = JSON.parse(data);
    } catch(e) {
        var err = "Server offline? Error parsing json named '"+name+"':\n"+ e+"\nData:\n"+data;
        alert(err); 
        console.error(err);
    }
    
    // Put to cache
    window.cache[name] = pd; 
    console.log("loaded '%s': %o", name, "-omitted-");
	return pd;
}

// Whole access
function getAttributes(key) {
    return loadJson(key+"s");
}

function setAttributes(key, o) {
    saveJson(key+"s", o);
}

// Per id access
function getAttribute(id, key) {
    return getAttributes(key)[id];
}

function setAttribute(id, key, x){
    var o = getAttributes(key);
    o[id] = x;
    setAttributes(key, o)
        
    modified(id, key)
}

function modified(id, key) {
    var n = key+"Modified";
    var v = getAttributes(n);
    v[id] = getUnixTime();
    setAttributes(n, v)
}

function getModifyTime(id, key) {
    var a = getAttribute(id, key+"Modified");
    if (!isDefined(a)) return "";
    return unixTimeToDate(a).toLocaleString();
}


function getItems()  {
    return getValues(getAttributes("id"));
}

window.ATTRIBUTES = ["next", "start", "id", "text", "expanded", "checked"]
    
function addItem()  {
    var id = maximum(getItems())+1;
    console.log("new item, id: "+id)
    setAttribute(id, "id", id);
    setAttribute(id, "expanded", 0);
    setAttribute(id, "checked", 0);
    setAttribute(id, "text", "");
    return id;
}

    
// Hierarchy has to be rebuilt manually after calling this
function removeItem(id) {
    var h = getHierarchy()[id];
    if (!isDefined(h)) h = [];
    
    // Kids
    eachItem(h, function (jd) {
        console.log("removing kid: "+jd+" of "+id);
        removeItem(jd)
    })
    
    // Actual removal
    console.log("removing "+id);
    // Remove its hierarchy
    var k = {}; k[id] = []
    setHierarchy(k)
    // Remove other attributes mentioning it.
    eachItem(window.ATTRIBUTES, function(a) {
        setAttributes(a, deleteKey(getAttributes(a), id));
        var n = a+"Modified";
        setAttributes(n, deleteKey(getAttributes(n), id));
    });
}

