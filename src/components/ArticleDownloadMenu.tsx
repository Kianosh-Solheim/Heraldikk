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
  body { font-family: "Georgia", serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #1a1a1a; }
  h1, h2, h3 { font-family: "Georgia", serif; color: #1a365d; }
  h1 { font-size: 2.5rem; text-align: center; border-bottom: 2px solid #1a365d; padding-bottom: 0.5rem; margin-bottom: 2rem; }
  img { max-width: 100%; height: auto; border: 1px solid #eee; }
  figure[data-type="custom-image"] { display: flex; flex-direction: column; align-items: center; margin: 2rem 0; }
  figure figcaption { font-size: 0.9rem; color: #666; font-style: italic; margin-top: 0.5rem; }
  [data-type="image-gallery"] { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 2rem 0; }
  [data-type="person-gallery"] { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; }
  .prose { max-width: 100%; }
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
    
    // Custom rule for images wrapped in custom figures
    turndownService.addRule('customImage', {
      filter: (node) => {
        return node.nodeName === 'FIGURE' && node.getAttribute('data-type') === 'custom-image';
      },
      replacement: (content, node) => {
        const img = node.querySelector('img');
        const src = img ? img.getAttribute('src') : '';
        const caption = node.querySelector('figcaption')?.textContent || img?.getAttribute('alt') || '';
        return `\n\n![${caption}](${src})\n${caption ? `*${caption}*` : ''}\n\n`;
      }
    });

    turndownService.addRule('galleryImage', {
      filter: (node) => {
        return node.nodeName === 'DIV' && node.getAttribute('data-type') === 'image-gallery-item';
      },
      replacement: (content, node) => {
        const img = node.querySelector('img');
        const src = img ? img.getAttribute('src') : '';
        const caption = node.querySelector('figcaption')?.textContent || img?.getAttribute('alt') || '';
        return `\n![${caption}](${src})\n`;
      }
    });

    const mdContent = `# ${title}\n\n${turndownService.turndown(content)}`;
    downloadFile(`${title.replace(/[^a-z0-9æøå]/gi, '_').toLowerCase()}.md`, mdContent, 'text/markdown');
  };

  const printPdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: "Georgia", serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #000; }
              h1 { font-family: "Georgia", serif; font-size: 24pt; border-bottom: 2px solid #000; padding-bottom: 10px; text-align: center; margin-bottom: 30px; }
              h2, h3 { font-family: "Georgia", serif; margin-top: 25px; page-break-after: avoid; }
              p { margin-bottom: 15px; text-align: justify; }
              img { max-width: 100%; height: auto; page-break-inside: avoid; margin: 15px 0; }
              figure[data-type="custom-image"] { text-align: center; page-break-inside: avoid; margin: 25px 0; }
              figcaption { font-size: 10pt; font-style: italic; color: #555; margin-top: 8px; }
              [data-type="image-gallery"] { display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; page-break-inside: avoid; }
              [data-type="image-gallery-item"] { width: 45%; }
              @page { margin: 2.5cm; }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            ${content}
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
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
