<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Devis {{ $devis->numero_devis }}</title>
<style>
  body { font-family: 'DejaVu Sans', sans-serif; font-size: 12px; color: #333; }
  .header { text-align: center; margin-bottom: 30px; }
  .header h1 { color: #1e293b; font-size: 22px; margin: 0 0 5px 0; }
  .header .company { color: #64748b; font-size: 11px; }
  .info-table { width: 100%; margin-bottom: 25px; }
  .info-table td { vertical-align: top; padding: 5px; }
  .info-table .label { font-weight: 600; color: #64748b; font-size: 10px; text-transform: uppercase; }
  .info-table .value { color: #1e293b; }
  table.items { width: 100%; border-collapse: collapse; margin: 20px 0; }
  table.items th { background: #f8fafc; text-align: left; padding: 8px 10px; font-size: 10px; text-transform: uppercase; color: #64748b; border-bottom: 2px solid #e2e8f0; }
  table.items td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-size: 11px; }
  table.items .total-row td { font-weight: 700; border-top: 2px solid #e2e8f0; }
  .totals { text-align: right; margin-top: 20px; }
  .totals .line { margin: 5px 0; }
  .totals .grand-total { font-size: 16px; font-weight: 700; color: #059669; }
  .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
</style>
</head>
<body>
<div class="header">
  <h1>{{ $params->nom_entreprise ?? 'Devis' }}</h1>
  @if($params->adresse)<div class="company">{{ $params->adresse }}{{ $params->ville ? ', ' . $params->ville : '' }}</div>@endif
  @if($params->siret)<div class="company">SIRET: {{ $params->siret }}</div>@endif
  <h2 style="margin-top:20px;color:#f59e0b;">DEVIS</h2>
</div>

<table class="info-table">
  <tr>
    <td style="width:50%">
      <div class="label">Client</div>
      <div class="value">{{ $devis->client->nom }}</div>
      @if($devis->client->adresse)<div>{{ $devis->client->adresse }}</div>@endif
      @if($devis->client->ville)<div>{{ $devis->client->ville }} {{ $devis->client->code_postal }}</div>@endif
      @if($devis->client->email)<div>{{ $devis->client->email }}</div>@endif
    </td>
    <td style="width:50%;text-align:right">
      <div class="label">Numéro</div>
      <div class="value">{{ $devis->numero_devis }}</div>
      <div class="label" style="margin-top:8px;">Date</div>
      <div class="value">{{ $devis->date_devis }}</div>
      <div class="label" style="margin-top:8px;">Validité</div>
      <div class="value">{{ $devis->date_validite }}</div>
    </td>
  </tr>
</table>

<table class="items">
  <thead><tr><th>Description</th><th style="text-align:center;">Qté</th><th style="text-align:right;">Prix unitaire HT</th><th style="text-align:right;">Montant HT</th></tr></thead>
  <tbody>
    @foreach($devis->lignes as $ligne)
    <tr>
      <td>{{ $ligne->description }}</td>
      <td style="text-align:center;">{{ $ligne->quantite }}</td>
      <td style="text-align:right;">{{ number_format($ligne->prix_unitaire_ht, 2, ',', ' ') }} DH</td>
      <td style="text-align:right;">{{ number_format($ligne->montant_ht, 2, ',', ' ') }} DH</td>
    </tr>
    @endforeach
  </tbody>
</table>

<div class="totals">
  <div class="line">Total HT: <strong>{{ number_format($devis->montant_ht, 2, ',', ' ') }} DH</strong></div>
  <div class="line">TVA (20%): <strong>{{ number_format($devis->montant_tva, 2, ',', ' ') }} DH</strong></div>
  <div class="line grand-total">Total TTC: {{ number_format($devis->montant_ttc, 2, ',', ' ') }} DH</div>
</div>

<div class="footer">
  {{ $params->nom_entreprise ?? '' }} — {{ $params->email ?? '' }} — {{ $params->telephone ?? '' }}
</div>
</body>
</html>
