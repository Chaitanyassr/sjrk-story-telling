/*
Copyright 2018-2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // a UI for viewing/previewing block-based stories
    fluid.defaults("sjrk.storyTelling.ui.storyViewer", {
        gradeNames: ["sjrk.storyTelling.ui"],
        selectors: {
            storyTags: ".sjrkc-st-story-list-tags",
            storyViewerPrevious: ".sjrkc-st-story-viewer-previous"
        },
        blockTypeLookup: {
            "audio": "sjrk.storyTelling.blockUi.audioBlockViewer",
            "image": "sjrk.storyTelling.blockUi.imageBlockViewer",
            "text": "sjrk.storyTelling.blockUi.textBlockViewer",
            "video": "sjrk.storyTelling.blockUi.videoBlockViewer"
        },
        events: {
            onStoryViewerPreviousRequested: null,
            onStoryUpdatedFromBlocks: null
        },
        listeners: {
            "onReadyToBind.bindStoryViewerPreviousControl": {
                "this": "{that}.dom.storyViewerPrevious",
                "method": "click",
                "args": ["{that}.events.onStoryViewerPreviousRequested.fire"]
            }
        },
        components: {
            // represents the story data
            story: {
                type: "sjrk.storyTelling.story",
                options: {
                    model: null
                    // This content is here to aid in work on styling/aesthetics
                    // model: {
                    //     title: "A simple story",
                    //     content:
                    //     [
                    //         {
                    //             blockType: "text",
                    //             language: "en",
                    //             heading: "First block",
                    //             text: "Here are some story words that form a sentence"
                    //         },
                    //         {
                    //             blockType: "image",
                    //             language: "de",
                    //             heading: "Second block",
                    //             imageUrl: "/tests/img/obliterationroom.jpg",
                    //             alternativeText: "The Obliteration Room at the Yayoi Kusama Infinity Rooms exhibit",
                    //             description: "This is a photo of the Obliteration Room at the Art Gallery of Ontario"
                    //         },
                    //         {
                    //             blockType: "audio",
                    //             language: "es",
                    //             heading: "Third block",
                    //             mediaUrl: "/tests/audio/Leslie_s_Strut_Sting.mp3",
                    //             alternativeText: "Leslie's Strut Sting from the YouTube Audio Library",
                    //             description: "A small band led by a guitar playing a 'sting' sound, then ending"
                    //         },
                    //         {
                    //             blockType: "video",
                    //             language: "pt",
                    //             heading: "Fourth block",
                    //             mediaUrl: "/tests/video/shyguy_and_rootbeer.mp4",
                    //             alternativeText: "Two cats sitting in a window on a sunny day, one of them grooming the other",
                    //             description: "Shyguy and Rootbeer sitting in the window, Rootbeer grooming Shyguy, both seem happy"
                    //         }
                    //     ],
                    //     author: "The usual author",
                    //     language: "en",
                    //     tags: ["test", "story", "simple"]
                    // }
                }
            },
            orator: {
                type: "fluid.orator",
                container: "{that}.dom.storyContainer",
                createOnEvent: "{templateManager}.events.onTemplateRendered",
                options: {
                    selectors: {
                        content: ".sjrkc-st-story-details"
                    }
                }
            },
            templateManager: {
                options: {
                    model: {
                        dynamicValues: {
                            story: "{story}.model"
                        }
                    },
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/storyViewer.handlebars"
                    }
                }
            },
            // for dynamically rendering the story block by block
            blockManager: {
                type: "sjrk.dynamicViewComponentManager",
                container: "{ui}.options.selectors.storyContent",
                createOnEvent: "{templateManager}.events.onTemplateRendered",
                options: {
                    listeners: {
                        "onCreate.createBlocksFromData": {
                            "funcName": "sjrk.storyTelling.ui.createBlocksFromData",
                            "args": ["{story}.model.content", "{storyViewer}.options.blockTypeLookup", "{blockManager}.events.viewComponentContainerRequested"]
                        },
                        "onCreate.updateStoryFromBlocks": {
                            "funcName": "sjrk.storyTelling.ui.updateStoryFromBlocks",
                            "args": ["{storyViewer}.story", "{that}.managedViewComponentRegistry", "{storyViewer}.events.onStoryUpdatedFromBlocks"],
                            "priority": "last"
                        }
                    },
                    dynamicComponents: {
                        managedViewComponents: {
                            options: {
                                components: {
                                    templateManager: {
                                        options: {
                                            model: {
                                                locale: "{ui}.templateManager.model.locale"
                                            }
                                        }
                                    },
                                    block: {
                                        options: {
                                            gradeNames: ["{that}.getBlockGrade"],
                                            invokers: {
                                                "getBlockGrade": {
                                                    funcName: "sjrk.storyTelling.ui.getBlockGradeFromEventModelValues",
                                                    args: ["{blockUi}.options.additionalConfiguration.modelValues"]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // a UI for previewing block-based stories within the Story Edit page
    fluid.defaults("sjrk.storyTelling.ui.storyPreviewer", {
        gradeNames: ["sjrk.storyTelling.ui.storyViewer"],
        model: {
            shareButtonDisabled: false,
            progressAreaVisible: false,
            responseAreaVisible: false,
            // publishingState can be one of the following values:
            // "unpublished" (the initial state), "publishing", "responseReceived"
            publishingState: "unpublished"
        },
        modelRelay: {
            "publishingState": {
                target: "",
                singleTransform: {
                    type: "fluid.transforms.valueMapper",
                    defaultInputPath: "publishingState",
                    match: {
                        "unpublished": {
                            outputValue: {
                                shareButtonDisabled: false,
                                progressAreaVisible: false,
                                responseAreaVisible: false
                            }
                        },
                        "publishing": {
                            outputValue: {
                                shareButtonDisabled: true,
                                progressAreaVisible: true,
                                responseAreaVisible: false
                            }
                        },
                        "responseReceived": {
                            outputValue: {
                                shareButtonDisabled: false,
                                progressAreaVisible: false,
                                responseAreaVisible: true
                            }
                        }
                    }
                }
            }
        },
        modelListeners: {
            shareButtonDisabled: {
                this: "{that}.dom.storyShare",
                method: "prop",
                args: ["disabled", "{change}.value"]
            },
            progressAreaVisible: {
                this: "{that}.dom.progressArea",
                method: "toggle",
                args: ["{change}.value"]
            },
            responseAreaVisible: {
                this: "{that}.dom.responseArea",
                method: "toggle",
                args: ["{change}.value"]
            }
        },
        selectors: {
            storyShare: ".sjrkc-st-story-share",
            progressArea: ".sjrkc-st-story-share-progress",
            responseArea: ".sjrkc-st-story-share-response",
            responseText: ".sjrkc-st-story-share-response-text"
        },
        events: {
            onShareRequested: null,
            onShareComplete: null
        },
        listeners: {
            "onReadyToBind.bindShareControl": {
                "this": "{that}.dom.storyShare",
                "method": "click",
                "args": ["{that}.events.onShareRequested.fire"]
            },
            "onStoryViewerPreviousRequested.requestContextChange": "{page}.events.onContextChangeRequested.fire",
            "onShareRequested.setStatePublishing": {
                func: "{that}.applier.change",
                args: ["publishingState", "publishing"]
            },
            "onShareComplete": [{
                func: "{that}.applier.change",
                args: ["publishingState", "responseReceived"],
                namespace: "setStateResponseReceived"
            },{
                func: "{that}.setServerResponse",
                args: ["{arguments}.0"],
                namespace: "setServerResponse"
            }]
        },
        invokers: {
            setServerResponse: {
                this: "{that}.dom.responseText",
                method: "text",
                args: ["{arguments}.0"]
            }
        },
        components: {
            templateManager: {
                options: {
                    model: {
                        dynamicValues: {
                            isEditorPreview: true
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
