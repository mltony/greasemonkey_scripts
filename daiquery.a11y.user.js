// ==UserScript==
// @name           Daiquery Accessibility Fixes
// @namespace      http://github.com/mltony/
// @description    Improves the accessibility of Daiquery at Facebook.
// @author         Tony Malykh <tmal@fb.com>
// @copyright 2020
// @license GNU General Public License version 2.0
// @version        2020.1
// @grant GM_log
// @include https://www.internalfb.com/intern/daiquery/*
// ==/UserScript==



function makeHeading(elem, level) {
    elem.setAttribute("role", "heading");
    elem.setAttribute("aria-level", level);
}

function message(text, suppressRepeats) {
    var liveId = "aria_live_announcer";
    var live = document.getElementById(liveId);
    if (live == null) {
        var live = document.createElement("div");
        live.setAttribute("aria-live", "assertive");
        //live.setAttribute("aria-hidden", "true");
        live.id = liveId;
        var body = document.querySelector("body");
        body.prepend(live);
    }
    if (suppressRepeats && live.textContent == text) {
        return;
    }
    // Use a new div so this is treated as an addition, not a text change.
    // Otherwise, the browser will attempt to calculate a diff between old and new text,
    // which could result in partial reporting or nothing depending on the previous text.
    live.innerHTML = "<div></div>";
    live.firstChild.textContent = text;
}

var messageQueue = [];

function messageAsync(text) {
    messageQueue.push(text);
}

var outputElement, lastOutputText;




var timestampDubDub = 0;
function playDubDub() {
    var date = new Date();
    var timestamp = date. getTime();
    if (timestamp - timestampDubDub < 1000) {
        return;
    }
    timestampDubDub = timestamp;
    var audio = new Audio("https://sound.peal.io/ps/audios/000/000/537/original/woo_vu_luvub_dub_dub.wav");
    audio.play();
}
var timestampError = 0;
function playError() {
    var date = new Date();
    var timestamp = date. getTime();
    if (timestamp - timestampError < 1000) {
        return;
    }
    timestampError = timestamp;
    var audio = new Audio("https://www.myinstants.com/media/sounds/erro.mp3");
    audio.play();
}

var timestampEmpty = 0;
function playEmpty() {
    var date = new Date();
    var timestamp = date. getTime();
    if (timestamp - timestampEmpty < 1000) {
        return;
    }
    timestampEmpty = timestamp;
    var audio = new Audio("https://home.fburl.com/~tmal/sounds/delete-object.mp3");
    audio.play();
}

function onNodeAdded(target) {
    for (elem of target.querySelectorAll("div[role=button]")) {
        // removeing role=button
        if (elem.parentElement.tagName.toLowerCase() == "td") {
            elem.setAttribute("role", "");
        }
    }
    
    for (elem of target.querySelectorAll("table._3ney")) {
        // table with results
        playDubDub();
    }

    for (elem of target.querySelectorAll("span")) {
        if (elem.innerHTML.includes("Error notice")) {
            playError();
        }
    }
    
    for (elem of document.querySelectorAll("div._1d4m")) {
        // No rows returned message
        playEmpty();
    }
}

function onClassModified(target) {
    //onNodeAdded(document);
}

var observer = new MutationObserver(function(mutations) {
    for (var mutation of mutations) {
        try {
            if (mutation.type === "childList") {
                for (var node of mutation.addedNodes) {
                    //if (node.nodeType != Node.ELEMENT_NODE)
                        //continue;
                    onNodeAdded(node);
                }
            } else if (mutation.type === "attributes") {
                //if (mutation.attributeName == "class")
                    onClassModified(mutation.target);
            }
        } catch (e) {
            // Catch exceptions for individual mutations so other mutations are still handled.
            GM_log("Exception while handling mutation: " + e);
        }
    }
});
observer.observe(document, {childList: true, attributes: true, subtree: true});

// To install, run:
// python3 -m http.server