// "use client"
// import { Document, Page, pdfjs } from "react-pdf"
// import { useState, useRef, useEffect } from "react"
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.mjs",
//   import.meta.url
// ).toString();

// const PDFViewer = ({ url }: { url: string }) => {
//   const [numPages, setNumPages] = useState<number | null>(null)
//   const [width, setWidth] = useState(600)
//   const containerRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     if (containerRef.current) {
//       setWidth(containerRef.current.offsetWidth)
//     }
//   }, [])

//   return (
//     <div ref={containerRef} className="w-full h-full overflow-auto">
//       <Document
//         file={url}
//         onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//       >
//         {numPages &&
//           Array.from({ length: numPages }, (_, index) => (
//             <Page key={index} pageNumber={index + 1} width={width} />
//           ))}
//       </Document>
//     </div>
//   )
// }

// export default PDFViewer

"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useState, useRef, useEffect } from "react";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Minus, Plus } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

const PDFViewer = ({ url }: { url: string }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 justify-between">
        <button
            onClick={() => setScale(1)}
            className="px-3 py-1 bg-primary rounded text-white"
          >
          Reset
        </button>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setScale((s) => Math.min(s + 0.1, 3))}
            className="px-3 py-1 bg-primary rounded text-white"
          >
            <Plus/>
          </button>
          <span className="text-black border border-gray-400 px-2 py-1 rounded">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.max(s - 0.1, 0.5))}
            className="px-3 py-1 bg-primary rounded text-white"
          >
            <Minus/>
          </button>
        </div>
      </div>

      {/* PDF Container */}
      <div
        ref={containerRef}
        className="w-full max-h-[80vh] overflow-auto border rounded"
      >
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<p>Loading PDF...</p>}
        >
          <Page
            pageNumber={pageNumber}
            width={width}
            scale={scale}
            renderAnnotationLayer
            renderTextLayer
          />
        </Document>
      </div>

      <div className="mt-4 flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
            disabled={pageNumber <= 1}
            className="px-3 py-1 bg-primary rounded text-white"
          >
            Prev Page
          </button>
          <button
            onClick={() =>
              setPageNumber((p) => (numPages ? Math.min(p + 1, numPages) : p))
            }
            disabled={pageNumber >= (numPages || 0)}
            className="px-3 py-1 bg-primary rounded text-white"
          >
            Next Page
          </button>
        </div>
        <span className="ml-2 text-black">
          Page {pageNumber} of {numPages || "?"}
        </span>
      </div>
    </div>
  );
};

export default PDFViewer;
