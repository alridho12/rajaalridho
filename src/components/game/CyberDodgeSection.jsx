
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useLanguage } from '../../i18n/LanguageContext';

// ==========================================
// CONSTANTS
// ==========================================



const API_URL = '/api/leaderboard';

const BEST_SCORE_KEY = 'cyber-dodge-best';
const MAX_LEADERBOARD = 5;

const CYAN = '#72f6ff';
const RED = '#ff557b';

const createInitialGame = () => ({
  playerX: 0,
  obstacles: [],
  elapsed: 0,
  spawnTimer: 0,
  gridOffset: 0,
  score: 0,
  uiTimer: 0,
  speedMultiplier: 1,
});

// ==========================================
// LEADERBOARD HELPERS
// ==========================================


const readBestScore = () => {
  try {
    return (
      Number(localStorage.getItem(BEST_SCORE_KEY)) || 0
    );
  } catch {
    return 0;
  }
};

// ==========================================
// LANGUAGE LABELS
// ==========================================

const labels = {
  en: {
    leaderboard: 'TOP 05 / LEADERBOARD',
    subtitle: 'HALL OF FAME',
    empty: 'NO RECORD YET',
    local: 'Records saved on this device',
    newRecord: 'NEW HIGH SCORE',
    qualified: 'YOU MADE THE TOP 5!',
    dialogDescription:
      'Enter your pilot name to save your score.',
    pilotName: 'PILOT NAME',
    placeholder: 'ENTER YOUR NAME',
    save: 'SAVE SCORE',
    skip: 'SKIP',
    score: 'YOUR SCORE',
    ready: 'READY TO DODGE',
    gameOver: 'GAME OVER',
    start: 'START RUN',
    retry: 'TRY AGAIN',
    finalScore: 'Final score',
    points: 'PTS',
  },
  id: {
    leaderboard: 'TOP 05 / PAPAN PERINGKAT',
    subtitle: 'HALL OF FAME',
    empty: 'BELUM ADA REKOR',
    local: 'Rekor tersimpan di perangkat ini',
    newRecord: 'REKOR BARU',
    qualified: 'KAMU MASUK TOP 5!',
    dialogDescription:
      'Masukkan nama pilot untuk menyimpan skormu.',
    pilotName: 'NAMA PILOT',
    placeholder: 'MASUKKAN NAMAMU',
    save: 'SIMPAN SKOR',
    skip: 'LEWATI',
    score: 'SKOR KAMU',
    ready: 'SIAP MENGHINDAR',
    gameOver: 'PERMAINAN SELESAI',
    start: 'MULAI',
    retry: 'COBA LAGI',
    finalScore: 'Skor akhir',
    points: 'PTS',
  },
};

// ==========================================
// COMPONENT
// ==========================================

const CyberDodgeSection = () => {
  const canvasRef = useRef(null);
  const gameRef = useRef(createInitialGame());
  const statusRef = useRef('ready');

  const keysRef = useRef({
    left: false,
    right: false,
  });

  const { t, language } = useLanguage();

  const ui = labels[language] || labels.en;

  // ========================================
  // REACT STATE
  // ========================================

  const [status, setStatus] = useState('ready');
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(1);

  const [bestScore, setBestScore] =
    useState(readBestScore);


  const [leaderboard, setLeaderboard] = useState([]);

  const [savingScore, setSavingScore] = useState(false);

  const [saveError, setSaveError] = useState('');


  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [playerName, setPlayerName] =
    useState('');

  const [pendingScore, setPendingScore] =
    useState(null);

  // Keep fresh values inside canvas animation loop

  const bestScoreRef = useRef(bestScore);
  const leaderboardRef = useRef(leaderboard);

  useEffect(() => {
    bestScoreRef.current = bestScore;
  }, [bestScore]);

  useEffect(() => {
    leaderboardRef.current = leaderboard;
  }, [leaderboard]);



  // ==========================================
  // GLOBAL LEADERBOARD SYNC
  // ==========================================

  useEffect(() => {
    let active = true;

    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(API_URL, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(
            'Failed to fetch leaderboard'
          );
        }

        const data = await response.json();

        if (active && Array.isArray(data.leaderboard)) {
          leaderboardRef.current =
            data.leaderboard;

          setLeaderboard(data.leaderboard);
        }
      } catch (error) {
        console.error(
          'Leaderboard sync error:',
          error
        );
      }
    };

    // Fetch leaderboard on first load

    fetchLeaderboard();

    // Update every 30 seconds

    const interval = setInterval(
      fetchLeaderboard,
      30000
    );

    // Refresh when visitor returns to the tab

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchLeaderboard();
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    return () => {
      active = false;

      clearInterval(interval);

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };
  }, []);



  // ========================================
  // GAME STATUS
  // ========================================

  const setGameStatus = useCallback(
    (nextStatus) => {
      statusRef.current = nextStatus;
      setStatus(nextStatus);
    },
    []
  );

  // ========================================
  // START / RESTART
  // ========================================

  const startGame = useCallback(() => {
    gameRef.current = createInitialGame();

    keysRef.current = {
      left: false,
      right: false,
    };

    setScore(0);
    setSpeed(1);
    setPendingScore(null);
    setPlayerName('');
    setDialogOpen(false);

    setGameStatus('playing');
  }, [setGameStatus]);

  // ========================================
  // QUALIFY FOR LEADERBOARD
  // ========================================

  const isTopFive = useCallback((finalScore) => {
    if (finalScore <= 0) return false;

    const records = leaderboardRef.current;

    if (records.length < MAX_LEADERBOARD) {
      return true;
    }

    return (
      finalScore >
      records[MAX_LEADERBOARD - 1].score
    );
  }, []);

  // ========================================
  // GAME OVER HANDLER
  // ========================================

  const endGame = useCallback(
    (finalScore, finalSpeed) => {
      if (statusRef.current !== 'playing') {
        return;
      }

      setGameStatus('over');

      keysRef.current = {
        left: false,
        right: false,
      };

      setScore(finalScore);
      setSpeed(finalSpeed);

      // Save personal best

      const nextBest = Math.max(
        bestScoreRef.current,
        finalScore
      );

      bestScoreRef.current = nextBest;
      setBestScore(nextBest);

      try {
        localStorage.setItem(
          BEST_SCORE_KEY,
          String(nextBest)
        );
      } catch {
        // Storage unavailable
      }

      // Check top 5

      if (isTopFive(finalScore)) {
        setPendingScore(finalScore);
        setPlayerName('');
        setDialogOpen(true);
      }
    },
    [setGameStatus, isTopFive]
  );


  // ==========================================
  // SAVE SCORE TO GLOBAL LEADERBOARD
  // ==========================================

  const handleSaveScore = async () => {
    const cleanName = playerName
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, 16);

    if (
      !cleanName ||
      pendingScore === null ||
      savingScore
    ) {
      return;
    }

    setSavingScore(true);
    setSaveError('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          name: cleanName,
          score: pendingScore,
        }),
      });


      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.leaderboard)) {
          leaderboardRef.current =
            data.leaderboard;

          setLeaderboard(data.leaderboard);
        }

        throw new Error(
          data.error || 'Gagal menyimpan skor'
        );
      }

      // Perbarui leaderboard

      leaderboardRef.current =
        data.leaderboard;

      setLeaderboard(data.leaderboard);

      // Tutup modal setelah berhasil

      setDialogOpen(false);

      setPendingScore(null);

      setPlayerName('');

      setSaveError('');
    } catch (error) {
      console.error(
        'Save score error:',
        error
      );

      setSaveError(
        error.message || 'Gagal menyimpan skor'
      );
    } finally {
      setSavingScore(false);
    }
  };


  const handleSkipScore = () => {
    setDialogOpen(false);
    setPendingScore(null);
    setPlayerName('');
  };

  // ========================================
  // CANVAS GAME ENGINE
  // ========================================

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    let width = 1;
    let height = 1;
    let animationFrame = 0;
    let previousTime = 0;
    let stars = [];
    let resizeObserver;

    // ======================================
    // RESIZE CANVAS
    // ======================================

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from(
        { length: 65 },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height * 0.8,
          size: Math.random() * 1.4 + 0.3,
          alpha: Math.random() * 0.6 + 0.2,
        })
      );
    };

    resizeCanvas();

    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(
        resizeCanvas
      );

      resizeObserver.observe(canvas);
    } else {
      window.addEventListener(
        'resize',
        resizeCanvas
      );
    }

    // ======================================
    // KEYBOARD CONTROLS
    // ======================================


    const handleKeyDown = (event) => {
      // Kontrol keyboard hanya aktif saat game dimainkan
      if (statusRef.current !== 'playing') {
        return;
      }

      // Jangan mengambil alih keyboard saat mengetik
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (
          target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(
            target.tagName
          )
        )
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      // ========================================
      // PREVENT PAGE SCROLL WHILE PLAYING
      // ========================================

      const blockedKeys = [
        'arrowup',
        'arrowdown',
        'arrowleft',
        'arrowright',
        ' ',
      ];

      if (blockedKeys.includes(key)) {
        event.preventDefault();
      }

      // ========================================
      // PLAYER MOVEMENT
      // ========================================

      if (key === 'arrowleft' || key === 'a') {
        keysRef.current.left = true;
      }

      if (key === 'arrowright' || key === 'd') {
        keysRef.current.right = true;
      }
    };


    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();

      if (key === 'arrowleft' || key === 'a') {
        keysRef.current.left = false;
      }

      if (key === 'arrowright' || key === 'd') {
        keysRef.current.right = false;
      }
    };

    const handleBlur = () => {
      keysRef.current = {
        left: false,
        right: false,
      };
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    window.addEventListener(
      'keyup',
      handleKeyUp
    );

    window.addEventListener('blur', handleBlur);

    // ======================================
    // DRAW GAME
    // ======================================

    const draw = (timestamp) => {
      const deltaTime =
        previousTime === 0
          ? 0
          : Math.min(
            (timestamp - previousTime) / 1000,
            0.04
          );

      previousTime = timestamp;

      const game = gameRef.current;

      // ====================================
      // UPDATE GAME
      // ====================================

      if (statusRef.current === 'playing') {
        game.elapsed += deltaTime;

        // Player movement

        const movementSpeed = 1.8;

        if (keysRef.current.left) {
          game.playerX -=
            movementSpeed * deltaTime;
        }

        if (keysRef.current.right) {
          game.playerX +=
            movementSpeed * deltaTime;
        }


        game.playerX = Math.max(
          -0.8,
          Math.min(0.8, game.playerX)
        );


        // Speed progression

        game.speedMultiplier =
          1 + Math.min(game.elapsed / 32, 1.25);

        // Obstacle spawning

        game.spawnTimer += deltaTime;

        const spawnInterval = Math.max(
          0.52,
          1.05 / game.speedMultiplier
        );

        if (game.spawnTimer >= spawnInterval) {
          game.spawnTimer = 0;

          const lanes = [
            -0.8,
            -0.4,
            0,
            0.4,
            0.8,
          ];

          const randomLane =
            lanes[
            Math.floor(
              Math.random() * lanes.length
            )
            ];

          game.obstacles.push({
            x: randomLane,
            z: 0.02,
          });
        }

        // Obstacles and collision

        let collision = false;

        game.obstacles = game.obstacles.filter(
          (obstacle) => {
            obstacle.z +=
              deltaTime *
              0.45 *
              game.speedMultiplier;

            if (
              obstacle.z > 0.86 &&
              obstacle.z < 1.08 &&
              Math.abs(
                game.playerX - obstacle.x
              ) < 0.17
            ) {
              collision = true;
            }

            if (obstacle.z >= 1.12) {
              game.score += 10;
              return false;
            }

            return true;
          }
        );

        if (collision) {
          endGame(
            game.score,
            Number(
              game.speedMultiplier.toFixed(1)
            )
          );
        } else if (
          timestamp - game.uiTimer > 100
        ) {
          setScore(game.score);

          setSpeed(
            Number(
              game.speedMultiplier.toFixed(1)
            )
          );

          game.uiTimer = timestamp;
        }

        // Moving grid

        if (statusRef.current === 'playing') {
          game.gridOffset =
            (
              game.gridOffset +
              deltaTime *
              (0.35 +
                game.speedMultiplier * 0.2)
            ) % 1;
        }
      }

      // ====================================
      // BACKGROUND
      // ====================================

      ctx.clearRect(0, 0, width, height);

      const background =
        ctx.createLinearGradient(
          0,
          0,
          0,
          height
        );

      background.addColorStop(0, '#080a11');
      background.addColorStop(1, '#020204');

      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      // ====================================
      // STARS
      // ====================================

      stars.forEach((star) => {
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = '#ffffff';

        ctx.fillRect(
          star.x,
          star.y,
          star.size,
          star.size
        );
      });

      ctx.globalAlpha = 1;

      // ====================================
      // PERSPECTIVE GRID
      // ====================================

      const horizon = height * 0.22;

      const glow = ctx.createRadialGradient(
        width / 2,
        horizon,
        0,
        width / 2,
        horizon,
        width * 0.6
      );

      glow.addColorStop(
        0,
        'rgba(45,105,140,0.12)'
      );

      glow.addColorStop(
        1,
        'rgba(0,0,0,0)'
      );

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 1;
      ctx.strokeStyle =
        'rgba(100,220,255,0.13)';

      // Perspective lines

      for (let i = -10; i <= 10; i++) {
        const bottomX =
          width / 2 +
          (i / 10) * width * 0.58;

        ctx.beginPath();

        ctx.moveTo(width / 2, horizon);
        ctx.lineTo(bottomX, height);

        ctx.stroke();
      }

      // Horizontal grid

      for (let i = 0; i < 18; i++) {
        const progress =
          (i / 18 + game.gridOffset) % 1;

        const y =
          horizon +
          Math.pow(progress, 2) *
          (height - horizon);

        ctx.beginPath();

        ctx.moveTo(0, y);
        ctx.lineTo(width, y);

        ctx.stroke();
      }

      ctx.strokeStyle =
        'rgba(110,240,255,0.3)';

      ctx.beginPath();
      ctx.moveTo(0, horizon);
      ctx.lineTo(width, horizon);
      ctx.stroke();

      // ====================================
      // DRAW OBSTACLES
      // ====================================

      game.obstacles.forEach((obstacle) => {
        const z = Math.min(
          obstacle.z,
          1.15
        );

        const perspective =
          0.12 + z * 0.88;

        const x =
          width / 2 +
          obstacle.x *
          width *
          0.38 *
          perspective;

        const y =
          horizon +
          Math.pow(z, 1.8) *
          (height - horizon) *
          0.92;

        const obstacleWidth =
          8 + Math.pow(z, 1.4) * 44;

        const obstacleHeight =
          7 + Math.pow(z, 1.4) * 22;

        ctx.save();

        ctx.shadowColor = '#ff245c';
        ctx.shadowBlur = 5 + z * 14;

        ctx.strokeStyle =
          `rgba(255,40,95,${0.5 + z * 0.5})`;

        ctx.lineWidth = 1.2 + z * 1.5;

        ctx.strokeRect(
          x - obstacleWidth / 2,
          y - obstacleHeight / 2,
          obstacleWidth,
          obstacleHeight
        );

        if (
          obstacleWidth > 12 &&
          obstacleHeight > 12
        ) {
          ctx.shadowBlur = 0;

          ctx.strokeStyle =
            'rgba(255,110,145,0.5)';

          ctx.lineWidth = 1;

          ctx.strokeRect(
            x - obstacleWidth / 2 + 4,
            y - obstacleHeight / 2 + 3,
            obstacleWidth - 8,
            obstacleHeight - 6
          );
        }

        ctx.restore();
      });

      // ====================================
      // PLAYER SHIP
      // ====================================

      const playerX =
        width / 2 +
        game.playerX * width * 0.36;

      const playerY = height * 0.82;

      const shipSize = Math.max(
        8,
        Math.min(width, height) * 0.028
      );

      ctx.save();

      ctx.shadowColor = '#65f6ff';
      ctx.shadowBlur = 16;

      ctx.beginPath();

      ctx.moveTo(
        playerX,
        playerY - shipSize * 1.4
      );

      ctx.lineTo(
        playerX - shipSize,
        playerY + shipSize
      );

      ctx.lineTo(
        playerX,
        playerY + shipSize * 0.45
      );

      ctx.lineTo(
        playerX + shipSize,
        playerY + shipSize
      );

      ctx.closePath();

      ctx.fillStyle =
        'rgba(90,245,255,0.18)';

      ctx.fill();

      ctx.strokeStyle = '#80fbff';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Ship center light

      ctx.beginPath();

      ctx.arc(
        playerX,
        playerY,
        2,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();

      // ====================================
      // NEXT FRAME
      // ====================================

      animationFrame =
        requestAnimationFrame(draw);
    };

    animationFrame =
      requestAnimationFrame(draw);

    // ======================================
    // CLEANUP
    // ======================================

    return () => {
      cancelAnimationFrame(animationFrame);

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener(
          'resize',
          resizeCanvas
        );
      }

      window.removeEventListener(
        'keydown',
        handleKeyDown
      );

      window.removeEventListener(
        'keyup',
        handleKeyUp
      );

      window.removeEventListener(
        'blur',
        handleBlur
      );
    };
  }, [endGame]);

  // ========================================
  // MOBILE CONTROLS
  // ========================================

  const pressDirection = (direction) => {
    if (statusRef.current === 'playing') {
      keysRef.current[direction] = true;
    }
  };

  const releaseDirection = (direction) => {
    keysRef.current[direction] = false;
  };

  const controlButtonSx = {
    flex: 1,
    py: 1.2,
    borderRadius: 0,
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    backgroundColor: '#101116',
    fontFamily: 'monospace',
    fontWeight: 800,
    touchAction: 'none',
    userSelect: 'none',

    '&:hover': {
      backgroundColor: '#1b2028',
      borderColor: CYAN,
    },

    '&:active': {
      backgroundColor: '#15333a',
    },
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <Box
      component="section"
      id="cyber-dodge"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000',
        color: '#fff',
        pb: 10,
        px: {
          xs: 2,
          md: 4,
        },

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: {
            xs: 280,
            md: 650,
          },
          height: {
            xs: 280,
            md: 650,
          },
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(40,100,130,0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 1050,
          mx: 'auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ==================================
            SECTION HEADER
        ================================== */}

        <Box
          sx={{
            textAlign: 'center',
            mb: {
              xs: 4,
              md: 6,
            },
          }}
        >
          <Typography
            component="p"
            sx={{
              fontSize: 11,
              letterSpacing: 3,
              color: 'rgba(255,255,255,0.6)',
              mb: 1.5,
            }}
          >
            INTERACTIVE EXPERIMENT / 001
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontSize: {
                xs: '2rem',
                sm: '2.8rem',
                md: '3.6rem',
              },
              fontWeight: 900,
              letterSpacing: '-0.045em',
              lineHeight: 1.05,
            }}
          >
            CYBER DODGE{' '}

            <Box
              component="span"
              sx={{
                color: CYAN,
                animation:
                  'neonGlow 1.5s ease-in-out infinite alternate',

                '@keyframes neonGlow': {
                  '0%': {
                    color: '#ffffff',
                    textShadow:
                      '0 0 4px #ffffff, 0 0 10px rgba(255,255,255,0.5)',
                  },
                  '100%': {
                    color: CYAN,
                    textShadow:
                      '0 0 8px #72f6ff, 0 0 20px rgba(114,246,255,0.6)',
                  },
                },
              }}
            >
              ARCADE
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: 2,
              fontSize: {
                xs: 12,
                md: 14,
              },
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.8,
            }}
          >
            {t('game.description1')}
            <br />
            {t('game.description2')}
          </Typography>
        </Box>

        {/* ==================================
            GAME FRAME
        ================================== */}

        <Box
          sx={{
            p: {
              xs: 1,
              sm: 1.5,
              md: 2,
            },
            border:
              '1px solid rgba(255,255,255,0.45)',
            backgroundColor:
              'rgba(255,255,255,0.025)',
            boxShadow:
              '0 0 60px rgba(65,220,255,0.055)',
          }}
        >
          {/* GAME HUD */}

          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            alignItems={{
              xs: 'flex-start',
              sm: 'center',
            }}
            justifyContent="space-between"
            spacing={1.5}
            sx={{
              px: 0.5,
              pb: 1.5,
            }}
          >
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 1.5,
              }}
            >
              CYBER_DODGE
              <Box
                component="span"
                sx={{ color: CYAN }}
              >
                .EXE
              </Box>
            </Typography>

            <Stack
              direction="row"
              spacing={{
                xs: 1.5,
                sm: 3,
              }}
              flexWrap="wrap"
              useFlexGap
            >
              <Typography
                sx={{
                  fontFamily: 'monospace',
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.65)',
                }}
              >
                SCORE:{' '}
                <Box
                  component="span"
                  sx={{
                    color: CYAN,
                    fontWeight: 900,
                  }}
                >
                  {String(score).padStart(5, '0')}
                </Box>
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'monospace',
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.65)',
                }}
              >
                BEST:{' '}
                <Box
                  component="span"
                  sx={{
                    color: '#fff',
                    fontWeight: 900,
                  }}
                >
                  {String(bestScore).padStart(5, '0')}
                </Box>
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'monospace',
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.65)',
                }}
              >
                SPEED:{' '}
                <Box
                  component="span"
                  sx={{
                    color: RED,
                    fontWeight: 900,
                  }}
                >
                  {speed.toFixed(1)}x
                </Box>
              </Typography>
            </Stack>
          </Stack>

          {/* ==================================
              CANVAS GAME
          ================================== */}

          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              border:
                '1px solid rgba(255,255,255,0.35)',
            }}
          >
            <Box
              component="canvas"
              ref={canvasRef}
              aria-label="Cyber Dodge arcade game"
              sx={{
                display: 'block',
                width: '100%',
                height: {
                  xs: 300,
                  sm: 360,
                  md: 430,
                },
                backgroundColor: '#050609',
              }}
            />

            {/* READY / GAME OVER OVERLAY */}

            {status !== 'playing' && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  p: 3,
                  backgroundColor:
                    'rgba(2,4,10,0.78)',
                  backdropFilter: 'blur(3px)',
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: 10,
                      letterSpacing: 3,
                      color:
                        status === 'ready'
                          ? CYAN
                          : RED,
                      mb: 1.5,
                    }}
                  >
                    {status === 'ready'
                      ? 'SYSTEM ONLINE'
                      : 'SIGNAL LOST'}
                  </Typography>

                  <Typography
                    component="h3"
                    sx={{
                      fontSize: {
                        xs: '1.8rem',
                        md: '2.8rem',
                      },
                      fontWeight: 900,
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {status === 'ready'
                      ? ui.ready
                      : ui.gameOver}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      color:
                        'rgba(255,255,255,0.65)',
                      mt: 1.5,
                      lineHeight: 1.8,
                    }}
                  >
                    {status === 'ready'
                      ? t('game.status')
                      : `${ui.finalScore}: ${score}`}
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={startGame}
                    sx={{
                      mt: 3,
                      px: 4,
                      py: 1.3,
                      borderRadius: 0,
                      backgroundColor: '#fff',
                      color: '#000',
                      fontSize: 11,
                      fontWeight: 900,
                      letterSpacing: 1,
                      '&:hover': {
                        backgroundColor: CYAN,
                      },
                    }}
                  >
                    {status === 'ready'
                      ? ui.start
                      : ui.retry}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* ==================================
              MOBILE CONTROLS
          ================================== */}

          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              display: {
                xs: 'flex',
                md: 'none',
              },
              mt: 1.5,
            }}
          >
            <Button
              sx={controlButtonSx}
              onPointerDown={() =>
                pressDirection('left')
              }
              onPointerUp={() =>
                releaseDirection('left')
              }
              onPointerLeave={() =>
                releaseDirection('left')
              }
              onPointerCancel={() =>
                releaseDirection('left')
              }
              aria-label="Move left"
            >
              ← LEFT
            </Button>

            <Button
              sx={controlButtonSx}
              onPointerDown={() =>
                pressDirection('right')
              }
              onPointerUp={() =>
                releaseDirection('right')
              }
              onPointerLeave={() =>
                releaseDirection('right')
              }
              onPointerCancel={() =>
                releaseDirection('right')
              }
              aria-label="Move right"
            >
              RIGHT →
            </Button>
          </Stack>

          {/* ==================================
              GAME INSTRUCTIONS
          ================================== */}

          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            alignItems={{
              xs: 'flex-start',
              sm: 'center',
            }}
            justifyContent="space-between"
            spacing={1}
            sx={{
              pt: 2,
              px: 0.5,
            }}
          >
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: 10,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              DESKTOP: ← → OR A / D
            </Typography>

            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: 10,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              +10 POINTS PER GATE
            </Typography>

            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: 10,
                color: CYAN,
              }}
            >
              SURVIVE THE SYSTEM
            </Typography>
          </Stack>
        </Box>

        {/* ==================================
            TOP 5 LEADERBOARD
        ================================== */}

        <Box
          sx={{
            mt: {
              xs: 5,
              md: 7,
            },
            p: {
              xs: 2,
              md: 3,
            },
            border:
              '1px solid rgba(114,246,255,0.28)',
            backgroundColor:
              'rgba(5,10,16,0.9)',
            boxShadow:
              '0 0 45px rgba(114,246,255,0.045)',
          }}
        >
          {/* LEADERBOARD HEADER */}

          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            justifyContent="space-between"
            alignItems={{
              xs: 'flex-start',
              sm: 'center',
            }}
            spacing={2}
            sx={{
              pb: 2.5,
              borderBottom:
                '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: CYAN,
                  fontFamily: 'monospace',
                  fontSize: 10,
                  letterSpacing: 2,
                  mb: 0.8,
                }}
              >
                {ui.subtitle} / SYSTEM RECORDS
              </Typography>

              <Typography
                component="h3"
                sx={{
                  fontSize: {
                    xs: 19,
                    md: 25,
                  },
                  fontWeight: 900,
                  letterSpacing: -0.5,
                }}
              >
                {ui.leaderboard}
              </Typography>
            </Box>

            <Box
              sx={{
                px: 2,
                py: 1,
                border:
                  '1px solid rgba(114,246,255,0.35)',
                color: CYAN,
                fontFamily: 'monospace',
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 1.5,
              }}
            >
              ★ TOP 5
            </Box>
          </Stack>

          {/* LEADERBOARD ROWS */}

          <Stack spacing={1} sx={{ mt: 2.5 }}>
            {Array.from(
              { length: MAX_LEADERBOARD },
              (_, index) => {
                const item = leaderboard[index];

                const isFirst = index === 0 && item;

                return (
                  <Box
                    key={item?.id || `empty-${index}`}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns:
                        '38px minmax(0,1fr) auto',
                      gap: {
                        xs: 1.5,
                        md: 3,
                      },
                      alignItems: 'center',
                      minHeight: 62,
                      px: {
                        xs: 1.5,
                        md: 2.5,
                      },
                      py: 1.5,
                      border: `1px solid ${isFirst
                        ? 'rgba(114,246,255,0.45)'
                        : 'rgba(255,255,255,0.1)'
                        }`,
                      backgroundColor: isFirst
                        ? 'rgba(114,246,255,0.065)'
                        : 'rgba(255,255,255,0.015)',
                      transition:
                        'border-color .25s ease, background-color .25s ease',
                      '&:hover': {
                        borderColor:
                          'rgba(114,246,255,0.45)',
                        backgroundColor:
                          'rgba(114,246,255,0.045)',
                      },
                    }}
                  >
                    {/* RANK */}

                    <Typography
                      sx={{
                        color: isFirst
                          ? CYAN
                          : 'rgba(255,255,255,0.4)',
                        fontFamily: 'monospace',
                        fontSize: 13,
                        fontWeight: 900,
                      }}
                    >
                      {String(index + 1).padStart(
                        2,
                        '0'
                      )}
                    </Typography>

                    {/* PLAYER NAME */}

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        noWrap
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: {
                            xs: 11,
                            sm: 13,
                          },
                          fontWeight: 800,
                          letterSpacing: 1,
                          color: item
                            ? '#fff'
                            : 'rgba(255,255,255,0.3)',
                        }}
                      >
                        {item
                          ? item.name.toUpperCase()
                          : ui.empty}
                      </Typography>

                      {isFirst && (
                        <Typography
                          sx={{
                            color: CYAN,
                            fontFamily: 'monospace',
                            fontSize: 9,
                            letterSpacing: 1.5,
                            mt: 0.4,
                          }}
                        >
                          ★ HIGH COMMANDER
                        </Typography>
                      )}
                    </Box>

                    {/* SCORE */}

                    <Typography
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: {
                          xs: 12,
                          md: 15,
                        },
                        fontWeight: 900,
                        color: isFirst
                          ? CYAN
                          : item
                            ? '#fff'
                            : 'rgba(255,255,255,0.3)',
                        textAlign: 'right',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item
                        ? String(item.score).padStart(
                          5,
                          '0'
                        )
                        : '-----'}
                    </Typography>
                  </Box>
                );
              }
            )}
          </Stack>

          {/* LEADERBOARD FOOTER */}

          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            spacing={1}
            justifyContent="space-between"
            sx={{
              pt: 2.5,
            }}
          >
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: 10,
                letterSpacing: 0.5,
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              ● {language === 'id'
                ? 'Leaderboard global seluruh pemain'
                : 'Global leaderboard — all players'}
            </Typography>

            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: 10,
                color: CYAN,
              }}
            >
              SYSTEM STATUS: ONLINE
            </Typography>
          </Stack>
        </Box>

        {/* ==================================
            BOTTOM LABEL
        ================================== */}

        <Typography
          sx={{
            mt: 3,
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: 10,
            letterSpacing: 2,
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          BUILT WITH REACT JS
        </Typography>
      </Box>

      {/* ====================================
          NEW HIGH SCORE MODAL
      ==================================== */}


      <Dialog
        open={dialogOpen}
        onClose={handleSkipScore}
        maxWidth="xs"
        fullWidth
        sx={{
          '&& .MuiDialog-paper': {
            backgroundColor: '#080d13 !important',
            backgroundImage: 'none !important',
            color: '#ffffff !important',

            borderRadius: '0px !important',

            border:
              '1px solid rgba(114,246,255,0.5) !important',

            boxShadow:
              '0 0 80px rgba(114,246,255,0.12) !important',
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
              backgroundColor: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
            },
          },
        }}
      >

        {/* MODAL TOP DECORATION */}

        <Box
          sx={{
            height: 3,
            background:
              'linear-gradient(90deg,transparent,#72f6ff,transparent)',
          }}
        />

        <DialogTitle
          sx={{
            pt: 4,
            px: 3,
            pb: 1,
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 3,
              color: CYAN,
              mb: 1.5,
            }}
          >
            ★ {ui.newRecord} ★
          </Typography>

          <Typography
            component="span"
            sx={{
              display: 'block',
              fontWeight: 900,
              fontSize: {
                xs: 21,
                sm: 26,
              },
              letterSpacing: -0.5,
            }}
          >
            {ui.qualified}
          </Typography>
        </DialogTitle>

        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            handleSaveScore();
          }}
        >
          <DialogContent
            sx={{
              px: 3,
              pt: 1.5,
              pb: 2,
            }}
          >
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'monospace',
                fontSize: 11,
                lineHeight: 1.8,
                textAlign: 'center',
              }}
            >
              {ui.dialogDescription}
            </Typography>

            {/* QUALIFIED SCORE */}

            <Box
              sx={{
                my: 3,
                py: 3,
                textAlign: 'center',
                borderTop:
                  '1px solid rgba(255,255,255,0.12)',
                borderBottom:
                  '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'monospace',
                  fontSize: 10,
                  letterSpacing: 2,
                  color: 'rgba(255,255,255,0.5)',
                  mb: 1,
                }}
              >
                {ui.score}
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'monospace',
                  color: CYAN,
                  fontSize: {
                    xs: 34,
                    md: 44,
                  },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  textShadow:
                    '0 0 25px rgba(114,246,255,0.3)',
                }}
              >
                {String(
                  pendingScore ?? 0
                ).padStart(5, '0')}
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'monospace',
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.45)',
                  mt: 1,
                }}
              >
                {ui.points}
              </Typography>
            </Box>

            {/* NAME INPUT */}

            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 2,
                color: CYAN,
                mb: 1.2,
              }}
            >
              {ui.pilotName}
            </Typography>

            <TextField
              autoFocus
              fullWidth
              autoComplete="off"
              placeholder={ui.placeholder}
              value={playerName}
              onChange={(event) =>
                setPlayerName(
                  event.target.value.slice(0, 16)
                )
              }
              inputProps={{
                maxLength: 16,
                'aria-label': ui.pilotName,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  backgroundColor:
                    'rgba(255,255,255,0.04)',
                  color: '#fff',
                  fontFamily: 'monospace',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 1,
                  '& fieldset': {
                    borderColor:
                      'rgba(255,255,255,0.25)',
                  },
                  '&:hover fieldset': {
                    borderColor: CYAN,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: CYAN,
                  },
                },
                '& input::placeholder': {
                  color:
                    'rgba(255,255,255,0.35)',
                  opacity: 1,
                },
              }}
            />

            {saveError && (
              <Typography
                sx={{
                  mt: 1.5,
                  fontSize: 11,
                  fontFamily: 'monospace',
                  color: '#ff557b',
                }}
              >
                {saveError}
              </Typography>
            )}


            <Typography
              sx={{
                textAlign: 'right',
                mt: 1,
                fontFamily: 'monospace',
                fontSize: 10,
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              {playerName.length}/16
            </Typography>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 3,
              pt: 0,
              display: 'grid',
              gridTemplateColumns: '1fr 1.5fr',
              gap: 1.5,
            }}
          >
            <Button
              type="button"
              onClick={handleSkipScore}
              sx={{
                m: '0 !important',
                py: 1.5,
                borderRadius: 0,
                border:
                  '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: 11,
                fontWeight: 900,
                '&:hover': {
                  backgroundColor:
                    'rgba(255,255,255,0.08)',
                },
              }}
            >
              {ui.skip}
            </Button>

            <Button
              type="submit"
              disabled={
                !playerName.trim() ||
                pendingScore === null ||
                savingScore
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
                letterSpacing: 0.5,
                '&:hover': {
                  backgroundColor: '#fff',
                },
                '&.Mui-disabled': {
                  backgroundColor:
                    'rgba(114,246,255,0.2)',
                  color:
                    'rgba(255,255,255,0.3)',
                },
              }}
            >
              {savingScore ? 'SAVING...' : `${ui.save} →`}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default CyberDodgeSection;
