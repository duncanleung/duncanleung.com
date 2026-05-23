type SubstackEmbedProps = {
  title?: string
}

const SUBSTACK_EMBED_URL = 'https://duncanleung.substack.com/embed'

export default function SubstackEmbed({ title }: SubstackEmbedProps) {
  return (
    <div className="flex flex-col items-center">
      {title && (
        <p className="mb-4 text-center text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </p>
      )}
      <iframe
        title="Substack subscribe"
        src={SUBSTACK_EMBED_URL}
        width="100%"
        height="320"
        style={{ border: 0, background: 'transparent' }}
        scrolling="no"
      />
    </div>
  )
}
