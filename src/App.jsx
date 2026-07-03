import { useEffect, useMemo, useState } from 'react';
import './App.css';

const API_URL = 'https://api.worldbank.org/v2/country?format=json&per_page=300';

function App() {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
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
            name: country.name,
            region: country.region.value || 'Unknown',
            incomeLevel: country.incomeLevel.value || 'Unknown',
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

  const uniqueRegionsShown = new Set(
    filteredCountries.map((country) => country.region)
  ).size;

  const uniqueIncomeLevelsShown = new Set(
    filteredCountries.map((country) => country.incomeLevel)
  ).size;

  const countriesWithCapitals = filteredCountries.filter(
    (country) => country.capital !== 'No capital listed'
  ).length;

  return (
    <div className="app">
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

      {!loading && !error && (
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

          <main className="dashboard-card">
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
                    <tr key={country.id}>
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
          </main>
        </>
      )}
    </div>
  );
}

export default App;