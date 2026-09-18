export function CTABlock({ data, nodeKey }: { data: any; nodeKey: string }) {
  return (
    <div className="p-6 rounded-lg border bg-muted flex flex-col items-center justify-center text-center gap-4">
      <h3 className="font-bold text-lg">{data.title || 'Call to Action'}</h3>
      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
        {data.buttonText || 'Click Here'}
      </button>
    </div>
  )
}
