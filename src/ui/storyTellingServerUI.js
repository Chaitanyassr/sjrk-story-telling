/*
Copyright 2017-2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global sjrk */

"use strict";

/* A classic query string parser via
 * https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 * - "name": the name of the query string variable to retrieve
 * - "url": an optional URL to parse. Uses actual page URL if not provided
 */
sjrk.storyTelling.getParameterByName = function (name, url) {
    if (!url) { url = window.location.href; }
    if (name) { name = name.replace(/[\[\]]/g, "\\$&"); }
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) { return null; }
    if (!results[2]) { return ""; }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

/* Loads a story View page and a particular story from a story ID from the query string
 * - "clientConfig": a collection of client config values consisting of
 *     - "theme": the current theme of the site
 *     - "baseTheme": the base theme of the site
 *     - "authoringEnabled": indicates whether story saving and editing are enabled
 * - "options": additional options to merge into the View page
 */
sjrk.storyTelling.loadStoryFromParameter = function (clientConfig, options) {
    var storyPromise = fluid.promise();

    var storyId = sjrk.storyTelling.getParameterByName("id");

    if (storyId) {
        $.get("/stories/" + storyId, function (data) {
            var retrievedStory = JSON.parse(data);

            options = options || {};
            options.distributeOptions = [{
                "target": "{that story}.options.model",
                "record": retrievedStory
            },{
                "target": "{that}.options.pageSetup.authoringEnabled",
                "record": clientConfig.authoringEnabled
            }];

            // TODO: Move this string to another file and localize it
            if (retrievedStory.title) {
                document.title = retrievedStory.title + " | The Storytelling Project";
            }

            var storyViewComponent = sjrk.storyTelling[clientConfig.theme].page.storyView(options);

            storyPromise.resolve(storyViewComponent);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            storyPromise.reject({
                isError: true,
                message: errorThrown
            });
        });;
    } else {
        storyPromise.reject({
            isError: true,
            message: "Story not loaded: no story ID provided"
        });
    }

    return storyPromise;
};

/* Loads a story Browse page and populates it with a set of stories
 * - "clientConfig": a collection of client config values consisting of
 *     - "theme": the current theme of the site
 *     - "baseTheme": the base theme of the site
 *     - "authoringEnabled": indicates whether story saving and editing are enabled
 * - "options": additional options to merge into the Browse page
 */
sjrk.storyTelling.loadBrowse = function (clientConfig, options) {
    var storiesPromise = fluid.promise();

    $.get("/stories", function (data) {
        var browseResponse = JSON.parse(data);

        options = options || {};
        options.distributeOptions = [{
            "target": "{that storyBrowser}.options.model",
            "record": browseResponse
        },{
            "target": "{that}.options.pageSetup.authoringEnabled",
            "record": clientConfig.authoringEnabled
        }];

        var storyBrowseComponent = sjrk.storyTelling[clientConfig.theme].page.storyBrowse(options);

        storiesPromise.resolve(storyBrowseComponent);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        storiesPromise.reject({
            isError: true,
            message: errorThrown
        });
    });

    return storiesPromise;
};

/* Gets the current theme from the server and loads associated  files if and
 * only if the current theme is not set to the base theme. Once complete, the
 * provided callback function is called and the theme name is passed into it.
 * - "callback": a function to call once everything has completed. Will be called
 *               regardless of whether theme information was specified or retrieved
 */
sjrk.storyTelling.loadThemedPage = function (callback) {
    var loadPromise = fluid.promise();

    var callbackFunction = typeof callback === "function" ? callback : fluid.getGlobalValue(callback);

    $.get("/clientConfig").then(function (data) {
        if (data.theme !== data.baseTheme) {
            sjrk.storyTelling.loadCustomThemeFiles(callbackFunction, data).then(function () {
                loadPromise.resolve(data);
            }, function (jqXHR, textStatus, errorThrown) {
                loadPromise.reject({
                    isError: true,
                    message: errorThrown
                });
            });
        } else {
            callbackFunction(data);
            loadPromise.resolve(data);
        }
    }, function (jqXHR, textStatus, errorThrown) {
        loadPromise.reject({
            isError: true,
            message: errorThrown
        });
    });

    return loadPromise;
};

/* Loads CSS and JavaScript files for the provided theme into the page markup.
 * If JavaScript file loading is successful, the callback function is called.
 * - "callback": a function to call once everything has completed
 * - "clientConfig": a collection of client config values consisting of
 *     - "theme": the current theme of the site
 *     - "baseTheme": the base theme of the site
 *     - "authoringEnabled": indicates whether story saving and editing are enabled
 */
sjrk.storyTelling.loadCustomThemeFiles = function (callback, clientConfig) {
    var loadPromise = fluid.promise();

    var cssUrl = fluid.stringTemplate("/css/%theme.css", {theme: clientConfig.theme});
    var scriptUrl = fluid.stringTemplate("/js/%theme.js", {theme: clientConfig.theme});

    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: cssUrl
    }).appendTo("head");

    $.getScript(scriptUrl, function () {
        if (typeof callback === "function") {
            var callbackResult = callback(clientConfig);
            loadPromise.resolve(callbackResult);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        loadPromise.reject({
            isError: true,
            message: errorThrown
        });
    });

    return loadPromise;
};
