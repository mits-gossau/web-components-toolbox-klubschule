# OpeningHours

> OpeningHours component to display opening hours of locations

- [JIRA](https://jira.migros.net/browse/MIDUWEB-551)

## Usage

- [Examples](../../pages/OpeningHours.html)
- `data=[ ... ]`: JSON data array for all days `[{"label": "monday", "open": true, "hours": [["8:00", "12:00"], ["13:00", "18:00"]]} ... ]`
- `closed-label="geschlossen"`: provide a (localized) label for days where property `open` is `false`.


```
<ks-m-opening-hours
    data='[
        {"label":"Montag","open":true,"hours":[["8:00","18:00"]]},
        {"label":"Dienstag","open":true,"hours":[["8:00","12:00"],["13:30","18:00"]]},
        {"label":"Mittwoch","open":true,"hours":[["8:00","18:00"]]},
        {"label":"Donnerstag","open":true,"hours":[["8:00","18:00"]]},
        {"label":"Freitag","open":true,"hours":[["8:00","12:00"],["13:30","18:00"]]},
        {"label":"Samstag","open":false,"hours":[["8:00","12:00"],["13:30","18:00"]]},
        {"label":"Sonntag","open":false,"hours":[]}
    ]'
    closed-label="geschlossen"
>
</ks-m-opening-hours>
```