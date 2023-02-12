// ==UserScript==
// @name           Bento_FB Accessibility Fixes
// @namespace      http://github.com/mltony/
// @description    Improves the accessibility of Bento at Facebook.
// @author         Tony Malykh <tmal@fb.com>
// @copyright 2020
// @license GNU General Public License version 2.0
// @version        2020.1
// @grant GM_log
// @include https://dev*.*.facebook.com:8090/notebooks/notebooks/*
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

var outputElement, lastOutputText;


function iteration(){
    //message(`infinite loop! hahahahaha hahahahaha hahahahaha qqqqq qqqqq wowowowow hahahahaha `);
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
    if(target.innerHTML.includes("qqqq")) {
        GM_log(`qqqq: ${target.parentElement.innerHTML}`);
    }
    if (target.classList.contains("output_area")) {
        outSubarea = target.querySelector(".output_stdout");
        resultSubarea = target.querySelector(".output_result");
        errorSubarea = target.querySelector(".output_error");
        if (outSubarea != null) {
            var outputPre = outSubarea.firstChild;
            var output = outSubarea.firstChild.textContent;
            GM_log(`output: ${output}`);
            message(output);
            outputElement = outputPre;
            lastOutputText = output;
        }
        if (resultSubarea != null) {
            //GM_log('hahaha1');
            playDubDub();
            //GM_log('hahaha2');
            var resultPre = resultSubarea.firstChild;
            var result = resultSubarea.firstChild.textContent;
            messageAsync(result);
            //setTimeout(iteration, 1000);
        }
        if (errorSubarea != null) {
            playError();
        }
    }

    // code mirror - to remove duplicate  contents of edit boxes
    for (elem of target.querySelectorAll(".CodeMirror-line")) {
        //elem.setAttribute("aria-hidden", "true");
    }

    // outputs of cells and results - mark as landmarks and live regions
    for (elem of target.querySelectorAll("div.output_text")) {
        //role="navigation"
        elem.setAttribute("role", "navigation");
        //aria-live="polite"
        //aria-live="assertive"
        //elem.setAttribute("aria-live", "assertive");
    }
}

function onCharacterData(target, mutation) {
    GM_log(`onCharacterData class=${target.className}`);
    var p = target;
    while(false){
        p = p.parentElement;
        if (p == null) {break;}
        if (p != null) {
            GM_log(`parent =${p.className}`);
            GM_log(`parent :${p.innerHTML}:`);
        }
    }
    //GM_log(`The old value was: ${mutation.oldValue}`);
    //GM_log(`The new value is: ${mutation.newValue}`);

    //message("characterData");
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
                if (mutation.attributeName == "class")
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

// To install, run:
// python3 -m http.server