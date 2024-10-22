# extra-info

> Extra-Info compontent

- [JIRA](https://jira.migros.net/browse/MIDUWEB-1544)
- [Example](../../pages/ExtraInfo.html)

## Usage

### Change Background-Color

- Add inline style to div with class `wrap`:

```html
<ks-m-extra-info>
    <div class="wrap" style="background-color: purple;"></div>
</ks-m-extra-info>
```

## Placeholders

If API delivers extra infos via WithFacet, following placeholder can be placed inside the component and will be then replaced after call.

{{PRICE_LABEL}}  
{{PRICE_TEXT}}  
{{LESSONS_LABEL}}  
{{LESSONS_TEXT}}  
{{DURATION_LABEL}}  
{{DURATION_TEXT}}  

**Example**:

```html
<ks-m-extra-info>
	<div class="wrap" style="background-color: #0053a6;">
			<div class="section">
				<span class="title">{{PRICE_LABEL}}</span>
				<p>{{PRICE_TEXT}}</p>
			</div>
			<div class="section">
				<span class="title">{{LESSONS_LABEL}}</span>
				<p>{{LESSONS_TEXT}}</p>
			</div>
			<div class="section">
				<span class="title">{{DURATION_LABEL}}</span>
				<p>{{DURATION_TEXT}}</p>
			</div>
			<div class="section">
				<span class="title">Unterrichtsform</span>
				<p>Präsenzveranstaltung<br>20% Präsenzunterricht<br>50% Online Unterricht<br>20% Selbststudium<br></p>
			</div>
			<div class="section">
				<span class="title">Abschluss</span>
				<p>Änderung auf D Stufe</p>
			</div>
	</div>
</ks-m-extra-info>
```