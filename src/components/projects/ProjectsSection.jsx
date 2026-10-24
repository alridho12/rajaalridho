
import { useRef } from 'react';

import {
  Box,
  Container,
  Typography,
  useMediaQuery,
} from '@mui/material';

import NorthEastIcon from '@mui/icons-material/NorthEast';

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

import { projects } from '../../data/projects';
import star from '../../assets/images/star.png';

// ==========================================
// ANIMATION HELPERS
// ==========================================

const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const lerp = (a, b, t) => a + (b - a) * t;

const smoothstep = (start, end, value) => {
  const t = clamp(
    (value - start) / (end - start)
  );

  return t * t * (3 - 2 * t);
};

// ==========================================
// ANIMATION TIMELINE
// ==========================================

const PHASE = {
  orbitEnd: 0.17,

  clusterEnd: 0.38,

  flipStart: 0.405,
  flipEnd: 0.54,

  stackEnd: 0.64,

  scrollEnd: 0.94,
};

// ==========================================
// PROJECT CARD CONTENT
// ==========================================

const CardFace = ({
  project,
  back = false,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',

        position: 'relative',
        overflow: 'hidden',

        borderRadius: {
          xs: '13px',
          md: '19px',
        },

        border:
          '1px solid rgba(255,255,255,.35)',

        backgroundColor: '#101010',

        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',

        boxShadow:
          '0 28px 75px rgba(0,0,0,.8)',
      }}
    >
      {/* IMAGE */}

      <Box
        component="img"
        src={project.image}
        alt={back ? '' : project.title}
        loading="lazy"
        draggable={false}
        sx={{
          display: 'block',

          width: '100%',
          height: '100%',

          objectFit: 'cover',

          filter: back
            ? 'grayscale(.15)'
            : 'grayscale(.7)',

          transition:
            'filter .5s ease, transform .6s ease',

          userSelect: 'none',
        }}
      />

      {/* GRADIENT */}

      <Box
        sx={{
          position: 'absolute',
          inset: 0,

          background: back
            ? `
              linear-gradient(
                180deg,
                rgba(0,0,0,.1) 0%,
                rgba(0,0,0,.08) 30%,
                rgba(0,0,0,.88) 100%
              )
            `
            : `
              linear-gradient(
                180deg,
                rgba(0,0,0,.3) 0%,
                transparent 40%,
                rgba(0,0,0,.8) 100%
              )
            `,

          pointerEvents: 'none',
        }}
      />

      {/* TOP METADATA */}

      <Box
        sx={{
          position: 'absolute',

          top: {
            xs: 10,
            md: 15,
          },

          left: {
            xs: 12,
            md: 20,
          },

          right: {
            xs: 12,
            md: 20,
          },

          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: 9,
              md: 11,
            },

            fontWeight: 900,
            letterSpacing: 1.5,

            color: '#fff',
          }}
        >
          {back ? 'SELECTED WORK' : project.id}
        </Typography>

        <Typography
          sx={{
            fontSize: 10,
            letterSpacing: 1.5,

            color: 'rgba(255,255,255,.75)',
          }}
        >
          {project.year}
        </Typography>
      </Box>

      {/* BOTTOM CONTENT */}

      <Box
        sx={{
          position: 'absolute',

          left: {
            xs: 12,
            md: 20,
          },

          right: {
            xs: 12,
            md: 20,
          },

          bottom: {
            xs: 11,
            md: 19,
          },
        }}
      >
        <Typography
          sx={{
            color: '#fff',

            fontSize: {
              xs: 17,
              sm: 21,
              md: 28,
            },

            fontWeight: 900,
            letterSpacing: '-.7px',
            lineHeight: 1,

            textTransform: 'uppercase',
          }}
        >
          {project.title}
        </Typography>

        {/* BACK SIDE DETAILS */}

        {back && (
          <>
            <Typography
              sx={{
                mt: 1,

                color:
                  'rgba(255,255,255,.7)',

                fontSize: {
                  xs: 10,
                  md: 12,
                },

                lineHeight: 1.4,
              }}
            >
              {project.subtitle}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 0.7,

                flexWrap: 'wrap',
                mt: 1.4,
              }}
            >
              {(project.tags || [])
                .slice(0, 4)
                .map((tag) => (
                  <Box
                    key={tag}
                    sx={{
                      px: 1,
                      py: 0.45,

                      border:
                        '1px solid rgba(255,255,255,.3)',

                      borderRadius: '999px',

                      background:
                        'rgba(0,0,0,.25)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: {
                          xs: 8,
                          md: 9,
                        },

                        fontWeight: 800,
                      }}
                    >
                      {tag}
                    </Typography>
                  </Box>
                ))}
            </Box>
          </>
        )}
      </Box>

      {/* LINK ARROW */}

      <NorthEastIcon
        sx={{
          position: 'absolute',

          right: {
            xs: 12,
            md: 19,
          },

          bottom: {
            xs: 11,
            md: 18,
          },

          fontSize: {
            xs: 15,
            md: 20,
          },

          color: '#fff',

          opacity: back ? 0 : 1,
        }}
      />
    </Box>
  );
};

// ==========================================
// ONE PROJECT — ALL ANIMATION PHASES
// ==========================================

const OrbitProject = ({
  project,
  index,
  total,
  progress,
  rotation,
  isMobile,
  reducedMotion,
  pauseRef,
}) => {
  const angle =
    -Math.PI / 2 +
    (index / total) * Math.PI * 2;

  // Orbit settings retained
  const radiusX = 31;
  const radiusY = isMobile ? 26 : 30;

  const initialScale = isMobile
    ? 0.44
    : 0.48;

  // Vertical distance between cards
  const stackSpacing = isMobile
    ? 34
    : 40;

  // ==========================================
  // POSITION CALCULATION
  // ==========================================

  const getPosition = (p, r) => {
    const prepare = smoothstep(
      PHASE.orbitEnd,
      PHASE.clusterEnd,
      p
    );

    const unfold = smoothstep(
      PHASE.clusterEnd,
      PHASE.stackEnd,
      p
    );

    const currentAngle = angle + r;

    // ORIGINAL ORBIT

    const orbitX =
      Math.cos(currentAngle) * radiusX;

    const orbitY =
      Math.sin(currentAngle) * radiusY;

    // ORIGINAL CLUSTER

    const centeredIndex =
      index - (total - 1) / 2;

    const clusterX =
      centeredIndex * (isMobile ? 3 : 4);

    const clusterY =
      centeredIndex *
      (isMobile ? 3.5 : 4);

    // VERTICAL SCROLL STACK

    const scrollAmount = smoothstep(
      PHASE.stackEnd,
      PHASE.scrollEnd,
      p
    );

    const activeIndex =
      scrollAmount * Math.max(total - 1, 0);

    const stackX = 0;

    const stackY =
      (index - activeIndex) *
      stackSpacing;

    const preparedX = lerp(
      orbitX,
      clusterX,
      prepare
    );

    const preparedY = lerp(
      orbitY,
      clusterY,
      prepare
    );

    return {
      x: lerp(preparedX, stackX, unfold),
      y: lerp(preparedY, stackY, unfold),

      prepare,
      unfold,
      activeIndex,
    };
  };

  // ==========================================
  // 2D POSITION
  // ==========================================

  const x = useTransform(
    [progress, rotation],
    ([p, r]) => `${getPosition(p, r).x}vw`
  );

  const y = useTransform(
    [progress, rotation],
    ([p, r]) => `${getPosition(p, r).y}svh`
  );

  // ==========================================
  // SCALE
  // ==========================================

  const scale = useTransform(
    progress,
    (p) => {
      const prepare = smoothstep(
        PHASE.orbitEnd,
        PHASE.clusterEnd,
        p
      );

      const unfold = smoothstep(
        PHASE.clusterEnd,
        PHASE.stackEnd,
        p
      );

      const clusterScale = lerp(
        initialScale,
        0.56,
        prepare
      );

      const baseScale = lerp(
        clusterScale,
        1,
        unfold
      );

      // Slightly smaller when farther
      // from the viewport center

      const distance = Math.abs(
        getPosition(p, rotation.get()).activeIndex -
        index
      );

      const depthEnabled = smoothstep(
        0.60,
        0.69,
        p
      );

      const depthScale =
        1 - Math.min(distance, 2) * 0.075;

      return (
        baseScale *
        lerp(1, depthScale, depthEnabled)
      );
    }
  );

  // ==========================================
  // ORIGINAL ORBIT / CLUSTER TILT
  // ==========================================

  const rotateZ = useTransform(
    [progress, rotation],
    ([p, r]) => {
      const prepare = smoothstep(
        PHASE.orbitEnd,
        PHASE.clusterEnd,
        p
      );

      const unfold = smoothstep(
        PHASE.clusterEnd,
        PHASE.stackEnd,
        p
      );

      const orbitTilt =
        Math.sin(angle + r) * 9;

      const clusterTilt =
        index % 2 === 0 ? -7 : 7;

      const stackTilt =
        index % 2 === 0 ? -2.5 : 2.5;

      const tilt = lerp(
        orbitTilt,
        clusterTilt,
        prepare
      );

      return lerp(tilt, stackTilt, unfold);
    }
  );

  // ==========================================
  // 3D FLIP — 180 DEGREES
  // ==========================================

  const stagger =
    (index / Math.max(total - 1, 1)) *
    0.055;

  const rotateY = useTransform(
    progress,
    (p) => {
      const flip = smoothstep(
        PHASE.flipStart + stagger,
        PHASE.flipEnd + stagger,
        p
      );

      // Add subtle Y rotation in stack mode

      const depthEnabled = smoothstep(
        0.62,
        0.70,
        p
      );

      const distance =
        index -
        getPosition(
          p,
          rotation.get()
        ).activeIndex;

      const yaw = clamp(
        distance * -7,
        -14,
        14
      );

      return (
        flip * 180 +
        yaw * depthEnabled
      );
    }
  );

  // ==========================================
  // 3D VERTICAL TILT
  // ==========================================

  const rotateX = useTransform(
    progress,
    (p) => {
      const enabled = smoothstep(
        0.61,
        0.70,
        p
      );

      const distance =
        index -
        getPosition(
          p,
          rotation.get()
        ).activeIndex;

      return (
        clamp(distance * -9, -19, 19) *
        enabled
      );
    }
  );

  // ==========================================
  // DEPTH / OPACITY
  // ==========================================

  const z = useTransform(
    progress,
    (p) => {
      const enabled = smoothstep(
        0.62,
        0.72,
        p
      );

      const distance = Math.abs(
        index -
        getPosition(
          p,
          rotation.get()
        ).activeIndex
      );

      return (
        -Math.min(distance * 90, 220) *
        enabled
      );
    }
  );

  const opacity = useTransform(
    progress,
    (p) => {
      const enabled = smoothstep(
        0.64,
        0.74,
        p
      );

      const distance = Math.abs(
        index -
        getPosition(
          p,
          rotation.get()
        ).activeIndex
      );

      const stackOpacity =
        1 - Math.min(distance * 0.13, 0.4);

      return lerp(
        1,
        stackOpacity,
        enabled
      );
    }
  );

  const layer = useTransform(
    progress,
    (p) => {
      const distance = Math.abs(
        index -
        getPosition(
          p,
          rotation.get()
        ).activeIndex
      );

      return Math.max(
        1,
        50 - Math.round(distance * 10)
      );
    }
  );

  // ==========================================
  // CARD RENDER
  // ==========================================

  return (
    <Box
      component={motion.article}
      style={
        reducedMotion
          ? {}
          : {
            x,
            y,
            z,
            scale,
            rotate: rotateZ,
            opacity,
            zIndex: layer,
          }
      }
      sx={{
        position: reducedMotion
          ? 'relative'
          : 'absolute',

        top: reducedMotion
          ? 'auto'
          : '50%',

        left: reducedMotion
          ? 'auto'
          : '50%',

        translate: reducedMotion
          ? 'none'
          : '-50% -50%',

        width: {
          xs: 'min(84vw, 370px)',
          md: 'min(43vw, 530px)',
        },

        aspectRatio: '2 / 1',

        mx: reducedMotion
          ? 'auto'
          : 0,

        mb: reducedMotion
          ? 4
          : 0,

        perspective: {
          xs: '1100px',
          md: '1500px',
        },

        transformOrigin: 'center',

        '&:hover, &:focus-within': {
          zIndex: '100 !important',
        },
      }}
    >
      {/* 3D FLIP CONTAINER */}

      <Box
        component={
          project.link ? motion.a : motion.div
        }
        href={project.link || undefined}
        data-cursor="hover"
        aria-label={
          project.link
            ? `View project ${project.title}`
            : undefined
        }
        onMouseEnter={() => {
          pauseRef.current = true;
        }}
        onMouseLeave={() => {
          pauseRef.current = false;
        }}
        onFocus={() => {
          pauseRef.current = true;
        }}
        onBlur={() => {
          pauseRef.current = false;
        }}
        style={
          reducedMotion
            ? {}
            : {
              rotateX,
              rotateY,
            }
        }
        sx={{
          display: 'block',

          position: 'relative',

          width: '100%',
          height: '100%',

          color: '#fff',
          textDecoration: 'none',

          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',

          cursor: project.link
            ? 'pointer'
            : 'default',

          '&:hover img': {
            filter: 'grayscale(0)',
          },

          '&:focus-visible': {
            outline: '2px solid #72f6ff',
            outlineOffset: 5,
          },
        }}
      >
        {/* FRONT FACE */}

        <Box
          sx={{
            position: 'absolute',
            inset: 0,

            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <CardFace
            project={project}
            back={reducedMotion}
          />
        </Box>

        {/* BACK FACE */}

        {!reducedMotion && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,

              transform: 'rotateY(180deg)',

              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <CardFace project={project} back />
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ==========================================
// PROJECTS SECTION
// SINGLE SCROLL TIMELINE
// ==========================================

const ProjectsSection = () => {
  const sectionRef = useRef(null);
  const orbitRef = useRef(null);
  const pauseRef = useRef(false);

  const isMobile = useMediaQuery(
    '(max-width:899.95px)'
  );

  const reducedMotion = useReducedMotion();

  const total = projects.length;

  // ==========================================
  // SCROLL CONTROLLER
  // ==========================================

  const { scrollYProgress } = useScroll({
    target: orbitRef,
    offset: ['start start', 'end end'],
  });

  // ==========================================
  // AUTO ROTATION
  // ==========================================

  const rotation = useMotionValue(0);

  const isInView = useInView(orbitRef, {
    amount: 'some',
  });

  useAnimationFrame((time, delta) => {
    if (reducedMotion) return;
    if (!isInView) return;
    if (pauseRef.current) return;

    if (
      scrollYProgress.get() >
      PHASE.orbitEnd
    ) {
      return;
    }

    const speed = 0.00013;

    rotation.set(
      (rotation.get() + delta * speed) %
      (Math.PI * 2)
    );
  });

  // ==========================================
  // VISUAL TRANSITIONS
  // ==========================================

  const headingOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.42],
    [1, 1, 0]
  );

  const centerOpacity = useTransform(
    scrollYProgress,
    [0, 0.17, 0.37],
    [1, 1, 0]
  );

  const ringOpacity = useTransform(
    scrollYProgress,
    [0, 0.17, 0.42],
    [0.22, 0.22, 0]
  );

  const scrollHintOpacity = useTransform(
    scrollYProgress,
    [0, 0.07, 0.2],
    [1, 1, 0]
  );

  const stackLabelOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.69],
    [0, 1]
  );

  // ==========================================
  // SCROLL LENGTH
  // ==========================================


  const scrollHeight = isMobile
    ? 240 + total * 110
    : 260 + total * 120;


  return (

    <Box
      ref={sectionRef}
      component="section"
      id="projects"
      sx={{
        position: 'relative',
        width: '100%',

        backgroundColor: '#000',
        color: '#fff',

        // Jangan pasang overflow hidden/auto
        // pada parent sticky.
        // Clipping dipindahkan ke sticky viewport.
        overflow: 'visible',
      }}
    >

      {/* STAR BACKGROUND */}

      <Box
        component="img"
        src={star}
        alt=""
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,

          width: '100%',
          height: '100%',

          objectFit: 'cover',
          opacity: 0.17,

          pointerEvents: 'none',
        }}
      />


      {/* PINNED SCROLL EXPERIENCE */}

      <Box
        ref={orbitRef}
        sx={{
          position: 'relative',

          width: '100%',

          height: reducedMotion
            ? 'auto'
            : `${scrollHeight}svh`,

          // Scroll berlangsung pada area ini,
          // sementara sticky viewport tetap terlihat.
          overflow: 'visible',
        }}
      >

        {reducedMotion ? (
          <Container
            maxWidth="lg"
            sx={{ py: 10 }}
          >
            <Typography
              component="h2"
              sx={{
                fontSize: {
                  xs: 44,
                  md: 80,
                },

                fontWeight: 900,
                lineHeight: 0.95,
                mb: 8,
              }}
            >
              SELECTED
              <br />
              PROJECTS.
            </Typography>

            {projects.map((project, index) => (
              <OrbitProject
                key={project.id ?? index}
                project={project}
                index={index}
                total={total}
                progress={scrollYProgress}
                rotation={rotation}
                isMobile={isMobile}
                reducedMotion
                pauseRef={pauseRef}
              />
            ))}
          </Container>
        ) : (

          <Box
            sx={{
              position: 'sticky',

              // PIN THE VIEWPORT
              top: 0,

              width: '100%',
              height: '100svh',

              minHeight: '100svh',

              // Konten di luar area layar dipotong,
              // tetapi parent tetap bisa sticky.
              overflow: 'hidden',

              isolation: 'isolate',

              perspective: {
                xs: '1100px',
                md: '1500px',
              },

              backgroundColor: '#000',

              // Membantu stabilitas animasi 3D
              WebkitBackfaceVisibility: 'hidden',
            }}
          >

            {/* GLOW */}

            <Box
              sx={{
                position: 'absolute',

                top: '50%',
                left: '50%',

                width: {
                  xs: 380,
                  md: 850,
                },

                height: {
                  xs: 380,
                  md: 850,
                },

                transform:
                  'translate(-50%, -50%)',

                borderRadius: '50%',

                background:
                  'radial-gradient(circle, rgba(255,255,255,.06), transparent 70%)',

                pointerEvents: 'none',
              }}
            />

            {/* INTRO HEADING */}

            <Box
              component={motion.div}
              style={{
                opacity: headingOpacity,
              }}
              sx={{
                position: 'absolute',

                top: {
                  xs: '7%',
                  md: '9%',
                },

                left: {
                  xs: '6%',
                  md: '8%',
                },

                zIndex: 100,
                pointerEvents: 'none',
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,

                  fontWeight: 800,
                  letterSpacing: 2,

                  mb: 1.5,
                }}
              >
                02 / SELECTED WORK
              </Typography>

              <Typography
                component="h2"
                sx={{
                  fontSize: {
                    xs: 38,
                    sm: 50,
                    md: 66,
                  },

                  fontWeight: 900,
                  lineHeight: 0.9,
                  letterSpacing: -2,
                }}
              >
                PROJECT
                <br />
                ORBIT.
              </Typography>
            </Box>

            {/* OUTER ORBIT */}

            <Box
              component={motion.div}
              style={{
                opacity: ringOpacity,
              }}
              sx={{
                position: 'absolute',

                top: '50%',
                left: '50%',

                translate: '-50% -50%',

                width: {
                  xs: '74vw',
                  md: '68vw',
                },

                height: {
                  xs: '56svh',
                  md: '64svh',
                },

                border:
                  '1px solid rgba(255,255,255,.65)',

                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />

            {/* INNER ORBIT */}

            <Box
              component={motion.div}
              style={{
                opacity: ringOpacity,
              }}
              sx={{
                position: 'absolute',

                top: '50%',
                left: '50%',

                translate: '-50% -50%',

                width: {
                  xs: '48vw',
                  md: '43vw',
                },

                height: {
                  xs: '35svh',
                  md: '43svh',
                },

                border:
                  '1px dashed rgba(255,255,255,.35)',

                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />

            {/* CENTER TEXT */}

            <Box
              component={motion.div}
              style={{
                opacity: centerOpacity,
              }}
              sx={{
                position: 'absolute',

                top: '50%',
                left: '50%',

                translate: '-50% -50%',

                zIndex: 2,

                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: 12,
                    md: 18,
                  },

                  fontWeight: 900,
                  letterSpacing: -0.5,
                }}
              >
                WORKS '26
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  fontSize: 9,

                  color:
                    'rgba(255,255,255,.5)',
                }}
              >
                ✦
              </Typography>
            </Box>

            {/* SAME CARDS THROUGH ALL PHASES */}

            {projects.map((project, index) => (
              <OrbitProject
                key={project.id ?? index}
                project={project}
                index={index}
                total={total}
                progress={scrollYProgress}
                rotation={rotation}
                isMobile={isMobile}
                reducedMotion={false}
                pauseRef={pauseRef}
              />
            ))}

            {/* STACK MODE LABEL */}

            <Box
              component={motion.div}
              style={{
                opacity: stackLabelOpacity,
              }}
              sx={{
                position: 'absolute',

                top: {
                  xs: '7%',
                  md: '9%',
                },

                left: {
                  xs: '6%',
                  md: '8%',
                },

                zIndex: 100,

                pointerEvents: 'none',
              }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 2,

                  color:
                    'rgba(255,255,255,.5)',
                }}
              >
                02 / EXPLORE THE WORK
              </Typography>
            </Box>

            {/* SCROLL INDICATOR */}

            <Box
              component={motion.div}
              style={{
                opacity: scrollHintOpacity,
              }}
              sx={{
                position: 'absolute',

                bottom: {
                  xs: 25,
                  md: 40,
                },

                left: '50%',
                translate: '-50% 0',

                zIndex: 100,
                textAlign: 'center',

                pointerEvents: 'none',
              }}
            >
              <Typography
                sx={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: 2,

                  color:
                    'rgba(255,255,255,.5)',
                }}
              >
                SCROLL TO UNFOLD
              </Typography>

              <Box
                sx={{
                  width: 1,
                  height: 34,

                  mx: 'auto',
                  mt: 2,

                  background:
                    'linear-gradient(to bottom, #fff, transparent)',
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProjectsSection;
