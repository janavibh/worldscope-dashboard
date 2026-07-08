import { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import './App.css';

const API_URL = 'https://api.worldbank.org/v2/country?format=json&per_page=300';

function App() {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCountries() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Failed to fetch country data');
        }

        const data = await response.json();
        const countryList = data[1];

        const formattedCountries = countryList
          .filter((country) => country.region.value !== 'Aggregates')
          .map((country) => ({
            id: country.id,
            iso2Code: country.iso2Code,
            name: country.name,
            region: country.region.value || 'Unknown',
            incomeLevel: country.incomeLevel.value || 'Unknown',
            lendingType: country.lendingType.value || 'Unknown',
            capital: country.capitalCity || 'No capital listed',
            latitude: country.latitude || 'N/A',
            longitude: country.longitude || 'N/A',
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);
      } catch (err) {
        setError('Something went wrong while loading country data.');
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  useEffect(() => {
    function handleHashRoute() {
      const hash = window.location.hash.replace('#', '');

      if (hash.startsWith('/country/')) {
        const countryId = hash.replace('/country/', '');
        setSelectedCountryId(countryId);
      } else {
        setSelectedCountryId(null);
      }
    }

    handleHashRoute();
    window.addEventListener('hashchange', handleHashRoute);

    return () => window.removeEventListener('hashchange', handleHashRoute);
  }, []);

  const selectedCountry = countries.find(
    (country) => country.id === selectedCountryId
  );

  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(countries.map((country) => country.region))];
    return ['All', ...uniqueRegions.sort()];
  }, [countries]);

  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const matchesSearch = country.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesRegion =
        selectedRegion === 'All' || country.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [countries, searchQuery, selectedRegion]);

  const regionChartData = useMemo(() => {
    const counts = {};

    countries.forEach((country) => {
      counts[country.region] = (counts[country.region] || 0) + 1;
    });

    return Object.entries(counts).map(([region, count]) => ({
      region,
      count,
    }));
  }, [countries]);

  const incomeChartData = useMemo(() => {
    const counts = {};

    countries.forEach((country) => {
      counts[country.incomeLevel] = (counts[country.incomeLevel] || 0) + 1;
    });

    return Object.entries(counts).map(([incomeLevel, count]) => ({
      incomeLevel,
      count,
    }));
  }, [countries]);

  const uniqueRegionsShown = new Set(
    filteredCountries.map((country) => country.region)
  ).size;

  const uniqueIncomeLevelsShown = new Set(
    filteredCountries.map((country) => country.incomeLevel)
  ).size;

  const countriesWithCapitals = filteredCountries.filter(
    (country) => country.capital !== 'No capital listed'
  ).length;

  function goToDashboard() {
    window.location.hash = '/';
    setSelectedCountryId(null);
  }

  function openCountryDetails(countryId) {
    window.location.hash = `/country/${countryId}`;
    setSelectedCountryId(countryId);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="sidebar-logo">🌍</p>
          <h2>WorldScope</h2>
          <p className="sidebar-subtitle">Global insight dashboard</p>
        </div>

        <nav className="sidebar-nav">
          <button onClick={goToDashboard}>Dashboard</button>
          <a href="https://api.worldbank.org/v2/country?format=json&per_page=300">
            API Source
          </a>
        </nav>
      </aside>

      <main className="app">
        <header className="hero">
          <p className="eyebrow">Global Data Dashboard</p>
          <h1>WorldScope</h1>
          <p className="description">
            Explore countries around the world through region, income level,
            capital city, and location data from a public API.
          </p>
        </header>

        {loading && <p className="status-message">Loading country data...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && selectedCountry && (
          <section className="detail-view">
            <button className="back-button" onClick={goToDashboard}>
              ← Back to Dashboard
            </button>

            <div className="detail-card">
              <p className="detail-kicker">Country Detail View</p>
              <h2>{selectedCountry.name}</h2>

              <div className="detail-grid">
                <div>
                  <span>Country Code</span>
                  <strong>{selectedCountry.id}</strong>
                </div>

                <div>
                  <span>ISO2 Code</span>
                  <strong>{selectedCountry.iso2Code}</strong>
                </div>

                <div>
                  <span>Region</span>
                  <strong>{selectedCountry.region}</strong>
                </div>

                <div>
                  <span>Income Level</span>
                  <strong>{selectedCountry.incomeLevel}</strong>
                </div>

                <div>
                  <span>Lending Type</span>
                  <strong>{selectedCountry.lendingType}</strong>
                </div>

                <div>
                  <span>Capital City</span>
                  <strong>{selectedCountry.capital}</strong>
                </div>

                <div>
                  <span>Latitude</span>
                  <strong>{selectedCountry.latitude}</strong>
                </div>

                <div>
                  <span>Longitude</span>
                  <strong>{selectedCountry.longitude}</strong>
                </div>
              </div>

              <p className="direct-link">
                Direct link:{' '}
                <code>{`${window.location.origin}${window.location.pathname}#/country/${selectedCountry.id}`}</code>
              </p>
            </div>
          </section>
        )}

        {!loading && !error && !selectedCountry && (
          <>
            <section className="stats-grid">
              <article className="stat-card">
                <p>Total Countries Shown</p>
                <h2>{filteredCountries.length}</h2>
              </article>

              <article className="stat-card">
                <p>Regions Represented</p>
                <h2>{uniqueRegionsShown}</h2>
              </article>

              <article className="stat-card">
                <p>Income Levels Shown</p>
                <h2>{uniqueIncomeLevelsShown}</h2>
              </article>

              <article className="stat-card">
                <p>Countries With Capitals</p>
                <h2>{countriesWithCapitals}</h2>
              </article>
            </section>

            <section className="charts-grid">
              <article className="chart-card">
                <h2>Countries by Region</h2>
                <p>This chart shows how countries are distributed across global regions.</p>

                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={regionChartData}>
                    <XAxis dataKey="region" tick={{ fill: '#bfdbfe', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#bfdbfe' }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#38bdf8" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </article>

              <article className="chart-card">
                <h2>Countries by Income Level</h2>
                <p>This chart compares how many countries fall into each income group.</p>

                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={incomeChartData}
                      dataKey="count"
                      nameKey="incomeLevel"
                      outerRadius={100}
                      label
                    >
                      {incomeChartData.map((entry, index) => (
                        <Cell
                          key={entry.incomeLevel}
                          fill={
                            ['#38bdf8', '#a78bfa', '#22c55e', '#facc15', '#fb7185'][
                              index % 5
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </article>
            </section>

            <section className="controls">
              <div className="control-group">
                <label htmlFor="search">Search by country name</label>
                <input
                  id="search"
                  type="text"
                  placeholder="Try India, Canada, Brazil..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>

              <div className="control-group">
                <label htmlFor="region">Filter by region</label>
                <select
                  id="region"
                  value={selectedRegion}
                  onChange={(event) => setSelectedRegion(event.target.value)}
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section className="dashboard-card">
              <div className="table-header">
                <h2>Country List</h2>
                <p>
                  Showing {filteredCountries.length} of {countries.length} countries
                </p>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Country</th>
                      <th>Region</th>
                      <th>Income Level</th>
                      <th>Capital</th>
                      <th>Latitude</th>
                      <th>Longitude</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCountries.map((country) => (
                      <tr
                        key={country.id}
                        onClick={() => openCountryDetails(country.id)}
                        className="clickable-row"
                      >
                        <td>
                          <strong>{country.name}</strong>
                        </td>
                        <td>{country.region}</td>
                        <td>{country.incomeLevel}</td>
                        <td>{country.capital}</td>
                        <td>{country.latitude}</td>
                        <td>{country.longitude}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredCountries.length === 0 && (
                  <p className="no-results">No countries match your search.</p>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;