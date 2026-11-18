# Icon themes

Icon themes are the small marks around the notebook, separate from the app
paper and wallpaper. They live in **Settings → Appearance → Icon theme** and
never change the theme palette, note palette or AI palette.

A set is a folder with `theme.json` and its images:

```text
web/icon-themes/pvs/
  theme.json
  icons/
    tissue-chomper.gif
    fan-puffshroom.gif
```

```json
{
  "id": "pvs",
  "name": "PvZ",
  "englishName": "Plants vs Zombies",
  "icons": {
    "tissue": "icons/tissue-chomper.gif",
    "fan": "icons/fan-puffshroom.gif",
    "fanDone": "icons/fan-done-sunshroom.gif",
    "aiRunning": "icons/ai-running.gif",
    "aiDone": "icons/ai-done-tallnut.gif",
    "aiDoneFinal": "icons/ai-done-final-tallnut.png",
    "achievement": "icons/achievement-cherry.gif",
    "rowBurn": "icons/row-burn.gif",
    "fork": "icons/fork-coffee.gif",
    "finishBurst": "icons/finish-burst.gif"
  }
}
```

Supported slots:

| Slot | Where it appears |
| --- | --- |
| `tissue` | Napkin beside the todo page title |
| `fan` | Fan on live subtasks and the Doing card |
| `fanDone` | Fan in front of finished subtasks |
| `aiRunning` | AI badge while a subtask agent is running |
| `aiDone` | AI badge after that agent has run |
| `aiDoneFinal` | Settled frame shown once the `aiDone` animation has played (optional) |
| `achievement` | Achievement #1 (the built-in headphones, red mark) |
| `achievementGold` | Gold headphone on an expanded finished task (optional) |
| `checkDone` | Red check on a finished subtask (optional) |
| `rowBurn` | Full-row effect while a subtask is deleted from its context menu (optional) |
| `fork` | Fork flame in the context menu and on forked boards (optional) |
| `finishBurst` | Picture that fills the middle of the window when a whole todo is completed (optional) |

A missing slot keeps the Classical mark. `classical` is the built-in set and
uses NeoTodo's original inline icons. Bundled sets are read-only; the reader's
own folders can be added under `<data>/icon-themes/<id>/` (the Folder button in
Settings opens that shelf).
