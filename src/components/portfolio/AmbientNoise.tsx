'use client'

import { useEffect, useRef } from 'react'

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragmentShader = `
  precision mediump float;
  uniform vec2 resolution;
  uniform float time;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 p = uv * vec2(resolution.x / resolution.y, 1.0);
    float n = noise(p * 4.2 + vec2(time * 0.018, -time * 0.012));
    n += noise(p * 9.0 - vec2(time * 0.009, time * 0.014)) * 0.42;
    float breath = 0.72 + sin(time * 0.22) * 0.12;
    float field = smoothstep(0.34, 1.12, n) * breath;
    vec3 warm = vec3(0.831, 0.659, 0.325);
    gl_FragColor = vec4(warm * field, field * 0.04);
  }
`

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function AmbientNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compact = window.matchMedia('(max-width: 820px), (pointer: coarse)').matches
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
    if (reduced || compact || saveData) return

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: 'low-power',
    })
    if (!gl) return

    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader)
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
    if (!vertex || !fragment) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )

    const position = gl.getAttribLocation(program, 'position')
    const resolution = gl.getUniformLocation(program, 'resolution')
    const time = gl.getUniformLocation(program, 'time')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    gl.useProgram(program)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    let raf = 0
    let lastFrame = 0
    let isVisible = true

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio, 1) * 0.58
      canvas.width = Math.max(1, Math.round(window.innerWidth * scale))
      canvas.height = Math.max(1, Math.round(window.innerHeight * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const render = (now: number) => {
      if (!isVisible || document.hidden) {
        raf = 0
        return
      }
      raf = requestAnimationFrame(render)
      if (now - lastFrame < 48) return
      lastFrame = now
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(resolution, canvas.width, canvas.height)
      gl.uniform1f(time, now / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    const resume = () => {
      isVisible = true
      if (!raf) raf = requestAnimationFrame(render)
    }
    const pause = () => {
      isVisible = false
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }
    const visibilityObserver = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => entry.isIntersecting ? resume() : pause(), { rootMargin: '20% 0px' })
      : null
    visibilityObserver?.observe(canvas)
    const onVisibilityChange = () => {
      if (document.hidden) pause()
      else resume()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      visibilityObserver?.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [])

  return <canvas ref={canvasRef} className="ambient-noise" aria-hidden="true" />
}
