'use client'

import { Children, isValidElement, useEffect, useRef, type ReactNode } from 'react'
import scrollama from 'scrollama'

type ScrollyTalkSectionProps = {
  images: string[]
  children: ReactNode
}

const isVideoSrc = (src: string) => /\.(mp4|webm|mov)(\?.*)?$/i.test(src)

export default function ScrollyTalkSection({ images, children }: ScrollyTalkSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl) return

    const imageEls = sectionEl.querySelectorAll<HTMLElement>('[data-img-index]')
    const stepEls = sectionEl.querySelectorAll<HTMLElement>('[data-slide]')
    if (stepEls.length === 0 || imageEls.length === 0) return

    const scroller = scrollama()
    scroller
      .setup({
        step: stepEls as unknown as string,
        offset: 0.5,
      })
      .onStepEnter((response: { element: HTMLElement }) => {
        const slideAttr = response.element.getAttribute('data-slide')
        if (slideAttr === null) return
        const slideIndex = parseInt(slideAttr, 10)
        imageEls.forEach((el, i) => {
          const isActive = i === slideIndex
          el.classList.toggle('opacity-100', isActive)
          el.classList.toggle('opacity-0', !isActive)
          if (el.tagName === 'VIDEO') {
            const video = el as HTMLVideoElement
            if (isActive) {
              video.play().catch(() => {})
            } else {
              video.pause()
            }
          }
        })
      })

    const handleResize = () => scroller.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      scroller.destroy()
      window.removeEventListener('resize', handleResize)
    }
  }, [images.length])

  const childArray = Children.toArray(children).filter(isValidElement)

  return (
    <div ref={sectionRef} className="relative my-16 grid grid-cols-1 gap-8 lg:grid-cols-[3fr_2fr]">
      {/* Desktop: sticky image panel (hidden below lg) */}
      <div className="sticky top-12 hidden h-[calc(100vh-6rem)] items-center justify-center lg:flex">
        <div className="relative aspect-video w-full">
          {images.map((src, i) =>
            isVideoSrc(src) ? (
              <video
                key={src + i}
                data-img-index={i}
                src={src}
                muted
                loop
                playsInline
                controls
                preload="none"
                className={`absolute inset-0 h-full w-full rounded-md border border-gray-200 object-contain shadow-md transition-opacity duration-700 ease-out dark:border-gray-700 ${
                  i === 0 ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src + i}
                data-img-index={i}
                src={src}
                alt=""
                loading="lazy"
                className={`absolute inset-0 h-full w-full rounded-md border border-gray-200 object-contain shadow-md transition-opacity duration-700 ease-out dark:border-gray-700 ${
                  i === 0 ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )
          )}
        </div>
      </div>

      {/* Scrolling narration column. On mobile, each narration row has its
          slide image inline above it so the reader sees them together. */}
      <div className="flex flex-col">
        {childArray.map((child, idx) => {
          const slideAttr =
            isValidElement(child) && (child.props as { 'data-slide'?: string })['data-slide']
          const slideIndex = typeof slideAttr === 'string' ? parseInt(slideAttr, 10) : idx
          const src = images[slideIndex]
          return (
            <div key={idx} className="flex flex-col">
              {/* Mobile-only image (hidden at lg+) */}
              {src && (
                <div className="mb-4 lg:hidden">
                  {isVideoSrc(src) ? (
                    <video
                      src={src}
                      muted
                      loop
                      playsInline
                      controls
                      preload="none"
                      className="w-full rounded-md border border-gray-200 shadow-md dark:border-gray-700"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="w-full rounded-md border border-gray-200 shadow-md dark:border-gray-700"
                    />
                  )}
                </div>
              )}
              {/* The narration block (carries data-slide for scrollama to observe) */}
              {child}
            </div>
          )
        })}
      </div>
    </div>
  )
}
