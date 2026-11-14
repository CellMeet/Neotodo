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
  const SAMPLE_URLS = {
    type: "/user-sounds/keyany.wav",
    enter: "/user-sounds/keyenter.wav",
    drawerOpen: "/user-sounds/drawer-open.mp3",
    drawerClose: "/user-sounds/drawer-close.mp3",
    // Gentle flowing-water loop for scrolling (CC0); see sounds/CREDITS.txt.
    waterFlow: "/user-sounds/water-flow.wav",
    trickle: "/user-sounds/water-trickle.wav",
    windScroll: "/user-sounds/wind-scroll.wav",
    train: "/user-sounds/train-whistle.mp3",
    paperTear: "/user-sounds/paper-tear.wav",
    steamHiss: "/user-sounds/steam-hiss.mp3",
  };

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

  function tetrisMove(rotate = false) {
    const c = ensure();
    if (!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    osc.type = "square";
    // A left/right nudge is a low two-step blip; a rotation answer is the
    // same shape a minor third higher, so typing reads as falling pieces.
    osc.frequency.setValueAtTime(rotate ? 330 : 262, now);
    osc.frequency.setValueAtTime(rotate ? 494 : 392, now + 0.028);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.055, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);
    osc.connect(gain);
    gain.connect(masterOutput(c));
    osc.start(now);
    osc.stop(now + 0.09);
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
    rustle, pageTurn, waterFlow, subtaskFlow, exhale, splash, writing, itemGet, bassZap,
    celebrationBass, cardWind, type, mechanical, carriage, confirmCarriage, unroll, paper,
    seal, chime, ding, trainWhistle, categoryTap, achievementTap, timerTap, addTap,
    completeTap, bassFade, guitarPluck, drawer, drawerStretch, leafRustle,
    startLeafStretch, stopLeafStretch, unlock, preloadSamples, wake, toggle,
    tetrisMove, tetrisClear,
    setVolume, getVolume,
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

const DEFAULT_SETTINGS = { theme: "postcard", postcard: "violet", resolved_postcard: "violet", light_postcard: "violet", dark_postcard: "tokyo", font: "serif", note_font: "pen", scale: 1, show_time_cost: false, show_clock: true, focus_count: 0, focus_log: [], title_offset: 0, title_icon_size: 48, caret_blink: false, caret_shape: "line", caret_color: "#1b1b1b", ai_caret_blink: true, ai_caret_shape: "line", ai_caret_dark: "#f4f6f8", ai_caret_light: "#1b1b1b", note_material: "paper", note_background: "", note_background_image: "", note_blur: 16, sticker_backgrounds: {}, wallpaper_mode: "static", wallpaper_static: "art:violet", wallpaper_dynamic: "", plugins: {} };
// Each header achievement keeps its own picture and crop, so the artwork for
// the headphone and the tomato can be chosen independently.
const STICKER_TARGETS = [
  { id: "completed", name: "Completed", detail: "Headphone achievement", selector: ".head-right .trophy-button .ach-sticker img", fallback: "/stickers/yuji-battle.jpg" },
  { id: "focus", name: "Pomodoro", detail: "Tomato achievement", selector: ".head-right .tomato-counter .ach-sticker img", fallback: "/stickers/gojo-battle.jpg" },
];
const NOTE_BG_PRESETS = {};
const POSTCARD_IDS = ["violet", "tokyo", "space", "aurora", "ocean", "forest", "vintage", "alpine", "desert", "emerald"];
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
let settingsTab = "appearance";
let noteMaterialFiles = ["paper.css", "glass.css"];
let noteMaterialMenuOpen = false;
let wallpaperFiles = { images: [], videos: [] };
let wallpaperFilesRequest = null;
let wallpaperMediaKey = "";
let wallpaperVisibilityBound = false;
const wallpaperTintCache = new Map();
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
// Small installable tools live in /plugins/<id>/. Each manifest describes the
// plugin well enough for Settings → Plugins to list, toggle, open, and remove
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
  forktree: {
    id: "forktree",
    title: "Forktree",
    englishTitle: "Fork Tree",
    version: "1.0.0",
    author: "NeoTodo",
    category: "Interface",
    description: "把分类、任务、子任务以及所有 fork 展开成从左到右的思维导图。点击任意节点，就能回到对应的任务页面。",
    icon: "/plugins/forktree/forktree.svg",
    entry: "/plugins/forktree/index.html",
  },
};
let pluginDetailId = null;
let pluginPendingUninstallId = null;
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
// Finishing a subtask pops the card open so the row can fly into it. Once the
// row has landed the card lingers for a beat, then tucks itself away again.
let completedSubtasksAutoCloseTimer = null;
const COMPLETED_DRAWER_DWELL_MS = 600;
const COMPLETED_ROW_FLIGHT_MS = 480;
let historyCursor = -1;
let lastTypeSoundAt = 0;
let lastTetrisKeyAt = 0;
let tetrisRotateToggle = false;

function playTypeSound() {
  const now = performance.now();
  if (now - lastTypeSoundAt < 35) return;
  lastTypeSoundAt = now;
  AudioFX.unlock();
  AudioFX.type();
}

// The AI composer is a Tetris board, not a typewriter: each keystroke is a
// piece move or rotation blip, and Enter clears a line. The two cues alternate
// so a burst of typing keeps the falling-piece rhythm without stacking into
// one long tone.
function playTetrisKeySound() {
  const now = performance.now();
  if (now - lastTetrisKeyAt < 30) return;
  lastTetrisKeyAt = now;
  tetrisRotateToggle = !tetrisRotateToggle;
  AudioFX.unlock();
  AudioFX.tetrisMove(tetrisRotateToggle);
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
let lastAddedSubtaskId = null;
let categoryDrag = null;
let suppressCategoryClickUntil = 0;
let doingPeekOpen = false;
let doingExpandedTodoIds = new Set();
let doingMarkedTodoId = null;
let doingMarkedSubtaskId = null;
let doingPeekOpenTimer = 0;
let doingPeekPoint = { x: 0, y: 0 };
let doingZone = null;
let doingZoneAt = 0;
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
// A fork window keeps its own index: the branch category plus any categories
// created inside that branch, while the main window still lists everything.
let forkRootId = null;
let agentSessions = {};
const agentBusyIds = new Set();
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
      for (const subtask of todo.subtasks || []) {
        if (!subtask.done) valid.add(subtask.id);
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
  return (todo?.subtasks || []).some((subtask) => !subtask.done && unseenAgentSubtasks.has(subtask.id));
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

/** Update the visible order after an AI run happens in another window. */
function refreshAgentFinishViews() {
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
  return `<span class="sub-agent-model has-model ${pop}"><img src="/model-icons/${modelIconId(model)}.svg" alt=""></span>`;
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
        activeSlot.innerHTML = "";
        activeSlot.classList.remove("has-model", "pop");
      }
      return;
    }
  }
  const slot = row.querySelector(".sub-agent-model");
  if (!slot) return;
  const nextModel = model !== null ? model : (subtaskAgentModels[subtaskId] || "");
  if (!nextModel) {
    slot.innerHTML = "";
    slot.removeAttribute("title");
    slot.classList.remove("pop", "has-model");
    return;
  }
  slot.classList.add("has-model");
  slot.innerHTML = `<img src="/model-icons/${modelIconId(nextModel)}.svg" alt="">`;
  slot.classList.toggle("pop", Boolean(pop));
  if (pop) setTimeout(() => slot.classList.remove("pop"), 950);
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
const VIEW_STATE_KEY = "neotodo.viewState.v1";
let viewStateReady = false;

function readViewState() {
  try {
    const saved = JSON.parse(localStorage.getItem(VIEW_STATE_KEY) || "null");
    return saved && typeof saved === "object" ? saved : null;
  } catch (error) { return null; }
}

function saveViewState() {
  if (!viewStateReady || detachedMode || !state.data) return;
  const target = activeNoteTarget();
  try {
    localStorage.setItem(VIEW_STATE_KEY, JSON.stringify({
      notesOpen: !notesHidden,
      aiOpen: agentTerminalOpen,
      categoryId: state.selectedCategoryId || "",
      todoId: target?.todo?.id || "",
      subtaskId: selectedSubtaskId || "",
      historyTodoId: selectedHistoryId || "",
      savedAt: Date.now(),
    }));
  } catch (error) {}
}

function restoreWorkspaceView(saved) {
  if (!saved || detachedMode) return;
  const category = selectedCategory();
  if (!category) return;
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
  if (selectedSubtaskId || selectedHistoryId) {
    renderStage();
    renderNotesPanel();
    updateHistorySelection();
    updateSubtaskSelection();
  }
  if (saved.notesOpen) showNotesPanel(true);
  if (saved.aiOpen) openAgentTerminal(true);
}

// Default sheet height: start right below the bordered subtask area so the
// task rows stay visible. Only a manual resize may override it afterwards.
let sheetHeightCustom = false;
function refreshDefaultSheetHeight() {
  if (sheetHeightCustom) return;
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
    positionTimerRoot();
    positionNotesHandle();
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
  }, 180);
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
    setTimeout(() => panel.classList.remove("sheet-opening", "notes-solid-opening"), 380);
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

function aiCaretColor() {
  const dark = document.documentElement.dataset.postcardDark === "true";
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

function chooseProjectFolder() {
  const target = activeNoteTarget();
  const todo = target?.todo || null;
  if (todo && (target.completed || todo.done)) return;
  // Even with no current todo (for example while the new-todo input is empty)
  // the picker opens; the chosen folder waits for the todo that is created next.
  AudioFX.unlock();
  playPianoKey();
  silentAction("choose_project_folder").then(async (picked) => {
    if (!picked?.path) return;
    if (!todo) {
      pendingProjectFolder = picked.path;
      setStatus("Project folder ready for the next todo");
      return;
    }
    const bound = await action("bind_project_folder", { id: todo.id, path: picked.path });
    if (bound?.ok) {
      setStatus(`Project folder linked · ${(bound.files || []).length} files`);
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

function categoryMarkHtml(category) {
  // Forked boards keep the flame of the subtask they branched from.
  if (category?.forked_from) {
    return `<span class="cat-dot cat-fork" title="Fork"><img src="/fork-flame.svg" alt=""></span>`;
  }
  return `<span class="cat-dot"></span>`;
}

function renderCategories() {
  const list = $("#category-list");
  const summary = $("#category-summary");
  if (!state.data.categories.length) {
    list.innerHTML = `<div class="drawer-empty" style="padding:20px 6px;font-size:12px;line-height:1.8">No categories.<br>Press + to begin.</div>`;
    summary.textContent = "";
    return;
  }
  const categories = forkRootId
    ? state.data.categories.filter((category) => category.id === forkRootId || category.fork_root === forkRootId)
    : state.data.categories;
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
  const notesIconSvg = `<svg class="notes-icon" aria-hidden="true"><use href="#${themeSymbol("notes")}"></use></svg>`;
  const notesIcon = `<button class="notes-icon-button" type="button" data-action="choose-project-folder" aria-label="Link project folder">${notesIconSvg}</button>`;
  // The note header carries only the pen and the current todo/subtask name.
  // Folder details live on the page-header napkin, not beside the title.
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

function updateAgentSplitLayout() {
  if (agentSplitSide === "notes-left" || agentSplitSide === "notes-right") rememberHorizontalSplit();
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
  const bodyRect = $(".page-body")?.getBoundingClientRect();
  const leftPx = bodyRect ? Math.round(bodyRect.width * agentSplitRatio) : 0;
  root.style.setProperty("--agent-left-pct", `${left}%`);
  root.style.setProperty("--agent-left-px", `${leftPx}px`);
  root.style.setProperty("--agent-ai-left", "0%");
  root.style.setProperty("--agent-ai-right", "0%");
  root.style.setProperty("--agent-ai-pad-top", "0px");
  root.style.setProperty("--agent-ai-pad-bottom", "0px");
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
  positionAgentScrollRail();
  // While dragging the divider, panes and lines must follow every frame with
  // no CSS transition. Otherwise fast drags open a visible gap.
  if (document.body.classList.contains("agent-split-resizing")) {
    positionDeskHandles();
  } else {
    followPageLayout(380);
  }
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

function flashAgentCopy(x, y) {
  const node = document.createElement("span");
  node.className = "agent-copy-flash";
  node.textContent = "Copied";
  node.style.left = `${Math.round(x)}px`;
  node.style.top = `${Math.round(y)}px`;
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 950);
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

  // OpenCode-style select-to-copy: selecting assistant text copies it at once.
  const copySelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) return;
    const text = selection.toString().trim();
    if (!text) return;
    const range = selection.getRangeAt(0);
    let node = range.commonAncestorContainer;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    if (!node?.closest?.(".agent-reply")) return;
    if (text === lastAutoCopiedText) return;
    lastAutoCopiedText = text;
    const rect = range.getBoundingClientRect();
    copyToClipboard(text).then((ok) => {
      if (ok) flashAgentCopy(rect.right, rect.bottom);
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

  messagesEl.addEventListener("mouseup", () => setTimeout(copySelection, 0));
  messagesEl.addEventListener("keyup", (event) => {
    if (event.key === "Shift" || event.key.startsWith("Arrow") || (event.key === "a" && (event.ctrlKey || event.metaKey))) {
      setTimeout(copySelection, 0);
    }
  });
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
    stateEl.textContent = loading ? "…" : busy ? (queued ? (queuePosition ? `queued #${queuePosition}…` : "queued…") : "working…") : "";
    stateEl.classList.toggle("busy", Boolean(busy));
  }
  const escEl = $("#agent-meta-esc");
  if (escEl) {
    const canInterrupt = Boolean(busy && !loading && !uploading);
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
        const completed = data.running === false
          && expectedText
          && last && last.role === "assistant" && !last.pending
          && previous && previous.role === "user" && previous.content === expectedText;
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
      if (data.live?.started) startAgentPoll(agentId);
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
  if (!silent) AudioFX.drawer();
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
    setTimeout(() => panel?.classList.remove("sheet-opening"), 200);
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
  }, 180);
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

function interruptAgent() {
  const agent = activeAgent();
  if (!agent || !agentBusyIds.has(agent.id)) return;
  AudioFX.categoryTap();
  agentPost({ action: "interrupt", agent_id: agent.id }).catch(() => {});
  setStatus("Interrupted");
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
  const subtaskId = agentId.startsWith("subtask:") ? agentId.slice(8) : "";
  if (subtaskId) {
    updateSubtaskAgentDom(subtaskId, { running: false, model: "" });
    subtaskAgentModels[subtaskId] = finalModel;
    saveSubtaskAgentModels();
    noteSubtaskAgentFinished(subtaskId);
    AudioFX.trainWhistle();
    setTimeout(() => {
      subtaskModelRecent.add(subtaskId);
      updateSubtaskAgentDom(subtaskId, { running: false, model: finalModel, pop: true });
      setTimeout(() => subtaskModelRecent.delete(subtaskId), 1200);
    }, 180);
  } else if (agentId.startsWith("todo:")) {
    noteTodoAgentFinished(agentId.slice(5));
  }
  renderAgentTerminal();
  setTimeout(() => $("#agent-input")?.focus(), 40);
}

async function sendAgentMessage() {
  const input = $("#agent-input");
  const message = input?.value.trim();
  if (!message) return;
  const agent = activeAgent();
  if (agentBusyIds.has(agent.id) || agentUploadingIds.has(agent.id)) return;
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
  // to the completed lane, and the rows around it can settle into place.
  const risingSubtaskId = justCompletedSubtaskId;
  const previousSubtaskRects = new Map();
  if (risingSubtaskId) {
    stage.querySelectorAll(".current-subtask[data-subtask-id]").forEach((row) => {
      previousSubtaskRects.set(row.dataset.subtaskId, row.getBoundingClientRect());
    });
  }
  const category = selectedCategory();
  if (!category) {
    stage.innerHTML = `<div class="page-head"><div class="page-title banner-title project-folder-trigger" role="button" tabindex="0" data-action="choose-project-folder" aria-label="Open project folder"><svg class="banner-icon" aria-hidden="true"><use href="#${themeSymbol("header")}"></use></svg></div><div class="page-head-title current-head-title quiet"><span class="page-title-name">No categories yet.</span></div></div>
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
    return;
  }
  stage.style.setProperty("--c", category.color);
  const todos = category.todos || [];
  const done = doneTodos(category);
  const current = todos.find((todo) => !todo.done) || null;
  const pendingSub = orderedSubtasks(current).find((subtask) => !subtask.done) || null;
  // The finished-task drawer is an optional plugin. Without it, finished and
  // unfinished subtasks share one lane and keep their natural recency order.
  const completedDrawerOn = pluginEnabled("completed-drawer");

  // The completed-subtask card belongs to the task that was on screen when it
  // was opened. A different task always starts with the card tucked away.
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
    const subList = orderedSubtasks(current);
    const pendingList = subList.filter((subtask) => !subtask.done);
    const doneList = subList.filter((subtask) => subtask.done);
    const addSubtaskRow = addingSubtask && addingSubtaskTodoId === current.id
      ? `<div class="current-subtask adding-subtask" data-add-subtask-row>
          <span class="sub-fan" aria-hidden="true"><svg viewBox="0 0 1024 1024"><use href="#fan"></use></svg></span>
          <input id="subtask-name-input" class="subtask-name-input" type="text" placeholder="Start new subtask ..." autocomplete="off" spellcheck="false" aria-label="Name subtask">
        </div>`
      : "";
    const subtaskRow = (subtask) => {
      const next = pendingSub && subtask.id === pendingSub.id;
      const selected = subtask.id === selectedSubtaskId;
      const fan = subtask.done
        ? `<span class="sub-fan done" aria-hidden="true"><span class="fan-stack"><svg class="fan-static" aria-hidden="true" viewBox="0 0 1024 1024"><use href="#fan"></use></svg><svg class="fan-rotor" aria-hidden="true" viewBox="0 0 1024 1024"><circle cx="493" cy="422" r="356" fill="#C8B9FC"></circle><g clip-path="url(#fan-wheel-clip)"><use href="#fan"></use></g></svg></span></span>`
        : `<button class="sub-fan sub-fan-action" data-action="complete-subtask" data-todo-id="${esc(current.id)}" data-subtask-id="${esc(subtask.id)}" aria-label="Finish ${esc(subtask.name)}"><span class="fan-stack"><svg class="fan-static" aria-hidden="true" viewBox="0 0 1024 1024"><use href="#fan"></use></svg><svg class="fan-rotor" aria-hidden="true" viewBox="0 0 1024 1024"><circle cx="493" cy="422" r="356" fill="#C8B9FC"/><g clip-path="url(#fan-wheel-clip)"><use href="#fan"></use></g></svg></span></button>`;
      const agentId = `subtask:${subtask.id}`;
      const agentRunning = agentIsRunning(agentId);
      const modelBadge = agentRunning
        ? `<span class="sub-agent-model" aria-hidden="true"></span>`
        : subtaskModelIconHtml(subtask.id);
      return `<div class="current-subtask ${subtask.done ? "done" : "pending"} ${next ? "next" : ""} ${selected ? "selected" : ""} ${agentRunning ? "agent-running" : ""}" data-subtask-id="${esc(subtask.id)}">
        ${modelBadge}${fan}
        <span class="sub-name">${esc(subtask.name)}</span>
        ${subtask.done ? `<svg class="sub-done-check" aria-hidden="true"><use href="#check-red"></use></svg>` : ""}
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
    const drawerMarkup = completedDrawerOn
      ? `<button class="completed-subtask-toggle ${completedSubtasksOpen ? "open" : ""}" type="button" data-action="toggle-completed-subtasks" aria-expanded="${completedSubtasksOpen ? "true" : "false"}" aria-controls="completed-subtask-drawer" aria-label="${completedSubtasksOpen ? "Hide completed subtasks" : "Show completed subtasks"}">
        <span class="completed-subtask-line" aria-hidden="true"></span>
      </button>
      <div class="subtask-lanes">
        <div class="subtask-lane-column pending-column">
          <div class="subtask-lane" data-lane="pending">
            <div class="current-subtasks" data-subtask-list="pending">${addSubtaskRow}${pendingList.map(subtaskRow).join("")}${pendingFillers}</div>
          </div>
        </div>
      </div>
      <div class="completed-subtask-drawer ${completedSubtasksOpen ? "open" : ""}" id="completed-subtask-drawer" role="region" aria-label="Completed subtasks" aria-hidden="${completedSubtasksOpen ? "false" : "true"}">
        <div class="completed-subtask-sheet">
          <div class="subtask-lane-column completed-column" aria-label="Completed subtasks">
            <div class="subtask-lane" data-lane="done">
              <div class="current-subtasks completed-subtasks" data-subtask-list="done">${completedRows}</div>
            </div>
          </div>
        </div>
      </div>`
      : `<div class="subtask-lanes">
        <div class="subtask-lane-column pending-column combined-column">
          <div class="subtask-lane" data-lane="all">
            <div class="current-subtasks" data-subtask-list="all">${addSubtaskRow}${subList.map(subtaskRow).join("")}${combinedFillers}</div>
          </div>
        </div>
      </div>`;
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
    headTitle = `<input id="new-todo-title" class="new-todo-title" type="text" placeholder="Nothing to do..." autocomplete="off" spellcheck="false" aria-label="New task">`;
  }

  // The old page-art was the postcard scene painted inside the theme. The same
  // art now lives in the independent wallpaper layer, so the page itself only
  // renders the theme's colours and typography.
  stage.innerHTML = `<div class="page-head"><div class="page-title banner-title project-folder-trigger" role="button" tabindex="0" data-action="choose-project-folder" aria-label="Open project folder"><svg class="banner-icon" aria-hidden="true"><use href="#${themeSymbol("header")}"></use></svg></div>${headTitle}</div>
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
  renderAgentTerminal();
  restoreAgentScroll(liveAgentScroll);
  refreshTaskBoard();
  bindCompletedSubtasksBar();
  if (risingSubtaskId) {
    justCompletedSubtaskId = null;
    // The finished row now lives in the right-hand lane. Fly it from where it
    // was in the pending lane, then let the other rows close the gap.
    const flipped = stage.querySelector(`.current-subtask[data-subtask-id="${CSS.escape(risingSubtaskId)}"]`);
    const originRect = previousSubtaskRects.get(risingSubtaskId);
    const landedRect = flipped?.getBoundingClientRect();
    let flightMs = 0;
    if (flipped && originRect && landedRect) {
      const dx = originRect.left - landedRect.left;
      const dy = originRect.top - landedRect.top;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        flightMs = COMPLETED_ROW_FLIGHT_MS;
        try {
          flipped.animate(
            [
              { transform: `translate(${dx}px, ${dy}px)` },
              { transform: "translate(0, 0)" },
            ],
            { duration: COMPLETED_ROW_FLIGHT_MS, easing: "cubic-bezier(.4,.05,.2,1)" }
          );
        } catch (error) {}
      }
    }
    // The row has landed in the card: let it sit for 0.6s, then retract the
    // card instead of waiting for the user to click the handle line.
    if (completedSubtasksOpen) {
      scheduleCompletedSubtasksAutoClose(flightMs + COMPLETED_DRAWER_DWELL_MS);
    }
    if (previousSubtaskRects.size) {
      requestAnimationFrame(() => {
        stage.querySelectorAll(".current-subtask[data-subtask-id]").forEach((row) => {
          if (row.dataset.subtaskId === risingSubtaskId) return;
          const beforeRect = previousSubtaskRects.get(row.dataset.subtaskId);
          if (!beforeRect) return;
          const delta = beforeRect.top - row.getBoundingClientRect().top;
          if (Math.abs(delta) < 2) return;
          try {
            row.animate(
              [{ transform: `translateY(${delta}px)` }, { transform: "none" }],
              { duration: 360, easing: "cubic-bezier(.2,.8,.2,1)" }
            );
          } catch (error) {}
        });
      });
    }
  }
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
  completedSubtasksOpen = Boolean(open);
  const bar = $(".completed-subtask-toggle");
  const drawer = $("#completed-subtask-drawer");
  if (!bar || !drawer) return;
  bar.classList.toggle("open", completedSubtasksOpen);
  bar.setAttribute("aria-expanded", completedSubtasksOpen ? "true" : "false");
  bar.setAttribute("aria-label", completedSubtasksOpen ? "Hide completed subtasks" : "Show completed subtasks");
  drawer.classList.toggle("open", completedSubtasksOpen);
  drawer.setAttribute("aria-hidden", completedSubtasksOpen ? "false" : "true");
  if (!completedSubtasksOpen) return;
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

/** A downward pull opens the drawer; an upward pull closes it. A tap stays a
    click, so the line can be used with either gesture. */
function bindCompletedSubtasksBar() {
  const bar = $(".completed-subtask-toggle");
  if (!bar || bar.dataset.gestureBound === "1") return;
  // Reaching into the card cancels the auto-retract so it cannot disappear
  // while the user is reading or scrolling the finished rows.
  const drawer = $("#completed-subtask-drawer");
  if (drawer && drawer.dataset.autoCloseBound !== "1") {
    drawer.dataset.autoCloseBound = "1";
    drawer.addEventListener("pointerdown", clearCompletedSubtasksAutoClose, { passive: true });
  }
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

function pluginThemeMessage() {
  return {
    type: "neotodo-theme",
    dark: document.documentElement.dataset.postcardDark === "true"
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

function openPluginPanel(id) {
  const plugin = PLUGIN_REGISTRY[id];
  const root = $("#plugin-root");
  if (!plugin || !root || openPluginId) return;
  if (!pluginEnabled(id)) {
    toast(`${plugin.title} is turned off`, true);
    return;
  }
  openPluginId = id;
  document.activeElement?.blur?.();
  AudioFX.drawer(true);
  root.innerHTML = `<iframe class="plugin-frame" title="${esc(plugin.title)}" src="${plugin.entry}" allow="autoplay"></iframe>`;
  root.setAttribute("aria-hidden", "false");
  root.classList.add("open");
  document.body.classList.add("plugin-open");
  const frame = root.querySelector(".plugin-frame");
  frame?.addEventListener("load", () => {
    syncPluginTheme();
    syncPluginSettings();
  });
  pluginThemeObserver = new MutationObserver(syncPluginTheme);
  pluginThemeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-postcard-dark"]
  });
}

function closePluginPanel() {
  if (!openPluginId) return;
  openPluginId = null;
  pluginThemeObserver?.disconnect();
  pluginThemeObserver = null;
  const root = $("#plugin-root");
  root?.classList.remove("open");
  root?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("plugin-open");
  if (root) root.innerHTML = "";
  AudioFX.drawer(false);
}

function pluginDefaultSettings(plugin) {
  const defaults = {};
  for (const item of plugin?.settings || []) {
    if (item.type === "toggle") defaults[item.id] = item.default !== false;
  }
  return defaults;
}

function pluginState(pluginId) {
  const plugin = PLUGIN_REGISTRY[pluginId];
  if (!plugin) return null;
  if (!settings.plugins || typeof settings.plugins !== "object") settings.plugins = {};
  let state = settings.plugins[pluginId];
  if (!state || typeof state !== "object") state = settings.plugins[pluginId] = {};
  if (typeof state.installed !== "boolean") state.installed = true;
  if (typeof state.enabled !== "boolean") state.enabled = state.installed;
  if (!state.settings || typeof state.settings !== "object" || Array.isArray(state.settings)) state.settings = {};
  for (const [key, value] of Object.entries(pluginDefaultSettings(plugin))) {
    if (typeof state.settings[key] !== "boolean") state.settings[key] = value;
  }
  return state;
}

function pluginEnabled(pluginId) {
  const state = pluginState(pluginId);
  return Boolean(state?.installed && state.enabled);
}

function applyPluginState() {
  document.querySelectorAll("[data-plugin]").forEach((node) => {
    node.classList.toggle("plugin-hidden", !pluginEnabled(node.dataset.plugin));
  });
  if (openPluginId && !pluginEnabled(openPluginId)) closePluginPanel();
}

/** Plugins that reshape the task stage need it redrawn when their switch flips. */
function refreshPluginSurface(pluginId) {
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
  applyPluginState();
  refreshPluginSurface(pluginId);
  AudioFX.categoryTap();
  if (settingsTab === "plugins") renderSettings();
  toast(`${plugin.title} ${state.enabled ? "turned on" : "turned off"}`);
}

function installPlugin(pluginId) {
  const plugin = PLUGIN_REGISTRY[pluginId];
  const state = pluginState(pluginId);
  if (!plugin || !state) return;
  state.installed = true;
  state.enabled = true;
  pluginPendingUninstallId = null;
  saveSettings();
  applyPluginState();
  refreshPluginSurface(pluginId);
  AudioFX.ding();
  renderSettings();
  toast(`${plugin.title} installed`);
}

function requestPluginUninstall(pluginId) {
  if (!PLUGIN_REGISTRY[pluginId]) return;
  pluginPendingUninstallId = pluginId;
  pluginDetailId = null;
  settingsTab = "plugins";
  renderSettings();
  const scroll = $(".settings-scroll");
  if (scroll) scroll.scrollTop = 0;
}

function confirmPluginUninstall(pluginId) {
  const plugin = PLUGIN_REGISTRY[pluginId];
  const state = pluginState(pluginId);
  if (!plugin || !state) return;
  state.installed = false;
  state.enabled = false;
  pluginPendingUninstallId = null;
  if (openPluginId === pluginId) closePluginPanel();
  saveSettings();
  applyPluginState();
  refreshPluginSurface(pluginId);
  AudioFX.paper();
  renderSettings();
  toast(`${plugin.title} uninstalled`);
}

function openPluginSettingsPage(pluginId, focus = "") {
  if (!PLUGIN_REGISTRY[pluginId]) return;
  settingsTab = "plugins";
  pluginDetailId = pluginId;
  pluginPendingUninstallId = null;
  renderSettings();
  const scroll = $(".settings-scroll");
  if (!scroll) return;
  scroll.scrollTop = 0;
  if (focus === "details") {
    requestAnimationFrame(() => {
      scroll.querySelector(".plugin-detail-about")?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }
}

function openPluginFromSettings(pluginId) {
  if (!pluginEnabled(pluginId)) return;
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
  renderSettings();
}

function openPluginMenu(button, pluginId) {
  const plugin = PLUGIN_REGISTRY[pluginId];
  if (!plugin) return;
  const rect = button.getBoundingClientRect();
  const off = !pluginEnabled(pluginId);
  const gearIcon = `<svg aria-hidden="true"><use href="#gear"></use></svg>`;
  const infoIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 10.8v5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="7.9" r="1" fill="currentColor"/></svg>`;
  const playIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6.4v11.2L18 12 9 6.4Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  openContextMenu(rect.right - 4, rect.bottom + 6, [
    { label: "Plugin settings", icon: gearIcon, run: () => openPluginSettingsPage(pluginId) },
    { label: "View details", icon: infoIcon, run: () => openPluginSettingsPage(pluginId, "details") },
    { label: "Open plugin", icon: playIcon, disabled: off, run: () => openPluginFromSettings(pluginId) },
    "-",
    { label: "Uninstall", icon: TRASH_ICON, danger: true, run: () => requestPluginUninstall(pluginId) },
  ]);
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
    if (item.icon) {
      button.innerHTML = `<span class="context-icon">${item.icon}</span><span>${esc(item.label)}</span>`;
    } else {
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
  const confirmed = await confirmDialog({
    kicker: "A new branch",
    title: `Would you want to fork “${subtask.name}”`,
    confirmLabel: "Enter",
  });
  if (!confirmed) return;
  const result = await action("fork_subtask", {
    todo_id: todo.id,
    subtask_id: subtask.id,
  });
  if (!result?.ok || !result.created) return;
  const url = `${location.origin}/?category=${encodeURIComponent(result.created)}&fork=1`;
  toast(`Forked “${subtask.name}”`);
  openNeoTodoWindow(url);
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
  if (!value) return;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
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
  } catch (error) {}
}

// The one subtask menu: Fork on top, then the clipboard trio. Whether the
// right-click lands on the row or inside its rename input, the menu looks the
// same; only the target of cut/copy/paste follows the pointer (text selection
// while renaming, the whole subtask otherwise).
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

async function readClipboardText() {
  try {
    if (navigator.clipboard?.readText) {
      return String((await navigator.clipboard.readText()) || "");
    }
  } catch (error) {}
  return "";
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

  const copy = async () => {
    const text = selection || subtask.name;
    if (!text) return;
    await copyToClipboard(text);
  };

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

  const paste = async () => {
    if (input) {
      const text = await readClipboardText();
      if (!text) return;
      replaceEditableSelection(input, text);
      return;
    }
    const text = (await readClipboardText()).split("\n")[0].trim();
    if (!text) return;
    action("add_subtask", { todo_id: current.id, name: text });
  };

  openContextMenu(x, y, [
    { label: "Fork", icon: FORK_ICON, run: () => forkSubtask(current, subtask) },
    { label: "Copy", run: copy },
    { label: "Cut", disabled: input ? !selection : subtask.done, run: cut },
    { label: "Paste", run: paste },
  ]);
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
    { label: "Fork", icon: FORK_ICON, run: () => forkSubtask(todo, subtask) },
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
  for (const category of state.data?.categories || []) {
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

function doingSubtaskHtml(entry, subtask) {
  const marked = doingMarkedSubtaskId === subtask.id ? "marked" : "";
  const unseen = unseenAgentSubtasks.has(subtask.id);
  return `<button class="doing-sub ${marked} ${unseen ? "has-unseen" : ""}" type="button" data-doing-subtask="${esc(subtask.id)}" data-doing-todo="${esc(entry.todo.id)}" data-category-id="${esc(entry.category.id)}">
    <span class="doing-fan ${unseen ? "has-unseen" : ""}" aria-hidden="true"><svg viewBox="0 0 1024 1024"><use href="#fan"></use></svg></span>
    <span class="doing-sub-name">${esc(subtask.name)}</span>
  </button>`;
}

function doingTodoHtml(entry) {
  const { category, todo } = entry;
  const subs = todo.subtasks || [];
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
      <span class="doing-count">${pending.length}/${subs.length}</span>
    </div>
    ${expanded && pending.length ? `<div class="doing-subs">${pending.map((subtask) => doingSubtaskHtml(entry, subtask)).join("")}</div>` : ""}
  </div>`;
}

function doingPeekMarkup(entries) {
  const wallpaper = activeWallpaper();
  const art = wallpaper.key
    ? `<div class="doing-art doing-art-wallpaper" aria-hidden="true">${wallpaperMediaMarkup("", { autoplay: doingPeekOpen })}</div>`
    : `<div class="doing-art doing-art-empty" aria-hidden="true"></div>`;
  return `${art}
  <div class="doing-kicker">
    <button class="doing-pin" type="button" data-doing-pin aria-label="Close Doing card">
      <svg viewBox="0 0 1024 1024" aria-hidden="true"><use href="#close-circle"></use></svg>
    </button>
    <span class="doing-label">Doing ...</span>
  </div>
    <div class="doing-list">${entries.map(doingTodoHtml).join("")}</div>`;
}

function doingPeekStateKey(entries) {
  return `${currentPostcardId()}|${wallpaperRenderKey()}|${[...doingExpandedTodoIds].join(",")}|${state.selectedCategoryId || ""}|${[...unseenAgentSubtasks].sort().join(",")}|${entries.map(({ todo }) =>
    `${todo.id}:${todoHasRunningAgent(todo) ? 1 : 0}:${todo.name}:${(todo.subtasks || []).length}:${orderedSubtasks(todo).filter((subtask) => !subtask.done).map((subtask) => subtask.id).join(",")}`
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
  // A wider band along the column border: fast rightward swipes often
  // overshoot the old 16px tolerance and missed the card entirely.
  doingZone = {
    left: rect.right - 56,
    right: rect.right + 80,
    top: rect.top + 8,
    bottom: rect.bottom + 4,
  };
  doingZoneAt = performance.now();
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
  const rightOffset = Math.max(0, window.innerWidth - rect.right);
  panel.style.right = `${rightOffset}px`;
  panel.style.top = `${top}px`;
  panel.style.height = `${doingCardHeight}px`;
  panel.style.maxHeight = `${Math.max(180, window.innerHeight - top - 12)}px`;
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

function updateDoingPeek(force = false) {
  const entries = doingEntries();
  pruneUnseenAgentSubtasks();
  let panel = $("#doing-peek");
  if (!entries.length) {
    if (panel) panel.remove();
    doingPeekOpen = false;
    document.body.classList.remove("doing-peek-open");
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
    panel.innerHTML = doingPeekMarkup(entries);
    const nextList = panel.querySelector(".doing-list");
    if (nextList) nextList.scrollTop = previousScroll;
    animateDoingReorder(previousTops, nextList);
  }
  panel.classList.toggle("open", doingPeekOpen);
  const list = panel.querySelector(".doing-list");
  bindDoingCard(list);
  positionDoingPeek();
}

function openDoingPeek() {
  clearTimeout(doingPeekOpenTimer);
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
  panel.classList.add("open");
  panel.querySelectorAll(".doing-art video").forEach((video) => video.play().catch(() => {}));
}

function closeDoingPeek() {
  clearTimeout(doingPeekOpenTimer);
  if (!doingPeekOpen) return;
  doingPeekOpen = false;
  document.body.classList.remove("doing-peek-open");
  doingExpandedTodoIds.clear();
  const panel = $("#doing-peek");
  if (panel) {
    panel.classList.remove("open");
    panel.querySelectorAll(".doing-art video").forEach((video) => video.pause());
  }
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
  doingMarkedTodoId = todoId;
  if (doingExpandedTodoIds.has(todoId)) doingExpandedTodoIds.delete(todoId);
  else doingExpandedTodoIds.add(todoId);
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

function prepareWallpaperImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const max = 2560;
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
        context.fillStyle = "#101318";
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.90));
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
  if (actionName === "show-completed") { spinAchievementCounter(element); AudioFX.bassFade(); openCompletedLog(); return; }
  if (actionName === "toggle-completed-subtasks") {
    if (performance.now() < suppressCompletedSubtaskToggleUntil) return;
    toggleCompletedSubtasks();
    return;
  }
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
  if (actionName === "plugin-menu") { openPluginMenu(element, element?.dataset.pluginId || ""); return; }
  if (actionName === "plugin-back") {
    pluginDetailId = null;
    pluginPendingUninstallId = null;
    renderSettings();
    const settingsScroll = $(".settings-scroll");
    if (settingsScroll) settingsScroll.scrollTop = 0;
    return;
  }
  if (actionName === "install-plugin") { installPlugin(element?.dataset.pluginId || ""); return; }
  if (actionName === "uninstall-plugin") { requestPluginUninstall(element?.dataset.pluginId || ""); return; }
  if (actionName === "confirm-plugin-uninstall") { confirmPluginUninstall(element?.dataset.pluginId || ""); return; }
  if (actionName === "cancel-plugin-uninstall") { pluginPendingUninstallId = null; renderSettings(); return; }
  if (actionName === "open-plugin") { openPluginFromSettings(element?.dataset.pluginId || ""); return; }
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
  if (actionName === "choose-project-folder") { chooseProjectFolder(); return; }
  if (actionName === "clear-project-folder") { clearProjectFolder(); return; }
  if (actionName === "toggle-sound") { AudioFX.toggle(); updateSoundToggle(); renderSettings(); return; }
  if (actionName === "preview-sound") {
    AudioFX.unlock();
    if (element?.dataset.soundKey) AudioFX.audition(element.dataset.soundKey);
    return;
  }
  if (actionName === "open-sounds-folder") { silentAction("open_sounds_folder"); return; }
  if (actionName === "open-pictures-folder") { silentAction("open_pictures_folder"); return; }
  if (actionName === "refresh-wallpaper-files") { loadWallpaperFiles(); return; }
  if (actionName === "clear-wallpaper") {
    if (settings.wallpaper_mode === "dynamic") settings.wallpaper_dynamic = "";
    else if (settings.wallpaper_mode === "static") settings.wallpaper_static = "";
    settings.wallpaper_mode = "none";
    saveSettings();
    applySettings();
    renderSettings();
    toast("Wallpaper cleared");
    return;
  }
  if (actionName === "choose-wallpaper-image") { $("#wallpaper-image-input")?.click(); return; }
  if (actionName === "choose-wallpaper-video") { $("#wallpaper-video-input")?.click(); return; }
  if (actionName === "choose-sticker-image") {
    const id = element?.dataset.stickerId || "";
    const input = document.querySelector(`[data-sticker-input="${CSS.escape(id)}"]`);
    input?.click();
    return;
  }
  if (actionName === "reset-sticker-image") {
    const id = element?.dataset.stickerId || "";
    if (settings.sticker_backgrounds?.[id]) delete settings.sticker_backgrounds[id];
    saveSettings();
    applyStickerBackgrounds();
    renderSettings();
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
  if (actionName === "toggle-ai-caret-blink") {
    settings.ai_caret_blink = !settings.ai_caret_blink;
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
  if (actionName === "open-timer-achievement") { spinAchievementCounter(element); AudioFX.guitarPluck(); openFocusAchievements(); return; }
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
    justCompletedSubtaskId = subtaskId;
    const result = await action("complete_subtask", { todo_id: todoId, subtask_id: subtaskId });
    if (result.ok) {
      delete subtaskAgentModels[subtaskId];
      saveSubtaskAgentModels();
      updateSubtaskAgentDom(subtaskId, { model: "" });
      AudioFX.itemGet();
      finishedToast();
      const check = document.querySelector(`.current-subtask[data-subtask-id="${CSS.escape(subtaskId)}"] .sub-done-check`);
      if (check) {
        check.classList.add("check-in");
        setTimeout(() => check.classList.remove("check-in"), 420);
      }
    } else {
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
  const savedHasWallpaper = saved && typeof saved === "object"
    && ("wallpaper_mode" in saved || "wallpaper_static" in saved);
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
  settings.ai_caret_blink = settings.ai_caret_blink !== false;
  if (settings.ai_caret_shape !== "block") settings.ai_caret_shape = "line";
  if (!/^#[0-9a-f]{6}$/i.test(String(settings.ai_caret_dark || ""))) settings.ai_caret_dark = "#f4f6f8";
  if (!/^#[0-9a-f]{6}$/i.test(String(settings.ai_caret_light || ""))) settings.ai_caret_light = "#1b1b1b";
  if (!/^[a-z0-9_-]+$/i.test(String(settings.note_material || ""))) settings.note_material = "paper";
  if (!/^[a-z0-9_-]+\.css$/i.test(String(settings.note_material_file || ""))) {
    settings.note_material_file = materialFileForId(settings.note_material);
  }
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
  const rawStatic = typeof settings.wallpaper_static === "string" ? settings.wallpaper_static : "";
  const artId = rawStatic.startsWith("art:") ? rawStatic.slice(4) : "";
  settings.wallpaper_static = artId && THEMES[artId]
    ? `art:${artId}`
    : pictureName(rawStatic, /\.(jpe?g|png|webp|gif|avif)$/i);
  settings.wallpaper_dynamic = pictureName(settings.wallpaper_dynamic, /\.(mp4|webm|mov|m4v|ogv)$/i);
  // The old build painted the postcard art inside the theme. That exact art is
  // now the default static wallpaper, so upgrading keeps the same look while
  // letting the pattern and the colour palette change independently.
  if (!savedHasWallpaper) {
    settings.wallpaper_mode = "static";
    settings.wallpaper_static = `art:${currentPostcardId()}`;
  } else if (settings.wallpaper_mode === "theme" || !["none", "static", "dynamic"].includes(settings.wallpaper_mode)) {
    settings.wallpaper_mode = "static";
  }
  if (settings.wallpaper_mode === "static" && !settings.wallpaper_static) {
    settings.wallpaper_static = `art:${currentPostcardId()}`;
  }
  // Plugins are installed through Settings → Plugins. A missing record means a
  // bundled plugin, so existing notebooks keep the bead studio after upgrading.
  const savedPlugins = settings.plugins && typeof settings.plugins === "object" && !Array.isArray(settings.plugins)
    ? settings.plugins
    : {};
  settings.plugins = { ...savedPlugins };
  for (const plugin of Object.values(PLUGIN_REGISTRY)) {
    const savedPlugin = settings.plugins[plugin.id];
    const pluginRecord = savedPlugin && typeof savedPlugin === "object" ? savedPlugin : {};
    pluginRecord.installed = pluginRecord.installed !== false;
    pluginRecord.enabled = pluginRecord.installed && pluginRecord.enabled !== false;
    const values = pluginRecord.settings && typeof pluginRecord.settings === "object" && !Array.isArray(pluginRecord.settings)
      ? { ...pluginRecord.settings }
      : {};
    for (const [key, value] of Object.entries(pluginDefaultSettings(plugin))) {
      if (typeof values[key] !== "boolean") values[key] = value;
    }
    pluginRecord.settings = values;
    settings.plugins[plugin.id] = pluginRecord;
  }
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
  const counter = element?.closest?.(".trophy-button, .tomato-counter");
  if (!counter) return;
  counter.classList.remove("ach-click-spin");
  void counter.offsetWidth;
  counter.classList.add("ach-click-spin");
  clearTimeout(counter._achSpinTimer);
  counter._achSpinTimer = setTimeout(() => counter.classList.remove("ach-click-spin"), 400);
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

function wallpaperUrl(name) {
  const encoded = encodeURIComponent(String(name || "")).replace(/[!'()*]/g, (ch) => (
    `%${ch.charCodeAt(0).toString(16).toUpperCase()}`
  ));
  return `/user-pictures/${encoded}`;
}

function activeWallpaper() {
  if (settings.wallpaper_mode === "static") {
    const value = String(settings.wallpaper_static || "");
    if (value.startsWith("art:")) {
      const artId = value.slice(4);
      if (THEMES[artId]) return { mode: "static", kind: "art", artId, key: `static:art:${artId}` };
    } else if (value) {
      return { mode: "static", kind: "image", file: value, key: `static:file:${value}` };
    }
    return { mode: "none", kind: "none", key: "" };
  }
  if (settings.wallpaper_mode === "dynamic" && settings.wallpaper_dynamic) {
    return { mode: "dynamic", kind: "video", file: settings.wallpaper_dynamic, key: `dynamic:${settings.wallpaper_dynamic}` };
  }
  return { mode: "none", kind: "none", key: "" };
}

function wallpaperRenderKey() {
  return activeWallpaper().key;
}

function wallpaperMediaMarkup(extraClass = "", { autoplay = true } = {}) {
  const wallpaper = activeWallpaper();
  if (!wallpaper.key) return "";
  if (wallpaper.kind === "art") {
    const theme = THEMES[wallpaper.artId] || THEMES.violet;
    return `<div class="wallpaper-media wallpaper-art ${extraClass}">${theme.art(theme)}</div>`;
  }
  const src = esc(wallpaperUrl(wallpaper.file));
  if (wallpaper.kind === "image") {
    return `<img class="wallpaper-media ${extraClass}" src="${src}" alt="" draggable="false">`;
  }
  return `<video class="wallpaper-media ${extraClass}" src="${src}" muted loop playsinline preload="auto"${autoplay ? " autoplay" : ""}></video>`;
}

function wallpaperDisplayName(wallpaper = activeWallpaper()) {
  if (wallpaper.kind === "art") return `Static · ${postcardName(wallpaper.artId)}`;
  if (wallpaper.kind === "image") return `Static · ${wallpaper.file}`;
  if (wallpaper.kind === "video") return `Dynamic · ${wallpaper.file}`;
  if (settings.wallpaper_mode === "dynamic") return "Choose a film";
  return "No wallpaper";
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
      applyDoingPalette(THEMES[currentPostcardId()] || THEMES.violet);
    }
  } catch (error) {}
}

function bindWallpaperMedia(media, key) {
  if (media.tagName === "DIV") return;
  const sample = () => sampleWallpaperTint(media, key);
  media.addEventListener("error", () => {
    if (wallpaperRenderKey() !== key) return;
    if (key.startsWith("dynamic:")) {
      settings.wallpaper_dynamic = "";
      settings.wallpaper_mode = settings.wallpaper_static ? "static" : "none";
    } else {
      settings.wallpaper_static = `art:${currentPostcardId()}`;
      settings.wallpaper_mode = "static";
    }
    saveSettings();
    applySettings();
    if (settingsTab === "pictures") renderSettings();
    toast("That wallpaper could not be opened", true);
  }, { once: true });
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
  root.dataset.wallpaper = wallpaper.key ? wallpaper.mode : "none";
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
}

function applyDoingPalette(postcard) {
  const root = document.documentElement;
  const theme = postcard || THEMES[currentPostcardId()] || THEMES.violet;
  const wallpaper = activeWallpaper();
  const artTheme = wallpaper.kind === "art" ? THEMES[wallpaper.artId] : null;
  const tint = artTheme
    ? (artTheme.paper2 || artTheme.accent)
    : (wallpaper.file ? wallpaperTintCache.get(wallpaper.key) : "");
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
  applyStickerBackgrounds();
  root.dataset.font = settings.font;
  root.dataset.noteFont = settings.note_font;
  root.style.setProperty("--user-scale", String(settings.scale));
  root.style.setProperty("--title-offset", `${settings.title_offset}px`);
  root.style.setProperty("--title-icon-size", `${settings.title_icon_size}px`);
  document.body.classList.toggle("clock-hidden", !settings.show_clock);
  document.body.classList.add("custom-caret");
  applyPluginState();
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
    root.style.setProperty("--pc-paper2-rgb", hexToRgb(postcard.paper2));
    applyDoingPalette(postcard);
    root.style.setProperty("--pc-ink", postcard.ink);
    root.style.setProperty("--pc-muted", postcard.muted);
    root.style.setProperty("--pc-border", postcard.border || postcard.accent2);
    root.style.setProperty("--pc-stamp", postcard.stamp || postcard.accent);
    root.style.setProperty("--pc-line", `rgba(${hexToRgb(postcard.ink)}, .16)`);
    root.style.setProperty("--pc-rule", `rgba(${hexToRgb(postcard.ink)}, .13)`);
    // The postcard scene is a wallpaper now; it no longer paints a second
    // copy behind the page as part of the theme.
    if (backdrop) {
      backdrop.hidden = true;
      backdrop.innerHTML = "";
    }
  }
  applyWallpaper();
  const achievement = $("#achievement-icon-use");
  if (achievement) achievement.setAttribute("href", "#headphone");
  const topAchievement = $("#top-achievement-use");
  if (topAchievement) topAchievement.setAttribute("href", "#headphone");
  updateArchiveIcon();
}

function openSettings(tab = "appearance") {
  settingsTab = tab;
  pluginDetailId = null;
  pluginPendingUninstallId = null;
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
  loadWallpaperFiles();
}

function closeSettings() {
  flushSettingsSave();
  pluginDetailId = null;
  pluginPendingUninstallId = null;
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
    <p class="wallpaper-hint appearance-wallpaper-hint">This theme sets the colours, cards and ink. The background pattern is a separate wallpaper — choose postcard art, a picture or an MP4 in <strong>Pictures</strong>.</p>
    <div class="settings-section">
      <div class="settings-label">Note material <span>surface</span></div>
      <div class="note-material-picker">
        <button class="note-material-current" type="button" data-action="toggle-note-material-menu" aria-expanded="${noteMaterialMenuOpen ? "true" : "false"}">
          <span>${esc(materialDisplayName(settings.note_material_file || materialFileForId(settings.note_material)))}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        ${noteMaterialMenuOpen ? `<div class="note-material-menu" role="listbox" aria-label="Note material">
          ${(noteMaterialFiles.length ? noteMaterialFiles : ["paper.css", "glass.css"]).map((file) => {
            const active = (settings.note_material_file || materialFileForId(settings.note_material)) === file;
            return `<button class="note-material-option ${active ? "active" : ""}" type="button" data-note-material-file="${esc(file)}" role="option" aria-selected="${active ? "true" : "false"}"><span class="note-material-check">${active ? "✓" : ""}</span><span>${esc(materialDisplayName(file))}</span></button>`;
          }).join("")}
        </div>` : ""}
      </div>
      <button class="btn small note-materials-open" type="button" data-action="open-note-materials-folder">Open note materials folder</button>
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
    </div>
    <div class="settings-section">
      <div class="settings-label">AI caret <span>cursor</span></div>
      <button class="settings-toggle ${settings.ai_caret_blink ? "active" : ""}" data-action="toggle-ai-caret-blink" aria-pressed="${settings.ai_caret_blink ? "true" : "false"}">
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span class="toggle-copy"><strong>Blinking caret</strong><small>Keep the AI cursor flashing while you type.</small></span>
      </button>
      <div class="font-grid caret-shape-grid">
        <button class="font-choice ${settings.ai_caret_shape !== "block" ? "active" : ""}" data-ai-caret-shape="line">
          <span class="caret-sample caret-sample-line" style="--sample:${aiCaretColor()}"></span>
          <span class="font-copy"><strong>Line</strong><small>A thin text line.</small></span>
          <span class="choice-check">✓</span>
        </button>
        <button class="font-choice ${settings.ai_caret_shape === "block" ? "active" : ""}" data-ai-caret-shape="block">
          <span class="caret-sample caret-sample-block" style="--sample:${aiCaretColor()}"></span>
          <span class="font-copy"><strong>Block</strong><small>A solid character block.</small></span>
          <span class="choice-check">✓</span>
        </button>
      </div>
      <div class="caret-color-row ai-caret-color-row">
        <label>AI caret colour</label>
        <span class="ai-caret-mode">Dark</span>
        <input id="ai-caret-dark" type="color" value="${settings.ai_caret_dark}" aria-label="Dark theme AI caret colour">
        <span class="ai-caret-divider">/</span>
        <span class="ai-caret-mode">Light</span>
        <input id="ai-caret-light" type="color" value="${settings.ai_caret_light}" aria-label="Light theme AI caret colour">
      </div>
    </div>
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
`;
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
  if (settingsTab === "appearance") renderSettings();
}

function loadWallpaperFiles() {
  if (wallpaperFilesRequest) return wallpaperFilesRequest;
  wallpaperFilesRequest = silentAction("wallpaper_files").then((result) => {
    wallpaperFilesRequest = null;
    if (!result?.ok) return;
    wallpaperFiles = {
      images: Array.isArray(result.images) ? result.images : [],
      videos: Array.isArray(result.videos) ? result.videos : [],
    };
    if (settingsTab === "pictures") renderSettings();
  });
  return wallpaperFilesRequest;
}

function wallpaperChoiceCard(name, kind) {
  const isVideo = kind === "video";
  const mode = isVideo ? "dynamic" : "static";
  const value = isVideo ? settings.wallpaper_dynamic : settings.wallpaper_static;
  const selected = settings.wallpaper_mode === mode && value === name;
  const label = esc(name);
  const thumb = isVideo
    ? `<span class="wallpaper-thumb wallpaper-thumb-video"><video src="${esc(wallpaperUrl(name))}" preload="metadata" muted playsinline></video><span class="wallpaper-play" aria-hidden="true">▶</span></span>`
    : `<span class="wallpaper-thumb" style="background-image:url('${esc(wallpaperUrl(name))}')"></span>`;
  return `<div class="wallpaper-choice ${selected ? "active" : ""}">
    <button class="wallpaper-choice-main" type="button" data-wallpaper-file="${esc(name)}" data-wallpaper-kind="${kind}" title="${label}" aria-pressed="${selected ? "true" : "false"}">
      ${thumb}
      <span class="wallpaper-name">${label}</span>
    </button>
  </div>`;
}

function wallpaperArtChoice(artId) {
  const theme = THEMES[artId];
  if (!theme) return "";
  const selected = settings.wallpaper_mode === "static" && settings.wallpaper_static === `art:${artId}`;
  return `<div class="wallpaper-choice ${selected ? "active" : ""}">
    <button class="wallpaper-choice-main" type="button" data-wallpaper-art="${esc(artId)}" title="${esc(theme.name)}" aria-pressed="${selected ? "true" : "false"}">
      <span class="wallpaper-thumb wallpaper-thumb-art">${theme.art(theme)}</span>
      <span class="wallpaper-name">${esc(theme.name)}</span>
    </button>
  </div>`;
}

function wallpaperPreviewMarkup(wallpaper) {
  if (!wallpaper.key) {
    const waitingForFilm = settings.wallpaper_mode === "dynamic";
    return `<div class="wallpaper-preview-empty"><span>${waitingForFilm ? "No film selected" : "No wallpaper"}</span><small>${waitingForFilm ? "Choose an MP4 below" : "Theme paper only"}</small></div>`;
  }
  return `<div class="wallpaper-preview-media">${wallpaperMediaMarkup("", { autoplay: true })}</div>`;
}

function wallpaperSettingsSection() {
  const mode = settings.wallpaper_mode;
  const wallpaper = activeWallpaper();
  const modeCard = (id, title, detail) => `<button class="wallpaper-mode-card ${mode === id ? "active" : ""}" type="button" data-wallpaper-mode="${id}" aria-pressed="${mode === id ? "true" : "false"}">
    <strong>${title}</strong>
    <small>${detail}</small>
  </button>`;
  const images = wallpaperFiles.images || [];
  const videos = wallpaperFiles.videos || [];
  const current = `<div class="wallpaper-current ${wallpaper.key ? "has-wallpaper" : "is-empty"}">
      ${wallpaperPreviewMarkup(wallpaper)}
      ${wallpaper.key ? `<button class="wallpaper-clear" type="button" data-action="clear-wallpaper" aria-label="Clear wallpaper" title="Clear wallpaper">
        <svg viewBox="0 0 1024 1024" aria-hidden="true"><use href="#close-circle"></use></svg>
      </button>` : ""}
      <div class="wallpaper-current-copy">
        <small>${wallpaper.key ? "In use" : "Wallpaper"}</small>
        <strong>${esc(wallpaperDisplayName(wallpaper))}</strong>
      </div>
    </div>`;
  const staticPicker = `<div class="wallpaper-picker">
      <div class="wallpaper-group">
        <div class="wallpaper-group-head"><span>Postcard art</span></div>
        <div class="wallpaper-grid">${WALLPAPER_ART_IDS.map(wallpaperArtChoice).join("")}</div>
      </div>
      <div class="wallpaper-group">
        <div class="wallpaper-group-head">
          <span>Pictures</span>
          <button class="btn small" type="button" data-action="choose-wallpaper-image">Choose image</button>
        </div>
        ${images.length
          ? `<div class="wallpaper-grid">${images.map((name) => wallpaperChoiceCard(name, "image")).join("")}</div>`
          : `<div class="wallpaper-empty">No pictures yet. Add JPG, PNG or WEBP files to the pictures folder.</div>`}
      </div>
      <div class="wallpaper-actions">
        <button class="btn small" type="button" data-action="open-pictures-folder">Open pictures folder</button>
        <button class="btn small" type="button" data-action="refresh-wallpaper-files">Refresh list</button>
      </div>
      <input id="wallpaper-image-input" type="file" accept="image/*" hidden>
    </div>`;
  const dynamicPicker = `<div class="wallpaper-picker">
      <div class="wallpaper-group">
        <div class="wallpaper-group-head">
          <span>Films</span>
          <button class="btn small" type="button" data-action="choose-wallpaper-video">Choose MP4</button>
        </div>
        ${videos.length
          ? `<div class="wallpaper-grid">${videos.map((name) => wallpaperChoiceCard(name, "video")).join("")}</div>`
          : `<div class="wallpaper-empty">No films yet. Add an MP4, WEBM or MOV file to the pictures folder, then choose it here.</div>`}
      </div>
      <div class="wallpaper-actions">
        <button class="btn small" type="button" data-action="open-pictures-folder">Open pictures folder</button>
        <button class="btn small" type="button" data-action="refresh-wallpaper-files">Refresh list</button>
      </div>
      <input id="wallpaper-video-input" type="file" accept="video/mp4,video/webm,video/quicktime,video/x-m4v,video/ogg" hidden>
    </div>`;
  return `<div class="settings-section wallpaper-section">
      <div class="settings-label">Wallpaper <span>pattern</span></div>
      <p class="wallpaper-hint">Pattern and colour are independent. Pick a static picture or a looping MP4 for the room; the postcard theme keeps the cards, ink and paper.</p>
      ${current}
      <div class="wallpaper-mode-row">
        ${modeCard("static", "Static wallpaper", "Postcard art or a picture")}
        ${modeCard("dynamic", "Dynamic wallpaper", "A looping MP4 film")}
      </div>
      ${mode === "static" ? staticPicker : mode === "dynamic" ? dynamicPicker : ""}
    </div>`;
}

function picturesSettings() {
  const cards = STICKER_TARGETS.map((target) => {
    const config = stickerSettingsFor(target.id);
    const hasImage = Boolean(config?.image);
    const zoom = hasImage ? Math.round(config.zoom * 100) : 100;
    const x = hasImage ? Math.round(config.x) : 50;
    const y = hasImage ? Math.round(config.y) : 50;
    const preview = config?.image || target.fallback;
    return `<div class="sticker-setting-card" data-sticker-card="${target.id}">
      <span class="sticker-setting-preview"><img src="${esc(preview)}" alt="" style="${stickerImageStyle(config)}"></span>
      <div class="sticker-setting-body">
        <div class="sticker-setting-head"><strong>${esc(target.name)}</strong><small>${esc(target.detail)}</small></div>
        <div class="sticker-setting-hint">${hasImage ? "Drag the crop until the sticker shows the part you want." : "Using the original art. Choose a picture to use your own."}</div>
        <div class="sticker-crop-row">
          <label>Zoom <span data-sticker-value="zoom">${zoom}%</span></label>
          <input type="range" min="100" max="260" step="2" value="${zoom}" data-sticker-field="zoom" data-sticker-id="${target.id}" ${hasImage ? "" : "disabled"}>
        </div>
        <div class="sticker-crop-row">
          <label>Across <span data-sticker-value="x">${x}%</span></label>
          <input type="range" min="0" max="100" step="1" value="${x}" data-sticker-field="x" data-sticker-id="${target.id}" ${hasImage ? "" : "disabled"}>
        </div>
        <div class="sticker-crop-row">
          <label>Down <span data-sticker-value="y">${y}%</span></label>
          <input type="range" min="0" max="100" step="1" value="${y}" data-sticker-field="y" data-sticker-id="${target.id}" ${hasImage ? "" : "disabled"}>
        </div>
        <div class="sticker-setting-actions">
          <button class="btn small" type="button" data-action="choose-sticker-image" data-sticker-id="${target.id}">${hasImage ? "Replace picture" : "Choose picture"}</button>
          <button class="btn small" type="button" data-action="reset-sticker-image" data-sticker-id="${target.id}" ${hasImage ? "" : "disabled"}>Reset</button>
        </div>
        <input type="file" accept="image/*" data-sticker-input="${target.id}" hidden>
      </div>
    </div>`;
  }).join("");
  return `<div class="settings-head"><h2>Pictures</h2><p>Choose the wallpaper behind NeoTodo and the pictures on each achievement.</p></div>
    ${wallpaperSettingsSection()}
    <div class="settings-section">
      <div class="settings-label">Sticker backgrounds <span>pictures</span></div>
      <div class="sticker-settings-grid">${cards}</div>
    </div>`;
}

function soundSettings() {
  const on = !AudioFX.muted;
  const volume = Math.round(AudioFX.getVolume() * 100);
  const files = Object.entries(AudioFX.sampleFiles())
    .map(([key, url]) => {
      const name = String(url).split("/").pop();
      return `<button class="sound-file" type="button" data-action="preview-sound" data-sound-key="${esc(key)}">
        <span class="sound-file-play" aria-hidden="true">▶</span>
        <span class="sound-file-name">${esc(name)}</span>
      </button>`;
    })
    .join("");
  return `<div class="settings-head"><h2>Sound</h2></div>
    <div class="settings-section">
      <div class="settings-label">Sound</div>
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
      <div class="settings-label">Audio files</div>
      <div class="sound-settings-list">${files}</div>
      <button class="btn small" type="button" data-action="open-sounds-folder">Open sounds folder</button>
    </div>`;
}

function aboutSettings() {
  return `<div class="settings-head"><h2>About</h2><p>A small, quiet place for the next thing.</p></div>
    <div class="settings-section about-section">
      <div><span>NeoTodo</span><small>Desktop edition</small></div>
      <div><span>Theme</span><small>明信片 / ${postcardName(currentPostcardId())}</small></div>
      <div><span>Body font</span><small>${FONT_OPTIONS.find((font) => font.id === settings.font)?.name || "Art Serif"}</small></div>
      <div><span>Note font</span><small>${FONT_OPTIONS.find((font) => font.id === settings.note_font)?.name || "Art Serif"}</small></div>
      <div><span>Shortcuts</span><small>Tab — Toggle categories · J/K — Move categories</small></div>
      <div><span>Project</span><small><a class="about-link" href="https://github.com/CellMeet/Neotodo" data-external-link="https://github.com/CellMeet/Neotodo">github.com/CellMeet/Neotodo</a></small></div>
      <div><span>Email</span><small><a class="about-link" href="mailto:cellmeet@163.com" data-external-link="mailto:cellmeet@163.com">cellmeet@163.com</a></small></div>
      <div><span>Version</span><small>0.0.1</small></div>
    </div>
    <div class="about-bottom">
      <div class="about-thanks"><em>Thanks</em></div>
    </div>`;
}

function pluginIconMarkup(plugin, extraClass = "") {
  return `<span class="plugin-icon ${extraClass}"><img src="${esc(plugin.icon || "/plugins/pindou/pindou.svg")}" alt=""></span>`;
}

function pluginUninstallConfirmMarkup(plugin) {
  if (!plugin) return "";
  return `<div class="plugin-uninstall-confirm">
    <div>
      <strong>Uninstall ${esc(plugin.title)}?</strong>
      <p>It will leave your notebook and its tool rail button will disappear. The plugin files and your saved artwork stay on disk, so you can install it again from Available.</p>
    </div>
    <div class="plugin-uninstall-actions">
      <button class="btn small" type="button" data-action="cancel-plugin-uninstall">Cancel</button>
      <button class="btn small danger" type="button" data-action="confirm-plugin-uninstall" data-plugin-id="${esc(plugin.id)}">Uninstall</button>
    </div>
  </div>`;
}

function pluginsSettings() {
  const plugins = Object.values(PLUGIN_REGISTRY);
  const installed = plugins.filter((plugin) => pluginState(plugin.id)?.installed);
  const available = plugins.filter((plugin) => !pluginState(plugin.id)?.installed);
  const pending = pluginPendingUninstallId ? PLUGIN_REGISTRY[pluginPendingUninstallId] : null;
  const rows = installed.map((plugin) => {
    const state = pluginState(plugin.id);
    const on = Boolean(state.enabled);
    return `<div class="plugin-row ${on ? "" : "plugin-off"}" data-plugin-row="${esc(plugin.id)}">
      ${pluginIconMarkup(plugin)}
      <div class="plugin-copy">
        <strong>${esc(plugin.title)}</strong>
        <small>${esc(plugin.englishTitle || plugin.id)} · v${esc(plugin.version || "1.0.0")}</small>
        <p>${esc(plugin.description || "")}</p>
      </div>
      <button class="plugin-power ${on ? "active" : ""}" type="button" data-action="toggle-plugin" data-plugin-id="${esc(plugin.id)}" aria-pressed="${on ? "true" : "false"}" aria-label="${on ? "Turn off" : "Turn on"} ${esc(plugin.title)}">
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
      </button>
      <button class="plugin-menu-button" type="button" data-action="plugin-menu" data-plugin-id="${esc(plugin.id)}" aria-label="Options for ${esc(plugin.title)}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.65" fill="currentColor"/><circle cx="12" cy="12" r="1.65" fill="currentColor"/><circle cx="12" cy="19" r="1.65" fill="currentColor"/></svg>
      </button>
    </div>`;
  }).join("");
  const availableRows = available.map((plugin) => `<div class="plugin-row plugin-available">
      ${pluginIconMarkup(plugin)}
      <div class="plugin-copy">
        <strong>${esc(plugin.title)}</strong>
        <small>${esc(plugin.englishTitle || plugin.id)} · v${esc(plugin.version || "1.0.0")}</small>
      </div>
      <button class="btn small" type="button" data-action="install-plugin" data-plugin-id="${esc(plugin.id)}">Install</button>
    </div>`).join("");
  return `<div class="settings-head"><h2>Plugins</h2><p>Small tools that live inside NeoTodo. Turn one off when you want a quieter notebook.</p></div>
    ${pluginUninstallConfirmMarkup(pending)}
    <div class="settings-section">
      <div class="settings-label">Installed <span>${installed.length}</span></div>
      ${installed.length ? `<div class="plugin-list">${rows}</div>` : `<div class="plugin-empty">No plugins installed. The core notebook stays simple.</div>`}
    </div>
    ${available.length ? `<div class="settings-section">
      <div class="settings-label">Available <span>built in</span></div>
      <div class="plugin-list">${availableRows}</div>
    </div>` : ""}
    <div class="plugin-market-note">
      <strong>More plugins are coming.</strong>
      <span>Notes, AI, and more will become independent plugins, so the notebook itself can stay small.</span>
    </div>`;
}

function pluginDetailSettings(pluginId) {
  const plugin = PLUGIN_REGISTRY[pluginId];
  const state = pluginState(pluginId);
  if (!plugin || !state) return pluginsSettings();
  const on = Boolean(state.enabled);
  const settingRows = (plugin.settings || []).map((item) => {
    if (item.type !== "toggle") return "";
    const value = Boolean(state.settings?.[item.id]);
    return `<button class="settings-toggle plugin-setting-toggle ${value ? "active" : ""}" type="button" data-action="toggle-plugin-setting" data-plugin-id="${esc(plugin.id)}" data-plugin-setting="${esc(item.id)}" aria-pressed="${value ? "true" : "false"}">
      <span class="toggle-track"><span class="toggle-thumb"></span></span>
      <span class="toggle-copy"><strong>${esc(item.label)}</strong><small>${esc(item.detail || "")}</small></span>
    </button>`;
  }).join("");
  const pending = pluginPendingUninstallId === pluginId ? plugin : null;
  return `<button class="plugin-back" type="button" data-action="plugin-back">${BACK_ICON}<span>Plugins</span></button>
    <div class="settings-head plugin-detail-head">
      ${pluginIconMarkup(plugin, "plugin-icon-large")}
      <div class="plugin-detail-title">
        <h2>${esc(plugin.title)}</h2>
        <p>${esc(plugin.englishTitle || plugin.id)} · v${esc(plugin.version || "1.0.0")}${plugin.author ? ` · by ${esc(plugin.author)}` : ""}</p>
      </div>
    </div>
    <p class="plugin-detail-description">${esc(plugin.description || "")}</p>
    <div class="settings-section">
      <div class="settings-label">Plugin <span>${on ? "on" : "off"}</span></div>
      <button class="settings-toggle ${on ? "active" : ""}" type="button" data-action="toggle-plugin" data-plugin-id="${esc(plugin.id)}" aria-pressed="${on ? "true" : "false"}">
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span class="toggle-copy"><strong>${on ? "On" : "Off"}</strong><small>${on ? "The plugin sits in the left tool rail." : "The plugin is installed but hidden from the notebook."}</small></span>
      </button>
      <div class="plugin-detail-actions">
        <button class="btn small" type="button" data-action="open-plugin" data-plugin-id="${esc(plugin.id)}" ${on ? "" : "disabled"}>Open plugin</button>
      </div>
    </div>
    <div class="settings-section">
      <div class="settings-label">Plugin settings</div>
      ${settingRows || `<div class="plugin-empty">This plugin does not expose any settings yet.</div>`}
    </div>
    <div class="settings-section plugin-detail-about">
      <div class="settings-label">Details</div>
      <div class="about-section">
        <div><span>Version</span><small>${esc(plugin.version || "1.0.0")}</small></div>
        <div><span>Category</span><small>${esc(plugin.category || "Plugin")}</small></div>
        <div><span>Author</span><small>${esc(plugin.author || "NeoTodo")}</small></div>
        <div><span>Entry</span><small>${esc(plugin.entry || "")}</small></div>
      </div>
    </div>
    ${pluginUninstallConfirmMarkup(pending)}
    <div class="plugin-danger-zone">
      <button class="btn small danger" type="button" data-action="uninstall-plugin" data-plugin-id="${esc(plugin.id)}">Uninstall plugin</button>
    </div>`;
}

function renderSettings() {
  const panel = $(".settings-panel");
  if (!panel) return;
  const previousScroll = $(".settings-scroll")?.scrollTop || 0;
  const view = settingsTab === "typography" ? typographySettings()
    : settingsTab === "pictures" ? picturesSettings()
    : settingsTab === "plugins" ? (pluginDetailId ? pluginDetailSettings(pluginDetailId) : pluginsSettings())
    : settingsTab === "sound" ? soundSettings()
    : settingsTab === "about" ? aboutSettings()
    : appearanceSettings();
  panel.innerHTML = `<aside class="settings-nav">
      <div class="settings-brand"><svg class="gear-icon" aria-hidden="true"><use href="#gear"></use></svg><span>Settings</span></div>
      <button class="settings-nav-item ${settingsTab === "appearance" ? "active" : ""}" data-settings-tab="appearance">Appearance</button>
      <button class="settings-nav-item ${settingsTab === "typography" ? "active" : ""}" data-settings-tab="typography">Typography</button>
      <button class="settings-nav-item ${settingsTab === "pictures" ? "active" : ""}" data-settings-tab="pictures">Pictures</button>
      <button class="settings-nav-item ${settingsTab === "plugins" ? "active" : ""}" data-settings-tab="plugins">Plugins</button>
      <button class="settings-nav-item ${settingsTab === "sound" ? "active" : ""}" data-settings-tab="sound">Sound</button>
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
        // Always spin clockwise. Rapid clicks must never play the old reverse
        // animation; restart the same forward spin instead.
        row.classList.remove("turned");
        rotor.classList.remove("spinning", "spinning-back");
        void rotor.getBoundingClientRect();
        rotor.classList.add("spinning");
        setTimeout(() => rotor.classList.remove("spinning"), 700);
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
    const wallpaperModeNode = event.target.closest("[data-wallpaper-mode]");
    if (wallpaperModeNode) {
      event.preventDefault();
      const mode = wallpaperModeNode.dataset.wallpaperMode === "dynamic" ? "dynamic" : "static";
      // Static always has the postcard art fallback; dynamic starts with an
      // empty film slot and the picker visible until a film is chosen.
      if (mode === "static" && !settings.wallpaper_static) {
        settings.wallpaper_static = `art:${currentPostcardId()}`;
      }
      settings.wallpaper_mode = mode;
      saveSettings();
      applySettings();
      renderSettings();
      return;
    }
    const wallpaperArtNode = event.target.closest("[data-wallpaper-art]");
    if (wallpaperArtNode) {
      event.preventDefault();
      const artId = wallpaperArtNode.dataset.wallpaperArt || "";
      if (!THEMES[artId]) return;
      settings.wallpaper_static = `art:${artId}`;
      settings.wallpaper_mode = "static";
      saveSettings();
      applySettings();
      renderSettings();
      return;
    }
    const wallpaperFileNode = event.target.closest("[data-wallpaper-file]");
    if (wallpaperFileNode) {
      event.preventDefault();
      const name = wallpaperFileNode.dataset.wallpaperFile || "";
      if (!name) return;
      if (wallpaperFileNode.dataset.wallpaperKind === "video") {
        settings.wallpaper_dynamic = name;
        settings.wallpaper_mode = "dynamic";
      } else {
        settings.wallpaper_static = name;
        settings.wallpaper_mode = "static";
      }
      saveSettings();
      applySettings();
      renderSettings();
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
    const settingsTabNode = event.target.closest("[data-settings-tab]");
    if (settingsTabNode) {
      event.preventDefault();
      settingsTab = settingsTabNode.dataset.settingsTab;
      pluginDetailId = null;
      pluginPendingUninstallId = null;
      renderSettings();
      if (settingsTab === "pictures") loadWallpaperFiles();
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
        playTetrisKeySound();
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
    if (event.target.id === "wallpaper-image-input") {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      toast("Adding static wallpaper…");
      prepareWallpaperImage(file).then((data) => {
        if (!data) { toast("Could not read that picture", true); return; }
        silentAction("upload_wallpaper", {
          name: `${String(file.name || "wallpaper").replace(/\.[^.]+$/, "")}.jpg`,
          kind: "image",
          data: String(data).split(",")[1] || "",
        }).then((result) => {
          if (!result?.ok || !result.file) {
            toast(result?.error || "Could not add that picture", true);
            return;
          }
          settings.wallpaper_static = result.file;
          settings.wallpaper_mode = "static";
          saveSettings();
          applySettings();
          loadWallpaperFiles().then(() => renderSettings());
          toast("Static wallpaper ready");
        });
      });
      return;
    }
    if (event.target.id === "wallpaper-video-input") {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      if (file.size > 120_000_000) {
        toast("That video is too large (120 MB max)", true);
        return;
      }
      toast("Adding dynamic wallpaper…");
      const reader = new FileReader();
      reader.onload = () => {
        const data = String(reader.result || "").split(",")[1] || "";
        if (!data) { toast("Could not read that video", true); return; }
        silentAction("upload_wallpaper", {
          name: file.name,
          kind: "video",
          data,
        }).then((result) => {
          if (!result?.ok || !result.file) {
            toast(result?.error || "Could not add that video", true);
            return;
          }
          settings.wallpaper_dynamic = result.file;
          settings.wallpaper_mode = "dynamic";
          saveSettings();
          applySettings();
          loadWallpaperFiles().then(() => renderSettings());
          toast("Dynamic wallpaper ready");
        });
      };
      reader.onerror = () => toast("Could not read that video", true);
      reader.readAsDataURL(file);
      return;
    }
    if (event.target.matches("[data-sticker-input]")) {
      const id = event.target.dataset.stickerInput;
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      const previous = stickerSettingsFor(id);
      compressStickerImage(file).then((data) => {
        if (!data) { toast("Could not read that picture", true); return; }
        settings.sticker_backgrounds[id] = {
          image: data,
          zoom: previous?.zoom ?? 1,
          x: previous?.x ?? 50,
          y: previous?.y ?? 50,
        };
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
    if (event.target.id !== "note-image-input") return;
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length) addNotePictures(files);
  });

  document.addEventListener("contextmenu", (event) => {
    if (detachedMode) {
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
    const panel = event.target.closest("#notes-half, #agent-terminal");
    if (panel && !detachedMode) {
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
    // input both open Fork / Copy / Cut / Paste instead of the generic editor
    // clipboard menu.
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
      }, 30);
    }
  };

  document.addEventListener("pointermove", (event) => {
    doingPeekPoint = { x: event.clientX, y: event.clientY };
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
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  }, { passive: false });

  document.addEventListener("input", (event) => {
    if (event.target.matches("[data-sticker-field]")) {
      const id = event.target.dataset.stickerId;
      const field = event.target.dataset.stickerField;
      const config = settings.sticker_backgrounds?.[id];
      if (!config) return;
      const value = Number(event.target.value) || 0;
      if (field === "zoom") config.zoom = Math.min(2.6, Math.max(1, value / 100));
      else if (field === "x" || field === "y") config[field] = Math.min(100, Math.max(0, value));
      saveSettings();
      applyStickerBackgrounds();
      const card = event.target.closest(".sticker-setting-card");
      const preview = card?.querySelector(".sticker-setting-preview img");
      if (preview) {
        preview.style.objectPosition = `${config.x}% ${config.y}%`;
        preview.style.transform = `scale(${config.zoom})`;
      }
      const valueNode = event.target.closest(".sticker-crop-row")?.querySelector("[data-sticker-value]");
      if (valueNode) {
        valueNode.textContent = `${Math.round(field === "zoom" ? config.zoom * 100 : config[field])}%`;
      }
      return;
    }
    if (event.target.matches("[data-settings-volume]")) {
      const value = Number(event.target.value) || 0;
      AudioFX.setVolume(value / 100);
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
      if (settingsTab === "appearance") renderSettings();
    }
    if (agentModelMenuOpen || agentModeMenuOpen) {
      agentModelMenuOpen = false;
      agentModeMenuOpen = false;
      renderAgentTerminal();
    }
  });

  let deskStripHovered = false;
  document.addEventListener("pointermove", (event) => {
    const latched = document.body.classList.contains("desk-handle-strip-drag")
      || document.body.classList.contains("desk-handle-strip-latch");
    const stripHovered = event.clientY >= window.innerHeight - 36 || latched;
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
  window.addEventListener("storage", () => refreshAgentFinishViews());

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
      if ($(".picture-gallery-stage")) { $("#modal-root").innerHTML = ""; return; }
      if ($(".image-stage")) { $("#modal-root").innerHTML = ""; return; }
      if (contextMenuOpen) { closeContextMenu(); return; }
      if (postcard) { closePostcard(); return; }
      if (completedOpen) { closeCompletedLog(); return; }
      if ($("#modal-root").innerHTML) { cancelModal(null); return; }
      if (archiveOpen) { closeArchive(); return; }
      if (completedSubtasksOpen && $(".completed-subtask-toggle")) { toggleCompletedSubtasks(false); return; }
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
    if (event.clientX <= 24) document.body.classList.add("tools-open");
    else if (event.clientX > 90) document.body.classList.remove("tools-open");
  });

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.data?.type === "neotodo-plugin-close") closePluginPanel();
    if (event.data?.type === "neotodo-forktree-open") {
      openForkTreeTarget(event.data.target || {});
      return;
    }
    if (event.data?.type === "neotodo-plugin-settings-changed" && event.data.plugin) {
      const state = pluginState(String(event.data.plugin));
      const values = event.data.settings;
      if (!state || !values || typeof values !== "object") return;
      let changed = false;
      for (const [key, value] of Object.entries(values)) {
        if (typeof value !== "boolean" || state.settings[key] === value) continue;
        state.settings[key] = value;
        changed = true;
      }
      if (changed) saveSettings();
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
    if (forkRootId) {
      // The fork index shows a slice of the full category order; splice the
      // visible rows back into the hidden positions before saving.
      const visible = new Set(ids);
      let cursor = 0;
      ids = state.data.categories.map((category) => (
        visible.has(category.id) ? ids[cursor++] : category.id
      ));
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
  // Mark the AI sheet as open before the first render so hiding the note during
  // startup does not flatten a remembered vertical note/AI split.
  if (restoreView?.aiOpen) agentTerminalOpen = true;
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
  if (detachedMode !== "note" && !notesHidden) hideNotesPanel(true);
  positionNotesHandle();
  updateNotesHandle();
  if (!detachedMode && !forkWindow) {
    if (restoreView) restoreWorkspaceView(restoreView);
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
  document.body.classList.add("app-ready");
  window.__APP_READY_MS__ = performance.now();
  document.documentElement.classList.remove("booting");
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
      if (!forkWindow) maybeAutoPostcard();
    }
  }
}

init().catch((error) => {
  document.body.innerHTML = `<div style="padding:40px;color:#b65c50;font-family:monospace;font-size:12px;line-height:1.7;white-space:pre-wrap">NeoTodo could not start:\n${esc(error.message)}</div>`;
});
