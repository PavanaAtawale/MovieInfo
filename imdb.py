import requests


def search_movie(search_keyword):
	url = "https://imdb188.p.rapidapi.com/api/v1/searchIMDB"

	querystring = {"query":search_keyword}

	headers = {
		"x-rapidapi-key": "8679570c5emsh871f0fd3d68e512p131979jsnf9f75a04d014",
		"x-rapidapi-host": "imdb188.p.rapidapi.com"
	}

	response = requests.get(url, headers=headers, params=querystring)

	result = response.json()
        
	return result

def display_results(data):
	s = "Movie Title: " + data["title"]
	s += "\nRelease Year: " + str(data["year"])
	s += "\nCast: " + data["stars"]
	return s
	

try:

	search_string = input("Enter the movie name to search: ")


	print ("Finding the best match for " + search_string + "...  \n")

	result = search_movie(search_string)

	print(display_results(result["data"][0]))

except Exception as e:
	print("Error") 	
	print(e)