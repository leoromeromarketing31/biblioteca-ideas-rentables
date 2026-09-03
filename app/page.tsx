'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ideaData from './ideas.json';

type Level = 'NIVEL 1' | 'NIVEL 2';
type Idea = { id:number; level:Level; category:string; icon:string; title:string; description:string; promise:string; promiseDetail:string; audience:string[]; pains:string[]; ads:string[] };

const ideas = ideaData as Idea[];
const categories = Array.from(new Set(ideas.map((idea) => idea.category)));

function LevelBadge({ level }: { level: Level }) {
  return <span className={`level-badge ${level === 'NIVEL 2' ? 'level-pro' : ''}`}>{level}</span>;
}

function CopyButton({ text, label = 'Copiar' }: { text:string; label?:string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      // oxlint-disable-next-line typescript/no-deprecated -- respaldo para navegadores que bloquean Clipboard API
      document.execCommand('copy');
      textarea.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return <Button variant="outline" size="sm" onClick={copy} aria-label={label || 'Copiar texto'} className="copy-button">{copied ? <Check /> : <Copy />}{label && (copied ? 'Copiado' : label)}</Button>;
}

function copyText(idea: Idea) {
  return `TÍTULO: ${idea.title}
NIVEL: ${idea.level}
CATEGORÍA: ${idea.category}

DESCRIPCIÓN:
${idea.description}

PROMESA:
${idea.promise}
${idea.promiseDetail}

ANUNCIOS:
${idea.ads.map((ad,index) => `${index + 1}. ${ad}`).join('\n')}

PÚBLICO OBJETIVO:
${idea.audience.map((item) => `- ${item}`).join('\n')}

PRINCIPALES DOLORES:
${idea.pains.map((item) => `- ${item}`).join('\n')}`;
}

function Detail({ idea, onBack }: { idea:Idea; onBack:()=>void }) {
  return <div className="detail-page">
    <header className="detail-hero"><div className="shell detail-hero-inner">
      <Button variant="outline" onClick={onBack} className="back-button"><ArrowLeft /> Volver al catálogo</Button>
      <div className="detail-meta"><LevelBadge level={idea.level}/><span>{idea.category}</span></div>
      <div className="detail-title-row"><span className="detail-icon">{idea.icon}</span><h1>{idea.title}</h1></div>
    </div></header>
    <main className="shell detail-layout">
      <section className="detail-main">
        <div className="detail-section"><p className="eyebrow">Descripción</p><p className="lead-copy">{idea.description}</p></div>
        <div className="detail-section"><p className="eyebrow">Sugerencia de promesa</p><div className="promise-card"><div><strong>{idea.promise}</strong><p><em>{idea.promiseDetail}</em></p></div><CopyButton text={`${idea.promise}\n${idea.promiseDetail}`} label="" /></div></div>
        <div className="detail-section"><p className="eyebrow">Sugerencias de anuncio</p><div className="ads-list">{idea.ads.map((ad,index) => <div className="ad-card" key={index}><span>{index+1}</span><p>{ad}</p><CopyButton text={ad} label="" /></div>)}</div></div>
        <CopyButton text={copyText(idea)} label="Copiar contenido" />
      </section>
      <aside className="insights"><div className="insight-card"><p className="eyebrow">Público objetivo</p><ul>{idea.audience.map((item,index)=><li key={index}>{item}</li>)}</ul></div><div className="insight-card"><p className="eyebrow">Principales dolores</p><ul>{idea.pains.map((item,index)=><li key={index}>{item}</li>)}</ul></div></aside>
    </main>
  </div>;
}

export default function Home() {
  const [query,setQuery]=useState(''); const [level,setLevel]=useState<'Todos'|Level>('Todos'); const [category,setCategory]=useState('Todas'); const [selected,setSelected]=useState<Idea|null>(null); const [menuOpen,setMenuOpen]=useState(false);
  useEffect(()=>{ window.scrollTo({top:0,behavior:'smooth'}); },[selected]);
  useEffect(()=>{
    const context=(document as Document & { modelContext?: { registerTool:(tool:unknown,options?:{signal?:AbortSignal})=>void|Promise<void> } }).modelContext;
    if(!context?.registerTool) return;
    const lifecycle=new AbortController();
    const tool={
      name:'filter_catalog', title:'Filtrar catálogo',
      description:'Configura la búsqueda, el nivel y la categoría visibles del Cofre de 50 Ideas de Mini-Apps Rentables.',
      inputSchema:{ type:'object', properties:{ query:{type:'string'}, level:{type:'string',enum:['Todos','NIVEL 1','NIVEL 2']}, category:{type:'string',enum:['Todas',...categories]} }, additionalProperties:false },
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute(input:unknown){
        if(!input||typeof input!=='object'||Array.isArray(input)) throw new Error('Los filtros deben enviarse como un objeto.');
        const values=input as {query?:unknown;level?:unknown;category?:unknown};
        if(values.query!==undefined&&typeof values.query!=='string') throw new Error('query debe ser texto.');
        if(values.level!==undefined&&(typeof values.level!=='string'||!['Todos','NIVEL 1','NIVEL 2'].includes(values.level))) throw new Error('Nivel no válido.');
        if(values.category!==undefined&&(typeof values.category!=='string'||!['Todas',...categories].includes(values.category))) throw new Error('Categoría no válida.');
        const nextQuery=values.query===undefined?'':values.query; const nextLevel=(values.level===undefined?'Todos':values.level) as 'Todos'|Level; const nextCategory=values.category===undefined?'Todas':values.category;
        setQuery(nextQuery); setLevel(nextLevel); setCategory(nextCategory); setSelected(null);
        const count=ideas.filter(idea=>(!nextQuery||`${idea.title} ${idea.description} ${idea.category}`.toLowerCase().includes(nextQuery.toLowerCase()))&&(nextLevel==='Todos'||idea.level===nextLevel)&&(nextCategory==='Todas'||idea.category===nextCategory)).length;
        return {query:nextQuery,level:nextLevel,category:nextCategory,visibleIdeas:count};
      }
    };
    try { void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>undefined); } catch { /* WebMCP no está disponible en todos los navegadores. */ }
    return ()=>lifecycle.abort();
  },[]);
  const filtered=useMemo(()=>ideas.filter(idea=>{ const needle=query.trim().toLowerCase(); return (!needle||`${idea.title} ${idea.description} ${idea.category}`.toLowerCase().includes(needle))&&(level==='Todos'||idea.level===level)&&(category==='Todas'||idea.category===category); }),[query,level,category]);
  if(selected) return <Detail idea={selected} onBack={()=>setSelected(null)}/>;
  return <div className="catalog-page">
    <header className="catalog-hero"><div className="shell"><p className="brand-kicker"><span/>Agencia Prime Media</p><h1>Cofre de <em>50</em> Ideas de<br/>Mini-Apps Rentables</h1><p className="hero-copy">Ideas seleccionadas, mejoradas y con copy listo para lanzar hoy.</p></div></header>
    <div className="toolbar-wrap"><div className="shell toolbar">
      <div className="search-wrap"><Search aria-hidden="true"/><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por idea o categoría…" aria-label="Buscar ideas"/></div>
      <Tabs value={level} onValueChange={value=>setLevel(value as 'Todos'|Level)}><TabsList className="level-tabs"><TabsTrigger value="Todos">Todos</TabsTrigger><TabsTrigger value="NIVEL 1">Nivel 1</TabsTrigger><TabsTrigger value="NIVEL 2">Nivel 2</TabsTrigger></TabsList></Tabs>
      <Button variant="outline" size="icon" className="mobile-menu" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Mostrar categorías">{menuOpen?<X/>:<Menu/>}</Button>
    </div></div>
    <main className="shell catalog-layout">
      <aside className={`category-sidebar ${menuOpen?'open':''}`}><p className="eyebrow">Categorías</p><button className={category==='Todas'?'active':''} onClick={()=>{setCategory('Todas');setMenuOpen(false)}}>Todas las ideas <span>{ideas.length}</span></button>
        <div className="sidebar-group"><LevelBadge level="NIVEL 1"/>{categories.filter(cat=>ideas.some(i=>i.category===cat&&i.level==='NIVEL 1')).map(cat=><button className={category===cat?'active':''} key={cat} onClick={()=>{setCategory(cat);setMenuOpen(false)}}>{cat}</button>)}</div>
        <div className="sidebar-group"><LevelBadge level="NIVEL 2"/>{categories.filter(cat=>ideas.some(i=>i.category===cat&&i.level==='NIVEL 2')).map(cat=><button className={category===cat?'active':''} key={cat} onClick={()=>{setCategory(cat);setMenuOpen(false)}}>{cat}</button>)}</div>
      </aside>
      <section className="results" aria-live="polite"><div className="results-top"><p><strong>{filtered.length}</strong> ideas encontradas</p>{category!=='Todas'&&<button onClick={()=>setCategory('Todas')}>Quitar filtro ×</button>}</div>
        {filtered.length?<div className="idea-grid">{filtered.map(idea=><article className="idea-card" key={idea.id}><div className="idea-card-top"><LevelBadge level={idea.level}/><span className="idea-icon">{idea.icon}</span></div><p className="idea-category">{idea.category}</p><h2>{idea.title}</h2><p className="idea-description">{idea.description}</p><button className="view-link" onClick={()=>setSelected(idea)}>Ver idea <ArrowRight/></button></article>)}</div>:<div className="empty-state"><span>⌕</span><h2>No encontramos coincidencias</h2><p>Prueba con otra palabra o elimina alguno de los filtros.</p><Button variant="outline" onClick={()=>{setQuery('');setLevel('Todos');setCategory('Todas')}}>Limpiar filtros</Button></div>}
      </section>
    </main>
    <footer><div className="shell"><span>Cofre de 50 Ideas de Mini-Apps Rentables</span><p>© Agencia Prime Media - Leo Romero 2026</p></div></footer>
  </div>;
}
