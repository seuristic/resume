import { useCallback, useState } from "react"
import { pdfjs, Document, Page } from "react-pdf"
import { useResizeObserver } from "@wojtekmaj/react-hooks"

import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString()

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/"
}

const resizeObserverOptions = {}

const maxWidth = 800

type ResumeProps = {
  file: string
}

export default function Resume({ file }: ResumeProps) {
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>()

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries

    if (entry) {
      setContainerWidth(entry.contentRect.width - 24)
    }
  }, [])

  useResizeObserver(containerRef, resizeObserverOptions, onResize)

  return (
    <div ref={setContainerRef}>
      <Document file={file} options={options}>
        {Array.from(new Array(1), (element: number) => (
          <Page
            key={element}
            pageNumber={1}
            width={
              containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
            }
          />
        ))}
      </Document>
    </div>
  )
}
