import React, { useEffect, useCallback, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useEditor, EditorContent, Node, mergeAttributes, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Superscript from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import OrderedList from '@tiptap/extension-ordered-list';
import TextAlign from '@tiptap/extension-text-align';
import {
  Heading1, Heading2, Heading3, Text as TextIcon, Quote, List, ListOrdered,
  Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, Minus, Image as ImageIcon,
  AlignCenter, AlignLeft, AlignRight, AlignJustify, WrapText, Superscript as SuperscriptIcon,
  BookText, PanelLeft, X, Plus, Expand, Minimize, Table as TableIcon,
  ChevronDown, ChevronRight, ChevronUp, ChevronLeft, Trash2,
  Users, UserPlus, UserCircle, Check, Camera, Images
} from 'lucide-react';
import ImagePickerDialog from './ImagePickerDialog';

// --- Custom Nodes and Helpers ---

const EditorContext = React.createContext<{
    openImagePicker: (callback: (url: string, title?: string, sourceUrl?: string) => void) => void;
} | null>(null);

const FootnoteReference = Node.create({
  name: 'footnoteReference',
  group: 'inline',
  inline: true,
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      id: { default: '' },
      number: { default: '?' },
      title: { default: '' },
      occurrence: { default: 'a' }, 
    };
  },

  parseHTML() {
    return [
      { 
        tag: 'a[data-footnote-ref]',
        getAttrs: (dom) => {
          const el = dom as HTMLElement;
          const sup = el.querySelector('sup[data-footnote-id]');
          if (!sup) return false;
          return {
            id: sup.getAttribute('data-footnote-id') || '',
            number: sup.textContent?.trim() || '?',
            title: el.getAttribute('title') || '',
          };
        }
      },
      {
        tag: 'sup[data-footnote-id]',
        getAttrs: (dom) => {
          const el = dom as HTMLElement;
          return {
            id: el.getAttribute('data-footnote-id') || '',
            number: el.textContent?.trim() || '?',
          };
        }
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const number = HTMLAttributes.number || '?';
    const id = HTMLAttributes.id || '';
    const occurrence = HTMLAttributes.occurrence || 'a';
    const backRefId = `ref-${id}-${occurrence}`;
    
    const occurrenceIndex = occurrence.charCodeAt(0) - 97;
    const displayLabel = occurrenceIndex === 0 
      ? `${number}` 
      : `${number}-${occurrenceIndex}`;
    
    return ['a', { 
      href: `#fn-${number}`, 
      id: backRefId,
      class: 'text-heraldry-blue hover:text-heraldry-red transition-colors no-underline font-semibold cursor-pointer align-super text-xs mx-0.5',
      'data-footnote-ref': 'true',
      title: HTMLAttributes.title
    }, 
      ['sup', { 
        class: '', 
        'data-footnote-id': id,
      }, displayLabel]
    ];
  },
});

const CustomImage = Image.extend({
    name: 'customImage',
    addAttributes() {
        return {
            ...this.parent?.(),
            caption: { default: null },
            width: { default: '100%' },
            align: { default: 'center' },
            wrap: { default: false },
        };
    },
    parseHTML() {
        return [{
            tag: 'figure[data-type="custom-image"]',
            getAttrs: dom => {
                const img = dom.querySelector('img');
                if (!img) return false;
                const caption = dom.querySelector('figcaption')?.textContent;
                return {
                    src: img.getAttribute('src'),
                    alt: img.getAttribute('alt'),
                    title: img.getAttribute('title'),
                    caption,
                    width: (dom as HTMLElement).getAttribute('data-width') || '100%',
                    align: (dom as HTMLElement).getAttribute('data-align') || 'center',
                    wrap: (dom as HTMLElement).getAttribute('data-wrap') === 'true',
                };
            },
        }];
    },
    renderHTML({ node, HTMLAttributes }) {
        const { caption, ...imgAttributes } = HTMLAttributes;
        return ['figure', {
            'data-type': 'custom-image',
            'data-width': node.attrs.width,
            'data-align': node.attrs.align,
            'data-wrap': String(node.attrs.wrap),
            style: `width: ${node.attrs.width}; margin: 1em ${node.attrs.align === 'center' ? 'auto' : node.attrs.align === 'left' ? '0 auto 0 0' : '0 0 0 auto'}; ${node.attrs.wrap ? (node.attrs.align === 'left' ? 'float: left; margin-right: 1em;' : node.attrs.align === 'right' ? 'float: right; margin-left: 1em;' : '') : ''}`,
            class: 'relative my-8'
        }, 
        ['img', mergeAttributes(this.options.HTMLAttributes, imgAttributes, {class: 'w-full h-auto rounded shadow-sm opacity-90'})], 
        ['figcaption', {class: 'text-center text-sm text-slate-500 italic mt-2'}, caption || '']];
    },
});

const PersonCardNodeView = (props: any) => {
    const { node, updateAttributes } = props;
    const [isFlipped, setIsFlipped] = useState(false);
    const context = React.useContext(EditorContext);

    const handleFlip = () => {
        if (isFlipped) return;
        setIsFlipped(true);
    };

    const stopPropagation = (e: React.MouseEvent | React.FocusEvent) => e.stopPropagation();
    
    const preventSubmit = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') e.preventDefault();
    };

    return (
        <NodeViewWrapper className={`relative perspective-1000 w-64 group inline-block m-2 h-[280px]`}>
            <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`} onClick={handleFlip}>
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden flex flex-col items-center text-center p-6 border border-slate-200 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow">
                    <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-full border-4 border-slate-50">
                        <img 
                            src={node.attrs.imageUrl || 'https://placehold.co/200x200?text=NHF'} 
                            alt={node.attrs.name} 
                            className="w-full h-full object-cover my-0"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    <h4 className="font-serif text-lg font-bold mb-1 text-heraldry-blue border-none m-0 p-0 leading-tight">{node.attrs.name || 'Navn'}</h4>
                    <p className="font-sans font-medium text-sm text-heraldry-red m-0 p-0">{node.attrs.role || 'Rolle'}</p>
                    {node.attrs.email && <p className="text-xs text-slate-500 break-all m-0 p-0 mt-1 hover:text-heraldry-blue">{node.attrs.email}</p>}
                    
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                            <UserCircle className="h-4 w-4 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 p-4 border border-slate-200 rounded-lg bg-slate-50 flex flex-col" onClick={stopPropagation}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 flex items-center gap-1">
                            <UserCircle className="w-3 h-3" /> Rediger Person
                        </span>
                        <button 
                            type="button"
                            className="h-6 w-6 rounded-full text-red-500 hover:bg-red-50 flex justify-center items-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.deleteNode();
                            }}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    
                    <div className="space-y-2 flex-1">
                        <div className="space-y-1">
                            <label className="text-[10px] font-sans uppercase font-bold text-slate-500 block">Navn</label>
                            <input 
                                value={node.attrs.name} 
                                onChange={e => updateAttributes({ name: e.target.value })}
                                onKeyDown={preventSubmit}
                                className="w-full px-2 py-1 h-8 text-sm bg-white border border-slate-200 rounded outline-none focus:border-heraldry-blue"
                                placeholder="Fullt navn"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-sans uppercase font-bold text-slate-500 block">Rolle</label>
                            <input 
                                value={node.attrs.role} 
                                onChange={e => updateAttributes({ role: e.target.value })}
                                onKeyDown={preventSubmit}
                                className="w-full px-2 py-1 h-8 text-sm bg-white border border-slate-200 rounded outline-none focus:border-heraldry-blue"
                                placeholder="F.eks. Formann"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-sans uppercase font-bold text-slate-500 block">E-post</label>
                            <input 
                                value={node.attrs.email} 
                                onChange={e => updateAttributes({ email: e.target.value })}
                                onKeyDown={preventSubmit}
                                className="w-full px-2 py-1 h-8 text-sm bg-white border border-slate-200 rounded outline-none focus:border-heraldry-blue"
                                placeholder="post@heraldikk.no"
                            />
                        </div>
                    </div>
                    
                    <div className="flex gap-2 mt-auto pt-2">
                        <button 
                            type="button"
                            className="flex-1 h-8 text-xs bg-white border border-slate-200 hover:bg-slate-50 rounded flex justify-center items-center font-bold"
                            onClick={() => context?.openImagePicker((url) => updateAttributes({ imageUrl: url }))}
                        >
                            <Camera className="w-3 h-3 mr-1.5" /> Bilde
                        </button>
                        <button 
                            type="button"
                            className="flex-1 h-8 text-xs bg-heraldry-blue text-white hover:bg-slate-800 rounded flex justify-center items-center font-bold"
                            onClick={() => setIsFlipped(false)}
                        >
                            <Check className="w-3 h-3 mr-1.5" /> Ferdig
                        </button>
                    </div>
                </div>
            </div>
        </NodeViewWrapper>
    );
};

const PersonGallery = Node.create({
  name: 'personGallery',
  group: 'block',
  content: 'personItem*',
  parseHTML() {
    return [{ tag: 'div[data-type="person-gallery"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'person-gallery', class: 'flex flex-wrap gap-4 justify-center my-8 bg-slate-50/50 p-6 rounded-lg border border-slate-100' }), 0];
  },
});

const PersonItem = Node.create({
  name: 'personItem',
  group: 'block',
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      name: { default: '' },
      role: { default: '' },
      email: { default: '' },
      imageUrl: { default: '' },
    };
  },
  parseHTML() {
    return [{
      tag: 'div[data-type="person-item"]',
      getAttrs: dom => ({
        name: (dom as HTMLElement).getAttribute('data-name'),
        role: (dom as HTMLElement).getAttribute('data-role'),
        email: (dom as HTMLElement).getAttribute('data-email'),
        imageUrl: (dom as HTMLElement).getAttribute('data-image-url'),
      }),
    }];
  },
  renderHTML({ node }) {
    const { name, role, email, imageUrl } = node.attrs;
    return ['div', {
      'data-type': 'person-item',
      'data-name': name,
      'data-role': role,
      'data-email': email,
      'data-image-url': imageUrl,
      class: 'flex flex-col items-center text-center p-6 border border-slate-200 rounded-lg bg-white shadow-sm w-64 m-2'
    },
      ['div', { class: 'relative w-32 h-32 mb-4 overflow-hidden rounded-full border-4 border-slate-50 mx-auto' },
        ['img', { src: imageUrl || 'https://placehold.co/200x200?text=NHF', alt: name || 'Person', class: 'w-full h-full object-cover m-0 rounded-full' }]
      ],
      ['div', { class: 'w-full' },
        ['h4', { class: 'font-serif text-lg font-bold mb-1 text-heraldry-blue' }, name || 'Navn'],
        ['p', { class: 'font-sans font-medium text-sm text-heraldry-red' }, role || 'Rolle'],
        email ? ['a', { href: `mailto:${email}`, class: 'block mt-2 text-xs text-slate-500 break-all no-underline hover:text-heraldry-blue transition-colors font-medium' }, email] : '',
      ]
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(PersonCardNodeView);
  },
});

const ImageGalleryItemNodeView = (props: any) => {
    const { node, updateAttributes } = props;
    const [isFlipped, setIsFlipped] = useState(false);
    const context = React.useContext(EditorContext);

    const handleFlip = () => {
        if (isFlipped) return;
        setIsFlipped(true);
    };

    const stopPropagation = (e: React.MouseEvent | React.FocusEvent) => e.stopPropagation();
    
    return (
        <NodeViewWrapper className={`relative perspective-1000 group inline-block m-2 h-[240px] w-full max-w-[320px]`}>
            <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`} onClick={handleFlip}>
                <div className="absolute w-full h-full backface-hidden flex flex-col p-2 border border-slate-200 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow">
                    <div className="relative w-full flex-1 mb-2 overflow-hidden rounded-md bg-slate-100 flex items-center justify-center">
                        {node.attrs.src ? (
                            <img src={node.attrs.src} alt="" className="w-full h-full object-cover my-0 rounded" />
                        ) : (
                            <div className="text-slate-300"><ImageIcon size={32} /></div>
                        )}
                    </div>
                    <p className="text-xs italic text-slate-500 line-clamp-1 h-4 px-1">{node.attrs.caption || 'Ingen bildetekst'}</p>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" className="h-8 w-8 rounded-full bg-slate-900/60 backdrop-blur-sm shadow-sm text-white flex items-center justify-center hover:bg-heraldry-blue transition-colors">
                            <ImageIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="absolute w-full h-full backface-hidden rotate-y-180 p-4 border border-slate-200 rounded-lg bg-slate-50 flex flex-col" onClick={stopPropagation}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Rediger Bilde</span>
                        <button type="button" className="h-6 w-6 rounded-full text-red-500 hover:bg-red-50 flex justify-center items-center" onClick={(e) => { e.stopPropagation(); props.deleteNode(); }}>
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <div className="space-y-4 flex-1">
                        <div className="space-y-1">
                            <label className="text-[10px] font-sans uppercase font-bold text-slate-500 block">Bildetekst</label>
                            <input 
                                value={node.attrs.caption} 
                                onChange={e => updateAttributes({ caption: e.target.value })}
                                className="w-full px-2 py-1 h-8 text-sm bg-white border border-slate-200 rounded outline-none focus:border-heraldry-blue"
                                placeholder="Skriv bildetekst..."
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-auto">
                        <button type="button" className="flex-1 h-8 text-xs bg-white border border-slate-200 hover:bg-slate-50 rounded flex justify-center items-center font-bold text-slate-600" onClick={() => context?.openImagePicker((url) => updateAttributes({ src: url }))}>
                            <Camera className="w-3 h-3 mr-1.5" /> Bilde
                        </button>
                        <button type="button" className="flex-1 h-8 text-xs bg-heraldry-blue text-white hover:bg-slate-800 rounded flex justify-center items-center font-bold" onClick={() => setIsFlipped(false)}>
                            <Check className="w-3 h-3 mr-1.5" /> Ferdig
                        </button>
                    </div>
                </div>
            </div>
        </NodeViewWrapper>
    );
};

const ImageGallery = Node.create({
  name: 'imageGallery',
  group: 'block',
  content: 'imageGalleryItem*',
  parseHTML() {
    return [{ tag: 'div[data-type="image-gallery"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'image-gallery', class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8 p-4 bg-slate-50/30 rounded-lg border border-slate-100' }), 0];
  },
});

const ImageGalleryItem = Node.create({
  name: 'imageGalleryItem',
  group: 'block',
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      src: { default: '' },
      caption: { default: '' },
    };
  },
  parseHTML() {
    return [{
      tag: 'div[data-type="image-gallery-item"]',
      getAttrs: dom => ({
        src: (dom as HTMLElement).querySelector('img')?.getAttribute('src'),
        caption: (dom as HTMLElement).querySelector('figcaption')?.textContent,
      }),
    }];
  },
  renderHTML({ node }) {
    const { src, caption } = node.attrs;
    return ['div', { 'data-type': 'image-gallery-item', class: 'p-2 border border-slate-200 rounded-lg bg-white shadow-sm inline-block' },
      ['div', { class: 'relative w-full aspect-video mb-2 overflow-hidden rounded-md bg-slate-100 flex justify-center items-center' },
        ['img', { src: src || 'https://placehold.co/600x400?text=Bilde', alt: caption || 'Bilde', class: 'w-full h-full object-cover m-0' }]
      ],
      ['figcaption', { class: 'text-xs italic text-slate-500 text-center mt-2' }, caption || '']
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageGalleryItemNodeView);
  },
});

const CustomOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        },
      },
    };
  },
});

interface Footnote {
  id: string;
  content: string;
  number?: number;
  occurrences?: string[]; 
}

const FOOTNOTE_MD_SEPARATOR = '\n\n[footnotes]\n';

function buildFootnotesMarkdown(footnotes: Footnote[]): string {
    const used = footnotes.filter(fn => fn.number != null && fn.id);
    if (used.length === 0) return '';
    const sorted = [...used].sort((a, b) => (a.number || 0) - (b.number || 0));
    return FOOTNOTE_MD_SEPARATOR + sorted.map(fn => `[^${fn.id}]: ${fn.content || ''}`).join('\n');
}

function parseFootnotesMarkdown(raw: string): { mainContent: string; footnotes: Footnote[] } {
    const separators = [
        '\n\n[footnotes]\n',
        '\n\n<!-- footnotes -->\n',
        '[footnotes]\n',
        '<!-- footnotes -->\n',
    ];

    for (const sep of separators) {
        const sepIdx = raw.indexOf(sep);
        if (sepIdx !== -1) {
            const mainContent = raw.substring(0, sepIdx);
            const mdPart = raw.substring(sepIdx + sep.length);
            const footnotes: Footnote[] = [];
            let number = 1;
            const lineRegex = /^\[\^([^\]]+)\]:\s*(.*)$/gm;
            let match;
            while ((match = lineRegex.exec(mdPart)) !== null) {
                footnotes.push({ id: match[1], content: match[2] || '', number: number++ });
            }
            return { mainContent, footnotes };
        }
    }
    return { mainContent: raw, footnotes: [] };
}


// --- Main Component ---

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ToolbarButton = ({ onClick, children, isActive = false, title, disabled = false }: {
  onClick: () => void; children: React.ReactNode; isActive?: boolean; title?: string; disabled?: boolean;
}) => (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
        className={`p-2 rounded hover:bg-slate-200 transition-colors flex items-center justify-center ${isActive ? 'bg-slate-200 text-heraldry-blue' : 'text-slate-600'}`}>
        {children}
    </button>
);

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
    const [showFootnoteSidebar, setShowFootnoteSidebar] = useState(false);
    const [footnotes, setFootnotes] = useState<Footnote[]>([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const fullscreenWrapperRef = useRef<HTMLDivElement>(null);
    const [pendingImageCallback, setPendingImageCallback] = useState<((url: string, title?: string, sourceUrl?: string) => void) | null>(null);
    const footnotesRef = useRef<Footnote[]>([]);
    const lastEmittedValue = useRef<string | null>(null);
    const isInitialMount = useRef(true);
    const onChangeRef = useRef(onChange);
    useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
    const isReconcilingRef = useRef(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ 
              heading: { levels: [1, 2, 3] }, 
              image: false, 
              orderedList: false, 
              horizontalRule: { HTMLAttributes: { class: 'border-t border-slate-300 my-8' } } 
            }),
            CustomOrderedList, CustomImage, PersonGallery, PersonItem, ImageGallery, ImageGalleryItem, Underline, Superscript, FootnoteReference,
            Table.configure({ resizable: true }),
            TableRow, TableHeader, TableCell,
            Link.configure({ openOnClick: false, autolink: true }),
            Placeholder.configure({ placeholder: placeholder || 'Begynn å skrive her...' }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: '',
        editorProps: {
            attributes: { class: 'prose prose-slate prose-lg max-w-none focus:outline-none min-h-[300px] outline-none min-h-full pb-32 pt-8 w-full font-sans' },
        },
    });

    const reconcileAndTriggerChange = useCallback(() => {
        if (!editor || editor.isDestroyed) return;
        if (isReconcilingRef.current) return;
        isReconcilingRef.current = true;

        const refsInDoc: { id: string; pos: number; node: any }[] = [];
        editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'footnoteReference') refsInDoc.push({ id: node.attrs.id, pos, node });
        });

        const idToNumber = new Map<string, number>();
        const idToOccurrences = new Map<string, string[]>(); 
        let n = 1;
        
        refsInDoc.forEach(({ id }) => {
            if (!id) return;
            if (!idToNumber.has(id)) {
                idToNumber.set(id, n++);
                idToOccurrences.set(id, []);
            }
            const currentList = idToOccurrences.get(id)!;
            const letter = String.fromCharCode(97 + currentList.length); 
            currentList.push(`ref-${id}-${letter}`);
        });
        
        const currentFootnoteData = new Map(footnotesRef.current.map(f => [f.id, f.content]));

        const nextFootnotes: Footnote[] = [];
        idToNumber.forEach((num, id) => {
            nextFootnotes.push({ 
                id, 
                content: currentFootnoteData.get(id) || '', 
                number: num,
                occurrences: idToOccurrences.get(id) || []
            });
        });
        
        footnotesRef.current = nextFootnotes.sort((a, b) => (a.number || 0) - (b.number || 0));
        setFootnotes([...footnotesRef.current]);
        
        let tr = editor.state.tr;
        let changed = false;
        const localOccCounter = new Map<string, number>();

        editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'footnoteReference') {
                const id = node.attrs.id;
                const correctNum = idToNumber.get(id);
                const content = currentFootnoteData.get(id) || '';
                const plainTextContent = content.replace(/<[^>]*>?/gm, '').trim();
                const count = localOccCounter.get(id) || 0;
                const letter = String.fromCharCode(97 + count);
                localOccCounter.set(id, count + 1);
                
                if (correctNum !== undefined && (node.attrs.number !== String(correctNum) || node.attrs.title !== plainTextContent || node.attrs.occurrence !== letter)) {
                    tr = tr.setNodeMarkup(pos, undefined, { 
                        ...node.attrs, 
                        number: String(correctNum),
                        title: plainTextContent,
                        occurrence: letter
                    });
                    changed = true;
                }
            }
        });
        if (changed) editor.view.dispatch(tr);
        
        const mainContent = editor.getHTML();
        const footnotesMd = buildFootnotesMarkdown(footnotesRef.current);
        const fullValue = mainContent + footnotesMd;
        
        if (fullValue !== lastEmittedValue.current) {
            lastEmittedValue.current = fullValue;
            onChangeRef.current(fullValue);
        }
        isReconcilingRef.current = false;
    }, [editor]);

    const handleUpdate = useCallback(() => {
        reconcileAndTriggerChange();
    }, [reconcileAndTriggerChange]);

    useEffect(() => {
        if (!editor || editor.isDestroyed) return;
        editor.on('update', handleUpdate);
        return () => { editor.off('update', handleUpdate); };
    }, [editor, handleUpdate]);

    useEffect(() => {
        if (!editor || editor.isDestroyed) return;
        if (value === lastEmittedValue.current) return;

        const currentValue = editor.getHTML() + buildFootnotesMarkdown(footnotesRef.current);
        if (value === currentValue && !isInitialMount.current) return;

        isInitialMount.current = false;

        const { mainContent, footnotes: loadedFootnotes } = parseFootnotesMarkdown(value || '');

        footnotesRef.current = loadedFootnotes;
        setFootnotes(loadedFootnotes);
        lastEmittedValue.current = value;

        if (loadedFootnotes.length > 0) setShowFootnoteSidebar(true);

        editor.off('update', handleUpdate);

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = mainContent;

        const fnAnchors = Array.from(tempDiv.querySelectorAll('a[data-footnote-ref]'));
        const placeholders: Array<{ id: string; number: string; occurrence: string }> = [];

        fnAnchors.forEach((anchor, i) => {
            const sup = anchor.querySelector('sup');
            const id = sup?.getAttribute('data-footnote-id') || '';
            const displayLabel = sup?.textContent?.trim() || '?';
            const baseNumber = displayLabel.split('-')[0];
            const occurrence = (anchor as HTMLElement).id?.replace(`ref-${id}-`, '') || 'a';
            placeholders.push({ id, number: baseNumber, occurrence });
            const span = document.createElement('span');
            span.setAttribute('data-fn-placeholder', String(i));
            anchor.replaceWith(span);
        });

        editor.commands.setContent(tempDiv.innerHTML, false);

        if (placeholders.length > 0) {
            const editorDom = editor.view.dom;
            let { state } = editor;
            let tr = state.tr;
            [...placeholders].reverse().forEach((placeholder, ri) => {
                const i = placeholders.length - 1 - ri;
                const spanEl = editorDom.querySelector(`[data-fn-placeholder="${i}"]`);
                if (!spanEl) return;
                try {
                    const pos = editor.view.posAtDOM(spanEl, 0);
                    tr = tr.replaceWith(
                        pos - 1,
                        pos - 1 + (spanEl.textContent?.length || 0) + 1,
                        state.schema.nodes.footnoteReference.create({
                            id: placeholder.id,
                            number: placeholder.number,
                            occurrence: placeholder.occurrence,
                        })
                    );
                } catch (e) {
                    console.warn('[load] could not inject footnoteReference at placeholder', i, e);
                }
            });
            editor.view.dispatch(tr);
        }

        editor.on('update', handleUpdate);
        queueMicrotask(() => reconcileAndTriggerChange());
    }, [editor, value, handleUpdate, reconcileAndTriggerChange]);

    const handleFileSelect = (url: string, title?: string, sourceUrl?: string) => {
        if (pendingImageCallback) {
            pendingImageCallback(url, title, sourceUrl);
            setPendingImageCallback(null);
        } else if (editor) {
            if (title && sourceUrl) {
                const cleanTitle = title.replace(/^File:/, '').replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
                editor.chain().focus().insertContent({ 
                    type: 'customImage', 
                    attrs: { 
                        src: url, 
                        caption: `Bilde: ${cleanTitle} fra Wikimedia Commons (${sourceUrl})`
                    } 
                }).run();
            } else {
                editor.chain().focus().insertContent({ type: 'customImage', attrs: { src: url } }).run();
            }
        }
        setIsImagePickerOpen(false);
    };

    const handleAddPerson = () => {
        if (!editor) return;
        if (editor.isActive('personGallery')) {
            editor.chain().focus().insertContentAt(editor.state.selection.to, {
                type: 'personItem',
                attrs: { name: 'Ny Person', role: 'Rolle', email: '' }
            }).run();
        } else {
            editor.chain().focus().insertContent({
                type: 'personGallery',
                content: [{ type: 'personItem', attrs: { name: 'Ny Person', role: 'Rolle', email: '' } }]
            }).run();
        }
    };

    const handleAddImageGallery = () => {
        if (!editor) return;
        if (editor.isActive('imageGallery')) {
            editor.chain().focus().insertContentAt(editor.state.selection.to, {
                type: 'imageGalleryItem',
                attrs: { src: '', caption: '' }
            }).run();
        } else {
            editor.chain().focus().insertContent({
                type: 'imageGallery',
                content: [{ type: 'imageGalleryItem', attrs: { src: '', caption: '' } }]
            }).run();
        }
    };

    const toggleStatuteList = () => {
      if (!editor) return;
      if (editor.isActive('orderedList', { class: 'statute-list' })) {
        editor.chain().focus().updateAttributes('orderedList', { class: null }).run();
      } else {
        if (editor.isActive('orderedList')) {
          editor.chain().focus().updateAttributes('orderedList', { class: 'statute-list' }).run();
        } else {
          editor.chain().focus().toggleOrderedList().updateAttributes('orderedList', { class: 'statute-list' }).run();
        }
      }
    };

    const removeFootnote = (id: string) => {
        if (!editor) return;
        const positions: { from: number; to: number }[] = [];
        editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'footnoteReference' && node.attrs.id === id) {
                positions.push({ from: pos, to: pos + node.nodeSize });
            }
        });

        if (positions.length > 0) {
            let tr = editor.state.tr;
            [...positions].reverse().forEach(({ from, to }) => {
                tr = tr.delete(from, to);
            });
            editor.view.dispatch(tr);
        }

        footnotesRef.current = footnotesRef.current.filter(f => f.id !== id);
        setFootnotes([...footnotesRef.current]);

        const mainContent = editor.getHTML();
        const footnotesMd = buildFootnotesMarkdown(footnotesRef.current);
        const fullValue = mainContent + footnotesMd;
        lastEmittedValue.current = fullValue;
        onChangeRef.current(fullValue);
    };

    if (!editor) return null;

    const fullscreenClasses = isFullscreen 
        ? 'fixed inset-0 z-[20000] bg-white flex flex-col md:px-0 overflow-hidden' 
        : 'border border-heraldry-blue/20 bg-white relative rounded flex flex-col h-[600px] max-h-[80vh]';

    const toolbarClasses = isFullscreen
        ? 'flex flex-wrap gap-0 border-b border-heraldry-blue/20 p-2 bg-slate-50 sticky top-0 z-10 shadow-sm rounded-t min-h-[48px]'
        : 'flex flex-wrap gap-0 border-b border-heraldry-blue/20 p-2 bg-slate-50 sticky top-0 z-10 rounded-t min-h-[48px]';

    const editorContent = (
        <EditorContext.Provider value={{ openImagePicker: (cb) => { setPendingImageCallback(() => cb); setIsImagePickerOpen(true); } }}>
            <div ref={fullscreenWrapperRef} className={fullscreenClasses}>
                <div className={toolbarClasses}>
                    <ToolbarButton title={isFullscreen ? "Lukk fullskjerm" : "Fullskjerm"} onClick={() => setIsFullscreen(!isFullscreen)} isActive={isFullscreen}>
                        {isFullscreen ? <Minimize size={18} /> : <Expand size={18} />}
                    </ToolbarButton>
                    <ToolbarButton title="Fotnotepanel" onClick={() => setShowFootnoteSidebar(!showFootnoteSidebar)} isActive={showFootnoteSidebar}><PanelLeft size={18} /></ToolbarButton>
                    <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
                    <ToolbarButton title="Overskrift 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })}><Heading1 size={18} /></ToolbarButton>
                    <ToolbarButton title="Overskrift 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}><Heading2 size={18} /></ToolbarButton>
                    <ToolbarButton title="Overskrift 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })}><Heading3 size={18} /></ToolbarButton>
                    <ToolbarButton title="Paragraf" onClick={() => editor.chain().focus().setParagraph().run()} isActive={editor.isActive('paragraph')}><TextIcon size={18} /></ToolbarButton>
                    <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
                    <ToolbarButton title="Fet" onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}><Bold size={18} /></ToolbarButton>
                    <ToolbarButton title="Kursiv" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}><Italic size={18} /></ToolbarButton>
                    <ToolbarButton title="Understrek" onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}><UnderlineIcon size={18} /></ToolbarButton>
                    <ToolbarButton title="Sett inn lenke" onClick={() => {
                        const previousUrl = editor.getAttributes('link').href;
                        const url = window.prompt('Lenke-URL:', previousUrl || '');
                        if (url === null) return;
                        if (url === '') editor.chain().focus().extendMarkRange('link').unsetLink().run();
                        else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                    }} isActive={editor.isActive('link')}><LinkIcon size={18} /></ToolbarButton>
                    <ToolbarButton title="Superscript" onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive('superscript')}><SuperscriptIcon size={18} /></ToolbarButton>
                    <ToolbarButton title="Sett inn fotnote" onClick={() => { const id = `fn-${Date.now()}`; editor.chain().focus().insertContent({ type: 'footnoteReference', attrs: { id, number: '?' } }).run(); reconcileAndTriggerChange(); setShowFootnoteSidebar(true); }}><BookText size={18} /></ToolbarButton>
                    <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
                    <ToolbarButton title="Venstrejustert" onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })}><AlignLeft size={18} /></ToolbarButton>
                    <ToolbarButton title="Sentrert" onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })}><AlignCenter size={18} /></ToolbarButton>
                    <ToolbarButton title="Høyrejustert" onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })}><AlignRight size={18} /></ToolbarButton>
                    <ToolbarButton title="Blokkjustert" onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })}><AlignJustify size={18} /></ToolbarButton>
                    <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
                    <ToolbarButton title="Punktliste" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}><List size={18} /></ToolbarButton>
                    <ToolbarButton title="Nummerert liste" onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList') && !editor.isActive('orderedList', { class: 'statute-list' })}><ListOrdered size={18} /></ToolbarButton>
                    <ToolbarButton title="Paragraf-liste" onClick={toggleStatuteList} isActive={editor.isActive('orderedList', { class: 'statute-list' })}><span className="font-bold text-xs font-serif leading-none mt-1">§</span></ToolbarButton>
                    <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
                    <ToolbarButton title="Sett inn bilde" onClick={() => { setPendingImageCallback(null); setIsImagePickerOpen(true); }}><ImageIcon size={18} /></ToolbarButton>
                    <ToolbarButton title={editor.isActive('personGallery') ? "Legg til person i galleri" : "Opprett persongalleri"} onClick={handleAddPerson} isActive={editor.isActive('personGallery')}>
                        {editor.isActive('personGallery') ? <UserPlus size={18} /> : <Users size={18} />}
                    </ToolbarButton>
                    <ToolbarButton title={editor.isActive('imageGallery') ? "Legg til bilde i galleri" : "Opprett bildegalleri"} onClick={handleAddImageGallery} isActive={editor.isActive('imageGallery')}>
                        {editor.isActive('imageGallery') ? <Plus size={18} /> : <Images size={18} />}
                    </ToolbarButton>
                    <ToolbarButton title="Skillelinje" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={18} /></ToolbarButton>
                    <ToolbarButton title="Sitat" onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}><Quote size={18} /></ToolbarButton>
                    <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
                    <ToolbarButton title="Sett inn tabell" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={18} /></ToolbarButton>
                    
                    {editor.isActive('table') && (
                        <div className="flex items-center gap-0 border-l border-emerald-200 pl-1 ml-1 bg-emerald-50 rounded-r pr-1">
                            <ToolbarButton title="Rad over" onClick={() => editor.chain().focus().addRowBefore().run()}><ChevronUp size={18} /></ToolbarButton>
                            <ToolbarButton title="Rad under" onClick={() => editor.chain().focus().addRowAfter().run()}><ChevronDown size={18} /></ToolbarButton>
                            <ToolbarButton title="Slett rad" onClick={() => editor.chain().focus().deleteRow().run()}><Minus size={18} className="text-emerald-700" /></ToolbarButton>
                            <ToolbarButton title="Kolonne før" onClick={() => editor.chain().focus().addColumnBefore().run()}><ChevronLeft size={18} /></ToolbarButton>
                            <ToolbarButton title="Kolonne etter" onClick={() => editor.chain().focus().addColumnAfter().run()}><ChevronRight size={18} /></ToolbarButton>
                            <ToolbarButton title="Slett kolonne" onClick={() => editor.chain().focus().deleteColumn().run()}><Minus size={18} className="rotate-90 text-emerald-700" /></ToolbarButton>
                            <ToolbarButton title="Slett tabell" onClick={() => editor.chain().focus().deleteTable().run()}><Trash2 size={18} className="text-red-500" /></ToolbarButton>
                        </div>
                    )}
                </div>

                <div className="flex flex-1 overflow-hidden relative">
                    <div className={`w-72 border-r border-slate-200 bg-slate-50 flex flex-col transition-all duration-300 ${showFootnoteSidebar ? 'translate-x-0' : '-ml-72'}`}>
                        <div className="flex flex-col h-full overflow-y-auto w-72 scrollbar-thin">
                            <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
                                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500">Fotnoter</h3>
                                <button 
                                    type="button"
                                    className="p-1.5 hover:bg-slate-100 rounded text-heraldry-blue transition-colors outline-none"
                                    onClick={() => {
                                        const id = `fn-${Date.now()}`;
                                        editor.chain().focus().insertContent({ type: 'footnoteReference', attrs: { id, number: '?' } }).run();
                                        reconcileAndTriggerChange();
                                        setShowFootnoteSidebar(true);
                                    }}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="p-3">
                                {footnotes.length === 0 ? <p className="text-xs text-slate-400 text-center py-8">Ingen fotnoter ennå.</p> : footnotes.map(fn => (
                                    <div key={fn.id} className="mb-4 bg-white border border-slate-200 rounded shadow-sm overflow-hidden focus-within:border-heraldry-blue transition-colors">
                                        <div className="flex items-center items-stretch bg-slate-50 border-b border-slate-100">
                                            <div className="w-8 flex items-center justify-center font-serif text-sm font-bold text-slate-500 border-r border-slate-100 bg-slate-100">{fn.number}</div>
                                            <div className="flex-1"></div>
                                            <button 
                                                type="button"
                                                title="Sett inn referanse til denne fotnoten"
                                                className="px-3 hover:bg-white text-slate-400 hover:text-heraldry-blue transition-colors outline-none"
                                                onClick={() => {
                                                    editor.chain().focus().insertContent({ 
                                                        type: 'footnoteReference', 
                                                        attrs: { id: fn.id, number: String(fn.number) } 
                                                    }).run();
                                                    reconcileAndTriggerChange();
                                                }}
                                            >
                                                <LinkIcon size={14} />
                                            </button>
                                            <button 
                                                type="button"
                                                className="px-3 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors outline-none"
                                                onClick={() => removeFootnote(fn.id)}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                        <textarea 
                                            className="w-full text-xs p-3 outline-none resize-none font-sans" 
                                            placeholder="Skriv fotnotetekst..." 
                                            value={fn.content} 
                                            onChange={(e) => { 
                                                footnotesRef.current = footnotesRef.current.map(f => f.id === fn.id ? { ...f, content: e.target.value } : f); 
                                                setFootnotes([...footnotesRef.current]); 
                                                reconcileAndTriggerChange(); 
                                            }} 
                                            rows={4} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto scrollbar-thin bg-white flex justify-center">
                        <div className={`w-full ${isFullscreen ? 'max-w-3xl px-8 md:px-12 py-16' : 'px-6 py-6 max-w-none'}`}>
                            <EditorContent editor={editor} className="min-h-full" />
                        </div>
                    </div>
                    
                    {editor && (
                        <BubbleMenu editor={editor} tippyOptions={{ duration: 100, maxWidth: 'none', zIndex: 30000 }} shouldShow={({ editor }) => editor.isActive('customImage')} className="bg-white border border-slate-200 shadow-xl rounded p-3 flex flex-col gap-3 w-72 z-[30000]">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Bildetekst</label>
                                <input placeholder="Skriv bildetekst..." className="h-8 px-2 text-sm border border-slate-200 rounded outline-none focus:border-heraldry-blue" value={editor.getAttributes('customImage').caption || ''} onChange={(e) => editor.commands.updateAttributes('customImage', { caption: e.target.value })} />
                            </div>
                            
                            <div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Bredde: {editor.getAttributes('customImage').width}</label>
                                </div>
                                <input
                                    type="range"
                                    value={parseInt(editor.getAttributes('customImage').width) || 100}
                                    min={10}
                                    max={100}
                                    step={1}
                                    onChange={(e) => editor.chain().focus().updateAttributes('customImage', { width: `${e.target.value}%` }).run()}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2"
                                />
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><WrapText size={14} /> Tekstbryting</label>
                                <input type="checkbox" checked={!!editor.getAttributes('customImage').wrap} onChange={(e) => editor.chain().focus().updateAttributes('customImage', { wrap: e.target.checked }).run()} className="cursor-pointer" />
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Justering</label>
                                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded">
                                    <button type="button" className={`p-1.5 rounded ${editor.getAttributes('customImage').align === 'left' ? 'bg-white shadow-sm text-heraldry-blue' : 'text-slate-400 hover:text-slate-600'}`} onClick={() => editor.chain().focus().updateAttributes('customImage', { align: 'left' }).run()}><AlignLeft size={14} /></button>
                                    <button type="button" className={`p-1.5 rounded ${editor.getAttributes('customImage').align === 'center' ? 'bg-white shadow-sm text-heraldry-blue' : 'text-slate-400 hover:text-slate-600'}`} onClick={() => editor.chain().focus().updateAttributes('customImage', { align: 'center' }).run()}><AlignCenter size={14} /></button>
                                    <button type="button" className={`p-1.5 rounded ${editor.getAttributes('customImage').align === 'right' ? 'bg-white shadow-sm text-heraldry-blue' : 'text-slate-400 hover:text-slate-600'}`} onClick={() => editor.chain().focus().updateAttributes('customImage', { align: 'right' }).run()}><AlignRight size={14} /></button>
                                </div>
                            </div>
                        </BubbleMenu>
                    )}
                </div>

                <ImagePickerDialog 
                    isOpen={isImagePickerOpen} 
                    onClose={() => { setIsImagePickerOpen(false); setPendingImageCallback(null); }} 
                    onSelect={handleFileSelect} 
                />
            </div>
        </EditorContext.Provider>
    );

    return isFullscreen ? createPortal(editorContent, document.body) : editorContent;
}
