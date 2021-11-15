import React from 'react'
import { readConfObject } from '@jbrowse/core/configuration'
import { bpSpanPx, measureText } from '@jbrowse/core/util'
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
    const ref = React.createRef<SVGPathElement>()
    const tooltipWidth = 20 + measureText(caption.toString())

    arcsRendered.push(
      <g key={id} onClick={e => onClick(e, featureId)}>
        <path
          id={id}
          d={`M ${left} 0 C ${left} 100, ${right} 100, ${right} 0`}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="transparent"
          onClick={e => onClick(e, featureId)}
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
        <text
          x={left + (right - left) / 2}
          y="78px"
          style={{ stroke: 'white', strokeWidth: '0.6em' }}
        >
          {label}
        </text>
        <text
          x={left + (right - left) / 2}
          y="78px"
          style={{ stroke: 'black' }}
        >
          {label}
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
        outline: 'none',
        position: 'relative',
      }}
    >
      {arcsRendered}
    </svg>
  )
}

export default observer(ArcRendering)
