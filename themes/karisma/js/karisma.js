/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // Provides the Karisma "El planeta es la escuela" framing to the Storytelling Tool
    fluid.defaults("sjrk.storyTelling.karisma.page", {
        gradeNames: ["sjrk.storyTelling.base.page"],
        components: {
            // masthead/banner section
            karismaMasthead: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-st-page-header-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                model: {
                                    dynamicValues: {
                                        homePageUrl: "/"
                                    }
                                },
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/templates/karisma-masthead.handlebars"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Applies the Karisma shell to the storyView page
    fluid.defaults("sjrk.storyTelling.karisma.page.storyView", {
        gradeNames: ["sjrk.storyTelling.karisma.page", "sjrk.storyTelling.base.page.storyView"]
    });

    // Applies the Karisma shell to the storyBrowse page
    fluid.defaults("sjrk.storyTelling.karisma.page.storyBrowse", {
        gradeNames: ["sjrk.storyTelling.karisma.page", "sjrk.storyTelling.base.page.storyBrowse"],
        components: {
            storyBrowser: {
                options: {
                    browserConfig: {
                        placeholderThumbnailUrl: "img/logo.png"
                    }
                }
            }
        }
    });

    // Applies the Karisma shell to the storyEdit page
    fluid.defaults("sjrk.storyTelling.karisma.page.storyEdit", {
        gradeNames: ["sjrk.storyTelling.karisma.page", "sjrk.storyTelling.base.page.storyEdit"],
        components: {
            karismaSidebarLeft: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-edit-left-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/templates/karisma-sidebar-left.handlebars"
                                }
                            }
                        }
                    }
                }
            },
            karismaSidebarRight: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-edit-right-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/templates/karisma-sidebar-right.handlebars"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // the Karisma "Welcome" page
    fluid.defaults("sjrk.storyTelling.karisma.page.karismaWelcome", {
        gradeNames: ["sjrk.storyTelling.karisma.page"],
        components: {
            menu: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    templatePath: "%resourcePrefix/templates/karisma-menu.handlebars"
                                }
                            }
                        }
                    }
                }
            },
            karismaWelcomer: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-st-welcome",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                model: {
                                    dynamicValues: {
                                        welcomer_browseLinkUrl: "storyBrowse.html",
                                        welcomer_editLinkUrl: "storyEdit.html"
                                    }
                                },
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/templates/karisma-welcome.handlebars"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
