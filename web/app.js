/* [shared] NeoTodo web UI: Linux-first, synced to Android and reused by
   the Windows Qt shell. Keep platform-specific shells out of this file. */
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const THEMES = {
  // The two plain bases every app ships: a neutral light page and a neutral
  // dark page. Their ruled lines are explicit so dark stays deep and light
  // keeps its bright white rules.
  light: {
    name: "Light", motif: "☼", airmail: false,
    paper: "#ededf0", paper2: "#e3e3e8", ink: "#1e1f23", muted: "#6b6f78",
    accent: "#3f7cff", accent2: "#7c5cff", border: "#d6d7dd", stamp: "#2f6bdb",
    line: "#ffffff", rule: "#ffffff", lineAlpha: 0.7, ruleAlpha: 0.5,
    glow: "rgba(63,124,255,.18)",
    display: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: "A clean page for the next thing.",
    art(p) { return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
      <rect width="1000" height="300" fill="${p.paper}"/>
      <rect y="196" width="1000" height="104" fill="${p.paper2}"/>
      <circle cx="778" cy="74" r="38" fill="${p.accent}" opacity=".9"/>
      <circle cx="778" cy="74" r="56" fill="none" stroke="${p.accent}" stroke-width="1" opacity=".28"/>
      <g stroke="${p.line}" stroke-width="2" opacity=".9">
        <path d="M0 220 H1000"/><path d="M0 250 H1000"/><path d="M0 280 H1000"/>
      </g>
      <g stroke="${p.ink}" stroke-width="7" stroke-linecap="round" opacity=".24">
        <path d="M70 92 H300"/><path d="M70 122 H246"/><path d="M70 152 H276"/>
      </g>
      <path d="M0 196 H1000" stroke="${p.border}" stroke-width="1.5"/>
    </svg>`; }
  },
  dark: {
    name: "Dark", motif: "☾", airmail: false,
    paper: "#151517", paper2: "#1d1d21", ink: "#f1f1f5", muted: "#9b9ba5",
    accent: "#6ea8ff", accent2: "#a78bfa", border: "#2b2b31", stamp: "#6ea8ff",
    line: "#000000", rule: "#000000", lineAlpha: 0.82, ruleAlpha: 0.62,
    glow: "rgba(110,168,255,.22)",
    display: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: "Quiet contrast, clear focus.",
    art(p) { return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
      <rect width="1000" height="300" fill="${p.paper}"/>
      <rect y="196" width="1000" height="104" fill="${p.paper2}"/>
      <circle cx="778" cy="74" r="38" fill="${p.accent}" opacity=".9"/>
      <circle cx="778" cy="74" r="56" fill="none" stroke="${p.accent}" stroke-width="1" opacity=".24"/>
      <g stroke="${p.line}" stroke-width="2" opacity=".9">
        <path d="M0 220 H1000"/><path d="M0 250 H1000"/><path d="M0 280 H1000"/>
      </g>
      <g stroke="${p.ink}" stroke-width="7" stroke-linecap="round" opacity=".22">
        <path d="M70 92 H300"/><path d="M70 122 H246"/><path d="M70 152 H276"/>
      </g>
      <path d="M0 196 H1000" stroke="${p.border}" stroke-width="1.5"/>
    </svg>`; }
  },
  alpine: {
    name: "Alpine Dawn", motif: "⛰", airmail: true,
    paper: "#f7efe3", paper2: "#ecdfcd", ink: "#332b2d", muted: "#88786a",
    accent: "#c56f4a", accent2: "#5f7f8b", border: "#d8c3a9", stamp: "#b0563f",
    glow: "rgba(197,111,74,.19)",
    display: '"Noto Serif","Liberation Serif",Georgia,serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: "The view is worth the climb.",
    art(p) { return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="sky-a" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${p.accent2}"/><stop offset=".55" stop-color="#d9cbbb"/><stop offset="1" stop-color="${p.paper2}"/></linearGradient></defs>
      <rect width="1000" height="300" fill="url(#sky-a)"/>
      <circle cx="775" cy="76" r="36" fill="${p.accent}" opacity=".92"/>
      <circle cx="775" cy="76" r="52" fill="none" stroke="${p.accent}" stroke-width="1" opacity=".28"/>
      <path d="M0 257 L128 170 L244 232 L390 108 L520 233 L672 150 L826 242 L936 188 L1000 236 L1000 300 L0 300Z" fill="${p.ink}" opacity=".16"/>
      <path d="M390 108 L368 146 L414 146 Z" fill="#fff" opacity=".88"/>
      <path d="M672 150 L652 181 L694 181 Z" fill="#fff" opacity=".72"/>
      <path d="M0 281 L178 210 L322 272 L486 172 L624 266 L764 202 L902 268 L1000 238 L1000 300 L0 300Z" fill="${p.accent2}" opacity=".88"/>
      <path d="M0 300 L0 271 L224 247 L432 292 L648 256 L842 286 L1000 266 L1000 300Z" fill="${p.ink}" opacity=".9"/>
      <path d="M160 64 q10 -7 20 0 q10 -7 20 0" fill="none" stroke="${p.ink}" stroke-width="1.2" opacity=".35"/>
      <path d="M210 84 q8 -6 16 0 q8 -6 16 0" fill="none" stroke="${p.ink}" stroke-width="1" opacity=".25"/>
    </svg>`; }
  },
  ocean: {
    name: "Ocean Post", motif: "≋", airmail: false,
    paper: "#eef5f6", paper2: "#dfecef", ink: "#143b4f", muted: "#6d8790",
    accent: "#2f7d97", accent2: "#6ba9b8", border: "#b9d4db", stamp: "#2f7d97",
    glow: "rgba(47,125,151,.17)",
    display: '"Noto Serif","Liberation Serif",Georgia,serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: "Some weeks are best measured in waves.",
    art(p) { return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="sky-o" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#bfe0e5"/><stop offset=".62" stop-color="${p.paper2}"/><stop offset="1" stop-color="${p.accent2}"/></linearGradient></defs>
      <rect width="1000" height="300" fill="url(#sky-o)"/>
      <circle cx="250" cy="90" r="42" fill="#fff" opacity=".55"/>
      <circle cx="250" cy="90" r="58" fill="none" stroke="#fff" stroke-width="1" opacity=".25"/>
      <path d="M0 198 C120 166 230 232 350 200 C470 168 580 232 700 200 C820 168 920 228 1000 198 L1000 300 L0 300Z" fill="${p.accent2}" opacity=".7"/>
      <path d="M0 229 C140 196 240 258 380 226 C520 194 620 260 760 226 C880 198 950 250 1000 230 L1000 300 L0 300Z" fill="${p.accent}" opacity=".78"/>
      <path d="M0 268 C130 242 250 290 390 264 C530 238 650 292 790 264 C900 242 960 278 1000 264 L1000 300 L0 300Z" fill="${p.ink}" opacity=".52"/>
      <path d="M330 170 q24 -13 48 0 M620 178 q22 -12 44 0 M815 160 q18 -10 36 0" fill="none" stroke="#fff" stroke-width="2.4" opacity=".5" stroke-linecap="round"/>
    </svg>`; }
  },
  tokyo: {
    name: "Tokyo Night", motif: "⛩", airmail: false,
    paper: "#17131f", paper2: "#231a2f", ink: "#f8e9f5", muted: "#a99ab6",
    accent: "#ff5f92", accent2: "#8b7bff", border: "#443650", stamp: "#ff9f68",
    glow: "rgba(255,95,146,.22)",
    display: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: "Neon nights and quiet victories.",
    art(p) { return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="sky-t" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#0d0b18"/><stop offset=".6" stop-color="#251a3a"/><stop offset="1" stop-color="#3b2346"/></linearGradient></defs>
      <rect width="1000" height="300" fill="url(#sky-t)"/>
      <circle cx="790" cy="76" r="45" fill="#ffe8d0" opacity=".88"/>
      <circle cx="790" cy="76" r="62" fill="none" stroke="#ffe8d0" stroke-width="1" opacity=".18"/>
      <g fill="#0d0b18" opacity=".92">
        <rect x="40" y="160" width="90" height="140"/><rect x="150" y="120" width="70" height="180"/>
        <rect x="240" y="178" width="110" height="122"/><rect x="370" y="95" width="80" height="205"/>
        <rect x="470" y="145" width="120" height="155"/><rect x="610" y="112" width="90" height="188"/>
        <rect x="720" y="170" width="130" height="130"/><rect x="870" y="135" width="90" height="165"/>
      </g>
      <g fill="${p.accent}" opacity=".9">
        <rect x="58" y="182" width="7" height="10"/><rect x="76" y="182" width="7" height="10"/><rect x="94" y="182" width="7" height="10"/>
        <rect x="58" y="205" width="7" height="10"/><rect x="94" y="205" width="7" height="10"/>
        <rect x="166" y="142" width="7" height="9"/><rect x="184" y="142" width="7" height="9"/><rect x="166" y="165" width="7" height="9"/>
        <rect x="390" y="120" width="8" height="11"/><rect x="410" y="120" width="8" height="11"/><rect x="410" y="145" width="8" height="11"/>
        <rect x="636" y="138" width="8" height="10"/><rect x="654" y="138" width="8" height="10"/><rect x="636" y="160" width="8" height="10"/>
        <rect x="892" y="158" width="7" height="9"/><rect x="910" y="158" width="7" height="9"/>
      </g>
      <g fill="${p.accent2}" opacity=".85">
        <rect x="256" y="200" width="7" height="9"/><rect x="274" y="200" width="7" height="9"/><rect x="292" y="200" width="7" height="9"/>
        <rect x="486" y="168" width="8" height="10"/><rect x="508" y="168" width="8" height="10"/><rect x="530" y="168" width="8" height="10"/>
        <rect x="740" y="192" width="7" height="9"/><rect x="758" y="192" width="7" height="9"/>
      </g>
      <path d="M0 296 L1000 296" stroke="${p.accent}" stroke-width="1" opacity=".5"/>
    </svg>`; }
  },
  desert: {
    name: "Desert Sun", motif: "☀", airmail: false,
    paper: "#f6e7cf", paper2: "#eed6b3", ink: "#4a3525", muted: "#92785f",
    accent: "#c9773a", accent2: "#a3a15c", border: "#d9bd92", stamp: "#b35e2e",
    glow: "rgba(201,119,58,.19)",
    display: '"Noto Serif","Liberation Serif",Georgia,serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: "Cross the quiet dunes, one step at a time.",
    art(p) { return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="sky-d" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#efb86f"/><stop offset=".55" stop-color="#f4d3a1"/><stop offset="1" stop-color="${p.paper2}"/></linearGradient></defs>
      <rect width="1000" height="300" fill="url(#sky-d)"/>
      <circle cx="700" cy="92" r="48" fill="${p.accent}" opacity=".92"/>
      <circle cx="700" cy="92" r="67" fill="none" stroke="${p.accent}" stroke-width="1" opacity=".3"/>
      <path d="M0 200 C170 150 300 230 470 195 C640 160 760 225 1000 182 L1000 300 L0 300Z" fill="${p.accent}" opacity=".55"/>
      <path d="M0 232 C190 185 340 262 520 225 C700 188 840 258 1000 218 L1000 300 L0 300Z" fill="${p.accent2}" opacity=".82"/>
      <path d="M0 274 C200 236 380 296 580 264 C760 236 880 284 1000 258 L1000 300 L0 300Z" fill="${p.ink}" opacity=".72"/>
      <path d="M160 246 v-48 m0 20 h14 m-14 11 h10" stroke="${p.ink}" stroke-width="2" opacity=".6" fill="none"/>
      <path d="M174 218 h16 m0 0 v28" stroke="${p.ink}" stroke-width="2" opacity=".6" fill="none"/>
    </svg>`; }
  },
  forest: {
    name: "Forest Walk", motif: "♣", airmail: false,
    paper: "#eef1e6", paper2: "#e2e8d6", ink: "#26352b", muted: "#6f806e",
    accent: "#4d7a54", accent2: "#8da26b", border: "#c2d0b4", stamp: "#4d7a54",
    glow: "rgba(77,122,84,.17)",
    display: '"Noto Serif","Liberation Serif",Georgia,serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: "Grow slowly. Grow surely.",
    art(p) { return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="sky-f" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#cbd8c4"/><stop offset=".6" stop-color="${p.paper2}"/><stop offset="1" stop-color="#b9c6ad"/></linearGradient></defs>
      <rect width="1000" height="300" fill="url(#sky-f)"/>
      <g opacity=".3" fill="${p.accent2}">
        <path d="M120 145 L170 235 L70 235Z"/><path d="M230 120 L290 235 L170 235Z"/><path d="M360 155 L410 235 L310 235Z"/>
        <path d="M700 125 L770 235 L630 235Z"/><path d="M820 155 L870 235 L770 235Z"/>
      </g>
      <g fill="${p.accent}" opacity=".8">
        <path d="M80 180 L140 285 L20 285Z"/><path d="M205 160 L275 285 L135 285Z"/><path d="M320 190 L380 285 L260 285Z"/>
        <path d="M640 150 L720 285 L560 285Z"/><path d="M760 185 L820 285 L700 285Z"/><path d="M880 165 L950 285 L810 285Z"/>
      </g>
      <g stroke="${p.ink}" stroke-width="4" opacity=".7">
        <path d="M80 285 v-20"/><path d="M205 285 v-24"/><path d="M320 285 v-16"/><path d="M640 285 v-26"/><path d="M880 285 v-20"/>
      </g>
      <path d="M0 285 C180 270 330 292 500 280 C680 268 830 292 1000 278 L1000 300 L0 300Z" fill="${p.ink}" opacity=".82"/>
    </svg>`; }
  },
  aurora: {
    name: "Northern Lights", motif: "✦", airmail: false,
    paper: "#0f1d23", paper2: "#152731", ink: "#eafcf9", muted: "#8fb8b5",
    accent: "#62e6c8", accent2: "#a48bff", border: "#29434a", stamp: "#62e6c8",
    glow: "rgba(98,230,200,.2)",
    display: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: "The sky dances when you look up.",
    art(p) { return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-au" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#071218"/><stop offset=".65" stop-color="#102630"/><stop offset="1" stop-color="#19302f"/></linearGradient>
        <linearGradient id="ribbon-a" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${p.accent}" stop-opacity="0"/><stop offset=".35" stop-color="${p.accent}" stop-opacity=".8"/><stop offset=".7" stop-color="${p.accent2}" stop-opacity=".65"/><stop offset="1" stop-color="${p.accent2}" stop-opacity="0"/></linearGradient>
        <linearGradient id="ribbon-b" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${p.accent2}" stop-opacity="0"/><stop offset=".45" stop-color="${p.accent2}" stop-opacity=".65"/><stop offset="1" stop-color="${p.accent}" stop-opacity="0"/></linearGradient>
      </defs>
      <rect width="1000" height="300" fill="url(#sky-au)"/>
      <path d="M-50 150 C160 55 300 185 500 95 C700 5 830 145 1050 40" fill="none" stroke="url(#ribbon-a)" stroke-width="48" opacity=".55"/>
      <path d="M-50 205 C180 110 320 225 540 135 C740 55 850 190 1050 100" fill="none" stroke="url(#ribbon-b)" stroke-width="26" opacity=".45"/>
      <path d="M-50 115 C150 60 330 155 520 80 C720 0 830 110 1050 60" fill="none" stroke="#bffff2" stroke-width="1.2" opacity=".25"/>
      <g fill="#fff">
        <circle cx="120" cy="62" r="1.8"/><circle cx="260" cy="38" r="1.3"/><circle cx="430" cy="80" r="1.6"/><circle cx="610" cy="52" r="1.2"/><circle cx="760" cy="88" r="1.8"/><circle cx="900" cy="44" r="1.4"/>
      </g>
      <path d="M0 276 L120 248 L230 280 L360 242 L520 282 L690 246 L830 278 L1000 250 L1000 300 L0 300Z" fill="#071015" opacity=".92"/>
    </svg>`; }
  },
  vintage: {
    name: "Vintage Rose", motif: "❀", airmail: true,
    paper: "#f4e7d7", paper2: "#ead5bd", ink: "#49312b", muted: "#947566",
    accent: "#b25e72", accent2: "#7f8d61", border: "#d9bea4", stamp: "#a44e64",
    glow: "rgba(178,94,114,.17)",
    display: '"Noto Serif","Liberation Serif",Georgia,serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: "A small keepsake from the week that was.",
    art(p) { return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
      <rect width="1000" height="300" fill="${p.paper}"/>
      <g stroke="${p.accent2}" fill="none" stroke-width="2" opacity=".65">
        <path d="M95 290 C140 220 160 155 230 90"/><path d="M190 290 C230 225 255 180 300 145"/>
        <path d="M905 290 C860 220 840 155 770 90"/><path d="M810 290 C770 225 745 180 700 145"/>
      </g>
      <g fill="${p.accent2}" opacity=".55">
        <ellipse cx="170" cy="205" rx="26" ry="10" transform="rotate(-38 170 205)"/>
        <ellipse cx="205" cy="160" rx="24" ry="9" transform="rotate(32 205 160)"/>
        <ellipse cx="250" cy="210" rx="24" ry="9" transform="rotate(-30 250 210)"/>
        <ellipse cx="830" cy="205" rx="26" ry="10" transform="rotate(38 830 205)"/>
        <ellipse cx="795" cy="160" rx="24" ry="9" transform="rotate(-32 795 160)"/>
        <ellipse cx="750" cy="210" rx="24" ry="9" transform="rotate(30 750 210)"/>
      </g>
      <g fill="${p.accent}" opacity=".82">
        <ellipse cx="500" cy="96" rx="20" ry="34"/>
        <ellipse cx="541" cy="122" rx="34" ry="20" transform="rotate(34 541 122)"/>
        <ellipse cx="532" cy="172" rx="34" ry="19" transform="rotate(-38 532 172)"/>
        <ellipse cx="468" cy="172" rx="34" ry="19" transform="rotate(38 468 172)"/>
        <ellipse cx="459" cy="122" rx="34" ry="20" transform="rotate(-34 459 122)"/>
      </g>
      <circle cx="500" cy="142" r="24" fill="${p.paper}" opacity=".88"/>
      <circle cx="500" cy="142" r="14" fill="${p.accent}"/>
      <circle cx="500" cy="142" r="6" fill="${p.paper}" opacity=".7"/>
      <path d="M388 260 H612 M388 272 H612" stroke="${p.border}" stroke-width="1"/>
      <circle cx="500" cy="266" r="2.4" fill="${p.accent2}"/>
    </svg>`; }
  },
  space: {
    name: "Deep Space", motif: "✧", airmail: false,
    paper: "#0d1322", paper2: "#141c33", ink: "#e6edff", muted: "#8b96b8",
    accent: "#8db8ff", accent2: "#c7a4ff", border: "#2a3554", stamp: "#8db8ff",
    glow: "rgba(141,184,255,.21)",
    display: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: "One small week for you, one giant leap for your list.",
    art(p) { return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-sp" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#070c18"/><stop offset="1" stop-color="#182143"/></linearGradient>
        <radialGradient id="planet-sp" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="#cfe1ff"/><stop offset=".55" stop-color="${p.accent}"/><stop offset="1" stop-color="#43578c"/></radialGradient>
      </defs>
      <rect width="1000" height="300" fill="url(#sky-sp)"/>
      <g fill="#fff">
        <circle cx="90" cy="52" r="1.8"/><circle cx="210" cy="106" r="1.2"/><circle cx="340" cy="42" r="1.5"/><circle cx="480" cy="92" r="1.1"/><circle cx="610" cy="35" r="1.6"/><circle cx="700" cy="112" r="1.2"/><circle cx="860" cy="54" r="1.7"/><circle cx="930" cy="130" r="1.3"/><circle cx="160" cy="188" r="1.2"/><circle cx="550" cy="178" r="1.4"/>
      </g>
      <circle cx="690" cy="142" r="74" fill="url(#planet-sp)"/>
      <ellipse cx="690" cy="148" rx="132" ry="25" fill="none" stroke="${p.accent2}" stroke-width="4" opacity=".55" transform="rotate(-13 690 148)"/>
      <circle cx="290" cy="118" r="22" fill="${p.accent2}" opacity=".8"/>
      <circle cx="290" cy="118" r="31" fill="none" stroke="${p.accent2}" stroke-width="1" opacity=".3"/>
      <path d="M0 284 C220 262 410 292 590 276 C760 262 880 286 1000 270 L1000 300 L0 300Z" fill="#050812" opacity=".8"/>
    </svg>`; }
  },
  rain: {
    name: "Rainy Window", motif: "☂", airmail: false,
    paper: "#e8eef4", paper2: "#d9e3ec", ink: "#293745", muted: "#71818f",
    accent: "#4a6f95", accent2: "#7f9bb5", border: "#bccbd8", stamp: "#4a6f95",
    glow: "rgba(74,111,149,.17)",
    display: '"Noto Serif","Liberation Serif",Georgia,serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: "Rain makes the quiet moments louder.",
    art(p) { return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="sky-r" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#c7d6e2"/><stop offset=".55" stop-color="#dce6ee"/><stop offset="1" stop-color="${p.paper2}"/></linearGradient></defs>
      <rect width="1000" height="300" fill="url(#sky-r)"/>
      <g opacity=".22" fill="${p.ink}">
        <rect x="80" y="150" width="90" height="150"/><rect x="190" y="120" width="70" height="180"/><rect x="280" y="165" width="120" height="135"/>
        <rect x="600" y="145" width="90" height="155"/><rect x="710" y="112" width="80" height="188"/><rect x="810" y="158" width="120" height="142"/>
      </g>
      <g stroke="#fff" stroke-width="1.4" opacity=".55">
        <path d="M80 40 l-15 55 M150 20 l-16 60 M230 55 l-14 52 M310 25 l-16 62 M390 60 l-13 48 M470 18 l-17 66 M550 48 l-14 56 M640 24 l-16 60 M720 60 l-13 50 M810 30 l-15 58 M900 52 l-14 54"/>
        <path d="M110 120 l-12 44 M270 112 l-12 44 M430 120 l-12 44 M590 108 l-12 44 M750 118 l-12 44 M910 112 l-12 44"/>
      </g>
      <path d="M40 28 H960 V286 H40Z" fill="none" stroke="${p.ink}" stroke-width="12" opacity=".35"/>
      <path d="M500 28 V286 M40 155 H960" stroke="${p.ink}" stroke-width="10" opacity=".28"/>
      <path d="M70 255 C220 240 320 268 470 254 C620 240 740 264 930 248 L930 286 L70 286Z" fill="${p.accent}" opacity=".18"/>
      <g fill="#fff" opacity=".6">
        <circle cx="122" cy="176" r="3"/><circle cx="382" cy="204" r="2.4"/><circle cx="662" cy="184" r="2.8"/><circle cx="842" cy="218" r="2.3"/>
      </g>
    </svg>`; }
  },
  field: {
    name: "Golden Field", motif: "✾", airmail: false,
    paper: "#f6edcc", paper2: "#ead9a8", ink: "#4a3a1d", muted: "#8b7a4f",
    accent: "#bf9827", accent2: "#7f9140", border: "#d8c28a", stamp: "#b58a1f",
    glow: "rgba(191,152,39,.19)",
    display: '"Noto Serif","Liberation Serif",Georgia,serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: "Harvest the little wins.",
    art(p) { return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="sky-fi" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e9c96e"/><stop offset=".6" stop-color="#f3dda0"/><stop offset="1" stop-color="${p.paper2}"/></linearGradient></defs>
      <rect width="1000" height="300" fill="url(#sky-fi)"/>
      <circle cx="740" cy="90" r="44" fill="${p.accent}" opacity=".9"/>
      <circle cx="740" cy="90" r="62" fill="none" stroke="${p.accent}" stroke-width="1" opacity=".28"/>
      <path d="M0 218 C160 182 300 238 460 208 C640 174 780 242 1000 206 L1000 300 L0 300Z" fill="${p.accent2}" opacity=".6"/>
      <path d="M0 252 C190 218 340 272 520 240 C700 208 840 266 1000 234 L1000 300 L0 300Z" fill="${p.ink}" opacity=".42"/>
      <g stroke="${p.ink}" stroke-width="2" opacity=".5">
        <path d="M120 290 C124 255 118 230 126 205 M126 225 l-16 -10 M126 236 l16 -9 M126 250 l-15 -9"/>
        <path d="M240 294 C244 262 238 240 246 216 M246 236 l-16 -9 M246 248 l15 -8"/>
        <path d="M820 292 C824 258 818 232 826 208 M826 226 l-16 -9 M826 240 l16 -8"/>
        <path d="M910 296 C914 264 908 240 916 218 M916 236 l-16 -8 M916 250 l15 -8"/>
      </g>
      <path d="M0 300 C180 286 340 298 520 290 C700 282 850 298 1000 288 L1000 300Z" fill="${p.ink}" opacity=".6"/>
    </svg>`; }
  },
  deco: {
    name: "Art Deco", motif: "◆", airmail: false,
    paper: "#17141b", paper2: "#231d2a", ink: "#f5e6b8", muted: "#b3a078",
    accent: "#d8b25e", accent2: "#9c7c3b", border: "#4d3f2a", stamp: "#d8b25e",
    glow: "rgba(216,178,94,.19)",
    display: '"Noto Serif","Liberation Serif",Georgia,serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: "Elegance is a week well lived.",
    art(p) { return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
      <rect width="1000" height="300" fill="#141118"/>
      <g fill="none" stroke="${p.accent}" opacity=".75">
        <path d="M60 260 L60 70 L120 130 L120 260" stroke-width="1.4"/>
        <path d="M940 260 L940 70 L880 130 L880 260" stroke-width="1.4"/>
        <path d="M150 260 C150 170 250 130 330 130 C410 130 510 170 510 260" stroke-width="1.2"/>
        <path d="M490 260 C490 170 590 130 670 130 C750 130 850 170 850 260" stroke-width="1.2"/>
        <path d="M250 260 L250 190 L290 230 L290 260" stroke-width="1"/>
        <path d="M750 260 L750 190 L710 230 L710 260" stroke-width="1"/>
      </g>
      <g fill="${p.accent}" opacity=".16">
        <path d="M330 130 L390 50 L450 130Z"/><path d="M550 130 L610 50 L670 130Z"/>
        <circle cx="500" cy="86" r="18"/>
      </g>
      <g stroke="${p.accent2}" opacity=".55">
        <path d="M0 284 H1000 M0 292 H1000" stroke-width="1"/>
        <path d="M420 284 L500 230 L580 284" fill="none" stroke-width="1.2"/>
      </g>
      <path d="M500 178 l22 22 -22 22 -22 -22Z" fill="none" stroke="${p.accent}" stroke-width="1.4"/>
      <circle cx="500" cy="200" r="5" fill="${p.accent}"/>
    </svg>`; }
  },
  bauhaus: {
    name: "Bauhaus", motif: "●", airmail: false,
    paper: "#f2efe7", paper2: "#e8e3d7", ink: "#1d1c1b", muted: "#7a756c",
    accent: "#d94343", accent2: "#2c62b8", border: "#cfc7b7", stamp: "#d94343",
    glow: "rgba(217,67,67,.13)",
    display: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: "Form follows finish.",
    art(p) { return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
      <rect width="1000" height="300" fill="${p.paper}"/>
      <circle cx="240" cy="150" r="92" fill="${p.accent}"/>
      <path d="M430 240 L540 60 L650 240Z" fill="${p.accent2}"/>
      <rect x="710" y="70" width="150" height="150" fill="#e8c44c"/>
      <rect x="760" y="130" width="100" height="100" fill="${p.ink}"/>
      <path d="M70 260 H930" stroke="${p.ink}" stroke-width="8"/>
      <circle cx="820" cy="82" r="18" fill="${p.paper}" stroke="${p.ink}" stroke-width="4"/>
      <rect x="110" y="52" width="48" height="48" fill="${p.ink}"/>
      <path d="M588 190 l42 -42 42 42 -42 42Z" fill="${p.paper}" stroke="${p.ink}" stroke-width="3"/>
    </svg>`; }
  }
};

const GENERATED_PALETTES = [
  ["emerald", "Emerald", "#e9f3ee", "#d6e9df", "#d1e9de", "#7dbba1", "#e5cf7b", "#2f6f55", "#4d8e70", "#1d4a37"],
].map(([id, name, paper, paper2, sky1, sky2, sun, hill1, hill2, field]) => ({ id, name, paper, paper2, sky1, sky2, sun, hill1, hill2, field }));

const GENERATED_QUOTES = [
  "A small card from the week.", "Keep the quiet things close.",
  "Every week leaves a little color behind.", "The view is worth the climb.",
  "Some weeks are best measured in waves.", "Grow slowly. Grow surely.",
  "One small step, one bright edge.", "A keepsake from ordinary days.",
  "The light changes; the list goes on.", "Made slowly, kept carefully.",
];
const GENERATED_MOTIFS = ["✦", "❀", "☾", "▲", "≋", "✿", "❧", "☀"];
const GENERATED_THEMES = {};
GENERATED_PALETTES.forEach((palette, index) => {
  const dark = hexLuminance(palette.paper) < 0.45;
  GENERATED_THEMES[palette.id] = {
    ...palette,
    motif: GENERATED_MOTIFS[index % GENERATED_MOTIFS.length],
    airmail: false,
    ink: dark ? "#f6f0ff" : palette.field,
    muted: dark ? "#b7a8c8" : palette.hill2,
    accent: palette.sun,
    accent2: palette.hill2,
    border: palette.hill2,
    stamp: palette.sun,
    glow: `rgba(${hexToRgb(palette.sun)}, .2)`,
    display: dark ? '"Adwaita Sans","Noto Sans",sans-serif' : '"Noto Serif","Liberation Serif",Georgia,serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: GENERATED_QUOTES[index % GENERATED_QUOTES.length],
    art(p) {
      return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="gsky-${p.id}" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stop-color="${p.sky1}"/>
            <stop offset=".55" stop-color="${p.sky2}"/>
            <stop offset="1" stop-color="${p.paper2}"/>
          </linearGradient>
          <linearGradient id="gfield-${p.id}" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stop-color="${p.hill2}"/>
            <stop offset="1" stop-color="${p.field}"/>
          </linearGradient>
        </defs>
        <rect width="1000" height="300" fill="url(#gsky-${p.id})"/>
        <circle cx="770" cy="82" r="42" fill="${p.sun}" opacity=".9"/>
        <circle cx="770" cy="82" r="62" fill="none" stroke="${p.sun}" stroke-width="1" opacity=".22"/>
        <g fill="#fff" opacity=".55">
          <circle cx="120" cy="56" r="1.4"/><circle cx="250" cy="34" r="1.1"/><circle cx="390" cy="66" r="1.3"/><circle cx="540" cy="42" r="1"/><circle cx="660" cy="76" r="1.4"/><circle cx="900" cy="38" r="1.2"/>
        </g>
        <path d="M0 205 L140 142 L270 202 L420 118 L560 198 L720 140 L860 205 L960 172 L1000 190 L1000 300 L0 300Z" fill="${p.hill1}" opacity=".55"/>
        <path d="M0 236 C160 196 300 244 470 216 C640 188 790 244 1000 204 L1000 300 L0 300Z" fill="url(#gfield-${p.id})" opacity=".95"/>
        <g stroke="${p.sun}" stroke-width="1.8" opacity=".28">
          <path d="M0 272 C160 240 320 278 480 254 C640 230 820 276 1000 244"/>
          <path d="M0 286 C180 258 340 292 520 268 C700 244 840 288 1000 262"/>
        </g>
        <g fill="${p.sun}" opacity=".55">
          <circle cx="120" cy="270" r="2"/><circle cx="250" cy="282" r="1.8"/><circle cx="390" cy="260" r="2.2"/><circle cx="520" cy="276" r="1.9"/><circle cx="650" cy="254" r="2.1"/><circle cx="800" cy="278" r="1.8"/><circle cx="930" cy="258" r="2"/>
        </g>
      </svg>`;
    },
  };
});
Object.assign(THEMES, GENERATED_THEMES);

const MOON = '<svg class="moon-icon" aria-hidden="true"><use href="#headphone"></use></svg>';
const GOLD_MOON = '<svg class="moon-icon gold-moon" aria-hidden="true"><use href="#headphone-gold"></use></svg>';

const PIANO_KEYS = ["A3", "C4", "Ds4", "Fs4", "A4", "C5", "Ds5", "Fs5"];
const pianoAudios = PIANO_KEYS.map((name) => {
  try {
    const audio = new Audio(`/piano/${name}.mp3`);
    audio.preload = "auto";
    audio.volume = 0.55;
    return audio;
  } catch (error) {
    return null;
  }
}).filter(Boolean);

function playPianoKey() {
  if (!pianoAudios.length) return;
  const audio = pianoAudios[Math.floor(Math.random() * pianoAudios.length)];
  try {
    audio.currentTime = 0;
    audio.volume = 0.55;
    audio.play().catch(() => {});
  } catch (error) {}
}

const steamAudio = (() => {
  try {
    const audio = new Audio("/user-sounds/steam-hiss.mp3");
    audio.preload = "auto";
    audio.volume = 0.5;
    return audio;
  } catch (error) {
    return null;
  }
})();

function playSteam() {
  if (!steamAudio) return;
  try {
    steamAudio.currentTime = 0;
    steamAudio.volume = 0.5;
    steamAudio.play().catch(() => {});
  } catch (error) {}
}

const AudioFX = (() => {
  let ctx = null;
  let noise = null;
  let muted = false;
  try { muted = localStorage.getItem("neotodo.muted") === "1"; } catch (error) {}
  let volume = 0.8;
  try {
    const rawVolume = localStorage.getItem("neotodo.volume");
    if (rawVolume !== null) {
      const savedVolume = Number(rawVolume);
      if (Number.isFinite(savedVolume)) volume = Math.max(0, Math.min(1, savedVolume));
    }
    // Recover from the old default bug that could persist a silent 0 before
    // the user ever touched the slider.
    if (localStorage.getItem("neotodo.volumeSet") !== "1" && volume < 0.02) volume = 0.8;
  } catch (error) {}

  // One short-lived gain per sound, created at playback time. A single shared
  // master node could go silent after the AudioContext was resumed; per-sound
  // gains keep the original, known-good routing while applying the volume.
  function masterOutput(c) {
    if (volume >= 0.999) return c.destination;
    const gain = c.createGain();
    gain.gain.value = volume;
    gain.connect(c.destination);
    return gain;
  }

  function setVolume(next) {
    volume = Math.max(0, Math.min(1, Number(next) || 0));
    try {
      localStorage.setItem("neotodo.volume", String(volume));
      localStorage.setItem("neotodo.volumeSet", "1");
    } catch (error) {}
    return volume;
  }

  function getVolume() {
    return volume;
  }
  const AC = window.AudioContext || window.webkitAudioContext;
  const sampleBuffers = {};
  const sampleLoading = {};
  const htmlPools = {};
  const htmlCursor = {};
  // The cue each style folder may provide, and the bundled filename it falls
  // back to. A style only has to include the sounds it wants to replace.
  const SAMPLE_FILES = {
    type: "keyany.wav",
    enter: "keyenter.wav",
    drawerOpen: "drawer-open.mp3",
    drawerClose: "drawer-close.mp3",
    // Gentle flowing-water loop for scrolling (CC0); see sounds/CREDITS.txt.
    waterFlow: "water-flow.wav",
    trickle: "water-trickle.wav",
    windScroll: "wind-scroll.wav",
    train: "train-whistle.mp3",
    paperTear: "paper-tear.wav",
    steamHiss: "steam-hiss.mp3",
  };
  const DEFAULT_SOUND_STYLE = "classical";
  const SAMPLE_URLS = {};
  const DEFAULT_SAMPLE_URLS = {};

  function styleSampleUrls(style, files) {
    const names = Array.isArray(files) ? files.map((name) => String(name || "")) : [];
    const folder = encodeURIComponent(style || DEFAULT_SOUND_STYLE);
    const urls = {};
    for (const [key, fallback] of Object.entries(SAMPLE_FILES)) {
      const stem = fallback.replace(/\.[^.]+$/, "").toLowerCase();
      const match = names.find((name) => name.replace(/\.[^.]+$/, "").toLowerCase() === stem);
      urls[key] = `/user-sounds/${folder}/${encodeURIComponent(match || fallback)}`;
    }
    return urls;
  }

  let baseSampleUrls = styleSampleUrls(DEFAULT_SOUND_STYLE, null);
  let sampleOverrides = {};
  Object.assign(DEFAULT_SAMPLE_URLS, baseSampleUrls);

  // The current style's files sit under the theme-pack overrides: picking a
  // pack may still replace one cue (a train whistle, say) on top of any style.
  function refreshSampleUrls() {
    for (const name of Object.keys(SAMPLE_FILES)) {
      const next = sampleOverrides[name] || baseSampleUrls[name] || DEFAULT_SAMPLE_URLS[name];
      if (SAMPLE_URLS[name] === next) continue;
      SAMPLE_URLS[name] = next;
      delete sampleBuffers[name];
      sampleLoading[name] = null;
      delete htmlPools[name];
      delete htmlCursor[name];
    }
    return { ...SAMPLE_URLS };
  }
  refreshSampleUrls();

  // Switch the folder the cues read from. `files` is the style's listing, so a
  // style may use another extension (keyany.ogg) and still be recognised.
  function setSoundStyle(style, files) {
    const wanted = typeof style === "string" && style.trim() ? style.trim() : DEFAULT_SOUND_STYLE;
    const urls = styleSampleUrls(wanted, files);
    const changed = JSON.stringify(urls) !== JSON.stringify(baseSampleUrls);
    baseSampleUrls = urls;
    if (changed) refreshSampleUrls();
    return { ...SAMPLE_URLS };
  }

  // Theme packs may replace individual foley samples. Keep the current style
  // map intact underneath so switching back to a style's own sounds is
  // lossless.
  function setSampleOverrides(overrides) {
    const clean = {};
    if (overrides && typeof overrides === "object") {
      for (const [name, url] of Object.entries(overrides)) {
        if (!(name in SAMPLE_FILES) || typeof url !== "string" || !url) continue;
        if (!url.startsWith("/theme-assets/") && !url.startsWith("/user-sounds/")) continue;
        clean[name] = url;
      }
    }
    sampleOverrides = clean;
    refreshSampleUrls();
    return { ...SAMPLE_URLS };
  }

  function preloadSamples() {
    const c = ensure();
    if (!c) return;
    for (const [name, url] of Object.entries(SAMPLE_URLS)) {
      if (sampleBuffers[name] || sampleLoading[name]) continue;
      if (!htmlPools[name]) {
        try {
          const warm = new Audio(url);
          warm.preload = "auto";
          htmlPools[name] = [warm];
        } catch (error) {}
      }
      sampleLoading[name] = fetch(url)
        .then((response) => response.arrayBuffer())
        .then((data) => new Promise((resolve) => c.decodeAudioData(data, resolve, () => resolve(null))))
        .then((decoded) => { if (decoded) sampleBuffers[name] = decoded; })
        .catch(() => {})
        .finally(() => { sampleLoading[name] = null; });
    }
  }

  function playHtmlSample(name, level = 0.3, rate = 1) {
    const url = SAMPLE_URLS[name];
    if (!url) return;
    const pool = htmlPools[name] || (htmlPools[name] = []);
    const index = (htmlCursor[name] || 0) % 4;
    htmlCursor[name] = index + 1;
    let audio = pool[index];
    if (!audio) {
      try {
        audio = new Audio(url);
        audio.preload = "auto";
      } catch (error) {
        return;
      }
      pool[index] = audio;
    }
    try {
      audio.currentTime = 0;
      audio.volume = Math.max(0, Math.min(1, level * volume));
      audio.playbackRate = rate;
      audio.play().catch(() => {});
    } catch (error) {}
  }

  function playSample(name, volume = 0.3, rate = 1) {
    if (muted) return;
    const c = ensure();
    if (!c || c.state !== "running") {
      // WebKit can leave WebAudio suspended. The local sample still plays
      // through an HTMLAudio fallback so clicks and typing never go silent.
      playHtmlSample(name, volume, rate);
      return;
    }
    const buffer = sampleBuffers[name];
    if (!buffer) {
      preloadSamples();
      return;
    }
    const src = c.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.value = rate;
    const gain = c.createGain();
    gain.gain.setValueAtTime(volume, c.currentTime);
    src.connect(gain);
    gain.connect(masterOutput(c));
    src.start();
  }

  function ensure() {
    if (muted || !AC) return null;
    if (ctx && ctx.state === "closed") {
      // WebKit can close the context after a long suspend or device change.
      // Rebuild it instead of staying silent for the rest of the session.
      ctx = null;
      noise = null;
      air = null;
      for (const name of Object.keys(sampleLoading)) sampleLoading[name] = null;
    }
    if (!ctx) {
      try { ctx = new AC(); } catch (error) { return null; }
    }
    if (ctx.state !== "running") {
      try { ctx.resume().catch(() => {}); } catch (error) {}
    }
    return ctx;
  }

  function noiseBuffer() {
    if (noise) return noise;
    const length = Math.max(1, Math.floor(ctx.sampleRate * 0.55));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.025 * white) / 1.025;
      data[i] = last * 3.2;
    }
    noise = buffer;
    return noise;
  }

  let air = null;

  // Plain white noise, used for a thin and airy scroll breath instead of the
  // heavier low-frequency rumble of the brown-noise buffer.
  function airBuffer() {
    if (air) return air;
    const length = Math.max(1, Math.floor(ctx.sampleRate * 0.5));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    air = buffer;
    return air;
  }

  function rustle(intensity = 1) {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer();
    src.playbackRate.value = 0.8 + Math.random() * 0.55;
    const band = c.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1300 + Math.random() * 2300;
    band.Q.value = 0.55;
    const high = c.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 520;
    const gain = c.createGain();
    const vol = 0.018 * intensity * (0.7 + Math.random() * 0.65);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085 + Math.random() * 0.05);
    src.connect(band);
    band.connect(high);
    high.connect(gain);
    gain.connect(masterOutput(c));
    src.start(now, Math.random() * 0.28, 0.16);
    src.stop(now + 0.18);
  }

  function leafRustle() {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    const layer = (delay, duration, frequency, q, volume, rate) => {
      const src = c.createBufferSource();
      src.buffer = noiseBuffer();
      src.playbackRate.value = rate;
      const band = c.createBiquadFilter();
      band.type = "bandpass";
      band.Q.value = q;
      band.frequency.setValueAtTime(frequency, now + delay);
      band.frequency.linearRampToValueAtTime(frequency * 1.55, now + delay + duration * 0.62);
      const high = c.createBiquadFilter();
      high.type = "highpass";
      high.frequency.value = 420;
      const gain = c.createGain();
      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(volume, now + delay + 0.09);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
      src.connect(band);
      band.connect(high);
      high.connect(gain);
      gain.connect(masterOutput(c));
      src.start(now + delay, Math.random() * 0.25, duration);
      src.stop(now + delay + duration + 0.02);
    };
    layer(0.02, 0.9, 430, 0.55, 0.05, 0.65);
    layer(0, 0.8, 850, 0.5, 0.11, 0.8);
    layer(0.12, 0.95, 1700, 0.45, 0.085, 1.05);
    layer(0.28, 0.75, 2600, 0.6, 0.05, 0.95);
    const bed = c.createBufferSource();
    bed.buffer = noiseBuffer();
    bed.playbackRate.value = 0.68;
    const low = c.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 4000;
    const bedGain = c.createGain();
    bedGain.gain.setValueAtTime(0.0001, now);
    bedGain.gain.exponentialRampToValueAtTime(0.06, now + 0.16);
    bedGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
    bed.connect(low);
    low.connect(bedGain);
    bedGain.connect(masterOutput(c));
    bed.start(now, 0.1, 1.14);
    bed.stop(now + 1.16);
  }

  let stretchVoice = null;

  function startLeafStretch() {
    const c = ensure();
    if (!c || stretchVoice) return;
    const now = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer();
    src.loop = true;
    src.playbackRate.value = 0.82;
    const band = c.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 0.62;
    band.frequency.value = 1450;
    const low = c.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 4200;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.065, now + 0.2);
    const breeze = c.createOscillator();
    breeze.frequency.value = 0.55;
    const breezeDepth = c.createGain();
    breezeDepth.gain.value = 420;
    breeze.connect(breezeDepth);
    breezeDepth.connect(band.frequency);
    src.connect(band);
    band.connect(low);
    low.connect(gain);
    gain.connect(masterOutput(c));
    src.start(now);
    breeze.start(now);
    stretchVoice = { src, gain, breeze, breezeDepth };
  }

  function stopLeafStretch() {
    if (!stretchVoice) return;
    const c = ensure();
    const voice = stretchVoice;
    stretchVoice = null;
    if (!c) return;
    const now = c.currentTime;
    try {
      voice.breezeDepth.gain.setTargetAtTime(0, now, 0.05);
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setTargetAtTime(0.0001, now, 0.09);
      voice.breeze.stop(now + 0.35);
      voice.src.stop(now + 0.35);
    } catch (error) {}
  }

  function leafDrag() {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer();
    src.playbackRate.value = 0.9 + Math.random() * 0.4;
    const band = c.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 0.7;
    band.frequency.setValueAtTime(1000 + Math.random() * 900, now);
    band.frequency.linearRampToValueAtTime(2200 + Math.random() * 800, now + 0.18);
    const high = c.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 600;
    const gain = c.createGain();
    const vol = 0.06 + Math.random() * 0.03;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(vol, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    src.connect(band);
    band.connect(high);
    high.connect(gain);
    gain.connect(masterOutput(c));
    src.start(now, Math.random() * 0.2, 0.26);
    src.stop(now + 0.27);
  }

  function unroll() {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer();
    src.playbackRate.value = 0.7;
    const band = c.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 0.9;
    band.frequency.setValueAtTime(260, now);
    band.frequency.exponentialRampToValueAtTime(1400, now + 0.75);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.026, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    src.connect(band);
    band.connect(gain);
    gain.connect(masterOutput(c));
    src.start(now, 0, 0.95);
    src.stop(now + 1);
  }

  function paper() {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer();
    src.playbackRate.value = 0.62;
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1500, now);
    filter.frequency.exponentialRampToValueAtTime(500, now + 0.4);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.028, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(masterOutput(c));
    src.start(now, 0.05, 0.5);
    src.stop(now + 0.55);
  }

  let lastPage = 0;

  // A light, airy breath for scrolling lists. White noise with the low body
  // filtered out, a short swell and a rising filter: air rather than rustle.
  function pageTurn(intensity = 1) {
    const stamp = Date.now();
    if (stamp - lastPage < 110) return;
    lastPage = stamp;
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = airBuffer();
    src.playbackRate.value = 0.9 + Math.random() * 0.15;
    const low = c.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.setValueAtTime(2200, now);
    low.frequency.linearRampToValueAtTime(4200, now + 0.28);
    low.Q.value = 0.3;
    const high = c.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 700;
    const gain = c.createGain();
    const volume = 0.05 * intensity;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.07);
    gain.gain.linearRampToValueAtTime(volume * 0.66, now + 0.2);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.4);
    src.connect(high);
    high.connect(low);
    low.connect(gain);
    gain.connect(masterOutput(c));
    src.start(now);
    src.stop(now + 0.42);
  }

  let waterVoice = null;
  let waterTimer = 0;
  let trickleVoice = null;
  let trickleTimer = 0;
  let windVoice = null;
  let windTimer = 0;

  // A continuous, very quiet stream under the completed-task list. It rises
  // while the wheel turns and settles away shortly after scrolling stops, so
  // long continuous scrolls stay comfortable.
  function waterFlow(intensity = 1) {
    if (muted) return;
    const c = ensure();
    if (!c) return;
    if (c.state === "suspended") c.resume().catch(() => {});
    const buffer = sampleBuffers.waterFlow;
    if (!buffer) {
      preloadSamples();
      return;
    }
    const now = c.currentTime;
    if (!waterVoice) {
      const src = c.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const high = c.createBiquadFilter();
      high.type = "highpass";
      high.frequency.value = 140;
      const low = c.createBiquadFilter();
      low.type = "lowpass";
      low.frequency.value = 5200;
      low.Q.value = 0.3;
      const gain = c.createGain();
      gain.gain.value = 0.0001;
      src.connect(high);
      high.connect(low);
      low.connect(gain);
      gain.connect(masterOutput(c));
      src.start(now);
      waterVoice = { src, gain };
    }
    const g = waterVoice.gain.gain;
    if (g.cancelAndHoldAtTime) g.cancelAndHoldAtTime(now);
    else {
      g.cancelScheduledValues(now);
      g.setValueAtTime(Math.max(0.0001, g.value), now);
    }
    g.linearRampToValueAtTime(0.16 * intensity, now + 0.12);
    clearTimeout(waterTimer);
    waterTimer = setTimeout(() => {
      if (!waterVoice) return;
      const t = c.currentTime;
      const gg = waterVoice.gain.gain;
      if (gg.cancelAndHoldAtTime) gg.cancelAndHoldAtTime(t);
      else {
        gg.cancelScheduledValues(t);
        gg.setValueAtTime(Math.max(0.0001, gg.value), t);
      }
      gg.linearRampToValueAtTime(0.0001, t + 0.5);
    }, 200);
  }

  // A smaller, brighter water trickle for the subtask list. It is the same
  // scroll-follow design as the completed list, but high-passed so it sounds
  // light and bubbly instead of heavy.
  function subtaskFlow(intensity = 1) {
    if (muted) return;
    const c = ensure();
    if (!c) return;
    if (c.state === "suspended") c.resume().catch(() => {});
    const buffer = sampleBuffers.trickle;
    if (!buffer) {
      preloadSamples();
      return;
    }
    const now = c.currentTime;
    if (!trickleVoice) {
      const src = c.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const high = c.createBiquadFilter();
      high.type = "highpass";
      high.frequency.value = 650;
      const low = c.createBiquadFilter();
      low.type = "lowpass";
      low.frequency.value = 7000;
      low.Q.value = 0.3;
      const gain = c.createGain();
      gain.gain.value = 0.0001;
      src.connect(high);
      high.connect(low);
      low.connect(gain);
      gain.connect(masterOutput(c));
      src.start(now);
      trickleVoice = { src, gain };
    }
    const g = trickleVoice.gain.gain;
    if (g.cancelAndHoldAtTime) g.cancelAndHoldAtTime(now);
    else {
      g.cancelScheduledValues(now);
      g.setValueAtTime(Math.max(0.0001, g.value), now);
    }
    g.linearRampToValueAtTime(0.11 * intensity, now + 0.035);
    clearTimeout(trickleTimer);
    trickleTimer = setTimeout(() => {
      if (!trickleVoice) return;
      const t = c.currentTime;
      const gg = trickleVoice.gain.gain;
      if (gg.cancelAndHoldAtTime) gg.cancelAndHoldAtTime(t);
      else {
        gg.cancelScheduledValues(t);
        gg.setValueAtTime(Math.max(0.0001, gg.value), t);
      }
      gg.linearRampToValueAtTime(0.0001, t + 0.45);
    }, 180);
  }

  // Natural winter wind for scrolling the Doing list, level-following the wheel.
  function cardWind(intensity = 1) {
    if (muted) return;
    const c = ensure();
    if (!c) return;
    if (c.state === "suspended") c.resume().catch(() => {});
    const buffer = sampleBuffers.windScroll;
    if (!buffer) {
      preloadSamples();
      return;
    }
    const now = c.currentTime;
    if (!windVoice) {
      const src = c.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const high = c.createBiquadFilter();
      high.type = "highpass";
      high.frequency.value = 70;
      const low = c.createBiquadFilter();
      low.type = "lowpass";
      low.frequency.value = 5600;
      low.Q.value = 0.3;
      const gain = c.createGain();
      gain.gain.value = 0.0001;
      src.connect(high);
      high.connect(low);
      low.connect(gain);
      gain.connect(masterOutput(c));
      src.start(now, Math.random() * Math.max(0.01, buffer.duration - 0.05));
      windVoice = { src, gain };
    }
    const g = windVoice.gain.gain;
    if (g.cancelAndHoldAtTime) g.cancelAndHoldAtTime(now);
    else {
      g.cancelScheduledValues(now);
      g.setValueAtTime(Math.max(0.0001, g.value), now);
    }
    g.linearRampToValueAtTime(0.34 * intensity, now + 0.09);
    clearTimeout(windTimer);
    windTimer = setTimeout(() => {
      if (!windVoice) return;
      const t = c.currentTime;
      const gg = windVoice.gain.gain;
      if (gg.cancelAndHoldAtTime) gg.cancelAndHoldAtTime(t);
      else {
        gg.cancelScheduledValues(t);
        gg.setValueAtTime(Math.max(0.0001, gg.value), t);
      }
      gg.linearRampToValueAtTime(0.0001, t + 0.38);
    }, 240);
  }

  // A light "fu~" breath for the smoke that removes an empty subtask.
  function exhale(intensity = 1) {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = airBuffer();
    src.playbackRate.value = 0.58 + Math.random() * 0.08;
    const high = c.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 320;
    const low = c.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.setValueAtTime(1800, now);
    low.frequency.linearRampToValueAtTime(620, now + 0.34);
    low.Q.value = 0.4;
    const gain = c.createGain();
    const volume = 0.05 * intensity;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.055);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.36);
    src.connect(high);
    high.connect(low);
    low.connect(gain);
    gain.connect(masterOutput(c));
    src.start(now);
    src.stop(now + 0.38);
  }

  // A row going up in Pvs fire: a short low roar with a few dry crackles.
  // This replaces the old "fu~" breath only for the right-click delete.
  function burn(intensity = 1) {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = airBuffer();
    src.loop = true;
    src.playbackRate.value = 0.68 + Math.random() * 0.12;
    const high = c.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 110;
    const low = c.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.setValueAtTime(2200, now);
    low.frequency.exponentialRampToValueAtTime(680, now + 0.95);
    low.Q.value = 0.55;
    const gain = c.createGain();
    const volume = 0.12 * intensity;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.045);
    gain.gain.linearRampToValueAtTime(volume * 0.58, now + 0.42);
    gain.gain.linearRampToValueAtTime(0.0001, now + 1.18);
    src.connect(high);
    high.connect(low);
    low.connect(gain);
    gain.connect(masterOutput(c));
    src.start(now);
    src.stop(now + 1.2);
    for (let i = 0; i < 7; i += 1) {
      const at = now + 0.06 + Math.random() * 0.82;
      const crackle = c.createBufferSource();
      crackle.buffer = noiseBuffer();
      crackle.playbackRate.value = 1.2 + Math.random() * 1.6;
      const band = c.createBiquadFilter();
      band.type = "bandpass";
      band.Q.value = 1.35;
      band.frequency.value = 900 + Math.random() * 2500;
      const pop = c.createGain();
      pop.gain.setValueAtTime(0.0001, at);
      pop.gain.exponentialRampToValueAtTime(0.025 * intensity * (0.45 + Math.random()), at + 0.006);
      pop.gain.exponentialRampToValueAtTime(0.0001, at + 0.065 + Math.random() * 0.06);
      crackle.connect(band);
      band.connect(pop);
      pop.connect(masterOutput(c));
      crackle.start(at, Math.random() * 0.3, 0.16);
      crackle.stop(at + 0.17);
    }
    tone(60, now + 0.02, 0.85, 0.045);
  }

  let lastSplash = 0;

  // A small wave breaking: a short filtered noise crest with a few bubbles.
  function splash() {
    const stamp = Date.now();
    if (stamp - lastSplash < 150) return;
    lastSplash = stamp;
    const c = ensure();
    if (!c) return;
    const now = c.currentTime + 0.005;
    const src = c.createBufferSource();
    src.buffer = airBuffer();
    src.playbackRate.value = 1.05 + Math.random() * 0.12;
    const high = c.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 320;
    const band = c.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 0.55;
    band.frequency.setValueAtTime(3400, now);
    band.frequency.exponentialRampToValueAtTime(900, now + 0.28);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.13, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.46);
    src.connect(high);
    high.connect(band);
    band.connect(gain);
    gain.connect(masterOutput(c));
    src.start(now, Math.random() * 0.1, 0.47);
    src.stop(now + 0.48);

    // Fuller body of water under the bright spray.
    const waveSrc = c.createBufferSource();
    waveSrc.buffer = airBuffer();
    waveSrc.playbackRate.value = 0.75 + Math.random() * 0.12;
    const waveLow = c.createBiquadFilter();
    waveLow.type = "lowpass";
    waveLow.frequency.setValueAtTime(1200, now);
    waveLow.frequency.exponentialRampToValueAtTime(380, now + 0.4);
    const waveGain = c.createGain();
    waveGain.gain.setValueAtTime(0.0001, now);
    waveGain.gain.linearRampToValueAtTime(0.055, now + 0.03);
    waveGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
    waveSrc.connect(waveLow);
    waveLow.connect(waveGain);
    waveGain.connect(masterOutput(c));
    waveSrc.start(now, Math.random() * 0.06, 0.44);
    waveSrc.stop(now + 0.45);

    const osc = c.createOscillator();
    const body = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(86, now + 0.22);
    body.gain.setValueAtTime(0.0001, now);
    body.gain.linearRampToValueAtTime(0.06, now + 0.008);
    body.gain.exponentialRampToValueAtTime(0.0001, now + 0.27);
    osc.connect(body);
    body.connect(masterOutput(c));
    osc.start(now);
    osc.stop(now + 0.29);

    for (let i = 0; i < 6; i += 1) {
      const start = now + 0.05 + Math.random() * 0.24;
      const bubble = c.createOscillator();
      const bg = c.createGain();
      const freq = 520 + Math.random() * 620;
      bubble.type = "sine";
      bubble.frequency.setValueAtTime(freq, start);
      bubble.frequency.exponentialRampToValueAtTime(freq * 1.75, start + 0.045);
      bg.gain.setValueAtTime(0.0001, start);
      bg.gain.linearRampToValueAtTime(0.022, start + 0.005);
      bg.gain.exponentialRampToValueAtTime(0.0001, start + 0.075);
      bubble.connect(bg);
      bg.connect(masterOutput(c));
      bubble.start(start);
      bubble.stop(start + 0.085);
    }
  }

  let lastWriting = 0;

  function writing() {
    const stamp = Date.now();
    if (stamp - lastWriting < 300) return;
    lastWriting = stamp;
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer();
    src.playbackRate.value = 0.85 + Math.random() * 0.2;
    const high = c.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 900;
    const band = c.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 0.7;
    band.frequency.setValueAtTime(2800, now);
    band.frequency.linearRampToValueAtTime(4200, now + 0.18);
    band.frequency.linearRampToValueAtTime(2200, now + 0.42);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.03);
    gain.gain.linearRampToValueAtTime(0.014, now + 0.14);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.2);
    gain.gain.linearRampToValueAtTime(0.012, now + 0.32);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.38);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    src.connect(high);
    high.connect(band);
    band.connect(gain);
    gain.connect(masterOutput(c));
    src.start(now, Math.random() * 0.2, 0.6);
    src.stop(now + 0.6);
  }

  function type() {
    if (!sampleBuffers.type) {
      const c = ensure();
      if (c) {
        const now = c.currentTime;
        const src = c.createBufferSource();
        src.buffer = noiseBuffer();
        src.playbackRate.value = 1.15 + Math.random() * 0.2;
        const band = c.createBiquadFilter();
        band.type = "bandpass";
        band.frequency.value = 1700 + Math.random() * 700;
        band.Q.value = 1.2;
        const gain = c.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.045, now + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
        src.connect(band);
        band.connect(gain);
        gain.connect(masterOutput(c));
        src.start(now, Math.random() * 0.12, 0.07);
        src.stop(now + 0.08);
      }
      preloadSamples();
      return;
    }
    playSample("type", 0.44, 0.94 + Math.random() * 0.14);
  }

  function mechanical() {
    const c = ensure();
    if (!c) return;
    playSample("type", 0.46, 0.86 + Math.random() * 0.1);
    const now = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer();
    src.playbackRate.value = 0.95 + Math.random() * 0.2;
    const band = c.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1500 + Math.random() * 900;
    band.Q.value = 1.1;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);
    src.connect(band);
    band.connect(gain);
    gain.connect(masterOutput(c));
    src.start(now, Math.random() * 0.16, 0.08);
    src.stop(now + 0.09);
    tone(132, now + 0.01, 0.1, 0.035);
    tone(74, now + 0.05, 0.16, 0.028);
    tone(1046.5, now + 0.08, 0.22, 0.011);
  }

  function carriage() {
    const c = ensure();
    if (!c) return;
    playSample("enter", 0.74);
    const now = c.currentTime;
    tone(118, now, 0.2, 0.045);
    tone(72, now + 0.055, 0.3, 0.04);
    tone(987.77, now + 0.38, 0.5, 0.012);
  }

  function confirmCarriage() {
    const c = ensure();
    if (!c) return;
    playSample("enter", 0.74);
    const now = c.currentTime;
    tone(118, now, 0.28, 0.045);
    tone(72, now + 0.06, 0.4, 0.04);
    tone(1318.5, now + 0.38, 0.9, 0.014);
    tone(1760, now + 0.45, 0.75, 0.008);
  }

  function tone(freq, when, duration, volume = 0.03) {
    const c = ctx;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(volume, when + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    osc.connect(gain);
    gain.connect(masterOutput(c));
    osc.start(when);
    osc.stop(when + duration + 0.02);
  }

  // A keyboard click with a tiny arcade sparkle. The bright noise tick leads,
  // a very short high blip adds the Tetris colour, and a soft low thump gives
  // the key a physical bottom-out. Everything lands inside ~40ms, so it reads
  // as typing rather than a melody.
  const TETRIS_TYPE_NOTES = [1174.66, 1244.51, 1318.51, 1396.91, 1567.98];

  function tetrisBlip(freq) {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;

    // The dominant sound: a dry, bright key tick.
    const tick = c.createBufferSource();
    tick.buffer = airBuffer();
    const band = c.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 3600 + Math.random() * 1200;
    band.Q.value = 0.7;
    const tickGain = c.createGain();
    tickGain.gain.setValueAtTime(0.0001, now);
    tickGain.gain.linearRampToValueAtTime(0.052, now + 0.001);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);
    tick.connect(band);
    band.connect(tickGain);
    tickGain.connect(masterOutput(c));
    tick.start(now, Math.random() * 0.1, 0.02);
    tick.stop(now + 0.022);

    // A quiet high blip keeps the Tetris character without turning the
    // keyboard into a tune.
    const osc = c.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.013, now + 0.0015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);
    osc.connect(gain);
    gain.connect(masterOutput(c));
    osc.start(now);
    osc.stop(now + 0.035);

    // A soft low body for the key bottoming out.
    const thump = c.createOscillator();
    thump.type = "sine";
    thump.frequency.setValueAtTime(165, now);
    const thumpGain = c.createGain();
    thumpGain.gain.setValueAtTime(0.0001, now);
    thumpGain.gain.linearRampToValueAtTime(0.018, now + 0.002);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);
    thump.connect(thumpGain);
    thumpGain.connect(masterOutput(c));
    thump.start(now);
    thump.stop(now + 0.03);
  }

  function tetrisMove() {
    const base = TETRIS_TYPE_NOTES[Math.floor(Math.random() * TETRIS_TYPE_NOTES.length)];
    // A few cents of drift makes repeated keys feel like separate physical
    // presses instead of one synthesised loop.
    const freq = base * Math.pow(2, (Math.random() * 30 - 15) / 1200);
    tetrisBlip(freq);
  }

  function tetrisErase() {
    // Backspace is a dry high-passed swipe with a tiny low body, so deleting
    // text feels like lifting a block instead of another musical note.
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = airBuffer();
    src.playbackRate.value = 1.1;
    const high = c.createBiquadFilter();
    high.type = "highpass";
    high.frequency.setValueAtTime(2400, now);
    high.frequency.exponentialRampToValueAtTime(1200, now + 0.06);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.028, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    src.connect(high);
    high.connect(gain);
    gain.connect(masterOutput(c));
    src.start(now, Math.random() * 0.1, 0.08);
    src.stop(now + 0.08);

    const osc = c.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(160, now);
    const body = c.createGain();
    body.gain.setValueAtTime(0.0001, now);
    body.gain.linearRampToValueAtTime(0.018, now + 0.003);
    body.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    osc.connect(body);
    body.connect(masterOutput(c));
    osc.start(now);
    osc.stop(now + 0.055);
  }

  function tetrisClear() {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, index) => {
      const osc = c.createOscillator();
      osc.type = "square";
      osc.frequency.value = freq;
      const gain = c.createGain();
      const at = now + index * 0.055;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.linearRampToValueAtTime(0.065, at + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.12);
      osc.connect(gain);
      gain.connect(masterOutput(c));
      osc.start(at);
      osc.stop(at + 0.14);
    });
  }

  function seal() {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    tone(96, now, 0.22, 0.045);
    tone(63, now + 0.02, 0.3, 0.035);
    const src = c.createBufferSource();
    src.buffer = noiseBuffer();
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1300;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(masterOutput(c));
    src.start(now, 0.12, 0.1);
  }

  function chime() {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime + 0.02;
    tone(523.25, now, 0.6, 0.024);
    tone(659.25, now + 0.06, 0.72, 0.019);
    tone(783.99, now + 0.12, 0.9, 0.014);
  }

  function ding() {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime + 0.01;
    tone(1567.98, now, 0.75, 0.055);
    tone(2093.0, now + 0.01, 0.55, 0.028);
    tone(1046.5, now, 0.9, 0.018);
  }

  function trainWhistle() {
    if (muted) return;
    const c = ensure();
    if (!c) return;
    if (sampleBuffers.train) {
      playSample("train", 0.9);
      return;
    }
    const now = c.currentTime + 0.01;
    const blast = (start, level) => {
      tone(311.13, start, 0.46, 0.055 * level);
      tone(369.99, start, 0.46, 0.038 * level);
      tone(466.16, start, 0.46, 0.026 * level);
      tone(622.26, start, 0.42, 0.014 * level);
    };
    blast(now, 1);
    blast(now + 0.52, 0.82);
    const src = c.createBufferSource();
    src.buffer = noiseBuffer();
    const filter = c.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 900;
    filter.Q.value = 0.7;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.035, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.05);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(masterOutput(c));
    src.start(now, 0.1, 0.95);
  }

  function unlock() {
    const c = ensure();
    if (c && c.state !== "running") {
      try { c.resume().catch(() => {}); } catch (error) {}
    }
    preloadSamples();
  }

  function wake() {
    ensure();
  }

  function toggle() {
    muted = !muted;
    try { localStorage.setItem("neotodo.muted", muted ? "1" : "0"); } catch (error) {}
    if (!muted) {
      preloadSamples();
      rustle(0.6);
    }
    return muted;
  }

  function categoryTap() {
    const c = ensure();
    if (!c || c.state !== "running") { playHtmlSample("type", 0.18, 1.35); return; }
    const now = c.currentTime;
    // crisp high transient, then two quick glassy pings
    const src = c.createBufferSource();
    src.buffer = noiseBuffer();
    src.playbackRate.value = 1.25;
    const high = c.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 2600;
    high.Q.value = 0.7;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.26, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    src.connect(high);
    high.connect(gain);
    gain.connect(masterOutput(c));
    src.start(now, 0, 0.08);
    src.stop(now + 0.09);
    tone(180, now, 0.09, 0.03);
    tone(1318.5, now, 0.07, 0.06);
    tone(1975.5, now + 0.02, 0.09, 0.04);
    tone(2637, now + 0.045, 0.11, 0.024);
  }

  function achievementTap() {
    const c = ensure();
    if (!c || c.state !== "running") { playHtmlSample("type", 0.18, 1.35); return; }
    const now = c.currentTime;
    tone(783.99, now, 0.16, 0.018);
    tone(1046.5, now + 0.055, 0.22, 0.014);
    tone(1318.5, now + 0.11, 0.3, 0.01);
  }

  function timerTap() {
    const c = ensure();
    if (!c || c.state !== "running") { playHtmlSample("type", 0.18, 1.35); return; }
    const now = c.currentTime;
    tone(1320, now, 0.06, 0.014);
    tone(880, now + 0.045, 0.09, 0.012);
    tone(1760, now + 0.085, 0.12, 0.008);
  }

  function addTap() {
    const c = ensure();
    if (!c || c.state !== "running") { playHtmlSample("type", 0.18, 1.35); return; }
    mechanical();
    const now = c.currentTime;
    tone(660, now + 0.05, 0.11, 0.014);
  }

  function drawer(open = true) {
    // Same wooden drawer sample, trimmed with a fade instead of a pitch shift.
    if (muted) return;
    const c = ensure();
    if (!c) return;
    // Both directions use the same "pull open" drawer sound.
    const buffer = sampleBuffers.drawerOpen || sampleBuffers.drawerClose;
    if (!buffer) { preloadSamples(); return; }
    const now = c.currentTime;
    const bus = c.createDynamicsCompressor();
    bus.threshold.value = -10;
    bus.knee.value = 8;
    bus.ratio.value = 7;
    bus.attack.value = 0.002;
    bus.release.value = 0.18;
    bus.connect(masterOutput(c));

    const src = c.createBufferSource();
    src.buffer = buffer;
    const gain = c.createGain();
    gain.gain.setValueAtTime(2.2, now);
    gain.gain.setValueAtTime(2.2, now + 0.16);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.31);
    src.connect(gain);
    gain.connect(bus);
    src.start(now);
    src.stop(now + 0.33);

    // A small wooden creak layer makes the stretch read clearly.
    const creak = c.createBufferSource();
    creak.buffer = noiseBuffer();
    creak.playbackRate.value = 0.9 + Math.random() * 0.15;
    const band = c.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 2.2;
    band.frequency.setValueAtTime(720, now);
    band.frequency.linearRampToValueAtTime(1150, now + 0.17);
    const creakGain = c.createGain();
    creakGain.gain.setValueAtTime(0.0001, now);
    creakGain.gain.linearRampToValueAtTime(0.018, now + 0.018);
    creakGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
    creak.connect(band);
    band.connect(creakGain);
    creakGain.connect(bus);
    creak.start(now, Math.random() * 0.08, 0.27);
    creak.stop(now + 0.28);
  }

  function guitarPluck() {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    const pluck = (freq, volume, duration, cutoff) => {
      const osc = c.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const filter = c.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = cutoff;
      const gain = c.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterOutput(c));
      osc.start(now);
      osc.stop(now + duration + 0.02);
    };
    pluck(196, 0.17, 3.0, 2200);
    pluck(392, 0.075, 2.7, 2600);
    pluck(587.33, 0.04, 2.1, 3100);
    const src = c.createBufferSource();
    src.buffer = noiseBuffer();
    src.playbackRate.value = 1.4;
    const high = c.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 2800;
    const pick = c.createGain();
    pick.gain.setValueAtTime(0.0001, now);
    pick.gain.exponentialRampToValueAtTime(0.065, now + 0.002);
    pick.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    src.connect(high);
    high.connect(pick);
    pick.connect(masterOutput(c));
    src.start(now, 0, 0.07);
    src.stop(now + 0.08);
  }

  function bassFade() {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    const play = (freq, type, volume, duration, delay = 0, cutoff = 620) => {
      const at = now + delay;
      const osc = c.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      const filter = c.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = cutoff;
      const gain = c.createGain();
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(volume, at + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterOutput(c));
      osc.start(at);
      osc.stop(at + duration + 0.02);
    };
    play(196, "triangle", 0.08, 0.7, 0, 900);
    play(164.81, "sawtooth", 0.14, 3.0, 0, 620);
    play(110, "triangle", 0.11, 2.9, 0.06, 760);
    play(82.41, "triangle", 0.08, 2.6, 0.12, 520);
    play(41.2, "sine", 0.05, 2.2, 0, 220);
  }

  function itemGet() {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime + 0.01;
    const notes = [659.25, 880, 1108.73, 1318.51];
    notes.forEach((freq, index) => {
      const at = now + index * 0.072;
      const osc = c.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, at);
      const filter = c.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 5200;
      const gain = c.createGain();
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.045, at + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.11);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterOutput(c));
      osc.start(at);
      osc.stop(at + 0.11);
    });
    tone(2093, now + 0.29, 0.16, 0.008);
  }

  function bassZap() {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime + 0.01;
    const growl = c.createOscillator();
    growl.type = "sawtooth";
    growl.frequency.setValueAtTime(185, now);
    growl.frequency.exponentialRampToValueAtTime(52, now + 0.58);
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(950, now);
    filter.frequency.exponentialRampToValueAtTime(230, now + 0.58);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.66);
    growl.connect(filter);
    filter.connect(gain);
    gain.connect(masterOutput(c));
    growl.start(now);
    growl.stop(now + 0.68);

    const buzz = c.createOscillator();
    buzz.type = "square";
    buzz.frequency.setValueAtTime(145, now);
    buzz.frequency.exponentialRampToValueAtTime(48, now + 0.5);
    const buzzGain = c.createGain();
    buzzGain.gain.setValueAtTime(0.0001, now);
    buzzGain.gain.exponentialRampToValueAtTime(0.014, now + 0.03);
    buzzGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.54);
    buzz.connect(buzzGain);
    buzzGain.connect(masterOutput(c));
    buzz.start(now);
    buzz.stop(now + 0.56);
  }

  function celebrationBass() {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime + 0.03;
    // Punchy bus so the celebration feels loud without clipping.
    const bus = c.createDynamicsCompressor();
    bus.threshold.value = -16;
    bus.knee.value = 10;
    bus.ratio.value = 5;
    bus.attack.value = 0.003;
    bus.release.value = 0.22;
    bus.connect(masterOutput(c));

    const pluck = (freq, at, duration, volume = 0.075) => {
      const osc = c.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, at);
      const sub = c.createOscillator();
      sub.type = "triangle";
      sub.frequency.setValueAtTime(freq / 2, at);
      const filter = c.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.value = 5.5;
      filter.frequency.setValueAtTime(2200, at);
      filter.frequency.exponentialRampToValueAtTime(650, at + duration * 0.82);
      const gain = c.createGain();
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(volume, at + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(bus);
      const subGain = c.createGain();
      subGain.gain.setValueAtTime(0.0001, at);
      subGain.gain.exponentialRampToValueAtTime(volume * 0.24, at + 0.018);
      subGain.gain.exponentialRampToValueAtTime(0.0001, at + duration * 0.95);
      sub.connect(subGain);
      subGain.connect(bus);
      osc.start(at);
      osc.stop(at + duration + 0.02);
      sub.start(at);
      sub.stop(at + duration + 0.02);

      const pick = c.createBufferSource();
      pick.buffer = noiseBuffer();
      const pickHigh = c.createBiquadFilter();
      pickHigh.type = "highpass";
      pickHigh.frequency.value = 2400;
      const pickGain = c.createGain();
      pickGain.gain.setValueAtTime(0.0001, at);
      pickGain.gain.exponentialRampToValueAtTime(0.018, at + 0.002);
      pickGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.04);
      pick.connect(pickHigh);
      pickHigh.connect(pickGain);
      pickGain.connect(bus);
      pick.start(at);
      pick.stop(at + 0.045);
    };

    const lead = (freq, at, duration, volume = 0.02, type = "triangle") => {
      const osc = c.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, at);
      const gain = c.createGain();
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(volume, at + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
      osc.connect(gain);
      gain.connect(bus);
      osc.start(at);
      osc.stop(at + duration + 0.02);
    };

    const clap = (at, volume = 0.03) => {
      const src = c.createBufferSource();
      src.buffer = noiseBuffer();
      src.playbackRate.value = 1.3;
      const band = c.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.value = 1900;
      band.Q.value = 1.1;
      const gain = c.createGain();
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(volume, at + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.09);
      src.connect(band);
      band.connect(gain);
      gain.connect(bus);
      src.start(at);
      src.stop(at + 0.1);
    };

    // A high, bright attack first: the celebration should open up high.
    [1046.5, 1318.51, 1567.98, 2093].forEach((freq, index) => {
      lead(freq, now + index * 0.045, 0.18, 0.032, "square");
    });

    const bassStart = now + 0.08;
    const pattern = [
      [130.81, 0.16], [164.81, 0.16], [196.00, 0.16], [261.63, 0.16],
      [196.00, 0.16], [164.81, 0.16], [130.81, 0.30],
      [130.81, 0.16], [196.00, 0.16], [261.63, 0.16], [329.63, 0.16],
      [293.66, 0.16], [261.63, 0.16], [196.00, 0.30],
      [261.63, 0.35],
    ];
    let t = 0;
    pattern.forEach(([freq, duration], index) => {
      pluck(freq, bassStart + t, Math.min(0.42, duration * 1.35), 0.07);
      if (index % 4 === 0) clap(bassStart + t, 0.028);
      t += duration;
    });

    // A high run lifts the middle of the piece.
    [1046.5, 1318.51, 1567.98, 2093].forEach((freq, index) => {
      lead(freq, now + 2.18 + index * 0.06, 0.24, 0.035);
    });

    pluck(130.81, bassStart + t, 0.72, 0.082);
    [1567.98, 2093, 2637].forEach((freq, index) => {
      lead(freq, now + t + 0.1 + index * 0.07, 0.38, 0.026);
    });
  }

  function completeTap() {
    const c = ensure();
    if (!c || c.state !== "running") { playHtmlSample("type", 0.18, 1.35); return; }
    const now = c.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, index) => {
      const at = now + index * 0.06;
      tone(freq, at, 0.26 + index * 0.035, 0.034 - index * 0.0035);
      tone(freq * 2, at, 0.16, 0.009);
    });
    const src = c.createBufferSource();
    src.buffer = noiseBuffer();
    src.playbackRate.value = 1.7;
    const sparkle = c.createBiquadFilter();
    sparkle.type = "highpass";
    sparkle.frequency.value = 4200;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.03, now + 0.24);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
    src.connect(sparkle);
    sparkle.connect(gain);
    gain.connect(masterOutput(c));
    src.start(now + 0.18, Math.random() * 0.2, 0.5);
    src.stop(now + 0.7);
    tone(130.81, now, 0.18, 0.028);
  }

  function drawerStretch() {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(70, now);
    osc.frequency.exponentialRampToValueAtTime(125, now + 0.35);
    const band = c.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 2.1;
    band.frequency.setValueAtTime(220, now);
    band.frequency.exponentialRampToValueAtTime(980, now + 0.35);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.28, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    osc.connect(band);
    band.connect(gain);
    gain.connect(masterOutput(c));
    osc.start(now);
    osc.stop(now + 0.52);
    const src = c.createBufferSource();
    src.buffer = noiseBuffer();
    src.playbackRate.value = 0.82;
    const slide = c.createBiquadFilter();
    slide.type = "bandpass";
    slide.Q.value = 0.7;
    slide.frequency.setValueAtTime(300, now);
    slide.frequency.exponentialRampToValueAtTime(1400, now + 0.4);
    const noiseGain = c.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.24, now + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    src.connect(slide);
    slide.connect(noiseGain);
    noiseGain.connect(masterOutput(c));
    src.start(now, 0, 0.52);
    src.stop(now + 0.53);
    tone(55, now + 0.15, 0.42, 0.4);
    tone(88, now + 0.15, 0.22, 0.22);
  }

  return {
    rustle, pageTurn, waterFlow, subtaskFlow, exhale, burn, splash, writing, itemGet, bassZap,
    celebrationBass, cardWind, type, mechanical, carriage, confirmCarriage, unroll, paper,
    seal, chime, ding, trainWhistle, categoryTap, achievementTap, timerTap, addTap,
    completeTap, bassFade, guitarPluck, drawer, drawerStretch, leafRustle,
    startLeafStretch, stopLeafStretch, unlock, preloadSamples, wake, toggle,
    tetrisMove, tetrisErase, tetrisClear,
    setVolume, getVolume, setSampleOverrides, setSoundStyle,
    sampleFiles: () => ({ ...SAMPLE_URLS }),
    audition: (name) => {
      const wasMuted = muted;
      muted = false;
      playSample(name, 0.85);
      muted = wasMuted;
    },
    get muted() { return muted; },
  };
})();

// Optional theme music. It is deliberately not a member of SAMPLE_FILES: a
// long looping track has its own switch in Settings → Sound, while the master
// sound switch and volume still govern it. The bundled cue is the default
// login theme of 《阴阳师：百闻牌》; see web/background-music/CREDITS.txt.
const BACKGROUND_MUSIC_TRACK = {
  src: "/background-music/oborozukiyo.mp3",
  title: "朧月夜",
  credit: "阴阳师：百闻牌 · 神前暁",
};
const BackgroundMusic = (() => {
  let enabled = true;
  try {
    const saved = localStorage.getItem("neotodo.backgroundMusic");
    if (saved !== null) enabled = saved === "1";
  } catch (error) {}
  // Fork boards and detached note/AI windows are satellites of the main
  // notebook. They stay silent so the theme never stacks across windows.
  let secondary = false;
  try {
    const params = new URLSearchParams(location.search);
    secondary = params.get("fork") === "1" || params.has("detached");
  } catch (error) {}
  let audio = null;

  // The slider is a master level; the theme rides at roughly half of it so
  // bead clicks and completion chimes stay on top of the music.
  function targetVolume() {
    return Math.max(0, Math.min(1, AudioFX.getVolume() * 0.45));
  }

  function element() {
    if (audio) return audio;
    try {
      audio = new Audio(BACKGROUND_MUSIC_TRACK.src);
    } catch (error) {
      return null;
    }
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = targetVolume();
    try { audio.setAttribute("playsinline", ""); } catch (error) {}
    return audio;
  }

  function canPlay() {
    return enabled && !AudioFX.muted && !secondary;
  }

  function play() {
    if (!canPlay()) return;
    const node = element();
    if (!node || !node.paused) return;
    // Autoplay may be refused until the first gesture. The next pointerdown or
    // keydown calls start() again, so the track joins the notebook then.
    const attempt = node.play();
    if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
  }

  function pause() {
    if (!audio) return;
    try { audio.pause(); } catch (error) {}
  }

  function applyVolume() {
    if (audio) audio.volume = targetVolume();
  }

  function sync() {
    if (canPlay()) play();
    else pause();
    applyVolume();
  }

  function setEnabled(next) {
    enabled = Boolean(next);
    try { localStorage.setItem("neotodo.backgroundMusic", enabled ? "1" : "0"); } catch (error) {}
    if (enabled) {
      AudioFX.unlock();
      sync();
    } else {
      pause();
    }
    return enabled;
  }

  return {
    start: play,
    sync,
    applyVolume,
    toggle: () => setEnabled(!enabled),
    track: BACKGROUND_MUSIC_TRACK,
    get enabled() { return enabled; },
    get playing() { return Boolean(audio && !audio.paused); },
  };
})();

// `wallpaper` is the single wallpaper choice: a picture or film in the
// dedicated `pictures/wallpapers` shelf (or a legacy absolute path), a built-in
// postcard (`art:<id>`) or a theme-pack picture (`theme:<pack-id>`). The shelf
// is what the folder chip opens, so deleting an entry there removes that
// recent option. Images and films share the same option; there is no separate
// static/dynamic switch.
const WALLPAPER_RECENT_LIMIT = 6;
// The little folder that opens a shelf on disk. Drawn inline so it borrows the
// current theme ink instead of carrying the SVG file's own dark fill.
const FOLDER_GLYPH = `<svg class="theme-folder-glyph" viewBox="0 0 1025 1024" aria-hidden="true"><path d="M961.793 446.344 961.793 446.344 202.079 446.344c-28.215 0-52.07 18.43-60.285 43.93l0 0L75.51 694.483 75.51 129.847l0 0 316.499 0 0 0 0.07 0c0 69.927 56.645 126.57 126.575 126.57l0 0 316.499 0 0 126.572 63.28 0L898.433 256.417c0-34.927-28.35-63.287-63.28-63.287L518.579 193.13c-34.925 0-63.285-28.355-63.285-63.282l0 0c0-34.93-28.285-63.287-63.285-63.287l0 0L75.51 66.561c-34.927 0-63.285 28.357-63.285 63.287l0 759.571c0 34.93 28.357 63.28 63.285 63.28l759.573 0c28.215 0 52.07-18.425 60.285-43.93l0.07 0 129.5-399.137C1024.937 474.704 996.722 446.416 961.793 446.344zM838.368 889.418 75.51 889.418l123.285-379.787 762.853 0L838.368 889.418z" fill="currentColor"/></svg>`;
const DEFAULT_SETTINGS = { theme: "postcard", postcard: "light", resolved_postcard: "light", light_postcard: "light", dark_postcard: "dark", font: "serif", note_font: "pen", scale: 1, body_font_size: 16, note_font_size: 14, body_font_color: "", note_font_color: "", show_time_cost: false, show_clock: true, show_brand: true, show_achievements: true, focus_count: 0, focus_log: [], caret_blink: false, caret_shape: "line", caret_color: "#1b1b1b", ai_caret_blink: true, ai_caret_shape: "line", ai_caret_dark: "#f4f6f8", ai_caret_light: "#1b1b1b", note_material: "paper", note_theme: "default", ai_theme: "auto", icon_theme: "classical", note_background: "", note_background_image: "", note_blur: 16, highlight: "", sticker_backgrounds: {}, wallpaper: "", wallpaper_recent: [], wallpaper_blur: 30, wallpaper_blur_on: false, wallpaper_cards: true, plugins: {}, sound_overrides: {}, sound_style: "classical" };
// The page baseline is saved in its own baseline-color.json file, outside the
// theme and outside the notebook settings. This is only the first-paint
// fallback until /api/state answers with the stored colour.
const BASELINE_COLOR_DEFAULT = "#333333";
// The row baseline (subtask / Doing hairlines) is stored in baseline-rule.json.
// It is structured, not a single colour string: solid, a gradient along the
// line, or a vertical ramp where each row samples a different stop.
const BASELINE_ROW_MODES = ["solid", "gradient", "height"];
const BASELINE_ROW_DEFAULT = {
  mode: "solid",
  color: BASELINE_COLOR_DEFAULT,
  color2: "#a8691f",
  angle: 0,
};
// Achievement stickers. Built-in achievements and achievement-tagged plugins
// each get one picture; a plugin without the "achievement" tag never appears
// here, because it has no header slot to decorate.
const STICKER_TARGETS = [
  { id: "completed", name: "Completed trophy", selector: ".head-right .trophy-button .ach-sticker img", fallback: "/stickers/yuji-battle.jpg" },
  { id: "focus", name: "Pomodoro tomato", plugin: "pomodoro", selector: ".head-right .tomato-counter .ach-sticker img", fallback: "/stickers/gojo-battle.jpg" },
];

/** A target is available when it is built in or its plugin is on and achievement-tagged. */
function stickerTargetAvailable(target) {
  if (!target) return false;
  if (!target.plugin) return true;
  return pluginHasAchievementTag(target.plugin) && pluginEnabled(target.plugin);
}

function availableStickerTargets() {
  return STICKER_TARGETS.filter(stickerTargetAvailable);
}
const NOTE_BG_PRESETS = {
  forest: "/notes-forest.jpg",
  mist: "/notes-mist.jpg",
  dusk: "/notes-dusk.jpg",
};
const POSTCARD_IDS = ["tokyo", "space", "aurora", "ocean", "forest", "vintage", "alpine", "desert", "emerald"];
// Wallpaper art is independent of the picker's curated postcard list, so an
// older saved theme (rain, field, deco, bauhaus…) can still become a pattern.
const WALLPAPER_ART_IDS = Object.keys(THEMES).filter((id) => typeof THEMES[id]?.art === "function");
const FONT_OPTIONS = [
  { id: "serif", name: "Art Serif", desc: "P052 / Bookman" },
  { id: "humanist", name: "Humanist", desc: "GWZT-EN" },
  { id: "bookman", name: "Bookman", desc: "URW Bookman" },
  { id: "mono", name: "Typewriter", desc: "DejaVu Sans Mono" },
  { id: "hand", name: "Handwritten", desc: "Caveat / hand script" },
  { id: "pen", name: "Pen Script", desc: "Z003 / quill pen" },
];
const FONT_STACKS = {
  serif: '"P052", "URW Bookman", "Noto Serif", serif',
  humanist: '"GWZT-EN", "URW Bookman", "Noto Serif", serif',
  bookman: '"URW Bookman", "P052", "Noto Serif", serif',
  mono: '"DejaVu Sans Mono", "Liberation Mono", "Noto Sans Mono", monospace',
  hand: '"Caveat", "HYYeYXSJ", "P052", "URW Bookman", serif',
  pen: '"Z003", "HYYeYXSJ", "P052", "URW Bookman", serif',
};
let settings = { ...DEFAULT_SETTINGS };
let settingsTab = "theme";
// Settings → AI. `aiConfig` mirrors the backend's ai-config.json; the catalog
// holds every model OpenCode reports plus custom provider rows.
let aiConfig = null;
let aiCatalog = { models: [], enabled_models: [], providers: [], skills: [], backends: {}, activity: [], paths: {}, default_model: "" };
let aiSettingsTab = "basic";
let aiModelQuery = "";
let aiProviderDraft = null;
let aiCommandDraft = null;
let aiConfigLoading = null;
let aiConfigLoaded = false;
let aiInstructionsTimer = null;
let noteMaterialFiles = ["paper.css", "glass.css", "focus.css"];
let noteMaterialMenuOpen = false;
let wallpaperMediaKey = "";
let wallpaperVisibilityBound = false;
// Pre-rendered static wallpapers. Rasterising the postcard art (or decoding a
// large photo) is the expensive part of mounting a card pane, so it happens
// once per wallpaper and every card reuses the same decoded picture.
const wallpaperBitmapCache = new Map();
const wallpaperTintCache = new Map();
let settingsSaveTimer = null;
let randomPicked = false;
// The theme picker keeps only two fixed bases (Light/Dark); every
// built-in postcard and every installed pack lives under Custom.
const BASE_LIGHT_THEME = "light";
const BASE_DARK_THEME = "dark";
const CUSTOM_THEME_COLOR_KEYS = ["paper", "ink", "line", "accent"];
let customThemesOpen = false;
let themeManageOpen = false;
// Appearance → Others folds the four display switches (time cost, current
// time, top-left logo, top-right achievements) into one expanding row.
let themeOthersOpen = false;
// Wallpaper → Manage folds out the three wallpaper options: Back, Blur and
// Wallpaper theme. It behaves like the Theme row's Manage drawer.
let wallpaperManageOpen = false;
let customThemeEditorOpen = false;
let customThemeDraft = null;
let customThemeBusy = false;
let pendingCustomThemeDeleteId = null;
// Settings → Theme uses one row with two selectors: the left "Theme" label
// switches the unit (the NeoTodo theme, the notebook palette, the AI console
// palette) and the right pill picks the theme inside that unit. New units can
// be appended here and inherit the same label and current-theme summary.
const THEME_UNITS = [
  { id: "app", label: "Theme" },
  { id: "note", label: "Note theme" },
  { id: "ai", label: "AI theme" },
];
// Caret uses the same row pattern as Theme: the left label switches between
// the shared caret, the notebook caret and the AI console caret; the right
// box opens one menu with Blink / Line / Block.
const CARET_UNITS = [
  { id: "app", label: "Caret" },
  { id: "note", label: "Note caret" },
  { id: "ai", label: "AI caret" },
];
// `themeFieldMode` is the unit currently shown in the row.
let themeFieldMode = "app";
// `caretFieldMode` is the caret unit currently shown in the row.
let caretFieldMode = "app";
// Font → Manage folds size and colour out under each font row.
const fontManageOpen = { body: false, note: false };

function randomPostcardId(exclude = null) {
  const pool = POSTCARD_IDS.filter((id) => id !== exclude);
  return pool[Math.floor(Math.random() * pool.length)] || "light";
}

function currentPostcardId() {
  const id = settings.resolved_postcard;
  return THEMES[id] ? id : "light";
}

function postcardIsDark(id) {
  const theme = THEMES[id];
  return theme ? hexLuminance(theme.paper || "#ffffff") < 0.45 : false;
}

function postcardName(id) {
  const theme = THEMES[id];
  if (!theme) return "Light";
  return theme.name;
}

function themeModeFor(id) {
  if (id === BASE_LIGHT_THEME) return "light";
  if (id === BASE_DARK_THEME) return "dark";
  return "custom";
}

/** A wallpaper the reader picked from their own disk is the room, not a
    property of the palette. On the wallpaper theme that room is also the face
    of the live subtask card, the finished card and the Doing card, and the
    background of the top hidden box. Switching the app theme must therefore
    never replace it with the new theme's art; Wallpaper → Manage → Back is how
    the reader returns to the theme's own room. */
function pickedWallpaperStaysOnThemeChange() {
  const kind = activeWallpaper().kind;
  return kind === "image" || kind === "video";
}

function applyThemeChoice(id) {
  const theme = THEMES[id];
  if (!theme) return false;
  // Read the current room before the palette changes: a picked wallpaper is
  // the reader's own room, so the theme must not replace it with its art.
  const keepPickedWallpaper = pickedWallpaperStaysOnThemeChange();
  settings.theme = "postcard";
  settings.postcard = id;
  settings.resolved_postcard = id;
  randomPicked = true;
  if (postcardIsDark(id)) settings.dark_postcard = id;
  else settings.light_postcard = id;
  const pack = themePacks.find((item) => item.id === id);
  // A theme brings its own room: the pack wallpaper when it ships one, the
  // built-in card art otherwise. The underline, add accent and selection wash
  // ride along in applyThemeChrome.
  if (!keepPickedWallpaper) {
    settings.wallpaper = pack?.wallpaper ? `theme:${id}` : `art:${id}`;
  }
  applyThemeChrome(id);
  saveSettings();
  applySettings();
  renderCategories();
  renderStage();
  if (archiveOpen) renderArchive();
  return true;
}

/** The theme-owned chrome colours: underline, add accent and selection wash. */
function themeChromeFor(id) {
  const pack = themePacks.find((item) => item.id === id);
  const chrome = pack && pack.chrome && typeof pack.chrome === "object" ? pack.chrome : null;
  return chrome || {};
}

/**
 * Apply the small colours a theme owns. They are written to the normal
 * page-line.json / baseline-rule.json files so the reader can still tweak them
 * afterwards; a theme without a chrome block leaves those files alone.
 */
function applyThemeChrome(id) {
  const chrome = themeChromeFor(id);
  const baseline = normalizeBaselineColorInput(chrome.baseline || "");
  if (baseline) {
    savePageLine({ color: baseline }, { immediate: true });
  }
  const row = normalizeBaselineColorInput(chrome.row || "");
  if (row) {
    saveBaselineRowRule({
      mode: "solid",
      color: row,
      color2: normalizeBaselineColorInput(chrome.row2 || "") || row,
    }, { immediate: true });
  }
  // An empty highlight means "follow the page's font ink"; the custom wash of
  // the previous theme must never leak into the new one.
  settings.highlight = normalizeHighlightColorInput(chrome.highlight || "");
  applyHighlight();
}

function defaultCustomThemeDraft() {
  const theme = THEMES[currentPostcardId()] || THEMES.light;
  return {
    name: "My theme",
    paper: theme.paper || "#f4ecfa",
    ink: theme.ink || "#3d2f4a",
    line: theme.line || theme.border || theme.accent2 || "#d4c0e6",
    accent: theme.accent || "#8d63b8",
    lineAlpha: Number.isFinite(Number(theme.lineAlpha)) ? Number(theme.lineAlpha) : 0.42,
    ruleAlpha: Number.isFinite(Number(theme.ruleAlpha)) ? Number(theme.ruleAlpha) : 0.28,
  };
}

function themeSymbol(kind) {
  if (kind === "header") return "tissue";
  if (kind === "archive") return "treasure";
  if (kind === "notes") return "pen-nib";
  if (kind === "completed") return "headphone";
  return "kite";
}

function completedIcon() {
  return MOON;
}

function formatTimeCost(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  if (!total) return "";
  if (total < 60) return `${total}s`;
  const minutes = Math.floor(total / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

function timeCostSeconds(todo) {
  if (todo && Number.isFinite(Number(todo.time_cost)) && Number(todo.time_cost) > 0) {
    return Number(todo.time_cost);
  }
  if (!todo?.created_at) return 0;
  const start = new Date(todo.created_at);
  const end = todo.completed_at ? new Date(todo.completed_at) : new Date();
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
}

function timeCostText(todo) {
  const seconds = timeCostSeconds(todo);
  return seconds > 0 ? formatTimeCost(seconds) : "—";
}

const state = { data: null, selectedCategoryId: null };
let clockTimer = null;

function showFatal(error) {
  const message = error?.stack || error?.message || String(error);
  const node = document.createElement("div");
  node.style.cssText = "position:fixed;left:16px;right:16px;bottom:16px;z-index:999;padding:14px 18px;border:1px solid rgba(243,139,168,.5);border-radius:12px;background:rgba(40,16,28,.96);color:#f5b8c8;font:12px/1.5 monospace;white-space:pre-wrap;box-shadow:0 20px 50px rgba(0,0,0,.5)";
  node.textContent = `NeoTodo error:\n${message}`;
  document.body.appendChild(node);
}
window.addEventListener("error", (event) => {
  // WebKit reports cross-origin failures as a bare "Script error." with no
  // stack. There is nothing actionable to show, so never flash a fatal box.
  if (!event.error && /^Script error\.?$/.test(String(event.message || ""))) return;
  showFatal(event.error || event.message);
});
window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  if (!reason?.stack && /^Script error\.?$/.test(String(reason?.message || reason || ""))) return;
  showFatal(reason);
});
let archiveOpen = false;
let trashOpen = false;
let openPluginId = null;
let pluginThemeObserver = null;
// In-theme sheets fade over the live notebook. Their stage is kept transparent
// until the fade ends, so the opaque paper fallback never flashes across the
// page (which reads as the notebook refreshing) while the panel closes.
let pluginCloseTimer = 0;
// Theme packs are installed into the user's data folder. They extend THEMES
// with a palette, and may also carry a wallpaper, foley samples and stickers.
let themePacks = [];
// Icon themes are their own shelf. They swap the small marks around the
// notebook without touching the paper, wallpaper, note palette or AI palette.
const ICON_THEME_SLOTS = ["tissue", "fan", "fanDone", "aiRunning", "aiDone", "aiDoneFinal", "achievement", "achievementGold", "checkDone", "rowBurn", "fork"];
const ICON_THEME_FALLBACK = Object.freeze({
  id: "classical",
  name: "Classical",
  englishName: "Classical",
  source: "bundled",
  builtin: true,
  icons: {},
});
let iconThemes = [ICON_THEME_FALLBACK];
let iconThemeFolder = "";
let iconImageObserver = null;
let iconImageScanQueued = false;
// Sound styles are folders under the sounds shelf. Classical is the bundled
// set every install starts on; another folder the reader adds becomes a style.
let soundStyles = [{ id: "classical", name: "Classical", files: [] }];
let soundFolder = "";
// The notebook and the console read their palettes from their own folders
// (note-theme/ and ai-theme/). Keeping them out of theme-packs means applying a
// NeoTodo theme can never repaint either pane.
let paneThemes = { note: [], ai: [] };
let paneThemeFolders = { note: "", ai: "" };
let themeCatalog = null;
let themeCatalogBusy = false;
let themePackBusy = "";
let themeCatalogAt = 0;
const THEME_SOUND_LABELS = {
  type: "Typing",
  enter: "Enter",
  drawerOpen: "Drawer open",
  drawerClose: "Drawer close",
  waterFlow: "Water flow",
  trickle: "Trickle",
  windScroll: "Wind scroll",
  train: "Train whistle",
  paperTear: "Paper tear",
  steamHiss: "Steam hiss",
};
// Small installable tools live in /plugins/<id>/. Each manifest describes the
// plugin well enough for Settings → Community → 插件 to list, toggle, open, and remove
// it without the main notebook knowing anything about the plugin internals.
const PLUGIN_REGISTRY = {
  pindou: {
    id: "pindou",
    title: "拼豆工坊",
    englishTitle: "Perler Bead Studio",
    version: "1.0.0",
    author: "NeoTodo",
    category: "Play",
    description: "把一颗颗小豆豆拼成画。粉花、爱心、星星、蘑菇和小猫都可以慢慢拼出来。",
    icon: "/plugins/pindou/pindou.svg",
    entry: "/plugins/pindou/index.html",
    settings: [
      { id: "sound", label: "Sound", detail: "Little bead clicks and a chime when a picture is finished.", type: "toggle", default: true },
    ],
  },
  palette: {
    id: "palette",
    title: "调色板",
    englishTitle: "Palette",
    version: "1.0.0",
    author: "NeoTodo",
    category: "Interface",
    description: "把页面横线、选区高亮和完成行收进一块调色板。打开后和 Settings 一样调节细节，改完立刻回到页面。",
    icon: "/plugins/palette/palette.svg",
    entry: "/plugins/palette/index.html",
    tags: ["intheme", "theme", "palette", "line", "page"],
  },
  // The weekly postcard archive is its own Settings-style sheet now. The host
  // keeps the archive and the big postcard viewer; this page only lists the
  // weeks and asks the host for a card when one is opened.
  postcard: {
    id: "postcard",
    title: "明信片",
    englishTitle: "Postcards",
    version: "1.0.0",
    author: "NeoTodo",
    category: "Interface",
    description: "每一周完成的事情都印成一张明信片。点击左栏的图片图标，和 Settings 一样在应用内打开档案：按年份和月份翻看，点一张卡片就能在原来的位置展开。",
    icon: "/plugins/postcard/postcard.svg",
    entry: "/plugins/postcard/index.html",
    tags: ["intheme", "postcard", "archive", "weekly"],
  },
  // The community shop is its own plugin now. It is a Settings-style sheet
  // (intheme), installed from the Available list, and owns the browser that
  // used to live behind Settings → Community.
  community: {
    id: "community",
    title: "社区",
    englishTitle: "Community",
    version: "1.0.0",
    author: "NeoTodo",
    category: "Interface",
    description: "把 Settings 里的社区商店搬进插件：浏览插件、游戏和主题，安装后直接在这里打开，不用再回 Settings。打开时沿用当前应用主题。",
    icon: "/plugins/community/community.svg",
    entry: "/plugins/community/index.html",
    tags: ["intheme", "community", "plugins", "themes", "社区"],
    defaultInstalled: false,
  },
  "completed-drawer": {
    id: "completed-drawer",
    title: "完成抽屉",
    englishTitle: "Completed Drawer",
    version: "1.0.0",
    author: "NeoTodo",
    category: "Interface",
    description: "把完成的子任务收进右下角的紫色小卡片，横线向下拉即可展开。关闭后，完成的任务会和其他任务排在一起。",
    icon: "/plugins/completed-drawer/completed-drawer.svg",
    entry: "/plugins/completed-drawer/index.html",
  },
  "storage-box": {
    id: "storage-box",
    title: "收纳箱",
    englishTitle: "Storage Box",
    version: "1.0.0",
    author: "NeoTodo",
    category: "Interface",
    description: "把暂时不用的分类收进左下角的箱子：点箱子打开收纳模式，点分类把它放进去；再点箱子里的分类就能放回列表最后。",
    icon: "/plugins/storage-box/storage-box.svg",
    entry: "/plugins/storage-box/index.html",
  },
  forktree: {
    id: "forktree",
    title: "Forktree",
    englishTitle: "Fork Tree",
    version: "1.2.0",
    author: "NeoTodo",
    category: "Interface",
    description: "把子任务 fork 成独立端口的 NeoTodo 窗口：子任务变成假 todo，完成不计入主应用成就，保留原笔记与 AI 对话，并可以继续添加子子任务。",
    icon: "/plugins/forktree/forktree.svg",
    entry: "/plugins/forktree/index.html",
  },
  // The tomato clock starts out as an optional achievement plugin. Plugins
  // tagged "achievement" own a slot in the top-right header; installing this
  // one reveals the tomato counter and shifts the headphone left for it.
  pomodoro: {
    id: "pomodoro",
    title: "番茄钟",
    englishTitle: "Pomodoro",
    version: "1.0.0",
    author: "NeoTodo",
    category: "Interface",
    description: "番茄钟带“成就”标记：安装后，右上角会出现番茄计数器。每完成一次 25 分钟的专注，番茄数就加一。",
    icon: "/plugins/pomodoro/pomodoro.svg",
    entry: "/plugins/pomodoro/index.html",
    tags: ["achievement", "focus", "timer", "成就"],
    defaultInstalled: false,
  },
};
let pluginDetailId = null;
let pluginPendingUninstallId = null;
// The community index is cached in memory after the first open. Downloads land
// in the user's data folder and are detected through /api/plugins, so a plugin
// never has to be compiled into the notebook.
let pluginCatalog = null;
let pluginCatalogLoading = false;
let pluginCatalogError = "";
let pluginCatalogRequest = null;
let pluginCommunityFilter = "all";
let pluginCommunityQuery = "";
// Community is its own window with three shelves. The last shelf stays put
// while the user toggles plugins, so coming back never loses their place.
let communitySection = "plugins";
// Community and Settings are separate sheets: opening one closes the other.
let communityModalOpen = false;
let pluginInstalling = new Set();
let installedUserPlugins = [];
let restoringTrashId = null;
let expandedArchiveCardId = null;
let archiveCardSwipeUntil = 0;
let completedOpen = false;
let completedSearch = "";
let focusSearch = "";
let completedExpanded = new Set();
// Completed subtasks live behind a short handle line under the top edge of
// the subtask column, drawn like the note/AI door lines. The drawer is
// anchored to one todo so switching tasks always starts collapsed again.
let completedSubtasksOpen = false;
let completedSubtasksTodoId = null;
let suppressCompletedSubtaskToggleUntil = 0;
// The live rows are a card of their own. Its purple handle line lies on the
// card's bottom edge; a click folds the whole card away and the same line
// brings it back. The fold belongs to the task on screen, so switching tasks
// always starts with the rows showing.
let pendingSubtasksCollapsed = false;
let pendingSubtasksTodoId = null;
// A stretched edge is a drag, not a click; the click that follows must not
// flip the card a second time.
let suppressPendingSubtaskToggleUntil = 0;
// Each handle line only exists while its lane holds something. `null` means
// "not measured yet", so the opening frame of the app never plays a pull-out
// animation on a page the reader has not touched.
let pendingHandleLineShown = null;
let completedHandleLineShown = null;
// Finishing a subtask pops the card open so the row can fly into it. Once the
// row has landed the card lingers for a beat, then tucks itself away again.
let completedSubtasksAutoCloseTimer = null;
const COMPLETED_DRAWER_DWELL_MS = 300;
const COMPLETED_ROW_FLIGHT_MS = 340;
// The tray opens with the new rule already printed, and the rows below are
// pushed down in one composited move. The finished row crosses the page while
// that short push finishes, so its line is always waiting when it lands.
const COMPLETED_DRAWER_OPEN_MS = 40;
const COMPLETED_DRAWER_DROP_MS = 120;
const COMPLETED_ROWS_PUSH_MS = 160;
// While a finished row is in the air, its flight owns the frame budget: heavy
// card work (baking wallpaper panes, rebuilding the Doing card) waits for the
// landing instead of stealing the animation's first frames.
let completionFlightUntil = 0;
let historyCursor = -1;
let lastTypeSoundAt = 0;
let lastTetrisKeyAt = 0;

function playTypeSound() {
  const now = performance.now();
  if (now - lastTypeSoundAt < 35) return;
  lastTypeSoundAt = now;
  AudioFX.unlock();
  AudioFX.type();
}

// The AI composer is a keyboard with a Tetris tint: every edit gets a bright
// key click, while deletes land on a separate dry swipe.
function playTetrisKeySound(inputType = "") {
  const now = performance.now();
  if (now - lastTetrisKeyAt < 30) return;
  lastTetrisKeyAt = now;
  AudioFX.unlock();
  if (String(inputType).startsWith("delete")) AudioFX.tetrisErase();
  else AudioFX.tetrisMove();
}
let historyScrollTop = null;
let indexOpenWidth = 320;
let historyExpanded = new Set();
let selectedHistoryId = null;
let selectedSubtaskId = null;
let trophyDisplayHold = null;
let suppressSubtaskRenameUntil = 0;
let subtaskDragStart = null;
let justCompletedSubtaskId = null;
// Reopening is async; a second click on the same finished fan must not send a
// duplicate request that ends in an error toast.
let reopeningSubtaskIds = new Set();
let lastAddedSubtaskId = null;
let categoryDrag = null;
let suppressCategoryClickUntil = 0;
let doingPeekOpen = false;
// Which todo rows the reader left open in the Doing card. The rows belong to
// the card, not to the moment it is on screen: closing the drawer used to fold
// every row back to its head, so the next peek always started collapsed. Keep
// the open rows in localStorage and restore them on the next peek or launch,
// the same way the dock side is remembered.
const DOING_EXPANDED_KEY = "neotodo.doingExpandedTodoIds.v1";
let doingExpandedTodoIds = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem(DOING_EXPANDED_KEY) || "[]");
    if (Array.isArray(saved)) {
      return new Set(saved.filter((id) => typeof id === "string" && id));
    }
  } catch (error) {}
  return new Set();
})();
function saveDoingExpandedTodoIds() {
  try { localStorage.setItem(DOING_EXPANDED_KEY, JSON.stringify([...doingExpandedTodoIds])); } catch (error) {}
}
let doingMarkedTodoId = null;
let doingMarkedSubtaskId = null;
let doingPeekOpenTimer = 0;
let doingPeekPoint = { x: 0, y: 0, target: null };
let doingZone = null;
let doingZoneAt = 0;
let doingCardWidth = 380;
let doingCardTop = 0;
let doingCardHeight = 600;
let doingPanelRect = null;
// The Doing card is a drawer on the subtask column's border. Hold the card and
// pull it to the other border to hide or open it there; nothing else about the
// card changes: same size, same height, same trigger band, only the anchored
// border moves. The chosen border is remembered like the AI split side.
const DOING_DOCK_SIDE_KEY = "neotodo.doingDockSide.v1";
let doingDockSide = (() => {
  try {
    const saved = localStorage.getItem(DOING_DOCK_SIDE_KEY);
    if (saved === "left" || saved === "right") return saved;
  } catch (error) {}
  return "right";
})();
// The measured subtask column; its own left/right borders are the two homes.
let doingHome = null;
// A pinned card remembers the spot the reader dropped it on. While this is set
// the drawer ignores its border homes and appears at that box; the close pin
// clears it and glides the card back to the border it came from.
const DOING_FLOAT_KEY = "neotodo.doingFloatPosition.v1";
let doingFloat = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem(DOING_FLOAT_KEY) || "null");
    if (saved && Number.isFinite(saved.left) && Number.isFinite(saved.top)) {
      return { left: saved.left, top: saved.top };
    }
  } catch (error) {}
  return null;
})();
function saveDoingFloat() {
  try {
    if (doingFloat) localStorage.setItem(DOING_FLOAT_KEY, JSON.stringify(doingFloat));
    else localStorage.removeItem(DOING_FLOAT_KEY);
  } catch (error) {}
}
let doingDrag = null;
let doingPress = null;
let doingDragClickUntil = 0;
let doingPointerFrame = 0;
let doingDragX = 0;
let doingDragY = 0;
let doingDragFrame = 0;
let doingGlideToken = 0;
let agentTerminalOpen = false;
let panelPreview = null;
let singleDock = null;
let detachedMode = "";
let detachedAgentOverride = null;
let detachedNoteTargetOverride = null;
// A fork window keeps its own index: the branch category plus any categories
// created inside that branch, while the main window still lists everything.
let forkRootId = null;
// Forks from the first Forktree build were stored as categories. Once they
// have been imported into the plugin store, their old rows stay hidden.
let legacyForkCategoryIds = new Set();
let agentSessions = {};
const agentBusyIds = new Set();
// Runs the user stopped on purpose. They settle with a reply, but they are
// not "finished work", so the board must not play the completion ceremony.
const agentPausedIds = new Set();
const agentQueuedIds = new Set();
const agentQueuePositions = {};
const agentRunMessages = {};
const agentDrafts = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem("neotodo.agentDrafts") || "{}");
    return saved && typeof saved === "object" ? saved : {};
  } catch (error) { return {}; }
})();
let agentDraftTimer = 0;
let agentInputAgentId = null;

function persistAgentDrafts() {
  try { localStorage.setItem("neotodo.agentDrafts", JSON.stringify(agentDrafts)); } catch (error) {}
}
function saveAgentDraft(agentId, text) {
  if (!agentId) return;
  agentDrafts[agentId] = String(text ?? "");
  clearTimeout(agentDraftTimer);
  agentDraftTimer = setTimeout(persistAgentDrafts, 160);
}
function clearAgentDraft(agentId) {
  if (!agentId) return;
  delete agentDrafts[agentId];
  clearTimeout(agentDraftTimer);
  persistAgentDrafts();
}
function resizeAgentInput(input) {
  if (!input) return;
  input.style.height = "auto";
  input.style.height = `${Math.min(170, Math.max(66, input.scrollHeight))}px`;
}
// Runs started in another window (a detached AI panel) leave a stamp here so
// the notebook window can lift the same todo in its Doing card.
const AGENT_RUN_STALE_MS = 16 * 60 * 1000;
const runningAgentStamps = {};
try {
  const storedRunning = JSON.parse(localStorage.getItem("neotodo.runningAgents") || "{}");
  const cutoff = Date.now() - AGENT_RUN_STALE_MS;
  if (storedRunning && typeof storedRunning === "object" && !Array.isArray(storedRunning)) {
    for (const [id, when] of Object.entries(storedRunning)) {
      const stamp = Number(when);
      if (id && Number.isFinite(stamp) && stamp > cutoff) runningAgentStamps[id] = stamp;
    }
  }
} catch (error) {}
// Build agents run in parallel; the backend only waits when two agents
// claim the same file in the same project.
let agentModels = [];
let agentDefaultModel = "deepseek/deepseek-flash";
let agentDefaultModels = {};
let agentDefaultModes = {};

// Last model used by each subtask agent, shown to the left of its fan.
let pendingProjectFolder = "";
let subtaskAgentModels = {};
try {
  const storedModels = JSON.parse(localStorage.getItem("neotodo.subtaskModels") || "{}");
  if (storedModels && typeof storedModels === "object" && !Array.isArray(storedModels)) {
    subtaskAgentModels = storedModels;
  }
} catch (error) {}
const subtaskModelRecent = new Set();

// When each subtask last finished an AI run. It counts as that subtask's
// activity time, so the row rises above older work and keeps its place after
// a reload until something newer happens.
const subtaskAiFinishedAt = {};
try {
  const storedFinished = JSON.parse(localStorage.getItem("neotodo.subtaskAiFinishedAt") || "{}");
  if (storedFinished && typeof storedFinished === "object" && !Array.isArray(storedFinished)) {
    for (const [id, when] of Object.entries(storedFinished)) {
      if (id && typeof when === "string") subtaskAiFinishedAt[id] = when;
    }
  }
} catch (error) {}

function saveSubtaskAiFinishedAt() {
  try { localStorage.setItem("neotodo.subtaskAiFinishedAt", JSON.stringify(subtaskAiFinishedAt)); } catch (error) {}
}

// When each todo last finished its own AI agent, used to lift the todo card.
const todoAiFinishedAt = {};
try {
  const storedTodoFinished = JSON.parse(localStorage.getItem("neotodo.todoAiFinishedAt") || "{}");
  if (storedTodoFinished && typeof storedTodoFinished === "object" && !Array.isArray(storedTodoFinished)) {
    for (const [id, when] of Object.entries(storedTodoFinished)) {
      if (id && typeof when === "string") todoAiFinishedAt[id] = when;
    }
  }
} catch (error) {}

function saveTodoAiFinishedAt() {
  try { localStorage.setItem("neotodo.todoAiFinishedAt", JSON.stringify(todoAiFinishedAt)); } catch (error) {}
}

// Subtasks whose agent just finished. The Doing card lights their fan and the
// todo's napkin with fireflies (dark) or embers (light) until the note is open.
const unseenAgentSubtasks = new Set();
try {
  const storedUnseen = JSON.parse(localStorage.getItem("neotodo.unseenAgentSubtasks") || "[]");
  if (Array.isArray(storedUnseen)) {
    storedUnseen.forEach((id) => { if (id) unseenAgentSubtasks.add(String(id)); });
  }
} catch (error) {}

function saveUnseenAgentSubtasks() {
  try { localStorage.setItem("neotodo.unseenAgentSubtasks", JSON.stringify([...unseenAgentSubtasks])); } catch (error) {}
}

function noteSubtaskAgentFinished(subtaskId) {
  const id = String(subtaskId || "");
  if (!id) return;
  subtaskAiFinishedAt[id] = new Date().toISOString();
  saveSubtaskAiFinishedAt();
  // Every finished run leaves a fresh marker, even when its conversation is
  // already open. Viewing the subtask or reopening its AI panel clears it, so
  // each new completion lights the Doing card again.
  unseenAgentSubtasks.add(id);
  saveUnseenAgentSubtasks();
  if (doingPeekOpen) updateDoingPeek(true);
  reorderCurrentSubtaskRows(id);
}

function noteTodoAgentFinished(todoId) {
  const id = String(todoId || "");
  if (!id) return;
  todoAiFinishedAt[id] = new Date().toISOString();
  saveTodoAiFinishedAt();
  if (doingPeekOpen) updateDoingPeek(true);
}

function clearUnseenAgentSubtask(subtaskId) {
  if (!subtaskId || !unseenAgentSubtasks.has(subtaskId)) return;
  unseenAgentSubtasks.delete(subtaskId);
  saveUnseenAgentSubtasks();
  if (doingPeekOpen) updateDoingPeek(true);
}

function pruneUnseenAgentSubtasks() {
  if (!state.data?.categories) return;
  const valid = new Set();
  const validTodos = new Set();
  for (const category of state.data?.categories || []) {
    for (const todo of category.todos || []) {
      if (todo.done) continue;
      validTodos.add(String(todo.id));
      // A finished subtask keeps its unseen marker so the Doing card stays
      // lit until the reader opens that subtask's note.
      for (const subtask of todo.subtasks || []) {
        valid.add(subtask.id);
      }
    }
  }
  let changed = false;
  for (const id of [...unseenAgentSubtasks]) {
    if (!valid.has(id)) {
      unseenAgentSubtasks.delete(id);
      changed = true;
    }
  }
  if (changed) saveUnseenAgentSubtasks();
  let staleFinished = false;
  for (const id of Object.keys(subtaskAiFinishedAt)) {
    if (!valid.has(id)) {
      delete subtaskAiFinishedAt[id];
      staleFinished = true;
    }
  }
  if (staleFinished) saveSubtaskAiFinishedAt();
  let staleTodos = false;
  for (const id of Object.keys(todoAiFinishedAt)) {
    if (!validTodos.has(id)) {
      delete todoAiFinishedAt[id];
      staleTodos = true;
    }
  }
  if (staleTodos) saveTodoAiFinishedAt();
}

function todoHasUnseenAgentSubtasks(todo) {
  // Finished subtasks count too, so their agent's light stays on the Doing
  // card until the subtask's note is opened.
  return (todo?.subtasks || []).some((subtask) => unseenAgentSubtasks.has(subtask.id));
}

/** Pull AI completion markers written by a detached AI window. */
function syncAgentFinishMemory() {
  let changed = false;
  try {
    const storedUnseen = JSON.parse(localStorage.getItem("neotodo.unseenAgentSubtasks") || "[]");
    if (Array.isArray(storedUnseen)) {
      for (const value of storedUnseen) {
        const id = String(value || "");
        if (id && !unseenAgentSubtasks.has(id)) {
          unseenAgentSubtasks.add(id);
          changed = true;
        }
      }
    }
  } catch (error) {}
  try {
    const storedFinished = JSON.parse(localStorage.getItem("neotodo.subtaskAiFinishedAt") || "{}");
    if (storedFinished && typeof storedFinished === "object" && !Array.isArray(storedFinished)) {
      for (const [id, when] of Object.entries(storedFinished)) {
        if (id && typeof when === "string" && subtaskAiFinishedAt[id] !== when) {
          subtaskAiFinishedAt[id] = when;
          changed = true;
        }
      }
    }
  } catch (error) {}
  try {
    const storedTodoFinished = JSON.parse(localStorage.getItem("neotodo.todoAiFinishedAt") || "{}");
    if (storedTodoFinished && typeof storedTodoFinished === "object" && !Array.isArray(storedTodoFinished)) {
      for (const [id, when] of Object.entries(storedTodoFinished)) {
        if (id && typeof when === "string" && todoAiFinishedAt[id] !== when) {
          todoAiFinishedAt[id] = when;
          changed = true;
        }
      }
    }
  } catch (error) {}
  return changed;
}

function saveRunningAgentStamps() {
  try { localStorage.setItem("neotodo.runningAgents", JSON.stringify(runningAgentStamps)); } catch (error) {}
}

/** Remember that an AI run is working, including for other windows. */
function noteAgentRunStarted(agentId) {
  const id = String(agentId || "");
  if (!id) return;
  runningAgentStamps[id] = Date.now();
  saveRunningAgentStamps();
}

function noteAgentRunFinished(agentId) {
  const id = String(agentId || "");
  if (!id || !(id in runningAgentStamps)) return;
  delete runningAgentStamps[id];
  saveRunningAgentStamps();
}

/** Pull running markers written by a detached AI window and drop stale ones. */
function syncRunningAgentMemory() {
  let stored = {};
  try {
    const raw = JSON.parse(localStorage.getItem("neotodo.runningAgents") || "{}");
    const cutoff = Date.now() - AGENT_RUN_STALE_MS;
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      for (const [id, when] of Object.entries(raw)) {
        const stamp = Number(when);
        if (id && Number.isFinite(stamp) && stamp > cutoff) stored[id] = stamp;
      }
    }
  } catch (error) {
    return false;
  }
  let changed = false;
  for (const id of Object.keys(runningAgentStamps)) {
    if (!(id in stored)) changed = true;
  }
  for (const [id, stamp] of Object.entries(stored)) {
    if (runningAgentStamps[id] !== stamp) changed = true;
  }
  if (!changed) return false;
  for (const id of Object.keys(runningAgentStamps)) delete runningAgentStamps[id];
  Object.assign(runningAgentStamps, stored);
  saveRunningAgentStamps();
  return true;
}

// Runs started in another window (a fork or the main notebook) live only on
// the backend until this page asks for them. Ask on boot and whenever the
// window wakes up, so such an agent's fan spins (and can be paused) exactly
// like a run started here.
let agentRunningSyncAt = 0;
let agentRunningSyncBusy = false;
async function syncBackendRunningAgents(force = false) {
  if (agentRunningSyncBusy) return false;
  if (!force && Date.now() - agentRunningSyncAt < 4000) return false;
  agentRunningSyncAt = Date.now();
  agentRunningSyncBusy = true;
  try {
    const data = await agentPost({ action: "running" });
    if (!data.ok || !Array.isArray(data.running)) return false;
    const live = new Set(data.running.map((id) => String(id)));
    let changed = false;
    const lost = [];
    for (const id of Object.keys(runningAgentStamps)) {
      // A run this window just started may reach the backend a poll later;
      // never drop its stamp in that gap.
      if (!live.has(id) && !agentBusyIds.has(id)) {
        delete runningAgentStamps[id];
        changed = true;
        lost.push(id);
      }
    }
    for (const id of live) {
      if (!(id in runningAgentStamps)) {
        runningAgentStamps[id] = Date.now();
        changed = true;
      }
    }
    if (!changed) return false;
    saveRunningAgentStamps();
    // The visible rows follow the stamps: another window's run starts or stops
    // here, without waiting for the next full render.
    document.querySelectorAll(".current-subtask[data-subtask-id]").forEach((row) => {
      const subtaskId = row.dataset.subtaskId;
      const on = agentIsRunning(`subtask:${subtaskId}`);
      if (row.classList.contains("agent-running") !== on) {
        updateSubtaskAgentDom(subtaskId, { running: on });
      }
    });
    syncAgentFanSpins();
    reorderCurrentSubtaskRows();
    if (doingPeekOpen) updateDoingPeek(true);
    // A run started in another window can finish while its conversation is
    // closed. Read the settled turn once so the board still lights its
    // finished-work hint.
    for (const id of lost) {
      if (id.startsWith("subtask:") && !agentPausedIds.has(id)) {
        noteBackendRunFinished(id.slice(8));
      }
    }
    return true;
  } catch (error) {
    return false;
  } finally {
    agentRunningSyncBusy = false;
  }
}

/** Mark a backend-only run as finished unless the user paused it. */
function noteBackendRunFinished(subtaskId) {
  agentPost({ action: "get", agent_id: `subtask:${subtaskId}` })
    .then((data) => {
      const messages = Array.isArray(data?.agent?.messages) ? data.agent.messages : [];
      const last = messages[messages.length - 1];
      if (!last || last.pending || last.interrupted) return;
      noteSubtaskAgentFinished(subtaskId);
    })
    .catch(() => {});
}

/** Update the visible order after an AI run happens in another window. */
function refreshAgentFinishViews() {
  syncBackendRunningAgents().catch(() => {});
  const runningChanged = syncRunningAgentMemory();
  const finishedChanged = syncAgentFinishMemory();
  if (!runningChanged && !finishedChanged) return;
  if (finishedChanged) {
    let newest = null;
    let newestStamp = 0;
    for (const subtask of currentTodo()?.subtasks || []) {
      if (subtask.done) continue;
      const when = stampValue(subtaskAiFinishedAt[subtask.id]);
      if (when > newestStamp) {
        newestStamp = when;
        newest = subtask;
      }
    }
    reorderCurrentSubtaskRows(newest?.id || "");
  } else {
    reorderCurrentSubtaskRows();
  }
  if (doingPeekOpen) updateDoingPeek(true);
}

const MODEL_ICON_IDS = {
  deepseek: "deepseek", openai: "openai", anthropic: "anthropic", claude: "claude",
  google: "google", gemini: "gemini", openrouter: "openrouter", ollama: "ollama",
  "ollama-cloud": "ollama", mistral: "mistral", mistralai: "mistral", meta: "meta",
  "meta-llama": "meta", xai: "xai", "x-ai": "xai", qwen: "qwen", dashscope: "qwen",
  alibaba: "qwen", "alibaba-cloud": "qwen", zhipu: "zhipu", zhipuai: "zhipu",
  bigmodel: "zhipu", moonshot: "moonshot", moonshotai: "moonshot", kimi: "moonshot",
  groq: "groq", together: "together", togetherai: "together", "together-ai": "together",
  "google-vertex": "google", vertex: "google", "vertex-ai": "google",
  opencode: "lobehub",
};

/* Providers that resell many vendors (or have no brand of their own): the mark
   should come from the model name, not from the gateway prefix. */
const MODEL_ICON_GATEWAYS = new Set([
  "opencode", "opencode-zen", "opencodezen", "vercel", "requesty", "helicone",
  "litellm", "openai-compatible", "custom", "local", "github-copilot", "copilot",
  "azure", "amazon-bedrock", "bedrock",
]);

const MODEL_ICON_HINTS = [
  [/^(claude|sonnet|opus|haiku)/, "claude"],
  [/^(gpt|chatgpt|codex|o1|o3|o4)/, "openai"],
  [/^gemini/, "gemini"],
  [/^grok/, "xai"],
  [/^(qwen|qwq)/, "qwen"],
  [/^(kimi|moonshot)/, "moonshot"],
  [/^(glm|chatglm)/, "zhipu"],
  [/^deepseek/, "deepseek"],
  [/^(mistral|codestral|mixtral|pixtral)/, "mistral"],
  [/^(llama|meta-llama)/, "meta"],
];

function modelIconHint(name) {
  for (const [pattern, icon] of MODEL_ICON_HINTS) {
    if (pattern.test(name)) return icon;
  }
  return "";
}

function modelIconId(model) {
  const value = String(model || "").trim();
  const parts = value.split("/").filter(Boolean);
  const provider = (parts[0] || "").toLowerCase();
  const leaf = (parts.length > 1 ? parts[parts.length - 1] : value).toLowerCase();
  const direct = MODEL_ICON_IDS[provider] || "";
  if (direct && direct !== "lobehub" && !MODEL_ICON_GATEWAYS.has(provider)) return direct;
  // Gateways and unknown vendors follow the model name so the badge still
  // names whoever actually produced the answer.
  return modelIconHint(leaf) || direct || "lobehub";
}

/* A failed icon request must never leave a grey broken-image box in the row:
   retry once, then drop the badge instead. */
function rescueModelIcon(img) {
  const slot = img.closest(".sub-agent-model");
  if (!slot) return;
  if (!img.dataset.retried) {
    img.dataset.retried = "1";
    img.src = `${img.getAttribute("src")}?retry=${Date.now()}`;
    return;
  }
  slot.classList.add("icon-failed");
  slot.classList.remove("has-model", "pop");
  slot.innerHTML = "";
}

window.addEventListener("error", (event) => {
  const target = event.target;
  if (target instanceof HTMLImageElement && target.closest(".sub-agent-model")) {
    rescueModelIcon(target);
  }
}, true);

function saveSubtaskAgentModels() {
  try { localStorage.setItem("neotodo.subtaskModels", JSON.stringify(subtaskAgentModels)); } catch (error) {}
}

function subtaskModelIconHtml(subtaskId) {
  const model = subtaskAgentModels[subtaskId] || "";
  if (!model) return `<span class="sub-agent-model" aria-hidden="true"></span>`;
  const pop = subtaskModelRecent.has(subtaskId) ? "pop" : "";
  // A badge rebuilt from saved state is an old run: show the settled mark,
  // never replay the whole emerge animation just because the page repainted.
  return `<span class="sub-agent-model has-model ai-done-settled ${pop}"><img src="/model-icons/${modelIconId(model)}.svg" alt=""></span>`;
}

function startFanSpin(rotor) {
  if (!rotor || rotor._fanSpin || typeof rotor.animate !== "function") return;
  try {
    const anim = rotor.animate(
      [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
      { duration: 320, iterations: Infinity, easing: "linear" }
    );
    anim.playbackRate = 0.25;
    rotor._fanSpin = anim;
    const started = performance.now();
    const tick = (now) => {
      if (rotor._fanSpin !== anim) return;
      const t = Math.min(1, (now - started) / 420);
      anim.playbackRate = 0.25 + t * 0.85;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  } catch (error) {}
}

function stopFanSpin(rotor) {
  if (!rotor) return;
  const anim = rotor._fanSpin;
  if (!anim) return;
  rotor._fanSpin = null;
  const from = Number(anim.playbackRate) || 1;
  const started = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - started) / 520);
    try { anim.playbackRate = Math.max(0, from * (1 - t)); } catch (error) {}
    if (t < 1) requestAnimationFrame(tick);
    else {
      try { anim.cancel(); } catch (error) {}
    }
  };
  requestAnimationFrame(tick);
}

function syncAgentFanSpins() {
  document.querySelectorAll(".current-subtask").forEach((row) => {
    const rotor = row.querySelector(".fan-rotor");
    if (!rotor) return;
    if (row.classList.contains("agent-running")) startFanSpin(rotor);
    else stopFanSpin(rotor);
  });
}

// The tallnut idle loop is ~1.36s. Let a fresh run finish it once, then hold
// the last frame in a tiny shake instead of looping the badge forever.
const AI_DONE_SETTLE_MS = 1400;

function settleAgentDoneIcon(slot, delay = AI_DONE_SETTLE_MS) {
  if (!slot) return;
  clearTimeout(slot._agentDoneSettleTimer);
  slot.classList.remove("ai-done-settled");
  slot._agentDoneSettleTimer = setTimeout(() => {
    if (slot.isConnected && slot.classList.contains("has-model")) {
      slot.classList.add("ai-done-settled");
    }
  }, delay);
}

function updateSubtaskAgentDom(subtaskId, { running = null, model = null, pop = false } = {}) {
  const row = document.querySelector(`.current-subtask[data-subtask-id="${CSS.escape(subtaskId)}"]`);
  if (!row) return;
  if (running !== null) {
    const wasRunning = row.classList.contains("agent-running");
    row.classList.toggle("agent-running", Boolean(running));
    const rotor = row.querySelector(".fan-rotor");
    if (running && !wasRunning) startFanSpin(rotor);
    else if (!running && wasRunning) stopFanSpin(rotor);
    if (running) {
      // A fresh run hides the previous provider mark until it finishes.
      const activeSlot = row.querySelector(".sub-agent-model");
      if (activeSlot) {
        clearTimeout(activeSlot._agentDoneSettleTimer);
        activeSlot.innerHTML = "";
        activeSlot.classList.remove("has-model", "pop", "ai-done-settled");
      }
      return;
    }
  }
  const slot = row.querySelector(".sub-agent-model");
  if (!slot) return;
  const nextModel = model !== null ? model : (subtaskAgentModels[subtaskId] || "");
  if (!nextModel) {
    clearTimeout(slot._agentDoneSettleTimer);
    slot.innerHTML = "";
    slot.removeAttribute("title");
    slot.classList.remove("pop", "has-model", "ai-done-settled");
    return;
  }
  slot.classList.add("has-model");
  slot.innerHTML = `<img src="/model-icons/${modelIconId(nextModel)}.svg" alt="">`;
  slot.classList.toggle("pop", Boolean(pop));
  if (pop) {
    setTimeout(() => slot.classList.remove("pop"), 950);
    // A finished run: play the emerge gif once, then settle its last frame.
    settleAgentDoneIcon(slot);
  } else {
    // Pause / restore is not a fresh finish; skip the entrance.
    clearTimeout(slot._agentDoneSettleTimer);
    slot.classList.add("ai-done-settled");
  }
}
let agentModelsLoading = null;
const agentLoadedIds = new Set();
const agentLoadingIds = new Set();
const agentLive = {};
const agentPollTimers = new Map();
const agentAttachments = {};
const agentUploadingIds = new Set();
let agentModelMenuOpen = false;
let agentModeMenuOpen = false;
let agentSplitSide = (() => {
  try {
    const saved = localStorage.getItem("neotodo.agentSplitSide.v2");
    if (saved === "notes-left" || saved === "notes-right") {
      localStorage.setItem("neotodo.agentSplitSide.horizontal.v1", saved);
      return saved;
    }
    const horizontal = localStorage.getItem("neotodo.agentSplitSide.horizontal.v1");
    return horizontal === "notes-left" || horizontal === "notes-right" ? horizontal : "notes-right";
  } catch (error) { return "notes-right"; }
})();
let agentSplitRatio = (() => {
  try {
    const value = Number(localStorage.getItem("neotodo.agentSplitRatio.v2"));
    return Number.isFinite(value) && value >= 0.28 && value <= 0.72 ? value : 0.5;
  } catch (error) { return 0.5; }
})();
let agentSplitDrag = null;
function rememberHorizontalSplit() {
  if (agentSplitSide !== "notes-left" && agentSplitSide !== "notes-right") return;
  try { localStorage.setItem("neotodo.agentSplitSide.horizontal.v1", agentSplitSide); } catch (error) {}
}
function resetSplitToHorizontal() {
  if (agentSplitSide !== "notes-top" && agentSplitSide !== "notes-bottom") return;
  let side = "notes-right";
  try {
    const saved = localStorage.getItem("neotodo.agentSplitSide.horizontal.v1");
    if (saved === "notes-left" || saved === "notes-right") side = saved;
  } catch (error) {}
  agentSplitSide = side;
  agentSplitRatio = 0.5;
  try {
    localStorage.setItem("neotodo.agentSplitSide.v2", side);
    localStorage.setItem("neotodo.agentSplitRatio.v2", "0.5");
  } catch (error) {}
}
let agentClosing = false;
let notesClosing = false;
let doingPeekSignature = "";
let addingSubtask = false;
let addingSubtaskTodoId = null;
let revealNewSubtask = false;
let celebrateNewSubtask = false;
let notesPreview = false;
let notesPanelRect = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem("neotodo.notesRect") || "null");
    if (saved && ["left", "top", "width", "height"].every((key) => Number.isFinite(saved[key]))) return saved;
  } catch (error) {}
  return { left: 0.11, top: 0.50, width: 0.78, height: 0.48 };
})();

function saveNotesPanelRect() {
  try { localStorage.setItem("neotodo.notesRect", JSON.stringify(notesPanelRect)); } catch (error) {}
}

// Remember the last workspace shape so relaunching the app lands the user on
// the same category, selection and open note/AI sheets. Only the main notebook
// writes this: fork and detached windows must not overwrite it.
//
// There is no cached page: `stageWorkspaceView()` puts the saved shape in place
// before the first `render()`, so relaunching paints the page the user left as
// the live page in one pass instead of opening a default page, then moving the
// panels, or painting a screenshot of the previous session over the window.
const VIEW_STATE_KEY = "neotodo.viewState.v1";
let viewStateReady = false;

function readViewState() {
  try {
    const saved = JSON.parse(localStorage.getItem(VIEW_STATE_KEY) || "null");
    return saved && typeof saved === "object" ? saved : null;
  } catch (error) { return null; }
}

// The AI sheet keeps its own box, and a door-line drag writes that box
// directly (top/height on the panel), so the rendered height -- not the root
// variable -- is the page's real shape. A stacked note/AI split owns the
// geometry itself and must not leak into the remembered height.
function rememberedAiSheetHeight() {
  if (!agentTerminalOpen || document.body.classList.contains("agent-notes-axis-y")) return 0;
  const panel = $("#agent-terminal");
  if (!panel) return 0;
  // Only a deliberately sized sheet is worth remembering. The default box is
  // re-measured from the subtask area on every launch, so a window resize can
  // move it without leaving a stale pixel height behind.
  const boxed = sheetHeightCustom
    || panel.style.getPropertyValue("height")
    || panel.style.getPropertyValue("top");
  if (!boxed) return 0;
  const height = panel.getBoundingClientRect().height || 0;
  return height > 0 ? Math.round(height) : 0;
}

function saveViewState() {
  if (!viewStateReady || detachedMode || !state.data) return;
  const target = activeNoteTarget();
  try {
    localStorage.setItem(VIEW_STATE_KEY, JSON.stringify({
      notesOpen: !notesHidden,
      aiOpen: agentTerminalOpen,
      aiHeight: rememberedAiSheetHeight(),
      categoryId: state.selectedCategoryId || "",
      todoId: target?.todo?.id || "",
      subtaskId: selectedSubtaskId || "",
      historyTodoId: selectedHistoryId || "",
      savedAt: Date.now(),
    }));
  } catch (error) {}
}

// Everything that decides what the page looks like is set before the first
// render: category, history selection, the note/AI open flags and a custom AI
// sheet height. renderStage() then paints that exact page once.
function stageWorkspaceView(saved) {
  if (!saved || detachedMode) return;
  const category = selectedCategory();
  if (category) {
    if (saved.historyTodoId) {
      const done = doneTodos(category);
      const index = done.findIndex((todo) => todo.id === saved.historyTodoId);
      if (index >= 0) {
        historyCursor = index;
        historyExpanded.add(index);
        selectedHistoryId = saved.historyTodoId;
      }
    }
    if (saved.subtaskId) {
      const inCurrent = (currentTodo()?.subtasks || []).some((subtask) => subtask.id === saved.subtaskId);
      const doneOwner = (category.todos || []).find((todo) => todo.done
        && (todo.subtasks || []).some((subtask) => subtask.id === saved.subtaskId));
      if (inCurrent || doneOwner) {
        selectedSubtaskId = saved.subtaskId;
        if (doneOwner && !selectedHistoryId) {
          selectedHistoryId = doneOwner.id;
          const index = doneTodos(category).findIndex((todo) => todo.id === doneOwner.id);
          historyCursor = index >= 0 ? index : 0;
          if (index >= 0) historyExpanded.add(index);
        }
      }
    }
    // Mark the category as already visited, otherwise renderStage() resets the
    // restored history cursor/selection as if the user just switched boards.
    lastCategoryId = category.id;
  }
  notesClosing = false;
  notesHidden = !saved.notesOpen;
  document.body.classList.toggle("notes-hidden", notesHidden);
  agentClosing = false;
  agentTerminalOpen = Boolean(saved.aiOpen);
  document.body.classList.toggle("agent-terminal-open", agentTerminalOpen);
  const height = Number(saved.aiHeight);
  if (agentTerminalOpen && Number.isFinite(height) && height >= 120) {
    sheetHeightCustom = true;
    document.documentElement.style.setProperty(
      "--agent-terminal-height",
      `${Math.round(height)}px`,
    );
  }
}

// After the page is in the DOM, only measuring is left: the default AI box
// (when the user never dragged it) and the split/door-line geometry.
function settleWorkspaceView() {
  if (detachedMode) return;
  refreshDefaultSheetHeight();
  updateAgentSplitLayout();
  positionDeskHandles();
}

// Default sheet height: start right below the bordered subtask area so the
// task rows stay visible. Only a manual resize may override it afterwards.
let sheetHeightCustom = false;
function refreshDefaultSheetHeight() {
  if (sheetHeightCustom) return;
  // A door-line drag writes the sheet's box explicitly on every frame, so the
  // shared default is not consulted until the drag is over. Rewriting the root
  // height variable mid-gesture restyles the whole page (25-30ms, it is
  // inherited by every element) for no visible gain, and that freeze is what
  // made the first frame of a door drag stutter.
  if (deskHandleResizing()) return;
  const body = $(".page-body");
  const todos = $(".todos-section");
  if (!body || !todos) return;
  const bodyRect = body.getBoundingClientRect();
  const border = todos.getBoundingClientRect().bottom;
  if (bodyRect.height <= 0) return;
  const top = Math.max(0, border - bodyRect.top);
  const height = Math.round(Math.max(220, bodyRect.height - top));
  document.documentElement.style.setProperty("--agent-terminal-height", `${height}px`);
}

let notesHidden = false;
let notesStretchSuppressClick = false;
let notesStretchActive = false;
let notesStretchPress = false;
let notesSwipeCooldownUntil = 0;
let notesRestoreRect = null;

function updateNotesHandle() {
  const bottom = $(".notes-handle-bottom");
  const top = $(".notes-handle-top");
}

let notesSwipeLine = null;
let notesSwipeLineAt = 0;

function refreshNotesSwipeLine() {
  const handle = notesHidden ? $(".notes-handle-bottom") : $(".notes-handle-top");
  if (!handle) { notesSwipeLine = null; return; }
  const rect = handle.getBoundingClientRect();
  notesSwipeLine = {
    left: rect.left,
    right: rect.right,
    y: rect.top + rect.height / 2,
  };
  notesSwipeLineAt = performance.now();
}

function positionNotesHandle() {
  positionDeskHandles();
}

function followPageLayout(duration = 360) {
  const start = performance.now();
  const step = () => {
    // A door-line drag writes its own sheet box and its line's `top` once per
    // frame. Measuring the page and re-placing the lines here would force a
    // layout inside that same frame, so the loop stands down while a line is
    // held and picks the geometry up again the moment the pointer is released.
    if (!deskHandleResizing()) {
      positionTimerRoot();
      positionNotesHandle();
    }
    if (performance.now() - start < duration) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function hideNotesPanel(silent = false) {
  if (notesHidden || notesClosing) return;
  const panel = $("#notes-half");
  const handle = $(".notes-handle-bottom");
  if (!panel || silent) {
    hideNotesPanelNow(silent);
    return;
  }
  notesClosing = true;
  DeskHandle.vanish("note");
  panel.classList.add("sheet-closing");
  setTimeout(() => {
    if (!notesClosing) return;
    panel.classList.remove("sheet-closing");
    notesClosing = false;
    hideNotesPanelNow(silent);
    if (singleDock?.kind === "note") clearSingleDock();
    positionDeskHandles();
    DeskHandle.snapHome("note");
    DeskHandle.appear("note", "below");
  }, 140);
}

function hideNotesPanelNow(silent = false) {
  if (notesHidden) return;
  if (!silent) AudioFX.leafRustle();
  saveActiveNoteCaret();
  notesHidden = true;
  document.body.classList.add("notes-hidden");
  if (!agentTerminalOpen) resetSplitToHorizontal();
  applyNotesStretch();
  const panel = $("#notes-half");
  if (panel) panel.classList.add("notes-hidden");
  updateNotesHandle();
  positionNotesHandle();
  updateAgentSplitLayout();
  saveViewState();
}

function showNotesPanel(silent = false) {
  silent = silent === true;
  if (!notesHidden) return;
  DeskHandle.captureHome("note");
  notesClosing = false;
  clearSingleDock();
  protectDeskHandles(420);
  $(".notes-handle-bottom")?.classList.remove("handle-vanished", "handle-closing");
  notesHidden = false;
  document.body.classList.remove("notes-hidden");
  if (!silent) AudioFX.leafRustle();
  DeskHandle.vanish("note");
  const panel = $("#notes-half");
  if (!panel) return;
  // Clear any leftover split/card/flip transform so the sheet always rises
  // from directly below, never from a previous left/right position.
  panel.classList.remove("notes-hidden", "sheet-closing", "agent-split-flip", "agent-split-flipping", "panel-unshrinking", "panel-drag-out");
  refreshDefaultSheetHeight();
  panel.style.removeProperty("transform");
  panel.style.removeProperty("translate");
  panel.style.removeProperty("scale");
  void panel.offsetWidth;
  setupNotesPanel();
  if (!silent) {
    panel.classList.add("notes-solid-opening", "sheet-opening");
    setTimeout(() => panel.classList.remove("sheet-opening", "notes-solid-opening"), 160);
  }
  updateNotesHandle();
  positionNotesHandle();
  updateAgentSplitLayout();
  requestAnimationFrame(() => {
    positionDeskHandles();
    DeskHandle.appear("note", "above");
  });
  saveViewState();
}
let noteBlocks = [];
let noteBlockKey = null;
const NOTE_ZERO_WIDTH = "\u200b";
const noteCaretMemory = new Map();

function noteCaretSelection(active, editor) {
  if (!active || !editor) return [0, 0];
  const memory = noteCaretMemory.get(noteTargetKey(active));
  const index = Number(editor.dataset.noteBlockEditor);
  if (memory && memory.block === index) {
    const max = editor.value.length;
    const start = Math.max(0, Math.min(max, Number(memory.start) || 0));
    const end = Math.max(start, Math.min(max, Number(memory.end) || start));
    if (editor.value === NOTE_ZERO_WIDTH) return [1, 1];
    return [start, end];
  }
  return editor.value === NOTE_ZERO_WIDTH ? [1, 1] : [0, 0];
}

function focusActiveNoteEditor(force = false) {
  if (addingSubtask && document.activeElement?.id === "subtask-name-input") return;
  if (notesHidden || $("#modal-root").innerHTML) return;
  const editor = document.querySelector("#note-live [data-note-block-editor]");
  if (!editor) return;
  // Never reset a caret that is already in the editor; late focus timers used
  // to jump the cursor back to the remembered position while typing.
  if (document.activeElement === editor) {
    autoSizeNoteBlock(editor);
    return;
  }
  const active = document.activeElement;
  if (!force && active && active !== document.body && active !== editor
    && active.matches("input, textarea, [contenteditable='true']")
    && !active.closest("#notes-half")) return;
  editor.focus({ preventScroll: true });
  const [start, end] = noteCaretSelection(activeNoteTarget(), editor);
  editor.setSelectionRange(start, end);
  autoSizeNoteBlock(editor);
  setTimeout(() => keepNoteBaseline(editor), 30);
}

/* ---------------------------------------------------------------------------
   Custom note caret: a steady line or block, with a user-chosen colour.
   The native caret is hidden only in the note editor; selections keep using
   the browser's normal highlight.
   ------------------------------------------------------------------------- */
let customCaretMirror = null;
let customCaretFrame = 0;

function normalizedCaretColor() {
  return /^#[0-9a-f]{6}$/i.test(String(settings.caret_color || "")) ? settings.caret_color : "#1b1b1b";
}

/** The stored page-baseline colour; it never reads the active theme. */
function baselineColor() {
  const stored = state.data?.baseline_color;
  return /^#[0-9a-f]{6}$/i.test(String(stored || ""))
    ? String(stored).toLowerCase()
    : BASELINE_COLOR_DEFAULT;
}

/** Accept #rrggbb, rrggbb or #rgb from the baseline settings fields. */
function normalizeBaselineColorInput(raw) {
  const value = String(raw || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
  if (/^[0-9a-f]{6}$/i.test(value)) return `#${value.toLowerCase()}`;
  if (/^#[0-9a-f]{3}$/i.test(value)) {
    return `#${value.slice(1).split("").map((char) => char + char).join("").toLowerCase()}`;
  }
  return "";
}

// Colour pickers fire `input` for every pixel while the user drags. The line
// repaints immediately, but only the last colour is written to
// baseline-color.json, so dragging cannot flood the backend.
let baselineColorSaveTimer = null;

function saveBaselineColor(color, { immediate = false } = {}) {
  if (state.data) state.data.baseline_color = color;
  document.documentElement.style.setProperty("--page-baseline-color", color);
  clearTimeout(baselineColorSaveTimer);
  const send = () => {
    baselineColorSaveTimer = null;
    fetch("/api/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_baseline_color", color }),
    }).catch(() => {
      // The colour is still on screen; the next edit retries the file write.
    });
  };
  if (immediate) send();
  else baselineColorSaveTimer = setTimeout(send, 180);
}

// ---------------------------------------------------------------------------
// page_line — the single owner of the page's horizontal dividers.
//
// The header, the seven task rows and the empty desk are printed from one
// seeded grid, so a row that carries text and a row that is an empty filler
// can never receive a different line. Colour, opacity, row pitch and line
// weight live together in page-line.json; nothing here reads a theme.
// ---------------------------------------------------------------------------
const PAGE_LINE_DEFAULT = {
  color: BASELINE_COLOR_DEFAULT,
  opacity: 1,
  row: 40,
  thickness: 1,
};

/** Normalise the stored page line; a hand-edited file can never break CSS. */
function pageLine() {
  const raw = state.data?.page_line;
  const source = raw && typeof raw === "object" ? raw : {};
  const color = /^#[0-9a-f]{6}$/i.test(String(source.color || ""))
    ? String(source.color).toLowerCase()
    : PAGE_LINE_DEFAULT.color;
  const opacityRaw = Number(source.opacity);
  const opacity = Number.isFinite(opacityRaw)
    ? Math.max(0, Math.min(1, opacityRaw))
    : PAGE_LINE_DEFAULT.opacity;
  const rowRaw = Math.round(Number(source.row));
  const row = Number.isFinite(rowRaw)
    ? Math.max(32, Math.min(64, rowRaw))
    : PAGE_LINE_DEFAULT.row;
  const thicknessRaw = Math.round(Number(source.thickness));
  const thickness = Number.isFinite(thicknessRaw)
    ? Math.max(1, Math.min(4, thicknessRaw))
    : PAGE_LINE_DEFAULT.thickness;
  return { color, opacity, row, thickness };
}

/** The one colour every page divider is painted with. */
function pageLinePaint(line = pageLine()) {
  return `rgba(${hexToRgb(line.color)}, ${line.opacity})`;
}

/** Publish page_line on :root; page-line.css is the only reader. */
function applyPageLine() {
  const line = pageLine();
  const root = document.documentElement;
  root.style.setProperty("--page-line-color", line.color);
  root.style.setProperty("--page-line-opacity", String(line.opacity));
  root.style.setProperty("--page-line-paint", pageLinePaint(line));
  root.style.setProperty("--page-line-row", `${line.row}px`);
  root.style.setProperty("--page-line-thickness", `${line.thickness}px`);
  root.style.setProperty("--page-task-h", `calc(${line.row}px * 7)`);
  applyOverlayTop();
}

// ---------------------------------------------------------------------------
// Overlay sheets hang from the page grid.
//
// Settings, the archive and the chronicle used to start at an offset of their
// own, which left a ruled line floating next to the sheet's top border. Their
// top edge is now snapped to a page rule: it sits level with the postcard's
// top edge less one ruled row, then walks up to the nearest rule — never above
// the first rule under the header. style.css keeps the same expression as the
// no-JS fallback; this pass quantises it onto the notebook lines.
// ---------------------------------------------------------------------------
let overlayTopBound = false;
let overlayTopRetries = 0;

function overlayTop() {
  const row = Math.max(8, Math.round(Number(pageLine().row) || 40));
  const viewport = window.innerHeight || 0;
  const page = document.querySelector("#stage") || document.querySelector(".page");
  const pageTop = page ? page.getBoundingClientRect().top : 0;
  if (pageTop <= 0) return 0;
  // One finger below the rule, matching --overlay-finger in style.css.
  const finger = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--overlay-finger")
  ) || 30;
  // Keep in step with the postcard viewer's frame (style.css --postcard-height).
  let cardHeight = Math.min(560, viewport * 0.8);
  if (window.innerWidth <= 980) cardHeight = Math.min(540, viewport * 0.82);
  if (viewport <= 720) cardHeight = viewport * 0.96 - 30;
  const ideal = (viewport - cardHeight) / 2 - row;
  const snapped = pageTop + Math.floor((ideal - pageTop) / row) * row;
  return Math.max(0, Math.round(Math.max(pageTop, snapped) + finger));
}

/** Publish the snapped top edge; re-run on resize so the grid stays aligned. */
function applyOverlayTop() {
  if (!overlayTopBound) {
    overlayTopBound = true;
    window.addEventListener("resize", applyOverlayTop, { passive: true });
  }
  const top = overlayTop();
  if (top > 0) {
    overlayTopRetries = 0;
    document.documentElement.style.setProperty("--overlay-top", `${top}px`);
    return;
  }
  // The first paint can run before the page has a box; try again next frame.
  if (overlayTopRetries < 20) {
    overlayTopRetries += 1;
    requestAnimationFrame(applyOverlayTop);
  }
}

let pageLineSaveTimer = null;

/** Repaint at once, then write the object to page-line.json. */
function savePageLine(patch, { immediate = false } = {}) {
  const line = { ...pageLine(), ...patch };
  if (state.data) state.data.page_line = line;
  applyPageLine();
  clearTimeout(pageLineSaveTimer);
  const send = () => {
    pageLineSaveTimer = null;
    silentAction("save_page_line", { page_line: line });
  };
  if (immediate) send();
  else pageLineSaveTimer = setTimeout(send, 180);
}

/** Repaint the compact preview strip in Settings; nothing else. */
function syncPageLineSwatch(line = pageLine()) {
  document.querySelectorAll("[data-page-line-swatch]").forEach((node) => {
    node.style.setProperty("--preview-color", pageLinePaint(line));
    node.style.setProperty("--preview-row", "6px");
    node.style.setProperty("--preview-weight", `${Math.min(3, line.thickness)}px`);
  });
}

/** Keep the page-line controls in step without rebuilding the settings sheet. */
function syncPageLineControls(line = pageLine()) {
  const picker = $("#page-line-color");
  if (picker) picker.value = line.color;
  const hex = $("#page-line-hex");
  if (hex) hex.value = line.color;
  const opacity = $("#page-line-opacity");
  if (opacity) opacity.value = String(line.opacity);
  const opacityValue = $("#page-line-opacity-value");
  if (opacityValue) opacityValue.textContent = `${Math.round(line.opacity * 100)}%`;
  const row = $("#page-line-row");
  if (row) row.value = String(line.row);
  const rowValue = $("#page-line-row-value");
  if (rowValue) rowValue.textContent = `${line.row} px`;
  const thickness = $("#page-line-thickness");
  if (thickness) thickness.value = String(line.thickness);
  const thicknessValue = $("#page-line-thickness-value");
  if (thicknessValue) thicknessValue.textContent = `${line.thickness} px`;
  syncPageLineSwatch(line);
}

// ---------------------------------------------------------------------------
// Row baseline — the hairline inside the finished-subtasks drawer. The page,
// the live subtask lane, the categories spine and the Doing panel all read the
// page_line colour; this setting only shapes the finished card. Unlike the page
// dividers, a card row line is short enough to carry a gradient. The "height"
// mode gives every row a different stop so the colour travels down a list. Both
// live in baseline-rule.json, never in a theme.
// ---------------------------------------------------------------------------

/** Normalise the stored row rule; a hand-edited file can never break CSS. */
function baselineRowRule() {
  const raw = state.data?.baseline_rule;
  const source = raw && typeof raw === "object" ? raw : {};
  const mode = BASELINE_ROW_MODES.includes(String(source.mode || "").toLowerCase())
    ? String(source.mode).toLowerCase()
    : BASELINE_ROW_DEFAULT.mode;
  const color = /^#[0-9a-f]{6}$/i.test(String(source.color || ""))
    ? String(source.color).toLowerCase()
    : BASELINE_ROW_DEFAULT.color;
  const color2 = /^#[0-9a-f]{6}$/i.test(String(source.color2 || ""))
    ? String(source.color2).toLowerCase()
    : BASELINE_ROW_DEFAULT.color2;
  const angle = Math.max(0, Math.min(180, Number(source.angle) || 0));
  return { mode, color, color2, angle };
}

/** Give each row its stop on the vertical gradient when height mode is active. */
function applyBaselineRowHeights(scope = document) {
  const rule = baselineRowRule();
  const groups = scope.querySelectorAll?.(".current-subtasks, .history-rows, .doing-list") || [];
  groups.forEach((group) => {
    const rows = [...group.children].filter((row) => (
      row.matches(".current-subtask, .history-row, .doing-item")
    ));
    const last = Math.max(1, rows.length - 1);
    rows.forEach((row, index) => {
      if (rule.mode === "height") {
        row.style.setProperty(
          "--baseline-row-color",
          mixHex(rule.color, rule.color2, index / last)
        );
      } else {
        row.style.removeProperty("--baseline-row-color");
      }
    });
  });
}

/** Publish the row rule on :root; CSS only chooses how to paint it. */
function applyBaselineRowRule() {
  const rule = baselineRowRule();
  const root = document.documentElement;
  root.dataset.baselineRows = rule.mode;
  root.style.setProperty("--baseline-row-color", rule.color);
  root.style.setProperty("--baseline-row-color-2", rule.color2);
  root.style.setProperty("--baseline-row-angle", `${rule.angle}deg`);
  root.style.setProperty(
    "--baseline-row-image",
    `linear-gradient(${rule.angle + 90}deg, ${rule.color}, ${rule.color2})`
  );
  applyBaselineRowHeights();
}

let baselineRowSaveTimer = null;

/** Repaint at once, then write the structured rule to baseline-rule.json. */
function saveBaselineRowRule(patch, { immediate = false } = {}) {
  const rule = { ...baselineRowRule(), ...patch };
  if (state.data) state.data.baseline_rule = rule;
  applyBaselineRowRule();
  clearTimeout(baselineRowSaveTimer);
  const send = () => {
    baselineRowSaveTimer = null;
    silentAction("save_baseline_rule", { rule });
  };
  if (immediate) send();
  else baselineRowSaveTimer = setTimeout(send, 180);
}

/** Keep the row-rule controls in step without rebuilding the settings sheet. */
function syncBaselineRowControls(rule = baselineRowRule()) {
  const picker = $("#baseline-row-color");
  if (picker) picker.value = rule.color;
  const hex = $("#baseline-row-color-hex");
  if (hex) hex.value = rule.color;
  const picker2 = $("#baseline-row-color2");
  if (picker2) picker2.value = rule.color2;
  const hex2 = $("#baseline-row-color2-hex");
  if (hex2) hex2.value = rule.color2;
  const angle = $("#baseline-row-angle");
  if (angle) angle.value = String(rule.angle);
  const angleLabel = $("#baseline-row-angle-value");
  if (angleLabel) angleLabel.textContent = `${rule.angle}°`;
  const preview = $(".baseline-row-preview");
  if (preview) {
    preview.className = `baseline-row-preview ${rule.mode}`;
    preview.style.setProperty("--a", rule.color);
    preview.style.setProperty("--b", rule.color2);
    preview.style.setProperty("--angle", `${rule.angle}deg`);
  }
  document.querySelectorAll(".baseline-row-choice").forEach((button) => {
    const active = button.dataset.action === `baseline-rows-${rule.mode}`;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  const second = $(".baseline-row-second");
  if (second) second.classList.toggle("is-hidden", rule.mode === "solid");
  const angleRow = $(".baseline-row-angle-row");
  if (angleRow) angleRow.classList.toggle("is-hidden", rule.mode !== "gradient");
}

// ---------------------------------------------------------------------------
// Selection highlight — the wash behind the row or menu item you are in.
// Every theme marks the active subtask and the hovered menu entry with an
// accent tint. "Auto" keeps that theme-derived wash; a saved colour replaces
// only the wash, never the accent ink, so text and icons keep their theme.
// ---------------------------------------------------------------------------

/** Accept #rrggbb, rrggbb or #rgb from the highlight settings fields. */
function normalizeHighlightColorInput(raw) {
  const value = String(raw || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
  if (/^[0-9a-f]{6}$/i.test(value)) return `#${value.toLowerCase()}`;
  if (/^#[0-9a-f]{3}$/i.test(value)) {
    return `#${value.slice(1).split("").map((char) => char + char).join("").toLowerCase()}`;
  }
  return "";
}

/** The saved highlight colour, or "" when the font ink owns the wash. */
function highlightColor() {
  return normalizeHighlightColorInput(settings.highlight);
}

/** Keep the picker, the hex field, the sample and the Auto button in step. */
function syncHighlightFields(color, source = "") {
  if (source !== "picker") {
    const picker = $("#highlight-color");
    if (picker) picker.value = color;
  }
  if (source !== "hex") {
    const hex = $("#highlight-color-hex");
    if (hex) hex.value = color;
  }
  document.querySelectorAll(".highlight-live-sample").forEach((sample) => {
    sample.style.setProperty("--sample", color);
  });
  const mode = document.querySelector(".highlight-mode");
  if (mode) mode.textContent = "Custom colour";
  const auto = document.querySelector('[data-action="reset-highlight-color"]');
  if (auto) {
    auto.disabled = false;
    auto.classList.remove("primary");
    auto.classList.remove("active");
  }
}

/** The ink the page writes in: the reader's font colour, or the theme's own. */
function bodyInkColor() {
  const theme = THEMES[currentPostcardId()] || THEMES.light;
  return fontHexColor(settings.body_font_color) || theme?.ink || "#332b2d";
}

/** Publish the wash colour. Called on every theme pass and while the picker drags. */
function applyHighlight() {
  const root = document.documentElement;
  const custom = highlightColor();
  // Auto follows the font ink, not the theme accent, so the selected row reads
  // as a tint of the text sitting on it. A saved colour still wins.
  const color = custom || bodyInkColor();
  root.dataset.select = custom ? "custom" : "auto";
  root.style.setProperty("--select-wash-rgb", hexToRgb(color));
}

function aiThemeIsDark() {
  // The AI console may run a dark theme while the notebook is light (or the
  // other way round), so its caret follows the console palette, not the app.
  const palette = resolvedAiTheme()?.palette;
  if (palette?.bg) return hexLuminance(palette.bg) < 0.45;
  return document.documentElement.dataset.postcardDark === "true";
}

function aiCaretColor() {
  const dark = aiThemeIsDark();
  const value = dark ? settings.ai_caret_dark : settings.ai_caret_light;
  return /^#[0-9a-f]{6}$/i.test(String(value || ""))
    ? value
    : (dark ? "#f4f6f8" : "#1b1b1b");
}

function hideCustomCaret() {
  for (const id of ["custom-caret", "agent-custom-caret"]) {
    const caret = document.getElementById(id);
    if (caret) caret.style.display = "none";
  }
}

function ensureCustomCaret(host = document.querySelector("#note-live"), id = "custom-caret") {
  if (!host) return null;
  let caret = document.getElementById(id);
  if (!caret || caret.parentElement !== host) {
    caret = document.createElement("i");
    caret.id = id;
    caret.setAttribute("aria-hidden", "true");
    host.appendChild(caret);
  }
  return caret;
}

function activeCaretTarget() {
  const active = document.activeElement;
  if (!active) return null;
  if (active.id === "agent-input") {
    const host = active.closest(".agent-compose");
    if (!host) return null;
    return { editor: active, host, caretId: "agent-custom-caret", internalScroll: true };
  }
  const editor = active.closest?.("[data-note-block-editor]");
  if (editor && !notesHidden) {
    const host = document.querySelector("#note-live");
    if (!host) return null;
    return { editor, host, caretId: "custom-caret", internalScroll: false };
  }
  return null;
}

function caretMirrorFor(editor) {
  if (!customCaretMirror) {
    customCaretMirror = document.createElement("div");
    customCaretMirror.id = "caret-mirror";
    customCaretMirror.setAttribute("aria-hidden", "true");
  }
  if (!customCaretMirror.isConnected) document.body.appendChild(customCaretMirror);
  const cs = getComputedStyle(editor);
  const copy = [
    "fontFamily", "fontSize", "fontWeight", "fontStyle", "fontVariant", "letterSpacing",
    "lineHeight", "textTransform", "textIndent", "textRendering", "wordBreak", "overflowWrap",
    "whiteSpace", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
    "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth",
    "boxSizing", "direction",
  ];
  customCaretMirror.style.cssText = "position:fixed;left:-100000px;top:0;visibility:hidden;pointer-events:none;margin:0;contain:layout style;height:auto;";
  for (const prop of copy) customCaretMirror.style[prop] = cs[prop];
  customCaretMirror.style.width = `${editor.clientWidth}px`;
  return customCaretMirror;
}

function scheduleCustomCaret() {
  if (customCaretFrame) return;
  customCaretFrame = requestAnimationFrame(() => {
    customCaretFrame = 0;
    updateCustomCaret();
  });
}

function updateCustomCaret() {
  const target = activeCaretTarget();
  if (!target || !target.editor.isConnected) {
    hideCustomCaret();
    return;
  }
  const { editor, host, caretId, internalScroll } = target;
  const start = editor.selectionStart ?? 0;
  const end = editor.selectionEnd ?? start;
  if (start !== end) {
    hideCustomCaret();
    return;
  }
  const caret = ensureCustomCaret(host, caretId);
  if (!caret) return;
  // Only one custom caret is visible at a time.
  const otherId = caretId === "custom-caret" ? "agent-custom-caret" : "custom-caret";
  const other = document.getElementById(otherId);
  if (other) other.style.display = "none";
  const mirror = caretMirrorFor(editor);
  const value = editor.value || "";
  mirror.textContent = "";
  mirror.appendChild(document.createTextNode(value.slice(0, start)));
  const marker = document.createElement("span");
  marker.style.cssText = "display:inline-block;vertical-align:top;width:0;white-space:pre;";
  mirror.appendChild(marker);
  const next = value.charAt(start);
  const probe = document.createElement("span");
  probe.style.cssText = "display:inline-block;vertical-align:top;white-space:pre;";
  probe.textContent = next && next !== "\n" ? next : "M";
  mirror.appendChild(probe);

  const cs = getComputedStyle(editor);
  const fontSize = parseFloat(cs.fontSize) || 18;
  const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.5 || 24;
  const caretHeight = Math.min(lineHeight, Math.max(12, fontSize * 1.15));
  marker.style.height = `${lineHeight}px`;
  const mirrorRect = mirror.getBoundingClientRect();
  const markerRect = marker.getBoundingClientRect();
  const probeRect = probe.getBoundingClientRect();
  const editorRect = editor.getBoundingClientRect();
  const hostRect = host.getBoundingClientRect();
  const isAgent = caretId === "agent-custom-caret";
  const caretShape = isAgent ? settings.ai_caret_shape : settings.caret_shape;
  const caretBlink = isAgent ? settings.ai_caret_blink : settings.caret_blink;
  const block = caretShape === "block";
  const left = editorRect.left - hostRect.left - host.clientLeft
    + (markerRect.left - mirrorRect.left)
    + (internalScroll ? -editor.scrollLeft : host.scrollLeft);
  const top = editorRect.top - hostRect.top - host.clientTop
    + (markerRect.top - mirrorRect.top)
    + (internalScroll ? -editor.scrollTop : host.scrollTop)
    + (lineHeight - caretHeight) / 2;
  const width = block ? Math.max(4, Math.round(probeRect.width)) : 1.5;
  caret.style.display = "block";
  caret.style.left = `${left.toFixed(2)}px`;
  caret.style.top = `${top.toFixed(2)}px`;
  caret.style.width = `${width}px`;
  caret.style.height = `${caretHeight.toFixed(2)}px`;
  caret.style.background = isAgent ? aiCaretColor() : normalizedCaretColor();
  caret.style.setProperty("--caret-alpha", block ? "0.68" : "1");
  caret.classList.toggle("block", block);
  caret.classList.toggle("blink", caretBlink === true);
}

function isCaretEditor(node) {
  return Boolean(node?.matches?.("[data-note-block-editor]") || node?.id === "agent-input");
}

function setupCustomCaret() {
  document.body.classList.add("custom-caret");
  document.addEventListener("focusin", (event) => {
    if (isCaretEditor(event.target)) scheduleCustomCaret();
  });
  document.addEventListener("focusout", (event) => {
    if (!isCaretEditor(event.target)) return;
    setTimeout(() => {
      if (!isCaretEditor(document.activeElement)) hideCustomCaret();
    }, 0);
  });
  document.addEventListener("selectionchange", () => {
    if (isCaretEditor(document.activeElement)) scheduleCustomCaret();
  });
  document.addEventListener("input", (event) => {
    if (isCaretEditor(event.target)) scheduleCustomCaret();
  });
  document.addEventListener("keydown", (event) => {
    if (event.target.matches?.("[data-note-block-editor]")) scheduleCustomCaret();
  });
  document.addEventListener("keyup", (event) => {
    if (event.target.matches?.("[data-note-block-editor]")) scheduleCustomCaret();
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest?.("#notes-half")) scheduleCustomCaret();
  });
  document.addEventListener("scroll", (event) => {
    if (event.target.id === "note-live") scheduleCustomCaret();
  }, true);
  window.addEventListener("resize", scheduleCustomCaret);
}

function saveActiveNoteCaret() {
  const active = activeNoteTarget();
  if (!active) return;
  let editor = document.activeElement?.closest?.("[data-note-block-editor]");
  if (!editor) editor = document.querySelector(`#note-live [data-note-block-editor="${noteEditingBlock}"]`);
  if (!editor) editor = document.querySelector("#note-live [data-note-block-editor]");
  if (!editor) return;
  noteCaretMemory.set(noteTargetKey(active), {
    block: Number(editor.dataset.noteBlockEditor),
    start: editor.selectionStart ?? 0,
    end: editor.selectionEnd ?? (editor.selectionStart ?? 0),
  });
}
let noteEditingBlock = null;
let noteSaveTimer = null;
let noteDirty = null;
let lastCategoryId = null;
let contextMenuOpen = false;
let postcard = null;
let modalResolve = null;
let statusTimer = null;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

function parseDate(iso) {
  if (!iso) return null;
  const date = new Date(`${iso}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}
function fmtNumeric(iso) {
  const date = parseDate(iso);
  if (!date) return "—";
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}
function fmtShort(iso) {
  const date = parseDate(iso);
  if (!date) return "—";
  return `${MONTHS[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}`;
}
function fmtLong(iso) {
  const date = parseDate(iso);
  if (!date) return "—";
  return `${MONTHS[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}, ${date.getFullYear()}`;
}
function weekLabel(card) {
  return `${fmtShort(card.week_start)} — ${fmtShort(card.week_end)}, ${parseDate(card.week_end)?.getFullYear() ?? ""}`;
}
function setStatus(text) {
  const node = $("#status-text");
  if (node) node.textContent = text;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { if (node) node.textContent = "Ready"; }, 2600);
}

async function requestState() {
  const response = await fetch("/api/state", { cache: "no-store" });
  return response.json();
}
async function action(name, payload = {}) {
  const response = await fetch("/api/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: name, ...payload }),
  });
  const result = await response.json();
  if (result.state) {
    state.data = result.state;
  }
  if (!result.ok) {
    toast(result.error || "Something went wrong", true);
    setStatus("Needs attention");
    return result;
  }
  if (name === "add_subtask" && result.ok) {
    revealNewSubtask = true;
    celebrateNewSubtask = true;
    lastAddedSubtaskId = String(result.created || "");
    // The finished-subtask card floats over the right half of the pending
    // lane. A brand-new row always opens at the top, so leaving the card open
    // would hide its right side and make the row look cut short. Tuck it away
    // so the new subtask keeps its full width.
    completedSubtasksOpen = false;
  }
  if (name === "add_category" && result.created) {
    state.selectedCategoryId = result.created;
  }
  const selected = state.selectedCategoryId;
  const visible = visibleCategories();
  if (selected && !visible.some((category) => category.id === selected)) {
    state.selectedCategoryId = visible[0]?.id || null;
  }
  render();
  setStatus("Saved");
  return result;
}
async function silentAction(name, payload = {}) {
  try {
    const response = await fetch("/api/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: name, ...payload }),
    });
    const result = await response.json();
    if (result.state) state.data = result.state;
    return result;
  } catch (error) {
    return null;
  }
}

// The napkin hands the working-folder question to the desktop itself: a click
// opens the system file manager on the folder's parent with the folder
// selected, exactly like clicking that folder once in the window. NeoTodo draws
// no file list of its own. Right-click (or long-press) keeps a small card for
// changing or unlinking the folder, because only the native picker can choose.
function revealProjectFolder(todo = null) {
  const targetTodo = todo || activeNoteTarget()?.todo || null;
  closeProjectFolderCard();
  AudioFX.unlock();
  playPianoKey();
  silentAction("open_project_folder", targetTodo ? { id: targetTodo.id } : {}).then((result) => {
    if (result?.ok === false) {
      toast(result.error || "Could not open the folder in your file manager", true);
      return;
    }
    // Unlinked todos still have a real workspace (NeoTodo's own folder); say so
    // once, and point at the right-click card that binds a project instead.
    setStatus(
      targetTodo?.project_folder
        ? "Opened in your file manager"
        : "NeoTodo's own folder · right-click the napkin to link a project",
    );
  });
}

function projectFolderCardRoot() {
  let root = document.getElementById("project-folder-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "project-folder-root";
    document.body.appendChild(root);
  }
  return root;
}

function closeProjectFolderCard() {
  const root = document.getElementById("project-folder-root");
  if (root) root.innerHTML = "";
}

const PROJECT_FOLDER_GLYPHS = {
  dir: '<svg class="project-folder-glyph" viewBox="0 0 16 16" aria-hidden="true"><path d="M1.8 4.2h4.1l1.2 1.5h7.1v7a1 1 0 0 1-1 1H2.8a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/></svg>',
  file: '<svg class="project-folder-glyph" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.2 1.9h5l3.5 3.4v8.8a1 1 0 0 1-1 1H4.2a1 1 0 0 1-1-1V2.9a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/><path d="M9.2 1.9v3.4h3.5" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>',
};

// The card answers "where do this todo's subtask agents work?" with the folder
// path and a real directory tree: folders first, then files, nested by depth.
// Only the open folder's level is fetched, so expanding a big project stays
// quick and the card never freezes on a full recursive scan.
let projectFolderEntries = [];
let projectFolderTruncated = false;
let projectFolderLinked = false;
let projectFolderMissingLink = false;
let projectFolderEffective = "";
let projectFolderTodoId = "";
const projectFolderChildren = new Map();
const projectFolderExpanded = new Set();

function projectFolderEntryDepth(entry) {
  return Math.min(String(entry?.path || "").split("/").length - 1, 8);
}

function projectFolderVisibleEntries() {
  const visible = [];
  const walk = (entries) => {
    (entries || []).forEach((entry) => {
      visible.push(entry);
      if (entry.dir && projectFolderExpanded.has(entry.path)) {
        walk(projectFolderChildren.get(entry.path));
      }
    });
  };
  walk(projectFolderEntries);
  return visible;
}

function renderProjectFolderTree(holder) {
  if (!holder) return;
  const visible = projectFolderVisibleEntries();
  if (!visible.length) {
    holder.innerHTML = '<span class="project-folder-file-empty">The folder is empty.</span>';
    return;
  }
  const rows = visible.map((entry) => {
    const depth = projectFolderEntryDepth(entry);
    const open = entry.dir && projectFolderExpanded.has(entry.path);
    const loading = entry.dir && projectFolderExpanded.has(entry.path) && !projectFolderChildren.has(entry.path);
    const count = entry.dir && Number(entry.count) ? `<span class="project-folder-count">${Number(entry.count)}</span>` : "";
    return `<div class="project-folder-entry ${entry.dir ? "is-dir" : "is-file"} ${open ? "open" : ""} ${loading ? "loading" : ""}" style="--depth:${depth}"${entry.dir ? ` data-folder-path="${esc(entry.path)}"` : ""} title="${esc(entry.path || entry.name)}"><span class="project-folder-caret" aria-hidden="true"></span>${entry.dir ? PROJECT_FOLDER_GLYPHS.dir : PROJECT_FOLDER_GLYPHS.file}<span class="project-folder-entry-name">${esc(entry.name)}</span>${count}</div>`;
  }).join("");
  const note = projectFolderTruncated
    ? '<span class="project-folder-file-empty">Listing stops at the first 160 entries.</span>'
    : "";
  holder.innerHTML = rows + note;
  const dirs = projectFolderEntries.filter((entry) => entry.dir).length;
  const files = projectFolderEntries.length - dirs;
  const meta = document.querySelector("[data-project-folder-meta]");
  if (meta) {
    const status = projectFolderMissingLink
      ? "Linked folder missing · using default"
      : projectFolderLinked ? "Linked" : "Default";
    meta.textContent = `${status} · ${dirs} ${dirs === 1 ? "folder" : "folders"} · ${files} ${files === 1 ? "file" : "files"}`;
  }
}

function loadProjectFolderFiles(todoId) {
  const holder = document.querySelector("[data-project-folder-files]");
  if (!holder) return;
  projectFolderTodoId = todoId;
  silentAction("project_files", { id: todoId }).then((result) => {
    if (!holder.isConnected) return;
    if (result?.ok === false) {
      holder.innerHTML = `<span class="project-folder-file-empty">${esc(result.error || "Could not read this folder.")}</span>`;
      return;
    }
    projectFolderEntries = Array.isArray(result?.entries) ? result.entries : [];
    projectFolderTruncated = Boolean(result?.truncated);
    projectFolderLinked = Boolean(result?.linked);
    projectFolderMissingLink = Boolean(result?.linked && result?.linked_exists === false);
    if (result?.folder) projectFolderEffective = String(result.folder);
    const pathNode = document.querySelector("[data-project-folder-path]");
    if (pathNode && result?.folder) pathNode.textContent = String(result.folder);
    const hintNode = document.querySelector("[data-project-folder-hint]");
    if (hintNode && projectFolderMissingLink) {
      hintNode.textContent = "The linked folder is missing, so subtask AI works in NeoTodo's own folder.";
    }
    projectFolderChildren.clear();
    projectFolderExpanded.clear();
    if (!projectFolderEntries.length) {
      holder.innerHTML = `<span class="project-folder-file-empty">${result?.exists === false ? "This folder is no longer on disk." : "The folder is empty."}</span>`;
      return;
    }
    renderProjectFolderTree(holder);
  });
}

function toggleProjectFolderDir(path, holder) {
  if (!path || !holder) return;
  if (projectFolderExpanded.has(path)) {
    projectFolderExpanded.delete(path);
    renderProjectFolderTree(holder);
    return;
  }
  projectFolderExpanded.add(path);
  if (projectFolderChildren.has(path)) {
    renderProjectFolderTree(holder);
    return;
  }
  renderProjectFolderTree(holder);
  silentAction("project_files", { id: projectFolderTodoId, path }).then((result) => {
    if (!holder.isConnected) return;
    projectFolderChildren.set(path, Array.isArray(result?.entries) ? result.entries : []);
    renderProjectFolderTree(holder);
  });
}

function openProjectFolderCard() {
  const target = activeNoteTarget();
  const todo = target?.todo || null;
  const linkedFolder = String(todo?.project_folder || "");
  // Todos without a linked folder still have a real workspace: the agent
  // falls back to NeoTodo's own folder (or the crew runner's folder). Show
  // that path so the napkin always answers "where does the AI work?".
  const pendingFolder = !todo ? String(pendingProjectFolder || "") : "";
  const fallbackFolder = pendingFolder || String(state.data?.default_project_folder || "");
  const folder = linkedFolder || fallbackFolder;
  const linked = Boolean(linkedFolder);
  const category = selectedCategory();
  const count = Number(todo?.project_file_count) || 0;
  const locked = Boolean(todo && (target?.completed || todo.done));
  const categoryLine = category
    ? `<div class="project-folder-context">Category · ${esc(category.name)}</div>`
    : "";
  const subtaskLine = target?.kind === "subtask" && target.subtask
    ? `<div class="project-folder-context">Subtask · ${esc(target.subtask.name)}</div>`
    : "";
  const hint = linked
    ? "Subtask AI reads and writes in this folder. A plain click on the napkin shows it in your file manager."
    : todo
      ? "No folder linked, so subtask AI works in NeoTodo's own folder. Choose a folder to point it at your project."
      : "Pick the folder the next todo's AI should work in. Until then, AI uses NeoTodo's own folder.";
  AudioFX.paper();
  projectFolderEntries = [];
  projectFolderTruncated = false;
  projectFolderLinked = false;
  projectFolderMissingLink = false;
  projectFolderEffective = folder;
  projectFolderTodoId = "";
  projectFolderChildren.clear();
  projectFolderExpanded.clear();
  projectFolderCardRoot().innerHTML = `<div class="project-folder-stage" role="dialog" aria-modal="true" aria-labelledby="project-folder-title">
    <div class="project-folder-card">
      <div class="project-folder-kicker">Working folder${linked ? "" : " · default"}</div>
      <h3 id="project-folder-title">${esc(todo?.name || "No current todo")}</h3>
      ${categoryLine}
      ${subtaskLine}
      <p class="project-folder-hint" data-project-folder-hint>${hint}</p>
      ${folder ? `
        <div class="project-folder-path">
          <code data-project-folder-path>${esc(folder)}</code>
          <button class="project-folder-copy" type="button" data-project-folder-copy>Copy</button>
        </div>
        <div class="project-folder-meta"><span data-project-folder-meta>${linked ? "Linked folder" : "NeoTodo folder"}${count ? ` · ${count} files` : ""}</span></div>
        ${todo
          ? '<div class="project-folder-files" data-project-folder-files>Reading folder…</div>'
          : '<div class="project-folder-empty">The next todo will start its AI here.</div>'}
      ` : '<div class="project-folder-empty">Could not resolve a working folder for this todo.</div>'}
      <div class="project-folder-actions">
        ${locked ? "" : `<button class="btn small primary" type="button" data-project-folder-pick>${linked ? "Change folder" : "Choose folder"}</button>`}
        ${todo && folder ? '<button class="btn small" type="button" data-project-folder-open>Show in file manager</button>' : ""}
        <span class="project-folder-spacer"></span>
        ${linked && !locked ? '<button class="btn small danger" type="button" data-project-folder-clear>Unlink</button>' : ""}
        <button class="btn small" type="button" data-project-folder-close>Close</button>
      </div>
    </div>
  </div>`;
  const stage = document.querySelector(".project-folder-stage");
  stage?.addEventListener("mousedown", (event) => {
    if (event.target === stage) closeProjectFolderCard();
  });
  const tree = document.querySelector("[data-project-folder-files]");
  tree?.addEventListener("click", (event) => {
    const row = event.target.closest?.("[data-folder-path]");
    if (!row || !tree.contains(row)) return;
    event.stopPropagation();
    toggleProjectFolderDir(row.dataset.folderPath, tree);
  });
  document.querySelector("[data-project-folder-close]")?.addEventListener("click", closeProjectFolderCard);
  document.querySelector("[data-project-folder-copy]")?.addEventListener("click", async (event) => {
    await copyPlainText(projectFolderEffective || folder);
    const button = event.currentTarget;
    button.textContent = "Copied";
    setTimeout(() => { if (button.isConnected) button.textContent = "Copy"; }, 1200);
    setStatus("Project folder path copied");
  });
  document.querySelector("[data-project-folder-pick]")?.addEventListener("click", () => {
    pickProjectFolder(todo);
  });
  document.querySelector("[data-project-folder-open]")?.addEventListener("click", () => {
    if (!todo) return;
    silentAction("open_project_folder", { id: todo.id }).then((result) => {
      if (result?.ok === false) toast(result.error || "Could not open the folder", true);
    });
  });
  document.querySelector("[data-project-folder-clear]")?.addEventListener("click", async () => {
    if (!todo) return;
    await clearProjectFolder();
    openProjectFolderCard();
  });
  if (folder && todo) loadProjectFolderFiles(todo.id);
}

function pickProjectFolder(todo = null) {
  const targetTodo = todo || activeNoteTarget()?.todo || null;
  if (targetTodo && targetTodo.done) return;
  // Even with no current todo (for example while the new-todo input is empty)
  // the picker opens; the chosen folder waits for the todo that is created next.
  AudioFX.unlock();
  playPianoKey();
  silentAction("choose_project_folder").then(async (picked) => {
    if (!picked?.path) return;
    if (!targetTodo) {
      pendingProjectFolder = picked.path;
      setStatus("Project folder ready for the next todo");
      closeProjectFolderCard();
      return;
    }
    const bound = await action("bind_project_folder", { id: targetTodo.id, path: picked.path });
    if (bound?.ok) {
      setStatus(`Project folder linked · ${(bound.files || []).length} files`);
      openProjectFolderCard();
    }
  });
}

async function attachPendingProjectFolder(result) {
  if (!result?.ok || !result.created || !pendingProjectFolder) return;
  const path = pendingProjectFolder;
  pendingProjectFolder = "";
  const bound = await action("bind_project_folder", { id: result.created, path });
  if (bound?.ok) {
    setStatus(`Project folder linked · ${(bound.files || []).length} files`);
  }
}

async function clearProjectFolder() {
  const target = activeNoteTarget();
  if (!target?.todo) return;
  if (target.completed || target.todo.done) return;
  await action("clear_project_folder", { id: target.todo.id });
}

function isLegacyForkCategory(category) {
  return Boolean(category?.forked_from)
    && legacyForkCategoryIds.has(String(category.id || ""));
}

// The notebook only sees categories that are not old fork boards and are not
// currently stored in the storage box plugin. Both are deliberate hiding
// layers: the boards still exist in state, they are just not on the index.
function visibleCategories() {
  const categories = state.data?.categories || [];
  const boxed = typeof storageBoxedIds === "function" ? storageBoxedIds() : null;
  if (!legacyForkCategoryIds.size && !boxed?.size) return categories;
  return categories.filter((category) => (
    !isLegacyForkCategory(category) && !boxed?.has(String(category.id))
  ));
}

function selectedCategory() {
  const categories = visibleCategories();
  return categories.find((category) => category.id === state.selectedCategoryId)
    || categories[0]
    || null;
}

function displayedTrophyCount() {
  return trophyDisplayHold === null ? (state.data?.trophy_count ?? 0) : trophyDisplayHold;
}

function render() {
  if (!state.data) return;
  renderCategories();
  renderStage();
  if (archiveOpen) renderArchive();
  const trophyValue = displayedTrophyCount();
  $("#trophy-count").textContent = trophyValue;
  const tomatoCount = $("#tomato-count");
  if (tomatoCount) tomatoCount.textContent = String(settings.focus_count || 0);
  const topTrophy = $("#top-trophy-count");
  if (topTrophy) topTrophy.textContent = String(trophyValue);
  const topTomato = $("#top-tomato-count");
  if (topTomato) topTomato.textContent = String(settings.focus_count || 0);
  updateHeaderStamp();
  if (trashOpen) renderTrashDrawer();
}

function currentWeekStamp() {
  const base = state.data?.today ? new Date(`${state.data.today}T12:00:00`) : new Date();
  const date = new Date(Date.UTC(base.getFullYear(), base.getMonth(), base.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `W${String(week).padStart(2, "0")} · ${date.getUTCFullYear()}`;
}

function currentClockStamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(now.getMonth() + 1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function updateHeaderStamp() {
  const node = $("#week-stamp");
  if (node) node.textContent = `${currentWeekStamp()} · ${currentClockStamp()}`;
}

function updateTopClock() {
  const node = $("#header-clock");
  if (!node) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  node.textContent = `${hh}:${mm}`;
}

function categoryCountHtml(category) {
  const completed = category.todos.filter((todo) => todo.done).length;
  return completed ? `${completed} ${completedIcon()}` : "";
}

function categoryMarkHtml(category) {
  // Forked boards keep the flame of the subtask they branched from.
  if (category?.forked_from) {
    return `<span class="cat-dot cat-fork"><img src="/fork-flame.svg" alt=""></span>`;
  }
  return `<span class="cat-dot"></span>`;
}

function renderCategories() {
  const list = $("#category-list");
  const summary = $("#category-summary");
  const categories = visibleCategories().filter((category) => (
    !forkRootId || category.id === forkRootId || category.fork_root === forkRootId
  ));
  if (!categories.length) {
    const boxedCount = typeof storageBoxedIds === "function" ? (storageBoxedIds()?.size || 0) : 0;
    list.innerHTML = boxedCount
      ? `<div class="drawer-empty" style="padding:20px 6px;font-size:12px;line-height:1.8">Categories are in the storage box.<br>Open the box to bring one back.</div>`
      : `<div class="drawer-empty" style="padding:20px 6px;font-size:12px;line-height:1.8">No categories.<br>Press + to begin.</div>`;
    summary.textContent = "";
    return;
  }
  const existing = [...list.querySelectorAll(".category-item[data-category-id]")];
  const sameRows = existing.length === categories.length
    && existing.every((row, index) => row.dataset.categoryId === categories[index].id);
  if (sameRows) {
    // Patch the rows in place. Rebuilding this list on every click made the
    // selected card blink while the press state was torn down and re-created.
    categories.forEach((category, index) => {
      const row = existing[index];
      row.classList.toggle("selected", category.id === state.selectedCategoryId);
      row.style.setProperty("--c", category.color);
      const nameNode = row.querySelector(".cat-name");
      if (nameNode) nameNode.textContent = category.name;
      const countNode = row.querySelector(".cat-count");
      if (countNode) {
        const html = categoryCountHtml(category);
        if (countNode.innerHTML !== html) countNode.innerHTML = html;
      }
    });
    summary.textContent = "";
    return;
  }
  list.innerHTML = categories.map((category) => {
    const count = categoryCountHtml(category);
    return `<button class="category-item ${category.id === state.selectedCategoryId ? "selected" : ""}" style="--c:${esc(category.color)}" data-category-id="${esc(category.id)}">
      ${categoryMarkHtml(category)}
      <span class="cat-name">${esc(category.name)}</span>
      <span class="cat-count">${count}</span>
    </button>`;
  }).join("");
  summary.textContent = "";
}

// ---------------------------------------------------------------------------
// Vim-style category cursor.
// With the pointer resting on the index (or its keyboard focus inside), j/k
// and the arrow keys walk the category list the way vim walks lines. Moving
// the cursor selects the row exactly like a click and keeps focus on it, so
// the next key press lands here instead of scrolling the completed reel.
// ---------------------------------------------------------------------------
function categoryRows() {
  return [...document.querySelectorAll("#category-list .category-item[data-category-id]")];
}

function categoriesActive() {
  if (document.body.classList.contains("categories-collapsed")) return false;
  if (postcard || completedOpen || archiveOpen || trashOpen || openPluginId
    || $(".settings-stage") || $("#modal-root").innerHTML) return false;
  const active = document.activeElement;
  if (active?.closest?.(".index")) return true;
  const index = $(".index");
  return Boolean(index && index.matches(":hover"));
}

function selectCategoryRow(row) {
  if (!row?.dataset?.categoryId) return;
  saveActiveNoteCaret();
  flushNoteSave();
  state.selectedCategoryId = row.dataset.categoryId;
  lastCategoryId = null;
  historyCursor = -1;
  historyScrollTop = 0;
  selectedHistoryId = null;
  selectedSubtaskId = null;
  notesPreview = false;
  AudioFX.categoryTap();
  render();
  if (archiveOpen) closeArchive();
  silentAction("select_category", { id: row.dataset.categoryId });
  saveViewState();
  // render() patches the rows in place, so the same button is still here.
  const live = categoryRows().find((item) => item.dataset.categoryId === row.dataset.categoryId);
  live?.focus({ preventScroll: true });
}

function revealCategoryRow(row) {
  const list = row?.closest(".category-list");
  if (!list) return;
  const rowRect = row.getBoundingClientRect();
  const listRect = list.getBoundingClientRect();
  if (rowRect.top < listRect.top) list.scrollTop -= listRect.top - rowRect.top;
  else if (rowRect.bottom > listRect.bottom) list.scrollTop += rowRect.bottom - listRect.bottom;
}

function moveCategoryCursor(delta) {
  const rows = categoryRows();
  if (!rows.length) return false;
  if (contextMenuOpen) closeContextMenu();
  const focused = document.activeElement?.closest?.(".category-item[data-category-id]");
  let index = rows.indexOf(focused);
  if (index < 0) index = rows.findIndex((row) => row.dataset.categoryId === state.selectedCategoryId);
  if (index < 0) index = 0;
  const target = rows[Math.max(0, Math.min(rows.length - 1, index + delta))];
  if (!target) return false;
  const id = target.dataset.categoryId;
  if (id !== state.selectedCategoryId) selectCategoryRow(target);
  const live = categoryRows().find((row) => row.dataset.categoryId === id) || target;
  live.focus({ preventScroll: true });
  revealCategoryRow(live);
  return true;
}

function currentWeekStamp() {
  const base = state.data?.today ? new Date(`${state.data.today}T12:00:00`) : new Date();
  const date = new Date(Date.UTC(base.getFullYear(), base.getMonth(), base.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `W${String(week).padStart(2, "0")} · ${date.getUTCFullYear()}`;
}

function pendingTodos(category = selectedCategory()) {
  return (category?.todos || []).filter((todo) => !todo.done);
}

function doneTodos(category = selectedCategory()) {
  return (category?.todos || [])
    .filter((todo) => todo.done)
    .sort((a, b) => String(b.completed_at || "").localeCompare(String(a.completed_at || "")));
}

function findTodo(todoId) {
  for (const category of state.data?.categories || []) {
    for (const todo of category.todos || []) {
      if (todo.id === todoId) return todo;
    }
  }
  return null;
}

function currentTodo() {
  return selectedCategory()?.todos?.find((todo) => !todo.done) || null;
}

function activeNoteTarget() {
  if (detachedNoteTargetOverride) return detachedNoteTargetOverride;
  const category = selectedCategory();
  if (!category) return null;
  if (selectedSubtaskId) {
    const current = (category.todos || []).find((todo) => !todo.done);
    const currentSub = (current?.subtasks || []).find((item) => item.id === selectedSubtaskId);
    if (current && currentSub) return { todo: current, subtask: currentSub, kind: "subtask", completed: false };
    const doneTodo = (category.todos || []).find((todo) => todo.id === selectedHistoryId && todo.done);
    const doneSub = (doneTodo?.subtasks || []).find((item) => item.id === selectedSubtaskId);
    if (doneTodo && doneSub) return { todo: doneTodo, subtask: doneSub, kind: "subtask", completed: true };
    selectedSubtaskId = null;
  }
  if (selectedHistoryId) {
    const done = (category.todos || []).find((todo) => todo.id === selectedHistoryId && todo.done);
    if (done) return { todo: done, subtask: null, kind: "todo", completed: true };
  }
  const current = (category.todos || []).find((todo) => !todo.done);
  return current ? { todo: current, subtask: null, kind: "todo", completed: false } : null;
}

async function persistAction(name, payload = {}) {
  try {
    const response = await fetch("/api/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: name, ...payload }),
    });
    return await response.json();
  } catch (error) {
    return null;
  }
}

function scheduleNoteSave(target, note) {
  noteDirty = {
    id: target.todo.id,
    subtaskId: target.kind === "subtask" ? target.subtask?.id || null : null,
    note,
  };
  clearTimeout(noteSaveTimer);
  noteSaveTimer = setTimeout(() => { flushNoteSave(); }, 650);
}

async function flushNoteSave() {
  clearTimeout(noteSaveTimer);
  noteSaveTimer = null;
  if (!noteDirty) return null;
  const pendingNote = noteDirty;
  noteDirty = null;
  const payload = { id: pendingNote.id, note: pendingNote.note };
  if (pendingNote.subtaskId) payload.subtask_id = pendingNote.subtaskId;
  const result = await persistAction("save_note", payload);
  if (!result?.ok) {
    noteDirty = pendingNote;
  }
  return result;
}

function mdInline(value) {
  let out = esc(value);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  return out;
}

function renderMarkdown(source) {
  const text = String(source || "").replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  let html = "";
  let list = null;
  let inCode = false;
  const closeList = () => {
    if (list) {
      html += `</${list}>`;
      list = null;
    }
  };
  for (const line of lines) {
    if (line.startsWith("```")) {
      closeList();
      if (inCode) {
        html += "</code></pre>";
        inCode = false;
      } else {
        html += "<pre><code>";
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      html += `${esc(line)}\n`;
      continue;
    }
    if (!line.trim()) {
      closeList();
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = heading[1].length + 1;
      html += `<h${level}>${mdInline(heading[2])}</h${level}>`;
      continue;
    }
    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      closeList();
      html += `<blockquote>${mdInline(quote[1])}</blockquote>`;
      continue;
    }
    const task = line.match(/^[-*]\s+\[([ xX])\]\s+(.*)$/);
    if (task) {
      if (list !== "ul") { closeList(); html += '<ul class="md-tasks">'; list = "ul"; }
      const checked = task[1].toLowerCase() === "x";
      html += `<li class="md-task ${checked ? "done" : ""}"><span class="md-box">${checked ? "☑" : "☐"}</span>${mdInline(task[2])}</li>`;
      continue;
    }
    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      if (list !== "ul") { closeList(); html += "<ul>"; list = "ul"; }
      html += `<li>${mdInline(bullet[1])}</li>`;
      continue;
    }
    const ordered = line.match(/^\d+\.\s+(.*)$/);
    if (ordered) {
      if (list !== "ol") { closeList(); html += "<ol>"; list = "ol"; }
      html += `<li>${mdInline(ordered[1])}</li>`;
      continue;
    }
    closeList();
    html += `<p>${mdInline(line)}</p>`;
  }
  closeList();
  if (inCode) html += "</code></pre>";
  return html || "";
}

function noteTargetKey(active) {
  if (!active) return "";
  return `${active.kind}:${active.todo.id}:${active.subtask?.id || ""}`;
}

function parseNoteBlocks(note) {
  const text = String(note || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (!text.trim()) return [{ raw: "" }];
  return text.split(/\n{2,}/).map((raw) => ({ raw: raw.replace(/^\n+|\n+$/g, "") }));
}

function ensureNoteBlocks(active, note) {
  const key = noteTargetKey(active);
  if (noteBlockKey !== key) {
    noteBlockKey = key;
    noteBlocks = parseNoteBlocks(note);
    noteEditingBlock = null;
  }
}

function serializeNoteBlocks() {
  return noteBlocks.map((block) => String(block.raw || "").replace(/\s+$/g, "")).join("\n\n").replace(/^\n+|\n+$/g, "");
}

function setTargetNote(active, text) {
  if (!active) return;
  if (active.kind === "subtask") active.subtask.note = text;
  else active.todo.note = text;
}

let noteSizeFrame = 0;
let noteSizeNode = null;

function autoSizeNoteBlock(textarea) {
  if (!textarea) return;
  noteSizeNode = textarea;
  if (noteSizeFrame) return;
  noteSizeFrame = requestAnimationFrame(() => {
    noteSizeFrame = 0;
    const node = noteSizeNode;
    if (!node || !node.isConnected) return;
    node.style.height = "auto";
    const nextHeight = Math.max(32, node.scrollHeight);
    if (Math.abs(node.offsetHeight - nextHeight) > 1) node.style.height = `${nextHeight}px`;
    keepNoteBaseline(node);
  });
}

function keepNoteBaseline(node) {
  const scroller = $("#note-live");
  if (!scroller || !node || !node.isConnected) return;
  const screen = scroller.getBoundingClientRect();
  const block = node.getBoundingClientRect();
  const lineHeight = parseFloat(getComputedStyle(node).lineHeight) || 27;
  const baseline = screen.top + screen.height * 0.5 - lineHeight * 2;
  if (block.bottom > baseline) {
    const overflow = (block.top + block.height / 2) - baseline;
    if (overflow > 1) scroller.scrollTop += overflow;
  }
}

function focusNoteBlock(index) {
  setTimeout(() => {
    const editor = document.querySelector(`[data-note-block-editor="${index}"]`);
    if (!editor) return;
    editor.focus({ preventScroll: true });
    autoSizeNoteBlock(editor);
    const end = editor.value.length;
    editor.setSelectionRange(end, end);
    setTimeout(() => keepNoteBaseline(editor), 30);
  }, 20);
}

function noteBlockNodes() {
  return [...document.querySelectorAll("#note-live > .note-block, #note-live > .note-block-editor")];
}

function reindexNoteBlockNodes() {
  noteBlockNodes().forEach((node, i) => {
    if (node.classList.contains("note-block-editor")) node.dataset.noteBlockEditor = String(i);
    else node.dataset.noteBlock = String(i);
  });
}

function persistMergedNoteBlocks() {
  const active = activeNoteTarget();
  if (!active) return;
  const text = serializeNoteBlocks();
  setTargetNote(active, text);
  scheduleNoteSave(active, text);
}

function mergeNoteBlockWithPrevious(index) {
  if (index <= 0 || !noteBlocks[index] || !noteBlocks[index - 1]) return false;
  const editor = document.querySelector(`[data-note-block-editor="${index}"]`);
  if (!editor) return false;
  const prevNode = editor.previousElementSibling;
  if (!prevNode || !prevNode.matches(".note-block, .note-block-editor")) return false;
  const prevRaw = String(noteBlocks[index - 1].raw || "");
  const currentRaw = String(noteBlocks[index].raw || "");
  noteBlocks[index - 1].raw = prevRaw + currentRaw;
  syncNoteGhost(index - 1, noteBlocks[index - 1].raw);
  noteBlocks.splice(index, 1);
  noteEditingBlock = index - 1;
  const merged = document.createElement("textarea");
  merged.className = "note-block-editor";
  merged.dataset.noteBlockEditor = String(index - 1);
  merged.spellcheck = false;
  merged.value = prevRaw + currentRaw;
  prevNode.replaceWith(merged);
  editor.remove();
  reindexNoteBlockNodes();
  persistMergedNoteBlocks();
  const scroller = $("#note-live");
  const before = scroller?.scrollTop || 0;
  requestAnimationFrame(() => {
    merged.focus({ preventScroll: true });
    autoSizeNoteBlock(merged);
    const pos = prevRaw.length;
    merged.setSelectionRange(pos, pos);
    if (scroller) scroller.scrollTop = before;
  });
  return true;
}

function mergeNoteBlockWithNext(index) {
  if (index < 0 || index >= noteBlocks.length - 1 || !noteBlocks[index] || !noteBlocks[index + 1]) return false;
  const editor = document.querySelector(`[data-note-block-editor="${index}"]`);
  if (!editor) return false;
  const nextNode = editor.nextElementSibling;
  if (!nextNode || !nextNode.matches(".note-block, .note-block-editor")) return false;
  const currentRaw = String(noteBlocks[index].raw || "");
  const nextRaw = String(noteBlocks[index + 1].raw || "");
  noteBlocks[index].raw = currentRaw + nextRaw;
  syncNoteGhost(index, noteBlocks[index].raw);
  noteBlocks.splice(index + 1, 1);
  noteEditingBlock = index;
  editor.value = currentRaw + nextRaw;
  nextNode.remove();
  reindexNoteBlockNodes();
  persistMergedNoteBlocks();
  const scroller = $("#note-live");
  const before = scroller?.scrollTop || 0;
  requestAnimationFrame(() => {
    editor.focus({ preventScroll: true });
    autoSizeNoteBlock(editor);
    const pos = currentRaw.length;
    editor.setSelectionRange(pos, pos);
    if (scroller) scroller.scrollTop = before;
  });
  return true;
}

let noteMeasureEl = null;

function noteMeasureFor(textarea) {
  if (!noteMeasureEl) {
    noteMeasureEl = document.createElement("div");
    noteMeasureEl.className = "note-measure";
    document.body.appendChild(noteMeasureEl);
  }
  const cs = getComputedStyle(textarea);
  const el = noteMeasureEl;
  el.style.fontFamily = cs.fontFamily;
  el.style.fontSize = cs.fontSize;
  el.style.fontWeight = cs.fontWeight;
  el.style.fontStyle = cs.fontStyle;
  el.style.letterSpacing = cs.letterSpacing;
  el.style.lineHeight = cs.lineHeight;
  el.style.whiteSpace = "pre-wrap";
  el.style.overflowWrap = "break-word";
  el.style.wordBreak = "normal";
  el.style.textTransform = cs.textTransform;
  el.style.boxSizing = "border-box";
  el.style.width = `${textarea.clientWidth}px`;
  el.style.paddingLeft = cs.paddingLeft;
  el.style.paddingRight = cs.paddingRight;
  el.style.paddingTop = "0";
  el.style.paddingBottom = "0";
  return { el, lineHeight: parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2 || 20 };
}

/** Caret x/y, measured on the same layout as the textarea. */
function noteCaretPoint(textarea, index) {
  const { el, lineHeight } = noteMeasureFor(textarea);
  const value = textarea.value;
  const before = value.slice(0, Math.max(0, Math.min(value.length, index)));
  const after = value.slice(Math.max(0, Math.min(value.length, index)));
  el.textContent = "";
  el.appendChild(document.createTextNode(before));
  const marker = document.createElement("span");
  marker.textContent = "\u200b";
  marker.style.display = "inline-block";
  marker.style.width = "0";
  marker.style.height = "0";
  marker.style.overflow = "hidden";
  el.appendChild(marker);
  el.appendChild(document.createTextNode(after));
  const rect = el.getBoundingClientRect();
  const mark = marker.getBoundingClientRect();
  const y = mark.top - rect.top;
  const total = el.scrollHeight;
  return {
    x: mark.left - rect.left,
    y,
    lineHeight,
    first: y < lineHeight * 1.2,
    last: y + lineHeight >= total - 1,
  };
}

/** Nearest caret index on the first/last visual line of a block at column x. */
function noteIndexAtColumn(textarea, text, targetX, which) {
  const value = String(text || "");
  if (!value) return 0;
  const { el } = noteMeasureFor(textarea);
  el.textContent = value;
  const node = el.firstChild;
  if (!node) return 0;
  const rect = el.getBoundingClientRect();
  const length = value.length;
  const pointAt = (i) => {
    const range = document.createRange();
    range.setStart(node, i);
    range.setEnd(node, Math.min(length, i + 1));
    const r = range.getBoundingClientRect();
    return { i, x: r.left - rect.left, right: r.right - rect.left, y: r.top - rect.top };
  };
  const points = [];
  if (which === "first") {
    let lineY = null;
    for (let i = 0; i < length; i += 1) {
      const p = pointAt(i);
      if (lineY === null) lineY = p.y;
      if (Math.abs(p.y - lineY) > 1.5) break;
      points.push(p);
    }
  } else {
    let lineY = null;
    for (let i = length - 1; i >= 0; i -= 1) {
      const p = pointAt(i);
      if (lineY === null) lineY = p.y;
      if (Math.abs(p.y - lineY) > 1.5) break;
      points.push(p);
    }
  }
  if (!points.length) return 0;
  let best = points[0].i;
  let distance = Infinity;
  for (const p of points) {
    const d = Math.abs(p.x - targetX);
    if (d < distance) { distance = d; best = p.i; }
    const dRight = Math.abs(p.right - targetX);
    if (dRight < distance) { distance = dRight; best = p.i + 1; }
  }
  return Math.max(0, Math.min(length, best));
}

function activateNoteBlock(index, anchorEvent = null, caretOverride = null) {
  const active = activeNoteTarget();
  if (!active) return;
  ensureNoteBlocks(active, active.kind === "subtask" ? active.subtask.note : active.todo.note);
  if (index < 0 || index >= noteBlocks.length) return;
  const existing = document.querySelector(`#note-live [data-note-block-editor="${index}"]`);
  if (existing) {
    existing.focus({ preventScroll: true });
    const caret = caretOverride == null ? existing.value.length : caretOverride;
    existing.setSelectionRange(caret, caret);
    return;
  }
  document.querySelectorAll("#note-live [data-note-block-editor]").forEach((currentEditor) => {
    const currentIndex = Number(currentEditor.dataset.noteBlockEditor);
    if (currentIndex === index) return;
    const raw = noteBlocks[currentIndex]?.raw ?? currentEditor.value ?? "";
    const rendered = document.createElement("div");
    rendered.className = "note-block markdown";
    rendered.dataset.noteBlock = String(currentIndex);
    rendered.innerHTML = raw.trim() ? renderMarkdown(raw) : "";
    currentEditor.replaceWith(rendered);
  });
  const target = document.querySelector(`#note-live [data-note-block="${index}"]`);
  if (!target) {
    noteEditingBlock = index;
    renderNotesPanel();
    focusNoteBlock(index);
    return;
  }
  const raw = String(noteBlocks[index].raw || "");
  const targetHeight = target.getBoundingClientRect().height;
  let caretPos = null;
  if (anchorEvent) {
    const range = document.caretRangeFromPoint?.(anchorEvent.clientX, anchorEvent.clientY);
    const position = !range ? document.caretPositionFromPoint?.(anchorEvent.clientX, anchorEvent.clientY) : null;
    if (range && target.contains(range.startContainer)) {
      const before = document.createRange();
      before.selectNodeContents(target);
      before.setEnd(range.startContainer, range.startOffset);
      caretPos = before.toString().length;
    } else if (position && target.contains(position.offsetNode)) {
      const before = document.createRange();
      before.selectNodeContents(target);
      before.setEnd(position.offsetNode, position.offset);
      caretPos = before.toString().length;
    } else {
      const textRange = document.createRange();
      textRange.selectNodeContents(target);
      const textRect = textRange.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (anchorEvent.clientX - textRect.left) / Math.max(1, textRect.width)));
      caretPos = Math.round(raw.length * ratio);
    }
  }
  if (caretPos === null) caretPos = raw.length;
  if (caretOverride !== null) caretPos = caretOverride;
  caretPos = Math.max(0, Math.min(raw.length, caretPos));
  const editor = document.createElement("textarea");
  editor.className = "note-block-editor";
  editor.dataset.noteBlockEditor = String(index);
  editor.spellcheck = false;
  editor.value = raw || NOTE_ZERO_WIDTH;
  if (!raw) caretPos = 1;
  editor.style.height = `${Math.max(32, Math.round(targetHeight))}px`;
  target.replaceWith(editor);
  noteEditingBlock = index;
  const scroller = $("#note-live");
  const before = scroller?.scrollTop || 0;
  editor.focus({ preventScroll: true });
  editor.setSelectionRange(caretPos, caretPos);
  setTimeout(() => {
    if (!editor.isConnected) return;
    editor.focus({ preventScroll: true });
    editor.setSelectionRange(caretPos, caretPos);
    if (scroller) scroller.scrollTop = before;
    keepNoteBaseline(editor);
  }, 0);
}

function noteGhostMarkup() {
  const first = noteBlocks[0];
  if (!first || String(first.raw || "").trim()) return "";
  return '<span class="note-ghost" data-note-ghost aria-hidden="true">Write something ...</span>';
}

function syncNoteGhost(editorIndex, raw) {
  if (Number(editorIndex) !== 0) return;
  const ghost = document.querySelector("#note-live [data-note-ghost]");
  if (!ghost) return;
  ghost.hidden = Boolean(String(raw || "").trim());
}

function notesHtml() {
  const category = selectedCategory();
  const active = activeNoteTarget();
  const notesIconSvg = `<svg class="notes-icon" aria-hidden="true"><use href="#${themeSymbol("notes")}"></use></svg>`;
  const notesIcon = `<button class="notes-icon-button" type="button" data-action="reveal-project-folder" aria-label="Open working folder in your file manager">${notesIconSvg}</button>`;
  // The note header carries only the current todo/subtask name. Folder details
  // live on the page-header napkin, not beside the title, and the sheet has no
  // ornament drawn on it.
  const topHandle = '<button class="notes-handle notes-handle-top" data-action="notes-button" type="button" aria-label="Hide note"></button>';
  if (!active) {
    const message = category ? "Add a todo to start a note..." : "Create a category to begin...";
    return `${topHandle}<div class="notes-head"><div class="notes-title">${notesIcon}<span>No note</span></div></div>
      <div class="notes-empty">${message}</div>`;
  }
  const { todo, subtask, kind, completed } = active;
  const noteTitle = kind === "subtask" ? subtask.name : todo.name;
  const note = String(kind === "subtask" ? (subtask.note || "") : (todo.note || ""));
  ensureNoteBlocks(active, note);
  if (noteBlocks.length && (noteEditingBlock === null || noteEditingBlock < 0 || noteEditingBlock >= noteBlocks.length)) {
    const memory = noteCaretMemory.get(noteTargetKey(active));
    noteEditingBlock = memory && noteBlocks[memory.block] ? memory.block : 0;
  }
  // Every note is text only: todo, subtask and completed notes share one
  // template, and there is no picture column to fill.
  const blocks = noteBlocks.map((block, index) => index === noteEditingBlock
    ? `<textarea class="note-block-editor" data-note-block-editor="${index}" spellcheck="false">${esc(block.raw || NOTE_ZERO_WIDTH)}</textarea>`
    : `<div class="note-block markdown" data-note-block="${index}">${block.raw.trim() ? renderMarkdown(block.raw) : ""}</div>`).join("");
  return `${topHandle}<div class="notes-head"><div class="notes-title">${notesIcon}<span>${esc(noteTitle)}</span></div></div>
    <div class="notes-body"><div class="note-live" id="note-live">${noteGhostMarkup()}${blocks}</div></div>`;
}

function renderNotesPanel() {
  const panel = $("#notes-half");
  if (!panel) return;
  const before = $("#note-live")?.scrollTop || 0;
  panel.innerHTML = notesHtml();
  setupNotesPanel();
  const scroller = $("#note-live");
  if (scroller) scroller.scrollTop = before;
  scheduleCustomCaret();
  saveViewState();
}

function updateHistorySelection() {
  const reel = $("#history-reel");
  if (!reel) return;
  // Only the newest selection keeps a highlight. A selected subtask is newer
  // than its parent row, and either selection outranks the ambient cursor.
  const suppressCursor = Boolean(selectedSubtaskId || selectedHistoryId);
  reel.querySelectorAll(".history-row").forEach((row) => {
    row.classList.toggle("selected", !selectedSubtaskId && row.dataset.todoId === selectedHistoryId);
    if (suppressCursor) row.classList.remove("cursor");
    else row.classList.toggle("cursor", Number(row.dataset.historyIndex) === historyCursor);
  });
  updateHistoryRoll();
  syncAgentTerminal();
}

function updateSubtaskSelection() {
  document.querySelectorAll(".current-subtask[data-subtask-id]").forEach((row) => {
    row.classList.toggle("selected", row.dataset.subtaskId === selectedSubtaskId);
  });
  document.querySelectorAll(".history-subtask[data-history-subtask-id]").forEach((row) => {
    row.classList.toggle("selected", row.dataset.historySubtaskId === selectedSubtaskId);
  });
  syncAgentTerminal();
}

function selectionTouchesSubtaskNames(selection) {
  if (!selection || !selection.rangeCount) return false;
  const range = selection.getRangeAt(0);
  return [...document.querySelectorAll(".current-subtask[data-subtask-id] .sub-name")]
    .some((span) => range.intersectsNode(span));
}

function deleteSubtaskRows(rows) {
  const inner = $(".current-inner");
  const todoId = inner?.dataset.currentTodo;
  if (!todoId || !rows.length) return;
  const ids = rows.map((row) => row.dataset.subtaskId);
  const burnUrl = iconThemeAsset(iconThemeById(settings.icon_theme), "rowBurn");
  const finish = () => {
    rows.forEach((row) => row.classList.add("subtask-vanishing"));
    animateSubtaskRowsAway(rows);
    setTimeout(() => {
      action("delete_subtasks", { todo_id: todoId, subtask_ids: ids });
    }, 320);
  };
  if (ids.includes(selectedSubtaskId)) selectedSubtaskId = null;
  if (burnUrl) {
    // Let the pepper reach the burning line, then fold the row away quickly.
    // The gif's inflation is trimmed to ~260ms, so the row starts folding
    // right after the fire lands instead of waiting out a long wind-up.
    rows.forEach((row, index) => playRowBurn(row, index > 0, burnUrl));
    setTimeout(finish, 520);
    return;
  }
  rows.forEach((row, index) => {
    playVanishSmoke(row.querySelector(".sub-fan") || row, index > 0);
    row.classList.add("subtask-vanishing");
  });
  animateSubtaskRowsAway(rows);
  setTimeout(() => {
    action("delete_subtasks", { todo_id: todoId, subtask_ids: ids });
  }, 320);
}

function deleteSelectedSubtasks(selection) {
  if (!selection || !selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const rows = [...document.querySelectorAll(".current-subtask[data-subtask-id]")].filter((row) => {
    if (row.classList.contains("done")) return false;
    const span = row.querySelector(".sub-name");
    return span && range.intersectsNode(span);
  });
  selection.removeAllRanges();
  deleteSubtaskRows(rows);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function applyNotesPanelRect() {
  const panel = $("#notes-half");
  if (!panel) return;
  const left = `${notesPanelRect.left * 100}%`;
  const top = `${notesPanelRect.top * 100}%`;
  const width = `${notesPanelRect.width * 100}%`;
  const height = `${notesPanelRect.height * 100}%`;
  if (panel.style.left !== left) panel.style.left = left;
  if (panel.style.top !== top) panel.style.top = top;
  if (panel.style.width !== width) panel.style.width = width;
  if (panel.style.height !== height) panel.style.height = height;
}

const TASK_ROW_HEIGHT = 40;
const TASK_VISIBLE_ROWS = 7;
const TASK_ROW_AREA_HEIGHT = TASK_ROW_HEIGHT * TASK_VISIBLE_ROWS;

/** One scrollable task column: completed history or the current subtasks. */
class TaskColumn {
  constructor(root, scroller) {
    this.root = root;
    this.scroller = scroller;
  }

  get ready() {
    return !!(this.scroller && this.scroller.isConnected);
  }

  /** Each subtask lane scrolls on its own; other columns use their root. */
  scrollerFor(row) {
    return row?.closest?.(".subtask-lane") || this.scroller;
  }

  scrollers() {
    if (!this.ready) return [];
    const lanes = [...this.scroller.querySelectorAll(".subtask-lane")];
    return lanes.length ? lanes : [this.scroller];
  }

  contentHeightFor(row) {
    const scroller = this.scrollerFor(row);
    return scroller && scroller.isConnected ? scroller.scrollHeight : 0;
  }

  get contentHeight() {
    return this.contentHeightFor(null);
  }

  contentNodeFor(row) {
    const scroller = this.scrollerFor(row);
    return scroller ? scroller.querySelector(".current-subtasks") : null;
  }

  get contentNode() {
    return this.contentNodeFor(null);
  }

  beginStretch() {
    if (!this.ready) return;
    const row = this.root?.querySelector(".current-subtask.selected")
      || this.root?.querySelector(".current-subtask.pending")
      || this.root?.querySelector(".current-subtask")
      || null;
    const scroller = this.scrollerFor(row);
    this.stretchScroller = scroller;
    this.stretchContent = this.contentNodeFor(row);
    this.stretchBase = scroller ? scroller.scrollTop : 0;
    this.stretchTarget = this.stretchBase;
    this.stretchContent?.classList.add("stretch-scroll");
  }

  endStretch() {
    const scroller = this.stretchScroller || this.scroller;
    if (scroller && Number.isFinite(this.stretchTarget)) {
      scroller.scrollTop = this.stretchTarget;
    }
    if (this.stretchContent) {
      this.stretchContent.style.transform = "";
      this.stretchContent.classList.remove("stretch-scroll");
    }
    this.stretchContent = null;
    this.stretchScroller = null;
    this.stretchTarget = null;
  }

  offsetOf(row) {
    if (!row || !this.ready) return 0;
    const scroller = this.scrollerFor(row);
    if (!scroller) return 0;
    const viewport = scroller.getBoundingClientRect();
    const rect = row.getBoundingClientRect();
    return Math.max(0, rect.top - viewport.top + scroller.scrollTop);
  }

  syncScrollable() {
    if (!this.ready) return false;
    let overflowing = false;
    this.scrollers().forEach((scroller) => {
      const over = scroller.scrollHeight > scroller.clientHeight + 12;
      scroller.classList.toggle("task-scrollable", over);
      scroller.style.overflowY = over ? "auto" : "hidden";
      if (!over) scroller.scrollTop = 0;
      overflowing = overflowing || over;
    });
    return overflowing;
  }

  /**
   * Keep a row above the note edge. `bottom` is the visible bottom measured
   * from the column top. The row rises with the note but never above the first
   * row and never past the real content limit.
   */
  reveal(row, bottom, cache = null) {
    if (!row || !this.ready) return;
    const scroller = this.scrollerFor(row);
    if (!scroller) return;
    const offset = cache && Number.isFinite(cache.offset) ? cache.offset : this.offsetOf(row);
    const visible = Math.min(bottom, TASK_ROW_AREA_HEIGHT);
    const content = cache && Number.isFinite(cache.content) ? cache.content : this.contentHeightFor(row);
    const max = Math.max(0, content - visible);
    const stretching = this.stretchContent && this.stretchScroller === scroller;
    const base = stretching && Number.isFinite(this.stretchBase) ? this.stretchBase : scroller.scrollTop;
    const needed = offset + TASK_ROW_HEIGHT - visible;
    // Only scroll up enough to rescue the row; keep the user's own scroll otherwise.
    const target = Math.max(0, Math.min(Math.max(base, needed), offset, max));
    if (stretching) {
      this.stretchTarget = target;
      const delta = target - base;
      const next = `translate3d(0, ${-delta}px, 0)`;
      if (this.stretchContent.style.transform !== next) this.stretchContent.style.transform = next;
      return;
    }
    if (scroller.scrollTop !== target) scroller.scrollTop = target;
  }
}

/** The ruled task block: fixed seven-row grid, divider and two columns. */
class TaskBoard {
  constructor() {
    this.section = $(".todos-section");
    this.history = new TaskColumn($(".history-half"), $("#history-reel"));
    this.current = new TaskColumn($(".current-half"), $(".current-inner"));
  }

  get ready() {
    return !!(this.section && this.section.isConnected);
  }

  resetHeight() {
    if (this.section) {
      this.section.style.flex = "";
      this.section.style.maxHeight = "";
    }
  }

  activeRow() {
    const target = activeNoteTarget();
    let row = null;
    if (target && target.kind === "subtask" && target.subtask) {
      row = this.current.root?.querySelector(`.current-subtask[data-subtask-id="${target.subtask.id}"]`) || null;
    }
    if (!row) {
      row = this.current.root?.querySelector(".current-subtask.pending")
        || this.current.root?.querySelector(".current-subtask")
        || null;
    }
    return row;
  }

  /** Cache everything the stretch loop needs, so no DOM reads happen per frame. */
  stretchCache() {
    const row = this.activeRow();
    const scroller = this.current.scrollerFor(row);
    return {
      row,
      offset: row ? this.current.offsetOf(row) : 0,
      content: this.current.contentHeightFor(row),
      baseScroll: scroller ? scroller.scrollTop : 0,
    };
  }

  revealActive(noteTop, cache = null) {
    const row = (cache && cache.row) || this.activeRow();
    if (row) this.current.reveal(row, noteTop, cache);
  }

  beginStretch() {
    this.current.beginStretch();
  }

  endStretch() {
    this.current.endStretch();
  }

  syncScrollers() {
    const overflowing = this.current.syncScrollable();
    this.history.syncScrollable();
    this.current.root?.classList.toggle("task-has-overflow", overflowing);
  }
}

/** The floating note panel. It owns the top edge and drives the task board. */
class NotesDock {
  constructor() {
    this.board = null;
    this.top = null;
  }

  attach(board) {
    this.board = board;
  }

  metrics() {
    const body = $(".page-body");
    const panel = $("#notes-half");
    if (!body || !panel) return null;
    const bodyHeight = body.clientHeight;
    return {
      body,
      panel,
      bodyHeight,
      minTop: 40,
      maxTop: Math.max(40, bodyHeight - 44),
    };
  }

  restoreDefault() {
    const panel = $("#notes-half");
    if (panel) {
      panel.classList.remove("stretch-ready");
      panel.style.top = "";
      panel.style.height = "";
    }
    this.board?.resetHeight();
  }

  /**
   * Give the note its full possible height once, before the gesture starts.
   * The rest of the drag only moves `top`, which the compositor can handle;
   * resizing the textured note every frame was the source of the jank.
   */
  prepareStretch(metrics = null) {
    const box = metrics || this.metrics();
    if (!box) return null;
    const panel = box.panel;
    const previousHeight = panel.style.height;
    panel.classList.add("stretch-ready");
    panel.style.height = `${box.bodyHeight - box.minTop}px`;
    return { metrics: box, previousHeight };
  }

  finishStretch(top, prepared = null) {
    const box = prepared?.metrics?.panel?.isConnected ? prepared.metrics : this.metrics();
    if (!box) return;
    const panel = box.panel;
    panel.classList.remove("stretch-ready");
    const finalTop = clamp(top, box.minTop, box.maxTop);
    panel.style.height = `${box.bodyHeight - finalTop}px`;
  }

  /** The note edge may rise only as far as the selected subtask's bottom rule. */
  activeMinTop(box) {
    const active = activeNoteTarget();
    if (!active || active.kind !== "subtask" || !active.subtask) return box.minTop;
    const id = CSS.escape(active.subtask.id);
    const row = document.querySelector(`.current-subtask[data-subtask-id="${id}"]`)
      || document.querySelector(`.history-subtask[data-history-subtask-id="${id}"]`);
    if (!row) return box.minTop;
    const bodyRect = box.body.getBoundingClientRect();
    const bottom = row.getBoundingClientRect().bottom - bodyRect.top;
    return Math.max(box.minTop, Math.round(bottom + 1));
  }

  setTop(rawTop, cache = null, metrics = null, reveal = true) {
    // A render during the gesture replaces the panel; re-resolve it.
    const box = metrics && metrics.panel?.isConnected ? metrics : this.metrics();
    if (!box || !this.board?.ready) return;
    const minTop = Math.min(this.activeMinTop(box), box.maxTop);
    const top = clamp(rawTop, minTop, box.maxTop);
    this.top = top;
    box.panel.style.top = `${top}px`;
    // While stretching, the height is already at its maximum; only top moves.
    if (!box.panel.classList.contains("stretch-ready")) {
      box.panel.style.height = `${box.bodyHeight - top}px`;
    }
    // Only an actual stretch gesture moves the task rows. Clicking a subtask
    // or the title must never jump the list.
    if (reveal) this.board.revealActive(top, cache);
  }

  /** Re-apply the stored stretch after a render or when the panel is shown. */
  applySaved(cache = null) {
    if (this.top === null || notesHidden) {
      this.restoreDefault();
      return;
    }
    this.setTop(this.top, cache, null, false);
  }
}

let taskBoard = null;
const notesDock = new NotesDock();

// A static slim progress thumb for a scroller. The native overlay scrollbar
// is hidden in CSS, so this is the only vertical bar the user ever sees.
function bindSlimScrollbar(scroller, host) {
  if (!scroller || !host) return null;
  let bar = host.querySelector(":scope > .slim-scrollbar");
  if (!bar) {
    bar = document.createElement("div");
    bar.className = "slim-scrollbar";
    host.appendChild(bar);
  }
  const update = () => {
    const maxScroll = scroller.scrollHeight - scroller.clientHeight;
    if (maxScroll <= 1 || !scroller.clientHeight) {
      bar.classList.remove("on");
      return;
    }
    const hostRect = host.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();
    const trackTop = scrollerRect.top - hostRect.top;
    const trackHeight = scroller.clientHeight;
    const thumbHeight = Math.max(24, Math.round(trackHeight * trackHeight / scroller.scrollHeight));
    const maxTop = Math.max(0, trackHeight - thumbHeight);
    const top = trackTop + Math.round((scroller.scrollTop / maxScroll) * maxTop);
    bar.style.top = `${Math.round(top)}px`;
    bar.style.height = `${thumbHeight}px`;
    bar.classList.add("on");
  };
  if (scroller.dataset.slimBound !== "1") {
    scroller.dataset.slimBound = "1";
    scroller.addEventListener("scroll", () => scroller._slimUpdate?.(), { passive: true });
    if (window.ResizeObserver) new ResizeObserver(() => scroller._slimUpdate?.()).observe(scroller);
  }
  scroller._slimUpdate = update;
  update();
  return update;
}

function refreshTaskBoard() {
  taskBoard = new TaskBoard();
  notesDock.attach(taskBoard);
  document.querySelectorAll(".subtask-lane[data-lane]").forEach((lane) => {
    bindSlimScrollbar(lane, lane.closest(".subtask-lane-column"));
  });
  return taskBoard;
}

function ensureTaskBoard() {
  if (!taskBoard || !taskBoard.ready) refreshTaskBoard();
  return taskBoard;
}

function applyNotesStretch() {
  ensureTaskBoard();
  notesDock.applySaved();
}

function syncTaskScrollers() {
  ensureTaskBoard().syncScrollers();
}

function setupNotesPanel() {
  const panel = $("#notes-half");
  if (!panel) return;
  panel.classList.add("floating-notes");
  panel.classList.toggle("notes-hidden", notesHidden);
  panel.style.left = "";
  panel.style.top = "";
  panel.style.width = "";
  panel.style.height = "";
  applyNotesStretch();
  if (!panel.dataset.pointerBound) {
    panel.dataset.pointerBound = "1";
    panel.addEventListener("click", (event) => {
      if (event.target.closest("button, a, input, textarea, .note-block, .note-block-editor, .notes-head")) return;
      focusActiveNoteEditor(false);
    });
  }
}

function startNotesDrag(event) {
  if (event.button !== 0) return;
  event.preventDefault();
  event.stopPropagation();
  const body = $(".page-body");
  const panel = $("#notes-half");
  if (!body || !panel) return;
  const bodyWidth = Math.max(1, body.clientWidth);
  const bodyHeight = Math.max(1, body.clientHeight);
  const start = { x: event.clientX, y: event.clientY, left: notesPanelRect.left, top: notesPanelRect.top };
  panel.classList.add("dragging");
  let frame = 0;
  const commit = () => {
    frame = 0;
    applyNotesPanelRect();
  };
  const move = (moveEvent) => {
    notesPanelRect.left = clamp(start.left + (moveEvent.clientX - start.x) / bodyWidth, 0, 1 - notesPanelRect.width);
    notesPanelRect.top = clamp(start.top + (moveEvent.clientY - start.y) / bodyHeight, 0, 1);
    if (!frame) frame = requestAnimationFrame(commit);
  };
  const up = () => {
    if (frame) { cancelAnimationFrame(frame); frame = 0; applyNotesPanelRect(); }
    panel.classList.remove("dragging");
    if (notesPanelRect.top > 0.62) {
      hideNotesPanel();
    } else {
      notesPanelRect.top = Math.min(notesPanelRect.top, 0.54);
      applyNotesPanelRect();
      saveNotesPanelRect();
    }
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

function startNotesResize(event) {
  if (event.button !== 0) return;
  event.preventDefault();
  event.stopPropagation();
  const body = $(".page-body");
  const panel = $("#notes-half");
  if (!body || !panel) return;
  const direction = event.currentTarget?.dataset?.notesResize || "se";
  const bodyWidth = Math.max(1, body.clientWidth);
  const bodyHeight = Math.max(1, body.clientHeight);
  const start = {
    x: event.clientX,
    y: event.clientY,
    left: notesPanelRect.left,
    top: notesPanelRect.top,
    width: notesPanelRect.width,
    height: notesPanelRect.height,
  };
  panel.classList.add("resizing");
  let frame = 0;
  const commit = () => {
    frame = 0;
    applyNotesPanelRect();
  };
  const move = (moveEvent) => {
    const dx = (moveEvent.clientX - start.x) / bodyWidth;
    const dy = (moveEvent.clientY - start.y) / bodyHeight;
    let left = start.left;
    let top = start.top;
    let width = start.width;
    let height = start.height;
    if (direction.includes("e")) width = clamp(start.width + dx, 0.3, 1 - start.left);
    if (direction.includes("s")) height = clamp(start.height + dy, 0.18, 1 - start.top);
    if (direction.includes("w")) {
      left = clamp(start.left + dx, 0, start.left + start.width - 0.2);
      width = start.width + (start.left - left);
    }
    if (direction.includes("n")) {
      top = clamp(start.top + dy, 0, start.top + start.height - 0.16);
      height = start.height + (start.top - top);
    }
    notesPanelRect = { left, top, width, height };
    if (!frame) frame = requestAnimationFrame(commit);
  };
  const up = () => {
    if (frame) { cancelAnimationFrame(frame); frame = 0; applyNotesPanelRect(); }
    panel.classList.remove("resizing");
    saveNotesPanelRect();
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}


function subtaskCaretIndex(span, event) {
  const length = span.textContent.length;
  if (!event || typeof document.caretRangeFromPoint !== "function") return length;
  const range = document.caretRangeFromPoint(event.clientX, event.clientY);
  if (!range || !range.startContainer || !span.contains(range.startContainer)) return length;
  const before = document.createRange();
  before.selectNodeContents(span);
  before.setEnd(range.startContainer, range.startOffset);
  return Math.max(0, Math.min(length, before.toString().length));
}

function selectCurrentSubtaskNote(row) {
  if (!row) return;
  AudioFX.categoryTap();
  saveActiveNoteCaret();
  flushNoteSave();
  selectedSubtaskId = row.dataset.subtaskId;
  selectedHistoryId = null;
  notesPreview = false;
  clearUnseenAgentSubtask(selectedSubtaskId);
  updateHistorySelection();
  updateSubtaskSelection();
  renderNotesPanel();
}

function playVanishSmoke(target, silent = false) {
  if (!target) return;
  const rect = target.getBoundingClientRect();
  if (!rect.width && !rect.height) return;
  if (!silent) AudioFX.exhale();
  const layer = document.createElement("div");
  layer.className = "subtask-smoke";
  layer.style.left = `${rect.left + rect.width / 2}px`;
  layer.style.top = `${rect.top + rect.height * 0.42}px`;
  for (let i = 0; i < 7; i += 1) {
    const puff = document.createElement("i");
    const angle = (Math.PI * 2 * i) / 7 + Math.random() * 0.7;
    const distance = 7 + Math.random() * 17;
    puff.style.setProperty("--dx", `${(Math.cos(angle) * distance).toFixed(1)}px`);
    puff.style.setProperty("--dy", `${(-14 - Math.random() * 26).toFixed(1)}px`);
    puff.style.setProperty("--size", `${(8 + Math.random() * 9).toFixed(1)}px`);
    puff.style.setProperty("--delay", `${i * 35}ms`);
    layer.appendChild(puff);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 1150);
}

/** Pvs row burn: the whole row rectangle is covered by the pepper's fire. */
function playRowBurn(row, silent = false, burnUrl = "") {
  if (!row) return false;
  const url = burnUrl || iconThemeAsset(iconThemeById(settings.icon_theme), "rowBurn");
  const rect = row.getBoundingClientRect();
  if (!url || (!rect.width && !rect.height)) {
    playVanishSmoke(row.querySelector(".sub-fan") || row, silent);
    return false;
  }
  if (!silent) AudioFX.burn();
  const layer = document.createElement("div");
  layer.className = "subtask-burn";
  layer.style.left = `${rect.left}px`;
  layer.style.top = `${rect.top}px`;
  layer.style.width = `${rect.width}px`;
  layer.style.height = `${rect.height}px`;
  layer.style.backgroundImage = `url("${url}")`;
  document.body.appendChild(layer);
  setTimeout(() => layer.classList.add("fading"), 580);
  setTimeout(() => layer.remove(), 860);
  return true;
}

function spawnPixelSplash(row) {
  const name = row?.querySelector(".sub-name") || row;
  if (!name) return;
  const rect = name.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const rowRect = row.getBoundingClientRect();
  const layer = document.createElement("div");
  layer.className = "dolphin-splash";
  layer.style.left = `${rect.right + 48}px`;
  layer.style.top = `${rowRect.bottom - 1}px`;

  const jet = document.createElement("span");
  jet.className = "ds-jet";
  layer.appendChild(jet);
  const jetTwo = document.createElement("span");
  jetTwo.className = "ds-jet ds-jet-two";
  layer.appendChild(jetTwo);
  const crown = document.createElement("span");
  crown.className = "ds-crown";
  layer.appendChild(crown);

  for (let i = 0; i < 3; i += 1) {
    const ripple = document.createElement("span");
    ripple.className = "ds-ripple";
    ripple.style.setProperty("--delay", `${i * 75}ms`);
    layer.appendChild(ripple);
  }

  const tones = ["#efffff", "#c9f5ff", "#9feaff", "#6ad9f8", "#38bde9"];
  for (let i = 0; i < 22; i += 1) {
    const drop = document.createElement("i");
    drop.className = "ds-drop";
    const spread = (i % 2 === 0 ? -1 : 1) * (14 + Math.random() * 46);
    drop.style.setProperty("--dx", `${spread.toFixed(1)}px`);
    drop.style.setProperty("--peak", `${(40 + Math.random() * 42).toFixed(1)}px`);
    drop.style.setProperty("--fall", `${(8 + Math.random() * 18).toFixed(1)}px`);
    drop.style.setProperty("--size", `${(2.4 + Math.random() * 3.6).toFixed(1)}px`);
    drop.style.setProperty("--delay", `${Math.round(Math.random() * 130)}ms`);
    drop.style.setProperty("--life", `${Math.round(640 + Math.random() * 260)}ms`);
    drop.style.setProperty("--tone", tones[i % tones.length]);
    layer.appendChild(drop);
  }

  for (let i = 0; i < 8; i += 1) {
    const bubble = document.createElement("i");
    bubble.className = "ds-bubble";
    bubble.style.setProperty("--dx", `${((Math.random() - 0.5) * 52).toFixed(1)}px`);
    bubble.style.setProperty("--rise", `${(18 + Math.random() * 38).toFixed(1)}px`);
    bubble.style.setProperty("--size", `${(2 + Math.random() * 2.8).toFixed(1)}px`);
    bubble.style.setProperty("--delay", `${Math.round(20 + Math.random() * 210)}ms`);
    bubble.style.setProperty("--life", `${Math.round(480 + Math.random() * 300)}ms`);
    layer.appendChild(bubble);
  }

  for (let i = 0; i < 6; i += 1) {
    const spark = document.createElement("i");
    spark.className = "ds-spark";
    spark.style.setProperty("--dx", `${((Math.random() - 0.5) * 76).toFixed(1)}px`);
    spark.style.setProperty("--dy", `${(16 + Math.random() * 46).toFixed(1)}px`);
    spark.style.setProperty("--delay", `${Math.round(30 + Math.random() * 160)}ms`);
    layer.appendChild(spark);
  }

  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 1450);
}

function animateSubtaskRowsAway(rows) {
  if (!rows.length) return;
  const all = [...document.querySelectorAll(".current-subtask")];
  const first = Math.min(...rows.map((row) => all.indexOf(row)));
  const below = all.slice(first + 1).filter((row) => !rows.includes(row));
  const before = new Map(below.map((row) => [row, row.getBoundingClientRect().top]));
  rows.forEach((row) => { row.style.display = "none"; });
  below.forEach((row) => {
    const oldTop = before.get(row);
    const newTop = row.getBoundingClientRect().top;
    const delta = oldTop - newTop;
    if (!delta) return;
    row.style.transition = "none";
    row.style.transform = `translateY(${delta}px)`;
    void row.offsetHeight;
    row.style.transition = "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)";
    row.style.transform = "translateY(0)";
    setTimeout(() => {
      if (!row.isConnected) return;
      row.style.transition = "";
      row.style.transform = "";
    }, 320);
  });
}

function vanishSubtaskRow(row, after) {
  if (!row) return;
  const burnUrl = iconThemeAsset(iconThemeById(settings.icon_theme), "rowBurn");
  if (burnUrl) {
    // Backspace / Enter on an empty inline subtask gets the same fast pepper
    // fire as a right-click delete, instead of the old smoke puff.
    playRowBurn(row, false, burnUrl);
    setTimeout(() => {
      row.classList.add("subtask-vanishing");
      animateSubtaskRowsAway([row]);
      if (after) setTimeout(after, 280);
    }, 520);
    return;
  }
  playVanishSmoke(row.querySelector(".sub-fan") || row);
  row.classList.add("subtask-vanishing");
  animateSubtaskRowsAway([row]);
  if (after) setTimeout(after, 320);
}

function startSubtaskRename(span, event) {
  const row = span.closest(".current-subtask[data-subtask-id]");
  const todoId = document.querySelector("[data-current-line]")?.dataset.currentTodo;
  const subtaskId = row?.dataset.subtaskId;
  // Completed subtasks are locked forever: they can open their note but not be renamed.
  if (!row || row.classList.contains("done") || !todoId || !subtaskId || row.querySelector(".sub-name-input")) return;
  const name = span.textContent;
  const caret = subtaskCaretIndex(span, event);
  const input = document.createElement("input");
  input.className = "sub-name-input";
  input.value = name;
  input.autocomplete = "off";
  input.spellcheck = false;
  input.style.width = `${Math.max(80, Math.ceil(span.getBoundingClientRect().width) + 36)}px`;
  span.replaceWith(input);
  input.focus();
  input.setSelectionRange(caret, caret);
  let done = false;
  const commit = (save) => {
    if (done) return;
    done = true;
    const next = input.value.trim();
    // Put the span back without re-rendering the whole stage. A full render
    // here replaces the header while the click is still being dispatched, so
    // clicking another note target (e.g. the todo title) would take two clicks.
    if (!save || !next || next === name) {
      if (input.isConnected) input.replaceWith(span);
      return;
    }
    action("rename_subtask", { todo_id: todoId, subtask_id: subtaskId, name: next });
  };
  const remove = () => {
    if (done) return;
    done = true;
    input.disabled = true;
    input.blur();
    if (selectedSubtaskId === subtaskId) selectedSubtaskId = null;
    vanishSubtaskRow(row, () => {
      action("delete_subtask", { todo_id: todoId, subtask_id: subtaskId });
    });
  };
  input.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (done) return;
    if (event.key === "Enter") {
      event.preventDefault();
      if (input.value.trim()) commit(true);
      else remove();
    }
    else if (event.key === "Escape") { event.preventDefault(); commit(false); }
    else if (event.key === "Backspace" && input.value === "" && input.selectionStart === 0) {
      event.preventDefault();
      remove();
    }

  });
  input.addEventListener("click", (event) => event.stopPropagation());
  input.addEventListener("blur", () => commit(true));
}

// The current todo is renamed in place, exactly like a subtask: a click puts
// the caret in the title and the name is edited in the line itself. The title
// span keeps its theme typography (size, italic face, per-theme nudge), so the
// only thing the editor changes is that the line can take the caret.
function todoCaretAtPoint(span, event) {
  const selection = window.getSelection?.();
  if (!selection) return;
  if (event && typeof document.caretRangeFromPoint === "function") {
    const range = document.caretRangeFromPoint(event.clientX, event.clientY);
    if (range && span.contains(range.startContainer)) {
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
  }
  const end = document.createRange();
  end.selectNodeContents(span);
  end.collapse(false);
  selection.removeAllRanges();
  selection.addRange(end);
}

function startTodoRename(span, event) {
  const line = span?.closest("[data-current-line]");
  const todoId = line?.dataset.currentTodo;
  // Finished todos live in the history reel and stay locked, so only the todo
  // on screen can be opened for editing.
  if (!span || !todoId || span.isContentEditable) return;
  const name = span.textContent;
  let done = false;
  const onKeydown = (event) => {
    // The page's own shortcuts must not fire while the title is being typed.
    event.stopPropagation();
    if (done) return;
    if (event.key === "Enter") {
      // Enter belongs to the IME while a composition is open.
      if (event.isComposing) return;
      event.preventDefault();
      commit(true);
    } else if (event.key === "Escape") {
      event.preventDefault();
      commit(false);
    }
  };
  // A title is one line of plain text: pasted rich text and line breaks would
  // otherwise leave markup inside the theme's span.
  const onPaste = (event) => {
    event.preventDefault();
    if (done) return;
    const text = String(event.clipboardData?.getData("text") || "").replace(/\s+/g, " ");
    if (text) document.execCommand("insertText", false, text);
  };
  const onClick = (event) => event.stopPropagation();
  const onDrop = (event) => {
    event.preventDefault();
    if (done) return;
    const text = String(event.dataTransfer?.getData("text") || "").replace(/\s+/g, " ");
    if (text) document.execCommand("insertText", false, text);
  };
  const onBlur = () => commit(true);
  const release = () => {
    span.removeAttribute("contenteditable");
    span.removeAttribute("spellcheck");
    span.classList.remove("todo-name-editing");
    span.removeEventListener("keydown", onKeydown);
    span.removeEventListener("paste", onPaste);
    span.removeEventListener("click", onClick);
    span.removeEventListener("drop", onDrop);
    span.removeEventListener("blur", onBlur);
  };
  const commit = (save) => {
    if (done) return;
    done = true;
    const next = String(span.textContent || "").trim();
    release();
    if (!save || !next || next === name) {
      span.textContent = name;
      return;
    }
    // Show the typed name at once; the server render lands with the same text.
    span.textContent = next;
    action("rename_todo", { id: todoId, name: next });
  };
  span.contentEditable = "true";
  span.spellcheck = false;
  span.classList.add("todo-name-editing");
  span.addEventListener("keydown", onKeydown);
  span.addEventListener("paste", onPaste);
  span.addEventListener("click", onClick);
  span.addEventListener("drop", onDrop);
  span.addEventListener("blur", onBlur);
  span.focus({ preventScroll: true });
  todoCaretAtPoint(span, event);
}

function agentContextString(target = null) {
  const category = selectedCategory();
  const todo = target?.todo || currentTodo();
  const subtask = target?.subtask;
  const subs = (todo?.subtasks || []).map((item) => `${item.name}${item.done ? " (done)" : ""}`).join(", ");
  let context = `Category: ${category?.name || "none"}; Todo: ${todo?.name || "none"}; Selected subtask: ${subtask?.name || "none"}; Subtasks: ${subs || "none"}.`;
  // The plugin's "attach active note" behavior: a new AI turn already knows
  // what the user is reading. Capped so a very long note cannot flood a run.
  if (aiConfig?.auto_attach_note !== false) {
    const note = String(subtask?.note ?? todo?.note ?? "").trim();
    if (note) context += `\n\nOpen note:\n${note.slice(0, 6000)}`;
  }
  return context;
}

function activeAgent() {
  if (detachedAgentOverride) return detachedAgentOverride;
  const category = selectedCategory();
  const target = activeNoteTarget();
  const context = agentContextString(target);
  if (target?.subtask) {
    return {
      id: `subtask:${target.subtask.id}`,
      kind: "subtask",
      title: target.subtask.name,
      category: category?.name || "",
      todo: target.todo?.name || "",
      mode: "build",
      scope: {
        kind: "subtask",
        category: category?.name || "",
        todo: target.todo?.name || "",
        todo_id: target.todo?.id || "",
        project_folder: target.todo?.project_folder || "",
        subtask: target.subtask.name,
        done: Boolean(target.subtask.done),
        context,
      },
    };
  }
  if (target?.todo) {
    return {
      id: `todo:${target.todo.id}`,
      kind: "todo",
      title: target.todo.name,
      category: category?.name || "",
      todo: target.todo.name,
      mode: "chat",
      scope: {
        kind: "todo",
        category: category?.name || "",
        todo: target.todo.name,
        todo_id: target.todo.id,
        project_folder: target.todo.project_folder || "",
        context,
      },
    };
  }
  return {
    id: "captain",
    kind: "captain",
    title: "NeoTodo",
    category: category?.name || "",
    todo: "",
    mode: "chat",
    scope: { kind: "captain", context },
  };
}

function agentModelLeaf(model) {
  const value = String(model || "");
  return value.includes("/") ? value.split("/").pop() : value;
}

function agentModelProvider(model) {
  const prefix = String(model || "").split("/")[0].toLowerCase();
  if (prefix === "deepseek") return "DeepSeek";
  if (prefix === "openai") return "OpenAI";
  if (prefix === "anthropic" || prefix === "claude") return "Anthropic";
  if (prefix === "opencode") return "OpenCode";
  return prefix ? prefix.charAt(0).toUpperCase() + prefix.slice(1) : "AI";
}

function currentAgentModel(agent) {
  return agentSessions[agent.id]?.model || agentDefaultModels[agent.kind] || agentDefaultModel;
}

function currentAgentMode(agent) {
  const mode = agentSessions[agent.id]?.mode;
  if (mode === "build" || mode === "chat") return mode;
  return agentDefaultModes[agent.kind] || (agent.kind === "subtask" ? "build" : "chat");
}

function formatAgentTokens(value) {
  const tokens = Number(value) || 0;
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`;
  return String(Math.round(tokens));
}

function formatAgentCost(value) {
  const cost = Number(value) || 0;
  if (!cost) return "$0";
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}

function agentProcessHtml(text) {
  if (!text) return "";
  const clean = String(text);
  const shown = clean.length > 2400 ? clean.slice(-2400) : clean;
  return `<div class="agent-process">${esc(shown)}</div>`;
}

function agentModelLeaf(model) {
  const value = String(model || "");
  return value.includes("/") ? value.split("/").pop() : value;
}

function agentModelProvider(model) {
  const prefix = String(model || "").split("/")[0].toLowerCase();
  if (prefix === "deepseek") return "DeepSeek";
  if (prefix === "openai") return "OpenAI";
  if (prefix === "anthropic" || prefix === "claude") return "Anthropic";
  if (prefix === "opencode") return "OpenCode";
  return prefix ? prefix.charAt(0).toUpperCase() + prefix.slice(1) : "AI";
}

function currentAgentModel(agent) {
  return agentSessions[agent.id]?.model || agentDefaultModel;
}

function formatAgentTokens(value) {
  const tokens = Number(value) || 0;
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`;
  return String(Math.round(tokens));
}

function formatAgentCost(value) {
  const cost = Number(value) || 0;
  if (!cost) return "$0";
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}

function formatAgentBytes(value) {
  const size = Number(value) || 0;
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  if (size >= 1024) return `${Math.round(size / 1024)} KB`;
  return `${size} B`;
}

function agentProcessHtml(text) {
  if (!text) return "";
  const clean = String(text);
  const shown = clean.length > 2400 ? clean.slice(-2400) : clean;
  return `<div class="agent-process">${esc(shown)}</div>`;
}

function agentAttachmentsFor(agentId) {
  if (!agentAttachments[agentId]) agentAttachments[agentId] = [];
  return agentAttachments[agentId];
}

function agentFilePin() {
  return `<svg class="agent-file-pin" viewBox="0 0 1024 1024" aria-hidden="true"><use href="#agent-file-pin"></use></svg>`;
}

function agentAttachedChips(items) {
  if (!Array.isArray(items) || !items.length) return "";
  const names = items.map((item) => (typeof item === "string" ? item : String(item?.name || ""))).filter(Boolean);
  if (!names.length) return "";
  return `<div class="agent-attached-files">${names.map((name) => `<span class="agent-attached-file">${agentFilePin()}<span>${esc(name)}</span></span>`).join("")}</div>`;
}

function agentSplitUiMarkup() {
  return `<div class="agent-split-handle" id="agent-split-handle" hidden></div>
    <div class="agent-split-chooser" id="agent-split-chooser" aria-hidden="true">
      <div class="agent-split-drop" data-agent-split-drop="left"></div>
      <div class="agent-split-drop" data-agent-split-drop="right"></div>
      <div class="agent-split-drop" data-agent-split-drop="top"></div>
      <div class="agent-split-drop" data-agent-split-drop="bottom"></div>
    </div>`;
}

// The split geometry lives in root custom properties, which every element on
// the page inherits: each changed value re-matches the whole sheet. The divider
// gesture calls updateAgentSplitLayout() once per animation frame, and most of
// those variables keep the same value between frames, so remember the last
// written value and skip the no-op writes. One changed variable per frame is
// what keeps the drag inside the frame budget.
const splitRootVars = new Map();
function setSplitRootVar(root, name, value) {
  if (splitRootVars.get(name) === value) return;
  splitRootVars.set(name, value);
  root.style.setProperty(name, value);
}

function updateAgentSplitLayout() {
  const active = agentTerminalOpen && !notesHidden && Boolean($("#notes-half"));
  const vertical = active && (agentSplitSide === "notes-top" || agentSplitSide === "notes-bottom");
  agentSplitRatio = clamp(agentSplitRatio, vertical ? 0.4 : 0.28, vertical ? 0.6 : 0.72);
  const resizing = document.body.classList.contains("agent-split-resizing")
    || deskHandleResizing();
  // Remembering the horizontal side is a synchronous localStorage write. During
  // a divider drag that would hit the disk once per frame; the drag handler
  // stores it once, on pointerup instead.
  if (!resizing && (agentSplitSide === "notes-left" || agentSplitSide === "notes-right")) {
    rememberHorizontalSplit();
  }
  document.body.classList.toggle("agent-notes-split", active);
  document.body.classList.toggle("agent-notes-left", active && agentSplitSide === "notes-left");
  document.body.classList.toggle("agent-notes-right", active && agentSplitSide === "notes-right");
  document.body.classList.toggle("agent-notes-top", active && agentSplitSide === "notes-top");
  document.body.classList.toggle("agent-notes-bottom", active && agentSplitSide === "notes-bottom");
  document.body.classList.toggle("agent-notes-axis-y", vertical);
  const left = (agentSplitRatio * 100).toFixed(2);
  const root = document.documentElement;
  const bodyRect = $(".page-body")?.getBoundingClientRect();
  const leftPx = bodyRect ? Math.round(bodyRect.width * agentSplitRatio) : 0;
  setSplitRootVar(root, "--agent-left-pct", `${left}%`);
  setSplitRootVar(root, "--agent-left-px", `${leftPx}px`);
  setSplitRootVar(root, "--agent-ai-left", "0%");
  setSplitRootVar(root, "--agent-ai-right", "0%");
  setSplitRootVar(root, "--agent-ai-pad-top", "0px");
  setSplitRootVar(root, "--agent-ai-pad-bottom", "0px");
  if (vertical) {
    const body = $(".page-body");
    if (body) {
      // Split the desk, not the whole page: the task region and the page
      // baseline must stay outside the note/AI geometry.
      const tasks = $(".todos-section");
      const deskTop = tasks ? Math.round(tasks.getBoundingClientRect().height) : 0;
      const deskHeight = Math.max(0, body.clientHeight - deskTop);
      const topHeight = deskHeight * agentSplitRatio;
      const gap = 0;
      const topSide = agentSplitSide === "notes-top";
      const notesHeight = Math.max(60, (topSide ? topHeight : deskHeight - topHeight) - gap);
      const notesTop = deskTop + (topSide ? 0 : topHeight + gap);
      const aiTop = deskTop + (topSide ? topHeight + gap : 0);
      const aiHeight = Math.max(60, (topSide ? deskHeight - topHeight : topHeight) - gap);
      const boundary = deskTop + topHeight;
      setSplitRootVar(root, "--agent-desk-top", `${deskTop}px`);
      setSplitRootVar(root, "--agent-desk-height", `${deskHeight}px`);
      setSplitRootVar(root, "--agent-ai-top", `${aiTop}px`);
      setSplitRootVar(root, "--agent-ai-height", `${aiHeight}px`);
      setSplitRootVar(root, "--agent-notes-y-top", `${notesTop}px`);
      setSplitRootVar(root, "--agent-notes-y-height", `${notesHeight}px`);
      setSplitRootVar(root, "--agent-split-y", `${boundary}px`);
    }
  } else {
    setSplitRootVar(root, "--agent-ai-top", "0px");
    setSplitRootVar(root, "--agent-ai-height", "0px");
    setSplitRootVar(root, "--agent-notes-y-top", "0px");
    setSplitRootVar(root, "--agent-notes-y-height", "0px");
    setSplitRootVar(root, "--agent-notes-left", agentSplitSide === "notes-left" ? "0%" : `${left}%`);
    setSplitRootVar(root, "--agent-notes-width", agentSplitSide === "notes-left" ? `${left}%` : `${100 - Number(left)}%`);
  }
  const handle = $("#agent-split-handle");
  if (handle) handle.hidden = !active;
  const chooser = $("#agent-split-chooser");
  if (chooser) chooser.setAttribute("aria-hidden", active ? "false" : "true");
  positionDeskHandles();
  positionAgentScrollRail();
  // While dragging the divider, panes and lines must follow every frame with
  // no CSS transition. Otherwise fast drags open a visible gap. A door-line
  // drag is direct manipulation too: there is nothing to follow, so the
  // 380ms measurement loop stays off and the gesture keeps the frame budget.
  // The lines were just placed above, so the resizing branch has nothing left
  // to do -- placing them twice measured the page twice in one frame, and that
  // second synchronous layout was half of the divider's stutter.
  if (!resizing) followPageLayout(380);
}

function agentTerminalMarkup() {
  return `<section class="agent-terminal ${agentTerminalOpen ? "open" : ""}" id="agent-terminal" aria-hidden="${agentTerminalOpen ? "false" : "true"}">
    <div class="agent-resize" data-agent-resize aria-label="Resize terminal"></div>
    <div class="agent-head">
      <div class="agent-head-left">
        <svg class="agent-provider-icon" viewBox="0 0 1024 1024" aria-hidden="true"><path d="M576 85.333333c0 18.944-8.234667 35.968-21.333333 47.701334V213.333333h213.333333a128 128 0 0 1 128 128v426.666667a128 128 0 0 1-128 128H256a128 128 0 0 1-128-128V341.333333a128 128 0 0 1 128-128h213.333333V133.034667A64 64 0 1 1 576 85.333333zM0 426.666667h85.333333v256H0v-256z m1024 0h-85.333333v256h85.333333v-256zM384 618.666667a64 64 0 1 0 0-128 64 64 0 0 0 0 128z m320-64a64 64 0 1 0-128 0 64 64 0 0 0 128 0z" fill="currentColor"/></svg>
        <span class="agent-provider" id="agent-provider">DeepSeek</span>
        <span class="agent-head-sep" aria-hidden="true">/</span>
        <span class="agent-head-agent" id="agent-head-agent">NeoTodo</span>
      </div>
    </div>
    <div class="agent-body">
      <div class="agent-main">
        <div class="agent-messages-wrap">
          <div class="agent-messages" id="agent-messages"></div>
          <div class="agent-scroll-rail" id="agent-scroll-rail" aria-hidden="true"></div>
        </div>
        <div class="agent-input-shell">
          <form class="agent-compose" id="agent-compose">
            <div class="agent-attach-chips" id="agent-attach-chips"></div>
            <textarea id="agent-input" rows="3" placeholder="Ask anything…" autocomplete="off" spellcheck="false"></textarea>
            <div class="agent-compose-foot">
              <button class="agent-attach" type="button" data-agent-attach aria-label="Attach files">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
              </button>
              <button class="agent-model-pick" type="button" data-agent-model-toggle aria-label="Choose model">
                <span id="agent-model-label">DeepSeek/deepseek-flash</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="agent-mode-pick" type="button" data-agent-mode-toggle aria-label="Switch work mode">
                <span id="agent-mode">Chat</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="agent-send" type="submit" aria-label="Send">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
            <input class="agent-file" type="file" id="agent-file" multiple>
            <div class="agent-model-menu" id="agent-model-menu" hidden></div>
            <div class="agent-mode-menu" id="agent-mode-menu" hidden></div>
          </form>
        </div>
        <div class="agent-meta" id="agent-meta">
          <span class="agent-meta-state" id="agent-meta-state"></span>
          <span class="agent-meta-esc" id="agent-meta-esc" aria-hidden="true"><kbd>esc</kbd> 打断</span>
          <span class="agent-meta-usage" id="agent-meta-usage"></span>
        </div>
      </div>
    </div>
  </section>`;
}

async function copyToClipboard(text) {
  const value = String(text || "");
  if (!value) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch (error) {}
  try {
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    area.style.top = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch (error) {
    return false;
  }
}

/* Notes and the other notebook pages copy themselves the same way the
   console does: select written text and it lands on the clipboard. Symbols,
   icons, shapes and rules are not text, so a selection made of them is left
   alone. A copy is silent: no badge, no toast, because the selection already
   says what happened. */
let lastPageCopiedText = "";

// The sheet a selection has to live in for the copy effect: the notebook
// pages, Categories, the drawers, and every popup the notebook opens over
// them (Settings, Community, AI settings, the postcard viewer, the timer and
// the sound panel). The console reads its own selection separately.
const PAGE_COPY_ZONE = "#stage, #notes-half, #category-list, #archive-drawer, #trash-drawer, #modal-root, #timer-root, #sound-panel";

// Fields in these sheets are written text too; the inline rename fields on
// the page are not, because selecting a name to replace it must not copy.
function pageCopyField(active) {
  if (!active?.matches?.("textarea, input")) return null;
  if (active.matches("textarea.note-block-editor, #notes-half textarea")) return active;
  if (active.closest("#modal-root, #timer-root, #sound-panel")) return active;
  return null;
}

// The page text a selection covers, or "" when the selection is not written
// text: a caret, a lone dash, an icon, a rule, a button label or the console.
function pageCopiedText() {
  const field = pageCopyField(document.activeElement);
  if (field) {
    const start = field.selectionStart;
    const end = field.selectionEnd;
    if (typeof start === "number" && typeof end === "number" && end > start) {
      const text = String(field.value || "").slice(start, end).trim();
      return /[\p{L}\p{N}]/u.test(text) ? text : "";
    }
    // A caret in a field leaves the page selection free to answer instead.
  }
  const selection = window.getSelection?.();
  if (!selection || selection.isCollapsed || !selection.rangeCount) return "";
  const text = selection.toString().trim();
  if (!text || !/[\p{L}\p{N}]/u.test(text)) return "";
  const range = selection.getRangeAt(0);
  let node = range.commonAncestorContainer;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  if (!node?.closest) return "";
  if (!node.closest(PAGE_COPY_ZONE)) return "";
  if (node.closest("#agent-terminal, .context-menu")) return "";
  if (node.closest("input, textarea, select, button, svg, [contenteditable='true'], [aria-hidden='true']")) return "";
  return text;
}

// "intheme" plugins run in their own same-origin frame, so the notebook binds
// the same gesture handlers inside that document.
function frameCopiedText(win) {
  const doc = win?.document;
  if (!doc) return "";
  const active = doc.activeElement;
  if (active?.matches?.("textarea, input")) {
    const start = active.selectionStart;
    const end = active.selectionEnd;
    if (typeof start === "number" && typeof end === "number" && end > start) {
      const fieldText = String(active.value || "").slice(start, end).trim();
      return /[\p{L}\p{N}]/u.test(fieldText) ? fieldText : "";
    }
    // A caret in a field leaves the page selection free to answer instead.
  }
  const selection = win.getSelection?.();
  if (!selection || selection.isCollapsed || !selection.rangeCount) return "";
  const text = selection.toString().trim();
  if (!text || !/[\p{L}\p{N}]/u.test(text)) return "";
  const range = selection.getRangeAt(0);
  let node = range.commonAncestorContainer;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  if (!node?.closest) return "";
  if (node.closest("input, textarea, select, button, svg, [contenteditable='true'], [aria-hidden='true']")) return "";
  return text;
}

function bindFrameCopy(frame) {
  if (!frame) return;
  let doc = null;
  let win = null;
  try {
    doc = frame.contentDocument;
    win = frame.contentWindow;
  } catch (error) {
    return;
  }
  if (!doc?.body || !win) return;
  // Mark the plugin document itself, so a reload inside the same frame binds
  // again instead of leaving stale handlers behind.
  if (doc.body.dataset.frameCopyBound === "1") return;
  doc.body.dataset.frameCopyBound = "1";

  // The plugin frame owns the focus, so its own clipboard is the reliable
  // path; the notebook's helper is the fallback.
  const copyFrameText = async (text) => {
    try {
      if (win.navigator.clipboard?.writeText) {
        await win.navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {}
    try {
      const area = doc.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.cssText = "position:fixed;left:-9999px;top:0";
      doc.body.appendChild(area);
      area.select();
      const ok = doc.execCommand("copy");
      area.remove();
      return ok;
    } catch (error) {
      return copyToClipboard(text);
    }
  };

  let lastText = "";
  const copySelection = () => {
    const text = frameCopiedText(win);
    if (!text) {
      lastText = "";
      return;
    }
    if (text === lastText) return;
    copyFrameText(text).then((ok) => {
      if (!ok) return;
      lastText = text;
    });
  };

  doc.addEventListener("pointerdown", () => {
    lastText = "";
  });
  doc.addEventListener("pointerup", () => setTimeout(copySelection, 0));
  doc.addEventListener("keyup", (event) => {
    if (event.key === "Shift" || event.key.startsWith("Arrow") || (event.key === "a" && (event.ctrlKey || event.metaKey))) {
      setTimeout(copySelection, 0);
    }
  });
}

function bindPageCopy() {
  if (document.body.dataset.pageCopyBound === "1") return;
  document.body.dataset.pageCopyBound = "1";

  const copySelection = () => {
    const text = pageCopiedText();
    if (!text) {
      lastPageCopiedText = "";
      return;
    }
    if (text === lastPageCopiedText) return;
    copyToClipboard(text).then((ok) => {
      if (!ok) return;
      lastPageCopiedText = text;
    });
  };

  // A fresh selection gesture may pick the very same words again, so forget
  // the previous hit when the drag starts.
  document.addEventListener("pointerdown", () => {
    lastPageCopiedText = "";
  });
  document.addEventListener("pointerup", () => setTimeout(copySelection, 0));
  document.addEventListener("keyup", (event) => {
    if (event.key === "Shift" || event.key.startsWith("Arrow") || (event.key === "a" && (event.ctrlKey || event.metaKey))) {
      setTimeout(copySelection, 0);
    }
  });
}

let lastAutoCopiedText = "";
function bindAgentMessages() {
  const messagesEl = $("#agent-messages");
  if (!messagesEl || messagesEl.dataset.agentCopyBound === "1") return;
  messagesEl.dataset.agentCopyBound = "1";

  messagesEl.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-agent-copy-index]");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    const agent = activeAgent();
    const index = Number(button.dataset.agentCopyIndex);
    const message = agentSessions[agent.id]?.messages?.[index];
    if (!message) return;
    if (await copyToClipboard(String(message.content || ""))) {
      button.classList.add("copied");
      setTimeout(() => button.classList.remove("copied"), 900);
    }
  });

  // Select-to-copy for the whole console: the reply, the thinking process, tool
  // output, notices and anything else in the sheet copies itself the moment it
  // is selected. The composer keeps its native field clipboard behaviour.
  const copySelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      lastAutoCopiedText = "";
      return;
    }
    const text = selection.toString().trim();
    if (!text) return;
    const range = selection.getRangeAt(0);
    let node = range.commonAncestorContainer;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    if (!node?.closest?.("#agent-terminal")) return;
    if (node.closest("input, textarea, [contenteditable='true']")) return;
    if (text === lastAutoCopiedText) return;
    copyToClipboard(text).then((ok) => {
      if (!ok) return;
      lastAutoCopiedText = text;
    });
  };

  let scrollFrame = 0;
  messagesEl.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      const id = messagesEl.dataset.agentId;
      if (!id) return;
      const atBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 34;
      agentScrollPositions[id] = { top: messagesEl.scrollTop, atBottom };
    });
  });

  // A fresh selection gesture may pick the very same words again, so forget
  // the previous hit when the drag starts.
  messagesEl.addEventListener("pointerdown", () => {
    lastAutoCopiedText = "";
  });
  messagesEl.addEventListener("mouseup", () => setTimeout(copySelection, 0));
  messagesEl.addEventListener("keyup", (event) => {
    if (event.key === "Shift" || event.key.startsWith("Arrow") || (event.key === "a" && (event.ctrlKey || event.metaKey))) {
      setTimeout(copySelection, 0);
    }
  });

  // The composer is a real field, so window.getSelection() stays collapsed
  // there. Read the field's own selection range instead, so text typed by the
  // user copies just like the replies do.
  const input = $("#agent-input");
  if (input && input.dataset.agentCopyBound !== "1") {
    input.dataset.agentCopyBound = "1";
    const copyFieldSelection = () => {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      if (start == null || end == null || start === end) {
        lastAutoCopiedText = "";
        return;
      }
      const text = input.value.slice(start, end).trim();
      if (!text || text === lastAutoCopiedText) return;
      copyToClipboard(text).then((ok) => {
        if (!ok) return;
        lastAutoCopiedText = text;
      });
    };
    // A drag can leave the field before the button comes up, so the release
    // is watched on the document instead of on the textarea alone.
    let fieldDragging = false;
    input.addEventListener("pointerdown", () => {
      lastAutoCopiedText = "";
      fieldDragging = true;
    });
    document.addEventListener("pointerup", () => {
      if (!fieldDragging) return;
      fieldDragging = false;
      setTimeout(() => copyFieldSelection(), 0);
    });
    input.addEventListener("keyup", (event) => {
      const selectKey = event.key === "Shift"
        || event.key.startsWith("Arrow")
        || (event.key === "a" && (event.ctrlKey || event.metaKey))
        || (event.key === "c" && (event.ctrlKey || event.metaKey));
      if (selectKey) setTimeout(copyFieldSelection, 0);
    });
  }
}

function bindAgentCompose() {
  const compose = $("#agent-compose");
  if (!compose || compose.dataset.agentBound === "1") return;
  compose.dataset.agentBound = "1";
  compose.addEventListener("click", (event) => {
    event.stopPropagation();
    const attach = event.target.closest("[data-agent-attach]");
    if (attach) {
      event.preventDefault();
      $("#agent-file")?.click();
      return;
    }
    const remove = event.target.closest("[data-agent-file-remove]");
    if (remove) {
      event.preventDefault();
      removeAgentFile(remove.dataset.agentFileRemove);
      return;
    }
    const toggle = event.target.closest("[data-agent-model-toggle]");
    if (toggle) {
      event.preventDefault();
      if (agentBusyIds.has(activeAgent().id)) return;
      agentModelMenuOpen = !agentModelMenuOpen;
      agentModeMenuOpen = false;
      if (agentModelMenuOpen) loadAgentModels();
      renderAgentTerminal();
      return;
    }
    const choice = event.target.closest("[data-agent-model-choice]");
    if (choice) {
      event.preventDefault();
      setAgentModel(choice.dataset.agentModelChoice);
      return;
    }
    const modeToggle = event.target.closest("[data-agent-mode-toggle]");
    if (modeToggle) {
      event.preventDefault();
      if (agentBusyIds.has(activeAgent().id)) return;
      agentModeMenuOpen = !agentModeMenuOpen;
      agentModelMenuOpen = false;
      renderAgentTerminal();
      return;
    }
    const modeChoice = event.target.closest("[data-agent-mode-choice]");
    if (modeChoice) {
      event.preventDefault();
      setAgentMode(modeChoice.dataset.agentModeChoice);
    }
  });
  compose.addEventListener("change", (event) => {
    if (event.target.id === "agent-file") {
      handleAgentFiles(Array.from(event.target.files || []));
      event.target.value = "";
    }
  });
  compose.addEventListener("paste", async (event) => {
    const transfer = event.clipboardData;
    if (!transfer) return;
    const files = Array.from(transfer.files || []);
    if (files.length) {
      event.preventDefault();
      await handleAgentFiles(files);
      return;
    }
    const text = transfer.getData("text/uri-list") || transfer.getData("text/plain") || "";
    const paths = agentPastePaths(text);
    if (!paths.length) return;
    event.preventDefault();
    await attachAgentPaths(paths);
  });
  compose.addEventListener("dragover", (event) => {
    event.preventDefault();
    compose.classList.add("drag-over");
    if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
  });
  compose.addEventListener("dragleave", () => compose.classList.remove("drag-over"));
  compose.addEventListener("drop", async (event) => {
    event.preventDefault();
    compose.classList.remove("drag-over");
    const transfer = event.dataTransfer;
    if (!transfer) return;
    if (transfer.files && transfer.files.length) {
      await handleAgentFiles(Array.from(transfer.files));
    }
  });
}

function swapAgentSplitSide(nextSide) {
  if (!nextSide || nextSide === agentSplitSide) return;
  const currentVertical = agentSplitSide === "notes-top" || agentSplitSide === "notes-bottom";
  const nextVertical = nextSide === "notes-top" || nextSide === "notes-bottom";
  if (currentVertical !== nextVertical) {
    agentSplitRatio = 0.5;
    try { localStorage.setItem("neotodo.agentSplitRatio.v2", "0.5"); } catch (error) {}
  }
  const notes = $("#notes-half");
  const terminal = $("#agent-terminal");
  const handle = $("#agent-split-handle");
  const snap = (element) => {
    const rect = element?.getBoundingClientRect();
    return rect ? { left: rect.left, top: rect.top } : null;
  };
  const before = { notes: snap(notes), terminal: snap(terminal), handle: snap(handle) };
  notes?.classList.remove("split-lifted");
  terminal?.classList.remove("split-lifted");
  document.body.classList.remove("agent-split-drag");
  document.body.classList.add("agent-split-flip");
  agentSplitSide = nextSide;
  try { localStorage.setItem("neotodo.agentSplitSide.v2", agentSplitSide); } catch (error) {}
  updateAgentSplitLayout();
  const after = { notes: snap(notes), terminal: snap(terminal), handle: snap(handle) };
  const invert = (element, from, to) => {
    if (!element || !from || !to) return;
    element.style.transform = `translate(${from.left - to.left}px, ${from.top - to.top}px)`;
  };
  invert(notes, before.notes, after.notes);
  invert(terminal, before.terminal, after.terminal);
  if (handle && before.handle && after.handle) {
    handle.style.transform = `translate(${before.handle.left - after.handle.left}px, 0) translateX(-50%)`;
  }
  void document.body.offsetWidth;
  document.body.classList.add("agent-split-flipping");
  requestAnimationFrame(() => {
    [notes, terminal, handle].forEach((element) => {
      if (element) element.style.transform = "";
    });
  });
  setTimeout(() => {
    document.body.classList.remove("agent-split-flip", "agent-split-flipping");
    [notes, terminal, handle].forEach((element) => {
      if (element) element.style.transform = "";
    });
  }, 360);
}

function agentDeskRect() {
  const body = $(".page-body");
  if (!body) return null;
  const bodyRect = body.getBoundingClientRect();
  const height = body.clientHeight;
  const top = bodyRect.top;
  return {
    left: bodyRect.left,
    right: bodyRect.right,
    top,
    bottom: top + height,
    width: bodyRect.width,
    height,
  };
}

// --------------------------------------------------------------------------
// Divider drag: one geometry write per frame
// --------------------------------------------------------------------------
// A mouse/trackpad reports pointer movement several times per painted frame,
// and the divider used to run the whole split layout pass on every one of those
// events -- measure the page, rewrite the inherited root variables (which
// restyles every element), place both door lines twice. The frames piled up and
// the divider trailed the pointer.
//
// Two rules keep it smooth:
//   1. the pointer stream is coalesced into a single requestAnimationFrame;
//   2. while the divider is held, the boundary is written straight onto the two
//      panes instead of through the inherited root variables. Only those two
//      subtrees are invalidated, so a fast drag never restyles the task rows,
//      the wallpaper or the completed list.
const SPLIT_BOX_PROPS = ["left", "right", "width"];

// The preview writes over whatever inline box the panes already carry (the note
// mask remembers its floating rect in inline styles), so the exact previous
// values -- including their priority -- are captured once, on pointerdown, and
// put back on release.
const splitInlineSnapshot = [];

function rememberSplitInlineBox() {
  splitInlineSnapshot.length = 0;
  [$("#notes-half"), $("#agent-terminal"), $("#agent-split-handle")].forEach((element) => {
    if (!element) return;
    SPLIT_BOX_PROPS.forEach((prop) => {
      splitInlineSnapshot.push({
        element,
        prop,
        value: element.style.getPropertyValue(prop),
        priority: element.style.getPropertyPriority(prop),
      });
    });
  });
}

function restoreSplitInlineBox() {
  splitInlineSnapshot.forEach(({ element, prop, value, priority }) => {
    if (value) element.style.setProperty(prop, value, priority);
    else element.style.removeProperty(prop);
  });
  splitInlineSnapshot.length = 0;
}

function previewHorizontalSplit(boundary) {
  const notesOnLeft = agentSplitSide === "notes-left";
  const edge = `${Math.round(boundary)}px`;
  const setBox = (element, box) => {
    if (!element) return;
    Object.keys(box).forEach((prop) => {
      element.style.setProperty(prop, box[prop], "important");
    });
  };
  // Mirrors the split rules in page-layout.css: the pane that owns the divider
  // gets the boundary as its width, the other one starts at the boundary.
  setBox($("#notes-half"), notesOnLeft
    ? { left: "0px", right: "auto", width: edge }
    : { left: edge, right: "0px", width: "auto" });
  setBox($("#agent-terminal"), notesOnLeft
    ? { left: edge, right: "0px", width: "auto" }
    : { left: "0px", right: "auto", width: edge });
  setBox($("#agent-split-handle"), { left: edge, right: "auto" });
  // The door lines follow the desk shape; one measurement for the frame.
  positionDeskHandles();
}

// Hand the geometry back to the root variables, then drop the temporary inline
// boxes so the stylesheets own the split again. The drag flag stays on until
// the very end: the layout pass then skips its 380ms measurement loop, because
// this gesture has just measured and placed everything itself.
function commitHorizontalSplit() {
  updateAgentSplitLayout();
  restoreSplitInlineBox();
  document.body.classList.remove("agent-split-resizing");
  positionDeskHandles();
}

function bindAgentSplitHandle() {
  const handle = $("#agent-split-handle");
  if (!handle || handle.dataset.bound === "1") return;
  handle.dataset.bound = "1";
  handle.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || !document.body.classList.contains("agent-notes-split")) return;
    const body = $(".page-body");
    if (!body) return;
    event.preventDefault();
    event.stopPropagation();
    // One measurement for the whole gesture: re-reading the page box on every
    // pointer event forced a synchronous layout before the previous frame was
    // even painted.
    const rect = body.getBoundingClientRect();
    const vertical = document.body.classList.contains("agent-notes-axis-y");
    const desk = vertical ? agentDeskRect() : null;
    // Capture the panes' current inline box before the preview overwrites it.
    if (!vertical) rememberSplitInlineBox();
    document.body.classList.add("agent-split-resizing");
    try { handle.setPointerCapture?.(event.pointerId); } catch (error) {}
    let pending = null;
    let frame = 0;
    let changed = false;
    const apply = () => {
      frame = 0;
      const point = pending;
      pending = null;
      if (!point) return;
      const ratio = vertical && desk
        ? clamp((point.y - desk.top) / Math.max(1, desk.height), 0.4, 0.6)
        : clamp((point.x - rect.left) / Math.max(1, rect.width), 0.28, 0.72);
      // A horizontal drag also reports vertical movement; the ratio is the same
      // and there is nothing to redraw.
      if (ratio === agentSplitRatio) return;
      agentSplitRatio = ratio;
      changed = true;
      if (vertical) updateAgentSplitLayout();
      else previewHorizontalSplit(rect.width * ratio);
    };
    const move = (moveEvent) => {
      pending = { x: moveEvent.clientX, y: moveEvent.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const up = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      pending = null;
      try { localStorage.setItem("neotodo.agentSplitRatio.v2", String(agentSplitRatio)); } catch (error) {}
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      if (changed && !vertical) {
        changed = false;
        commitHorizontalSplit();
      } else {
        // Nothing moved: no inline box was written, so the capture is dropped.
        splitInlineSnapshot.length = 0;
        document.body.classList.remove("agent-split-resizing");
        positionDeskHandles();
      }
      // The per-frame layout pass skips this while a divider is held.
      rememberHorizontalSplit();
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    // Losing the pointer (native menu, alt-tab, touch cancelled) must still hand
    // the geometry back, or the temporary boxes would stay behind.
    window.addEventListener("pointercancel", up);
  });
}

function positionAgentMenus() {
  const compose = $("#agent-compose");
  if (!compose) return;
  const composeRect = compose.getBoundingClientRect();
  const place = (menu, button) => {
    if (!menu || menu.hidden || !button) return;
    const rect = button.getBoundingClientRect();
    const width = menu.offsetWidth || 170;
    const left = Math.max(8, Math.min(rect.left - composeRect.left, composeRect.width - width - 8));
    menu.style.left = `${Math.round(left)}px`;
    menu.style.right = "auto";
    menu.style.bottom = `${Math.round(composeRect.bottom - rect.top + 6)}px`;
  };
  place($("#agent-model-menu"), $(".agent-model-pick"));
  place($("#agent-mode-menu"), $(".agent-mode-pick"));
}

function bindAgentScrollRail() {
  const messagesEl = $("#agent-messages");
  const rail = $("#agent-scroll-rail");
  if (messagesEl && messagesEl.dataset.scrollRail !== "1") {
    messagesEl.dataset.scrollRail = "1";
    messagesEl.addEventListener("scroll", updateAgentScrollRail, { passive: true });
  }
  if (rail && rail.dataset.scrollRail !== "1") {
    rail.dataset.scrollRail = "1";
    rail.addEventListener("click", (event) => {
      const tick = event.target.closest("[data-agent-scroll-index]");
      if (!tick) return;
      const index = Number(tick.dataset.agentScrollIndex);
      const target = messagesEl?.querySelector(`[data-agent-msg-index="${index}"]`);
      if (!target) return;
      const top = target.offsetTop - messagesEl.clientHeight / 2 + target.offsetHeight / 2;
      messagesEl.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  }
}

// The rail counts conversations, not raw messages: every user turn adds one
// tick, and only the eight most recent turns stay on the rail.
const AGENT_SCROLL_RAIL_MAX = 8;

function agentConversationAnchors(messages) {
  const anchors = [];
  (Array.isArray(messages) ? messages : []).forEach((message, index) => {
    if (message?.role === "user") anchors.push(index);
  });
  return anchors;
}

function renderAgentScrollRail(messages) {
  const rail = $("#agent-scroll-rail");
  if (!rail) return;
  positionAgentScrollRail();
  const anchors = agentConversationAnchors(messages);
  const shown = anchors.length > AGENT_SCROLL_RAIL_MAX
    ? anchors.slice(anchors.length - AGENT_SCROLL_RAIL_MAX)
    : anchors;
  if (!shown.length) {
    rail.innerHTML = "";
    rail.hidden = true;
    return;
  }
  rail.hidden = false;
  rail.innerHTML = shown
    .map((index, order) => `<button class="agent-scroll-tick" type="button" data-agent-scroll-index="${index}" aria-label="Conversation ${order + 1} of ${shown.length}"></button>`)
    .join("");
}

// The rail lives in the gutter between the chat body and the AI panel edge.
// Its width follows whatever side padding the current skin applies.
function positionAgentScrollRail() {
  const rail = $("#agent-scroll-rail");
  const wrap = rail?.closest(".agent-messages-wrap");
  const main = rail?.closest(".agent-main");
  if (!rail || !wrap || !main || !main.isConnected) return;
  const gutter = Math.round(main.getBoundingClientRect().right - wrap.getBoundingClientRect().right);
  if (gutter <= 0) return;
  rail.style.right = `${-gutter}px`;
  rail.style.width = `${gutter}px`;
}

function updateAgentScrollRail() {
  const messagesEl = $("#agent-messages");
  const rail = $("#agent-scroll-rail");
  if (!messagesEl || !rail || rail.hidden) return;
  const maxScroll = messagesEl.scrollHeight - messagesEl.clientHeight;
  const progress = maxScroll > 1 ? Math.max(0, Math.min(1, messagesEl.scrollTop / maxScroll)) : 0;
  const ticks = [...rail.querySelectorAll(".agent-scroll-tick")];
  if (!ticks.length) return;
  const active = progress * (ticks.length - 1);
  ticks.forEach((tick, index) => {
    const near = Math.max(0, 1 - Math.abs(index - active) / 1.9);
    // Keep every tick readable so the rail never looks like it only has two.
    tick.style.opacity = String(0.3 + near * 0.62);
    tick.style.width = `${6 + near * 7}px`;
    tick.style.height = `${1.6 + near * 1.1}px`;
    tick.classList.toggle("active", index === Math.round(active));
  });
}

let agentSwapPinFrame = 0;

function pinAgentMessagesToBottom() {
  const messagesEl = $("#agent-messages");
  if (!messagesEl) return;
  messagesEl.scrollTop = messagesEl.scrollHeight;
  const id = messagesEl.dataset.agentId;
  if (id) agentScrollPositions[id] = { top: messagesEl.scrollTop, atBottom: true };
}

// A conversation swap is pinned to the newest turn in the same layout pass, so
// the card never paints the first message and then slides down to the last one.
function settleAgentMessageSwap() {
  if (agentSwapPinFrame) cancelAnimationFrame(agentSwapPinFrame);
  pinAgentMessagesToBottom();
  agentSwapPinFrame = requestAnimationFrame(() => {
    agentSwapPinFrame = 0;
    pinAgentMessagesToBottom();
  });
}

function renderAgentTerminal() {
  const panel = $("#agent-terminal");
  const tool = document.querySelector(".terminal-tool");
  tool?.classList.toggle("active", agentTerminalOpen);
  if (!panel) return;
  // The card is created by the stage markup, so its inline theme palette has
  // to be repainted whenever a fresh element appears.
  if (typeof settings !== "undefined" && settings) applyAiTheme();
  panel.classList.toggle("open", agentTerminalOpen);
  panel.setAttribute("aria-hidden", agentTerminalOpen ? "false" : "true");
  if (!agentTerminalOpen) { updateAgentSplitLayout(); return; }
  bindAgentCompose();
  bindAgentSplitHandle();

  const agent = activeAgent();
  const model = currentAgentModel(agent);
  const mode = currentAgentMode(agent);
  const provider = $("#agent-provider");
  if (provider) provider.textContent = agentModelProvider(model);
  const heading = $("#agent-head-agent");
  if (heading) heading.textContent = agent.title;

  if (!agentModels.length) loadAgentModels();
  if (!agentLoadedIds.has(agent.id) && !agentLoadingIds.has(agent.id)) {
    agentLoadingIds.add(agent.id);
    loadAgentSession(agent.id);
  }
  const loading = agentLoadingIds.has(agent.id);
  const busy = agentBusyIds.has(agent.id);
  const uploading = agentUploadingIds.has(agent.id);
  const queued = mode === "build" && agentQueuedIds.has(agent.id);
  const queuePosition = Number(agentQueuePositions[agent.id]) || 0;
  const session = agentSessions[agent.id] || { messages: [] };
  const messages = Array.isArray(session.messages) ? session.messages : [];
  const messagesEl = $("#agent-messages");
  bindAgentMessages();
  const agentChanged = Boolean(messagesEl && messagesEl.dataset.agentId !== agent.id);
  const cachedScroll = agentScrollPositions[agent.id] || null;
  const forceBottom = agentPinBottom || agentChanged;
  // A conversation that has not arrived yet must not blank the card: keep the
  // outgoing turns painted until the fetch resolves, then swap in one frame.
  const awaitingSession = agentChanged
    && agentLoadingIds.has(agent.id)
    && !agentLoadedIds.has(agent.id)
    && !messages.length
    && !agentPinBottom;
  const holdPrevious = Boolean(awaitingSession && messagesEl?.childElementCount);
  const liveForSignature = agentLive[agent.id] || {};
  const messagesSignature = `${agent.id}|${busy ? 1 : 0}|${messages.length}|${messages.map((m) => `${m.role}:${String(m.content || "").length}`).join("|")}|${String(liveForSignature.text || "").length}|${String(liveForSignature.process || "").length}`;
  if (messagesEl && !holdPrevious && messagesEl.dataset.messagesSignature !== messagesSignature) {
    messagesEl.dataset.messagesSignature = messagesSignature;
    const atBottom = forceBottom
      || Boolean(cachedScroll?.atBottom)
      || messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 34;
    const previousScroll = messagesEl.scrollTop;
    let html = "";
    messages.forEach((message, index) => {
      const role = message.role === "assistant" ? "assistant" : message.role === "system" ? "system" : "user";
      // The pending assistant is what is currently streaming below. Rendering
      // it here would label every live run as "Interrupted".
      if (role === "assistant" && message.pending && busy) return;
      if (role === "user") {
        html += `<div class="agent-line user" data-agent-msg-index="${index}"><div class="agent-line-text">${esc(message.content || "")}</div>${agentAttachedChips(message.attachments)}<button type="button" class="agent-user-copy" data-agent-copy-index="${index}" aria-label="Copy message"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"></rect><path d="M5 15V6a2 2 0 0 1 2-2h9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></svg></button></div>`;
      } else if (role === "system") {
        html += `<div class="agent-notice" data-agent-msg-index="${index}">${esc(message.content || "")}</div>`;
      } else {
        const pendingNote = message.pending
          ? `<div class="agent-notice agent-pending-note">Interrupted</div>`
          : "";
        html += `<div class="agent-run" data-agent-msg-index="${index}">${agentProcessHtml(message.process)}<div class="agent-reply">${renderMarkdown(message.content || "")}</div>${pendingNote}</div>`;
      }
    });
    const live = agentLive[agent.id] || {};
    if (busy) {
      const liveProcess = String(live.process || "").slice(-12000);
      const liveText = String(live.text || "").slice(-12000);
      html += `<div class="agent-live" data-agent-msg-index="${messages.length}">${agentProcessHtml(liveProcess)}`;
      if (liveText) html += `<div class="agent-reply">${renderMarkdown(liveText)}</div>`;
      html += `<span class="agent-working-cursor" aria-hidden="true"></span></div>`;
    }
    messagesEl.innerHTML = html;
    messagesEl.dataset.agentId = agent.id;
    // Do not drag the user back to the bottom while they are reading history.
    messagesEl.scrollTop = atBottom ? messagesEl.scrollHeight : previousScroll;
    if (atBottom) agentScrollPositions[agent.id] = { top: messagesEl.scrollTop, atBottom: true };
    agentPinBottom = false;
    if (agentChanged) settleAgentMessageSwap();
    else if (forceBottom) scrollAgentMessagesToBottom();
    bindAgentScrollRail();
    renderAgentScrollRail(messages);
    updateAgentScrollRail();
  } else if (messagesEl && forceBottom && !holdPrevious) {
    messagesEl.scrollTop = messagesEl.scrollHeight;
    agentPinBottom = false;
  }

  const label = `${agentModelProvider(model)}/${agentModelLeaf(model)}`;
  const modelLabel = $("#agent-model-label");
  if (modelLabel) modelLabel.textContent = label;
  const modeEl = $("#agent-mode");
  if (modeEl) modeEl.textContent = mode === "build" ? "Build" : "Chat";
  const modeMenu = $("#agent-mode-menu");
  if (modeMenu) {
    modeMenu.hidden = !agentModeMenuOpen;
    if (agentModeMenuOpen) {
      modeMenu.innerHTML = ["chat", "build"].map((item) => `<button type="button" class="agent-mode-option ${item === mode ? "active" : ""}" data-agent-mode-choice="${item}"><span>${item === "build" ? "Build" : "Chat"}</span>${item === mode ? `<span class="agent-model-check">✓</span>` : ""}</button>`).join("");
    }
  }

  positionAgentMenus();

  const attachments = agentAttachmentsFor(agent.id);
  const chips = $("#agent-attach-chips");
  if (chips) {
    chips.innerHTML = attachments.map((file) => `<span class="agent-chip">${agentFilePin()}<span class="agent-chip-name">${esc(file.name)}</span><span class="agent-chip-size">${formatAgentBytes(file.size)}</span><button type="button" class="agent-chip-remove" data-agent-file-remove="${esc(file.name)}" aria-label="Remove ${esc(file.name)}"${busy || loading || uploading ? " disabled" : ""}>×</button></span>`).join("");
    chips.classList.toggle("has-files", attachments.length > 0);
  }

  const menu = $("#agent-model-menu");
  if (menu) {
    menu.hidden = !agentModelMenuOpen;
    if (agentModelMenuOpen) {
      const pickerModels = agentModels.includes(model) ? agentModels : [model, ...agentModels];
      menu.innerHTML = pickerModels.length
        ? pickerModels.filter(Boolean).map((item) => `<button type="button" class="agent-model-option ${item === model ? "active" : ""}" data-agent-model-choice="${esc(item)}"><span>${esc(agentModelProvider(item))}/${esc(agentModelLeaf(item))}</span>${item === model ? `<span class="agent-model-check">✓</span>` : ""}</button>`).join("")
        : `<div class="agent-model-empty">Loading models…</div>`;
    }
  }


  const live = agentLive[agent.id] || {};
  let usage = (busy && live.usage?.tokens ? live.usage : session.usage) || {};
  if (!usage.tokens && !usage.cost) {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const candidate = messages[index]?.usage;
      if (candidate && (candidate.tokens || candidate.cost || candidate.context)) {
        usage = candidate;
        break;
      }
    }
  }
  const stateEl = $("#agent-meta-state");
  if (stateEl) {
    stateEl.textContent = loading ? "…" : busy ? (queued ? (queuePosition ? `queued #${queuePosition}…` : "queued…") : "working…") : "";
    stateEl.classList.toggle("busy", Boolean(busy));
  }
  const escEl = $("#agent-meta-esc");
  if (escEl) {
    // A requested pause is already on its way: hide the hint at once instead
    // of inviting a second Esc while the worker winds down.
    const canInterrupt = Boolean(busy && !loading && !uploading && !agentPausedIds.has(agent.id));
    escEl.classList.toggle("show", canInterrupt);
    escEl.setAttribute("aria-hidden", canInterrupt ? "false" : "true");
  }
  const usageEl = $("#agent-meta-usage");
  if (usageEl) {
    const tokens = Number(usage.tokens) || 0;
    const cost = Number(usage.cost) || 0;
    const pct = usage.context ? Math.max(1, Math.min(100, Math.round(Number(usage.context) / 1280))) : 0;
    usageEl.textContent = `${formatAgentTokens(tokens)} (${pct}%)  ·  ${formatAgentCost(cost)}`;
  }

  const input = $("#agent-input");
  if (input) {
    const previousAgent = agentInputAgentId;
    if (previousAgent !== agent.id) {
      if (previousAgent && input.value !== (agentDrafts[previousAgent] || "")) saveAgentDraft(previousAgent, input.value);
      agentInputAgentId = agent.id;
      input.value = agentDrafts[agent.id] || "";
      resizeAgentInput(input);
    } else if (!input.value && agentDrafts[agent.id]) {
      // Recover an unsent draft after a crash or window reload.
      input.value = agentDrafts[agent.id];
      resizeAgentInput(input);
    }
    input.disabled = Boolean(busy || loading);
    input.placeholder = mode === "build" ? "Describe the work…" : "Ask anything…";
    if (input.value === "" && !input.disabled) input.style.height = "";
  }
  const attach = $(".agent-attach");
  if (attach) attach.disabled = Boolean(busy || loading || uploading);
  const pick = $(".agent-model-pick");
  if (pick) pick.disabled = Boolean(busy || loading);
  const modePick = $(".agent-mode-pick");
  if (modePick) modePick.disabled = Boolean(busy || loading);
  const send = $(".agent-send");
  if (send) send.disabled = Boolean(busy || loading || uploading);
  updateAgentSplitLayout();
}

async function loadAgentModels() {
  if (agentModels.length) return agentModels;
  if (agentModelsLoading) return agentModelsLoading;
  agentModelsLoading = (async () => {
    try {
      const data = await agentPost({ action: "models" });
      if (data.ok) {
        agentModels = Array.isArray(data.models) ? data.models : [];
        if (data.default_model) agentDefaultModel = data.default_model;
        for (const [kind, value] of Object.entries(data.agent_defaults || {})) {
          if (value?.model) agentDefaultModels[kind] = value.model;
          if (value?.mode) agentDefaultModes[kind] = value.mode;
        }
      }
    } catch (error) {
    } finally {
      agentModelsLoading = null;
    }
    if (agentTerminalOpen) renderAgentTerminal();
    return agentModels;
  })();
  return agentModelsLoading;
}

function agentPost(payload) {
  return fetch("/api/agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((response) => response.json());
}

function stopAgentPoll(agentId) {
  const timer = agentPollTimers.get(agentId);
  if (timer) clearTimeout(timer);
  agentPollTimers.delete(agentId);
  delete agentLive[agentId];
}

function startAgentPoll(agentId) {
  if (agentPollTimers.has(agentId)) return;
  const tick = async () => {
    if (!agentBusyIds.has(agentId)) {
      stopAgentPoll(agentId);
      return;
    }
    try {
      const data = await agentPost({ action: "get", agent_id: agentId });
      if (data.ok) {
        agentLive[agentId] = data.live || {};
        if (data.queued) {
          agentQueuedIds.add(agentId);
          agentQueuePositions[agentId] = Number(data.queue_position) || 0;
        } else {
          agentQueuedIds.delete(agentId);
          delete agentQueuePositions[agentId];
        }
        if (!agentModels.length && Array.isArray(data.models)) agentModels = data.models;
        if (data.default_model) agentDefaultModel = data.default_model;
        if (data.model) {
          const session = agentSessions[agentId] || { messages: [] };
          agentSessions[agentId] = { ...session, model: data.model, mode: data.mode || session.mode };
        }
        const stored = Array.isArray(data.agent?.messages) ? data.agent.messages : [];
        const last = stored[stored.length - 1];
        const previous = stored[stored.length - 2];
        const expectedText = agentRunMessages[agentId];
        const settled = Boolean(last && last.role === "assistant" && !last.pending);
        const completed = data.running === false && settled
          && (!expectedText || (previous && previous.role === "user" && previous.content === expectedText));
        if (completed) {
          finishAgentRun(agentId, {
            messages: stored,
            model: data.model || data.agent?.model,
            usage: data.agent?.usage,
          });
          return;
        }
        if (agentTerminalOpen && activeAgent().id === agentId) renderAgentTerminal();
      }
    } catch (error) {
    }
    if (agentBusyIds.has(agentId)) {
      agentPollTimers.set(agentId, setTimeout(tick, 900));
    } else {
      stopAgentPoll(agentId);
    }
  };
  agentPollTimers.set(agentId, setTimeout(tick, 900));
}

async function loadAgentSession(agentId) {
  if (agentLoadedIds.has(agentId)) return;
  agentLoadingIds.add(agentId);
  renderAgentTerminal();
  try {
    const data = await agentPost({ action: "get", agent_id: agentId });
    if (data.ok) {
      agentSessions[agentId] = data.agent || { messages: [] };
      if (data.model) agentSessions[agentId].model = data.model;
      if (data.mode) agentSessions[agentId].mode = data.mode;
      if (Array.isArray(data.models) && data.models.length) agentModels = data.models;
      if (data.default_model) agentDefaultModel = data.default_model;
      agentLive[agentId] = data.live || {};
      if (Array.isArray(data.files)) agentAttachments[agentId] = data.files;
      agentLoadedIds.add(agentId);
      if (data.live?.started) {
        // A run started in another window is already working; the panel
        // follows it like any run started from this window.
        if (!agentBusyIds.has(agentId)) {
          agentBusyIds.add(agentId);
          noteAgentRunStarted(agentId);
        }
        startAgentPoll(agentId);
      }
    }
  } catch (error) {
  } finally {
    agentLoadingIds.delete(agentId);
    if (agentTerminalOpen && activeAgent().id === agentId) renderAgentTerminal();
  }
}

let agentScrollTick = 0;
let agentPinBottom = false;
const agentScrollPositions = {};
function scrollAgentMessagesToBottom() {
  // The AI card can change height a moment after it opens (split layout,
  // sheet animation, web fonts), so pin repeatedly across that window.
  const token = ++agentScrollTick;
  const pin = () => {
    if (token !== agentScrollTick) return;
    const messagesEl = $("#agent-messages");
    if (!messagesEl) return;
    messagesEl.scrollTop = messagesEl.scrollHeight;
    const id = messagesEl.dataset.agentId;
    if (id) agentScrollPositions[id] = { top: messagesEl.scrollTop, atBottom: true };
  };
  pin();
  requestAnimationFrame(pin);
  [40, 120, 260, 450, 700].forEach((delay) => setTimeout(pin, delay));
}

function syncAgentTerminal() {
  if (!agentTerminalOpen) return;
  renderAgentTerminal();
}

function openAgentTerminal(silent = false) {
  DeskHandle.captureHome("ai");
  agentClosing = false;
  clearSingleDock();
  protectDeskHandles(420);
  // The AI conversation is a paper sheet like the note panel, so it opens with
  // the note's leaf rustle instead of the wooden drawer-stretch sample.
  if (!silent) AudioFX.leafRustle();
  $(".desk-handle-ai")?.classList.remove("handle-vanished", "handle-closing");
  agentTerminalOpen = true;
  document.body.classList.add("agent-terminal-open");
  // Opening the conversation by hand counts as reading the result it holds;
  // the silent startup restore must not erase markers saved for later.
  if (!silent) clearUnseenAgentSubtask(selectedSubtaskId);
  refreshDefaultSheetHeight();
  const panel = $("#agent-terminal");
  // Cache the newest position first: hide the list for this one frame so it
  // can never paint at the stale offset and then jump.
  agentPinBottom = true;
  panel?.classList.add("agent-preparing");
  renderAgentTerminal();
  DeskHandle.vanish("ai");
  panel?.classList.remove("sheet-closing");
  if (!silent) {
    panel?.classList.add("sheet-opening");
    setTimeout(() => panel?.classList.remove("sheet-opening"), 140);
    setTimeout(() => $("#agent-input")?.focus(), 80);
  }
  requestAnimationFrame(() => {
    scrollAgentMessagesToBottom();
    agentPinBottom = false;
    panel?.classList.remove("agent-preparing");
    const input = $("#agent-input");
    if (input?.value) resizeAgentInput(input);
    positionDeskHandles();
    DeskHandle.appear("ai", "above");
  });
  // Never leave the list hidden if rAF is throttled (background window).
  setTimeout(() => {
    if (!agentTerminalOpen) return;
    panel?.classList.remove("agent-preparing");
    agentPinBottom = false;
    scrollAgentMessagesToBottom();
  }, 90);
  saveViewState();
}

function closeAgentTerminal() {
  if (!agentTerminalOpen || agentClosing) return;
  const panel = $("#agent-terminal");
  if (!panel) {
    agentTerminalOpen = false;
    updateAgentSplitLayout();
    saveViewState();
    return;
  }
  agentClosing = true;
  AudioFX.drawer();
  DeskHandle.vanish("ai");
  panel.classList.add("sheet-closing");
  setTimeout(() => {
    if (!agentClosing) return;
    agentTerminalOpen = false;
    agentClosing = false;
    if (notesHidden) resetSplitToHorizontal();
    agentModelMenuOpen = false;
    agentModeMenuOpen = false;
    document.body.classList.remove("agent-terminal-open");
    panel.classList.remove("open", "sheet-closing", "agent-preparing");
    panel.setAttribute("aria-hidden", "true");
    document.querySelector(".terminal-tool")?.classList.remove("active");
    if (singleDock?.kind === "ai") clearSingleDock();
    updateAgentSplitLayout();
    positionDeskHandles();
    DeskHandle.snapHome("ai");
    DeskHandle.appear("ai", "below");
    saveViewState();
  }, 140);
}

function detachedAgentUrl(agent) {
  const params = new URLSearchParams({
    detached: "ai",
    agent_id: agent.id,
    kind: agent.kind || "todo",
    title: agent.title || "AI",
    category: agent.category || "",
    todo: agent.todo || "",
    subtask: agent.scope?.subtask || "",
    done: agent.scope?.done ? "1" : "0",
    folder: agent.scope?.project_folder || "",
    context: agent.scope?.context || "",
  });
  return `${location.origin}/?${params.toString()}`;
}

function detachedNoteUrl() {
  const target = activeNoteTarget();
  const category = selectedCategory();
  if (!target?.todo || !category) return "";
  const params = new URLSearchParams({
    detached: "note",
    category_id: category.id,
    todo_id: target.todo.id,
    subtask_id: target.subtask?.id || "",
  });
  return `${location.origin}/?${params.toString()}`;
}

function windowBridge(path, params = {}) {
  // Android shells expose a direct JS interface. It is absent in the desktop
  // builds, which keep using the hidden iframe bridge below.
  if (window.NeoTodoAndroid) {
    try {
      if (path === "open") {
        window.NeoTodoAndroid.open(params.url || "");
      } else if (path === "home") {
        window.NeoTodoAndroid.home();
      } else if (path.startsWith("window/")) {
        window.NeoTodoAndroid.windowAction(path.slice(7), params.x || 0, params.y || 0);
      }
      return;
    } catch (error) {}
  }
  let bridge = document.getElementById("neotodo-window-bridge");
  if (!bridge) {
    bridge = document.createElement("iframe");
    bridge.id = "neotodo-window-bridge";
    bridge.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;border:0;left:-10px;top:-10px";
    document.body.appendChild(bridge);
  }
  const query = new URLSearchParams({ ...params, t: String(Date.now()) });
  bridge.src = `https://neotodo.local/${path}?${query.toString()}`;
}

function openNewWindow() {
  try {
    windowBridge("new-window");
    toast("Opening a new window");
  } catch (error) {
    try { window.open(location.href, "_blank"); } catch (inner) {}
  }
}

function nativeWindowCommand(action, x, y) {
  windowBridge(`window/${action}`, { x: Math.round(x), y: Math.round(y) });
}

function dockDetachedPanel() {
  try {
    windowBridge("home");
  } catch (error) {}
  setTimeout(() => { try { window.close(); } catch (error) {} }, 500);
}

function openDetachedPanel(kind, quiet = false, follow = false) {
  const agent = kind === "ai" ? activeAgent() : null;
  const url = kind === "ai" ? detachedAgentUrl(agent) : detachedNoteUrl();
  if (!url) {
    if (!quiet) toast("Select a task before popping out", true);
    return false;
  }
  // Ask the native shell for a real window. Using the shell bridge instead of
  // window.open avoids WebKit's create signal, which crashed Gtk on some
  // drivers when the detached view was constructed during a pointer gesture.
  windowBridge("open", { url, follow: follow ? "1" : "0" });
  if (kind === "ai") closeAgentTerminal();
  else hideNotesPanel();
  return true;
}

function singleDockClass(kind, side) {
  return `single-${kind}-${side}`;
}

function setSingleDock(kind, side) {
  if (kind === "note" && agentTerminalOpen && !agentClosing) closeAgentTerminal();
  if (singleDock) document.body.classList.remove(singleDockClass(singleDock.kind, singleDock.side));
  singleDock = { kind, side };
  document.body.classList.add(singleDockClass(kind, side));
  updateAgentSplitLayout();
  positionDeskHandles();
  requestAnimationFrame(() => positionDeskHandles());
}

function clearSingleDock() {
  if (!singleDock) return;
  document.body.classList.remove(singleDockClass(singleDock.kind, singleDock.side));
  singleDock = null;
  updateAgentSplitLayout();
  positionDeskHandles();
  requestAnimationFrame(() => positionDeskHandles());
}

function startPanelPreview(kind, panel, clientX, clientY) {
  if (panelPreview || !panel) return;
  if (doingPeekOpen) closeDoingPeek();
  panel.classList.remove("sheet-opening", "sheet-closing");
  // Normalise a docked/split card to the full workspace before shrinking so
  // the floating card is always the same size and never gets narrow.
  const desk = agentDeskRect();
  const before = panel.getBoundingClientRect();
  const needsNormalize = Boolean(desk && (before.width < desk.width - 4 || before.height < desk.height - 4));
  const prevStyle = {};
  if (needsNormalize) {
    ["left", "top", "width", "height", "right", "bottom"].forEach((prop) => {
      prevStyle[prop] = panel.style.getPropertyValue(prop);
      prevStyle[prop + "Priority"] = panel.style.getPropertyPriority(prop);
    });
    panel.style.setProperty("left", "0", "important");
    panel.style.setProperty("top", "0", "important");
    panel.style.setProperty("width", "100%", "important");
    panel.style.setProperty("height", "100%", "important");
    panel.style.setProperty("right", "auto", "important");
    panel.style.setProperty("bottom", "auto", "important");
  }
  const rect = panel.getBoundingClientRect();
  const cardCss = getComputedStyle(document.documentElement);
  const maxScale = Number.parseFloat(cardCss.getPropertyValue("--panel-card-max-scale")) || 0.405;
  const maxWidth = Number.parseFloat(cardCss.getPropertyValue("--panel-card-max-width")) || 375;
  const maxHeight = Number.parseFloat(cardCss.getPropertyValue("--panel-card-max-height")) || 248;
  const scale = Math.min(maxScale, Math.min(maxWidth / Math.max(1, rect.width), maxHeight / Math.max(1, rect.height)));
  panel.style.setProperty("--panel-card-width", `${rect.width}px`);
  panel.style.setProperty("--panel-card-height", `${rect.height}px`);
  panel.classList.add("panel-shrinking");
  panel.style.setProperty("--card-scale", scale.toFixed(4));
  document.body.classList.add("panel-drag-mode", "panel-live-preview");
  panelPreview = {
    kind, panel,
    // The card is fixed at the viewport origin by panel-card.css.
    baseLeft: 0, baseTop: 0,
    width: rect.width, height: rect.height, scale,
    zone: "", outside: false,
    startX: clientX, startY: clientY, moved: false,
    wasDocked: Boolean(singleDock && singleDock.kind === kind),
    prevStyle, needsNormalize,
    originalSplitSide: agentSplitSide,
    previewSplitSide: agentSplitSide,
  };
  updatePanelPreview(clientX, clientY);
}

function pointerOutsideWorkspace(clientX, clientY) {
  // Only leaving the actual window detaches. The dock zones use the whole
  // window too, so right/bottom are as easy to reach as left/top.
  return clientX < -16 || clientY < -16
    || clientX > window.innerWidth + 16 || clientY > window.innerHeight + 16;
}

function animatePanelReflow(element, beforeRect) {
  if (!element || !beforeRect || !beforeRect.width) return;
  const after = element.getBoundingClientRect();
  if (!after.width) return;
  const dx = beforeRect.left - after.left;
  const dy = beforeRect.top - after.top;
  const sx = Math.max(0.05, beforeRect.width / after.width);
  const sy = Math.max(0.05, beforeRect.height / after.height);
  if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) return;
  const prevTransition = element.style.transition;
  const prevTransform = element.style.transform;
  const prevOrigin = element.style.transformOrigin;
  element.style.transition = "none";
  element.style.transformOrigin = "top left";
  element.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
  void element.offsetWidth;
  requestAnimationFrame(() => {
    element.style.transition = "transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)";
    element.style.transform = "";
    setTimeout(() => {
      element.style.transition = prevTransition || "";
      element.style.transform = prevTransform || "";
      element.style.transformOrigin = prevOrigin || "";
    }, 460);
  });
}

function updatePanelPreview(clientX, clientY) {
  const preview = panelPreview;
  if (!preview) return;
  const { panel, baseLeft, baseTop, width, height, scale } = preview;
  const cardWidth = width * scale;
  const cardHeight = height * scale;
  panel.style.setProperty("--card-x", `${(clientX - cardWidth / 2) - baseLeft}px`);
  panel.style.setProperty("--card-y", `${(clientY - cardHeight / 2) - baseTop}px`);

  if (!preview.moved
    && Math.hypot(clientX - preview.startX, clientY - preview.startY) > 12) {
    preview.moved = true;
  }
  const desk = agentDeskRect();
  const outside = preview.moved && pointerOutsideWorkspace(clientX, clientY);
  let zone = "";
  if (preview.moved && !outside) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    // Window-relative sectors, symmetric on all four sides, with a small
    // centre dead zone. Right/bottom now trigger at the same distance as
    // left/top instead of needing the outer border.
    const nx = (clientX - cx) / Math.max(1, cx);
    const ny = (clientY - cy) / Math.max(1, cy);
    const ax = Math.abs(nx);
    const ay = Math.abs(ny);
    if (Math.max(ax, ay) > 0.12) {
      if (ax >= ay) zone = nx > 0 ? "right" : "left";
      else zone = ny > 0 ? "bottom" : "top";
    }
  }
  preview.zone = zone;
  preview.outside = outside;
  document.body.classList.toggle("panel-drag-detach", outside);
  document.body.classList.toggle("panel-has-zone", Boolean(zone) && !outside);
  // Live layout preview: with both sheets open, the other sheet immediately
  // moves to the opposite half as the card crosses a zone.
  if (agentTerminalOpen && !notesHidden && preview.moved && !outside) {
    if (zone) {
      const nextSide = panelPreviewNextSide(preview.kind, zone);
      if (nextSide && agentSplitSide !== nextSide) {
        const other = preview.kind === "ai" ? $("#notes-half") : $("#agent-terminal");
        const beforeOther = other?.getBoundingClientRect();
        agentSplitSide = nextSide;
        preview.previewSplitSide = nextSide;
        updateAgentSplitLayout();
        if (other && beforeOther) animatePanelReflow(other, beforeOther);
      }
    } else if (agentSplitSide !== preview.originalSplitSide) {
      // Back over the centre: show the layout the user started from again.
      agentSplitSide = preview.originalSplitSide;
      preview.previewSplitSide = agentSplitSide;
      updateAgentSplitLayout();
    }
  }
  document.querySelectorAll(".agent-split-drop").forEach((drop) => {
    drop.classList.toggle("active", !outside && drop.dataset.agentSplitDrop === zone);
  });
}

function panelPreviewNextSide(kind, zone) {
  if (kind === "ai") {
    return zone === "left" ? "notes-right"
      : zone === "right" ? "notes-left"
        : zone === "top" ? "notes-bottom"
          : "notes-top";
  }
  return `notes-${zone}`;
}

function applyPanelPreviewDrop(kind, zone) {
  if (!zone) return false;
  const bothOpen = agentTerminalOpen && !notesHidden;
  if (bothOpen) {
    const nextSide = panelPreviewNextSide(kind, zone);
    if (agentSplitSide !== nextSide) swapAgentSplitSide(nextSide);
    else {
      try { localStorage.setItem("neotodo.agentSplitSide.v2", agentSplitSide); } catch (error) {}
      updateAgentSplitLayout();
    }
  } else {
    // Independent card: pin it to that side without opening the other card.
    setSingleDock(kind, zone);
  }
  return true;
}

function endPanelPreview(confirmDrop = false) {
  const preview = panelPreview;
  if (!preview) return;
  panelPreview = null;
  protectDeskHandles(420);
  requestAnimationFrame(() => { positionDeskHandles(); refreshNotesSwipeLine(); });
  setTimeout(() => { positionDeskHandles(); refreshNotesSwipeLine(); }, 380);
  const { kind, panel, zone, outside, wasDocked } = preview;
  document.body.classList.remove("panel-drag-mode", "panel-drag-detach", "panel-live-preview", "panel-has-zone");
  document.querySelectorAll(".agent-split-drop").forEach((drop) => drop.classList.remove("active"));
  const clearShrink = () => {
    panel.classList.remove("panel-shrinking");
    panel.style.removeProperty("--card-x");
    panel.style.removeProperty("--card-y");
    panel.style.removeProperty("--card-scale");
    panel.style.removeProperty("--panel-card-width");
    panel.style.removeProperty("--panel-card-height");
    if (preview.needsNormalize && preview.prevStyle) {
      ["left", "top", "width", "height", "right", "bottom"].forEach((prop) => {
        const value = preview.prevStyle[prop];
        const priority = preview.prevStyle[prop + "Priority"] || "";
        if (value) panel.style.setProperty(prop, value, priority);
        else panel.style.removeProperty(prop);
      });
    }
  };
  if (!confirmDrop) {
    clearShrink();
    if (agentSplitSide !== preview.originalSplitSide) {
      agentSplitSide = preview.originalSplitSide;
      updateAgentSplitLayout();
    }
    panel.classList.add("panel-unshrinking");
    setTimeout(() => panel.classList.remove("panel-unshrinking"), 280);
    return;
  }
  if (outside) {
    // Dragging outside no longer detaches the sheet; restore the layout.
    if (agentSplitSide !== preview.originalSplitSide) {
      agentSplitSide = preview.originalSplitSide;
      updateAgentSplitLayout();
    }
    clearShrink();
    return;
  }
  const cardRect = panel.getBoundingClientRect();
  clearShrink();
  if (zone) {
    applyPanelPreviewDrop(kind, zone);
    requestAnimationFrame(() => animatePanelReflow(panel, cardRect));
    return;
  }
  // Center release: restore the previous split, then a docked card returns to
  // fullscreen and a full card stays put.
  if (agentSplitSide !== preview.originalSplitSide) {
    agentSplitSide = preview.originalSplitSide;
    updateAgentSplitLayout();
  }
  if (wasDocked) clearSingleDock();
}

function toggleAgentTerminal() {
  if (agentTerminalOpen) closeAgentTerminal();
  else openAgentTerminal();
}

async function setAgentModel(model) {
  if (!agentTerminalOpen || !model) return;
  const agent = activeAgent();
  if (agentBusyIds.has(agent.id)) return;
  const session = agentSessions[agent.id] || { messages: [] };
  agentSessions[agent.id] = { ...session, model };
  agentModelMenuOpen = false;
  renderAgentTerminal();
  try {
    await agentPost({ action: "set_model", agent_id: agent.id, model });
  } catch (error) {
  }
}

async function setAgentMode(mode) {
  if (!agentTerminalOpen || !["chat", "build"].includes(mode)) return;
  const agent = activeAgent();
  if (agentBusyIds.has(agent.id)) return;
  const session = agentSessions[agent.id] || { messages: [] };
  agentSessions[agent.id] = { ...session, mode };
  agentModeMenuOpen = false;
  renderAgentTerminal();
  try {
    await agentPost({ action: "set_mode", agent_id: agent.id, mode });
  } catch (error) {
  }
}

async function cycleAgentModel() {
  if (!agentTerminalOpen) return;
  const agent = activeAgent();
  if (agentBusyIds.has(agent.id)) return;
  await loadAgentModels();
  if (!agentModels.length) return;
  const current = currentAgentModel(agent);
  const index = agentModels.indexOf(current);
  const next = agentModels[(index + 1) % agentModels.length];
  await setAgentModel(next);
}

function agentAddNotice(agent, text) {
  const session = agentSessions[agent.id] || { messages: [] };
  agentSessions[agent.id] = {
    ...session,
    messages: [...(session.messages || []), { role: "system", content: text }],
  };
  renderAgentTerminal();
}

function agentPastePaths(text) {
  const lines = String(text || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const paths = [];
  for (const line of lines) {
    if (line.startsWith("file://")) {
      try {
        const url = new URL(line);
        if (url.protocol === "file:") paths.push(decodeURIComponent(url.pathname));
      } catch (error) {}
      continue;
    }
    if (line.startsWith("/") || line.startsWith("~/") || /^[A-Za-z]:[\\/]/.test(line)) {
      // Reject URLs and short chat-like fragments; a real path has a separator.
      if (/^https?:\/\//i.test(line)) continue;
      paths.push(line);
    }
  }
  return [...new Set(paths)];
}

async function attachAgentPaths(paths) {
  const agent = activeAgent();
  if (!agent || !paths.length) return;
  if (agentBusyIds.has(agent.id) || agentUploadingIds.has(agent.id)) return;
  agentUploadingIds.add(agent.id);
  renderAgentTerminal();
  try {
    const result = await agentPost({ action: "add_paths", agent_id: agent.id, paths });
    if (result.ok) {
      agentAttachments[agent.id] = Array.isArray(result.files) ? result.files : [];
      if (!Array.isArray(result.added) || !result.added.length) {
        agentAddNotice(agent, "No readable file was found at that path.");
      }
    } else {
      agentAddNotice(agent, result.error || "The file could not be attached.");
    }
  } catch (error) {
    agentAddNotice(agent, "Could not reach the local agent service.");
  } finally {
    agentUploadingIds.delete(agent.id);
    renderAgentTerminal();
    setTimeout(() => $("#agent-input")?.focus(), 40);
  }
}

async function handleAgentFiles(files) {
  const agent = activeAgent();
  if (!files.length || agentBusyIds.has(agent.id) || agentUploadingIds.has(agent.id)) return;
  agentUploadingIds.add(agent.id);
  renderAgentTerminal();
  try {
  const existing = agentAttachmentsFor(agent.id);
  let bytes = existing.reduce((sum, file) => sum + (Number(file.size) || 0), 0);
  const payload = [];
  for (const file of files) {
    if (existing.length + payload.length >= 20) {
      agentAddNotice(agent, "Up to 20 context files can be kept for one task.");
      break;
    }
    if (file.size > 10 * 1024 * 1024) {
      agentAddNotice(agent, `${file.name || "That file"} is larger than 10 MB and was not attached.`);
      continue;
    }
    // Every paste adds a file; nothing is replaced, so the budget only grows.
    if (bytes + file.size > 50 * 1024 * 1024) {
      agentAddNotice(agent, "Context files are limited to 50 MB per task.");
      continue;
    }
    const data = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        resolve(result.includes(",") ? result.split(",").pop() : "");
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
    if (!data) continue;
    payload.push({ name: file.name, type: file.type || "", data });
    bytes += file.size;
  }
  if (!payload.length) return;
  try {
    const result = await agentPost({ action: "add_files", agent_id: agent.id, attachments: payload });
    if (result.ok) {
      agentAttachments[agent.id] = Array.isArray(result.files) ? result.files : [];
    } else {
      agentAddNotice(agent, result.error || "The files could not be saved.");
    }
  } catch (error) {
    agentAddNotice(agent, "Could not reach the local agent service.");
  }
  setTimeout(() => $("#agent-input")?.focus(), 40);
  } finally {
    agentUploadingIds.delete(agent.id);
    renderAgentTerminal();
  }
}

async function removeAgentFile(name) {
  const agent = activeAgent();
  if (!name || agentBusyIds.has(agent.id) || agentUploadingIds.has(agent.id)) return;
  agentUploadingIds.add(agent.id);
  renderAgentTerminal();
  try {
    const result = await agentPost({ action: "remove_file", agent_id: agent.id, name });
    if (result.ok) {
      agentAttachments[agent.id] = Array.isArray(result.files) ? result.files : [];
      renderAgentTerminal();
    } else {
      agentAddNotice(agent, result.error || "The file could not be removed.");
    }
  } catch (error) {
    agentAddNotice(agent, "Could not reach the local agent service.");
  } finally {
    agentUploadingIds.delete(agent.id);
    renderAgentTerminal();
  }
}

async function clearAgentConversation() {
  const agent = activeAgent();
  if (!agent) return;
  if (agentBusyIds.has(agent.id)) interruptAgent();
  await agentPost({ action: "clear", agent_id: agent.id }).catch(() => {});
  agentSessions[agent.id] = { messages: [], model: currentAgentModel(agent), mode: currentAgentMode(agent) };
  agentLive[agent.id] = {};
  agentLoadedIds.delete(agent.id);
  // Restarting the conversation also discards any unread marker for it.
  if (agent.id.startsWith("subtask:")) clearUnseenAgentSubtask(agent.id.slice(8));
  renderAgentTerminal();
  toast("Conversation cleared");
}

function interruptAgent(targetId = "") {
  const agent = activeAgent();
  const agentId = String(targetId || agent?.id || "");
  if (!agentId || !agentBusyIds.has(agentId)) return false;
  agentPausedIds.add(agentId);
  AudioFX.categoryTap();
  agentPost({ action: "interrupt", agent_id: agentId }).catch(() => {});
  setStatus("Interrupted");
  // The hint goes away now: the user pressed once, and waiting for the next
  // poll to redraw the meta line made the first press look ignored.
  if (agentTerminalOpen) renderAgentTerminal();
  return true;
}

/** Stop the run behind one subtask row, from its spinning fan. */
function pauseSubtaskAgent(subtaskId) {
  const agentId = `subtask:${subtaskId}`;
  if (!agentIsRunning(agentId)) return false;
  const active = agentBusyIds.has(agentId);
  agentPausedIds.add(agentId);
  // The fan winds down at once; the backend ends the child process behind it.
  noteAgentRunFinished(agentId);
  agentQueuedIds.delete(agentId);
  delete agentQueuePositions[agentId];
  updateSubtaskAgentDom(subtaskId, { running: false });
  reorderCurrentSubtaskRows();
  if (doingPeekOpen) updateDoingPeek(true);
  if (active) {
    // The open conversation keeps polling so the interrupted reply lands in it.
    interruptAgent(agentId);
    return true;
  }
  AudioFX.categoryTap();
  toast("Agent paused");
  agentPost({ action: "interrupt", agent_id: agentId }).catch(() => {});
  stopAgentPoll(agentId);
  agentLive[agentId] = {};
  // The paused marker only answers the next poll of this run.
  setTimeout(() => agentPausedIds.delete(agentId), 15000);
  return true;
}

function playAgentNotification() {
  if (aiConfig && aiConfig.notifications === false) return;
  const sound = aiConfig?.notification_sound || "trainWhistle";
  const play = AudioFX[sound] || AudioFX.trainWhistle;
  if (typeof play === "function") play.call(AudioFX);
}

function finishAgentRun(agentId, payload = {}) {
  if (!agentBusyIds.has(agentId)) return;
  agentBusyIds.delete(agentId);
  agentQueuedIds.delete(agentId);
  delete agentQueuePositions[agentId];
  delete agentRunMessages[agentId];
  noteAgentRunFinished(agentId);
  stopAgentPoll(agentId);
  const session = agentSessions[agentId] || { messages: [] };
  let messages = Array.isArray(payload.messages) ? payload.messages : null;
  if (!messages && payload.error) {
    messages = [...(session.messages || []), { role: "system", content: payload.error }];
  }
  agentSessions[agentId] = {
    ...session,
    messages: messages || session.messages || [],
    model: payload.model || session.model,
    usage: payload.usage || session.usage,
  };
  agentLoadedIds.add(agentId);
  agentLive[agentId] = {};
  const finalModel = payload.model || session.model || "";
  const finalMessage = (messages || session.messages || []).slice(-1)[0];
  const paused = agentPausedIds.has(agentId) || Boolean(finalMessage && finalMessage.interrupted);
  agentPausedIds.delete(agentId);
  const subtaskId = agentId.startsWith("subtask:") ? agentId.slice(8) : "";
  if (subtaskId) {
    updateSubtaskAgentDom(subtaskId, { running: false, model: "" });
    subtaskAgentModels[subtaskId] = finalModel;
    saveSubtaskAgentModels();
    if (!paused) {
      noteSubtaskAgentFinished(subtaskId);
    }
    setTimeout(() => {
      subtaskModelRecent.add(subtaskId);
      updateSubtaskAgentDom(subtaskId, { running: false, model: finalModel, pop: !paused });
      setTimeout(() => subtaskModelRecent.delete(subtaskId), 1200);
    }, 180);
  } else if (agentId.startsWith("todo:") && !paused) {
    noteTodoAgentFinished(agentId.slice(5));
  }
  if (!paused) playAgentNotification();
  renderAgentTerminal();
  setTimeout(() => $("#agent-input")?.focus(), 40);
}

async function sendAgentMessage() {
  const draft = $("#agent-input");
  const message = draft?.value.trim();
  if (!message) return;
  const agent = activeAgent();
  if (agentBusyIds.has(agent.id) || agentUploadingIds.has(agent.id)) return;
  // Continuing a finished subtask with the AI puts it back on the board first,
  // so the run works on a live row instead of a history entry.
  if (agent.kind === "subtask" && agent.id.startsWith("subtask:")) {
    const subtaskId = agent.id.slice(8);
    const owner = liveSubtaskOwner(subtaskId);
    if (owner?.subtask?.done) await reopenFinishedSubtask(owner.todo.id, subtaskId);
  }
  const input = $("#agent-input") || draft;
  if (!agentLoadedIds.has(agent.id)) await loadAgentSession(agent.id);
  // Sending a new message means the previous result has been looked at; the
  // run that starts now leaves a fresh card hint when it finishes.
  if (agent.id.startsWith("subtask:")) clearUnseenAgentSubtask(agent.id.slice(8));
  const session = agentSessions[agent.id] || { title: agent.title, messages: [] };
  const model = currentAgentModel(agent);
  const mode = currentAgentMode(agent);
  agentSessions[agent.id] = {
    ...session,
    title: agent.title,
    model,
    mode,
    messages: [...(session.messages || []), { role: "user", content: message }],
  };
  agentBusyIds.add(agent.id);
  agentQueuedIds.delete(agent.id);
  delete agentQueuePositions[agent.id];
  agentRunMessages[agent.id] = message;
  // Sending is the line clear: the message leaves the composer like a
  // completed row vanishing from the board.
  AudioFX.unlock();
  AudioFX.tetrisClear();
  noteAgentRunStarted(agent.id);
  agentLive[agent.id] = {};
  // Lift the running subtask and its todo as soon as the crew starts working.
  reorderCurrentSubtaskRows();
  if (doingPeekOpen) updateDoingPeek(true);
  if (agent.kind === "subtask" && agent.id.startsWith("subtask:")) {
    updateSubtaskAgentDom(agent.id.slice(8), { running: true });
  }
  let finalModel = model;
  if (input) {
    input.value = "";
    input.style.height = "";
    clearAgentDraft(agent.id);
  }
  renderAgentTerminal();
  startAgentPoll(agent.id);
  try {
    const data = await agentPost({
      action: "chat",
      agent_id: agent.id,
      title: agent.title,
      scope: agent.scope,
      message,
      model,
      mode,
    });
    if (data.ok) {
      finalModel = data.model || model;
      agentSessions[agent.id] = {
        ...agentSessions[agent.id],
        title: data.title || agent.title,
        messages: data.messages || agentSessions[agent.id]?.messages || [],
        model: data.model || model,
        mode: data.mode || mode,
        usage: data.usage || {},
      };
      if (Array.isArray(data.files)) agentAttachments[agent.id] = data.files;
      if (!agentModels.length && Array.isArray(data.models)) agentModels = data.models;
      agentLoadedIds.add(agent.id);
      if (data.started === false) {
        // Older synchronous backend: it has already finished.
        finishAgentRun(agent.id, { messages: data.messages, model: data.model, usage: data.usage });
      } else {
        // Esc can land before the backend has registered the run (model
        // discovery, attachments). Repeat the pause now that the run exists,
        // so the hint never needs a second press.
        if (agentPausedIds.has(agent.id)) {
          agentPost({ action: "interrupt", agent_id: agent.id }).catch(() => {});
        }
        renderAgentTerminal();
      }
    } else {
      finishAgentRun(agent.id, { error: data.error || "The agent could not answer." });
    }
  } catch (error) {
    finishAgentRun(agent.id, { error: "Could not reach the local agent service." });
  }
}

async function clearAgent() {
  const agent = activeAgent();
  agentSessions[agent.id] = { ...(agentSessions[agent.id] || {}), messages: [] };
  agentLoadedIds.add(agent.id);
  renderAgentTerminal();
  try {
    await agentPost({ action: "clear", agent_id: agent.id });
  } catch (error) {}
}

// The AI console keeps its own DOM (scroll offset, textarea draft, focus and
// message nodes) across a stage repaint. Rebuilding it with the rest of the
// stage made every task switch tear the conversation down and paint a blank
// card before the new conversation arrived, which read as a flash.
function keepAgentTerminal(stage, terminal) {
  if (!stage || !terminal) return;
  const placeholder = stage.querySelector("#agent-terminal");
  if (placeholder && placeholder !== terminal) placeholder.replaceWith(terminal);
}

// Detaching the preserved AI card for a stage repaint resets the message list
// to its first turn. Remember where the reader was and put it back after the
// new stage has been laid out.
function captureAgentScroll(terminal) {
  const messagesEl = terminal?.querySelector("#agent-messages");
  if (!messagesEl) return null;
  return {
    agentId: messagesEl.dataset.agentId || "",
    top: messagesEl.scrollTop,
    atBottom: messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 34,
  };
}

function restoreAgentScroll(snapshot) {
  if (!snapshot) return;
  const messagesEl = $("#agent-messages");
  if (!messagesEl || messagesEl.dataset.agentId !== snapshot.agentId) return;
  messagesEl.scrollTop = snapshot.atBottom ? messagesEl.scrollHeight : snapshot.top;
  if (snapshot.agentId) {
    agentScrollPositions[snapshot.agentId] = { top: messagesEl.scrollTop, atBottom: snapshot.atBottom };
  }
}

// The finished card never shows the provider mark: that mark answers "who
// worked on this row", and the row is leaving the run behind. The click has
// already removed it from the row (see `.subtask-completing` in
// subtask-split.css), so the flight must not bring it back: the ghost drops the
// mark and its slot entirely and starts in the same layout the tray row lands
// in. Nothing slides sideways between the click and the landing.

// The finished row leaves a card that clips its own children: the drawer and
// the lane inside it cut the path off at the card edge, so a transform on the
// real row is invisible for most of the trip and the row merely seems to
// appear in the tray. Draw the flight on a ghost pinned to the page instead,
// then reveal the real row when the ghost lands.
//
// The ghost keeps the pending row's width for the whole trip and the narrower
// landing box is reached by clipping its right edge. Animating `width` (the
// old flight) forced a layout of the row on every frame, which is what made
// the trip stutter on a busy page; a transform plus an inset clip only paints.
function flyCompletedRow(row, originRect, landedRect, duration, sourceRow = null, delay = 0) {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
    // The slot's row was already held back for a flight that is not going to
    // happen.
    row.classList.remove("subtask-slot-arriving");
    return;
  }
  const ghost = (sourceRow || row).cloneNode(true);
  ghost.classList.add("subtask-flight");
  // The press feedback belongs to the click, not to the trip: the flying card
  // is the row at rest, so the fan arrives at its normal size. The selection
  // wash is the lane's emphasis, not the row's paper: carrying it would drag a
  // coloured block across the page and hand it to the finished card.
  ghost.classList.remove("subtask-completing", "selected", "agent-running");
  // The provider mark belongs to the AI run, not to the finished paper, and the
  // click already took it (with its slot) out of the clicked row. The flying
  // copy must not bring either back: no badge in the air, and the fan and name
  // start exactly where the tray row will print them. The press pop is likewise
  // the click's, not the trip's: the row in the air rests at full size.
  ghost.querySelectorAll(".sub-agent-model").forEach((mark) => mark.remove());
  ghost.querySelectorAll(".fan-pop").forEach((node) => node.classList.remove("fan-pop"));
  ghost.removeAttribute("data-subtask-id");
  ghost.setAttribute("aria-hidden", "true");
  ghost.tabIndex = -1;
  ghost.style.left = `${originRect.left}px`;
  ghost.style.top = `${originRect.top}px`;
  ghost.style.width = `${originRect.width}px`;
  ghost.style.height = `${originRect.height}px`;
  ghost.style.zIndex = "240";
  // The page rule belongs to the row's lane, and the finished card prints its
  // own rule when the row lands. A line travelling through the air was the one
  // part of the flight that read as an animated rule, so the ghost is plain
  // paper: nothing under it moves.
  ghost.style.setProperty("border-bottom-color", "transparent", "important");
  ghost.style.setProperty("border-image", "none", "important");
  // The arriving line is already in the tray; only the row's content is held
  // back for the flight. This keeps the new rule under the row that is being
  // pushed down, instead of leaving a blank gap in the finished card.
  row.classList.add("subtask-slot-arriving");
  document.body.appendChild(ghost);
  const dx = landedRect.left - originRect.left;
  const dy = landedRect.top - originRect.top;
  const clipRight = Math.max(0, originRect.width - landedRect.width);
  const clipBottom = Math.max(0, originRect.height - landedRect.height);
  let settled = false;
  const settle = () => {
    if (settled) return;
    settled = true;
    ghost.remove();
    // A repaint may have replaced the row while it was in the air.
    if (!row.isConnected) return;
    row.classList.remove("subtask-slot-arriving");
    // The row travels with the paper it had as a pending row. Landing is where
    // it becomes finished: the check is written in, and the row presses into
    // the tray instead of simply appearing there.
    const check = row.querySelector(".sub-done-check");
    if (check) {
      check.classList.add("check-in");
      setTimeout(() => check.classList.remove("check-in"), 420);
    }
    try {
      row.animate(
        [{ transform: "scale(1.01)" }, { transform: "none" }],
        { duration: 150, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
    } catch (error) {}
  };
  try {
    const flight = ghost.animate(
      [
        { transform: "translate(0, 0)", clipPath: "inset(0 0 0 0)" },
        {
          transform: `translate(${dx}px, ${dy}px)`,
          clipPath: `inset(0 ${clipRight}px ${clipBottom}px 0)`,
        },
      ],
      { duration, delay, easing: "cubic-bezier(.22,.68,.16,1)" }
    );
    flight.onfinish = settle;
    flight.oncancel = settle;
  } catch (error) {
    settle();
  }
}

// A completion opens the finished tray from the top. The new row's rule is
// already printed at the card's edge; the rows below are pushed down in one
// composited move, and the arriving row's content waits for the flight. No
// height is animated: a row that grows frame by frame repaints every hairline
// at fractional offsets, which is what read as a burst of extra lines.
function openCompletedDrawerForRow(drawer, row, animateEntrance) {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
  if (!drawer) return;
  if (animateEntrance) {
    try {
      drawer.animate(
        [
          { transform: "translateY(-10px) scale(0.995)" },
          { transform: "none" },
        ],
        { duration: COMPLETED_DRAWER_DROP_MS, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
    } catch (error) {}
  }
  if (!row) return;
  row.classList.add("subtask-slot-arriving");
  const list = row.parentElement;
  const lane = row.closest(".subtask-lane");
  if (!list || !lane) return;
  const rowH = row.offsetHeight || 40;
  // Start with the whole block one row higher: the new rule sits under the
  // card's top edge, where the old first row used to be, and both slide home
  // together. Only a transform is animated, so the rules move as one layer
  // instead of being re-laid out and re-antialiased on every frame.
  list.style.transform = `translateY(-${rowH}px)`;
  list.style.willChange = "transform";
  try {
    const push = list.animate(
      [
        { transform: `translateY(-${rowH}px)` },
        { transform: "translateY(0)" },
      ],
      { duration: COMPLETED_ROWS_PUSH_MS, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
    const clear = () => {
      list.style.transform = "";
      list.style.willChange = "";
    };
    push.onfinish = clear;
    push.oncancel = clear;
  } catch (error) {
    list.style.transform = "";
    list.style.willChange = "";
  }
}

function renderStage() {
  const stage = $("#stage");
  const liveAgentTerminal = stage.querySelector("#agent-terminal");
  const liveAgentScroll = captureAgentScroll(liveAgentTerminal);
  // Each subtask lane scrolls on its own, so remember both positions.
  const previousLaneScroll = new Map();
  stage.querySelectorAll(".subtask-lane[data-lane]").forEach((lane) => {
    previousLaneScroll.set(lane.dataset.lane, lane.scrollTop);
  });
  // Snapshot the old subtask rows so a freshly finished one can glide across
  // to the completed lane, and the rows around it can settle into place. The
  // rising row's own paper is kept too: the flight is drawn with the row as it
  // looked when it was clicked, so it keeps its identity the whole way.
  const risingSubtaskId = justCompletedSubtaskId;
  const previousSubtaskRects = new Map();
  let risingSubtaskPaper = null;
  if (risingSubtaskId) {
    stage.querySelectorAll(".current-subtask[data-subtask-id]").forEach((row) => {
      previousSubtaskRects.set(row.dataset.subtaskId, row.getBoundingClientRect());
      if (row.dataset.subtaskId === risingSubtaskId) risingSubtaskPaper = row.cloneNode(true);
    });
  }
  const category = selectedCategory();
  if (!category) {
    stage.innerHTML = `<div class="page-head"><div class="page-title banner-title project-folder-trigger" role="button" tabindex="0" data-action="reveal-project-folder" aria-label="Open working folder in your file manager"><svg class="banner-icon" aria-hidden="true"><use href="#${themeSymbol("header")}"></use></svg></div><div class="page-head-title current-head-title quiet"><span class="page-title-name">No categories yet.</span></div></div>
      <div class="page-body">
        <section class="todos-section">
          <div class="current-half"></div>
          <div class="history-half"><div class="history-empty"></div></div>
        </section>
        <section class="notes-half floating-notes ${notesHidden ? "notes-hidden" : ""}" id="notes-half">${notesHtml()}</section>
        ${agentTerminalMarkup()}
        ${agentSplitUiMarkup()}
      </div>`;
    keepAgentTerminal(stage, liveAgentTerminal);
    renderAgentTerminal();
    restoreAgentScroll(liveAgentScroll);
    refreshTaskBoard();
    justCompletedSubtaskId = null;
    lastAddedSubtaskId = null;
    completedSubtasksOpen = false;
    completedSubtasksTodoId = null;
    pendingSubtasksCollapsed = false;
    pendingSubtasksTodoId = null;
    return;
  }
  stage.style.setProperty("--c", category.color);
  const todos = category.todos || [];
  const done = doneTodos(category);
  const current = todos.find((todo) => !todo.done) || null;
  // A fork window is its own OS window. Its title bar should name the todo,
  // never the NeoTodo process/app name that the borderless main window hides.
  if (state.data?.fork) {
    document.title = current ? current.name : (category.name || "NeoTodo");
  }
  const pendingSub = orderedSubtasks(current).find((subtask) => !subtask.done) || null;
  // The finished-task drawer is an optional plugin. Without it, finished and
  // unfinished subtasks share one lane and keep their natural recency order.
  const completedDrawerOn = pluginEnabled("completed-drawer");

  // The completed-subtask card belongs to the task that was on screen when it
  // was opened. A different task always starts with the card tucked away.
  const completedWasOpen = completedSubtasksOpen;
  if (!current) {
    completedSubtasksOpen = false;
    completedSubtasksTodoId = null;
  } else if (completedSubtasksTodoId !== current.id) {
    completedSubtasksTodoId = current.id;
    completedSubtasksOpen = false;
  }
  // Finishing a subtask pops the drawer open so the row has somewhere to land.
  // While the inline add row is open or a brand-new row is being revealed, keep
  // it tucked away: the card floats over the right half of the live lane and
  // would cover part of that row, making it look cut short.
  const newSubtaskView = Boolean(addingSubtask || revealNewSubtask || lastAddedSubtaskId);
  if (!completedDrawerOn) completedSubtasksOpen = false;
  else if (risingSubtaskId && !newSubtaskView) completedSubtasksOpen = true;
  // This also covers a completion that was still in flight when the new row was
  // saved: the drawer must never open on top of a just-added subtask.
  if (newSubtaskView) completedSubtasksOpen = false;
  // A finished row only travels after its card has dropped into view and the
  // new top slot has unfolded. When the card was already open there is no
  // entrance to wait for, but the slot still opens under the row in flight.
  const completedDrawerOpening = Boolean(risingSubtaskId && completedSubtasksOpen && !completedWasOpen);
  const reduceMotion = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
  const completionDelayMs = completedDrawerOpening && !reduceMotion ? COMPLETED_DRAWER_OPEN_MS : 0;
  // A folded card has no visible rows: a completion that has to fly into the
  // finished tray, or an inline row that has to be typed into, always hands
  // the card back first.
  if (risingSubtaskId || newSubtaskView) pendingSubtasksCollapsed = false;
  // The finished tray and the Doing drawer are independent sheets. Both may
  // rest on the column's right border at once; the Doing drawer is the upper
  // card, so opening or closing the tray never takes the drawer away.

  // The live card's fold is a view state of this task, not of the notebook: a
  // different task always opens with its rows unfolded.
  if (pendingSubtasksTodoId !== (current?.id || "")) {
    pendingSubtasksTodoId = current?.id || "";
    pendingSubtasksCollapsed = false;
  }

  if (lastCategoryId !== category.id) {
    lastCategoryId = category.id;
    historyCursor = done.length ? 0 : -1;
    historyScrollTop = 0;
    historyExpanded = new Set();
    selectedHistoryId = null;
    notesPreview = false;
  }
  if (selectedHistoryId && !done.some((todo) => todo.id === selectedHistoryId)) selectedHistoryId = null;
  if (historyCursor < 0 && done.length) historyCursor = 0;
  if (historyCursor >= done.length) historyCursor = done.length - 1;

  const historyRows = done.map((todo, index) => {
    const cursor = !selectedSubtaskId && !selectedHistoryId && index === historyCursor;
    const selected = !selectedSubtaskId && todo.id === selectedHistoryId;
    const hasSubs = (todo.subtasks || []).length > 0;
    const expanded = historyExpanded.has(index);
    const subs = expanded
      ? `<div class="history-subs" data-history-subs="${index}">${(todo.subtasks || []).map((subtask) => {
          const forkBranch = forkedSubtaskBranch(todo.id, subtask.id);
          const forkLink = forkBranch
            ? `<button class="h-sub-fork-link" type="button" data-fork-branch="${esc(forkBranch.id)}" title="打开 Fork 子应用" aria-label="打开 Fork 子应用"><img src="/fork-link-flame.svg" alt=""></button>`
            : "";
          return `<div class="history-subtask ${subtask.id === selectedSubtaskId ? "selected" : ""}" data-history-subtask-id="${esc(subtask.id)}" data-history-todo-id="${esc(todo.id)}">
          <span class="h-sub-fan"><span class="fan-stack"><svg class="fan-static" aria-hidden="true" viewBox="0 0 1024 1024"><use href="#fan"></use></svg><svg class="fan-rotor" aria-hidden="true" viewBox="0 0 1024 1024"><circle cx="493" cy="422" r="286" fill="#C8B9FC"></circle><g clip-path="url(#fan-wheel-clip)"><use href="#fan"></use></g></svg></span></span>
          <span class="h-sub-name">${esc(subtask.name)}</span>
          ${subtask.done ? `<svg class="h-sub-check" aria-hidden="true"><use href="#check-red"></use></svg>` : ""}
          ${settings.show_time_cost && subtask.done ? `<span class="h-sub-time">${esc(timeCostText(subtask))}</span>` : ""}
          ${forkLink}
        </div>`;
        }).join("")}</div>`
      : "";
    const trophy = hasSubs
      ? `<button class="h-trophy h-trophy-action" data-history-expand="${index}" aria-label="${expanded ? "Hide subtasks" : "Show subtasks"}">${GOLD_MOON}</button>`
      : `<span class="h-trophy">${completedIcon()}</span>`;
    return `<div class="history-row ${cursor ? "cursor" : ""} ${selected ? "selected" : ""}" data-history-index="${index}" data-todo-id="${esc(todo.id)}">
      ${trophy}
      <span class="h-name">${esc(todo.name)}</span>
      ${settings.show_time_cost ? `<span class="h-time">${esc(timeCostText(todo))}</span>` : ""}
      <span class="h-date">${todo.completed_at ? `(${fmtNumeric(todo.completed_at.slice(0, 10))})` : ""}</span>
    </div>${subs}`;
  }).join("");

  const historyFillerCount = Math.max(0, 7 - done.length);
  const historyFillers = Array.from({ length: historyFillerCount }, () => '<div class="history-row history-filler" aria-hidden="true"></div>').join("");
  const history = `<div class="history-reel no-motion" id="history-reel"><div class="history-rows" id="history-rows">${historyRows}${historyFillers}</div></div>`;

  let metaHtml = "";
  let headTitle;
  if (current) {
    const subList = orderedSubtasks(current);
    const pendingList = subList.filter((subtask) => !subtask.done);
    const doneList = subList.filter((subtask) => subtask.done);
    const addSubtaskRow = addingSubtask && addingSubtaskTodoId === current.id
      ? `<div class="current-subtask adding-subtask" data-add-subtask-row>
          <span class="sub-fan" aria-hidden="true"><svg viewBox="0 0 1024 1024"><use href="#fan"></use></svg></span>
          <input id="subtask-name-input" class="subtask-name-input" type="text" autocomplete="off" spellcheck="false" aria-label="Name subtask">
        </div>`
      : "";
    const subtaskRow = (subtask) => {
      const next = pendingSub && subtask.id === pendingSub.id;
      const selected = subtask.id === selectedSubtaskId;
      const fan = subtask.done
        ? `<span class="sub-fan done" aria-hidden="true"><span class="fan-stack"><svg class="fan-static" aria-hidden="true" viewBox="0 0 1024 1024"><use href="#fan"></use></svg><svg class="fan-rotor" aria-hidden="true" viewBox="0 0 1024 1024"><circle cx="493" cy="422" r="286" fill="#C8B9FC"></circle><g clip-path="url(#fan-wheel-clip)"><use href="#fan"></use></g></svg></span></span>`
        : `<button class="sub-fan sub-fan-action" data-action="complete-subtask" data-todo-id="${esc(current.id)}" data-subtask-id="${esc(subtask.id)}" aria-label="Finish ${esc(subtask.name)}"><span class="fan-stack"><svg class="fan-static" aria-hidden="true" viewBox="0 0 1024 1024"><use href="#fan"></use></svg><svg class="fan-rotor" aria-hidden="true" viewBox="0 0 1024 1024"><circle cx="493" cy="422" r="286" fill="#C8B9FC"/><g clip-path="url(#fan-wheel-clip)"><use href="#fan"></use></g></svg></span></button>`;
      const agentId = `subtask:${subtask.id}`;
      const agentRunning = agentIsRunning(agentId);
      // The provider mark answers "who is working / who just worked", so it
      // belongs to the live row only. A finished row keeps the empty slot (it
      // is hidden when empty) so the landing layout already matches the flight.
      const modelBadge = subtask.done || agentRunning
        ? `<span class="sub-agent-model" aria-hidden="true"></span>`
        : subtaskModelIconHtml(subtask.id);
      const forkBranch = forkedSubtaskBranch(current.id, subtask.id);
      const forkLink = forkBranch
        ? `<button class="sub-fork-link" type="button" data-fork-branch="${esc(forkBranch.id)}" title="打开 Fork 子应用" aria-label="打开 Fork 子应用"><img src="/fork-link-flame.svg" alt=""></button>`
        : "";
      return `<div class="current-subtask ${subtask.done ? "done" : "pending"} ${next ? "next" : ""} ${selected ? "selected" : ""} ${agentRunning ? "agent-running" : ""}" data-subtask-id="${esc(subtask.id)}">
        ${modelBadge}${fan}
        <span class="sub-name">${esc(subtask.name)}</span>
        ${subtask.done ? `<svg class="sub-done-check" aria-hidden="true"><use href="#check-red"></use></svg>` : ""}
        ${forkLink}
      </div>`;
    };
    const fillerRow = '<div class="current-subtask current-subtask-filler" aria-hidden="true"></div>';
    const pendingFillers = Array.from(
      { length: Math.max(0, 7 - pendingList.length - (addSubtaskRow ? 1 : 0)) },
      () => fillerRow
    ).join("");
    const completedRows = doneList.length
      ? doneList.map(subtaskRow).join("")
      : `<div class="completed-subtask-empty">Nothing finished yet.</div>`;
    const combinedFillers = Array.from(
      { length: Math.max(0, 7 - subList.length - (addSubtaskRow ? 1 : 0)) },
      () => fillerRow
    ).join("");
    // Plugin on: unfinished work keeps one lane and a short handle line drops a
    // compact finished-tasks card on the right. Plugin off: every subtask,
    // finished or not, shares a single lane in the same recency order.
    //
    // In both cases the unfinished lane is printed on its own card. `card` is
    // only a marker: it says this sheet uses the card surface, it prints no
    // text. The sheet is exactly seven unit rows tall, with a stroke on all
    // four sides and one corner, like every other card in the room. Its purple
    // handle line rides the sheet's bottom edge: pulled up it stretches the
    // card away until the line sits under the top line of the block and the
    // page's own ruling shows through, pulled down it hands the rows back.
    const pendingCard = (lanes) => `<div class="pending-subtask-card card ${pendingSubtasksCollapsed ? "collapsed" : ""}" id="pending-subtask-card" data-subcard="pending" role="region" aria-label="Subtasks" aria-hidden="${pendingSubtasksCollapsed ? "true" : "false"}">
        ${lanes}
        <button class="pending-subtask-toggle ${pendingSubtasksCollapsed ? "collapsed" : ""}" type="button" data-action="toggle-pending-subtasks" aria-expanded="${pendingSubtasksCollapsed ? "false" : "true"}" aria-controls="pending-subtask-card" aria-label="${pendingSubtasksCollapsed ? "Show subtasks" : "Hide subtasks"}">
          <span class="pending-subtask-line" aria-hidden="true"></span>
        </button>
      </div>`;
    const drawerMarkup = completedDrawerOn
      ? `${pendingCard(`<div class="subtask-lanes">
        <div class="subtask-lane-column pending-column">
          <div class="subtask-lane" data-lane="pending">
            <div class="current-subtasks" data-subtask-list="pending">${addSubtaskRow}${pendingList.map(subtaskRow).join("")}${pendingFillers}</div>
          </div>
        </div>
      </div>`)}
      <button class="completed-subtask-toggle ${completedSubtasksOpen ? "open" : ""}" type="button" data-action="toggle-completed-subtasks" aria-expanded="${completedSubtasksOpen ? "true" : "false"}" aria-controls="completed-subtask-drawer" aria-label="${completedSubtasksOpen ? "Hide completed subtasks" : "Show completed subtasks"}">
        <span class="completed-subtask-line" aria-hidden="true"></span>
      </button>
      <div class="completed-subtask-drawer card ${completedSubtasksOpen ? "open" : ""}" id="completed-subtask-drawer" data-subcard="completed" role="region" aria-label="Completed subtasks" aria-hidden="${completedSubtasksOpen ? "false" : "true"}">
        <div class="completed-subtask-sheet">
          <div class="subtask-lane-column completed-column" aria-label="Completed subtasks">
            <div class="subtask-lane" data-lane="done">
              <div class="current-subtasks completed-subtasks" data-subtask-list="done">${completedRows}</div>
            </div>
          </div>
        </div>
      </div>`
      : pendingCard(`<div class="subtask-lanes">
        <div class="subtask-lane-column pending-column combined-column">
          <div class="subtask-lane" data-lane="all">
            <div class="current-subtasks" data-subtask-list="all">${addSubtaskRow}${subList.map(subtaskRow).join("")}${combinedFillers}</div>
          </div>
        </div>
      </div>`);
    metaHtml = `<div class="current-inner" data-current-todo="${esc(current.id)}">${drawerMarkup}</div>`;
    headTitle = `<div class="page-head-title current-head-title" data-current-line data-current-todo="${esc(current.id)}">
      <div class="head-title-inner">
        <span class="page-title-name">${esc(current.name)}</span>
        <div class="current-actions">
          <button class="current-action icon-action" data-action="complete" data-id="${esc(current.id)}" aria-label="Complete todo"><svg aria-hidden="true"><use href="#complete-action"></use></svg></button>
          <span class="action-slash" aria-hidden="true">/</span>
          <button class="current-action icon-action" data-action="add-subtask" data-id="${esc(current.id)}" aria-label="Add subtask"><svg aria-hidden="true"><use href="#add-action"></use></svg></button>
        </div>
      </div>
    </div>`;
  } else {
    const emptyRows = Array.from({ length: 7 }, () => '<div class="current-subtask current-subtask-filler" aria-hidden="true"></div>').join("");
    metaHtml = `<div class="current-inner"><div class="current-subtasks">${emptyRows}</div></div>`;
    headTitle = `<input id="new-todo-title" class="new-todo-title" type="text" placeholder="Nothing to do ..." autocomplete="off" spellcheck="false" aria-label="New task">`;
  }

  // The old page-art was the postcard scene painted inside the theme. The same
  // art now lives in the independent wallpaper layer, so the page itself only
  // renders the theme's colours and typography.
  stage.innerHTML = `<div class="page-head"><div class="page-title banner-title project-folder-trigger" role="button" tabindex="0" data-action="reveal-project-folder" aria-label="Open working folder in your file manager"><svg class="banner-icon" aria-hidden="true"><use href="#${themeSymbol("header")}"></use></svg></div>${headTitle}</div>
    <div class="page-body">
      <section class="todos-section">
        <div class="history-half">${history}</div>
        <div class="current-half">${metaHtml}</div>
      </section>
      <section class="notes-half floating-notes ${notesHidden ? "notes-hidden" : ""}" id="notes-half">${notesHtml()}</section>
      ${agentTerminalMarkup()}
      ${agentSplitUiMarkup()}
    </div>`;

  keepAgentTerminal(stage, liveAgentTerminal);
  // With the AI sheet closed its element was carried over untouched, so this
  // call only re-applies the same palette and, in updateAgentSplitLayout(),
  // reads the freshly written page to re-position the split handles. That read
  // is a full synchronous layout. During a completion flight it is exactly the
  // frame the row needs, so let the row land first; the sheet is invisible.
  if (risingSubtaskId && !agentTerminalOpen) {
    setTimeout(() => {
      if (stage.isConnected) renderAgentTerminal();
    }, completionDelayMs + COMPLETED_ROW_FLIGHT_MS + 120);
  } else {
    renderAgentTerminal();
  }
  restoreAgentScroll(liveAgentScroll);
  refreshTaskBoard();
  // The height-ramp row rule gives each row its own stop. New rows need it now
  // that the stage HTML has been replaced.
  applyBaselineRowHeights(stage);
  bindCompletedSubtasksBar();
  bindPendingSubtaskToggle();
  // Put the reader's scroll back before anything is measured. The rebuilt lane
  // starts at the top; restoring it a frame later moved every row a second
  // time, after the gap had already begun to close, which read as a stutter.
  if (risingSubtaskId) {
    stage.querySelectorAll(".subtask-lane[data-lane]").forEach((lane) => {
      if (lane.dataset.lane === "done") {
        lane.scrollTop = 0;
        return;
      }
      const previous = previousLaneScroll.get(lane.dataset.lane);
      if (previous) lane.scrollTop = previous;
    });
  }
  // How long the finished row spends in the air this pass. Anything heavy that
  // would rebuild a card or re-measure the page waits for it to land.
  let completionFlightMs = 0;
  if (risingSubtaskId) {
    justCompletedSubtaskId = null;
    // The finished row now lives in the right-hand lane. Fly it from where it
    // was in the pending lane, then let the other rows close the gap.
    const flipped = stage.querySelector(`.current-subtask[data-subtask-id="${CSS.escape(risingSubtaskId)}"]`);
    const originRect = previousSubtaskRects.get(risingSubtaskId);
    // The tray always shows a new completion at its top. The landing box is
    // measured before the card starts moving, while the new slot is still at
    // its final size and the card is at its final transform.
    const doneLane = flipped?.closest(".completed-subtask-drawer .subtask-lane");
    if (doneLane) doneLane.scrollTop = 0;
    const drawer = flipped?.closest(".completed-subtask-drawer");
    const drawerOpen = Boolean(drawer?.classList.contains("open"));
    const landedRect = flipped?.getBoundingClientRect();
    let flightDelay = 0;
    if (flipped && originRect && landedRect && landedRect.width > 1
      && (Math.abs(originRect.left - landedRect.left) > 2 || Math.abs(originRect.top - landedRect.top) > 2)) {
      // The card opens and its new top slot unfolds first; the finished row
      // waits over its old place, then crosses into the made room. The line
      // under the row is not part of the trip: the tray prints it on landing.
      flightDelay = completionDelayMs;
      completionFlightMs = flightDelay + COMPLETED_ROW_FLIGHT_MS;
      completionFlightUntil = performance.now() + completionFlightMs + 60;
      openCompletedDrawerForRow(drawer, flipped, completedDrawerOpening);
      flyCompletedRow(
        flipped, originRect, landedRect, COMPLETED_ROW_FLIGHT_MS,
        risingSubtaskPaper, flightDelay
      );
    }
    // The card must not slide again while its row is in the air.
    if (drawerOpen && completionFlightMs) {
      const pin = () => drawer.classList.add("flight-target");
      if (flightDelay) setTimeout(pin, flightDelay);
      else pin();
      setTimeout(() => drawer.classList.remove("flight-target"), completionFlightMs + 60);
    }
    // The row has landed in the card: let it sit for 0.3s, then retract the
    // card instead of waiting for the user to click the handle line.
    if (completedSubtasksOpen) {
      scheduleCompletedSubtasksAutoClose(completionFlightMs + COMPLETED_DRAWER_DWELL_MS);
    }
    // Close the gap the finished row left behind when the row leaves, not
    // while the tray is still opening. `backwards` keeps the rows where they
    // were for the wait, so the space stays open under the waiting row.
    if (previousSubtaskRects.size) {
      stage.querySelectorAll(".current-subtask[data-subtask-id]").forEach((row) => {
        if (row.dataset.subtaskId === risingSubtaskId) return;
        if (row.closest(".completed-subtask-drawer")) return;
        const beforeRect = previousSubtaskRects.get(row.dataset.subtaskId);
        if (!beforeRect) return;
        const delta = beforeRect.top - row.getBoundingClientRect().top;
        if (Math.abs(delta) < 2) return;
        try {
          row.animate(
            [{ transform: `translateY(${delta}px)` }, { transform: "none" }],
            {
              duration: 320,
              delay: flightDelay,
              fill: "backwards",
              easing: "cubic-bezier(.2,.8,.2,1)",
            }
          );
        } catch (error) {}
      });
    }
  }
  setupNotesPanel();
  positionTimerRoot();
  if (!doingPeekOpen) refreshDoingZone();
  requestAnimationFrame(() => {
    refreshNotesSwipeLine();
    // Keep the Doing sub-card built while it is tucked away: its wallpaper is
    // baked from the card's open box, so the first peek only slides a card that
    // is already finished instead of drawing one on the way out. When a
    // finished row is in the air, let it land first: rebuilding this card
    // inside the flight's first frames was stealing them.
    if (completionFlightMs) setTimeout(updateDoingPeek, completionFlightMs + 40);
    else updateDoingPeek();
  });
  const freshReel = $("#history-reel");
  if (freshReel) freshReel.scrollTop = historyScrollTop ?? 0;
  requestAnimationFrame(() => {
    restoreAgentScroll(liveAgentScroll);
    syncTaskScrollers();
    syncAgentFanSpins();
    const inner = $(".current-inner");
    if (inner) {
      inner.querySelectorAll(".subtask-lane[data-lane]").forEach((lane) => {
        // A new completion lands at the top of the tray, so show it there.
        if (risingSubtaskId && lane.dataset.lane === "done") {
          lane.scrollTop = 0;
          return;
        }
        // The inline add row is the first row in its lane. Restoring the old
        // scroll position here would push its top above the lane edge, so only
        // part of the row (or the row above it) stays visible until the user
        // saves it with Enter. Start the lane at the top instead.
        if (addingSubtask && lane.querySelector("[data-add-subtask-row]")) {
          lane.scrollTop = 0;
          return;
        }
        if (revealNewSubtask && lane.dataset.lane === "pending") {
          const fresh = lastAddedSubtaskId
            ? lane.querySelector(`.current-subtask[data-subtask-id="${CSS.escape(lastAddedSubtaskId)}"]`)
            : null;
          lane.scrollTop = fresh
            ? Math.max(0, lane.scrollTop + fresh.getBoundingClientRect().top - lane.getBoundingClientRect().top - 4)
            : 0;
          return;
        }
        const previous = previousLaneScroll.get(lane.dataset.lane);
        if (previous) lane.scrollTop = previous;
      });
      if (revealNewSubtask) revealNewSubtask = false;
    }
    if (celebrateNewSubtask) {
      celebrateNewSubtask = false;
      requestAnimationFrame(() => {
        const rows = [...document.querySelectorAll(".current-subtask[data-subtask-id]")];
        const fresh = lastAddedSubtaskId
          ? rows.find((row) => row.dataset.subtaskId === lastAddedSubtaskId)
          : null;
        AudioFX.splash();
        spawnPixelSplash(fresh || rows[0]);
        lastAddedSubtaskId = null;
      });
    }
  });
  if (addingSubtask) {
    setTimeout(() => {
      const input = $("#subtask-name-input");
      if (!input) return;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
      // Focus may scroll the lane before the render's own scroll pass runs.
      // Re-assert the add row at the top so it is never left half-clipped.
      const lane = input.closest(".subtask-lane");
      const row = input.closest("[data-add-subtask-row]");
      if (lane && row) {
        const offset = row.getBoundingClientRect().top - lane.getBoundingClientRect().top;
        if (offset < 0) lane.scrollTop = Math.max(0, lane.scrollTop + offset);
      }
    }, 30);
  }
  scheduleCustomCaret();
  const subtaskScroller = $(".current-inner");
  if (subtaskScroller) {
    subtaskScroller.querySelectorAll(".subtask-lane[data-lane]").forEach((lane) => {
      lane.addEventListener("scroll", () => {
        if (!lane.classList.contains("task-scrollable")) return;
        AudioFX.subtaskFlow();
      }, { passive: true });
    });
  }
  const reel = $("#history-reel");
  if (reel) {
    reel.addEventListener("scroll", () => {
      historyScrollTop = reel.scrollTop;
      updateHistoryRoll();
      scheduleHistoryCollapse();
    }, { passive: true });
    requestAnimationFrame(() => {
      reel.scrollTop = historyScrollTop ?? 0;
      historyScrollTop = reel.scrollTop;
      setupNotesPanel();
      updateHistoryRoll();
      updateHistorySelection();
      updateSubtaskSelection();
      requestAnimationFrame(() => {
        if (reel.isConnected) reel.classList.remove("no-motion");
      });
    });
  }
  // The stage owns the finished-subtasks card, so a fresh render mounts a
  // fresh live wallpaper pane inside it. A finishing row is in the air right
  // now, though: mount only the landing card's pane (its picture is already
  // baked) and let the rest of the page's cards catch up after the landing.
  if (completionFlightMs) {
    syncCardWallpaper($("#completed-subtask-drawer"), { bakedOnly: true });
    setTimeout(syncCardWallpapers, completionFlightMs + 40);
  } else {
    syncCardWallpapers();
  }
}

function clearCompletedSubtasksAutoClose() {
  if (completedSubtasksAutoCloseTimer === null) return;
  clearTimeout(completedSubtasksAutoCloseTimer);
  completedSubtasksAutoCloseTimer = null;
}

/** Retract the card on its own after a finished row has landed in it. */
function scheduleCompletedSubtasksAutoClose(delay = COMPLETED_DRAWER_DWELL_MS) {
  clearCompletedSubtasksAutoClose();
  completedSubtasksAutoCloseTimer = setTimeout(() => {
    completedSubtasksAutoCloseTimer = null;
    if (!completedSubtasksOpen) return;
    toggleCompletedSubtasks(false);
  }, delay);
}

/** Apply the completed drawer's open state to the current DOM. */
function setCompletedSubtasksOpen(open) {
  if (!open) clearCompletedSubtasksAutoClose();
  // The finished tray and the Doing drawer are separate cards. Opening the
  // tray leaves the Doing drawer exactly where it is: the drawer sits on top,
  // so the two can be used side by side without one dismissing the other.
  completedSubtasksOpen = Boolean(open);
  const bar = $(".completed-subtask-toggle");
  const drawer = $("#completed-subtask-drawer");
  if (!bar || !drawer) return;
  bar.classList.toggle("open", completedSubtasksOpen);
  bar.setAttribute("aria-expanded", completedSubtasksOpen ? "true" : "false");
  bar.setAttribute("aria-label", completedSubtasksOpen ? "Hide completed subtasks" : "Show completed subtasks");
  drawer.classList.toggle("open", completedSubtasksOpen);
  drawer.setAttribute("aria-hidden", completedSubtasksOpen ? "false" : "true");
  // Mount / pause the live wallpaper pane with the card itself.
  syncCardWallpapers();
  if (!completedSubtasksOpen) return;
  settleCardWallpapers(460);
  const lane = drawer.querySelector(".subtask-lane");
  if (!lane) return;
  lane.scrollTop = 0;
  requestAnimationFrame(() => lane._slimUpdate?.());
}

/** Click/swipe the handle line: pull the finished rows down, or tuck them away. */
function toggleCompletedSubtasks(force) {
  // A manual toggle always wins over the pending auto-close.
  clearCompletedSubtasksAutoClose();
  const willOpen = typeof force === "boolean" ? force : !completedSubtasksOpen;
  if (willOpen === completedSubtasksOpen) return;
  setCompletedSubtasksOpen(willOpen);
  AudioFX.drawer(willOpen);
}

/** Apply the live card's fold to the current DOM. */
function setPendingSubtasksCollapsed(collapsed) {
  pendingSubtasksCollapsed = Boolean(collapsed);
  const card = $("#pending-subtask-card");
  const bar = $(".pending-subtask-toggle");
  if (card) {
    card.classList.toggle("collapsed", pendingSubtasksCollapsed);
    card.setAttribute("aria-hidden", pendingSubtasksCollapsed ? "true" : "false");
  }
  // The finished tray lives inside this card. A card folded down to its handle
  // has no room for it, so the tray closes with the sheet it belongs to.
  if (pendingSubtasksCollapsed && completedSubtasksOpen) setCompletedSubtasksOpen(false);
  if (!bar) return;
  // A state change folds the line away itself; a hover preview left over from
  // the previous state must not keep it out.
  bar.classList.remove("peek");
  bar.classList.toggle("collapsed", pendingSubtasksCollapsed);
  bar.setAttribute("aria-expanded", pendingSubtasksCollapsed ? "false" : "true");
  bar.setAttribute("aria-label", pendingSubtasksCollapsed ? "Show subtasks" : "Hide subtasks");
}

/** The purple line on the card's bottom edge folds the live rows away. */
function togglePendingSubtasks(force) {
  if (performance.now() < suppressPendingSubtaskToggleUntil) return;
  const willCollapse = typeof force === "boolean" ? force : !pendingSubtasksCollapsed;
  if (willCollapse === pendingSubtasksCollapsed) return;
  setPendingSubtasksCollapsed(willCollapse);
  AudioFX.drawer(!willCollapse);
}

/** A purple handle is only a control while its lane holds rows. An empty lane
    tucks the pill above the block's top boundary, out of the card's clipped
    box; the first row pulls it back out. The element is rebuilt on every
    render, so only the empty -> filled step plays the pull-out animation. */
function syncSubtaskHandleLine(bar, show, slot) {
  if (!bar) return;
  const was = slot === "pending" ? pendingHandleLineShown : completedHandleLineShown;
  if (slot === "pending") pendingHandleLineShown = show;
  else completedHandleLineShown = show;
  bar.classList.toggle("line-hidden", !show);
  bar.tabIndex = show ? 0 : -1;
  bar.setAttribute("aria-hidden", show ? "false" : "true");
  bar.classList.remove("line-reveal");
  if (!show || was !== false) return;
  bar.classList.add("line-reveal");
  bar.addEventListener("animationend", () => bar.classList.remove("line-reveal"), { once: true });
}

/** The handle is the card's bottom edge: hold it and the sheet stretches.
    Pulling it up folds the rows away a row at a time, pulling it down hands
    them back; the released edge snaps to the nearer end. A plain click still
    flips the card in one motion. */
function bindPendingSubtaskToggle() {
  const bar = $(".pending-subtask-toggle");
  const card = $("#pending-subtask-card");
  if (!bar || !card) return;
  // The handle belongs to the rows: an empty lane keeps the pill tucked above
  // the block's top boundary until the first row (or the inline add row)
  // arrives and pulls it back out.
  const lane = card.querySelector("[data-subtask-list]");
  syncSubtaskHandleLine(
    bar,
    Boolean(lane?.querySelector(".current-subtask[data-subtask-id], [data-add-subtask-row]")),
    "pending"
  );
  // Folded, the purple line waits above the block's top boundary. The first row
  // of the column is its handle: entering that band slides the line back out
  // into the top band, leaving tucks it away again. The click is still the same
  // control, so the hover only previews it. The listener lives on the column
  // wrapper instead of the bar: the bar is clipped while it is tucked away and
  // must be reachable before it is visible.
  const peekZone = card.parentElement;
  let updatePeek = null;
  if (peekZone && peekZone.dataset.subtaskPeekBound !== "1") {
    peekZone.dataset.subtaskPeekBound = "1";
    const peekBand = 42;
    // A held edge owns the line: the pointer travels with the stretch and may
    // leave the first-row band, but the handle it is dragging must stay out.
    const peekPaused = () => bar.classList.contains("stretching");
    updatePeek = (event) => {
      if (event.pointerType === "touch" || peekPaused()) return;
      if (!pendingSubtasksCollapsed) {
        bar.classList.remove("peek");
        return;
      }
      const rect = peekZone.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY - rect.top <= peekBand;
      bar.classList.toggle("peek", inside);
    };
    peekZone.addEventListener("pointermove", updatePeek, { passive: true });
    peekZone.addEventListener("pointerleave", () => {
      if (!peekPaused()) bar.classList.remove("peek");
    });
    bar.addEventListener("pointerenter", () => {
      if (pendingSubtasksCollapsed) bar.classList.add("peek");
    });
  }
  if (bar.dataset.stretchBound === "1") return;
  bar.dataset.stretchBound = "1";
  let pointerId = null;
  let startY = 0;
  let startHeight = 0;
  let limit = 0;
  let foldHeight = 28;
  let stretching = false;

  const readFold = () => {
    const value = parseFloat(getComputedStyle(card).getPropertyValue("--pending-card-fold"));
    return Number.isFinite(value) && value > 0 ? value : 28;
  };

  bar.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    foldHeight = readFold();
    startHeight = card.getBoundingClientRect().height;
    const host = card.parentElement?.getBoundingClientRect();
    limit = Math.max(foldHeight, host ? host.height : startHeight);
    startY = event.clientY;
    pointerId = event.pointerId;
    stretching = false;
    try { bar.setPointerCapture(pointerId); } catch (error) {}
  });

  bar.addEventListener("pointermove", (event) => {
    if (pointerId === null || event.pointerId !== pointerId) return;
    const dy = event.clientY - startY;
    if (!stretching) {
      if (Math.abs(dy) < 4) return;
      stretching = true;
      // The gesture owns the height: no transition, no rebuild mid-drag.
      card.style.transition = "none";
      bar.classList.add("stretching");
    }
    const height = Math.max(foldHeight, Math.min(limit, startHeight + dy));
    card.style.maxHeight = `${height}px`;
  });

  const endStretch = (event) => {
    if (pointerId === null || event.pointerId !== pointerId) return;
    pointerId = null;
    if (!stretching) return;
    stretching = false;
    bar.classList.remove("stretching");
    const height = card.getBoundingClientRect().height;
    card.style.maxHeight = "";
    card.style.transition = "";
    // A stretched edge is a drag, not a click: the click that follows the
    // pointerup must not flip the card a second time.
    suppressPendingSubtaskToggleUntil = performance.now() + 320;
    const folded = height < (foldHeight + limit) / 2;
    // The pointer may have left the first-row band while it was dragging; the
    // release position decides whether the hover preview stays out.
    updatePeek?.(event);
    if (folded === pendingSubtasksCollapsed) return;
    setPendingSubtasksCollapsed(folded);
    AudioFX.drawer(!folded);
  };
  bar.addEventListener("pointerup", endStretch);
  bar.addEventListener("pointercancel", endStretch);
}

/** A downward pull opens the drawer; an upward pull closes it. A tap stays a
    click, so the line can be used with either gesture. */
function bindCompletedSubtasksBar() {
  const bar = $(".completed-subtask-toggle");
  if (!bar) return;
  // Reaching into the card cancels the auto-retract so it cannot disappear
  // while the user is reading or scrolling the finished rows.
  const drawer = $("#completed-subtask-drawer");
  // The tray's handle only exists once something is finished. Before that the
  // pill stays tucked above the block's top boundary, and a tray left open
  // with no rows is closed so it cannot hide behind a handle that is gone.
  const doneLane = drawer?.querySelector("[data-subtask-list]");
  const hasFinishedRows = Boolean(doneLane?.querySelector(".current-subtask[data-subtask-id]"));
  syncSubtaskHandleLine(bar, hasFinishedRows, "completed");
  if (!hasFinishedRows && completedSubtasksOpen) setCompletedSubtasksOpen(false);
  if (drawer && drawer.dataset.autoCloseBound !== "1") {
    drawer.dataset.autoCloseBound = "1";
    drawer.addEventListener("pointerdown", clearCompletedSubtasksAutoClose, { passive: true });
  }
  if (bar.dataset.gestureBound === "1") return;
  bar.dataset.gestureBound = "1";
  let startX = 0;
  let startY = 0;
  let tracking = false;
  let moved = false;
  bar.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    tracking = true;
    moved = false;
    startX = event.clientX;
    startY = event.clientY;
    try { bar.setPointerCapture(event.pointerId); } catch (error) {}
  });
  bar.addEventListener("pointermove", (event) => {
    if (!tracking) return;
    if (Math.abs(event.clientX - startX) > 8 || Math.abs(event.clientY - startY) > 8) moved = true;
  });
  bar.addEventListener("pointerup", (event) => {
    if (!tracking) return;
    tracking = false;
    const dy = event.clientY - startY;
    if (dy > 16) {
      suppressCompletedSubtaskToggleUntil = performance.now() + 700;
      if (!completedSubtasksOpen) {
        setCompletedSubtasksOpen(true);
        AudioFX.drawer(true);
      }
    } else if (dy < -16) {
      suppressCompletedSubtaskToggleUntil = performance.now() + 700;
      if (completedSubtasksOpen) {
        setCompletedSubtasksOpen(false);
        AudioFX.drawer(false);
      }
    } else if (moved) {
      suppressCompletedSubtaskToggleUntil = performance.now() + 700;
    }
  });
  bar.addEventListener("pointercancel", () => { tracking = false; });
}

const TYPEWRITER_SHIFT = 34;

function updateHistoryRoll() {
  const reel = $("#history-reel");
  if (!reel || reel.clientHeight <= 0) return;
  const rows = Array.from(reel.querySelectorAll(".history-row")).filter((row) => !row.classList.contains("history-filler"));
  const center = reel.scrollTop + reel.clientHeight / 2;
  const radius = Math.max(1, reel.clientHeight / 2);
  const overflowing = reel.scrollHeight > reel.clientHeight + 12;
  rows.forEach((row) => {
    const rowCenter = row.offsetTop + row.offsetHeight / 2;
    const d = Math.max(-1.25, Math.min(1.25, (rowCenter - center) / radius));
    const a = Math.min(1, Math.abs(d));
    // A gently bulging platen: the middle stays almost still and the outer
    // rows curve away, instead of a straight linear indent.
    const curved = Math.pow(a, 1.7);
    // Typewriter perspective: the centre line is leftmost, the outer rows
    // slide right and take their dates with them toward the centre divider.
    row.style.setProperty("--type-shift", `${(curved * TYPEWRITER_SHIFT).toFixed(2)}px`);
    // A very slight paper-roll bulge: the centre row faces the viewer, while
    // rows toward either edge shrink a touch and settle down.
    const bulgeScale = 1 - curved * 0.04;
    // Rows on either side pull gently towards the middle line, as if the sheet
    // were wrapped around a shallow platen.
    const signed = Math.max(-1, Math.min(1, d));
    const bulgeLift = -signed * 2.2;
    // Rows away from the middle lean away from the viewer, so the sheet reads
    // as a shallow roll bulging towards the centre line.
    const bulgeTilt = -signed * 3.2;
    row.style.setProperty("--type-scale", bulgeScale.toFixed(3));
    row.style.setProperty("--type-lift", `${bulgeLift.toFixed(2)}px`);
    row.style.setProperty("--type-tilt", `${bulgeTilt.toFixed(2)}deg`);
    // The ruled lines stay on the fixed paper grid; only the row content moves.
    row.style.transform = `translateY(${bulgeLift.toFixed(2)}px) scale(${bulgeScale.toFixed(3)}) rotateX(${bulgeTilt.toFixed(2)}deg)`;
    row.style.filter = "none";
    // Font and highlight never fade: expanding subtasks, selecting a row or
    // the typewriter roll must not wash them out.
    row.style.opacity = "1";
    row.style.setProperty("--row-opacity", "1");
    if (!overflowing) {
      row.style.fontWeight = "400";
      return;
    }
    if (row.classList.contains("cursor")) {
      row.style.fontWeight = "700";
      return;
    }
    row.style.fontWeight = a < 0.55 ? "700" : "400";
  });
}

function updateHistoryCursor() {
  const reel = $("#history-reel");
  if (!reel) return;
  const suppressCursor = Boolean(selectedSubtaskId || selectedHistoryId);
  reel.querySelectorAll(".history-row").forEach((row) => {
    const cursor = !suppressCursor && Number(row.dataset.historyIndex) === historyCursor;
    row.classList.toggle("cursor", cursor);
  });
  // The focused row must become fully opaque immediately, without needing a
  // scroll to recompute the typewriter fade.
  updateHistoryRoll();
}

function scrollHistory(delta) {
  const reel = $("#history-reel");
  if (!reel) return;
  const before = reel.scrollTop;
  const max = Math.max(0, reel.scrollHeight - reel.clientHeight);
  const next = Math.round((reel.scrollTop + delta * 40) / 40) * 40;
  reel.scrollTop = Math.max(0, Math.min(max, next));
  historyScrollTop = reel.scrollTop;
  updateHistoryRoll();
  if (reel.scrollTop !== before) AudioFX.waterFlow();
  scheduleHistoryCollapse();
}

let historyCollapseTimer = null;
function scheduleHistoryCollapse() {
  clearTimeout(historyCollapseTimer);
  historyCollapseTimer = setTimeout(collapseOffscreenHistory, 220);
}

function collapseOffscreenHistory() {
  const reel = $("#history-reel");
  if (!reel || !historyExpanded.size) return;
  const bounds = reel.getBoundingClientRect();
  let changed = false;
  for (const index of [...historyExpanded]) {
    const row = reel.querySelector(`.history-row[data-history-index="${index}"]`);
    if (!row) { historyExpanded.delete(index); changed = true; continue; }
    const subs = reel.querySelector(`[data-history-subs="${index}"]`);
    const rowRect = row.getBoundingClientRect();
    const subsRect = subs?.getBoundingClientRect();
    const lastBottom = Math.max(rowRect.bottom, subsRect?.bottom ?? rowRect.bottom);
    const firstTop = Math.min(rowRect.top, subsRect?.top ?? rowRect.top);
    if (lastBottom < bounds.top - 2 || firstTop > bounds.bottom + 2) {
      historyExpanded.delete(index);
      changed = true;
    }
  }
  if (changed) renderStage();
}

function themeOf(card) {
  return THEMES[card.theme] || THEMES.alpine;
}

function renderArchive() {
  const tree = $("#archive-tree");
  const cards = [...(state.data.archive || [])].sort((a, b) => String(b.week_start).localeCompare(String(a.week_start)));
  const hasSamples = cards.some((card) => card.sample);
  const archived = cards.reduce((sum, card) => sum + (card.items?.length || 0), 0);
  $("#archive-summary").textContent = `${cards.length} postcards · ${archived} entries`;
  if (!cards.length) {
    tree.innerHTML = `<div class="drawer-empty"><div class="big">The box is empty.</div><div>Finish a week, and it will arrive here as a postcard.</div></div>`;
    return;
  }
  const years = new Map();
  for (const card of cards) {
    const year = card.year || parseDate(card.week_start)?.getFullYear() || 0;
    const month = card.month || (parseDate(card.week_start)?.getMonth() + 1) || 0;
    if (!years.has(year)) years.set(year, new Map());
    const months = years.get(year);
    if (!months.has(month)) months.set(month, []);
    months.get(month).push(card);
  }
  const sortedYears = [...years.keys()].sort((a, b) => b - a);
  const latestYear = sortedYears[0];
  tree.innerHTML = sortedYears.map((year) => {
    const months = years.get(year);
    const monthKeys = [...months.keys()].sort((a, b) => b - a);
    const count = [...months.values()].reduce((sum, list) => sum + list.length, 0);
    return `<details class="year-group" ${year === latestYear ? "open" : ""}>
      <summary><span class="chev">▸</span><span>${year}</span><span class="count">${count}</span></summary>
      <div class="months">
        ${monthKeys.map((month) => `<details class="month-group" ${year === latestYear ? "open" : ""}>
          <summary><span class="chev">▸</span><span>${String(month).padStart(2, "0")}月 · ${MONTH_NAMES[month - 1] || ""}</span><span class="count">${months.get(month).length}</span></summary>
          <div class="week-list">
            ${months.get(month).map((card) => {
              const theme = themeOf(card);
              return `<button class="week-line" data-card-id="${esc(card.id)}" style="--sw-a:${esc(theme.accent)};--row-accent-rgb:${hexToRgb(theme.accent)}">
                <span class="week-swatch"></span>
                <span class="week-w">W${String(card.week || 0).padStart(2, "0")}</span>
                <span class="week-dates">${fmtNumeric(card.week_start)} — ${fmtNumeric(card.week_end)}</span>
                <span class="week-theme">${esc(theme.name)}${card.sample ? '<span class="sample-word">sample</span>' : ""}</span>
                <span class="week-count">${card.items?.length || 0} ${completedIcon()}</span>
                <span class="week-arrow">${expandedArchiveCardId === card.id ? "⌄" : "›"}</span>
                <span class="week-art" aria-hidden="true">${theme.art(theme)}</span>
              </button>${expandedArchiveCardId === card.id ? archivePostcardHtml(card) : ""}`;
            }).join("")}
          </div>
        </details>`).join("")}
      </div>
    </details>`;
  }).join("");
}

function openArchive() {
  archiveOpen = true;
  const drawer = $("#archive-drawer");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  $("#archive-backdrop")?.classList.add("open");
  renderArchive();
}

function closeArchive() {
  archiveOpen = false;
  expandedArchiveCardId = null;
  const drawer = $("#archive-drawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  $("#archive-backdrop")?.classList.remove("open");
}

function renderTrashDrawer() {
  const list = $("#trash-list");
  if (!list) return;
  const items = Array.isArray(state.data?.trash) ? state.data.trash : [];
  const summary = $("#trash-summary");
  if (summary) summary.textContent = items.length
    ? `${items.length} deleted subtask${items.length === 1 ? "" : "s"}`
    : "The hat is empty";
  if (!items.length) {
    list.innerHTML = `<div class="trash-empty">Empty magic hat.</div>`;
    return;
  }
  list.innerHTML = items.map((item) => `
    <div class="trash-row" data-trash-id="${esc(item.id)}">
      <button class="trash-fan" type="button" data-restore-subtask="${esc(item.id)}" aria-label="Restore ${esc(item.name || "subtask")}">
        <svg viewBox="0 0 1024 1024" aria-hidden="true"><use href="#fan"></use></svg>
      </button>
      <div class="trash-copy">
        <span class="trash-name">${esc(item.name || "Untitled")}</span>
        <small>${esc(item.todo_name || "Todo")}${item.category_name ? ` · ${esc(item.category_name)}` : ""}</small>
      </div>
    </div>`).join("");
}

function openTrashDrawer() {
  trashOpen = true;
  renderTrashDrawer();
  const drawer = $("#trash-drawer");
  if (!drawer) return;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("trash-open");
  // The drawer is a card made of the wallpaper. Its pane is baked while the
  // card is still closed; a film that has no still yet mounts its live window
  // here, exactly like the finished-subtasks card.
  syncCardWallpaper(drawer);
  AudioFX.drawer(true);
}

function closeTrashDrawer() {
  if (!trashOpen) return;
  trashOpen = false;
  const drawer = $("#trash-drawer");
  drawer?.classList.remove("open");
  drawer?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("trash-open");
  AudioFX.drawer(false);
}

// Every plugin page loads the shared theme bridge in plugins/plugin-theme.js.
// The host sends the live notebook variables with each theme message: the
// postcard palette first, then the page line, the shared card outline/radius
// and lift, and the reader's font stacks. Palette uses the same payload; the
// other control pages map it through plugins/plugin-theme.css.
const PALETTE_THEME_VARS = [
  "--pc-paper", "--pc-paper2", "--pc-ink", "--pc-muted",
  "--pc-accent", "--pc-accent-2", "--pc-accent2",
  "--pc-accent-rgb", "--pc-accent2-rgb", "--pc-border",
  "--pc-line", "--pc-rule", "--pc-paper-rgb", "--pc-paper2-rgb",
  "--pc-glow", "--pc-stamp", "--pc-paper-soft",
  "--pc-mask-soft", "--pc-mask-mid", "--pc-mask-strong",
  "--display", "--mono", "--script", "--note-font", "--overlay-top",
  // The single horizontal divider every page region is printed with.
  "--page-line-paint", "--page-line-thickness", "--page-line-row",
  "--page-task-h",
  // The floating-card recipe: one ink-green stroke, one corner, one lift.
  "--subcard-outline", "--overlay-paper", "--overlay-radius",
  "--card-lift-page", "--card-lift-card",
  // Legacy aliases kept for plugin pages that read the notebook's base names.
  "--paper", "--ink", "--muted", "--line",
];

function paletteThemeVars() {
  const styles = getComputedStyle(document.documentElement);
  const vars = {};
  for (const name of PALETTE_THEME_VARS) {
    const value = styles.getPropertyValue(name).trim();
    if (value) vars[name] = value;
  }
  return vars;
}

function pluginThemeMessage() {
  return {
    type: "neotodo-theme",
    dark: document.documentElement.dataset.postcardDark === "true",
    // Every plugin page paints with the notebook's own palette and line
    // recipe. Palette reads the first group; the shared bridge in
    // plugins/plugin-theme.js maps the rest onto each control page.
    vars: paletteThemeVars(),
  };
}

function syncPluginTheme() {
  const frame = $("#plugin-root .plugin-frame");
  if (!frame?.contentWindow) return;
  try {
    frame.contentWindow.postMessage(pluginThemeMessage(), window.location.origin);
  } catch (error) {}
}

function syncPluginSettings() {
  const frame = $("#plugin-root .plugin-frame");
  const plugin = PLUGIN_REGISTRY[openPluginId];
  if (!frame?.contentWindow || !plugin) return;
  try {
    frame.contentWindow.postMessage({
      type: "neotodo-plugin-settings",
      plugin: plugin.id,
      settings: { ...pluginState(plugin.id)?.settings },
    }, window.location.origin);
  } catch (error) {}
}

// A manifest can tag itself "intheme" (or "in-theme") when its page is not a
// mini-app but the notebook's own Settings sheet. Those pages get the glass
// stage and close any Settings/Community sheet behind them, exactly like the
// Palette plugin.
const IN_THEME_TAGS = new Set(["intheme", "in-theme"]);

function pluginUsesInTheme(pluginId) {
  const plugin = PLUGIN_REGISTRY[pluginId];
  const tags = Array.isArray(plugin?.tags) ? plugin.tags : [];
  return tags.some((tag) => IN_THEME_TAGS.has(String(tag).toLowerCase()));
}

function openPluginPanel(id, options = {}) {
  const plugin = PLUGIN_REGISTRY[id];
  const root = $("#plugin-root");
  if (!plugin || !root) return;
  // In-theme pages are Settings sheets of their own: never leave the Settings
  // or Community sheet visible behind their transparent stage.
  const inTheme = pluginUsesInTheme(id);
  if (inTheme) {
    closeSettings();
    closeCommunity();
  }
  const query = String(options?.query || "").replace(/^\?/, "");
  // No query: a second click on the same rail icon keeps the panel as it is.
  // With a query (a fork id) the iframe restarts so the plugin can boot
  // straight into that sub-app.
  if (openPluginId && !query) return;
  if (openPluginId) closePluginPanel();
  if (!pluginEnabled(id)) {
    toast(`${plugin.title} is turned off`, true);
    return;
  }
  openPluginId = id;
  document.activeElement?.blur?.();
  AudioFX.drawer(true);
  const entry = query
    ? `${plugin.entry}${plugin.entry.includes("?") ? "&" : "?"}${query}`
    : plugin.entry;
  root.innerHTML = `<iframe class="plugin-frame" title="${esc(plugin.title)}" src="${esc(entry)}" allow="autoplay"></iframe>`;
  root.setAttribute("aria-hidden", "false");
  // An in-theme page is a Settings sheet, not a mini-app: let the live
  // notebook and its wallpaper stay visible behind the floating panel.
  root.classList.toggle("plugin-glass", inTheme);
  root.classList.add("open");
  document.body.classList.add("plugin-open");
  const frame = root.querySelector(".plugin-frame");
  frame?.addEventListener("load", () => {
    syncPluginTheme();
    syncPluginSettings();
    // In-theme plugins are the notebook's own Settings-style sheets, so their
    // text answers with the same select-to-copy badge. Mini-apps keep their
    // own interactions.
    if (inTheme) bindFrameCopy(frame);
  });
  pluginThemeObserver = new MutationObserver(syncPluginTheme);
  // A new theme pack rewrites the palette variables on :root and the page line
  // lives in its own variables, so the theme message must follow every one of
  // them, not only the light/dark switch.
  pluginThemeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-postcard-dark", "data-postcard", "data-theme", "data-font", "data-note-font", "style"]
  });
}

function closePluginPanel() {
  if (!openPluginId) return;
  openPluginId = null;
  pluginThemeObserver?.disconnect();
  pluginThemeObserver = null;
  const root = $("#plugin-root");
  const inTheme = Boolean(root?.classList.contains("plugin-glass"));
  root?.classList.remove("open");
  root?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("plugin-open");
  AudioFX.drawer(false);
  if (!root) return;
  if (pluginCloseTimer) {
    clearTimeout(pluginCloseTimer);
    pluginCloseTimer = 0;
  }
  if (!inTheme) {
    root.classList.remove("plugin-glass");
    root.innerHTML = "";
    return;
  }
  // Keep the glass stage and its sheet for the length of the fade. Removing
  // the class now would drop the opaque paper background over the notebook for
  // one frame, and readers see that full-page wash as a refresh.
  pluginCloseTimer = setTimeout(() => {
    pluginCloseTimer = 0;
    if (openPluginId) return; // another plugin has taken over the stage
    root.innerHTML = "";
    root.classList.remove("plugin-glass");
  }, 220);
}

function pluginSettingDefault(item) {
  if (!item || typeof item.id !== "string") return undefined;
  if (item.type === "toggle") return item.default !== false;
  if (item.type === "choice") {
    const options = Array.isArray(item.options) ? item.options : [];
    const values = options.map((option) => option.value).filter((value) => typeof value === "string");
    return values.includes(item.default) ? item.default : (values[0] ?? "");
  }
  return undefined;
}

function pluginDefaultSettings(plugin) {
  const defaults = {};
  for (const item of plugin?.settings || []) {
    const value = pluginSettingDefault(item);
    if (value !== undefined) defaults[item.id] = value;
  }
  return defaults;
}

function normalizePluginSettings(plugin, values) {
  const next = values && typeof values === "object" && !Array.isArray(values) ? { ...values } : {};
  for (const item of plugin?.settings || []) {
    const fallback = pluginSettingDefault(item);
    if (fallback === undefined) continue;
    if (item.type === "toggle") {
      if (typeof next[item.id] !== "boolean") next[item.id] = fallback;
    } else if (item.type === "choice") {
      const options = (item.options || [])
        .map((option) => option.value)
        .filter((value) => typeof value === "string");
      if (!options.includes(next[item.id])) next[item.id] = fallback;
    }
  }
  return next;
}

function pluginState(pluginId) {
  const plugin = PLUGIN_REGISTRY[pluginId];
  if (!plugin) return null;
  if (!settings.plugins || typeof settings.plugins !== "object") settings.plugins = {};
  let state = settings.plugins[pluginId];
  if (!state || typeof state !== "object") state = settings.plugins[pluginId] = {};
  if (typeof state.installed !== "boolean") state.installed = plugin.defaultInstalled !== false;
  if (typeof state.enabled !== "boolean") state.enabled = state.installed;
  if (!state.settings || typeof state.settings !== "object" || Array.isArray(state.settings)) state.settings = {};
  state.settings = normalizePluginSettings(plugin, state.settings);
  return state;
}

function pluginEnabled(pluginId) {
  const state = pluginState(pluginId);
  return Boolean(state?.installed && state.enabled);
}

/** A plain copy of every plugin's saved settings, keyed by plugin id. */
function pluginSettingsSnapshot() {
  const snapshot = {};
  for (const plugin of Object.values(PLUGIN_REGISTRY)) {
    const state = pluginState(plugin.id);
    if (state) snapshot[plugin.id] = { ...state.settings };
  }
  return snapshot;
}

// Plugins that own page chrome (the Head Bar's bottle colour, for example)
// cannot read settings while their script boots: the notebook only finishes
// loading them a beat later. Publish the whole map after every load and edit so
// a restart restores the reader's last choice instead of the default.
function notifyPluginSettings() {
  window.dispatchEvent(new CustomEvent("neotodo-plugin-settings-sync", {
    detail: { plugins: pluginSettingsSnapshot() },
  }));
}

function pluginAssetUrl(pluginId, relative) {
  const rel = String(relative || "").replace(/^\/+/, "");
  return `/plugins/${encodeURIComponent(pluginId)}/${rel.split("/").map(encodeURIComponent).join("/")}`;
}

function pluginCategoryLabel(value) {
  const raw = String(value || "Interface").trim();
  if (!raw) return "Interface";
  const lower = raw.toLowerCase();
  if (lower === "ai") return "AI";
  if (lower === "ui") return "UI";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/** Keep one manifest setting control in the shape Settings → Plugins renders. */
function pluginSettingDefinition(item) {
  if (!item || typeof item !== "object" || typeof item.id !== "string" || !item.id) return null;
  const type = item.type === "choice" ? "choice" : item.type === "toggle" ? "toggle" : "";
  if (!type) return null;
  const definition = {
    id: item.id,
    label: String(item.label || item.id),
    detail: String(item.detail || ""),
    type,
  };
  if (type === "toggle") {
    definition.default = item.default !== false;
    return definition;
  }
  const options = [];
  const seen = new Set();
  for (const option of Array.isArray(item.options) ? item.options : []) {
    const value = typeof option === "string"
      ? option
      : option && typeof option.value === "string" ? option.value : "";
    if (!value || value.length > 64 || seen.has(value)) continue;
    seen.add(value);
    options.push({
      value,
      label: String((option && typeof option === "object" ? option.label : "") || value),
      detail: String((option && typeof option === "object" ? option.detail : "") || ""),
    });
    if (options.length >= 12) break;
  }
  if (!options.length) return null;
  definition.default = seen.has(String(item.default || "")) ? String(item.default) : options[0].value;
  definition.options = options;
  return definition;
}

/** Turn a manifest returned by the backend into a PLUGIN_REGISTRY record. */
function pluginManifestEntry(manifest) {
  const id = String(manifest?.id || "");
  if (!/^[a-z0-9][a-z0-9-]{1,63}$/.test(id)) return null;
  const icon = String(manifest.icon || "").trim();
  const entry = String(manifest.entry || "index.html").trim();
  const settings = (Array.isArray(manifest.settings) ? manifest.settings : [])
    .map(pluginSettingDefinition)
    .filter(Boolean);
  const tags = Array.isArray(manifest.tags) ? manifest.tags.filter((tag) => typeof tag === "string").slice(0, 6) : [];
  return {
    id,
    title: String(manifest.name || id),
    englishTitle: String(manifest.englishName || id),
    version: String(manifest.version || "1.0.0"),
    author: String(manifest.author || "Community"),
    category: pluginCategoryLabel(manifest.category),
    description: String(manifest.description || ""),
    icon: icon ? pluginAssetUrl(id, icon) : "",
    entry: pluginAssetUrl(id, entry),
    settings,
    source: manifest.source === "user" ? "user" : "bundled",
    homepage: String(manifest.homepage || ""),
    repository: String(manifest.repository || ""),
    license: String(manifest.license || ""),
    tags,
  };
}

/** Merge discovered folders into the registry and remember downloaded ones. */
function mergePluginManifests(manifests) {
  const users = [];
  for (const manifest of Array.isArray(manifests) ? manifests : []) {
    const entry = pluginManifestEntry(manifest);
    if (!entry) continue;
    const existing = PLUGIN_REGISTRY[entry.id];
    if (entry.source === "user") {
      // A downloaded plugin replaces the built-in record and can be updated in
      // place without losing its settings. If an older backend returns a
      // manifest without setting rows, keep the definitions we already know.
      const settings = entry.settings.length ? entry.settings : (existing?.settings || []);
      PLUGIN_REGISTRY[entry.id] = { ...(existing || {}), ...entry, settings };
      users.push(entry);
      continue;
    }
    // Bundled plugins stay opt-in for the registry: several of them are wired
    // directly into index.html and should not sprout confusing host switches.
    if (existing) {
      existing.source = "bundled";
      existing.version = entry.version || existing.version;
      existing.homepage = entry.homepage || existing.homepage || "";
      existing.repository = entry.repository || existing.repository || "";
      existing.license = entry.license || existing.license || "";
      existing.tags = entry.tags.length ? entry.tags : existing.tags || [];
      // A plugin that registers itself from its own script can win the boot
      // race before this backend manifest lands. In that case its record
      // already has the setting rows; otherwise adopt the manifest's rows so
      // choices such as the Head Bar bottle stay editable after a restart.
      // Existing rows win (the plugin's own script may know a newer shape) and
      // the manifest only fills in ids it has not registered yet.
      const mergedSettings = [];
      const seenSettings = new Set();
      for (const row of [...(Array.isArray(existing.settings) ? existing.settings : []), ...entry.settings]) {
        if (!row || typeof row.id !== "string" || seenSettings.has(row.id)) continue;
        seenSettings.add(row.id);
        mergedSettings.push(row);
      }
      existing.settings = mergedSettings;
    }
  }
  installedUserPlugins = users;
}

async function loadInstalledPlugins() {
  try {
    const response = await fetch("/api/plugins", { cache: "no-store" });
    if (!response.ok) return;
    const result = await response.json();
    if (!result?.ok || !Array.isArray(result.plugins)) return;
    mergePluginManifests(result.plugins);
    renderPluginRail();
  } catch (error) {
    // Older builds do not expose /api/plugins; the bundled registry still works.
  }
}

function pluginRailGlyph(plugin) {
  if (plugin.icon) {
    return `<img class="community-plugin-glyph" src="${esc(plugin.icon)}" alt="">`;
  }
  return `<svg class="community-plugin-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6v5a3 3 0 0 0 3 3h3v6h-5a3 3 0 0 0-3 3v1H7v-4a3 3 0 0 0-3-3H3V9h5a3 3 0 0 0 3-3V3Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
}

// A plugin can claim a top-right header slot by tagging itself "achievement"
// (or "成就"). The headphones are the built-in achievement (index.html marks
// them with data-achievement="completed") and always stay; each new tagged
// plugin adds its own slot to their right, pushing the older achievements left.
const ACHIEVEMENT_TAGS = new Set(["achievement", "achievements", "trophy", "成就"]);
// Header achievements that ship with the notebook and never use plugin state.
const BUILTIN_ACHIEVEMENT_IDS = new Set(["completed"]);
const ACHIEVEMENT_SLOT_SELECTOR = ".head-right [data-achievement], .head-right [data-achievement-plugin]";

function pluginHasAchievementTag(pluginId) {
  const plugin = PLUGIN_REGISTRY[pluginId];
  const tags = Array.isArray(plugin?.tags) ? plugin.tags : [];
  return tags.some((tag) => ACHIEVEMENT_TAGS.has(String(tag).toLowerCase()));
}

function achievementSlotVisible(pluginId) {
  if (!pluginId) return false;
  // The built-in headphone achievement is never removed or switched off.
  const builtin = Array.from(document.querySelectorAll(".head-right [data-achievement]"))
    .some((node) => node.dataset.achievement === pluginId);
  if (builtin) return true;
  return pluginHasAchievementTag(pluginId) && pluginEnabled(pluginId);
}

/** Achievement-tagged plugins that currently own a top-right slot. */
function activeAchievementPlugins() {
  return Object.values(PLUGIN_REGISTRY).filter((plugin) =>
    !BUILTIN_ACHIEVEMENT_IDS.has(plugin.id) &&
    pluginHasAchievementTag(plugin.id) &&
    pluginEnabled(plugin.id)
  );
}

function achievementSlotGlyph(plugin) {
  if (plugin.icon) {
    return `<img class="achievement-plugin-glyph" src="${esc(plugin.icon)}" alt="">`;
  }
  const initial = String(plugin.title || plugin.id || "?").trim().slice(0, 1).toUpperCase();
  return `<span class="achievement-plugin-glyph achievement-plugin-letter" aria-hidden="true">${esc(initial)}</span>`;
}

function achievementSlotMarkup(plugin) {
  return `<button class="achievement-plugin-slot" type="button" data-action="open-achievement-plugin" data-plugin-id="${esc(plugin.id)}" data-achievement-plugin="${esc(plugin.id)}" aria-label="${esc(plugin.title)} achievement" title="${esc(plugin.title)}">
      ${achievementSlotGlyph(plugin)}
    </button>`;
}

/** Keep one header slot per enabled achievement plugin, in registry order. */
function renderAchievementShelf() {
  const shelf = document.querySelector(".head-right");
  if (!shelf) return;
  const active = activeAchievementPlugins();
  const wanted = new Set(active.map((plugin) => plugin.id));
  shelf.querySelectorAll(".achievement-plugin-slot").forEach((node) => {
    if (!wanted.has(node.dataset.achievementPlugin)) node.remove();
  });
  const present = new Set(
    Array.from(shelf.querySelectorAll("[data-achievement-plugin]"))
      .map((node) => node.dataset.achievementPlugin)
  );
  for (const plugin of active) {
    if (present.has(plugin.id)) continue;
    const template = document.createElement("template");
    template.innerHTML = achievementSlotMarkup(plugin);
    shelf.appendChild(template.content.firstElementChild);
    present.add(plugin.id);
  }
}

function achievementShelfRects() {
  const rects = new Map();
  document.querySelectorAll(ACHIEVEMENT_SLOT_SELECTOR).forEach((node) => {
    const rect = node.getBoundingClientRect();
    // Hidden slots report a zero-size rect; they only need their enter animation.
    if (rect.width > 0) rects.set(node, rect.left);
  });
  return rects;
}

/** Slide the existing achievements after a slot appears or leaves. */
function animateAchievementShift(previousRects) {
  if (!previousRects) return;
  document.querySelectorAll(ACHIEVEMENT_SLOT_SELECTOR).forEach((node) => {
    const previousLeft = previousRects.get(node);
    if (previousLeft === undefined) return;
    const nextLeft = node.getBoundingClientRect().left;
    const delta = previousLeft - nextLeft;
    if (Math.abs(delta) < 1) return;
    if (typeof node.animate !== "function") return;
    node.animate(
      [{ transform: `translateX(${delta}px)` }, { transform: "translateX(0)" }],
      { duration: 280, easing: "cubic-bezier(0.22, 0.9, 0.28, 1)" }
    );
  });
}

function renderPluginRail() {
  const rail = $("#community-plugin-rail");
  if (!rail) return;
  const plugins = Object.values(PLUGIN_REGISTRY).filter((plugin) => plugin.source === "user");
  rail.innerHTML = plugins.map((plugin) => `<button class="tool-button community-plugin-tool" type="button" data-action="open-community-plugin" data-plugin="${esc(plugin.id)}" data-plugin-id="${esc(plugin.id)}" aria-label="${esc(plugin.title)}">
      ${pluginRailGlyph(plugin)}
    </button>`).join("");
  applyPluginState();
}


function applyPluginState(animate = false) {
  const previousRects = animate ? achievementShelfRects() : null;
  document.querySelectorAll("[data-plugin]").forEach((node) => {
    node.classList.toggle("plugin-hidden", !pluginEnabled(node.dataset.plugin));
  });
  // Achievement-tagged plugins get a real header slot. Create the ones that
  // were installed since the last render, then hide any disabled slot.
  renderAchievementShelf();
  document.querySelectorAll("[data-achievement-plugin]").forEach((node) => {
    node.classList.toggle("plugin-hidden", !achievementSlotVisible(node.dataset.achievementPlugin));
  });
  animateAchievementShift(previousRects);
  if (openPluginId && !pluginEnabled(openPluginId)) closePluginPanel();
}

/** Plugins that reshape the task stage need it redrawn when their switch flips. */
function refreshPluginSurface(pluginId) {
  if (pluginId === "pomodoro" && !pluginEnabled("pomodoro")) {
    closeFocusTimer();
    if (document.body.dataset.achievementSheet === "focus") closeCompletedLog();
  }
  if (pluginId !== "completed-drawer" || !state.data) return;
  completedSubtasksOpen = false;
  renderStage();
}

function setPluginEnabled(pluginId, enabled) {
  const plugin = PLUGIN_REGISTRY[pluginId];
  const state = pluginState(pluginId);
  if (!plugin || !state || !state.installed) return;
  state.enabled = Boolean(enabled);
  saveSettings();
  applyPluginState(true);
  // Turning a plugin off must also tear down its live panel. Some plugin
  // pages own media elements, so leaving the iframe mounted kept audio
  // playing after the switch was flipped.
  if (!state.enabled && openPluginId === pluginId) closePluginPanel();
  refreshPluginSurface(pluginId);
  AudioFX.categoryTap();
  renderSettings();
  toast(`${plugin.title} ${state.enabled ? "turned on" : "turned off"}`);
}

// Plugin control pages run in an iframe and use these host hooks to read and
// flip their own switch without reloading the notebook.
window.pluginEnabled = pluginEnabled;
window.setPluginEnabled = setPluginEnabled;

// ---------------------------------------------------------------------------
// Palette plugin host bridge.
//
// Settings → Theme keeps the theme selector, the wallpaper and the note
// surface (under Note theme). The page-line, selection-highlight and
// finished-row controls are owned by /plugins/palette, which runs inside the
// plugin iframe. It writes through this bridge so the notebook still paints
// from page-line.json, baseline-rule.json and the normal saved settings — the
// plugin is a second door to the same files, never a private palette.
// ---------------------------------------------------------------------------
function paletteSnapshot() {
  const theme = THEMES[currentPostcardId()] || THEMES.light;
  const line = pageLine();
  const rule = baselineRowRule();
  return {
    highlight: highlightColor(),
    highlightFallback: bodyInkColor(),
    pageLine: line,
    pageLinePaint: pageLinePaint(line),
    baselineRule: rule,
    theme: {
      id: currentPostcardId(),
      name: theme.name || currentPostcardId(),
      dark: document.documentElement.dataset.postcardDark === "true",
      vars: paletteThemeVars(),
    },
  };
}

window.NeoTodoPalette = {
  read() {
    return paletteSnapshot();
  },
  setPageLine(patch) {
    savePageLine(patch || {});
    return paletteSnapshot();
  },
  setBaselineRule(patch) {
    saveBaselineRowRule(patch || {});
    return paletteSnapshot();
  },
  setHighlight(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return this.resetHighlight();
    const color = normalizeHighlightColorInput(raw);
    if (!color) return paletteSnapshot();
    settings.highlight = color;
    saveSettings();
    applyHighlight();
    return paletteSnapshot();
  },
  resetHighlight() {
    settings.highlight = "";
    saveSettings();
    applyHighlight();
    return paletteSnapshot();
  },
};

// ---------------------------------------------------------------------------
// Postcard plugin host bridge.
//
// The archive and the large postcard viewer stay in the notebook. The plugin
// page under /plugins/postcard only prints the week list and asks for the card
// markup the notebook already owns, so there is one archive and the app's
// startup never has to load a second copy of the postcard themes.
// ---------------------------------------------------------------------------
function postcardBridgeList() {
  const cards = [...(state.data?.archive || [])]
    .sort((a, b) => String(b.week_start).localeCompare(String(a.week_start)));
  let entries = 0;
  const rows = cards.map((card) => {
    const theme = themeOf(card);
    const count = Array.isArray(card.items) ? card.items.length : 0;
    entries += count;
    const start = parseDate(card.week_start);
    const year = card.year || start?.getFullYear() || 0;
    const month = card.month || ((start?.getMonth() ?? 0) + 1);
    return {
      id: card.id,
      year,
      month,
      monthLabel: `${String(month).padStart(2, "0")}月 · ${MONTH_NAMES[month - 1] || ""}`,
      weekLabel: `W${String(card.week || 0).padStart(2, "0")}`,
      dates: `${fmtNumeric(card.week_start)} — ${fmtNumeric(card.week_end)}`,
      count,
      sample: Boolean(card.sample),
      seen: Boolean(card.seen),
      themeName: theme.name || "",
      accent: theme.accent || "",
      accentRgb: hexToRgb(theme.accent || "#888888"),
      art: typeof theme.art === "function" ? theme.art(theme) : "",
    };
  });
  const theme = THEMES[currentPostcardId()] || THEMES.light;
  return { cards: rows, entries, themeName: theme.name || "" };
}

function postcardBridgeCard(cardId) {
  const id = String(cardId || "");
  return (state.data?.archive || []).find((card) => card.id === id) || null;
}

window.NeoTodoPostcards = {
  list() {
    return postcardBridgeList();
  },
  article(cardId) {
    const card = postcardBridgeCard(cardId);
    if (!card) return "";
    // The iframe carries the sheet, not the notebook's symbol sprite, so the
    // per-item trophy becomes a quiet star inside the preview.
    return postcardArticleHtml(card, '<span class="pc-star" aria-hidden="true">✦</span>');
  },
  open(cardId) {
    const card = postcardBridgeCard(cardId);
    if (!card) return false;
    // The plugin iframe sits above the notebook's modal layer: fold it first,
    // then let the real postcard viewer open behind it.
    closePluginPanel();
    setTimeout(() => openPostcard(card.id), 30);
    return true;
  },
  markSeen(cardId) {
    const card = postcardBridgeCard(cardId);
    if (!card) return false;
    silentAction("mark_seen", { card_id: card.id }).then((result) => {
      if (result?.state) state.data = result.state;
    }).catch(() => {});
    return true;
  },
};

// ---------------------------------------------------------------------------
// Community plugin host bridge.
//
// The Community shop used to be a modal owned by app.js. It now lives in the
// "community" plugin, but plugin and theme installation still has to update
// the notebook's registry, rail and saved switches. The same-origin iframe
// calls these methods; the notebook stays the single owner of that state.
// ---------------------------------------------------------------------------
window.NeoTodoCommunity = {
  read() {
    const plugins = {};
    for (const plugin of Object.values(PLUGIN_REGISTRY)) {
      const pluginRecord = pluginState(plugin.id);
      plugins[plugin.id] = {
        id: plugin.id,
        title: plugin.title,
        version: plugin.version,
        icon: plugin.icon || "",
        source: plugin.source || "bundled",
        installed: Boolean(pluginRecord?.installed),
        enabled: Boolean(pluginRecord?.enabled),
      };
    }
    const themes = (Array.isArray(themePacks) ? themePacks : []).map((pack) => ({
      id: pack.id,
      name: pack.name || pack.id,
      englishName: pack.englishName || "",
      version: pack.version || "1.0.0",
      description: pack.description || "",
      author: pack.author || "NeoTodo",
      palette: pack.palette && typeof pack.palette === "object" ? pack.palette : {},
      chrome: Boolean(pack.chrome),
      note: Boolean(pack.note),
      ai: Boolean(pack.ai),
      source: pack.source || "user",
      bundled: pack.source === "bundled",
      applied: settings.resolved_postcard === pack.id,
    }));
    return {
      plugins,
      themes,
      theme: {
        id: currentPostcardId(),
        name: postcardName(currentPostcardId()),
      },
      themeBusy: themePackBusy || "",
      installing: [...pluginInstalling],
    };
  },

  async load(force = false) {
    await Promise.allSettled([
      loadPluginCatalog(Boolean(force)),
      loadThemeCatalog(Boolean(force)),
      loadInstalledPlugins(),
      loadThemePacks(),
    ]);
    return this.read();
  },

  async installPlugin(pluginEntry) {
    const entry = typeof pluginEntry === "string"
      ? pluginCatalogEntries().find((item) => item.id === pluginEntry) || null
      : pluginEntry;
    const id = String(entry?.id || pluginEntry || "");
    if (!id) return this.read();
    const plugin = PLUGIN_REGISTRY[id];
    if (entry?.bundled && plugin) {
      installPlugin(id);
      await loadInstalledPlugins();
      return this.read();
    }
    if (entry?.download) {
      pluginInstalling.add(id);
      try {
        const response = await fetch("/api/plugins/install", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: entry.download, id, sha256: entry.sha256 || "" }),
        });
        const result = await response.json();
        if (!response.ok || !result?.ok) throw new Error(result?.error || "The plugin could not be installed");
        mergePluginManifests(result.plugins || (result.plugin ? [result.plugin] : []));
        const pluginStateRecord = pluginState(id);
        const wasInstalled = Boolean(pluginStateRecord?.installed);
        if (pluginStateRecord) {
          pluginStateRecord.installed = true;
          if (!wasInstalled) pluginStateRecord.enabled = true;
        }
        saveSettings();
        applyPluginState(true);
        renderPluginRail();
        AudioFX.ding();
        toast(`${entry.name || id} installed`);
      } catch (error) {
        toast(error?.message || "The plugin could not be installed", true);
        throw error;
      } finally {
        pluginInstalling.delete(id);
      }
      await loadInstalledPlugins();
      return this.read();
    }
    if (!pluginCatalog) await loadPluginCatalog(false);
    await installCommunityPlugin(id);
    await loadInstalledPlugins();
    return this.read();
  },

  async removePlugin(pluginId) {
    await confirmPluginUninstall(String(pluginId || ""));
    await loadInstalledPlugins();
    return this.read();
  },

  setPluginEnabled(pluginId, enabled) {
    window.setPluginEnabled(String(pluginId || ""), Boolean(enabled));
    return this.read();
  },

  openPlugin(pluginId) {
    const id = String(pluginId || "");
    if (!pluginEnabled(id)) {
      toast(`${PLUGIN_REGISTRY[id]?.title || id} is turned off`, true);
      return false;
    }
    closePluginPanel();
    openPluginPanel(id);
    return true;
  },

  managePlugin(pluginId) {
    pluginDetailId = String(pluginId || "");
    pluginPendingUninstallId = null;
    closePluginPanel();
    openSettings("plugins");
  },

  managePlugins() {
    pluginDetailId = null;
    pluginPendingUninstallId = null;
    closePluginPanel();
    openSettings("plugins");
  },

  async installTheme(entry) {
    const id = String(entry?.id || "");
    if (!id) return this.read();
    themePackBusy = id;
    try {
      const payload = entry.download
        ? { id, url: entry.download, sha256: entry.sha256 || "" }
        : { id, bundled: true };
      const result = await themeCommunityPost("/api/themes/install", payload);
      if (!result?.ok) throw new Error(result?.error || "Could not install that theme");
      themePacks = result.packs || themePacks;
      registerThemePacks(themePacks);
      toast(`${entry.name || id} installed`);
    } catch (error) {
      toast(error?.message || "Could not install that theme", true);
      throw error;
    } finally {
      themePackBusy = "";
      await loadThemePacks();
      applyPaneThemes();
      if (settingsTab === "theme") renderSettings();
    }
    return this.read();
  },

  async removeTheme(themeId) {
    const id = String(themeId || "");
    if (!themePacks.length) await loadThemePacks();
    await removeThemePackById(id, { skipConfirm: true });
    return this.read();
  },

  async applyTheme(themeId) {
    const id = String(themeId || "");
    if (!themePacks.length) await loadThemePacks();
    await applyThemePackById(id);
    return this.read();
  },

  openThemeSettings() {
    closePluginPanel();
    openSettings("theme");
  },

  openPluginsFolder() {
    silentAction("open_plugins_folder");
  },

  async installPluginArchive(data, filename) {
    await uploadPluginArchive(String(data || ""), String(filename || "plugin.zip"));
    await loadInstalledPlugins();
    return this.read();
  },
};

function installPlugin(pluginId) {
  const plugin = PLUGIN_REGISTRY[pluginId];
  const state = pluginState(pluginId);
  if (!plugin || !state) return;
  state.installed = true;
  state.enabled = true;
  pluginPendingUninstallId = null;
  saveSettings();
  applyPluginState(true);
  refreshPluginSurface(pluginId);
  AudioFX.ding();
  renderSettings();
  toast(`${plugin.title} installed`);
}

// Plugin settings can live in Settings → Plugins or in the Community window.
// Both sheets use their own scroll container.
function pluginSurfaceScroll() {
  return $(".settings-scroll") || $(".community-scroll");
}

function requestPluginUninstall(pluginId) {
  if (!PLUGIN_REGISTRY[pluginId]) return;
  if (!$(".settings-panel")) {
    openSettings("plugins");
  } else {
    settingsTab = "plugins";
  }
  pluginPendingUninstallId = pluginId;
  renderSettings();
  const scroll = pluginSurfaceScroll();
  if (scroll) scroll.scrollTop = 0;
}

async function confirmPluginUninstall(pluginId) {
  const plugin = PLUGIN_REGISTRY[pluginId];
  const state = pluginState(pluginId);
  if (!plugin || !state) return;
  if (plugin.source === "user") {
    try {
      const response = await fetch("/api/plugins/uninstall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pluginId }),
      });
      const result = await response.json();
      if (!response.ok || !result?.ok) throw new Error(result?.error || "Could not remove the plugin");
      delete PLUGIN_REGISTRY[pluginId];
      if (settings.plugins) delete settings.plugins[pluginId];
      if (openPluginId === pluginId) closePluginPanel();
      pluginPendingUninstallId = null;
      pluginDetailId = null;
      saveSettings();
      applyPluginState(true);
      renderPluginRail();
      renderSettings();
      AudioFX.paper();
      toast(`${plugin.title} removed`);
    } catch (error) {
      toast(error?.message || "Could not remove the plugin", true);
    }
    return;
  }
  state.installed = false;
  state.enabled = false;
  pluginPendingUninstallId = null;
  if (openPluginId === pluginId) closePluginPanel();
  saveSettings();
  applyPluginState(true);
  refreshPluginSurface(pluginId);
  AudioFX.paper();
  renderSettings();
  toast(`${plugin.title} uninstalled`);
}

function openPluginSettingsPage(pluginId) {
  if (!PLUGIN_REGISTRY[pluginId]) return;
  if (!$(".settings-panel")) {
    openSettings("plugins");
  } else {
    settingsTab = "plugins";
  }
  pluginDetailId = pluginId;
  pluginPendingUninstallId = null;
  renderSettings();
  const scroll = pluginSurfaceScroll();
  if (scroll) scroll.scrollTop = 0;
}

function openPluginFromSettings(pluginId) {
  if (!pluginEnabled(pluginId)) return;
  closeCommunity();
  closeSettings();
  openPluginPanel(pluginId);
}

function togglePluginSetting(pluginId, key) {
  const state = pluginState(pluginId);
  if (!state || typeof state.settings?.[key] !== "boolean") return;
  state.settings[key] = !state.settings[key];
  saveSettings();
  AudioFX.categoryTap();
  syncPluginSettings();
  notifyPluginSettings();
  renderSettings();
}

function setPluginChoice(pluginId, key, value) {
  const plugin = PLUGIN_REGISTRY[pluginId];
  const state = pluginState(pluginId);
  if (!plugin || !state) return;
  const item = (plugin.settings || []).find((setting) => setting.id === key && setting.type === "choice");
  const options = (item?.options || [])
    .map((option) => option.value)
    .filter((option) => typeof option === "string");
  if (!item || !options.includes(value) || state.settings[key] === value) return;
  state.settings[key] = value;
  saveSettings();
  AudioFX.categoryTap();
  syncPluginSettings();
  window.dispatchEvent(new CustomEvent("neotodo-plugin-setting-change", {
    detail: { plugin: pluginId, key, value },
  }));
  notifyPluginSettings();
  renderSettings();
}

function openPluginMenu(button, pluginId) {
  const plugin = PLUGIN_REGISTRY[pluginId];
  if (!plugin) return;
  const rect = button.getBoundingClientRect();
  const off = !pluginEnabled(pluginId);
  const gearIcon = `<svg aria-hidden="true"><use href="#gear"></use></svg>`;
  const playIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6.4v11.2L18 12 9 6.4Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  openContextMenu(rect.right - 4, rect.bottom + 6, [
    { label: "Plugin settings", icon: gearIcon, run: () => openPluginSettingsPage(pluginId) },
    { label: "Open plugin", icon: playIcon, disabled: off, run: () => openPluginFromSettings(pluginId) },
    "-",
    { label: "Uninstall", icon: TRASH_ICON, danger: true, run: () => requestPluginUninstall(pluginId) },
  ]);
}

function pluginVersionNewer(candidate, current) {
  const parse = (value) => String(value || "0").split(/[._-]/).map((part) => parseInt(part, 10) || 0);
  const left = parse(candidate);
  const right = parse(current);
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const a = left[index] || 0;
    const b = right[index] || 0;
    if (a !== b) return a > b;
  }
  return false;
}

function pluginCommunityIcon(entry) {
  const plugin = PLUGIN_REGISTRY[entry.id];
  const icon = String(entry.icon || "");
  let source = plugin?.icon || "";
  if (!source && /^https?:\/\//i.test(icon)) source = icon;
  if (!source && entry.bundled && icon) source = pluginAssetUrl(entry.id, icon);
  const fallback = `<svg class="community-card-glyph community-card-fallback" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6v5a3 3 0 0 0 3 3h3v6h-5a3 3 0 0 0-3 3v1H7v-4a3 3 0 0 0-3-3H3V9h5a3 3 0 0 0 3-3V3Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
  if (!source) return fallback;
  return `${fallback}<img src="${esc(source)}" alt="" loading="lazy" onerror="this.remove()">`;
}

function pluginCategoryOptions(entries) {
  const seen = new Set();
  const options = [];
  for (const entry of entries) {
    const label = pluginCategoryLabel(entry.category);
    if (seen.has(label.toLowerCase())) continue;
    seen.add(label.toLowerCase());
    options.push(label);
  }
  return options;
}

// A community entry counts as a game when its category says so, or when its
// author tags it as one. "Play" alone is not enough — the music player and the
// starter template also live there, and they belong on the plugins shelf.
const GAME_ENTRY_IDS = new Set(["pindou", "tetris", "piano"]);
const GAME_ENTRY_TAGS = new Set(["game", "games", "play", "arcade", "puzzle"]);

function pluginEntryIsGame(entry) {
  if (!entry) return false;
  const id = String(entry.id || "").toLowerCase();
  const category = pluginCategoryLabel(entry.category).toLowerCase();
  if (category === "game" || category === "games") return true;
  if (GAME_ENTRY_IDS.has(id)) return true;
  const tags = (Array.isArray(entry.tags) ? entry.tags : []).map((tag) => String(tag).toLowerCase());
  return tags.some((tag) => GAME_ENTRY_TAGS.has(tag));
}

function pluginShelfScope() {
  return communitySection === "games" ? "games" : "plugins";
}

/** Catalog entries for the Community shelf that is on screen. */
function pluginSectionEntries(scope = pluginShelfScope()) {
  const wantGames = scope === "games";
  return pluginCatalogEntries().filter((entry) => pluginEntryIsGame(entry) === wantGames);
}

function pluginCatalogEntries() {
  const entries = Array.isArray(pluginCatalog?.plugins) ? pluginCatalog.plugins : [];
  if (entries.length) return entries;
  return Object.values(PLUGIN_REGISTRY).map((plugin) => ({
    id: plugin.id,
    name: plugin.title,
    englishName: plugin.englishTitle,
    version: plugin.version,
    description: plugin.description,
    author: plugin.author,
    category: plugin.category,
    icon: plugin.icon,
    tags: plugin.tags || [],
    bundled: plugin.source !== "user",
    official: plugin.author === "NeoTodo",
  }));
}

function pluginCommunityVisibleEntries() {
  const query = pluginCommunityQuery.trim().toLowerCase();
  return pluginSectionEntries().filter((entry) => {
    const category = pluginCategoryLabel(entry.category).toLowerCase();
    if (pluginCommunityFilter === "featured" && !entry.featured) return false;
    if (pluginCommunityFilter !== "all" && pluginCommunityFilter !== "featured" && category !== pluginCommunityFilter) return false;
    if (!query) return true;
    const haystack = [
      entry.name,
      entry.englishName,
      entry.author,
      entry.description,
      ...(Array.isArray(entry.tags) ? entry.tags : []),
    ].join(" ").toLowerCase();
    return haystack.includes(query);
  });
}

function pluginCommunityCard(entry) {
  const plugin = PLUGIN_REGISTRY[entry.id];
  const state = plugin ? pluginState(entry.id) : null;
  const installed = Boolean(state?.installed);
  const enabled = Boolean(state?.enabled);
  const installing = pluginInstalling.has(entry.id);
  const update = Boolean(installed && plugin && entry.version && pluginVersionNewer(entry.version, plugin.version));
  const canInstall = Boolean(plugin || entry.download);
  const official = entry.official || entry.author === "NeoTodo";
  const tags = (Array.isArray(entry.tags) ? entry.tags : []).slice(0, 4);
  let actions = "";
  if (installing) {
    actions = `<button class="btn small community-install" type="button" disabled>Installing…</button>`;
  } else if (installed) {
    actions = `<span class="community-installed-badge">${enabled ? "Installed" : "Turned off"}</span>`;
    if (enabled) actions += `<button class="btn small" type="button" data-action="open-community-plugin" data-plugin-id="${esc(entry.id)}">Open</button>`;
    if (update) actions += `<button class="btn small community-install" type="button" data-action="install-community-plugin" data-plugin-id="${esc(entry.id)}">Update</button>`;
    actions += `<button class="btn small ghost" type="button" data-action="open-plugin-details" data-plugin-id="${esc(entry.id)}">Manage</button>`;
  } else if (entry.bundled && !plugin) {
    actions = `<span class="community-installed-badge built-in">Built in</span>`;
  } else if (canInstall) {
    actions = `<button class="btn small community-install" type="button" data-action="install-community-plugin" data-plugin-id="${esc(entry.id)}">Install</button>`;
  } else {
    actions = `<span class="community-installed-badge">Coming soon</span>`;
  }
  return `<article class="community-plugin-card" data-community-plugin="${esc(entry.id)}">
    <div class="community-card-top">
      <span class="plugin-icon community-card-icon">${pluginCommunityIcon(entry)}</span>
      <div class="community-card-title">
        <strong>${esc(entry.name || entry.id)}</strong>
        <small>${esc(entry.englishName || entry.id)} · v${esc(entry.version || "1.0.0")}</small>
      </div>
      <span class="community-origin ${official ? "official" : ""}">${official ? "Official" : "Community"}</span>
    </div>
    <p class="community-card-description">${esc(entry.description || "")}</p>
    <div class="community-card-meta">
      <span>by ${esc(entry.author || "Community")}</span>
      <span>${esc(pluginCategoryLabel(entry.category))}</span>
      ${entry.bundled ? "<span>Built in</span>" : ""}
      ${entry.license ? `<span>${esc(entry.license)}</span>` : ""}
    </div>
    ${tags.length ? `<div class="community-tags">${tags.map((tag) => `<span>${esc(tag)}</span>`).join("")}</div>` : ""}
    <div class="community-card-actions">
      ${actions}
      ${entry.homepage ? `<a class="community-card-link" href="${esc(entry.homepage)}" data-external-link="${esc(entry.homepage)}">Homepage</a>` : ""}
    </div>
  </article>`;
}

function pluginCommunityResultsMarkup() {
  const entries = pluginCommunityVisibleEntries();
  if (!entries.length) {
    const shelf = pluginShelfScope() === "games" ? "games" : "plugins";
    return `<div class="plugin-empty community-empty">No ${shelf} match this search yet. Try another word, or add the first one.</div>`;
  }
  return `<div class="community-plugin-grid">${entries.map(pluginCommunityCard).join("")}</div>`;
}

function updatePluginCommunityResults() {
  const results = $("#plugin-community-results");
  if (!results) return;
  results.innerHTML = pluginCommunityResultsMarkup();
  const count = $("#plugin-community-count");
  if (count) count.textContent = String(pluginCommunityVisibleEntries().length);
  document.querySelectorAll("[data-plugin-filter]").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.pluginFilter === pluginCommunityFilter);
  });
}

async function loadPluginCatalog(force = false) {
  if (pluginCatalogLoading) return;
  pluginCatalogLoading = true;
  pluginCatalogError = "";
  refreshCommunity();
  try {
    const response = await fetch(`/api/plugins/community${force ? "?refresh=1" : ""}`, { cache: "no-store" });
    const result = await response.json();
    if (!response.ok || !result?.ok) throw new Error(result?.error || "Could not load the community catalog");
    pluginCatalog = result;
    pluginCatalogError = result.catalog_error || "";
  } catch (error) {
    pluginCatalogError = error?.message || "Could not load the community catalog";
    if (!pluginCatalog) pluginCatalog = { plugins: [] };
  } finally {
    pluginCatalogLoading = false;
    refreshCommunity();
  }
}

function ensurePluginCatalog() {
  if (!pluginCatalog && !pluginCatalogLoading) loadPluginCatalog(false);
}

async function installCommunityPlugin(pluginId) {
  const entry = pluginCatalogEntries().find((item) => item.id === pluginId);
  const plugin = PLUGIN_REGISTRY[pluginId];
  const wasInstalled = Boolean(plugin && pluginState(pluginId)?.installed);
  if (!entry) return;
  if (!entry.download || (entry.bundled && plugin)) {
    installPlugin(pluginId);
    return;
  }
  if (entry.bundled && !plugin) {
    toast("This plugin ships inside NeoTodo", true);
    return;
  }
  pluginInstalling.add(pluginId);
  updatePluginCommunityResults();
  if (openPluginId === pluginId) closePluginPanel();
  try {
    const response = await fetch("/api/plugins/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: entry.download, id: pluginId, sha256: entry.sha256 || "" }),
    });
    const result = await response.json();
    if (!response.ok || !result?.ok) throw new Error(result?.error || "The plugin could not be installed");
    mergePluginManifests(result.plugins || (result.plugin ? [result.plugin] : []));
    const state = pluginState(pluginId);
    if (state) {
      state.installed = true;
      if (!wasInstalled) state.enabled = true;
    }
    saveSettings();
    applyPluginState(true);
    renderPluginRail();
    refreshPluginSurface(pluginId);
    AudioFX.ding();
    toast(`${entry.name || pluginId} ${plugin ? "updated" : "installed"}`);
  } catch (error) {
    toast(error?.message || "The plugin could not be installed", true);
  } finally {
    pluginInstalling.delete(pluginId);
    refreshCommunity();
  }
}

async function uploadPluginArchive(data, filename) {
  pluginInstalling.add("__upload__");
  updatePluginCommunityResults();
  if (openPluginId) closePluginPanel();
  try {
    const response = await fetch("/api/plugins/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, data }),
    });
    const result = await response.json();
    if (!response.ok || !result?.ok) throw new Error(result?.error || "The plugin could not be installed");
    mergePluginManifests(result.plugins || (result.plugin ? [result.plugin] : []));
    const pluginId = result.plugin?.id;
    const state = pluginId ? pluginState(pluginId) : null;
    if (state) {
      state.installed = true;
      state.enabled = true;
    }
    saveSettings();
    applyPluginState(true);
    renderPluginRail();
    AudioFX.ding();
    toast(`${result.plugin?.name || filename} installed`);
    refreshCommunity();
  } catch (error) {
    toast(error?.message || "The plugin could not be installed", true);
  } finally {
    pluginInstalling.delete("__upload__");
  }
}

function choosePluginArchive() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".zip,application/zip,application/x-zip-compressed";
  input.style.display = "none";
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    input.remove();
    if (!file) return;
    if (file.size > 24_000_000) {
      toast("Plugin archives must be smaller than 24 MB", true);
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => toast("Could not read that file", true);
    reader.onload = () => {
      const raw = String(reader.result || "");
      const data = raw.includes(",") ? raw.slice(raw.indexOf(",") + 1) : "";
      if (!data) {
        toast("Could not read that file", true);
        return;
      }
      uploadPluginArchive(data, file.name);
    };
    reader.readAsDataURL(file);
  });
  document.body.appendChild(input);
  input.click();
}

async function restoreTrashSubtask(id, row) {
  if (!id || restoringTrashId) return;
  restoringTrashId = id;
  row?.classList.add("restoring");
  const fan = row?.querySelector(".trash-fan");
  if (fan) {
    fan.classList.add("spinning");
    setTimeout(() => fan.classList.remove("spinning"), 560);
  }
  AudioFX.categoryTap();
  // Let the row collapse and the rows below slide up before the rerender.
  setTimeout(async () => {
    const result = await action("restore_subtask", { id });
    restoringTrashId = null;
    if (result?.ok) {
      renderTrashDrawer();
      AudioFX.itemGet();
      toast("Subtask restored");
    } else {
      row?.classList.remove("restoring");
      toast(result?.error || "Could not restore subtask", true);
    }
  }, 260);
}

async function clearTrash() {
  const count = Array.isArray(state.data?.trash) ? state.data.trash.length : 0;
  if (!count) {
    toast("The magic hat is empty");
    return;
  }
  const result = await action("clear_trash");
  if (result?.ok) {
    renderTrashDrawer();
    AudioFX.exhale();
    toast("Deleted subtasks cleared");
  }
}

function openCompletedLog() {
  completedOpen = true;
  document.body.dataset.achievementSheet = "completed";
  completedSearch = "";
  completedExpanded = new Set();
  $("#modal-root").innerHTML = `<div class="completed-stage">
    <div class="completed-sheet">
      <div class="completed-bar">
        <label class="search-field">
          <svg class="search-field-icon" aria-hidden="true"><use href="#search-icon"></use></svg>
          <input id="completed-search" class="log-search" type="search" autocomplete="off">
        </label>
        <button class="plain-x" data-action="close-completed">×</button>
      </div>
      <div id="completed-log-list"></div>
    </div>
  </div>`;
  $(".completed-stage")?.addEventListener("mousedown", (event) => {
    if (event.target === event.currentTarget) closeCompletedLog();
  });
  const input = $("#completed-search");
  input.addEventListener("input", () => {
    completedSearch = input.value;
    renderCompletedLogContent();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeCompletedLog();
    }
  });
  renderCompletedLogContent();
  setTimeout(() => input.focus(), 30);
}

function focusLogRows(query = "") {
  const log = (Array.isArray(settings.focus_log) ? [...settings.focus_log] : []).sort((a, b) => String(b.completed_at || "").localeCompare(String(a.completed_at || "")));
  const q = query.trim().toLowerCase();
  const rows = log.map((entry) => {
    const when = entry.completed_at ? new Date(entry.completed_at) : null;
    const valid = when && !Number.isNaN(when.getTime());
    const dateText = valid
      ? `${fmtNumeric(when.toISOString().slice(0, 10))} ${String(when.getHours()).padStart(2, "0")}:${String(when.getMinutes()).padStart(2, "0")}`
      : "";
    return { name: entry.name || "Focus session", dateText };
  }).filter((item) => !q || item.name.toLowerCase().includes(q) || item.dateText.toLowerCase().includes(q));
  return rows.length
    ? rows.map((item) => `<div class="focus-line">
        <span class="focus-tomato"><svg aria-hidden="true"><use href="#tomato-detail"></use></svg></span>
        <span class="focus-name-text">${esc(item.name)}</span>
        <span class="focus-date">${esc(item.dateText)}</span>
      </div>`).join("")
    : `<div class="focus-empty">${q ? "No matching focus tasks." : "No focus sessions yet."}</div>`;
}

function renderFocusAchievementsContent() {
  const list = $("#focus-list");
  if (list) list.innerHTML = focusLogRows(focusSearch);
}

function openFocusAchievements() {
  completedOpen = true;
  document.body.dataset.achievementSheet = "focus";
  focusSearch = "";
  $("#modal-root").innerHTML = `<div class="completed-stage">
    <div class="completed-sheet focus-sheet">
      <div class="completed-bar">
        <div class="search-field focus-search">
          <svg class="search-field-icon" aria-hidden="true"><use href="#search-icon"></use></svg>
          <input id="focus-search" type="search" placeholder="Search focus tasks…" autocomplete="off">
        </div>
        <button class="plain-x" data-action="close-completed">×</button>
      </div>
      <div id="focus-list" class="focus-list">${focusLogRows("")}</div>
    </div>
  </div>`;
  $(".completed-stage")?.addEventListener("mousedown", (event) => {
    if (event.target === event.currentTarget) closeCompletedLog();
  });
  const input = $("#focus-search");
  if (input) {
    input.addEventListener("input", () => {
      focusSearch = input.value;
      renderFocusAchievementsContent();
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCompletedLog();
      }
    });
    setTimeout(() => input.focus(), 30);
  }
  afterNextPaint(() => AudioFX.paper());
}

function renderCompletedLogContent() {
  const list = $("#completed-log-list");
  if (!list) return;
  const current = [];
  for (const category of visibleCategories()) {
    for (const todo of category.todos) {
      if (!todo.done) continue;
      current.push({
        key: `c:${category.id}:${todo.id}`,
        name: todo.name,
        category: category.name,
        color: category.color,
        date: todo.completed_at,
        completed_at: todo.completed_at,
        created_at: todo.created_at,
        time_cost: todo.time_cost,
        subtasks: todo.subtasks || [],
      });
    }
  }
  const archived = [];
  for (const card of state.data.archive || []) {
    if (card.sample) continue;
    (card.items || []).forEach((item, index) => {
      archived.push({
        key: `a:${card.id}:${index}`,
        name: item.name,
        category: item.category,
        color: item.color,
        date: item.completed_at,
        completed_at: item.completed_at,
        created_at: item.created_at,
        time_cost: item.time_cost,
        week: card.week,
        subtasks: item.subtasks || [],
      });
    });
  }
  const all = [...current, ...archived].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  const query = completedSearch.trim().toLowerCase();
  const matches = (item) => {
    if (!query) return true;
    if (String(item.name || "").toLowerCase().includes(query)) return true;
    if (String(item.category || "").toLowerCase().includes(query)) return true;
    return (item.subtasks || []).some((subtask) => String(subtask.name || "").toLowerCase().includes(query));
  };
  const filtered = all.filter(matches);

  const row = (item) => {
    const subtasks = item.subtasks || [];
    const expanded = completedExpanded.has(item.key);
    const rows = subtasks.length
      ? `<div class="log-subs">${subtasks.map((subtask) => `<div class="log-subtask">
          <span class="log-sub-name">${esc(subtask.name)}</span>
        </div>`).join("")}</div>`
      : "";
    const trophy = subtasks.length
      ? `<button class="log-trophy log-trophy-action" data-log-expand="${esc(item.key)}" aria-label="${expanded ? "Hide subtasks" : "Show subtasks"}">${GOLD_MOON}</button>`
      : `<span class="log-trophy">${completedIcon()}</span>`;
    return `<div class="log-line">
      ${trophy}
      <span class="log-category" style="--cat:${esc(item.color || "var(--gold-soft)")};--cat-bg:${colorTint(item.color || "#c69a46")}">${esc(item.category || "")}</span>
      <span class="log-name">${esc(item.name)}</span>
      ${settings.show_time_cost ? `<span class="log-time">${esc(timeCostText(item))}</span>` : ""}
      <span class="log-date">${item.date ? fmtNumeric(item.date.slice(0, 10)) : ""}${item.week ? " · W" + String(item.week).padStart(2, "0") : ""}</span>
    </div>${expanded ? rows : ""}`;
  };

  list.innerHTML = filtered.length
    ? filtered.map(row).join("")
    : query
      ? `<div class="log-empty">No matching completed todos.</div>`
      : "";
}

function closeCompletedLog() {
  completedOpen = false;
  delete document.body.dataset.achievementSheet;
  completedSearch = "";
  focusSearch = "";
  completedExpanded = new Set();
  $("#modal-root").innerHTML = "";
}

function closeContextMenu() {
  document.querySelectorAll(".context-menu").forEach((node) => node.remove());
  contextMenuOpen = false;
}

const NEW_WINDOW_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8.5" y="3.5" width="12" height="12" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="3.5" y="8.5" width="12" height="12" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
const TRASH_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const BACK_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5L4 11l6 6M4 11h10a6 6 0 0 1 6 6v1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
// The pixel flame mark for a fork, used straight from the user's 像素-火苗
// SVG: solid blocks only, never a background plate or texture behind it.
const FORK_ICON = `<img class="fork-flame" src="/fork-flame.svg" alt="">`;

function openContextMenu(x, y, items, theme = "") {
  closeContextMenu();
  const menu = document.createElement("div");
  menu.className = `context-menu${theme ? ` context-${theme}` : ""}`;
  // A menu with one icon keeps an empty icon column on every row, so labels
  // line up instead of jumping left for Copy / Cut / Paste.
  const iconMenu = items.some((item) => item && typeof item === "object" && item.icon);
  for (const item of items) {
    if (item === "-") {
      const sep = document.createElement("div");
      sep.className = "context-sep";
      menu.appendChild(sep);
      continue;
    }
    if (item.title) {
      const title = document.createElement("div");
      title.className = "context-title";
      title.textContent = item.title;
      menu.appendChild(title);
      continue;
    }
    const button = document.createElement("button");
    if (iconMenu) {
      // The label is its own flex row so the icon and the text share one
      // horizontal centre line: the flame never sits a pixel under the word.
      button.className = "context-item context-item-icon";
      button.innerHTML = `<span class="context-icon${item.icon ? "" : " context-icon-empty"}" aria-hidden="true">${item.icon || ""}</span><span class="context-label">${esc(item.label)}</span>`;
    } else {
      button.className = "context-item";
      button.textContent = item.label;
    }
    button.disabled = Boolean(item.disabled);
    if (item.danger) button.classList.add("context-danger");
    // Keep the focused editor alive while the menu is open. Without this the
    // button steals focus on mousedown and a rename input commits (and closes)
    // before the chosen clipboard action can touch its text.
    button.addEventListener("mousedown", (mouseEvent) => mouseEvent.preventDefault());
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      closeContextMenu();
      item.run?.();
    });
    menu.appendChild(button);
  }
  document.body.appendChild(menu);
  const rect = menu.getBoundingClientRect();
  menu.style.left = `${Math.max(8, Math.min(x, window.innerWidth - rect.width - 8))}px`;
  menu.style.top = `${Math.max(8, Math.min(y, window.innerHeight - rect.height - 8))}px`;
  contextMenuOpen = true;
}

function inPlainBrowser() {
  // The desktop shells answer the neotodo.local bridge; a plain browser does
  // not, so the fork falls back to a normal tab there.
  if (window.NeoTodoAndroid) return false;
  const agent = navigator.userAgent || "";
  if (/QtWebEngine|Electron|WebKitGTK/i.test(agent)) return false;
  return /Firefox\/|Chrome\/|Edg\/|OPR\//i.test(agent);
}

function openNeoTodoWindow(url) {
  if (!url) return false;
  if (window.NeoTodoAndroid) {
    try {
      window.NeoTodoAndroid.open(url);
      return true;
    } catch (error) {}
  }
  if (inPlainBrowser()) {
    const opened = window.open(url, "_blank");
    if (!opened) location.href = url;
    return true;
  }
  // The Qt shell (Windows) has no bridge for /open yet, but it does implement
  // WebEngine's createWindow, so a popup creates the new NeoTodo there.
  if (/QtWebEngine/i.test(navigator.userAgent || "")) {
    window.open(url, "_blank");
    return true;
  }
  // Use the shell bridge so the desktop builds create a real window instead
  // of letting WebKit construct one during a pointer gesture.
  windowBridge("open", { url });
  return true;
}

async function forkSubtask(todo, subtask) {
  if (!todo?.id || !subtask?.id) return;
  if (!pluginEnabled("forktree")) {
    toast("Turn on the Forktree plugin to fork", true);
    return;
  }
  // Fork immediately: no confirmation dialog. The backend starts a child
  // app process and its own window; the row gets a flame link below.
  const category = (state.data?.categories || []).find(
    (item) => (item.todos || []).some((entry) => entry.id === todo.id)
  ) || null;
  let result = null;
  try {
    const response = await fetch("/api/fork-app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todo_id: todo.id, subtask_id: subtask.id }),
    });
    result = await response.json();
  } catch (error) {
    toast("Could not open the fork window", true);
    return;
  }
  if (!result?.ok || !result.url) {
    toast(result?.error || "Could not open the fork window", true);
    return;
  }
  // The fork window is its own NeoTodo instance. The plugin map still keeps a
  // small branch record so the tree can show and reopen it.
  const store = window.NeoTodoFork;
  if (store?.create) {
    store.create({
      name: subtask.name,
      note: subtask.note || "",
      url: result.url,
      port: result.port,
      forkId: result.fork_id,
      forkTodoId: result.todo_id,
      source: {
        categoryId: category?.id || "",
        categoryName: category?.name || "",
        todoId: todo.id,
        todoName: todo.name || "",
        subtaskId: subtask.id,
        subtaskName: subtask.name || "",
      },
    });
  }
  // Re-render the row so the flame link appears immediately.
  render();
  toast(`Forked “${subtask.name}”`);
  // On the desktop the backend starts a child process that owns its own
  // window. The fork closes together with the notebook (and its agents), so
  // it is a branch of this app rather than an unrelated test process. Only
  // the fallback platforms open the URL from this process.
  if (!result.window_opened) openNeoTodoWindow(result.url);
}

// The latest fork branch that came from this exact subtask. The row link uses
// it to jump straight back into the forked app window.
function forkedSubtaskBranch(todoId, subtaskId) {
  const store = window.NeoTodoFork;
  const branches = store?.list?.() || [];
  const todoKey = String(todoId || "");
  const subtaskKey = String(subtaskId || "");
  if (!todoKey || !subtaskKey) return null;
  return branches
    .filter((branch) => (
      String(branch?.source?.todoId || "") === todoKey
      && String(branch?.source?.subtaskId || "") === subtaskKey
    ))
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))[0] || null;
}

// A fork recorded by the plugin opens its own port window. Branches imported
// from the first build have no port yet; the backend materializes one from the
// stored name/note/subtasks on first open.
async function openForkBranch(branchId) {
  if (!branchId) return;
  if (!pluginEnabled("forktree")) {
    toast("Turn on the Forktree plugin to fork", true);
    return;
  }
  const store = window.NeoTodoFork;
  const branch = store?.get?.(String(branchId));
  if (!branch) {
    openForkWorkspace(branchId);
    return;
  }
  // A saved fork is a data file on the backend. Ask the backend for a live
  // port first; this also respawns it after a NeoTodo restart.
  if (branch.forkId) {
    try {
      const response = await fetch("/api/fork-app/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fork_id: branch.forkId }),
      });
      const result = await response.json();
      if (result?.ok && result.url) {
        store.update(branch.id, { url: result.url, port: result.port });
        if (openPluginId) closePluginPanel();
        if (!result.window_opened) openNeoTodoWindow(result.url);
        return;
      }
    } catch (error) {}
  }
  if (branch.url) {
    if (openPluginId) closePluginPanel();
    openNeoTodoWindow(branch.url);
    return;
  }
  if (!store?.update) {
    openForkWorkspace(branchId);
    return;
  }
  try {
    const response = await fetch("/api/fork-app/branch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branch }),
    });
    const result = await response.json();
    if (!result?.ok || !result.url) {
      toast(result?.error || "Could not open the fork window", true);
      return;
    }
    store.update(branch.id, {
      url: result.url,
      port: result.port,
      forkId: result.fork_id,
      forkTodoId: result.todo_id,
    });
    if (openPluginId) closePluginPanel();
    if (!result.window_opened) openNeoTodoWindow(result.url);
  } catch (error) {
    toast("Could not open the fork window", true);
  }
}

// Open the plugin workspace for a legacy in-panel branch. New forks use
// openForkBranch and a real window on their own port.
function openForkWorkspace(branchId) {
  if (!branchId) return;
  if (!pluginEnabled("forktree")) {
    toast("Turn on the Forktree plugin to fork", true);
    return;
  }
  if (openPluginId) closePluginPanel();
  const params = new URLSearchParams({
    fork: String(branchId),
    standalone: "1",
  });
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  if (root.dataset.postcardDark === "true") params.set("dark", "1");
  for (const [key, css] of [
    ["paper", "--pc-paper"],
    ["paper2", "--pc-paper2"],
    ["ink", "--pc-ink"],
    ["muted", "--pc-muted"],
    ["border", "--pc-border"],
    ["line", "--pc-line"],
    ["accent", "--pc-accent"],
  ]) {
    const value = styles.getPropertyValue(css).trim();
    if (value) params.set(key, value);
  }
  const url = `${location.origin}/plugins/forktree/index.html?${params.toString()}`;
  openNeoTodoWindow(url);
}

function focusFirstNoteBlock() {
  setTimeout(() => {
    const block = document.querySelector("[data-note-block]");
    if (block) activateNoteBlock(Number(block.dataset.noteBlock));
  }, 40);
}

function editCurrentNote() {
  saveActiveNoteCaret();
  if (notesHidden) showNotesPanel();
  flushNoteSave();
  selectedHistoryId = null;
  selectedSubtaskId = null;
  notesPreview = false;
  updateHistorySelection();
  updateSubtaskSelection();
  renderNotesPanel();
  requestAnimationFrame(() => focusActiveNoteEditor(true));
}

function selectHistorySubtaskNote(todoId, subtaskId) {
  if (notesHidden) showNotesPanel();
  flushNoteSave();
  selectedHistoryId = todoId;
  selectedSubtaskId = subtaskId;
  notesPreview = false;
  clearUnseenAgentSubtask(subtaskId);
  updateHistorySelection();
  updateSubtaskSelection();
  renderNotesPanel();
}

function selectSubtaskNote(todoId, subtaskId) {
  if (notesHidden) showNotesPanel();
  flushNoteSave();
  selectedSubtaskId = subtaskId;
  selectedHistoryId = null;
  notesPreview = false;
  clearUnseenAgentSubtask(subtaskId);
  updateHistorySelection();
  updateSubtaskSelection();
  renderNotesPanel();
}

async function copyPlainText(text) {
  const value = String(text || "");
  if (!value) return false;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (error) {}
  }
  try {
    const helper = document.createElement("textarea");
    helper.value = value;
    helper.style.cssText = "position:fixed;left:-9999px;top:0";
    document.body.appendChild(helper);
    helper.select();
    const ok = document.execCommand("copy");
    helper.remove();
    return Boolean(ok);
  } catch (error) {
    return false;
  }
}

// The one subtask menu: Fork on top, then Cut. Whether the right-click lands
// on the row body or inside its rename input, the menu looks the same; only the
// target of Cut follows the pointer (text selection while renaming, the whole
// subtask otherwise). Copy and Paste stay out of this menu on purpose.
function subtaskSelectedText(editable) {
  if (!editable) return "";
  try {
    const start = editable.selectionStart ?? 0;
    const end = editable.selectionEnd ?? start;
    return end > start ? String(editable.value ?? "").slice(start, end) : "";
  } catch (error) {
    return "";
  }
}

function replaceEditableSelection(editable, text) {
  if (!editable) return;
  editable.focus();
  const start = editable.selectionStart ?? editable.value.length;
  const end = editable.selectionEnd ?? start;
  if (typeof editable.setRangeText === "function") {
    editable.setRangeText(text, start, end, "end");
  } else {
    editable.value = `${editable.value.slice(0, start)}${text}${editable.value.slice(end)}`;
  }
  editable.dispatchEvent(new Event("input", { bubbles: true }));
}

function showCurrentSubtaskMenu(x, y, subtaskId, editable = null) {
  const category = selectedCategory();
  const current = category?.todos.find((todo) => !todo.done);
  const subtask = current?.subtasks?.find((item) => item.id === subtaskId);
  if (!current || !subtask) return;
  const input = editable?.isConnected ? editable : null;
  const row = input?.closest(".current-subtask[data-subtask-id]")
    || document.querySelector(`.current-subtask[data-subtask-id="${CSS.escape(subtaskId)}"]`);
  const selection = subtaskSelectedText(input);

  const cut = async () => {
    if (input) {
      if (!selection) return;
      if (!(await copyToClipboard(selection))) return;
      replaceEditableSelection(input, "");
      return;
    }
    if (subtask.done || !row) return;
    if (!(await copyToClipboard(subtask.name))) return;
    deleteSubtaskRows([row]);
  };

  openContextMenu(x, y, [
    // The fork window is a Forktree feature; without the installed plugin the
    // action does not appear at all.
    ...(pluginEnabled("forktree")
      ? [{ label: "Fork", icon: FORK_ICON, run: () => forkSubtask(current, subtask) }]
      : []),
    { label: "Cut", disabled: input ? !selection : subtask.done, run: cut },
  ]);
}

function showHistoryMenu(x, y, index) {
  const todo = doneTodos(selectedCategory())[Number(index)];
  if (!todo) return;
  openContextMenu(x, y, [
    { label: "Copy name", run: async () => { await copyPlainText(todo.name); } },
    { label: "Edit note", run: () => editHistoryNote(todo.id) },
    { label: "Completed · name locked", disabled: true },
  ]);
}

function showHistorySubtaskMenu(x, y, todoId, subtaskId) {
  const todo = doneTodos(selectedCategory()).find((item) => item.id === todoId);
  const subtask = (todo?.subtasks || []).find((item) => item.id === subtaskId);
  if (!subtask) return;
  openContextMenu(x, y, [
    ...(pluginEnabled("forktree")
      ? [{ label: "Fork", icon: FORK_ICON, run: () => forkSubtask(todo, subtask) }]
      : []),
    { label: "Copy name", run: async () => { await copyPlainText(subtask.name); } },
    { label: "Edit note", run: () => selectHistorySubtaskNote(todoId, subtaskId) },
  ]);
}

function editHistoryNote(todoId) {
  if (notesHidden) showNotesPanel();
  const done = doneTodos(selectedCategory());
  const index = done.findIndex((todo) => todo.id === todoId);
  if (index < 0) return;
  flushNoteSave();
  selectedHistoryId = todoId;
  selectedSubtaskId = null;
  notesPreview = false;
  historyCursor = index;
  updateHistoryCursor();
  updateHistorySelection();
  renderNotesPanel();
}

function showCategoryMenu(x, y, id) {
  const category = state.data.categories.find((item) => item.id === id);
  if (!category) return;
  saveActiveNoteCaret();
  flushNoteSave();
  state.selectedCategoryId = id;
  lastCategoryId = null;
  historyCursor = -1;
  historyScrollTop = 0;
  selectedHistoryId = null;
  selectedSubtaskId = null;
  notesPreview = false;
  render();
  closeArchive();
  // A category that still holds todos can never be deleted, so don't offer the
  // option at all — a disabled "Delete category" row just looks broken.
  const items = [
    { label: "Rename category", run: () => handleAction("rename-category", { dataset: { id: category.id } }) },
  ];
  if (!category.todos.length) {
    items.push({
      label: "Delete category",
      danger: true,
      run: () => handleAction("delete-category", { dataset: { id: category.id } }),
    });
  }
  openContextMenu(x, y, items);
}

function toastStack() {
  let stack = $(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }
  return stack;
}

// Completing a whole todo is the big reward: confetti, then the headphone.
function finishedToast() {
  const node = document.createElement("div");
  node.className = "toast finished-toast todo-finished-toast";
  node.innerHTML = `<span class="finished-word">Complete!</span>`
    + `<img class="toast-confetti" src="/confetti.svg" alt="">`
    + `<img class="toast-confetti" src="/confetti.svg" alt="">`
    + `<span class="finished-earned">You earned a</span>`
    + `<svg class="toast-headphone" viewBox="0 0 1024 1024" aria-hidden="true"><use href="#headphone"></use></svg>`;
  toastStack().appendChild(node);
  setTimeout(() => {
    node.style.opacity = "0";
    node.style.transform = "translateY(-6px)";
    node.style.transition = ".25s ease";
    setTimeout(() => node.remove(), 280);
  }, 3000);
}

/** Find the live todo that owns a subtask, wherever the board is scrolled. */
function liveSubtaskOwner(subtaskId) {
  if (!subtaskId) return null;
  for (const category of visibleCategories()) {
    for (const todo of category.todos || []) {
      if (todo.done) continue;
      const subtask = (todo.subtasks || []).find((item) => item.id === subtaskId);
      if (subtask) return { todo, subtask };
    }
  }
  return null;
}

/** Put a finished subtask back on the board.
 *
 * The fan in the finished card and an AI run that keeps working on the same
 * subtask both reopen it: the row leaves the finished lane, returns to the top
 * of the pending lane, and can be finished again later.
 */
async function reopenFinishedSubtask(todoId, subtaskId) {
  if (!subtaskId || reopeningSubtaskIds.has(subtaskId)) return false;
  const owner = liveSubtaskOwner(subtaskId);
  const todo = owner?.todo || selectedCategory()?.todos?.find((item) => item.id === todoId);
  const subtask = owner?.subtask || todo?.subtasks?.find((item) => item.id === subtaskId);
  if (!todo || todo.done || !subtask?.done) return false;
  const actualTodoId = todo.id;
  // The reopened row leads the pending lane. Tuck the finished card away and
  // reveal it there instead of leaving it hidden under the card.
  revealNewSubtask = true;
  completedSubtasksOpen = false;
  justCompletedSubtaskId = null;
  reopeningSubtaskIds.add(subtaskId);
  let result = null;
  try {
    result = await action("reopen_subtask", {
      todo_id: actualTodoId,
      subtask_id: subtaskId,
    });
  } finally {
    reopeningSubtaskIds.delete(subtaskId);
  }
  if (!result?.ok) {
    revealNewSubtask = false;
    return false;
  }
  AudioFX.itemGet();
  return true;
}

function startTrophyCelebration(previous) {
  trophyDisplayHold = previous;
  const count = $("#trophy-count");
  const topCount = $("#top-trophy-count");
  if (count) count.textContent = String(previous);
  if (topCount) topCount.textContent = String(previous);
  const button = document.querySelector(".head-right .trophy-button");
  if (button) {
    button.classList.remove("trophy-pulse");
    void button.offsetWidth;
    button.classList.add("trophy-pulse");
    setTimeout(() => button.classList.remove("trophy-pulse"), 1900);
  }
  AudioFX.celebrationBass();
  setTimeout(() => trophyPlus(previous), 2250);
}

function trophyPlus(previous) {
  const button = document.querySelector(".head-right .trophy-button");
  if (button) {
    const stale = button.querySelector(".trophy-float-plus");
    if (stale) stale.remove();
    const plus = document.createElement("span");
    plus.className = "trophy-float-plus";
    plus.textContent = "+1";
    button.appendChild(plus);
    setTimeout(() => plus.remove(), 1220);
  }
  setTimeout(() => {
    const value = state.data?.trophy_count ?? (previous + 1);
    trophyDisplayHold = null;
    const count = $("#trophy-count");
    if (count) {
      count.textContent = String(value);
      count.classList.remove("bump");
      void count.offsetWidth;
      count.classList.add("bump");
      setTimeout(() => count.classList.remove("bump"), 720);
    }
    const topCount = $("#top-trophy-count");
    if (topCount) topCount.textContent = String(value);
  }, 1150);
}

function toast(message, error = false, icon = null) {
  let stack = $(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }
  const node = document.createElement("div");
  node.className = `toast${error ? " error" : ""}${icon ? " has-icon" : ""}`;
  if (icon) {
    node.innerHTML = `<svg class="toast-icon" aria-hidden="true"><use href="#${icon}"></use></svg><span>${esc(message)}</span>`;
  } else {
    node.textContent = message;
  }
  stack.appendChild(node);
  setTimeout(() => {
    node.style.opacity = "0";
    node.style.transform = "translateY(-6px)";
    node.style.transition = ".25s ease";
    setTimeout(() => node.remove(), 280);
  }, 2400);
}

/** Newest completed subtask stamp for a todo, or 0 when none is done. */
function latestSubtaskCompletion(todo) {
  let stamp = 0;
  for (const subtask of todo?.subtasks || []) {
    if (!subtask.done) continue;
    const when = stampValue(subtask.completed_at);
    if (when > stamp) stamp = when;
  }
  return stamp;
}

/** Newest AI-run stamp across a todo's pending subtasks. */
function latestSubtaskAiFinish(todo) {
  let stamp = 0;
  for (const subtask of todo?.subtasks || []) {
    if (subtask.done) continue;
    const when = stampValue(subtaskAiFinishedAt[subtask.id]);
    if (when > stamp) stamp = when;
  }
  return stamp;
}

/** Newest AI activity on the todo itself or any of its subtasks. */
function latestTodoAiFinish(todo) {
  return Math.max(stampValue(todoAiFinishedAt[todo?.id]), latestSubtaskAiFinish(todo));
}

function agentIsRunning(agentId) {
  return agentBusyIds.has(agentId) || Boolean(runningAgentStamps[agentId]);
}

/** True while an AI agent is actively working on the todo or one of its subtasks. */
function todoHasRunningAgent(todo) {
  if (!todo?.id) return false;
  if (agentIsRunning(`todo:${todo.id}`)) return true;
  return (todo.subtasks || []).some(
    (subtask) => !subtask.done && agentIsRunning(`subtask:${subtask.id}`)
  );
}

/** Latest moment a todo changed: created, edited by AI, or a subtask moved. */
function todoActivityStamp(todo) {
  let stamp = stampValue(todo?.created_at);
  stamp = Math.max(stamp, latestTodoAiFinish(todo));
  stamp = Math.max(stamp, latestSubtaskCompletion(todo));
  for (const subtask of todo?.subtasks || []) {
    stamp = Math.max(stamp, subtaskActivityStamp(subtask));
  }
  const running = Number(runningAgentStamps[`todo:${todo?.id}`]);
  if (Number.isFinite(running)) stamp = Math.max(stamp, running);
  return stamp;
}

function doingEntries() {
  const entries = [];
  for (const category of visibleCategories()) {
    for (const todo of category.todos || []) {
      if (!todo.done) entries.push({ category, todo, order: entries.length });
    }
  }
  // Order by time, not by status alone: a newly created todo opens at the top,
  // and work finished or started later rises above it. Status only breaks ties
  // when two rows share the same timestamp.
  entries.sort((a, b) => {
    const stampA = todoActivityStamp(a.todo);
    const stampB = todoActivityStamp(b.todo);
    if (stampA !== stampB) return stampB - stampA;
    const unseenA = todoHasUnseenAgentSubtasks(a.todo) ? 1 : 0;
    const unseenB = todoHasUnseenAgentSubtasks(b.todo) ? 1 : 0;
    if (unseenA !== unseenB) return unseenB - unseenA;
    const runningA = todoHasRunningAgent(a.todo) ? 1 : 0;
    const runningB = todoHasRunningAgent(b.todo) ? 1 : 0;
    if (runningA !== runningB) return runningB - runningA;
    return a.order - b.order;
  });
  return entries;
}

/** Parse a stored ISO stamp into a comparable epoch value. */
function stampValue(value) {
  const parsed = Date.parse(String(value || ""));
  return Number.isNaN(parsed) ? 0 : parsed;
}

/** Latest moment a subtask changed: created, completed, finished by AI, or
    started an AI run. */
function subtaskActivityStamp(subtask) {
  let stamp = stampValue(subtask?.created_at);
  // A reopened row starts a fresh run and leads the board again.
  stamp = Math.max(stamp, stampValue(subtask?.reopened_at));
  if (subtask?.done) stamp = Math.max(stamp, stampValue(subtask.completed_at));
  stamp = Math.max(stamp, stampValue(subtaskAiFinishedAt[subtask?.id]));
  const running = Number(runningAgentStamps[`subtask:${subtask?.id}`]);
  if (Number.isFinite(running)) stamp = Math.max(stamp, running);
  return stamp;
}

/** Newest activity first: a freshly added subtask opens at the top, while work
    completed or started later floats above it. Status is no longer the primary
    key, only the stored order breaks exact timestamp ties. */
function orderedSubtasks(todo) {
  return (todo?.subtasks || [])
    .map((subtask, index) => ({
      subtask,
      index,
      stamp: subtaskActivityStamp(subtask),
    }))
    .sort((a, b) => b.stamp - a.stamp || a.index - b.index)
    .map((item) => item.subtask);
}

/** Reorder the visible subtask rows, optionally revealing a finished one. */
function reorderCurrentSubtaskRows(revealId = "") {
  const todo = currentTodo();
  const inner = $(".current-inner");
  const box = inner?.querySelector('.subtask-lane[data-lane="pending"] .current-subtasks')
    || inner?.querySelector(".current-subtasks");
  if (!todo || !box || inner.dataset.currentTodo !== String(todo.id)) return;
  const rows = new Map();
  box.querySelectorAll(".current-subtask[data-subtask-id]").forEach((row) => {
    rows.set(row.dataset.subtaskId, row);
  });
  if (!rows.size) return;
  const order = orderedSubtasks(todo)
    .map((subtask) => String(subtask.id))
    .filter((id) => rows.has(id));
  for (const id of rows.keys()) {
    if (!order.includes(id)) order.push(id);
  }
  for (const id of order) box.appendChild(rows.get(id));
  box.querySelectorAll(".current-subtask-filler").forEach((row) => box.appendChild(row));
  if (!revealId) return;
  revealCurrentSubtaskRow(revealId);
  const revealRow = rows.get(String(revealId));
  if (!revealRow) return;
  try {
    revealRow.animate(
      [{ transform: "translateY(14px)", opacity: 0.35 }, { transform: "none", opacity: 1 }],
      { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  } catch (error) {}
}

/** Bring a finished subtask row to the top of the visible task list. */
function revealCurrentSubtaskRow(subtaskId) {
  const inner = $(".current-inner");
  const row = inner?.querySelector(`.current-subtask[data-subtask-id="${CSS.escape(String(subtaskId))}"]`);
  if (!inner || !row) return;
  const scroller = row.closest(".subtask-lane") || inner;
  const rowRect = row.getBoundingClientRect();
  const scrollerRect = scroller.getBoundingClientRect();
  if (rowRect.top >= scrollerRect.top - 1 && rowRect.bottom <= scrollerRect.bottom + 1) return;
  const max = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
  scroller.scrollTop = Math.max(0, Math.min(scroller.scrollTop + rowRect.top - scrollerRect.top - 4, max));
}

/** The fan as a fixed stand plus a wheel that can spin on its own. */
function doingFanStackHtml() {
  return `<span class="fan-stack"><svg class="fan-static" aria-hidden="true" viewBox="0 0 1024 1024"><use href="#fan"></use></svg><svg class="fan-rotor" aria-hidden="true" viewBox="0 0 1024 1024"><circle cx="493" cy="422" r="286" fill="#C8B9FC"></circle><g clip-path="url(#fan-wheel-clip)"><use href="#fan"></use></g></svg></span>`;
}

function doingSubtaskHtml(entry, subtask) {
  const marked = doingMarkedSubtaskId === subtask.id ? "marked" : "";
  const unseen = unseenAgentSubtasks.has(subtask.id);
  const running = agentIsRunning(`subtask:${subtask.id}`) ? "agent-running" : "";
  return `<button class="doing-sub ${marked} ${unseen ? "has-unseen" : ""} ${running}" type="button" data-doing-subtask="${esc(subtask.id)}" data-doing-todo="${esc(entry.todo.id)}" data-category-id="${esc(entry.category.id)}">
    <span class="doing-fan ${unseen ? "has-unseen" : ""}" aria-hidden="true">${doingFanStackHtml()}</span>
    <span class="doing-sub-name">${esc(subtask.name)}</span>
  </button>`;
}

function doingTodoHtml(entry) {
  const { category, todo } = entry;
  const pending = orderedSubtasks(todo).filter((subtask) => !subtask.done);
  const expanded = doingExpandedTodoIds.has(todo.id);
  const active = category.id === state.selectedCategoryId;
  const marked = doingMarkedTodoId === todo.id ? "marked" : "";
  const unseen = todoHasUnseenAgentSubtasks(todo);
  return `<div class="doing-item ${active ? "active" : ""} ${expanded ? "expanded" : ""} ${marked}" data-doing-item="${esc(todo.id)}">
    <div class="doing-head ${marked}" data-doing-jump="${esc(todo.id)}" data-category-id="${esc(category.id)}">
      <button class="doing-mark ${unseen ? "has-unseen" : ""}" type="button" data-doing-expand="${esc(todo.id)}" aria-label="Show pending subtasks for ${esc(todo.name)}" aria-expanded="${expanded ? "true" : "false"}">
        <svg viewBox="0 0 1024 1024" aria-hidden="true"><use href="#doing-mark"></use></svg>
      </button>
      <button class="doing-name" type="button" data-doing-jump="${esc(todo.id)}" data-category-id="${esc(category.id)}">${esc(todo.name)}</button>
    </div>
    ${expanded && pending.length ? `<div class="doing-subs">${pending.map((subtask) => doingSubtaskHtml(entry, subtask)).join("")}</div>` : ""}
  </div>`;
}

function doingPeekMarkup(entries) {
  // The card's background is mounted by syncCardWallpapers(): a live pane of
  // the room, not a picture printed inside the card. The kicker is the card's
  // grab bar (hold it and pull the card anywhere on the desk); clicking it does
  // nothing else, so it keeps only the close pin and the label.
  return `<div class="doing-kicker">
    <button class="doing-pin" type="button" data-doing-pin aria-label="Close Doing card">
      <svg viewBox="0 0 1024 1024" aria-hidden="true"><use href="#close-circle"></use></svg>
    </button>
    <span class="doing-label">Doing ...</span>
  </div>
    <div class="doing-list">${entries.map(doingTodoHtml).join("")}</div>`;
}

function doingPeekStateKey(entries) {
  return `${currentPostcardId()}|${wallpaperRenderKey()}|${doingDockSide}|${[...doingExpandedTodoIds].join(",")}|${state.selectedCategoryId || ""}|${[...unseenAgentSubtasks].sort().join(",")}|${Object.keys(runningAgentStamps).sort().join(",")}|${entries.map(({ todo }) =>
    `${todo.id}:${todoHasRunningAgent(todo) ? 1 : 0}:${todo.name}:${(todo.subtasks || []).length}:${orderedSubtasks(todo).filter((subtask) => !subtask.done).map((subtask) => subtask.id).join(",")}`
  ).join(";")}`;
}

/** The subtask column's own box: the drawer's two homes are its borders. */
function doingColumnRect() {
  // A popped-out note/AI window is that panel's own sheet; the Doing drawer
  // belongs to the main room's subtask column only.
  if (detachedMode) return null;
  const half = $(".current-half");
  if (!half) return null;
  const rect = half.getBoundingClientRect();
  return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
}

function refreshDoingZone() {
  const home = doingColumnRect();
  if (!home) { doingZone = null; doingHome = null; return; }
  doingHome = home;
  // The card's box never changes: half the subtask column, the same top and
  // height it always had.
  doingCardWidth = Math.round(Math.min(420, Math.max(320, (home.right - home.left) * 0.5)));
  doingCardTop = Math.max(8, home.top - 40);
  doingCardHeight = Math.min(560, Math.max(280, window.innerHeight - doingCardTop - 12));
  // The hover strip sits on the subtask column's border, over the column's
  // own height. The left border mirrors the right band exactly.
  const top = Math.round(home.top + 8);
  const bottom = Math.round(home.bottom + 4);
  doingZone = doingDockSide === "left"
    ? { left: Math.round(home.left - 80), right: Math.round(home.left + 56), top, bottom }
    : { left: Math.round(home.right - 56), right: Math.round(home.right + 80), top, bottom };
  doingZoneAt = performance.now();
}

function positionDoingPeek() {
  const panel = $("#doing-peek");
  if (!panel) return;
  // A drag owns the card's box until it is dropped; an async repaint must not
  // snap it back under the pointer.
  if (doingDrag) return;
  if (!doingZone || !doingHome) refreshDoingZone();
  if (!doingZone || !doingHome) return;
  const home = doingHome;
  const width = doingCardWidth;
  const height = doingCardHeight;
  panel.style.width = `${width}px`;
  panel.style.height = `${height}px`;
  panel.style.maxHeight = `${Math.max(180, window.innerHeight - 12)}px`;
  panel.style.right = "auto";
  // A pinned card sits exactly where it was dropped, clamped inside the desk
  // so a window that shrinks under it cannot carry it off the page.
  if (doingFloat) {
    const left = Math.round(Math.max(6, Math.min(window.innerWidth - width - 6, doingFloat.left)));
    const top = Math.round(Math.max(6, Math.min(Math.max(6, window.innerHeight - height - 6), doingFloat.top)));
    doingFloat = { left, top };
    panel.style.top = `${top}px`;
    panel.style.left = `${left}px`;
    doingPanelRect = {
      left,
      right: left + width,
      top,
      bottom: top + height,
    };
    return;
  }
  const top = doingCardTop;
  panel.style.top = `${top}px`;
  panel.style.maxHeight = `${Math.max(180, window.innerHeight - top - 12)}px`;
  // Right-docked cards grow leftward from the column's right border; a
  // left-docked card grows rightward from its left border. The box itself
  // never changes size, only the anchored border.
  const left = doingDockSide === "left"
    ? home.left
    : home.right - width;
  panel.style.left = `${Math.round(left)}px`;
  doingPanelRect = {
    left,
    right: left + width,
    top,
    bottom: top + height,
  };
}

/** Move the drawer to the other border and keep it where it is (open stays
    open, closed stays closed). The wallpaper pane is rebaked at the new box. */
function setDoingDockSide(side) {
  const next = side === "left" ? "left" : "right";
  if (next === doingDockSide) return;
  doingDockSide = next;
  try { localStorage.setItem(DOING_DOCK_SIDE_KEY, doingDockSide); } catch (error) {}
  const left = doingDockSide === "left";
  document.body.classList.toggle("doing-dock-left", left);
  const panel = $("#doing-peek");
  if (panel) panel.classList.toggle("doing-dock-left", left);
  doingPeekSignature = "";
  refreshDoingZone();
  positionDoingPeek();
  // Only this drawer's pane moves with the drawer. The finished card beside it
  // keeps both its box and its wallpaper alignment.
  syncCardWallpaper(panel);
  if (doingPeekOpen) settleCardWallpaper(panel, 460);
}

/** Press anywhere on the card. The kicker is the card's handle and pulls in
    every direction; a pull from the list keeps the old sideways rule so a
    vertical gesture still scrolls the rows. */
function beginDoingPress(event) {
  if (event.button !== 0 || !doingPeekOpen) return;
  // A pointer released outside the window can swallow its pointerup; a fresh
  // press always clears the stale pull instead of locking the card.
  if (doingDrag) endDoingDrag(false);
  const panel = event.target.closest?.("#doing-peek");
  if (!panel) return;
  // The close pin keeps its own click; the rest of the card is grabbable.
  if (event.target.closest(".doing-pin, input, textarea, select, a")) return;
  if (doingPress) endDoingPress();
  doingPress = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    panel,
    fromKicker: Boolean(event.target.closest(".doing-kicker")),
  };
  window.addEventListener("pointermove", moveDoingPress, { passive: false });
  window.addEventListener("pointerup", endDoingPress);
  window.addEventListener("pointercancel", endDoingPress);
}

function moveDoingPress(event) {
  if (!doingPress || event.pointerId !== doingPress.pointerId) return;
  if (!event.buttons) { endDoingPress(); return; }
  const dx = event.clientX - doingPress.startX;
  const dy = event.clientY - doingPress.startY;
  if (Math.hypot(dx, dy) < 6) return;
  // The card is a drawer, not a text field: either a deliberate pull on the
  // kicker or a sideways pull on the rows lifts it, so row clicks and vertical
  // scrolling stay exactly as they were.
  if (!doingPress.fromKicker && Math.abs(dx) <= Math.abs(dy)) return;
  const press = doingPress;
  endDoingPress();
  beginDoingDrag(press, event);
}

function endDoingPress() {
  if (!doingPress) return;
  doingPress = null;
  window.removeEventListener("pointermove", moveDoingPress);
  window.removeEventListener("pointerup", endDoingPress);
  window.removeEventListener("pointercancel", endDoingPress);
}

/** Start the pull. The box is frozen at the moment of the grab: width and
    height never change during the move, and the card follows the pointer on
    both axes so it can be pinned anywhere on the desk. */
function beginDoingDrag(press, event) {
  const panel = press.panel;
  if (!panel || !panel.isConnected) return;
  if (!doingHome) refreshDoingZone();
  if (!doingHome) return;
  const rect = panel.getBoundingClientRect();
  const startLeft = Math.round(rect.left);
  const startTop = Math.round(rect.top);
  // Grabbing a card that is still gliding home freezes it where the pointer
  // caught it: the visual box becomes the laid-out `left`/`top`, so the pull's
  // offset is measured from the same box the compositor is about to move.
  panel.classList.remove("doing-snapping");
  panel.style.left = `${startLeft}px`;
  panel.style.top = `${startTop}px`;
  panel.style.right = "auto";
  panel.style.translate = "0px 0px";
  clearDoingWallpaperOffsets(panel);
  // One measurement at the grab (not per frame) settles the pane on the box
  // the pull is about to move, including when the card is caught mid-glide.
  panel.querySelectorAll(":scope > .card-wallpaper").forEach(placeCardWallpaper);
  // A drop glide may still be measuring this card; the pull paints the pane
  // itself now, so the loop must not fight it.
  cardWallpaperHosts.delete(panel);
  doingDrag = {
    pointerId: event.pointerId,
    startX: press.startX,
    startY: press.startY,
    startLeft,
    startTop,
    left: startLeft,
    top: startTop,
    width: rect.width,
    height: rect.height,
    moved: false,
  };
  doingDragX = 0;
  doingDragY = 0;
  panel.classList.add("doing-dragging");
  document.body.classList.add("doing-dragging");
  try { panel.setPointerCapture?.(event.pointerId); } catch (error) {}
  window.addEventListener("pointermove", moveDoingDrag, { passive: false });
  window.addEventListener("pointerup", finishDoingDrag);
  window.addEventListener("pointercancel", cancelDoingDrag);
  moveDoingDrag(event);
  event.preventDefault();
}

/** A film card is a window onto the room: while it is pulled, its copy has to
    slide the other way so the crop stays welded to the desk. Only the media
    leaf moves, with its own composited `translate` — no custom property, no
    layout read, and the card's rows are never restyled. */
function paintDoingWallpaperOffset(panel, x, y) {
  if (!panel) return;
  panel.querySelectorAll(":scope > .card-wallpaper[data-fit='window'] > .wallpaper-media").forEach((media) => {
    const value = `${Math.round(-x)}px ${Math.round(-y)}px`;
    if (media.style.translate !== value) media.style.translate = value;
  });
}

function clearDoingWallpaperOffsets(panel) {
  if (!panel) return;
  panel.querySelectorAll(":scope > .card-wallpaper > .wallpaper-media").forEach((media) => {
    media.style.removeProperty("translate");
  });
}

/** Paint the pull's offset on the compositor. Pointer events arrive faster than
    the screen refreshes, so the card is moved at most once per frame and never
    through `left`/`top` (which would relayout and repaint the page under the
    pull). The offset is an inline `translate`, not a custom property: custom
    properties inherit, so a per-frame `--doing-drag-x` restyled every row in
    the card (the stutter the pull used to have). */
function flushDoingDragFrame() {
  doingDragFrame = 0;
  if (!doingDrag) return;
  const panel = $("#doing-peek");
  if (!panel) return;
  const x = Math.round(doingDragX);
  const y = Math.round(doingDragY);
  const value = `${x}px ${y}px`;
  if (panel.style.translate === value) return;
  panel.style.translate = value;
  paintDoingWallpaperOffset(panel, x, y);
}

function cancelDoingDragFrame() {
  if (!doingDragFrame) return;
  cancelAnimationFrame(doingDragFrame);
  doingDragFrame = 0;
}

/** Hand the card back to its laid-out box. A pull owns the offset; when a
    close/open pass catches the card mid-glide, the offset must not ride along
    with the slide (the card would leave from the wrong spot). */
function clearDoingDragOffset(panel) {
  if (!panel || doingDrag) return;
  panel.classList.remove("doing-snapping");
  panel.style.removeProperty("translate");
  clearDoingWallpaperOffsets(panel);
}

function moveDoingDrag(event) {
  if (!doingDrag || event.pointerId !== doingDrag.pointerId) return;
  // A release outside the window can lose its pointerup; no buttons held means
  // the pull is over, so drop the card at the spot it reached.
  if (!event.buttons) { endDoingDrag(true); return; }
  event.preventDefault();
  const dx = event.clientX - doingDrag.startX;
  const dy = event.clientY - doingDrag.startY;
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) doingDrag.moved = true;
  const width = doingDrag.width;
  const height = doingDrag.height;
  // The card may be pinned anywhere on the desk; it is only kept a hair inside
  // the window so it can always be grabbed again.
  const maxLeft = Math.max(6, window.innerWidth - width - 6);
  const maxTop = Math.max(6, window.innerHeight - height - 6);
  const left = Math.round(Math.max(6, Math.min(maxLeft, doingDrag.startLeft + dx)));
  const top = Math.round(Math.max(6, Math.min(maxTop, doingDrag.startTop + dy)));
  doingDrag.left = left;
  doingDrag.top = top;
  // Only the composited offset changes here. `left`/`top` are committed once,
  // on release, so the card follows the pointer without a layout pass per event.
  doingDragX = left - doingDrag.startLeft;
  doingDragY = top - doingDrag.startTop;
  if (!doingDragFrame) doingDragFrame = requestAnimationFrame(flushDoingDragFrame);
  doingPanelRect = {
    left,
    right: left + width,
    top,
    bottom: top + height,
  };
}

/** Turn the pull's composited offset off and let it glide to zero against the
    box that was just committed. Reused by the drop (pin it where it landed) and
    by the pin button (glide back to the border). */
function glideDoingPanelBack(panel, slackX, slackY) {
  if (!panel) return;
  const token = ++doingGlideToken;
  // The pull counter-moved the pane; hand it back to the resting box before
  // the glide starts.
  clearDoingWallpaperOffsets(panel);
  panel.style.translate = `${Math.round(slackX)}px ${Math.round(slackY)}px`;
  void panel.offsetWidth;
  panel.classList.remove("doing-dragging");
  document.body.classList.remove("doing-dragging");
  panel.classList.add("doing-snapping");
  requestAnimationFrame(() => {
    if (token !== doingGlideToken) return;
    panel.style.translate = "0px 0px";
  });
  // Re-place the film window on the card's resting box before it glides.
  if (doingPeekOpen) settleCardWallpaper(panel, 460);
  AudioFX.categoryTap();
  setTimeout(() => {
    if (token !== doingGlideToken) return;
    panel.classList.remove("doing-snapping");
    // A new pull may have started inside the glide: it owns the variables and
    // the frame budget now.
    if (doingDrag) return;
    panel.style.removeProperty("translate");
    if (doingPeekOpen) settleCardWallpaper(panel, 460);
  }, 360);
}

/** Drop the card: it stays exactly where it was released, pinned there until
    the close pin sends it back to its border. */
function endDoingDrag(commit) {
  if (!doingDrag) return;
  const drag = doingDrag;
  doingDrag = null;
  window.removeEventListener("pointermove", moveDoingDrag);
  window.removeEventListener("pointerup", finishDoingDrag);
  window.removeEventListener("pointercancel", cancelDoingDrag);
  const panel = $("#doing-peek");
  if (!panel) return;
  cancelDoingDragFrame();
  try { panel.releasePointerCapture?.(drag.pointerId); } catch (error) {}
  if (drag.moved) {
    // The row under the pointer must not also open: a pull is not a click.
    doingDragClickUntil = performance.now() + 400;
  }
  if (commit && drag.moved) {
    // positionDoingPeek() below lays the card out with the column's card size,
    // so the pinned box must use the same numbers or the glide would start a
    // pixel or two off the pointer's drop point.
    const width = doingCardWidth || drag.width;
    const height = doingCardHeight || drag.height;
    const targetLeft = Math.round(Math.max(6, Math.min(Math.max(6, window.innerWidth - width - 6), drag.left)));
    const targetTop = Math.round(Math.max(6, Math.min(Math.max(6, window.innerHeight - height - 6), drag.top)));
    doingFloat = { left: targetLeft, top: targetTop };
    saveDoingFloat();
    const slackX = drag.left - targetLeft;
    const slackY = drag.top - targetTop;
    // Zero the composited offset first: the wallpaper pane is matched against
    // the box the card will actually occupy once it lands. Matching it against
    // the pointer's drop point would miss the baked pane and mount a
    // viewport-sized one underneath the glide.
    clearDoingWallpaperOffsets(panel);
    panel.style.translate = "0px 0px";
    panel.style.right = "auto";
    panel.style.left = `${targetLeft}px`;
    panel.style.top = `${targetTop}px`;
    void panel.offsetWidth;
    positionDoingPeek();
    // The pinned box is a new window onto the room: rebake/match this card's
    // pane at that box before the glide starts.
    syncCardWallpaper(panel);
    syncDoingPinState(panel);
    glideDoingPanelBack(panel, slackX, slackY);
    return;
  }
  // A tap and a cancelled pull leave the card where the laid-out box put it,
  // exactly as before.
  panel.style.left = `${Math.round(drag.left)}px`;
  panel.style.top = `${Math.round(drag.top)}px`;
  panel.style.right = "auto";
  panel.style.removeProperty("translate");
  clearDoingWallpaperOffsets(panel);
  panel.classList.remove("doing-dragging");
  document.body.classList.remove("doing-dragging");
  positionDoingPeek();
  syncCardWallpaper(panel);
  if (doingPeekOpen) settleCardWallpaper(panel, 360);
}

/** The close pin is also the way home: a pinned card says "return", a docked
    one says "close". */
function syncDoingPinState(panel) {
  if (!panel) return;
  const floating = Boolean(doingFloat);
  panel.classList.toggle("doing-floating", floating);
  const pin = panel.querySelector("[data-doing-pin]");
  if (!pin) return;
  pin.setAttribute("aria-label", floating ? "Return Doing card to its border" : "Close Doing card");
  pin.setAttribute("title", floating ? "Return to the border" : "Close");
}

/** Un-pin the card and glide it back to the border it came from. */
function returnDoingPeekHome() {
  const panel = $("#doing-peek");
  if (!panel) { doingFloat = null; saveDoingFloat(); return; }
  // Cancel any in-flight drop glide and keep the box the reader currently sees,
  // so the return trip starts from the card itself and not from a stray offset.
  panel.classList.remove("doing-snapping");
  panel.style.translate = "0px 0px";
  clearDoingWallpaperOffsets(panel);
  const from = panel.getBoundingClientRect();
  doingFloat = null;
  saveDoingFloat();
  refreshDoingZone();
  positionDoingPeek();
  // The home box is a different window onto the room: match the pane before
  // the card glides there, exactly like a free drop.
  syncCardWallpaper(panel);
  syncDoingPinState(panel);
  const to = panel.getBoundingClientRect();
  glideDoingPanelBack(panel, from.left - to.left, from.top - to.top);
}

function finishDoingDrag() { endDoingDrag(true); }
function cancelDoingDrag() { endDoingDrag(false); }

function bindDoingCard(list) {
  if (!list || list.dataset.cardBound) return;
  list.dataset.cardBound = "1";
  list.addEventListener("scroll", () => AudioFX.cardWind(), { passive: true });
}

function animateDoingReorder(previousTops, nextList) {
  if (!doingPeekOpen || !nextList || !previousTops.size) return;
  nextList.querySelectorAll(".doing-item[data-doing-item]").forEach((item) => {
    const oldTop = previousTops.get(item.dataset.doingItem);
    if (oldTop == null) return;
    const delta = oldTop - item.getBoundingClientRect().top;
    if (Math.abs(delta) < 2) return;
    try {
      item.animate(
        [{ transform: `translateY(${delta}px)` }, { transform: "none" }],
        { duration: 360, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
    } catch (error) {}
  });
}

/** The fan beside a subtask turns while its agent works, using the same
    startFanSpin() ramp as the subtask column, so both wheels run at one pace.
    A tucked-away card keeps its wheels still. */
function syncDoingFanSpins(list, active = doingPeekOpen) {
  if (!list) return;
  list.querySelectorAll(".doing-sub .fan-rotor").forEach((rotor) => {
    const row = rotor.closest(".doing-sub");
    if (active && row?.classList.contains("agent-running")) startFanSpin(rotor);
    else stopFanSpin(rotor);
  });
}

function updateDoingPeek(force = false) {
  // A pull owns the card: a polling tick that changes the state signature
  // mid-drag must not rebuild the rows (which relayouts the card under the
  // pointer). The first pass after the drop catches up.
  if (doingDrag) return;
  const entries = doingEntries();
  pruneUnseenAgentSubtasks();
  let panel = $("#doing-peek");
  if (!entries.length) {
    endDoingPress();
    if (doingDrag) endDoingDrag(false);
    if (panel) panel.remove();
    doingPeekOpen = false;
    document.body.classList.remove("doing-peek-open");
    document.body.classList.remove("doing-dock-left");
    // Keep doingExpandedTodoIds: a render can briefly arrive without entries
    // (first paint, a data reload), and that must not wipe the rows the reader
    // left open for the next peek.
    doingPeekSignature = "";
    doingPanelRect = null;
    ensureCardWallpaperClock();
    return;
  }
  if (!panel) {
    panel = document.createElement("aside");
    panel.id = "doing-peek";
    panel.dataset.subcard = "doing";
    // The card is a movable sheet: the marker says so for scripts. The pull is
    // explained by the grab cursor on the sheet, not by a corner label.
    panel.dataset.draggable = "true";
    panel.className = "doing-peek";
    panel.setAttribute("aria-label", "Doing");
    panel.addEventListener("pointerenter", () => {
      clearTimeout(doingPeekOpenTimer);
    });
    document.body.appendChild(panel);
  }
  // The drawer's dock side is part of the card, not of its content: apply it
  // on every pass so a restored session and a flipped card agree.
  panel.classList.toggle("doing-dock-left", doingDockSide === "left");
  document.body.classList.toggle("doing-dock-left", doingDockSide === "left");
  // The Doing card keeps its own card border; it never shows a scroll thumb.
  panel.querySelector(":scope > .slim-scrollbar")?.remove();
  const key = doingPeekStateKey(entries);
  if (force || key !== doingPeekSignature) {
    const previousList = panel.querySelector(".doing-list");
    const previousScroll = previousList ? previousList.scrollTop : 0;
    const previousTops = new Map();
    previousList?.querySelectorAll(".doing-item[data-doing-item]").forEach((item) => {
      previousTops.set(item.dataset.doingItem, item.getBoundingClientRect().top);
    });
    doingPeekSignature = key;
    // Keep the wallpaper pane across content updates: rebuilding it made the
    // card repaint the whole wallpaper every time its rows changed.
    const keptPane = panel.querySelector(":scope > .card-wallpaper");
    panel.innerHTML = doingPeekMarkup(entries);
    if (keptPane) panel.insertBefore(keptPane, panel.firstChild);
    const nextList = panel.querySelector(".doing-list");
    if (nextList) nextList.scrollTop = previousScroll;
    animateDoingReorder(previousTops, nextList);
  }
  panel.classList.toggle("open", doingPeekOpen);
  syncDoingPinState(panel);
  const list = panel.querySelector(".doing-list");
  bindDoingCard(list);
  syncDoingFanSpins(list, doingPeekOpen);
  // The Doing card is rebuilt independently of the stage; give its rows their
  // height-ramp colours before the card is positioned.
  applyBaselineRowHeights(panel);
  positionDoingPeek();
  // Expanding a row only changes this card. Touching the wallpaper of every
  // sub-card here repainted the finished-subtasks card beside it, which read
  // as the finished card being nudged aside.
  syncCardWallpaper(panel);
  if (doingPeekOpen) settleCardWallpaper(panel);
}

function openDoingPeek() {
  clearTimeout(doingPeekOpenTimer);
  // The finished-subtasks card may be open on the same border; the Doing card
  // still slides out above it. The two cards are independent sheets.
  syncRunningAgentMemory();
  syncAgentFinishMemory();
  if (!doingEntries().length) return;
  if (!doingPeekOpen) refreshDoingZone();
  updateDoingPeek();
  const panel = $("#doing-peek");
  if (!panel) return;
  doingPeekOpen = true;
  document.body.classList.add("doing-peek-open");
  positionDoingPeek();
  clearDoingDragOffset(panel);
  panel.classList.add("open");
  syncDoingFanSpins(panel.querySelector(".doing-list"), true);
  // The card borrows the wallpaper, and only this pane is aligned through its
  // slide: the finished card beside it must not repaint or move.
  syncCardWallpaper(panel);
  settleCardWallpaper(panel, 460);
}

function closeDoingPeek() {
  clearTimeout(doingPeekOpenTimer);
  endDoingPress();
  if (doingDrag) endDoingDrag(false);
  if (!doingPeekOpen) return;
  doingPeekOpen = false;
  document.body.classList.remove("doing-peek-open");
  // The open rows stay put: reopening the drawer restores the same subtask
  // lists instead of folding every todo back to its head.
  const panel = $("#doing-peek");
  if (panel) {
    panel.classList.remove("open");
    panel.querySelectorAll(".card-wallpaper video").forEach((video) => video.pause());
    syncDoingFanSpins(panel.querySelector(".doing-list"), false);
  }
  ensureCardWallpaperClock();
}

function pointInDoingZone(x, y) {
  if (!doingZone) return false;
  return x >= doingZone.left
    && x <= doingZone.right
    && y >= doingZone.top
    && y <= doingZone.bottom;
}


function activateDoingCategory(categoryId) {
  saveActiveNoteCaret();
  flushNoteSave();
  state.selectedCategoryId = categoryId;
  lastCategoryId = null;
  historyCursor = -1;
  historyScrollTop = 0;
  selectedHistoryId = null;
  selectedSubtaskId = null;
  notesPreview = false;
  render();
  silentAction("select_category", { id: categoryId });
}

function jumpToDoingTodo(todoId, categoryId) {
  AudioFX.categoryTap();
  doingMarkedTodoId = todoId;
  if (doingExpandedTodoIds.has(todoId)) doingExpandedTodoIds.delete(todoId);
  else doingExpandedTodoIds.add(todoId);
  saveDoingExpandedTodoIds();
  updateDoingPeek(true);
  if (categoryId && categoryId !== state.selectedCategoryId) activateDoingCategory(categoryId);
}

function jumpToDoingSubtask(todoId, categoryId, subtaskId) {
  AudioFX.categoryTap();
  doingMarkedTodoId = todoId;
  doingMarkedSubtaskId = subtaskId;
  saveActiveNoteCaret();
  flushNoteSave();
  if (categoryId && categoryId !== state.selectedCategoryId) {
    state.selectedCategoryId = categoryId;
    lastCategoryId = null;
    historyCursor = -1;
    historyScrollTop = 0;
    selectedHistoryId = null;
    selectedSubtaskId = null;
    notesPreview = false;
    render();
    silentAction("select_category", { id: categoryId });
  }
  selectedSubtaskId = subtaskId;
  selectedHistoryId = null;
  notesPreview = false;
  clearUnseenAgentSubtask(subtaskId);
  updateSubtaskSelection();
  renderNotesPanel();
  requestAnimationFrame(() => {
    const row = document.querySelector(`.current-subtask[data-subtask-id="${CSS.escape(subtaskId)}"]`);
    const inner = $(".current-inner");
    if (!row || !inner) return;
    const scroller = row.closest(".subtask-lane") || inner;
    const rowRect = row.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();
    const offset = scroller.scrollTop + (rowRect.top - scrollerRect.top) - scroller.clientHeight / 2 + rowRect.height / 2;
    scroller.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
  });
  updateDoingPeek(true);
}

// A card in the Forktree map posts its category/todo/subtask back here. The
// plugin closes and the notebook lands on that exact task; finished work is
// revealed in the history reel instead of being silently skipped.
function openForkTreeTarget(target = {}) {
  if (!state.data) return;
  const categories = state.data.categories || [];
  const categoryId = String(target.categoryId || "");
  const todoId = String(target.todoId || "");
  const subtaskId = String(target.subtaskId || "");
  const category = categories.find((item) => item.id === categoryId)
    || categories.find((item) => (item.todos || []).some((todo) => todo.id === todoId));
  if (!category) return;

  const todo = (category.todos || []).find((item) => item.id === todoId)
    || (category.todos || []).find((item) => !item.done)
    || null;
  const subtask = subtaskId
    ? (todo?.subtasks || []).find((item) => item.id === subtaskId) || null
    : null;

  if (openPluginId) closePluginPanel();
  saveActiveNoteCaret();
  flushNoteSave();
  state.selectedCategoryId = category.id;
  lastCategoryId = null;
  historyCursor = -1;
  historyScrollTop = 0;
  selectedHistoryId = null;
  selectedSubtaskId = null;
  notesPreview = false;
  render();
  silentAction("select_category", { id: category.id });

  if (!todo) return;

  if (todo.done) {
    const done = doneTodos(category);
    const index = done.findIndex((item) => item.id === todo.id);
    historyCursor = index >= 0 ? index : 0;
    selectedHistoryId = todo.id;
    if (index >= 0) historyExpanded.add(index);
    if (subtaskId) {
      selectedSubtaskId = subtaskId;
      clearUnseenAgentSubtask(subtaskId);
    }
    renderStage();
    requestAnimationFrame(() => {
      const reel = $("#history-reel");
      if (!reel) return;
      const row = subtask
        ? reel.querySelector(`.history-subtask[data-history-subtask-id="${CSS.escape(subtask.id)}"]`)
        : reel.querySelector(`.history-row[data-todo-id="${CSS.escape(todo.id)}"]`);
      if (row) {
        const rowRect = row.getBoundingClientRect();
        const reelRect = reel.getBoundingClientRect();
        const offset = reel.scrollTop + (rowRect.top - reelRect.top) - reel.clientHeight / 2 + rowRect.height / 2;
        reel.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
      }
      updateHistorySelection();
      updateSubtaskSelection();
    });
    return;
  }

  if (!subtaskId) return;
  if (subtask?.done && pluginEnabled("completed-drawer")) {
    // Opening the card by hand (from a finished row) keeps it open.
    clearCompletedSubtasksAutoClose();
    setCompletedSubtasksOpen(true);
    AudioFX.drawer(true);
  }
  selectedSubtaskId = subtaskId;
  clearUnseenAgentSubtask(subtaskId);
  updateHistorySelection();
  updateSubtaskSelection();
  renderNotesPanel();
  requestAnimationFrame(() => {
    const row = document.querySelector(`.current-subtask[data-subtask-id="${CSS.escape(subtaskId)}"]`);
    const inner = $(".current-inner");
    if (!row || !inner) return;
    const scroller = row.closest(".subtask-lane") || inner;
    const rowRect = row.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();
    const offset = scroller.scrollTop + (rowRect.top - scrollerRect.top) - scroller.clientHeight / 2 + rowRect.height / 2;
    scroller.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
  });
}

function openModal(html, onMount, variant = "scroll prompt-scroll") {
  const root = $("#modal-root");
  AudioFX.paper();
  root.innerHTML = `<div class="modal-backdrop"><div class="modal ${variant}">${html}</div></div>`;
  const backdrop = $(".modal-backdrop", root);
  backdrop.addEventListener("mousedown", (event) => {
    if (event.target === backdrop) cancelModal();
  });
  onMount?.(root);
}

function cancelModal(result = null) {
  if (!modalResolve) return;
  const resolve = modalResolve;
  modalResolve = null;
  AudioFX.rustle(0.5);
  $("#modal-root").innerHTML = "";
  resolve(result);
}

function promptDialog({ kicker = "", title, message = "", value = "", placeholder = "", confirmLabel = "Save", sound = "ding" }) {
  return new Promise((resolve) => {
    modalResolve = resolve;
    if (sound === "train") AudioFX.trainWhistle();
    else AudioFX.ding();
    openModal(`
      ${title ? `<h3>${esc(title)}</h3>` : ""}
      ${message ? `<p>${esc(message)}</p>` : ""}
      <input id="modal-input" value="${esc(value)}" placeholder="${esc(placeholder)}" autocomplete="off">
      <div class="modal-actions"><button class="btn small" data-modal-cancel>Cancel</button><button class="btn small primary" data-modal-confirm>${esc(confirmLabel)}</button></div>
    `, (root) => {
      const input = $("#modal-input", root);
      const submit = () => {
        const result = input.value.trim();
        if (!result) { input.focus(); return; }
        cancelModal(result);
      };
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") { event.preventDefault(); submit(); }
        if (event.key === "Escape") { event.preventDefault(); cancelModal(null); }
      });
      $("[data-modal-confirm]", root).addEventListener("click", submit);
      $("[data-modal-cancel]", root).addEventListener("click", () => cancelModal(null));
      setTimeout(() => { input.focus(); input.select(); }, 30);
    });
  });
}

function confirmDialog({ kicker = "Chronicle", title, message = "", confirmLabel = "Confirm", danger = false }) {
  return new Promise((resolve) => {
    modalResolve = resolve;
    AudioFX.ding();
    openModal(`
      <div class="scroll-corner tl"></div><div class="scroll-corner tr"></div>
      <div class="scroll-corner bl"></div><div class="scroll-corner br"></div>
      <h3>${esc(title)}</h3>
      ${message ? `<p>${esc(message)}</p>` : ""}
      <div class="modal-actions"><button class="btn small" data-modal-cancel>Cancel</button><button class="btn small ${danger ? "danger" : "primary"}${confirmLabel === "To Do" ? " to-do" : ""}" data-modal-confirm>${esc(confirmLabel)}</button></div>
      <div class="wax-seal" aria-hidden="true">✦</div>
    `, (root) => {
      const confirm = () => { cancelModal(true); };
      const cancel = () => { AudioFX.rustle(0.7); cancelModal(false); };
      $("[data-modal-confirm]", root).addEventListener("click", confirm);
      $("[data-modal-cancel]", root).addEventListener("click", cancel);
      root.addEventListener("keydown", (event) => {
        if (event.key === "Enter") { event.preventDefault(); confirm(); }
        if (event.key === "Escape") { event.preventDefault(); cancel(); }
      });
      setTimeout(() => $("[data-modal-confirm]", root)?.focus(), 30);
    }, danger ? "scroll confirm-scroll danger-scroll" : "scroll confirm-scroll");
  });
}

function compressBackgroundImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const max = 1920;
        let width = image.naturalWidth || image.width;
        let height = image.naturalHeight || image.height;
        if (!width || !height) { resolve(null); return; }
        const scale = Math.min(1, max / Math.max(width, height));
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        context.fillStyle = "#161b22";
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      };
      image.onerror = () => resolve(null);
      image.src = reader.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

function compressStickerImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        // Stickers are viewed at roughly 80px, so a compact copy is plenty
        // while still leaving room to zoom into a face or a detail.
        const max = 720;
        let width = image.naturalWidth || image.width;
        let height = image.naturalHeight || image.height;
        if (!width || !height) { resolve(null); return; }
        const scale = Math.min(1, max / Math.max(width, height));
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        context.fillStyle = "#fffdf8";
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.84));
      };
      image.onerror = () => resolve(null);
      image.src = reader.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

function currentCategoryById(id) {
  return state.data.categories.find((category) => category.id === id) || null;
}

async function handleAction(actionName, element) {
  if (actionName === "ai-set-default-model") {
    const model = element?.dataset.model || "";
    if (model) await aiSaveConfig({ default_model: model }, { message: "Default model updated" });
    return;
  }
  if (actionName === "ai-toggle-model") { await aiToggleModel(element?.dataset.model || ""); return; }
  if (actionName === "ai-refresh-models") { await aiRefreshModels(); return; }
  if (actionName === "ai-set-agent-mode") {
    const kind = element?.dataset.kind || "default";
    const mode = element?.dataset.mode === "build" ? "build" : "chat";
    if (kind === "default") await aiSaveConfig({ default_mode: mode });
    else {
      const agent_modes = { ...(aiConfig?.agent_modes || {}), [kind]: mode };
      await aiSaveConfig({ agent_modes });
    }
    return;
  }
  if (actionName === "ai-toggle-notifications") {
    await aiSaveConfig({ notifications: aiConfig?.notifications === false });
    return;
  }
  if (actionName === "ai-toggle-auto-note") {
    await aiSaveConfig({ auto_attach_note: aiConfig?.auto_attach_note === false });
    return;
  }
  if (actionName === "ai-toggle-activity") {
    await aiSaveConfig({ activity_log: aiConfig?.activity_log === false });
    return;
  }
  if (actionName === "ai-new-provider") {
    aiProviderDraft = { id: "", name: "", base_url: "", api_key: "", models: "", editing: false };
    renderSettings();
    return;
  }
  if (actionName === "ai-provider-preset") {
    const preset = element?.dataset.preset || "custom";
    const setField = (name, value) => {
      const field = document.querySelector(`[data-ai-provider-field="${name}"]`);
      if (field) field.value = value;
    };
    if (preset === "ollama") {
      setField("name", "Ollama");
      setField("id", "ollama");
      setField("base_url", "http://127.0.0.1:11434/v1");
    } else if (preset === "lmstudio") {
      setField("name", "LM Studio");
      setField("id", "lmstudio");
      setField("base_url", "http://127.0.0.1:1234/v1");
    } else if (preset === "openrouter") {
      setField("name", "OpenRouter");
      setField("id", "openrouter-custom");
      setField("base_url", "https://openrouter.ai/api/v1");
    }
    return;
  }
  if (actionName === "ai-edit-provider") {
    const id = element?.dataset.provider || "";
    const provider = (aiConfig?.providers || []).find((item) => item.id === id);
    if (!provider) return;
    aiProviderDraft = {
      ...provider,
      models: (provider.models || []).join("\n"),
      api_key: "",
      editing: true,
    };
    renderSettings();
    return;
  }
  if (actionName === "ai-cancel-provider") { aiProviderDraft = null; renderSettings(); return; }
  if (actionName === "ai-save-provider") { await aiSaveProvider(); return; }
  if (actionName === "ai-test-provider") { await aiTestProvider(); return; }
  if (actionName === "ai-remove-provider") { await aiRemoveProvider(element?.dataset.provider || ""); return; }
  if (actionName === "ai-new-command") { aiCommandDraft = { name: "", prompt: "" }; renderSettings(); return; }
  if (actionName === "ai-edit-command") {
    const id = element?.dataset.command || "";
    const command = (aiConfig?.commands || []).find((item) => item.id === id);
    if (command) {
      aiCommandDraft = { ...command };
      renderSettings();
    }
    return;
  }
  if (actionName === "ai-cancel-command") { aiCommandDraft = null; renderSettings(); return; }
  if (actionName === "ai-save-command") { await aiSaveCommand(); return; }
  if (actionName === "ai-delete-command") { await aiDeleteCommand(element?.dataset.command || ""); return; }
  if (actionName === "ai-insert-command") { aiInsertCommand(element?.dataset.command || ""); return; }
  if (actionName === "ai-env-add") {
    document.querySelector(".ai-env-list")?.insertAdjacentHTML("beforeend", `<div class="ai-env-row" data-ai-env-row><input type="text" data-ai-env-name value="" placeholder="NAME" autocomplete="off"><input type="text" data-ai-env-value value="" placeholder="value" autocomplete="off"><button class="ai-row-remove" type="button" data-action="ai-env-remove" aria-label="Remove variable">×</button></div>`);
    return;
  }
  if (actionName === "ai-env-remove") { element?.closest("[data-ai-env-row]")?.remove(); return; }
  if (actionName === "ai-save-env") { await aiSaveEnvironment(); return; }
  if (actionName === "ai-save-runtime") { await aiSaveRuntime(); return; }
  if (actionName === "ai-clear-activity") {
    const ok = await confirmDialog({
      kicker: "AI activity",
      title: "Clear the activity log?",
      message: "Runs themselves are not touched. Only the local diagnostic log is emptied.",
      confirmLabel: "Clear",
      danger: true,
    });
    if (!ok) return;
    try {
      const data = await agentPost({ action: "clear_activity" });
      if (data.ok) { applyAiConfigPayload(data); renderSettings(); toast("Activity log cleared"); }
    } catch (error) {}
    return;
  }
  if (actionName === "ai-reset-config") {
    const ok = await confirmDialog({
      kicker: "AI settings",
      title: "Reset every AI setting?",
      message: "Models, providers, commands, instructions and runtime values return to defaults. Conversations are kept.",
      confirmLabel: "Reset",
      danger: true,
    });
    if (!ok) return;
    try {
      const data = await agentPost({ action: "reset_config" });
      if (data.ok) {
        applyAiConfigPayload(data);
        aiSettingsTab = "basic";
        aiProviderDraft = null;
        aiCommandDraft = null;
        renderSettings();
        toast("AI settings reset");
      }
    } catch (error) {}
    return;
  }
  if (actionName === "ai-open-folder") {
    try { await agentPost({ action: "open_ai_folder" }); } catch (error) {}
    return;
  }
  if (actionName === "ai-open-skill") {
    const path = element?.dataset.path || "";
    if (!path) return;
    try {
      const data = await agentPost({ action: "open_skill_folder", path });
      if (!data.ok) toast(data.error || "Could not open that folder", true);
    } catch (error) {}
    return;
  }
  if (actionName === "show-completed") {
    spinAchievementCounter(element);
    openCompletedLog();
    // Paint the sheet first; the bass swell must never hold the click up.
    afterNextPaint(() => AudioFX.bassFade());
    return;
  }
  if (actionName === "toggle-completed-subtasks") {
    if (performance.now() < suppressCompletedSubtaskToggleUntil) return;
    toggleCompletedSubtasks();
    return;
  }
  if (actionName === "toggle-pending-subtasks") { togglePendingSubtasks(); return; }
  if (actionName === "close-completed") { closeCompletedLog(); return; }
  if (actionName === "spin-windmill") {
    const symbol = document.querySelector(".archive-symbol");
    if (symbol) {
      symbol.classList.remove("spinning");
      void symbol.offsetWidth;
      symbol.classList.add("spinning");
      clearTimeout(symbol._windmillTimer);
      symbol._windmillTimer = setTimeout(() => symbol.classList.remove("spinning"), 1150);
    }
    return;
  }
  if (actionName === "close-archive") { AudioFX.categoryTap(); closeArchive(); return; }
  if (actionName === "open-pindou") { openPluginPanel("pindou"); return; }
  if (actionName === "open-palette") { openPluginPanel("palette"); return; }
  if (actionName === "open-postcard") { openPluginPanel("postcard"); return; }
  if (actionName === "open-community-shop") { openCommunityPlugin("plugins"); return; }
  if (actionName === "open-ai-settings") { openAiSettings(); return; }
  if (actionName === "open-forktree") { openPluginPanel("forktree"); return; }
  if (actionName === "toggle-plugin") {
    const pluginId = element?.dataset.pluginId || "";
    const plugin = pluginState(pluginId);
    if (plugin) setPluginEnabled(pluginId, !plugin.enabled);
    return;
  }
  if (actionName === "toggle-plugin-setting") {
    togglePluginSetting(element?.dataset.pluginId || "", element?.dataset.pluginSetting || "");
    return;
  }
  if (actionName === "set-plugin-choice") {
    setPluginChoice(
      element?.dataset.pluginId || "",
      element?.dataset.pluginSetting || "",
      element?.dataset.pluginValue || ""
    );
    return;
  }
  if (actionName === "plugin-menu") { openPluginMenu(element, element?.dataset.pluginId || ""); return; }
  if (actionName === "plugin-back") {
    pluginDetailId = null;
    pluginPendingUninstallId = null;
    renderSettings();
    const settingsScroll = pluginSurfaceScroll();
    if (settingsScroll) settingsScroll.scrollTop = 0;
    return;
  }
  if (actionName === "install-plugin") { installPlugin(element?.dataset.pluginId || ""); return; }
  if (actionName === "uninstall-plugin") { requestPluginUninstall(element?.dataset.pluginId || ""); return; }
  if (actionName === "confirm-plugin-uninstall") { confirmPluginUninstall(element?.dataset.pluginId || ""); return; }
  if (actionName === "cancel-plugin-uninstall") { pluginPendingUninstallId = null; renderSettings(); return; }
  if (actionName === "open-plugin") { openPluginFromSettings(element?.dataset.pluginId || ""); return; }
  if (actionName === "open-community") {
    openCommunityPlugin("plugins");
    return;
  }
  if (actionName === "close-community") { AudioFX.categoryTap(); closeCommunity(); return; }
  // Settings → Plugins is the installed-plugin manager; Community is the shop.
  if (actionName === "open-plugin-settings") {
    closeCommunity();
    openSettings("plugins");
    return;
  }
  if (actionName === "open-plugin-community") {
    openCommunityPlugin("plugins");
    return;
  }
  if (actionName === "open-plugin-list") {
    openCommunityPlugin("plugins");
    return;
  }
  if (actionName === "open-community-themes") {
    openCommunityPlugin("themes");
    return;
  }
  if (actionName === "open-theme-settings") {
    closeCommunity();
    openSettings("theme");
    return;
  }
  if (actionName === "community-section") {
    const next = element?.dataset.communitySection || "plugins";
    if (!COMMUNITY_SECTIONS.some((section) => section.id === next)) return;
    communitySection = next;
    pluginDetailId = null;
    pluginPendingUninstallId = null;
    pluginCommunityFilter = "all";
    pluginCommunityQuery = "";
    AudioFX.categoryTap();
    ensureCommunitySectionData();
    renderCommunity();
    const sectionScroll = $(".community-scroll");
    if (sectionScroll) sectionScroll.scrollTop = 0;
    return;
  }
  if (actionName === "refresh-plugin-catalog") { loadPluginCatalog(true); return; }
  if (actionName === "install-community-plugin") { installCommunityPlugin(element?.dataset.pluginId || ""); return; }
  if (actionName === "open-community-plugin") {
    const pluginId = element?.dataset.pluginId || "";
    if (!pluginEnabled(pluginId)) { toast("Turn the plugin on first", true); return; }
    closeCommunity();
    closeSettings();
    openPluginPanel(pluginId);
    return;
  }
  if (actionName === "open-achievement-plugin") {
    const pluginId = element?.dataset.pluginId || "";
    if (!achievementSlotVisible(pluginId)) return;
    spinAchievementCounter(element);
    AudioFX.timerTap();
    openPluginPanel(pluginId);
    return;
  }
  if (actionName === "install-plugin-archive") { choosePluginArchive(); return; }
  if (actionName === "open-plugins-folder") { silentAction("open_plugins_folder"); return; }
  if (actionName === "plugin-community-filter") {
    pluginCommunityFilter = element?.dataset.pluginFilter || "all";
    AudioFX.categoryTap();
    updatePluginCommunityResults();
    return;
  }
  if (actionName === "open-plugin-details") { openPluginSettingsPage(element?.dataset.pluginId || ""); return; }
  if (actionName === "open-trash") { openTrashDrawer(); return; }
  if (actionName === "close-trash") { closeTrashDrawer(); return; }
  if (actionName === "clear-trash") { clearTrash(); return; }
  if (actionName === "open-terminal") { toggleAgentTerminal(); return; }
  if (actionName === "toggle-doing-card") {
    if (doingPeekOpen) closeDoingPeek();
    else { refreshDoingZone(); openDoingPeek(); }
    AudioFX.cardWind();
    return;
  }
  if (actionName === "close-terminal") { closeAgentTerminal(); return; }
  if (actionName === "clear-agent") { clearAgent(); return; }
  if (actionName === "open-settings") { openSettings(); return; }
  if (actionName === "close-ai-settings") { closeAiSettings(); return; }
  if (actionName === "reveal-project-folder") { revealProjectFolder(); return; }
  if (actionName === "manage-project-folder") { openProjectFolderCard(); return; }
  if (actionName === "choose-project-folder") { revealProjectFolder(); return; }
  if (actionName === "clear-project-folder") { clearProjectFolder(); return; }
  if (actionName === "toggle-sound") { AudioFX.toggle(); updateSoundToggle(); renderSettings(); return; }
  if (actionName === "toggle-background-music") {
    BackgroundMusic.toggle();
    updateSoundToggle();
    renderSettings();
    return;
  }
  if (actionName === "preview-sound") {
    AudioFX.unlock();
    if (element?.dataset.soundKey) AudioFX.audition(element.dataset.soundKey);
    return;
  }
  if (actionName === "open-sounds-folder") {
    silentAction("open_sounds_folder").then((result) => {
      if (result && result.ok === false && result.error) toast(result.error, true);
    });
    return;
  }
  if (actionName === "import-theme-pack") { document.querySelector("[data-theme-pack-input]")?.click(); return; }
  if (actionName === "install-theme-pack") {
    installThemeFromCatalog(element?.dataset.themeId || "", element?.dataset.themeBundled === "1");
    return;
  }
  if (actionName === "apply-theme-pack") { applyThemePackById(element?.dataset.themeId || ""); return; }
  if (actionName === "remove-theme-pack") { removeThemePackById(element?.dataset.themeId || ""); return; }
  if (actionName === "open-theme-packs-folder") { silentAction("open_theme_packs_folder"); return; }
  if (actionName === "open-wallpaper-folder") {
    silentAction("open_wallpaper_folder").then((result) => {
      if (!result?.state || !adoptWallpaperShelfState(result.state.settings)) return;
      saveSettings();
      applySettings();
      if (settingsTab === "theme") renderSettings();
    });
    return;
  }
  if (actionName === "open-icon-themes-folder") { silentAction("open_icon_themes_folder"); return; }
  if (actionName === "open-note-themes-folder") { silentAction("open_note_themes_folder"); return; }
  if (actionName === "open-ai-themes-folder") { silentAction("open_ai_themes_folder"); return; }
  if (actionName === "open-theme-exports-folder") { silentAction("open_theme_exports_folder"); return; }
  if (actionName === "refresh-theme-catalog") { loadThemeCatalog(true); return; }
  if (actionName === "export-theme-pack") { exportCurrentThemePack(); return; }
  if (actionName === "reset-theme-sounds") { resetThemeSounds(); return; }
  if (actionName === "choose-wallpaper") { chooseWallpaperFile(); return; }
  if (actionName === "toggle-wallpaper-manage") {
    wallpaperManageOpen = !wallpaperManageOpen;
    renderSettings();
    // Opening Manage is the moment options are managed. Ask the shelf what
    // files still exist so a hand-deleted wallpaper leaves the picker.
    if (wallpaperManageOpen) syncWallpaperShelf();
    return;
  }
  if (actionName === "wallpaper-back") {
    // "Back" returns to the wallpaper the current theme ships with: a pack's
    // own picture when it has one, otherwise the postcard art.
    settings.wallpaper = themeWallpaperValue();
    saveSettings();
    applySettings();
    renderSettings();
    toast("Theme wallpaper");
    return;
  }
  if (actionName === "toggle-wallpaper-blur") {
    const on = settings.wallpaper_blur_on !== true;
    settings.wallpaper_blur_on = on;
    // A fresh switch with a zero amount would paint nothing: give the glass a
    // readable default the reader can then tune down.
    if (on && !(Number(settings.wallpaper_blur) > 0)) settings.wallpaper_blur = 30;
    saveSettings();
    applySettings();
    renderSettings();
    return;
  }
  if (actionName === "toggle-wallpaper-cards") {
    settings.wallpaper_cards = settings.wallpaper_cards === false;
    saveSettings();
    applySettings();
    renderSettings();
    toast(settings.wallpaper_cards ? "Wallpaper cards on" : "Wallpaper cards off");
    return;
  }
  if (actionName === "clear-wallpaper") {
    // "No wallpaper" is a real choice: the postcard paper shows through.
    settings.wallpaper = "";
    saveSettings();
    applySettings();
    renderSettings();
    toast("Wallpaper cleared");
    return;
  }
  if (actionName === "choose-sticker-image") {
    const id = element?.dataset.stickerId || "";
    if (!availableStickerTargets().some((target) => target.id === id)) return;
    const input = document.querySelector(`[data-sticker-input="${CSS.escape(id)}"]`);
    input?.click();
    return;
  }
  if (actionName === "reset-sticker-image") {
    const id = element?.dataset.stickerId || "";
    if (settings.sticker_backgrounds && id in settings.sticker_backgrounds) {
      delete settings.sticker_backgrounds[id];
      saveSettings();
      applyStickerBackgrounds();
      renderSettings();
      toast("Default sticker restored");
    }
    return;
  }
  if (actionName === "open-note-materials-folder") { silentAction("open_note_materials_folder"); return; }
  if (actionName === "toggle-note-material-menu") {
    noteMaterialMenuOpen = !noteMaterialMenuOpen;
    renderSettings();
    return;
  }
  if (actionName === "close-settings") { closeSettings(); return; }
  if (actionName === "toggle-show-clock") {
    settings.show_clock = !settings.show_clock;
    saveSettings();
    applySettings();
    renderSettings();
    return;
  }
  if (actionName === "toggle-show-brand") {
    settings.show_brand = settings.show_brand === false;
    saveSettings();
    applySettings();
    renderSettings();
    return;
  }
  if (actionName === "toggle-show-achievements") {
    settings.show_achievements = settings.show_achievements === false;
    saveSettings();
    applySettings();
    renderSettings();
    return;
  }
  if (actionName === "toggle-theme-others") {
    themeOthersOpen = !themeOthersOpen;
    renderSettings();
    return;
  }
  if (actionName === "toggle-theme-manage") {
    themeManageOpen = !themeManageOpen;
    if (!themeManageOpen) {
      customThemeEditorOpen = false;
      customThemeDraft = null;
    }
    renderSettings();
    return;
  }
  if (actionName === "toggle-font-manage") {
    const kind = element?.dataset?.fontManage === "note" ? "note" : "body";
    fontManageOpen[kind] = !fontManageOpen[kind];
    renderSettings();
    return;
  }
  if (actionName === "toggle-custom-themes") {
    customThemesOpen = !customThemesOpen;
    pendingCustomThemeDeleteId = null;
    if (!customThemesOpen) {
      customThemeEditorOpen = false;
      customThemeDraft = null;
    }
    renderSettings();
    return;
  }
  if (actionName === "new-custom-theme") {
    customThemesOpen = true;
    themeManageOpen = true;
    customThemeEditorOpen = true;
    pendingCustomThemeDeleteId = null;
    customThemeDraft = defaultCustomThemeDraft();
    renderSettings();
    const nameInput = $("[data-custom-theme-name]");
    if (nameInput) {
      nameInput.focus();
      nameInput.select();
    }
    return;
  }
  if (actionName === "cancel-custom-theme") {
    customThemeEditorOpen = false;
    customThemeDraft = null;
    customThemeBusy = false;
    renderSettings();
    return;
  }
  if (actionName === "save-custom-theme") { saveCustomTheme(); return; }
  if (actionName === "delete-custom-theme") {
    pendingCustomThemeDeleteId = element?.dataset.themeId || "";
    renderSettings();
    return;
  }
  if (actionName === "confirm-custom-theme-delete") {
    const id = element?.dataset.themeId || pendingCustomThemeDeleteId || "";
    pendingCustomThemeDeleteId = null;
    if (id) removeThemePackById(id, { skipConfirm: true });
    return;
  }
  if (actionName === "cancel-custom-theme-delete") {
    pendingCustomThemeDeleteId = null;
    renderSettings();
    return;
  }
  if (actionName === "toggle-time-cost") {
    settings.show_time_cost = !settings.show_time_cost;
    saveSettings();
    applySettings();
    renderSettings();
    renderStage();
    return;
  }
  if (actionName === "reset-highlight-color") {
    // Empty means "let the page's font ink paint the wash again".
    settings.highlight = "";
    saveSettings();
    applySettings();
    renderSettings();
    return;
  }
  if (actionName.startsWith("baseline-rows-")) {
    const mode = actionName.slice("baseline-rows-".length);
    if (BASELINE_ROW_MODES.includes(mode)) {
      saveBaselineRowRule({ mode }, { immediate: true });
      renderSettings();
    }
    return;
  }
  if (actionName === "toggle-caret-blink") {
    settings.caret_blink = !settings.caret_blink;
    saveSettings();
    applySettings();
    renderSettings();
    scheduleCustomCaret();
    return;
  }
  if (actionName === "toggle-ai-caret-blink") {
    settings.ai_caret_blink = !settings.ai_caret_blink;
    saveSettings();
    applySettings();
    renderSettings();
    scheduleCustomCaret();
    return;
  }
  if (actionName === "toggle-shared-caret-blink") {
    // The shared unit shows the note caret's state and turns that state on for
    // both panes, so one click always flips what the box displays.
    const next = !settings.caret_blink;
    settings.caret_blink = next;
    settings.ai_caret_blink = next;
    saveSettings();
    applySettings();
    renderSettings();
    scheduleCustomCaret();
    return;
  }
  if (actionName === "hide-notes") {
    hideNotesPanel();
    return;
  }
  if (actionName === "notes-button") {
    if (notesStretchSuppressClick) { notesStretchSuppressClick = false; return; }
    if (notesHidden) showNotesPanel();
    else hideNotesPanel();
    return;
  }
  if (actionName === "open-archive") { openArchive(); return; }
  if (actionName === "collapse-archive-card") { expandedArchiveCardId = null; renderArchive(); return; }
  if (actionName === "open-timer") {
    if (!achievementSlotVisible("pomodoro")) { toast("Turn on the Pomodoro plugin to use the tomato clock", true); return; }
    AudioFX.timerTap();
    openFocusTimer();
    return;
  }
  if (actionName === "open-timer-achievement") {
    if (!achievementSlotVisible("pomodoro")) return;
    spinAchievementCounter(element);
    openFocusAchievements();
    afterNextPaint(() => AudioFX.guitarPluck());
    return;
  }
  if (actionName === "close-timer") { closeFocusTimer(); return; }
  if (actionName === "quit-app") {
    persistAction("quit").then(() => {
      try { window.close(); } catch (error) {}
    });
    return;
  }
  if (actionName === "note-preview") {
    await flushNoteSave();
    notesPreview = !notesPreview;
    renderNotesPanel();
    return;
  }
  if (actionName === "note-current") {
    await flushNoteSave();
    selectedHistoryId = null;
    selectedSubtaskId = null;
    notesPreview = false;
    updateHistorySelection();
    updateSubtaskSelection();
    renderNotesPanel();
    return;
  }
  if (actionName === "note-task") {
    await flushNoteSave();
    selectedSubtaskId = null;
    notesPreview = false;
    updateSubtaskSelection();
    renderNotesPanel();
    return;
  }
  if (actionName === "choose-note-bg-custom") { $("#note-bg-input")?.click(); return; }
  if (actionName === "add-category") {
    const name = await promptDialog({ title: "Name a new space", message: "A place for a kind of work, a kind of life.", placeholder: "e.g. Literature", confirmLabel: "Add", sound: "train" });
    if (name) await action("add_category", { name, ...(forkRootId ? { fork_root: forkRootId } : {}) });
    return;
  }
  if (actionName === "rename-category") {
    const category = currentCategoryById(element.dataset.id) || selectedCategory();
    if (!category) return;
    const name = await promptDialog({ kicker: "Rename category", title: "Rename this space", value: category.name });
    if (name) await action("rename_category", { id: category.id, name });
    return;
  }
  if (actionName === "delete-category") {
    const category = currentCategoryById(element.dataset.id) || selectedCategory();
    if (!category) return;
    const ok = await confirmDialog({ kicker: "Delete category", title: `Delete “${category.name}”?`, message: "Only an empty category can be removed.", confirmLabel: "Delete", danger: true });
    if (ok) { const result = await action("delete_category", { id: category.id }); if (result.ok) toast("Category removed"); }
    return;
  }
  if (actionName === "add-todo") {
    AudioFX.categoryTap();
    await flushNoteSave();
    const category = selectedCategory();
    if (!category) return;
    if (category.todos.some((item) => !item.done)) {
      toast("Complete the current todo first", true);
      return;
    }
    const name = await promptDialog({ title: "What is the next thing?", placeholder: "e.g. Finish the first chapter", confirmLabel: "Add" });
    if (name) {
      selectedHistoryId = null;
      selectedSubtaskId = null;
      notesPreview = false;
      const result = await action("add_todo", { category_id: category.id, name });
      if (result?.ok) {
        AudioFX.confirmCarriage();
        await attachPendingProjectFolder(result);
      }
    }
    return;
  }
  if (actionName === "rename-todo") {
    const category = selectedCategory();
    const todo = category?.todos.find((item) => item.id === element.dataset.id);
    if (!todo) return;
    const name = await promptDialog({ kicker: "Rename todo", title: "Give it a clearer name", value: todo.name });
    if (name) await action("rename_todo", { id: todo.id, name });
    return;
  }
  if (actionName === "add-subtask") {
    AudioFX.categoryTap();
    const category = selectedCategory();
    const todo = category?.todos.find((item) => item.id === element?.dataset?.id && !item.done)
      || category?.todos.find((item) => !item.done);
    if (!todo) return;
    // The add row is drawn at the top of the pending lane, exactly where the
    // finished-subtask card floats. Close that card first so the inline input
    // spans the full row instead of being clipped by the card on its right.
    completedSubtasksOpen = false;
    addingSubtask = true;
    addingSubtaskTodoId = todo.id;
    renderStage();
    return;
  }
  if (actionName === "complete") {
    AudioFX.categoryTap();
    await flushNoteSave();
    const category = selectedCategory();
    const todo = category?.todos.find((item) => item.id === element.dataset.id);
    if (!todo) return;
    if ((todo.subtasks || []).some((subtask) => !subtask.done)) {
      toast("Complete the subtasks below first", true);
      return;
    }
    const ok = await confirmDialog({ kicker: "A small completion", title: "Complete todo", message: `Are you sure “${todo.name}” is complete? This cannot be undone.`, confirmLabel: "Complete" });
    if (!ok) return;
    const previousTrophy = Number(state.data?.trophy_count) || 0;
    trophyDisplayHold = previousTrophy;
    const result = await action("complete_todo", { id: todo.id });
    if (result.ok) {
      finishedToast();
      startTrophyCelebration(previousTrophy);
      celebrate();
      historyScrollTop = 0;
      historyExpanded = new Set();
      selectedHistoryId = null;
      selectedSubtaskId = null;
      notesPreview = false;
      historyCursor = 0;
      renderStage();
    } else {
      trophyDisplayHold = null;
    }
    return;
  }
  if (actionName === "complete-subtask") {
    const todoId = element.dataset.todoId;
    const subtaskId = element.dataset.subtaskId;
    const category = selectedCategory();
    const todo = category?.todos.find((item) => item.id === todoId);
    const subtask = todo?.subtasks?.find((item) => item.id === subtaskId);
    if (!subtask || subtask.done) return;
    // A spinning fan means a running agent: clicking it pauses the agent
    // instead of finishing the subtask.
    if (agentIsRunning(`subtask:${subtaskId}`)) {
      pauseSubtaskAgent(subtaskId);
      return;
    }
    // One click finishes the subtask directly: no confirmation and no toast.
    if (justCompletedSubtaskId === subtaskId) return;
    AudioFX.categoryTap();
    justCompletedSubtaskId = subtaskId;
    // The row is leaving the pending lane, so its selection leaves with it: the
    // accent wash marks where the reader is working, and keeping the id would
    // hand that wash to the finished row in the tray (the flight crosses the
    // page, then the row lands already highlighted). If the request fails, the
    // row never left and the selection comes back.
    const wasSelected = selectedSubtaskId === subtaskId;
    if (wasSelected) selectedSubtaskId = null;
    // The request and the stage repaint take a beat; answer the click at once
    // so the row never looks frozen while it waits to fly.
    const completingRow = element.closest(".current-subtask");
    completingRow?.classList.add("subtask-completing");
    // Safety: if the reply never repaints this row, put it back at rest.
    setTimeout(() => completingRow?.classList.remove("subtask-completing"), 1200);
    const result = await action("complete_subtask", { todo_id: todoId, subtask_id: subtaskId });
    if (result.ok) {
      delete subtaskAgentModels[subtaskId];
      saveSubtaskAgentModels();
      updateSubtaskAgentDom(subtaskId, { model: "" });
      AudioFX.itemGet();
      // The land animation and the written-in check belong to the flight (see
      // flyCompletedRow). Playing them on the row that the repaint is about to
      // replace only forced an extra style pass before the repaint.
    } else {
      document.querySelector(`.current-subtask[data-subtask-id="${CSS.escape(subtaskId)}"]`)?.classList.remove("subtask-completing");
      if (wasSelected) selectedSubtaskId = subtaskId;
      justCompletedSubtaskId = null;
    }
    return;
  }
  if (actionName === "remove-samples") {
    const ok = await confirmDialog({ kicker: "Sample cards", title: "Remove sample postcards?", message: "The blank preview cards will leave the archive. Your real week cards stay.", confirmLabel: "Remove samples", danger: true });
    if (!ok) return;
    const result = await action("remove_samples");
    if (result.ok) { toast("Sample cards removed"); renderArchive(); }
  }
}

function celebrate() {
  const symbols = ["✦", "✧", "❖"];
  for (let i = 0; i < 9; i += 1) {
    const node = document.createElement("span");
    if (i === 0) node.innerHTML = completedIcon();
    else node.textContent = symbols[i % symbols.length];
    node.style.cssText = `position:fixed;z-index:300;pointer-events:none;left:${48 + Math.random() * 14}%;top:${42 + Math.random() * 12}%;font-size:${12 + Math.random() * 14}px;color:${i % 2 ? "#e8c37a" : "#f9e2af"};opacity:.9;transition:transform 1.2s cubic-bezier(.2,.8,.2,1),opacity 1.2s ease;`;
    document.body.appendChild(node);
    requestAnimationFrame(() => {
      node.style.transform = `translate(${(Math.random() - .5) * 180}px, ${-80 - Math.random() * 120}px) rotate(${(Math.random() - .5) * 60}deg)`;
      node.style.opacity = "0";
    });
    setTimeout(() => node.remove(), 1400);
  }
}

function openPostcard(cardId, { auto = false } = {}) {
  const cards = [...(state.data.archive || [])].sort((a, b) => String(a.week_start).localeCompare(String(b.week_start)));
  const index = cards.findIndex((card) => card.id === cardId);
  if (index < 0) return;
  postcard = { cards, index, auto };
  if (auto) {
    silentAction("mark_seen", { all: true }).then((result) => {
      if (result?.state) { state.data = result.state; renderArchive(); }
    });
  } else {
    silentAction("mark_seen", { card_id: cardId }).then((result) => {
      if (result?.state) { state.data = result.state; renderArchive(); }
    });
  }
  renderPostcard();
}

function closePostcard() {
  postcard = null;
  $("#modal-root").innerHTML = "";
}

function postcardArticleHtml(card, doneIcon = completedIcon()) {
  const theme = themeOf(card);
  const items = card.items || [];
  const startDate = parseDate(card.week_start);
  const end = parseDate(card.week_end);
  const year = end?.getFullYear() ?? startDate?.getFullYear() ?? "";
  const week = card.week || (startDate ? Math.ceil((((startDate - new Date(startDate.getFullYear(), 0, 1)) / 86400000) + new Date(startDate.getFullYear(), 0, 1).getDay() + 1) / 7) : 0);
  const dateRange = `${fmtShort(card.week_start)} — ${fmtShort(card.week_end)}, ${year}`;
  const count = items.length;
  const variables = `--paper:${theme.paper};--paper2:${theme.paper2};--ink:${theme.ink};--muted:${theme.muted};--accent:${theme.accent};--accent2:${theme.accent2};--border:${theme.border};--stamp:${theme.stamp};--glow:${theme.glow};--display:${theme.display};--body:${theme.body};`;
  const itemRows = items.length
    ? items.map((item) => `<li class="pc-item"><span class="pc-trophy">${doneIcon}</span><span class="pc-cat" style="--cat:${esc(item.color || theme.accent)};--cat-bg:${colorTint(item.color || theme.accent)}"><span class="pc-cat-dot"></span>${esc(item.category || "Untitled")}</span><span class="pc-name">${esc(item.name)}</span></li>`).join("")
    : "";
  const empty = items.length ? "" : `<div class="pc-empty">A quiet week — nothing checked off.</div>`;
  return `<article class="postcard simple ${theme.airmail ? "airmail" : ""}" style="${variables}">
    <div class="postcard-inner">
      <div class="pc-simple-head">
        <div>
          <div class="pc-simple-week">WEEK ${String(week).padStart(2, "0")}</div>
          <div class="pc-simple-range">${dateRange}</div>
        </div>
        <div class="pc-simple-count">${count}<span>thing${count === 1 ? "" : "s"} done</span></div>
      </div>
      <div class="pc-rule"></div>
      <div class="pc-sub">Things you did this week</div>
      <ul class="pc-items">${itemRows}</ul>
      ${empty}
      <div class="pc-simple-foot">A week worth remembering.</div>
    </div>
  </article>`;
}

function archivePostcardHtml(card) {
  return `<div class="archive-postcard" data-archive-card="${esc(card.id)}">${postcardArticleHtml(card)}</div>`;
}

function renderPostcard() {
  if (!postcard) return;
  const card = postcard.cards[postcard.index];
  if (!card) { closePostcard(); return; }
  const theme = themeOf(card);
  // The viewer chrome follows the card's own postcard palette, not the app
  // theme that happens to be active behind it.
  const palette = `--pc-paper:${theme.paper};--pc-paper2:${theme.paper2};--pc-ink:${theme.ink};--pc-muted:${theme.muted};--pc-accent:${theme.accent};--pc-accent2:${theme.accent2};--pc-border:${theme.border};`;
  $("#modal-root").innerHTML = `
    <div class="postcard-stage" style="${palette}">
      <div class="postcard-deck">
        ${postcardArticleHtml(card)}
        <button class="postcard-nav prev" type="button" data-action="prev-postcard" aria-label="Previous postcard">‹</button>
        <button class="postcard-close" type="button" data-action="close-postcard" aria-label="Close postcard"></button>
        <button class="postcard-nav next" type="button" data-action="next-postcard" aria-label="Next postcard">›</button>
      </div>
    </div>`;
  silentAction("mark_seen", { card_id: card.id });
}

function postcardNav(delta) {
  if (!postcard) return;
  postcard.index = (postcard.index + delta + postcard.cards.length) % postcard.cards.length;
  renderPostcard();
}

function maybeAutoPostcard() {
  const archive = state.data.archive || [];
  const unseen = archive.filter((card) => !card.seen);
  if (!unseen.length) return;
  const latest = unseen[unseen.length - 1];
  openPostcard(latest.id, { auto: true });
}

function loadSettings() {
  let saved = state.data?.settings && typeof state.data.settings === "object" ? state.data.settings : null;
  let local = null;
  try { local = JSON.parse(localStorage.getItem("neotodo.settings") || "null"); } catch (error) {}
  if (local && typeof local === "object") {
    const backendTime = Number(saved?.saved_at) || 0;
    const localTime = Number(local.saved_at) || 0;
    // The freshest copy wins, so a quick edit never gets reverted by the file.
    if (!saved || localTime > backendTime) saved = local;
  }
  // The plugin switches live in per-plugin records. Older backends validated
  // the settings field by field and silently dropped `plugins`, so their copy
  // could be newer than localStorage yet carry no switch state at all — every
  // plugin then booted on. Keep the device copy's records for any plugin the
  // newer copy does not describe, and only let explicit values win.
  if (saved && typeof saved === "object" && local && typeof local === "object") {
    const asRecords = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : null;
    const backendPlugins = asRecords(saved.plugins);
    const localPlugins = asRecords(local.plugins);
    if (localPlugins) {
      const merged = { ...(backendPlugins || {}) };
      for (const [id, localRecord] of Object.entries(localPlugins)) {
        if (!localRecord || typeof localRecord !== "object") continue;
        const backendRecord = asRecords(merged[id]);
        if (!backendRecord) {
          merged[id] = { ...localRecord };
          continue;
        }
        // `settings` is a bag of small values, not one atomic field: a backend
        // copy that simply lacks a key must not wipe the device's own choice.
        merged[id] = {
          ...localRecord,
          ...backendRecord,
          settings: {
            ...(asRecords(localRecord.settings) || {}),
            ...(asRecords(backendRecord.settings) || {}),
          },
        };
      }
      saved = { ...saved, plugins: merged };
    }
  }
  // The saved choice is authoritative — an empty `wallpaper` is a real
  // choice (theme paper). Only data written before the single choice existed
  // is folded in from the retired static/dynamic shelf.
  const savedHasWallpaper = saved && typeof saved === "object" && "wallpaper" in saved;
  const savedLegacyWallpaper = saved && typeof saved === "object" && !savedHasWallpaper
    && ("wallpaper_mode" in saved || "wallpaper_static" in saved);
  settings = { ...DEFAULT_SETTINGS, ...(saved && typeof saved === "object" ? saved : {}) };
  settings.theme = "postcard";
  if (settings.postcard !== "random" && !THEMES[settings.postcard]) settings.postcard = "light";
  if (!THEMES[settings.resolved_postcard]) {
    settings.resolved_postcard = THEMES[settings.postcard] ? settings.postcard : "light";
  }
  if (settings.postcard !== "random" && THEMES[settings.postcard]) {
    settings.resolved_postcard = settings.postcard;
  }
  if (settings.postcard === "random") settings.postcard = settings.resolved_postcard || "light";
  const savedLight = saved && typeof saved === "object" ? saved.light_postcard : undefined;
  const savedDark = saved && typeof saved === "object" ? saved.dark_postcard : undefined;
  if (!THEMES[savedLight] || postcardIsDark(savedLight)) {
    settings.light_postcard = "light";
  }
  if (!THEMES[savedDark] || !postcardIsDark(savedDark)) {
    settings.dark_postcard = "dark";
  }
  settings.scale = Math.min(1.25, Math.max(0.85, Number(settings.scale) || 1));
  // Typography now owns two explicit sizes. The old percentage slider was a
  // single `scale`; fold it into the body size so upgrading keeps the same
  // look, and let a saved px value win from then on.
  const savedBodySize = Math.round(Number(settings.body_font_size));
  settings.body_font_size = Number.isFinite(savedBodySize) && savedBodySize > 0
    ? Math.min(20, Math.max(14, savedBodySize))
    : Math.round(settings.scale * 16);
  const savedNoteSize = Math.round(Number(settings.note_font_size));
  settings.note_font_size = Number.isFinite(savedNoteSize) && savedNoteSize > 0
    ? Math.min(28, Math.max(10, savedNoteSize))
    : 14;
  if (!/^#[0-9a-f]{6}$/i.test(String(settings.body_font_color || ""))) settings.body_font_color = "";
  if (!/^#[0-9a-f]{6}$/i.test(String(settings.note_font_color || ""))) settings.note_font_color = "";
  settings.show_time_cost = settings.show_time_cost === true;
  settings.show_clock = settings.show_clock !== false;
  settings.show_brand = settings.show_brand !== false;
  settings.show_achievements = settings.show_achievements !== false;
  settings.focus_count = Math.max(0, Math.floor(Number(settings.focus_count) || 0));
  if (!Array.isArray(settings.focus_log)) settings.focus_log = [];
  if (!FONT_OPTIONS.some((font) => font.id === settings.font)) settings.font = "serif";
  if (!FONT_OPTIONS.some((font) => font.id === settings.note_font)) settings.note_font = "serif";
  settings.caret_blink = settings.caret_blink === true;
  if (settings.caret_shape !== "block") settings.caret_shape = "line";
  if (!/^#[0-9a-f]{6}$/i.test(String(settings.caret_color || ""))) settings.caret_color = "#1b1b1b";
  settings.ai_caret_blink = settings.ai_caret_blink !== false;
  if (settings.ai_caret_shape !== "block") settings.ai_caret_shape = "line";
  if (!/^#[0-9a-f]{6}$/i.test(String(settings.ai_caret_dark || ""))) settings.ai_caret_dark = "#f4f6f8";
  if (!/^#[0-9a-f]{6}$/i.test(String(settings.ai_caret_light || ""))) settings.ai_caret_light = "#1b1b1b";
  // An empty highlight is a choice: the active theme keeps its own wash.
  if (settings.highlight && !normalizeHighlightColorInput(settings.highlight)) settings.highlight = "";
  // One note style only: the beige `default` sticky note. A saved Paper /
  // Glass / Focus surface or a custom material from an older build is ignored.
  settings.note_material = "paper";
  settings.note_material_file = "paper.css";
  // Pane themes: fall back to the built-in choice if a downloaded pack was
  // removed since the last launch.
  const noteIds = new Set(noteThemeChoices().map((choice) => choice.id));
  if (!noteIds.has(settings.note_theme)) settings.note_theme = "default";
  const aiIds = new Set(aiThemeChoices().map((choice) => choice.id));
  if (!aiIds.has(settings.ai_theme)) settings.ai_theme = "auto";
  const background = typeof settings.note_background === "string" ? settings.note_background : "";
  if (background.startsWith("data:")) {
    settings.note_background_image = background;
    settings.note_background = "__custom";
  } else if (["", "__custom"].includes(background)) {
    settings.note_background = background;
  } else {
    settings.note_background = "";
  }
  if (typeof settings.note_background_image !== "string" || settings.note_background_image.length > 8_000_000) {
    settings.note_background_image = "";
  }
  if (settings.note_background === "__custom" && !settings.note_background_image) settings.note_background = "";
  // An older build could leave a saved image with an empty selection; the
  // mask then fell back to the app theme. Restore the notebook's own cover.
  if (settings.note_material === "blur" && settings.note_background === "" && settings.note_background_image) {
    settings.note_background = "__custom";
  }
  settings.note_blur = Math.min(40, Math.max(0, Math.round(Number(settings.note_blur) || 16)));
  const stickerBackgrounds = {};
  if (settings.sticker_backgrounds && typeof settings.sticker_backgrounds === "object") {
    for (const target of STICKER_TARGETS) {
      const item = settings.sticker_backgrounds[target.id];
      if (!item || typeof item !== "object") continue;
      if (typeof item.image !== "string" || !item.image.startsWith("data:image/") || item.image.length > 4_000_000) continue;
      stickerBackgrounds[target.id] = {
        image: item.image,
        zoom: Math.min(2.6, Math.max(1, Number(item.zoom) || 1)),
        x: Math.min(100, Math.max(0, Number(item.x ?? 50))),
        y: Math.min(100, Math.max(0, Number(item.y ?? 50))),
      };
    }
  }
  settings.sticker_backgrounds = stickerBackgrounds;
  const pictureName = (value, pattern) => typeof value === "string" && pattern.test(value) && !value.includes("/") && !value.includes("\\") && !value.includes("..") ? value : "";
  // One wallpaper choice: a picture the reader picked (an absolute path), a
  // legacy bare file name from the old pictures folder, a built-in postcard
  // art (`art:<id>`) or a theme-pack picture (`theme:<id>`).
  const normalizeWallpaperValue = (value) => {
    if (typeof value !== "string") return "";
    const text = value.trim();
    if (text.startsWith("art:")) {
      const id = text.slice(4);
      return THEMES[id] && typeof THEMES[id].art === "function" ? `art:${id}` : "";
    }
    if (text.startsWith("theme:")) {
      const id = text.slice(6);
      return /^[a-z0-9][a-z0-9-]{0,63}$/.test(id) ? `theme:${id}` : "";
    }
    if (wallpaperIsFilePath(text)) return text;
    if (WALLPAPER_IMAGE_RE.test(text) || WALLPAPER_VIDEO_RE.test(text)) {
      return wallpaperIsPictureName(text) ? text : "";
    }
    return "";
  };
  settings.wallpaper = normalizeWallpaperValue(settings.wallpaper);
  // Wallpaper glass: the blur amount is the 0..100 number the reader sees in
  // Settings, and the switch decides whether the frosted mask is painted at all.
  settings.wallpaper_blur = Math.min(100, Math.max(0, Math.round(Number(settings.wallpaper_blur) || 0)));
  settings.wallpaper_blur_on = settings.wallpaper_blur_on === true;
  // Cards built out of the wallpaper are the default scheme: a still picture
  // bakes a card-sized piece from the room where the card sits, a film bakes
  // its middle frame. Turning it off returns the cards to their own paper.
  settings.wallpaper_cards = settings.wallpaper_cards !== false;
  // Older builds kept a static and a dynamic shelf. Fold whichever one was in
  // use into the single choice so an upgrade keeps the same room.
  const legacyStatic = (() => {
    const raw = typeof settings.wallpaper_static === "string" ? settings.wallpaper_static : "";
    if (raw.startsWith("art:")) {
      const id = raw.slice(4);
      return THEMES[id] ? `art:${id}` : "";
    }
    if (raw.startsWith("theme:")) {
      const id = raw.slice(6);
      return themePacks.some((pack) => pack.id === id && pack.wallpaper) ? `theme:${id}` : "";
    }
    return pictureName(raw, WALLPAPER_IMAGE_RE);
  })();
  const legacyDynamic = pictureName(settings.wallpaper_dynamic, WALLPAPER_VIDEO_RE);
  if (!settings.wallpaper) {
    if (savedLegacyWallpaper) {
      if (settings.wallpaper_mode === "dynamic" && legacyDynamic) settings.wallpaper = legacyDynamic;
      else if (settings.wallpaper_mode !== "none") settings.wallpaper = legacyStatic;
    } else if (!savedHasWallpaper) {
      // A first launch keeps the postcard look: the room's paper is the theme,
      // and no file has been picked yet.
      settings.wallpaper = `art:${currentPostcardId()}`;
    }
  }
  // The recent shelf is only a convenience: keep the paths that are still
  // pictures or films, newest first, without duplicates.
  settings.wallpaper_recent = (() => {
    const raw = Array.isArray(settings.wallpaper_recent) ? settings.wallpaper_recent : [];
    const seen = new Set();
    const recent = [];
    for (const item of raw) {
      const name = normalizeWallpaperValue(item);
      if (!name || !wallpaperIsLocalFile(name) || seen.has(name)) continue;
      seen.add(name);
      recent.push(name);
      if (recent.length >= WALLPAPER_RECENT_LIMIT) break;
    }
    return recent;
  })();
  const soundOverrides = {};
  if (settings.sound_overrides && typeof settings.sound_overrides === "object" && !Array.isArray(settings.sound_overrides)) {
    for (const [key, url] of Object.entries(settings.sound_overrides)) {
      if (!(key in AudioFX.sampleFiles()) || typeof url !== "string") continue;
      if (!url.startsWith("/theme-assets/") && !url.startsWith("/user-sounds/")) continue;
      soundOverrides[key] = url;
    }
  }
  settings.sound_overrides = soundOverrides;
  const wantedSoundStyle = String(settings.sound_style || "classical");
  settings.sound_style = soundStyleById(wantedSoundStyle).id;
  // We no longer keep the static/dynamic switch: a single `wallpaper` choice
  // covers both. Remove the retired keys from the saved settings so nothing
  // stale is written back to disk.
  delete settings.wallpaper_mode;
  delete settings.wallpaper_static;
  delete settings.wallpaper_dynamic;
  // Plugins are installed through Community → 插件. Existing notebooks keep
  // their bundled plugins after upgrading; opt-in plugins such as the tomato
  // clock start uninstalled until the reader adds them from Community.
  const savedPlugins = settings.plugins && typeof settings.plugins === "object" && !Array.isArray(settings.plugins)
    ? settings.plugins
    : {};
  settings.plugins = { ...savedPlugins };
  for (const plugin of Object.values(PLUGIN_REGISTRY)) {
    const savedPlugin = settings.plugins[plugin.id];
    const pluginRecord = savedPlugin && typeof savedPlugin === "object" ? savedPlugin : {};
    if (typeof pluginRecord.installed !== "boolean") pluginRecord.installed = plugin.defaultInstalled !== false;
    pluginRecord.enabled = pluginRecord.installed && pluginRecord.enabled !== false;
    pluginRecord.settings = normalizePluginSettings(plugin, pluginRecord.settings);
    settings.plugins[plugin.id] = pluginRecord;
  }
  // Every plugin record is final at this point, so page-chrome plugins can
  // repaint with the values the reader saved last time.
  notifyPluginSettings();
}

function resolveRandomPostcard() {
  if (settings.postcard === "random") {
    if (!randomPicked) {
      settings.resolved_postcard = randomPostcardId(settings.resolved_postcard);
      randomPicked = true;
      saveSettings();
    }
  } else if (THEMES[settings.postcard]) {
    settings.resolved_postcard = settings.postcard;
  }
}

function hexToRgb(value) {
  const hex = String(value || "").replace("#", "");
  if (hex.length === 3) {
    return `${parseInt(hex[0] + hex[0], 16)}, ${parseInt(hex[1] + hex[1], 16)}, ${parseInt(hex[2] + hex[2], 16)}`;
  }
  if (hex.length !== 6) return "184, 140, 255";
  return `${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}`;
}

function colorTint(value, alpha = 0.16) {
  const rgb = hexToRgb(value);
  return `rgba(${rgb}, ${alpha})`;
}

function hexLuminance(value) {
  const hex = String(value || "").replace("#", "");
  if (hex.length !== 6) return 0.5;
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function themeMaskColor(theme, alpha) {
  const paper = hexLuminance(theme.paper2 || theme.paper || "#14101d");
  const base = paper < 0.42 ? (theme.paper2 || theme.paper || "#14101d") : (theme.ink || "#14101d");
  return `rgba(${hexToRgb(base)}, ${alpha})`;
}

function mixHex(a, b, amount) {
  const parse = (value) => {
    const hex = String(value || "").replace("#", "");
    if (hex.length === 3) return [parseInt(hex[0] + hex[0], 16), parseInt(hex[1] + hex[1], 16), parseInt(hex[2] + hex[2], 16)];
    if (hex.length !== 6) return [0, 0, 0];
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  };
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const t = Math.max(0, Math.min(1, amount));
  const toHex = (value) => Math.round(value).toString(16).padStart(2, "0");
  return `#${toHex(r1 + (r2 - r1) * t)}${toHex(g1 + (g2 - g1) * t)}${toHex(b1 + (b2 - b1) * t)}`;
}

function readableAccent(theme, accent) {
  const paper = hexLuminance(theme.paper || "#ffffff");
  const lum = hexLuminance(accent);
  if (paper > 0.52 && lum > 0.52) return mixHex(accent, theme.ink || "#3b2c28", 0.55);
  if (paper < 0.45 && lum < 0.34) return mixHex(accent, "#ffffff", 0.36);
  return accent;
}


function saveSettings() {
  // Stamp every edit so a stale copy can never win on the next launch.
  settings.saved_at = Date.now();
  try { localStorage.setItem("neotodo.settings", JSON.stringify(settings)); } catch (error) {}
  clearTimeout(settingsSaveTimer);
  settingsSaveTimer = setTimeout(() => {
    settingsSaveTimer = null;
    if (state.data) persistAction("save_settings", { settings });
  }, 80);
}

function flushSettingsSave() {
  clearTimeout(settingsSaveTimer);
  settingsSaveTimer = null;
  if (state.data) return persistAction("save_settings", { settings });
  return Promise.resolve(null);
}

// ---------------------------------------------------------------------------
// Pane themes — the notebook and the AI console each own a palette.
// ---------------------------------------------------------------------------
const AI_BUILTIN_PALETTES = {
  light: {
    bg: "#ffffff", soft: "#f4f4f5", ink: "#171718", inkSoft: "#4a4a52",
    muted: "#7c7c83", faint: "#b4b4bb", line: "#ececee", lineStrong: "#c6c6cd",
    accent: "#4f7cff", notice: "#cf6a43", inputBg: "#ececee",
    inputBorder: "#d7d7dd", inputBorderFocus: "#c2c2ca", inputText: "#3d4757",
    inputPlaceholder: "#98a2b2", plus: "#47505f", sendBg: "#3b82f6",
    sendInk: "#ffffff", userAccent: "#b8872f", file: "#a9741a",
    fileDim: "#c19a55", handle: "rgba(62, 62, 68, 0.70)",
    handleHover: "rgba(38, 38, 44, 0.92)",
    handleHalo: "rgba(255, 255, 255, 0.20)", handleHaloHover: "rgba(255, 255, 255, 0.30)",
  },
  dark: {
    bg: "#202126", soft: "#2a2b31", ink: "#e8e8ec", inkSoft: "#c7c8d0",
    muted: "#a1a2aa", faint: "#70717a", line: "#35363d", lineStrong: "#4a4b54",
    accent: "#8ab4f8", notice: "#e08a63", inputBg: "#2b2c32",
    inputBorder: "#42434b", inputBorderFocus: "#55565f", inputText: "#e4e5ea",
    inputPlaceholder: "#8d8e97", plus: "#c6c7cf", sendBg: "#4f8cff",
    sendInk: "#ffffff", userAccent: "#c9a35f", file: "#efc160",
    fileDim: "#b89a5e", handle: "rgba(214, 216, 224, 0.55)",
    handleHover: "rgba(240, 242, 248, 0.85)",
    handleHalo: "rgba(22, 22, 26, 0.45)", handleHaloHover: "rgba(22, 22, 26, 0.65)",
  },
};

// The notebook has exactly one style: a warm beige sticky note ruled with
// white hairlines. It is not tied to the app theme or the wallpaper, and the
// old palette shelf and the Paper / Glass / Focus surfaces are gone. This is
// the single `default` note style; note-theme.css owns the same values as CSS
// defaults.
const NOTE_THEME_BUILTINS = [
  {
    id: "default", name: "Default", english: "Beige sticky note · white ruled lines",
    palette: {
      paper: "#f6e8c4", ink: "#4a3a28", muted: "rgba(74, 58, 40, 0.55)",
      rule: "rgba(255, 255, 255, 0.90)", accent: "#9a7443", accent2: "#7f5f38",
      handle: "rgba(74, 58, 40, 0.70)", handleHover: "rgba(58, 45, 30, 0.92)",
      handleHalo: "rgba(255, 255, 255, 0.20)", handleHaloHover: "rgba(255, 255, 255, 0.30)",
    },
  },
];

function paneHex(value) {
  const raw = String(value || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(raw)) return raw.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(raw)) return ("#" + raw.slice(1).split("").map((ch) => ch + ch).join("")).toLowerCase();
  return "";
}

function paneRgba(value, alpha, fallback = "") {
  const hex = paneHex(value);
  return hex ? `rgba(${hexToRgb(hex)}, ${alpha})` : fallback;
}

/** Turn a pack's optional notebook palette into the CSS slot values. */
function notePaletteFromPack(raw) {
  if (!raw || typeof raw !== "object") return null;
  const paper = paneHex(raw.paper);
  const ink = paneHex(raw.ink);
  if (!paper || !ink) return null;
  return {
    paper,
    ink,
    muted: paneRgba(raw.muted, 0.62, paneRgba(mixHex(ink, paper, 0.45), 1)),
    rule: paneRgba(raw.rule, 0.34, paneRgba(mixHex(ink, paper, 0.68), 0.22)),
    accent: paneHex(raw.accent) || mixHex(ink, paper, 0.22),
    accent2: paneHex(raw.accent2) || mixHex(ink, paper, 0.4),
    handle: paneRgba(raw.handle, 0.70, "rgba(62, 62, 68, 0.70)"),
    handleHover: paneRgba(raw.handle, 0.92, "rgba(38, 38, 44, 0.92)"),
    handleHalo: "rgba(255, 255, 255, 0.20)",
    handleHaloHover: "rgba(255, 255, 255, 0.30)",
  };
}

/** Turn a pack's optional AI console palette into the CSS slot values. */
function aiPaletteFromPack(raw) {
  if (!raw || typeof raw !== "object") return null;
  const bg = paneHex(raw.bg);
  const ink = paneHex(raw.ink);
  if (!bg || !ink) return null;
  const dark = hexLuminance(bg) < 0.45;
  const base = dark ? AI_BUILTIN_PALETTES.dark : AI_BUILTIN_PALETTES.light;
  const pick = (key, fallback) => paneHex(raw[key]) || fallback;
  const handle = pick("handle", dark ? "#d6d8e0" : "#3e3e44");
  return {
    bg, ink,
    soft: pick("soft", mixHex(bg, ink, dark ? 0.08 : 0.05)),
    inkSoft: pick("inkSoft", mixHex(ink, bg, dark ? 0.22 : 0.18)),
    muted: pick("muted", mixHex(ink, bg, dark ? 0.42 : 0.46)),
    faint: pick("faint", mixHex(ink, bg, dark ? 0.62 : 0.66)),
    line: pick("line", mixHex(bg, ink, dark ? 0.13 : 0.07)),
    lineStrong: pick("lineStrong", mixHex(bg, ink, dark ? 0.27 : 0.18)),
    accent: pick("accent", base.accent),
    notice: pick("notice", base.notice),
    inputBg: pick("soft", mixHex(bg, ink, dark ? 0.09 : 0.05)),
    inputBorder: pick("lineStrong", mixHex(bg, ink, dark ? 0.27 : 0.16)),
    inputBorderFocus: pick("accent", base.accent),
    inputText: pick("inkSoft", ink),
    inputPlaceholder: pick("muted", base.muted),
    plus: pick("inkSoft", ink),
    sendBg: pick("accent", base.sendBg),
    sendInk: "#ffffff",
    userAccent: pick("accent", base.userAccent),
    file: pick("accent", base.file),
    fileDim: pick("muted", base.fileDim),
    handle: paneRgba(handle, 0.70, base.handle),
    handleHover: paneRgba(handle, 0.92, base.handleHover),
    handleHalo: base.handleHalo,
    handleHaloHover: base.handleHaloHover,
  };
}

function installedPaneChoices(kind) {
  const choices = [];
  for (const theme of paneThemes[kind] || []) {
    const palette = kind === "note" ? notePaletteFromPack(theme.palette) : aiPaletteFromPack(theme.palette);
    if (!palette) continue;
    choices.push({
      id: `pack:${theme.id}`,
      name: theme.name || theme.id,
      english: theme.englishName || "Your palette",
      palette,
      source: theme.source === "pack" ? "community" : "user",
      packId: theme.id,
    });
  }
  return choices;
}

function noteThemeChoices() {
  // One built-in style only: the beige sticky note. Note-theme packs and the
  // old Paper / Glass / Focus surfaces are intentionally not listed any more.
  return NOTE_THEME_BUILTINS.map((theme) => ({ ...theme, source: "builtin" }));
}

// The two notebook surfaces the notebook used before palettes existed. They
// are the note's own setting: Paper paints the chosen paper colour, Glass
// frosts the chosen ink over a mask. Neither follows the app or OS theme.
const NOTE_SURFACE_BUILTINS = [
  { id: "paper", name: "Paper", english: "Solid notebook page", file: "paper.css" },
  { id: "blur", name: "Glass", english: "Frosted mask", file: "glass.css" },
  { id: "focus", name: "Focus", english: "FocusWriter-style glass pane", file: "focus.css" },
];

function noteSurfaceChoices() {
  const builtinFiles = new Set(NOTE_SURFACE_BUILTINS.map((surface) => surface.file));
  const extra = noteMaterialFiles
    .filter((file) => !builtinFiles.has(String(file).toLowerCase()))
    .map((file) => ({
      id: materialIdForFile(file),
      name: materialDisplayName(file),
      english: "Your material",
      file: String(file).toLowerCase(),
    }));
  return [...NOTE_SURFACE_BUILTINS, ...extra];
}

function activeNoteSurfaceFile() {
  return String(settings.note_material_file || materialFileForId(settings.note_material)).toLowerCase();
}

function noteSurfaceCardMarkup(surface) {
  const active = activeNoteSurfaceFile() === surface.file;
  const palette = selectedNoteTheme().palette;
  const glass = surface.id === "blur";
  const focus = surface.id === "focus";
  const dark = hexLuminance(palette.paper) < 0.45;
  const swatch = focus
    // A sharp photo with a frosted inset pane and a drop shadow: the
    // FocusWriter mask in miniature.
    ? `background:linear-gradient(135deg,rgba(24,28,24,.20),rgba(24,28,24,.08)),url("/notes-forest.jpg") center/cover;color:${esc(palette.ink)};text-shadow:0 1px 2px rgba(255,255,255,.7);box-shadow:inset 0 0 0 6px rgba(255,255,255,.20),inset 0 0 0 7px rgba(255,255,255,.44),inset 0 -14px 24px rgba(0,0,0,.16)`
    : glass
    ? (dark
      ? `background:linear-gradient(135deg,rgba(38,44,52,.90),rgba(20,24,30,.62)),radial-gradient(circle at 24% 18%,rgba(255,255,255,.18),transparent 58%);color:${esc(palette.ink)};box-shadow:inset 0 0 0 1px rgba(255,255,255,.18),inset 0 -14px 28px rgba(0,0,0,.30)`
      : `background:linear-gradient(135deg,rgba(255,255,255,.84),rgba(212,224,233,.42)),radial-gradient(circle at 24% 18%,rgba(255,255,255,.96),transparent 58%);color:${esc(palette.ink)};box-shadow:inset 0 0 0 1px rgba(255,255,255,.6),inset 0 -14px 28px rgba(126,146,160,.16)`)
    : `background:${esc(palette.paper)};color:${esc(palette.ink)}`;
  return `<button class="pane-theme-card note-surface-card ${active ? "active" : ""}" type="button" data-note-surface-file="${esc(surface.file)}" aria-pressed="${active ? "true" : "false"}">
    <span class="pane-theme-swatch ${glass ? "note-surface-glass" : ""}" style="${swatch}">
      <span class="pane-theme-aa">Aa</span>
      <span class="pane-theme-rule one" style="background:${esc(palette.rule)}"></span>
      <span class="pane-theme-rule two" style="background:${esc(palette.rule)};opacity:.6"></span>
      <span class="pane-theme-rule three" style="background:${esc(palette.rule)};opacity:.35"></span>
      <span class="pane-theme-dots"><i style="background:${esc(palette.accent)}"></i><i style="background:${esc(palette.accent2)}"></i></span>
    </span>
    <span class="pane-theme-copy"><strong>${esc(surface.name)}</strong><small>${esc(surface.english || "")}</small></span>
    <span class="choice-check">✓</span>
  </button>`;
}

function aiThemeChoices() {
  return [
    { id: "auto", name: "Auto", english: "Follow the app theme", palette: null, source: "builtin" },
    { id: "light", name: "AI Light", english: "White editor", palette: AI_BUILTIN_PALETTES.light, source: "builtin" },
    { id: "dark", name: "AI Dark", english: "Charcoal console", palette: AI_BUILTIN_PALETTES.dark, source: "builtin" },
    ...installedPaneChoices("ai"),
  ];
}

function selectedNoteTheme() {
  const choices = noteThemeChoices();
  return choices.find((choice) => choice.id === settings.note_theme) || choices[0];
}

function resolvedAiTheme() {
  const choices = aiThemeChoices();
  const picked = choices.find((choice) => choice.id === settings.ai_theme) || choices[0];
  if (picked.id !== "auto") return picked;
  return choices.find((choice) => choice.id === (postcardIsDark(currentPostcardId()) ? "dark" : "light")) || picked;
}

function applyNoteTheme() {
  const root = document.documentElement;
  const choice = selectedNoteTheme();
  const palette = choice.palette;
  root.dataset.noteTheme = choice.id.startsWith("pack:") ? "custom" : choice.id;
  root.dataset.noteDark = hexLuminance(palette.paper) < 0.45 ? "true" : "false";
  root.style.setProperty("--note-theme-paper", palette.paper);
  root.style.setProperty("--note-theme-ink", fontHexColor(settings.note_font_color) || palette.ink);
  root.style.setProperty("--note-theme-muted", palette.muted);
  root.style.setProperty("--note-theme-rule", palette.rule);
  root.style.setProperty("--note-theme-accent", palette.accent);
  root.style.setProperty("--note-theme-accent2", palette.accent2);
  root.style.setProperty("--note-handle-line", palette.handle);
  root.style.setProperty("--note-handle-hover", palette.handleHover);
  root.style.setProperty("--note-handle-halo", palette.handleHalo);
  root.style.setProperty("--note-handle-halo-hover", palette.handleHaloHover);
}

function applyAiTheme() {
  const root = document.documentElement;
  const choice = resolvedAiTheme();
  const palette = choice.palette;
  root.dataset.aiTheme = choice.id.startsWith("pack:") ? "custom" : choice.id;
  const terminal = document.getElementById("agent-terminal");
  const slots = {
    "--oc-bg": palette.bg,
    "--oc-soft": palette.soft,
    "--oc-ink": palette.ink,
    "--oc-ink-soft": palette.inkSoft,
    "--oc-muted": palette.muted,
    "--oc-faint": palette.faint,
    "--oc-line": palette.line,
    "--oc-line-strong": palette.lineStrong,
    "--oc-accent": palette.accent,
    "--oc-notice": palette.notice,
    "--oc-input-bg": palette.inputBg,
    "--oc-input-border": palette.inputBorder,
    "--oc-input-border-focus": palette.inputBorderFocus,
    "--oc-input-text": palette.inputText,
    "--oc-input-placeholder": palette.inputPlaceholder,
    "--oc-plus": palette.plus,
    "--oc-send-bg": palette.sendBg,
    "--oc-send-ink": palette.sendInk,
    "--oc-user-accent": palette.userAccent,
    "--oc-file": palette.file,
    "--oc-file-dim": palette.fileDim,
    "--agent-copy-accent": palette.accent,
    // Old console rules draw hairlines with rgba(var(--pc-accent-rgb)); keep
    // them on the console palette instead of the app paper.
    "--pc-accent-rgb": hexToRgb(palette.accent),
  };
  for (const [name, value] of Object.entries(slots)) terminal?.style.setProperty(name, value);
  // The AI context menu is appended to <body>, outside the terminal, so it
  // reads its own copy of the palette from the page root.
  root.style.setProperty("--oc-menu-bg", palette.bg);
  root.style.setProperty("--oc-menu-ink", palette.ink);
  root.style.setProperty("--oc-menu-muted", palette.muted);
  root.style.setProperty("--oc-menu-line", palette.line);
  root.style.setProperty("--oc-menu-accent", palette.accent);
  root.style.setProperty("--oc-menu-notice", palette.notice);
  root.style.setProperty("--oc-menu-hover", colorTint(palette.accent, 0.12));
  root.style.setProperty("--ai-handle-line", palette.handle);
  root.style.setProperty("--ai-handle-hover", palette.handleHover);
  root.style.setProperty("--ai-handle-halo", palette.handleHalo);
  root.style.setProperty("--ai-handle-halo-hover", palette.handleHaloHover);
  // A console theme may flip light/dark, so the caret ink follows it too.
  if (typeof scheduleCustomCaret === "function") scheduleCustomCaret();
}

function normalizePaneThemeSettings() {
  const noteIds = new Set(noteThemeChoices().map((choice) => choice.id));
  if (!noteIds.has(settings.note_theme)) settings.note_theme = "default";
  const aiIds = new Set(aiThemeChoices().map((choice) => choice.id));
  if (!aiIds.has(settings.ai_theme)) settings.ai_theme = "auto";
}

function applyPaneThemes() {
  normalizePaneThemeSettings();
  applyNoteTheme();
  applyAiTheme();
}

// ---------------------------------------------------------------------------
// Theme community
// ---------------------------------------------------------------------------
function themeAssetUrl(packId, relative) {
  const id = String(packId || "").replace(/[^a-z0-9-]/gi, "");
  const rel = String(relative || "")
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");
  return id && rel ? `/theme-assets/${id}/${rel}` : "";
}

function themeColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(String(value || "")) ? String(value) : fallback;
}

function communityPackArt(theme) {
  const paper2 = theme.paper2 || theme.paper;
  const accent = theme.accent || theme.ink;
  const accent2 = theme.accent2 || accent;
  const ink = theme.ink || "#332b2d";
  return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="1000" height="300" fill="${esc(paper2)}"/>
    <rect width="1000" height="118" fill="${esc(theme.paper)}"/>
    <circle cx="782" cy="78" r="43" fill="${esc(accent)}" opacity=".92"/>
    <circle cx="782" cy="78" r="61" fill="none" stroke="${esc(accent)}" stroke-width="1" opacity=".32"/>
    <path d="M0 214 C170 178 320 240 500 206 C690 170 830 236 1000 198 L1000 300 L0 300Z" fill="${esc(accent2)}" opacity=".55"/>
    <path d="M0 250 C190 220 360 274 550 242 C730 212 860 266 1000 236 L1000 300 L0 300Z" fill="${esc(ink)}" opacity=".62"/>
    <g stroke="${esc(ink)}" stroke-width="2" opacity=".25">
      <path d="M0 138 C160 104 330 150 500 122 C690 90 840 138 1000 108"/>
      <path d="M0 158 C180 126 350 174 530 146 C710 118 860 164 1000 136"/>
      <path d="M0 178 C200 148 370 196 560 168 C740 142 880 184 1000 158"/>
    </g>
    <g fill="${esc(accent)}" opacity=".8">
      <circle cx="120" cy="262" r="2.6"/><circle cx="230" cy="278" r="2.1"/>
      <circle cx="340" cy="258" r="2.4"/><circle cx="806" cy="268" r="2.3"/>
      <circle cx="910" cy="252" r="2.1"/>
    </g>
  </svg>`;
}

function packTheme(pack) {
  const palette = pack?.palette || {};
  const paper = themeColor(palette.paper, "#f4ecfa");
  const ink = themeColor(palette.ink, "#3d2f4a");
  const accent = themeColor(palette.accent, ink);
  const dark = hexLuminance(paper) < 0.45;
  return {
    _themePack: true,
    name: String(pack?.name || pack?.id || "Theme"),
    motif: String(palette.motif || "✦").slice(0, 4),
    airmail: false,
    paper,
    paper2: themeColor(palette.paper2, paper),
    ink,
    muted: themeColor(palette.muted, ink),
    accent,
    accent2: themeColor(palette.accent2, accent),
    border: themeColor(palette.border, paper),
    stamp: themeColor(palette.stamp, accent),
    line: themeColor(palette.line, ""),
    rule: themeColor(palette.rule, ""),
    lineAlpha: palette.lineAlpha,
    ruleAlpha: palette.ruleAlpha,
    glow: typeof palette.glow === "string" && palette.glow.startsWith("rgba")
      ? palette.glow
      : `rgba(${hexToRgb(accent)}, .18)`,
    display: dark
      ? '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif'
      : '"Noto Serif","Liberation Serif",Georgia,serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: String(palette.quote || "A theme from the NeoTodo community.").slice(0, 220),
    art(paletteTheme) { return communityPackArt(paletteTheme || this); },
  };
}

function registerThemePacks(packs) {
  const live = new Set();
  for (const pack of Array.isArray(packs) ? packs : []) {
    if (!pack?.id || !pack?.palette) continue;
    // A community pack may never shadow a built-in palette id.
    if (THEMES[pack.id] && !THEMES[pack.id]._themePack) continue;
    live.add(pack.id);
    THEMES[pack.id] = packTheme(pack);
  }
  for (const [id, theme] of Object.entries(THEMES)) {
    if (theme?._themePack && !live.has(id)) delete THEMES[id];
  }
}

async function loadThemePacks() {
  try {
    const response = await fetch("/api/themes", { cache: "no-store" });
    const data = await response.json();
    if (!data?.ok || !Array.isArray(data.packs)) return false;
    themePacks = data.packs;
    paneThemes = {
      note: Array.isArray(data.note_themes) ? data.note_themes : [],
      ai: Array.isArray(data.ai_themes) ? data.ai_themes : [],
    };
    paneThemeFolders = {
      note: String(data.note_folder || ""),
      ai: String(data.ai_folder || ""),
    };
    registerThemePacks(themePacks);
    return true;
  } catch (error) {
    return false;
  }
}

async function loadIconThemes() {
  try {
    const response = await fetch("/api/icon-themes", { cache: "no-store" });
    const data = await response.json();
    if (!data?.ok || !Array.isArray(data.themes)) return false;
    const byId = new Map();
    for (const pack of data.themes) {
      const id = String(pack?.id || "");
      if (!id) continue;
      byId.set(id, {
        ...pack,
        icons: pack.icons && typeof pack.icons === "object" ? pack.icons : {},
      });
    }
    if (!byId.has("classical")) byId.set("classical", { ...ICON_THEME_FALLBACK });
    iconThemes = [
      byId.get("classical"),
      ...[...byId.values()].filter((pack) => pack.id !== "classical"),
    ];
    iconThemeFolder = String(data.folder || "");
    return true;
  } catch (error) {
    return false;
  }
}

async function loadSoundStyles() {
  try {
    const response = await fetch("/api/sound-styles", { cache: "no-store" });
    const data = await response.json();
    if (!data?.ok || !Array.isArray(data.styles)) return false;
    const seen = new Set();
    const styles = [];
    for (const style of data.styles) {
      const id = String(style?.id || "").trim();
      if (!id || seen.has(id)) continue;
      seen.add(id);
      styles.push({
        id,
        name: String(style?.name || id),
        files: Array.isArray(style?.files) ? style.files.map((name) => String(name)) : [],
      });
    }
    if (!seen.has("classical")) {
      styles.unshift({ id: "classical", name: "Classical", files: [] });
    }
    soundStyles = styles;
    soundFolder = String(data.folder || "");
    return true;
  } catch (error) {
    return false;
  }
}

function soundStyleById(id) {
  const wanted = String(id || "classical");
  return soundStyles.find((style) => style.id === wanted)
    || soundStyles.find((style) => style.id === "classical")
    || soundStyles[0]
    || { id: "classical", name: "Classical", files: [] };
}

function activeSoundStyle() {
  return soundStyleById(settings.sound_style);
}

function iconThemeById(id) {
  const wanted = String(id || "classical");
  return iconThemes.find((pack) => pack.id === wanted) || iconThemes[0] || ICON_THEME_FALLBACK;
}

function iconThemeAsset(pack, slot) {
  const rel = String(pack?.icons?.[slot] || "");
  if (!pack || !rel) return "";
  const encoded = rel.split("/").filter(Boolean).map(encodeURIComponent).join("/");
  return `/icon-theme-assets/${encodeURIComponent(pack.id)}/${encoded}`;
}

function iconThemeSlotDataName(slot) {
  return `icon${slot.charAt(0).toUpperCase()}${slot.slice(1)}`;
}

function iconThemeSlotCssName(slot) {
  return slot.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/** Swap the fork flame's <img> source; CSS handles the rest of the set. */
function applyIconThemeImages() {
  const pack = iconThemeById(settings.icon_theme);
  const fork = iconThemeAsset(pack, "fork");
  document.querySelectorAll("img.fork-flame, .cat-fork img, .sub-fork-link img, .h-sub-fork-link img").forEach((img) => {
    if (!img.dataset.iconOrigSrc) img.dataset.iconOrigSrc = img.getAttribute("src") || "";
    const next = fork || img.dataset.iconOrigSrc;
    if (next && img.getAttribute("src") !== next) img.setAttribute("src", next);
  });
}

function queueIconThemeImageScan() {
  if (iconImageScanQueued) return;
  iconImageScanQueued = true;
  requestAnimationFrame(() => {
    iconImageScanQueued = false;
    applyIconThemeImages();
  });
}

function watchIconThemeImages(enabled) {
  if (!enabled) {
    iconImageObserver?.disconnect();
    iconImageObserver = null;
    return;
  }
  if (iconImageObserver || !document.body) return;
  iconImageObserver = new MutationObserver(queueIconThemeImageScan);
  iconImageObserver.observe(document.body, { childList: true, subtree: true });
}

function applyIconTheme() {
  const root = document.documentElement;
  const pack = iconThemeById(settings.icon_theme);
  let hasIcon = false;
  root.dataset.iconTheme = pack.id;
  for (const slot of ICON_THEME_SLOTS) {
    const url = iconThemeAsset(pack, slot);
    const cssName = iconThemeSlotCssName(slot);
    const dataName = iconThemeSlotDataName(slot);
    if (url) {
      hasIcon = true;
      root.style.setProperty(`--icon-${cssName}`, `url("${url}")`);
      root.dataset[dataName] = "1";
    } else {
      root.style.removeProperty(`--icon-${cssName}`);
      delete root.dataset[dataName];
    }
  }
  // A pack with no image slots is just Classical: leave every original mark.
  if (!hasIcon) root.dataset.iconTheme = "classical";
  applyIconThemeImages();
  // The fork flame is the one slot that is a plain <img>. Only watch for new
  // rows when a pack actually replaces it, so a stream of terminal text never
  // costs a DOM scan frame after frame.
  watchIconThemeImages(Boolean(iconThemeAsset(pack, "fork")));
  if (iconThemeAsset(pack, "fork")) queueIconThemeImageScan();
}

async function loadThemeCatalog(refresh = false) {
  if (themeCatalogBusy) return;
  themeCatalogBusy = true;
  if (communityViewOpen("themes")) renderCommunity();
  try {
    const response = await fetch(`/api/themes/community${refresh ? "?refresh=1" : ""}`, { cache: "no-store" });
    const data = await response.json();
    if (data?.ok) {
      themeCatalog = data;
      themeCatalogAt = Date.now();
    }
  } catch (error) {
    // The bundled catalog still works offline; keep whatever we already had.
  } finally {
    themeCatalogBusy = false;
    if (communityViewOpen("themes")) renderCommunity();
  }
}

async function themeCommunityPost(path, payload) {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    return { ok: false, error: "Could not reach the theme community" };
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || "").split(",")[1] || "");
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.readAsDataURL(file);
  });
}

function themePackSounds(pack) {
  return pack?.sounds && typeof pack.sounds === "object" ? Object.keys(pack.sounds) : [];
}

function themePackIcons(pack) {
  return pack?.icons && typeof pack.icons === "object" ? Object.keys(pack.icons) : [];
}

function themePreviewMarkup(pack, catalogEntry = null) {
  const preview = catalogEntry ? catalogEntry.preview : pack?.preview;
  const id = pack?.id || catalogEntry?.id || "";
  const localPreview = Boolean(pack) || Boolean(catalogEntry?.bundled);
  if (preview && (/^https?:\/\//i.test(preview) || localPreview)) {
    const src = /^https?:\/\//i.test(preview) ? preview : themeAssetUrl(id, preview);
    if (src) return `<img src="${esc(src)}" alt="" loading="lazy">`;
  }
  const palette = pack?.palette || catalogEntry?.palette || {};
  if (palette.paper && palette.ink) {
    const theme = packTheme({ id, name: pack?.name || catalogEntry?.name, palette });
    return theme.art(theme);
  }
  return `<span class="theme-pack-fallback">${esc(String(pack?.name || catalogEntry?.name || id || "T").slice(0, 1))}</span>`;
}

function themePackBadges(pack) {
  const badges = [];
  if (pack.wallpaper) badges.push("Wallpaper");
  if (pack.chrome) badges.push("Lines + wash");
  if (pack.note) badges.push("Note theme");
  if (pack.ai) badges.push("AI theme");
  const soundCount = themePackSounds(pack).length;
  if (soundCount) badges.push(`${soundCount} sound${soundCount === 1 ? "" : "s"}`);
  const iconCount = themePackIcons(pack).length;
  if (iconCount) badges.push(`${iconCount} icon${iconCount === 1 ? "" : "s"}`);
  if (!badges.length) badges.push("Palette");
  return badges.map((badge) => `<span class="theme-pack-badge">${esc(badge)}</span>`).join("");
}

function themePackCardMarkup(pack, catalogEntry = null) {
  const id = pack?.id || catalogEntry?.id || "";
  const entry = catalogEntry || pack || {};
  const name = entry.name || id;
  const english = entry.englishName || "";
  const version = entry.version || "1.0.0";
  const author = entry.author || "Community";
  const description = entry.description || "";
  const applied = !catalogEntry && settings.resolved_postcard === id;
  const busy = themePackBusy === id;
  const source = catalogEntry
    ? (catalogEntry.bundled ? "Included with NeoTodo" : (catalogEntry.official ? "Official" : "Community"))
    : (pack?.source === "bundled" ? "Bundled" : "Installed");
  const actions = catalogEntry
    ? `<button class="btn small primary" type="button" data-action="install-theme-pack" data-theme-id="${esc(id)}" data-theme-bundled="${catalogEntry.bundled ? "1" : "0"}" ${busy ? "disabled" : ""}>${busy ? "Installing…" : "Install"}</button>`
    : `<button class="btn small ${applied ? "" : "primary"}" type="button" data-action="apply-theme-pack" data-theme-id="${esc(id)}" ${applied || busy ? "disabled" : ""}>${applied ? "Applied" : (busy ? "Applying…" : "Apply")}</button>
       <button class="btn small" type="button" data-action="remove-theme-pack" data-theme-id="${esc(id)}" ${busy ? "disabled" : ""}>Remove</button>`;
  return `<article class="theme-pack-card ${applied ? "theme-pack-active" : ""}" data-theme-pack-card="${esc(id)}">
    <span class="theme-pack-preview">${themePreviewMarkup(pack, catalogEntry)}</span>
    <div class="theme-pack-body">
      <div class="theme-pack-head">
        <strong>${esc(name)}</strong>
        <small>${esc(english || id)} · v${esc(version)}</small>
      </div>
      <div class="theme-pack-meta">${esc(author)} · ${esc(source)}</div>
      ${description ? `<p>${esc(description)}</p>` : ""}
      <div class="theme-pack-badges">${themePackBadges(pack || { palette: entry.palette, chrome: entry.chrome, note: entry.note, ai: entry.ai, sounds: {}, icons: {} })}</div>
      <div class="theme-pack-actions">${actions}</div>
    </div>
  </article>`;
}

function themeCommunitySection() {
  const installed = themePacks || [];
  const installedIds = new Set(installed.map((pack) => pack.id));
  const catalogEntries = (themeCatalog?.themes || []).filter((entry) => !installedIds.has(entry.id));
  const catalogNote = themeCatalog
    ? `${themeCatalog.catalog_source === "remote" ? "Online" : themeCatalog.catalog_source === "cache" ? "Cached" : "Offline"} · ${themeCatalog.themes?.length || 0} themes`
    : (themeCatalogBusy ? "Loading…" : "Not loaded");
  const overrideCount = Object.keys(settings.sound_overrides || {}).length;
  // The notebook has one fixed style now, so note-theme packs are not offered
  // as a separate shelf any more.
  const notePanePacks = [];
  const aiPanePacks = installedPaneChoices("ai");
  const paneShelf = notePanePacks.length || aiPanePacks.length
    ? `<div class="settings-section">
      <div class="settings-label">AI themes <span>ai-theme</span></div>
      <p class="pane-theme-hint">The console palette lives in its own folder, apart from the NeoTodo theme packs. Pick one here, or open Theme to see the built-in console themes.</p>
      ${notePanePacks.length ? `<div class="pane-theme-group-label">Note themes</div>
        <div class="pane-theme-grid">${notePanePacks.map((choice) => paneThemeCardMarkup(choice, "note")).join("")}</div>` : ""}
      ${aiPanePacks.length ? `<div class="pane-theme-group-label">AI themes</div>
        <div class="pane-theme-grid">${aiPanePacks.map((choice) => paneThemeCardMarkup(choice, "ai")).join("")}</div>` : ""}
      <button class="btn small pane-theme-community-link" type="button" data-action="open-theme-settings">Open Theme</button>
    </div>`
    : "";
  return `<div class="settings-section theme-community-hero">
      <div class="theme-community-hero-copy">
        <strong>Make NeoTodo yours — together.</strong>
        <p>导入别人做的 <code>.zip</code> 主题包，或者把当前的纸色、壁纸、音效和成就图标导出成一只包，上传到社区与朋友分享。带 <strong>AI theme</strong> 标记的包，装好后会出现在 <strong>Appearance</strong> 页的 AI 主题里。</p>
      </div>
      <div class="theme-community-actions">
        <button class="btn small primary" type="button" data-action="import-theme-pack" ${themePackBusy === "import" ? "disabled" : ""}>${themePackBusy === "import" ? "Importing…" : "Import .zip"}</button>
        <button class="btn small" type="button" data-action="open-theme-packs-folder">Open packs folder</button>
        <button class="btn small" type="button" data-action="refresh-theme-catalog" ${themeCatalogBusy ? "disabled" : ""}>${themeCatalogBusy ? "Refreshing…" : "Refresh catalog"}</button>
      </div>
      <input type="file" accept=".zip,application/zip" data-theme-pack-input hidden>
    </div>
    ${paneShelf}
    <div class="settings-section">
      <div class="settings-label">Installed <span>${installed.length}</span></div>
      ${installed.length
        ? `<div class="theme-pack-grid">${installed.map((pack) => themePackCardMarkup(pack)).join("")}</div>`
        : `<div class="theme-community-empty"><strong>No theme packs yet.</strong><span>Install one from the catalog below, or import a <code>.zip</code> a friend sent you.</span></div>`}
    </div>
    <div class="settings-section">
      <div class="settings-label">Community catalog <span>${esc(catalogNote)}</span></div>
      ${themeCatalog?.catalog_error ? `<div class="theme-community-warning">Catalog refresh failed: ${esc(themeCatalog.catalog_error)}. Showing the offline shelf.</div>` : ""}
      ${catalogEntries.length
        ? `<div class="theme-pack-grid">${catalogEntries.map((entry) => themePackCardMarkup(null, entry)).join("")}</div>`
        : `<div class="theme-community-empty"><strong>${themeCatalog ? "Everything here is installed." : "Loading the shelf…"}</strong><span>${themeCatalog ? "New community packs will appear here when the catalog refreshes." : "The bundled catalog keeps this page working offline."}</span></div>`}
    </div>
    <div class="settings-section">
      <div class="settings-label">Share your theme <span>create a pack</span></div>
      <div class="theme-community-share">
        <div>
          <strong>${esc(postcardName(currentPostcardId()))}</strong>
          <span>Current palette${["image", "video"].includes(activeWallpaper().kind) ? " · wallpaper" : ""}${overrideCount ? ` · ${overrideCount} custom sounds` : ""}${Object.keys(settings.sticker_backgrounds || {}).length ? " · stickers" : ""}</span>
        </div>
        <button class="btn small" type="button" data-action="open-theme-exports-folder">Open exports</button>
        <button class="btn small primary" type="button" data-action="export-theme-pack">Export .zip</button>
      </div>
      ${overrideCount ? `<div class="theme-community-sound-row"><span>Theme sound pack is on.</span><button class="btn small" type="button" data-action="reset-theme-sounds">Use NeoTodo sounds</button></div>` : ""}
      <p class="theme-community-publish">Publishing is a pull request: drop your zip in <code>community/packs/</code> and add an entry to <code>community/themes.json</code>. The full format is documented in <code>docs/theme-community.md</code>.</p>
    </div>`;
}

async function importThemePackFile(file) {
  if (!file) return;
  if (file.size > 24_000_000) {
    toast("That theme pack is too large (24 MB max)", true);
    return;
  }
  themePackBusy = "import";
  if (communityViewOpen("themes")) renderCommunity();
  try {
    const data = await fileToBase64(file);
    const result = await themeCommunityPost("/api/themes/install", { data });
    if (!result?.ok) throw new Error(result?.error || "Could not install that theme pack");
    themePacks = result.packs || themePacks;
    registerThemePacks(themePacks);
    toast(`${result.theme?.name || "Theme pack"} installed`);
  } catch (error) {
    toast(error.message || "Could not install that theme pack", true);
  } finally {
    themePackBusy = "";
    await loadThemePacks();
    applyPaneThemes();
    if (communityViewOpen("themes")) renderCommunity();
    if (settingsTab === "theme") renderSettings();
  }
}

async function installThemeFromCatalog(id, bundled) {
  const entry = (themeCatalog?.themes || []).find((item) => item.id === id);
  if (!entry) return;
  themePackBusy = id;
  if (communityViewOpen("themes")) renderCommunity();
  try {
    const payload = bundled
      ? { id, bundled: true }
      : (entry.download ? { id, url: entry.download, sha256: entry.sha256 || "" } : { id, bundled: true });
    const result = await themeCommunityPost("/api/themes/install", payload);
    if (!result?.ok) throw new Error(result?.error || "Could not install that theme");
    themePacks = result.packs || themePacks;
    registerThemePacks(themePacks);
    toast(`${entry.name} installed`);
  } catch (error) {
    toast(error.message || "Could not install that theme", true);
  } finally {
    themePackBusy = "";
    await loadThemePacks();
    applyPaneThemes();
    if (communityViewOpen("themes")) renderCommunity();
    if (settingsTab === "theme") renderSettings();
  }
}

async function themeAssetDataUrl(url) {
  const response = await fetch(url, { cache: "force-cache" });
  if (!response.ok) throw new Error("Could not read a theme asset");
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read a theme asset"));
    reader.readAsDataURL(blob);
  });
}

async function applyThemePackById(id) {
  const pack = themePacks.find((item) => item.id === id);
  if (!pack) return;
  themePackBusy = id;
  if (communityViewOpen("themes")) renderCommunity();
  try {
    const wallpaperTheme = THEMES[id] || packTheme(pack);
    // A picked wallpaper is the reader's room; applying a palette must not
    // replace it, because the wallpaper-theme cards are cut from that room.
    const keepPickedWallpaper = pickedWallpaperStaysOnThemeChange();
    // A NeoTodo theme only owns the app paper, wallpaper, sounds and stickers.
    // The notebook and the AI console keep their own choices from note-theme/
    // and ai-theme/; capture them so a pack can never overwrite either one.
    const noteSelection = settings.note_theme;
    const aiSelection = settings.ai_theme;
    settings.theme = "postcard";
    settings.postcard = id;
    settings.resolved_postcard = id;
    if (postcardIsDark(id)) settings.dark_postcard = id;
    else settings.light_postcard = id;
    if (!keepPickedWallpaper) {
      settings.wallpaper = pack.wallpaper ? `theme:${id}` : `art:${id}`;
    }
    applyThemeChrome(id);
    const overrides = {};
    for (const [key, relative] of Object.entries(pack.sounds || {})) {
      const url = themeAssetUrl(id, relative);
      if (url) overrides[key] = url;
    }
    settings.sound_overrides = overrides;
    AudioFX.setSampleOverrides(overrides);
    if (pack.icons && Object.keys(pack.icons).length) {
      settings.sticker_backgrounds = settings.sticker_backgrounds && typeof settings.sticker_backgrounds === "object"
        ? { ...settings.sticker_backgrounds }
        : {};
      for (const [target, relative] of Object.entries(pack.icons)) {
        if (!STICKER_TARGETS.some((item) => item.id === target)) continue;
        try {
          const image = await themeAssetDataUrl(themeAssetUrl(id, relative));
          if (image && image.length <= 4_000_000) {
            settings.sticker_backgrounds[target] = { image, zoom: 1, x: 50, y: 50 };
          }
        } catch (error) {}
      }
    }
    settings.note_theme = noteSelection;
    settings.ai_theme = aiSelection;
    saveSettings();
    applySettings();
    renderCategories();
    renderStage();
    if (archiveOpen) renderArchive();
    toast(`${wallpaperTheme.name} applied`);
  } catch (error) {
    toast(error.message || "Could not apply that theme", true);
  } finally {
    themePackBusy = "";
    if (communityViewOpen("themes")) renderCommunity();
  }
}

async function saveCustomTheme() {
  if (!customThemeDraft || customThemeBusy) return;
  const draft = customThemeDraft;
  const name = String(draft.name || "").trim() || "Custom theme";
  const palette = {
    paper: themeColor(draft.paper, "#f4ecfa"),
    paper2: mixHex(themeColor(draft.paper, "#f4ecfa"), themeColor(draft.ink, "#3d2f4a"), 0.07),
    ink: themeColor(draft.ink, "#3d2f4a"),
    muted: mixHex(themeColor(draft.ink, "#3d2f4a"), themeColor(draft.paper, "#f4ecfa"), 0.38),
    accent: themeColor(draft.accent, "#8d63b8"),
    accent2: themeColor(draft.line, "#d4c0e6"),
    border: themeColor(draft.line, "#d4c0e6"),
    stamp: themeColor(draft.accent, "#8d63b8"),
    line: themeColor(draft.line, "#d4c0e6"),
    rule: themeColor(draft.line, "#d4c0e6"),
    lineAlpha: Number.isFinite(Number(draft.lineAlpha)) ? Number(draft.lineAlpha) : 0.42,
    ruleAlpha: Number.isFinite(Number(draft.ruleAlpha)) ? Number(draft.ruleAlpha) : 0.28,
    motif: "✦",
    quote: "A palette of my own.",
  };
  customThemeBusy = true;
  renderSettings();
  try {
    const result = await themeCommunityPost("/api/themes/save", {
      name,
      author: "You",
      description: "A custom palette made in NeoTodo.",
      theme: palette,
    });
    if (!result?.ok) throw new Error(result?.error || "Could not save that theme");
    themePacks = result.packs || themePacks;
    registerThemePacks(themePacks);
    const id = result.theme?.id || "";
    customThemeEditorOpen = false;
    customThemeDraft = null;
    customThemesOpen = true;
    if (id && applyThemeChoice(id)) {
      toast(`${name} saved and applied`);
    } else {
      toast(`${name} saved`);
    }
  } catch (error) {
    toast(error.message || "Could not save that theme", true);
  } finally {
    customThemeBusy = false;
    renderSettings();
  }
}

function updateCustomThemeDraftPreview() {
  if (!customThemeDraft) return;
  const draft = customThemeDraft;
  const preview = $("[data-custom-theme-preview]");
  if (preview) {
    preview.style.background = draft.paper;
    preview.style.color = draft.ink;
    const line = preview.querySelector("[data-custom-theme-preview-text]");
    if (line) line.style.borderBottomColor = draft.line;
    const dot = preview.querySelector("[data-custom-theme-preview-dot]");
    if (dot) dot.style.background = draft.accent;
  }
  for (const key of CUSTOM_THEME_COLOR_KEYS) {
    const hex = document.querySelector(`[data-custom-theme-hex="${key}"]`);
    if (hex) hex.textContent = draft[key];
  }
}

async function removeThemePackById(id, { skipConfirm = false } = {}) {
  const pack = themePacks.find((item) => item.id === id);
  if (!pack) return;
  const isCustomFile = Array.isArray(pack.tags) && pack.tags.includes("custom");
  if (!skipConfirm) {
    const ok = await confirmDialog({
      kicker: isCustomFile ? "Custom theme" : "Theme community",
      title: isCustomFile ? `Delete ${pack.name}?` : `Remove ${pack.name}?`,
      message: isCustomFile
        ? "This deletes the theme's palette file from your computer. Your tasks, notes and saved artwork stay untouched."
        : "The palette, wallpaper and sound overrides it contributed will stop being available. Your tasks, notes and saved artwork stay untouched.",
      confirmLabel: isCustomFile ? "Delete" : "Remove",
      danger: true,
    });
    if (!ok) return;
  }
  themePackBusy = id;
  if (communityViewOpen("themes") || settingsTab === "theme") renderSettings();
  try {
    const result = await themeCommunityPost("/api/themes/uninstall", { id });
    if (!result?.ok) throw new Error(result?.error || "Could not remove that theme");
    if (settings.resolved_postcard === id) {
      settings.postcard = "light";
      settings.resolved_postcard = "light";
      if (settings.light_postcard === id) settings.light_postcard = "light";
      if (settings.dark_postcard === id) settings.dark_postcard = "dark";
      if (String(settings.wallpaper || "").startsWith(`theme:${id}`)) {
        settings.wallpaper = "art:light";
      }
    }
    settings.sound_overrides = {};
    AudioFX.setSampleOverrides({});
    saveSettings();
    applySettings();
    renderCategories();
    renderStage();
    toast(`${pack.name} removed`);
  } catch (error) {
    toast(error.message || "Could not remove that theme", true);
  } finally {
    themePackBusy = "";
    await loadThemePacks();
    applyPaneThemes();
    // A removed pack may have been the selected note/AI theme; persist the
    // fallback so the next visit starts on a theme that still exists.
    saveSettings();
    renderSettings();
  }
}

async function exportCurrentThemePack() {
  const name = await promptDialog({
    kicker: "Theme community",
    title: "Name this theme pack",
    message: "A zip will be saved to your theme-exports folder, ready to share or upload.",
    placeholder: "My NeoTodo theme",
    confirmLabel: "Export",
  });
  if (!name) return;
  const theme = THEMES[currentPostcardId()] || THEMES.light;
  const sounds = {};
  for (const [key, url] of Object.entries(settings.sound_overrides || {})) {
    if (typeof url === "string" && (url.startsWith("/user-sounds/") || url.startsWith("/theme-assets/"))) {
      sounds[key] = url;
    }
  }
  const icons = {};
  for (const target of STICKER_TARGETS) {
    const image = settings.sticker_backgrounds?.[target.id]?.image;
    if (image) icons[target.id] = image;
  }
  const activeChoice = activeWallpaper();
  let wallpaper = "";
  if (activeChoice.kind === "theme") {
    wallpaper = themeAssetUrl(activeChoice.packId, activeChoice.file);
  } else if (activeChoice.kind === "image") {
    wallpaper = wallpaperUrl(activeChoice.file);
  }
  const noteChoice = selectedNoteTheme();
  const aiChoice = resolvedAiTheme();
  const rowChrome = baselineRowRule();
  const submitChrome = normalizeBaselineColorInput(
    getComputedStyle(document.documentElement).getPropertyValue("--submit-color")
  ) || theme.accent;
  const hexOnly = (palette, keys) => {
    const out = {};
    for (const key of keys) {
      const hex = paneHex(palette?.[key]);
      if (hex) out[key] = hex;
    }
    return out;
  };
  const noteExport = noteChoice?.palette
    ? hexOnly(noteChoice.palette, ["paper", "ink", "muted", "rule", "accent", "accent2", "handle"])
    : {};
  const aiExport = aiChoice?.palette
    ? hexOnly(aiChoice.palette, ["bg", "soft", "ink", "inkSoft", "muted", "faint", "line", "lineStrong", "accent", "notice", "handle"])
    : {};
  const result = await themeCommunityPost("/api/themes/export", {
    name,
    author: "You",
    description: `Exported from NeoTodo on ${new Date().toLocaleDateString()}.`,
    theme: {
      paper: theme.paper,
      paper2: theme.paper2,
      ink: theme.ink,
      muted: theme.muted,
      accent: theme.accent,
      accent2: theme.accent2,
      border: theme.border,
      stamp: theme.stamp,
      line: theme.line,
      rule: theme.rule,
      lineAlpha: theme.lineAlpha,
      ruleAlpha: theme.ruleAlpha,
      glow: theme.glow,
      motif: theme.motif,
      quote: theme.quote,
    },
    chrome: {
      baseline: baselineColor(),
      row: rowChrome.color,
      row2: rowChrome.color2,
      submit: submitChrome,
      highlight: highlightColor(),
    },
    wallpaper,
    sounds,
    icons,
    note: noteExport,
    ai: aiExport,
  });
  if (!result?.ok) {
    toast(result?.error || "Could not export that theme", true);
    return;
  }
  toast(`Theme pack saved: ${result.file}`);
  setStatus(`Exported ${result.file}`);
}

function resetThemeSounds() {
  settings.sound_overrides = {};
  AudioFX.setSampleOverrides({});
  saveSettings();
  applySettings();
  renderSettings();
  toast("NeoTodo sounds restored");
}

function stickerSettingsFor(id) {
  if (!settings.sticker_backgrounds || typeof settings.sticker_backgrounds !== "object") {
    settings.sticker_backgrounds = {};
  }
  return settings.sticker_backgrounds[id] || null;
}

function stickerImageStyle(config) {
  if (!config?.image) return "";
  return `object-position:${config.x}% ${config.y}%;transform:scale(${config.zoom.toFixed(3)});transform-origin:center;`;
}

function applyStickerBackgrounds() {
  for (const target of STICKER_TARGETS) {
    const image = document.querySelector(target.selector);
    if (!image) continue;
    const config = settings.sticker_backgrounds?.[target.id];
    if (config?.image) {
      if (image.getAttribute("src") !== config.image) image.setAttribute("src", config.image);
      image.style.objectPosition = `${config.x}% ${config.y}%`;
      image.style.transform = `scale(${config.zoom})`;
      image.style.transformOrigin = "center";
    } else {
      if (image.getAttribute("src") !== target.fallback) image.setAttribute("src", target.fallback);
      image.style.objectPosition = "";
      image.style.transform = "";
      image.style.transformOrigin = "";
    }
  }
}

function spinAchievementCounter(element) {
  const counter = element?.closest?.(".trophy-button, .tomato-counter, .achievement-plugin-slot");
  if (!counter) return;
  counter.classList.remove("ach-click-spin");
  void counter.offsetWidth;
  counter.classList.add("ach-click-spin");
  clearTimeout(counter._achSpinTimer);
  counter._achSpinTimer = setTimeout(() => counter.classList.remove("ach-click-spin"), 400);
}

/** Run once the browser has painted a frame, so sheets open before any sound work. */
function afterNextPaint(callback) {
  requestAnimationFrame(() => requestAnimationFrame(callback));
}

function updateArchiveIcon() {
  const use = $("#archive-icon-use");
  if (use) use.setAttribute("href", `#${themeSymbol("archive")}`);
}

function materialFileForId(id) {
  if (id === "paper") return "paper.css";
  if (id === "blur") return "glass.css";
  return `${String(id || "paper")}.css`;
}

function materialIdForFile(file) {
  const stem = String(file || "").replace(/\.css$/i, "").trim();
  if (!stem) return "paper";
  return stem === "glass" ? "blur" : stem.replace(/[^a-z0-9_-]/gi, "") || "paper";
}

function materialDisplayName(file) {
  const stem = String(file || "").replace(/\.css$/i, "").trim();
  if (stem === "paper") return "Paper";
  if (stem === "glass") return "Glass";
  return stem || "Paper";
}

/** A wallpaper the reader picked from their own disk is remembered as a path. */
function wallpaperIsFilePath(value) {
  const name = String(value || "").trim();
  if (!name || name.length > 4096 || name.includes("\n")) return false;
  const absolute = name.startsWith("/") || name.startsWith("\\\\") || /^[A-Za-z]:[\\/]/.test(name);
  if (!absolute) return false;
  return WALLPAPER_IMAGE_RE.test(name) || WALLPAPER_VIDEO_RE.test(name);
}

function wallpaperUrl(name) {
  // Picked files are read from their own path; a bare name is a picture that
  // an older build copied into the pictures folder.
  if (wallpaperIsFilePath(name)) {
    return `/user-wallpaper?path=${encodeURIComponent(String(name))}`;
  }
  const encoded = encodeURIComponent(String(name || "")).replace(/[!'()*]/g, (ch) => (
    `%${ch.charCodeAt(0).toString(16).toUpperCase()}`
  ));
  return `/user-pictures/${encoded}`;
}

const WALLPAPER_IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i;
const WALLPAPER_VIDEO_RE = /\.(mp4|webm|mov|m4v|ogv)$/i;

/** A bare file name that points at a picture or a film in the pictures folder. */
function wallpaperIsPictureName(value) {
  const name = String(value || "").trim();
  if (!name || name.includes("/") || name.includes("\\") || name.includes("..")) return false;
  return WALLPAPER_IMAGE_RE.test(name) || WALLPAPER_VIDEO_RE.test(name);
}

/** A picture or a film, whether it was picked or copied in by an older build. */
function wallpaperIsLocalFile(value) {
  return wallpaperIsFilePath(value) || wallpaperIsPictureName(value);
}

/** The single wallpaper choice, resolved into something the UI can render. */
function activeWallpaper() {
  const value = String(settings.wallpaper || "").trim();
  if (value.startsWith("art:")) {
    const artId = value.slice(4);
    if (THEMES[artId] && typeof THEMES[artId].art === "function") {
      return { kind: "art", moving: false, artId, key: `art:${artId}` };
    }
  } else if (value.startsWith("theme:")) {
    const packId = value.slice(6);
    const pack = themePacks.find((item) => item.id === packId);
    if (pack?.wallpaper) {
      return { kind: "theme", moving: false, packId, file: pack.wallpaper, key: `theme:${packId}` };
    }
  } else if (wallpaperIsLocalFile(value) && WALLPAPER_VIDEO_RE.test(value)) {
    return { kind: "video", moving: true, file: value, key: `video:${value}` };
  } else if (wallpaperIsLocalFile(value)) {
    return { kind: "image", moving: false, file: value, key: `image:${value}` };
  }
  return { kind: "none", moving: false, key: "" };
}

function wallpaperSourceUrl(wallpaper = activeWallpaper()) {
  if (wallpaper.kind === "theme") return themeAssetUrl(wallpaper.packId, wallpaper.file);
  if (wallpaper.kind === "image" || wallpaper.kind === "video") return wallpaperUrl(wallpaper.file);
  return "";
}

/** Wait until the room's wallpaper already has pixels.
    The wallpaper is part of the page, not an extra that may arrive one frame
    after the app. Resolving before `app-ready` keeps the window's first visible
    frame from being just the theme paper. A missing or very slow file resolves
    on a short timer instead of holding startup open. */
function waitForWallpaperFrame(timeout = 600) {
  const wallpaper = activeWallpaper();
  if (!wallpaper.key || wallpaper.kind === "art") return Promise.resolve();
  const layer = $("#wallpaper-layer");
  const media = layer?.firstElementChild;
  const settled = new Promise((resolve) => {
    if (!media) { resolve(); return; }
    if (media.tagName === "IMG") {
      const decode = () => {
        try {
          const pending = media.decode?.();
          if (pending && typeof pending.then === "function") pending.then(() => resolve(), () => resolve());
          else resolve();
        } catch (error) {
          resolve();
        }
      };
      if (media.complete && media.naturalWidth) decode();
      else {
        media.addEventListener("load", decode, { once: true });
        media.addEventListener("error", () => resolve(), { once: true });
      }
      return;
    }
    if (media.readyState >= 2) { resolve(); return; }
    media.addEventListener("loadeddata", () => resolve(), { once: true });
    media.addEventListener("canplay", () => resolve(), { once: true });
    media.addEventListener("error", () => resolve(), { once: true });
  });
  return Promise.race([
    settled,
    new Promise((resolve) => setTimeout(resolve, Math.max(0, timeout))),
  ]);
}

function wallpaperRenderKey() {
  return activeWallpaper().key;
}

function wallpaperMediaMarkup(extraClass = "", { autoplay = true } = {}) {
  const wallpaper = activeWallpaper();
  if (!wallpaper.key) return "";
  if (wallpaper.kind === "art") {
    const theme = THEMES[wallpaper.artId] || THEMES.light;
    return `<div class="wallpaper-media wallpaper-art ${extraClass}">${theme.art(theme)}</div>`;
  }
  const src = esc(wallpaper.kind === "theme"
    ? themeAssetUrl(wallpaper.packId, wallpaper.file)
    : wallpaperUrl(wallpaper.file));
  if (wallpaper.kind === "image" || wallpaper.kind === "theme") {
    return `<img class="wallpaper-media ${extraClass}" src="${src}" alt="" draggable="false">`;
  }
  return `<video class="wallpaper-media ${extraClass}" src="${src}" muted loop playsinline preload="auto"${autoplay ? " autoplay" : ""}></video>`;
}

/** The file name of a picked wallpaper, without its folder path. */
function wallpaperFileName(path) {
  const parts = String(path || "").split(/[\\/]/).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : "";
}

function wallpaperDisplayName(wallpaper = activeWallpaper()) {
  if (wallpaper.kind === "art") return `Postcard · ${postcardName(wallpaper.artId)}`;
  if (wallpaper.kind === "theme") return `Theme · ${themePacks.find((item) => item.id === wallpaper.packId)?.name || wallpaper.packId}`;
  if (wallpaper.kind === "image") return wallpaperFileName(wallpaper.file) || wallpaper.file;
  if (wallpaper.kind === "video") return `${wallpaperFileName(wallpaper.file) || wallpaper.file} · film`;
  return "No wallpaper";
}

/* ---------------------------------------------------------------------------
   PRE-RENDERED STATIC WALLPAPERS
   ---------------------------------------------------------------------------
   A card pane is a window into the room, so it needs the wallpaper at window
   size. Rasterising the postcard art SVG (or decoding a large photo) inside the
   card makes the card visibly paint itself every time it slides out. Static
   wallpapers are therefore rendered once into a cached picture: the cards only
   ever mount an already-decoded image. Films cannot be pre-rendered, so they
   keep the live pane — the card shows the same frame as the room behind it.
   ------------------------------------------------------------------------- */

const WALLPAPER_BITMAP_WIDTH = 1800;
const WALLPAPER_BITMAP_HEIGHT = 540;
// A photo is only copied when it is bigger than this: a picture that already
// fits needs no second decode, and an animated GIF must stay animated.
const WALLPAPER_BITMAP_MAX_EDGE = 1920;

/** Paint a loaded picture through a canvas and settle with a reusable URL. */
function bitmapUrlFromImage(image, width, height, fallback = "") {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(width));
      canvas.height = Math.max(1, Math.round(height));
      const context = canvas.getContext("2d");
      if (!context) { resolve(fallback); return; }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob ? URL.createObjectURL(blob) : fallback), "image/jpeg", 0.92);
    } catch (error) {
      resolve(fallback);
    }
  });
}

/* An SVG that is loaded through <img> is parsed as a standalone document, so
   it needs its own namespace. The inline art in the page does not carry one
   (HTML supplies it), which is why every canvas copy silently failed. */
function svgDataUrl(svg) {
  const markup = /<svg[^>]*\sxmlns\s*=/.test(svg)
    ? svg
    : String(svg).replace(/<svg\b/, '<svg xmlns="http://www.w3.org/2000/svg"');
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
}

function rasterizeSvgToBitmapUrl(svg, width, height) {
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => bitmapUrlFromImage(image, width, height).then(resolve);
    image.onerror = () => resolve("");
    image.src = svgDataUrl(svg);
  });
}

/** Downscale a large picture once so a card never paints the original file. */
function rasterizePictureToBitmapUrl(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      const width = image.naturalWidth || 0;
      const height = image.naturalHeight || 0;
      const edge = Math.max(width, height);
      // Small pictures are already cheap, and keeping their own URL means no
      // extra copy is kept alive next to the room's picture.
      if (!edge || edge <= WALLPAPER_BITMAP_MAX_EDGE) { resolve(src); return; }
      const scale = WALLPAPER_BITMAP_MAX_EDGE / edge;
      bitmapUrlFromImage(image, width * scale, height * scale, src).then(resolve);
    };
    // A missing or unreadable file is not cached: the room's own media then
    // owns the fallback and can drop the choice.
    image.onerror = () => resolve("");
    image.src = src;
  });
}

/** Keep the last few rendered wallpapers, so a quick switch stays instant. */
const WALLPAPER_BITMAP_KEEP = 3;

function pruneWallpaperBitmaps(currentKey) {
  if (wallpaperBitmapCache.size <= WALLPAPER_BITMAP_KEEP) return;
  const stale = [...wallpaperBitmapCache.keys()].filter((key) => key !== currentKey);
  while (wallpaperBitmapCache.size > WALLPAPER_BITMAP_KEEP && stale.length) {
    const key = stale.shift();
    const record = wallpaperBitmapCache.get(key);
    wallpaperBitmapCache.delete(key);
    if (record?.url && record.url.startsWith("blob:")) {
      try { URL.revokeObjectURL(record.url); } catch (error) {}
    }
  }
}

/** Render (once) or decode (once) the current static wallpaper. */
function primeWallpaperBitmap(wallpaper = activeWallpaper()) {
  if (!wallpaper.key) return null;
  const cached = wallpaperBitmapCache.get(wallpaper.key);
  if (cached) return cached;
  const record = { url: "", ready: false };
  wallpaperBitmapCache.set(wallpaper.key, record);
  const settle = (url) => {
    if (!url) {
      wallpaperBitmapCache.delete(wallpaper.key);
      return;
    }
    record.url = url;
    record.ready = true;
    refreshCardWallpaperPanes();
    // The bitmap is what the sub-cards are cut from; bake them now, while no
    // card is waiting on them.
    schedulePrimeSubcardPapers(0);
  };
  if (wallpaper.kind === "art") {
    const theme = THEMES[wallpaper.artId] || THEMES.light;
    rasterizeSvgToBitmapUrl(theme.art(theme), WALLPAPER_BITMAP_WIDTH, WALLPAPER_BITMAP_HEIGHT)
      .then(settle)
      .catch(() => settle(""));
    return record;
  }
  const src = wallpaperSourceUrl(wallpaper);
  if (!src) return record;
  // A film is baked from its middle frame, so its sub-cards are stills made out
  // of the same picture — they simply do not move inside the card.
  if (wallpaper.moving) {
    rasterizeVideoFrameToBitmapUrl(src)
      .then(settle)
      .catch(() => settle(""));
    return record;
  }
  // An animated GIF is the one picture that must keep its own file: copying it
  // into a canvas would freeze the motion the reader chose.
  if (/\.gif$/i.test(wallpaper.file || "")) {
    settle(src);
    return record;
  }
  rasterizePictureToBitmapUrl(src)
    .then(settle)
    .catch(() => settle(src));
  return record;
}

/** Capture the middle frame of a film once, for every sub-card to be cut from. */
function rasterizeVideoFrameToBitmapUrl(src) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    let settled = false;
    const finish = (url) => {
      if (settled) return;
      settled = true;
      try {
        video.pause();
        video.removeAttribute("src");
        video.load();
      } catch (error) {}
      resolve(url);
    };
    const capture = () => {
      try {
        const width = video.videoWidth || 0;
        const height = video.videoHeight || 0;
        if (!width || !height) { finish(""); return; }
        const edge = Math.max(width, height);
        const scale = edge > WALLPAPER_BITMAP_MAX_EDGE ? WALLPAPER_BITMAP_MAX_EDGE / edge : 1;
        bitmapUrlFromImage(video, width * scale, height * scale, "")
          .then((url) => finish(url))
          .catch(() => finish(""));
      } catch (error) {
        finish("");
      }
    };
    video.addEventListener("loadedmetadata", () => {
      const duration = Number(video.duration);
      const middle = Number.isFinite(duration) && duration > 0.2 ? duration / 2 : 0;
      try {
        video.currentTime = Math.min(middle, Math.max(0, (Number.isFinite(duration) ? duration : 0) - 0.05));
      } catch (error) {}
    }, { once: true });
    video.addEventListener("seeked", capture, { once: true });
    video.addEventListener("loadeddata", () => {
      // A browser that refuses the seek still gets a frame instead of nothing.
      setTimeout(() => { if (!settled) capture(); }, 900);
    }, { once: true });
    video.addEventListener("error", () => finish(""), { once: true });
    video.src = src;
  });
}

/* ---------------------------------------------------------------------------
   SUB-CARDS
   ---------------------------------------------------------------------------
   Any surface marked `data-subcard="<name>"` is a sub-card: it is made out of
   the wallpaper, never out of paper. The marker is the whole contract — a new
   panel only has to carry the attribute to inherit this treatment.

   A still wallpaper is baked ONCE into a card-sized picture taken from the
   pixels of the wallpaper *where the card will sit when it is open* — not from
   a global copy of the whole wallpaper. The card and its box are both known
   while the card is still closed, so the picture is rendered ahead of time and
   becomes part of the card; opening it only reveals an image that already
   exists.

   A film is baked from its paused middle frame, so its sub-cards are stills of
   the very same scene. Until that frame exists, an open card may fall back to
   the live window copy; the always-visible sub-cards never hold a second
   <video>.
   ------------------------------------------------------------------------- */

/* Two kinds of surface borrow the wallpaper pane:
     - `data-subcard`      a card made of the wallpaper (pane + card stroke),
     - `data-wallpaper-surface`  a surface that only wants the wallpaper as its
       background (the top hidden box): same baked picture, sampled at the
       host's exact box (100%); no card identity. */
const SUBCARD_SELECTOR = "[data-subcard], [data-wallpaper-surface]";
const SUBCARD_PANE_CLASS = "card-wallpaper";
const SUBCARD_PAPER_KEEP = 24;
const subcardPaperCache = new Map();
const subcardPaperPending = new Set();
let subcardPaperTimer = 0;
let cardWallpaperFrame = 0;
let cardWallpaperDeadline = 0;
let cardWallpaperClock = 0;
let cardWallpaperResizeBound = false;

function subcardHosts() {
  return [...document.querySelectorAll(SUBCARD_SELECTOR)];
}

function subcardName(host) {
  return host?.dataset?.subcard || host?.dataset?.wallpaperSurface || host?.id || "card";
}

/** A host that carries either marker may own a wallpaper pane. */
function wallpaperSurfaceHost(host) {
  return Boolean(host?.dataset?.subcard || host?.dataset?.wallpaperSurface);
}

/* The sheets that float over the room. With a film they keep a still card
   (its middle frame); the categories spine and the top box are the room itself,
   so a film stays live behind them instead of freezing those areas. */
const SUBCARD_FLOATING = new Set(["pending", "doing", "completed", "trash"]);

function subcardIsFloating(host) {
  return SUBCARD_FLOATING.has(subcardName(host));
}

function cardIsLive(host) {
  return Boolean(host?.classList.contains("open"));
}

/* The last open box of each sub-card. The live subtask card folds down to its
   handle, but it must keep baking the picture of the sheet it unfolds into. */
const subcardOpenBoxes = new WeakMap();

/** The box a sub-card occupies once it is open.
    A closed sheet only changes transform/opacity, so inverting its transform
    gives the expanded box straight away — no waiting for the slide, and no
    style write that a `!important` rule could ignore. */
function subcardBox(host) {
  if (!host) return null;
  // The live subtask card folds down to its handle, but the picture it shows
  // when it unfolds is the full sheet: keep the last open box for the bake
  // instead of baking a 28px strip.
  if (host.id === "pending-subtask-card" && host.classList.contains("collapsed")) {
    const kept = subcardOpenBoxes.get(host);
    if (kept) return kept;
  }
  const rect = host.getBoundingClientRect();
  const computed = getComputedStyle(host);
  const transform = computed.transform;
  if (!transform || transform === "none") {
    subcardOpenBoxes.set(host, rect);
    return rect;
  }
  const match = /^matrix\(([^)]+)\)$/.exec(transform);
  if (!match) return rect;
  const [a, b, c, d, e, f] = match[1].split(",").map((value) => Number(value));
  // Rotation or skew needs the full box; the sheets here only translate/scale.
  if (!a || !d || b || c) return rect;
  const width = rect.width / Math.abs(a);
  const height = rect.height / Math.abs(d);
  const origin = String(computed.transformOrigin || "50% 50%").split(" ").map(parseFloat);
  const originX = Number.isFinite(origin[0]) ? origin[0] : width / 2;
  const originY = Number.isFinite(origin[1]) ? origin[1] : height / 2;
  const left = rect.left - originX * (1 - a) - e;
  const top = rect.top - originY * (1 - d) - f;
  const box = { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top };
  subcardOpenBoxes.set(host, box);
  return box;
}

function subcardViewport() {
  return {
    width: Math.max(1, window.innerWidth),
    height: Math.max(1, window.innerHeight),
    dpr: Math.min(2, window.devicePixelRatio || 1),
  };
}

function subcardPaperKey(host, wallpaper, box) {
  const view = subcardViewport();
  const round = (value) => Math.round(value);
  return [
    wallpaper.key,
    subcardName(host),
    subcardPaperRegion(host),
    view.width, view.height, view.dpr,
    round(box.left), round(box.top), round(box.width), round(box.height),
  ].join("|");
}

/* A sub-card samples exactly its own footprint: the picture and colour come
   from the wallpaper under that card's own region, not from a wider crop of
   the layer below it.

   Every card crops from one shared sampling object: the room's bottom
   wallpaper. The finished card and the Doing card therefore read the same
   pattern and colour as the room behind them at 100% of their own boxes. They
   never sample the card below them, which was what made the upper sheets look
   progressively darker.

   The top hidden bar is also sampled at 100%: it wears the wallpaper as its
   own background and must line up with the room behind it. */
const SUBCARD_PAPER_REGION = 1;
const SURFACE_PAPER_REGION = 1;

/** How much of the wallpaper a host samples, as a multiple of its own box. */
function subcardPaperRegion(host) {
  return host?.dataset?.subcard ? SUBCARD_PAPER_REGION : SURFACE_PAPER_REGION;
}

/** The wallpaper pixels under a viewport box (the room uses object-fit: cover). */
function subcardCropSource(image, box, region = SUBCARD_PAPER_REGION) {
  const view = subcardViewport();
  const imageWidth = image.naturalWidth || view.width;
  const imageHeight = image.naturalHeight || view.height;
  const scale = Math.max(view.width / imageWidth, view.height / imageHeight);
  const offsetX = (view.width - imageWidth * scale) / 2;
  const offsetY = (view.height - imageHeight * scale) / 2;
  const left = box.left - (box.width * region - box.width) / 2;
  const top = box.top - (box.height * region - box.height) / 2;
  const width = Math.max(1, (box.width * region) / scale);
  const height = Math.max(1, (box.height * region) / scale);
  const x = (left - offsetX) / scale;
  const y = (top - offsetY) / scale;
  // Keep the sample inside the picture: a surface near an edge must not bake a
  // transparent strip where the crop runs past the wallpaper.
  return {
    x: Math.min(Math.max(0, x), Math.max(0, imageWidth - width)),
    y: Math.min(Math.max(0, y), Math.max(0, imageHeight - height)),
    width: Math.min(width, imageWidth),
    height: Math.min(height, imageHeight),
  };
}

function pruneSubcardPapers() {
  while (subcardPaperCache.size > SUBCARD_PAPER_KEEP) {
    const oldest = subcardPaperCache.keys().next();
    if (oldest.done) return;
    const record = subcardPaperCache.get(oldest.value);
    subcardPaperCache.delete(oldest.value);
    if (record?.url && record.url.startsWith("blob:")) {
      try { URL.revokeObjectURL(record.url); } catch (error) {}
    }
  }
}

/* The room's own wallpaper element: the bottom layer every card must copy.
   Cards never sample the painted card below them (that was what made the live
   card, the finished card and the Doing card look progressively darker). For
   still pictures and theme-pack pictures the original <img> is already decoded,
   so every card's pattern and colour come straight from the room. */
function roomWallpaperImage() {
  const media = $("#wallpaper-layer")?.firstElementChild;
  if (!media || media.tagName !== "IMG") return null;
  return media.complete && media.naturalWidth ? media : null;
}

/* One sampling object for every card: the subtask area picks the room's bottom
   wallpaper, and the finished card and the Doing card sample the same object
   at their own centres. The object is cached per wallpaper so the whole pile
   is always cut from one picture, never from another card's face. */
let subcardSampleObject = { wallpaper: "", image: null, url: "" };

function subcardSampleObjectFor(wallpaper) {
  if (subcardSampleObject.wallpaper !== wallpaper.key) {
    subcardSampleObject = { wallpaper: wallpaper.key, image: null, url: "" };
  }
  const room = roomWallpaperImage();
  if (room) {
    subcardSampleObject.image = room;
    subcardSampleObject.url = room.currentSrc || room.src || subcardSampleObject.url;
  }
  const bitmap = wallpaperBitmapCache.get(wallpaper.key);
  if (!subcardSampleObject.url && bitmap?.ready && bitmap.url) {
    subcardSampleObject.url = bitmap.url;
  }
  if (!subcardSampleObject.image && !subcardSampleObject.url) return null;
  return subcardSampleObject;
}

/** Bake one card-sized picture from the shared wallpaper object. */
function bakeSubcardPaper(host, wallpaper, box) {
  const key = subcardPaperKey(host, wallpaper, box);
  if (subcardPaperCache.has(key) || subcardPaperPending.has(key)) return;
  const sample = subcardSampleObjectFor(wallpaper);
  if (!sample) return;
  subcardPaperPending.add(key);
  const finish = (url) => {
    subcardPaperPending.delete(key);
    if (!url) return;
    subcardPaperCache.set(key, {
      url,
      wallpaper: wallpaper.key,
      name: subcardName(host),
      box: { left: box.left, top: box.top, width: box.width, height: box.height },
    });
    pruneSubcardPapers();
    refreshCardWallpaperPanes();
  };
  const paint = (image) => {
    try {
      // Every card keeps its own centre; only the sampling object is shared.
      const source = subcardCropSource(image, box, subcardPaperRegion(host));
      const view = subcardViewport();
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(box.width * view.dpr));
      canvas.height = Math.max(1, Math.round(box.height * view.dpr));
      const context = canvas.getContext("2d");
      if (!context) { finish(""); return; }
      context.drawImage(
        image,
        source.x, source.y, source.width, source.height,
        0, 0, canvas.width, canvas.height,
      );
      canvas.toBlob((blob) => finish(blob ? URL.createObjectURL(blob) : ""), "image/jpeg", 0.94);
    } catch (error) {
      finish("");
    }
  };
  // A still picture is copied from the shared room object itself, never from
  // another card or from a downsized intermediate: the original pixels carry
  // the pattern and the colour the reader sees behind the card.
  if (sample.image) { paint(sample.image); return; }
  const image = new Image();
  image.decoding = "async";
  image.onload = () => paint(image);
  image.onerror = () => finish("");
  image.src = sample.url;
}

/** Bake every marked sub-card for the current still wallpaper. */
function primeSubcardPapers() {
  // A finished row is flying into the tray: baking card pictures is canvas
  // work, and it must not take the animation's frames. It runs right after
  // the landing instead.
  const flightLeft = completionFlightUntil - performance.now();
  if (flightLeft > 0) {
    schedulePrimeSubcardPapers(flightLeft + 40);
    return;
  }
  const wallpaper = activeWallpaper();
  if (!wallpaper.key) return;
  // A film is baked from its middle frame, so it goes through the same path.
  if (!wallpaperBitmapCache.get(wallpaper.key)?.ready) return;
  subcardHosts().forEach((host) => {
    const box = subcardBox(host);
    if (!box || box.width < 8 || box.height < 8) return;
    bakeSubcardPaper(host, wallpaper, box);
  });
}

function schedulePrimeSubcardPapers(delay = 32) {
  if (subcardPaperTimer) return;
  subcardPaperTimer = setTimeout(() => {
    subcardPaperTimer = 0;
    primeSubcardPapers();
  }, delay);
}

function subcardPaperFor(host, wallpaper, box) {
  if (!box) return null;
  return subcardPaperCache.get(subcardPaperKey(host, wallpaper, box)) || null;
}

/** What a pane should render: the baked card picture, or the live window. */
function subcardPaneFor(host, wallpaper) {
  const patch = subcardPaperFor(host, wallpaper, subcardBox(host));
  if (patch) return { fit: "patch", url: patch.url };
  return { fit: "window", url: "" };
}

function subcardPaneMarkup(pane) {
  if (pane.fit === "patch") {
    return `<img class="wallpaper-media" src="${esc(pane.url)}" alt="" draggable="false">`;
  }
  return wallpaperMediaMarkup("", { autoplay: false });
}

function subcardPaneStamp(host, wallpaper, pane) {
  return `${subcardName(host)}|${wallpaper.key}|${pane.fit}|${pane.url}`;
}

/** Wallpaper theme: cards borrow the room's picture. Off means the cards keep
    their own paper even though the room behind them is still a wallpaper. */
function wallpaperCardsEnabled() {
  return settings.wallpaper_cards !== false;
}

function mountCardWallpaper(host) {
  const wallpaper = activeWallpaper();
  if (!wallpaper.key || (!wallpaperCardsEnabled() && host?.dataset?.subcard)) {
    host.querySelector(`:scope > .${SUBCARD_PANE_CLASS}`)?.remove();
    return;
  }
  const pane = subcardPaneFor(host, wallpaper);
  const stamp = subcardPaneStamp(host, wallpaper, pane);
  let layer = host.querySelector(`:scope > .${SUBCARD_PANE_CLASS}`);
  if (layer && layer.dataset.paneStamp === stamp) return;
  if (layer) layer.remove();
  layer = document.createElement("div");
  layer.className = SUBCARD_PANE_CLASS;
  layer.dataset.subcardPane = "1";
  layer.dataset.wallpaperKey = wallpaper.key;
  layer.dataset.wallpaperBitmap = pane.url;
  layer.dataset.paneStamp = stamp;
  layer.dataset.moving = wallpaper.moving ? "1" : "0";
  layer.dataset.fit = pane.fit;
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = subcardPaneMarkup(pane);
  const media = layer.firstElementChild;
  if (media?.tagName === "VIDEO") {
    media.muted = true;
    media.loop = true;
    media.preload = "auto";
    media.setAttribute("playsinline", "");
    media.addEventListener("loadeddata", () => placeCardWallpaper(layer), { once: true });
  }
  host.insertBefore(layer, host.firstChild);
  placeCardWallpaper(layer);
}

function ensureCardWallpapers() {
  const wallpaper = activeWallpaper();
  if (!wallpaper.key) {
    document.querySelectorAll(`.${SUBCARD_PANE_CLASS}`).forEach((layer) => layer.remove());
    return;
  }
  // A host can lose its marker (a surface that goes back to its own paper);
  // its wallpaper pane must go with it. Turning the wallpaper theme off also
  // returns the cards' own paper, while the top box keeps its borrowed picture.
  const cardsOn = wallpaperCardsEnabled();
  document.querySelectorAll(`.${SUBCARD_PANE_CLASS}`).forEach((layer) => {
    const host = layer.parentElement;
    if (!wallpaperSurfaceHost(host) || (!cardsOn && host?.dataset?.subcard)) layer.remove();
  });
  subcardHosts().forEach((host) => {
    if (!cardsOn && host.dataset.subcard) return;
    // A baked picture is the card's own surface before it ever slides out.
    // With a film, only the floating cards take a still: the categories spine
    // and the top box must keep the room's motion behind them, and must never
    // hold an extra <video> either.
    if (wallpaper.moving && !subcardIsFloating(host)) return;
    const box = subcardBox(host);
    const baked = Boolean(subcardPaperFor(host, wallpaper, box));
    if (!baked && wallpaper.moving && !cardIsLive(host)) return;
    mountCardWallpaper(host);
  });
}

/* A still card is made of the wallpaper itself: the pre-rendered picture covers
   the card's box, so there is no room offset to track. A film card is a window
   onto the room, so its viewport-sized copy is shifted by the card's own
   resting top-left corner to line the two pictures up exactly.

   The offset always comes from the card's resting box, never from the frame it
   happens to occupy mid-slide. Reading the live frame re-pinned the picture to
   the room on every animation frame, so a card that slid out carried its words
   and its stroke to the new place while its own face stayed behind: the text
   arrived and the paper had not. Anchoring the window copy to the resting box
   keeps the picture welded to the sheet for the whole trip, and the copy still
   lines up with the room frame-for-frame once the card comes to rest. */
function placeCardWallpaper(layer) {
  if (layer.dataset.fit !== "window") {
    layer.dataset.placed = "1";
    return true;
  }
  const host = layer.parentElement;
  const box = host ? subcardBox(host) : null;
  if (!box || box.width < 2 || box.height < 2) {
    layer.removeAttribute("data-placed");
    return false;
  }
  const x = `${-box.left.toFixed(2)}px`;
  const y = `${-box.top.toFixed(2)}px`;
  if (layer.style.getPropertyValue("--card-wallpaper-x") !== x) {
    layer.style.setProperty("--card-wallpaper-x", x);
  }
  if (layer.style.getPropertyValue("--card-wallpaper-y") !== y) {
    layer.style.setProperty("--card-wallpaper-y", y);
  }
  // The pane stays invisible until it sits on the right crop, so a freshly
  // mounted card never flashes the film at the wrong offset.
  layer.dataset.placed = "1";
  return true;
}

function placeCardWallpapers() {
  document.querySelectorAll(`.${SUBCARD_PANE_CLASS}`).forEach(placeCardWallpaper);
}

/* Swap a pane that is still showing the live window for the baked card picture
   the moment it exists. The card never has to render anything itself. */
function refreshCardWallpaperPanes() {
  const wallpaper = activeWallpaper();
  if (!wallpaper.key) return;
  document.querySelectorAll(`.${SUBCARD_PANE_CLASS}`).forEach((layer) => {
    const host = layer.parentElement;
    if (!wallpaperSurfaceHost(host)) return;
    if (layer.dataset.wallpaperKey !== wallpaper.key) return;
    const pane = subcardPaneFor(host, wallpaper);
    const stamp = subcardPaneStamp(host, wallpaper, pane);
    if (layer.dataset.paneStamp === stamp) return;
    layer.dataset.paneStamp = stamp;
    layer.dataset.wallpaperBitmap = pane.url;
    layer.dataset.fit = pane.fit;
    layer.innerHTML = subcardPaneMarkup(pane);
    placeCardWallpaper(layer);
  });
  // A film only mounts its always-visible sub-cards once the middle frame has
  // been baked, so newly available pictures are mounted here too.
  ensureCardWallpapers();
}

/* A film keeps playing inside an open card, and the card's copy is nudged back
   onto the room's clock whenever the two drift apart, so the pane never shows
   a different moment than the picture around it. */
function syncCardWallpaperPlayback() {
  const room = $("#wallpaper-layer video");
  document.querySelectorAll(`.${SUBCARD_PANE_CLASS} video`).forEach((video) => {
    const host = video.closest(SUBCARD_SELECTOR);
    if (!host || !cardIsLive(host) || !room) {
      if (!video.paused) video.pause();
      return;
    }
    if (room.playbackRate && video.playbackRate !== room.playbackRate) {
      video.playbackRate = room.playbackRate;
    }
    if (room.readyState >= 1 && Math.abs(video.currentTime - room.currentTime) > 0.35) {
      try { video.currentTime = room.currentTime; } catch (error) {}
    }
    if (!room.paused && video.paused) video.play().catch(() => {});
    if (room.paused && !video.paused) video.pause();
  });
}

/* Only a film carries a window copy to re-place while its resting box settles;
   a still card is baked ahead of time, so the loop is skipped entirely for it. */
function cardWallpaperLoop() {
  cardWallpaperFrame = 0;
  placeCardWallpapers();
  if (performance.now() < cardWallpaperDeadline) {
    cardWallpaperFrame = requestAnimationFrame(cardWallpaperLoop);
  }
}

function settleCardWallpapers(duration = 440) {
  placeCardWallpapers();
  // Only a live window copy (a film whose middle frame is not ready yet) needs
  // per-frame alignment; baked card pictures are already the card itself.
  if (!document.querySelector(`.${SUBCARD_PANE_CLASS}[data-fit="window"]`)) return;
  cardWallpaperDeadline = performance.now() + duration;
  if (!cardWallpaperFrame) cardWallpaperFrame = requestAnimationFrame(cardWallpaperLoop);
}

/* A card's own pane, kept in step without walking every card on the page. The
   Doing card opens and expands on the same border as the finished-subtasks
   card; rebuilding or re-aligning the other card's pane on every Doing update
   was what made the finished card look shoved aside. */
function syncCardWallpaper(host, { bakedOnly = false } = {}) {
  if (!host) return;
  const wallpaper = activeWallpaper();
  if (!wallpaper.key) {
    host.querySelector(`:scope > .${SUBCARD_PANE_CLASS}`)?.remove();
    return;
  }
  const box = subcardBox(host);
  const baked = Boolean(subcardPaperFor(host, wallpaper, box));
  // During a completion flight a film card must not mount a second <video>:
  // the baked still is enough until the row lands.
  if (bakedOnly && !baked) {
    host.querySelector(`:scope > .${SUBCARD_PANE_CLASS}`)?.remove();
    return;
  }
  if (!baked && wallpaper.moving && !cardIsLive(host)) return;
  mountCardWallpaper(host);
  host.querySelectorAll(`:scope > .${SUBCARD_PANE_CLASS}`).forEach(placeCardWallpaper);
  // A scoped pane can be the only live card: keep its film on the room's clock
  // exactly as the page-wide pass used to.
  syncCardWallpaperPlayback();
  ensureCardWallpaperClock();
}

let cardWallpaperHostFrame = 0;
let cardWallpaperHostDeadline = 0;
const cardWallpaperHosts = new Set();

/* The same placement pass as cardWallpaperLoop, scoped to the cards that are
   actually moving (the Doing drawer). The finished card keeps its own pane and
   its own alignment while the drawer slides out beside it. */
function cardWallpaperHostLoop() {
  cardWallpaperHostFrame = 0;
  cardWallpaperHosts.forEach((host) => {
    if (!host.isConnected) {
      cardWallpaperHosts.delete(host);
      return;
    }
    host.querySelectorAll(`:scope > .${SUBCARD_PANE_CLASS}`).forEach(placeCardWallpaper);
  });
  if (performance.now() < cardWallpaperHostDeadline && cardWallpaperHosts.size) {
    cardWallpaperHostFrame = requestAnimationFrame(cardWallpaperHostLoop);
  } else {
    cardWallpaperHosts.clear();
    cardWallpaperHostDeadline = 0;
  }
}

function settleCardWallpaper(host, duration = 440) {
  if (!host) return;
  const panes = [...host.querySelectorAll(`:scope > .${SUBCARD_PANE_CLASS}`)];
  panes.forEach(placeCardWallpaper);
  if (!panes.some((layer) => layer.dataset.fit === "window")) return;
  cardWallpaperHosts.add(host);
  cardWallpaperHostDeadline = Math.max(cardWallpaperHostDeadline, performance.now() + duration);
  if (!cardWallpaperHostFrame) cardWallpaperHostFrame = requestAnimationFrame(cardWallpaperHostLoop);
}

/* A film is re-checked about twice a second, and only while a card is open. */
function ensureCardWallpaperClock() {
  const live = subcardHosts().some((host) => cardIsLive(host) && host.querySelector(`.${SUBCARD_PANE_CLASS} video`));
  if (live && !cardWallpaperClock) {
    cardWallpaperClock = setInterval(syncCardWallpaperPlayback, 500);
  } else if (!live && cardWallpaperClock) {
    clearInterval(cardWallpaperClock);
    cardWallpaperClock = 0;
  }
}

function bindCardWallpaperResize() {
  if (cardWallpaperResizeBound) return;
  cardWallpaperResizeBound = true;
  window.addEventListener("resize", () => {
    placeCardWallpapers();
    // The baked picture is taken from a viewport-mapped crop, so a resize
    // invalidates it; rebake while the cards are still closed.
    schedulePrimeSubcardPapers(0);
  }, { passive: true });
}

/** Mount, place, bake and (for a film) start the pane on every sub-card. */
function syncCardWallpapers() {
  bindCardWallpaperResize();
  schedulePrimeSubcardPapers();
  ensureCardWallpapers();
  placeCardWallpapers();
  syncCardWallpaperPlayback();
  ensureCardWallpaperClock();
}

/* The floating cards are born with the room copy (`data-fit="window"`) and pick
   up their own baked picture a few frames later. That swap is invisible while
   the window is still hidden, but at launch the bake finishes just after the
   first visible frame, so the subtask card, the finished card and the Doing
   card each visibly turn from "a window onto the room" into "its own sheet".
   Bake the faces that are already in the page before startup reveals it, so
   the first frame already shows every card with its own background. */
const CARD_PREWARM_NAMES = new Set(["pending", "doing", "completed"]);

function floatingCardHosts() {
  return subcardHosts().filter((host) => {
    if (!CARD_PREWARM_NAMES.has(subcardName(host))) return false;
    const box = subcardBox(host);
    return Boolean(box && box.width >= 8 && box.height >= 8);
  });
}

function cardFacesPainted() {
  return floatingCardHosts().every((host) => {
    const pane = host.querySelector(`:scope > .${SUBCARD_PANE_CLASS}`);
    return pane?.dataset.fit === "patch";
  });
}

function prewarmCardWallpaperFaces(timeout = 1600) {
  const wallpaper = activeWallpaper();
  if (!wallpaper.key || !wallpaperCardsEnabled()) return Promise.resolve();
  // The Doing card is built on a frame tick after the first render. Build it
  // now so it joins this bake instead of switching its face after the window
  // is already on screen.
  try { updateDoingPeek(); } catch (error) {}
  ensureCardWallpapers();
  primeSubcardPapers();
  if (cardFacesPainted()) return Promise.resolve();
  return new Promise((resolve) => {
    const startedAt = performance.now();
    const step = () => {
      ensureCardWallpapers();
      primeSubcardPapers();
      // A wallpaper that failed to decode never produces a card cut; do not
      // hold startup open for it.
      if (!wallpaperBitmapCache.has(wallpaper.key)
        || cardFacesPainted()
        || performance.now() - startedAt >= timeout) {
        resolve();
        return;
      }
      setTimeout(step, 16);
    };
    step();
  });
}

function sampleWallpaperTint(media, key) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 24;
    canvas.height = 24;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    context.drawImage(media, 0, 0, 24, 24);
    const pixels = context.getImageData(0, 0, 24, 24).data;
    let red = 0, green = 0, blue = 0, weight = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] < 24) continue;
      red += pixels[index];
      green += pixels[index + 1];
      blue += pixels[index + 2];
      weight += 1;
    }
    if (!weight) return;
    const toHex = (value) => Math.round(value / weight).toString(16).padStart(2, "0");
    wallpaperTintCache.set(key, `#${toHex(red)}${toHex(green)}${toHex(blue)}`);
    if (wallpaperRenderKey() === key) {
      applyDoingPalette(THEMES[currentPostcardId()] || THEMES.light);
    }
  } catch (error) {}
}

function bindWallpaperMedia(media, key) {
  if (media.tagName === "DIV") return;
  const sample = () => sampleWallpaperTint(media, key);
  const dropMissingWallpaper = () => {
    if (wallpaperRenderKey() !== key) return;
    // The file was moved or deleted. Drop the choice and let the postcard
    // paper show through instead of silently using a different picture.
    settings.wallpaper = "";
    saveSettings();
    applySettings();
    if (settingsTab === "theme") renderSettings();
    toast("That wallpaper could not be opened", true);
  };
  media.addEventListener("error", () => {
    if (wallpaperRenderKey() !== key) return;
    // A picked file is only served once the store knows its path. The room
    // mounts the picture before the debounced settings save lands, so the very
    // first request can answer 404. Flush the choice and ask once more before
    // dropping it: without this retry the reader had to pick the same
    // wallpaper twice before it appeared.
    if (media.dataset.wallpaperRetried !== "1") {
      media.dataset.wallpaperRetried = "1";
      Promise.resolve(flushSettingsSave()).finally(() => {
        if (wallpaperRenderKey() !== key) return;
        const src = media.getAttribute("src") || "";
        if (!src) { dropMissingWallpaper(); return; }
        // Re-assigning the same src still asks the server again.
        media.removeAttribute("src");
        media.setAttribute("src", src);
        if (media.tagName === "VIDEO") media.play().catch(() => {});
      });
      return;
    }
    dropMissingWallpaper();
  });
  if (media.tagName === "IMG") {
    if (media.complete && media.naturalWidth) sample();
    else media.addEventListener("load", sample, { once: true });
    return;
  }
  if (media.readyState >= 2) sample();
  media.addEventListener("loadeddata", sample, { once: true });
  media.addEventListener("seeked", sample, { once: true });
  const play = () => media.play().catch(() => {});
  play();
}

function applyWallpaper() {
  const root = document.documentElement;
  const wallpaper = activeWallpaper();
  const layer = $("#wallpaper-layer");
  // One wallpaper switch now covers pictures and films alike, so CSS asks
  // "is a wallpaper on?" instead of naming a static or dynamic mode. The one
  // thing a surface may still need to know is whether the room moves: a still
  // wallpaper can be tinted like the right-hand card, while a film needs a
  // reading mask instead. That is published next to the switch, so the Head
  // Bar can pick the same recipe the cards use without asking the backend.
  if (wallpaper.key) root.setAttribute("data-wallpaper", "on");
  else root.removeAttribute("data-wallpaper");
  if (wallpaper.key) root.setAttribute("data-wallpaper-motion", wallpaper.moving ? "film" : "still");
  else root.removeAttribute("data-wallpaper-motion");
  // Wallpaper theme: the cards are cut out of the room itself when on. Blur:
  // a frosted pane sits between the room and the page, so text and icons are
  // printed on glass instead of on the picture.
  if (wallpaper.key && settings.wallpaper_cards !== false) root.setAttribute("data-wallpaper-cards", "on");
  else root.removeAttribute("data-wallpaper-cards");
  const glassAmount = Math.min(100, Math.max(0, Number(settings.wallpaper_blur) || 0));
  const glassOn = wallpaper.key && settings.wallpaper_blur_on === true;
  if (glassOn) root.setAttribute("data-wallpaper-blur", "on");
  else root.removeAttribute("data-wallpaper-blur");
  // 0..100 reads as a percentage; the painted radius tops out at 40px, and the
  // paper veil thickens a little as the glass gets stronger.
  root.style.setProperty("--wallpaper-veil-blur", `${(glassAmount * 0.4).toFixed(2)}px`);
  root.style.setProperty("--wallpaper-veil-alpha", (0.12 + glassAmount * 0.0026).toFixed(3));
  if (!layer) return;
  if (!wallpaperVisibilityBound) {
    wallpaperVisibilityBound = true;
    document.addEventListener("visibilitychange", () => {
      const video = layer.querySelector("video");
      if (!video) return;
      if (document.hidden) video.pause();
      else video.play().catch(() => {});
    });
  }
  layer.hidden = !wallpaper.key;
  const key = wallpaper.key;
  if (key !== wallpaperMediaKey) {
    wallpaperMediaKey = key;
    layer.innerHTML = key ? wallpaperMediaMarkup() : "";
    const media = layer.firstElementChild;
    if (media) bindWallpaperMedia(media, key);
    if (doingPeekOpen) updateDoingPeek(true);
  }
  // The card panes only ever use the pre-rendered picture, so it is prepared
  // here — before a card opens — rather than while the card slides out.
  primeWallpaperBitmap(wallpaper);
  // A new room means a new picture in every sub-card. The drawer keeps its
  // markup until the next render, so the panes are mounted here instead.
  document.querySelectorAll(`.${SUBCARD_PANE_CLASS}`).forEach((pane) => {
    if (pane.dataset.wallpaperKey !== key) pane.remove();
  });
  pruneWallpaperBitmaps(key);
  schedulePrimeSubcardPapers(0);
  syncCardWallpapers();
}

function applyDoingPalette(postcard) {
  const root = document.documentElement;
  const theme = postcard || THEMES[currentPostcardId()] || THEMES.light;
  const wallpaper = activeWallpaper();
  // With the wallpaper theme off the right-hand card is a theme card again: it
  // must not borrow the room's tint even though a wallpaper is behind it.
  const cardsLook = settings.wallpaper_cards !== false;
  const artTheme = cardsLook && wallpaper.kind === "art" ? THEMES[wallpaper.artId] : null;
  const tint = !cardsLook
    ? ""
    : artTheme
      ? (artTheme.paper2 || artTheme.accent)
      : (wallpaper.file ? wallpaperTintCache.get(wallpaper.key) : "");
  // The wallpaper card face uses this same sampled tint for its single 7%
  // wash. It is the room's own colour, so the wash can never act as a second,
  // grey paper veil on top of the picture. With no wallpaper (or with the
  // wallpaper card theme off) the property is removed and the CSS falls back
  // to the theme paper.
  if (tint) root.style.setProperty("--wallpaper-tint", tint);
  else root.style.removeProperty("--wallpaper-tint");
  const dark = postcardIsDark(currentPostcardId());
  let doingPaper, doingPaper2;
  if (tint) {
    // The right-hand card belongs to the wallpaper, not to the postcard
    // palette. Tinting the paper keeps the text readable while the card art
    // still follows whatever picture or film is behind the app. A wallpaper
    // that is much lighter (or darker) than the theme gets a gentler mix so
    // the ink never disappears into the card.
    const tintLum = hexLuminance(tint);
    let amount = dark ? 0.36 : 0.28;
    if (dark && tintLum > 0.45) amount = 0.14;
    if (!dark && tintLum < 0.35) amount = 0.14;
    doingPaper = mixHex(theme.paper, tint, amount);
    doingPaper2 = mixHex(theme.paper2, tint, Math.min(0.5, amount + 0.08));
  } else {
    doingPaper = dark ? mixHex(theme.paper, "#ffffff", 0.10) : theme.paper;
    doingPaper2 = dark ? mixHex(theme.paper2, "#ffffff", 0.14) : theme.paper2;
  }
  root.style.setProperty("--doing-paper", doingPaper);
  root.style.setProperty("--doing-paper2", doingPaper2);
}

function fontHexColor(value) {
  return /^#[0-9a-f]{6}$/i.test(String(value || "")) ? String(value).toLowerCase() : "";
}

// Body size drives the app-wide text scale; the note size only reaches the
// notebook, where it overrides --user-scale. A reader-picked body ink wins over
// the postcard palette until they clear it.
function applyFontSettings() {
  const root = document.documentElement;
  const bodyScale = Math.min(1.25, Math.max(0.875, (Number(settings.body_font_size) || 16) / 16));
  settings.scale = bodyScale;
  root.style.setProperty("--user-scale", String(bodyScale));
  const noteScale = Math.min(2, Math.max(0.7, (Number(settings.note_font_size) || 14) / 14));
  root.style.setProperty("--note-user-scale", String(noteScale));
  // Never leave --pc-ink unset: postcard text fallbacks read it directly. With
  // no reader pick the row returns to the current theme's own ink.
  const themeInk = (THEMES[currentPostcardId()] || THEMES.light)?.ink || "#332b2d";
  const bodyInk = fontHexColor(settings.body_font_color) || themeInk;
  for (const slot of ["--ink", "--ink-soft", "--pc-ink", "--pc-ink-soft"]) {
    root.style.setProperty(slot, bodyInk);
  }
  // Selected rows and cards tint with the same ink, so a live font-colour drag
  // repaints the wash without waiting for the next theme pass.
  root.style.setProperty("--ink-rgb", hexToRgb(bodyInk));
  applyHighlight();
}

function applySettings() {
  const root = document.documentElement;
  settings.theme = "postcard";
  root.dataset.theme = "postcard";
  root.dataset.noteMaterial = settings.note_material;
  let noteBg = "";
  if (settings.note_background === "__custom") noteBg = settings.note_background_image;
  else noteBg = NOTE_BG_PRESETS[settings.note_background] || "";
  root.style.setProperty("--note-bg-image", noteBg ? `url("${noteBg}")` : "none");
  root.style.setProperty("--note-blur", `${settings.note_blur}px`);
  // page_line owns every horizontal divider on the page: the header, the task
  // rows and the empty desk share one grid and one colour. It reads
  // page-line.json, never a postcard, note or AI palette.
  applyPageLine();
  // The row-rule file now only covers the finished-subtasks drawer; it still
  // repaints immediately so a theme switch cannot leave a stale card hairline.
  applyBaselineRowRule();
  applyStickerBackgrounds();
  root.dataset.font = settings.font;
  root.dataset.noteFont = settings.note_font;
  document.body.classList.toggle("clock-hidden", !settings.show_clock);
  document.body.classList.toggle("brand-hidden", settings.show_brand === false);
  document.body.classList.toggle("achievements-hidden", settings.show_achievements === false);
  document.body.classList.add("custom-caret");
  const soundStyle = activeSoundStyle();
  AudioFX.setSoundStyle(soundStyle.id, soundStyle.files);
  AudioFX.setSampleOverrides(settings.sound_overrides);
  applyPluginState();
  scheduleCustomCaret();
  updateTopClock();
  const backdrop = $("#postcard-backdrop");
  {
    const postcard = THEMES[currentPostcardId()] || THEMES.light;
    root.dataset.postcard = currentPostcardId();
    root.dataset.postcardDark = postcardIsDark(currentPostcardId()) ? "true" : "false";
    const accent = readableAccent(postcard, postcard.accent);
    const accent2 = readableAccent(postcard, postcard.accent2);
    root.style.setProperty("--pc-accent", accent);
    root.style.setProperty("--pc-accent-2", accent2);
    root.style.setProperty("--pc-accent-rgb", hexToRgb(accent));
    root.style.setProperty("--pc-accent2-rgb", hexToRgb(accent2));
    // The add / complete actions read the theme's own submit colour. Packs that
    // do not declare one fall back to the accent, which is the old behaviour.
    root.style.setProperty(
      "--submit-color",
      normalizeBaselineColorInput(themeChromeFor(currentPostcardId()).submit || "") || accent
    );
    root.style.setProperty("--pc-glow", postcard.glow || "rgba(184,140,255,.24)");
    root.style.setProperty("--pc-paper", postcard.paper);
    root.style.setProperty("--pc-paper-rgb", hexToRgb(postcard.paper));
    root.style.setProperty("--pc-paper2", postcard.paper2);
    root.style.setProperty("--pc-paper2-rgb", hexToRgb(postcard.paper2));
    applyDoingPalette(postcard);
    root.style.setProperty("--pc-ink", postcard.ink);
    root.style.setProperty("--pc-muted", postcard.muted);
    root.style.setProperty("--pc-border", postcard.border || postcard.accent2);
    root.style.setProperty("--pc-stamp", postcard.stamp || postcard.accent);
    const lineAlpha = Number.isFinite(Number(postcard.lineAlpha))
      ? Math.min(1, Math.max(0.05, Number(postcard.lineAlpha)))
      : 0.42;
    const ruleAlpha = Number.isFinite(Number(postcard.ruleAlpha))
      ? Math.min(1, Math.max(0.03, Number(postcard.ruleAlpha)))
      : 0.28;
    root.style.setProperty("--pc-line", postcard.line
      ? `rgba(${hexToRgb(postcard.line)}, ${lineAlpha})`
      : `rgba(${hexToRgb(postcard.ink)}, .16)`);
    root.style.setProperty("--pc-rule", postcard.rule
      ? `rgba(${hexToRgb(postcard.rule)}, ${ruleAlpha})`
      : `rgba(${hexToRgb(postcard.ink)}, .13)`);
    // The notebook and the AI console carry their own theme, independent of
    // the app paper. Their line colours ride along with those palettes.
    applyPaneThemes();
    // The postcard scene is a wallpaper now; it no longer paints a second
    // copy behind the page as part of the theme.
    if (backdrop) {
      backdrop.hidden = true;
      backdrop.innerHTML = "";
    }
  }
  // Sizes and inks land after the postcard slots so a reader-picked body ink
  // is not immediately replaced by the theme's own --pc-ink.
  applyFontSettings();
  // The reader's own highlight wash: the page's font ink by default, or their
  // saved colour behind the active row, the focused menu entry and the chosen
  // settings card.
  applyHighlight();
  applyWallpaper();
  applyIconTheme();
  const achievement = $("#achievement-icon-use");
  if (achievement) achievement.setAttribute("href", "#headphone");
  const topAchievement = $("#top-achievement-use");
  if (topAchievement) topAchievement.setAttribute("href", "#headphone");
  updateArchiveIcon();
}

function openSettings(tab = "theme") {
  // The AI sheet moved to its own window behind the robot icon in the top
  // rail. Older links and shortcuts still ask Settings for it.
  if (tab === "ai") {
    openAiSettings();
    return;
  }
  // Community is a plugin now: old links still land on its shop page.
  if (tab === "community" || tab === "themes") {
    openCommunityPlugin(tab === "themes" ? "themes" : "plugins");
    return;
  }
  // Older links and shortcuts still say "appearance"; Theme is the tab now.
  // Typography became Font and Pictures became Stickers.
  settingsTab = tab === "appearance" ? "theme"
    : tab === "typography" ? "font"
    : tab === "pictures" ? "stickers"
    : tab;
  // One sheet at a time: opening Settings folds the Community window away.
  closeCommunity();
  pluginDetailId = null;
  pluginPendingUninstallId = null;
  const activeId = currentPostcardId();
  customThemesOpen = themeModeFor(activeId) === "custom";
  themeManageOpen = false;
  wallpaperManageOpen = false;
  // The Theme row starts on the app palette every time the sheet opens; the
  // menu itself switches it to the note or AI palette without leaving the row.
  themeFieldMode = "app";
  caretFieldMode = "app";
  fontManageOpen.body = false;
  fontManageOpen.note = false;
  customThemeEditorOpen = false;
  customThemeDraft = null;
  customThemeBusy = false;
  pendingCustomThemeDeleteId = null;
  AudioFX.paper();
  $("#modal-root").innerHTML = '<div class="settings-stage"><div class="settings-panel" role="dialog" aria-modal="true" aria-label="Settings"></div></div>';
  const stage = $(".settings-stage");
  stage.addEventListener("mousedown", (event) => {
    if (event.target === stage) closeSettings();
  });
  renderSettings();
  if (settingsTab === "theme") {
    // note-theme/ and ai-theme/ are plain folders: pick up any file the user
    // dropped in while the settings sheet was closed.
    loadThemePacks().then(() => { if (settingsTab === "theme") renderSettings(); });
    loadIconThemes().then(() => { if (settingsTab === "theme") renderSettings(); });
  } else if (settingsTab === "sound") {
    // A style is just a folder on the sounds shelf; refresh it so a folder
    // added in the file manager shows up without reopening Settings.
    loadSoundStyles().then(() => { if (settingsTab === "sound") renderSettings(); });
  }
}

/**
 * The AI sheet is its own window now, reached from the robot icon in the top
 * rail. It borrows the Settings stage and panel so both sheets open, dim and
 * close the same way, but it carries no Settings nav: the AI tabs are the only
 * navigation inside it.
 */
function aiSettingsModalOpen() {
  return Boolean($(".ai-settings-panel"));
}

function openAiSettings() {
  if (aiSettingsModalOpen()) return;
  // Flush any half-typed Settings value before its stage is replaced.
  if ($(".settings-panel")) closeSettings();
  closeCommunity();
  pluginDetailId = null;
  pluginPendingUninstallId = null;
  AudioFX.paper();
  $("#modal-root").innerHTML = `<div class="settings-stage ai-settings-stage">
    <div class="settings-panel ai-settings-panel" role="dialog" aria-modal="true" aria-label="AI settings">
      <section class="settings-main">
        <div class="settings-topbar"><button class="settings-close" type="button" data-action="close-ai-settings" aria-label="Close AI settings"><svg class="settings-close-icon" aria-hidden="true"><use href="#close-circle"></use></svg></button></div>
        <div class="settings-scroll"><div class="settings-view" data-ai-settings-view></div></div>
      </section>
    </div>
  </div>`;
  const stage = $(".ai-settings-stage");
  if (stage) {
    stage.addEventListener("mousedown", (event) => {
      if (event.target === stage) closeAiSettings();
    });
  }
  renderAiSettingsModal();
  if (!aiConfig) loadAiConfig().then(() => { if (aiSettingsModalOpen()) renderAiSettingsModal(); });
}

function renderAiSettingsModal() {
  const view = $("[data-ai-settings-view]");
  if (!view) return;
  const scroll = $(".ai-settings-panel .settings-scroll");
  const previousScroll = scroll?.scrollTop || 0;
  view.innerHTML = aiSettings();
  if (scroll && previousScroll) scroll.scrollTop = previousScroll;
}

function closeAiSettings() {
  // A quick instruction edit should still reach disk when the sheet closes.
  const instructions = document.querySelector("[data-ai-instructions]");
  if (instructions && aiConfig && instructions.value !== aiConfig.custom_instructions) {
    clearTimeout(aiInstructionsTimer);
    aiSaveConfig({ custom_instructions: instructions.value }, { rerender: false });
  }
  pluginDetailId = null;
  pluginPendingUninstallId = null;
  $("#modal-root").innerHTML = "";
}

function closeSettings() {
  flushSettingsSave();
  // A quick instruction edit followed by Escape should still reach disk.
  const instructions = document.querySelector("[data-ai-instructions]");
  if (instructions && aiConfig && instructions.value !== aiConfig.custom_instructions) {
    clearTimeout(aiInstructionsTimer);
    aiSaveConfig({ custom_instructions: instructions.value }, { rerender: false });
  }
  pluginDetailId = null;
  pluginPendingUninstallId = null;
  $("#modal-root").innerHTML = "";
}

function paneThemeCardMarkup(choice, kind) {
  const palette = choice.palette;
  const isAi = kind === "ai";
  const auto = isAi && choice.id === "auto";
  const active = settings[isAi ? "ai_theme" : "note_theme"] === choice.id;
  const paper = auto ? "#ffffff" : palette.paper || palette.bg;
  const ink = auto ? "#7c7c83" : palette.ink;
  const rule = auto
    ? "linear-gradient(90deg, #d8d8dc 50%, #4a4b54 50%)"
    : palette.rule || palette.line;
  const dot = auto ? "#b4b4bb" : palette.accent;
  const dot2 = auto ? "#4a4b54" : (isAi ? palette.notice : palette.accent2);
  const swatchStyle = auto
    ? `background:linear-gradient(90deg,#ffffff 50%,#202126 50%);color:#7c7c83`
    : `background:${esc(paper)};color:${esc(ink)}`;
  return `<button class="pane-theme-card ${active ? "active" : ""}" type="button" data-${isAi ? "ai" : "note"}-theme-choice="${esc(choice.id)}" aria-pressed="${active ? "true" : "false"}">
    <span class="pane-theme-swatch" style="${swatchStyle}">
      <span class="pane-theme-aa">Aa</span>
      <span class="pane-theme-rule one" style="background:${rule}"></span>
      <span class="pane-theme-rule two" style="background:${rule};opacity:.6"></span>
      <span class="pane-theme-rule three" style="background:${rule};opacity:.35"></span>
      <span class="pane-theme-dots"><i style="background:${dot}"></i><i style="background:${dot2}"></i></span>
    </span>
    <span class="pane-theme-copy"><strong>${esc(choice.name)}</strong><small>${esc(choice.english || "")}</small></span>
    <span class="choice-check">✓</span>
  </button>`;
}

// Settings re-renders the whole theme view on every fold/tab change. Put
// keyboard focus back on the control the reader just used instead of letting
// it fall to <body>; preventScroll keeps the sheet where it was.
function restoreThemeFocus(selector) {
  requestAnimationFrame(() => {
    const node = document.querySelector(selector);
    if (node && !node.disabled) node.focus({ preventScroll: true });
  });
}

function themeSettings() {
  const currentId = currentPostcardId();
  const userThemeIds = themePacks.map((pack) => pack.id).filter((id) => THEMES[id]);
  // One flat shelf: the two bases, the built-in palettes and every installed
  // pack. The reader only needs the theme name to switch — no thumbnails.
  const installedIds = [...new Set([
    BASE_LIGHT_THEME,
    BASE_DARK_THEME,
    ...POSTCARD_IDS.filter((id) => THEMES[id]),
    ...userThemeIds,
  ])];
  const installedMenuItem = (id) => {
    const theme = THEMES[id];
    if (!theme) return "";
    const active = currentId === id;
    const pack = themePacks.find((item) => item.id === id);
    const customFile = Boolean(pack) && Array.isArray(pack.tags) && pack.tags.includes("custom");
    const name = pack?.name || postcardName(id);
    return `<div class="theme-menu-row ${active ? "active" : ""}">
      <button class="theme-menu-item" type="button" role="option" aria-selected="${active ? "true" : "false"}" data-postcard-choice="${esc(id)}">
        <span class="theme-menu-name">${esc(name)}</span>
        <span class="choice-check" aria-hidden="true">✓</span>
      </button>
      ${customFile ? `<button class="theme-menu-remove" type="button" data-action="remove-theme-pack" data-theme-id="${esc(id)}" aria-label="Delete ${esc(name)}">×</button>` : ""}
    </div>`;
  };
  const paneMenuItem = (choice, kind) => {
    const active = settings[kind === "ai" ? "ai_theme" : "note_theme"] === choice.id;
    return `<div class="theme-menu-row ${active ? "active" : ""}">
      <button class="theme-menu-item" type="button" role="option" aria-selected="${active ? "true" : "false"}" data-${kind}-theme-choice="${esc(choice.id)}">
        <span class="theme-menu-name">${esc(choice.name)}</span>
        <span class="choice-check" aria-hidden="true">✓</span>
      </button>
    </div>`;
  };
  const menuChevron = `<svg class="theme-menu-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const menuShell = (name, ariaLabel, items) => `<details class="theme-menu" data-theme-menu>
    <summary class="theme-menu-trigger" aria-label="${esc(ariaLabel)}: ${esc(name)}">
      <span class="theme-menu-name">${esc(name)}</span>
      ${menuChevron}
    </summary>
    <div class="theme-menu-list">
      <div class="theme-menu-items" role="listbox" aria-label="${esc(ariaLabel)}">${items}</div>
    </div>
  </details>`;
  const noteChoices = noteThemeChoices();
  const noteCurrent = selectedNoteTheme();
  const aiChoices = aiThemeChoices();
  const aiCurrent = aiChoices.find((choice) => choice.id === settings.ai_theme) || aiChoices[0];
  const unitThemeName = (mode) => mode === "note"
    ? noteCurrent.name
    : mode === "ai"
      ? (settings.ai_theme === "auto" ? "Auto" : aiCurrent.name)
      : postcardName(currentId);
  const fieldMode = themeFieldMode === "note" || themeFieldMode === "ai" ? themeFieldMode : "app";
  const fieldTitle = (THEME_UNITS.find((unit) => unit.id === fieldMode) || THEME_UNITS[0]).label;
  const fieldName = unitThemeName(fieldMode);
  // Note surface belongs to the note palette, not to the page-wide Palette
  // plugin: it only appears while the Theme unit is switched to Note theme.
  const currentSurface = activeNoteSurfaceFile();
  const noteSurfaceRow = noteSurfaceChoices().map((surface) => `<button class="theme-chip ${currentSurface === surface.file ? "active" : ""}" type="button" data-note-surface-file="${esc(surface.file)}" aria-pressed="${currentSurface === surface.file ? "true" : "false"}">${esc(surface.name)}</button>`).join("");
  const focusSurface = settings.note_material === "focus";
  const glassBackgroundRow = (focusSurface || settings.note_material === "blur") ? `<div class="settings-section theme-settings-row">
      <div class="theme-settings-title">${focusSurface ? "Frost blur" : "Glass background"}</div>
      <div class="theme-settings-controls">
        ${focusSurface ? "" : `<button class="theme-chip ${settings.note_background === "" ? "active" : ""}" type="button" data-note-bg-preset="">Default</button>
        ${Object.keys(NOTE_BG_PRESETS).map((id) => `<button class="theme-chip ${settings.note_background === id ? "active" : ""}" type="button" data-note-bg-preset="${id}">${id[0].toUpperCase() + id.slice(1)}</button>`).join("")}
        ${settings.note_background_image ? `<button class="theme-chip ${settings.note_background === "__custom" ? "active" : ""}" type="button" data-note-bg-preset="__custom">Custom</button>` : ""}
        <button class="theme-chip-button" type="button" data-action="choose-note-bg-custom">Pick image</button>`}
        <input id="note-blur-range" type="range" min="0" max="40" step="2" value="${settings.note_blur}" aria-label="${focusSurface ? "Frost blur" : "Glass blur"}">
        <span id="note-blur-value" class="theme-value">${settings.note_blur * (focusSurface ? 2 : 1)} px</span>
        <input type="file" id="note-bg-input" accept="image/*" hidden>
      </div>
    </div>` : "";
  // One compact name for the style box: "Blink · Line" or "Line". The shared
  // unit follows the note caret and applies its choice to both panes, so it
  // always shows a real style instead of a "mixed" placeholder.
  const caretStyleName = (blink, shape) => {
    const shapeName = shape === "block" ? "Block" : "Line";
    return blink === true ? `Blink · ${shapeName}` : shapeName;
  };
  const caretUnitShape = (mode) => mode === "note"
    ? settings.caret_shape
    : mode === "ai" ? settings.ai_caret_shape : settings.caret_shape;
  const caretUnitBlink = (mode) => mode === "note"
    ? settings.caret_blink
    : mode === "ai" ? settings.ai_caret_blink : settings.caret_blink;
  const caretMode = CARET_UNITS.some((unit) => unit.id === caretFieldMode) ? caretFieldMode : "app";
  const caretTitle = (CARET_UNITS.find((unit) => unit.id === caretMode) || CARET_UNITS[0]).label;
  const caretShapeAttr = caretMode === "app"
    ? "data-shared-caret-shape"
    : caretMode === "ai" ? "data-ai-caret-shape" : "data-caret-shape";
  const caretBlinkAction = caretMode === "app"
    ? "toggle-shared-caret-blink"
    : caretMode === "ai" ? "toggle-ai-caret-blink" : "toggle-caret-blink";
  const editorDraft = customThemeDraft || defaultCustomThemeDraft();
  const fieldMenuItems = fieldMode === "note"
    ? noteChoices.map((choice) => paneMenuItem(choice, "note")).join("")
    : fieldMode === "ai"
      ? aiChoices.map((choice) => paneMenuItem(choice, "ai")).join("")
      : installedIds.map(installedMenuItem).join("");
  const themeFieldMenu = menuShell(fieldName, fieldTitle, fieldMenuItems);
  // The left label is the unit switch: the three units stack vertically.
  // The active one keeps the highlight and check.
  const themeUnitMenu = `<details class="theme-menu theme-unit-menu" data-theme-menu>
    <summary class="theme-menu-trigger theme-unit-trigger" aria-label="Theme unit: ${esc(fieldTitle)}">
      <span class="theme-menu-name">${esc(fieldTitle)}</span>
      ${menuChevron}
    </summary>
    <div class="theme-menu-list theme-unit-list">
      <div class="theme-unit-items" role="listbox" aria-label="Theme units">
        ${THEME_UNITS.map((unit) => {
          const active = fieldMode === unit.id;
          return `<button class="theme-unit-row ${active ? "active" : ""}" type="button" role="option" aria-selected="${active ? "true" : "false"}" data-theme-field-mode="${esc(unit.id)}">
            <span class="theme-menu-name">${esc(unit.label)}</span>
            <span class="choice-check" aria-hidden="true">✓</span>
          </button>`;
        }).join("")}
      </div>
    </div>
  </details>`;
  // Caret follows the Theme row: one unit switch on the left, one box on the
  // right. The box only shows the current style; opening it lists Blink, Line
  // and Block, so the three chips no longer eat the row.
  const caretStyleRow = (label, attrs, active) => `<div class="theme-menu-row ${active ? "active" : ""}">
    <button class="theme-menu-item" type="button" role="option" aria-selected="${active ? "true" : "false"}" ${attrs}>
      <span class="theme-menu-name">${esc(label)}</span>
      <span class="choice-check" aria-hidden="true">✓</span>
    </button>
  </div>`;
  const caretShape = caretUnitShape(caretMode);
  const caretBlink = caretUnitBlink(caretMode);
  const caretFieldMenu = menuShell(caretStyleName(caretBlink, caretShape), `${caretTitle} style`, `
    ${caretStyleRow("Blink", `data-action="${caretBlinkAction}"`, caretBlink === true)}
    ${caretStyleRow("Line", `${caretShapeAttr}="line"`, caretShape === "line")}
    ${caretStyleRow("Block", `${caretShapeAttr}="block"`, caretShape === "block")}
  `);
  const caretColor = caretMode === "ai" ? aiCaretColor() : settings.caret_color;
  const caretColorControls = `<input id="caret-color" class="theme-color-input" type="color" value="${caretColor}" aria-label="Caret colour">
    <input id="caret-color-hex" class="theme-hex-input" type="text" maxlength="7" spellcheck="false" value="${caretColor}" aria-label="Caret colour hex">`;
  const caretUnitMenu = `<details class="theme-menu theme-unit-menu" data-theme-menu>
    <summary class="theme-menu-trigger theme-unit-trigger caret-unit-trigger" aria-label="Caret unit: ${esc(caretTitle)}">
      <span class="theme-menu-name">${esc(caretTitle)}</span>
      ${menuChevron}
    </summary>
    <div class="theme-menu-list theme-unit-list">
      <div class="theme-unit-items" role="listbox" aria-label="Caret units">
        ${CARET_UNITS.map((unit) => {
          const active = caretMode === unit.id;
          return `<button class="theme-unit-row ${active ? "active" : ""}" type="button" role="option" aria-selected="${active ? "true" : "false"}" data-caret-field-mode="${esc(unit.id)}">
            <span class="theme-menu-name">${esc(unit.label)}</span>
            <span class="choice-check" aria-hidden="true">✓</span>
          </button>`;
        }).join("")}
      </div>
    </div>
  </details>`;
  const caretRow = `<div class="settings-section theme-settings-row theme-main-row" data-caret-field-row>
    ${caretUnitMenu}
    <div class="theme-settings-controls">
      ${caretFieldMenu}
      ${caretColorControls}
    </div>
  </div>`;
  const colorField = (key, label) => `<label class="custom-theme-color">
    <span>${label}</span>
    <input type="color" data-custom-theme-color="${key}" value="${esc(editorDraft[key])}" aria-label="${label}">
    <code data-custom-theme-hex="${key}">${esc(editorDraft[key])}</code>
  </label>`;
  const editor = customThemeEditorOpen ? `<div class="custom-theme-editor" data-custom-theme-editor>
    <div class="custom-theme-editor-head">
      <div><strong>New custom theme</strong></div>
      <button class="custom-theme-editor-close" type="button" data-action="cancel-custom-theme" aria-label="Close">×</button>
    </div>
    <label class="custom-theme-name"><span>Name</span><input type="text" data-custom-theme-name maxlength="60" value="${esc(editorDraft.name)}" placeholder="My theme" spellcheck="false"></label>
    <div class="custom-theme-colors">${colorField("paper", "Paper")}${colorField("ink", "Font")}${colorField("line", "Underline")}${colorField("accent", "Accent")}</div>
    <div class="custom-theme-preview" data-custom-theme-preview style="background:${esc(editorDraft.paper)};color:${esc(editorDraft.ink)}">
      <span data-custom-theme-preview-text style="border-bottom:2px solid ${esc(editorDraft.line)}">Every line can carry its own colour.</span>
      <i data-custom-theme-preview-dot style="background:${esc(editorDraft.accent)}"></i>
    </div>
    <div class="custom-theme-editor-actions">
      <button class="theme-chip-button" type="button" data-action="cancel-custom-theme">Cancel</button>
      <button class="theme-chip-button" type="button" data-action="save-custom-theme" ${customThemeBusy ? "disabled" : ""}>${customThemeBusy ? "Saving…" : "Save theme"}</button>
    </div>
  </div>` : "";
  const managePanel = themeManageOpen ? `<div class="theme-manage-panel">
    <div class="theme-manage-actions">
      <button class="theme-chip-button" type="button" data-action="import-theme-pack" ${themePackBusy === "import" ? "disabled" : ""}>${themePackBusy === "import" ? "Importing…" : "Import .zip"}</button>
      <button class="theme-chip-button theme-folder-button" type="button" data-action="open-theme-packs-folder" title="Open the theme folder" aria-label="Open the theme folder">${FOLDER_GLYPH}</button>
    </div>
    <input type="file" accept=".zip,application/zip" data-theme-pack-input hidden>
  </div>` : "";
  // The Theme row itself is the selector. Its menu can switch between the app
  // palette, the notebook palette and the console palette; the row title and
  // value follow that choice, and every list uses the same menu layout.
  const themeRow = `<div class="settings-section theme-settings-row theme-main-row ${fieldMode === "app" && themeManageOpen ? "theme-manage-open" : ""}" data-theme-field-row>
    ${themeUnitMenu}
    <div class="theme-settings-controls">
      ${themeFieldMenu}
      ${fieldMode === "app"
        ? `<button class="theme-chip-button ${themeManageOpen ? "active" : ""}" type="button" data-action="toggle-theme-manage" aria-expanded="${themeManageOpen ? "true" : "false"}">Manage</button>`
        : fieldMode === "ai"
          ? `<button class="theme-chip-button" type="button" data-action="open-ai-themes-folder" title="${esc(paneThemeFolders.ai || "ai-theme")}">Folder</button>`
          : ""}
    </div>
  </div>`;
  // The bottom of Appearance is one fold-out row. The four display switches
  // share the same list, each with its own on/off thumb.
  const otherSwitch = (title, action, on, ariaOn, ariaOff) => `<div class="theme-others-item">
    <div class="theme-settings-title">${title}</div>
    <div class="theme-others-side">
      <span class="theme-others-state ${on ? "on" : "off"}">${on ? "On" : "Off"}</span>
      <button class="sound-switch theme-setting-switch ${on ? "on" : "off"}" type="button" data-action="${action}" aria-pressed="${on ? "true" : "false"}" aria-label="${on ? ariaOff : ariaOn}"><span class="sound-switch-knob"></span></button>
    </div>
  </div>`;
  const othersRow = `<div class="settings-section theme-others-section ${themeOthersOpen ? "open" : ""}">
    <button class="theme-others-trigger" type="button" data-action="toggle-theme-others" aria-expanded="${themeOthersOpen ? "true" : "false"}" aria-controls="theme-others-panel">
      <span class="theme-settings-title">Others</span>
      <svg class="theme-menu-chevron theme-others-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    ${themeOthersOpen ? `<div class="theme-others-panel" id="theme-others-panel">
      ${otherSwitch("Time cost", "toggle-time-cost", settings.show_time_cost === true, "Turn time cost on", "Turn time cost off")}
      ${otherSwitch("Current time", "toggle-show-clock", settings.show_clock !== false, "Turn current time on", "Turn current time off")}
      ${otherSwitch("Logo", "toggle-show-brand", settings.show_brand !== false, "Show the top-left logo", "Hide the top-left logo")}
      ${otherSwitch("Achievements", "toggle-show-achievements", settings.show_achievements !== false, "Show the top-right achievements", "Hide the top-right achievements")}
    </div>` : ""}
  </div>`;
  return `${themeRow}
    ${fieldMode === "app" ? managePanel : ""}
    ${wallpaperSettingsSection()}
    ${iconSettingsSection()}
    ${caretRow}
    ${othersRow}`;
}


function fontSettings() {
  const bodySize = Number(settings.body_font_size) || 16;
  const noteSize = Number(settings.note_font_size) || 14;
  const fallbackBodyInk = THEMES[currentPostcardId()]?.ink || "#2d2922";
  const fallbackNoteInk = selectedNoteTheme()?.palette?.ink || "#2b2b2e";
  const bodyInk = fontHexColor(settings.body_font_color) || fallbackBodyInk;
  const noteInk = fontHexColor(settings.note_font_color) || fallbackNoteInk;
  const chevron = `<svg class="theme-menu-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  // Attribute-safe stack: FONT_STACKS carries double quotes, but the whole
  // declaration sits inside a double-quoted style attribute.
  const fontStyle = (id) => `font-family:${(FONT_STACKS[id] || FONT_STACKS.serif).replace(/"/g, "'")}`;
  // The font name opens a menu shaped exactly like the Theme picker above it:
  // one flat list of names with a tick, no Aa thumbnails.
  const fontMenu = (kind, currentId, label) => {
    const current = FONT_OPTIONS.find((font) => font.id === currentId) || FONT_OPTIONS[0];
    const attr = kind === "note" ? "data-note-font-choice" : "data-font-choice";
    const items = FONT_OPTIONS.map((font) => `<div class="theme-menu-row ${currentId === font.id ? "active" : ""}">
      <button class="theme-menu-item" type="button" role="option" aria-selected="${currentId === font.id ? "true" : "false"}" ${attr}="${esc(font.id)}" style="${fontStyle(font.id)}">
        <span class="theme-menu-name">${esc(font.name)}</span>
        <span class="choice-check" aria-hidden="true">✓</span>
      </button>
    </div>`).join("");
    return `<details class="theme-menu font-menu" data-font-menu>
      <summary class="theme-menu-trigger" aria-label="${esc(label)}: ${esc(current.name)}">
        <span class="theme-menu-name font-menu-name" style="${fontStyle(current.id)}">${esc(current.name)}</span>
        ${chevron}
      </summary>
      <div class="theme-menu-list font-menu-list">
        <div class="theme-menu-items" role="listbox" aria-label="${esc(label)}">${items}</div>
      </div>
    </details>`;
  };
  const manageButton = (kind) => `<button class="theme-chip-button ${fontManageOpen[kind] ? "active" : ""}" type="button" data-action="toggle-font-manage" data-font-manage="${kind}" aria-expanded="${fontManageOpen[kind] ? "true" : "false"}">Manage</button>`;
  // Size and colour fold out under the row, like Theme → Manage. The size is
  // the bare number, then the swatch, then the same colour as a hex code.
  const managePanel = (kind) => {
    const note = kind === "note";
    const value = note ? noteSize : bodySize;
    const color = note ? noteInk : bodyInk;
    return `<div class="theme-manage-panel font-manage-panel">
      <div class="font-manage-line">
        <span class="font-manage-label">size:</span>
        <input class="font-manage-size" type="number" min="${note ? 10 : 14}" max="${note ? 28 : 20}" step="1" value="${value}" data-font-size="${kind}" aria-label="${note ? "Note" : "Body"} font size">
        <input class="theme-color-input font-color-input" type="color" value="${color}" data-font-color="${kind}" aria-label="${note ? "Note" : "Body"} font colour" title="${note ? "Note" : "Body"} font colour">
        <input class="theme-hex-input font-hex-input" type="text" maxlength="7" spellcheck="false" value="${color}" data-font-color-hex="${kind}" aria-label="${note ? "Note" : "Body"} font colour hex">
      </div>
    </div>`;
  };
  const row = (kind, title, currentId) => `<div class="settings-section theme-settings-row font-settings-row">
      <div class="theme-settings-title">${title}</div>
      <div class="theme-settings-controls font-settings-controls">
        ${fontMenu(kind, currentId, title)}
        ${manageButton(kind)}
      </div>
    </div>`;
  return `${row("body", "Body font", settings.font)}
    ${fontManageOpen.body ? managePanel("body") : ""}
    ${row("note", "Note font", settings.note_font)}
    ${fontManageOpen.note ? managePanel("note") : ""}`;
}

async function loadNoteMaterialFiles() {
  const result = await silentAction("note_material_files");
  if (Array.isArray(result?.files) && result.files.length) {
    noteMaterialFiles = result.files;
  }
  if (!noteMaterialFiles.includes(settings.note_material_file)) {
    settings.note_material_file = "paper.css";
    settings.note_material = "paper";
    saveSettings();
    applySettings();
  }
  for (const name of noteMaterialFiles) {
    if (!/\.css$/i.test(name)) continue;
    const key = name.toLowerCase();
    if (document.querySelector(`link[data-note-material-file="${CSS.escape(key)}"]`)) continue;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `/user-note-materials/${encodeURIComponent(name)}`;
    link.dataset.noteMaterialFile = key;
    document.head.appendChild(link);
  }
  if (settingsTab === "theme") renderSettings();
}

/* ---------------------------------------------------------------------------
   WALLPAPER
   ---------------------------------------------------------------------------
   A wallpaper is a picture the reader already owns. They pick the file once,
   NeoTodo remembers where it lives and reads it from there — nothing is copied
   and no extra folder appears on their disk. The last few picks stay in the
   picker so switching back to one is a single click. Everything else in the
   Theme tab (paper, ink, rules) is untouched by the choice.
   ------------------------------------------------------------------------- */

/** The recent picks, newest first, without duplicates or retired values. */
function wallpaperRecentList() {
  const raw = Array.isArray(settings.wallpaper_recent) ? settings.wallpaper_recent : [];
  const seen = new Set();
  return raw.filter((item) => {
    const name = String(item || "").trim();
    if (!name || seen.has(name) || !wallpaperIsLocalFile(name)) return false;
    seen.add(name);
    return true;
  }).slice(0, WALLPAPER_RECENT_LIMIT);
}

function rememberWallpaperChoice(path) {
  const name = String(path || "").trim();
  const recent = wallpaperRecentList().filter((item) => item !== name);
  if (name) recent.unshift(name);
  settings.wallpaper_recent = recent.slice(0, WALLPAPER_RECENT_LIMIT);
}

/** The wallpaper the current theme ships with: a pack's own picture when it has
    one, otherwise the postcard art. Settings → Wallpaper → Manage → Back uses
    this to leave a picked file and return to the theme's room. */
function themeWallpaperValue() {
  const id = currentPostcardId();
  const pack = themePacks.find((item) => item.id === id);
  if (pack?.wallpaper) return `theme:${id}`;
  if (THEMES[id] && typeof THEMES[id].art === "function") return `art:${id}`;
  return postcardIsDark(id) ? "art:dark" : "art:light";
}

/** Keep the chosen wallpaper and its place in the recent shelf in one save. */
function applyWallpaperChoice(path) {
  const name = String(path || "").trim();
  if (!wallpaperIsLocalFile(name)) return;
  rememberWallpaperChoice(name);
  settings.wallpaper = name;
  saveSettings();
  applySettings();
  if (settingsTab === "theme") renderSettings();
  toast("Wallpaper set");
}

/** Adopt the backend's shelf view after a pick, migration or prune. */
function adoptWallpaperShelfState(next) {
  if (!next || typeof next !== "object") return false;
  const wallpaper = String(next.wallpaper || "");
  const recent = Array.isArray(next.wallpaper_recent) ? next.wallpaper_recent.slice() : [];
  const before = JSON.stringify([settings.wallpaper, settings.wallpaper_recent]);
  settings.wallpaper = wallpaper;
  settings.wallpaper_recent = recent;
  return before !== JSON.stringify([settings.wallpaper, settings.wallpaper_recent]);
}

/** Link older picks into pictures/wallpapers and drop files deleted there. */
function syncWallpaperShelf() {
  return silentAction("sync_wallpaper_shelf").then((result) => {
    if (!result?.ok || !result.state) return false;
    if (!adoptWallpaperShelfState(result.state.settings)) return false;
    saveSettings();
    applySettings();
    if (settingsTab === "theme") renderSettings();
    return true;
  });
}

function chooseWallpaperFile() {
  silentAction("choose_wallpaper_file").then((result) => {
    if (result?.cancelled) return;
    if (result?.fallback === "upload") {
      // Platforms without a native picker: the reader still chooses the file
      // themselves, the browser just hands the bytes over.
      document.querySelector("[data-wallpaper-input]")?.click();
      return;
    }
    if (!result?.ok || !result.path) {
      if (result?.error) toast(result.error, true);
      return;
    }
    applyWallpaperChoice(result.path);
  });
}

function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.includes(",") ? result.slice(result.indexOf(",") + 1) : "");
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

async function uploadWallpaperFile(input) {
  const file = input?.files?.[0];
  if (input) input.value = "";
  if (!file) return;
  const name = String(file.name || "");
  const video = WALLPAPER_VIDEO_RE.test(name);
  if (!video && !WALLPAPER_IMAGE_RE.test(name)) {
    toast("Choose a JPG, PNG, WEBP, GIF or a film", true);
    return;
  }
  if (file.size > (video ? 120_000_000 : 30_000_000)) {
    toast("That file is too large for a wallpaper", true);
    return;
  }
  const data = await fileToBase64(file);
  if (!data) { toast("Could not read that file", true); return; }
  const result = await silentAction("upload_wallpaper", { kind: video ? "video" : "image", name, data });
  if (!result?.ok || !result.file) {
    toast(result?.error || "Could not use that file", true);
    return;
  }
  applyWallpaperChoice(result.file);
}

function wallpaperSettingsSection() {
  const wallpaper = activeWallpaper();
  const recent = wallpaperRecentList();
  const name = wallpaper.key ? wallpaperDisplayName(wallpaper) : "Theme paper";
  const chevron = `<svg class="theme-menu-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const recentRows = recent.map((path) => {
    const active = String(settings.wallpaper || "") === path;
    const isVideo = WALLPAPER_VIDEO_RE.test(path);
    const label = wallpaperFileName(path) || path;
    return `<div class="theme-menu-row ${active ? "active" : ""}">
      <button class="theme-menu-item" type="button" role="option" aria-selected="${active ? "true" : "false"}" data-wallpaper-file="${esc(path)}" data-wallpaper-kind="${isVideo ? "video" : "image"}">
        <span class="theme-menu-name">${esc(label)}</span>
        <span class="choice-check" aria-hidden="true">✓</span>
      </button>
    </div>`;
  }).join("");
  // Like the Theme row: the current wallpaper's name sits in the control, and
  // the recent picks live in the same small menu. No separate shelf heading,
  // no empty-state paragraph. Manage folds out the three wallpaper options.
  const nameControl = recent.length
    ? `<details class="theme-menu wallpaper-menu" data-theme-menu>
        <summary class="theme-menu-trigger" aria-label="Wallpaper">
          <span class="theme-menu-name">${esc(name)}</span>
          ${chevron}
        </summary>
        <div class="theme-menu-list" role="listbox" aria-label="Wallpaper">${recentRows}</div>
      </details>`
    : `<span class="theme-value wallpaper-current-name" title="${esc(name)}">${esc(name)}</span>`;
  const blurOn = settings.wallpaper_blur_on === true;
  const blurValue = Math.round(settings.wallpaper_blur);
  const cardsOn = settings.wallpaper_cards !== false;
  // Manage → three boxes from left to right: Back, Blur, Wallpaper theme.
  // Back is one action, the other two are switches. Blur grows a 0..100 amount
  // to its right, so the reader can say how thick the glass mask is.
  const managePanel = wallpaperManageOpen ? `<div class="settings-section wallpaper-manage-panel">
      <div class="wallpaper-manage-options">
        <button class="theme-chip-button" type="button" data-action="wallpaper-back" title="Return to the theme wallpaper">Back</button>
        <button class="theme-chip-button ${blurOn ? "active" : ""}" type="button" data-action="toggle-wallpaper-blur" aria-pressed="${blurOn ? "true" : "false"}" title="Frosted glass between the wallpaper and the page">Blur</button>
        <button class="theme-chip-button ${cardsOn ? "active" : ""}" type="button" data-action="toggle-wallpaper-cards" aria-pressed="${cardsOn ? "true" : "false"}" title="Build the cards out of the wallpaper">Wallpaper theme</button>
        <button class="theme-chip-button theme-folder-button" type="button" data-action="open-wallpaper-folder" title="Open the wallpaper folder" aria-label="Open the wallpaper folder">${FOLDER_GLYPH}</button>
      </div>
      ${blurOn ? `<div class="wallpaper-blur-row">
        <input id="wallpaper-blur-range" class="wallpaper-blur-range" type="range" min="0" max="100" step="1" value="${blurValue}" aria-label="Wallpaper glass blur">
        <span id="wallpaper-blur-value" class="wallpaper-blur-value">${blurValue}</span>
      </div>` : ""}
    </div>` : "";
  return `<div class="settings-section theme-settings-row wallpaper-settings-row">
      <div class="theme-settings-title">Wallpaper</div>
      <div class="theme-settings-controls">
        ${nameControl}
        <button class="theme-chip-button" type="button" data-action="choose-wallpaper">Choose</button>
        <button class="theme-chip-button ${wallpaperManageOpen ? "active" : ""}" type="button" data-action="toggle-wallpaper-manage" aria-expanded="${wallpaperManageOpen ? "true" : "false"}">Manage</button>
      </div>
      <input type="file" accept="image/*,video/*" data-wallpaper-input hidden>
    </div>
    ${managePanel}`;
}

/**
 * Appearance → Icon theme. One row in the same shape as Theme and Wallpaper:
 * a menu with every installed set and one action button. Picking a set only
 * swaps the marks; it never writes the app theme or the wallpaper.
 */
function iconSettingsSection() {
  const current = iconThemeById(settings.icon_theme);
  const chevron = `<svg class="theme-menu-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const rows = iconThemes.map((pack) => {
    const active = current.id === pack.id;
    return `<div class="theme-menu-row ${active ? "active" : ""}">
      <button class="theme-menu-item" type="button" role="option" aria-selected="${active ? "true" : "false"}" data-icon-theme-choice="${esc(pack.id)}">
        <span class="theme-menu-name">${esc(pack.name || pack.id)}</span>
        <span class="choice-check" aria-hidden="true">✓</span>
      </button>
    </div>`;
  }).join("");
  const nameControl = `<details class="theme-menu icon-theme-menu" data-theme-menu>
    <summary class="theme-menu-trigger" aria-label="Icon theme: ${esc(current.name || current.id)}">
      <span class="theme-menu-name">${esc(current.name || current.id)}</span>
      ${chevron}
    </summary>
    <div class="theme-menu-list" role="listbox" aria-label="Icon theme">${rows}</div>
  </details>`;
  return `<div class="settings-section theme-settings-row icon-settings-row">
      <div class="theme-settings-title">Icon theme</div>
      <div class="theme-settings-controls">
        ${nameControl}
        <button class="theme-chip-button" type="button" data-action="open-icon-themes-folder" title="${esc(iconThemeFolder || "icon-themes")}">Folder</button>
      </div>
    </div>`;
}

/* ---------------------------------------------------------------------------
   STICKERS
   ---------------------------------------------------------------------------
   Stickers are the little pictures on the achievements in the head bar: the
   built-in trophy, plus each achievement-tagged plugin that is currently on
   (the Pomodoro tomato, once its plugin has been switched on).
   Unlike a wallpaper these are stored inside the notebook, so a sticker is
   part of NeoTodo rather than a link to a file.
   ------------------------------------------------------------------------- */

/**
 * The real header sticker's layout box. Settings paints its preview at the
 * same size, so the reader judges the crop on the badge it will actually sit
 * on instead of on a blown-up card. offsetWidth/offsetHeight ignore the tilt
 * and hover scale, and return 0 while the plugin slot is hidden.
 */
function headerStickerBox(target) {
  const sticker = document.querySelector(target.selector)?.closest(".ach-sticker");
  if (!sticker?.offsetWidth || !sticker?.offsetHeight) return null;
  return { width: sticker.offsetWidth, height: sticker.offsetHeight };
}

function stickersSettings() {
  // Achievement plugins appear only while they own a header slot. The Pomodoro
  // tomato, for example, joins the list once its plugin is turned on.
  const targets = availableStickerTargets();
  const cards = targets.map((target) => {
    const config = stickerSettingsFor(target.id);
    const preview = config?.image || target.fallback;
    const box = headerStickerBox(target);
    const previewSize = box ? ` style="width:${box.width}px;height:${box.height}px"` : "";
    return `<div class="sticker-setting-card" data-sticker-card="${target.id}">
      <span class="sticker-setting-preview"${previewSize}><img src="${esc(preview)}" alt="" style="${stickerImageStyle(config)}"></span>
      <div class="sticker-setting-body">
        <strong class="sticker-setting-name">${esc(target.name)}</strong>
        <div class="sticker-setting-actions">
          <button class="btn small" type="button" data-action="choose-sticker-image" data-sticker-id="${target.id}">${config?.image ? "Replace" : "Choose picture"}</button>
          ${config?.image ? `<button class="btn small" type="button" data-action="reset-sticker-image" data-sticker-id="${target.id}">Default</button>` : ""}
        </div>
      </div>
      <input type="file" accept="image/*" data-sticker-input="${target.id}" hidden>
    </div>`;
  }).join("");
  return `<div class="settings-section">
      <div class="sticker-settings-grid">${cards}</div>
    </div>`;
}

function soundSettings() {
  const on = !AudioFX.muted;
  const volume = Math.round(AudioFX.getVolume() * 100);
  const current = activeSoundStyle();
  const bgmOn = BackgroundMusic.enabled;
  const bgmPlaying = BackgroundMusic.playing;
  const chevron = `<svg class="theme-menu-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const rows = soundStyles.map((style) => {
    const active = style.id === current.id;
    return `<div class="theme-menu-row ${active ? "active" : ""}">
      <button class="theme-menu-item" type="button" role="option" aria-selected="${active ? "true" : "false"}" data-sound-style="${esc(style.id)}">
        <span class="theme-menu-name">${esc(style.name || style.id)}</span>
        <span class="choice-check" aria-hidden="true">✓</span>
      </button>
    </div>`;
  }).join("");
  const nameControl = `<details class="theme-menu sound-style-menu" data-theme-menu>
    <summary class="theme-menu-trigger" aria-label="Sound style: ${esc(current.name || current.id)}">
      <span class="theme-menu-name">${esc(current.name || current.id)}</span>
      ${chevron}
    </summary>
    <div class="theme-menu-list" role="listbox" aria-label="Sound style">${rows}</div>
  </details>`;
  const files = Object.entries(AudioFX.sampleFiles())
    .map(([key, url]) => {
      const name = String(url).split("/").pop();
      return `<button class="sound-file" type="button" data-action="preview-sound" data-sound-key="${esc(key)}">
        <span class="sound-file-play" aria-hidden="true">▶</span>
        <span class="sound-file-name">${esc(name)}</span>
      </button>`;
    })
    .join("");
  return `<div class="settings-section">
      <button class="settings-toggle ${on ? "active" : ""}" data-action="toggle-sound" aria-pressed="${on ? "true" : "false"}">
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span class="toggle-copy"><strong>${on ? "On" : "Off"}</strong></span>
      </button>
      <div class="title-adjust-row">
        <label class="title-adjust-label">Volume <span id="sound-volume-value">${volume}%</span></label>
        <input class="sound-volume" type="range" min="0" max="100" step="1" value="${volume}" data-settings-volume>
      </div>
    </div>
    <div class="settings-section">
      <div class="settings-label">Background music <span>${esc(BackgroundMusic.track.title)} · ${esc(BackgroundMusic.track.credit)}</span></div>
      <button class="settings-toggle ${bgmOn ? "active" : ""}" data-action="toggle-background-music" aria-pressed="${bgmOn ? "true" : "false"}">
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span class="toggle-copy"><strong>${bgmOn ? "On" : "Off"}</strong><small>${bgmPlaying ? "Playing" : "Loops the notebook's theme track"}</small></span>
      </button>
    </div>
    <div class="settings-section theme-settings-row sound-settings-row">
      <div class="theme-settings-title">Sound style</div>
      <div class="theme-settings-controls">
        ${nameControl}
        <button class="theme-chip-button theme-folder-button" type="button" data-action="open-sounds-folder" title="Open the sounds folder${soundFolder ? ` · ${esc(soundFolder)}` : ""}" aria-label="Open the sounds folder">${FOLDER_GLYPH}</button>
      </div>
    </div>
    <div class="settings-section">
      <div class="settings-label">Audio files <span>${esc(current.id)}</span></div>
      ${Object.keys(settings.sound_overrides || {}).length ? `<div class="sound-pack-note">
        <span>A theme pack is replacing ${Object.keys(settings.sound_overrides).length} sample(s).</span>
        <button class="btn small" type="button" data-action="reset-theme-sounds">Use NeoTodo sounds</button>
      </div>` : ""}
      <div class="sound-settings-list">${files}</div>
    </div>`;
}

function aboutSettings() {
  return `<div class="settings-section about-section">
      <div><span>Shortcuts</span><small>Tab — Toggle categories · J/K — Move categories</small></div>
      <div><span>Project</span><small><a class="about-link" href="https://github.com/CellMeet/Neotodo" data-external-link="https://github.com/CellMeet/Neotodo">github.com/CellMeet/Neotodo</a></small></div>
    </div>`;
}

function pluginUninstallConfirmMarkup(plugin) {
  if (!plugin) return "";
  const downloaded = plugin.source === "user";
  return `<div class="plugin-uninstall-confirm">
    <div>
      <strong>Uninstall ${esc(plugin.title)}?</strong>
      <p>${downloaded
        ? "The downloaded plugin files will be removed from your plugin folder. You can install it again from the community catalog at any time."
        : "It will leave your notebook and its tool rail button will disappear. The plugin files and your saved artwork stay on disk, so you can install it again from Available."}</p>
    </div>
    <div class="plugin-uninstall-actions">
      <button class="btn small" type="button" data-action="cancel-plugin-uninstall">Cancel</button>
      <button class="btn small danger" type="button" data-action="confirm-plugin-uninstall" data-plugin-id="${esc(plugin.id)}">Uninstall</button>
    </div>
  </div>`;
}

// Settings → Plugins keeps the same quiet shape as the Theme page: one line per
// plugin with its name, a square on/off box and the ⋮ menu. Nothing else — the
// plugin's artwork belongs in the plugin folder, not in this list.
function pluginBoxToggleMarkup(pluginId, on, label) {
  const attrs = pluginId ? ` data-plugin-id="${esc(pluginId)}"` : "";
  return `<button class="plugin-box-toggle ${on ? "active" : ""}" type="button" data-action="toggle-plugin"${attrs} aria-pressed="${on ? "true" : "false"}" aria-label="${esc(label)}">
      <span class="plugin-box" aria-hidden="true"></span>
    </button>`;
}

function pluginRowMarkup(plugin) {
  const state = pluginState(plugin.id);
  const on = Boolean(state?.enabled);
  return `<div class="plugin-row ${on ? "plugin-on" : "plugin-off"}" data-plugin-row="${esc(plugin.id)}">
    <span class="plugin-row-name">${esc(plugin.title)}</span>
    ${pluginBoxToggleMarkup(plugin.id, on, `${on ? "Turn off" : "Turn on"} ${plugin.title}`)}
    <button class="plugin-menu-button" type="button" data-action="plugin-menu" data-plugin-id="${esc(plugin.id)}" aria-label="Options for ${esc(plugin.title)}">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.65" fill="currentColor"/><circle cx="12" cy="12" r="1.65" fill="currentColor"/><circle cx="12" cy="19" r="1.65" fill="currentColor"/></svg>
    </button>
  </div>`;
}

const COMMUNITY_SECTIONS = [
  { id: "themes", label: "主题", english: "Themes" },
  { id: "games", label: "游戏", english: "Games" },
  { id: "plugins", label: "插件", english: "Plugins" },
];

function communityViewOpen(section = "") {
  return communityModalOpen && (!section || communitySection === section);
}

/** Re-render the Community sheet, but only while it is on screen. */
function refreshCommunity() {
  if (communityModalOpen) renderCommunity();
  else if ($(".settings-panel")) renderSettings();
}

/** Fetch whatever the shelf on screen needs, without blocking the first paint. */
function ensureCommunitySectionData() {
  ensurePluginCatalog();
  if (communitySection !== "themes") return;
  loadThemePacks().then(() => { if (communityViewOpen("themes")) renderCommunity(); });
  if (!themeCatalog && !themeCatalogBusy) loadThemeCatalog(false);
}

/**
 * One shelf inside Community. Games and plugins share the same install flow;
 * only the catalog slice and the wording change.
 */
function pluginShelfSection(scope = "plugins") {
  const games = scope === "games";
  const entries = pluginSectionEntries(scope);
  const loading = pluginCatalogLoading && !pluginCatalog;
  const source = pluginCatalog?.catalog_source || "";
  const updated = pluginCatalog?.updated || "";
  let status = "Bundled index · refresh to reach the community server";
  if (loading) status = "Reaching the community server…";
  else if (pluginCatalogError) status = `Offline copy · ${pluginCatalogError}`;
  else if (source === "remote") status = `Live from the community server${updated ? ` · updated ${updated}` : ""}`;
  else if (source === "cache") status = `Cached copy from the community server${updated ? ` · ${updated}` : ""}`;
  const installedCount = entries.filter((entry) => pluginState(entry.id)?.installed).length;
  const categories = pluginCategoryOptions(entries);
  const filters = [
    { id: "all", label: "All" },
    { id: "featured", label: "Featured" },
    ...categories.map((label) => ({ id: label.toLowerCase(), label })),
  ].filter((filter) => filter.id !== "featured" || entries.some((entry) => entry.featured));
  const chips = filters.map((filter) => `<button class="community-filter ${pluginCommunityFilter === filter.id ? "active" : ""}" type="button" data-action="plugin-community-filter" data-plugin-filter="${esc(filter.id)}">${esc(filter.label)}</button>`).join("");
  return `<div class="settings-section community-shelf">
      <div class="settings-label">${games ? "游戏库" : "插件库"} <span>${entries.length}</span></div>
      <p class="community-shelf-copy">${games
        ? "拼豆、钢琴和接下来会出现的各种小游戏。目录来自社区服务器，装一个就放进左边的工具栏。"
        : "让 NeoTodo 更顺手的小工具：搜索、抽屉、特效。目录来自社区服务器，装好后随时可以关掉。"}</p>
      <div class="community-toolbar">
        <label class="community-search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m15.4 15.4 4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          <input type="search" data-plugin-search value="${esc(pluginCommunityQuery)}" placeholder="${games ? "Search games, authors, tags…" : "Search plugins, authors, tags…"}" autocomplete="off">
        </label>
        <button class="btn small community-refresh" type="button" data-action="refresh-plugin-catalog" ${loading ? "disabled" : ""}>${loading ? "Refreshing…" : "Refresh"}</button>
      </div>
      <div class="community-status ${pluginCatalogError ? "offline" : ""}">
        <span>${esc(status)}</span>
        <span class="community-count"><b id="plugin-community-count">${pluginCommunityVisibleEntries().length}</b> ${games ? "games" : "plugins"} · <b>${installedCount}</b> installed</span>
      </div>
      <div class="community-filters">${chips}</div>
      <div id="plugin-community-results">${loading ? `<div class="plugin-empty community-empty">Fetching the latest catalog…</div>` : pluginCommunityResultsMarkup()}</div>
    </div>
    <div class="plugin-community-callout">
      <div class="community-callout-copy">
        <strong>Build the next small thing</strong>
        <p>Every plugin is a folder with a manifest and an HTML page. Package it as a <code>.zip</code>, publish it to the community server, and it appears here for everyone — no NeoTodo update needed.</p>
        <div class="community-callout-actions">
          <button class="btn small" type="button" data-action="install-plugin-archive">Install from .zip</button>
          <button class="btn small" type="button" data-action="open-plugins-folder">Open plugin folder</button>
          <a class="btn small ghost" href="https://github.com/CellMeet/Neotodo/blob/main/community/README.md" data-external-link="https://github.com/CellMeet/Neotodo/blob/main/community/README.md">Builder guide</a>
          <a class="btn small ghost" href="https://github.com/CellMeet/Neotodo/issues/new?template=plugin-submission.yml" data-external-link="https://github.com/CellMeet/Neotodo/issues/new?template=plugin-submission.yml">Submit a plugin</a>
        </div>
      </div>
    </div>`;
}

/** Where the shelves on screen come from: live server, cache or the bundled copy. */
function communityServerState() {
  const themes = communitySection === "themes";
  const busy = themes ? themeCatalogBusy : pluginCatalogLoading;
  const error = themes ? themeCatalog?.catalog_error : pluginCatalogError;
  const source = themes ? (themeCatalog?.catalog_source || "") : (pluginCatalog?.catalog_source || "");
  if (busy) return { state: "loading", label: "Connecting…" };
  if (error) return { state: "offline", label: "Offline copy" };
  if (source === "remote") return { state: "live", label: "Community server" };
  if (source === "cache") return { state: "cache", label: "Cached copy" };
  return { state: "local", label: "Bundled index" };
}

function communityTabsMarkup() {
  return COMMUNITY_SECTIONS.map((section) => `<button class="community-tab ${communitySection === section.id ? "active" : ""}" type="button" role="tab" aria-selected="${communitySection === section.id ? "true" : "false"}" data-action="community-section" data-community-section="${section.id}">
      <span>${section.label}</span>
      <small>${section.english}</small>
    </button>`).join("");
}

/**
 * Community lives in its own window, beside Settings rather than inside it.
 * Shelves are remote-first: the catalog is fetched from the community server,
 * and only installed files stay on this computer.
 */
function communityWindowMarkup() {
  ensurePluginCatalog();
  const server = communityServerState();
  const confirm = communitySection === "themes" ? "" : pluginUninstallConfirmMarkup(pluginPendingUninstallId ? PLUGIN_REGISTRY[pluginPendingUninstallId] : null);
  const body = communitySection === "themes"
    ? themeCommunitySection()
    : pluginDetailId
      ? pluginDetailSettings(pluginDetailId)
      : pluginShelfSection(communitySection === "games" ? "games" : "plugins");
  return `<header class="community-topbar">
      <div class="community-brand">
        <span class="community-brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="3.7" ry="8.4" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3.6 12h16.8" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>
        </span>
        <span class="community-brand-copy">
          <strong>Community</strong>
          <small>主题、插件和游戏来自社区服务器。逛一逛，装好的东西留在这台电脑上。</small>
        </span>
      </div>
      <div class="community-topbar-tools">
        <span class="community-server ${server.state}" title="The shelves are fetched from the community server"><span class="community-server-dot" aria-hidden="true"></span>${esc(server.label)}</span>
        <button class="settings-close community-close" type="button" data-action="close-community" aria-label="Close community"><svg class="settings-close-icon" aria-hidden="true"><use href="#close-circle"></use></svg></button>
      </div>
    </header>
    <div class="community-body">
      <div class="community-tabs" role="tablist" aria-label="Community sections">${communityTabsMarkup()}</div>
      <div class="community-scroll"><div class="community-view">${confirm}${body}</div></div>
    </div>
    <footer class="community-foot">
      <span>目录从社区服务器读取，不用更新 NeoTodo；安装后的插件放在本机。</span>
      <span class="community-foot-actions">
        <button class="btn small" type="button" data-action="open-plugin-settings">Manage installed plugins</button>
      </span>
    </footer>`;
}

function renderCommunity() {
  const panel = $(".community-panel");
  if (!panel) return;
  const previousScroll = panel.querySelector(".community-scroll")?.scrollTop || 0;
  panel.innerHTML = communityWindowMarkup();
  const scroll = panel.querySelector(".community-scroll");
  if (scroll && previousScroll) scroll.scrollTop = previousScroll;
}

function openCommunity(section = communitySection) {
  if (section && COMMUNITY_SECTIONS.some((entry) => entry.id === section)) communitySection = section;
  // Community replaces Settings: one sheet on screen at a time.
  closeSettings();
  communityModalOpen = true;
  pluginDetailId = null;
  pluginPendingUninstallId = null;
  AudioFX.paper();
  $("#modal-root").innerHTML = '<div class="community-stage"><div class="community-panel" role="dialog" aria-modal="true" aria-label="Community"></div></div>';
  const stage = $(".community-stage");
  stage?.addEventListener("mousedown", (event) => {
    if (event.target === stage) closeCommunity();
  });
  renderCommunity();
  ensureCommunitySectionData();
}

function closeCommunity() {
  communityModalOpen = false;
  pluginDetailId = null;
  pluginPendingUninstallId = null;
  const root = $("#modal-root");
  if (root?.querySelector(".community-stage")) root.innerHTML = "";
}

/**
 * The shop is the "community" plugin now. Old deep links still call this
 * helper, so they land in the same plugin page instead of reopening the
 * retired modal.
 */
function openCommunityPlugin(section = "plugins") {
  const target = ["plugins", "games", "themes"].includes(section) ? section : "plugins";
  if (!pluginEnabled("community")) {
    if ($(".settings-panel")) {
      settingsTab = "plugins";
      renderSettings();
    } else {
      openSettings("plugins");
    }
    toast("Install the Community plugin from the Available list", true);
    return false;
  }
  closeSettings();
  closeCommunity();
  openPluginPanel("community", { query: `section=${encodeURIComponent(target)}` });
  return true;
}

function pluginDetailSettings(pluginId) {
  const plugin = PLUGIN_REGISTRY[pluginId];
  const state = pluginState(pluginId);
  if (!plugin || !state) return pluginShelfSection("plugins");
  const on = Boolean(state.enabled);
  const settingRows = (plugin.settings || []).map((item) => {
    if (item.type === "choice") {
      const value = state.settings?.[item.id];
      const options = (item.options || []).map((option) => {
        const selected = option.value === value;
        return `<button class="plugin-choice ${selected ? "active" : ""}" type="button" data-action="set-plugin-choice" data-plugin-id="${esc(plugin.id)}" data-plugin-setting="${esc(item.id)}" data-plugin-value="${esc(option.value)}" aria-pressed="${selected ? "true" : "false"}">
          <span class="plugin-choice-swatch" data-swatch="${esc(option.value)}" aria-hidden="true"></span>
          <span class="plugin-choice-copy"><strong>${esc(option.label || option.value)}</strong><small>${esc(option.detail || "")}</small></span>
        </button>`;
      }).join("");
      return `<div class="plugin-setting-choice" role="group" aria-label="${esc(item.label || item.id)}">
        <div class="plugin-setting-choice-head"><strong>${esc(item.label || item.id)}</strong><small>${esc(item.detail || "")}</small></div>
        <div class="plugin-choice-row">${options}</div>
      </div>`;
    }
    if (item.type !== "toggle") return "";
    const value = Boolean(state.settings?.[item.id]);
    return `<div class="plugin-row plugin-setting-row">
      <span class="plugin-row-name">${esc(item.label)}</span>
      <button class="plugin-box-toggle ${value ? "active" : ""}" type="button" data-action="toggle-plugin-setting" data-plugin-id="${esc(plugin.id)}" data-plugin-setting="${esc(item.id)}" aria-pressed="${value ? "true" : "false"}" aria-label="${esc(item.label || item.id)}">
        <span class="plugin-box" aria-hidden="true"></span>
      </button>
    </div>`;
  }).join("");
  const pending = pluginPendingUninstallId === pluginId ? plugin : null;
  return `<button class="plugin-back" type="button" data-action="plugin-back">${BACK_ICON}<span>${communitySection === "games" ? "Games" : communitySection === "themes" ? "Themes" : "Plugins"}</span></button>
    <div class="settings-section">
      <div class="plugin-list">
        <div class="plugin-row ${on ? "plugin-on" : "plugin-off"}">
          <span class="plugin-row-name">Enabled</span>
          ${pluginBoxToggleMarkup(plugin.id, on, `${on ? "Turn off" : "Turn on"} ${plugin.title}`)}
        </div>
      </div>
      <div class="plugin-detail-actions">
        <button class="btn small" type="button" data-action="open-plugin" data-plugin-id="${esc(plugin.id)}" ${on ? "" : "disabled"}>Open plugin</button>
      </div>
    </div>
    <div class="settings-section">
      <div class="settings-label">Settings</div>
      ${settingRows || `<div class="plugin-empty">This plugin does not expose any settings yet.</div>`}
    </div>
    ${pluginUninstallConfirmMarkup(pending)}
    <div class="plugin-danger-zone">
      <button class="btn small danger" type="button" data-action="uninstall-plugin" data-plugin-id="${esc(plugin.id)}">Uninstall plugin</button>
    </div>`;
}

// ---------------------------------------------------------------------------
// Settings → Plugins
// ---------------------------------------------------------------------------
// Community is where new plugins are found; this page only manages what is
// already installed on this computer.
function pluginsSettings() {
  const pending = pluginPendingUninstallId ? PLUGIN_REGISTRY[pluginPendingUninstallId] : null;
  if (pluginDetailId) {
    return pluginUninstallConfirmMarkup(pending) + pluginDetailSettings(pluginDetailId);
  }
  ensurePluginCatalog();
  const installed = Object.values(PLUGIN_REGISTRY)
    .filter((plugin) => pluginState(plugin.id)?.installed)
    .sort((a, b) => String(a.title || a.id).localeCompare(String(b.title || b.id)));
  const updates = installed.map((plugin) => {
    const entry = pluginCatalogEntries().find((item) => item.id === plugin.id);
    return entry && entry.version && pluginVersionNewer(entry.version, plugin.version) ? { plugin, entry } : null;
  }).filter(Boolean);
  const updateSection = updates.length ? `<div class="settings-section">
      <div class="settings-label">Updates</div>
      <div class="plugin-list">
        ${updates.map(({ plugin, entry }) => `<div class="plugin-row plugin-update-row">
          <span class="plugin-row-name">${esc(plugin.title)}</span>
          <button class="btn small community-install" type="button" data-action="install-community-plugin" data-plugin-id="${esc(plugin.id)}" ${pluginInstalling.has(plugin.id) ? "disabled" : ""} title="v${esc(plugin.version || "1.0.0")} → v${esc(entry.version)}">${pluginInstalling.has(plugin.id) ? "Updating…" : "Update"}</button>
        </div>`).join("")}
      </div>
    </div>` : "";
  // Bundled plugins stay on disk, but the Community shop is a plugin now. The
  // Available list is the one place to add a built-in plugin (including the
  // Community shop itself) without opening a modal first.
  const available = Object.values(PLUGIN_REGISTRY)
    .filter((plugin) => plugin.source !== "user" && !pluginState(plugin.id)?.installed)
    .sort((left, right) => String(left.title || left.id).localeCompare(String(right.title || right.id)));
  const availableSection = available.length ? `<div class="settings-section">
      <div class="settings-label">Available <span>${available.length}</span></div>
      <div class="plugin-list">
        ${available.map((plugin) => `<div class="plugin-row">
          <span class="plugin-row-name">${esc(plugin.title)}</span>
          <button class="btn small" type="button" data-action="install-plugin" data-plugin-id="${esc(plugin.id)}">Install</button>
        </div>`).join("")}
      </div>
    </div>` : "";
  return `${pluginUninstallConfirmMarkup(pending)}
    <div class="settings-section">
      ${installed.length
        ? `<div class="plugin-list">${installed.map(pluginRowMarkup).join("")}</div>`
        : `<div class="plugin-empty">No plugins installed yet. Add one from Available below.</div>`}
    </div>
    ${availableSection}
    ${updateSection}`;
}

// ---------------------------------------------------------------------------
// Settings → AI
// ---------------------------------------------------------------------------
function aiProviderDisplayName(providerId) {
  const id = String(providerId || "").toLowerCase();
  const known = (aiCatalog.providers || []).find((provider) => provider.id === id);
  if (known?.name) return known.name;
  const names = {
    deepseek: "DeepSeek", openai: "OpenAI", anthropic: "Anthropic", claude: "Anthropic",
    google: "Google", gemini: "Gemini", openrouter: "OpenRouter", ollama: "Ollama",
    mistral: "Mistral", meta: "Meta", xai: "xAI", qwen: "Qwen", zhipu: "Zhipu",
    moonshot: "Moonshot", groq: "Groq", together: "Together", opencode: "OpenCode",
    "openai-compatible": "OpenAI compatible",
  };
  return names[id] || (id ? id.charAt(0).toUpperCase() + id.slice(1) : "AI");
}

function aiProviderIconHtml(providerId, extra = "") {
  const id = String(providerId || "").toLowerCase();
  const icon = MODEL_ICON_IDS[id] || modelIconHint(id) || "lobehub";
  return `<img class="ai-provider-icon ${extra}" src="/model-icons/${icon}.svg" alt="" aria-hidden="true">`;
}

function aiModelLabel(model) {
  return `${agentModelProvider(model)}/${agentModelLeaf(model)}`;
}

function aiAllModels() {
  return Array.isArray(aiCatalog.models) ? aiCatalog.models : [];
}

function aiEnabledModels() {
  const config = aiConfig || {};
  const all = aiAllModels();
  const enabled = Array.isArray(config.enabled_models) ? config.enabled_models : [];
  if (!enabled.length) return all;
  const wanted = new Set(enabled);
  if (config.default_model) wanted.add(config.default_model);
  for (const value of Object.values(config.agent_models || {})) if (value) wanted.add(value);
  return all.filter((model) => wanted.has(model));
}

function aiModelOptions(selected = "", options = {}) {
  const models = options.models || aiAllModels();
  const groups = new Map();
  for (const model of models) {
    const provider = String(model).split("/")[0];
    if (!groups.has(provider)) groups.set(provider, []);
    groups.get(provider).push(model);
  }
  const rows = [];
  if (options.inherit) {
    rows.push(`<option value="" ${selected ? "" : "selected"}>${esc(options.inherit)}</option>`);
  }
  for (const [provider, list] of groups) {
    rows.push(`<optgroup label="${esc(aiProviderDisplayName(provider))}">`);
    for (const model of list) {
      const value = esc(model);
      rows.push(`<option value="${value}" ${model === selected ? "selected" : ""}>${esc(agentModelLeaf(model))}</option>`);
    }
    rows.push("</optgroup>");
  }
  return rows.join("");
}

function aiModeButtons(kind, current) {
  return ["chat", "build"].map((mode) => `<button class="ai-mode-choice ${mode === current ? "active" : ""}" type="button" data-action="ai-set-agent-mode" data-kind="${esc(kind)}" data-mode="${mode}" aria-pressed="${mode === current ? "true" : "false"}">${mode === "chat" ? "Chat" : "Build"}</button>`).join("");
}

function applyAiConfigPayload(data) {
  if (!data || !data.ok) return;
  aiConfig = data.config || null;
  aiCatalog = {
    models: Array.isArray(data.models) ? data.models : [],
    enabled_models: Array.isArray(data.enabled_models) ? data.enabled_models : [],
    providers: Array.isArray(data.providers) ? data.providers : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    backends: data.backends || {},
    activity: Array.isArray(data.activity) ? data.activity : [],
    paths: data.paths || {},
    default_model: data.default_model || "",
    agent_defaults: data.agent_defaults || {},
  };
  agentDefaultModels = {};
  agentDefaultModes = {};
  for (const [kind, value] of Object.entries(data.agent_defaults || {})) {
    if (value?.model) agentDefaultModels[kind] = value.model;
    if (value?.mode) agentDefaultModes[kind] = value.mode;
  }
  agentModels = aiEnabledModels();
  agentDefaultModel = data.default_model || agentModels[0] || agentDefaultModel;
  if (agentTerminalOpen) renderAgentTerminal();
}

function loadAiConfig(force = false) {
  if (aiConfig && !force) return Promise.resolve(aiConfig);
  if (aiConfigLoading) return aiConfigLoading;
  aiConfigLoading = (async () => {
    try {
      const data = await agentPost({ action: "config" });
      if (data.ok) applyAiConfigPayload(data);
    } catch (error) {
    } finally {
      aiConfigLoading = null;
      aiConfigLoaded = true;
    }
    return aiConfig;
  })();
  return aiConfigLoading;
}

async function aiSaveConfig(patch, options = {}) {
  try {
    const data = await agentPost({ action: "set_config", config: patch });
    if (!data.ok) {
      toast(data.error || "Could not save AI settings", true);
      return false;
    }
    applyAiConfigPayload(data);
    if (options.rerender !== false) renderSettings();
    if (options.message) toast(options.message);
    return true;
  } catch (error) {
    toast("Could not reach the local AI service", true);
    return false;
  }
}

async function aiRefreshModels() {
  try {
    const data = await agentPost({ action: "refresh_models" });
    if (data.ok) {
      applyAiConfigPayload(data);
      renderSettings();
      toast(`Found ${aiAllModels().length} model${aiAllModels().length === 1 ? "" : "s"}`);
    }
  } catch (error) {
    toast("Could not refresh models", true);
  }
}

async function aiToggleModel(model) {
  if (!aiConfig || !model) return;
  const all = aiAllModels();
  const enabled = new Set(aiEnabledModels());
  if (enabled.has(model)) enabled.delete(model);
  else enabled.add(model);
  const next = enabled.size === all.length ? [] : [...enabled].filter((item) => all.includes(item));
  await aiSaveConfig({ enabled_models: next });
}

function aiProviderFormValues() {
  const read = (name) => document.querySelector(`[data-ai-provider-field="${name}"]`)?.value || "";
  return {
    id: read("id").trim().toLowerCase(),
    name: read("name").trim(),
    base_url: read("base_url").trim(),
    api_key: read("api_key"),
    models: read("models").split(/[\n,]/).map((item) => item.trim()).filter(Boolean),
    enabled: true,
  };
}

async function aiSaveProvider() {
  const provider = aiProviderFormValues();
  if (!/^[a-z0-9][a-z0-9-]{0,47}$/.test(provider.id)) {
    toast("Provider id: lowercase letters, numbers and dashes", true);
    return;
  }
  if (!/^https?:\/\//.test(provider.base_url)) {
    toast("Add an http(s) Base URL", true);
    return;
  }
  if (!provider.models.length) {
    toast("Add at least one model id", true);
    return;
  }
  try {
    const data = await agentPost({ action: "save_provider", provider });
    if (!data.ok) {
      toast(data.error || "Could not save the provider", true);
      return;
    }
    applyAiConfigPayload(data);
    aiProviderDraft = null;
    renderSettings();
    toast(`Provider ${provider.name || provider.id} saved`);
  } catch (error) {
    toast("Could not reach the local AI service", true);
  }
}

async function aiTestProvider() {
  const provider = aiProviderFormValues();
  if (!/^https?:\/\//.test(provider.base_url)) {
    toast("Add an http(s) Base URL first", true);
    return;
  }
  const button = document.querySelector("[data-action='ai-test-provider']");
  if (button) {
    button.disabled = true;
    button.textContent = "Testing…";
  }
  try {
    const data = await agentPost({ action: "test_provider", provider });
    if (data.ok) {
      const preview = (data.models || []).slice(0, 3).join(", ");
      toast(`Connected · ${data.count || 0} models${preview ? ` · ${preview}` : ""}`);
    } else {
      toast(`Connection failed · ${data.error || "no response"}`, true);
    }
  } catch (error) {
    toast("Could not test the provider", true);
  } finally {
    const current = document.querySelector("[data-action='ai-test-provider']");
    if (current) {
      current.disabled = false;
      current.textContent = "Test connection";
    }
  }
}

async function aiRemoveProvider(id) {
  if (!id) return;
  const ok = await confirmDialog({
    kicker: "AI provider",
    title: `Remove ${aiProviderDisplayName(id)}?`,
    message: "Its key and models leave every picker. The provider in your global OpenCode config is not touched.",
    confirmLabel: "Remove",
    danger: true,
  });
  if (!ok) return;
  try {
    const data = await agentPost({ action: "remove_provider", provider_id: id });
    if (data.ok) {
      applyAiConfigPayload(data);
      aiProviderDraft = null;
      renderSettings();
      toast("Provider removed");
    }
  } catch (error) {
    toast("Could not remove the provider", true);
  }
}

async function aiSaveCommand() {
  const name = document.querySelector("[data-ai-command-name]")?.value.trim() || "";
  const prompt = document.querySelector("[data-ai-command-prompt]")?.value.trim() || "";
  if (!name || !prompt) {
    toast("A command needs a name and a prompt", true);
    return;
  }
  const id = name.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || `command-${Date.now()}`;
  const commands = [...(aiConfig?.commands || [])];
  const existing = commands.findIndex((item) => item.id === id);
  const row = { id, name, prompt, show_in_menu: true };
  if (existing >= 0) commands[existing] = row;
  else commands.push(row);
  const saved = await aiSaveConfig({ commands }, { rerender: false });
  if (saved) {
    aiCommandDraft = null;
    renderSettings();
    toast("Command saved");
  }
}

async function aiDeleteCommand(id) {
  const commands = (aiConfig?.commands || []).filter((item) => item.id !== id);
  const saved = await aiSaveConfig({ commands }, { rerender: false });
  if (saved) {
    if (aiCommandDraft?.id === id) aiCommandDraft = null;
    renderSettings();
    toast("Command deleted");
  }
}

function aiInsertCommand(id) {
  const command = (aiConfig?.commands || []).find((item) => item.id === id);
  if (!command) return;
  if (aiSettingsModalOpen()) closeAiSettings();
  else closeSettings();
  if (!agentTerminalOpen) openAgentTerminal(true);
  setTimeout(() => {
    const input = $("#agent-input");
    if (!input) return;
    input.value = command.prompt;
    resizeAgentInput(input);
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }, 220);
}

function aiReadEnvironmentRows() {
  return [...document.querySelectorAll("[data-ai-env-row]")].map((row) => ({
    name: row.querySelector("[data-ai-env-name]")?.value.trim() || "",
    value: row.querySelector("[data-ai-env-value]")?.value || "",
  })).filter((row) => row.name);
}

async function aiSaveEnvironment() {
  const environment = aiReadEnvironmentRows();
  await aiSaveConfig({ environment }, { message: "Environment saved" });
}

async function aiSaveRuntime() {
  const timeout = Number(document.querySelector("[data-ai-timeout]")?.value) || 15;
  const parallel = Number(document.querySelector("[data-ai-parallel]")?.value) || 12;
  await aiSaveConfig({ timeout_minutes: timeout, max_parallel: parallel }, { message: "Runtime saved" });
}

function aiActivityLabel(entry) {
  if (entry.event === "start") return "Started";
  if (entry.event === "finish") return "Finished";
  if (entry.event === "interrupted") return "Interrupted";
  if (entry.event === "error") return "Error";
  return String(entry.event || "Event");
}

function aiActivityWhen(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function aiStatusCopy(backend) {
  if (!backend?.available) return "OpenCode was not found. Install it and make sure it is on PATH.";
  const version = backend.version ? ` · ${backend.version}` : "";
  const providerCount = (aiCatalog.providers || []).length;
  return `${aiAllModels().length} models · ${providerCount} provider${providerCount === 1 ? "" : "s"}${version}`;
}

function aiBasicSettings() {
  const config = aiConfig || {};
  const backends = aiCatalog.backends || {};
  const backend = backends.opencode || { available: false };
  const all = aiAllModels();
  const selectedModel = config.default_model || aiCatalog.default_model || all[0] || "";
  const mode = config.default_mode || "chat";
  const notificationOn = config.notifications !== false;
  const sound = config.notification_sound || "trainWhistle";
  const sounds = [
    ["trainWhistle", "Train whistle"],
    ["chime", "Chime"],
    ["ding", "Bell"],
    ["guitarPluck", "Guitar"],
    ["completeTap", "Wood tap"],
  ];
  return `<div class="ai-status-card ${backend.available ? "ok" : "warn"}">
      <span class="ai-status-mark">${aiProviderIconHtml("opencode", "ai-status-icon")}<span class="ai-status-dot"></span></span>
      <div class="ai-status-copy">
        <strong>OpenCode</strong>
        <p>${esc(aiStatusCopy(backend))}</p>
      </div>
      <button class="btn small" type="button" data-action="ai-refresh-models">Refresh</button>
    </div>
    ${backend.available ? "" : `<div class="ai-inline-warning">OpenCode is missing. NeoTodo uses it to run the agent; install it before sending a message.</div>`}
    <div class="settings-section">
      <div class="settings-label">Agent <span>default backend</span></div>
      <div class="ai-card">
        <label class="ai-field">
          <span class="ai-field-copy"><strong>Default agent</strong><small>Used when a new AI conversation starts.</small></span>
          <select class="ai-select" data-ai-field="default_agent">
            ${Object.values(backends).map((item) => `<option value="${esc(item.id)}" ${item.id === (config.default_agent || "opencode") ? "selected" : ""} ${item.supported !== false ? "" : "disabled"}>${esc(item.name)}${item.supported !== false ? "" : item.available ? " · adapter not wired" : " · not installed"}</option>`).join("")}
          </select>
        </label>
        <label class="ai-field">
          <span class="ai-field-copy"><strong>Default model</strong><small>The model new chats, planning and subtasks start on.</small></span>
          <select class="ai-select" data-ai-field="default_model">${aiModelOptions(selectedModel)}</select>
        </label>
        <div class="ai-field">
          <span class="ai-field-copy"><strong>Default mode</strong><small>Chat only reads. Build may edit the linked project.</small></span>
          <div class="ai-mode-group">${aiModeButtons("default", mode)}</div>
        </div>
      </div>
    </div>
    <div class="settings-section">
      <div class="settings-label">Behavior</div>
      <button class="settings-toggle ${notificationOn ? "active" : ""}" type="button" data-action="ai-toggle-notifications" aria-pressed="${notificationOn ? "true" : "false"}">
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span class="toggle-copy"><strong>Notification</strong><small>Play a quiet sound when an agent finishes or stops with an error.</small></span>
      </button>
      ${notificationOn ? `<label class="ai-field ai-field-subtle">
        <span class="ai-field-copy"><strong>Sound</strong><small>One short cue, never a loop.</small></span>
        <select class="ai-select" data-ai-field="notification_sound">
          ${sounds.map(([id, label]) => `<option value="${id}" ${id === sound ? "selected" : ""}>${label}</option>`).join("")}
        </select>
      </label>` : ""}
      <button class="settings-toggle ${config.auto_attach_note !== false ? "active" : ""}" type="button" data-action="ai-toggle-auto-note" aria-pressed="${config.auto_attach_note !== false ? "true" : "false"}">
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span class="toggle-copy"><strong>Auto-attach the open note</strong><small>Hands the visible note text to the agent as context.</small></span>
      </button>
    </div>
    <div class="settings-section">
      <div class="settings-label">Custom instructions <span>applies to every agent</span></div>
      <textarea class="ai-instructions" data-ai-instructions rows="7" placeholder="Example: Answer in Chinese. Keep the notebook's quiet tone. Prefer editing web/ and app.py on Linux only.">${esc(config.custom_instructions || "")}</textarea>
      <p class="ai-hint" data-ai-instructions-count>${String(config.custom_instructions || "").length} characters</p>
      <p class="ai-hint">Saved automatically and appended to every chat, plan and executor run. The project's own AGENTS.md still comes first.</p>
    </div>`;
}

function aiModelsSettings() {
  const config = aiConfig || {};
  const enabled = new Set(aiEnabledModels());
  const defaultModel = config.default_model || aiCatalog.default_model || "";
  const query = aiModelQuery.trim().toLowerCase();
  const groups = new Map();
  for (const model of aiAllModels()) {
    const provider = String(model).split("/")[0];
    if (!groups.has(provider)) groups.set(provider, []);
    groups.get(provider).push(model);
  }
  const cards = [...groups.entries()].map(([provider, models]) => {
    const providerInfo = (aiCatalog.providers || []).find((item) => item.id === provider) || {};
    const visible = models.filter((model) => !query || model.toLowerCase().includes(query) || agentModelLeaf(model).toLowerCase().includes(query));
    if (!visible.length) return "";
    const rows = visible.map((model) => {
      const on = enabled.has(model);
      const isDefault = model === defaultModel;
      return `<div class="ai-model-row ${on ? "" : "off"}" data-ai-model-row data-search="${esc(model.toLowerCase())}">
        ${aiProviderIconHtml(provider, "ai-model-icon")}
        <div class="ai-model-copy">
          <strong>${esc(agentModelLeaf(model))}</strong>
          <small>${esc(model)}</small>
        </div>
        ${isDefault ? `<span class="ai-default-badge">Default</span>` : `<button class="ai-model-default" type="button" data-action="ai-set-default-model" data-model="${esc(model)}">Make default</button>`}
        <button class="ai-model-switch ${on ? "active" : ""}" type="button" data-action="ai-toggle-model" data-model="${esc(model)}" aria-pressed="${on ? "true" : "false"}" aria-label="${on ? "Hide" : "Show"} ${esc(model)}">
          <span class="toggle-track"><span class="toggle-thumb"></span></span>
        </button>
      </div>`;
    }).join("");
    return `<div class="ai-provider-block">
      <div class="ai-provider-block-head">
        ${aiProviderIconHtml(provider)}
        <div><strong>${esc(providerInfo.name || aiProviderDisplayName(provider))}</strong><small>${models.length} model${models.length === 1 ? "" : "s"}${providerInfo.custom ? " · custom provider" : ""}</small></div>
        <span class="ai-provider-status">${providerInfo.status === "key-required" ? "Key required" : providerInfo.status === "local" ? "Local" : providerInfo.status === "disabled" ? "Disabled" : "Ready"}</span>
      </div>
      <div class="ai-model-list">${rows}</div>
    </div>`;
  }).join("");
  return `<div class="ai-toolbar">
      <label class="ai-search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m15.4 15.4 4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        <input type="search" data-ai-model-search value="${esc(aiModelQuery)}" placeholder="Search models…" autocomplete="off">
      </label>
      <button class="btn small" type="button" data-action="ai-refresh-models">Refresh</button>
    </div>
    <div class="ai-summary-line"><span>${enabled.size} of ${aiAllModels().length} models visible in the AI picker</span><span>Default · ${esc(aiModelLabel(defaultModel))}</span></div>
    ${cards || `<div class="ai-empty">No model matches “${esc(aiModelQuery)}”.</div>`}
    <p class="ai-hint">Everything OpenCode reports and every model you add under Providers appears here. Turning a model off only hides it from NeoTodo's picker.</p>`;
}

function aiProviderEditor() {
  const draft = aiProviderDraft || {};
  return `<div class="ai-provider-form">
    ${draft.editing ? "" : `<div class="ai-preset-row"><span>Quick start</span>
      <button class="ai-preset" type="button" data-action="ai-provider-preset" data-preset="ollama">Ollama</button>
      <button class="ai-preset" type="button" data-action="ai-provider-preset" data-preset="lmstudio">LM Studio</button>
      <button class="ai-preset" type="button" data-action="ai-provider-preset" data-preset="openrouter">OpenRouter</button>
      <button class="ai-preset" type="button" data-action="ai-provider-preset" data-preset="custom">Custom</button>
    </div>`}
    <div class="ai-form-grid">
      <label class="ai-input"><span>Display name</span><input type="text" data-ai-provider-field="name" value="${esc(draft.name || "")}" placeholder="Acme Gateway" autocomplete="off"></label>
      <label class="ai-input"><span>Provider id</span><input type="text" data-ai-provider-field="id" value="${esc(draft.id || "")}" placeholder="acme" autocomplete="off" ${draft.editing ? "readonly" : ""}></label>
      <label class="ai-input ai-input-wide"><span>Base URL</span><input type="url" data-ai-provider-field="base_url" value="${esc(draft.base_url || "")}" placeholder="https://llm.acme.example/v1" autocomplete="off"></label>
      <label class="ai-input ai-input-wide"><span>API key ${draft.editing ? "(leave blank to keep)" : ""}</span><input type="password" data-ai-provider-field="api_key" value="" placeholder="${draft.api_key_set ? "A key is already saved" : "sk-…"}" autocomplete="off"></label>
      <label class="ai-input ai-input-wide"><span>Models · one per line</span><textarea data-ai-provider-field="models" rows="4" placeholder="qwen3-coder&#10;glm-5">${esc(Array.isArray(draft.models) ? draft.models.join("\n") : (draft.models || ""))}</textarea></label>
    </div>
    <p class="ai-hint">Connection uses an OpenAI-compatible <code>/models</code> endpoint. The key is stored in NeoTodo's AI settings (file mode 600) and is never shown again.</p>
    <div class="ai-form-actions">
      <button class="btn small" type="button" data-action="ai-test-provider">Test connection</button>
      <button class="btn small primary" type="button" data-action="ai-save-provider">Save provider</button>
      <button class="btn small" type="button" data-action="ai-cancel-provider">Cancel</button>
    </div>
  </div>`;
}

function aiProvidersSettings() {
  const providers = aiCatalog.providers || [];
  const custom = providers.filter((item) => item.custom);
  const builtin = providers.filter((item) => !item.custom);
  const customRows = custom.map((provider) => `<div class="ai-provider-row">
      ${aiProviderIconHtml(provider.id)}
      <div class="ai-provider-copy">
        <strong>${esc(provider.name)}</strong>
        <small>${esc(provider.base_url || "Base URL missing")} · ${provider.count} model${provider.count === 1 ? "" : "s"}</small>
      </div>
      <span class="ai-provider-key ${provider.api_key_set || provider.status === "local" ? "set" : ""}">${provider.status === "local" ? "Local" : provider.api_key_set ? "API key set" : "No key"}</span>
      <button class="btn small" type="button" data-action="ai-edit-provider" data-provider="${esc(provider.id)}">Edit</button>
      <button class="btn small danger" type="button" data-action="ai-remove-provider" data-provider="${esc(provider.id)}">Remove</button>
    </div>`).join("");
  const builtinRows = builtin.map((provider) => `<div class="ai-builtin-row">
      ${aiProviderIconHtml(provider.id)}
      <div class="ai-provider-copy"><strong>${esc(provider.name)}</strong><small>${provider.count} model${provider.count === 1 ? "" : "s"} · managed by OpenCode</small></div>
      <span class="ai-provider-key ready">${provider.status === "key-required" ? "Key required" : "Ready"}</span>
    </div>`).join("");
  return `<div class="ai-toolbar">
      <div class="ai-toolbar-copy"><strong>Bring your own key</strong><span>OpenAI-compatible endpoints, gateways, Ollama or LM Studio.</span></div>
      <button class="btn small primary" type="button" data-action="ai-new-provider">Add provider</button>
    </div>
    ${aiProviderDraft ? aiProviderEditor() : ""}
    <div class="settings-section">
      <div class="settings-label">Your providers <span>${custom.length}</span></div>
      ${custom.length ? customRows : `<div class="ai-empty">No custom provider yet. OpenCode's own providers below keep working.</div>`}
    </div>
    <div class="settings-section">
      <div class="settings-label">From OpenCode <span>${builtin.length}</span></div>
      ${builtinRows || `<div class="ai-empty">No provider reported. Check <code>opencode models</code>.</div>`}
    </div>
    <div class="ai-note-card">
      <strong>How routing works</strong>
      <p>Custom providers are written to <code>ai-opencode.json</code> in NeoTodo's data folder and handed to OpenCode through <code>OPENCODE_CONFIG</code>. Your global <code>~/.config/opencode/opencode.jsonc</code> is never rewritten.</p>
      <button class="btn small" type="button" data-action="ai-open-folder">Open AI data folder</button>
    </div>`;
}

function aiAgentsSettings() {
  const config = aiConfig || {};
  const backends = aiCatalog.backends || {};
  const kinds = [
    { id: "captain", title: "Captain", detail: "The notebook-wide architect. Plans, explains and answers from anywhere." },
    { id: "todo", title: "Todo agent", detail: "Works on one todo card, reads its notes and plans the subtasks." },
    { id: "subtask", title: "Subtask executor", detail: "Runs one subtask in Build mode and edits the linked project." },
  ];
  const cards = kinds.map((item) => {
    const defaults = aiCatalog.agent_defaults?.[item.id] || {};
    const model = config.agent_models?.[item.id] || "";
    const mode = config.agent_modes?.[item.id] || defaults.mode || "chat";
    return `<div class="ai-agent-card">
      <div class="ai-agent-card-head">
        <span class="ai-agent-rank">${item.id === "captain" ? "C" : item.id === "todo" ? "T" : "S"}</span>
        <div><strong>${esc(item.title)}</strong><small>${esc(item.detail)}</small></div>
      </div>
      <label class="ai-field">
        <span class="ai-field-copy"><strong>Model</strong><small>Effective now · ${esc(aiModelLabel(defaults.model || config.default_model || ""))}</small></span>
        <select class="ai-select" data-ai-agent-model="${esc(item.id)}">${aiModelOptions(model, { inherit: "Use the default model" })}</select>
      </label>
      <div class="ai-field">
        <span class="ai-field-copy"><strong>Mode</strong><small>Chat is read-only. Build can edit the project.</small></span>
        <div class="ai-mode-group">${aiModeButtons(item.id, mode)}</div>
      </div>
    </div>`;
  }).join("");
  return `<div class="ai-backend-card">
      <div class="ai-backend-title">${aiProviderIconHtml("opencode")}<div><strong>OpenCode</strong><small>${esc(aiStatusCopy(backends.opencode))}</small></div><span class="ai-provider-key ${backends.opencode?.available ? "ready" : ""}">${backends.opencode?.available ? "Installed" : "Missing"}</span></div>
      <p>NeoTodo drives one local OpenCode CLI. Claude and Codex are listed for future adapters but are not used by this build.</p>
    </div>
    <div class="settings-label">Agent profiles</div>
    <div class="ai-agent-grid">${cards}</div>
    <p class="ai-hint">Changes apply to new conversations. A conversation that already has a model keeps it until you pick another one from the AI footer.</p>`;
}

function aiSkillsSettings() {
  const skills = aiCatalog.skills || [];
  const paths = aiCatalog.paths || {};
  const rows = skills.map((skill) => `<div class="ai-skill-row">
      <span class="ai-skill-badge" aria-hidden="true">SK</span>
      <div class="ai-skill-copy">
        <strong>${esc(skill.name || skill.id)}</strong>
        <small>${esc(skill.description || "No description")}</small>
        <code>${esc(skill.id)} · ${esc(skill.source || "")}</code>
      </div>
      <span class="ai-provider-key ${skill.scope === "project" ? "ready" : ""}">${skill.scope === "project" ? "Project" : "Global"}</span>
      <button class="btn small" type="button" data-action="ai-open-skill" data-path="${esc(skill.path)}">Reveal</button>
    </div>`).join("");
  return `<div class="ai-toolbar">
      <div class="ai-toolbar-copy"><strong>Skills</strong><span>Instruction packets OpenCode discovers and loads when relevant.</span></div>
      <button class="btn small" type="button" data-action="ai-refresh-models">Rescan</button>
    </div>
    <div class="ai-summary-line"><span>${skills.length} skill${skills.length === 1 ? "" : "s"} found</span><span>SKILL.md · automatic</span></div>
    <div class="ai-skill-list">${rows || `<div class="ai-empty">No skills yet. Add a <code>SKILL.md</code> under a skills folder near the project.</div>`}</div>
    <div class="ai-provider-form ai-skill-folder-card">
      <strong>Where they live</strong>
      <p class="ai-hint">OpenCode scans these folders automatically. Project skills override a global skill with the same id. NeoTodo never edits their contents.</p>
      <div class="ai-skill-paths">
        <div><span>Project</span><code>${esc(paths.project_skills || ".opencode/skills")}</code></div>
        <div><span>Global</span><code>${esc(paths.global_skills || "~/.config/opencode/skills")}</code></div>
      </div>
      <div class="ai-form-actions">
        <button class="btn small" type="button" data-action="ai-open-skill" data-path="${esc(paths.project_skills || "")}">Open project folder</button>
        <button class="btn small" type="button" data-action="ai-open-skill" data-path="${esc(paths.global_skills || "")}">Open global folder</button>
      </div>
    </div>
    <p class="ai-hint">A skill file starts with <code>name</code> and <code>description</code> frontmatter, then the instructions. The agent reads it only when the task matches.</p>`;
}

function aiCommandsSettings() {  const commands = aiConfig?.commands || [];
  const rows = commands.map((command) => `<div class="ai-command-row">
      <div class="ai-command-copy"><strong>/${esc(command.name)}</strong><small>${esc(String(command.prompt || "").slice(0, 180))}${String(command.prompt || "").length > 180 ? "…" : ""}</small></div>
      <button class="btn small" type="button" data-action="ai-insert-command" data-command="${esc(command.id)}">Insert</button>
      <button class="btn small" type="button" data-action="ai-edit-command" data-command="${esc(command.id)}">Edit</button>
      <button class="btn small danger" type="button" data-action="ai-delete-command" data-command="${esc(command.id)}">Delete</button>
    </div>`).join("");
  const draft = aiCommandDraft;
  return `<div class="ai-toolbar">
      <div class="ai-toolbar-copy"><strong>Quick commands</strong><span>Reusable prompts that land in the AI composer.</span></div>
      <button class="btn small primary" type="button" data-action="ai-new-command">New command</button>
    </div>
    ${draft ? `<div class="ai-provider-form">
      <div class="ai-form-grid">
        <label class="ai-input ai-input-wide"><span>Name</span><input type="text" data-ai-command-name value="${esc(draft.name || "")}" placeholder="Summarize note" autocomplete="off"></label>
        <label class="ai-input ai-input-wide"><span>Prompt</span><textarea data-ai-command-prompt rows="5" placeholder="Summarize the open note in three bullet points…">${esc(draft.prompt || "")}</textarea></label>
      </div>
      <div class="ai-form-actions">
        <button class="btn small primary" type="button" data-action="ai-save-command">Save command</button>
        <button class="btn small" type="button" data-action="ai-cancel-command">Cancel</button>
      </div>
    </div>` : ""}
    <div class="settings-section">
      <div class="settings-label">Saved commands <span>${commands.length}</span></div>
      ${rows || `<div class="ai-empty">No commands yet. Add the prompts you retype most.</div>`}
    </div>
    <p class="ai-hint">Insert closes Settings, opens the AI sheet and puts the prompt in the composer without sending it.</p>`;
}

function aiAdvancedSettings() {
  const config = aiConfig || {};
  const activity = (aiCatalog.activity || []).slice(-10).reverse();
  const activityRows = activity.map((entry) => `<div class="ai-activity-row ${esc(entry.event || "")}">
      <span class="ai-activity-event">${esc(aiActivityLabel(entry))}</span>
      <span class="ai-activity-title">${esc(entry.title || entry.agent || "")}</span>
      <span class="ai-activity-meta">${esc(entry.model || "")}${entry.seconds ? ` · ${entry.seconds}s` : ""}</span>
      <span class="ai-activity-time">${esc(aiActivityWhen(entry.at))}</span>
    </div>`).join("");
  const envRows = (config.environment || []).map((item) => `<div class="ai-env-row" data-ai-env-row>
      <input type="text" data-ai-env-name value="${esc(item.name)}" placeholder="OPENCODE_CONFIG_DIR" autocomplete="off">
      <input type="text" data-ai-env-value value="${esc(item.value)}" placeholder="value" autocomplete="off">
      <button class="ai-row-remove" type="button" data-action="ai-env-remove" aria-label="Remove variable">×</button>
    </div>`).join("");
  const paths = aiCatalog.paths || {};
  return `<div class="settings-section">
      <div class="settings-label">Diagnostics</div>
      <button class="settings-toggle ${config.activity_log !== false ? "active" : ""}" type="button" data-action="ai-toggle-activity" aria-pressed="${config.activity_log !== false ? "true" : "false"}">
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span class="toggle-copy"><strong>Agent activity log</strong><small>Keeps the last runs on this device: title, model, duration and errors.</small></span>
      </button>
      <div class="ai-activity-list">
        ${activityRows || `<div class="ai-empty">No agent runs logged yet.</div>`}
      </div>
      <div class="ai-form-actions">
        <button class="btn small" type="button" data-action="ai-refresh-models">Refresh</button>
        <button class="btn small danger" type="button" data-action="ai-clear-activity">Clear log</button>
      </div>
    </div>
    <div class="settings-section">
      <div class="settings-label">Runtime</div>
      <div class="ai-runtime-grid">
        <label class="ai-input"><span>Timeout · minutes</span><input type="number" min="1" max="120" data-ai-timeout value="${Number(config.timeout_minutes) || 15}"></label>
        <label class="ai-input"><span>Parallel build agents</span><input type="number" min="1" max="32" data-ai-parallel value="${Number(config.max_parallel) || 12}"></label>
      </div>
      <div class="ai-form-actions"><button class="btn small primary" type="button" data-action="ai-save-runtime">Save runtime</button></div>
    </div>
    <div class="settings-section">
      <div class="settings-label">Environment variables <span>agent processes only</span></div>
      <div class="ai-env-list">${envRows}</div>
      <div class="ai-form-actions">
        <button class="btn small" type="button" data-action="ai-env-add">Add variable</button>
        <button class="btn small primary" type="button" data-action="ai-save-env">Save environment</button>
      </div>
      <p class="ai-hint">Values are passed literally to OpenCode. Do not use this editor as a secret manager for keys; use Providers instead.</p>
    </div>
    <div class="settings-section">
      <div class="settings-label">Files</div>
      <div class="about-section ai-paths">
        <div><span>AI settings</span><small>${esc(paths.ai_config || "")}</small></div>
        <div><span>Generated OpenCode config</span><small>${esc(paths.opencode_config || "")}</small></div>
        <div><span>Activity log</span><small>${esc(paths.activity_log || "")}</small></div>
      </div>
      <div class="ai-form-actions"><button class="btn small" type="button" data-action="ai-open-folder">Open data folder</button></div>
    </div>
    <div class="plugin-danger-zone ai-danger-zone">
      <button class="btn small danger" type="button" data-action="ai-reset-config">Reset AI settings</button>
    </div>`;
}

function aiSettings() {
  if (!aiConfig && !aiConfigLoaded) {
    loadAiConfig().then(() => { if (aiSettingsModalOpen()) renderAiSettingsModal(); });
  }
  const tabs = [
    ["basic", "Basic"],
    ["models", "Models"],
    ["providers", "Providers"],
    ["agents", "Agents"],
    ["skills", "Skills"],
    ["commands", "Commands"],
    ["advanced", "Advanced"],
  ];
  const body = !aiConfig ? (aiConfigLoaded
      ? `<div class="ai-empty">Could not read AI settings. <button class="btn small" type="button" data-action="ai-refresh-models">Retry</button></div>`
      : `<div class="ai-loading">Reading AI settings…</div>`)
    : aiSettingsTab === "models" ? aiModelsSettings()
    : aiSettingsTab === "providers" ? aiProvidersSettings()
    : aiSettingsTab === "agents" ? aiAgentsSettings()
    : aiSettingsTab === "skills" ? aiSkillsSettings()
    : aiSettingsTab === "commands" ? aiCommandsSettings()
    : aiSettingsTab === "advanced" ? aiAdvancedSettings()
    : aiBasicSettings();
  return `<div class="settings-head ai-settings-head">
      <div><h2>AI</h2><p>Choose the model, agent and instructions NeoTodo works with.</p></div>
      <button class="btn small" type="button" data-action="ai-refresh-models">Refresh</button>
    </div>
    <div class="ai-tabs" role="tablist">
      ${tabs.map(([id, label]) => `<button class="ai-tab ${aiSettingsTab === id ? "active" : ""}" type="button" role="tab" aria-selected="${aiSettingsTab === id ? "true" : "false"}" data-ai-tab="${id}">${label}</button>`).join("")}
    </div>
    <div class="ai-tab-body">${body}</div>`;
}

function renderSettings() {
  // Every plugin action funnels through here; while the Community sheet is up,
  // refresh that sheet instead of the settings page behind it.
  if (communityModalOpen) { renderCommunity(); return; }
  // While the standalone AI sheet is up, every AI action funnels its rerender
  // through here; keep that sheet fresh instead of looking for Settings.
  if (aiSettingsModalOpen()) { renderAiSettingsModal(); return; }
  const panel = $(".settings-panel");
  if (!panel) return;
  // Old links and shortcuts may still ask for the former tabs.
  if (settingsTab === "appearance") {
    settingsTab = "theme";
  } else if (settingsTab === "community" || settingsTab === "themes") {
    settingsTab = "theme";
  } else if (settingsTab === "typography") {
    settingsTab = "font";
  } else if (settingsTab === "pictures") {
    // Pictures used to hold the wallpaper and the stickers. The wallpaper
    // moved into Theme; the tab itself is Stickers now.
    settingsTab = "stickers";
  }
  const previousScroll = $(".settings-scroll")?.scrollTop || 0;
  const view = settingsTab === "font" ? fontSettings()
    : settingsTab === "stickers" ? stickersSettings()
    : settingsTab === "plugins" ? pluginsSettings()
    : settingsTab === "sound" ? soundSettings()
    : settingsTab === "about" ? aboutSettings()
    : themeSettings();
  // Each page carries its name in the top row beside the close button, in the
  // same quiet italic face the old in-page heading used. Appearance, Sound and
  // Stickers wear the calligraphic brand face instead, and drop the hairline
  // under the title so the lettering stands on its own.
  const detailPlugin = settingsTab === "plugins" && pluginDetailId ? PLUGIN_REGISTRY[pluginDetailId] : null;
  const pageTitle = detailPlugin ? detailPlugin.title
    : settingsTab === "font" ? "Font"
    : settingsTab === "stickers" ? "Stickers"
    : settingsTab === "plugins" ? "Plugins"
    : settingsTab === "sound" ? "Sound"
    : settingsTab === "about" ? "About"
    : "Appearance";
  const artTitle = settingsTab === "theme" || settingsTab === "sound" || settingsTab === "stickers";
  panel.innerHTML = `<aside class="settings-nav">
      <div class="settings-brand"><svg class="gear-icon" aria-hidden="true"><use href="#gear"></use></svg><span>Settings</span></div>
      <button class="settings-nav-item ${settingsTab === "theme" ? "active" : ""}" data-settings-tab="theme">Appearance</button>
      <button class="settings-nav-item ${settingsTab === "font" ? "active" : ""}" data-settings-tab="font">Font</button>
      <button class="settings-nav-item ${settingsTab === "stickers" ? "active" : ""}" data-settings-tab="stickers">Stickers</button>
      <button class="settings-nav-item ${settingsTab === "plugins" ? "active" : ""}" data-settings-tab="plugins">Plugins</button>
      <button class="settings-nav-item ${settingsTab === "sound" ? "active" : ""}" data-settings-tab="sound">Sound</button>
      <button class="settings-nav-item ${settingsTab === "about" ? "active" : ""}" data-settings-tab="about">About</button>
    </aside>
    <section class="settings-main">
      <div class="settings-topbar ${artTitle ? "settings-topbar-art" : ""}"><span class="settings-page-title ${artTitle ? "settings-page-title-art" : ""}">${esc(pageTitle)}</span><button class="settings-close" type="button" data-action="close-settings" aria-label="Close settings"><svg class="settings-close-icon" aria-hidden="true"><use href="#close-circle"></use></svg></button></div>
      <div class="settings-scroll"><div class="settings-view">${view}</div></div>
    </section>`;
  if (settingsTab === "theme") syncPageLineControls();
  const nextScroll = $(".settings-scroll");
  if (nextScroll && previousScroll) nextScroll.scrollTop = previousScroll;
}

let focusTimer = null;

function openFocusTimer() {
  promptDialog({
    title: "Start a tomato clock",
    message: "Name the task you want to finish in the next 25 minutes.",
    placeholder: "Task name",
    confirmLabel: "Start",
  }).then((name) => {
    if (name) startFocusTimer(name);
  });
}

function positionTimerRoot() {
  const body = $(".page-body");
  const root = $("#timer-root");
  if (!body || !root || !focusTimer) return;
  const rect = body.getBoundingClientRect();
  root.style.left = `${Math.round(rect.left + 16)}px`;
  if (document.body.classList.contains("focus-running")) {
    const top = Math.round(rect.top - 8);
    root.style.top = `${top}px`;
    root.style.bottom = "auto";
    const notes = $("#notes-half")?.getBoundingClientRect();
    if (notes) {
      const available = notes.top - top - 4;
      const svgHeight = Math.max(150, available - 44);
      const width = Math.max(290, Math.min(430, Math.round(svgHeight * 360 / 214)));
      root.style.setProperty("--timer-width", `${width}px`);
    }
  } else {
    root.style.top = "auto";
    root.style.bottom = `${Math.round(window.innerHeight - rect.bottom + 14)}px`;
  }
}

function startFocusTimer(name) {
  closeFocusTimer();
  const total = 25 * 60 * 1000;
  const started = Date.now();
  const root = $("#timer-root");
  if (!root) return;
  document.body.classList.add("focus-running");
  const clockTicks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * Math.PI) / 30;
    const major = i % 5 === 0;
    const inner = major ? 53 : 57;
    const x1 = 180 + Math.sin(angle) * inner;
    const y1 = 132 - Math.cos(angle) * inner;
    const x2 = 180 + Math.sin(angle) * 62;
    const y2 = 132 - Math.cos(angle) * 62;
    return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#111111" stroke-width="${major ? 2 : 0.75}" stroke-linecap="round" opacity="${major ? 1 : 0.72}"/>`;
  }).join("");
  root.innerHTML = `<div class="focus-timer">
    <svg class="focus-tomato" viewBox="0 4 360 214" aria-hidden="true">
      <defs>
        <radialGradient id="tomatoSkin" cx="32%" cy="20%" r="86%">
          <stop offset="0" stop-color="#ffa48c"/>
          <stop offset=".3" stop-color="#fb6657"/>
          <stop offset=".68" stop-color="#e43b3b"/>
          <stop offset="1" stop-color="#b51d2c"/>
        </radialGradient>
        <linearGradient id="leafSkin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#8ee8c7"/>
          <stop offset=".5" stop-color="#3dbb94"/>
          <stop offset="1" stop-color="#17755c"/>
        </linearGradient>
        <radialGradient id="clockFace" cx="40%" cy="30%" r="78%">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset=".72" stop-color="#fdfcf8"/>
          <stop offset="1" stop-color="#e9e4d8"/>
        </radialGradient>
        <radialGradient id="glassInner" cx="50%" cy="38%" r="64%">
          <stop offset="0" stop-color="#7a6756" stop-opacity="0"/>
          <stop offset=".78" stop-color="#7a6756" stop-opacity="0"/>
          <stop offset=".94" stop-color="#5f4c3e" stop-opacity=".22"/>
          <stop offset="1" stop-color="#43352b" stop-opacity=".34"/>
        </radialGradient>
        <linearGradient id="glassRim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset=".3" stop-color="#d8e2e4"/>
          <stop offset=".62" stop-color="#7f8b90"/>
          <stop offset=".85" stop-color="#b9c5c8"/>
          <stop offset="1" stop-color="#f6fbfc"/>
        </linearGradient>
        <linearGradient id="glassSheen" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#ffffff" stop-opacity=".72"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="glassGlare" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffffff" stop-opacity=".5"/>
          <stop offset=".5" stop-color="#eaf7ff" stop-opacity=".08"/>
          <stop offset="1" stop-color="#d7ecf5" stop-opacity="0"/>
        </linearGradient>
        <filter id="tomatoShadow" x="-35%" y="-30%" width="170%" height="180%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#6f3a22" flood-opacity=".3"/>
        </filter>
        <filter id="leafShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#173f35" flood-opacity=".4"/>
        </filter>
      </defs>
      <!-- 3D cartoon tomato -->
      <g filter="url(#tomatoShadow)">
        <path d="M180 34c-68 0-118 40-118 96 0 52 52 86 118 86s118-34 118-86c0-56-50-96-118-96Z" fill="url(#tomatoSkin)" stroke="#971f2a" stroke-width="1.8"/>
        <path d="M80 88c12-30 42-48 75-48" fill="none" stroke="#ffc2b3" stroke-width="11" stroke-linecap="round" opacity=".34"/>
        <path d="M80 178c22 27 57 35 93 29" fill="none" stroke="#8f1e2a" stroke-width="8" stroke-linecap="round" opacity=".24"/>
        <ellipse cx="100" cy="80" rx="16" ry="8" fill="#fff5e8" opacity=".22" transform="rotate(-28 100 80)"/>
      </g>
      <!-- leaves -->
      <g filter="url(#leafShadow)">
        <path d="M180 40c-9-18-2-28 9-32 1 13 7 21 18 23-4 9-14 14-27 9Z" fill="url(#leafSkin)" stroke="#246250" stroke-width="1.3" transform="rotate(15 180 40)"/>
        <path d="M178 41c-14-14-26-14-36-9 6 10 17 15 29 14Z" fill="url(#leafSkin)" stroke="#246250" stroke-width="1.2"/>
        <path d="M181 41c12-15 24-17 34-13-5 11-15 17-29 18Z" fill="url(#leafSkin)" stroke="#246250" stroke-width="1.2" transform="rotate(8 181 41)"/>
        <path d="M179 40c-2 10-1 17 3 22" fill="none" stroke="#d6fff1" stroke-width="2" stroke-linecap="round" opacity=".6"/>
      </g>
      <!-- glass clock set into the tomato: white dial, black hand, deep glass rim -->
      <circle cx="180" cy="132" r="74" fill="#4a0f15" opacity=".5"/>
      <circle cx="180" cy="132" r="68" fill="none" stroke="url(#glassRim)" stroke-width="6"/>
      <circle cx="180" cy="132" r="65" fill="url(#clockFace)"/>
      <circle cx="180" cy="132" r="65" fill="#dceff7" opacity=".14"/>
      <circle cx="180" cy="132" r="65" fill="url(#glassInner)"/>
      <circle cx="180" cy="132" r="64.4" fill="none" stroke="#ffffff" stroke-width="1.5" opacity=".6"/>
      <circle cx="180" cy="132" r="62.8" fill="none" stroke="#9d9185" stroke-width=".7" opacity=".45"/>
      ${clockTicks}
      <g id="focus-hand" transform="rotate(150 180 132)">
        <line x1="180" y1="138" x2="180" y2="82" stroke="#111111" stroke-width="2.2" stroke-linecap="round"/>
      </g>
      <circle cx="180" cy="132" r="3.6" fill="#111111"/>
      <!-- curved glass reflections -->
      <path d="M120 104c10-22 33-36 61-35" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round" opacity=".62"/>
      <path d="M123 110c8-16 23-27 41-31" fill="url(#glassSheen)" opacity=".82"/>
      <ellipse cx="151" cy="99" rx="30" ry="11" fill="#ffffff" opacity=".2" transform="rotate(-27 151 99)"/>
      <path d="M116 124c3-27 24-49 53-57l10 24c-21 6-37 22-43 44Z" fill="url(#glassGlare)"/>
      <path d="M132 174c22 9 47 9 68-2" fill="none" stroke="#ffffff" stroke-width="2" opacity=".3"/>
      <circle cx="139" cy="92" r="6" fill="#ffffff" opacity=".72"/>
    </svg>
    <div class="focus-name">${esc(name)}</div>
  </div>`;
  positionTimerRoot();
  const hand = $("#focus-hand");
  const tick = () => {
    if (!focusTimer) return;
    const ratio = Math.min(1, (Date.now() - started) / total);
    if (hand) hand.setAttribute("transform", `rotate(${(150 * (1 - ratio)).toFixed(2)} 180 132)`);
    if (ratio >= 1) {
      const finished = focusTimer.name;
      const completedTimer = focusTimer;
      clearInterval(completedTimer.interval);
      settings.focus_count = (Number(settings.focus_count) || 0) + 1;
      settings.focus_log = [
        ...(Array.isArray(settings.focus_log) ? settings.focus_log : []),
        { name: finished, completed_at: new Date().toISOString() },
      ].slice(-200);
      saveSettings();
      const countNode = $("#tomato-count");
      if (countNode) countNode.textContent = String(settings.focus_count);
      const topCountNode = $("#top-tomato-count");
      if (topCountNode) topCountNode.textContent = String(settings.focus_count);
      AudioFX.chime();
      toast(`Focus complete: ${finished}`);
      setTimeout(() => {
        if (focusTimer === completedTimer) closeFocusTimer();
      }, 2200);
    }
  };
  focusTimer = { name, interval: setInterval(tick, 1000) };
  positionTimerRoot();
  tick();
}

function closeFocusTimer() {
  if (focusTimer) clearInterval(focusTimer.interval);
  focusTimer = null;
  document.body.classList.remove("focus-running");
  const root = $("#timer-root");
  if (root) root.innerHTML = "";
}

async function startNewTask(name = "") {
  const category = selectedCategory();
  const title = String(name || "").trim();
  if (!category || !title) return;
  selectedHistoryId = null;
  selectedSubtaskId = null;
  notesPreview = false;
  const result = await action("add_todo", { category_id: category.id, name: title });
  await attachPendingProjectFolder(result);
}

function bindEvents() {
  document.addEventListener("pointerdown", (event) => {
    const stretchHandle = event.target.closest?.(".notes-handle-top");
    if (stretchHandle && !notesHidden && event.button === 0) {
      const board = ensureTaskBoard();
      const metrics = notesDock.metrics();
      if (board.ready && metrics) {
        const startY = event.clientY;
        const bodyTop = metrics.body.getBoundingClientRect().top;
        const startTop = clamp(metrics.panel.getBoundingClientRect().top - bodyTop, metrics.minTop, metrics.maxTop);
        const cache = board.stretchCache();
        const prepared = notesDock.prepareStretch(metrics);
        let pendingTop = startTop;
        let frame = 0;
        let holdTimer = null;
        let moveHandler = null;
        let upHandler = null;
        notesStretchPress = true;

        const commitFrame = () => {
          frame = 0;
          notesDock.setTop(pendingTop, cache, metrics);
        };
        const scheduleFrame = () => {
          if (!frame) frame = requestAnimationFrame(commitFrame);
        };

        holdTimer = setTimeout(() => {
          notesStretchActive = true;
          notesDock.board?.beginStretch();
          metrics.panel.classList.add("stretching");
          document.body.classList.add("notes-stretching");
          AudioFX.startLeafStretch();
          scheduleFrame();
        }, 260);

        moveHandler = (moveEvent) => {
          if (!notesStretchActive) return;
          moveEvent.preventDefault();
          pendingTop = Math.max(metrics.minTop, Math.min(metrics.maxTop, startTop + (moveEvent.clientY - startY)));
          scheduleFrame();
        };
        upHandler = () => {
          clearTimeout(holdTimer);
          if (frame) { cancelAnimationFrame(frame); frame = 0; }
          if (notesStretchActive) {
            notesDock.setTop(pendingTop, cache, metrics);
            notesDock.board?.endStretch();
            notesDock.finishStretch(pendingTop, prepared);
            // The note's height is its own saved value: a top-edge stretch is
            // exactly as durable as a pull on the bottom line.
            window.noteSheetRememberCurrentHeight?.();
            notesStretchSuppressClick = true;
            notesSwipeCooldownUntil = performance.now() + 1200;
            setTimeout(() => { notesStretchSuppressClick = false; }, 350);
          }
          if (!notesStretchActive) {
            // A plain tap: put the note's height back exactly as it was.
            metrics.panel.classList.remove("stretch-ready");
            metrics.panel.style.height = prepared?.previousHeight || "";
          }
          AudioFX.stopLeafStretch();
          syncTaskScrollers();
          notesStretchActive = false;
          notesStretchPress = false;
          metrics.panel.classList.remove("stretching");
          document.body.classList.remove("notes-stretching");
          window.removeEventListener("pointermove", moveHandler);
          window.removeEventListener("pointerup", upHandler);
        };
        window.addEventListener("pointermove", moveHandler, { passive: false });
        window.addEventListener("pointerup", upHandler, { once: true });
      }
    }
    if (!addingSubtask) return;
    if (event.target.closest("[data-add-subtask-row], [data-action='add-subtask']")) return;
    const input = document.querySelector("#subtask-name-input");
    const name = input?.value.trim() || "";
    const todoId = addingSubtaskTodoId;
    if (!name || !todoId) return; // an empty add row simply stays where it is
    addingSubtask = false;
    addingSubtaskTodoId = null;
    action("add_subtask", { todo_id: todoId, name });
  }, true);

  document.addEventListener("wheel", (event) => {
    const scroller = event.target.closest(".subtask-lane, .current-inner, #history-reel");
    if (!scroller || scroller.classList.contains("task-scrollable")) return;
    event.preventDefault();
    scroller.scrollTop = 0;
  }, { passive: false });

  document.addEventListener("click", (event) => {
    // Native <details> menus stay open until clicked again; close every other
    // theme menu as soon as the reader opens one or clicks somewhere else.
    const openThemeMenus = document.querySelectorAll("details.theme-menu[open]");
    if (openThemeMenus.length) {
      const ownMenu = event.target.closest?.("details.theme-menu");
      openThemeMenus.forEach((menu) => {
        if (menu !== ownMenu && !menu.contains(event.target)) menu.open = false;
      });
    }
    if (contextMenuOpen) {
      if (event.target.closest(".context-menu")) return;
      closeContextMenu();
    }
    const externalLink = event.target.closest("[data-external-link]");
    if (externalLink) {
      event.preventDefault();
      silentAction("open_url", { url: externalLink.dataset.externalLink });
      return;
    }
    const doingDock = event.target.closest("[data-doing-dock]");
    if (doingDock) {
      event.preventDefault();
      event.stopPropagation();
      AudioFX.categoryTap();
      setDoingDockSide(doingDockSide === "right" ? "left" : "right");
      return;
    }
    const doingPin = event.target.closest("[data-doing-pin]");
    if (doingPin) {
      event.preventDefault();
      event.stopPropagation();
      // A pinned card is sent back to its border; the pin on a docked card
      // closes the drawer as it always did. The return glide plays its own tap.
      if (doingFloat) returnDoingPeekHome();
      else {
        AudioFX.categoryTap();
        closeDoingPeek();
      }
      return;
    }
    const doingExpand = event.target.closest("[data-doing-expand]");
    if (doingExpand) {
      event.preventDefault();
      event.stopPropagation();
      const todoId = doingExpand.dataset.doingExpand;
      if (doingExpandedTodoIds.has(todoId)) doingExpandedTodoIds.delete(todoId);
      else doingExpandedTodoIds.add(todoId);
      saveDoingExpandedTodoIds();
      AudioFX.categoryTap();
      updateDoingPeek();
      return;
    }
    const doingJump = event.target.closest("[data-doing-jump]");
    if (doingJump) {
      event.preventDefault();
      event.stopPropagation();
      jumpToDoingTodo(doingJump.dataset.doingJump, doingJump.dataset.categoryId);
      return;
    }
    const doingSubtask = event.target.closest("[data-doing-subtask]");
    if (doingSubtask) {
      event.preventDefault();
      event.stopPropagation();
      jumpToDoingSubtask(doingSubtask.dataset.doingTodo, doingSubtask.dataset.categoryId, doingSubtask.dataset.doingSubtask);
      return;
    }
    const doneFan = event.target.closest(".history-subtask .h-sub-fan, .current-subtask.done .sub-fan");
    if (doneFan) {
      event.preventDefault();
      event.stopPropagation();
      const row = doneFan.closest(".history-subtask, .current-subtask");
      const rotor = doneFan.querySelector(".fan-rotor") || doneFan.querySelector("svg");
      if (row && rotor) {
        // Always spin clockwise. Rapid clicks must never play the old reverse
        // animation; restart the same forward spin instead.
        row.classList.remove("turned");
        rotor.classList.remove("spinning", "spinning-back");
        void rotor.getBoundingClientRect();
        rotor.classList.add("spinning");
        setTimeout(() => rotor.classList.remove("spinning"), 700);
      }
      AudioFX.categoryTap();
      // The fan in the finished card is not decoration: clicking it puts the
      // subtask back on the board. Finished todos stay locked, so only the
      // live todo's finished rows reopen.
      const liveRow = doneFan.closest(".current-subtask.done[data-subtask-id]");
      if (liveRow) reopenFinishedSubtask(currentTodo()?.id, liveRow.dataset.subtaskId);
      return;
    }
    const logExpand = event.target.closest("[data-log-expand]");
    if (logExpand) {
      event.preventDefault();
      event.stopPropagation();
      const key = logExpand.dataset.logExpand;
      if (completedExpanded.has(key)) completedExpanded.delete(key);
      else completedExpanded.add(key);
      renderCompletedLogContent();
      return;
    }
    const wallpaperFileNode = event.target.closest("[data-wallpaper-file]");
    if (wallpaperFileNode) {
      event.preventDefault();
      const name = wallpaperFileNode.dataset.wallpaperFile || "";
      if (!wallpaperIsLocalFile(name)) return;
      applyWallpaperChoice(name);
      return;
    }
    const themeBase = event.target.closest("[data-theme-base]");
    if (themeBase) {
      event.preventDefault();
      const baseId = themeBase.dataset.themeBase === "dark" ? BASE_DARK_THEME : BASE_LIGHT_THEME;
      if (applyThemeChoice(baseId)) {
        customThemesOpen = false;
        customThemeEditorOpen = false;
        customThemeDraft = null;
        pendingCustomThemeDeleteId = null;
        renderSettings();
      }
      return;
    }
    const iconThemeChoice = event.target.closest("[data-icon-theme-choice]");
    if (iconThemeChoice) {
      event.preventDefault();
      const choice = iconThemeChoice.dataset.iconThemeChoice || "classical";
      settings.icon_theme = iconThemeById(choice).id;
      saveSettings();
      applyIconTheme();
      renderSettings();
      return;
    }
    const soundStyleChoice = event.target.closest("[data-sound-style]");
    if (soundStyleChoice) {
      event.preventDefault();
      const next = soundStyleById(soundStyleChoice.dataset.soundStyle || "classical");
      settings.sound_style = next.id;
      saveSettings();
      applySettings();
      renderSettings();
      // Let the reader hear the new set immediately instead of waiting for
      // the next key press.
      AudioFX.unlock();
      AudioFX.audition("type");
      return;
    }
    const postcardChoice = event.target.closest("[data-postcard-choice]");
    if (postcardChoice) {
      event.preventDefault();
      const choice = postcardChoice.dataset.postcardChoice;
      if (choice === "random") {
        settings.theme = "postcard";
        settings.postcard = "random";
        settings.resolved_postcard = randomPostcardId(settings.resolved_postcard);
        randomPicked = true;
        saveSettings();
        applySettings();
        renderCategories();
        renderStage();
        if (archiveOpen) renderArchive();
      } else if (applyThemeChoice(choice)) {
        customThemesOpen = true;
      }
      pendingCustomThemeDeleteId = null;
      renderSettings();
      return;
    }
    const themeFieldModeNode = event.target.closest("[data-theme-field-mode]");
    if (themeFieldModeNode) {
      event.preventDefault();
      const next = themeFieldModeNode.dataset.themeFieldMode;
      themeFieldMode = next === "note" || next === "ai" ? next : "app";
      // Choosing a unit replaces the whole row; put focus back on the new
      // highlighted unit label so the next click opens that unit's themes.
      renderSettings();
      restoreThemeFocus(".theme-unit-trigger");
      return;
    }
    const caretFieldModeNode = event.target.closest("[data-caret-field-mode]");
    if (caretFieldModeNode) {
      event.preventDefault();
      const next = caretFieldModeNode.dataset.caretFieldMode;
      caretFieldMode = next === "note" || next === "ai" ? next : "app";
      renderSettings();
      restoreThemeFocus(".caret-unit-trigger");
      return;
    }
    const noteSurface = event.target.closest("[data-note-surface-file]");
    if (noteSurface) {
      event.preventDefault();
      const file = noteSurface.dataset.noteSurfaceFile;
      settings.note_material_file = file;
      settings.note_material = materialIdForFile(file);
      noteMaterialMenuOpen = false;
      saveSettings();
      // Paper/Glass belongs to the notebook only: repaint it in place without
      // touching the app theme, and without closing Settings.
      applySettings();
      renderSettings();
      scheduleCustomCaret();
      return;
    }
    const noteThemeChoice = event.target.closest("[data-note-theme-choice]");
    if (noteThemeChoice) {
      event.preventDefault();
      settings.note_theme = noteThemeChoice.dataset.noteThemeChoice;
      saveSettings();
      applyNoteTheme();
      renderSettings();
      return;
    }
    const aiThemeChoice = event.target.closest("[data-ai-theme-choice]");
    if (aiThemeChoice) {
      event.preventDefault();
      settings.ai_theme = aiThemeChoice.dataset.aiThemeChoice;
      saveSettings();
      applyAiTheme();
      renderSettings();
      return;
    }
    const fontChoice = event.target.closest("[data-font-choice]");
    if (fontChoice) {
      event.preventDefault();
      settings.font = fontChoice.dataset.fontChoice;
      saveSettings();
      applySettings();
      renderSettings();
      return;
    }
    const noteFontChoice = event.target.closest("[data-note-font-choice]");
    if (noteFontChoice) {
      event.preventDefault();
      settings.note_font = noteFontChoice.dataset.noteFontChoice;
      saveSettings();
      applySettings();
      renderSettings();
      return;
    }
    const noteMaterial = event.target.closest("[data-note-material-file]");
    if (noteMaterial) {
      event.preventDefault();
      const file = noteMaterial.dataset.noteMaterialFile;
      settings.note_material_file = file;
      settings.note_material = materialIdForFile(file);
      noteMaterialMenuOpen = false;
      saveSettings();
      applySettings();
      renderSettings();
      scheduleCustomCaret();
      return;
    }
    const noteBgPreset = event.target.closest("[data-note-bg-preset]");
    if (noteBgPreset) {
      event.preventDefault();
      settings.note_background = noteBgPreset.dataset.noteBgPreset;
      // Choosing "None" really removes the custom cover; otherwise a stale
      // base64 image would silently come back on the next launch.
      if (settings.note_background === "") settings.note_background_image = "";
      if (settings.note_background === "__custom" && !settings.note_background_image) settings.note_background = "";
      saveSettings();
      applySettings();
      renderNotesPanel();
      renderSettings();
      return;
    }
    const caretShape = event.target.closest("[data-caret-shape]");
    if (caretShape) {
      event.preventDefault();
      settings.caret_shape = caretShape.dataset.caretShape === "block" ? "block" : "line";
      saveSettings();
      applySettings();
      renderSettings();
      scheduleCustomCaret();
      return;
    }
    const aiCaretShape = event.target.closest("[data-ai-caret-shape]");
    if (aiCaretShape) {
      event.preventDefault();
      settings.ai_caret_shape = aiCaretShape.dataset.aiCaretShape === "block" ? "block" : "line";
      saveSettings();
      applySettings();
      renderSettings();
      scheduleCustomCaret();
      return;
    }
    const sharedCaretShape = event.target.closest("[data-shared-caret-shape]");
    if (sharedCaretShape) {
      event.preventDefault();
      const shape = sharedCaretShape.dataset.sharedCaretShape === "block" ? "block" : "line";
      settings.caret_shape = shape;
      settings.ai_caret_shape = shape;
      saveSettings();
      applySettings();
      renderSettings();
      scheduleCustomCaret();
      return;
    }
    const aiTabNode = event.target.closest("[data-ai-tab]");
    if (aiTabNode) {
      event.preventDefault();
      aiSettingsTab = aiTabNode.dataset.aiTab || "basic";
      aiProviderDraft = null;
      aiCommandDraft = null;
      AudioFX.categoryTap();
      renderSettings();
      const aiScroll = $(".settings-scroll");
      if (aiScroll) aiScroll.scrollTop = 0;
      return;
    }
    const settingsTabNode = event.target.closest("[data-settings-tab]");
    if (settingsTabNode) {
      event.preventDefault();
      settingsTab = settingsTabNode.dataset.settingsTab === "appearance" ? "theme" : settingsTabNode.dataset.settingsTab;
      pluginDetailId = null;
      pluginPendingUninstallId = null;
      renderSettings();
      if (settingsTab === "sound") loadSoundStyles().then(() => { if (settingsTab === "sound") renderSettings(); });
      const settingsScroll = $(".settings-scroll");
      if (settingsScroll) settingsScroll.scrollTop = 0;
      return;
    }

    const restoreNode = event.target.closest("[data-restore-subtask]");
    if (restoreNode) {
      event.preventDefault();
      event.stopPropagation();
      restoreTrashSubtask(restoreNode.dataset.restoreSubtask, restoreNode.closest(".trash-row"));
      return;
    }
    const draggedRow = event.target.closest(".current-subtask[data-subtask-id], .history-subtask[data-history-subtask-id], [data-history-index], [data-current-line]");
    if (draggedRow && performance.now() < suppressSubtaskRenameUntil) {
      // A drag is a text selection, not a request to switch the highlighted row.
      event.preventDefault();
      return;
    }
    const actionNode = event.target.closest("[data-action]");
    if (actionNode) {
      const actionName = actionNode.dataset.action;
      if (actionName === "complete-subtask" && !agentIsRunning(`subtask:${actionNode.dataset.subtaskId}`)) {
        // Finishing a subtask pops its fan once, like a tap on the napkin:
        // a quick swell and settle, not a full clockwise turn.
        const fanButton = actionNode.closest(".sub-fan-action") || actionNode;
        fanButton.classList.remove("fan-pop");
        void fanButton.getBoundingClientRect();
        fanButton.classList.add("fan-pop");
        setTimeout(() => fanButton.classList.remove("fan-pop"), 280);
      }
      if (actionName === "close-postcard") { AudioFX.categoryTap(); closePostcard(); return; }
      if (actionName === "prev-postcard") { postcardNav(-1); return; }
      if (actionName === "next-postcard") { postcardNav(1); return; }
      if (actionName === "close-completed") { closeCompletedLog(); return; }
      if (actionName === "none") return;
      event.preventDefault();
      handleAction(actionName, actionNode);
      return;
    }
    const noteBlock = event.target.closest("[data-note-block]");
    if (noteBlock) {
      if (event.target.closest("a")) return;
      event.preventDefault();
      activateNoteBlock(Number(noteBlock.dataset.noteBlock), event);
      return;
    }
    const categoryNode = event.target.closest("[data-category-id]");
    if (categoryNode) {
      if (performance.now() < suppressCategoryClickUntil) {
        event.preventDefault();
        return;
      }
      selectCategoryRow(categoryNode);
      return;
    }
    const archiveCard = event.target.closest(".archive-postcard");
    if (archiveCard) {
      if (performance.now() < archiveCardSwipeUntil) return;
      event.preventDefault();
      openPostcard(archiveCard.dataset.archiveCard);
      return;
    }
    const weekNode = event.target.closest("[data-card-id]");
    if (weekNode) {
      const id = weekNode.dataset.cardId;
      expandedArchiveCardId = expandedArchiveCardId === id ? null : id;
      renderArchive();
      if (expandedArchiveCardId) {
        silentAction("mark_seen", { card_id: id }).then((result) => {
          if (result?.state) state.data = result.state;
        });
      }
      return;
    }
    const expandRow = event.target.closest("[data-history-expand]");
    if (expandRow) {
      event.preventDefault();
      event.stopPropagation();
      const index = Number(expandRow.dataset.historyExpand);
      const rowEl = expandRow.closest(".history-row");
      // Clicking the gold headphone both expands the subtasks and moves the
      // focus (and the note) to that completed task.
      saveActiveNoteCaret();
      flushNoteSave();
      historyCursor = index;
      selectedHistoryId = rowEl?.dataset.todoId || doneTodos(selectedCategory())[index]?.id || null;
      selectedSubtaskId = null;
      notesPreview = false;
      AudioFX.categoryTap();
      if (historyExpanded.has(index)) historyExpanded.delete(index);
      else historyExpanded.add(index);
      renderStage();
      return;
    }
    const todoName = event.target.closest("[data-current-line] .page-title-name");
    if (todoName) {
      // A second click inside the field belongs to the caret and to word
      // selection, not to a new edit session.
      if (todoName.isContentEditable) return;
      if (performance.now() < suppressSubtaskRenameUntil) {
        event.preventDefault();
        return;
      }
      // A drag is a text selection, not a request to edit the name.
      const textSelection = window.getSelection?.();
      if (textSelection && !textSelection.isCollapsed && textSelection.rangeCount) return;
      event.preventDefault();
      // The title doubles as the todo's note target: the click both brings the
      // note back to this todo and puts the caret in its name.
      saveActiveNoteCaret();
      flushNoteSave();
      selectedHistoryId = null;
      selectedSubtaskId = null;
      notesPreview = false;
      updateHistorySelection();
      updateSubtaskSelection();
      renderNotesPanel();
      AudioFX.categoryTap();
      startTodoRename(todoName, event);
      return;
    }
    const currentLine = event.target.closest("[data-current-line]");
    if (currentLine) {
      saveActiveNoteCaret();
      flushNoteSave();
      selectedHistoryId = null;
      selectedSubtaskId = null;
      notesPreview = false;
      updateHistorySelection();
      updateSubtaskSelection();
      renderNotesPanel();
      return;
    }
    const forkLink = event.target.closest("[data-fork-branch]");
    if (forkLink) {
      event.preventDefault();
      event.stopPropagation();
      openForkBranch(forkLink.dataset.forkBranch);
      return;
    }
    const modelBadge = event.target.closest(".current-subtask .sub-agent-model.has-model");
    if (modelBadge) {
      event.preventDefault();
      event.stopPropagation();
      const row = modelBadge.closest(".current-subtask[data-subtask-id]");
      if (row) {
        selectCurrentSubtaskNote(row);
        if (agentTerminalOpen) renderAgentTerminal();
        else openAgentTerminal();
        AudioFX.categoryTap();
      }
      return;
    }
    const subName = event.target.closest(".current-subtask:not(.done) .sub-name");
    if (subName) {
      if (performance.now() < suppressSubtaskRenameUntil) {
        event.preventDefault();
        return;
      }
      const row = subName.closest(".current-subtask[data-subtask-id]");
      event.preventDefault();
      // A drag selection is for selecting/deleting rows, not for renaming.
      const textSelection = window.getSelection?.();
      if (textSelection && !textSelection.isCollapsed && textSelection.rangeCount) {
        // Keep the browser selection intact; Backspace will delete these rows.
        return;
      }
      // One click switches the note to this subtask and edits the name at the
      // exact character under the pointer; completed rows stay locked.
      selectCurrentSubtaskNote(row);
      startSubtaskRename(subName, event);
      return;
    }
    const subtaskRow = event.target.closest(".current-subtask[data-subtask-id]");
    if (subtaskRow) {
      selectCurrentSubtaskNote(subtaskRow);
      return;
    }
    const historySubtask = event.target.closest("[data-history-subtask-id]");
    if (historySubtask) {
      AudioFX.categoryTap();
      saveActiveNoteCaret();
      flushNoteSave();
      selectedHistoryId = historySubtask.dataset.historyTodoId || null;
      selectedSubtaskId = historySubtask.dataset.historySubtaskId || null;
      notesPreview = false;
      clearUnseenAgentSubtask(selectedSubtaskId);
      updateHistorySelection();
      updateSubtaskSelection();
      renderNotesPanel();
      return;
    }
    const historyRow = event.target.closest("[data-history-index]");
    if (historyRow) {
      AudioFX.categoryTap();
      saveActiveNoteCaret();
      flushNoteSave();
      historyCursor = Number(historyRow.dataset.historyIndex);
      selectedHistoryId = historyRow.dataset.todoId || null;
      selectedSubtaskId = null;
      notesPreview = false;
      updateHistoryCursor();
      updateHistorySelection();
      updateSubtaskSelection();
      renderNotesPanel();
      return;
    }
  });

  document.addEventListener("focusin", (event) => {
    const editor = event.target.closest?.("[data-note-block-editor]");
    if (editor) noteEditingBlock = Number(editor.dataset.noteBlockEditor);
  });

  document.addEventListener("input", (event) => {
    const typingTarget = event.target;
    const inputType = event.inputType || "";
    const isAgentComposer = typingTarget.id === "agent-input";
    if (isAgentComposer) {
      // AI typing owns the Tetris cues. Enter is handled in keydown, where it
      // sends the message; here only actual text edits should click.
      if (inputType !== "insertLineBreak" && inputType !== "insertParagraph" && inputType !== "insertFromPaste") {
        playTetrisKeySound(inputType);
      }
    } else if (typingTarget.matches("[data-note-block-editor], input[type=text], input[type=search], textarea, [contenteditable='true']")) {
      if (inputType !== "insertLineBreak" && inputType !== "insertParagraph" && inputType !== "insertFromPaste") {
        if (event.isComposing || inputType === "insertCompositionText") {
          playTypeSound();
        } else if (performance.now() - lastTypeSoundAt > 55) {
          playTypeSound();
        }
      }
    }
    if (event.target.matches("[data-plugin-search]")) {
      pluginCommunityQuery = event.target.value;
      updatePluginCommunityResults();
      return;
    }
    if (event.target.matches("[data-font-color]")) {
      const note = event.target.dataset.fontColor === "note";
      const value = fontHexColor(event.target.value);
      if (!value) return;
      settings[note ? "note_font_color" : "body_font_color"] = value;
      saveSettings();
      // A live swatch drag should repaint text without rebuilding the sheet
      // (which would steal focus from the open colour dialog).
      if (note) applyNoteTheme();
      else applyFontSettings();
      const hex = document.querySelector(`[data-font-color-hex="${note ? "note" : "body"}"]`);
      if (hex) hex.value = value;
      return;
    }
    if (event.target.id === "note-blur-range") {
      settings.note_blur = Math.min(40, Math.max(0, Math.round(Number(event.target.value) || 0)));
      saveSettings();
      applySettings();
      const label = $("#note-blur-value");
      // Focus doubles the shared radius to reach FocusWriter's 32px default,
      // so the readout shows the blur that is actually painted.
      const scale = settings.note_material === "focus" ? 2 : 1;
      if (label) label.textContent = `${settings.note_blur * scale} px`;
      return;
    }
    if (event.target.id === "wallpaper-blur-range") {
      // The readout is the number the reader asked for (0..100); CSS maps it to
      // a pixel radius so 100 is heavy frosted glass, not a 100px smear.
      settings.wallpaper_blur = Math.min(100, Math.max(0, Math.round(Number(event.target.value) || 0)));
      settings.wallpaper_blur_on = true;
      saveSettings();
      applySettings();
      const label = $("#wallpaper-blur-value");
      if (label) label.textContent = String(settings.wallpaper_blur);
      return;
    }
    if (event.target.matches("[data-custom-theme-color]")) {
      if (!customThemeDraft) customThemeDraft = defaultCustomThemeDraft();
      const key = event.target.dataset.customThemeColor;
      const value = String(event.target.value || "").toLowerCase();
      if (CUSTOM_THEME_COLOR_KEYS.includes(key) && /^#[0-9a-f]{6}$/.test(value)) {
        customThemeDraft[key] = value;
        updateCustomThemeDraftPreview();
      }
      return;
    }
    if (event.target.matches("[data-custom-theme-name]")) {
      if (!customThemeDraft) customThemeDraft = defaultCustomThemeDraft();
      customThemeDraft.name = String(event.target.value || "").slice(0, 60);
      return;
    }
    if (event.target.id === "page-line-color" || event.target.id === "page-line-hex") {
      const color = normalizeBaselineColorInput(event.target.value);
      if (!color) return;
      savePageLine({ color });
      // Only the paired field is refreshed; the field being typed in keeps its
      // caret even while the user enters shorthand (#abc).
      if (event.target.id === "page-line-color") {
        const hex = $("#page-line-hex");
        if (hex) hex.value = color;
      } else {
        const picker = $("#page-line-color");
        if (picker) picker.value = color;
      }
      syncPageLineSwatch(pageLine());
      return;
    }
    if (event.target.id === "page-line-opacity") {
      const opacity = Math.max(0, Math.min(1, Number(event.target.value) || 0));
      savePageLine({ opacity });
      const label = $("#page-line-opacity-value");
      if (label) label.textContent = `${Math.round(opacity * 100)}%`;
      syncPageLineSwatch(pageLine());
      return;
    }
    if (event.target.id === "page-line-row" || event.target.id === "page-line-thickness") {
      const isRow = event.target.id === "page-line-row";
      const value = Math.round(Number(event.target.value) || (isRow ? 40 : 1));
      savePageLine(isRow ? { row: value } : { thickness: value });
      const label = $(`#page-line-${isRow ? "row" : "thickness"}-value`);
      if (label) label.textContent = `${value} px`;
      syncPageLineSwatch(pageLine());
      return;
    }
    if (event.target.id === "baseline-color" || event.target.id === "baseline-color-hex") {
      const color = normalizeBaselineColorInput(event.target.value);
      if (!color) return;
      saveBaselineColor(color);
      // Update only the paired field. Rewriting the field being typed in would
      // expand "#abc" to "#aabbcc" mid-keystroke and steal the caret.
      if (event.target.id === "baseline-color") {
        const hex = $("#baseline-color-hex");
        if (hex) hex.value = color;
      } else {
        const picker = $("#baseline-color");
        if (picker) picker.value = color;
      }
      const sample = $(".baseline-live-sample");
      if (sample) sample.style.setProperty("--sample", color);
      return;
    }
    if (event.target.id === "baseline-row-color" || event.target.id === "baseline-row-color-hex"
      || event.target.id === "baseline-row-color2" || event.target.id === "baseline-row-color2-hex") {
      const color = normalizeBaselineColorInput(event.target.value);
      if (!color) return;
      const second = event.target.id.includes("color2");
      saveBaselineRowRule({ [second ? "color2" : "color"]: color });
      // Only the paired field is refreshed; the field being typed in keeps its
      // caret even when the user is entering shorthand (#abc).
      const pickerId = second ? "baseline-row-color2" : "baseline-row-color";
      const hexId = second ? "baseline-row-color2-hex" : "baseline-row-color-hex";
      if (event.target.id === pickerId) {
        const hex = $(`#${hexId}`);
        if (hex) hex.value = color;
      } else {
        const picker = $(`#${pickerId}`);
        if (picker) picker.value = color;
      }
      const live = event.target.closest(".caret-color-row")?.querySelector(".baseline-row-live-sample");
      if (live) live.style.setProperty("--sample", color);
      const preview = $(".baseline-row-preview");
      if (preview) preview.style.setProperty(second ? "--b" : "--a", color);
      return;
    }
    if (event.target.id === "baseline-row-angle") {
      const angle = Math.max(0, Math.min(180, Number(event.target.value) || 0));
      const label = $("#baseline-row-angle-value");
      if (label) label.textContent = `${angle}°`;
      const preview = $(".baseline-row-preview");
      if (preview) preview.style.setProperty("--angle", `${angle}deg`);
      saveBaselineRowRule({ angle });
      return;
    }
    if (event.target.id === "highlight-color" || event.target.id === "highlight-color-hex") {
      const color = normalizeHighlightColorInput(event.target.value);
      if (!color) return;
      settings.highlight = color;
      saveSettings();
      applyHighlight();
      // Update only the paired field; rewriting the field being typed in would
      // expand "#abc" to "#aabbcc" and steal the caret.
      syncHighlightFields(color, event.target.id === "highlight-color" ? "picker" : "hex");
      return;
    }
    if (event.target.id === "caret-color") {
      const color = /^#[0-9a-f]{6}$/i.test(event.target.value) ? event.target.value : "#1b1b1b";
      if (caretFieldMode === "ai") {
        settings[aiThemeIsDark() ? "ai_caret_dark" : "ai_caret_light"] = color;
      } else {
        settings.caret_color = color;
      }
      saveSettings();
      applySettings();
      const hex = $("#caret-color-hex");
      if (hex) hex.value = color;
      const sample = $(".caret-live-sample");
      if (sample) sample.style.setProperty("--sample", color);
      scheduleCustomCaret();
      return;
    }
    if (event.target.id === "ai-caret-dark" || event.target.id === "ai-caret-light") {
      const key = event.target.id === "ai-caret-dark" ? "ai_caret_dark" : "ai_caret_light";
      const fallback = key === "ai_caret_dark" ? "#f4f6f8" : "#1b1b1b";
      settings[key] = /^#[0-9a-f]{6}$/i.test(event.target.value) ? event.target.value : fallback;
      saveSettings();
      applySettings();
      scheduleCustomCaret();
      return;
    }
    if (event.target.id === "caret-color-hex") {
      const value = String(event.target.value || "").trim();
      const expanded = /^#[0-9a-f]{6}$/i.test(value) ? value
        : /^[0-9a-f]{6}$/i.test(value) ? `#${value}`
        : /^#[0-9a-f]{3}$/i.test(value) ? `#${value.slice(1).split("").map((c) => c + c).join("")}`
        : null;
      if (!expanded) return;
      const color = expanded.toLowerCase();
      if (caretFieldMode === "ai") {
        settings[aiThemeIsDark() ? "ai_caret_dark" : "ai_caret_light"] = color;
      } else {
        settings.caret_color = color;
      }
      saveSettings();
      applySettings();
      const colorInput = $("#caret-color");
      if (colorInput) colorInput.value = color;
      scheduleCustomCaret();
      return;
    }
    if (event.target.matches("[data-note-block-editor]")) {
      const active = activeNoteTarget();
      if (!active) return;
      const index = Number(event.target.dataset.noteBlockEditor);
      if (!noteBlocks[index]) return;
      const cleanValue = event.target.value.split(NOTE_ZERO_WIDTH).join("");
      noteBlocks[index].raw = cleanValue;
      syncNoteGhost(index, cleanValue);
      if (!event.target.value && !event.isComposing) {
        // Keep one invisible character so WebKit always has a line to paint the caret on.
        event.target.value = NOTE_ZERO_WIDTH;
        event.target.setSelectionRange(1, 1);
      }
      saveActiveNoteCaret();
      const text = serializeNoteBlocks();
      setTargetNote(active, text);
      scheduleNoteSave(active, text);
      autoSizeNoteBlock(event.target);
      return;
    }
  });

  document.addEventListener("focusout", (event) => {
    if (!event.target.matches("[data-note-block-editor]")) return;
    saveActiveNoteCaret();
    setTimeout(() => {
      if (document.activeElement?.matches("[data-note-block-editor]")) return;
      flushNoteSave();
    }, 80);
  });

  document.addEventListener("input", (event) => {
    if (event.target.matches("[data-ai-model-search]")) {
      aiModelQuery = event.target.value;
      const query = aiModelQuery.trim().toLowerCase();
      document.querySelectorAll("[data-ai-model-row]").forEach((row) => {
        row.hidden = Boolean(query) && !String(row.dataset.search || "").includes(query);
      });
      document.querySelectorAll(".ai-provider-block").forEach((block) => {
        const rows = [...block.querySelectorAll("[data-ai-model-row]")];
        block.hidden = rows.every((row) => row.hidden);
      });
      return;
    }
    if (event.target.matches("[data-ai-instructions]")) {
      const value = event.target.value;
      const counter = document.querySelector("[data-ai-instructions-count]");
      if (counter) counter.textContent = `${value.length} characters`;
      clearTimeout(aiInstructionsTimer);
      aiInstructionsTimer = setTimeout(() => {
        aiSaveConfig({ custom_instructions: value }, { rerender: false });
      }, 700);
      return;
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-font-color-hex]")) {
      const note = event.target.dataset.fontColorHex === "note";
      const color = normalizeBaselineColorInput(event.target.value);
      if (!color) {
        // Leave the stored/theme colour in place instead of pretending the
        // half-typed hex was saved.
        event.target.value = note
          ? fontHexColor(settings.note_font_color) || selectedNoteTheme()?.palette?.ink || "#2b2b2e"
          : fontHexColor(settings.body_font_color) || THEMES[currentPostcardId()]?.ink || "#332b2d";
        return;
      }
      settings[note ? "note_font_color" : "body_font_color"] = color;
      saveSettings();
      if (note) applyNoteTheme();
      else applyFontSettings();
      event.target.value = color;
      const picker = document.querySelector(`[data-font-color="${note ? "note" : "body"}"]`);
      if (picker) picker.value = color;
      return;
    }
    if (event.target.matches("[data-font-size]")) {
      const note = event.target.dataset.fontSize === "note";
      const raw = Math.round(Number(event.target.value));
      if (!Number.isFinite(raw) || !event.target.value) {
        event.target.value = String(note ? settings.note_font_size : settings.body_font_size);
        return;
      }
      if (note) settings.note_font_size = Math.min(28, Math.max(10, raw));
      else settings.body_font_size = Math.min(20, Math.max(14, raw));
      event.target.value = String(note ? settings.note_font_size : settings.body_font_size);
      saveSettings();
      applyFontSettings();
      return;
    }
    if (event.target.id === "page-line-color" || event.target.id === "page-line-hex") {
      const color = normalizeBaselineColorInput(event.target.value);
      if (!color) {
        event.target.value = pageLine().color;
        return;
      }
      savePageLine({ color }, { immediate: true });
      syncPageLineControls();
      return;
    }
    if (event.target.id === "page-line-opacity"
      || event.target.id === "page-line-row"
      || event.target.id === "page-line-thickness") {
      const line = pageLine();
      savePageLine(line, { immediate: true });
      syncPageLineControls();
      return;
    }
    if (event.target.id === "baseline-color" || event.target.id === "baseline-color-hex") {
      const color = normalizeBaselineColorInput(event.target.value);
      if (!color) {
        // Leave invalid text behind instead of pretending it was saved.
        const current = baselineColor();
        event.target.value = current;
        return;
      }
      saveBaselineColor(color, { immediate: true });
      const picker = $("#baseline-color");
      if (picker) picker.value = color;
      const hex = $("#baseline-color-hex");
      if (hex) hex.value = color;
      const sample = $(".baseline-live-sample");
      if (sample) sample.style.setProperty("--sample", color);
      return;
    }
    if (event.target.id === "baseline-row-color" || event.target.id === "baseline-row-color-hex"
      || event.target.id === "baseline-row-color2" || event.target.id === "baseline-row-color2-hex") {
      const color = normalizeBaselineColorInput(event.target.value);
      if (!color) {
        event.target.value = event.target.id.includes("color2")
          ? baselineRowRule().color2
          : baselineRowRule().color;
        return;
      }
      const second = event.target.id.includes("color2");
      saveBaselineRowRule({ [second ? "color2" : "color"]: color }, { immediate: true });
      syncBaselineRowControls();
      return;
    }
    if (event.target.id === "baseline-row-angle") {
      const angle = Math.max(0, Math.min(180, Number(event.target.value) || 0));
      saveBaselineRowRule({ angle }, { immediate: true });
      syncBaselineRowControls();
      return;
    }
    if (event.target.id === "highlight-color" || event.target.id === "highlight-color-hex") {
      const color = normalizeHighlightColorInput(event.target.value);
      if (!color) {
        // Leave invalid text behind instead of pretending it was saved.
        event.target.value = highlightColor() || bodyInkColor();
        return;
      }
      settings.highlight = color;
      saveSettings();
      applyHighlight();
      syncHighlightFields(color);
      return;
    }
    if (event.target.matches("[data-ai-field]")) {
      const field = event.target.dataset.aiField;
      const value = event.target.value;
      if (["default_model", "default_agent", "notification_sound"].includes(field)) {
        aiSaveConfig({ [field]: value }, { rerender: false });
      }
      return;
    }
    if (event.target.matches("[data-ai-agent-model]")) {
      const kind = event.target.dataset.aiAgentModel;
      const value = event.target.value;
      const agent_models = { ...(aiConfig?.agent_models || {}), [kind]: value };
      aiSaveConfig({ agent_models }, { rerender: false, message: value ? "Agent model updated" : "Agent follows the default model" });
      return;
    }
    if (event.target.matches("[data-custom-theme-color]")) {
      if (!customThemeDraft) customThemeDraft = defaultCustomThemeDraft();
      const key = event.target.dataset.customThemeColor;
      const value = String(event.target.value || "").toLowerCase();
      if (CUSTOM_THEME_COLOR_KEYS.includes(key) && /^#[0-9a-f]{6}$/.test(value)) {
        customThemeDraft[key] = value;
        updateCustomThemeDraftPreview();
      }
      return;
    }
    if (event.target.matches("[data-custom-theme-name]")) {
      if (!customThemeDraft) customThemeDraft = defaultCustomThemeDraft();
      customThemeDraft.name = String(event.target.value || "").slice(0, 60);
      return;
    }
    if (event.target.matches("[data-theme-pack-input]")) {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      importThemePackFile(file);
      return;
    }
    if (event.target.matches("[data-wallpaper-input]")) {
      uploadWallpaperFile(event.target);
      return;
    }
    if (event.target.matches("[data-sticker-input]")) {
      const id = event.target.dataset.stickerInput;
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      if (!availableStickerTargets().some((target) => target.id === id)) return;
      compressStickerImage(file).then((data) => {
        if (!data) { toast("Could not read that picture", true); return; }
        // The picture is the whole setting now; a fresh upload is centred
        // rather than inheriting an old crop from a previous build.
        settings.sticker_backgrounds[id] = { image: data, zoom: 1, x: 50, y: 50 };
        saveSettings();
        applyStickerBackgrounds();
        renderSettings();
        toast("Sticker picture updated");
      });
      return;
    }
    if (event.target.id === "note-bg-input") {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      compressBackgroundImage(file).then((data) => {
        if (!data) { toast("Could not read that image", true); return; }
        settings.note_background_image = data;
        settings.note_background = "__custom";
        saveSettings();
        applySettings();
        renderNotesPanel();
        renderSettings();
      });
      return;
    }
  });

  document.addEventListener("contextmenu", (event) => {
    // A text field owns its own clipboard menu, docked or detached. The AI
    // composer is a real textarea, so right-clicking it has to offer Cut /
    // Copy / Paste instead of the panel's window menu; the generic editor
    // menu below picks it up once the panel branches stand aside.
    const agentField = event.target.closest?.(
      "#agent-terminal input, #agent-terminal textarea, #agent-terminal [contenteditable='true']",
    );
    // A plain click on the napkin opens the folder in the desktop's own file
    // manager. The card that binds, copies or unlinks that folder stays one
    // right-click away so the feature never has to move into Settings.
    const folderTrigger = event.target.closest?.(".project-folder-trigger, .notes-icon-button");
    if (folderTrigger) {
      event.preventDefault();
      event.stopPropagation();
      openProjectFolderCard();
      return;
    }
    if (detachedMode && !agentField) {
      event.preventDefault();
      event.stopPropagation();
      openContextMenu(event.clientX, event.clientY, [
        {
          label: "Back to original window",
          icon: BACK_ICON,
          run: () => dockDetachedPanel(),
        },
      ], detachedMode === "ai" ? "agent" : "note");
      return;
    }
    const brand = event.target.closest("#nt-brand");
    if (brand) {
      event.preventDefault();
      event.stopPropagation();
      openContextMenu(event.clientX, event.clientY, [
        {
          label: "New Window",
          icon: NEW_WINDOW_ICON,
          run: () => openNewWindow(),
        },
      ]);
      return;
    }
    const panel = event.target.closest("#notes-half, #agent-terminal");
    if (panel && !detachedMode && !agentField) {
      event.preventDefault();
      event.stopPropagation();
      const kind = panel.id === "agent-terminal" ? "ai" : "note";
      const menuItems = [
        {
          label: "Open as new window",
          icon: NEW_WINDOW_ICON,
          run: () => openDetachedPanel(kind, false, false),
        },
      ];
      if (kind === "ai") {
        menuItems.push({
          label: "Clear conversation",
          icon: TRASH_ICON,
          danger: true,
          run: () => clearAgentConversation(),
        });
      }
      openContextMenu(event.clientX, event.clientY, menuItems, kind === "ai" ? "agent" : "note");
      return;
    }
    // The fan in front of a live subtask is its delete target: a right-click
    // removes the subtask instead of opening the row menu. Completed subtasks
    // are locked, so their fans fall through to the usual menu.
    const fan = event.target.closest(".current-subtask[data-subtask-id] .sub-fan");
    if (fan) {
      const row = fan.closest(".current-subtask[data-subtask-id]");
      if (row && !row.classList.contains("done")) {
        event.preventDefault();
        event.stopPropagation();
        closeContextMenu();
        deleteSubtaskRows([row]);
        return;
      }
    }
    // Subtasks own one menu everywhere: the row body and the inline rename
    // input both open Fork / Cut instead of the generic editor clipboard menu.
    const subtaskRow = event.target.closest(".current-subtask[data-subtask-id]");
    if (subtaskRow) {
      event.preventDefault();
      event.stopPropagation();
      const renameInput = event.target.closest(".sub-name-input");
      showCurrentSubtaskMenu(event.clientX, event.clientY, subtaskRow.dataset.subtaskId, renameInput);
      return;
    }
    const editable = event.target.closest("input, textarea, [contenteditable='true']");
    if (editable) {
      event.preventDefault();
      const selectionText = () => {
        try {
          return String(editable.value ?? "").slice(editable.selectionStart ?? 0, editable.selectionEnd ?? 0)
            || String(window.getSelection?.() || "");
        } catch (error) { return String(window.getSelection?.() || ""); }
      };
      const copyText = async (text) => {
        if (!text) return false;
        if (navigator.clipboard?.writeText) {
          try { await navigator.clipboard.writeText(text); return true; } catch (error) {}
        }
        try {
          const helper = document.createElement("textarea");
          helper.value = text;
          helper.style.cssText = "position:fixed;left:-9999px;top:0";
          document.body.appendChild(helper);
          helper.select();
          const ok = document.execCommand("copy");
          helper.remove();
          return Boolean(ok);
        } catch (error) {
          return false;
        }
      };
      const insertText = async (text) => {
        if (!text) return;
        editable.focus();
        if (typeof editable.setRangeText === "function") {
          const start = editable.selectionStart ?? editable.value.length;
          const end = editable.selectionEnd ?? start;
          editable.setRangeText(text, start, end, "end");
          editable.dispatchEvent(new Event("input", { bubbles: true }));
        } else {
          document.execCommand("insertText", false, text);
        }
      };
      const paste = async () => {
        try {
          if (navigator.clipboard?.readText) {
            const text = await navigator.clipboard.readText();
            await insertText(text);
            return;
          }
        } catch (error) {}
        document.execCommand("paste");
      };
      openContextMenu(event.clientX, event.clientY, [
        { label: "Cut", disabled: !selectionText(), run: () => { editable.focus(); document.execCommand("cut"); } },
        {
          label: "Copy",
          disabled: !selectionText(),
          run: async () => {
            await copyText(selectionText());
          },
        },
        { label: "Paste", run: paste },
        { label: "Select all", run: () => { editable.focus(); editable.select?.(); } },
      ]);
      return;
    }

    if (postcard || completedOpen || $("#modal-root").innerHTML) return;
    const historySub = event.target.closest("[data-history-subtask-id]");
    if (historySub) {
      event.preventDefault();
      showHistorySubtaskMenu(event.clientX, event.clientY, historySub.dataset.historyTodoId, historySub.dataset.historySubtaskId);
      return;
    }
    // The todo owns no right-click menu any more: its name is edited by
    // clicking it directly, so the old Rename/Edit-note box would only get in
    // the way. Swallow the event so the engine's menu cannot replace it.
    if (event.target.closest("[data-current-todo]")) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const historyRow = event.target.closest("[data-history-index]");
    if (historyRow) {
      event.preventDefault();
      showHistoryMenu(event.clientX, event.clientY, historyRow.dataset.historyIndex);
      return;
    }
    const categoryNode = event.target.closest("[data-category-id]");
    if (categoryNode) {
      event.preventDefault();
      showCategoryMenu(event.clientX, event.clientY, categoryNode.dataset.categoryId);
    }
  });

  let noteSwipeLastY = null;
  let noteSwipeCooldown = 0;
  document.addEventListener("pointermove", (event) => {
    if (notesStretchPress || notesStretchActive) { noteSwipeLastY = event.clientY; return; }
    // A Doing pull owns the pointer: measuring the swipe line here would force
    // a layout between the pull's frames, and the note cannot be swiped anyway.
    if (doingDrag) { noteSwipeLastY = event.clientY; return; }
    // A door-line drag already owns the pointer: letting the swipe rule fire
    // here would close the sheet in the middle of the pull.
    if (deskHandleResizing()) { noteSwipeLastY = event.clientY; return; }
    const now = performance.now();
    if (now < notesSwipeCooldownUntil) { noteSwipeLastY = event.clientY; return; }
    // Never measure the handle on every pointermove: that forced layout is
    // what made the swipe stutter. The cached line is refreshed on layout.
    if (!notesSwipeLine && performance.now() - notesSwipeLineAt > 250) {
      refreshNotesSwipeLine();
    }
    if (!notesSwipeLine) { noteSwipeLastY = event.clientY; return; }
    const lineY = notesSwipeLine.y;
    const inX = event.clientX >= notesSwipeLine.left - 36 && event.clientX <= notesSwipeLine.right + 36;
    const prevY = noteSwipeLastY;
    noteSwipeLastY = event.clientY;
    if (!inX || prevY === null || now < noteSwipeCooldown) return;
    // Opening only. A downward pass across the line used to close the sheet,
    // which meant a pointer travelling down into the note dismissed it; the
    // note now closes only on a click on its line.
    if (notesHidden && prevY > lineY + 2 && event.clientY < lineY - 2) {
      noteSwipeCooldown = now + 450;
      noteSwipeLastY = null;
      showNotesPanel();
    }
  }, { passive: true });

  const doingPeekSuppressed = () => Boolean(panelPreview)
    || document.body.classList.contains("panel-drag-mode")
    || document.body.classList.contains("agent-split-drag");

  // The note and the AI card are sheets in their own right. Their surface can
  // cover the column's hover strip (a stretched note rises over the task rows),
  // and a pointer inside them is busy with the reader's own work: scrolling,
  // selecting, clicking. Sliding across a sheet is not a swipe at the Doing
  // drawer, so the drawer must not slide out from under it.
  const doingSheetAt = (target) => Boolean(target?.closest?.("#notes-half, #agent-terminal"));

  const processDoingPointer = () => {
    if (!doingZone || doingPeekOpen || doingPeekSuppressed()) return;
    const { x, y } = doingPeekPoint;
    if (!pointInDoingZone(x, y) || doingSheetAt(doingPeekPoint.target)) {
      clearTimeout(doingPeekOpenTimer);
      doingPeekOpenTimer = 0;
      return;
    }
    if (!doingPeekOpenTimer) {
      doingPeekOpenTimer = setTimeout(() => {
        doingPeekOpenTimer = 0;
        if (doingPeekSuppressed()) return;
        if (!pointInDoingZone(doingPeekPoint.x, doingPeekPoint.y)) return;
        // The pointer may have settled on the note/AI card while the timer was
        // waiting: the sheet owns it now, so the drawer stays closed.
        if (doingSheetAt(doingPeekPoint.target)) return;
        openDoingPeek();
      }, 30);
    }
  };

  document.addEventListener("pointermove", (event) => {
    doingPeekPoint = { x: event.clientX, y: event.clientY, target: event.target };
    // A door-line drag owns the pointer and the frame budget: re-measuring the
    // Doing zone here (a full rect read every 350ms) would force a layout in
    // the middle of the pull, and a peek cannot open while resizing anyway.
    if (deskHandleResizing()) return;
    // The card is already open while it is being pulled: measuring its column
    // again would force that same layout on the drag's frames.
    if (doingDrag) return;
    // The pointer is on the note or the AI card: that sheet owns the gesture,
    // even where it lies over the strip, so the drawer stays put and the zone
    // is not even measured.
    if (doingSheetAt(event.target)) {
      clearTimeout(doingPeekOpenTimer);
      doingPeekOpenTimer = 0;
      return;
    }
    // In a detached AI window the scroll rail lives against the same window
    // border the sub-app drawer docks to; hovering the rail must not open the
    // card. The in-page trigger range (the subtask column) is left untouched.
    if (detachedMode && event.target.closest?.("#agent-scroll-rail, .agent-resize")) return;
    // The finished-subtasks card can lie under the same border strip. It is a
    // separate sheet, so crossing it still reaches the Doing drawer's trigger:
    // the drawer simply slides out above the finished card.
    if (!doingZone || performance.now() - doingZoneAt > 350) refreshDoingZone();
    if (!doingZone || doingPeekOpen || doingPeekSuppressed()) return;
    if (!pointInDoingZone(event.clientX, event.clientY)) {
      clearTimeout(doingPeekOpenTimer);
      doingPeekOpenTimer = 0;
      return;
    }
    if (doingPointerFrame) return;
    doingPointerFrame = requestAnimationFrame(() => {
      doingPointerFrame = 0;
      processDoingPointer();
    });
  }, { passive: true });

  window.addEventListener("resize", () => {
    refreshDoingZone();
    refreshNotesSwipeLine();
    if (doingPeekOpen) positionDoingPeek();
    refreshDefaultSheetHeight();
    updateAgentSplitLayout();
    positionAgentScrollRail();
    if (agentModelMenuOpen || agentModeMenuOpen) positionAgentMenus();
  });

  document.addEventListener("pointerdown", (event) => {
    // The whole card is its grab bar: a sideways pull lifts the drawer and
    // drops it on the subtask column's other border. A plain click, a row
    // press or a vertical gesture is left untouched.
    if (event.target.closest?.("#doing-peek")) beginDoingPress(event);
  });
  // A pull is not a click: never open the row that happened to be under it.
  document.addEventListener("click", (event) => {
    if (performance.now() < doingDragClickUntil && event.target.closest?.("#doing-peek")) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
  // Leaving the window mid-pull restores the card instead of leaving it afloat.
  window.addEventListener("blur", () => {
    endDoingPress();
    if (doingDrag) endDoingDrag(false);
  });

  document.addEventListener("pointerdown", (event) => {
    const folderTrigger = event.target.closest?.(".project-folder-trigger");
    if (folderTrigger) {
      folderTrigger.classList.remove("banner-pop");
      void folderTrigger.offsetWidth;
      folderTrigger.classList.add("banner-pop");
      setTimeout(() => folderTrigger.classList.remove("banner-pop"), 380);
    }
    const handle = event.target.closest?.("[data-agent-resize]");
    if (!handle) return;
    const panel = handle.closest("#agent-terminal");
    const body = panel?.parentElement;
    if (!panel || !body) return;
    event.preventDefault();
    const bodyRect = body.getBoundingClientRect();
    const startY = event.clientY;
    const startHeight = panel.getBoundingClientRect().height;
    try { handle.setPointerCapture?.(event.pointerId); } catch (error) {}
    const move = (moveEvent) => {
      const height = Math.max(220, Math.min(bodyRect.height - 70, startHeight + (startY - moveEvent.clientY)));
      sheetHeightCustom = true;
      document.documentElement.style.setProperty("--agent-terminal-height", `${Math.round(height)}px`);
      updateAgentSplitLayout();
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      // A deliberate height is part of the workspace shape; remember it now so
      // quitting right after the resize still restores this page.
      saveViewState();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  }, { passive: false });

  document.addEventListener("input", (event) => {
    if (event.target.matches("[data-settings-volume]")) {
      const value = Number(event.target.value) || 0;
      AudioFX.setVolume(value / 100);
      BackgroundMusic.applyVolume();
      const label = document.querySelector("#sound-volume-value");
      if (label) label.textContent = `${Math.round(value)}%`;
      return;
    }
    if (event.target.id === "agent-input") {
      const input = event.target;
      resizeAgentInput(input);
      saveAgentDraft(agentInputAgentId || activeAgent().id, input.value);
    }
  });

  document.addEventListener("click", (event) => {
    if (noteMaterialMenuOpen && !event.target.closest?.(".note-material-picker")) {
      noteMaterialMenuOpen = false;
      if (settingsTab === "theme") renderSettings();
    }
    if (agentModelMenuOpen || agentModeMenuOpen) {
      agentModelMenuOpen = false;
      agentModeMenuOpen = false;
      renderAgentTerminal();
    }
  });

  let deskStripHovered = false;
  document.addEventListener("pointermove", (event) => {
    // A Doing pull owns the pointer: toggling the door-line hover would
    // re-match body-wide styles in the middle of the drag.
    if (doingDrag) return;
    const latched = document.body.classList.contains("desk-handle-strip-drag")
      || document.body.classList.contains("desk-handle-strip-latch");
    const stripHovered = event.clientY >= window.innerHeight - 36 || latched;
    if (stripHovered !== deskStripHovered) {
      deskStripHovered = stripHovered;
      // A plain flag: no stylesheet reads it, and a class on <body> re-matches
      // every `body.x ...` rule. Pulling a closed door starts in this strip and
      // leaves it a few pixels later, so the toggle used to land in the middle
      // of the drag.
      setDeskStripHover(stripHovered);
      // The gesture owns the lines while a sheet is being resized; the tuck
      // state of the other line comes back on release.
      if (!deskHandleResizing()) positionDeskHandles();
    }
  }, { passive: true });

  // The pointer leaving the window is not a pointermove, so the strip latch
  // would stay on and a closed line would hover above the border with nobody
  // near it. Clearing it hands the line back under the border.
  document.documentElement.addEventListener("mouseleave", () => {
    if (!deskStripHovered) return;
    deskStripHovered = false;
    setDeskStripHover(false);
    if (!deskHandleResizing()) positionDeskHandles();
  });

  let panelLongPress = null;
  let panelLongPressSuppress = 0;
  document.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || panelLongPress) return;
    const panel = event.target.closest?.("#agent-terminal, #notes-half");
    if (!panel) return;
    const kind = panel.id === "agent-terminal" ? "ai" : "note";
    const open = kind === "ai" ? agentTerminalOpen : !notesHidden;
    if (!open) return;
    if (event.target.closest?.("button, a, input, textarea, select, .agent-compose, .note-block, .note-block-editor, .notes-resize-handle, .desk-handle, .notes-handle, .detached-grabber")) return;
    const startX = event.screenX;
    const startY = event.screenY;
    const viewX = event.clientX;
    const viewY = event.clientY;
    const state = { kind, panel, startX, startY, pointerId: event.pointerId, activated: false, cancelled: false, x: viewX, y: viewY };
    const timer = setTimeout(() => {
      if (state.cancelled || !state.panel.isConnected) return;
      state.activated = true;
      panelLongPressSuppress = performance.now() + 1200;
      if (detachedMode) {
        nativeWindowCommand("move", startX, startY);
      } else {
        try { document.getSelection()?.removeAllRanges(); } catch (error) {}
        startPanelPreview(state.kind, state.panel, state.x, state.y);
      }
    }, 520);
    state.timer = timer;
    panelLongPress = state;
  }, { passive: true });

  document.addEventListener("pointermove", (event) => {
    if (panelPreview) {
      updatePanelPreview(event.clientX, event.clientY);
      return;
    }
    if (!panelLongPress || panelLongPress.activated) return;
    if (Math.hypot(event.screenX - panelLongPress.startX, event.screenY - panelLongPress.startY) > 9) {
      panelLongPress.cancelled = true;
      clearTimeout(panelLongPress.timer);
      panelLongPress = null;
    }
  }, { passive: true });

  const finishPanelLongPress = (confirmDrop = false) => {
    const state = panelLongPress;
    panelLongPress = null;
    if (state) clearTimeout(state.timer);
    if (panelPreview) {
      endPanelPreview(confirmDrop);
      panelLongPressSuppress = performance.now() + 400;
      return;
    }
    if (!state || state.cancelled) return;
  };

  document.addEventListener("pointerup", () => {
    finishPanelLongPress(true);
  }, { passive: true });

  document.addEventListener("pointercancel", () => {
    finishPanelLongPress(false);
  }, { passive: true });

  document.addEventListener("click", (event) => {
    if (performance.now() < panelLongPressSuppress) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  window.addEventListener("pagehide", () => { flushSettingsSave(); persistAgentDrafts(); saveViewState(); });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") { flushSettingsSave(); persistAgentDrafts(); saveViewState(); }
    else {
      AudioFX.wake();
      refreshAgentFinishViews();
    }
  });
  window.addEventListener("focus", () => {
    AudioFX.wake();
    refreshAgentFinishViews();
  });
  window.addEventListener("storage", (event) => {
    refreshAgentFinishViews();
    // One drawer, many windows: dragging it to the other border in the room
    // also settles the same card on that border in a detached note/AI window.
    if (event.key === DOING_DOCK_SIDE_KEY && event.newValue
      && (event.newValue === "left" || event.newValue === "right")
      && event.newValue !== doingDockSide) {
      setDoingDockSide(event.newValue);
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id === "agent-compose") {
      event.preventDefault();
      sendAgentMessage();
    }
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey && event.key.toLowerCase() === "p") {
      if (agentTerminalOpen) {
        event.preventDefault();
        cycleAgentModel();
        return;
      }
    }
    if (event.target.id === "agent-input") {
      if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        sendAgentMessage();
        return;
      }
    }
    if (event.key === "Escape" && doingPeekOpen) {
      event.preventDefault();
      closeDoingPeek();
      return;
    }
    // Esc interrupts the running agent from anywhere in the window, not just
    // while the compose box has focus. Higher-priority overlays keep Esc.
    if (event.key === "Escape" && agentTerminalOpen) {
      const overlayOpen = Boolean(
        $(".settings-stage") || archiveOpen || trashOpen || postcard || completedOpen
        || $("#modal-root").innerHTML
      );
      if (!overlayOpen) {
        const agent = activeAgent();
        if (agent && agentBusyIds.has(agent.id)) {
          event.preventDefault();
          interruptAgent();
          return;
        }
        if (event.target.id === "agent-input") {
          event.preventDefault();
          closeAgentTerminal();
          return;
        }
      }
    }
    const typing = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if (event.target.id === "new-todo-title" && event.key === "Enter") {
      event.preventDefault();
      const title = event.target.value.trim();
      if (!title) return;
      confirmDialog({
        kicker: "New todo",
        title: `Are you sure to do “${title}”?`,
        confirmLabel: "To Do",
      }).then((ok) => {
        if (!ok) {
          const input = $("#new-todo-title");
          if (input) { input.value = title; input.focus(); }
          return;
        }
        AudioFX.confirmCarriage();
        startNewTask(title);
      });
      return;
    }
    if (event.target.id === "subtask-name-input" && !event.isComposing) {
      if (event.key === "Backspace" && event.target.value === "" && event.target.selectionStart === 0) {
        event.preventDefault();
        const row = event.target.closest("[data-add-subtask-row]");
        event.target.disabled = true;
        event.target.blur();
        addingSubtask = false;
        addingSubtaskTodoId = null;
        vanishSubtaskRow(row, () => {
          renderStage();
        });
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const name = event.target.value.trim();
        const todoId = addingSubtaskTodoId;
        if (name && todoId) {
          addingSubtask = false;
          addingSubtaskTodoId = null;
          AudioFX.mechanical();
          action("add_subtask", { todo_id: todoId, name });
        } else if (!name) {
          const row = event.target.closest("[data-add-subtask-row]");
          event.target.disabled = true;
          event.target.blur();
          addingSubtask = false;
          addingSubtaskTodoId = null;
          vanishSubtaskRow(row, () => {
            renderStage();
          });
        }
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        addingSubtask = false;
        addingSubtaskTodoId = null;
        renderStage();
        return;
      }
    }
    if (event.key === "Escape" && $(".community-stage")) {
      event.preventDefault();
      closeCommunity();
      return;
    }
    if (event.key === "Escape" && $(".ai-settings-stage")) {
      event.preventDefault();
      closeAiSettings();
      return;
    }
    if (event.key === "Escape" && $(".settings-stage")) {
      event.preventDefault();
      closeSettings();
      return;
    }
    if (event.target.matches?.("[data-note-block-editor]") && !event.isComposing) {
      const editor = event.target;
      const index = Number(editor.dataset.noteBlockEditor);
      const atNoteStart = editor.selectionStart === 0
        || (editor.value === NOTE_ZERO_WIDTH && editor.selectionStart === 1 && editor.selectionEnd === 1);
      if (event.key === "Backspace" && atNoteStart && editor.selectionEnd === editor.selectionStart
        && mergeNoteBlockWithPrevious(index)) {
        event.preventDefault();
        return;
      }
      if (event.key === "Delete" && editor.selectionStart === editor.value.length && editor.selectionEnd === editor.value.length
        && mergeNoteBlockWithNext(index)) {
        event.preventDefault();
        return;
      }
      // Like a real text editor: arrows move by visual line inside the block;
      // at the first/last visual line they continue into the neighbouring
      // block at the same horizontal column (FocusWriter/QTextCursor style).
      const start = editor.selectionStart ?? 0;
      const end = editor.selectionEnd ?? 0;
      if (start === end && !event.shiftKey) {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          const point = noteCaretPoint(editor, start);
          const up = event.key === "ArrowUp";
          const hasTarget = up ? index > 0 : index < noteBlocks.length - 1;
          if (hasTarget && (up ? point.first : point.last)) {
            const targetIndex = up ? index - 1 : index + 1;
            const targetText = String(noteBlocks[targetIndex]?.raw || "");
            const target = noteIndexAtColumn(editor, targetText, point.x, up ? "last" : "first");
            event.preventDefault();
            activateNoteBlock(targetIndex, null, target);
            return;
          }
        }
        if (event.key === "ArrowLeft" && start === 0 && index > 0) {
          event.preventDefault();
          activateNoteBlock(index - 1, null, null);
          return;
        }
        if (event.key === "ArrowRight" && start === editor.value.length && index < noteBlocks.length - 1) {
          event.preventDefault();
          activateNoteBlock(index + 1, null, 0);
          return;
        }
      }
    }
    if (event.target.matches?.("[data-note-block-editor]") && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const active = activeNoteTarget();
      if (!active) return;
      const index = Number(event.target.dataset.noteBlockEditor);
      const editor = event.target;
      const cursor = editor.selectionStart ?? editor.value.length;
      const before = editor.value.slice(0, cursor);
      const after = editor.value.slice(cursor);
      noteBlocks[index].raw = before;
      noteBlocks.splice(index + 1, 0, { raw: after });
      noteEditingBlock = index + 1;
      const text = serializeNoteBlocks();
      setTargetNote(active, text);
      scheduleNoteSave(active, text);
      // Keep the current editor as a textarea and add the new line below it,
      // so the current line does not change its rendered form while scrolling.
      editor.value = before;
      editor.style.height = "auto";
      editor.style.height = `${Math.max(32, editor.scrollHeight)}px`;
      const nextEditor = document.createElement("textarea");
      nextEditor.className = "note-block-editor";
      nextEditor.dataset.noteBlockEditor = String(index + 1);
      nextEditor.spellcheck = false;
      nextEditor.value = after || NOTE_ZERO_WIDTH;
      editor.insertAdjacentElement("afterend", nextEditor);
      document.querySelectorAll("#note-live > .note-block, #note-live > .note-block-editor").forEach((node, i) => {
        if (node.classList.contains("note-block-editor")) node.dataset.noteBlockEditor = String(i);
        else node.dataset.noteBlock = String(i);
      });
      AudioFX.carriage();
      focusNoteBlock(index + 1);
      return;
    }
    if (event.key === "Tab" && !postcard && !completedOpen && !$("#modal-root").innerHTML) {
      event.preventDefault();
      const indexNode = $(".index");
      const collapsing = !document.body.classList.contains("categories-collapsed");
      const indexRect = indexNode?.getBoundingClientRect();
      if (indexRect && !collapsing) indexOpenWidth = indexRect.width;
      const bodyNode = $(".page-body");
      const bodyRect = bodyNode?.getBoundingClientRect();
      const currentCenter = bodyRect ? bodyRect.left + bodyRect.width / 2 : null;
      const currentIndexWidth = indexRect?.width || 0;
      const targetIndexWidth = collapsing ? 0 : indexOpenWidth;
      document.body.classList.toggle("categories-collapsed");
      // Let positionDeskHandles own both lines; setting one line by hand left
      // the other stale and briefly painted a grey bar near the top-left.
      positionDeskHandles();
      followPageLayout(420);
      AudioFX.drawer(!document.body.classList.contains("categories-collapsed"));
      setTimeout(() => {
        positionNotesHandle();
        refreshNotesSwipeLine();
        if (!doingPeekOpen) refreshDoingZone();
      }, 60);
      setStatus(document.body.classList.contains("categories-collapsed") ? "Categories hidden" : "Categories shown");
      return;
    }
    if (event.key === "Escape" && openPluginId) {
      event.preventDefault();
      closePluginPanel();
      return;
    }
    if (event.key === "Escape" && archiveOpen) {
      event.preventDefault();
      closeArchive();
      return;
    }
    if (event.key === "Escape" && trashOpen) {
      event.preventDefault();
      closeTrashDrawer();
      return;
    }
    if (typing && event.target.id !== "agent-input"
      && !event.isComposing && !event.ctrlKey && !event.metaKey && !event.altKey
      && (event.key.length === 1 || event.key === "Backspace" || event.key === "Enter")) {
      playTypeSound();
    }
    if (typing) return;
    if (event.key === "Escape") {
      if ($(".project-folder-stage")) { closeProjectFolderCard(); return; }
      if (contextMenuOpen) { closeContextMenu(); return; }
      if (postcard) { closePostcard(); return; }
      if (completedOpen) { closeCompletedLog(); return; }
      if ($("#modal-root").innerHTML) { cancelModal(null); return; }
      if (archiveOpen) { closeArchive(); return; }
      if (completedSubtasksOpen && $(".completed-subtask-toggle")) { toggleCompletedSubtasks(false); return; }
      if (pendingSubtasksCollapsed && $(".pending-subtask-toggle")) { togglePendingSubtasks(false); return; }
    }
    if (postcard) {
      if (event.key === "q") { closePostcard(); return; }
      if (event.key === "ArrowLeft") { postcardNav(-1); return; }
      if (event.key === "ArrowRight") { postcardNav(1); return; }
      return;
    }
    if (completedOpen) {
      if (event.key === "q") { closeCompletedLog(); return; }
      return;
    }
    if ($("#modal-root").innerHTML) return;
    // The category index owns j/k and the arrow keys whenever the pointer or
    // the focus sits there, so the list moves like a vim buffer instead of
    // scrolling the completed reel.
    if (categoriesActive() && (event.key === "j" || event.key === "ArrowDown")) {
      if (moveCategoryCursor(1)) {
        event.preventDefault();
        return;
      }
    }
    if (categoriesActive() && (event.key === "k" || event.key === "ArrowUp")) {
      if (moveCategoryCursor(-1)) {
        event.preventDefault();
        return;
      }
    }
    if (event.key === "ArrowDown" || event.key === "j") {
      event.preventDefault();
      scrollHistory(1);
      return;
    }
    if (event.key === "ArrowUp" || event.key === "k") {
      event.preventDefault();
      scrollHistory(-1);
    }
  });

  document.addEventListener("wheel", (event) => {
    if (postcard || completedOpen || $("#modal-root").innerHTML) return;
    if (contextMenuOpen) closeContextMenu();
    // The AI conversation owns its own scroll; never send its wheel to history.
    if (event.target.closest("#agent-terminal")) return;
    const overNotes = event.target.closest("#notes-half, .note-editor, [data-note-block-editor]");
    const overHistory = event.target.closest("#history-reel, .history-half");
    const overEmptyPage = event.target.closest(".page-body") && !event.target.closest(".current-half");
    if (overNotes || (!overHistory && !overEmptyPage)) return;
    event.preventDefault();
    if (event.deltaY === 0) return;
    AudioFX.unlock();
    scrollHistory(event.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  document.addEventListener("wheel", (event) => {
    if (event.target.closest("#notes-half, .completed-sheet, #completed-log-list, #archive-drawer")) {
      AudioFX.unlock();
      AudioFX.pageTurn();
    }
  }, { passive: true });

  document.addEventListener("wheel", (event) => {
    if (!event.target.closest("#notes-half")) return;
    const scroller = $("#note-live");
    if (!scroller) return;
    const before = scroller.scrollTop;
    scroller.scrollTop += event.deltaY;
    if (scroller.scrollTop !== before) {
      event.preventDefault();
      AudioFX.unlock();
      AudioFX.pageTurn();
    }
  }, { passive: false });

  document.addEventListener("pointerdown", (event) => {
    if (!trashOpen) return;
    if (event.target.closest?.("#trash-drawer, [data-action='open-trash']")) return;
    closeTrashDrawer();
  }, { capture: true });

  $("#archive-top")?.addEventListener("click", () => {
    const tree = $("#archive-tree");
    if (!tree) return;
    try { tree.scrollTo({ top: 0, behavior: "smooth" }); } catch (error) {}
    setTimeout(() => { tree.scrollTop = 0; }, 360);
  });

  $("#archive-backdrop")?.addEventListener("mousedown", () => {
    if (archiveOpen) {
      AudioFX.categoryTap();
      closeArchive();
    }
  });

  const reveal = $("#notes-reveal");
  if (reveal) {
    reveal.addEventListener("pointerenter", showNotesPanel);
    reveal.addEventListener("click", showNotesPanel);
  }

  document.addEventListener("mousemove", (event) => {
    // A Doing pull owns the pointer: the left rail must not open (and re-match
    // body-wide styles) just because the card was pulled against the edge.
    if (doingDrag) return;
    const open = document.body.classList.contains("tools-open");
    if (event.clientX <= 24) {
      if (!open) document.body.classList.add("tools-open");
    } else if (event.clientX > 90 && open) {
      document.body.classList.remove("tools-open");
    }
  });

  // Touch shells have no hover. A tap on the left or top edge reveals the
  // hidden tool rail and utility bar, and a tap further inside dismisses them.
  if (window.NeoTodoAndroid) {
    document.addEventListener("pointerdown", (event) => {
      const topTools = $("#top-tools");
      if (event.clientX <= 36) {
        document.body.classList.add("tools-open");
      } else if (event.clientX > 110) {
        document.body.classList.remove("tools-open");
      }
      if (event.clientY <= 36) {
        topTools?.classList.add("top-open");
      } else if (event.clientY > 96) {
        topTools?.classList.remove("top-open");
      }
    }, true);
  }

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.data?.type === "neotodo-plugin-close") closePluginPanel();
    if (event.data?.type === "neotodo-forktree-open") {
      openForkTreeTarget(event.data.target || {});
      return;
    }
    if (event.data?.type === "neotodo-fork-open-window" && event.data.branchId) {
      openForkBranch(String(event.data.branchId));
      return;
    }
    if (event.data?.type === "neotodo-fork-open-url" && event.data.url) {
      if (openPluginId) closePluginPanel();
      openNeoTodoWindow(String(event.data.url));
      return;
    }
    if (event.data?.type === "neotodo-pomodoro-start") {
      closePluginPanel();
      openFocusTimer();
      return;
    }
    if (event.data?.type === "neotodo-plugin-settings-changed" && event.data.plugin) {
      const state = pluginState(String(event.data.plugin));
      const values = event.data.settings;
      if (!state || !values || typeof values !== "object") return;
      let changed = false;
      for (const [key, value] of Object.entries(values)) {
        // Choices are strings and sliders are numbers; the old handler only
        // kept booleans, so a choice posted by a plugin page was dropped.
        const keep = typeof value === "boolean"
          || (typeof value === "string" && value.length <= 200)
          || (typeof value === "number" && Number.isFinite(value));
        if (!keep || state.settings[key] === value) continue;
        state.settings[key] = value;
        changed = true;
      }
      if (changed) {
        saveSettings();
        notifyPluginSettings();
      }
    }
  });

  const animateCategoryReorder = (list, beforeTops) => {
    list.querySelectorAll(".category-item[data-category-id]").forEach((row) => {
      if (row.classList.contains("dragging")) return;
      const before = beforeTops.get(row);
      if (before == null) return;
      const after = row.getBoundingClientRect().top;
      const delta = before - after;
      if (Math.abs(delta) < 0.5) return;
      row.classList.add("category-flip");
      row.style.transition = "none";
      row.style.transform = `translateY(${delta}px)`;
      row.getBoundingClientRect();
      row.style.transition = "transform 0.22s cubic-bezier(0.22, 0.8, 0.24, 1)";
      row.style.transform = "";
      clearTimeout(row._categoryFlipTimer);
      row._categoryFlipTimer = setTimeout(() => {
        row.classList.remove("category-flip");
        row.style.transition = "";
        row.style.transform = "";
        row._categoryFlipTimer = 0;
      }, 280);
    });
  };

  document.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    const item = event.target.closest?.(".category-item[data-category-id]");
    if (!item || event.target.closest(".cat-delete, .plus-button")) return;
    const startY = event.clientY;
    const pointerId = event.pointerId;
    const timer = setTimeout(() => {
      if (!categoryDrag || categoryDrag.item !== item || !item.isConnected) return;
      categoryDrag.pending = false;
      categoryDrag.armed = true;
      categoryDrag.timer = 0;
    }, 280);
    categoryDrag = { pending: true, armed: false, active: false, item, startY, pointerId, list: item.parentElement, timer };
  }, { capture: true });

  document.addEventListener("pointermove", (event) => {
    if (!categoryDrag) return;
    if (categoryDrag.pending) {
      if (Math.abs(event.clientY - categoryDrag.startY) <= 6) return;
      clearTimeout(categoryDrag.timer);
      categoryDrag = null;
      return;
    }
    if (event.pointerId !== categoryDrag.pointerId) return;
    if (categoryDrag.armed) {
      if (Math.abs(event.clientY - categoryDrag.startY) <= 4) return;
      categoryDrag.armed = false;
      categoryDrag.active = true;
      categoryDrag.item.classList.add("dragging");
      document.body.classList.add("category-dragging");
      if (categoryDrag.list) categoryDrag.list.style.userSelect = "none";
    }
    if (!categoryDrag.active) return;
    event.preventDefault();
    const list = categoryDrag.list;
    if (!list) return;
    const rows = [...list.querySelectorAll(".category-item[data-category-id]")].filter((row) => row !== categoryDrag.item);
    const next = rows.find((row) => {
      const rect = row.getBoundingClientRect();
      return event.clientY < rect.top + rect.height / 2;
    });
    const unchanged = next ? categoryDrag.item.nextElementSibling === next : categoryDrag.item === list.lastElementChild;
    if (unchanged) return;
    const beforeTops = new Map(
      [...list.querySelectorAll(".category-item[data-category-id]")]
        .map((row) => [row, row.getBoundingClientRect().top])
    );
    if (next) list.insertBefore(categoryDrag.item, next);
    else list.appendChild(categoryDrag.item);
    animateCategoryReorder(list, beforeTops);
  }, { passive: false });

  const endCategoryDrag = () => {
    if (!categoryDrag) return;
    if (categoryDrag.pending) {
      clearTimeout(categoryDrag.timer);
      categoryDrag = null;
      return;
    }
    if (categoryDrag.armed) {
      categoryDrag = null;
      return;
    }
    if (!categoryDrag.active) { categoryDrag = null; return; }
    const { item, list } = categoryDrag;
    categoryDrag = null;
    if (item) item.classList.remove("dragging");
    document.body.classList.remove("category-dragging");
    if (list) {
      list.style.userSelect = "";
      list.querySelectorAll(".category-item").forEach((row) => {
        if (row.classList.contains("dragging")) return;
        clearTimeout(row._categoryFlipTimer);
        row._categoryFlipTimer = 0;
        row.classList.remove("category-flip");
        row.style.transition = "";
        row.style.transform = "";
      });
    }
    if (!list) return;
    let ids = [...list.querySelectorAll(".category-item[data-category-id]")].map((row) => row.dataset.categoryId);
    const allIds = state.data.categories.map((category) => category.id);
    if (ids.length !== allIds.length) {
      // The index can show a slice (a fork window, or hidden legacy boards);
      // splice the visible rows back into the hidden positions before saving.
      const visible = new Set(ids);
      let cursor = 0;
      ids = allIds.map((id) => (visible.has(id) ? ids[cursor++] : id));
    }
    suppressCategoryClickUntil = performance.now() + 320;
    action("reorder_categories", { ids });
  };
  document.addEventListener("pointerup", endCategoryDrag);
  document.addEventListener("pointercancel", endCategoryDrag);

  document.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    const subtaskArea = event.target.closest?.(".current-subtask[data-subtask-id], .history-subtask[data-history-subtask-id]");
    if (!subtaskArea) return;
    // Caret ownership is exclusive: touching the subtask area takes it out of
    // the note. The note only becomes editable again after a click on the note.
    const active = document.activeElement;
    if (active?.matches?.("[data-note-block-editor]")) active.blur();
    const span = event.target.closest?.(".current-subtask .sub-name, .history-subtask .h-sub-name");
    if (!span) return;
    subtaskDragStart = { x: event.clientX, y: event.clientY };
  }, { capture: true });

  document.addEventListener("pointerup", (event) => {
    if (!subtaskDragStart) return;
    const dx = event.clientX - subtaskDragStart.x;
    const dy = event.clientY - subtaskDragStart.y;
    subtaskDragStart = null;
    if (Math.hypot(dx, dy) > 4) {
      // A real drag is a text selection: never replace it with the rename input,
      // and never pull focus back into the note. The note is only editable after
      // an explicit click inside the note area.
      suppressSubtaskRenameUntil = performance.now() + 320;
    }
  }, { capture: true });

  document.addEventListener("keydown", (event) => {
    if ((event.key !== "Backspace" && event.key !== "Delete") || event.isComposing) return;
    if ($("#modal-root")?.innerHTML) return;
    const selection = window.getSelection?.();
    if (!selection || selection.isCollapsed || !selection.rangeCount) return;
    if (!selectionTouchesSubtaskNames(selection)) return;
    event.preventDefault();
    event.stopPropagation();
    deleteSelectedSubtasks(selection);
  }, { capture: true });

  const primeAudio = () => {
    AudioFX.unlock();
    BackgroundMusic.start();
  };
  // Keep priming on every gesture: a wheel is enough to resume the audio
  // context in some WebKit builds, but it is not a pointerdown, so the old
  // once-only listeners left the first scroll silent.
  document.addEventListener("pointerdown", primeAudio, { capture: true });
  document.addEventListener("keydown", primeAudio, { capture: true });
  document.addEventListener("wheel", primeAudio, { capture: true, passive: true });
  document.addEventListener("touchstart", primeAudio, { capture: true, passive: true });
  setupCustomCaret();

  const soundPanel = $("#sound-panel");
  $("#sound-toggle")?.addEventListener("click", (event) => {
    event.stopPropagation();
    AudioFX.toggle();
    updateSoundToggle();
  });
  $("#sound-toggle")?.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    openSoundPanel();
  });
  soundPanel?.addEventListener("click", (event) => {
    if (event.target === soundPanel || event.target.closest("[data-sound-close]")) {
      closeSoundPanel();
      return;
    }
    if (event.target.closest("[data-sound-toggle]")) {
      AudioFX.toggle();
      updateSoundToggle();
      renderSoundPanel();
      return;
    }
    if (event.target.closest("[data-bgm-toggle]")) {
      BackgroundMusic.toggle();
      updateSoundToggle();
      renderSoundPanel();
      return;
    }
    const play = event.target.closest("[data-sound-play]");
    if (play) {
      AudioFX.unlock();
      AudioFX.audition(play.dataset.soundPlay);
    }
  });
  soundPanel?.addEventListener("input", (event) => {
    if (!event.target.matches("[data-sound-volume]")) return;
    const value = Number(event.target.value) || 0;
    AudioFX.setVolume(value / 100);
    BackgroundMusic.applyVolume();
    const label = soundPanel.querySelector(".sound-volume-value");
    if (label) label.textContent = `${Math.round(value)}%`;
  });
  document.addEventListener("pointerdown", (event) => {
    if (!soundPanel || soundPanel.hidden) return;
    if (event.target.closest("#sound-panel, #sound-toggle")) return;
    closeSoundPanel();
  }, true);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && soundPanel && !soundPanel.hidden) closeSoundPanel();
  });
  window.addEventListener("resize", () => {
    if (soundPanel && !soundPanel.hidden) positionSoundPanel();
  });
}

function updateSoundToggle() {
  BackgroundMusic.sync();
  const button = $("#sound-toggle");
  if (!button) return;
  button.classList.toggle("muted", AudioFX.muted);
  button.setAttribute("aria-pressed", String(!AudioFX.muted));
  const panel = $("#sound-panel");
  if (panel && !panel.hidden) renderSoundPanel();
}

function soundPanelMarkup() {
  const off = AudioFX.muted;
  const volume = Math.round(AudioFX.getVolume() * 100);
  const bgmOn = BackgroundMusic.enabled;
  const bgmPlaying = BackgroundMusic.playing;
  const files = Object.entries(AudioFX.sampleFiles())
    .map(([name, url]) => `<button class="sound-file" type="button" data-sound-play="${esc(name)}">
      <span class="sound-file-play" aria-hidden="true">▶</span>
      <span class="sound-file-name">${esc(String(url).split("/").pop())}</span>
    </button>`)
    .join("");
  return `<div class="sound-card">
    <div class="sound-panel-head">
      <span class="sound-panel-title">Sounds</span>
      <div class="sound-panel-head-actions">
        <button class="sound-switch ${off ? "off" : "on"}" type="button" data-sound-toggle aria-pressed="${off ? "false" : "true"}" aria-label="${off ? "Turn sounds on" : "Turn sounds off"}"><span class="sound-switch-knob"></span></button>
        <button class="sound-close" type="button" data-sound-close aria-label="Close sound settings">×</button>
      </div>
    </div>
    <div class="sound-volume-row">
      <input class="sound-volume" type="range" min="0" max="100" step="1" value="${volume}" data-sound-volume aria-label="Sound volume">
      <span class="sound-volume-value">${volume}%</span>
    </div>
    <div class="sound-music-row${bgmPlaying ? " playing" : ""}">
      <span class="sound-music-mark" aria-hidden="true">${bgmPlaying ? "♪" : "♫"}</span>
      <span class="sound-music-copy">
        <span class="sound-music-title">Background music</span>
        <span class="sound-music-detail">${esc(BackgroundMusic.track.title)} · ${esc(BackgroundMusic.track.credit)}</span>
      </span>
      <button class="sound-switch ${bgmOn ? "on" : "off"}" type="button" data-bgm-toggle aria-pressed="${bgmOn ? "true" : "false"}" aria-label="${bgmOn ? "Turn background music off" : "Turn background music on"}"><span class="sound-switch-knob"></span></button>
    </div>
    <div class="sound-files">${files}</div>
  </div>`;
}

function renderSoundPanel() {
  const panel = $("#sound-panel");
  if (!panel) return;
  panel.innerHTML = soundPanelMarkup();
}

function positionSoundPanel() {
  // The panel is a centred settings-style stage; nothing to position.
}

function openSoundPanel() {
  const panel = $("#sound-panel");
  if (!panel) return;
  AudioFX.unlock();
  renderSoundPanel();
  panel.hidden = false;
  positionSoundPanel();
  $("#sound-toggle")?.setAttribute("aria-expanded", "true");
}

function closeSoundPanel() {
  const panel = $("#sound-panel");
  if (!panel) return;
  panel.hidden = true;
  $("#sound-toggle")?.setAttribute("aria-expanded", "false");
}

function toggleSoundPanel() {
  const panel = $("#sound-panel");
  if (!panel) return;
  if (panel.hidden) openSoundPanel();
  else closeSoundPanel();
}


async function init() {
  if (new URLSearchParams(location.search).has("still")) document.body.classList.add("still");
  await loadInstalledPlugins();
  await loadThemePacks();
  await loadIconThemes();
  await loadSoundStyles();
  loadSettings();
  applySettings();
  bindEvents();
  bindPageCopy();
  updateSoundToggle();
  loadAiConfig();
  state.data = window.__SNAPSHOT_STATE__ || await requestState();
  // Fork boards from the first build are imported into the plugin store now,
  // so the notebook index can drop those duplicate category rows.
  try {
    const forkStore = window.NeoTodoFork;
    if (!state.data.fork && pluginEnabled("forktree") && forkStore?.importLegacy) {
      const migratedForks = Number(forkStore.importLegacy(state.data.categories)) || 0;
      legacyForkCategoryIds = new Set((forkStore.migratedLegacyIds?.() || []).map(String));
      if (migratedForks > 0 && !/detached=/.test(location.search)) {
        setTimeout(() => toast(`已把 ${migratedForks} 个旧 fork 移入 Forktree 子应用`), 1200);
      }
    }
  } catch (error) {}
  loadSettings();
  resolveRandomPostcard();
  applySettings();
  state.selectedCategoryId = state.data.selected_category || state.data.categories[0]?.id || null;
  const params = new URLSearchParams(location.search);
  // A fork opens as its own NeoTodo window, already pointed at the branch.
  const forkWindow = params.get("fork") === "1";
  if (forkWindow) document.body.classList.add("fork-window");
  const requestedCategory = params.get("category");
  if (requestedCategory) {
    const match = state.data.categories.find((category) => category.id === requestedCategory || category.name === requestedCategory);
    if (match) {
      state.selectedCategoryId = match.id;
      if (forkWindow) forkRootId = match.id;
    }
  }
  if (forkWindow) {
    const branch = selectedCategory();
    document.title = branch ? `NeoTodo · ${branch.name} · fork` : "NeoTodo · fork";
  }
  const detachedParam = params.get("detached");
  if (detachedParam === "ai" && params.get("agent_id")) {
    detachedMode = "ai";
    const kind = params.get("kind") || "todo";
    const context = params.get("context") || "";
    detachedAgentOverride = {
      id: params.get("agent_id"),
      kind,
      title: params.get("title") || "AI",
      category: params.get("category") || "",
      todo: params.get("todo") || "",
      mode: kind === "subtask" ? "build" : "chat",
      scope: {
        kind,
        category: params.get("category") || "",
        todo: params.get("todo") || "",
        subtask: params.get("subtask") || "",
        done: params.get("done") === "1",
        project_folder: params.get("folder") || "",
        context,
      },
    };
    agentTerminalOpen = true;
    notesHidden = true;
    document.body.classList.add("detached-mode", "detached-ai");
    document.title = `NeoTodo · ${detachedAgentOverride.title}`;
  } else if (detachedParam === "note") {
    detachedMode = "note";
    const category = state.data.categories.find((item) => item.id === params.get("category_id"));
    const todo = category?.todos?.find((item) => item.id === params.get("todo_id"));
    const subtask = todo?.subtasks?.find((item) => item.id === params.get("subtask_id"));
    if (category && todo) {
      state.selectedCategoryId = category.id;
      detachedNoteTargetOverride = {
        todo,
        subtask: subtask || null,
        kind: subtask ? "subtask" : "todo",
        completed: Boolean(todo.done),
      };
      notesHidden = false;
    }
    document.body.classList.add("detached-mode", "detached-note");
    document.title = "NeoTodo · Note";
  }
  const restoreView = !detachedMode && !forkWindow ? readViewState() : null;
  if (!requestedCategory && restoreView?.categoryId) {
    const savedCategory = state.data.categories.find((category) => category.id === restoreView.categoryId);
    if (savedCategory) state.selectedCategoryId = savedCategory.id;
  }
  // A hidden legacy fork may still be the remembered or URL category; land on
  // the first real category instead of a board that no longer belongs here.
  const visible = visibleCategories();
  if (!visible.some((category) => category.id === state.selectedCategoryId)) {
    state.selectedCategoryId = visible[0]?.id || null;
  }
  // Put the last-exit page in place before the only render: the saved category,
  // history selection, open note/AI sheets and a custom AI height are all
  // first-paint state now, not something opened after the default page.
  if (!detachedMode && !forkWindow) stageWorkspaceView(restoreView);
  if (detachedMode) {
    document.body.classList.add("detached-arriving");
    setTimeout(() => document.body.classList.remove("detached-arriving"), 760);
    const grabber = document.createElement("div");
    grabber.className = "detached-grabber";
    grabber.id = "detached-grabber";
    grabber.setAttribute("role", "button");
    grabber.setAttribute("tabindex", "0");
    grabber.setAttribute("aria-label", "Move panel");
    grabber.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      const startX = event.screenX;
      const startY = event.screenY;
      let dragging = false;
      let longPressed = false;
      const timer = setTimeout(() => {
        longPressed = true;
      }, 340);
      const move = (moveEvent) => {
        if (dragging) return;
        if (Math.hypot(moveEvent.screenX - startX, moveEvent.screenY - startY) <= 5) return;
        dragging = true;
        clearTimeout(timer);
        window.removeEventListener("pointermove", move);
        nativeWindowCommand("resize", moveEvent.screenX, moveEvent.screenY);
      };
      const up = () => {
        clearTimeout(timer);
        window.removeEventListener("pointermove", move);
        // A short click goes home; a held grip or a resize drag does not.
        if (!dragging && !longPressed) dockDetachedPanel();
      };
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerup", up, { once: true });
    });
    grabber.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") dockDetachedPanel();
    });
    document.body.appendChild(grabber);
  }
  render();
  // A run started by another window lives only on the backend. Ask for it
  // now (and once more after the first paint) so its fan spins here too.
  syncBackendRunningAgents(true).catch(() => {});
  setTimeout(() => syncBackendRunningAgents(true).catch(() => {}), 2600);
  // A board that was not restored (first launch, fork window) still opens with
  // its sheets tucked away.
  if (!restoreView && detachedMode !== "note" && !notesHidden) hideNotesPanel(true);
  positionNotesHandle();
  updateNotesHandle();
  if (!detachedMode && !forkWindow) {
    settleWorkspaceView();
    viewStateReady = true;
    saveViewState();
  }
  if (detachedMode === "ai") setTimeout(() => $("#agent-input")?.focus(), 250);
  if (detachedMode === "note") setTimeout(() => $("#note-live")?.scrollIntoView({ block: "nearest" }), 200);
  positionNotesHandle();
  updateNotesHandle();
  updateHeaderStamp();
  if (!clockTimer) clockTimer = setInterval(() => { updateHeaderStamp(); updateTopClock(); }, 1000);
  updateTopClock();
  loadNoteMaterialFiles();
  // The room is painted together with the rest of the page. Waiting for the
  // wallpaper's decoded first frame here means the first visible frame can
  // never show the bare theme paper before the picture arrives. The card faces
  // are baked alongside it: a card that swapped from the room copy to its own
  // picture after the window appeared was the "still rendering" flash on
  // launch. Both waits overlap, so the cards cost only the time the bake needs
  // beyond the wallpaper decode.
  const cardFacesReady = prewarmCardWallpaperFaces();
  await waitForWallpaperFrame();
  await cardFacesReady;
  document.documentElement.classList.remove("booting");
  document.body.classList.add("app-ready");
  window.__APP_READY_MS__ = performance.now();
  // The desktop window stays hidden until this page has actually been painted.
  // Signalling after two frames keeps the very first visible frame the real
  // page; no splash or theme-colour frame can leak through in between. The
  // timer covers a window that is not currently animating (minimised or
  // occluded), so startup can never wait on an animation frame that will not
  // arrive.
  await new Promise((resolve) => {
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    requestAnimationFrame(() => requestAnimationFrame(settle));
    setTimeout(settle, 180);
  });
  document.body.classList.add("app-painted");
  try {
    if (window.NeoTodoAndroid && window.NeoTodoAndroid.ready) window.NeoTodoAndroid.ready();
  } catch (error) {}
  // Samples are not needed for the first paint; load them after the app is
  // visible so startup stays fast.
  const preload = () => AudioFX.preloadSamples();
  if (window.requestIdleCallback) requestIdleCallback(preload, { timeout: 1200 });
  else setTimeout(preload, 250);
  if (params.get("confirm") === "1") {
    confirmDialog({
      kicker: "A small completion",
      title: "Complete todo",
      message: "Are you sure this is complete? This cannot be undone.",
      confirmLabel: "Complete",
    });
  }
  if (!detachedMode) {
    const view = params.get("view");
    const settingsView = params.get("settings");
    const requestedCard = params.get("card");
    if (settingsView) openSettings(settingsView === "1" ? "theme" : settingsView);
    else if (view === "archive") openArchive();
    else if (view === "completed") openCompletedLog();
    else if (view === "card" || requestedCard) {
      const cards = [...(state.data.archive || [])].sort((a, b) => String(a.week_start).localeCompare(String(b.week_start)));
      if (cards.length) {
        const card = requestedCard ? cards.find((item) => item.id === requestedCard || item.theme === requestedCard) : cards[cards.length - 1];
        if (card) openPostcard(card.id, { auto: true });
      }
    } else if (view !== "app") {
      if (!forkWindow) maybeAutoPostcard();
    }
  }
}

init().catch((error) => {
  document.body.innerHTML = `<div style="padding:40px;color:#b65c50;font-family:monospace;font-size:12px;line-height:1.7;white-space:pre-wrap">NeoTodo could not start:\n${esc(error.message)}</div>`;
});
