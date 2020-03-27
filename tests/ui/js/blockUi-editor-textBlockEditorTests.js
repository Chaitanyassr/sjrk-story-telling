/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // Test component for the text block editor grade
    // This test file also includes tests for the blockUi.editor grade's bindings
    // The Editor on its own does not have any template against which to test
    fluid.defaults("sjrk.storyTelling.blockUi.editor.testTextBlockEditor", {
        gradeNames: ["sjrk.storyTelling.blockUi.editor.textBlockEditor"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        resourcePrefix: "../.."
                    }
                }
            }
        }
    });

    // Test cases and sequences for the text block editor and block editor generally
    fluid.defaults("sjrk.storyTelling.blockUi.editor.textBlockEditorTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Text Block Editor.",
            tests: [{
                name: "Test heading field",
                expect: 3,
                sequence: [{
                    event: "{textBlockEditorTest textBlockEditor binder}.events.onUiReadyToBind",
                    listener: "jqUnit.assert",
                    args: ["The template has been loaded and rendered"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{textBlockEditor}.binder", "heading", "Text about cats"]
                },
                {
                    changeEvent: "{textBlockEditor}.block.applier.modelChanged",
                    path: "heading",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Text about cats", "{textBlockEditor}.block.model.heading"]
                },
                {
                    func: "{textBlockEditor}.block.applier.change",
                    args: ["heading", "Story about cats"]
                },
                {
                    changeEvent: "{textBlockEditor}.block.applier.modelChanged",
                    path: "heading",
                    listener: "sjrk.storyTelling.testUtils.assertElementValue",
                    args: ["{textBlockEditor}.binder.dom.heading", "Story about cats"]
                }]
            },
            {
                name: "Test text field",
                expect: 2,
                sequence: [{
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{textBlockEditor}.binder", "textBlockText", "Hello Shyguy!"]
                },
                {
                    changeEvent: "{textBlockEditor}.block.applier.modelChanged",
                    path: "text",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Hello Shyguy!", "{textBlockEditor}.block.model.text"]
                },
                {
                    func: "{textBlockEditor}.block.applier.change",
                    args: ["text", "Hello Rootbeer!"]
                },
                {
                    changeEvent: "{textBlockEditor}.block.applier.modelChanged",
                    path: "text",
                    listener: "sjrk.storyTelling.testUtils.assertElementValue",
                    args: ["{textBlockEditor}.binder.dom.textBlockText", "Hello Rootbeer!"]
                }]
            }]
        }]
    });

    // Test environment
    fluid.defaults("sjrk.storyTelling.blockUi.editor.textBlockEditorTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            textBlockEditor: {
                type: "sjrk.storyTelling.blockUi.editor.testTextBlockEditor",
                container: "#testTextBlockEditor",
                createOnEvent: "{textBlockEditorTester}.events.onTestCaseStart"
            },
            textBlockEditorTester: {
                type: "sjrk.storyTelling.blockUi.editor.textBlockEditorTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.blockUi.editor.textBlockEditorTest"
        ]);
    });

})(jQuery, fluid);
