/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BioTone = 'luxury' | 'professional' | 'savage' | 'minimal';

export interface BioResult {
  instagram: string[];
  twitter: string[];
  taglines: string[];
}

export interface UserInput {
  name: string;
  niche: string;
  tone: BioTone;
}
