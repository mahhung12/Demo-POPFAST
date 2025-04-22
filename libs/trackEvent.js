export async function trackEvent(eventType, metadata) {
  try {
    // await fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     url: window.location.href,
    //     eventType,
    //     metadata,
    //   }),
    // })

    console.log('eventType', eventType)
    console.log('metadata', metadata)
  } catch (err) {
    console.warn('Failed to send analytics event', err)
  }
}
