import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { BannerBlock } from '../blocks/BannerBlock'
import { CTABlock } from '../blocks/CTABlock'
import type React from 'react'

const BLOCK_MAP: Record<string, React.FC<any> | undefined> = {
  banner: BannerBlock,
  cta: CTABlock,
}

export function BlockDispatcher({
  nodeKey,
  type,
  data,
}: {
  nodeKey: string
  type: string
  data: any
}) {
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)

  const Component = BLOCK_MAP[type]
  if (!Component)
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        Unknown block type: {type}
      </div>
    )

  return (
    <div
      className={`relative rounded-md transition-colors ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      onClick={() => {
        clearSelection()
        setSelected(true)
      }}
    >
      <Component data={data} nodeKey={nodeKey} />
    </div>
  )
}
