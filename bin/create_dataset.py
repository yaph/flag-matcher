#!/usr/bin/env python
from pathlib import Path
import json
import urllib.request


url = 'https://raw.githubusercontent.com/lipis/flag-icons/refs/heads/main/country.json'

with urllib.request.urlopen(url) as response:
    source_data = json.load(response)

countries = [{'code': c['code'], 'name': c['name']}
     for c in source_data if c.get('iso') is True and c.get('continent')]

Path('data/countries.json').write_text(json.dumps(countries))