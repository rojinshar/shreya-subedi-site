// All of the site's text, links and images live in this file.
// Edit it and the page updates — the components don't need to change.
//
// Images live in /public and are referenced by path, e.g. '/shreya-forest.jpg'.
// In headings, words inside *asterisks* are set in italics.

const instagram = 'https://www.instagram.com/shreyaa.subedi/'

export const site = {
  name: 'Shreya Subedi',

  hero: {
    photo: '/shreya-forest.jpg',
    photoAlt: 'Shreya taking a selfie in sunglasses on a tree-lined path',
    heading: 'Making the everyday *Nepali* experience a little *funnier*',
    subheading: 'Nepali POV & relatable comedy',
    cta: { label: 'Watch on Instagram', url: instagram },
  },

  intro: {
    eyebrow: 'Sound familiar?',
    // DRAFT: written from her Instagram bio. Rewrite it in her own voice.
    text: 'If it happened in a Nepali household, it’s *probably a video by now.* The family chaos, the culture, and the little moments we all recognize but *never say out loud.*',
  },

  about: {
    eyebrow: 'Meet the creator',
    heading: 'Hi, I’m Shreya',
    // DRAFT: rewrite in her own voice.
    paragraphs: [
      'I make short, relatable comedy about being Nepali. If you’ve ever watched one and thought “that’s literally my mom,” you’re exactly who I make them for.',
    ],
    cta: { label: 'Follow along', url: instagram },
    photos: {
      side: { src: '/shreya-temple-roof.jpg', alt: '' },
      main: { src: '/shreya-saree.jpg', alt: 'Shreya in a pastel saree, smiling in front of a wall of flowers' },
    },
  },

  work: {
    eyebrow: 'Let’s work together',
    items: [
      {
        title: 'Everyday comedy',
        text: 'Nepali POV skits and relatable moments on Instagram at @shreyaa.subedi, made for anyone who grew up between two cultures.',
        cta: { label: 'Watch the latest', url: instagram },
        photo: '/shreya-portrait.jpg',
        photoAlt: 'Shreya smiling in front of a yellow striped wall',
      },
      {
        title: 'Brand collaborations',
        text: 'Reels, campaigns and partnerships for brands that want to reach a Nepali audience in a way that feels real, not like an ad.',
        cta: { label: 'Send a DM', url: instagram },
        photo: '/shreya-temple.jpg',
        photoAlt: 'Shreya shading her eyes in front of a brick temple in Nepal',
      },
    ],
  },

  // Social links: shown as icons in the header and footer.
  // Supported icons: instagram, tiktok, youtube, facebook, linkedin, x, email, link
  socials: [
    { icon: 'instagram', label: 'Instagram', url: instagram },
    { icon: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/shreya.subedi.712' },
    { icon: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/shreyasubedi2/' },
  ],

  // Other accounts, listed in the footer.
  elsewhere: [
    { label: '@shreya.simplifies', url: 'https://www.instagram.com/shreya.simplifies/' },
    { label: '@amayaa.clothing', url: 'https://www.instagram.com/amayaa.clothing/' },
  ],

  contact: {
    eyebrow: 'Say hello',
    heading: 'Let’s make something people *send to their cousins*',
    cta: { label: 'DM for collaborations', url: instagram },
    // Add a business email to show it under the button.
    email: null,
  },
}
