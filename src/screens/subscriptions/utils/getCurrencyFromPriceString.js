export default (priceString) => (typeof priceString === 'string' ? priceString.replace(/[0-9,.]/g, '').trim() : null);
