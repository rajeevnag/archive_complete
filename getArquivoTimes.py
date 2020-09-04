import requests
import json
import sys

url = sys.argv[1]
res = requests.get(url)

res = res.text

res = json.loads(res)
res = res['response_items']
urls = []

for item in res:
    urls.append(item['linkToArchive'])

with open('./tmp/arquivoTimes.txt','w+') as f:
    # for item in urls:
    #     f.write("%s\n" % item)
    f.write("\n".join(str(item) for item in urls))
    f.close()



