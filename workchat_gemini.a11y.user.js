// ==UserScript==
// @name           FBChat Accessibility Fixes
// @namespace      http://github.com/mltony/
// @description    Improves the accessibility of FBChat
// @author         Tony Malykh <tmal@fb.com>
// @copyright 2019
// @license GNU General Public License version 2.0
// @version        2019.1
// @include https://fb.facebook.com/*
// @include https://fb.workplace.com/*
// ==/UserScript==
// // @grant GM_log
// GM_log("Init1");
console.log('hello world');

// Example:
// var x = document.getElementsByTagName("H1")[0].getAttribute("class");


function makeHeading(elem, level) {
    elem.setAttribute("role", "heading");
    elem.setAttribute("aria-level", level);
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

var liveId = "aria_live_announcer";
var myTimeout = null;
function hideLive() {
    //console.log("h1");
    var live = document.getElementById(liveId);
    live.setAttribute("aria-hidden", "true");
    //console.log("h2");
}
function speakMessage(text, suppressRepeats) {
    //console.log("m1");
    var live = document.getElementById(liveId);
    //console.log("m2");
    if (live == null) {
        var live = document.createElement("div");
        live.setAttribute("aria-live", "assertive");
        live.id = liveId;
        var body = document.querySelector("body");
        body.append(live);
    }
    if (suppressRepeats && live.textContent == text) {
        return;
    }
    live.setAttribute("aria-hidden", "False");
    // Use a new div so this is treated as an addition, not a text change.
    // Otherwise, the browser will attempt to calculate a diff between old and new text,
    // which could result in partial reporting or nothing depending on the previous text.
    live.innerHTML = "<div></div>";
    live.firstChild.textContent = text;
    clearTimeout(myTimeout);
    myTimeout = setTimeout(() => {
        live.innerHTML = "";
        //live.setAttribute("aria-hidden", "true");
    } , 300);
}

function getMessageAuthor(elem) {
    if (elem == null) {
        return "?";
    }
    
    var aas = elem.querySelectorAll("a[aria-label]");
    if (aas.length == 1) {
        return aas[0].getAttribute('aria-label');
    }
    if (aas.length > 1) {
        return "?"
    }
    return getMessageAuthor(elem.parentElement);
}
var timestampLastMessage = 0, countLastMessage = 0;
function readLastMessage() {
    //playDubDub();
    var date = new Date();
    var timestamp = date. getTime();
    if (timestamp - timestampLastMessage < 1000) {
        countLastMessage++;
    } else {
        countLastMessage = 0;
    }
    timestampLastMessage = timestamp;
    //console.log('p1');

    var messages = document.querySelectorAll("div[data-testid=messenger_incoming_text_row]");
    var messagesCount = messages.length;
    //console.log('p2');
    var index = 0;
    if (countLastMessage < messagesCount) {
        index = messagesCount - 1 - countLastMessage;
    } else {
        speakMessage("No more messages");
        return;
    }
    //console.log('p3');
    var message = messages[index];
    //console.log('p3.1');
    var messageText = message.textContent;
    //console.log('p3.2');
    var messageAuthor = getMessageAuthor(message);
    //console.log('p4');
    var s = messageAuthor + ": " + messageText;
    //console.log(s);
    //console.log('p5');
    speakMessage(s);
}

var timestampThreads = 0, countThreads = 0;
function readThreads() {
    //playDubDub();
    var date = new Date();
    var timestamp = date. getTime();
    if (timestamp - timestampThreads < 1000) {
        countThreads++;
    } else {
        countThreads = 0;
    }
    timestampThreads = timestamp;
    //console.log('p1');
    var threadList = document.querySelector("ul[aria-label='Thread list']");
    var threads = threadList.querySelectorAll("li[role=row]")
    var threadsCount = threads.length;
    //console.log('p2');
    var index = 0;
    if (countThreads < threadsCount) {
        index = countThreads;
    } else {
        speakMessage("No more threads");
        return;
    }
    //console.log('p3');
    var thread = threads[index];
    //console.log('p3.1');
    var threadText = thread.textContent;
    //console.log('p3.2');
    var s = threadText;
    //console.log(s);
    //console.log('p5');
    speakMessage(s);
}

function textNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}

function onNodeAdded(target) {
    for (elem of target.querySelectorAll("div[aria-label=Messages]")) {
        // This prevents messages list to be reported as a table. This loop finds only a single node.
        elem.setAttribute("role", "");
        for (elem2 of elem.querySelectorAll("div[role=gridcell]")) {
            if ((elem2.firstChild != null) && (elem2.firstChild.nodeName == "SPAN")) {
                var span = elem2.firstChild;
                if ((span.firstChild != null) && (span.firstChild.nodeName == "DIV") && (!span.firstChild.hasAttributes())) {
                    span.setAttribute("aria-hidden", "true");
                }
            }
        }
    }
    /*
    for (elem of target.querySelectorAll("img[alt^='Seen by ']")) {
        // Hiding "Seen by xxx" messages
        elem.setAttribute("aria-hidden", "true");
    }
    for (elem of document.querySelectorAll("h5")) {
        // Removing useless "Sent Today at" timestamps
        for (text of textNodesUnder(elem)) {
            if (text.textContent.startsWith(" sent ")) {
                text.textContent = " ";
                if ((text.nextSibling != null) && (text.nextSibling.nodeName == '#text')) {
                    text.nextSibling.textContent = "";
                }
            }
        }
    }
    for (elem of document.querySelectorAll("div[aria-label='Message actions']")) {
        // This hides "message action" submenu.
        elem.setAttribute("aria-hidden", "true");
    }
    */
}

function onClassModified(target) {
    onNodeAdded(document);
}

var observer = new MutationObserver(function(mutations) {
    for (var mutation of mutations) {
        try {
            if (mutation.type === "childList") {
                for (var node of mutation.addedNodes) {
                    if (node.nodeType != Node.ELEMENT_NODE)
                        continue;
                    onNodeAdded(node);
                }
            } else if (mutation.type === "attributes") {
                if (mutation.attributeName == "class")
                    onClassModified(mutation.target);
            }
        } catch (e) {
            // Catch exceptions for individual mutations so other mutations are still handled.
            console.log("Exception while handling mutation: " + e);
        }
    }
});
observer.observe(document, {childList: true, attributes: true,
    subtree: true, attributeFilter: ["class"]});

onNodeAdded(document);
document.addEventListener('keydown', function(e) {
  // pressed alt+x
  if (e.keyCode == 88 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
   readLastMessage();
  }
  // pressed alt+Z
  if (e.keyCode == 90 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
   readThreads();
  }  
}, false);
// python3 -m http.server
