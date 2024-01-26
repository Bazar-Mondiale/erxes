export default {
  "title": "erxes Inc",
  "tagline": "erxes is a free and open fair-code licensed all-in-one growth marketing and management tool for a smoother customer journey",
  "url": "https://www.erxes.org",
  "baseUrl": "/",
  "favicon": "img/favicon.png",
  "organizationName": "erxes",
  "projectName": "erxes",
  "onBrokenLinks": "warn",
  "themeConfig": {
    "googleAnalytics": {
      "trackingID": "UA-87254317-8"
    },
    "algolia": {
      "apiKey": "807b5401b0a7d39f4b0596cd989bba35",
      "indexName": "erxes",
      "algoliaOptions": {},
      "contextualSearch": false,
      "appId": "BH4D9OD16A",
      "searchParameters": {}
    },
    "sidebarCollapsible": true,
    "image": "img/erxes.png",
    "navbar": {
      "logo": {
        "alt": "erxes logo",
        "src": "img/logo_dark.svg",
        "srcDark": "img/logo.svg"
      },
      "items": [
        {
          "to": "introduction/introduction",
          "label": "Documentation",
          "position": "left"
        },
        {
          "to": "/invest",
          "label": "Invest",
          "position": "left"
        },
        {
          "to": "/components/GettingStarted/Introduction",
          "label": "Components",
          "position": "left"
        },
        {
          "to": "pathname:///developers/docs/references",
          "label": "API reference",
          "position": "left"
        },
        {
          "href": "https://github.com/erxes/erxes",
          "position": "right",
          "label": "Star",
          "className": "github-button hide-mobile",
          "data-show-count": "true",
          "data-size": "large",
          "aria-label": "Star erxes/erxes on GitHub"
        },
        {
          "href": "https://github.com/erxes/erxes",
          "label": "GitHub",
          "position": "right"
        }
      ],
      "hideOnScroll": false
    },
    "footer": {
      "style": "dark",
      "links": [
        {
          "title": "Docs",
          "items": [
            {
              "label": "Getting Started",
              "to": "overview/deployment-overview"
            },
            {
              "label": "Installation Guide",
              "to": "/installation/docker/"
            },
            {
              "label": "Administrator`s Guide",
              "to": "/administrator/creating-first-user"
            },
            {
              "label": "Developers Guide",
              "to": "/developer/developer"
            },
            {
              "label": "Graphql API reference",
              "to": "pathname:///developers/docs/references"
            }
          ]
        },
        {
          "title": "Company",
          "items": [
            {
              "label": "About Us",
              "href": "https://erxes.io/team"
            },
            {
              "label": "Blog",
              "to": "/blog"
            },
            {
              "label": "Interviews",
              "to": "/interviews"
            },
            {
              "label": "Case Studies",
              "to": "/caseStudies"
            },
            {
              "label": "Roadmap",
              "href": "https://erxes.io/roadmap"
            },
            {
              "label": "GSoD",
              "href": "/gsod"
            }
          ]
        },
        {
          "title": "Community",
          "items": [
            {
              "label": "Discussions",
              "href": "https://github.com/erxes/erxes/discussions "
            },
            {
              "label": "Discord",
              "href": "https://discord.gg/CEPj6vPh"
            }
          ]
        }
      ],
      "logo": {
        "alt": "erxes Open Source Logo",
        "src": "img/logo.svg",
        "href": "https://erxes.io"
      },
      "copyright": "Copyright © 2022 erxes Inc."
    },
    "colorMode": {
      "defaultMode": "light",
      "disableSwitch": false,
      "respectPrefersColorScheme": false,
      "switchConfig": {
        "darkIcon": "🌜",
        "darkIconStyle": {},
        "lightIcon": "🌞",
        "lightIconStyle": {}
      }
    },
    "docs": {
      "versionPersistence": "localStorage"
    },
    "metadatas": [],
    "prism": {
      "additionalLanguages": []
    },
    "hideableSidebar": false
  },
  "plugins": [
    [
      "@docusaurus/plugin-content-blog",
      {
        "id": "interviews",
        "routeBasePath": "interviews",
        "path": "./interviews"
      }
    ],
    [
      "@docusaurus/plugin-content-blog",
      {
        "id": "caseStudies",
        "routeBasePath": "caseStudies",
        "path": "./caseStudies"
      }
    ]
  ],
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "sidebarPath": "/home/gerelsukh/Documents/erxes/erxes/docs/sidebars.js",
          "routeBasePath": "/",
          "editUrl": "https://github.com/erxes/erxes/edit/erxes-docs-blog/docs",
          "showLastUpdateAuthor": true,
          "showLastUpdateTime": true
        },
        "theme": {
          "customCss": "/home/gerelsukh/Documents/erxes/erxes/docs/src/css/custom.css"
        }
      }
    ]
  ],
  "baseUrlIssueBanner": true,
  "i18n": {
    "defaultLocale": "en",
    "locales": [
      "en"
    ],
    "localeConfigs": {}
  },
  "onBrokenMarkdownLinks": "warn",
  "onDuplicateRoutes": "warn",
  "customFields": {},
  "themes": [],
  "titleDelimiter": "|",
  "noIndex": false
};