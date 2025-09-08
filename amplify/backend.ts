import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource.js';

export const backend = defineBackend({
  data,
});
