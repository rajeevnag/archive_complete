from bs4 import BeautifulSoup as soup
from urllib.request import urlopen as urlReq
import re
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.select import Select
import time

def get_times(driver):
    
    '''
    navigationStart: This attribute returns the time spent after the user agent completes unloading the previous 
                    page/document. If there was no document prior to loading the new page, 
                    navigationStart returns the same value as fetchStart.
    responseStart : This attribute returns the time as soon as the user-agent receives the first byte 
                    from the server or from the local sources/application cache.
    domComplete : This attribute returns the time just before the current document/page readiness 
                is set to "complete". document.readyState status as "complete" indicates that the 
                parsing of the page/document is complete & all the resources required for the 
                page are downloaded. We will have a look an example of domComplete in subsequent section.
    '''
    navigation_start = driver.execute_script("return window.performance.timing.navigationStart")
    response_start = driver.execute_script("return window.performance.timing.responseStart")
    dom_complete = driver.execute_script("return window.performance.timing.domComplete")
    frontend_time = dom_complete - response_start
    backend_time = response_start - navigation_start
    return frontend_time, backend_time

# urls = ['stackoverflow.com','umich.edu','paypal.com','npr.org'] #uncomment this for easy demo of everything working
urls = []
filepath = './txtfiles/'
filename = 'IAandArquivoSites.txt' #couldn't find comprehensive list of sites on webcite
fullpath = filepath + filename

with open(fullpath,'r') as f:
    lines = f.readlines()
    for line in lines:
        line = line[7:len(line)-1]
        urls.append(line)


for site in urls:
    try:
        print(f"curr site: {site}")
        driver = webdriver.Chrome(ChromeDriverManager().install()) #create chrome instance
        
        url = 'http://www.webcitation.org/query?url='
        url += site + '&date=2020'
        print(url)
        
        driver.get(url)

        frontend_loadtime, backend_loadtime = get_times(driver)
        print(f"front end: {frontend_loadtime}, back end: {backend_loadtime}")
        
        driver.switch_to.frame('nav')
        
        time.sleep(2)

        times = Select(driver.find_element_by_xpath('/html/body/table/tbody/tr[2]/td[2]/form/select'))
        

        
        #get load times of next timestamp
        times.select_by_index(1)

        time.sleep(2)

        frontend_loadtime, backend_loadtime = get_times(driver)
        print(f"front end: {frontend_loadtime}, back end: {backend_loadtime}")
        
        
        time.sleep(5)
        driver.close()
        
    except Exception as e:
        print(e)
        driver.close()

driver.close()