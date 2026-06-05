import React, { useState, useRef, useEffect } from 'react';
import TurndownService from 'turndown';
import { Download, FileCode, FileText, FileDown } from 'lucide-react';

interface ArticleDownloadMenuProps {
  title: string;
  content: string;
}

export default function ArticleDownloadMenu({ title, content }: ArticleDownloadMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const downloadFile = (filename: string, contentStr: string, type: string) => {
    const blob = new Blob([contentStr], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const downloadHtml = (e: React.MouseEvent) => {
    e.stopPropagation();
    const htmlContent = `<!DOCTYPE html>
<html lang="no">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
  body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #333; }
  h1 { font-family: Georgia, serif; color: #1a365d; }
  img { max-width: 100%; height: auto; }
</style>
</head>
<body>
<h1>${title}</h1>
${content}
</body>
</html>`;
    downloadFile(`${title.replace(/[^a-z0-9æøå]/gi, '_').toLowerCase()}.html`, htmlContent, 'text/html');
  };

  const downloadMarkdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const turndownService = new TurndownService({ headingStyle: 'atx' });
    const mdContent = `# ${title}\n\n${turndownService.turndown(content)}`;
    downloadFile(`${title.replace(/[^a-z0-9æøå]/gi, '_').toLowerCase()}.md`, mdContent, 'text/markdown');
  };

  const printPdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    // Use the native print dialog which can be saved as PDF
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="relative no-print" ref={menuRef}>
      <button 
        type="button"
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="px-3 py-1 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors font-bold rounded-sm uppercase tracking-widest text-[10px]"
        title="Last ned artikkel"
      >
        <Download size={14} /> Last ned
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl z-50 overflow-hidden text-sm cursor-default">
          <button type="button" onClick={downloadHtml} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors border-b border-slate-100 cursor-pointer">
            <FileCode size={16} className="text-slate-400" />
            <div>
              <div className="font-bold text-heraldry-blue text-xs">HTML Fil</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Nettformat</div>
            </div>
          </button>
          <button type="button" onClick={downloadMarkdown} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors border-b border-slate-100 cursor-pointer">
            <FileText size={16} className="text-slate-400" />
            <div>
              <div className="font-bold text-heraldry-blue text-xs">Markdown</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Tekstformat</div>
            </div>
          </button>
          <button type="button" onClick={printPdf} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors cursor-pointer">
            <FileDown size={16} className="text-slate-400" />
            <div>
              <div className="font-bold text-heraldry-blue text-xs">PDF / Skriv ut</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Dokument</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
