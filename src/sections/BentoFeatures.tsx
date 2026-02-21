import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// Abstract SVG illustrations for each card
const AuditIllustration = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full" fill="none">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#333333" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#555555" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    {/* Orbital tracks */}
    <circle
      cx="100"
      cy="80"
      r="70"
      stroke="url(#grad1)"
      strokeWidth="1.5"
      fill="none"
    />
    <circle
      cx="100"
      cy="80"
      r="55"
      stroke="#333333"
      strokeWidth="1.5"
      fill="none"
      opacity="0.65"
    />
    <circle
      cx="100"
      cy="80"
      r="40"
      stroke="#333333"
      strokeWidth="1.5"
      fill="none"
      opacity="0.7"
    />
    <circle
      cx="100"
      cy="80"
      r="25"
      stroke="#1a1a1a"
      strokeWidth="2"
      fill="none"
      opacity="0.8"
    />
    {/* Center */}
    <circle cx="100" cy="80" r="10" fill="#1a1a1a" opacity="0.7" />
    {/* Orbiting planets — one per ring, different speeds & directions */}
    <g>
      <circle cx="170" cy="80" r="4.5" fill="#1a1a1a" opacity="0.9" />
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 100 80"
        to="360 100 80"
        dur="8s"
        repeatCount="indefinite"
      />
    </g>
    <g>
      <circle cx="155" cy="80" r="4" fill="#333333" opacity="0.85" />
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="90 100 80"
        to="-270 100 80"
        dur="6s"
        repeatCount="indefinite"
      />
    </g>
    <g>
      <circle cx="140" cy="80" r="3.5" fill="#1a1a1a" opacity="0.9" />
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="180 100 80"
        to="540 100 80"
        dur="4s"
        repeatCount="indefinite"
      />
    </g>
    <g>
      <circle cx="125" cy="80" r="3" fill="#555555" opacity="0.9" />
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="270 100 80"
        to="-90 100 80"
        dur="2.5s"
        repeatCount="indefinite"
      />
    </g>
  </svg>
);

const NODES = [
  {
    x: 40,
    y: 50,
    r: 8,
    fx: 0.3,
    fy: 0.25,
    ax: 6,
    ay: 5,
    fill: "#1a1a1a",
    op: 0.9,
  },
  {
    x: 100,
    y: 40,
    r: 10,
    fx: 0.25,
    fy: 0.32,
    ax: 5,
    ay: 6,
    fill: "#1a1a1a",
    op: 0.9,
  },
  {
    x: 160,
    y: 55,
    r: 7,
    fx: 0.35,
    fy: 0.28,
    ax: 5,
    ay: 5,
    fill: "#333333",
    op: 0.85,
  },
  {
    x: 60,
    y: 100,
    r: 9,
    fx: 0.22,
    fy: 0.3,
    ax: 5,
    ay: 5,
    fill: "#333333",
    op: 0.85,
  },
  {
    x: 140,
    y: 95,
    r: 8,
    fx: 0.28,
    fy: 0.35,
    ax: 5,
    ay: 5,
    fill: "#333333",
    op: 0.85,
  },
  {
    x: 100,
    y: 130,
    r: 11,
    fx: 0.32,
    fy: 0.25,
    ax: 5,
    ay: 5,
    fill: "#555555",
    op: 0.8,
  },
];

const EDGES = [
  { from: 0, to: 1, stroke: "#333333", op: 0.5 },
  { from: 1, to: 2, stroke: "#333333", op: 0.5 },
  { from: 0, to: 3, stroke: "#444444", op: 0.45 },
  { from: 3, to: 4, stroke: "#444444", op: 0.45 },
  { from: 4, to: 5, stroke: "#555555", op: 0.4 },
  { from: 5, to: 3, stroke: "#555555", op: 0.4 },
  { from: 1, to: 5, stroke: "#333333", op: 0.35, dashed: true },
];

function BuildIllustration() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let id: number;
    const tick = (t: number) => {
      const s = t / 1000;
      const svg = svgRef.current;
      if (!svg) {
        id = requestAnimationFrame(tick);
        return;
      }

      const pos = NODES.map((n) => ({
        x: n.x + Math.sin(s * n.fx * Math.PI * 2) * n.ax,
        y: n.y + Math.sin(s * n.fy * Math.PI * 2) * n.ay,
      }));

      svg.querySelectorAll<SVGCircleElement>(".bnode").forEach((el, i) => {
        el.setAttribute("cx", String(pos[i].x));
        el.setAttribute("cy", String(pos[i].y));
      });

      svg.querySelectorAll<SVGPathElement>(".bedge").forEach((el, i) => {
        const a = pos[EDGES[i].from];
        const b = pos[EDGES[i].to];
        el.setAttribute("d", `M${a.x} ${a.y} L${b.x} ${b.y}`);
      });

      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 160"
      className="w-full h-full"
      fill="none"
    >
      {EDGES.map((e, i) => (
        <path
          key={i}
          className="bedge"
          stroke={e.stroke}
          strokeWidth="1.5"
          opacity={e.op}
          strokeLinecap="round"
          strokeDasharray={e.dashed ? "4 4" : undefined}
        />
      ))}
      {NODES.map((n, i) => (
        <circle
          key={i}
          className="bnode"
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill={n.fill}
          opacity={n.op}
        />
      ))}
    </svg>
  );
}

const TransferIllustration = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full" fill="none">
    {/* Waving paths — all synced to same duration, explicit Q curves */}
    <path
      stroke="#1a1a1a"
      strokeWidth="2.5"
      fill="none"
      opacity="0.7"
      strokeLinecap="round"
    >
      <animate
        attributeName="d"
        values="M20 80 Q60 55,100 80 Q140 105,180 80;M20 80 Q60 105,100 80 Q140 55,180 80;M20 80 Q60 55,100 80 Q140 105,180 80"
        dur="3s"
        repeatCount="indefinite"
      />
    </path>
    <path
      stroke="#333333"
      strokeWidth="2"
      fill="none"
      opacity="0.6"
      strokeLinecap="round"
    >
      <animate
        attributeName="d"
        values="M20 100 Q60 75,100 100 Q140 125,180 100;M20 100 Q60 125,100 100 Q140 75,180 100;M20 100 Q60 75,100 100 Q140 125,180 100"
        dur="3s"
        repeatCount="indefinite"
      />
    </path>
    <path
      stroke="#555555"
      strokeWidth="2"
      fill="none"
      opacity="0.55"
      strokeLinecap="round"
    >
      <animate
        attributeName="d"
        values="M20 60 Q60 35,100 60 Q140 85,180 60;M20 60 Q60 85,100 60 Q140 35,180 60;M20 60 Q60 35,100 60 Q140 85,180 60"
        dur="3s"
        repeatCount="indefinite"
      />
    </path>
    {/* Arrows — static since wave endpoints are fixed */}
    <polygon points="175,75 185,80 175,85" fill="#1a1a1a" opacity="0.7" />
    <polygon points="175,95 185,100 175,105" fill="#333333" opacity="0.6" />
    <polygon points="175,55 185,60 175,65" fill="#555555" opacity="0.55" />
  </svg>
);

interface CardProps {
  title: string;
  description: string;
  illustration: React.ReactNode;
  delay: number;
  isVisible: boolean;
}

function Card({
  title,
  description,
  illustration,
  delay,
  isVisible,
}: CardProps) {
  return (
    <div
      className="group relative bg-white rounded-2xl border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0.96)",
        transition: `opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
      }}
    >
      <div className="h-32 mb-6 flex items-center justify-center">
        {illustration}
      </div>
      <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">{title}</h3>
      <p className="text-sm text-[#666666] leading-relaxed">{description}</p>
    </div>
  );
}

export default function BentoFeatures() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[#ededed]"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 max-w-lg">
          <h2
            className={`text-3xl lg:text-4xl font-normal tracking-[-0.01em] text-[#1a1a1a] mb-4 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {t("services.title")}
          </h2>
          <p
            className={`text-[#666666] leading-relaxed transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            {t("services.subtitle")}
          </p>
        </div>

        {/* Equal Grid — 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title={t("services.audit.title")}
            description={t("services.audit.description")}
            illustration={<AuditIllustration />}
            delay={0}
            isVisible={isVisible}
          />
          <Card
            title={t("services.build.title")}
            description={t("services.build.description")}
            illustration={<BuildIllustration />}
            delay={100}
            isVisible={isVisible}
          />
          <Card
            title={t("services.transfer.title")}
            description={t("services.transfer.description")}
            illustration={<TransferIllustration />}
            delay={200}
            isVisible={isVisible}
          />
        </div>
      </div>
    </section>
  );
}
