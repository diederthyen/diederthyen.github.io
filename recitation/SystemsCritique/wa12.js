const apiKey = 'lx3AhK5NR9jizjmbA9AdhMZJA2sQYHmG'

const cityInput = document.getElementById('cityInput')
const searchBtn = document.getElementById('searchBtn')
const fairBtn = document.getElementById('fairBtn')
const resultsDiv = document.getElementById('results')

function clearResults() {
	resultsDiv.innerHTML = ''
}

function showMessage(text) {
	resultsDiv.innerHTML = '<p>' + text + '</p>'
}

// check if event is happening today
function isToday(dateStr) {
	if (!dateStr) return false
	let today = new Date()
	let eventDate = new Date(dateStr)
	return today.getFullYear() === eventDate.getFullYear() &&
	       today.getMonth() === eventDate.getMonth() &&
	       today.getDate() === eventDate.getDate()
}

function makeCard(event) {
	const card = document.createElement('div')
	card.className = 'card'

	// event image
	if (event.images && event.images.length > 0) {
		const image = document.createElement('img')
		image.className = 'card-image'
		image.src = event.images[0].url
		image.alt = event.name || 'Event image'
		card.appendChild(image)
	}

	const content = document.createElement('div')
	content.className = 'card-content'

	// tags
	const tagsDiv = document.createElement('div')
	tagsDiv.className = 'card-tags'

	let eventDate = event.dates && event.dates.start ? event.dates.start.localDate : null
	if (eventDate && isToday(eventDate)) {
		const todayTag = document.createElement('span')
		todayTag.className = 'tag tag-today'
		todayTag.textContent = 'TODAY'
		tagsDiv.appendChild(todayTag)
	}

	// add cheap tag if under $30
	if (event.priceRanges && event.priceRanges.length > 0) {
		let minPrice = event.priceRanges[0].min
		if (minPrice < 30) {
			const cheapTag = document.createElement('span')
			cheapTag.className = 'tag tag-cheap'
			cheapTag.textContent = 'UNDER $30'
			tagsDiv.appendChild(cheapTag)
		}
	}

	if (tagsDiv.children.length > 0) {
		content.appendChild(tagsDiv)
	}

	// event name
	const title = document.createElement('h2')
	title.textContent = event.name || 'Untitled event'
	content.appendChild(title)

	// date
	if (eventDate) {
		const dateElement = document.createElement('p')
		dateElement.className = 'date'
		dateElement.textContent = 'Date: ' + eventDate
		content.appendChild(dateElement)
	}

	// venue name
	const venueElement = document.createElement('p')
	venueElement.className = 'venue'
	const venues = (event._embedded && event._embedded.venues) ? event._embedded.venues : []
	venueElement.textContent = venues.length ? venues[0].name : 'Venue not available'
	content.appendChild(venueElement)

	// price range
	if (event.priceRanges && event.priceRanges.length > 0) {
		const priceElement = document.createElement('p')
		priceElement.className = 'price'
		let minPrice = event.priceRanges[0].min
		let maxPrice = event.priceRanges[0].max
		priceElement.textContent = '$' + minPrice + ' - $' + maxPrice
		content.appendChild(priceElement)
	} else {
		const priceElement = document.createElement('p')
		priceElement.className = 'price-unknown'
		priceElement.textContent = 'Price not available'
		content.appendChild(priceElement)
	}

	// link to Ticketmaster
	if (event.url) {
		const link = document.createElement('a')
		link.href = event.url
		link.target = '_blank'
		link.textContent = 'See details'
		content.appendChild(link)
	}

	card.appendChild(content)
	return card
}

function fetchEvents(city, callback) { // ChatGPT helped with this function, especially the Xhr fetch.
	const query = encodeURIComponent(city)
	const url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=' + apiKey + '&countryCode=US&city=' + query + '&sort=date,asc'

	const request = new XMLHttpRequest()
	request.open('GET', url, true)
	request.onreadystatechange = function() {
		if (request.readyState !== 4) return
		if (request.status === 200) {
			const data = JSON.parse(request.responseText)
			callback(null, data)
		} else {
			callback(new Error('status ' + request.status))
		}
	}
	request.send()
}

function doSearch() {
	const city = (cityInput.value || '').trim()
	if (!city) {
		alert('enter a city fool')
		cityInput.focus()
		return
	}

	showMessage('searching...')

	fetchEvents(city, function(error, data) {
		if (error) {
			showMessage('error fetching events')
			return
		}

		clearResults()

		if (!data._embedded || !data._embedded.events) {
			showMessage('no events found')
			return
		}

		for (let i = 0; i < data._embedded.events.length; i++) {
			let event = data._embedded.events[i]
			let card = makeCard(event)
			resultsDiv.appendChild(card)
		}
	})
}

function doFairSearch() {
	const city = (cityInput.value || '').trim()
	if (!city) {
		alert('enter a city fool')
		cityInput.focus()
		return
	}

	showMessage('searching for local & affordable shows...')

	fetchEvents(city, function(error, data) {
		if (error) {
			showMessage('error fetching events')
			return
		}

		clearResults()

		if (!data._embedded || !data._embedded.events) {
			showMessage('no events found')
			return
		}

		let events = data._embedded.events

		// filter for events with prices and smaller venues
		let fairEvents = []
		for (let i = 0; i < events.length; i++) {
			let event = events[i]
			let shouldInclude = false

			// check if it has price info
			if (event.priceRanges && event.priceRanges.length > 0) {
				let minPrice = event.priceRanges[0].min
				// only include if min price is under $50
				if (minPrice < 50) {
					shouldInclude = true
				}
			} else {
				// if no price info, include it (might be free or cheap)
				shouldInclude = true
			}

			// check venue size if available
			if (event._embedded && event._embedded.venues && event._embedded.venues.length > 0) {
				let venue = event._embedded.venues[0]
				let venueName = (venue.name || '').toLowerCase()
				// exclude big arena keywords
				if (venueName.indexOf('arena') > -1 || venueName.indexOf('stadium') > -1) {
					// but still include if price is cheap
					if (event.priceRanges && event.priceRanges.length > 0) {
						let minPrice = event.priceRanges[0].min
						if (minPrice >= 50) {
							shouldInclude = false
						}
					}
				}
			}

			if (shouldInclude) {
				fairEvents.push(event)
			}
		}

		for (let i = 0; i < fairEvents.length; i++) {
			let event = fairEvents[i]
			let card = makeCard(event)
			resultsDiv.appendChild(card)
		}
	})
}

searchBtn.addEventListener('click', doSearch)
fairBtn.addEventListener('click', doFairSearch)

cityInput.addEventListener('keydown', function(keyEvent) {
	if (keyEvent.key === 'Enter') {
		keyEvent.preventDefault()
		doSearch()
	}
})