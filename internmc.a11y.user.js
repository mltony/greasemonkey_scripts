// ==UserScript==
// @name           internmc Accessibility Fixes
// @namespace      http://github.com/mltony/
// @description    Improves the accessibility of internmc
// @author         Tony Malykh <tmal@fb.com>
// @copyright 2019
// @license GNU General Public License version 2.0
// @version        2019.1
// @grant GM_log
// @include https://*.internmc.facebook.com/*
// @include https://www.internalfb.com/*
// ==/UserScript==


function makeHeading(elem, level) {
    elem.setAttribute("role", "heading");
    elem.setAttribute("aria-level", level);
}

function onNodeAdded(target) {
    //for (elem of target.querySelectorAll("._72f6")) {
    for (elem of target.querySelectorAll("[aria-label='Facebook Intern']")) {
        // Standard header for internmc pages
        elem.setAttribute("aria-hidden", "true");
        // <div aria-label="Facebook Intern" role="banner" class="_cnx _1dvi"><div class="_4hl4"><div class="_1510"></div><div class="_4a6s _6556"><i class="img sp_mXbm9TsTwjq_1_5x sx_1cf9d7" data-uibase-classes=":ui:image"></i></div><ul class="uiList _5kae _509- _4ki" data-uibase-classes=":intern:chrome:tabs"><li class="_1ee _i17 _5e-h _5e-g" data-uibase-classes=":intern:chrome:tabs:title-item"><a class="_5get" href="https://our.internmc.facebook.com/intern/diffs/" data-uibase-classes=":ui:link"> Diffs </a></li></ul></div><div class="_3esl" data-uibase-classes=":intern:chrome:blue-bar:jewels"><div data-uibase-classes=":intern:chrome:blue-bar:employee-jewel"><a href="https://our.intern.facebook.com/intern/profile/?id=650288788" class="_4oms" data-uibase-classes=":intern:user-link :intern:user-link :ui:link" target="_top"><img class="_s0 _4ooo _3esr img" data-uibase-classes=":fb:profile-photo" src="https://scontent.xx.fbcdn.net/v/t1.0-1/p56x56/45428171_102382160772906_3637793778808389632_n.jpg?_nc_cat=109&amp;_nc_log=1&amp;_nc_oc=AQnFiaWJkiqO78XHqHS68rraloJ8QZGKT4RMZq9Fvb1Hoiq_Aj-bB-BXajMDC84Nuj8WFwcL_Hw11VYzNHBILoNq&amp;_nc_ht=scontent.xx&amp;oh=b82cf4ceff72fc1f3a1372d0bd8fd504&amp;oe=5CB7C0F6" alt="" aria-label="Tony Malykh" role="img" style="width:24px;height:24px">Tony</a></div><div data-uibase-classes=":intern:chrome:blue-bar:notify-jewel"><div><a aria-haspopup="true" aria-label="Notifications" aria-labelledby="js_6 js_7" href="https://our.internmc.facebook.com/intern/inbox/" data-testid="notify_jewel" class="_4w0c" id="js_6"><span class="_2jwp _5ugh _5ugg _51lp hidden_elem" id="js_7">0</span></a></div><!-- react-mount-point-unstable --></div><div class="_69i5"><button aria-haspopup="true" class="_3wf- _4grw _6gy5 _42ft" type="submit" value="1"><i alt="" class="img sp_4Q6JsuxImal_1_5x sx_26f483"></i><span class="accessible_elem">Bug Nub</span></button><div style="display: inline-block; width: auto;"><button aria-haspopup="true" data-tooltip-content="Dock Settings" data-hover="tooltip" aria-controls="js_d" data-testid="SUIAbstractMenu/button" errortooltipposition="above" theme="[object Object]" use="default" width="auto" class="_3wf- _42ft" type="submit" value="1"><i alt="" class="img sp_4Q6JsuxImal_1_5x sx_db9927"></i><span class="accessible_elem">Settings</span></button></div><div class="_4mpd _69i7"></div></div><!-- react-mount-point-unstable --><div class="_5osd _3esq" data-uibase-classes=":intern:internsearch:typeahead" id="u_0_6"><span><span class="_3rub _58ah"><label class="_58ak _3ct8"><input class="_58al _3rub" placeholder="Search for people, documents, tools..." value=""></label></span></span><!-- react-mount-point-unstable --><button title="Search for people, documents, tools..." class="_5osg" id="u_0_8"></button></div><div data-uibase-classes=":intern:chrome:blue-bar:product-discoverability-jewel"><div class="_72f6" aria-haspopup="true" aria-label="Internal Tools" data-testid="product_discovery_jewel" tabindex="0" role="button" id="js_5"><i alt="" class="img sp_Q-aEDffr5F8_1_5x sx_edf487"></i></div><!-- react-mount-point-unstable --></div></div></div>
        //elem.setAttribute("role", "presentation");
        //makeHeading(elem, 2);
    }
    for (elem of target.querySelectorAll("._73bl")) {
        // Bunnylol results
        makeHeading(elem, 3);
    }
    for (elem of target.querySelectorAll("._4ik4")) {
        // Bunnylol results
        makeHeading(elem, 3);
    }
    for (elem of target.querySelectorAll("._4ik5")) {
        // Bunnylol results
        makeHeading(elem, 3);
    }
    
    //._3_s0._1toe._11fk
    for (elem of target.querySelectorAll("._3_s0._1toe._11fk")) {
        // Before standard header  - some menu items
        elem.setAttribute("aria-hidden", "true");
    }
    
    //fdqkqcqg
    for (elem of target.querySelectorAll(".fdqkqcqg")) {
        // Before standard header  - some menu items
        elem.setAttribute("aria-hidden", "true");
    }
    
}

function onClassModified(target) {
    onNodeAdded(target);
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
            GM_log("Exception while handling mutation: " + e);
        }
    }
});
observer.observe(document, {childList: true, attributes: true,
    subtree: true, attributeFilter: ["class"]});
onNodeAdded(document);
// python3 -m http.server