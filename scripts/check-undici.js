try {
  const undici = require('undici');
  console.log('undici available', typeof undici.Agent);
} catch (e) {
  console.log('undici not directly available via require');
}
