import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  ExternalLink, 
  Compass, 
  Store, 
  RefreshCw, 
  Navigation
} from 'lucide-react';
import { MapsVenue } from '../types';

export const PopUpRadar: React.FC = () => {
  const [locationInput, setLocationInput] = useState('Austin, TX');
  const [venueType, setVenueType] = useState('artisan craft markets, flea markets, and pop-up vendor spaces');
  const [isLoading, setIsLoading] = useState(false);
  const [radarResult, setRadarResult] = useState<string | null>(null);
  const [mapsSources, setMapsSources] = useState<MapsVenue[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [geoCoordinates, setGeoCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const fetchVenues = async (loc?: string, customType?: string, coords?: { lat: number; lng: number }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setRadarResult(null);
    setMapsSources([]);

    try {
      const res = await fetch('/api/gemini/maps-venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityOrLocation: loc || locationInput,
          venueType: customType || venueType,
          lat: coords?.lat || geoCoordinates?.lat,
          lng: coords?.lng || geoCoordinates?.lng,
        }),
      });

      const data = await res.json();
      if (data.text) {
        setRadarResult(data.text);
        setMapsSources(data.mapsSources || []);
      } else {
        setErrorMessage(data.error || 'Failed to retrieve venues.');
      }
    } catch (err: any) {
      setErrorMessage('Network or server error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setGeoCoordinates(coords);
        setLocationInput('Near My Location');
        fetchVenues('Near My Location', undefined, coords);
      },
      (err) => {
        setErrorMessage('Could not retrieve location: ' + err.message);
      }
    );
  };

  const setPreset = (loc: string, type: string) => {
    setLocationInput(loc);
    setVenueType(type);
    fetchVenues(loc, type);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-stone-900 text-stone-50 flex items-center justify-center shrink-0 shadow-sm">
              <MapPin className="w-5 h-5 text-[#d97346]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-stone-900">Local Pop-Up & Vendor Venue Radar</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#faeae1] text-[#9c4923] font-medium border border-[#f3cbba]">
                  Verified Locations
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Locate local craft bazaars, holiday markets, shared commercial kitchens, and vendor booths with real Google Maps navigation links.
              </p>
            </div>
          </div>

          <button
            onClick={handleUseGeolocation}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-medium rounded-xl border border-stone-200 flex items-center gap-1.5 transition self-start sm:self-auto shrink-0 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-[#d97346]" />
            <span>Use My GPS</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5">
            <label className="text-[11px] font-medium text-stone-600 block mb-1">
              City, Neighborhood or ZIP
            </label>
            <div className="relative">
              <Compass className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="e.g. Portland, OR or Austin, TX"
                className="w-full bg-stone-50/70 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-700 transition"
              />
            </div>
          </div>

          <div className="md:col-span-5">
            <label className="text-[11px] font-medium text-stone-600 block mb-1">
              Venue / Facility Type
            </label>
            <div className="relative">
              <Store className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={venueType}
                onChange={(e) => setVenueType(e.target.value)}
                placeholder="e.g. craft fairs, commercial kitchens, flea markets"
                className="w-full bg-stone-50/70 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-700 transition"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              onClick={() => fetchVenues()}
              disabled={isLoading || !locationInput.trim()}
              className="w-full py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-stone-50 font-semibold text-xs sm:text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Scan Venues
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="pt-2 border-t border-stone-200/80 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-stone-500 shrink-0">Popular Hubs:</span>
          <button
            onClick={() => setPreset('Austin, TX', 'artisan weekend markets and maker pop-ups')}
            className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-stone-700 shrink-0 transition cursor-pointer"
          >
            Austin Craft Markets
          </button>
          <button
            onClick={() => setPreset('Portland, OR', 'Saturday outdoor markets and flea vendor spaces')}
            className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-stone-700 shrink-0 transition cursor-pointer"
          >
            Portland Flea & Bazaars
          </button>
          <button
            onClick={() => setPreset('Brooklyn, NY', 'shared commercial commissary kitchens for food makers')}
            className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-stone-700 shrink-0 transition cursor-pointer"
          >
            NYC Commercial Kitchens
          </button>
          <button
            onClick={() => setPreset('Denver, CO', 'local holiday gift craft fairs and artisan pop-ups')}
            className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-stone-700 shrink-0 transition cursor-pointer"
          >
            Denver Holiday Bazaars
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          {errorMessage}
        </div>
      )}

      {/* Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Recommendation Text */}
        <div className="lg:col-span-8 bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 mb-4">
            <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
              <Store className="w-4 h-4 text-[#d97346]" />
              Venue Intelligence & Vendor Analysis
            </h3>
            <span className="text-xs text-stone-400">Real-Time Search</span>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-stone-700">Scanning local market places in {locationInput}...</p>
            </div>
          ) : radarResult ? (
            <div className="text-stone-800 whitespace-pre-wrap leading-relaxed font-sans overflow-y-auto max-h-[550px] pr-2 text-xs sm:text-sm">
              {radarResult}
            </div>
          ) : (
            <div className="py-20 text-center text-stone-400 space-y-2">
              <MapPin className="w-9 h-9 mx-auto text-stone-300" />
              <p className="text-sm font-medium text-stone-600">No Venues Scanned Yet</p>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Enter your city or click one of the popular hubs above to locate real physical vendor spaces for your side hustle.
              </p>
            </div>
          )}
        </div>

        {/* Verified Google Maps Links */}
        <div className="lg:col-span-4 bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-stone-200/80">
            <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#d97346]" />
              Grounded Maps Places ({mapsSources.length})
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Clickable map locations with directions
            </p>
          </div>

          {mapsSources.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-xs">
              Maps links will appear here upon scanning a location.
            </div>
          ) : (
            <div className="space-y-2.5 overflow-y-auto max-h-[500px] pr-1">
              {mapsSources.map((place, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 hover:border-stone-400 transition group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-xs text-stone-900 group-hover:text-[#d97346] transition">
                      {place.title}
                    </span>
                    {place.uri && (
                      <a
                        href={place.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#d97346] hover:text-[#b85b2e] p-1 shrink-0"
                        title="Open in Google Maps"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {place.snippets && place.snippets.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {place.snippets.slice(0, 2).map((snip, sIdx) => (
                        <p key={sIdx} className="text-[11px] text-stone-600 italic bg-white p-1.5 rounded border border-stone-200/60">
                          "{snip}"
                        </p>
                      ))}
                    </div>
                  )}

                  {place.uri && (
                    <a
                      href={place.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-[10px] text-[#9c4923] flex items-center gap-1 hover:underline font-medium"
                    >
                      <MapPin className="w-3 h-3" />
                      View on Google Maps Directions
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
