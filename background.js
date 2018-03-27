var tabIdMap = {};
var tabIgnored = {};

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}


chrome.tabs.onUpdated.addListener(function mylistener(tabId, changedProps, tab) {
    if (changedProps.status != "complete") {
        return;
    }

    var prev_url = "";
    if (tabId in tabIdMap) {
        prev_url = tabIdMap[tabId];
    }
    tabIdMap[tabId] = tab.url;
    var domain = extractHostname(tab.url);


    if ((prev_url.endsWith('page_blocked.html') || prev_url.endsWith('page_blocked.html#')) &&
        (prev_url.startsWith('chrome-extension://') ||
         prev_url.startsWith('moz-extension://'))) {
        if (tabId in tabIgnored) {
            tabIgnored[tabId].push(domain);
        } else {
            tabIgnored[tabId] = [domain];
        }
        return;
    }

    if ((tabId in tabIgnored) && (tabIgnored[tabId].indexOf(domain) > -1)) {
        return;
    }

    if (domain.startsWith('xn--') || domain.startsWith('www.xn--')) {
        if (tabId in tabIgnored) {
            console.log(tabIgnored[tabId].indexOf(domain));
        }
        chrome.tabs.update(tabId, {url: "page_blocked.html"});
    }

});










