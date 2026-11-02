# Sito Gabriel Jones — Jekyll + Netlify + Decap CMS

## In locale
    bundle install
    bundle exec jekyll serve
    # in un altro terminale, per il CMS locale:
    npx decap-server
Sito su http://localhost:4000 e pannello su http://localhost:4000/admin/

## Pubblicare su Netlify
1. Carica la cartella su un repository GitHub (branch `main`).
2. Su Netlify: *Add new site → Import from Git*. Il build è già in `netlify.toml`.
3. Site configuration → **Identity** → Enable. Poi **Registration: Invite only** e, in *Services*, **Enable Git Gateway**.
4. Identity → *Invite users* e invita la tua email. Accedi da `/admin/` (c’è anche il link "Accedi" nel footer).

## Cosa si modifica dal CMS
Blog, News, Portfolio, Home, Playbook, Documenti, Menu e footer.
Il PDF del curriculum va caricato dal CMS (Documenti) oppure in `assets/uploads/`.

## Da personalizzare
- `_config.yml`: `url`, `tagline`, `vat` (Partita IVA / Codice Fiscale)
- `_data/playbook.yml`: link reale del bottone "Vai al sito Playbook"
- Pagine legali (`privacy.md`, `cookie.md`, `termini.md`, `note-legali.md`) con testi veri
- Se Netlify non trova la versione di Ruby, cambia `RUBY_VERSION` in `netlify.toml`

## Animazioni incluse
Timbro del nome all’apertura, onde che scorrono, scacchiera in movimento, contatori, frase che si accende parola per parola, carosello con barra, menu a tutto schermo, ricerca, aree che si allargano al passaggio. Tutto si ferma con `prefers-reduced-motion`.
