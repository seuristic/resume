import { useCallback, useState, useEffect } from "react"
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

const maxWidth = 1000

type ResumeProps = {
  file?: string
}

const ResumeViewer = ({ file }: ResumeProps) => {
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>()

  const downloadResume = useCallback(() => {
    const resumeUrl = file || "/Mohammad_Shahanwaz_Resume.pdf"
    const link = document.createElement("a")
    link.href = resumeUrl
    link.download = "Mohammad_Shahanwaz_Resume.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [file])

  useEffect(() => {
    downloadResume()
  }, [downloadResume])

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries

    if (entry) {
      setContainerWidth(entry.contentRect.width - 64)
    }
  }, [])

  useResizeObserver(containerRef, resizeObserverOptions, onResize)

  return (
    <div ref={setContainerRef}>
      <Document file={file} options={options}>
        <Page
          pageNumber={1}
          width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
        />
      </Document>
    </div>
  )
}

ResumeViewer.defaultProps = {
  file: "/Mohammad_Shahanwaz_Resume.pdf"
}

export { ResumeViewer }
