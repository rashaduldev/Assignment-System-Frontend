'use client';

import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, rgb } from 'pdf-lib';
import { PenLine, RotateCcw, Save, Trash2 } from 'lucide-react';
import { uploadReviewedPdf } from '@/actions/submission.actions';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Field';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

type Point = { x: number; y: number };
type Stroke = { points: Point[]; color: string; width: number };

export function PdfAnnotator({ sourceUrl, onSaved }: { sourceUrl: string; onSaved: (url: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [strokes, setStrokes] = useState<Record<number, Stroke[]>>({});
  const [drawing, setDrawing] = useState<Stroke | null>(null);
  const [color, setColor] = useState('#dc2626');
  const [width, setWidth] = useState(3);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  const currentStrokes = strokes[page] ?? [];
  const redraw = (active?: Stroke | null) => {
    const canvas = canvasRef.current; const stage = stageRef.current;
    if (!canvas || !stage) return;
    const box = stage.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = box.width * dpr; canvas.height = box.height * dpr;
    canvas.style.width = `${box.width}px`; canvas.style.height = `${box.height}px`;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.scale(dpr, dpr);
    [...currentStrokes, ...(active ? [active] : [])].forEach((stroke) => drawStroke(ctx, stroke, box.width, box.height));
  };

  useEffect(() => { redraw(drawing); }, [page, strokes, drawing]);
  useEffect(() => { const onResize = () => redraw(drawing); window.addEventListener('resize', onResize); return () => window.removeEventListener('resize', onResize); });
  const point = (event: React.PointerEvent<HTMLCanvasElement>): Point | null => {
    const box = event.currentTarget.getBoundingClientRect();
    if (!box.width || !box.height) return null;
    return { x: (event.clientX - box.left) / box.width, y: (event.clientY - box.top) / box.height };
  };
  const start = (event: React.PointerEvent<HTMLCanvasElement>) => { const p = point(event); if (!p) return; event.currentTarget.setPointerCapture(event.pointerId); setDrawing({ points: [p], color, width }); };
  const move = (event: React.PointerEvent<HTMLCanvasElement>) => { const p = point(event); if (!p || !drawing) return; setDrawing({ ...drawing, points: [...drawing.points, p] }); };
  const end = () => { if (drawing && drawing.points.length > 1) setStrokes((value) => ({ ...value, [page]: [...(value[page] ?? []), drawing] })); setDrawing(null); };
  const undo = () => setStrokes((value) => ({ ...value, [page]: (value[page] ?? []).slice(0, -1) }));
  const clear = () => setStrokes((value) => ({ ...value, [page]: [] }));

  const save = async () => {
    setSaving(true); setError(undefined);
    try {
      const source = await fetch(sourceUrl).then((response) => { if (!response.ok) throw new Error('Could not download the original PDF'); return response.arrayBuffer(); });
      const pdf = await PDFDocument.load(source);
      Object.entries(strokes).forEach(([pageNumber, pageStrokes]) => {
        const target = pdf.getPages()[Number(pageNumber) - 1]; if (!target) return;
        const { width: pdfWidth, height: pdfHeight } = target.getSize();
        pageStrokes.forEach((stroke) => {
          const { r, g, b } = hex(stroke.color);
          for (let index = 1; index < stroke.points.length; index += 1) {
            const a = stroke.points[index - 1]; const bPoint = stroke.points[index];
            target.drawLine({ start: { x: a.x * pdfWidth, y: pdfHeight - a.y * pdfHeight }, end: { x: bPoint.x * pdfWidth, y: pdfHeight - bPoint.y * pdfHeight }, thickness: stroke.width, color: rgb(r, g, b) });
          }
        });
      });
      const bytes = await pdf.save();
      const output = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
      const url = await uploadReviewedPdf(new File([output], 'reviewed-assignment.pdf', { type: 'application/pdf' }));
      onSaved(url);
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not save annotations'); } finally { setSaving(false); }
  };

  return <div className="space-y-3">
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-primary/10 bg-paper p-2">
      <Button size="sm" variant="outline" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1}>Previous</Button><span className="text-sm">Page {page} / {pages}</span><Button size="sm" variant="outline" onClick={() => setPage((value) => Math.min(pages, value + 1))} disabled={page === pages}>Next</Button>
      <span className="ml-auto flex items-center gap-1"><PenLine size={15} /><input aria-label="Pen colour" type="color" value={color} onChange={(event) => setColor(event.target.value)} /><Select aria-label="Pen size" value={width} onChange={(event) => setWidth(Number(event.target.value))} className="w-20 py-1"><option value={2}>Thin</option><option value={4}>Medium</option><option value={7}>Bold</option></Select></span>
      <Button size="sm" variant="ghost" onClick={undo}><RotateCcw size={15} /> Undo</Button><Button size="sm" variant="ghost" onClick={clear}><Trash2 size={15} /> Clear</Button>
    </div>
    <div ref={stageRef} className="relative mx-auto w-fit max-w-full overflow-hidden border border-primary/15 bg-white shadow-sm">
      <Document file={sourceUrl} onLoadSuccess={({ numPages }) => setPages(numPages)} loading={<p className="p-6 text-sm">Loading PDF…</p>} error={<p className="p-6 text-sm text-danger">PDF preview could not load.</p>}><Page pageNumber={page} width={Math.min(760, typeof window === 'undefined' ? 760 : window.innerWidth - 80)} renderTextLayer={false} renderAnnotationLayer={false} onRenderSuccess={() => redraw(drawing)} /></Document>
      <canvas ref={canvasRef} className="absolute inset-0 cursor-crosshair touch-none" onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} />
    </div>
    {error && <p className="text-sm text-danger">{error}</p>}<Button onClick={save} isLoading={saving}><Save size={16} /> Save marked PDF</Button>
  </div>;
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke, width: number, height: number) { if (stroke.points.length < 2) return; ctx.beginPath(); ctx.strokeStyle = stroke.color; ctx.lineWidth = stroke.width; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.moveTo(stroke.points[0].x * width, stroke.points[0].y * height); stroke.points.slice(1).forEach((point) => ctx.lineTo(point.x * width, point.y * height)); ctx.stroke(); }
function hex(value: string) { const normalized = value.replace('#', ''); return { r: parseInt(normalized.slice(0, 2), 16) / 255, g: parseInt(normalized.slice(2, 4), 16) / 255, b: parseInt(normalized.slice(4, 6), 16) / 255 }; }
