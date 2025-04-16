import * as webVitals from 'web-vitals'

const reportWebVitals = (onPerfEntry?: (metric: unknown) => void) => {
	if (onPerfEntry && typeof onPerfEntry === 'function') {
		webVitals.onCLS(onPerfEntry)
		webVitals.onFID(onPerfEntry)
		webVitals.onFCP(onPerfEntry)
		webVitals.onLCP(onPerfEntry)
		webVitals.onTTFB(onPerfEntry)
	}
}

export default reportWebVitals
