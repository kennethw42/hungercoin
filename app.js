// ===== OPTIONAL FIREBASE (safe to leave as-is for demo) =====
// 1) Put your real config here when ready.
const firebaseConfig = null; // <-- keep null for now to avoid errors

// 2) Only init if config exists (prevents blank-screen if not set)
let db = null;
try {
  if (firebaseConfig) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
  }
} catch (e) {
  console.warn("Firebase init skipped:", e);
}

// ===== REACT APP =====
function App() {
  const [listings, setListings] = React.useState([]);
  const [form, setForm] = React.useState({
    goods: "", price: "", contact: "", country: "", about: ""
  });
  const [filter, setFilter] = React.useState("All");
  const [expanded, setExpanded] = React.useState({});

  // If Firebase is configured, live-subscribe to "listings"
  React.useEffect(() => {
    if (!db) return;
    const unsub = db.collection("listings").onSnapshot(snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setListings(data);
    }, err => console.error(err));
    return () => unsub && unsub();
  }, []);

  // For demo (no Firebase), show some seed data:
  React.useEffect(() => {
    if (db) return; // real data will come from Firestore
    setListings([
      { id: "1", goods: "Organic Maize", price: "75", contact: "maize@farm.co", country: "Kenya", about: "Smallholder cooperative using drip irrigation." },
      { id: "2", goods: "Brown Rice",    price: "60", contact: "rice@sabah.ag", country: "Malaysia", about: "Rain-fed paddy, minimal pesticides." }
    ]);
  }, [db]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.goods || !form.price || !form.contact || !form.country || !form.about) {
      alert("Please fill all fields.");
      return;
    }
    // If Firebase is ready, write to Firestore; else just log (grant demo-safe)
    if (db) {
      try {
        await db.collection("listings").add(form);
        alert("Listing added!");
        setForm({ goods: "", price: "", contact: "", country: "", about: "" });
      } catch (err) {
        alert("Error: " + err.message);
      }
    } else {
      console.log("FAKE SAVE (no Firebase):", form);
      alert("Demo: listing captured (check console).");
      setListings((prev) => [{ id: Date.now().toString(), ...form }, ...prev]);
      setForm({ goods: "", price: "", contact: "", country: "", about: "" });
    }
  };

  const countries = [
    "All","Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria",
    "Bangladesh","Belgium","Benin","Bolivia","Botswana","Brazil","Bulgaria","Burkina Faso","Burundi","Cambodia",
    "Cameroon","Canada","Chile","China","Colombia","Congo","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus",
    "Czech Republic","Denmark","Dominican Republic","Ecuador","Egypt","El Salvador","Estonia","Ethiopia","Finland",
    "France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Guatemala","Guinea","Guyana","Haiti","Honduras",
    "Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan",
    "Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Lithuania",
    "Luxembourg","Madagascar","Malawi","Malaysia","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova",
    "Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nepal","Netherlands","New Zealand",
    "Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan","Panama","Paraguay","Peru",
    "Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia",
    "Sierra Leone","Singapore","Slovakia","Slovenia","Somalia","South Africa","South Korea","South Sudan","Spain",
    "Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand",
    "Togo","Trinidad and Tobago","Tunisia","Turkey","Uganda","Ukraine","United Arab Emirates","United Kingdom",
    "United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
    // US states at end for your original ask
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
    "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts",
    "Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
    "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
    "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
    "Wisconsin","Wyoming"
  ];

  const filtered = filter === "All" ? listings : listings.filter(l => l.country === filter);

  return (
    <>
      <header>
        <h1>FeedHunger.org</h1>
        <p>Empowering Farmers. Feeding the World.</p>
      </header>

      <div className="container">
        <div className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0, marginBottom: 8 }}>List Your Goods</h2>
          <form onSubmit={onSubmit}>
            <label>Goods</label>
            <input name="goods" value={form.goods} onChange={onChange} placeholder="e.g., Maize" />
            <label>Price (HungerCoin)</label>
            <input name="price" type="number" value={form.price} onChange={onChange} placeholder="e.g., 75" />
            <label>Contact</label>
            <input name="contact" value={form.contact} onChange={onChange} placeholder="email or phone" />
            <label>Country / Region</label>
            <select name="country" value={form.country} onChange={onChange}>
              <option value="">Select</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label>About Production</label>
            <textarea name="about" value={form.about} onChange={onChange} placeholder="How you grow/produce" />
            <button type="submit">Submit Listing</button>
          </form>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0, marginBottom: 8 }}>Filter by Country</h2>
          <select value={filter} onChange={(e)=>setFilter(e.target.value)}>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid cols-2">
          {filtered.map(item => (
            <div key={item.id} className="card">
              <h3 style={{ marginTop: 0 }}>{item.goods}</h3>
              <p>Price: {item.price} HC</p>
              <p>Country: {item.country}</p>
              <p>Contact: {item.contact}</p>
              <button
                style={{ background: "transparent", color: "#2563eb", padding: 0, marginTop: 6 }}
                onClick={() => setExpanded(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
              >
                {expanded[item.id] ? "Hide details" : "Show details"}
              </button>
              {expanded[item.id] && <p style={{ marginTop: 8 }}>{item.about}</p>}
            </div>
          ))}
        </div>

        <div className="footer">© 2025 FeedHunger.org • Built for impact.</div>
      </div>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
