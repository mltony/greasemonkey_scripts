// ==UserScript==
// @name           Bento_next_FB Accessibility Fixes
// @namespace      http://github.com/mltony/
// @description    Improves the accessibility of Bento next at Facebook.
// @author         Tony Malykh <tmal@fb.com>
// @copyright 2021
// @license GNU General Public License version 2.0
// @version        2021.1
// @grant GM_log
// @include https://www.internalfb.com/intern/anp/view/*
// ==/UserScript==

//GM_log("Init1");
//console.log('hello world');

// Example:
// var x = document.getElementsByTagName("H1")[0].getAttribute("class");


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

function grabText ( node , maxDepth ) {
    if ( 3 == node . nodeType ) {
        return node . nodeValue ;
    }
    else if (( 1 == node . nodeType ) && ( 0 < maxDepth )) {
        var result = '' ;
        for(var i = 0 ; i < node . childNodes . length ; i ++ ) {
            result += grabText ( node .childNodes [ i ] , maxDepth - 1);
        }
        return result ;
    }
    return '' ;
}

var outputElement, lastOutputText;
var outputButtons = new Set();

function iteration(){
    //message(`infinite loop! hahahahaha hahahahaha hahahahaha qqqqq qqqqq wowowowow hahahahaha `);
    for (elem of document.querySelectorAll("button[aria-label=\"Clear Output\"]")) {
        if (!outputButtons.has(elem)) {
            elem.setAttribute("aria-hidden", "true");
            textElem = elem.parentElement.nextElementSibling;
            text = "";
            if (textElem != null) {
                text = grabText(textElem, 10);
            }
            if (text.includes("Exception") || text.includes("RuntimeError")) {
                playError();
            } else {
                playDubDub();
            }
            outputButtons.add(elem);
        }
    }
    if ((outputElement != null) && (lastOutputText != null)) {
        var output = outputElement.textContent;
        var l1 = lastOutputText.length;
        var l2 = output.length;
        if (l1 < l2) {
            diff = output.substring(l1, l2);
            message(diff);
        }
        lastOutputText = output;
    }
    for (var text of messageQueue) {
        message(text);
    }
    messageQueue = [];
    setTimeout(iteration, 100);
}

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

function onNodeAdded(target) {
    if (target.classList == null) {
        return;
    }
   
    // =========
    // Finding outputs and making them live regions and landmarks
    for (elem of target.querySelectorAll("div.native-key-bindings")) {
        // Old appears broken
        elem.setAttribute("role", "navigation");
        elem.setAttribute("aria-live", "assertive");
    }
    //for (elem of target.querySelectorAll("div.monaco-editor")) {
    for (elem of target.querySelectorAll("div[role=gridcell]")) {
        elem.parentElement.setAttribute("role", "navigation");
        elem.setAttribute("aria-live", "assertive");
    }
    
    //Wabalabadubdub on clear output button
    for (elem of target.querySelectorAll("button[aria-label=\"Clear Output\"]")) {
        //elem.setAttribute("aria-hidden", "true");
        playDubDub();
    }
    // Checking for keywords like exception and traceback
    text = target.innerHTML.toLowerCase()
    if (target.parentElement != null) {
        if (target.parentElement.classList.contains("native-key-bindings")) {
            if (
                text.includes("exception") ||
                text.includes("traceback") ||
                text.includes("error") ||
                false
            ) {
                playError();
            }
        }
    }
}

function onCharacterData(target, mutation) {
}

function onClassModified(target) {
    onNodeAdded(document);
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
            } else if (mutation.type === "characterData") {
                onCharacterData(mutation.target, mutation);
            }

        } catch (e) {
            // Catch exceptions for individual mutations so other mutations are still handled.
            GM_log("Exception while handling mutation: " + e);
        }
    }
});
observer.observe(document, {childList: true, attributes: true, characterData:true, characterDataOldValue: true,
    subtree: true});
GM_log("Init1");
console.log('hello world');
GM_log("Init2");

setTimeout(iteration, 10);
//playDubDub();
//playError();
// To install, run:
// python3 -m http.server