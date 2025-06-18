import Link from '@/components/Link'
import Tag from '@/components/Tag'
import Image from '@/components/Image'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import { ArrowRight } from 'lucide-react'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  return (
    <>
      <div className="my-6 flex flex-col gap-x-12 lg:mb-12 lg:flex-row">
        <div className="flex flex-col items-start justify-start space-y-6 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
          <div className="space-y-4 md:border-r-2 md:border-gray-200 dark:md:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
              Duncan Leung
            </h1>
            <p className="text-primary-500 mr-2 w-96 text-sm tracking-wider uppercase">
              {siteMetadata.description}
            </p>
          </div>
          <div className="max-w-xl space-y-4 text-gray-600 dark:text-gray-400">
            <p>Hi! I'm Duncan Leung and I currently lead Frontend Engineering at Airvet.</p>
            <p>
              In a previous career I worked overseas in Beijing as a Product Manager at a skunkworks
              studio building digital experience projects for Ford Motor (China) and consulted on UX
              projects for Starwood Hotels. During this time I also mentored startups at
              Chinaccelerator and ran startup events and hackathons in Shanghai.
            </p>
            <p>
              👨🏻‍💻 I'm a self taught software developer, and this is a place for me to jot down some
              notes. I mostly cover Javascript, Typescript, React, and software development.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h2 className="font-mono text-sm tracking-wider text-gray-500 uppercase dark:text-gray-400">
            Latest Writing
          </h2>
        </div>

        <ul className="divide-y divide-gray-200 pr-8 dark:divide-gray-700">
          {!posts.length && (
            <li className="py-4">
              <p className="text-gray-600 dark:text-gray-400">No posts found.</p>
            </li>
          )}

          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags, images } = post
            // Use images from frontmatter for thumbnail
            const thumbnailPath = images && images.length > 0 ? images[0] : null

            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="flex gap-6">
                    {/* Thumbnail */}
                    {thumbnailPath && (
                      <div className="hidden flex-shrink-0 sm:block">
                        <Link href={`/blog/${slug}`} aria-label={`Link to ${title}`}>
                          <div className="h-18 w-18 overflow-hidden rounded-md">
                            <Image
                              src={thumbnailPath}
                              alt={title}
                              width={72}
                              height={72}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                        </Link>
                      </div>
                    )}

                    {/* Post content */}
                    <div className="flex-grow space-y-8">
                      <div className="space-y-4">
                        <div className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            <Link href={`/blog/${slug}`}>{title}</Link>
                          </h3>

                          <div className="flex items-center gap-2">
                            {/* Thumbnail */}
                            {thumbnailPath && (
                              <div className="block flex-shrink-0 sm:hidden">
                                <Link href={`/blog/${slug}`} aria-label={`Link to ${title}`}>
                                  <div className="h-12 w-12 overflow-hidden rounded-md">
                                    <Image
                                      src={thumbnailPath}
                                      alt={title}
                                      width={48}
                                      height={48}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>
                                </Link>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              {tags.map((tag) => (
                                <Tag key={tag} text={tag} />
                              ))}
                            </div>
                          </div>
                        </div>

                        <p className="max-w-4xl text-gray-600 dark:text-gray-400">{summary}</p>
                      </div>

                      <Link
                        href={`/blog/${slug}`}
                        className="group inline-flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        aria-label={`Read "${title}"`}
                      >
                        Read article
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>

      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end py-12">
          <Link
            href="/blog"
            className="group inline-flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            View archive
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}

      <div className="py-16">
        <div className="mx-auto w-[290px] lg:w-[400px]">
          <h2 className="mb-8 font-mono text-sm tracking-wider text-gray-500 uppercase dark:text-gray-400">
            Newsletter
          </h2>
          <NewsletterForm title="Stay updated, receive the latest post straight to your mailbox" />
        </div>
      </div>
    </>
  )
}
