#!/usr/bin/env python
from pathlib import Path
import json
import urllib.request


url = 'https://raw.githubusercontent.com/lipis/flag-icons/refs/heads/main/country.json'

with urllib.request.urlopen(url) as response:
    source_data = json.load(response)

countries = [item for item in source_data if item.get('iso') is True and item.get('continent')]
Path('data/countries.json').write_text(json.dumps(countries))