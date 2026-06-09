import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'KSJ Digital',

  projectId: '4ph8qwbg',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})

import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'morgz',
  dataset: 'production',
  apiVersion: '2026-04-30',
  useCdn: true,
});