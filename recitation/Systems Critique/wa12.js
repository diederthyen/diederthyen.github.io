const apiKey = 'lx3AhK5NR9jizjmbA9AdhMZJA2sQYHmG'

const cityInput = document.getElementById('cityInput')
const searchBtn = document.getElementById('searchBtn')
const resultsEl = document.getElementById('results')

function clearResults() {
	resultsEl.innerHTML = ''
}

function showMessage(text) {
	clearResults()
	const p = document.createElement('p')
	p.className = 'msg'
	p.textContent = text
	resultsEl.appendChild(p)
}

function makeCard(event) {
	const card = document.createElement('div')
	card.className = 'card'

	// event name
	const title = document.createElement('h2')
	title.textContent = event.name || 'Untitled event'
	card.appendChild(title)

	// venue name
	const venueP = document.createElement('p')
	venueP.className = 'venue'
	const venues = (event._embedded && event._embedded.venues) ? event._embedded.venues : []
	venueP.textContent = venues.length ? venues[0].name : 'Venue not available'
	card.appendChild(venueP)

	// link to Ticketmaster
	if (event.url) {
		const a = document.createElement('a')
		a.href = event.url
		a.target = '_blank'
		a.rel = 'noopener noreferrer'
		a.textContent = 'See details'
		card.appendChild(a)
	}

	return card
}

function fetchEvents(city, cb) { // ChatGPT helped with this function, especially the Xhr fetch.
	const q = encodeURIComponent(city)
	const url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=' + apiKey + '&countryCode=US&city=' + q + '&sort=date,asc'

	const xhr = new XMLHttpRequest()
	xhr.open('GET', url, true)
	xhr.onreadystatechange = function() {
		if (xhr.readyState !== 4) return
		if (xhr.status === 200) {
			try {
				const data = JSON.parse(xhr.responseText)
				cb(null, data)
			} catch (e) {
				cb(e)
			}
		} else {
			cb(new Error('status ' + xhr.status))
		}
	}
	xhr.send()
}

function doSearch() {
	const city = (cityInput.value || '').trim()
	if (!city) {
		alert('enter a city fool')
		cityInput.focus()
		return
	}

	showMessage('searching...')

	fetchEvents(city, function(err, data) {
		if (err) {
			console.error(err)
			showMessage('error fetching events')
			return
		}

		clearResults()

		if (!data._embedded || !data._embedded.events || data._embedded.events.length === 0) {
			showMessage('no events found')
			return
		}

		for (var i = 0; i < data._embedded.events.length; i++) {
			var ev = data._embedded.events[i]
			var card = makeCard(ev)
			resultsEl.appendChild(card)
		}
	})
}

searchBtn.addEventListener('click', doSearch)

cityInput.addEventListener('keydown', function(e) {
	if (e.key === 'Enter') {
		e.preventDefault()
		doSearch()
	}
})
