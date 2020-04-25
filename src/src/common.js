/* 
getHierarchy() -> hierarchy
setHierarchy(h)

A hierarchy is a map with itmes of type
    id (as a string) -> array of children
e.g.
{
    "0": ["1"]
    "1": ["2","3"]
}

Dependencies:

*/

"use strict";

//window.hierarchy_cache = {}

function getHierarchy() {
    
    console.log("get hierarchy %o %o", JSON.stringify(window.hierarchy_cache), window.hierarchy_cache);
    if (isDefined(window.hierarchy_cache)) 
        return window.hierarchy_cache;
    
    // build from id, starts and nexts
    var h = {};
    
    eachItem(getItems(), function(id) {
        h[id] = [];
        var current_id = getAttribute(id, "start");
        
        while (isDefined(current_id)) {
            h[id].push(current_id)
            current_id = getAttribute(current_id, "next");
        }
    }); 
    
    console.log("loaded hierarchy %o %o", JSON.stringify(h), h);
    
    window.hierarchy_cache = h;
    return h;
}

function setHierarchy(h) {
    window.hierarchy_cache = h;
    // convert to starts-and-nexts form, first removing all start and next attributes
    setAttributes("start", {});
    setAttributes("next", {});
    
    console.log("converting hierarchy %o %o", JSON.stringify(h), h);
    $.each(h, function(id, childIds) {
        if (childIds.length == 0) return;
        var current_id = childIds[0]
        setAttribute(id, "start", current_id);
        
        // childIds.shift() // drop front - don't, this is in-place (references)!
        eachItem(childIds, function(next_id) {
            if (current_id == next_id)
                return; // skip current_id (first one)
            setAttribute(current_id, "next", next_id);
            current_id = next_id;
        })
    })
            
}




