"""Integration checks using an already installed agent-browser and local/remote site."""
import os
import subprocess
import sys

env = dict(os.environ, AGENT_BROWSER_SESSION='hcl-library-regression')
def browser(*args):
    result = subprocess.run(['agent-browser', *args], env=env, capture_output=True, text=True)
    if result.returncode:
        raise AssertionError(result.stdout + result.stderr)
    return result.stdout

url = sys.argv[1]
try:
    browser('open', url)
    browser('wait', '#catalog-search')
    for query in ['Машинное обучение', 'РОБОТОТЕХНИКА', '  machine   systems  ', 'Редди', '']:
        browser('fill', '#catalog-search', query)
        browser('eval', "if(document.querySelector('[data-book]').hidden) throw Error('Expected matching book'); true")
        print('PASS matching query:', repr(query))
    browser('fill', '#catalog-search', 'медицина-нет-такой-книги')
    browser('eval', "if(!document.querySelector('[data-book]').hidden || document.querySelector('#catalog-empty').hidden) throw Error('Expected empty result'); true")
    browser('click', '#clear-search')
    browser('eval', "if(document.querySelector('[data-book]').hidden || document.querySelector('#catalog-search').value) throw Error('Expected catalog reset'); true")
    print('PASS empty result and reset')
finally:
    browser('close')
