import type { CollectionConfig } from 'payload'
import {
  lexicalEditor,
  lexicalHTMLField,
  EXPERIMENTAL_TableFeature,
} from '@payloadcms/richtext-lexical'

export const Pages: CollectionConfig = {
  slug: 'pages',

  admin: {
    useAsTitle: 'title',
  },

  access: {
    read: () => true,
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },

    {
      name: 'slug',
      type: 'text',
      required: true,
      // unique: true,
      localized: true,
    },

    {
      name: 'navigation',
      type: 'group',

      fields: [
        {
          name: 'showInSidebar',
          type: 'checkbox',
          defaultValue: false,
        },

        {
          name: 'showInHeader',
          type: 'checkbox',
          defaultValue: false,
        },

        {
          name: 'sidebarLabel',
          type: 'text',
          localized: true,
        },

        {
          name: 'headerLabel',
          type: 'text',
          localized: true,
        },

        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, EXPERIMENTAL_TableFeature()],
      }),
    },
    lexicalHTMLField({
      htmlFieldName: 'contentHtml',
      lexicalFieldName: 'content',
    }),
  ],
}
