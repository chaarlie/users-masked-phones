const Koa = require('koa');
const Router = require('koa-router');
const NodeCache = require( "node-cache" );

const { users: {find} } = require('./db/');

const app = new Koa();
const router = new Router({prefix: '/api/v1'});
const caching =  new NodeCache( { stdTTL: 60 * 60 * 24, checkperiod: 60 * 60 * 24} );

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;
// eslint-disable-next-line no-undef
const HOST = process.env.HOST || 'localhost';

router.get('/users', async (ctx) => {
  const masking = ctx.request.query.masking || '';
  let users = null;

  if(masking) {
    users = caching.get('users-masked');
    if(!users) {
      users =  await find('', { stream: true, masked: true });
      caching.set('users-masked', users);
    }
  }
  else {
    users = caching.get('users');
    if(!users) {
      users = await find('', {stream: true});
      caching.set('users', users);
    }
  }
  
  ctx.body = users;
});


app
.use(router.routes())
.use(router.allowedMethods());

app.listen(PORT, HOST, () => {
  console.log(`--> 🚀 /  Server running at http://${HOST}:${PORT}/api/v1/users`)
});
