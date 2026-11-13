const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const THEMES = {
  violet: {
    name: "Violet", motif: "☾", airmail: false,
    paper: "#f4ecfa", paper2: "#e7d8f3", ink: "#3d2f4a", muted: "#8c7a9c",
    accent: "#8d63b8", accent2: "#b88cff", border: "#d4c0e6", stamp: "#7b5aa6",
    glow: "rgba(141,99,184,.18)",
    display: '"Noto Serif","Liberation Serif",Georgia,serif',
    body: '"Adwaita Sans","Noto Sans","Noto Sans CJK SC",sans-serif',
    quote: "Every week leaves a little color behind.",
    art(p) { return `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-v" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#0e081b"/>
          <stop offset=".5" stop-color="#241338"/>
          <stop offset="1" stop-color="#4a2c62"/>
        </linearGradient>
        <radialGradient id="moon-v" cx="38%" cy="34%" r="72%">
          <stop offset="0" stop-color="#fff2ff"/>
          <stop offset=".58" stop-color="#d9bcff"/>
          <stop offset="1" stop-color="#8a63b8"/>
        </radialGradient>
        <linearGradient id="field-v" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#3a2254"/>
          <stop offset="1" stop-color="#160e24"/>
        </linearGradient>
      </defs>
      <rect width="1000" height="300" fill="url(#sky-v)"/>
      <g fill="#fff" opacity=".72">
        <circle cx="120" cy="56" r="1.6"/><circle cx="240" cy="34" r="1.2"/><circle cx="360" cy="70" r="1.4"/><circle cx="510" cy="42" r="1.1"/><circle cx="640" cy="66" r="1.5"/><circle cx="880" cy="38" r="1.3"/><circle cx="940" cy="88" r="1.5"/>
      </g>
      <circle cx="770" cy="82" r="44" fill="url(#moon-v)" opacity=".95"/>
      <circle cx="770" cy="82" r="62" fill="none" stroke="#e1ccff" stroke-width="1" opacity=".22"/>
      <path d="M0 205 L140 142 L270 202 L420 118 L560 198 L720 140 L860 205 L960 172 L1000 190 L1000 300 L0 300Z" fill="#221331" opacity=".92"/>
      <path d="M0 236 C160 196 300 244 470 216 C640 188 790 244 1000 204 L1000 300 L0 300Z" fill="url(#field-v)" opacity=".95"/>
      <g stroke="#b88cff" stroke-width="2" opacity=".42">
        <path d="M0 272 C160 240 320 278 480 254 C640 230 820 276 1000 244"/>
        <path d="M0 286 C180 258 340 292 520 268 C700 244 840 288 1000 262"/>
        <path d="M0 298 C200 274 380 304 560 284 C740 264 880 300 1000 280"/>
      </g>
      <g fill="#d9bcff" opacity=".78">
        <circle cx="90" cy="262" r="2.2"/><circle cx="150" cy="278" r="2"/><circle cx="220" cy="252" r="2.4"/>
        <circle cx="290" cy="270" r="2"/><circle cx="360" cy="246" r="2.6"/><circle cx="430" cy="268" r="2.1"/>
        <circle cx="520" cy="250" r="2.3"/><circle cx="600" cy="272" r="2"/><circle cx="680" cy="248" r="2.5"/>
        <circle cx="760" cy="266" r="2.1"/><circle cx="840" cy="244" r="2.4"/><circle cx="920" cy="264" r="2"/>
      </g>
      <path d="M330 80 q38 -18 76 0 M590 52 q30 -14 60 0" fill="none" stroke="#e1ccff" stroke-width="1" opacity=".2"/>
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

const AudioFX = (() => {
  let ctx = null;
  let noise = null;
  let muted = false;
  try { muted = localStorage.getItem("neotodo.muted") === "1"; } catch (error) {}
  const AC = window.AudioContext || window.webkitAudioContext;
  const sampleBuffers = {};
  const sampleLoading = {};
  const SAMPLE_URLS = {
    type: "/sounds/keyany.wav",
    enter: "/sounds/keyenter.wav",
    drawerOpen: "/sounds/drawer-open.mp3",
    drawerClose: "/sounds/drawer-close.mp3",
    // Gentle flowing-water loop for scrolling (CC0); see sounds/CREDITS.txt.
    waterFlow: "/sounds/water-flow.wav",
    trickle: "/sounds/water-trickle.wav",
    windScroll: "/sounds/wind-scroll.wav",
    train: "/sounds/train-whistle.mp3",
  };

  function preloadSamples() {
    const c = ensure();
    if (!c) return;
    for (const [name, url] of Object.entries(SAMPLE_URLS)) {
      if (sampleBuffers[name] || sampleLoading[name]) continue;
      sampleLoading[name] = fetch(url)
        .then((response) => response.arrayBuffer())
        .then((data) => new Promise((resolve) => c.decodeAudioData(data, resolve, () => resolve(null))))
        .then((decoded) => { if (decoded) sampleBuffers[name] = decoded; })
        .catch(() => {})
        .finally(() => { sampleLoading[name] = null; });
    }
  }

  function playSample(name, volume = 0.3, rate = 1) {
    if (muted) return;
    const c = ensure();
    if (!c) return;
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
    gain.connect(c.destination);
    src.start();
  }

  function ensure() {
    if (muted || !AC) return null;
    if (!ctx) {
      try { ctx = new AC(); } catch (error) { return null; }
    }
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
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
    gain.connect(c.destination);
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
      gain.connect(c.destination);
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
    bedGain.connect(c.destination);
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
    gain.connect(c.destination);
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
    gain.connect(c.destination);
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
    gain.connect(c.destination);
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
    gain.connect(c.destination);
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
    gain.connect(c.destination);
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
      gain.connect(c.destination);
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
      gain.connect(c.destination);
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
      gain.connect(c.destination);
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
    gain.connect(c.destination);
    src.start(now);
    src.stop(now + 0.38);
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
    gain.connect(c.destination);
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
    waveGain.connect(c.destination);
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
    body.connect(c.destination);
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
      bg.connect(c.destination);
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
    gain.connect(c.destination);
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
        gain.connect(c.destination);
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
    gain.connect(c.destination);
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
    gain.connect(c.destination);
    osc.start(when);
    osc.stop(when + duration + 0.02);
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
    gain.connect(c.destination);
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
    gain.connect(c.destination);
    src.start(now, 0.1, 0.95);
  }

  function unlock() {
    const c = ensure();
    if (c && c.state === "suspended") c.resume().catch(() => {});
    preloadSamples();
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
    if (!c) return;
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
    gain.connect(c.destination);
    src.start(now, 0, 0.08);
    src.stop(now + 0.09);
    tone(180, now, 0.09, 0.03);
    tone(1318.5, now, 0.07, 0.06);
    tone(1975.5, now + 0.02, 0.09, 0.04);
    tone(2637, now + 0.045, 0.11, 0.024);
  }

  function achievementTap() {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    tone(783.99, now, 0.16, 0.018);
    tone(1046.5, now + 0.055, 0.22, 0.014);
    tone(1318.5, now + 0.11, 0.3, 0.01);
  }

  function timerTap() {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    tone(1320, now, 0.06, 0.014);
    tone(880, now + 0.045, 0.09, 0.012);
    tone(1760, now + 0.085, 0.12, 0.008);
  }

  function addTap() {
    const c = ensure();
    if (!c) return;
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
    bus.connect(c.destination);

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
      gain.connect(c.destination);
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
    pick.connect(c.destination);
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
      gain.connect(c.destination);
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
      gain.connect(c.destination);
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
    gain.connect(c.destination);
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
    buzzGain.connect(c.destination);
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
    bus.connect(c.destination);

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
    if (!c) return;
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
    gain.connect(c.destination);
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
    gain.connect(c.destination);
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
    noiseGain.connect(c.destination);
    src.start(now, 0, 0.52);
    src.stop(now + 0.53);
    tone(55, now + 0.15, 0.42, 0.4);
    tone(88, now + 0.15, 0.22, 0.22);
  }

  return { rustle, pageTurn, waterFlow, subtaskFlow, exhale, splash, writing, itemGet, bassZap, celebrationBass, cardWind, type, mechanical, carriage, confirmCarriage, unroll, paper, seal, chime, ding, trainWhistle, categoryTap, achievementTap, timerTap, addTap, completeTap, bassFade, guitarPluck, drawer, drawerStretch, leafRustle, startLeafStretch, stopLeafStretch, unlock, preloadSamples, toggle, get muted() { return muted; } };
})();

const DEFAULT_SETTINGS = { theme: "postcard", postcard: "violet", resolved_postcard: "violet", light_postcard: "violet", dark_postcard: "tokyo", font: "serif", note_font: "pen", scale: 1, show_time_cost: false, show_clock: true, focus_count: 0, focus_log: [], title_offset: 0, title_icon_size: 48, caret_blink: false, caret_shape: "line", caret_color: "#1b1b1b", note_material: "paper", note_background: "", note_background_image: "", note_blur: 16 };
const NOTE_BG_PRESETS = {};
const POSTCARD_IDS = ["violet", "tokyo", "space", "aurora", "ocean", "forest", "vintage", "alpine", "desert", "emerald"];
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
let settingsTab = "appearance";
let settingsSaveTimer = null;
let randomPicked = false;
let themeModeTab = null;
let themeFamiliesOpen = false;
let themeFamilyOpen = false;
const fontPanelsOpen = { body: false, note: false };

function randomPostcardId(exclude = null) {
  const pool = POSTCARD_IDS.filter((id) => id !== exclude);
  return pool[Math.floor(Math.random() * pool.length)] || "violet";
}

function currentPostcardId() {
  const id = settings.resolved_postcard;
  return THEMES[id] ? id : "violet";
}

function postcardIsDark(id) {
  const theme = THEMES[id];
  return theme ? hexLuminance(theme.paper || "#ffffff") < 0.45 : false;
}

function postcardArtHtml() {
  const theme = THEMES[currentPostcardId()] || THEMES.violet;
  return theme.art(theme);
}

function postcardName(id) {
  const theme = THEMES[id];
  if (!theme) return "紫罗兰 · Violet";
  return id === "violet" ? "紫罗兰 · Violet" : theme.name;
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
window.addEventListener("error", (event) => showFatal(event.error || event.message));
window.addEventListener("unhandledrejection", (event) => showFatal(event.reason));
let archiveOpen = false;
let trashOpen = false;
let restoringTrashId = null;
let expandedArchiveCardId = null;
let archiveCardSwipeUntil = 0;
let completedOpen = false;
let completedSearch = "";
let focusSearch = "";
let completedExpanded = new Set();
let historyCursor = -1;
let lastTypeSoundAt = 0;

function playTypeSound() {
  const now = performance.now();
  if (now - lastTypeSoundAt < 35) return;
  lastTypeSoundAt = now;
  AudioFX.unlock();
  AudioFX.type();
}
let historyScrollTop = null;
let indexOpenWidth = 320;
let historyExpanded = new Set();
let selectedHistoryId = null;
let selectedSubtaskId = null;
let trophyDisplayHold = null;
let suppressSubtaskRenameUntil = 0;
let subtaskDragStart = null;
let categoryDrag = null;
let suppressCategoryClickUntil = 0;
let doingPeekOpen = false;
let doingExpandedTodoIds = new Set();
let doingPeekOpenTimer = 0;
let doingPeekPoint = { x: 0, y: 0 };
let doingZone = null;
let doingCardWidth = 380;
let doingCardTop = 0;
let doingCardHeight = 600;
let doingPanelRect = null;
let doingPointerFrame = 0;
let agentTerminalOpen = false;
let panelPreview = null;
let singleDock = null;
let detachedMode = "";
let detachedAgentOverride = null;
let detachedNoteTargetOverride = null;
let agentSessions = {};
const agentBusyIds = new Set();
const agentExecQueue = [];
let agentExecutingId = null;
let agentModels = [];
let agentDefaultModel = "deepseek/deepseek-flash";
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
    return ["notes-left", "notes-right", "notes-top", "notes-bottom"].includes(saved) ? saved : "notes-right";
  } catch (error) { return "notes-right"; }
})();
let agentSplitRatio = (() => {
  try {
    const value = Number(localStorage.getItem("neotodo.agentSplitRatio.v2"));
    return Number.isFinite(value) && value >= 0.28 && value <= 0.72 ? value : 0.5;
  } catch (error) { return 0.5; }
})();
let agentSplitDrag = null;
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
  return { left: 0.11, top: 0.54, width: 0.78, height: 0.44 };
})();

function saveNotesPanelRect() {
  try { localStorage.setItem("neotodo.notesRect", JSON.stringify(notesPanelRect)); } catch (error) {}
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
    positionTimerRoot();
    positionNotesHandle();
    if (performance.now() - start < duration) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function hideNotesPanel(silent = false) {
  if (notesHidden || notesClosing) return;
  if (singleDock?.kind === "note") clearSingleDock();
  const panel = $("#notes-half");
  const handle = $(".notes-handle-bottom");
  if (!panel || silent) {
    hideNotesPanelNow(silent);
    return;
  }
  notesClosing = true;
  handle?.classList.add("handle-vanished");
  panel.classList.add("sheet-closing");
  setTimeout(() => {
    if (!notesClosing) return;
    panel.classList.remove("sheet-closing");
    notesClosing = false;
    hideNotesPanelNow(silent);
    handle?.classList.remove("handle-vanished");
    positionDeskHandles();
  }, 240);
}

function hideNotesPanelNow(silent = false) {
  if (notesHidden) return;
  if (!silent) AudioFX.leafRustle();
  saveActiveNoteCaret();
  notesHidden = true;
  document.body.classList.add("notes-hidden");
  applyNotesStretch();
  const panel = $("#notes-half");
  if (panel) panel.classList.add("notes-hidden");
  updateNotesHandle();
  positionNotesHandle();
  updateAgentSplitLayout();
}

function showNotesPanel() {
  if (!notesHidden) return;
  notesClosing = false;
  clearSingleDock();
  $(".notes-handle-bottom")?.classList.remove("handle-vanished");
  notesHidden = false;
  document.body.classList.remove("notes-hidden");
  AudioFX.leafRustle();
  const panel = $("#notes-half");
  if (!panel) return;
  panel.classList.remove("notes-hidden", "sheet-closing");
  setupNotesPanel();
  panel.classList.add("sheet-opening");
  setTimeout(() => panel.classList.remove("sheet-opening"), 320);
  updateNotesHandle();
  positionNotesHandle();
  updateAgentSplitLayout();
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

function hideCustomCaret() {
  const caret = document.getElementById("custom-caret");
  if (caret) caret.style.display = "none";
}

function ensureCustomCaret() {
  const live = document.querySelector("#note-live");
  if (!live) return null;
  let caret = document.getElementById("custom-caret");
  if (!caret || caret.parentElement !== live) {
    caret = document.createElement("i");
    caret.id = "custom-caret";
    caret.setAttribute("aria-hidden", "true");
    live.appendChild(caret);
  }
  return caret;
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
  const editor = document.activeElement?.closest?.("[data-note-block-editor]");
  const live = document.querySelector("#note-live");
  if (!editor || document.activeElement !== editor || notesHidden || !live || !editor.isConnected) {
    hideCustomCaret();
    return;
  }
  const start = editor.selectionStart ?? 0;
  const end = editor.selectionEnd ?? start;
  if (start !== end) {
    hideCustomCaret();
    return;
  }
  const caret = ensureCustomCaret();
  if (!caret) return;
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
  const liveRect = live.getBoundingClientRect();
  const block = settings.caret_shape === "block";
  const left = editorRect.left - liveRect.left - live.clientLeft
    + (markerRect.left - mirrorRect.left) + live.scrollLeft;
  const top = editorRect.top - liveRect.top - live.clientTop
    + (markerRect.top - mirrorRect.top) + live.scrollTop
    + (lineHeight - caretHeight) / 2;
  const width = block ? Math.max(4, Math.round(probeRect.width)) : 1.5;
  caret.style.display = "block";
  caret.style.left = `${left.toFixed(2)}px`;
  caret.style.top = `${top.toFixed(2)}px`;
  caret.style.width = `${width}px`;
  caret.style.height = `${caretHeight.toFixed(2)}px`;
  caret.style.background = normalizedCaretColor();
  caret.style.setProperty("--caret-alpha", block ? "0.68" : "1");
  caret.classList.toggle("block", block);
  caret.classList.toggle("blink", settings.caret_blink === true);
}

function setupCustomCaret() {
  document.body.classList.add("custom-caret");
  document.addEventListener("focusin", (event) => {
    if (event.target.matches?.("[data-note-block-editor]")) scheduleCustomCaret();
  });
  document.addEventListener("focusout", (event) => {
    if (!event.target.matches?.("[data-note-block-editor]")) return;
    setTimeout(() => {
      if (!document.activeElement?.matches?.("[data-note-block-editor]")) hideCustomCaret();
    }, 0);
  });
  document.addEventListener("selectionchange", () => {
    if (document.activeElement?.matches?.("[data-note-block-editor]")) scheduleCustomCaret();
  });
  document.addEventListener("input", (event) => {
    if (event.target.matches?.("[data-note-block-editor]")) scheduleCustomCaret();
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
  }
  if (name === "add_category" && result.created) {
    state.selectedCategoryId = result.created;
  }
  const selected = state.selectedCategoryId;
  if (selected && !state.data.categories.some((category) => category.id === selected)) {
    state.selectedCategoryId = state.data.selected_category || state.data.categories[0]?.id || null;
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

function selectedCategory() {
  if (!state.data) return null;
  return state.data.categories.find((category) => category.id === state.selectedCategoryId)
    || state.data.categories[0]
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

function renderCategories() {
  const list = $("#category-list");
  const summary = $("#category-summary");
  if (!state.data.categories.length) {
    list.innerHTML = `<div class="drawer-empty" style="padding:20px 6px;font-size:12px;line-height:1.8">No categories.<br>Press + to begin.</div>`;
    summary.textContent = "";
    return;
  }
  const categories = state.data.categories;
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
      <span class="cat-dot"></span>
      <span class="cat-name">${esc(category.name)}</span>
      <span class="cat-count">${count}</span>
    </button>`;
  }).join("");
  summary.textContent = "";
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

function todoImages(owner) {
  if (!owner) return [];
  const images = Array.isArray(owner.images) ? owner.images.filter(Boolean) : [];
  if (images.length) return images;
  return owner.image ? [owner.image] : [];
}

function noteOwner(target) {
  if (!target) return null;
  return target.kind === "subtask" ? target.subtask : target.todo;
}

function noteImages(target) {
  return todoImages(noteOwner(target));
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

function notesHtml() {
  const noteSubtitle = '<div class="brand-subtitle" aria-hidden="true">— to do, to remember.</div>';
  const category = selectedCategory();
  const active = activeNoteTarget();
  const notesIcon = `<svg class="notes-icon" aria-hidden="true"><use href="#${themeSymbol("notes")}"></use></svg>`;
  const quill = '<div class="notes-quill" aria-hidden="true"><svg><use href="#feather"></use></svg></div>';
  const topHandle = '<button class="notes-handle notes-handle-top" data-action="notes-button" type="button" aria-label="Hide note"></button>';
  if (!active) {
    const message = category ? "Add a todo to start a note..." : "Create a category to begin...";
    return `${topHandle}${quill}<div class="notes-head"><div class="notes-title">${notesIcon}<span>No note</span></div></div>
      <div class="notes-empty">${message}</div>${noteSubtitle}`;
  }
  const { todo, subtask, kind, completed } = active;
  const noteTitle = kind === "subtask" ? subtask.name : todo.name;
  const note = String(kind === "subtask" ? (subtask.note || "") : (todo.note || ""));
  ensureNoteBlocks(active, note);
  if (noteBlocks.length && (noteEditingBlock === null || noteEditingBlock < 0 || noteEditingBlock >= noteBlocks.length)) {
    const memory = noteCaretMemory.get(noteTargetKey(active));
    noteEditingBlock = memory && noteBlocks[memory.block] ? memory.block : 0;
  }
  const images = noteImages(active);
  // One template for every note: todo, subtask and completed notes share the
  // same right column, divider and picture controls. Only the content differs.
  const pictures = `<button class="picture-link" data-action="add-picture">Add pictures</button>
       ${images.length ? `<button class="picture-link" data-action="show-pictures">Added pictures <span>(${images.length})</span></button>` : ""}
       <input type="file" id="note-image-input" accept="image/*" multiple hidden>`;
  const blocks = noteBlocks.map((block, index) => index === noteEditingBlock
    ? `<textarea class="note-block-editor" data-note-block-editor="${index}" spellcheck="false">${esc(block.raw || NOTE_ZERO_WIDTH)}</textarea>`
    : `<div class="note-block markdown" data-note-block="${index}">${block.raw.trim() ? renderMarkdown(block.raw) : ""}</div>`).join("");
  const notePlaceholder = noteBlocks.length === 1 && !String(noteBlocks[0]?.raw || "").trim()
    ? '<span class="note-empty-placeholder" aria-hidden="true">Write something ...</span>'
    : "";
  return `${topHandle}${quill}<div class="notes-head"><div class="notes-title">${notesIcon}<span>${esc(noteTitle)}</span></div></div>
    <div class="notes-body"><div class="note-live" id="note-live">${notePlaceholder}${blocks}</div><div class="note-pictures">${pictures}</div></div>${noteSubtitle}`;
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
  rows.forEach((row, index) => {
    playVanishSmoke(row.querySelector(".sub-fan") || row, index > 0);
    row.classList.add("subtask-vanishing");
  });
  animateSubtaskRowsAway(rows);
  if (ids.includes(selectedSubtaskId)) selectedSubtaskId = null;
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

  get contentHeight() {
    return this.ready ? this.scroller.scrollHeight : 0;
  }

  get contentNode() {
    return this.ready ? this.scroller.querySelector(".current-subtasks") : null;
  }

  beginStretch() {
    if (!this.ready) return;
    this.stretchContent = this.contentNode;
    this.stretchBase = this.scroller.scrollTop;
    this.stretchTarget = this.stretchBase;
    this.stretchContent?.classList.add("stretch-scroll");
  }

  endStretch() {
    if (this.ready && Number.isFinite(this.stretchTarget)) {
      this.scroller.scrollTop = this.stretchTarget;
    }
    if (this.stretchContent) {
      this.stretchContent.style.transform = "";
      this.stretchContent.classList.remove("stretch-scroll");
    }
    this.stretchContent = null;
    this.stretchTarget = null;
  }

  offsetOf(row) {
    if (!row || !this.ready) return 0;
    const viewport = this.scroller.getBoundingClientRect();
    const rect = row.getBoundingClientRect();
    return Math.max(0, rect.top - viewport.top + this.scroller.scrollTop);
  }

  syncScrollable() {
    if (!this.ready) return false;
    const overflowing = this.scroller.scrollHeight > this.scroller.clientHeight + 12;
    this.scroller.classList.toggle("task-scrollable", overflowing);
    this.scroller.style.overflowY = overflowing ? "auto" : "hidden";
    if (!overflowing) this.scroller.scrollTop = 0;
    return overflowing;
  }

  /**
   * Keep a row above the note edge. `bottom` is the visible bottom measured
   * from the column top. The row rises with the note but never above the first
   * row and never past the real content limit.
   */
  reveal(row, bottom, cache = null) {
    if (!row || !this.ready) return;
    const offset = cache && Number.isFinite(cache.offset) ? cache.offset : this.offsetOf(row);
    const visible = Math.min(bottom, TASK_ROW_AREA_HEIGHT);
    const content = cache && Number.isFinite(cache.content) ? cache.content : this.contentHeight;
    const max = Math.max(0, content - visible);
    const base = Number.isFinite(this.stretchBase) ? this.stretchBase : this.scroller.scrollTop;
    const needed = offset + TASK_ROW_HEIGHT - visible;
    // Only scroll up enough to rescue the row; keep the user's own scroll otherwise.
    const target = Math.max(0, Math.min(Math.max(base, needed), offset, max));
    if (this.stretchContent) {
      this.stretchTarget = target;
      const delta = target - base;
      const next = `translate3d(0, ${-delta}px, 0)`;
      if (this.stretchContent.style.transform !== next) this.stretchContent.style.transform = next;
      return;
    }
    if (this.scroller.scrollTop !== target) this.scroller.scrollTop = target;
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
    return {
      row,
      offset: row ? this.current.offsetOf(row) : 0,
      content: this.current.contentHeight,
      baseScroll: this.current.ready ? this.current.scroller.scrollTop : 0,
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

function refreshTaskBoard() {
  taskBoard = new TaskBoard();
  notesDock.attach(taskBoard);
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
      if (event.target.closest("button, a, input, textarea, .note-block, .note-block-editor, .notes-head, .note-pictures")) return;
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

function agentContextString(target = null) {
  const category = selectedCategory();
  const todo = target?.todo || currentTodo();
  const subtask = target?.subtask;
  const subs = (todo?.subtasks || []).map((item) => `${item.name}${item.done ? " (done)" : ""}`).join(", ");
  return `Category: ${category?.name || "none"}; Todo: ${todo?.name || "none"}; Selected subtask: ${subtask?.name || "none"}; Subtasks: ${subs || "none"}.`;
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
  return agentSessions[agent.id]?.model || agentDefaultModel;
}

function currentAgentMode(agent) {
  const mode = agentSessions[agent.id]?.mode;
  if (mode === "build" || mode === "chat") return mode;
  return agent.kind === "subtask" ? "build" : "chat";
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
  return `<div class="agent-process">${esc(String(text))}</div>`;
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
  return `<div class="agent-process">${esc(String(text))}</div>`;
}

function agentAttachmentsFor(agentId) {
  if (!agentAttachments[agentId]) agentAttachments[agentId] = [];
  return agentAttachments[agentId];
}

function agentAttachedChips(items) {
  if (!Array.isArray(items) || !items.length) return "";
  const names = items.map((item) => (typeof item === "string" ? item : String(item?.name || ""))).filter(Boolean);
  if (!names.length) return "";
  return `<div class="agent-attached-files">${names.map((name) => `<span class="agent-attached-file">${esc(name)}</span>`).join("")}</div>`;
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

function updateAgentSplitLayout() {
  const active = agentTerminalOpen && !notesHidden && Boolean($("#notes-half"));
  const vertical = active && (agentSplitSide === "notes-top" || agentSplitSide === "notes-bottom");
  agentSplitRatio = clamp(agentSplitRatio, vertical ? 0.4 : 0.28, vertical ? 0.6 : 0.72);
  document.body.classList.toggle("agent-notes-split", active);
  document.body.classList.toggle("agent-notes-left", active && agentSplitSide === "notes-left");
  document.body.classList.toggle("agent-notes-right", active && agentSplitSide === "notes-right");
  document.body.classList.toggle("agent-notes-top", active && agentSplitSide === "notes-top");
  document.body.classList.toggle("agent-notes-bottom", active && agentSplitSide === "notes-bottom");
  document.body.classList.toggle("agent-notes-axis-y", vertical);
  const left = (agentSplitRatio * 100).toFixed(2);
  const root = document.documentElement;
  root.style.setProperty("--agent-left-pct", `${left}%`);
  root.style.setProperty("--agent-ai-left", "0%");
  root.style.setProperty("--agent-ai-right", "0%");
  root.style.setProperty("--agent-ai-pad-top", "0px");
  root.style.setProperty("--agent-ai-pad-bottom", "0px");
  if (vertical) {
    const body = $(".page-body");
    if (body) {
      const deskHeight = body.clientHeight;
      const deskTop = 0;
      const topHeight = deskHeight * agentSplitRatio;
      const gap = 0;
      const topSide = agentSplitSide === "notes-top";
      const notesHeight = Math.max(60, (topSide ? topHeight : deskHeight - topHeight) - gap);
      const notesTop = topSide ? deskTop : deskTop + topHeight + gap;
      const aiTop = topSide ? deskTop + topHeight + gap : deskTop;
      const aiHeight = Math.max(60, (topSide ? deskHeight - topHeight : topHeight) - gap);
      const boundary = deskTop + topHeight;
      root.style.setProperty("--agent-desk-top", `${deskTop}px`);
      root.style.setProperty("--agent-desk-height", `${deskHeight}px`);
      root.style.setProperty("--agent-ai-top", `${aiTop}px`);
      root.style.setProperty("--agent-ai-height", `${aiHeight}px`);
      root.style.setProperty("--agent-notes-y-top", `${notesTop}px`);
      root.style.setProperty("--agent-notes-y-height", `${notesHeight}px`);
      root.style.setProperty("--agent-split-y", `${boundary}px`);
    }
  } else {
    root.style.setProperty("--agent-ai-top", "0px");
    root.style.setProperty("--agent-ai-height", "0px");
    root.style.setProperty("--agent-notes-y-top", "0px");
    root.style.setProperty("--agent-notes-y-height", "0px");
    root.style.setProperty("--agent-notes-left", agentSplitSide === "notes-left" ? "0%" : `${left}%`);
    root.style.setProperty("--agent-notes-width", agentSplitSide === "notes-left" ? `${left}%` : `${100 - Number(left)}%`);
  }
  const handle = $("#agent-split-handle");
  if (handle) handle.hidden = !active;
  const chooser = $("#agent-split-chooser");
  if (chooser) chooser.setAttribute("aria-hidden", active ? "false" : "true");
  positionDeskHandles();
  requestAnimationFrame(() => positionDeskHandles());
  setTimeout(() => positionDeskHandles(), 80);
}

function agentTerminalMarkup() {
  return `<section class="agent-terminal ${agentTerminalOpen ? "open" : ""}" id="agent-terminal" aria-hidden="${agentTerminalOpen ? "false" : "true"}">
    <div class="agent-resize" data-agent-resize aria-label="Resize terminal"></div>
    <div class="agent-head">
      <div class="agent-head-left">
        <span class="agent-provider" id="agent-provider">DeepSeek</span>
        <span class="agent-head-sep" aria-hidden="true">/</span>
        <span class="agent-head-agent" id="agent-head-agent">NeoTodo</span>
      </div>
    </div>
    <div class="agent-body">
      <div class="agent-main">
        <div class="agent-messages" id="agent-messages"></div>
        <div class="agent-input-shell">
          <form class="agent-compose" id="agent-compose">
            <div class="agent-attach-chips" id="agent-attach-chips"></div>
            <textarea id="agent-input" rows="3" placeholder="Ask anything…" autocomplete="off" spellcheck="false"></textarea>
            <div class="agent-compose-foot">
              <button class="agent-attach" type="button" data-agent-attach aria-label="Attach files" title="Attach files">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
              </button>
              <button class="agent-model-pick" type="button" data-agent-model-toggle aria-label="Choose model" title="Choose model (Ctrl+P)">
                <span id="agent-model-label">DeepSeek/deepseek-flash</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="agent-mode-pick" type="button" data-agent-mode-toggle aria-label="Switch work mode" title="Switch between Chat and Build">
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
          <span class="agent-meta-usage" id="agent-meta-usage"></span>
        </div>
      </div>
    </div>
  </section>`;
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

function positionDeskHandles() {
  const body = $(".page-body");
  const aiHandle = $(".desk-handle-ai");
  const notesHandle = $(".notes-handle-bottom");
  const terminal = $("#agent-terminal");
  const notes = $("#notes-half");
  if (!body || !aiHandle || !notesHandle) return;
  const bodyRect = body.getBoundingClientRect();
  const ratio = agentSplitRatio;
  const side = agentSplitSide;
  const vertical = side === "notes-top" || side === "notes-bottom";
  const futureCenter = (which) => {
    // A closed door always hides at its own side, even in a top/bottom split;
    // it should never slide toward the middle just because the other opened.
    if (vertical) return bodyRect.left + bodyRect.width * (which === "ai" ? 0.25 : 0.75);
    const aiLeft = side !== "notes-left";
    if (which === "ai") {
      return bodyRect.left + bodyRect.width * (aiLeft ? ratio / 2 : (1 + ratio) / 2);
    }
    return bodyRect.left + bodyRect.width * (aiLeft ? (1 + ratio) / 2 : ratio / 2);
  };
  const aiOpen = agentTerminalOpen && !agentClosing;
  const notesOpen = !notesHidden && !notesClosing;
  const layerGeometry = (element) => {
    if (!element || !element.offsetWidth) return null;
    return {
      center: bodyRect.left + element.offsetLeft + element.offsetWidth / 2,
      top: bodyRect.top + element.offsetTop + 6,
    };
  };
  const aiRect = aiOpen ? layerGeometry(terminal) : null;
  const notesRect = notesOpen ? layerGeometry(notes) : null;
  const bothClosed = !aiOpen && !notesOpen;
  const aiCenter = aiRect
    ? aiRect.center
    : (bothClosed && vertical ? bodyRect.left + bodyRect.width * 0.25 : futureCenter("ai"));
  const notesCenter = notesRect
    ? notesRect.center
    : (bothClosed && vertical ? bodyRect.left + bodyRect.width * 0.75 : futureCenter("notes"));
  const closedTop = window.innerHeight - 20;
  // While the other panel is open, its neighbour's handle waits just beyond
  // the bottom edge and slides in on strip hover.
  const hiddenTop = window.innerHeight + 2;
  const stripHover = document.body.classList.contains("desk-strip-hover");
  const aiOtherHidden = !aiOpen && notesOpen && !stripHover;
  const notesOtherHidden = !notesOpen && aiOpen && !stripHover;
  const aiTop = aiRect ? aiRect.top : (aiOtherHidden ? hiddenTop : closedTop);
  const notesTop = notesRect ? notesRect.top : (notesOtherHidden ? hiddenTop : closedTop);
  const setHandle = (handle, center, top) => {
    handle.style.setProperty("left", `${Math.round(center)}px`, "important");
    handle.style.setProperty("right", "auto", "important");
    handle.style.setProperty("transform", "translateX(-50%)", "important");
    handle.style.setProperty("top", `${Math.round(top)}px`, "important");
    handle.style.setProperty("bottom", "auto", "important");
  };
  setHandle(aiHandle, aiCenter, aiTop);
  setHandle(notesHandle, notesCenter, notesTop);
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
    const rect = body.getBoundingClientRect();
    document.body.classList.add("agent-split-resizing");
    try { handle.setPointerCapture?.(event.pointerId); } catch (error) {}
    const move = (moveEvent) => {
      const vertical = document.body.classList.contains("agent-notes-axis-y");
      const desk = vertical ? agentDeskRect() : null;
      const ratio = vertical && desk
        ? clamp((moveEvent.clientY - desk.top) / Math.max(1, desk.height), 0.4, 0.6)
        : clamp((moveEvent.clientX - rect.left) / Math.max(1, rect.width), 0.28, 0.72);
      agentSplitRatio = ratio;
      updateAgentSplitLayout();
    };
    const up = () => {
      document.body.classList.remove("agent-split-resizing");
      try { localStorage.setItem("neotodo.agentSplitRatio.v2", String(agentSplitRatio)); } catch (error) {}
      window.removeEventListener("pointermove", move);
      positionDeskHandles();
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up, { once: true });
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

function renderAgentTerminal() {
  const panel = $("#agent-terminal");
  const tool = document.querySelector(".terminal-tool");
  tool?.classList.toggle("active", agentTerminalOpen);
  if (!panel) return;
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
  const queued = mode === "build" && agentExecutingId && agentExecutingId !== agent.id;
  const session = agentSessions[agent.id] || { messages: [] };
  const messages = Array.isArray(session.messages) ? session.messages : [];
  const messagesEl = $("#agent-messages");
  if (messagesEl) {
    let html = "";
    for (const message of messages) {
      const role = message.role === "assistant" ? "assistant" : message.role === "system" ? "system" : "user";
      if (role === "user") {
        html += `<div class="agent-line user"><div class="agent-line-text">${esc(message.content || "")}</div>${agentAttachedChips(message.attachments)}</div>`;
      } else if (role === "system") {
        html += `<div class="agent-notice">${esc(message.content || "")}</div>`;
      } else {
        html += `<div class="agent-run">${agentProcessHtml(message.process)}<div class="agent-reply">${renderMarkdown(message.content || "")}</div></div>`;
      }
    }
    const live = agentLive[agent.id] || {};
    if (busy) {
      html += `<div class="agent-live">${agentProcessHtml(live.process)}`;
      if (live.text) html += `<div class="agent-reply">${renderMarkdown(live.text)}</div>`;
      html += `<span class="agent-working-cursor" aria-hidden="true"></span></div>`;
    }
    messagesEl.innerHTML = html;
    messagesEl.scrollTop = messagesEl.scrollHeight;
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
    chips.innerHTML = attachments.map((file) => `<span class="agent-chip"><span class="agent-chip-name" title="${esc(file.name)}">${esc(file.name)}</span><span class="agent-chip-size">${formatAgentBytes(file.size)}</span><button type="button" class="agent-chip-remove" data-agent-file-remove="${esc(file.name)}" aria-label="Remove ${esc(file.name)}"${busy || loading || uploading ? " disabled" : ""}>×</button></span>`).join("");
    chips.classList.toggle("has-files", attachments.length > 0);
  }

  const menu = $("#agent-model-menu");
  if (menu) {
    menu.hidden = !agentModelMenuOpen;
    if (agentModelMenuOpen) {
      menu.innerHTML = agentModels.length
        ? agentModels.map((item) => `<button type="button" class="agent-model-option ${item === model ? "active" : ""}" data-agent-model-choice="${esc(item)}"><span>${esc(agentModelProvider(item))}/${esc(agentModelLeaf(item))}</span>${item === model ? `<span class="agent-model-check">✓</span>` : ""}</button>`).join("")
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
    stateEl.textContent = loading ? "…" : busy ? (queued ? "queued…" : "working…") : "";
    stateEl.classList.toggle("busy", Boolean(busy));
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
        if (!agentModels.length && Array.isArray(data.models)) agentModels = data.models;
        if (data.default_model) agentDefaultModel = data.default_model;
        if (data.model) {
          const session = agentSessions[agentId] || { messages: [] };
          agentSessions[agentId] = { ...session, model: data.model, mode: data.mode || session.mode };
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
      if (data.live?.started) startAgentPoll(agentId);
    }
  } catch (error) {
  } finally {
    agentLoadingIds.delete(agentId);
    if (agentTerminalOpen && activeAgent().id === agentId) renderAgentTerminal();
  }
}

function syncAgentTerminal() {
  if (!agentTerminalOpen) return;
  renderAgentTerminal();
}

function openAgentTerminal() {
  agentClosing = false;
  clearSingleDock();
  $(".desk-handle-ai")?.classList.remove("handle-vanished");
  agentTerminalOpen = true;
  document.body.classList.add("agent-terminal-open");
  renderAgentTerminal();
  const panel = $("#agent-terminal");
  panel?.classList.remove("sheet-closing");
  panel?.classList.add("sheet-opening");
  setTimeout(() => panel?.classList.remove("sheet-opening"), 320);
  setTimeout(() => $("#agent-input")?.focus(), 80);
}

function closeAgentTerminal() {
  if (!agentTerminalOpen || agentClosing) return;
  if (singleDock?.kind === "ai") clearSingleDock();
  const panel = $("#agent-terminal");
  if (!panel) {
    agentTerminalOpen = false;
    updateAgentSplitLayout();
    return;
  }
  agentClosing = true;
  const handle = $(".desk-handle-ai");
  handle?.classList.add("handle-vanished");
  panel.classList.add("sheet-closing");
  setTimeout(() => {
    if (!agentClosing) return;
    agentTerminalOpen = false;
    agentClosing = false;
    agentModelMenuOpen = false;
    agentModeMenuOpen = false;
    document.body.classList.remove("agent-terminal-open");
    panel.classList.remove("open", "sheet-closing");
    panel.setAttribute("aria-hidden", "true");
    document.querySelector(".terminal-tool")?.classList.remove("active");
    updateAgentSplitLayout();
    handle?.classList.remove("handle-vanished");
    positionDeskHandles();
  }, 240);
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
  if (singleDock) document.body.classList.remove(singleDockClass(singleDock.kind, singleDock.side));
  singleDock = { kind, side };
  document.body.classList.add(singleDockClass(kind, side));
  updateAgentSplitLayout();
  positionDeskHandles();
}

function clearSingleDock() {
  if (!singleDock) return;
  document.body.classList.remove(singleDockClass(singleDock.kind, singleDock.side));
  singleDock = null;
  updateAgentSplitLayout();
  positionDeskHandles();
}

function startPanelPreview(kind, panel, clientX, clientY) {
  if (panelPreview || !panel) return;
  if (doingPeekOpen) closeDoingPeek();
  panel.classList.remove("sheet-opening", "sheet-closing");
  const rect = panel.getBoundingClientRect();
  const scale = Math.min(0.34, Math.min(320 / Math.max(1, rect.width), 210 / Math.max(1, rect.height)));
  panel.classList.add("panel-shrinking");
  panel.style.setProperty("--card-scale", scale.toFixed(4));
  document.body.classList.add("panel-drag-mode");
  const hint = document.createElement("div");
  hint.className = "panel-drag-hint";
  hint.hidden = true;
  document.body.appendChild(hint);
  panelPreview = {
    kind, panel, hint,
    baseLeft: rect.left, baseTop: rect.top,
    width: rect.width, height: rect.height, scale,
    zone: "", outside: false,
    startX: clientX, startY: clientY, moved: false,
    wasDocked: Boolean(singleDock && singleDock.kind === kind),
  };
  updatePanelPreview(clientX, clientY);
}

function pointerOutsideWorkspace(clientX, clientY) {
  if (clientX < -12 || clientY < -12 || clientX > window.innerWidth + 12 || clientY > window.innerHeight + 12) return true;
  const desk = agentDeskRect();
  if (!desk) return true;
  return clientX < desk.left || clientX > desk.right || clientY < desk.top || clientY > desk.bottom;
}

const PANEL_ZONE_LABELS = { left: "靠左", right: "靠右", top: "靠上", bottom: "靠下" };

function updatePanelPreview(clientX, clientY) {
  const preview = panelPreview;
  if (!preview) return;
  const { panel, hint, baseLeft, baseTop, width, height, scale } = preview;
  const cardWidth = width * scale;
  const cardHeight = height * scale;
  panel.style.setProperty("--card-x", `${(clientX - cardWidth / 2) - baseLeft}px`);
  panel.style.setProperty("--card-y", `${(clientY - cardHeight / 2) - baseTop}px`);
  hint.style.left = `${Math.max(8, Math.min(window.innerWidth - 200, clientX + 24))}px`;
  hint.style.top = `${Math.max(8, Math.min(window.innerHeight - 36, clientY + 26))}px`;

  if (!preview.moved
    && Math.hypot(clientX - preview.startX, clientY - preview.startY) > 12) {
    preview.moved = true;
  }
  const desk = agentDeskRect();
  const outside = preview.moved && pointerOutsideWorkspace(clientX, clientY);
  let zone = "";
  if (preview.moved && !outside && desk) {
    const cx = desk.left + desk.width / 2;
    const cy = desk.top + desk.height / 2;
    const nearCenter = Math.abs(clientX - cx) < desk.width * 0.16
      && Math.abs(clientY - cy) < desk.height * 0.16;
    if (!nearCenter) {
      zone = [
        { side: "left", value: clientX - desk.left },
        { side: "right", value: desk.right - clientX },
        { side: "top", value: clientY - desk.top },
        { side: "bottom", value: desk.bottom - clientY },
      ].sort((a, b) => a.value - b.value)[0].side;
    }
  }
  preview.zone = zone;
  preview.outside = outside;
  document.body.classList.toggle("panel-drag-detach", outside);
  document.querySelectorAll(".agent-split-drop").forEach((drop) => {
    drop.classList.toggle("active", !outside && drop.dataset.agentSplitDrop === zone);
  });
  const bothOpen = agentTerminalOpen && !notesHidden;
  let text = "";
  if (outside) text = "独立窗口";
  else if (zone) text = bothOpen ? "分屏" : (PANEL_ZONE_LABELS[zone] || "");
  else if (preview.wasDocked && preview.moved) text = "全屏";
  hint.textContent = text;
  hint.hidden = !text;
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
    else updateAgentSplitLayout();
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
  const { kind, panel, hint, zone, outside, wasDocked } = preview;
  hint.remove();
  document.body.classList.remove("panel-drag-mode", "panel-drag-detach");
  document.querySelectorAll(".agent-split-drop").forEach((drop) => drop.classList.remove("active"));
  const clearShrink = () => {
    panel.classList.remove("panel-shrinking");
    panel.style.removeProperty("--card-x");
    panel.style.removeProperty("--card-y");
    panel.style.removeProperty("--card-scale");
  };
  if (!confirmDrop) {
    clearShrink();
    panel.classList.add("panel-unshrinking");
    setTimeout(() => panel.classList.remove("panel-unshrinking"), 280);
    return;
  }
  clearShrink();
  if (outside) {
    openDetachedPanel(kind, false, true);
    return;
  }
  if (zone) {
    applyPanelPreviewDrop(kind, zone);
    return;
  }
  // Center release: a docked card returns to fullscreen; a full card stays put.
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

async function handleAgentFiles(files) {
  const agent = activeAgent();
  if (!files.length || agentBusyIds.has(agent.id) || agentUploadingIds.has(agent.id)) return;
  agentUploadingIds.add(agent.id);
  renderAgentTerminal();
  try {
  const existing = agentAttachmentsFor(agent.id);
  const names = new Set(existing.map((file) => file.name));
  let bytes = existing.reduce((sum, file) => sum + (Number(file.size) || 0), 0);
  const payload = [];
  for (const file of files) {
    if (existing.length + payload.length >= 20) {
      agentAddNotice(agent, "Up to 20 context files can be kept for one task.");
      break;
    }
    if (file.size > 10 * 1024 * 1024) {
      agentAddNotice(agent, `${file.name} is larger than 10 MB and was not attached.`);
      continue;
    }
    if (bytes + file.size > 50 * 1024 * 1024 && !names.has(file.name)) {
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
    names.add(file.name);
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

async function sendAgentMessage() {
  const input = $("#agent-input");
  const message = input?.value.trim();
  if (!message) return;
  const agent = activeAgent();
  if (agentBusyIds.has(agent.id) || agentUploadingIds.has(agent.id)) return;
  if (!agentLoadedIds.has(agent.id)) await loadAgentSession(agent.id);
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
  agentLive[agent.id] = {};
  if (mode === "build") {
    if (!agentExecutingId) agentExecutingId = agent.id;
    else if (!agentExecQueue.includes(agent.id)) agentExecQueue.push(agent.id);
  }
  if (input) {
    input.value = "";
    input.style.height = "";
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
      agentSessions[agent.id] = {
        title: data.title || agent.title,
        messages: data.messages || [],
        model: data.model || model,
        mode: data.mode || mode,
        usage: data.usage || {},
      };
      if (Array.isArray(data.files)) agentAttachments[agent.id] = data.files;
      if (!agentModels.length && Array.isArray(data.models)) agentModels = data.models;
      agentLoadedIds.add(agent.id);
    } else {
      agentSessions[agent.id] = {
        ...agentSessions[agent.id],
        messages: [...(agentSessions[agent.id]?.messages || []), { role: "system", content: data.error || "The agent could not answer." }],
      };
    }
  } catch (error) {
    agentSessions[agent.id] = {
      ...agentSessions[agent.id],
      messages: [...(agentSessions[agent.id]?.messages || []), { role: "system", content: "Could not reach the local agent service." }],
    };
  } finally {
    agentBusyIds.delete(agent.id);
    stopAgentPoll(agent.id);
    if (mode === "build") {
      if (agentExecutingId === agent.id) agentExecutingId = agentExecQueue.shift() || null;
      else {
        const queued = agentExecQueue.indexOf(agent.id);
        if (queued >= 0) agentExecQueue.splice(queued, 1);
      }
    }
    renderAgentTerminal();
    setTimeout(() => $("#agent-input")?.focus(), 40);
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

function renderStage() {
  const stage = $("#stage");
  const prevSubScroll = $(".current-inner")?.scrollTop ?? 0;
  const category = selectedCategory();
  if (!category) {
    stage.innerHTML = `<div class="page-head"><div class="page-title banner-title" aria-label="Todos"><svg class="banner-icon" aria-hidden="true"><use href="#${themeSymbol("header")}"></use></svg></div><div class="page-head-title current-head-title quiet"><span class="page-title-name">No categories yet.</span></div></div>
      <div class="page-body">
        <section class="todos-section">
          <div class="current-half"></div>
          <div class="history-half"><div class="history-empty"></div></div>
        </section>
        <section class="notes-half floating-notes ${notesHidden ? "notes-hidden" : ""}" id="notes-half">${notesHtml()}</section>
        ${agentTerminalMarkup()}
        ${agentSplitUiMarkup()}
      </div>`;
    renderAgentTerminal();
    refreshTaskBoard();
    return;
  }
  stage.style.setProperty("--c", category.color);
  const todos = category.todos || [];
  const done = doneTodos(category);
  const current = todos.find((todo) => !todo.done) || null;
  const pendingSub = current?.subtasks?.find((subtask) => !subtask.done) || null;

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
      ? `<div class="history-subs" data-history-subs="${index}">${(todo.subtasks || []).map((subtask) => `<div class="history-subtask ${subtask.id === selectedSubtaskId ? "selected" : ""}" data-history-subtask-id="${esc(subtask.id)}" data-history-todo-id="${esc(todo.id)}">
          <span class="h-sub-fan"><span class="fan-stack"><svg class="fan-static" aria-hidden="true" viewBox="0 0 1024 1024"><use href="#fan"></use></svg><svg class="fan-rotor" aria-hidden="true" viewBox="0 0 1024 1024"><circle cx="493" cy="422" r="356" fill="#C8B9FC"></circle><g clip-path="url(#fan-wheel-clip)"><use href="#fan"></use></g></svg></span></span>
          <span class="h-sub-name">${esc(subtask.name)}</span>
          ${subtask.done ? `<svg class="h-sub-check" aria-hidden="true"><use href="#check-red"></use></svg>` : ""}
          ${settings.show_time_cost && subtask.done ? `<span class="h-sub-time">${esc(timeCostText(subtask))}</span>` : ""}
        </div>`).join("")}</div>`
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
    const subList = current.subtasks || [];
    const addSubtaskRow = addingSubtask && addingSubtaskTodoId === current.id
      ? `<div class="current-subtask adding-subtask" data-add-subtask-row>
          <span class="sub-fan" aria-hidden="true"><svg viewBox="0 0 1024 1024"><use href="#fan"></use></svg></span>
          <input id="subtask-name-input" class="subtask-name-input" type="text" placeholder="Start new subtask ..." autocomplete="off" spellcheck="false" aria-label="Name subtask">
        </div>`
      : "";
    const filledTaskRows = subList.map((subtask) => {
      const next = pendingSub && subtask.id === pendingSub.id;
      const selected = subtask.id === selectedSubtaskId;
      const fan = subtask.done
        ? `<span class="sub-fan done" aria-hidden="true"><span class="fan-stack"><svg class="fan-static" aria-hidden="true" viewBox="0 0 1024 1024"><use href="#fan"></use></svg><svg class="fan-rotor" aria-hidden="true" viewBox="0 0 1024 1024"><circle cx="493" cy="422" r="356" fill="#C8B9FC"></circle><g clip-path="url(#fan-wheel-clip)"><use href="#fan"></use></g></svg></span></span>`
        : `<button class="sub-fan sub-fan-action" data-action="complete-subtask" data-todo-id="${esc(current.id)}" data-subtask-id="${esc(subtask.id)}" aria-label="Finish ${esc(subtask.name)}"><span class="fan-stack"><svg class="fan-static" aria-hidden="true" viewBox="0 0 1024 1024"><use href="#fan"></use></svg><svg class="fan-rotor" aria-hidden="true" viewBox="0 0 1024 1024"><circle cx="493" cy="422" r="356" fill="#C8B9FC"/><g clip-path="url(#fan-wheel-clip)"><use href="#fan"></use></g></svg></span></button>`;
      return `<div class="current-subtask ${subtask.done ? "done" : "pending"} ${next ? "next" : ""} ${selected ? "selected" : ""}" data-subtask-id="${esc(subtask.id)}">
        ${fan}
        <span class="sub-name">${esc(subtask.name)}</span>
        ${subtask.done ? `<svg class="sub-done-check" aria-hidden="true"><use href="#check-red"></use></svg>` : ""}
      </div>`;
    }).join("");
    const subtaskFillerCount = Math.max(0, 7 - subList.length - (addSubtaskRow ? 1 : 0));
    const subtaskFillers = Array.from({ length: subtaskFillerCount }, () => '<div class="current-subtask current-subtask-filler" aria-hidden="true"></div>').join("");
    const subRows = filledTaskRows + addSubtaskRow + subtaskFillers;
    metaHtml = `<div class="current-inner" data-current-todo="${esc(current.id)}">
      ${subRows ? `<div class="current-subtasks">${subRows}</div>` : ""}
    </div>`;
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
    headTitle = `<input id="new-todo-title" class="new-todo-title" type="text" placeholder="Nothing to do..." autocomplete="off" spellcheck="false" aria-label="New task">`;
  }

  const pageArt = postcardArtHtml();
  stage.innerHTML = `${pageArt ? `<div class="page-art" aria-hidden="true">${pageArt}</div>` : ""}<div class="page-head"><div class="page-title banner-title" aria-label="Todos"><svg class="banner-icon" aria-hidden="true"><use href="#${themeSymbol("header")}"></use></svg></div>${headTitle}</div>
    <div class="page-body">
      <section class="todos-section">
        <div class="history-half">${history}</div>
        <div class="current-half">${metaHtml}</div>
      </section>
      <section class="notes-half floating-notes ${notesHidden ? "notes-hidden" : ""}" id="notes-half">${notesHtml()}</section>
      ${agentTerminalMarkup()}
      ${agentSplitUiMarkup()}
    </div>`;

  renderAgentTerminal();
  refreshTaskBoard();
  setupNotesPanel();
  positionTimerRoot();
  if (!doingPeekOpen) refreshDoingZone();
  requestAnimationFrame(() => {
    refreshNotesSwipeLine();
    if (doingPeekOpen) updateDoingPeek();
  });
  const freshReel = $("#history-reel");
  if (freshReel) freshReel.scrollTop = historyScrollTop ?? 0;
  requestAnimationFrame(() => {
    syncTaskScrollers();
    const inner = $(".current-inner");
    if (inner) {
      if (revealNewSubtask) {
        inner.scrollTop = inner.scrollHeight;
        revealNewSubtask = false;
      } else if (prevSubScroll > 0) {
        inner.scrollTop = prevSubScroll;
      }
    }
    if (celebrateNewSubtask) {
      celebrateNewSubtask = false;
      requestAnimationFrame(() => {
        const rows = [...document.querySelectorAll(".current-subtask[data-subtask-id]")];
        AudioFX.splash();
        spawnPixelSplash(rows[rows.length - 1]);
      });
    }
  });
  if (addingSubtask) {
    setTimeout(() => {
      const input = $("#subtask-name-input");
      if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
    }, 30);
  }
  scheduleCustomCaret();
  const subtaskScroller = $(".current-inner");
  if (subtaskScroller) {
    subtaskScroller.addEventListener("scroll", () => {
      if (!subtaskScroller.classList.contains("task-scrollable")) return;
      AudioFX.subtaskFlow();
    }, { passive: true });
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
}

const TYPEWRITER_SHIFT = 20;

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
    // The ruled lines must stay on the fixed paper grid.
    row.style.transform = "none";
    row.style.filter = "none";
    if (!overflowing) {
      row.style.setProperty("--row-opacity", "1");
      row.style.opacity = "1";
      row.style.fontWeight = "400";
      return;
    }
    if (row.classList.contains("cursor")) {
      row.style.setProperty("--row-opacity", "1");
      row.style.opacity = "1";
      row.style.fontWeight = "700";
      return;
    }
    row.style.setProperty("--row-opacity", String(Math.max(0.78, 1 - a * 0.22)));
    row.style.opacity = String(Math.max(0.62, 1 - a * 0.38));
    row.style.fontWeight = a < 0.6 ? "700" : "400";
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
          <input id="completed-search" class="log-search" type="search" placeholder="Search the chronicle…" autocomplete="off">
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
  AudioFX.paper();
}

function renderCompletedLogContent() {
  const list = $("#completed-log-list");
  if (!list) return;
  const current = [];
  for (const category of state.data.categories) {
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
    : `<div class="log-empty">${query ? "No matching completed todos." : "No completed todos yet."}</div>`;
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

function openContextMenu(x, y, items) {
  closeContextMenu();
  const menu = document.createElement("div");
  menu.className = "context-menu";
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
    button.className = "context-item";
    button.textContent = item.label;
    button.disabled = Boolean(item.disabled);
    if (item.danger) button.style.color = "var(--red)";
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

function showCurrentTodoMenu(x, y) {
  const category = selectedCategory();
  const current = category?.todos.find((todo) => !todo.done);
  if (!current) return;
  openContextMenu(x, y, [
    { label: "Edit note", run: () => editCurrentNote() },
    { label: "Rename todo", run: () => handleAction("rename-todo", { dataset: { id: current.id } }) },
  ]);
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
  updateHistorySelection();
  updateSubtaskSelection();
  renderNotesPanel();
}

async function copyPlainText(text) {
  const value = String(text || "");
  if (!value) return;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      toast("Name copied");
      return;
    } catch (error) {}
  }
  try {
    const helper = document.createElement("textarea");
    helper.value = value;
    helper.style.cssText = "position:fixed;left:-9999px;top:0";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
    toast("Name copied");
  } catch (error) {
    toast("Could not copy name", true);
  }
}

function showCurrentSubtaskMenu(x, y, subtaskId) {
  const category = selectedCategory();
  const current = category?.todos.find((todo) => !todo.done);
  const subtask = current?.subtasks?.find((item) => item.id === subtaskId);
  if (!subtask) return;
  const items = [
    { label: "Copy name", run: () => copyPlainText(subtask.name) },
    { label: "Edit note", run: () => selectSubtaskNote(current.id, subtask.id) },
  ];
  if (subtask.done) items.push({ label: "Completed · locked", disabled: true });
  openContextMenu(x, y, items);
}

function showHistoryMenu(x, y, index) {
  const todo = doneTodos(selectedCategory())[Number(index)];
  if (!todo) return;
  openContextMenu(x, y, [
    { label: "Copy name", run: () => copyPlainText(todo.name) },
    { label: "Edit note", run: () => editHistoryNote(todo.id) },
    { label: "Completed · name locked", disabled: true },
  ]);
}

function showHistorySubtaskMenu(x, y, todoId, subtaskId) {
  const todo = doneTodos(selectedCategory()).find((item) => item.id === todoId);
  const subtask = (todo?.subtasks || []).find((item) => item.id === subtaskId);
  if (!subtask) return;
  openContextMenu(x, y, [
    { label: "Copy name", run: () => copyPlainText(subtask.name) },
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
  openContextMenu(x, y, [
    { label: "Rename category", run: () => handleAction("rename-category", { dataset: { id: category.id } }) },
    {
      label: "Delete category",
      disabled: category.todos.length > 0,
      danger: true,
      run: () => handleAction("delete-category", { dataset: { id: category.id } }),
    },
  ]);
}

function finishedToast() {
  let stack = $(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }
  const node = document.createElement("div");
  node.className = "toast finished-toast";
  node.innerHTML = `<span>Finished!</span><img class="toast-confetti" src="/confetti.svg" alt=""><img class="toast-confetti" src="/confetti.svg" alt="">`;
  stack.appendChild(node);
  setTimeout(() => {
    node.style.opacity = "0";
    node.style.transform = "translateY(-6px)";
    node.style.transition = ".25s ease";
    setTimeout(() => node.remove(), 280);
  }, 2400);
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

function doingEntries() {
  const entries = [];
  for (const category of state.data?.categories || []) {
    for (const todo of category.todos || []) {
      if (!todo.done) entries.push({ category, todo });
    }
  }
  return entries;
}

function pendingSubtasks(todo) {
  return (todo.subtasks || []).filter((subtask) => !subtask.done);
}

function doingSubtaskHtml(entry, subtask) {
  return `<button class="doing-sub" type="button" data-doing-subtask="${esc(subtask.id)}" data-doing-todo="${esc(entry.todo.id)}" data-category-id="${esc(entry.category.id)}">
    <span class="doing-fan" aria-hidden="true"><svg viewBox="0 0 1024 1024"><use href="#fan"></use></svg></span>
    <span class="doing-sub-name">${esc(subtask.name)}</span>
  </button>`;
}

function doingTodoHtml(entry) {
  const { category, todo } = entry;
  const subs = todo.subtasks || [];
  const pending = pendingSubtasks(todo);
  const expanded = doingExpandedTodoIds.has(todo.id);
  const active = category.id === state.selectedCategoryId;
  return `<div class="doing-item ${active ? "active" : ""} ${expanded ? "expanded" : ""}" data-doing-item="${esc(todo.id)}">
    <div class="doing-head" data-doing-jump="${esc(todo.id)}" data-category-id="${esc(category.id)}">
      <button class="doing-mark" type="button" data-doing-expand="${esc(todo.id)}" aria-label="Show pending subtasks for ${esc(todo.name)}" aria-expanded="${expanded ? "true" : "false"}">
        <svg viewBox="0 0 1024 1024" aria-hidden="true"><use href="#doing-mark"></use></svg>
      </button>
      <button class="doing-name" type="button" data-doing-jump="${esc(todo.id)}" data-category-id="${esc(category.id)}">${esc(todo.name)}</button>
      <span class="doing-count">${pending.length}/${subs.length}</span>
    </div>
    ${expanded && pending.length ? `<div class="doing-subs">${pending.map((subtask) => doingSubtaskHtml(entry, subtask)).join("")}</div>` : ""}
  </div>`;
}

function doingPeekMarkup(entries) {
  const theme = THEMES[currentPostcardId()] || THEMES.violet;
  return `<div class="doing-art" aria-hidden="true">${theme.art(theme)}</div>
  <div class="doing-kicker">
    <button class="doing-pin" type="button" data-doing-pin aria-label="Close Doing card" title="Close">
      <svg viewBox="0 0 1024 1024" aria-hidden="true"><use href="#close-circle"></use></svg>
    </button>
    <span class="doing-label">Doing ...</span>
  </div>
    <div class="doing-list">${entries.map(doingTodoHtml).join("")}</div>`;
}

function doingPeekStateKey(entries) {
  return `${currentPostcardId()}|${[...doingExpandedTodoIds].join(",")}|${state.selectedCategoryId || ""}|${entries.map(({ todo }) =>
    `${todo.id}:${todo.name}:${(todo.subtasks || []).length}:${pendingSubtasks(todo).map((subtask) => subtask.id).join(",")}`
  ).join(";")}`;
}

function refreshDoingZone() {
  const half = $(".current-half");
  if (!half) { doingZone = null; return; }
  const rect = half.getBoundingClientRect();
  doingCardWidth = Math.round(Math.min(420, Math.max(320, rect.width * 0.5)));
  doingCardTop = Math.max(8, rect.top - 40);
  doingCardHeight = Math.min(560, Math.max(280, window.innerHeight - doingCardTop - 12));
  // Only the subtask column's right border, and only within its own height:
  // the lower three quarters, never below the column's bottom line.
  doingZone = {
    left: rect.right - 28,
    right: rect.right,
    top: rect.top + rect.height / 4,
    bottom: rect.bottom,
  };
}

function positionDoingPeek() {
  const panel = $("#doing-peek");
  const half = $(".current-half");
  if (!panel || !half) return;
  if (!doingZone) refreshDoingZone();
  if (!doingZone) return;
  const rect = half.getBoundingClientRect();
  const top = doingCardTop;
  panel.style.width = `${doingCardWidth}px`;
  panel.style.right = `${Math.max(10, window.innerWidth - rect.right + 10)}px`;
  panel.style.top = `${top}px`;
  panel.style.height = `${doingCardHeight}px`;
  panel.style.maxHeight = `${Math.max(180, window.innerHeight - top - 12)}px`;
  const rightOffset = Math.max(10, window.innerWidth - rect.right + 10);
  const cardRight = window.innerWidth - rightOffset;
  doingPanelRect = {
    left: cardRight - doingCardWidth,
    right: cardRight,
    top,
    bottom: top + doingCardHeight,
  };
}

function bindDoingCard(list) {
  if (!list || list.dataset.cardBound) return;
  list.dataset.cardBound = "1";
  let active = false;
  let frame = 0;
  let stopTimer = 0;
  let phase = 0;
  let pointerY = null;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const rows = () => [...list.querySelectorAll(".doing-head, .doing-sub")];
  const settle = () => {
    rows().forEach((row) => {
      row.style.transition = "transform 0.26s cubic-bezier(0.22, 0.8, 0.24, 1)";
      row.style.transform = "translateY(0)";
      clearTimeout(row._pianoReset);
      row._pianoReset = setTimeout(() => {
        if (active) return;
        row.style.transition = "";
        row.style.transform = "";
        row._pianoReset = 0;
      }, 320);
    });
  };
  const step = () => {
    if (!active) return;
    phase += 0.16;
    const listRect = list.getBoundingClientRect();
    const focus = pointerY === null
      ? list.scrollTop + list.clientHeight / 2
      : pointerY;
    rows().forEach((row, index) => {
      const center = row.getBoundingClientRect().top - listRect.top + list.scrollTop + row.offsetHeight / 2;
      const influence = Math.max(0, 1 - Math.abs(center - focus) / 110);
      const y = Math.sin(phase + index * 0.62) * 5 * Math.pow(influence, 1.4);
      row.style.transition = "none";
      row.style.transform = influence > 0.01 ? `translateY(${y.toFixed(2)}px)` : "";
    });
    frame = requestAnimationFrame(step);
  };
  list.addEventListener("pointermove", (event) => {
    const rect = list.getBoundingClientRect();
    pointerY = event.clientY - rect.top + list.scrollTop;
  }, { passive: true });
  list.addEventListener("pointerleave", () => { pointerY = null; }, { passive: true });
  list.addEventListener("scroll", () => {
    AudioFX.cardWind();
    if (reduce) return;
    if (!active) {
      active = true;
      phase = list.scrollTop * 0.02;
      frame = requestAnimationFrame(step);
    }
    clearTimeout(stopTimer);
    stopTimer = setTimeout(() => {
      active = false;
      cancelAnimationFrame(frame);
      frame = 0;
      settle();
    }, 140);
  }, { passive: true });
}

function updateDoingPeek(force = false) {
  const entries = doingEntries();
  let panel = $("#doing-peek");
  if (!entries.length) {
    if (panel) panel.remove();
    doingPeekOpen = false;
    doingExpandedTodoIds.clear();
    doingPeekSignature = "";
    doingPanelRect = null;
    return;
  }
  if (!panel) {
    panel = document.createElement("aside");
    panel.id = "doing-peek";
    panel.className = "doing-peek";
    panel.setAttribute("aria-label", "Doing");
    panel.addEventListener("pointerenter", () => {
      clearTimeout(doingPeekOpenTimer);
    });
    document.body.appendChild(panel);
  }
  const key = doingPeekStateKey(entries);
  if (force || key !== doingPeekSignature) {
    const previousList = panel.querySelector(".doing-list");
    const previousScroll = previousList ? previousList.scrollTop : 0;
    doingPeekSignature = key;
    panel.innerHTML = doingPeekMarkup(entries);
    const nextList = panel.querySelector(".doing-list");
    if (nextList) nextList.scrollTop = previousScroll;
  }
  panel.classList.toggle("open", doingPeekOpen);
  const list = panel.querySelector(".doing-list");
  bindDoingCard(list);
  positionDoingPeek();
}

function openDoingPeek() {
  clearTimeout(doingPeekOpenTimer);
  if (!doingEntries().length) return;
  if (!doingPeekOpen) refreshDoingZone();
  updateDoingPeek();
  const panel = $("#doing-peek");
  if (!panel) return;
  doingPeekOpen = true;
  positionDoingPeek();
  panel.classList.add("open");
}

function closeDoingPeek() {
  clearTimeout(doingPeekOpenTimer);
  if (!doingPeekOpen) return;
  doingPeekOpen = false;
  doingExpandedTodoIds.clear();
  const panel = $("#doing-peek");
  if (panel) panel.classList.remove("open");
}

function pointInDoingZone(x, y) {
  if (!doingZone) return false;
  return x >= doingZone.left
    && x <= doingZone.right + 16
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
  if (doingExpandedTodoIds.has(todoId)) doingExpandedTodoIds.delete(todoId);
  else doingExpandedTodoIds.add(todoId);
  updateDoingPeek();
  if (categoryId && categoryId !== state.selectedCategoryId) activateDoingCategory(categoryId);
}

function jumpToDoingSubtask(todoId, categoryId, subtaskId) {
  AudioFX.categoryTap();
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
  updateSubtaskSelection();
  renderNotesPanel();
  requestAnimationFrame(() => {
    const row = document.querySelector(`.current-subtask[data-subtask-id="${CSS.escape(subtaskId)}"]`);
    const inner = $(".current-inner");
    if (!row || !inner) return;
    const rowRect = row.getBoundingClientRect();
    const innerRect = inner.getBoundingClientRect();
    const offset = inner.scrollTop + (rowRect.top - innerRect.top) - inner.clientHeight / 2 + rowRect.height / 2;
    inner.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
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

function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const max = 1100;
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
        context.fillStyle = "#f7eedb";
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

function activePictureNote() {
  const active = activeNoteTarget();
  const owner = noteOwner(active);
  if (!active || !owner) return null;
  return { active, owner };
}

async function addNotePictures(files) {
  const target = activePictureNote();
  if (!target) return;
  const list = Array.from(files || []).slice(0, 12);
  if (!list.length) return;
  const compressed = (await Promise.all(list.map((file) => compressImage(file)))).filter(Boolean);
  if (!compressed.length) {
    toast("Could not read those images", true);
    return;
  }
  const { active, owner } = target;
  const previous = todoImages(owner);
  owner.images = [...previous, ...compressed];
  const payload = { id: active.todo.id, images: compressed };
  if (active.kind === "subtask" && active.subtask) payload.subtask_id = active.subtask.id;
  const result = await persistAction("add_images", payload);
  if (!result?.ok) {
    owner.images = previous;
    renderNotesPanel();
    toast(result?.error || "Could not save the images", true);
    return;
  }
  renderNotesPanel();
  setStatus(`${compressed.length} picture${compressed.length === 1 ? "" : "s"} added`);
}

function showNotePictures() {
  const target = activePictureNote();
  if (!target) return;
  const images = todoImages(target.owner);
  if (!images.length) {
    toast("No pictures added yet");
    return;
  }
  openPictureGallery(images);
}

function openPictureGallery(images) {
  if (!images.length) return;
  document.activeElement?.blur?.();
  $("#modal-root").innerHTML = `<div class="picture-gallery-stage">
    <button class="image-close" data-gallery-close>×</button>
    <div class="picture-gallery">
      ${images.map((src, index) => `<button class="gallery-thumb" draggable="true" data-gallery-image="${index}"><img src="${esc(src)}" alt="Added picture ${index + 1}" draggable="false"></button>`).join("")}
    </div>
    <button class="picture-trash" data-gallery-trash>
      <svg aria-hidden="true"><use href="#trash"></use></svg>
      <span>drag a picture here to delete</span>
    </button>
  </div>`;
  const stage = $(".picture-gallery-stage");
  const trash = $("[data-gallery-trash]");
  setTimeout(() => $("[data-gallery-close]")?.focus(), 20);
  stage.addEventListener("mousedown", (event) => {
    if (event.target === stage || event.target.closest("[data-gallery-close]")) {
      $("#modal-root").innerHTML = "";
      return;
    }
    const thumb = event.target.closest("[data-gallery-image]");
    if (thumb) {
      const index = Number(thumb.dataset.galleryImage);
      if (images[index]) openImageLightbox(images[index]);
    }
  });
  stage.addEventListener("dragstart", (event) => {
    const thumb = event.target.closest("[data-gallery-image]");
    if (!thumb || !event.dataTransfer) return;
    event.dataTransfer.setData("text/plain", thumb.dataset.galleryImage);
    event.dataTransfer.effectAllowed = "move";
    thumb.classList.add("dragging");
  });
  stage.addEventListener("dragend", () => {
    document.querySelectorAll(".gallery-thumb.dragging").forEach((node) => node.classList.remove("dragging"));
    trash?.classList.remove("over");
  });
  trash?.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    trash.classList.add("over");
  });
  trash?.addEventListener("dragleave", () => trash.classList.remove("over"));
  trash?.addEventListener("drop", (event) => {
    event.preventDefault();
    trash.classList.remove("over");
    const index = Number(event.dataTransfer?.getData("text/plain"));
    if (Number.isInteger(index)) removeGalleryImage(index);
  });
}

async function removeGalleryImage(index) {
  const target = activePictureNote();
  if (!target) return;
  const { active, owner } = target;
  const images = todoImages(owner);
  if (!Number.isInteger(index) || index < 0 || index >= images.length) return;
  const payload = { id: active.todo.id, index };
  if (active.kind === "subtask" && active.subtask) payload.subtask_id = active.subtask.id;
  const result = await persistAction("remove_image", payload);
  if (!result?.ok) {
    toast(result?.error || "Could not remove the picture", true);
    return;
  }
  const remaining = images.slice();
  remaining.splice(index, 1);
  owner.images = remaining;
  owner.image = remaining[0] || "";
  renderNotesPanel();
  if (remaining.length) openPictureGallery(remaining);
  else $("#modal-root").innerHTML = "";
  setStatus("Picture removed");
}

function openImageLightbox(src) {
  if (!src) return;
  document.activeElement?.blur?.();
  $("#modal-root").innerHTML = `<div class="image-stage"><button class="image-close" data-image-close>×</button><img src="${esc(src)}" alt="Saved todo image"></div>`;
  const stage = $(".image-stage");
  setTimeout(() => $(".image-close")?.focus(), 20);
  stage.addEventListener("mousedown", (event) => {
    if (event.target === stage || event.target.closest("[data-image-close]")) {
      $("#modal-root").innerHTML = "";
    }
  });
}

function currentCategoryById(id) {
  return state.data.categories.find((category) => category.id === id) || null;
}

async function handleAction(actionName, element) {
  if (actionName === "show-completed") { AudioFX.bassFade(); openCompletedLog(); return; }
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
  if (actionName === "open-trash") { openTrashDrawer(); return; }
  if (actionName === "close-trash") { closeTrashDrawer(); return; }
  if (actionName === "clear-trash") { clearTrash(); return; }
  if (actionName === "open-terminal") { toggleAgentTerminal(); return; }
  if (actionName === "close-terminal") { closeAgentTerminal(); return; }
  if (actionName === "clear-agent") { clearAgent(); return; }
  if (actionName === "open-settings") { openSettings(); return; }
  if (actionName === "close-settings") { closeSettings(); return; }
  if (actionName === "toggle-show-clock") {
    settings.show_clock = !settings.show_clock;
    saveSettings();
    applySettings();
    renderSettings();
    return;
  }
  if (actionName === "toggle-postcard-family") {
    themeFamiliesOpen = true;
    themeFamilyOpen = !themeFamilyOpen;
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
  if (actionName === "toggle-caret-blink") {
    settings.caret_blink = !settings.caret_blink;
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
  if (actionName === "open-timer") { AudioFX.timerTap(); openFocusTimer(); return; }
  if (actionName === "open-timer-achievement") { AudioFX.guitarPluck(); openFocusAchievements(); return; }
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
  if (actionName === "add-picture") { $("#note-image-input")?.click(); return; }
  if (actionName === "show-pictures") { showNotePictures(); return; }
  if (actionName === "add-category") {
    const name = await promptDialog({ title: "Name a new space", message: "A place for a kind of work, a kind of life.", placeholder: "e.g. Literature", confirmLabel: "Add", sound: "train" });
    if (name) await action("add_category", { name });
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
      if (result?.ok) AudioFX.confirmCarriage();
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
    AudioFX.categoryTap();
    const todoId = element.dataset.todoId;
    const subtaskId = element.dataset.subtaskId;
    const category = selectedCategory();
    const todo = category?.todos.find((item) => item.id === todoId);
    const subtask = todo?.subtasks?.find((item) => item.id === subtaskId);
    if (!subtask) return;
    // Let the fan finish its spin before the confirmation covers it.
    await new Promise((resolve) => setTimeout(resolve, 300));
    const ok = await confirmDialog({ kicker: "A small completion", title: "Finish subtask", message: `Finish “${subtask.name}”?`, confirmLabel: "Finish" });
    if (!ok) return;
    const result = await action("complete_subtask", { todo_id: todoId, subtask_id: subtaskId });
    if (result.ok) {
      AudioFX.itemGet();
      finishedToast();
      const check = document.querySelector(`.current-subtask[data-subtask-id="${CSS.escape(subtaskId)}"] .sub-done-check`);
      if (check) {
        check.classList.add("check-in");
        setTimeout(() => check.classList.remove("check-in"), 420);
      }
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

function postcardArticleHtml(card) {
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
    ? items.map((item) => `<li class="pc-item"><span class="pc-trophy">${completedIcon()}</span><span class="pc-cat" style="--cat:${esc(item.color || theme.accent)};--cat-bg:${colorTint(item.color || theme.accent)}"><span class="pc-cat-dot"></span>${esc(item.category || "Untitled")}</span><span class="pc-name">${esc(item.name)}</span></li>`).join("")
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
  $("#modal-root").innerHTML = `
    <div class="postcard-stage">
      <div class="postcard-deck">
        ${postcardArticleHtml(card)}
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
  let saved = null;
  if (state.data?.settings && typeof state.data.settings === "object") {
    saved = state.data.settings;
  } else {
    try { saved = JSON.parse(localStorage.getItem("neotodo.settings") || "null"); } catch (error) {}
  }
  settings = { ...DEFAULT_SETTINGS, ...(saved && typeof saved === "object" ? saved : {}) };
  settings.theme = "postcard";
  if (settings.postcard !== "random" && !THEMES[settings.postcard]) settings.postcard = "violet";
  if (!THEMES[settings.resolved_postcard]) {
    settings.resolved_postcard = THEMES[settings.postcard] ? settings.postcard : "violet";
  }
  if (settings.postcard !== "random" && THEMES[settings.postcard]) {
    settings.resolved_postcard = settings.postcard;
  }
  if (settings.postcard === "random") settings.postcard = settings.resolved_postcard || "violet";
  const savedLight = saved && typeof saved === "object" ? saved.light_postcard : undefined;
  const savedDark = saved && typeof saved === "object" ? saved.dark_postcard : undefined;
  if (!THEMES[savedLight] || postcardIsDark(savedLight)) {
    settings.light_postcard = postcardIsDark(settings.resolved_postcard) ? "ocean" : settings.resolved_postcard;
  }
  if (!THEMES[savedDark] || !postcardIsDark(savedDark)) {
    settings.dark_postcard = postcardIsDark(settings.resolved_postcard) ? settings.resolved_postcard : "tokyo";
  }
  settings.scale = Math.min(1.25, Math.max(0.85, Number(settings.scale) || 1));
  settings.show_time_cost = settings.show_time_cost === true;
  settings.show_clock = settings.show_clock !== false;
  settings.focus_count = Math.max(0, Math.floor(Number(settings.focus_count) || 0));
  settings.title_offset = Math.max(-500, Math.min(500, Math.round(Number(settings.title_offset) || 0)));
  settings.title_icon_size = Math.max(24, Math.min(96, Math.round(Number(settings.title_icon_size) || 48)));
  if (!Array.isArray(settings.focus_log)) settings.focus_log = [];
  if (!FONT_OPTIONS.some((font) => font.id === settings.font)) settings.font = "serif";
  if (!FONT_OPTIONS.some((font) => font.id === settings.note_font)) settings.note_font = "serif";
  settings.caret_blink = settings.caret_blink === true;
  if (settings.caret_shape !== "block") settings.caret_shape = "line";
  if (!/^#[0-9a-f]{6}$/i.test(String(settings.caret_color || ""))) settings.caret_color = "#1b1b1b";
  settings.note_material = settings.note_material === "blur" ? "blur" : "paper";
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
  settings.note_blur = Math.min(40, Math.max(0, Math.round(Number(settings.note_blur) || 16)));
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

function notePalette(theme) {
  const base = theme.paper2 || theme.paper || "#f3e7d2";
  const dark = hexLuminance(base) < 0.48;
  const paper = dark ? mixHex(base, "#f6ecd9", 0.87) : mixHex(base, "#fbf3e4", 0.72);
  const ink = dark ? "#3b2c28" : (hexLuminance(theme.ink) < 0.5 ? theme.ink : "#3b2c28");
  const accent = dark ? mixHex(theme.accent, "#3b2c28", 0.3) : (hexLuminance(theme.accent) > 0.62 ? mixHex(theme.accent, "#3b2c28", 0.28) : theme.accent);
  return {
    paper,
    ink,
    muted: mixHex(ink, paper, 0.46),
    rule: `rgba(${hexToRgb(ink)}, .15)`,
    accent,
    accent2: dark ? mixHex(theme.accent2, "#3b2c28", 0.28) : theme.accent2,
  };
}

function saveSettings() {
  try { localStorage.setItem("neotodo.settings", JSON.stringify(settings)); } catch (error) {}
  clearTimeout(settingsSaveTimer);
  settingsSaveTimer = setTimeout(() => {
    settingsSaveTimer = null;
    if (state.data) persistAction("save_settings", { settings });
  }, 280);
}

function updateArchiveIcon() {
  const use = $("#archive-icon-use");
  if (use) use.setAttribute("href", `#${themeSymbol("archive")}`);
}

function applySettings() {
  const root = document.documentElement;
  settings.theme = "postcard";
  root.dataset.theme = "postcard";
  root.dataset.noteMaterial = settings.note_material === "blur" ? "blur" : "paper";
  let noteBg = "";
  if (settings.note_background === "__custom") noteBg = settings.note_background_image;
  else noteBg = NOTE_BG_PRESETS[settings.note_background] || "";
  root.style.setProperty("--note-bg-image", noteBg ? `url("${noteBg}")` : "none");
  root.style.setProperty("--note-blur", `${settings.note_blur}px`);
  root.dataset.font = settings.font;
  root.dataset.noteFont = settings.note_font;
  root.style.setProperty("--user-scale", String(settings.scale));
  root.style.setProperty("--title-offset", `${settings.title_offset}px`);
  root.style.setProperty("--title-icon-size", `${settings.title_icon_size}px`);
  document.body.classList.toggle("clock-hidden", !settings.show_clock);
  document.body.classList.add("custom-caret");
  scheduleCustomCaret();
  updateTopClock();
  const backdrop = $("#postcard-backdrop");
  {
    const postcard = THEMES[currentPostcardId()] || THEMES.violet;
    root.dataset.postcard = currentPostcardId();
    root.dataset.postcardDark = postcardIsDark(currentPostcardId()) ? "true" : "false";
    const accent = readableAccent(postcard, postcard.accent);
    const accent2 = readableAccent(postcard, postcard.accent2);
    root.style.setProperty("--pc-accent", accent);
    root.style.setProperty("--pc-accent-2", accent2);
    root.style.setProperty("--pc-accent-rgb", hexToRgb(accent));
    root.style.setProperty("--pc-accent2-rgb", hexToRgb(accent2));
    root.style.setProperty("--pc-glow", postcard.glow || "rgba(184,140,255,.24)");
    root.style.setProperty("--pc-paper", postcard.paper);
    root.style.setProperty("--pc-paper-rgb", hexToRgb(postcard.paper));
    root.style.setProperty("--pc-paper2", postcard.paper2);
    const doingPaper = postcardIsDark(currentPostcardId())
      ? mixHex(postcard.paper, "#ffffff", 0.10)
      : postcard.paper;
    const doingPaper2 = postcardIsDark(currentPostcardId())
      ? mixHex(postcard.paper2, "#ffffff", 0.14)
      : postcard.paper2;
    root.style.setProperty("--doing-paper", doingPaper);
    root.style.setProperty("--doing-paper2", doingPaper2);
    root.style.setProperty("--pc-ink", postcard.ink);
    root.style.setProperty("--pc-muted", postcard.muted);
    root.style.setProperty("--pc-border", postcard.border || postcard.accent2);
    root.style.setProperty("--pc-stamp", postcard.stamp || postcard.accent);
    root.style.setProperty("--pc-line", `rgba(${hexToRgb(postcard.ink)}, .16)`);
    root.style.setProperty("--pc-rule", `rgba(${hexToRgb(postcard.ink)}, .13)`);
    const note = notePalette(postcard);
    root.style.setProperty("--notes-mask", note.paper);
    root.style.setProperty("--note-paper", note.paper);
    root.style.setProperty("--note-ink", note.ink);
    root.style.setProperty("--note-muted", note.muted);
    root.style.setProperty("--note-rule", note.rule);
    root.style.setProperty("--note-accent", note.accent);
    root.style.setProperty("--note-accent-2", note.accent2);
    if (backdrop) {
      backdrop.hidden = false;
      backdrop.innerHTML = postcard.art(postcard);
    }
  }
  const achievement = $("#achievement-icon-use");
  if (achievement) achievement.setAttribute("href", "#headphone");
  const topAchievement = $("#top-achievement-use");
  if (topAchievement) topAchievement.setAttribute("href", "#headphone");
  updateArchiveIcon();
}

function openSettings(tab = "appearance") {
  settingsTab = tab;
  themeModeTab = null;
  themeFamiliesOpen = false;
  themeFamilyOpen = false;
  fontPanelsOpen.body = false;
  fontPanelsOpen.note = false;
  AudioFX.paper();
  $("#modal-root").innerHTML = '<div class="settings-stage"><div class="settings-panel" role="dialog" aria-modal="true" aria-label="Settings"></div></div>';
  const stage = $(".settings-stage");
  stage.addEventListener("mousedown", (event) => {
    if (event.target === stage) closeSettings();
  });
  renderSettings();
}

function closeSettings() {
  $("#modal-root").innerHTML = "";
}

function appearanceSettings() {
  const lightIds = POSTCARD_IDS.filter((id) => !postcardIsDark(id));
  const darkIds = POSTCARD_IDS.filter(postcardIsDark);
  const currentId = currentPostcardId();
  const currentTheme = THEMES[currentId] || THEMES.violet;
  const currentMode = postcardIsDark(currentId) ? "Dark" : "Light";
  const activeMode = themeModeTab === "dark" || themeModeTab === "light"
    ? themeModeTab
    : (postcardIsDark(currentId) ? "dark" : "light");
  const modeIds = activeMode === "dark" ? darkIds : lightIds;
  const modeName = (mode) => mode === "dark" ? "Dark" : "Light";
  const cachedName = (mode) => postcardName(mode === "dark" ? settings.dark_postcard : settings.light_postcard);
  const postcardCard = (id) => {
    const theme = THEMES[id];
    return `<button class="postcard-choice ${settings.postcard === id ? "active" : ""}" data-postcard-choice="${id}" type="button">
      <span class="postcard-thumb">${theme.art(theme)}</span>
      <span class="postcard-choice-name">${postcardName(id)}</span>
      <span class="choice-check">✓</span>
    </button>`;
  };
  const modeCard = (mode) => `<button class="theme-mode-card ${activeMode === mode ? "active" : ""}" type="button" data-theme-mode-tab="${mode}">
    <svg class="theme-mode-ico theme-mode-ico-${mode === "dark" ? "moon" : "sun"}" aria-hidden="true"><use href="#theme-${mode === "dark" ? "moon" : "sun"}"></use></svg>
    <span class="theme-mode-label">${modeName(mode)}</span>
    <span class="theme-mode-cache">${esc(cachedName(mode))}</span>
  </button>`;
  const styleGrid = `<div class="settings-section">
      <div class="settings-label">Postcard style</div>
      <div class="current-theme-row">
        <span class="current-theme-thumb">${currentTheme.art(currentTheme)}</span>
        <span class="current-theme-copy"><small>Current theme</small><strong>${postcardName(currentId)}</strong></span>
        <span class="current-theme-mode">${currentMode}</span>
      </div>
      <div class="theme-mode-row">
        ${modeCard("light")}
        ${modeCard("dark")}
      </div>
      ${themeFamiliesOpen ? `<div class="theme-family-list">
        <button class="theme-family-row" type="button" data-action="toggle-postcard-family" aria-expanded="${themeFamilyOpen ? "true" : "false"}">
          <span class="theme-family-copy"><strong>Postcard</strong></span>
          <svg class="theme-family-chevron ${themeFamilyOpen ? "open" : ""}" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        ${themeFamilyOpen ? `<div class="postcard-grid theme-family-grid">${modeIds.map(postcardCard).join("")}</div>` : ""}
      </div>` : ""}
    </div>`;
  return `<div class="settings-head"><h2>Appearance</h2><p>Choose the paper NeoTodo lives on.</p></div>
    ${styleGrid}
    <div class="settings-section">
      <div class="settings-label">Task details</div>
      <button class="settings-toggle ${settings.show_time_cost ? "active" : ""}" data-action="toggle-time-cost" aria-pressed="${settings.show_time_cost ? "true" : "false"}">
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span class="toggle-copy"><strong>Time cost</strong><small>Show how long each completed task took.</small></span>
      </button>
      <button class="settings-toggle ${settings.show_clock ? "active" : ""}" data-action="toggle-show-clock" aria-pressed="${settings.show_clock ? "true" : "false"}">
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span class="toggle-copy"><strong>Current time</strong><small>Show the clock at the top centre.</small></span>
      </button>
    </div>
    <div class="settings-section">
      <div class="settings-label">Task title <span>header</span></div>
      <div class="title-adjust-row">
        <label class="title-adjust-label">Position <span id="title-offset-value">${settings.title_offset} px</span></label>
        <input id="title-offset-range" type="range" min="-320" max="320" step="8" value="${settings.title_offset}">
        <label class="title-adjust-label">Icon size <span id="title-icon-value">${settings.title_icon_size} px</span></label>
        <input id="title-icon-range" type="range" min="24" max="96" step="2" value="${settings.title_icon_size}">
      </div>
    </div>
    <div class="settings-section">
      <div class="settings-label">Preview</div>
      <div class="settings-preview">A quiet place for the next thing.</div>
    </div>`;
}

function typographySettings() {
  return `<div class="settings-head"><h2>Typography</h2><p>Make the page feel like yours.</p></div>
    <div class="settings-section">
      <button class="font-collapse-row ${fontPanelsOpen.body ? "open" : ""}" type="button" data-font-panel="body" aria-expanded="${fontPanelsOpen.body ? "true" : "false"}">
        <span class="font-sample" style="font-family:${FONT_STACKS[settings.font]}">Aa</span>
        <span class="font-copy"><strong>Body font</strong><small>${FONT_OPTIONS.find((font) => font.id === settings.font)?.name || "Art Serif"}</small></span>
        <svg class="font-collapse-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      ${fontPanelsOpen.body ? `<div class="font-grid font-choice-list">
        ${FONT_OPTIONS.map((font) => `<button class="font-choice ${settings.font === font.id ? "active" : ""}" data-font-choice="${font.id}">
          <span class="font-sample" style="font-family:${FONT_STACKS[font.id]}">Aa</span>
          <span class="font-copy"><strong>${font.name}</strong><small>${font.desc}</small></span>
        </button>`).join("")}
      </div>` : ""}
    </div>
    <div class="settings-section">
      <button class="font-collapse-row ${fontPanelsOpen.note ? "open" : ""}" type="button" data-font-panel="note" aria-expanded="${fontPanelsOpen.note ? "true" : "false"}">
        <span class="font-sample" style="font-family:${FONT_STACKS[settings.note_font]}">Aa</span>
        <span class="font-copy"><strong>Note font</strong><small>${FONT_OPTIONS.find((font) => font.id === settings.note_font)?.name || "Art Serif"}</small></span>
        <svg class="font-collapse-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      ${fontPanelsOpen.note ? `<div class="font-grid font-choice-list">
        ${FONT_OPTIONS.map((font) => `<button class="font-choice ${settings.note_font === font.id ? "active" : ""}" data-note-font-choice="${font.id}">
          <span class="font-sample" style="font-family:${FONT_STACKS[font.id]}">Aa</span>
          <span class="font-copy"><strong>${font.name}</strong><small>${font.desc}</small></span>
        </button>`).join("")}
      </div>` : ""}
    </div>
    <div class="settings-section">
      <div class="settings-label">Font size <span id="font-size-value">${Math.round(settings.scale * 100)}%</span></div>
      <div class="font-size-row">
        <button class="font-step" data-font-step="-5">A−</button>
        <input id="font-size-range" type="range" min="85" max="125" step="5" value="${Math.round(settings.scale * 100)}">
        <button class="font-step" data-font-step="5">A+</button>
      </div>
      <div class="settings-preview">The next thing is already waiting.</div>
    </div>
    <div class="settings-section">
      <div class="settings-label">Note material <span>surface</span></div>
      <div class="font-grid">
        <button class="font-choice ${settings.note_material !== "blur" ? "active" : ""}" data-note-material-choice="paper">
          <span class="material-swatch material-paper"></span>
          <span class="font-copy"><strong>Paper</strong><small>Warm paper and ruled ink.</small></span>
          <span class="choice-check">✓</span>
        </button>
        <button class="font-choice ${settings.note_material === "blur" ? "active" : ""}" data-note-material-choice="blur">
          <span class="material-swatch material-blur"></span>
          <span class="font-copy"><strong>Glass</strong><small>Your image behind a frosted mask.</small></span>
          <span class="choice-check">✓</span>
        </button>
      </div>
      ${settings.note_material === "blur" ? `<div class="note-bg-section">
        <div class="note-bg-head">
          <span class="note-bg-title">Choose</span>
          <button class="btn small" type="button" data-action="choose-note-bg-custom">Custom</button>
        </div>
        <div class="note-bg-grid">
          <button class="note-bg-choice ${settings.note_background === "" ? "active" : ""}" type="button" data-note-bg-preset="">
            <span class="note-bg-swatch note-bg-default"></span>
            <span class="note-bg-name">Default</span>
          </button>
          ${Object.entries(NOTE_BG_PRESETS).map(([id, url]) => `<button class="note-bg-choice ${settings.note_background === id ? "active" : ""}" type="button" data-note-bg-preset="${id}">
            <span class="note-bg-swatch" style="background-image:url('${url}')"></span>
            <span class="note-bg-name">${id[0].toUpperCase() + id.slice(1)}</span>
          </button>`).join("")}
          ${settings.note_background_image ? `<button class="note-bg-choice ${settings.note_background === "__custom" ? "active" : ""}" type="button" data-note-bg-preset="__custom">
            <span class="note-bg-swatch" style="background-image:url('${settings.note_background_image}')"></span>
            <span class="note-bg-name">Custom</span>
          </button>` : ""}
        </div>
        <div class="note-blur-row">
          <label for="note-blur-range">Blur <span id="note-blur-value">${settings.note_blur} px</span></label>
          <input id="note-blur-range" type="range" min="0" max="40" step="2" value="${settings.note_blur}">
        </div>
        <input type="file" id="note-bg-input" accept="image/*" hidden>
      </div>` : ""}
    </div>
    <div class="settings-section">
      <div class="settings-label">Note caret <span>cursor</span></div>
      <button class="settings-toggle ${settings.caret_blink ? "active" : ""}" data-action="toggle-caret-blink" aria-pressed="${settings.caret_blink ? "true" : "false"}">
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span class="toggle-copy"><strong>Blinking caret</strong><small>Turn off for a steady caret that never flashes.</small></span>
      </button>
      <div class="font-grid caret-shape-grid">
        <button class="font-choice ${settings.caret_shape !== "block" ? "active" : ""}" data-caret-shape="line">
          <span class="caret-sample caret-sample-line" style="--sample:${settings.caret_color}"></span>
          <span class="font-copy"><strong>Line</strong><small>A thin text line.</small></span>
          <span class="choice-check">✓</span>
        </button>
        <button class="font-choice ${settings.caret_shape === "block" ? "active" : ""}" data-caret-shape="block">
          <span class="caret-sample caret-sample-block" style="--sample:${settings.caret_color}"></span>
          <span class="font-copy"><strong>Block</strong><small>A solid character block.</small></span>
          <span class="choice-check">✓</span>
        </button>
      </div>
      <div class="caret-color-row">
        <label for="caret-color">Caret colour</label>
        <input id="caret-color" type="color" value="${settings.caret_color}">
        <input id="caret-color-hex" type="text" maxlength="7" spellcheck="false" value="${settings.caret_color}" aria-label="Caret colour hex">
        <span class="caret-live-sample" style="--sample:${settings.caret_color};--shape:${settings.caret_shape === "block" ? "block" : "line"}"></span>
      </div>
    </div>`;
}

function aboutSettings() {
  return `<div class="settings-head"><h2>About</h2><p>A small, quiet place for the next thing.</p></div>
    <div class="settings-section about-section">
      <div><span>NeoTodo</span><small>Desktop edition</small></div>
      <div><span>Theme</span><small>明信片 / ${postcardName(currentPostcardId())}</small></div>
      <div><span>Body font</span><small>${FONT_OPTIONS.find((font) => font.id === settings.font)?.name || "Art Serif"}</small></div>
      <div><span>Note font</span><small>${FONT_OPTIONS.find((font) => font.id === settings.note_font)?.name || "Art Serif"}</small></div>
      <div><span>Shortcuts</span><small>Tab — Toggle categories</small></div>
      <div><span>Project</span><small><a class="about-link" href="https://github.com/CellMeet/Neotodo" data-external-link="https://github.com/CellMeet/Neotodo">github.com/CellMeet/Neotodo</a></small></div>
      <div><span>Email</span><small><a class="about-link" href="mailto:cellmeet@163.com" data-external-link="mailto:cellmeet@163.com">cellmeet@163.com</a></small></div>
      <div><span>Version</span><small>0.0.1</small></div>
    </div>
    <div class="about-bottom">
      <div class="about-thanks"><em>Thanks</em></div>
    </div>`;
}

function renderSettings() {
  const panel = $(".settings-panel");
  if (!panel) return;
  const previousScroll = $(".settings-scroll")?.scrollTop || 0;
  const view = settingsTab === "typography" ? typographySettings()
    : settingsTab === "about" ? aboutSettings()
    : appearanceSettings();
  panel.innerHTML = `<aside class="settings-nav">
      <div class="settings-brand"><svg class="gear-icon" aria-hidden="true"><use href="#gear"></use></svg><span>Settings</span></div>
      <button class="settings-nav-item ${settingsTab === "appearance" ? "active" : ""}" data-settings-tab="appearance">Appearance</button>
      <button class="settings-nav-item ${settingsTab === "typography" ? "active" : ""}" data-settings-tab="typography">Typography</button>
      <button class="settings-nav-item ${settingsTab === "about" ? "active" : ""}" data-settings-tab="about">About</button>
    </aside>
    <section class="settings-main">
      <div class="settings-topbar"><button class="settings-close" type="button" data-action="close-settings" aria-label="Close settings"><svg class="settings-close-icon" aria-hidden="true"><use href="#close-circle"></use></svg></button></div>
      <div class="settings-scroll"><div class="settings-view">${view}</div></div>
    </section>`;
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
  await action("add_todo", { category_id: category.id, name: title });
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
    const scroller = event.target.closest(".current-inner, #history-reel");
    if (!scroller || scroller.classList.contains("task-scrollable")) return;
    event.preventDefault();
    scroller.scrollTop = 0;
  }, { passive: false });

  document.addEventListener("click", (event) => {
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
    const doingPin = event.target.closest("[data-doing-pin]");
    if (doingPin) {
      event.preventDefault();
      event.stopPropagation();
      AudioFX.categoryTap();
      closeDoingPeek();
      return;
    }
    const doingExpand = event.target.closest("[data-doing-expand]");
    if (doingExpand) {
      event.preventDefault();
      event.stopPropagation();
      const todoId = doingExpand.dataset.doingExpand;
      if (doingExpandedTodoIds.has(todoId)) doingExpandedTodoIds.delete(todoId);
      else doingExpandedTodoIds.add(todoId);
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
        const turned = !row.classList.contains("turned");
        row.classList.toggle("turned", turned);
        rotor.classList.remove("spinning", "spinning-back");
        void rotor.getBoundingClientRect();
        rotor.classList.add(turned ? "spinning" : "spinning-back");
        setTimeout(() => rotor.classList.remove("spinning", "spinning-back"), 700);
      }
      AudioFX.categoryTap();
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
    const themeMode = event.target.closest("[data-theme-mode-tab]");
    if (themeMode) {
      event.preventDefault();
      const mode = themeMode.dataset.themeModeTab === "dark" ? "dark" : "light";
      themeModeTab = mode;
      themeFamiliesOpen = true;
      themeFamilyOpen = false;
      const cached = mode === "dark" ? settings.dark_postcard : settings.light_postcard;
      if (THEMES[cached]) {
        settings.theme = "postcard";
        settings.postcard = cached;
        settings.resolved_postcard = cached;
        saveSettings();
        applySettings();
        renderCategories();
        renderStage();
        if (archiveOpen) renderArchive();
      }
      renderSettings();
      return;
    }
    const postcardChoice = event.target.closest("[data-postcard-choice]");
    if (postcardChoice) {
      event.preventDefault();
      const choice = postcardChoice.dataset.postcardChoice;
      settings.theme = "postcard";
      if (choice === "random") {
        settings.postcard = "random";
        settings.resolved_postcard = randomPostcardId(settings.resolved_postcard);
        randomPicked = true;
      } else if (THEMES[choice]) {
        settings.postcard = choice;
        settings.resolved_postcard = choice;
        randomPicked = true;
      }
      const chosen = THEMES[choice];
      if (chosen) {
        const chosenMode = postcardIsDark(choice) ? "dark" : "light";
        themeModeTab = chosenMode;
        if (chosenMode === "dark") settings.dark_postcard = choice;
        else settings.light_postcard = choice;
      }
      themeFamiliesOpen = true;
      themeFamilyOpen = false;
      saveSettings();
      applySettings();
      renderCategories();
      renderStage();
      if (archiveOpen) renderArchive();
      renderSettings();
      return;
    }
    const fontPanel = event.target.closest("[data-font-panel]");
    if (fontPanel) {
      event.preventDefault();
      const key = fontPanel.dataset.fontPanel === "note" ? "note" : "body";
      fontPanelsOpen[key] = !fontPanelsOpen[key];
      renderSettings();
      return;
    }
    const fontChoice = event.target.closest("[data-font-choice]");
    if (fontChoice) {
      event.preventDefault();
      settings.font = fontChoice.dataset.fontChoice;
      fontPanelsOpen.body = false;
      saveSettings();
      applySettings();
      renderSettings();
      return;
    }
    const noteFontChoice = event.target.closest("[data-note-font-choice]");
    if (noteFontChoice) {
      event.preventDefault();
      settings.note_font = noteFontChoice.dataset.noteFontChoice;
      fontPanelsOpen.note = false;
      saveSettings();
      applySettings();
      renderSettings();
      return;
    }
    const noteMaterial = event.target.closest("[data-note-material-choice]");
    if (noteMaterial) {
      event.preventDefault();
      settings.note_material = noteMaterial.dataset.noteMaterialChoice === "blur" ? "blur" : "paper";
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
    const settingsTabNode = event.target.closest("[data-settings-tab]");
    if (settingsTabNode) {
      event.preventDefault();
      settingsTab = settingsTabNode.dataset.settingsTab;
      renderSettings();
      const settingsScroll = $(".settings-scroll");
      if (settingsScroll) settingsScroll.scrollTop = 0;
      return;
    }
    const fontStep = event.target.closest("[data-font-step]");
    if (fontStep) {
      event.preventDefault();
      const step = Number(fontStep.dataset.fontStep) / 100;
      settings.scale = Math.min(1.25, Math.max(0.85, Math.round((settings.scale + step) * 100) / 100));
      saveSettings();
      applySettings();
      renderSettings();
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
      if (actionName === "complete-subtask") {
        const fan = actionNode.querySelector(".fan-rotor") || actionNode.querySelector("svg");
        if (fan) {
          fan.classList.remove("spinning");
          void fan.getBoundingClientRect();
          fan.classList.add("spinning");
          setTimeout(() => fan.classList.remove("spinning"), 700);
        }
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
      saveActiveNoteCaret();
      flushNoteSave();
      state.selectedCategoryId = categoryNode.dataset.categoryId;
      lastCategoryId = null;
      historyCursor = -1;
      historyScrollTop = 0;
      selectedHistoryId = null;
      selectedSubtaskId = null;
      notesPreview = false;
      AudioFX.categoryTap();
      render();
      if (archiveOpen) closeArchive();
      silentAction("select_category", { id: categoryNode.dataset.categoryId });
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
        requestAnimationFrame(() => {
          const row = [...document.querySelectorAll(".week-line")].find((node) => node.dataset.cardId === id);
          row?.scrollIntoView({ block: "start", behavior: "smooth" });
        });
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
      if (historyExpanded.has(index)) historyExpanded.delete(index);
      else historyExpanded.add(index);
      renderStage();
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
    if (typingTarget.matches("[data-note-block-editor], input[type=text], input[type=search], textarea, [contenteditable='true']")) {
      const inputType = event.inputType || "";
      if (inputType !== "insertLineBreak" && inputType !== "insertParagraph" && inputType !== "insertFromPaste") {
        if (event.isComposing || inputType === "insertCompositionText") {
          playTypeSound();
        } else if (performance.now() - lastTypeSoundAt > 55) {
          playTypeSound();
        }
      }
    }
    if (event.target.id === "title-offset-range") {
      settings.title_offset = Math.max(-320, Math.min(320, Number(event.target.value)));
      saveSettings();
      applySettings();
      const label = $("#title-offset-value");
      if (label) label.textContent = `${settings.title_offset} px`;
      return;
    }
    if (event.target.id === "title-icon-range") {
      settings.title_icon_size = Math.max(24, Math.min(96, Number(event.target.value)));
      saveSettings();
      applySettings();
      const label = $("#title-icon-value");
      if (label) label.textContent = `${settings.title_icon_size} px`;
      return;
    }
    if (event.target.id === "font-size-range") {
      settings.scale = Math.min(1.25, Math.max(0.85, Number(event.target.value) / 100));
      saveSettings();
      applySettings();
      const label = $("#font-size-value");
      if (label) label.textContent = `${Math.round(settings.scale * 100)}%`;
      return;
    }
    if (event.target.id === "note-blur-range") {
      settings.note_blur = Math.min(40, Math.max(0, Math.round(Number(event.target.value) || 0)));
      saveSettings();
      applySettings();
      const label = $("#note-blur-value");
      if (label) label.textContent = `${settings.note_blur} px`;
      return;
    }
    if (event.target.id === "caret-color") {
      settings.caret_color = /^#[0-9a-f]{6}$/i.test(event.target.value) ? event.target.value : "#1b1b1b";
      saveSettings();
      applySettings();
      const hex = $("#caret-color-hex");
      if (hex) hex.value = settings.caret_color;
      const sample = $(".caret-live-sample");
      if (sample) sample.style.setProperty("--sample", settings.caret_color);
      return;
    }
    if (event.target.id === "caret-color-hex") {
      const value = String(event.target.value || "").trim();
      const expanded = /^#[0-9a-f]{6}$/i.test(value) ? value
        : /^[0-9a-f]{6}$/i.test(value) ? `#${value}`
        : /^#[0-9a-f]{3}$/i.test(value) ? `#${value.slice(1).split("").map((c) => c + c).join("")}`
        : null;
      if (!expanded) return;
      settings.caret_color = expanded.toLowerCase();
      saveSettings();
      applySettings();
      const colorInput = $("#caret-color");
      if (colorInput) colorInput.value = settings.caret_color;
      return;
    }
    if (event.target.matches("[data-note-block-editor]")) {
      const active = activeNoteTarget();
      if (!active) return;
      const index = Number(event.target.dataset.noteBlockEditor);
      if (!noteBlocks[index]) return;
      const cleanValue = event.target.value.split(NOTE_ZERO_WIDTH).join("");
      noteBlocks[index].raw = cleanValue;
      if (!event.target.value && !event.isComposing) {
        // Keep one invisible character so WebKit always has a line to paint the caret on.
        event.target.value = NOTE_ZERO_WIDTH;
        event.target.setSelectionRange(1, 1);
      }
      const notePlaceholder = document.querySelector(".note-empty-placeholder");
      if (notePlaceholder) {
        notePlaceholder.hidden = noteBlocks.length !== 1 || Boolean(noteBlocks[0]?.raw);
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

  document.addEventListener("change", (event) => {
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
    if (event.target.id !== "note-image-input") return;
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length) addNotePictures(files);
  });

  document.addEventListener("contextmenu", (event) => {
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
        if (!text) return;
        if (navigator.clipboard?.writeText) {
          try { await navigator.clipboard.writeText(text); return; } catch (error) {}
        }
        try {
          const helper = document.createElement("textarea");
          helper.value = text;
          helper.style.cssText = "position:fixed;left:-9999px;top:0";
          document.body.appendChild(helper);
          helper.select();
          document.execCommand("copy");
          helper.remove();
        } catch (error) {}
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
        { label: "Copy", disabled: !selectionText(), run: () => copyText(selectionText()) },
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
    const subRow = event.target.closest(".current-subtask[data-subtask-id]");
    if (subRow) {
      event.preventDefault();
      showCurrentSubtaskMenu(event.clientX, event.clientY, subRow.dataset.subtaskId);
      return;
    }
    const currentArea = event.target.closest("[data-current-todo]");
    if (currentArea) {
      event.preventDefault();
      showCurrentTodoMenu(event.clientX, event.clientY);
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
    const now = performance.now();
    if (now < notesSwipeCooldownUntil) { noteSwipeLastY = event.clientY; return; }
    if (!notesSwipeLine
      || performance.now() - notesSwipeLineAt > 500
      || Math.abs(event.clientY - notesSwipeLine.y) < 90) {
      refreshNotesSwipeLine();
    }
    if (!notesSwipeLine) { noteSwipeLastY = event.clientY; return; }
    const lineY = notesSwipeLine.y;
    const inX = event.clientX >= notesSwipeLine.left - 36 && event.clientX <= notesSwipeLine.right + 36;
    const prevY = noteSwipeLastY;
    noteSwipeLastY = event.clientY;
    if (!inX || prevY === null || now < noteSwipeCooldown) return;
    if (!notesHidden && prevY < lineY - 2 && event.clientY > lineY + 2) {
      noteSwipeCooldown = now + 450;
      noteSwipeLastY = null;
      hideNotesPanel();
    } else if (notesHidden && prevY > lineY + 2 && event.clientY < lineY - 2) {
      noteSwipeCooldown = now + 450;
      noteSwipeLastY = null;
      showNotesPanel();
    }
  }, { passive: true });

  const doingPeekSuppressed = () => Boolean(panelPreview)
    || document.body.classList.contains("panel-drag-mode")
    || document.body.classList.contains("agent-split-drag");

  const processDoingPointer = () => {
    if (!doingZone || doingPeekOpen || doingPeekSuppressed()) return;
    const { x, y } = doingPeekPoint;
    if (!pointInDoingZone(x, y)) {
      clearTimeout(doingPeekOpenTimer);
      doingPeekOpenTimer = 0;
      return;
    }
    if (!doingPeekOpenTimer) {
      doingPeekOpenTimer = setTimeout(() => {
        doingPeekOpenTimer = 0;
        if (doingPeekSuppressed()) return;
        if (!pointInDoingZone(doingPeekPoint.x, doingPeekPoint.y)) return;
        openDoingPeek();
      }, 130);
    }
  };

  document.addEventListener("pointermove", (event) => {
    doingPeekPoint = { x: event.clientX, y: event.clientY };
    if (!doingZone) refreshDoingZone();
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
    updateAgentSplitLayout();
    if (agentModelMenuOpen || agentModeMenuOpen) positionAgentMenus();
  });

  document.addEventListener("pointerdown", (event) => {
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
      document.documentElement.style.setProperty("--agent-terminal-height", `${Math.round(height)}px`);
      updateAgentSplitLayout();
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  }, { passive: false });

  document.addEventListener("input", (event) => {
    if (event.target.id === "agent-input") {
      const input = event.target;
      input.style.height = "auto";
      input.style.height = `${Math.min(170, Math.max(66, input.scrollHeight))}px`;
    }
  });

  document.addEventListener("click", () => {
    if (agentModelMenuOpen || agentModeMenuOpen) {
      agentModelMenuOpen = false;
      agentModeMenuOpen = false;
      renderAgentTerminal();
    }
  });

  let deskStripHovered = false;
  document.addEventListener("pointermove", (event) => {
    const stripHovered = event.clientY >= window.innerHeight - 36;
    if (stripHovered !== deskStripHovered) {
      deskStripHovered = stripHovered;
      document.body.classList.toggle("desk-strip-hover", stripHovered);
      positionDeskHandles();
    }
  }, { passive: true });

  let panelLongPress = null;
  let panelLongPressSuppress = 0;
  document.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || panelLongPress) return;
    const panel = event.target.closest?.("#agent-terminal, #notes-half");
    if (!panel) return;
    const kind = panel.id === "agent-terminal" ? "ai" : "note";
    const open = kind === "ai" ? agentTerminalOpen : !notesHidden;
    if (!open) return;
    if (event.target.closest?.("button, a, input, textarea, select, .agent-compose, .note-block, .note-block-editor, .note-pictures, .notes-resize-handle, .desk-handle, .notes-handle, .detached-grabber")) return;
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
    }, 100);
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

  let deskHandleSwipeSuppress = 0;
  document.addEventListener("click", (event) => {
    if (performance.now() < deskHandleSwipeSuppress && event.target.closest?.(".desk-handle-ai, .notes-handle-bottom")) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
  document.addEventListener("pointerdown", (event) => {
    const handle = event.target.closest?.(".desk-handle-ai, .notes-handle-bottom");
    if (!handle || event.button !== 0) return;
    const isAi = handle.classList.contains("desk-handle-ai");
    const isOpen = isAi ? agentTerminalOpen : !notesHidden;
    const panel = isAi ? $("#agent-terminal") : $("#notes-half");
    const desk = agentDeskRect();
    const canResize = Boolean(panel && desk && isOpen && !singleDock
      && (isAi ? notesHidden : !agentTerminalOpen));
    const startX = event.clientX;
    const startY = event.clientY;
    const panelRect = panel?.getBoundingClientRect();
    const startTop = panelRect && desk ? Math.max(0, panelRect.top - desk.top) : 0;
    const minHeight = desk ? Math.min(220, Math.max(120, desk.height * 0.28)) : 120;
    let longPressed = false;
    let moved = false;
    let resizing = false;
    const timer = setTimeout(() => {
      if (!handle.isConnected) return;
      longPressed = true;
    }, 340);
    const applyResize = (dy) => {
      if (!panel || !desk) return;
      const top = Math.max(0, Math.min(desk.height - minHeight, startTop + dy));
      const height = desk.height - top;
      panel.style.setProperty("top", `${top}px`, "important");
      panel.style.setProperty("height", `${height}px`, "important");
      panel.style.setProperty("bottom", "auto", "important");
      handle.style.setProperty("top", `${desk.top + top + 6}px`, "important");
    };
    const move = (moveEvent) => {
      if (!longPressed) {
        if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) > 6) {
          moved = true;
          clearTimeout(timer);
        }
        return;
      }
      if (!canResize) return;
      if (!resizing) {
        resizing = true;
        document.body.classList.add("desk-handle-resizing");
        panel?.classList.add("panel-handle-resizing");
        if (panel) {
          panel.style.setProperty("transition", "none", "important");
          panel.style.setProperty("will-change", "top, height");
        }
        handle.style.setProperty("transition", "none", "important");
      }
      applyResize(moveEvent.clientY - startY);
    };
    const up = () => {
      clearTimeout(timer);
      window.removeEventListener("pointermove", move);
      document.body.classList.remove("desk-handle-resizing");
      panel?.classList.remove("panel-handle-resizing");
      if (panel) {
        panel.style.removeProperty("transition");
        panel.style.removeProperty("will-change");
      }
      handle.style.removeProperty("transition");
      if (resizing) {
        // Suppress only the click that belongs to this same gesture.
        deskHandleSwipeSuppress = performance.now() + 360;
        positionDeskHandles();
        return;
      }
      if (longPressed) {
        deskHandleSwipeSuppress = performance.now() + 360;
        return;
      }
      if (moved) deskHandleSwipeSuppress = performance.now() + 360;
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up, { once: true });
  }, { passive: true });

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
      if (event.key === "Escape") {
        event.preventDefault();
        closeAgentTerminal();
        return;
      }
    }
    if (event.key === "Escape" && doingPeekOpen) {
      event.preventDefault();
      closeDoingPeek();
      return;
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
    if (event.key === "Escape" && $(".settings-stage")) {
      event.preventDefault();
      closeSettings();
      return;
    }
    if (event.target.matches("[data-note-block-editor]") && !event.isComposing) {
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
    if (event.target.matches("[data-note-block-editor]") && event.key === "Enter" && !event.shiftKey) {
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
      if (currentCenter !== null) {
        const targetCenter = currentCenter + (targetIndexWidth - currentIndexWidth) / 2;
        const handle = $(".notes-handle-bottom");
        if (handle) handle.style.left = `${Math.round(targetCenter)}px`;
      }
      AudioFX.drawer(!document.body.classList.contains("categories-collapsed"));
      setTimeout(() => {
        positionNotesHandle();
        refreshNotesSwipeLine();
        if (!doingPeekOpen) refreshDoingZone();
      }, 60);
      setStatus(document.body.classList.contains("categories-collapsed") ? "Categories hidden" : "Categories shown");
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
    if (typing && !event.isComposing && !event.ctrlKey && !event.metaKey && !event.altKey
      && (event.key.length === 1 || event.key === "Backspace" || event.key === "Enter")) {
      playTypeSound();
    }
    if (typing) return;
    if (event.key === "Escape") {
      if ($(".picture-gallery-stage")) { $("#modal-root").innerHTML = ""; return; }
      if ($(".image-stage")) { $("#modal-root").innerHTML = ""; return; }
      if (contextMenuOpen) { closeContextMenu(); return; }
      if (postcard) { closePostcard(); return; }
      if (completedOpen) { closeCompletedLog(); return; }
      if ($("#modal-root").innerHTML) { cancelModal(null); return; }
      if (archiveOpen) { closeArchive(); return; }
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
    if (agentTerminalOpen) return;
    if (!notesHidden) return;
    if (event.clientX <= 55 && event.clientY >= window.innerHeight - 110) showNotesPanel();
  });

  document.addEventListener("mousemove", (event) => {
    if (event.clientX <= 24) document.body.classList.add("tools-open");
    else if (event.clientX > 90) document.body.classList.remove("tools-open");
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
    const ids = [...list.querySelectorAll(".category-item[data-category-id]")].map((row) => row.dataset.categoryId);
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
  };
  // Keep priming on every gesture: a wheel is enough to resume the audio
  // context in some WebKit builds, but it is not a pointerdown, so the old
  // once-only listeners left the first scroll silent.
  document.addEventListener("pointerdown", primeAudio, { capture: true });
  document.addEventListener("keydown", primeAudio, { capture: true });
  document.addEventListener("wheel", primeAudio, { capture: true, passive: true });
  document.addEventListener("touchstart", primeAudio, { capture: true, passive: true });
  setupCustomCaret();
  AudioFX.preloadSamples();
}

function updateSoundToggle() {
  const button = $("#sound-toggle");
  if (!button) return;
  button.classList.toggle("muted", AudioFX.muted);
  button.setAttribute("aria-pressed", String(!AudioFX.muted));
}


async function init() {
  if (new URLSearchParams(location.search).has("still")) document.body.classList.add("still");
  loadSettings();
  applySettings();
  bindEvents();
  updateSoundToggle();
  state.data = window.__SNAPSHOT_STATE__ || await requestState();
  loadSettings();
  resolveRandomPostcard();
  applySettings();
  state.selectedCategoryId = state.data.selected_category || state.data.categories[0]?.id || null;
  const params = new URLSearchParams(location.search);
  const requestedCategory = params.get("category");
  if (requestedCategory) {
    const match = state.data.categories.find((category) => category.id === requestedCategory || category.name === requestedCategory);
    if (match) state.selectedCategoryId = match.id;
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
  if (detachedMode) {
    document.body.classList.add("detached-arriving");
    setTimeout(() => document.body.classList.remove("detached-arriving"), 760);
    const grabber = document.createElement("div");
    grabber.className = "detached-grabber";
    grabber.id = "detached-grabber";
    grabber.setAttribute("role", "button");
    grabber.setAttribute("tabindex", "0");
    grabber.setAttribute("aria-label", "Click to return home, drag to resize");
    grabber.title = "Click to return home · drag to resize";
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
  if (detachedMode !== "note" && !notesHidden) hideNotesPanel(true);
  if (detachedMode === "ai") setTimeout(() => $("#agent-input")?.focus(), 250);
  if (detachedMode === "note") setTimeout(() => $("#note-live")?.scrollIntoView({ block: "nearest" }), 200);
  positionNotesHandle();
  updateNotesHandle();
  updateHeaderStamp();
  if (!clockTimer) clockTimer = setInterval(() => { updateHeaderStamp(); updateTopClock(); }, 1000);
  updateTopClock();
  document.body.classList.add("app-ready");
  document.documentElement.classList.remove("booting");
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
    const requestedCard = params.get("card");
    if (view === "archive") openArchive();
    else if (view === "completed") openCompletedLog();
    else if (view === "card" || requestedCard) {
      const cards = [...(state.data.archive || [])].sort((a, b) => String(a.week_start).localeCompare(String(b.week_start)));
      if (cards.length) {
        const card = requestedCard ? cards.find((item) => item.id === requestedCard || item.theme === requestedCard) : cards[cards.length - 1];
        if (card) openPostcard(card.id, { auto: true });
      }
    } else if (view !== "app") {
      maybeAutoPostcard();
    }
  }
}

init().catch((error) => {
  document.body.innerHTML = `<div style="padding:40px;color:#b65c50;font-family:monospace;font-size:12px;line-height:1.7;white-space:pre-wrap">NeoTodo could not start:\n${esc(error.message)}</div>`;
});
