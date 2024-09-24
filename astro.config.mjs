import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import robotsTxt from 'astro-robots-txt';
import icon from 'astro-icon';

export default defineConfig({
  integrations: [tailwind(), robotsTxt(), icon()],
  site: 'https://statick88.github.io/'
});
