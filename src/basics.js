/*
eachItem(array, f)
eachDom(dom, f)
setId(n, id)
getId(n)
getIntId(n)
placeCaretAtEnd(htmlelement)
maximum(array of numbers)
getValues(map)
deleteKey(map), inplace
isNull(x)
isDefined(x)
byId(id)

Dependencies:
jQuery
*/

"use strict";

// Iteration
function eachItem(array, f) {
    $.each(array, function(index, item) {
		return f(item);
	});	
}

// Calls f on each jQuery object in the jQuery Object collection dom.
function eachDom(dom, f) {
    $.each(dom, function(index, element) {
		return f($(this));
	});	
}

function setId(n, id) {n.attr("id", id);}
function getId(n) {return n.attr("id");}
function getIntId(n) {return parseInt(getId(n));}
function byId(id) {return $("#"+id);}

function isDefined(x) {return !(x === undefined);}
function isNull(x) {return (x === null);}

// Inplace, o returned for convenience
function deleteKey(o, key) {
    delete o[key]; // Inplace
    return o;
}

function getValues(map) {
    var m = [];
    $.each(map, function(k,v) {
        m.push(v);
    });
    return m;
}

function maximum(array) {
    return Math.max.apply(Math, array);
}

// Focuses the dom el and moves the cursor to the end.
// http://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}