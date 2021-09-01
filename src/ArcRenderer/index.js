import React from 'react'
import FeatureRendererType from '@jbrowse/core/pluggableElementTypes/renderers/FeatureRendererType'
import {
  ConfigurationSchema,
  readConfObject,
} from '@jbrowse/core/configuration'
import { renderToAbstractCanvas } from '@jbrowse/core/util'
import { PrerenderedCanvas } from '@jbrowse/core/ui'
import { bpSpanPx } from '@jbrowse/core/util'

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

export default class ArcRenderer extends FeatureRendererType {
  supportsSVG = true

  makeImageData(ctx, props) {
    const { features, config, regions, bpPerPx } = props
    const [region] = regions
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
    const region = regions[0]
    const width = (region.end - region.start) / bpPerPx
    const height = 500
    const features = await this.getFeatures(renderProps)

    const res = await renderToAbstractCanvas(width, height, renderProps, ctx =>
      this.makeImageData(ctx, {
        ...renderProps,
        features,
      }),
    )

    const results = await super.render({
      ...renderProps,
      ...res,
      features,
      height,
      width,
    })

    return {
      ...results,
      ...res,
      features,
      height,
      width,
    }
  }
}
