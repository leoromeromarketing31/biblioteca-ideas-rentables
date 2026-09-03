'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Level = 'Esencial' | 'Pro';
type Idea = { id:number; level:Level; category:string; icon:string; title:string; description:string; promise:string; promiseDetail:string; audience:string[]; pains:string[]; ads:string[] };

const shared = {
  audience: ['Profesionales que quieren avanzar con más claridad', 'Emprendedores y equipos pequeños', 'Personas que prefieren sistemas simples y accionables'],
  pains: ['Tiene información dispersa y le cuesta convertirla en acción', 'Pierde tiempo empezando siempre desde cero', 'Necesita una guía concreta, no más teoría'],
};

const ideas: Idea[] = [
  { id:1, level:'Esencial', category:'Productividad personal', icon:'🗓️', title:'Planificador Semanal de Energía y Enfoque', description:'Organiza tu semana según tu energía real, tus prioridades y el tiempo disponible. Convierte objetivos grandes en bloques pequeños y sostenibles.', promise:'Una semana clara antes de que empiece el lunes.', promiseDetail:'En diez minutos defines tus tres prioridades, proteges tus mejores horas y sabes qué dejar para después.', audience:['Profesionales con demasiadas tareas abiertas','Personas que trabajan desde casa','Emprendedores que necesitan foco sin rigidez'], pains:['Termina el día ocupado, pero sin avanzar lo importante','Acepta más tareas de las que caben en su agenda','Planifica demasiado y abandona el sistema a mitad de semana'], ads:['Tu agenda no está llena por falta de tiempo, sino por falta de jerarquía. Diseña una semana que proteja lo importante.','Deja de mover las mismas tareas de lunes a viernes. Prioriza según tu tiempo y energía reales.','Diez minutos de planificación pueden devolverte horas de enfoque. Empieza la semana sabiendo qué sí importa.'] },
  { id:2, level:'Esencial', category:'Marketing & Ventas', icon:'✍️', title:'Generador de Ofertas Claras para Servicios', description:'Responde siete preguntas y transforma un servicio difícil de explicar en una oferta concreta, atractiva y fácil de vender.', promise:'Explica lo que vendes en una frase que sí se entiende.', promiseDetail:'Aterriza el cliente, el problema, el resultado y el diferenciador para crear una propuesta lista para compartir.', audience:['Freelancers que venden servicios personalizados','Consultores con propuestas demasiado amplias','Agencias pequeñas afinando su posicionamiento'], pains:['Sus prospectos preguntan qué incluye exactamente','Habla de procesos cuando el cliente quiere resultados','Cada propuesta empieza desde una página en blanco'], ads:['Si necesitas cinco minutos para explicar tu servicio, tu oferta todavía no está clara. Conviértela en una frase que vende.','Tu servicio puede ser excelente y aun así sonar genérico. Encuentra el ángulo que lo hace fácil de elegir.','Deja de escribir propuestas desde cero. Define una oferta concreta y úsala en tu web, mensajes y llamadas.'] },
  { id:3, level:'Esencial', category:'Finanzas simples', icon:'💸', title:'Tablero de Flujo de Caja para Independientes', description:'Registra cobros, gastos y compromisos futuros en una sola vista. Anticipa semanas ajustadas sin hojas de cálculo complicadas.', promise:'Sabe cuánto puedes gastar sin poner en riesgo el próximo mes.', promiseDetail:'Visualiza el dinero disponible, lo pendiente de cobro y los gastos próximos con una lectura simple.', ...shared, ads:['Facturar más no siempre significa tener más caja. Mira lo que realmente puedes usar antes de gastar.','Tus finanzas no necesitan otra hoja infinita. Necesitan una vista honesta de lo que entra y lo que sale.','Anticipa una semana ajustada antes de que llegue. Ordena cobros, gastos y compromisos en minutos.'] },
  { id:4, level:'Esencial', category:'Bienestar cotidiano', icon:'🌿', title:'Rutinas de Pausa para Días Intensos', description:'Elige cuánto tiempo tienes y cómo te sientes para recibir una pausa guiada breve, práctica y posible de hacer donde estés.', promise:'Baja una marcha sin desaparecer una hora.', promiseDetail:'Encuentra una práctica de dos, cinco o diez minutos adaptada a tu momento y recupera claridad.', ...shared, ads:['No necesitas una mañana libre para sentirte mejor. A veces necesitas dos minutos bien usados.','Tu cuerpo avisa antes de agotarse. Elige una pausa breve según cómo te sientes hoy.','Una pausa útil cabe entre dos reuniones. Recupera claridad sin romper el ritmo del día.'] },
  { id:5, level:'Esencial', category:'Creadores & Contenido', icon:'🎬', title:'Banco de Ideas para 30 Días de Contenido', description:'Convierte una temática en treinta ángulos publicables, organizados por objetivo, formato y etapa de la audiencia.', promise:'Un mes de contenido sin repetir la misma idea.', promiseDetail:'Genera una mezcla equilibrada de educación, autoridad, conversación y venta para tus canales.', ...shared, ads:['No te faltan temas: te faltan ángulos. Convierte una sola idea en un mes de contenido útil.','Deja de abrir el calendario sin saber qué publicar. Organiza treinta ideas según su verdadero objetivo.','Crea, educa y vende sin sonar repetitivo. Tu próximo mes de contenido empieza con una temática.'] },
  { id:6, level:'Pro', category:'Marketing & Ventas', icon:'🎯', title:'Radar de Mensajes que Convierten', description:'Agrupa preguntas, objeciones y frases reales de clientes para detectar patrones y convertirlos en mejores mensajes de venta.', promise:'Deja que tus clientes escriban tu próximo mensaje de venta.', promiseDetail:'Ordena lenguaje real del mercado y descubre qué promesas, pruebas y objeciones merecen aparecer primero.', ...shared, ads:['Tus mejores titulares ya existen en las palabras de tus clientes. Encuéntralos antes de volver a escribir desde cero.','Ordena cien comentarios y descubre el patrón que una lectura rápida no revela.','Cuando el mensaje no conecta, escucha mejor. Convierte conversaciones reales en una propuesta más precisa.'] },
  { id:7, level:'Pro', category:'Operaciones', icon:'⚙️', title:'Diseñador de Procesos para Equipos Pequeños', description:'Documenta un proceso repetitivo, detecta cuellos de botella y genera una guía accionable con responsables y puntos de control.', promise:'Convierte el “así lo hacemos” en un proceso que cualquiera puede seguir.', promiseDetail:'Mapea pasos, decisiones y responsables para reducir errores y evitar que todo dependa de una persona.', ...shared, ads:['Si una tarea se repite, merece un sistema. Documenta el proceso antes de volver a explicarlo.','Tu equipo no necesita más reuniones: necesita saber qué pasa después y quién lo hace.','Haz que el trabajo avance incluso cuando la persona experta no está disponible.'] },
  { id:8, level:'Pro', category:'Aprendizaje', icon:'🧠', title:'Entrenador de Repaso Inteligente', description:'Transforma notas en preguntas breves y organiza repasos según dificultad para recordar más con sesiones más cortas.', promise:'Recuerda lo importante sin volver a leerlo todo.', promiseDetail:'Practica con preguntas activas y un ritmo de repaso que se adapta a lo que todavía cuesta.', ...shared, ads:['Releer se siente productivo, pero recordar exige practicar. Convierte tus notas en preguntas que entrenan la memoria.','No repases todo por igual. Dedica tu tiempo a lo que todavía no dominas.','Tus apuntes pueden convertirse en un entrenamiento diario de diez minutos.'] },
  { id:9, level:'Pro', category:'Clientes & Servicio', icon:'💬', title:'Asistente de Seguimiento a Clientes', description:'Organiza conversaciones pendientes y sugiere seguimientos útiles según el momento, sin mensajes fríos ni insistentes.', promise:'Haz seguimiento sin sentir que estás persiguiendo a nadie.', promiseDetail:'Recuerda el contexto de cada conversación y prepara un próximo mensaje breve, relevante y humano.', ...shared, ads:['La mayoría de las conversaciones no termina: simplemente se enfría. Retómalas con contexto y una razón útil.','Haz seguimiento sin el incómodo “solo quería saber”. Envía un mensaje que sí mueve la conversación.','Recuerda a quién escribir, cuándo y con qué contexto. Menos oportunidades perdidas entre chats.'] },
  { id:10, level:'Pro', category:'Decisiones', icon:'🧭', title:'Comparador de Decisiones Importantes', description:'Evalúa opciones con criterios ponderados, riesgos y escenarios. Te ayuda a ver el intercambio real detrás de cada alternativa.', promise:'Toma decisiones complejas con una cabeza más clara.', promiseDetail:'Separa hechos, preferencias y miedos para comparar alternativas sin reducirlas a una lista superficial.', ...shared, ads:['No todas las decisiones necesitan más información. Algunas necesitan mejores criterios.','Pon tus opciones frente a frente y descubre qué estás priorizando de verdad.','Cuando todo parece importante, decidir se vuelve imposible. Ordena criterios, riesgos y escenarios en una sola vista.'] },
];

const categories = Array.from(new Set(ideas.map((idea) => idea.category)));

function LevelBadge({ level }: { level: Level }) { return <span className={`level-badge ${level === 'Pro' ? 'level-pro' : ''}`}>{level}</span>; }

function CopyButton({ text, label = 'Copiar' }: { text:string; label?:string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  return <Button variant="outline" size="sm" onClick={copy} aria-label={`${label || 'Copiar texto'}: ${text}`} className="copy-button">{copied ? <Check /> : <Copy />}{label && (copied ? 'Copiado' : label)}</Button>;
}

function Detail({ idea, onBack }: { idea:Idea; onBack:()=>void }) {
  const allCopy = `${idea.title}\n\n${idea.description}\n\nPromesa: ${idea.promise}\n${idea.promiseDetail}\n\nAnuncios:\n${idea.ads.map((ad,i)=>`${i+1}. ${ad}`).join('\n')}`;
  return <div className="detail-page">
    <header className="detail-hero"><div className="shell detail-hero-inner">
      <Button variant="outline" onClick={onBack} className="back-button"><ArrowLeft /> Volver al catálogo</Button>
      <div className="detail-meta"><LevelBadge level={idea.level}/><span>{idea.category}</span></div>
      <div className="detail-title-row"><span className="detail-icon">{idea.icon}</span><h1>{idea.title}</h1></div>
    </div></header>
    <main className="shell detail-layout">
      <section className="detail-main">
        <div className="detail-section"><p className="eyebrow">Descripción</p><p className="lead-copy">{idea.description}</p></div>
        <div className="detail-section"><p className="eyebrow">Sugerencia de promesa</p><div className="promise-card"><div><strong>{idea.promise}</strong><p>{idea.promiseDetail}</p></div><CopyButton text={`${idea.promise}\n${idea.promiseDetail}`} label="" /></div></div>
        <div className="detail-section"><p className="eyebrow">Sugerencias de anuncio</p><div className="ads-list">{idea.ads.map((ad,index)=><div className="ad-card" key={ad}><span>{index+1}</span><p>{ad}</p><CopyButton text={ad} label="" /></div>)}</div></div>
        <CopyButton text={allCopy} label="Copiar contenido" />
      </section>
      <aside className="insights"><div className="insight-card"><p className="eyebrow">Público objetivo</p><ul>{idea.audience.map(item=><li key={item}>{item}</li>)}</ul></div><div className="insight-card"><p className="eyebrow">Principales dolores</p><ul>{idea.pains.map(item=><li key={item}>{item}</li>)}</ul></div></aside>
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
      description:'Configura la búsqueda, el nivel y la categoría visibles del catálogo de playbooks.',
      inputSchema:{ type:'object', properties:{ query:{type:'string'}, level:{type:'string',enum:['Todos','Esencial','Pro']}, category:{type:'string',enum:['Todas',...categories]} }, additionalProperties:false },
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute(input:unknown){
        if(!input||typeof input!=='object'||Array.isArray(input)) throw new Error('Los filtros deben enviarse como un objeto.');
        const values=input as {query?:unknown;level?:unknown;category?:unknown};
        if(values.query!==undefined&&typeof values.query!=='string') throw new Error('query debe ser texto.');
        if(values.level!==undefined&&!['Todos','Esencial','Pro'].includes(String(values.level))) throw new Error('Nivel no válido.');
        if(values.category!==undefined&&!['Todas',...categories].includes(String(values.category))) throw new Error('Categoría no válida.');
        const nextQuery=values.query===undefined?'':String(values.query); const nextLevel=(values.level===undefined?'Todos':String(values.level)) as 'Todos'|Level; const nextCategory=values.category===undefined?'Todas':String(values.category);
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
    <header className="catalog-hero"><div className="shell"><p className="brand-kicker"><span/>Biblioteca práctica</p><h1><em>48</em> Playbooks<br/>para Crecer Online</h1><p className="hero-copy">Ideas accionables de producto, marketing y operaciones<br className="desktop-only"/> para convertir experiencia en sistemas que funcionan.</p></div></header>
    <div className="toolbar-wrap"><div className="shell toolbar">
      <div className="search-wrap"><Search aria-hidden="true"/><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por idea o categoría…" aria-label="Buscar ideas"/></div>
      <Tabs value={level} onValueChange={value=>setLevel(value as 'Todos'|Level)}><TabsList className="level-tabs"><TabsTrigger value="Todos">Todos</TabsTrigger><TabsTrigger value="Esencial">Esencial</TabsTrigger><TabsTrigger value="Pro">Pro</TabsTrigger></TabsList></Tabs>
      <Button variant="outline" size="icon" className="mobile-menu" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Mostrar categorías">{menuOpen?<X/>:<Menu/>}</Button>
    </div></div>
    <main className="shell catalog-layout">
      <aside className={`category-sidebar ${menuOpen?'open':''}`}><p className="eyebrow">Categorías</p><button className={category==='Todas'?'active':''} onClick={()=>{setCategory('Todas');setMenuOpen(false)}}>Todas las ideas <span>{ideas.length}</span></button>
        <div className="sidebar-group"><LevelBadge level="Esencial"/>{categories.filter(cat=>ideas.some(i=>i.category===cat&&i.level==='Esencial')).map(cat=><button className={category===cat?'active':''} key={cat} onClick={()=>{setCategory(cat);setMenuOpen(false)}}>{cat}</button>)}</div>
        <div className="sidebar-group"><LevelBadge level="Pro"/>{categories.filter(cat=>ideas.some(i=>i.category===cat&&i.level==='Pro')).map(cat=><button className={category===cat?'active':''} key={cat} onClick={()=>{setCategory(cat);setMenuOpen(false)}}>{cat}</button>)}</div>
      </aside>
      <section className="results" aria-live="polite"><div className="results-top"><p><strong>{filtered.length}</strong> ideas encontradas</p>{category!=='Todas'&&<button onClick={()=>setCategory('Todas')}>Quitar filtro ×</button>}</div>
        {filtered.length?<div className="idea-grid">{filtered.map(idea=><article className="idea-card" key={idea.id} onClick={()=>setSelected(idea)}><div className="idea-card-top"><LevelBadge level={idea.level}/><span className="idea-icon">{idea.icon}</span></div><p className="idea-category">{idea.category}</p><h2>{idea.title}</h2><p className="idea-description">{idea.description}</p><button className="view-link" onClick={()=>setSelected(idea)}>Ver idea <ArrowRight/></button></article>)}</div>:<div className="empty-state"><span>⌕</span><h2>No encontramos coincidencias</h2><p>Prueba con otra palabra o elimina alguno de los filtros.</p><Button variant="outline" onClick={()=>{setQuery('');setLevel('Todos');setCategory('Todas')}}>Limpiar filtros</Button></div>}
      </section>
    </main>
    <footer><div className="shell"><span>Biblioteca práctica</span><p>Ideas pequeñas. Resultados concretos.</p></div></footer>
  </div>;
}

