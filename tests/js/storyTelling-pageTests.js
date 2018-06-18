/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.testPage", {
        gradeNames: ["sjrk.storyTelling.page"],
        components: {
            uio: {
                options: {
                    terms: {
                        "templatePrefix": "../../node_modules/infusion/src/framework/preferences/html",
                        "messagePrefix": "/src/messages/uio"
                    },
                    "tocTemplate": "../../node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html"
                }
            },
            menu: {
                container: "#testMenu"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.pageTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test page grade",
            tests: [{
                name: "Test events and timing",
                expect: 10,
                sequence: [{
                //     "event": "{pageTest page menu}.events.onControlsBound",
                //     "listener": "jqUnit.assert",
                //     "args": "menu onControlsBound event fired"
                // },
                // {
                    "event": "{pageTest page}.events.onAllUiComponentsReady",
                    "listener": "jqUnit.assert",
                    "args": "onAllUiComponentsReady event fired"
                },
                {
                    "event": "{pageTest page storySpeaker}.events.onCreate",
                    "listener": "jqUnit.assert",
                    "args": "storySpeaker onCreate event fired"
                },
                // ensure the initial state is English
                {
                    func: "{page}.applier.change",
                    args: ["uiLanguage", "en"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{page}.menu.dom.languageLinkSpanish"
                },
                {
                    "event": "{page}.menu.events.onInterfaceLanguageChangeRequested",
                    listener: "jqUnit.assertEquals",
                    args: ["onInterfaceLanguageChangeRequested event fired for Spanish button with correct args", "es", "{arguments}.0.data"]
                },
                {
                    "event": "{page}.menu.events.onControlsBound",
                    "listener": "jqUnit.assert",
                    "args": "menu onControlsBound event fired after uiLanguage change to Spanish"
                },
                {
                    "event": "{page}.uio.prefsEditorLoader.messageLoader.events.onResourcesLoaded",
                    "listener": "jqUnit.assert",
                    "args": "UIO messages reloaded successfully for Spanish button"
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["uiLanguage value is as expected", "es", "{page}.model.uiLanguage"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{page}.menu.dom.languageLinkEnglish"
                },
                {
                    "event": "{page}.menu.events.onInterfaceLanguageChangeRequested",
                    listener: "jqUnit.assertEquals",
                    args: ["onInterfaceLanguageChangeRequested event fired for English button with correct args", "en", "{arguments}.0.data"]
                },
                {
                    "event": "{page}.menu.events.onControlsBound",
                    "listener": "jqUnit.assert",
                    "args": "menu onControlsBound event fired after uiLanguage change to English"
                },
                {
                    "event": "{page}.uio.prefsEditorLoader.messageLoader.events.onResourcesLoaded",
                    "listener": "jqUnit.assert",
                    "args": "UIO messages reloaded successfully for English button"
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["uiLanguage value is as expected", "en", "{page}.model.uiLanguage"]
                }]
            },
            {
                name: "Test storySpeaker",
                expect: 1,
                sequence: [{
                    func: "{page}.storySpeaker.applier.change",
                    args: ["ttsText", "test speech value"]
                },
                {
                    "changeEvent": "{page}.storySpeaker.applier.modelChanged",
                    "path": "ttsText",
                    "listener": "{page}.events.onStoryListenToRequested.fire"
                },
                {
                    "event": "{page}.storySpeaker.events.onSpeechQueued",
                    "listener": "jqUnit.assertEquals",
                    "args": ["Speech queued with expected values", "test speech value", "{arguments}.0"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.pageTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            page: {
                type: "sjrk.storyTelling.testPage",
                container: "#testPage",
                createOnEvent: "{pageTester}.events.onTestCaseStart"
            },
            pageTester: {
                type: "sjrk.storyTelling.pageTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.pageTest"
        ]);
    });

})(jQuery, fluid);
