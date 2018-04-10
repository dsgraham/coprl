import {VSnackbar} from '../snackbar';
import {VBase} from './base';
import {initialize} from '../initialize';

// Replaces a given element with the contents of the call to the url.
// parameters are appended.
export class VReplaceElement extends VBase {
    constructor(element_id, url, params, event) {
        super();
        this.element_id = element_id;
        this.url = url;
        this.params = params;
        this.event = event;
    }

    call() {
        this.clearErrors();

        var parent_element = document.getElementById(this.params.__parent_id__);
        var FD = null;
        // Automatically pull values out of input controls
        if (this.params.__parent_id__) {
            var parent_element = document.getElementById(this.params.__parent_id__);
            if (parent_element) {
                var value = parent_element.value;
                if (value) {
                    this.params[parent_element.name] = value;
                    delete this.params.__parent_id__;
                }
            }
        }
        
        var httpRequest = new XMLHttpRequest();
        if (!httpRequest) {
            throw new Error('Cannot talk to server! Please upgrade your browser to one that supports XMLHttpRequest.');
            // new VSnackbar('Cannot talk to server! Please upgrade your browser to one that supports XMLHttpRequest.').display();
        }
        var elementId = this.element_id;
        var url = this.url + this.seperator() + this.serialize(this.params);
        var event = this.event;

        var promiseObj = new Promise(function (resolve, reject) {
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    console.log(httpRequest.status + ':' + this.getResponseHeader('content-type'));
                    if (httpRequest.status === 200) {
                        var nodeToReplace = document.getElementById(elementId);
                        nodeToReplace.outerHTML = httpRequest.responseText;
                        var newNode = document.getElementById(elementId);
                        initialize(newNode);
                        resolve([httpRequest.status, this.getResponseHeader('content-type'), httpRequest.responseText]);
                    } else {
                        reject([httpRequest.status, this.getResponseHeader('content-type'), httpRequest.responseText]);
                    }
                }
            };
            console.log('GET:' + url);
            httpRequest.open('GET', url, true);
            httpRequest.setRequestHeader('X-NO-LAYOUT', true);
            httpRequest.send();
        });
        return promiseObj;
    }

    seperator() {
        return this.url.includes("?") ? '&' : '?';
    }

    serialize(obj, prefix) {
        var str = [],
            p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                var k = prefix ? prefix + "[" + p + "]" : p,
                    v = obj[p];
                str.push((v !== null && typeof v === "object") ?
                    this.serialize(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
        return str.join("&");
    }
}
