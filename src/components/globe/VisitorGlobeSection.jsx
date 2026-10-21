
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { feature } from 'topojson-client';

import { useLanguage } from '../../i18n/LanguageContext';

// ==========================================
// LAZY LOAD 3D GLOBE
// ==========================================

const Globe = lazy(() => import('react-globe.gl'));

// ==========================================
// CONSTANTS
// ==========================================

const API_URL = '/api/visitors';

const CHECKIN_KEY =
  'portfolio-visitor-country-checkin-v2';

const CYAN = '#72f6ff';

// ==========================================
// TRANSLATIONS
// ==========================================

const labels = {
  en: {
    eyebrow: 'INTERACTIVE EXPERIMENT / 002',
    title1: 'LEAVE YOUR MARK',
    title2: 'ON EARTH',

    description:
      'A digital record of visitors from around the world.',

    instruction:
      'Rotate the globe and select your country to check in.',

    visitors: 'TOTAL CHECK-INS',
    recent: 'RECENT SIGNALS',
    empty: 'No check-ins recorded yet.',

    modalEyebrow: 'VISITOR CHECK-IN / 002',
    modalQuestion: 'CHECK IN FROM',
    modalDescription:
      'Your selected country will appear on the global visitor globe.',

    selectedCountry: 'DETECTED COUNTRY',
    confirm: 'CONFIRM CHECK-IN',
    cancel: 'CANCEL',
    saving: 'SENDING SIGNAL...',

    already: 'YOUR SIGNAL HAS BEEN RECORDED',
    globeHint:
      'DRAG TO ROTATE • CLICK A COUNTRY',

    viewPin: 'View visitor location',
    failed: 'Unable to load visitor data.',
    mapFailed: 'Unable to load world map.',
    saveFailed: 'Unable to save check-in.',

    signal: 'SIGNAL IDENTIFIED',
    status: 'SYSTEM STATUS: ONLINE',
    selectLand:
      'Select a country on the globe.',
  },

  id: {
    eyebrow: 'EKSPERIMEN INTERAKTIF / 002',
    title1: 'TINGGALKAN JEJAK',
    title2: 'DI BUMI',

    description:
      'Catatan digital pengunjung dari berbagai negara di dunia.',

    instruction:
      'Putar globe dan pilih negaramu untuk melakukan absensi.',

    visitors: 'TOTAL ABSENSI',
    recent: 'PENGUNJUNG TERBARU',
    empty: 'Belum ada pengunjung yang absen.',

    modalEyebrow: 'ABSENSI PENGUNJUNG / 002',
    modalQuestion: 'ABSEN DARI',
    modalDescription:
      'Negara yang kamu pilih akan ditampilkan pada globe pengunjung global.',

    selectedCountry: 'NEGARA TERDETEKSI',
    confirm: 'KONFIRMASI ABSENSI',
    cancel: 'BATAL',
    saving: 'MENGIRIM SINYAL...',

    already: 'SINYAL KAMU SUDAH TERCATAT',
    globeHint:
      'GESER UNTUK MEMUTAR • KLIK NEGARA',

    viewPin: 'Lihat lokasi pengunjung',
    failed: 'Gagal memuat data pengunjung.',
    mapFailed: 'Gagal memuat peta dunia.',
    saveFailed: 'Gagal menyimpan absensi.',

    signal: 'SINYAL TERIDENTIFIKASI',
    status: 'STATUS SISTEM: ONLINE',
    selectLand:
      'Pilih wilayah negara pada globe.',
  },
};

// ==========================================
// READ LOCAL CHECK-IN STATUS
// ==========================================

const readCheckinStatus = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return (
      window.localStorage.getItem(
        CHECKIN_KEY
      ) === 'yes'
    );
  } catch {
    return false;
  }
};

// ==========================================
// COMPONENT
// ==========================================

const VisitorGlobeSection = () => {
  const { language } = useLanguage();

  const ui = labels[language] || labels.en;

  const globeRef = useRef(null);
  const containerRef = useRef(null);

  const reducedMotion = useMediaQuery(
    '(prefers-reduced-motion: reduce)'
  );

  // ========================================
  // STATE
  // ========================================

  const [globeVisible, setGlobeVisible] =
    useState(false);

  const [countries, setCountries] =
    useState([]);

  const [mapError, setMapError] =
    useState(false);

  const [hoveredCountryId, setHoveredCountryId] =
    useState(null);

  const [size, setSize] = useState({
    width: 600,
    height: 480,
  });

  const [visitors, setVisitors] =
    useState([]);

  const [total, setTotal] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [checkedIn, setCheckedIn] =
    useState(readCheckinStatus);

  // Country selected from globe

  const [selectedPoint, setSelectedPoint] =
    useState(null);

  const [activeVisitor, setActiveVisitor] =
    useState(null);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [formError, setFormError] =
    useState('');

  // ========================================
  // FETCH GLOBAL VISITOR DATA
  // ========================================

  const fetchVisitors = useCallback(async () => {
    try {
      const response = await fetch(API_URL, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(
          'Failed to fetch visitors'
        );
      }

      const data = await response.json();

      if (!Array.isArray(data.visitors)) {
        throw new Error(
          'Invalid visitor data'
        );
      }

      setVisitors(data.visitors);

      setTotal(
        Number(data.total) || 0
      );

      setError('');
    } catch (err) {
      console.error(
        'Visitor fetch error:',
        err
      );

      setError('Failed to load visitors');
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================
  // SYNC GLOBAL VISITORS
  // ========================================

  useEffect(() => {
    fetchVisitors();

    // Refresh every 60 seconds

    const interval = setInterval(
      fetchVisitors,
      60000
    );

    // Refresh when returning to tab

    const handleVisibility = () => {
      if (
        document.visibilityState ===
        'visible'
      ) {
        fetchVisitors();
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibility
    );

    return () => {
      clearInterval(interval);

      document.removeEventListener(
        'visibilitychange',
        handleVisibility
      );
    };
  }, [fetchVisitors]);

  // ========================================
  // LAZY LOAD WHEN SECTION IS VISIBLE
  // ========================================

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    if (
      !('IntersectionObserver' in window)
    ) {
      setGlobeVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGlobeVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '250px',
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // ========================================
  // LOAD COUNTRY BOUNDARIES
  // ========================================

  useEffect(() => {
    if (!globeVisible) return;

    let active = true;

    const loadCountries = async () => {
      try {
        // Load world geography only when
        // the visitor approaches this section.

        const module = await import(
          'world-atlas/countries-110m.json'
        );

        const world = module.default || module;

        const geojson = feature(
          world,
          world.objects.countries
        );

        const countryFeatures =
          geojson.features.filter(
            (country) =>
              country.geometry &&
              country.properties?.name
          );

        if (active) {
          setCountries(countryFeatures);
          setMapError(false);
        }
      } catch (err) {
        console.error(
          'Country map error:',
          err
        );

        if (active) {
          setMapError(true);
        }
      }
    };

    loadCountries();

    return () => {
      active = false;
    };
  }, [globeVisible]);

  // ========================================
  // RESPONSIVE GLOBE CANVAS
  // ========================================

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const updateSize = () => {
      const rect =
        container.getBoundingClientRect();

      setSize({
        width: Math.max(
          1,
          Math.floor(rect.width)
        ),

        height: Math.max(
          1,
          Math.floor(rect.height)
        ),
      });
    };

    updateSize();

    if (!window.ResizeObserver) {
      window.addEventListener(
        'resize',
        updateSize
      );

      return () => {
        window.removeEventListener(
          'resize',
          updateSize
        );
      };
    }

    const observer = new ResizeObserver(
      updateSize
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // ========================================
  // GLOBE READY
  // ========================================

  const handleGlobeReady = () => {
    const globe = globeRef.current;

    if (!globe) return;

    const controls = globe.controls();

    controls.enableZoom = false;

    controls.autoRotate = !reducedMotion;

    controls.autoRotateSpeed = 0.4;

    // Initially show Indonesia / Asia

    globe.pointOfView(
      {
        lat: 0,
        lng: 112,
        altitude: 2.5,
      },
      0
    );
  };

  // ========================================
  // STOP ROTATION WHILE MODAL IS OPEN
  // ========================================

  useEffect(() => {
    const globe = globeRef.current;

    if (!globe) return;

    const controls = globe.controls();

    controls.autoRotate =
      !reducedMotion && !dialogOpen;
  }, [dialogOpen, reducedMotion]);

  // ========================================
  // COUNTRY SELECTION
  // ========================================

  const handleCountryClick = (
    polygon,
    event,
    coords
  ) => {
    if (checkedIn || saving) {
      return;
    }

    const countryName =
      polygon?.properties?.name;

    if (
      !countryName ||
      !coords ||
      !Number.isFinite(coords.lat) ||
      !Number.isFinite(coords.lng)
    ) {
      return;
    }

    // Automatically detect country
    // from the clicked polygon.

    const point = {
      country: countryName,

      lat: Number(
        coords.lat.toFixed(1)
      ),

      lng: Number(
        coords.lng.toFixed(1)
      ),
    };

    setSelectedPoint(point);

    setActiveVisitor(null);

    setFormError('');

    setDialogOpen(true);
  };

  // ========================================
  // CLOSE CONFIRMATION MODAL
  // ========================================

  const closeDialog = () => {
    if (saving) return;

    setDialogOpen(false);
    setSelectedPoint(null);
    setFormError('');
  };

  // ========================================
  // SAVE CHECK-IN
  // ========================================


  const handleCheckin = async () => {
    if (
      !selectedPoint ||
      checkedIn ||
      saving
    ) {
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      // ====================================
      // SEND CHECK-IN TO VERCEL API
      // ====================================

      const response = await fetch(API_URL, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        cache: 'no-store',

        body: JSON.stringify({
          country: selectedPoint.country,
          lat: selectedPoint.lat,
          lng: selectedPoint.lng,
        }),
      });

      // ====================================
      // HANDLE EMPTY OR INVALID RESPONSE
      // ====================================

      const responseText = await response.text();

      let data = null;

      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            `API returned invalid JSON (HTTP ${response.status}).`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
          `Check-in failed (HTTP ${response.status}).`
        );
      }

      if (
        !data?.success ||
        !Array.isArray(data.visitors)
      ) {
        throw new Error(
          `Invalid API response (HTTP ${response.status}).`
        );
      }

      // ====================================
      // UPDATE GLOBAL VISITOR DATA
      // ====================================

      setVisitors(data.visitors);

      setTotal(
        Number(data.total) || 0
      );

      setCheckedIn(true);

      // ====================================
      // SAVE LOCAL CHECK-IN STATUS
      // ====================================

      try {
        localStorage.setItem(
          CHECKIN_KEY,
          'yes'
        );
      } catch {
        // Local storage unavailable
      }

      // ====================================
      // CLOSE MODAL
      // ====================================

      setDialogOpen(false);
      setSelectedPoint(null);
      setActiveVisitor(null);
      setFormError('');

    } catch (error) {
      console.error(
        'Visitor check-in error:',
        error
      );

      setFormError(
        error.message ||
        ui.saveFailed
      );
    } finally {
      setSaving(false);
    }
  };


  // ========================================
  // GLOBE COLORS
  // ========================================

  const getPolygonCapColor = (polygon) => {
    return polygon.id === hoveredCountryId
      ? 'rgba(114,246,255,0.28)'
      : 'rgba(114,246,255,0.025)';
  };

  const getPolygonStrokeColor = (polygon) => {
    return polygon.id === hoveredCountryId
      ? 'rgba(114,246,255,0.95)'
      : 'rgba(255,255,255,0.15)';
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <Box
      component="section"
      id="visitor-globe"
      sx={{
        position: 'relative',

        backgroundColor: '#000',
        color: '#fff',

        overflow: 'hidden',

        py: {
          xs: 9,
          md: 14,
        },

        px: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 1150,
          mx: 'auto',
          position: 'relative',
        }}
      >
        {/* ==============================
            HEADER
        =============================== */}

        <Box
          sx={{
            mb: 5,
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: 11,
              letterSpacing: 3,
              color: 'rgba(255, 255, 255, 0.6);',
              fontWeight: 800,
              mb: 2,
            }}
          >
            {ui.eyebrow}
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontSize: {
                xs: 37,
                sm: 52,
                md: 70,
              },

              fontWeight: 900,
              letterSpacing: '-0.045em',
              lineHeight: 1.04,
            }}
          >
            {ui.title1}

            <Box
              component="span"
              sx={{
                display: 'block',
                color: CYAN,
              }}
            >
              {ui.title2}
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: 2,

              fontSize: {
                xs: 12,
                md: 14,
              },

              color:
                'rgba(255,255,255,.58)',

              lineHeight: 1.8,
            }}
          >
            {ui.description}
          </Typography>
        </Box>

        {/* ==============================
            MAIN GLOBE CARD
        =============================== */}

        <Box
          sx={{
            border:
              '1px solid rgba(255,255,255,.25)',

            backgroundColor: '#06080c',

            boxShadow:
              '0 0 65px rgba(114,246,255,.045)',

            display: 'grid',

            gridTemplateColumns: {
              xs: '1fr',
              md:
                'minmax(0,1.6fr) minmax(260px,0.8fr)',
            },
          }}
        >
          {/* ============================
              INTERACTIVE GLOBE
          ============================ */}

          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              minWidth: 0,

              borderRight: {
                xs: 'none',
                md:
                  '1px solid rgba(255,255,255,.12)',
              },
            }}
          >
            <Box
              ref={containerRef}
              sx={{
                width: '100%',

                height: {
                  xs: 340,
                  sm: 440,
                  md: 520,
                },

                position: 'relative',

                cursor: checkedIn
                  ? 'grab'
                  : 'crosshair',

                touchAction: 'pan-y',
              }}
            >
              {globeVisible &&
                countries.length > 0 &&
                size.width > 10 ? (
                <Suspense
                  fallback={
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <CircularProgress
                        size={28}
                        sx={{ color: CYAN }}
                      />
                    </Box>
                  }
                >
                  <Globe
                    ref={globeRef}

                    width={size.width}
                    height={size.height}

                    // Globe appearance

                    backgroundColor="rgba(0,0,0,0)"

                    globeImageUrl="https://unpkg.com/three-globe/example/img/earth-dark.jpg"

                    showAtmosphere

                    atmosphereColor={CYAN}

                    atmosphereAltitude={0.1}

                    // =====================
                    // COUNTRY POLYGONS
                    // =====================

                    polygonsData={countries}

                    polygonGeoJsonGeometry="geometry"

                    polygonCapColor={
                      getPolygonCapColor
                    }

                    polygonSideColor={() =>
                      'rgba(114,246,255,0.04)'
                    }

                    polygonStrokeColor={
                      getPolygonStrokeColor
                    }

                    polygonAltitude={0.004}

                    polygonsTransitionDuration={250}

                    polygonLabel={(polygon) =>
                      polygon.properties?.name || ''
                    }

                    onPolygonHover={(polygon) => {
                      setHoveredCountryId(
                        polygon?.id ?? null
                      );
                    }}

                    onPolygonClick={
                      handleCountryClick
                    }

                    // =====================
                    // VISITOR MARKERS
                    // =====================

                    pointsData={visitors}

                    pointLat="lat"
                    pointLng="lng"

                    pointColor={() => CYAN}

                    pointAltitude={0.018}

                    pointRadius={0.35}

                    pointResolution={12}

                    pointLabel={() =>
                      ui.viewPin
                    }

                    onPointClick={(visitor) => {
                      setActiveVisitor(visitor);
                    }}

                    // =====================
                    // SIGNAL RINGS
                    // =====================

                    ringsData={
                      reducedMotion
                        ? []
                        : visitors.slice(0, 3)
                    }

                    ringLat="lat"
                    ringLng="lng"

                    ringColor={() => (t) =>
                      `rgba(114,246,255,${(1 - t) * 0.65
                      })`
                    }

                    ringMaxRadius={2}

                    ringPropagationSpeed={0.8}

                    ringRepeatPeriod={2600}

                    onGlobeReady={
                      handleGlobeReady
                    }
                  />
                </Suspense>
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    display: 'grid',
                    placeItems: 'center',
                    gap: 2,
                  }}
                >
                  {mapError ? (
                    <Typography
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: 11,
                        color: '#ff557b',
                      }}
                    >
                      {ui.mapFailed}
                    </Typography>
                  ) : (
                    <Stack
                      alignItems="center"
                      spacing={2}
                    >
                      <CircularProgress
                        size={26}
                        sx={{
                          color: CYAN,
                        }}
                      />

                      <Typography
                        sx={{
                          fontFamily:
                            'monospace',

                          fontSize: 10,

                          letterSpacing: 2,

                          color:
                            'rgba(255,255,255,.55)',
                        }}
                      >
                        INITIALIZING EARTH...
                      </Typography>
                    </Stack>
                  )}
                </Box>
              )}
            </Box>

            {/* GLOBE INSTRUCTION */}

            <Typography
              sx={{
                position: 'absolute',
                left: 16,
                bottom: 16,

                pointerEvents: 'none',

                fontFamily: 'monospace',
                fontSize: 10,

                letterSpacing: 0.5,

                color:
                  'rgba(255,255,255,.65)',
              }}
            >
              {ui.globeHint}
            </Typography>
          </Box>

          {/* ============================
              VISITOR INFORMATION
          ============================ */}

          <Box
            sx={{
              p: {
                xs: 2.5,
                md: 3,
              },
            }}
          >
            <Typography
              sx={{
                color: CYAN,

                fontFamily: 'monospace',

                fontSize: 10,
                letterSpacing: 2,
                fontWeight: 800,
                mb: 1.5,
              }}
            >
              WORLDWIDE PRESENCE
            </Typography>

            {/* TOTAL CHECK-INS */}

            <Typography
              sx={{
                fontFamily: 'monospace',

                fontSize: {
                  xs: 46,
                  md: 60,
                },

                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {String(total).padStart(3, '0')}
            </Typography>

            <Typography
              sx={{
                mt: 1,

                color:
                  'rgba(255,255,255,.55)',

                fontSize: 11,
                letterSpacing: 1,
              }}
            >
              {ui.visitors}
            </Typography>

            <Box
              sx={{
                mt: 3,
                mb: 2,

                borderTop:
                  '1px solid rgba(255,255,255,.15)',
              }}
            />

            {/* RECENT COUNTRIES */}

            <Typography
              sx={{
                color: CYAN,

                fontFamily: 'monospace',

                fontSize: 10,
                fontWeight: 800,

                letterSpacing: 1.5,
                mb: 2,
              }}
            >
              {ui.recent}
            </Typography>

            {loading && (
              <CircularProgress
                size={19}
                sx={{ color: CYAN }}
              />
            )}

            {error && (
              <Typography
                sx={{
                  color: '#ff557b',
                  fontSize: 11,
                  mb: 2,
                }}
              >
                {ui.failed}
              </Typography>
            )}

            {!loading &&
              visitors.length === 0 && (
                <Typography
                  sx={{
                    color:
                      'rgba(255,255,255,.45)',

                    fontSize: 12,
                  }}
                >
                  {ui.empty}
                </Typography>
              )}

            <Stack spacing={1.5}>
              {visitors
                .slice(0, 4)
                .map((visitor) => (
                  <Box
                    key={visitor.id}

                    onClick={() => {
                      setActiveVisitor(visitor);
                    }}

                    sx={{
                      display: 'flex',

                      alignItems: 'center',

                      gap: 1.5,

                      p: 1.3,

                      cursor: 'pointer',

                      border:
                        '1px solid rgba(255,255,255,.12)',

                      backgroundColor:
                        'rgba(255,255,255,.025)',

                      transition:
                        'border-color .2s ease',

                      '&:hover': {
                        borderColor: CYAN,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 7,
                        height: 7,

                        borderRadius: '50%',

                        backgroundColor: CYAN,

                        flexShrink: 0,

                        boxShadow:
                          '0 0 10px rgba(114,246,255,.5)',
                      }}
                    />

                    <Typography
                      noWrap
                      sx={{
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {visitor.country}
                    </Typography>
                  </Box>
                ))}
            </Stack>

            {/* ACTIVE VISITOR */}

            {activeVisitor && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,

                  border:
                    '1px solid rgba(114,246,255,.4)',

                  backgroundColor:
                    'rgba(114,246,255,.055)',
                }}
              >
                <Typography
                  sx={{
                    color: CYAN,

                    fontFamily: 'monospace',

                    fontSize: 10,
                    letterSpacing: 1,
                    fontWeight: 800,
                  }}
                >
                  {ui.signal}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 800,
                    mt: 1,
                  }}
                >
                  {activeVisitor.country}
                </Typography>
              </Box>
            )}

            {/* INFORMATION */}

            <Typography
              sx={{
                mt: 3,

                fontSize: 11,
                lineHeight: 1.8,

                color: checkedIn
                  ? CYAN
                  : 'rgba(255,255,255,.6)',
              }}
            >
              {checkedIn
                ? ui.already
                : ui.instruction}
            </Typography>
          </Box>
        </Box>

        {/* ==============================
            BOTTOM LABEL
        =============================== */}

        <Typography
          sx={{
            mt: 3,

            textAlign: 'center',

            fontFamily: 'monospace',

            fontSize: 10,

            letterSpacing: 2,

            color:
              'rgba(255,255,255,.35)',
          }}
        >
          {ui.status}
        </Typography>
      </Box>

      {/* ==============================
          COUNTRY CONFIRMATION MODAL
      =============================== */}

      <Dialog
        open={dialogOpen}

        onClose={closeDialog}

        maxWidth="xs"

        fullWidth

        sx={{
          '&& .MuiDialog-paper': {
            backgroundColor:
              '#080d13 !important',

            backgroundImage:
              'none !important',

            color: '#fff !important',

            borderRadius:
              '0 !important',

            border:
              '1px solid rgba(114,246,255,.5) !important',

            boxShadow:
              '0 0 70px rgba(114,246,255,.12) !important',
          },
        }}

        slotProps={{
          paper: {
            sx: {
              backgroundColor: '#080d13',
              backgroundImage: 'none',
            },
          },

          backdrop: {
            sx: {
              backgroundColor:
                'rgba(0,0,0,.86)',

              backdropFilter: 'blur(8px)',
            },
          },
        }}
      >
        {/* TOP NEON LINE */}

        <Box
          sx={{
            height: 3,

            background:
              'linear-gradient(90deg,transparent,#72f6ff,transparent)',
          }}
        />

        <Box
          sx={{
            p: {
              xs: 3,
              md: 4,
            },

            textAlign: 'center',
          }}
        >
          {/* MODAL EYEBROW */}

          <Typography
            sx={{
              fontFamily: 'monospace',

              fontSize: 10,
              letterSpacing: 2.5,

              fontWeight: 800,
              color: CYAN,

              mb: 2,
            }}
          >
            {ui.modalEyebrow}
          </Typography>

          {/* MODAL HEADING */}

          <Typography
            component="h3"

            sx={{
              fontSize: {
                xs: 22,
                md: 27,
              },

              fontWeight: 900,

              lineHeight: 1.15,

              letterSpacing: -0.5,
            }}
          >
            {ui.modalQuestion}

            <Box
              component="span"

              sx={{
                display: 'block',

                color: CYAN,

                mt: 0.6,
              }}
            >
              {selectedPoint?.country?.toUpperCase()}?
            </Box>
          </Typography>

          {/* MODAL DESCRIPTION */}

          <Typography
            sx={{
              mt: 2,

              fontSize: 12,

              lineHeight: 1.8,

              color:
                'rgba(255,255,255,.6)',
            }}
          >
            {ui.modalDescription}
          </Typography>

          {/* DETECTED COUNTRY CARD */}

          <Box
            sx={{
              mt: 3,
              mb: 3,

              p: 2,

              backgroundColor:
                'rgba(114,246,255,.045)',

              border:
                '1px solid rgba(114,246,255,.22)',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'monospace',

                fontSize: 10,
                letterSpacing: 1.5,

                color:
                  'rgba(255,255,255,.55)',
              }}
            >
              {ui.selectedCountry}
            </Typography>

            <Typography
              sx={{
                fontSize: 19,

                fontWeight: 900,

                color: CYAN,

                mt: 1,
              }}
            >
              {selectedPoint?.country}
            </Typography>
          </Box>

          {/* API ERROR */}

          {formError && (
            <Typography
              sx={{
                mb: 2,

                color: '#ff557b',

                fontSize: 11,
                fontFamily: 'monospace',
              }}
            >
              {formError}
            </Typography>
          )}

          {/* ACTIONS */}

          <DialogActions
            sx={{
              p: 0,

              display: 'grid',

              gridTemplateColumns:
                '1fr 1.5fr',

              gap: 1.5,
            }}
          >
            <Button
              type="button"

              onClick={closeDialog}

              disabled={saving}

              sx={{
                m: '0 !important',

                py: 1.5,

                borderRadius: 0,

                border:
                  '1px solid rgba(255,255,255,.25)',

                color: '#fff',

                fontFamily: 'monospace',

                fontSize: 11,
                fontWeight: 900,
              }}
            >
              {ui.cancel}
            </Button>

            <Button
              type="button"

              onClick={handleCheckin}

              disabled={
                saving ||
                !selectedPoint
              }

              sx={{
                m: '0 !important',

                py: 1.5,

                borderRadius: 0,

                backgroundColor: CYAN,

                color: '#000',

                fontFamily: 'monospace',

                fontSize: 11,
                fontWeight: 900,

                '&:hover': {
                  backgroundColor: '#fff',
                },

                '&.Mui-disabled': {
                  backgroundColor:
                    'rgba(114,246,255,.2)',

                  color:
                    'rgba(255,255,255,.4)',
                },
              }}
            >
              {saving
                ? ui.saving
                : ui.confirm}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default VisitorGlobeSection;
