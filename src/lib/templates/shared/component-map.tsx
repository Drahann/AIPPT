'use client'

import { ComponentType } from 'react'
import { LayoutType } from '@/lib/types'
import { FigmaSlideProps } from '@/lib/templates/index'

// Group 01
import Group01Cover from '@/lib/templates/group-01/cover'
import Group01SectionHeader from '@/lib/templates/group-01/section-header'
import Group01Quote from '@/lib/templates/group-01/quote'
import Group01Ending from '@/lib/templates/group-01/ending'

// Group 02
import Group02Cover from '@/lib/templates/group-02/cover'
import Group02SectionHeader from '@/lib/templates/group-02/section-header'
import Group02Quote from '@/lib/templates/group-02/quote'
import Group02Ending from '@/lib/templates/group-02/ending'

// Group 03
import Group03Cover from '@/lib/templates/group-03/cover'
import Group03SectionHeader from '@/lib/templates/group-03/section-header'
import Group03Quote from '@/lib/templates/group-03/quote'
import Group03Ending from '@/lib/templates/group-03/ending'

// Group 04
import Group04Cover from '@/lib/templates/group-04/cover'
import Group04SectionHeader from '@/lib/templates/group-04/section-header'
import Group04Quote from '@/lib/templates/group-04/quote'
import Group04Ending from '@/lib/templates/group-04/ending'

// Group 05
import Group05Cover from '@/lib/templates/group-05/cover'
import Group05SectionHeader from '@/lib/templates/group-05/section-header'
import Group05Quote from '@/lib/templates/group-05/quote'
import Group05Ending from '@/lib/templates/group-05/ending'

// Group 06
import Group06Cover from '@/lib/templates/group-06/cover'
import Group06SectionHeader from '@/lib/templates/group-06/section-header'
import Group06Quote from '@/lib/templates/group-06/quote'
import Group06Ending from '@/lib/templates/group-06/ending'

// Group 07
import Group07Cover from '@/lib/templates/group-07/cover'
import Group07SectionHeader from '@/lib/templates/group-07/section-header'
import Group07Quote from '@/lib/templates/group-07/quote'
import Group07Ending from '@/lib/templates/group-07/ending'

// Group 08
import Group08Cover from '@/lib/templates/group-08/cover'
import Group08SectionHeader from '@/lib/templates/group-08/section-header'
import Group08Quote from '@/lib/templates/group-08/quote'
import Group08Ending from '@/lib/templates/group-08/ending'

// Group 09
import Group09Cover from '@/lib/templates/group-09/cover'
import Group09SectionHeader from '@/lib/templates/group-09/section-header'
import Group09Quote from '@/lib/templates/group-09/quote'
import Group09Ending from '@/lib/templates/group-09/ending'

// Group 10
import Group10Cover from '@/lib/templates/group-10/cover'
import Group10SectionHeader from '@/lib/templates/group-10/section-header'
import Group10Quote from '@/lib/templates/group-10/quote'
import Group10Ending from '@/lib/templates/group-10/ending'

type FigmaComponentMap = {
  [packId: string]: {
    [layout in LayoutType]?: ComponentType<FigmaSlideProps>
  }
}

const figmaComponents: FigmaComponentMap = {
  'group-01': {
    'cover': Group01Cover,
    'section-header': Group01SectionHeader,
    'quote': Group01Quote,
    'ending': Group01Ending,
  },
  'group-02': {
    'cover': Group02Cover,
    'section-header': Group02SectionHeader,
    'quote': Group02Quote,
    'ending': Group02Ending,
  },
  'group-03': {
    'cover': Group03Cover,
    'section-header': Group03SectionHeader,
    'quote': Group03Quote,
    'ending': Group03Ending,
  },
  'group-04': {
    'cover': Group04Cover,
    'section-header': Group04SectionHeader,
    'quote': Group04Quote,
    'ending': Group04Ending,
  },
  'group-05': {
    'cover': Group05Cover,
    'section-header': Group05SectionHeader,
    'quote': Group05Quote,
    'ending': Group05Ending,
  },
  'group-06': {
    'cover': Group06Cover,
    'section-header': Group06SectionHeader,
    'quote': Group06Quote,
    'ending': Group06Ending,
  },
  'group-07': {
    'cover': Group07Cover,
    'section-header': Group07SectionHeader,
    'quote': Group07Quote,
    'ending': Group07Ending,
  },
  'group-08': {
    'cover': Group08Cover,
    'section-header': Group08SectionHeader,
    'quote': Group08Quote,
    'ending': Group08Ending,
  },
  'group-09': {
    'cover': Group09Cover,
    'section-header': Group09SectionHeader,
    'quote': Group09Quote,
    'ending': Group09Ending,
  },
  'group-10': {
    'cover': Group10Cover,
    'section-header': Group10SectionHeader,
    'quote': Group10Quote,
    'ending': Group10Ending,
  },
}

/**
 * Get the Figma component for a given pack and layout.
 * Returns undefined if the layout doesn't have a Figma component for this pack.
 */
export function getFigmaComponent(
  packId: string,
  layout: LayoutType
): ComponentType<FigmaSlideProps> | undefined {
  return figmaComponents[packId]?.[layout]
}
