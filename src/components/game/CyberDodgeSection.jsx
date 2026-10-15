import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';


// ==========================================
// INITIAL GAME STATE
// ==========================================

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
// CYBER DODGE ARCADE
// ==========================================

const CyberDodgeSection = () => {
  const canvasRef = useRef(null);

  const gameRef = useRef(
    createInitialGame()
  );

  const statusRef = useRef('ready');

  const keysRef = useRef({
    left: false,
    right: false,
  });


  // ========================================
  // REACT STATE
  // ========================================

  const [status, setStatus] =
    useState('ready');

  const [score, setScore] =
    useState(0);

  const [speed, setSpeed] =
    useState(1);


  const [bestScore, setBestScore] =
    useState(() => {
      if (typeof window === 'undefined') {
        return 0;
      }

      try {
        return (
          Number(
            window.localStorage.getItem(
              'cyber-dodge-best'
            )
          ) || 0
        );
      } catch {
        return 0;
      }
    });


  const bestScoreRef = useRef(bestScore);


  useEffect(() => {
    bestScoreRef.current = bestScore;
  }, [bestScore]);


  // ========================================
  // CHANGE GAME STATUS
  // ========================================

  const setGameStatus = useCallback(
    (nextStatus) => {
      statusRef.current = nextStatus;

      setStatus(nextStatus);
    },
    []
  );


  // ========================================
  // START / RESTART GAME
  // ========================================

  const startGame = useCallback(() => {
    gameRef.current =
      createInitialGame();

    keysRef.current = {
      left: false,
      right: false,
    };

    setScore(0);

    setSpeed(1);

    setGameStatus('playing');
  }, [setGameStatus]);


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

    let dpr = 1;

    let animationFrame = 0;

    let previousTime = 0;

    let stars = [];

    let resizeObserver;


    // ======================================
    // RESIZE CANVAS
    // ======================================

    const resizeCanvas = () => {
      const rect =
        canvas.getBoundingClientRect();

      width = Math.max(1, rect.width);

      height = Math.max(1, rect.height);

      dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width =
        Math.round(width * dpr);

      canvas.height =
        Math.round(height * dpr);

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );


      // Random background stars

      stars = Array.from(
        { length: 65 },
        () => ({
          x: Math.random() * width,

          y: Math.random() * height * 0.8,

          size:
            Math.random() * 1.4 + 0.3,

          alpha:
            Math.random() * 0.6 + 0.2,
        })
      );
    };


    resizeCanvas();


    if (window.ResizeObserver) {
      resizeObserver =
        new ResizeObserver(resizeCanvas);

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
      if (
        statusRef.current !== 'playing'
      ) {
        return;
      }

      const key =
        event.key.toLowerCase();


      if (
        key === 'arrowleft' ||
        key === 'a'
      ) {
        event.preventDefault();

        keysRef.current.left = true;
      }


      if (
        key === 'arrowright' ||
        key === 'd'
      ) {
        event.preventDefault();

        keysRef.current.right = true;
      }
    };


    const handleKeyUp = (event) => {
      const key =
        event.key.toLowerCase();


      if (
        key === 'arrowleft' ||
        key === 'a'
      ) {
        keysRef.current.left = false;
      }


      if (
        key === 'arrowright' ||
        key === 'd'
      ) {
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

    window.addEventListener(
      'blur',
      handleBlur
    );


    // ======================================
    // DRAW GAME
    // ======================================

    const draw = (timestamp) => {
      const deltaTime =
        previousTime === 0
          ? 0
          : Math.min(
            (timestamp - previousTime) /
            1000,
            0.04
          );

      previousTime = timestamp;


      const game = gameRef.current;


      // ====================================
      // UPDATE GAME LOGIC
      // ====================================

      if (
        statusRef.current === 'playing'
      ) {
        game.elapsed += deltaTime;


        // PLAYER MOVEMENT

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
          -1,
          Math.min(1, game.playerX)
        );


        // INCREASING GAME SPEED

        game.speedMultiplier =
          1 +
          Math.min(
            game.elapsed / 32,
            1.25
          );


        // SPAWN OBSTACLES

        game.spawnTimer += deltaTime;


        const spawnInterval = Math.max(
          0.52,
          1.05 / game.speedMultiplier
        );


        if (
          game.spawnTimer >= spawnInterval
        ) {
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


        // MOVE OBSTACLES

        let collision = false;


        game.obstacles =
          game.obstacles.filter(
            (obstacle) => {
              obstacle.z +=
                deltaTime *
                0.45 *
                game.speedMultiplier;


              // COLLISION DETECTION

              if (
                obstacle.z > 0.86 &&
                obstacle.z < 1.08 &&
                Math.abs(
                  game.playerX -
                  obstacle.x
                ) < 0.17
              ) {
                collision = true;
              }


              // SCORE WHEN OBSTACLE PASSES

              if (obstacle.z >= 1.12) {
                game.score += 10;

                return false;
              }


              return true;
            }
          );


        // GAME OVER

        if (collision) {
          setScore(game.score);

          setGameStatus('over');


          keysRef.current = {
            left: false,
            right: false,
          };


          // SAVE BEST SCORE

          const nextBest = Math.max(
            bestScoreRef.current,
            game.score
          );


          bestScoreRef.current =
            nextBest;

          setBestScore(nextBest);


          try {
            window.localStorage.setItem(
              'cyber-dodge-best',
              String(nextBest)
            );
          } catch {
            // Ignore unavailable storage.
          }
        } else {
          // UPDATE UI PERIODICALLY

          if (
            timestamp - game.uiTimer > 100
          ) {
            setScore(game.score);

            setSpeed(
              Number(
                game.speedMultiplier.toFixed(
                  1
                )
              )
            );

            game.uiTimer = timestamp;
          }
        }


        // MOVING GRID

        game.gridOffset =
          (
            game.gridOffset +
            deltaTime *
            (
              0.35 +
              game.speedMultiplier * 0.2
            )
          ) % 1;
      }


      // ====================================
      // BACKGROUND
      // ====================================

      ctx.clearRect(
        0,
        0,
        width,
        height
      );


      const background =
        ctx.createLinearGradient(
          0,
          0,
          0,
          height
        );

      background.addColorStop(
        0,
        '#080a11'
      );

      background.addColorStop(
        1,
        '#020204'
      );


      ctx.fillStyle = background;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );


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


      // Horizon glow

      const glow =
        ctx.createRadialGradient(
          width / 2,
          horizon,
          0,
          width / 2,
          horizon,
          width * 0.6
        );


      glow.addColorStop(
        0,
        'rgba(45, 105, 140, 0.12)'
      );

      glow.addColorStop(
        1,
        'rgba(0, 0, 0, 0)'
      );


      ctx.fillStyle = glow;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );


      ctx.lineWidth = 1;

      ctx.strokeStyle =
        'rgba(100, 220, 255, 0.13)';


      // Perspective lines

      for (
        let i = -10;
        i <= 10;
        i++
      ) {
        const bottomX =
          width / 2 +
          (i / 10) * width * 0.58;


        ctx.beginPath();

        ctx.moveTo(
          width / 2,
          horizon
        );

        ctx.lineTo(
          bottomX,
          height
        );

        ctx.stroke();
      }


      // Horizontal moving grid

      for (
        let i = 0;
        i < 18;
        i++
      ) {
        const progress =
          (
            i / 18 +
            game.gridOffset
          ) % 1;


        const y =
          horizon +
          Math.pow(progress, 2) *
          (height - horizon);


        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(width, y);

        ctx.stroke();
      }


      // Horizon line

      ctx.strokeStyle =
        'rgba(110, 240, 255, 0.3)';

      ctx.beginPath();

      ctx.moveTo(0, horizon);

      ctx.lineTo(width, horizon);

      ctx.stroke();


      // ====================================
      // DRAW RED OBSTACLES
      // ====================================

      game.obstacles.forEach(
        (obstacle) => {
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
            8 +
            Math.pow(z, 1.4) * 44;


          const obstacleHeight =
            7 +
            Math.pow(z, 1.4) * 22;


          ctx.save();


          ctx.shadowColor = '#ff245c';

          ctx.shadowBlur = 5 + z * 14;

          ctx.strokeStyle =
            `rgba(255, 40, 95, ${0.5 + z * 0.5})`;

          ctx.lineWidth =
            1.2 + z * 1.5;


          ctx.strokeRect(
            x - obstacleWidth / 2,
            y - obstacleHeight / 2,
            obstacleWidth,
            obstacleHeight
          );


          // Inner border

          if (
            obstacleWidth > 12 &&
            obstacleHeight > 12
          ) {
            ctx.shadowBlur = 0;

            ctx.strokeStyle =
              'rgba(255, 110, 145, 0.5)';

            ctx.lineWidth = 1;


            ctx.strokeRect(
              x - obstacleWidth / 2 + 4,
              y - obstacleHeight / 2 + 3,
              obstacleWidth - 8,
              obstacleHeight - 6
            );
          }


          ctx.restore();
        }
      );


      // ====================================
      // PLAYER SHIP
      // ====================================

      const playerX =
        width / 2 +
        game.playerX * width * 0.36;


      const playerY =
        height * 0.82;


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
        'rgba(90, 245, 255, 0.18)';

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
      cancelAnimationFrame(
        animationFrame
      );


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
  }, [setGameStatus]);


  // ========================================
  // MOBILE CONTROLS
  // ========================================

  const pressDirection = (direction) => {
    if (
      statusRef.current === 'playing'
    ) {
      keysRef.current[direction] = true;
    }
  };


  const releaseDirection = (direction) => {
    keysRef.current[direction] = false;
  };


  // ========================================
  // COMPONENT STYLES
  // ========================================

  const controlButtonSx = {
    flex: 1,

    py: 1.2,

    borderRadius: 0,

    border: '1px solid rgba(255,255,255,0.3)',

    color: '#ffffff',

    backgroundColor: '#101116',

    fontFamily: 'monospace',

    fontWeight: 800,

    touchAction: 'none',

    userSelect: 'none',

    '&:hover': {
      backgroundColor: '#1b2028',
      borderColor: '#72f6ff',
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

        backgroundColor: '#000000',

        color: '#ffffff',

        pt: {
          xs: 0,
          md: 0,
        },

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
                color: '#72f6ff',

                // 1. Jalankan animasi kustom dengan durasi 1.5 detik (bolak-balik selamanya)
                animation: 'neonGlow 1.5s ease-in-out infinite alternate',

                // 2. Tentukan transisi perubahan warna di dalam @keyframes
                '@keyframes neonGlow': {
                  '0%': {
                    color: '#ffffff', // Putih pekat saat mulai
                    textShadow: '0 0 4px #ffffff, 0 0 10px rgba(255,255,255,0.5)', // Efek pendaran putih
                  },
                  '100%': {
                    color: '#72f6ff', // Berubah ke Cyan murni
                    textShadow: '0 0 8px #72f6ff, 0 0 20px rgba(114,246,255,0.6)', // Efek pendaran cyan neon
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
            Dodge the obstacles. Survive the system.
            <br />

            How long can you stay alive?
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
                sx={{
                  color: '#72f6ff',
                }}
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
                    color: '#72f6ff',
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
                    color: '#ffffff',
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
                    color: '#ff557b',
                    fontWeight: 900,
                  }}
                >
                  {speed.toFixed(1)}x
                </Box>
              </Typography>
            </Stack>
          </Stack>


          {/* =================================
              CANVAS GAME
          ================================= */}

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


            {/* =================================
                READY / GAME OVER OVERLAY
            ================================= */}

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
                          ? '#72f6ff'
                          : '#ff557b',

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
                      ? 'READY TO DODGE'
                      : 'GAME OVER'}
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
                      ? 'Avoid the red gates and collect your score.'
                      : `Final score: ${score}`}
                  </Typography>


                  <Button
                    variant="contained"

                    onClick={startGame}

                    sx={{
                      mt: 3,

                      px: 4,

                      py: 1.3,

                      borderRadius: 0,

                      backgroundColor: '#ffffff',

                      color: '#000000',

                      fontSize: 11,

                      fontWeight: 900,

                      letterSpacing: 1,

                      '&:hover': {
                        backgroundColor: '#72f6ff',
                      },
                    }}
                  >
                    {status === 'ready'
                      ? 'START RUN'
                      : 'TRY AGAIN'}
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

                color: '#72f6ff',
              }}
            >
              SURVIVE THE SYSTEM_
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
    </Box>
  );
};

export default CyberDodgeSection;
