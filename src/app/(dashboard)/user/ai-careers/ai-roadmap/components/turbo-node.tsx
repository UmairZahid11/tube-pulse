import { Handle, Position } from '@xyflow/react'

const TurboNode = ({ data }: any) => {
  return (
    <div className="p-4 rounded bg-[#f8f8f8] border border-gray-200 w-64">
      <h3 className="text-white font-semibold !text-sm">{data.title}</h3>
      <p className="!text-xs text-muted-foreground">{data.description}</p>
      <a
        href={data.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 text-xs underline mt-1 inline-block"
      >
        Learn more
      </a>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default TurboNode
