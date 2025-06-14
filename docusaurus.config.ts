import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'AH',
  tagline: 'Altruistic Hive',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://altruistic-hive.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Altruistic-Hive', // Usually your GitHub org/user name.
  projectName: 'AH', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ko',
    locales: ['en', 'ko'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'AH',
      logo: {
        alt: 'AH Logo',
        src: 'img/AH_W.svg', // 라이트 모드용 로고
        srcDark: 'img/AH_B.svg', // 다크 모드용 로고
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left', // 왼쪽 아이템
          label: 'Projects',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/your-github-username',
          label: 'GitHub',
          position: 'right', // 오른쪽 아이템으로 변경
        },
      ],
    },
    footer: {
      links: [
        {
          title: "Let's connect",
          items: [
            {
              html: `<p class="footer__cta-description">Have a project in mind or just want to say hi? <br />Feel free to reach out.</p>`,
            },
            {
              label: 'your-email@example.com',
              href: 'mailto:your-email@example.com',
              className: 'footer__cta-button'
            }
          ],
        },
        {
          title: 'Follow Me',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/your-github-username',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/your-profile',
            } 
            ],
        },
      ],
      logo: {
        alt: 'My Logo',
        src: 'img/AH_W.svg', // 라이트 모드용 로고
        srcDark: 'img/AH_B.svg', // 다크 모드용 로고
        href: '/',
        width: 50,
        height: 50,
      },
      copyright: `Copyright © ${new Date().getFullYear()} Altruistic Hive. Built by <a href="https:https://til.jungin.kim">JIK</a> with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
