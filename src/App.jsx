import {useEffect,useState} from 'react';import {sb} from './supabase.js';
const WA='258847579553',TEL='+258 84 757 9553';
const SERVICOS=['Tranças','Próteses','Aplicação de cabelo','Cabelo bio-orgânico','Maquilhagem','Perucas','Formações'];
const KINDS={todos:'Tudo',foto:'Fotos',video:'Vídeos',novidade:'Novidades',promocao:'Promoções'};
const DEMO=[
{id:'d1',kind:'foto',title:'Box braids com pontas onduladas',media_url:'/img/3.jpg',media_type:'image'},
{id:'d2',kind:'promocao',title:'Marque esta semana e ganhe cuidado capilar',body:'Edite ou apague esta promoção no painel.',media_url:'/img/6.jpg',media_type:'image'},
{id:'d3',kind:'foto',title:'Penteado de noiva com acessório',media_url:'/img/5.jpg',media_type:'image'},
{id:'d4',kind:'novidade',title:'Cacheado preto, o mais pedido',media_url:'/img/2.jpg',media_type:'image'},
{id:'d5',kind:'foto',title:'Tranças acobreadas',media_url:'/img/1.jpg',media_type:'image'},
{id:'d6',kind:'foto',title:'Aplicação de cabelo ondulado',media_url:'/img/4.jpg',media_type:'image'}];
const wa=t=>`https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const route=()=>location.hash.startsWith('#/admin')?'admin':'site';
export default function App(){const[r,setR]=useState(route());useEffect(()=>{const f=()=>setR(route());addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);return r==='admin'?<Admin/>:<Site/>}

function Site(){
const[posts,setPosts]=useState(DEMO),[f,setF]=useState('todos');
useEffect(()=>{sb&&sb.from('posts').select('*').order('created_at',{ascending:false}).then(({data})=>data?.length&&setPosts(data))},[]);
const list=posts.filter(p=>f==='todos'||p.kind===f);
return<>
<header className="nav"><a href="#" className="brand"><span>M</span>iss Beauty</a>
<nav><a href="#servicos">Serviços</a><a href="#novidades">Novidades</a><a href="#marcar">Marcar</a><a href="#contacto">Contacto</a></nav></header>
<section className="hero"><div className="hero-t"><p className="kicker">Maquilhagem e aplicação de cabelo · Maputo</p>
<h1>Tranças e beleza com assinatura de luxo.</h1><p>Do box braids ao penteado de noiva. Marque o seu horário ou peça um orçamento em minutos.</p>
<div className="row"><a className="btn" href="#marcar">Marcar horário</a><a className="btn ghost" href="#marcar" onClick={()=>sessionStorage.tab='orc'}>Pedir orçamento</a></div></div>
<div className="hero-i"><img src="/img/4.jpg" alt="Cabelo ondulado preto"/><img src="/img/3.jpg" alt="Box braids loiras"/></div></section>
<section id="servicos" className="sec"><h2>Serviços</h2><div className="svc">{SERVICOS.map(s=><a key={s} href={wa(`Olá! Quero saber mais sobre: ${s}`)} target="_blank" rel="noreferrer">{s}</a>)}</div>
<p className="muted">Envio para todas as províncias e entrega imediata em perucas selecionadas.</p></section>
<section id="novidades" className="sec"><div className="head"><h2>Novidades e galeria</h2>
<div className="tabs">{Object.entries(KINDS).map(([k,v])=><button key={k} className={f===k?'on':''} onClick={()=>setF(k)}>{v}</button>)}</div></div>
<div className="grid">{list.map(p=><article key={p.id} className="card">
{p.media_type==='video'?<video src={p.media_url} controls preload="metadata"/>:p.media_url&&<img loading="lazy" src={p.media_url} alt={p.title}/>}
<div><small>{KINDS[p.kind]}</small><h3>{p.title}</h3>{p.body&&<p>{p.body}</p>}</div></article>)}
{!list.length&&<p className="muted">Ainda não há publicações aqui.</p>}</div></section>
<Forms/>
<section id="contacto" className="sec contact"><div><h2>Contacto</h2><p>Zona Verde / Khongolote, Paragem Matchecano, Maputo</p>
<p><a href={`tel:${TEL.replace(/ /g,'')}`}>{TEL}</a> (chamadas e WhatsApp)</p>
<a className="btn" href={wa('Olá! Gostaria de mais informações.')} target="_blank" rel="noreferrer">Falar no WhatsApp</a></div>
<img src="/img/8.jpg" alt="Logótipo Miss Beauty Braids.mz"/></section>
<footer>© {new Date().getFullYear()} Miss Beauty Braids.mz · <a href="#/admin">Área da equipa</a></footer></>}

function Forms(){
const[tab,setTab]=useState(sessionStorage.tab||'agenda'),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false);
useEffect(()=>{const t=()=>sessionStorage.tab&&setTab(sessionStorage.tab);addEventListener('hashchange',t);return()=>removeEventListener('hashchange',t)},[]);
async function send(e){e.preventDefault();setBusy(true);setMsg('');const d=Object.fromEntries(new FormData(e.target));
const table=tab==='agenda'?'bookings':'quotes';
if(!sb){setMsg('Base de dados não ligada. A abrir WhatsApp.')}else{const{error}=await sb.from(table).insert(d);if(error){setMsg('Não foi possível enviar. Tente pelo WhatsApp.');setBusy(false);return}}
setBusy(false);e.target.reset();setMsg('Pedido enviado. Vamos contactá-la para confirmar.');
window.open(wa(`Olá! Enviei um pedido de ${tab==='agenda'?'marcação':'orçamento'} (${d.service}${d.date?', '+d.date:''}). Nome: ${d.name}`),'_blank')}
return<section id="marcar" className="sec forms"><div><h2>{tab==='agenda'?'Marcar horário':'Pedir orçamento'}</h2>
<div className="tabs"><button className={tab==='agenda'?'on':''} onClick={()=>setTab('agenda')}>Marcação</button><button className={tab==='orc'?'on':''} onClick={()=>setTab('orc')}>Orçamento</button></div>
<p className="muted">{tab==='agenda'?'Escolha o serviço e o melhor dia. Confirmamos por WhatsApp.':'Descreva o que pretende e responderemos com o valor.'}</p></div>
<form onSubmit={send}><input name="name" required placeholder="Nome"/><input name="phone" required placeholder="Telefone / WhatsApp" inputMode="tel"/>
<select name="service" required defaultValue=""><option value="" disabled>Serviço</option>{SERVICOS.map(s=><option key={s}>{s}</option>)}</select>
{tab==='agenda'?<div className="two"><input name="date" type="date" required min={new Date().toISOString().slice(0,10)}/><input name="time" type="time" required/></div>:null}
<textarea name={tab==='agenda'?'notes':'message'} rows="3" placeholder={tab==='agenda'?'Observações (opcional)':'Estilo, tamanho, cor, referência...'}/>
<button className="btn" disabled={busy}>{busy?'A enviar...':tab==='agenda'?'Enviar marcação':'Pedir orçamento'}</button>{msg&&<p role="status" className="muted">{msg}</p>}</form></section>}

function Admin(){
const[user,setUser]=useState(null),[tab,setTab]=useState('pub');
useEffect(()=>{if(!sb)return;sb.auth.getSession().then(({data})=>setUser(data.session?.user||null));const{data:s}=sb.auth.onAuthStateChange((_,x)=>setUser(x?.user||null));return()=>s.subscription.unsubscribe()},[]);
if(!sb)return<main className="adm"><h2>Configure o Supabase</h2><p>Preencha o ficheiro .env (veja o guia).</p></main>;
if(!user)return<Login/>;
return<main className="adm"><div className="head"><h2>Painel</h2><div className="tabs">{[['pub','Publicações'],['book','Marcações'],['quo','Orçamentos']].map(([k,v])=><button key={k} className={tab===k?'on':''} onClick={()=>setTab(k)}>{v}</button>)}
<button onClick={()=>sb.auth.signOut()}>Sair</button><a href="#">Ver site</a></div></div>
{tab==='pub'?<Posts/>:<Requests table={tab==='book'?'bookings':'quotes'}/>}</main>}

function Login(){const[m,setM]=useState('');
async function go(e){e.preventDefault();const d=Object.fromEntries(new FormData(e.target));const{error}=await sb.auth.signInWithPassword(d);if(error)setM('Email ou palavra-passe incorretos.')}
return<main className="adm narrow"><h2>Área da equipa</h2><form onSubmit={go}><input name="email" type="email" required placeholder="Email"/><input name="password" type="password" required placeholder="Palavra-passe"/><button className="btn">Entrar</button>{m&&<p className="muted">{m}</p>}</form></main>}

function Posts(){const[list,setList]=useState([]),[busy,setBusy]=useState(false),[m,setM]=useState('');
const load=()=>sb.from('posts').select('*').order('created_at',{ascending:false}).then(({data})=>setList(data||[]));useEffect(()=>{load()},[]);
async function pub(e){e.preventDefault();setBusy(true);setM('');const form=e.target,d=Object.fromEntries(new FormData(form)),file=d.file;delete d.file;
if(file&&file.size){const path=`${Date.now()}-${file.name.replace(/[^\w.]/g,'_')}`;const up=await sb.storage.from('media').upload(path,file);
if(up.error){setM('Falha no envio do ficheiro: '+up.error.message);setBusy(false);return}
d.media_url=sb.storage.from('media').getPublicUrl(path).data.publicUrl;d.media_type=file.type.startsWith('video')?'video':'image'}
const{error}=await sb.from('posts').insert(d);setBusy(false);if(error)return setM(error.message);form.reset();setM('Publicado.');load()}
async function del(p){if(!confirm('Apagar esta publicação?'))return;await sb.from('posts').delete().eq('id',p.id);load()}
return<div className="two-col"><form onSubmit={pub}><select name="kind">{Object.entries(KINDS).slice(1).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
<input name="title" required placeholder="Título"/><textarea name="body" rows="3" placeholder="Texto (opcional)"/><input name="file" type="file" accept="image/*,video/*"/>
<button className="btn" disabled={busy}>{busy?'A publicar...':'Publicar'}</button>{m&&<p className="muted">{m}</p>}</form>
<div className="list">{list.map(p=><div key={p.id} className="row2"><span>{KINDS[p.kind]} · {p.title}</span><button onClick={()=>del(p)}>Apagar</button></div>)}{!list.length&&<p className="muted">Nada publicado ainda. O site mostra exemplos até publicar a primeira.</p>}</div></div>}

function Requests({table}){const[l,setL]=useState([]);const load=()=>sb.from(table).select('*').order('created_at',{ascending:false}).then(({data})=>setL(data||[]));useEffect(()=>{load()},[table]);
const st=async(x,s)=>{await sb.from(table).update({status:s}).eq('id',x.id);load()};
return<div className="list">{l.map(x=><div key={x.id} className="req"><div><strong>{x.name}</strong> · {x.service}<br/>{x.date&&<>{x.date} às {x.time}<br/></>}{x.notes||x.message}<br/>
<a href={wa(`Olá ${x.name}, sobre o seu pedido de ${x.service}...`).replace(WA,x.phone.replace(/\D/g,''))} target="_blank" rel="noreferrer">{x.phone}</a></div>
<select value={x.status} onChange={e=>st(x,e.target.value)}><option>novo</option><option>confirmado</option><option>concluído</option><option>cancelado</option></select></div>)}
{!l.length&&<p className="muted">Sem pedidos por agora.</p>}</div>}
