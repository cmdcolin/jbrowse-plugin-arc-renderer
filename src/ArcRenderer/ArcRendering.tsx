import React from 'react'
import { readConfObject } from '@jbrowse/core/configuration'
import { bpSpanPx } from '@jbrowse/core/util'
import { observer } from 'mobx-react'
import { Tooltip } from 'react-svg-tooltip'

function ArcRendering(props: any) {
  const onClick = (event: any, id: any) => {
    const { onFeatureClick: handler } = props
    if (!handler) {
      return undefined
    }
    return handler(event, id)
  }

  const { features, config, regions, blockKey, bpPerPx } = props
  const [region] = regions
  const arcsRendered = []

  for (const feature of features.values()) {
    const [left, right] = bpSpanPx(
      feature.get('start'),
      feature.get('end'),
      region,
      bpPerPx,
    )

    const featureId = feature.id()
    const id = blockKey + '-' + featureId
    const stroke = readConfObject(config, 'color', { feature })
    const label = readConfObject(config, 'label', { feature })
    const caption = readConfObject(config, 'caption', { feature })
    const strokeWidth = readConfObject(config, 'thickness', { feature })
    const startOffset = 50 - (label.toString().length * 2 - 1)
    const ref = React.createRef<SVGPathElement>()
    const tooltipWidth = 20 + caption.toString().length * 6

    arcsRendered.push(
      <g key={id} onClick={e => onClick(e, featureId)}>
        <path
          id={id}
          d={`M ${left} 0 C ${left} 100, ${right} 100, ${right} 0`}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="transparent"
          ref={ref}
        />
        <Tooltip triggerRef={ref}>
          <rect
            x={12}
            y={0}
            width={tooltipWidth}
            height={20}
            rx={5}
            ry={5}
            fill="black"
            fillOpacity="50%"
          />
          <text
            x={22}
            y={14}
            fontSize={10}
            fill="white"
            textLength={tooltipWidth - 20}
          >
            {caption}
          </text>
        </Tooltip>
        <text>
          <textPath
            href={`#${id}`}
            startOffset={`${startOffset}%`}
            style={{ stroke: 'white', strokeWidth: '0.6em' }}
          >
            {label}
          </textPath>
        </text>
        <text>
          <textPath href={`#${id}`} startOffset={`${startOffset}%`}>
            {label}
          </textPath>
        </text>
      </g>,
    )
  }

  const width = (region.end - region.start) / bpPerPx
  const height = 500

  return (
    <svg
      className="ArcRendering"
      width={width}
      height={height}
      style={{
        position: 'relative',
        outline: 'none',
      }}
    >
      {arcsRendered}
    </svg>
  )
}

export default observer(ArcRendering)
