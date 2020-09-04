const Koa = require('koa');
const Router = require('koa-router');

const { users: { find} } = require('./db/')

const app = new Koa();
const router = new Router({prefix: '/api/v1'});

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;
// eslint-disable-next-line no-undef
const HOST = process.env.HOST || 'localhost';

router.get('/users', async (ctx) => {
  const masking = ctx.request.query.masking || '';
  
  if(masking) {
    const users = await find();
    
    ctx.body = users
  }
  else 
    ctx.body = 'hello world';
});


app
.use(router.routes())
.use(router.allowedMethods());

app.listen(PORT, HOST, () => {
  console.log(`--> 🚀 /  Server running at http://${HOST}:${PORT}/api/v1/users`)
});
