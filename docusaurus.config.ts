import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'AH',
  tagline: 'Build Together, Grow Together',
  favicon: 'img/favicon.svg',

  customFields: {
    pexelsApiKey: process.env.PEXELS_API_KEY || '',
    githubToken: process.env.GITHUB_TOKEN || '',
  },

  url: 'https://altruistic-hive.org',
  baseUrl: '/',

  organizationName: 'Altruistic-Hive',
  projectName: 'AH',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

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
          editUrl:
            'https://github.com/Altruistic-Hive/AH/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/Altruistic-Hive/AH/tree/main/',
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
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'AH',
      logo: undefined,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/Altruistic-Hive',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: "Wanna hang out?",
          items: [
            {
              html: `<p class="footer__cta-description">Got a cool project idea? Just want to say what's up? <br />Jump in and join the crew!</p>`,
            },
            {
              label: 'Join the Party!',
              href: 'https://discord.gg/GnrUfu2MQt',
              className: 'footer__cta-button'
            }
          ],
        },
        {
          title: 'Find Us',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Altruistic-Hive',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/your-profile',
            }
          ],
        },
      ],
      logo: {
        alt: 'AH Logo',
        src: 'img/AH_W.svg',
        srcDark: 'img/AH_B.svg',
        href: '/',
        width: 50,
        height: 50,
      },
      copyright: `Copyright © ${new Date().getFullYear()} Altruistic Hive. Built with love by <a href="https://til.jungin.kim">JIK</a> & friends.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
