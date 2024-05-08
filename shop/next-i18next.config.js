const invariant = require('tiny-invariant');
const path = require('path');

// Check if NEXT_PUBLIC_DEFAULT_LANGUAGE is set, if not, set it to 'en'
const defaultLanguage = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en';
const isMultilangEnable =
  process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG === 'true' &&
  !!process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES;

function generateLocales() {
  if (isMultilangEnable) {
    return process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES.split(',');
  }

  return [defaultLanguage];
}

module.exports = {
  i18n: {
    // Use the default language defined above
    defaultLocale: defaultLanguage,
    // Generate locales based on multilingual configuration or default language
    locales: generateLocales(),
    // Enable locale detection if multilang is enabled
    localeDetection: isMultilangEnable,
  },
  localePath: path.resolve('./public/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
