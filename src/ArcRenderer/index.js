import React from 'react'
import FeatureRendererType from '@jbrowse/core/pluggableElementTypes/renderers/FeatureRendererType'
import {
  ConfigurationSchema,
  readConfObject,
} from '@jbrowse/core/configuration'

import { PrerenderedCanvas } from '@jbrowse/core/ui'
import { bpSpanPx } from '@jbrowse/core/util'
import { createCanvas, createImageBitmap } from '@jbrowse/core/util'
import { renderToAbstractCanvas } from '@jbrowse/core/util/offscreenCanvasUtils'

console.log({ createCanvas, createImageBitmap })
// Our config schema for arc track will be basic, include just a color
export const configSchema = ConfigurationSchema(
  'ArcRenderer',
  {
    color: {
      type: 'color',
      description: 'color for the arcs',
      defaultValue: 'darkblue',
    },
  },
  { explicitlyTyped: true },
)

// This ReactComponent the so called "rendering" which is the component
// that contains the contents of what was rendered.
export const ReactComponent = props => {
  return (
    <div style={{ position: 'relative' }}>
      <PrerenderedCanvas {...props} />
    </div>
  )
}

// Our ArcRenderer class does the main work in it's render method
// which draws to a canvas and returns the results in a React component
export default class ArcRenderer extends FeatureRendererType {
  makeImageData() {
    for (const feature of features.values()) {
      const [left, right] = bpSpanPx(
        feature.get('start'),
        feature.get('end'),
        region,
        bpPerPx,
      )

      ctx.beginPath()
      ctx.strokeStyle = readConfObject(config, 'color', [feature])
      ctx.lineWidth = 3
      ctx.moveTo(left, 0)
      ctx.bezierCurveTo(left, 200, right, 200, right, 0)
      ctx.stroke()
    }
  }
  async render(renderProps) {
    const { regions, bpPerPx } = renderProps
    const features = await this.getFeatures(renderProps)
    const region = regions[0]
    const width = (region.end - region.start) / bpPerPx
    const height = 500
    const res = await renderToAbstractCanvas(width, height, renderProps, ctx =>
      this.makeImageData(ctx, layoutRecords, {
        ...renderProps,
        layout,
        features,
        regionSequence,
      }),
    )

    const results = await super.render({
      ...renderProps,
      ...res,
      features,
      layout,
      height,
      width,
    })

    return {
      ...results,
      ...res,
      features,
      layout,
      height,
      width,
      maxHeightReached: layout.maxHeightReached,
    }
  }
}
