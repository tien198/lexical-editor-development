export function BannerBlock({ data, nodeKey }: { data: any; nodeKey: string }) {
  const style = data.style || 'info'
  const isWarning = style === 'warning'
  return (
    <div
      className={`p-4 rounded-lg border ${isWarning ? 'bg-amber-50 border-amber-200' : 'bg-blue-500 border-blue-200'}`}
    >
      <h3 className="font-bold">{data.title || 'Banner Title'}</h3>
      <p>{data.description || 'Banner description...'}</p>
    </div>
  )
}
