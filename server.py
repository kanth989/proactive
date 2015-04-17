from flask import Flask


from flask import render_template , url_for

app = Flask(__name__) 

@app.route('/hey')
def hi():
	print "hell0"
	return render_template('index.html')

if __name__ == "__main__":
	app.run(host='0.0.0.0',port=80)