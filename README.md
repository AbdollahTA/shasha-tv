# شاشتي for VIDAA

A home screen for the Hisense VIDAA TV, installed as a VIDAA app through Vidaa-Edge. Plain HTML, CSS and JS, no build
step, sized for the TV's 1280×720 browser. Same look as the Android شاشتي on the Generaltek (`../shasha`).

- Clock, Gregorian and Hijri date, weather, prayer times with the next one highlighted, next Real Madrid match.
- App tiles open the VIDAA web apps (Thmanyah, YouTube, TOD, STARZPLAY) in the same window.
- Standby after 10 minutes idle, or the red key. Any key wakes it.

Data: Aladhan (method 16, Dubai), Open-Meteo, TheSportsDB public key. No accounts, no keys. Settings sit in `CONFIG` and
`APPS` at the top of `app.js`.

Remote: arrows move (right-to-left), OK opens, red shows standby, BACK returns to the app row.

## Photos (Wikimedia Commons, resized to 1280×720, credited on screen)
| Time | Photo | Author, licence |
|---|---|---|
| dawn | Lake Sylvester during the sunrise | Michal Klajban, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| morning | Ridge of Cypress Trees | Eric Kilby, [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) |
| day | Haltern am See, Westruper Heide 7965-9 | Dietmar Rabich, CC BY-SA 4.0 |
| golden | Crete Senesi Sunset View | Eric Kilby, CC BY-SA 2.0 |
| sunset | Cypress tree alley at sunset in Asciano | Eric Kilby, CC BY-SA 2.0 |
| dusk | Haltern am See, Westruper Heide 7985-9 | Dietmar Rabich, CC BY-SA 4.0 |
| night | Perseid, Milky Way, Luhasoo bog | Martin Mark, CC BY-SA 4.0 |

Fonts: Playfair Display, Amiri, IBM Plex Sans Arabic, SIL Open Font License 1.1 (`fonts/OFL.txt`).
