// 1) Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCkrDfj4E62CP9ieeS0h2pApjlxsvM5Kww",
  authDomain: "feedhunger-f8f39.firebaseapp.com",
  projectId: "feedhunger-f8f39",
  storageBucket: "feedhunger-f8f39.appspot.com",
  messagingSenderId: "119170332956",
  appId: "1:119170332956:web:48e523d6ee3357010ce2d9"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 2) React App
function App() {
  const [listings, setListings] = React.useState([]);
  const [formData, setFormData] = React.useState({
    goods: "",
    price: "",
    contact: "",
    country: "",
    about: ""
  });
  const [selectedCountry, setSelectedCountry] = React.useState("All");
  const [expanded, setExpanded] = React.useState({});

  React.useEffect(() => {
    const unsub = db.collection("listings")
      .orderBy("goods")
      .onSnapshot(
        (snap) => {
          const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log("Fetched listings:", data);
          setListings(data);
        },
        (err) => {
          console.error("Error fetching Firestore data:", err);
          alert("Firestore connection failed. Check Firestore rules and network.");
        }
      );
    return () => unsub();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.goods || !formData.price || !formData.contact || !formData.country || !formData.about) {
      alert("Please fill out all fields.");
      return;
    }
    try {
      await db.collection("listings").add({
        goods: formData.goods.trim(),
        price: formData.price.trim(),
        contact: formData.contact.trim(),
        country: formData.country,
        about: formData.about.trim(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert("Listing submitted!");
      setFormData({ goods: "", price: "", contact: "", country: "", about: "" });
    } catch (err) {
      console.error("Error writing listing:", err);
      alert("Error submitting listing.");
    }
  };

  const toggleAbout = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const connectWallet = async () => {
    try {
      if (window.solana && window.solana.isPhantom) {
        await window.solana.connect();
        alert("Phantom wallet connected!");
      } else {
        alert("Phantom wallet not found.");
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert("Error connecting to wallet.");
    }
  };

  const countries = [
    "All",
    "United States", "Canada", "United Kingdom", "Mexico", "Brazil",
    "France", "Germany", "Italy", "Spain", "Netherlands",
    "China", "Japan", "India", "South Korea", "Indonesia",
    "South Africa", "Kenya", "Nigeria", "Ethiopia", "Ghana",
    "Australia", "New Zealand", "UAE", "Saudi Arabia", "Qatar"
  ];

  const filtered = selectedCountry === "All"
    ? listings
    : listings.filter(item => item.country === selectedCountry);

  return (
    <div className="page">
      <header>
        <h1>FeedHunger.org</h1>
        <p>Global Platform for Regional Food Trade • Powered by HungerCoin</p>
        <button className="connect-wallet" onClick={connectWallet}>Connect Wallet</button>
      </header>

      <main>
        <section className="block">
          <h2>List Your Goods</h2>
          <form onSubmit={handleSubmit}>
            <label>Goods
              <input name="goods" value={formData.goods} onChange={handleChange} required />
            </label>
            <label>Price (HungerCoin)
              <input name="price" type="number" value={formData.price} onChange={handleChange} required />
            </label>
            <label>Contact Info
              <input name="contact" value={formData.contact} onChange={handleChange} required />
            </label>
            <label>Country
              <select name="country" value={formData.country} onChange={handleChange} required>
                <option value="">Select</option>
                {countries.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label>About Your Production
              <textarea name="about" value={formData.about} onChange={handleChange} required />
            </label>
            <button type="submit">Submit Listing</button>
          </form>
        </section>

        <section className="block">
          <h2>Browse Listings</h2>
          <label>Filter by country
            <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <div className="grid">
            {filtered.map(item => (
              <div key={item.id} className="listing-card">
                <h3>{item.goods}</h3>
                <p className="muted">Price: {item.price} HC</p>
                <p className="muted">Country: {item.country}</p>
                <p className="muted">Contact: {item.contact}</p>
                <button className="link" onClick={() => toggleAbout(item.id)}>
                  {expanded[item.id] ? "Hide details" : "Show details"}
                </button>
                {expanded[item.id] && <p>{item.about}</p>}
                <button className="buy">Buy with HungerCoin</button>
              </div>
            ))}
            {filtered.length === 0 && <p>No listings yet.</p>}
          </div>
        </section>

        <section className="block">
          <h2>Our Mission</h2>
          <p>Connecting global producers and buyers while reducing food insecurity through transparency.</p>
        </section>
      </main>

      <footer>
        © {new Date().getFullYear()} FeedHunger.org • HungerCoin
      </footer>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
