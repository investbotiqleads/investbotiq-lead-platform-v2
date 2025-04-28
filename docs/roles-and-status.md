# Gebruikersrollen & Status

Elke optie in het aanmeldformulier is een gebruikersrol:
- member
- freelancer
- parent
- student
- affiliated

Deze rollen worden opgeslagen in het veld `role` in de Supabase database (zie tabel `leads_{rol}` of het centrale `users`-table als je die toevoegt).

## Status/Level verhogen

Voeg een kolom `status` of `level` toe aan je gebruikers/leads tabel. Bijvoorbeeld:
- `pending` (nieuw)
- `verified`
- `premium`
- etc.

Admins kunnen deze status verhogen via het dashboard. Je kunt dit eenvoudig aanpassen in Supabase of via een admin UI.

## Supabase RLS voorbeeld
```sql
-- Alleen admins mogen status verhogen
CREATE POLICY "Admins can update status" ON leads_member
  FOR UPDATE
  USING (auth.role() = 'admin');
```

## Gratis Webhook Suggesties
- https://webhook.site
- https://pipedream.com
- https://ifttt.com/maker_webhooks

Gebruik deze om gratis notificaties en integraties te testen.
