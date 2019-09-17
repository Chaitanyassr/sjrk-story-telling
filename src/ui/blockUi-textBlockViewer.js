/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // an interface for viewing an individual text block
    fluid.defaults("sjrk.storyTelling.blockUi.textBlockViewer", {
        gradeNames: ["sjrk.storyTelling.blockUi"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/storyBlockTextView.handlebars"
                    }
                }
            },
            block: {
                type: "sjrk.storyTelling.block.textBlock"
            }
        }
    });

})(jQuery, fluid);
