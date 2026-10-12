import React, { useEffect, useMemo, useState } from 'react'
import { Home, Search, CarFront, ClipboardList, UserRound, MapPin, CalendarDays, Clock3, Users, ArrowRight, Plus, Leaf, ShieldCheck, Bell, Menu, X, Check, Route, Wallet, SlidersHorizontal } from 'lucide-react'
import { API_BASE_URL } from './api.js'

const starterRides = [
  {id:1, from:'Madhapur', to:'JNTU College', date:'2026-10-12', time:'08:15', seats:3, price:35, driver:'Aarav Sharma', car:'Hyundai i20', rating:'4.9', tag:'Popular'},
  {id:2, from:'Kukatpally', to:'CBIT Campus', date:'2026-10-12', time:'08:30', seats:2, price:50, driver:'Meera Reddy', car:'Maruti Baleno', rating:'5.0', tag:'Verified'},
  {id:3, from:'Ameerpet', to:'Osmania University', date:'2026-10-12', time:'09:00', seats:1, price:25, driver:'Ishaan Verma', car:'Honda Amaze', rating:'4.8', tag:'Almost full'},
]
const menu = [{id:'home',label:'Dashboard',icon:Home},{id:'find',label:'Find a ride',icon:Search},{id:'offer',label:'Offer a ride',icon:CarFront},{id:'bookings',label:'My bookings',icon:ClipboardList},{id:'profile',label:'My profile',icon:UserRound}]
const read = (k, fallback) => { try { return JSON.parse(localStorage.getItem(k)) ?? fallback } catch { return fallback } }
const write = (k,v) => localStorage.setItem(k, JSON.stringify(v))

export default function App() {
  const [page, setPage] = useState('home');
  const [authMode, setAuthMode] = useState('register');
  const [registered, setRegistered] = useState(false);

  const [mobile, setMobile] = useState(false);
  const [toast, setToast] = useState('');
  const [user, setUser] = useState(() =>
    read('cc_user', {
      name: 'Student',
      email: '',
      phone: '',
      college: '',
      studentId: null,
    })
  );

  const [rides, setRides] = useState(() =>
    read('cc_rides', starterRides)
  );

  const [bookings, setBookings] = useState(() =>
    read('cc_bookings', [])
  );

  const [query,setQuery]=useState({from:'',to:'',date:''}),[filters,setFilters]=useState({from:'',to:'',date:''})
  useEffect(()=>write('cc_user',user),[user]);useEffect(()=>write('cc_rides',rides),[rides]);useEffect(()=>write('cc_bookings',bookings),[bookings])
  useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(''),2800);return()=>clearTimeout(t)}},[toast])
  const results=useMemo(()=>rides.filter(r=>(!filters.from||r.from.toLowerCase().includes(filters.from.toLowerCase()))&&(!filters.to||r.to.toLowerCase().includes(filters.to.toLowerCase()))&&(!filters.date||r.date===filters.date)),[rides,filters])
  const go=p=>{setPage(p);setMobile(false)}
  function book(r){if(!r.seats)return setToast('This ride is full.');if(bookings.some(b=>b.rideId===r.id&&b.status==='Confirmed'))return setToast('You already booked this ride.');setBookings([{id:Date.now(),rideId:r.id,from:r.from,to:r.to,date:r.date,time:r.time,price:r.price,status:'Confirmed'},...bookings]);setRides(rides.map(x=>x.id===r.id?{...x,seats:x.seats-1}:x));setToast('Ride booked successfully!')}
  function cancel(b){setBookings(bookings.map(x=>x.id===b.id?{...x,status:'Cancelled'}:x));setRides(rides.map(r=>r.id===b.rideId?{...r,seats:r.seats+1}:r));setToast('Booking cancelled.')}
  function offer(form){setRides([{...form,id:Date.now(),driver:user.name||'You',rating:'New',tag:'New ride'},...rides]);setToast('Your ride has been published!');go('find')}
  function handleRegistration(student) {
  const newUser = {
    id: student.id,
    studentId: student.studentId ?? student.id,
    name: student.name,
    email: student.email,
    phone: student.phone,
    college: student.college,
  };

  setUser(newUser);
  write('cc_user', newUser);
  setRegistered(true);
  setPage('home');
  setToast('Welcome, ' + newUser.name + '!');
}
if (!registered) {
  return authMode === 'register' ? (
    <Register
      onRegister={handleRegistration}
      onLogin={() => setAuthMode('login')}
    />
  ) : (
    <Login
      onLogin={handleRegistration}
      onRegister={() => setAuthMode('register')}
    />
  );
}
return <div className="shell">
    <aside className={`sidebar ${mobile?'open':''}`}><div className="brand"><div className="brand-icon"><CarFront/></div><div><b>Campus<span>Carpool</span></b><small>SHARE THE JOURNEY</small></div><button className="close mobile-only" onClick={()=>setMobile(false)}><X/></button></div><div className="nav-label">WORKSPACE</div><nav>{menu.map(m=><button key={m.id} className={page===m.id?'active':''} onClick={()=>go(m.id)}><m.icon size={18}/>{m.label}{m.id==='bookings'&&bookings.filter(b=>b.status==='Confirmed').length>0&&<i>{bookings.filter(b=>b.status==='Confirmed').length}</i>}</button>)}</nav><div className="sidebar-bottom"><div className="eco"><Leaf/><b>Good for your wallet.<br/>Better for the planet.</b><p>Sharing rides makes campus travel greener.</p></div><div className="sidebar-person"><div className="avatar">{(user.name||'S')[0].toUpperCase()}</div><div><b>{user.name||'Student'}</b><small>{user.college||'College student'}</small></div></div></div></aside>
    {mobile&&<button className="scrim" onClick={()=>setMobile(false)} aria-label="Close menu"/>}
    <main className="main"><header className="topbar"><div className="crumb"><button className="mobile-only menu-btn" onClick={()=>setMobile(true)}><Menu/></button>Workspace <span>/</span> <b>{menu.find(m=>m.id===page)?.label}</b></div><div className="top-actions"><span className="online">● System online</span><button className="bell" onClick={()=>setToast('You are all caught up!')}><Bell size={18}/></button><button className="top-user" onClick={()=>go('profile')}><div className="avatar small">{(user.name||'S')[0].toUpperCase()}</div>{user.name||'Student'}</button></div></header>
    <div className="content">
      {page==='home'&&<><section className="hero"><div className="hero-text"><div className="kicker">✦ YOUR CAMPUS, CONNECTED</div><h1>Every journey is<br/><em>better together.</em></h1><p>Find your people. Share the ride. Make every campus commute count.</p><div className="hero-buttons"><button className="btn light" onClick={()=>go('find')}>Explore rides <ArrowRight size={16}/></button><button className="btn ghost" onClick={()=>go('offer')}><Plus size={16}/> Offer a ride</button></div><small><ShieldCheck size={14}/> Campus community · Shared journeys · Smarter travel</small></div><div className="hero-art"><div className="sun"/><div className="hill h1"/><div className="hill h2"/><div className="road"/><div className="art-car"><CarFront size={68}/></div><div className="float f1"><Users size={15}/> 3 seats available</div><div className="float f2"><Leaf size={15}/> Less emissions</div></div></section>
      <Section title="Your commute at a glance" subtitle="A little overview to get you moving."/><div className="stats"><Stat icon={CarFront} label="Available rides" value={rides.filter(r=>r.seats>0).length} note="Ready for your next trip"/><Stat icon={CalendarDays} label="Your bookings" value={bookings.filter(b=>b.status==='Confirmed').length} note="Confirmed journeys"/><Stat icon={Users} label="Open seats" value={rides.reduce((s,r)=>s+r.seats,0)} note="Across all listed rides"/><Stat icon={Leaf} label="Shared impact" value={`${bookings.filter(b=>b.status==='Confirmed').length*1.8} kg`} note="Estimated CO₂ saved*"/></div>
      <Section title="Where are you headed?" subtitle="Find a ride that fits your schedule."/><SearchForm query={query} setQuery={setQuery} submit={q=>{setFilters(q);go('find')}}/>
      <div className="section-row"><Section title="Rides you might like" subtitle="Popular routes shared by your campus community."/><button className="link-btn" onClick={()=>go('find')}>View all rides <ArrowRight size={15}/></button></div><div className="ride-grid">{rides.filter(r=>r.seats>0).slice(0,3).map(r=><Ride key={r.id} ride={r} book={book}/>)}</div><div className="tip"><ShieldCheck/><div><b>A safer ride starts with a verified community.</b><p>Meet fellow students, plan ahead, and share your trip details with someone you trust.</p></div></div><p className="fine">*Illustrative estimate for this student project, not a measured emissions calculation.</p></>}
      {page==='find'&&<><Heading eyebrow="YOUR NEXT JOURNEY" title="Find a ride" desc="Search available rides and find a fellow student heading your way."/><SearchForm query={query} setQuery={setQuery} submit={setFilters}/><div className="result-line"><b>{results.length} rides found</b><span><SlidersHorizontal size={14}/> All available rides</span></div>{results.length?<div className="ride-grid">{results.map(r=><Ride key={r.id} ride={r} book={book}/>)}</div>:<Empty title="No rides match your search" text="Try a different pickup, destination, or date." action={()=>{const q={from:'',to:'',date:''};setQuery(q);setFilters(q)}} button="Clear filters"/>}</>}
      {page==='offer'&&<Offer submit={offer}/>}
      {page==='bookings'&&<><Heading eyebrow="YOUR TRAVEL PLANS" title="My bookings" desc="Keep track of the rides you've reserved."/><div className="booking-list">{bookings.length?bookings.map(b=><div className="booking" key={b.id}><div className="booking-date"><CalendarDays/><b>{b.date}</b><small>{b.time}</small></div><div className="booking-route"><b>{b.from} <ArrowRight size={15}/> {b.to}</b><small>Campus carpool · Booking #{String(b.id).slice(-5)}</small></div><div className="booking-cost"><b>₹{b.price}</b><small>per person</small></div><span className={b.status==='Confirmed'?'confirmed':'cancelled'}>● {b.status}</span>{b.status==='Confirmed'&&<button className="btn outline small-btn" onClick={()=>cancel(b)}>Cancel</button>}</div>):<Empty title="Your journey starts here" text="You haven't booked any rides yet. Find one that matches your schedule." action={()=>go('find')} button="Explore rides"/>}</div></>}
      {page==='profile'&&<Profile user={user} save={u=>{setUser(u);setToast('Profile saved successfully.')}}/>}
      <footer><span>© 2026 CampusCarpool</span><span><ShieldCheck size={14}/> Built for safer, smarter campus travel</span><small>Backend: {API_BASE_URL}</small></footer>
    </div></main>{toast&&<div className="toast"><Check size={17}/>{toast}<button onClick={()=>setToast('')}><X size={15}/></button></div>}
  </div>
}
function Section({title,subtitle}){return <div className="section-title"><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div></div>}
function Heading({eyebrow,title,desc}){return <div className="heading"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{desc}</p></div>}
function Stat({icon:Icon,label,value,note}){return <div className="stat"><div className="stat-icon"><Icon size={19}/></div><small>{label}</small><strong>{value}</strong><p>{note}</p></div>}
function SearchForm({query,setQuery,submit}){return <form className="search-form" onSubmit={e=>{e.preventDefault();submit(query)}}><label><small><MapPin/> PICKUP</small><input placeholder="Where from?" value={query.from} onChange={e=>setQuery({...query,from:e.target.value})}/></label><label><small><Route/> DESTINATION</small><input placeholder="Where to?" value={query.to} onChange={e=>setQuery({...query,to:e.target.value})}/></label><label><small><CalendarDays/> DATE</small><input type="date" value={query.date} onChange={e=>setQuery({...query,date:e.target.value})}/></label><button className="btn primary"><Search size={16}/> Find rides</button></form>}
function Ride({ride:r,book}){return <article className="ride"><div className="driver"><div className="driver-avatar">{r.driver.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><div><b>{r.driver}</b><small><span className="star">★</span> {r.rating} · {r.car}</small></div><span className="tag">{r.tag}</span></div><div className="route"><div className="route-rail"><i/><span/><i/></div><div className="stops"><div><b>{r.from}</b><small>Pickup point</small></div><div><b>{r.to}</b><small>Destination</small></div></div></div><div className="ride-meta"><span><CalendarDays/> {r.date}</span><span><Clock3/> {r.time}</span><span><Users/> {r.seats} seats</span></div><div className="ride-bottom"><div className="price"><b>₹{r.price}</b><small>/ person</small></div><button className="btn primary" disabled={!r.seats} onClick={()=>book(r)}>{r.seats?'Book ride':'Full'} <ArrowRight size={14}/></button></div></article>}
function Empty({title,text,action,button}){return <div className="empty"><Search size={28}/><h3>{title}</h3><p>{text}</p><button className="btn primary" onClick={action}>{button}</button></div>}
function Offer({submit}){const [f,setF]=useState({from:'',to:'',date:'',time:'08:30',seats:3,price:30,car:''}),[error,setError]=useState('');return <><Heading eyebrow="DRIVE & SHARE" title="Offer a ride" desc="Share your spare seats with other students heading your way."/><div className="form-layout"><form className="panel" onSubmit={e=>{e.preventDefault();if(!f.from||!f.to||!f.date){setError('Please fill in pickup, destination, and departure date.');return}if(f.from.toLowerCase()===f.to.toLowerCase()){setError('Pickup and destination must be different.');return}setError('');submit({...f,seats:Number(f.seats),price:Number(f.price)})}}><h2><CarFront/> Ride details</h2><p className="sub">Tell passengers a little about your journey.</p><div className="fields"><label>Pickup location *<input value={f.from} onChange={e=>setF({...f,from:e.target.value})} placeholder="e.g. Madhapur Metro Station"/></label><label>Destination *<input value={f.to} onChange={e=>setF({...f,to:e.target.value})} placeholder="e.g. JNTU College"/></label><label>Departure date *<input type="date" value={f.date} onChange={e=>setF({...f,date:e.target.value})}/></label><label>Departure time<input type="time" value={f.time} onChange={e=>setF({...f,time:e.target.value})}/></label><label>Available seats<select value={f.seats} onChange={e=>setF({...f,seats:e.target.value})}>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select></label><label>Contribution per person (₹)<input type="number" min="0" value={f.price} onChange={e=>setF({...f,price:e.target.value})}/></label><label className="wide">Car details (optional)<input value={f.car} onChange={e=>setF({...f,car:e.target.value})} placeholder="e.g. White Hyundai i20"/></label></div>{error&&<p className="error">{error}</p>}<div className="notice"><ShieldCheck/> Only share information you are comfortable making visible to fellow students.</div><button className="btn primary full-btn">Publish ride <ArrowRight size={16}/></button></form><aside className="info-panel"><div className="info-illustration"><Users size={35}/></div><h2>Make the journey count.</h2><p>One shared ride can mean fewer cars on the road, a more affordable commute, and new campus connections.</p><b><Wallet/> Share the cost</b><small>Agree on a fair contribution before departure.</small><b><ShieldCheck/> Plan with care</b><small>Confirm pickup details with passengers.</small></aside></div></>}
function Profile({user,save}){const [f,setF]=useState(user);return <><Heading eyebrow="YOUR ACCOUNT" title="My profile" desc="Manage the details you share with your campus community."/><div className="profile-layout"><div className="panel profile-card"><div className="profile-cover"/><div className="avatar profile-avatar">{(f.name||'S')[0].toUpperCase()}</div><h2>{f.name||'Your name'}</h2><p>{f.college||'Add your college below'}</p><span className="tag">Campus community member</span><div className="profile-note"><ShieldCheck/> Private by default. Only share details needed for your ride.</div></div><form className="panel" onSubmit={e=>{e.preventDefault();save(f)}}><h2><UserRound/> Personal information</h2><p className="sub">Keep your profile details up to date.</p><div className="fields"><label className="wide">Full name<input required value={f.name||''} onChange={e=>setF({...f,name:e.target.value})}/></label><label>Email address<input type="email" value={f.email||''} onChange={e=>setF({...f,email:e.target.value})} placeholder="you@example.com"/></label><label>Phone number<input type="tel" value={f.phone||''} onChange={e=>setF({...f,phone:e.target.value})} placeholder="Contact number"/></label><label className="wide">College / University<input value={f.college||''} onChange={e=>setF({...f,college:e.target.value})} placeholder="Your college name"/></label></div><button className="btn primary full-btn">Save changes <ArrowRight size={16}/></button></form></div><div className="notice"><ShieldCheck/> Demo profile data is stored in this browser. Add secure backend authentication before using real student accounts.</div></>}
function Register({ onRegister, onLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Registration form:', {
      ...form,
      password: form.password ? '[PASSWORD ENTERED]' : '[EMPTY]',
      });
      const response = await fetch(
        `${API_BASE_URL}/api/students/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          data.error || data.message || 'Registration failed.'
        )
      }

      onRegister(data)
    } catch (err) {
      setError(
        err.message || 'Could not connect to the server.'
      )
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="register-page">
      <form className="panel register-card" onSubmit={handleSubmit}>
        <div className="brand-icon">
          <CarFront />
        </div>

        <h1>Create your account</h1>

        <p className="sub">
          Join CampusCarpool and share your campus journeys.
        </p>

        <div className="fields">
          <label>
            Full name
            <input
              required
              maxLength={100}
              value={form.name}
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </label>

          <label>
            Email address
            <input
              required
              type="email"
              maxLength={150}
              value={form.email}
              onChange={e =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </label>

          <label>
            Phone number
            <input
              required
              type="tel"
              maxLength={20}
              value={form.phone}
              onChange={e =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </label>

          <label>
            College / University
            <input
              required
              maxLength={150}
              value={form.college}
              onChange={e =>
                setForm({ ...form, college: e.target.value })
              }
            />
          </label>

          <label className="wide">
            Password
            <input
              required
              type="password"
              minLength={8}
              maxLength={72}
              value={form.password}
              onChange={e =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </label>
        </div>

        {error && <p className="error">{error}</p>}

        <button
          className="btn primary full-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
          <ArrowRight size={16} />
        </button>

<p className="register-switch">
  Already have an account?
  {' '}
  <button type="button" onClick={onLogin}>
    Login
  </button>
</p>
      </form>
    </div>
  )
}
function Login({ onLogin, onRegister }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/students/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || data.message || 'Login failed.'
        );
      }

      onLogin(data);
    } catch (err) {
      setError(
        err.message || 'Could not connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <form
        className="panel register-card"
        onSubmit={handleSubmit}
      >
        <div className="brand-icon">
          <CarFront />
        </div>

        <h1>Welcome back!</h1>

        <p className="sub">
          Login to your CampusCarpool account.
        </p>

        <div className="fields">
          <label className="wide">
            Email address
            <input
              required
              type="email"
              maxLength={150}
              value={form.email}
              onChange={e =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </label>

          <label className="wide">
            Password
            <input
              required
              type="password"
              maxLength={72}
              value={form.password}
              onChange={e =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />
          </label>
        </div>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <button
          className="btn primary full-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
          <ArrowRight size={16} />
        </button>

        <p className="register-switch">
          Don't have an account?
          {' '}
          <button
            type="button"
            onClick={onRegister}
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
}