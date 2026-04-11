import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Navigation, MapPin, Star, ExternalLink, Clock, Building2, AlertCircle, Loader2, ChevronRight, RefreshCw } from 'lucide-react';

// Haversine formula to calculate distance between two coordinates
const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const NearestHospitalPanel = ({ userLocation, onClose }) => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [radius, setRadius] = useState(10);
    const [isVisible, setIsVisible] = useState(false);
    const panelRef = useRef(null);

    // Animate in on mount
    useEffect(() => {
        requestAnimationFrame(() => {
            setIsVisible(true);
        });
    }, []);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
    }, [onClose]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleClose]);

    // Close on clicking outside the panel
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    // Multiple Overpass API mirrors to avoid 429 rate limits
    const OVERPASS_ENDPOINTS = [
        'https://overpass.kumi.systems/api/interpreter',
        'https://overpass-api.de/api/interpreter',
    ];

    // Fetch from a single endpoint, returns null on failure
    const fetchFromEndpoint = async (endpoint, query, signal) => {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `data=${encodeURIComponent(query)}`,
                signal
            });
            if (!response.ok) {
                console.warn(`Overpass endpoint ${endpoint} returned ${response.status}`);
                return null;
            }
            return await response.json();
        } catch (err) {
            if (err.name === 'AbortError') throw err; // re-throw abort
            console.warn(`Overpass endpoint ${endpoint} failed:`, err.message);
            return null;
        }
    };

    // Fetch hospitals with mirror fallback
    const fetchHospitals = useCallback(async (signal) => {
        if (!userLocation) return;

        setLoading(true);
        setError(null);

        const { lat, lng } = userLocation;
        const radiusMeters = radius * 1000;

        // Overpass QL query: find all hospitals within radius
        const query = `
            [out:json][timeout:25];
            (
                node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
                way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
                relation["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
                node["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
                way["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
            );
            out center body;
        `;

        let data = null;

        // Try each endpoint until one succeeds
        for (const endpoint of OVERPASS_ENDPOINTS) {
            if (signal?.aborted) return;
            data = await fetchFromEndpoint(endpoint, query, signal);
            if (data) break;
            // Small delay before trying next mirror
            await new Promise(r => setTimeout(r, 500));
        }

        if (signal?.aborted) return;

        if (!data) {
            setError('All hospital data servers are busy. Please wait a moment and try again.');
            setLoading(false);
            return;
        }

        try {
            // Process results
            const processed = data.elements
                .map((el) => {
                    const elLat = el.lat || el.center?.lat;
                    const elLng = el.lon || el.center?.lon;

                    if (!elLat || !elLng) return null;

                    const distance = getDistance(lat, lng, elLat, elLng);
                    const tags = el.tags || {};

                    return {
                        id: el.id,
                        name: tags.name || tags['name:en'] || 'Hospital',
                        address: [tags['addr:street'], tags['addr:city'], tags['addr:postcode']]
                            .filter(Boolean).join(', ') || tags['addr:full'] || '',
                        phone: tags.phone || tags['contact:phone'] || '',
                        website: tags.website || tags['contact:website'] || '',
                        emergency: tags.emergency === 'yes',
                        openingHours: tags.opening_hours || '',
                        type: tags.amenity === 'clinic' ? 'Clinic' : (tags.healthcare === 'centre' ? 'Health Centre' : 'Hospital'),
                        operator: tags.operator || '',
                        lat: elLat,
                        lng: elLng,
                        distance: distance
                    };
                })
                .filter(Boolean)
                .sort((a, b) => a.distance - b.distance);

            setHospitals(processed);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Processing error:', err);
                setError('Unable to process hospital data. Please try again.');
            }
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, [userLocation, radius]);

    // Use AbortController to cancel previous request when radius changes
    useEffect(() => {
        const abortController = new AbortController();
        fetchHospitals(abortController.signal);
        return () => abortController.abort();
    }, [fetchHospitals]);

    const formatDistance = (km) => {
        if (km < 1) return `${Math.round(km * 1000)}m`;
        return `${km.toFixed(1)}km`;
    };

    const getDirectionsUrl = (hospital) => {
        return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${hospital.lat},${hospital.lng}&travelmode=driving`;
    };

    const getMapUrl = (hospital) => {
        return `https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`;
    };

    // Skeleton loader
    const SkeletonCard = () => (
        <div className="hospital-card skeleton-card">
            <div className="skeleton-icon"></div>
            <div className="skeleton-content">
                <div className="skeleton-line skeleton-title"></div>
                <div className="skeleton-line skeleton-subtitle"></div>
                <div className="skeleton-line skeleton-short"></div>
            </div>
        </div>
    );

    return (
        <div
            className={`hospital-panel-overlay ${isVisible ? 'overlay-visible' : ''}`}
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-label="Nearest Hospitals"
        >
            <div
                ref={panelRef}
                className={`hospital-panel ${isVisible ? 'panel-visible' : ''}`}
            >
                {/* Header */}
                <div className="hospital-panel-header">
                    <div className="panel-header-left">
                        <div className="panel-header-icon">
                            <Building2 size={22} color="#fff" />
                        </div>
                        <div>
                            <h2 className="panel-title">Nearest Hospitals</h2>
                            <p className="panel-subtitle">
                                {loading ? 'Searching...' : `${hospitals.length} found within ${radius}km`}
                            </p>
                        </div>
                    </div>
                    <button className="panel-close-btn" onClick={handleClose} aria-label="Close panel">
                        <X size={20} />
                    </button>
                </div>

                {/* Radius Selector */}
                <div className="radius-selector">
                    <span className="radius-label">Radius:</span>
                    {[5, 10, 25].map((r) => (
                        <button
                            key={r}
                            className={`radius-btn ${radius === r ? 'radius-active' : ''}`}
                            onClick={() => setRadius(r)}
                        >
                            {r}km
                        </button>
                    ))}
                    <button
                        className="refresh-btn"
                        onClick={() => fetchHospitals()}
                        disabled={loading}
                        title="Refresh results"
                    >
                        <RefreshCw size={14} className={loading ? 'spin' : ''} />
                    </button>
                </div>

                {/* Content */}
                <div className="hospital-panel-content">
                    {/* Loading State */}
                    {loading && (
                        <div className="hospital-list">
                            {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="hospital-error-state">
                            <AlertCircle size={48} color="#ef4444" />
                            <h3>Something went wrong</h3>
                            <p>{error}</p>
                            <button className="retry-btn" onClick={() => fetchHospitals()}>
                                <RefreshCw size={16} /> Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && hospitals.length === 0 && (
                        <div className="hospital-empty-state">
                            <Building2 size={48} color="#94a3b8" />
                            <h3>No hospitals found</h3>
                            <p>Try increasing the search radius</p>
                        </div>
                    )}

                    {/* Hospital List */}
                    {!loading && !error && hospitals.length > 0 && (
                        <div className="hospital-list">
                            {hospitals.map((hospital, index) => (
                                <div
                                    key={hospital.id}
                                    className="hospital-card"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="hospital-card-top">
                                        <div className="hospital-card-icon">
                                            <Building2 size={18} />
                                        </div>
                                        <div className="hospital-card-info">
                                            <h4 className="hospital-name">{hospital.name}</h4>
                                            {hospital.operator && (
                                                <span className="hospital-operator">{hospital.operator}</span>
                                            )}
                                            <div className="hospital-tags">
                                                <span className={`hospital-type-badge ${hospital.type.toLowerCase()}`}>
                                                    {hospital.type}
                                                </span>
                                                {hospital.emergency && (
                                                    <span className="hospital-emergency-badge">
                                                        🚑 Emergency
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="hospital-distance">
                                            <Navigation size={14} />
                                            <span>{formatDistance(hospital.distance)}</span>
                                        </div>
                                    </div>

                                    {hospital.address && (
                                        <div className="hospital-address">
                                            <MapPin size={13} />
                                            <span>{hospital.address}</span>
                                        </div>
                                    )}

                                    {hospital.phone && (
                                        <div className="hospital-phone">
                                            <span>📞</span>
                                            <a href={`tel:${hospital.phone}`}>{hospital.phone}</a>
                                        </div>
                                    )}

                                    {hospital.openingHours && (
                                        <div className="hospital-hours">
                                            <Clock size={13} />
                                            <span>{hospital.openingHours}</span>
                                        </div>
                                    )}

                                    <div className="hospital-card-actions">
                                        <a
                                            href={getDirectionsUrl(hospital)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="directions-btn"
                                        >
                                            <Navigation size={14} />
                                            Get Directions
                                        </a>
                                        <a
                                            href={getMapUrl(hospital)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="view-map-btn"
                                        >
                                            <ExternalLink size={14} />
                                            View on Map
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="hospital-panel-footer">
                    <span>Powered by OpenStreetMap</span>
                </div>
            </div>
        </div>
    );
};

export default NearestHospitalPanel;
