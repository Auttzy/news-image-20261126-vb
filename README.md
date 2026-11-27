[![make.fun · news-image-20261126](https://make.fun/badge/news-image-20261126.svg)](https://make.fun/bounty/news-image-20261126?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)
[![rank](https://make.fun/badge/news-image-20261126/Auttzy/news-image-20261126-vb/rank.svg)](https://make.fun/bounty/news-image-20261126/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)
[![reward](https://make.fun/badge/news-image-20261126/Auttzy/news-image-20261126-vb/reward.svg)](https://make.fun/bounty/news-image-20261126?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)

# The Thursday Ledger — 26 November 2026 (Version B)

**Bounty:** [Sum up 26 November's world news in one image](https://make.fun/bounty/news-image-20261126)

One 1024×1024 broadsheet, **36 stories across 7 regions**, every one dated
Thursday 26 November 2026, press time 23:00 UTC. A rebuild of the live
Version A, re-led around the day's most visual and most consequential
stories and rebuilt from a study of the live top 3.

## The leads

1. **Storm grounds Macy's 100th parade on Thanksgiving** — a nor'easter
   brings 60 mph gusts to New York, 800,000+ lose power, and the 100th
   Macy's parade moves to Saturday.
2. **EU summit ends early — no budget deal** — leaders break off after one
   evening with no deal on the €2T 2028–34 budget; Ukraine's ~$49bn 2027
   loan hangs on the fight.
3. **Kim vows wider tactical nuclear deployment** — Kim orders tactical
   weapons deployed "across multiple domains", KCNA reports after his plant
   tour.

## What's inside

- 3 large cards with drawn scenes, confidence badges and WHY IT MATTERS lines
- 12 medium cards with drawn scenes, incl. the Asia rebound (KOSPI +0.29%),
  Bank of Korea hike to 3.25%, Chess Game 3 draw (1.5–1.5), Hong Kong
  remembering the 168, Spain votes Sunday, Omokore's $823m fraud verdict,
  Sudan rejecting Ethiopia talks, Ebola free care in 14 DRC zones, Brazil
  inflation cooling to +0.22%, Blyth defecting to One Nation, Guinea-Bissau
  delaying its vote to 2028, and the Bears beating the Lions 39–35
- 21 more stories in ALSO TODAY (16–36), a dotted world map with pins 1–15,
  a THE DAY IN UTC strip, a numbers strip, and a DATE CHECK footer listing
  the 25/24/23/22/20 November stories deliberately left out

## How it runs

`main.ts` (Node 22, standard library only) validates `entry.png` — PNG
signature, IHDR size, every chunk's CRC, and the exact IEND trailer — then
copies it byte for byte to `/output/entry.png`. No network, deterministic:
every run writes the same bytes.

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Sources

Reuters, AP, AFP, BBC, Al Jazeera, Euronews, Yonhap, KCNA, IBGE, FIDE.
Every story happened, or was first reported, on Thursday 26 November 2026.
Drawings are original, made for this page.
