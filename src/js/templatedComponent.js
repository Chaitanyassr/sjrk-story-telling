/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    // Component that renders its UI using an external
    // HTML file with fluid.stringTemplate syntax
    // see concrete components in storyTelling-story.js for examples

    fluid.defaults("sjrk.storyTelling.templatedComponent", {
        gradeNames: ["fluid.viewComponent"],
        templateConfig: {
            // Used to supply both control and style classes
            // by the getClasses invoker
            classPrefix: "sjrk"
        },
        interfaceControlStrings: {},
        events: {
            "onTemplateRendered": null,
            "onTemplatesLoaded": null,
            "onAllResourcesLoaded": {
                events: {
                    "onTemplatesLoaded": "onTemplatesLoaded"
                }
            }
        },
        listeners: {
            "onAllResourcesLoaded.renderTemplateOnSelf": {
                funcName: "{that}.renderTemplateOnSelf"
            }
        },
        components: {
            templateLoader: {
                type: "sjrk.storyTelling.messageLoader",
                options: {
                    listeners: {
                        "onResourcesLoaded.escalate": "{templatedComponent}.events.onTemplatesLoaded.fire"
                    }
                }
            },
            templateRenderer: {
                type: "gpii.handlebars.renderer.standalone"
            }
        },
        invokers: {
            // Invoker used to create a control and style class for
            // insertion into the template; configured using the
            // templateConfig.classPrefix option
            getClasses: {
                funcName: "sjrk.storyTelling.templatedComponent.getClasses",
                args: ["{that}.options.templateConfig.classPrefix", "{arguments}.0"]
            },
            getLabelId: {
                funcName: "sjrk.storyTelling.templatedComponent.getLabelId",
                args: ["{arguments}.0"]
            },
            // Invoker used to render the component's template and fire
            // the onTemplateRendered event that the applyBinding's listener
            // waits on
            renderTemplateOnSelf: {
                funcName: "sjrk.storyTelling.templatedComponent.renderTemplate",
                args: ["{that}.events.onTemplateRendered",
                    "{that}.container",
                    "componentTemplate",
                    "{templateLoader}.resources.componentTemplate.resourceText",
                    "@expand:jQuery.extend({},{that}.options.interfaceControlStrings,{that}.model)",
                    "{that}.templateRenderer"]
            }
        }
    });

    /* Returns a control and style class based on a prefix and classname
     * Used for templating
     * - "prefix": typically the first piece of the project namespace ("sjrk")
     * - "className": classname to follow after the prefixes
    */
    sjrk.storyTelling.templatedComponent.getClasses = function (prefix, className) {
        return prefix + "c-" + className + " " + prefix + "-" + className;
    };

    /* Generates a unique ID (GUID) for use in labeling form
     * elements in the component template
     * - "prefix": prefix to prepend before the GUID
    */
    sjrk.storyTelling.templatedComponent.getLabelId = function (prefix) {
        return prefix + "-" + fluid.allocateGuid();
    };

    /* Renders a template with gpii-handlebars into the
     * specified container, and fires completionEvent when done
     * - "completionEvent": component even to fire when complete
     * - "container": container to render the template into
     * - "templateName": a handlebars template name
     * - "templateContent": the raw content of the template to be loaded at templateName
     * - "termsCollection": combined terms to use in the handlebars template,
     *            they will be passed through the resolveTerms function to
     *            resolve and substitute references to dynamic values
     * - "renderer": the gpii-handlebars client-side renderer component
    */
    sjrk.storyTelling.templatedComponent.renderTemplate = function (completionEvent, container,
        templateName, templateContent, termsCollection, renderer) {
        renderer.templates.partials.componentTemplate = templateContent;

        var resolvedTerms = sjrk.storyTelling.templatedComponent.resolveTerms(termsCollection);
        var renderedTemplate = renderer.render(templateName, resolvedTerms);

        container.html(renderedTemplate);
        completionEvent.fire();
    };

    // Given a set of terms that may contain a mix of strings, fluid.stringTemplate
    // syntax and other objects, resolve only the strings using stringTemplate
    // against the set of terms.
    sjrk.storyTelling.templatedComponent.resolveTerms = function (terms) {
        return fluid.transform(terms, function (term) {
            // TODO: Make this functionality recursive
            // if (typeof term === "array" || typeof term === "object") {
            //     return sjrk.storyTelling.templatedComponent.resolveTerms(term);
            // } else {
            if (typeof term === "string") {
                return fluid.stringTemplate(term, terms);
            } else {
                return term;
            }
            // }
        });
    };

    // Adds gpii-binder to bind form components and models
    fluid.defaults("sjrk.storyTelling.templatedComponentWithBinder", {
        gradeNames: ["gpii.binder", "sjrk.storyTelling.templatedComponent"],
        // Specified by using grade to bind form markup
        // to component model;
        // see https://github.com/GPII/gpii-binder
        bindings: {
        },
        events: {
            "onBindingApplied": null
        },
        // Applies bindings from gpii-binder after
        // the template is loaded
        listeners: {
            "onTemplateRendered.applyBinding": {
                funcName: "gpii.binder.applyBinding",
                args: "{that}"
            },
            "onTemplateRendered.fireOnBindingApplied": {
                func: "{that}.events.onBindingApplied.fire",
                priority: "after:applyBinding"
            }
        }
    });

    // TODO: refer to Tony's work for further implementation
    // https://wiki.gpii.net/w/Technology_Evaluation_-_Internationalising_and_Localising_UI_strings#Detailed_Review
    fluid.defaults("sjrk.storyTelling.templatedComponentWithLocalization", {
        gradeNames: ["sjrk.storyTelling.templatedComponent"],
        events: {
            "onMessagesLoaded": null,
            "onAllResourcesLoaded": {
                events: {
                    "onMessagesLoaded": "onMessagesLoaded"
                }
            }
        },
        interfaceLocalizationStrings: {},
        components: {
            messageLoader: {
                type: "sjrk.storyTelling.messageLoaderWithLocalization",
                options: {
                    listeners: {
                        "onResourcesLoaded.loadLocalizationMessages": {
                            "func": "sjrk.storyTelling.messageLoaderWithLocalization.loadLocalizationMessages",
                            "args": ["{messageLoader}.resources.componentMessages.resourceText",
                                "{templatedComponentWithLocalization}",
                                "options.interfaceLocalizationStrings"]
                        },
                        "onResourcesLoaded.escalate": "{templatedComponentWithLocalization}.events.onMessagesLoaded.fire"
                    }
                }
            }
        },
        invokers: {
            // Overrides the previous renderTemplateOnSelf invoker with an added
            // reference to the interfaceLocalizationStrings block
            renderTemplateOnSelf: {
                funcName: "sjrk.storyTelling.templatedComponent.renderTemplate",
                args: ["{that}.events.onTemplateRendered",
                    "{that}.container",
                    "componentTemplate",
                    "{templateLoader}.resources.componentTemplate.resourceText",
                    "@expand:jQuery.extend({},{that}.options.interfaceControlStrings,{that}.options.interfaceLocalizationStrings,{that}.model)",
                    "{that}.templateRenderer"]
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.messageLoader", {
        gradeNames: ["fluid.resourceLoader"],
        resources: {
            // Specified by using grade
            // The template file using the
            // fluid.stringTemplate syntax
            // componentTemplate: ""
        },
        terms: {
            "resourcePrefix": "."
        }
    });

    fluid.defaults("sjrk.storyTelling.messageLoaderWithLocalization", {
        gradeNames: ["sjrk.storyTelling.messageLoader"],
        resources: {
            // Specified by using grade
            // The messages file (JSON)
            // componentMessages: ""
        },
        locale: "en",
        defaultLocale: "en"
    });

    sjrk.storyTelling.messageLoaderWithLocalization.loadLocalizationMessages = function (componentMessages, component, path) {
        var mergedEndpoint = $.extend({}, fluid.get(component, path), JSON.parse(componentMessages));
        fluid.set(component, path, mergedEndpoint);
    };

})(jQuery, fluid);