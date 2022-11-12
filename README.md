# Check Homepage Load Time

## Some notes
- By default the app only takes into account the main HTML file for the webpage.
- Enabling "Include Assets" also adds all the images, css and js files for that webpage. 
- To sort by time or by size, you can click on the respective header.


### Requirements
- python 3
- virtualenv (optional)
```
sudo apt install python3 virtualenv
```

### Installation
- clone the project

- Create a virutalenv
```
 virtualenv -p python3 venv
```

- Activate the virutalenv
```
source venv/bin/activate
```

- Install the dependencies using
```
pip3 install -r requirements.txt
```

- Start the application
```
python3 app.py
```

#### Visit http://localhost:8000 
